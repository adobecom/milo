#!/usr/bin/env python3
"""Reconciles the master entries.json against the set of designs currently
listed in the input table, and classifies each into an action bucket. Keeps
the fiddly set-difference + soft-disable/reactivate bookkeeping out of
hand-written session code (same reason merge_entry.py exists) so a partial
run can't silently drop history or forget to clear a stale disabled flag.

Matching key is (figmaFileKey, figmaNodeId) — the same key merge_entry.py
matches on. A whole-file entry has figmaNodeId == null on both sides and
matches by that.

The target list is what Claude produces *after* node-id resolution (parsing
the Figma URL, and splitting a no-node-id URL into per-viewport-variant
frames via the Figma MCP — a plain script can't call the MCP, see SKILL.md's
"Add a new pair" step 1). Each target is:
  {"figmaFileKey": str, "figmaNodeId": str|null, "jiraKey": str|null,
   "figmaUrl": str, "jiraUrl": str|null}

Buckets (mutually exclusive):
  - toAdd:         in target, no matching entry in entries.json → full pull.
  - toReactivate:  matching entry exists AND was trackingDisabled → clear the
                   flag, then refresh (history is intact, only pull the gap).
  - toRefresh:     matching entry exists and is active → routine refresh.
  - toSoftDisable: entry in entries.json (active) with no matching target →
                   set trackingDisabled, keep all history. Already-disabled
                   entries with no target are left as-is (not re-flagged).

This script mutates a scratch copy of entries.json in place: it clears
trackingDisabled/disabledDate on reactivated entries and sets them on
soft-disabled ones. It does NOT add new entries (Claude does that via the
Add flow) or fetch anything — the caller runs the Add/Refresh pulls for the
returned buckets, then merges via merge_entry.py, then uploads.

Usage:
  python3 reconcile_input.py \
    --entries /tmp/design-tracker/entries.json \
    --targets /tmp/design-tracker/targets.json \
    [--today YYYY-MM-DD]   # defaults to system date; override for testing

Output (stdout): JSON with toAdd/toRefresh/toReactivate/toSoftDisable arrays.
The entries.json file is rewritten in place with disabled flags updated.
"""
import argparse
import datetime
import json


def key_of(obj):
    return (obj.get("figmaFileKey"), obj.get("figmaNodeId"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--entries", required=True)
    parser.add_argument("--targets", required=True)
    parser.add_argument("--today", default=datetime.date.today().isoformat())
    args = parser.parse_args()

    with open(args.entries) as f:
        entries = json.load(f)
    with open(args.targets) as f:
        targets = json.load(f)

    entries_by_key = {}
    for e in entries:
        # Last one wins on a dup key — entries.json shouldn't contain
        # duplicate (fileKey,nodeId) pairs, but don't crash if it does.
        entries_by_key[key_of(e)] = e
    target_keys = {key_of(t) for t in targets}

    to_add, to_refresh, to_reactivate = [], [], []
    for t in targets:
        existing = entries_by_key.get(key_of(t))
        if existing is None:
            to_add.append(t)
        elif existing.get("trackingDisabled"):
            existing["trackingDisabled"] = False
            existing.pop("disabledDate", None)
            to_reactivate.append(t)
        else:
            to_refresh.append(t)

    to_soft_disable = []
    for e in entries:
        if key_of(e) in target_keys:
            continue
        if e.get("trackingDisabled"):
            continue  # already disabled with no target — leave as-is
        e["trackingDisabled"] = True
        e["disabledDate"] = args.today
        to_soft_disable.append({
            "figmaFileKey": e.get("figmaFileKey"),
            "figmaNodeId": e.get("figmaNodeId"),
            "figmaFileName": e.get("figmaFileName"),
            "jiraKey": e.get("jiraKey"),
        })

    with open(args.entries, "w") as f:
        json.dump(entries, f, indent=2)

    print(json.dumps({
        "toAdd": to_add,
        "toRefresh": to_refresh,
        "toReactivate": to_reactivate,
        "toSoftDisable": to_soft_disable,
    }, indent=2))


if __name__ == "__main__":
    main()
