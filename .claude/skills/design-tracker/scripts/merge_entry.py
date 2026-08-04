#!/usr/bin/env python3
"""Merge a diff_versions.py JSON output (results/errors/dayScreenshots) into
one entry of tools/design-tracker/entries.json, without hand-written
merge code that's easy to get subtly wrong (dropping dayScreenshots,
clobbering history on a partial refresh, wrong path prefix, etc.).

Usage:
  python3 merge_entry.py \
    --entries tools/design-tracker/entries.json \
    --file-key <figmaFileKey> [--node-id <figmaNodeId>] \
    --diff-output <path to diff_versions.py's JSON output> \
    [--jira-key <jiraKey>]  # only needed if the same node is tracked under multiple tickets

Omit --node-id entirely (don't pass the literal string "None") to match a
whole-file entry (figmaNodeId: null in entries.json) — argparse leaves
args.node_id as Python None when the flag is omitted, which compares equal
to a JSON null loaded from entries.json.

Behavior:
  - versionChanges: unioned with any existing history, deduped by
    versionId (new data wins on conflict), sorted by date.
  - dayScreenshots: unioned with any existing screenshots (new data wins
    per-day), with any "tools/design-tracker/" path prefix stripped so
    paths stay relative like figmaThumbnailUrl.
  - Never commits — only rewrites entries.json on disk.
"""
import argparse
import json
import sys

SCREENSHOT_PREFIX = "tools/design-tracker/"


def strip_prefix(path):
    return path[len(SCREENSHOT_PREFIX):] if path.startswith(SCREENSHOT_PREFIX) else path


def merge_version_changes(existing, new_results):
    by_id = {v["versionId"]: v for v in existing}
    for v in new_results:
        by_id[v["versionId"]] = v  # new data wins on conflict (assumed fresher)
    return sorted(by_id.values(), key=lambda v: v["date"])


def merge_day_screenshots(existing, new_shots):
    merged = dict(existing)
    for day, shot in new_shots.items():
        merged[day] = {"path": strip_prefix(shot["path"]), "nodeBox": shot["nodeBox"]}
    return merged


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--entries", required=True)
    parser.add_argument("--file-key", required=True)
    parser.add_argument("--node-id", help="omit to match a whole-file entry (figmaNodeId: null)")
    parser.add_argument("--diff-output", required=True)
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
        entry["dayScreenshots"] = merge_day_screenshots(entry.get("dayScreenshots") or {}, diff_data["dayScreenshots"])

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
