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
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.figma.com/v1"
FIGMA_TOKEN = os.environ.get("FIGMA_TOKEN")
MAX_CHANGED_ELEMENTS = 500  # safety cap for pathological cases (e.g. library/token syncs)
MAX_RETRIES = 6
# Per-version document fetches are independent (only diffing needs sequential
# order), so they run concurrently. Kept modest — high enough to hide network
# latency, low enough not to make Figma's rate limiter (see api_get()) worse
# than running sequentially would.
FETCH_POOL_WORKERS = 6


# No timeout on urlopen() means a socket read blocks forever if the
# connection dies without a clean TCP close (laptop sleep/wake, wifi/network
# switch mid-request) — confirmed directly: a real run left 48 sockets stuck
# in CLOSE_WAIT after a sleep/wake, each worker thread hung in read() forever,
# no exception ever raised, no retry ever triggered, the whole run dead with
# no way to recover short of killing the process. REQUEST_TIMEOUT bounds that
# so a dead connection surfaces as a retryable error instead of an infinite hang.
REQUEST_TIMEOUT = 30  # seconds


def api_get(url):
    safe_url = urllib.parse.quote(url, safe=":/?&=")
    req = urllib.request.Request(safe_url, headers={"X-Figma-Token": FIGMA_TOKEN})
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            # HTTPError wraps a still-open connection (it's itself a
            # file-like response object) — confirmed directly: under 6-way
            # concurrent fetching against a rate limiter, retrying without
            # closing it here left 100+ sockets stuck in CLOSE_WAIT within
            # minutes (one leaked per 429), on track to exhaust the process's
            # file descriptors. Close it on every path, retried or not.
            e.close()
            if e.code == 429 and attempt < MAX_RETRIES - 1:
                retry_after = e.headers.get("Retry-After", "")
                try:
                    wait = int(retry_after) or (2 ** attempt)
                except ValueError:
                    # Retry-After can be an HTTP-date instead of seconds; fall back to backoff.
                    wait = 2 ** attempt
                time.sleep(wait)
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


def download(url, path):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp, open(path, "wb") as f:
        f.write(resp.read())


TARGET_MAX_DIMENSION = 700  # px, longer edge — keeps preview files small regardless of node size


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
        f"{API}/images/{file_key}?ids={node_id}&version={version_id}&format=png&scale={scale}"
    )
    url = (data.get("images") or {}).get(node_id)
    if not url:
        return False
    download(url, out_path)
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
    parser.add_argument("--since", help="YYYY-MM-DD; omit to pull full available history. "
                        "When set, paging stops at the first version older than this date, so a "
                        "repeat sync only pulls the delta since the design's last recorded change.")
    parser.add_argument("--max-versions", type=int, default=None,
                        help="optional hard ceiling on versions fetched (default: unlimited — pull all)")
    parser.add_argument("--screenshot-dir", help="if set, fetch one end-of-day preview image "
                         "(best-effort, see fetch_screenshot docstring) for each day that had "
                         "a real (magnitude > 0) change, saved into this directory. Ignored in "
                         "whole-file mode (--node-id omitted) — there's no single node to render.")
    args = parser.parse_args()

    if not FIGMA_TOKEN:
        print(json.dumps({"error": "FIGMA_TOKEN not set"}))
        sys.exit(1)

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
            print(json.dumps({"results": [], "errors": [], "dayScreenshots": {},
                              "note": f"no versions on/after {args.since}"}))
            return
        # Include one version before --since as the baseline for the first diff.
        start_idx = max(start_idx - 1, 0)
        versions = versions[start_idx:]

    results = []
    errors = []
    day_last_version = {}   # day -> versionId of the last version seen that day
    day_root_box = {}       # day -> tracked node's own absoluteBoundingBox at that version
    day_has_change = set()  # days with at least one magnitude > 0 transition

    # fetch_document() per version is the dominant cost of a full-history pull
    # (one API call per version — confirmed directly: a run against a large,
    # heavily-shared file spent 2+ hours almost entirely blocked in a socket
    # read, ~16s of actual CPU time, one request at a time). Figma's versions
    # API is file-wide, not node-scoped, so a file with a long shared edit
    # history pays that cost regardless of how small the tracked node is.
    # Each fetch is independent (only the diff step needs sequential order),
    # so overlapping them in a thread pool turns N sequential network waits
    # into N/POOL_WORKERS — api_get()'s existing per-call retry/backoff still
    # applies per thread, so this doesn't bypass rate-limit handling, it just
    # stops paying for it one request at a time.
    docs_by_version = {}
    fetch_errors = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=FETCH_POOL_WORKERS) as pool:
        future_to_version = {
            pool.submit(fetch_document, args.file_key, args.node_id, v["id"]): v
            for v in versions
        }
        for future in concurrent.futures.as_completed(future_to_version):
            v = future_to_version[future]
            try:
                docs_by_version[v["id"]] = future.result()
            except Exception as e:
                fetch_errors[v["id"]] = str(e)

    prev_doc = None
    for v in versions:
        if v["id"] in fetch_errors:
            errors.append({"versionId": v["id"], "date": v["created_at"], "reason": fetch_errors[v["id"]]})
            continue
        doc = docs_by_version[v["id"]]

        try:
            magnitude = None
            changes, changed_count = [], 0
            if prev_doc is not None:
                # Also covered by this try: a malformed node (unexpected shape)
                # or a pathologically deep whole-file tree could raise here
                # (e.g. RecursionError) — that should be one bad version
                # recorded in `errors`, not a crash of the whole run.
                #
                # No separate whole-doc json.dumps() equality pre-check here:
                # changed_elements() below already walks both trees comparing
                # only the specific tracked fields per node (node_signature()),
                # which is cheaper than serializing every field of every node
                # via sort_keys=True — and it naturally yields magnitude 0.0
                # when nothing tracked differs, so the pre-check bought no
                # speed, just doubled the work on versions that did change.
                changes, changed_count, magnitude = changed_elements(prev_doc, doc)
        except Exception as e:
            errors.append({"versionId": v["id"], "date": v["created_at"], "reason": str(e)})
            continue

        day = v["created_at"][:10]
        day_last_version[day] = v["id"]
        day_root_box[day] = doc.get("absoluteBoundingBox")
        if magnitude:
            day_has_change.add(day)

        results.append({
            "versionId": v["id"],
            "date": v["created_at"],
            "author": (v.get("user") or {}).get("handle"),
            "label": v.get("label") or "",
            "magnitude": magnitude,
            "changedElements": changes,
            "changedElementCount": changed_count,
        })
        prev_doc = doc

    day_screenshots = {}
    if args.screenshot_dir and not args.node_id:
        errors.append({"versionId": None, "date": None,
                        "reason": "--screenshot-dir ignored: no single node to render in whole-file mode (--node-id omitted)"})
    elif args.screenshot_dir:
        os.makedirs(args.screenshot_dir, exist_ok=True)
        for day in sorted(day_has_change):
            version_id = day_last_version[day]
            path = os.path.join(args.screenshot_dir, f"{day}.png")
            scale = scale_for_box(day_root_box[day])
            try:
                if fetch_screenshot(args.file_key, args.node_id, version_id, path, scale=scale):
                    day_screenshots[day] = {"path": path, "nodeBox": day_root_box[day]}
            except Exception as e:
                errors.append({"versionId": version_id, "date": day, "reason": f"screenshot: {e}"})

    print(json.dumps({"results": results, "errors": errors, "dayScreenshots": day_screenshots}, indent=2))


if __name__ == "__main__":
    main()
