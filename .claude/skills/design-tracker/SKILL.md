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
     (e.g. `392-16552` → `392:16552`). **If the URL has no `node-id` at
     all, set `figmaNodeId` to JSON `null`** — this means "track the whole
     file" (see "Whole-file tracking" below), not "track nothing."
2. Parse the Jira URL: `jiraKey` is the path segment after `/browse/`.
3. Append a new entry object to `tools/design-tracker/entries.json`
   (create the array if the file is empty) with `addedDate` set to today
   and all other Figma/Jira data fields set to `null` — then immediately
   run the **Refresh** steps below for this entry.

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
   `figmaFileName` if you don't already have one. **This step needs a
   specific node and doesn't apply to whole-file entries** (`figmaNodeId`
   is `null`) — `get_screenshot` requires a `nodeId`, so there's no single
   thing to screenshot for "the whole file." Leave `figmaThumbnailUrl`
   `null` for those; `design-tracker.js`'s `renderDesignCard()` already
   degrades gracefully (no `src` set, no broken image).
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

## Whole-file tracking (figmaNodeId: null)

Omitting `--node-id` when calling `diff_versions.py` (and `merge_entry.py`
— omit the flag entirely, don't pass the literal string `"None"`) tracks
the **entire file**: every page/canvas and everything under them, via
`full_file_document()` (`GET /v1/files/:key?version=X`, not the
node-scoped `/nodes` endpoint). The rest of the pipeline (flatten, diff,
magnitude, `changed_elements`) works unchanged, since it just walks
whatever tree root it's given.

**This is much heavier than single-node tracking — set expectations
accordingly before running a full history in this mode.** Verified on a
real 29-page file: fetching *one version's* full document took ~40-60s
(vs. a few seconds for a single node), because the payload is the entire
file, not one subtree. A multi-version history run in whole-file mode
will be proportionally slower, produce far more `changedElements` per
transition (routinely hitting `MAX_CHANGED_ELEMENTS`), and report much
smaller `magnitude` percentages for the same absolute amount of change
(the denominator — total tree size — is now the whole file, not one
frame). None of that is a bug; it's the real tradeoff of "track
everything" vs. "track one block."

`--screenshot-dir` is a no-op in this mode (recorded as a non-fatal entry
in `errors`) — there's no single node to render a preview of.

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
on `figmaFileKey` + `figmaNodeId` (not a fixed triple-key — `jiraKey` is
only used to disambiguate the rare case where the *same* node is tracked
under more than one ticket, not as a third required match field every
time). **Never auto-commit** — the user reviews and commits the updated
file themselves.

**Prefer `scripts/merge_entry.py` over hand-written merge code.** Writing
this matching/merge logic inline from memory each session is exactly
the kind of repetitive glue code that caused real bugs (see git history —
the `id`/`box`/`dayScreenshots` fields from a `diff_versions.py` run sat
unused for a full session because the merge step was never documented).
Use:
```bash
python3 $SKILL_DIR/scripts/merge_entry.py \
  --entries tools/design-tracker/entries.json \
  --file-key <figmaFileKey> --node-id <figmaNodeId> \
  --diff-output <path to diff_versions.py's JSON output>
```
It handles matching, deduping `versionChanges` by `versionId` (union, kept
sorted by date — so a partial `--since` refresh doesn't need to guess
whether to splice or clobber), and stripping `dayScreenshots` paths to be
relative to `tools/design-tracker/`. If you must merge by hand instead,
replicate that dedupe behavior rather than blindly overwriting the array.

**Token-expiry vs rate-limiting**: an `HTTP 401`/`403` from any script's
`api_get`/Jira call almost always means the token itself is dead — tell
the user to regenerate it (Figma: account settings → Personal access
tokens; Jira: same PAT page referenced in the jira-integration skill) —
retrying won't help. `HTTP 429` is the rate limiter and *is* worth
retrying/backing off (already handled automatically, see below). Don't
confuse the two when triaging a failed run.

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

**If the script prints an `error` about `--since`/`--max-versions` instead
of running**: `fetch_all_versions()` stops paging once `--max-versions` is
hit, *before* the `--since` filter runs. The script fails loudly rather
than silently returning incomplete history in two cases: (1) `--since` is
older than every version fetched, or (2) the version cap was hit before
pagination reached that far back (every fetched version is *already*
newer than `--since`, which looks like coverage but isn't — there could be
more, uncounted history in between). Both errors say what happened; the
fix is the same either way — increase `--max-versions`.

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
position/size delta, fill/stroke/effect(shadow-blur)/corner-radius/rotation/
auto-layout-spacing change, opacity/visibility change) — see
`node_signature()`/`describe_modification()` for the exact property list,
and keep this line in sync if you add another property to track — and
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

