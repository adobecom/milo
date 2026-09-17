#!/usr/bin/env python3
"""Fetch Figma version history for a node (paginating further back in time via
the API's next_page cursor) and compute a change magnitude (%) between
consecutive versions by diffing each version's document JSON, plus a short
list of which named elements actually changed.

Note: Figma's /v1/images?version=... render does NOT reliably reflect
historical state for files with heavy component-instance usage (verified:
identical renders across versions with confirmed real edits). The document
JSON at /v1/files/:key/nodes?version=... does differ correctly between
versions, so that's what this script diffs instead of pixel comparison.

Requires FIGMA_TOKEN in the environment (read-only Figma personal access token).

Usage:
  python3 diff_versions.py --file-key <key> --node-id <id> [--since YYYY-MM-DD] [--max-versions N]

Omit --node-id to track the WHOLE file (every page/canvas and everything
under them) instead of one node's subtree — see full_file_document().
Screenshots/highlight-overlays don't apply in that mode (no single node to
render), so --screenshot-dir is ignored if --node-id is omitted.
"""
import argparse
import concurrent.futures
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.figma.com/v1"
FIGMA_TOKEN = os.environ.get("FIGMA_TOKEN")
MAX_CHANGED_ELEMENTS = 500  # safety cap for pathological cases (e.g. library/token syncs)
MAX_RETRIES = 6

# --- Rate limiting -----------------------------------------------------------
# The dominant call in a full-history pull is GET /v1/files/:key/nodes, one per
# version. That endpoint is Figma's most-restricted **Tier 1** tier: on Full/Dev
# seats it allows only 10/min (Starter), 15/min (Professional), or ~20/min
# (Organization/Enterprise) — verified against Figma's published rate-limit
# table. There is no way to raise this per token; it's the account's plan.
#
# The old approach — FETCH_POOL_WORKERS=6 firing 6 requests near-instantly with
# no global pacing — blew straight past that ~20/min ceiling and triggered
# Figma's leaky-bucket 429s en masse. Verified real, silent data loss: a
# 634-version file came back with 384/634 (61%) of versions failing as genuine
# HTTP 429 after exhausting every retry — an actual hole in the history, not the
# benign "node didn't exist yet" case. Per-call retry/backoff alone can't fix
# this: 6 threads share one account-wide bucket and retry in sync, re-tripping
# the limit together (a thundering herd).
#
# The fix is to pace *request starts* globally, across all worker threads, to
# stay under the ceiling — not to tune the worker count. MAX_REQUESTS_PER_MINUTE
# is deliberately set below the ~20/min Org/Enterprise cap to leave the leaky
# bucket headroom; override with --rpm / FIGMA_MAX_RPM only if you know the
# account's real tier. This makes a large-file full-history pull inherently slow
# (634 versions / ~15 per min ≈ 42 min for ONE frame; four frames ≈ a couple of
# hours) — that is the real, unavoidable cost of complete data on this plan, and
# a slow complete pull always beats a fast one with silent gaps.
MAX_REQUESTS_PER_MINUTE = int(os.environ.get("FIGMA_MAX_RPM") or 15)

# Per-version document fetches are independent (only diffing needs sequential
# order), so they run concurrently. With the global RateLimiter below enforcing
# the real ceiling, worker count no longer controls the request rate — it only
# needs to be high enough that one slow request (e.g. a screenshot render) can't
# starve the pacing. Kept small; the limiter, not this number, is the throttle.
FETCH_POOL_WORKERS = 3


class RateLimiter:
    """Thread-safe global pacer. Serializes request *starts* so no more than
    `rpm` fire per rolling minute across every worker thread, and lets any
    thread that sees a 429 push the whole fleet's next slot back (honoring
    Retry-After) instead of each thread backing off independently and then
    retrying in sync — the herd that made the old code re-trip the limit."""

    def __init__(self, rpm):
        self._interval = 60.0 / max(rpm, 1)
        self._lock = threading.Lock()
        self._next_available = 0.0  # monotonic time the next request may start

    def wait(self):
        with self._lock:
            now = time.monotonic()
            start = max(now, self._next_available)
            self._next_available = start + self._interval
        delay = start - time.monotonic()
        if delay > 0:
            time.sleep(delay)

    def penalize(self, seconds):
        """Push every subsequent request's earliest start forward by `seconds`
        (a global backoff shared by all threads), used on a 429 Retry-After."""
        with self._lock:
            target = time.monotonic() + seconds
            if target > self._next_available:
                self._next_available = target


