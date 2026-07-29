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
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.figma.com/v1"
FIGMA_TOKEN = os.environ.get("FIGMA_TOKEN")
DEFAULT_MAX_VERSIONS = 60
MAX_CHANGED_ELEMENTS = 500  # safety cap for pathological cases (e.g. library/token syncs)
MAX_RETRIES = 6


def api_get(url):
    safe_url = urllib.parse.quote(url, safe=":/?&=")
    req = urllib.request.Request(safe_url, headers={"X-Figma-Token": FIGMA_TOKEN})
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < MAX_RETRIES - 1:
                wait = int(e.headers.get("Retry-After", 0)) or (2 ** attempt)
                time.sleep(wait)
                continue
            raise


def fetch_all_versions(file_key, max_versions):
    versions = []
    url = f"{API}/files/{file_key}/versions"
    while url and len(versions) < max_versions:
        data = api_get(url)
        versions.extend(data.get("versions", []))
        url = (data.get("pagination") or {}).get("next_page")
    return versions[:max_versions]


def node_document(file_key, node_id, version_id):
    data = api_get(f"{API}/files/{file_key}/nodes?ids={node_id}&version={version_id}")
    return data["nodes"][node_id]["document"]


def download(url, path):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp, open(path, "wb") as f:
        f.write(resp.read())


TARGET_MAX_DIMENSION = 700  # px, longer edge — keeps preview files small regardless of node size


def scale_for_box(box, target=TARGET_MAX_DIMENSION):
    if not box:
        return 0.3
    longest = max(box.get("width", 0), box.get("height", 0)) or 1
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


def node_signature(node):
    box = node.get("absoluteBoundingBox") or {}
    return (
        node.get("characters"),
        json.dumps(node.get("fills"), sort_keys=True),
        round(box.get("x", 0), 1), round(box.get("y", 0), 1),
        round(box.get("width", 0), 1), round(box.get("height", 0), 1),
        node.get("opacity"),
        node.get("visible", True),
    )


def describe_modification(old_n, new_n):
    """Human-readable list of what specifically changed about a node."""
    details = []

    old_text, new_text = old_n.get("characters"), new_n.get("characters")
    if old_text != new_text:
        details.append(f'text: "{old_text}" → "{new_text}"' if old_text or new_text else "text changed")

    old_fills = json.dumps(old_n.get("fills"), sort_keys=True)
    new_fills = json.dumps(new_n.get("fills"), sort_keys=True)
    if old_fills != new_fills:
        details.append("fill/color changed")

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
                "id": nid, "name": new_n.get("name"), "changeType": "added",
                "details": [f"type: {new_n.get('type')}"],
                "box": new_n.get("absoluteBoundingBox"),
            })
        elif new_n is None:
            removed.append({
                "id": nid, "name": old_n.get("name"), "changeType": "removed",
                "details": [f"type: {old_n.get('type')}"],
                "box": old_n.get("absoluteBoundingBox"),
            })
        elif node_signature(old_n) != node_signature(new_n):
            modified.append({
                "id": nid,
                "name": new_n.get("name"),
                "changeType": "modified",
                "details": describe_modification(old_n, new_n),
                "box": new_n.get("absoluteBoundingBox"),
            })
    # modified (direct content/position edits) is the most meaningful signal;
    # added/removed nodes are often incidental (e.g. token/variable churn)
    modified.sort(key=lambda e: e["name"] or "")
    added.sort(key=lambda e: e["name"] or "")
    removed.sort(key=lambda e: e["name"] or "")
    ordered = modified + added + removed
    total = len(ordered)

    tree_size = len(set(old_flat) | set(new_flat)) or 1
    magnitude = round(100 * total / tree_size, 2)

    return ordered[:limit], total, magnitude


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file-key", required=True)
    parser.add_argument("--node-id", required=True)
    parser.add_argument("--since", help="YYYY-MM-DD; omit to pull full available history")
    parser.add_argument("--max-versions", type=int, default=DEFAULT_MAX_VERSIONS)
    parser.add_argument("--screenshot-dir", help="if set, fetch one end-of-day preview image "
                         "(best-effort, see fetch_screenshot docstring) for each day that had "
                         "a real (magnitude > 0) change, saved into this directory")
    args = parser.parse_args()

    if not FIGMA_TOKEN:
        print(json.dumps({"error": "FIGMA_TOKEN not set"}))
        sys.exit(1)

    versions = fetch_all_versions(args.file_key, args.max_versions)
    versions.sort(key=lambda v: v["created_at"])

    if args.since:
        start_idx = next(
            (i for i, v in enumerate(versions) if v["created_at"][:10] >= args.since),
            len(versions),
        )
        start_idx = max(start_idx - 1, 0)
        versions = versions[start_idx:]

    results = []
    errors = []
    day_last_version = {}   # day -> versionId of the last version seen that day
    day_root_box = {}       # day -> tracked node's own absoluteBoundingBox at that version
    day_has_change = set()  # days with at least one magnitude > 0 transition
    prev_doc = None
    prev_json = None
    for v in versions:
        try:
            doc = node_document(args.file_key, args.node_id, v["id"])
            snapshot = json.dumps(doc, sort_keys=True)
        except Exception as e:
            errors.append({"versionId": v["id"], "date": v["created_at"], "reason": str(e)})
            continue

        magnitude = None
        changes, changed_count = [], 0
        if prev_json is not None:
            if prev_json == snapshot:
                magnitude = 0.0
            else:
                changes, changed_count, magnitude = changed_elements(prev_doc, doc)

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
        prev_doc, prev_json = doc, snapshot

    day_screenshots = {}
    if args.screenshot_dir:
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
