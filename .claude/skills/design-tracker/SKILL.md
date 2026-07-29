---
name: design-tracker
description: >
  Tracks Figma design changes paired with the Jira tickets that relate to
  them, for the internal dashboard at tools/design-tracker/. Adds new
  Figma+Jira pairs and refreshes their Figma/Jira data by writing to
  tools/design-tracker/entries.json, which the static page renders.
disable-model-invocation: true
---

# Design Tracker Skill

Maintains `tools/design-tracker/entries.json`, the data file behind the
static dashboard at `tools/design-tracker/index.html`. The page itself is a
pure static viewer (fetch + render) — all data comes from this file, and
this skill is the only thing that writes to it.

## When invoked

The user will either:
- **Add** a new pair: give you a Figma URL and a Jira URL to track.
- **Refresh**: ask you to pull fresh data for one entry or all entries.

## Add a new pair

1. Parse the Figma URL:
   - `figmaFileKey`: the path segment after `/design/`.
   - `figmaNodeId`: the `node-id` query param, with `-` converted to `:`
     (e.g. `392-16552` → `392:16552`).
2. Parse the Jira URL: `jiraKey` is the path segment after `/browse/`.
3. Append a new entry object to `tools/design-tracker/entries.json`
   (create the array if the file is empty) with `addedDate` set to today
   and all Figma/Jira data fields set to `null` — then immediately run the
   **Refresh** steps below for this entry.

## Refresh Figma data (per entry)

1. **Name + thumbnail**: call `get_screenshot` (Figma MCP) with the
   entry's `figmaFileKey`/`figmaNodeId`. It returns a **short-lived** URL —
   it will expire, so never store it directly in `entries.json`. Instead,
   immediately `curl` it down to
   `tools/design-tracker/thumbnails/<figmaFileKey>-<figmaNodeId with : replaced by ->.png`
   (create the directory if needed) and set `figmaThumbnailUrl` in the
   entry to that **relative path** (e.g.
   `thumbnails/q87sUm2fvForRQzxGum5wE-392-16552.png`), not a Figma URL.
   Use `get_metadata` on the node to get a human-readable name for
   `figmaFileName` if you don't already have one.
2. **Last-modified date**: the Figma MCP tools don't expose a file-level
   `lastModified` timestamp. If the `FIGMA_TOKEN` environment variable is
   set, call the REST API directly instead:
   ```bash
   curl -s -H "X-Figma-Token: $FIGMA_TOKEN" "https://api.figma.com/v1/files/<figmaFileKey>?depth=1"
   ```
   and take the `lastModified` field for `figmaLastModified`, and `name`
   for `figmaFileName` if not already set. If `FIGMA_TOKEN` isn't set,
   leave `figmaLastModified` as `null` — the page falls back to
   `addedDate` for sorting/filtering, so this degrades gracefully.

## Refresh Jira data (per entry)

Use the existing `jira-integration` skill (its `SKILL.md` prints its own
`SKILL_DIR` when invoked — use that path):

```bash
python3 $SKILL_DIR/scripts/jira_query.py --issue <jiraKey or jiraUrl> --json
```