RATE_LIMITER = RateLimiter(MAX_REQUESTS_PER_MINUTE)


# No timeout on urlopen() means a socket read blocks forever if the
# connection dies without a clean TCP close (laptop sleep/wake, wifi/network
# switch mid-request) — confirmed directly: a real run left 48 sockets stuck
# in CLOSE_WAIT after a sleep/wake, each worker thread hung in read() forever,
# no exception ever raised, no retry ever triggered, the whole run dead with
# no way to recover short of killing the process. REQUEST_TIMEOUT bounds that
# so a dead connection surfaces as a retryable error instead of an infinite hang.
REQUEST_TIMEOUT = 30  # seconds
# Figma's /v1/images render endpoint renders a historical version's PNG
# server-side on demand — confirmed directly much slower than a plain
# document-JSON fetch for a large/complex frame (19,350px-tall node: 15 of
# 17 screenshot attempts hit REQUEST_TIMEOUT and silently dropped that
# day's screenshot, even though the day genuinely had a real change). Image
# rendering gets its own, longer budget instead of sharing the JSON-fetch one.
SCREENSHOT_REQUEST_TIMEOUT = 120  # seconds


def api_get(url, timeout=REQUEST_TIMEOUT):
    safe_url = urllib.parse.quote(url, safe=":/?&=")
    req = urllib.request.Request(safe_url, headers={"X-Figma-Token": FIGMA_TOKEN})
    for attempt in range(MAX_RETRIES):
        # Global pacing: block until this request is allowed to start, so the
        # whole worker pool stays under the account's per-minute ceiling. This
        # is the primary defense against 429s; the retry/backoff below is only a
        # safety net for the occasional one that still slips through.
        RATE_LIMITER.wait()
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            # HTTPError wraps a still-open connection (it's itself a
            # file-like response object) — confirmed directly: under concurrent
            # fetching against a rate limiter, retrying without closing it here
            # left 100+ sockets stuck in CLOSE_WAIT within minutes (one leaked
            # per 429), on track to exhaust the process's file descriptors.
            # Close it on every path, retried or not.
            e.close()
            if e.code == 429 and attempt < MAX_RETRIES - 1:
                retry_after = e.headers.get("Retry-After", "")
                try:
                    wait = int(retry_after) or (2 ** attempt)
                except ValueError:
                    # Retry-After can be an HTTP-date instead of seconds; fall back to backoff.
                    wait = 2 ** attempt
                # Back off the WHOLE fleet, not just this thread: a 429 means the
                # shared account bucket is empty, so every other in-flight worker
                # should also hold off. penalize() pushes the global next-start
                # forward; this thread's next RATE_LIMITER.wait() then honors it
                # too. This is what stops the sync-retry herd that re-tripped the
                # limit under the old per-thread-only backoff.
                RATE_LIMITER.penalize(wait)
                continue
            raise
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            # A dead/stalled connection (timeout, reset, DNS blip from a
            # network switch) — same backoff as a 429, distinct message so
            # it's not confused with a rate-limit response when triaging.
            if attempt < MAX_RETRIES - 1:
                time.sleep(2 ** attempt)
                continue
            raise TimeoutError(f"network error after {MAX_RETRIES} attempts: {e}") from e


def fatal_api_error(e, context):
    if e.code in (401, 403):
        reason = "FIGMA_TOKEN is expired or invalid — regenerate it in Figma account settings"
    else:
        reason = str(e)
    print(json.dumps({"error": f"{context}: {reason}", "httpStatus": e.code}))
    sys.exit(1)