**Element `changeType`s**: `modified`, `added`, `removed`, and `recreated`.
`recreated` means a node was deleted and a new node with the same
name+type appeared in the same diff — very common after detach-instance
or ungroup/regroup, which assigns a new Figma ID to otherwise-identical
content. Without this reconciliation pass (`reconcile_recreated()`), those
show as a spurious `added`+`removed` pair and inflate `magnitude`. All four
types need their own color in `design-tracker.css`'s
`.roadmap-highlight-*`/`.roadmap-summary-badge-*` rules (plus a generic
fallback so an uncovered type is never invisible) and an entry in
`design-tracker.js`'s `HIGHLIGHT_LEGEND` — keep these three in sync if you
add a new `changeType`.

## End-of-day screenshots + highlight overlay (optional, on request)

Pass `--screenshot-dir <dir>` to `diff_versions.py` to additionally fetch
one best-effort preview image per calendar day that had a real change
(scale is computed dynamically from the tracked node's own bounding box to
target ~700px on the longer edge — don't hardcode a fixed scale, a fixed
0.3 produced an 81MB/image disaster on a 36k×50k-px node before this was
fixed). Use a per-node directory so two tracked designs in the same file
don't collide:
```bash
python3 $SKILL_DIR/scripts/diff_versions.py \
  --file-key <figmaFileKey> --node-id <figmaNodeId> \
  --screenshot-dir tools/design-tracker/thumbnails/days/<figmaNodeId with : replaced by ->
```
The script's JSON output includes a top-level `dayScreenshots` object
(`{ "YYYY-MM-DD": { "path": ..., "nodeBox": {...} } }`) alongside
`results`/`errors` — **this must also be merged into the entry** (as
`entry.dayScreenshots`), with `path` stripped of any `tools/design-tracker/`
prefix so it's relative like `figmaThumbnailUrl`. `merge_entry.py` does
this automatically; if merging by hand, don't just copy `results` and
forget `dayScreenshots` (this happened for a full session before it was
caught).

The page overlays highlight boxes on this screenshot using each changed
element's `box` (absolute bounding box) converted to a percentage relative
to `nodeBox` — this works even though the screenshot itself may be
identical across different days (see the pixel-diffing caveat above); the
boxes come from the reliable JSON diff, not from comparing images to each
other. **Sanity-check screenshot file sizes after any rerun** (`du -sh` the
output dir) — a `nodeBox` of `None` or `{width:0,height:0}` both fall back
to a fixed scale in `scale_for_box()`, which can still produce an oversized
image for a very large node; if a directory comes out much bigger than a
few hundred KB per image, something's wrong before you merge it in.

**Deep-linking to a changed element in Figma**: `figmaNodeUrl()` in
`design-tracker.js` builds `https://www.figma.com/design/<fileKey>/x?node-id=<id>`
from each element's Figma `id`. Deeply-nested instance-override IDs (e.g.
`I392:15025;11468:11815;16619:33084`) are **not** focusable via `node-id` —
Figma silently redirects to the plain file URL — so the function strips
the leading `I` and takes only the first `;`-separated segment (the actual
top-level instance placed in the canvas), which does resolve. This link
always points at the *current* file state, not the historical version —
there's no verified way to deep-link to a specific past version.

**Browser caching**: the static page's `fetch(DATA_URL)` appends a
`?v=<timestamp>` cache-buster. The plain `python -m http.server`
(or equivalent) used for local testing sends no cache-control headers, so
without this, a browser can keep serving a stale `entries.json` from disk
cache indefinitely after a refresh, even across page reloads — this
caused real confusion mid-session (fresh data on disk, stale data in the
open tab) before the cache-buster was added. Don't remove it.