Requires `JIRA_TOKEN` to be set and Adobe VPN connectivity (see that
skill's prerequisites). From the response, set:
- `jiraTitle` ← `summary`
- `jiraStatus` ← `status.name` (or equivalent status field)
- `jiraUpdated` ← `updated`

If the lookup fails (VPN down, expired token, ticket not found), leave the
existing Jira fields as-is and tell the user what failed — don't wipe out
previously-fetched data.

## Writing back

Rewrite `tools/design-tracker/entries.json` as a pretty-printed JSON array
(2-space indent) with the updated entry (or entries) merged in by matching
on `figmaFileKey` + `figmaNodeId` + `jiraKey`. **Never auto-commit** — the
user reviews and commits the updated file themselves.

## Version-history change bars (optional, on request)

When the user wants to see the *magnitude* of design changes over time
(rendered as bars in the UI), use `scripts/diff_versions.py`. It requires
`FIGMA_TOKEN` (read-only Figma personal access token — the MCP tools don't
expose version history at all, so this always goes through the REST API
directly):

```bash
python3 $SKILL_DIR/scripts/diff_versions.py \
  --file-key <figmaFileKey> --node-id <figmaNodeId> \
  [--since <YYYY-MM-DD>] [--max-versions N, default 60]
```

**Method: document-JSON diffing, not pixel diffing.** An earlier version of
this script rendered each version to a PNG and pixel-diffed them
(`PIL.ImageChops`). That approach is **unreliable and should not be
revived**: on a real file with heavy `<instance>`/`<symbol>` usage (shared
library components), five different frames across two pages all came back
a flat `0.00%` despite 31+ confirmed real edits by 8 different editors —
independently verified via `md5` on the downloaded PNGs, not a fluke.
Root cause: Figma's `/v1/images?version=...` render only appears to replay
a frame's own local geometry history, not the historical state of the
component library it instances — so instance-heavy content renders
identically across versions even when real work happened elsewhere in the
document graph.

The fix: diff `GET /v1/files/:key/nodes?ids=<node>&version=<id>` (the
document JSON) instead of the rendered image — confirmed this genuinely
differs between versions even when the image doesn't. This is also much
faster than the old approach (no image download/decode/PIL needed) and
found real, varied, non-zero magnitudes across a 120-version/~3-week
history for both nodes in this file, clustered around real edit sessions,
flat elsewhere — proof the method detects real change v. no-change, not
just noise.

**`magnitude` is element-count based, not a raw-JSON text-similarity
score.** An earlier version computed `magnitude` via
`difflib.SequenceMatcher(...).quick_ratio()` on the two serialized JSON
blobs — **don't revive this**. It was confusing in practice: a text-diff %
on a huge serialized blob doesn't correlate with "how many elements
changed" (a few edits to large/early JSON blocks can score a bigger text
diff than many small edits scattered elsewhere), so a bar's height didn't
match the element count shown when you clicked it. `changed_elements()`
now flattens both versions' node trees and computes
`magnitude = 100 * changed_count / tree_size` directly — bar height and
"N elements changed" are now the same underlying number, by construction.

The script also returns `changedElements` — the *full* list of named
nodes that were added/removed/modified (modified-first, since
additions/removals are often incidental token/variable churn), each with a
`details` array describing specifically what changed (text before/after,
position/size delta, fill/opacity/visibility change) — and
`changedElementCount` (total; `changedElements` is capped at
`MAX_CHANGED_ELEMENTS` = 500 only as a safety valve for pathological
library-sync events, not a UI truncation — the page renders the full list
in a scrollable region). Include these fields as-is in `versionChanges`.

**Figma's API rate-limits hard under repeated use.** Running this script
many times in a session (e.g. iterating on the diff logic) will eventually
hit `HTTP 429`. `api_get()` retries with backoff (honors `Retry-After`,
falls back to exponential backoff, `MAX_RETRIES` attempts) — don't strip
this out. If you see many `errors` entries in the output all saying
`HTTP Error 429`, that's this happening; consider spacing out repeated
full-history reruns rather than looping tightly.

Take the JSON `results` array it prints and set it directly as the entry's
`versionChanges` field in `entries.json`.

**If magnitude values still look implausibly small/flat for a file you
believe changed a lot**: check whether the *tracked node* is right (e.g.
compare against the Figma link in the linked Jira ticket's own
description — it may point at a different node than the one tracked), before
suspecting the diffing method itself.

**UI note — bars are bucketed per calendar day, not per version.** Versions
often cluster in bursts within the same work session (10-16 in a single
day isn't unusual), so positioning one bar per *version* by actual elapsed
time crams same-session bars on top of each other regardless of container
width — verified this caused real click mis-targeting in testing.
`design-tracker.js`'s `groupByDay()` buckets `versionChanges` into one
slot per calendar day (continuous range, including empty days as thin
gray placeholder bars), giving a genuine date x-axis with tick labels
without the overlap problem. A day's bar height is that day's *maximum*
single-version magnitude; clicking it shows every version from that day
in the scrollable summary, not just one. Don't go back to one-bar-per-
version positioning without solving the overlap problem first.