def fetch_all_versions(file_key, since=None, max_versions=None):
    """Fetch the file's version list, newest-first. Pulls the FULL history by
    default (no cap). If `since` (YYYY-MM-DD) is given, stops paging as soon as
    it has fetched a version older than that date — the versions API returns
    newest-first, so once we've paged past `since` the window is fully covered
    (that one older version stays in the list as the diff baseline). This makes
    a repeat sync cheap: it only pages back to the design's last recorded
    change, not through the entire multi-thousand-version history every time.
    `max_versions` is an optional hard ceiling (None = unlimited)."""
    versions = []
    url = f"{API}/files/{file_key}/versions"
    while url:
        try:
            data = api_get(url)
        except urllib.error.HTTPError as e:
            fatal_api_error(e, "failed fetching version list")
        except (urllib.error.URLError, ValueError) as e:
            # URLError: network-level failure (DNS, connection refused, timeout).
            # ValueError covers json.JSONDecodeError from a malformed/truncated
            # response body. Neither is an HTTPError, so without this the script
            # would crash with a raw traceback instead of the clean JSON error
            # output every other failure path produces.
            print(json.dumps({"error": f"failed fetching version list: {e}"}))
            sys.exit(1)
        versions.extend(data.get("versions", []))
        if max_versions and len(versions) >= max_versions:
            return versions[:max_versions]
        # newest-first: once the oldest fetched version predates `since`, we've
        # covered everything on/after it — stop paging (keep that older one as
        # the baseline for the first diff).
        if since and versions and versions[-1]["created_at"][:10] < since:
            break
        url = (data.get("pagination") or {}).get("next_page")
    return versions


def node_document(file_key, node_id, version_id):
    data = api_get(f"{API}/files/{file_key}/nodes?ids={node_id}&version={version_id}")
    # Figma returns {"nodes": {node_id: null}} (not a missing key) for a
    # version older than when this node existed — not a malformed response,
    # just "nothing to diff here yet." Recorded as a distinct, expected
    # reason rather than the generic NoneType crash this used to surface as,
    # so a run's `errors` list reads as "history stops here" instead of
    # looking like hundreds of real failures.
    node = data["nodes"].get(node_id)
    if node is None:
        raise ValueError(f"node {node_id} did not exist yet at version {version_id}")
    return node["document"]


def full_file_document(file_key, version_id):
    """Whole-file mode (no --node-id): fetch the entire document tree (every
    page/canvas and everything under them) at a specific version, instead of
    one node's subtree. Same versioning mechanism, different endpoint —
    /v1/files/:key (not /v1/files/:key/nodes) returns {"document": {...}} as
    the tree root. This root is a synthetic DOCUMENT node with no
    absoluteBoundingBox of its own, so screenshot/highlight-overlay features
    (which need a single node's box) don't apply in this mode — see main()."""
    data = api_get(f"{API}/files/{file_key}?version={version_id}")
    return data["document"]


def fetch_document(file_key, node_id, version_id):
    return node_document(file_key, node_id, version_id) if node_id else full_file_document(file_key, version_id)


def nodes_documents(file_key, node_ids, version_id):
    """Batch multi-node mode: fetch the documents for SEVERAL nodes of the same
    file at one version in a SINGLE request (`/nodes?ids=n1,n2,...&version=v`),
    returning `{node_id: document_or_None}`. When an umbrella design is tracked
    as N viewport-variant frames of one file (the common case — see the skill's
    "Add a new pair" splitting logic), this is the big win: the per-version
    `/nodes` call is Tier-1 rate-limited *per request*, not per node, so asking
    for all N frames in one call costs one rate-limit slot instead of N. On a
    ~1200-version file that's the difference between ~1200 and ~1200*N paced
    requests — verified in practice to turn a ~5.5h four-frame pull into ~1.5h,
    with identical data. A node that didn't exist yet at this version comes back
    as `None` here (same meaning as node_document's ValueError), which the
    caller records as the benign "did not exist yet" per-node error."""
    ids = ",".join(node_ids)
    data = api_get(f"{API}/files/{file_key}/nodes?ids={ids}&version={version_id}")
    nodes = data.get("nodes") or {}
    out = {}
    for nid in node_ids:
        node = nodes.get(nid)
        out[nid] = node["document"] if node else None
    return out


