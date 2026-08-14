#!/usr/bin/env python3
"""Merge a diff_versions.py JSON output (results/errors/dayScreenshots) into
one entry of a local scratch copy of DA's entries.json, without hand-written
merge code that's easy to get subtly wrong (dropping dayScreenshots,
clobbering history on a partial refresh, wrong path prefix, etc.).

entries.json and the screenshots it references live in DA (private,
auth-gated), never in the milo repo — see the skill's "Data lives in DA"
section. This script operates on a scratch-directory copy of entries.json
downloaded from DA; the caller uploads the result back to DA afterward.

Usage:
  python3 merge_entry.py \
    --entries /tmp/design-tracker/entries.json \
    --file-key <figmaFileKey> [--node-id <figmaNodeId>] \
    --diff-output <path to diff_versions.py's JSON output> \
    --scratch-dir /tmp/design-tracker \
    --da-base https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker \
    [--jira-key <jiraKey>]  # only needed if the same node is tracked under multiple tickets

Omit --node-id entirely (don't pass the literal string "None") to match a
whole-file entry (figmaNodeId: null in entries.json) — argparse leaves
args.node_id as Python None when the flag is omitted, which compares equal
to a JSON null loaded from entries.json.

Behavior:
  - versionChanges: unioned with any existing history, deduped by
    versionId (new data wins on conflict), sorted by date.
  - dayScreenshots: unioned with any existing screenshots (new data wins
    per-day), with each --screenshot-dir local path rewritten to its DA
    URL (--scratch-dir prefix swapped for --da-base) — the caller is
    responsible for having actually uploaded that file to DA first;
    this script only rewrites the reference, not the upload itself.
  - Never commits — only rewrites the local scratch copy of entries.json
    on disk. The caller uploads it to DA afterward.
"""
import argparse
import json
import sys


def to_da_url(path, scratch_dir, da_base):
    scratch_dir = scratch_dir.rstrip("/") + "/"
    da_base = da_base.rstrip("/")
    if path.startswith(scratch_dir):
        return f"{da_base}/{path[len(scratch_dir):]}"
    return path  # already a DA URL (or unrecognized prefix) — pass through as-is


def merge_version_changes(existing, new_results):
    by_id = {v["versionId"]: v for v in existing}
    for v in new_results:
        by_id[v["versionId"]] = v  # new data wins on conflict (assumed fresher)
    return sorted(by_id.values(), key=lambda v: v["date"])


def merge_day_screenshots(existing, new_shots, scratch_dir, da_base):
    merged = dict(existing)
    for day, shot in new_shots.items():
        merged[day] = {"path": to_da_url(shot["path"], scratch_dir, da_base), "nodeBox": shot["nodeBox"]}
    return merged


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--entries", required=True)
    parser.add_argument("--file-key", required=True)
    parser.add_argument("--node-id", help="omit to match a whole-file entry (figmaNodeId: null)")
    parser.add_argument("--diff-output", required=True)
    parser.add_argument("--scratch-dir", default="/tmp/design-tracker",
                         help="local dir --screenshot-dir paths were downloaded under; stripped and replaced with --da-base")
    parser.add_argument("--da-base", default="https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker",
                         help="DA URL prefix screenshots were/will be uploaded to")
    parser.add_argument("--jira-key", help="disambiguate if the same node is tracked under multiple tickets")
    args = parser.parse_args()

    with open(args.entries) as f:
        entries = json.load(f)
    with open(args.diff_output) as f:
        diff_data = json.load(f)

    matches = [
        e for e in entries
        if e.get("figmaFileKey") == args.file_key and e.get("figmaNodeId") == args.node_id
        and (args.jira_key is None or e.get("jiraKey") == args.jira_key)
    ]
    if not matches:
        print(json.dumps({"error": f"no entry found for figmaFileKey={args.file_key} "
                                    f"figmaNodeId={args.node_id} jiraKey={args.jira_key}"}))
        sys.exit(1)
    if len(matches) > 1:
        print(json.dumps({"error": f"{len(matches)} entries matched — pass --jira-key to disambiguate"}))
        sys.exit(1)

    entry = matches[0]
    entry["versionChanges"] = merge_version_changes(entry.get("versionChanges") or [], diff_data.get("results", []))
    if diff_data.get("dayScreenshots"):
        entry["dayScreenshots"] = merge_day_screenshots(
            entry.get("dayScreenshots") or {}, diff_data["dayScreenshots"], args.scratch_dir, args.da_base)

    with open(args.entries, "w") as f:
        json.dump(entries, f, indent=2)

    print(json.dumps({
        "merged": True,
        "versionChangeCount": len(entry["versionChanges"]),
        "dayScreenshotCount": len(entry.get("dayScreenshots") or {}),
        "diffErrors": len(diff_data.get("errors", [])),
    }))


if __name__ == "__main__":
    main()