class NodeAccum:
    """Per-node running state for a history pull: the previous version's document
    (diff baseline) plus the accumulating results/errors/day-tracking. Batch mode
    keeps one of these per tracked node; single-node/whole-file mode keeps exactly
    one, so both paths share process_transition()/render_day_screenshots() below
    instead of duplicating the diff and screenshot logic (which drifted before)."""

    def __init__(self):
        self.prev_doc = None
        self.results = []
        self.errors = []
        self.day_last_version = {}   # day -> versionId of the last version seen that day
        self.day_root_box = {}       # day -> node's own absoluteBoundingBox at that version
        self.day_has_change = set()  # days with at least one magnitude > 0 transition


def process_transition(acc, doc, v):
    """Diff `doc` (this node's document at version `v`) against acc.prev_doc and
    append one entry to acc.results, updating day tracking. Mirrors the original
    single-node loop body exactly; shared by both modes."""
    try:
        magnitude = None
        changes, changed_count = [], 0
        if acc.prev_doc is not None:
            # A malformed node or pathologically deep tree could raise here
            # (e.g. RecursionError) — that should be one bad version recorded in
            # errors, not a crash of the whole run.
            changes, changed_count, magnitude = changed_elements(acc.prev_doc, doc)
    except Exception as e:
        acc.errors.append({"versionId": v["id"], "date": v["created_at"], "reason": str(e)})
        return

    day = v["created_at"][:10]
    acc.day_last_version[day] = v["id"]
    acc.day_root_box[day] = doc.get("absoluteBoundingBox")
    if magnitude:
        acc.day_has_change.add(day)

    acc.results.append({
        "versionId": v["id"],
        "date": v["created_at"],
        "author": (v.get("user") or {}).get("handle"),
        "label": v.get("label") or "",
        "magnitude": magnitude,
        "changedElements": changes,
        "changedElementCount": changed_count,
    })
    acc.prev_doc = doc  # old prev_doc has no remaining references, eligible for GC


def render_day_screenshots(file_key, node_id, screenshot_dir, acc):
    """Fetch one best-effort end-of-day preview per changed day into
    `screenshot_dir` and return the dayScreenshots dict; screenshot failures are
    appended to acc.errors. Shared by both modes."""
    day_screenshots = {}
    os.makedirs(screenshot_dir, exist_ok=True)
    for day in sorted(acc.day_has_change):
        version_id = acc.day_last_version[day]
        path = os.path.join(screenshot_dir, f"{day}.png")
        scale = scale_for_box(acc.day_root_box[day])
        try:
            if fetch_screenshot(file_key, node_id, version_id, path, scale=scale):
                day_screenshots[day] = {"path": path, "nodeBox": acc.day_root_box[day]}
        except Exception as e:
            acc.errors.append({"versionId": version_id, "date": day, "reason": f"screenshot: {e}"})
    return day_screenshots


def download(url, path, timeout=REQUEST_TIMEOUT):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=timeout) as resp, open(path, "wb") as f:
        f.write(resp.read())


# px, longer edge. Was 700 — confirmed too small for very tall/narrow
# tracked frames (e.g. a 1440x19350 frame scaled to ~52px wide), stretched
# blurry in the UI at any real display width. Raised to keep enough real
# pixel data at the frame's actual proportions; still far below "render at
# 1:1", which produced an 81MB single image on a 36k x 50k px node before
# this cap existed at all.
TARGET_MAX_DIMENSION = 2000


def scale_for_box(box, target=TARGET_MAX_DIMENSION):
    if not box:
        return 0.3
    longest = max(box.get("width", 0) or 0, box.get("height", 0) or 0)
    if not longest:  # zero-size box is truthy but unusable — same fallback as a missing box
        return 0.3
    return min(1.0, target / longest)


def fetch_screenshot(file_key, node_id, version_id, out_path, scale=0.3):
    """Best-effort end-of-day preview image. NOTE: Figma's version-specific
    render is unreliable for instance-heavy files (see module docstring) —
    this may return the same image for different versions. It's shown as a
    supplementary visual aid, not as the source of the magnitude %, and the
    highlight boxes drawn over it come from the (reliable) JSON diff, not
    from comparing this image to another one."""
    data = api_get(
        f"{API}/images/{file_key}?ids={node_id}&version={version_id}&format=png&scale={scale}",
        timeout=SCREENSHOT_REQUEST_TIMEOUT,
    )
    url = (data.get("images") or {}).get(node_id)
    if not url:
        return False
    download(url, out_path, timeout=SCREENSHOT_REQUEST_TIMEOUT)
    return True


def flatten(node, out):
    out[node.get("id")] = node
    for child in node.get("children", None) or []:
        flatten(child, out)
    return out


LAYOUT_KEYS = ("layoutMode", "itemSpacing", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom")


def style_blob(node):
    """Serializes the style fields shared by node_signature() and
    describe_modification() exactly once per node, so a modified node
    (checked by the former, then explained by the latter) doesn't pay for
    json.dumps() on the same fills/strokes/effects twice."""
    return (
        json.dumps(node.get("fills"), sort_keys=True),
        json.dumps(node.get("strokes"), sort_keys=True),
        json.dumps(node.get("effects"), sort_keys=True),
    )


def node_signature(node, style=None):
    """Fields checked to decide if a node counts as 'modified'. Originally only
    covered text/fills/position/size/opacity/visibility — that missed corner
    radius, strokes, effects (shadows/blur), rotation, and auto-layout spacing,
    so a real visible edit to any of those could score as 0% changed. Keep
    this and describe_modification() below in sync when adding a property."""
    fills_json, strokes_json, effects_json = style or style_blob(node)
    box = node.get("absoluteBoundingBox") or {}
    return (
        node.get("characters"),
        fills_json,
        strokes_json,
        node.get("strokeWeight"),
        effects_json,
        node.get("cornerRadius"),
        json.dumps(node.get("rectangleCornerRadii")),
        round(node.get("rotation", 0) or 0, 2),
        tuple(node.get(k) for k in LAYOUT_KEYS),
        round(box.get("x", 0), 1), round(box.get("y", 0), 1),
        round(box.get("width", 0), 1), round(box.get("height", 0), 1),
        node.get("opacity"),
        node.get("visible", True),
    )


def describe_modification(old_n, new_n, old_style=None, new_style=None):
    """Human-readable list of what specifically changed about a node."""
    details = []

    old_fills, old_strokes_json, old_effects = old_style or style_blob(old_n)
    new_fills, new_strokes_json, new_effects = new_style or style_blob(new_n)

    old_text, new_text = old_n.get("characters"), new_n.get("characters")
    if old_text != new_text:
        details.append(f'text: "{old_text}" → "{new_text}"' if old_text or new_text else "text changed")

    if old_fills != new_fills:
        details.append("fill/color changed")

    old_strokes = (old_strokes_json, old_n.get("strokeWeight"))
    new_strokes = (new_strokes_json, new_n.get("strokeWeight"))
    if old_strokes != new_strokes:
        details.append("stroke changed")

    if old_effects != new_effects:
        details.append("effect (shadow/blur) changed")

    old_radius = (old_n.get("cornerRadius"), json.dumps(old_n.get("rectangleCornerRadii")))
    new_radius = (new_n.get("cornerRadius"), json.dumps(new_n.get("rectangleCornerRadii")))
    if old_radius != new_radius:
        details.append("corner radius changed")

    old_rotation = round(old_n.get("rotation", 0) or 0, 2)
    new_rotation = round(new_n.get("rotation", 0) or 0, 2)
    if old_rotation != new_rotation:
        details.append(f"rotation: {old_rotation} → {new_rotation}")

    if tuple(old_n.get(k) for k in LAYOUT_KEYS) != tuple(new_n.get(k) for k in LAYOUT_KEYS):
        details.append("auto-layout spacing/padding changed")

    old_box, new_box = old_n.get("absoluteBoundingBox") or {}, new_n.get("absoluteBoundingBox") or {}
    old_pos = (round(old_box.get("x", 0), 1), round(old_box.get("y", 0), 1))
    new_pos = (round(new_box.get("x", 0), 1), round(new_box.get("y", 0), 1))
    if old_pos != new_pos:
        details.append(f"position moved: {old_pos} → {new_pos}")

    old_size = (round(old_box.get("width", 0), 1), round(old_box.get("height", 0), 1))
    new_size = (round(new_box.get("width", 0), 1), round(new_box.get("height", 0), 1))
    if old_size != new_size:
        details.append(f"size changed: {old_size[0]}×{old_size[1]} → {new_size[0]}×{new_size[1]}")

    if old_n.get("opacity") != new_n.get("opacity"):
        details.append(f"opacity: {old_n.get('opacity')} → {new_n.get('opacity')}")

    if old_n.get("visible", True) != new_n.get("visible", True):
        details.append(f"visibility: {old_n.get('visible', True)} → {new_n.get('visible', True)}")

    return details or ["changed (property not tracked by this diff)"]


def reconcile_recreated(added, removed):
    """A node deleted and recreated with a new Figma ID but the same name+type
    (common after detach-instance or ungroup/regroup) would otherwise show as
    a spurious added+removed pair, inflating the changed count and cluttering
    the summary with a no-op-looking "change". Reconcile matching pairs into
    a single 'recreated' entry instead. Matches on name+type only (not
    position) — deliberately simple; a position-tolerance match would reduce
    false negatives further but adds float-comparison edge cases not worth
    the complexity here."""
    # Both lists are built from `set(old_flat) | set(new_flat)` (changed_elements
    # below), whose iteration order depends on Python's per-process string hash
    # randomization — without sorting here, which of several same-name/type
    # candidates gets paired (when there's more than one) would vary between
    # separate script runs on identical input. Sorting by id makes pairing
    # deterministic; it doesn't make the *match* itself any smarter (still no
    # position-tolerance, per the docstring above), just reproducible.
    removed_by_key = {}
    for r in sorted(removed, key=lambda r: r["id"]):
        removed_by_key.setdefault((r["name"], r.get("type")), []).append(r)

    still_added = []
    recreated = []
    for a in sorted(added, key=lambda a: a["id"]):
        candidates = removed_by_key.get((a["name"], a.get("type")))
        if candidates:
            candidates.pop(0)
            recreated.append({
                "id": a["id"], "name": a["name"], "type": a.get("type"), "changeType": "recreated",
                "details": ["same name/type recreated under a new id (likely detach/ungroup/regroup) — not necessarily a content change"],
                "box": a.get("box"),
            })
        else:
            still_added.append(a)

    still_removed = [r for group in removed_by_key.values() for r in group]
    return still_added, still_removed, recreated


def changed_elements(old_doc, new_doc, limit=MAX_CHANGED_ELEMENTS):
    """Returns (changed element list capped at `limit`, total changed count,
    magnitude % = changed count / size of the node tree). Magnitude is
    element-proportion based, not a raw-JSON text-similarity score — a text
    diff on the serialized JSON doesn't correlate with "how many elements
    changed" (a handful of edits to large/early JSON blocks can score higher
    than many small scattered edits), which was confusing in practice."""
    old_flat = flatten(old_doc, {})
    new_flat = flatten(new_doc, {})
    modified, added, removed = [], [], []
    for nid in set(old_flat) | set(new_flat):
        old_n, new_n = old_flat.get(nid), new_flat.get(nid)
        if old_n is None:
            added.append({
                "id": nid, "name": new_n.get("name"), "type": new_n.get("type"), "changeType": "added",
                "details": [f"type: {new_n.get('type')}"],
                "box": new_n.get("absoluteBoundingBox"),
            })
        elif new_n is None:
            removed.append({
                "id": nid, "name": old_n.get("name"), "type": old_n.get("type"), "changeType": "removed",
                "details": [f"type: {old_n.get('type')}"],
                "box": old_n.get("absoluteBoundingBox"),
            })
        else:
            old_style, new_style = style_blob(old_n), style_blob(new_n)
            if node_signature(old_n, old_style) != node_signature(new_n, new_style):
                modified.append({
                    "id": nid,
                    "name": new_n.get("name"),
                    "type": new_n.get("type"),
                    "changeType": "modified",
                    "details": describe_modification(old_n, new_n, old_style, new_style),
                    "box": new_n.get("absoluteBoundingBox"),
                })

    added, removed, recreated = reconcile_recreated(added, removed)

    # modified (direct content/position edits) is the most meaningful signal;
    # added/removed nodes are often incidental (e.g. token/variable churn)
    modified.sort(key=lambda e: e["name"] or "")
    recreated.sort(key=lambda e: e["name"] or "")
    added.sort(key=lambda e: e["name"] or "")
    removed.sort(key=lambda e: e["name"] or "")
    ordered = modified + recreated + added + removed
    total = len(ordered)

    tree_size = len(set(old_flat) | set(new_flat)) or 1
    magnitude = round(100 * total / tree_size, 2)

    return ordered[:limit], total, magnitude


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file-key", required=True)
    parser.add_argument("--node-id", help="omit to track the WHOLE file (every page/canvas) "
                         "instead of one node's subtree — see full_file_document()")
    parser.add_argument("--node-ids", help="BATCH multi-node mode: comma-separated node ids of "
                         "several frames in the SAME file (e.g. the sm/md/lg/xl viewport variants "
                         "of one umbrella design). Fetches all of them per version in ONE request "
                         "instead of one run per node — see nodes_documents(). Mutually exclusive "
                         "with --node-id. Output is {\"nodes\": {nodeId: {results,errors,"
                         "dayScreenshots}}} (merge_entry.py reads a node out of it by --node-id). "
                         "--screenshot-dir becomes a parent dir; each node gets its own subdir.")
    parser.add_argument("--since", help="YYYY-MM-DD; omit to pull full available history. "
                        "When set, paging stops at the first version older than this date, so a "
                        "repeat sync only pulls the delta since the design's last recorded change.")
    parser.add_argument("--max-versions", type=int, default=None,
                        help="optional hard ceiling on versions fetched (default: unlimited — pull all)")
    parser.add_argument("--screenshot-dir", help="if set, fetch one end-of-day preview image "
                         "(best-effort, see fetch_screenshot docstring) for each day that had "
                         "a real (magnitude > 0) change, saved into this directory. Ignored in "
                         "whole-file mode (--node-id omitted) — there's no single node to render.")
    parser.add_argument("--rpm", type=int, default=None,
                        help="max Figma API requests per minute (global, across all worker "
                             "threads). Default 15 (or $FIGMA_MAX_RPM), deliberately under the "
                             "~20/min Tier-1 ceiling on Org/Enterprise. Raise only if you know "
                             "the account allows it; lower it if you still see 429s.")
    args = parser.parse_args()

    if not FIGMA_TOKEN:
        print(json.dumps({"error": "FIGMA_TOKEN not set"}))
        sys.exit(1)

    if args.node_ids and args.node_id:
        print(json.dumps({"error": "pass --node-id OR --node-ids, not both"}))
        sys.exit(1)
    is_batch = bool(args.node_ids)
    if is_batch:
        batch_node_ids = [n.strip() for n in args.node_ids.split(",") if n.strip()]
        if len(batch_node_ids) < 2:
            print(json.dumps({"error": "--node-ids needs 2+ ids; use --node-id for a single node"}))
            sys.exit(1)

    if args.rpm:
        # Reconfigure the global pacer before any request goes out.
        global RATE_LIMITER
        RATE_LIMITER = RateLimiter(args.rpm)

    versions = fetch_all_versions(args.file_key, since=args.since, max_versions=args.max_versions)
    versions.sort(key=lambda v: v["created_at"])

    if args.since:
        start_idx = next(
            (i for i, v in enumerate(versions) if v["created_at"][:10] >= args.since),
            None,
        )
        if start_idx is None:
            # Every fetched version is older than --since — i.e. there have been
            # no new versions since the design's last recorded change. Nothing to
            # pull; emit an empty (successful) result so merge is a no-op and the
            # existing history is left intact.
            empty = {"results": [], "errors": [], "dayScreenshots": {},
                     "note": f"no versions on/after {args.since}"}
            if is_batch:
                print(json.dumps({"nodes": {n: dict(empty) for n in batch_node_ids}}))
            else:
                print(json.dumps(empty))
            return
        # Include one version before --since as the baseline for the first diff.
        start_idx = max(start_idx - 1, 0)
        versions = versions[start_idx:]

    # One accumulator per tracked node. Single/whole-file mode has exactly one
    # (keyed by args.node_id, which may be None for whole-file); batch mode has
    # one per node. Both feed the SAME process_transition()/render_day_screenshots()
    # helpers, so the diff and screenshot logic can't drift between the two paths.
    node_ids = batch_node_ids if is_batch else [args.node_id]
    accums = {nid: NodeAccum() for nid in node_ids}

    # The per-version fetch is the dominant cost of a full-history pull (Figma's
    # versions API is file-wide, so a long shared edit history is paid regardless
    # of how small the tracked node is — a real run spent 2+ hours almost entirely
    # blocked in socket reads, ~16s of actual CPU). In BATCH mode one request
    # returns every tracked node's document for that version, so N frames of one
    # file cost ONE rate-limit slot per version instead of N — see
    # nodes_documents(). Fetches are independent (only diffing needs sequential
    # order), so a thread pool overlaps their network waits; the global
    # RateLimiter still paces the request starts underneath.
    #
    # Bounded pipeline, not "fetch every version into memory, then diff": only a
    # small window (PREFETCH_WINDOW) of fetches runs ahead of the sequential diff
    # position, so a diffed version's document is freed immediately instead of
    # pinning every version's JSON in memory at once (which once drove ~192GB RSS
    # and crashed the host with several such runs going).
    def _fetch_version(vid):
        if is_batch:
            return nodes_documents(args.file_key, node_ids, vid)  # {nid: doc_or_None}
        # single/whole-file: normalize to the same {nid: doc} shape. A not-exist
        # node raises here (as before) and is attributed as this version's error.
        return {args.node_id: fetch_document(args.file_key, args.node_id, vid)}

    PREFETCH_WINDOW = FETCH_POOL_WORKERS * 2
    version_iter = iter(versions)
    pending = []  # list of (version, Future), oldest-submitted first

    def _submit_next(pool):
        v = next(version_iter, None)
        if v is None:
            return False
        pending.append((v, pool.submit(_fetch_version, v["id"])))
        return True

    with concurrent.futures.ThreadPoolExecutor(max_workers=FETCH_POOL_WORKERS) as pool:
        for _ in range(PREFETCH_WINDOW):
            if not _submit_next(pool):
                break

        while pending:
            v, fut = pending.pop(0)
            _submit_next(pool)  # keep the window full as we consume one
            try:
                docmap = fut.result()
            except Exception as e:
                # Whole request failed (rate limit exhausted, 500, network). Record
                # it once per tracked node so none silently loses this version. In
                # single mode this is also the not-exist path (fetch_document raises).
                for nid in node_ids:
                    accums[nid].errors.append({"versionId": v["id"], "date": v["created_at"], "reason": str(e)})
                continue

            for nid in node_ids:
                doc = docmap.get(nid)
                if doc is None:
                    # Batch mode: this node didn't exist yet at this version (single
                    # mode surfaces that as the exception handled above instead).
                    accums[nid].errors.append({"versionId": v["id"], "date": v["created_at"],
                                               "reason": f"node {nid} did not exist yet at version {v['id']}"})
                    continue
                process_transition(accums[nid], doc, v)

    if is_batch:
        out_nodes = {}
        for nid in node_ids:
            acc = accums[nid]
            day_screenshots = {}
            if args.screenshot_dir:
                # Per-node subdir so two frames of the same file don't collide.
                day_screenshots = render_day_screenshots(
                    args.file_key, nid, os.path.join(args.screenshot_dir, nid.replace(":", "-")), acc)
            out_nodes[nid] = {"results": acc.results, "errors": acc.errors, "dayScreenshots": day_screenshots}
        print(json.dumps({"nodes": out_nodes}, indent=2))
        return

    acc = accums[args.node_id]
    day_screenshots = {}
    if args.screenshot_dir and not args.node_id:
        acc.errors.append({"versionId": None, "date": None,
                            "reason": "--screenshot-dir ignored: no single node to render in whole-file mode (--node-id omitted)"})
    elif args.screenshot_dir:
        day_screenshots = render_day_screenshots(args.file_key, args.node_id, args.screenshot_dir, acc)

    print(json.dumps({"results": acc.results, "errors": acc.errors, "dayScreenshots": day_screenshots}, indent=2))


if __name__ == "__main__":
    main()
