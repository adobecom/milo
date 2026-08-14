---
name: design-tracker
description: >
  Tracks Figma design changes paired with the Jira tickets that relate to
  them, for the dashboard hosted as a DA page (never in this repo). Adds,
  removes, or refreshes Figma+Jira pairs and uploads the result to DA as
  entries.json, which the DA-hosted page fetches live at runtime.
disable-model-invocation: true
---

# Design Tracker Skill

Maintains `entries.json`, the data file behind the design-tracker
dashboard, and the DA-hosted page that renders it. `tools/design-tracker/`
in this repo holds only the reusable `design-tracker.js`/`.css` (public,
non-sensitive code) — the data and the actual dashboard page live in DA.

## Data lives in DA, never in this repo (read this first)

**`adobecom/milo` is public.** Jira ticket details and unreleased Figma
design screenshots must never be committed here. `entries.json` and
`thumbnails/` were committed by mistake in earlier sessions (commits
`08484dcde`/`ff8e19c87`) — deleting them at the tip in a later commit did
**not** remove them from history; both blobs remain fully retrievable from
those commits on the public repo (a `git show <commit>:<path>` or GitHub's
own commit-history UI still serves them). Both paths are now gitignored as
a backstop. **Never work around that gitignore** — if a script wants to
write to `tools/design-tracker/entries.json` or
`tools/design-tracker/thumbnails/`, that's a sign it's using the old
pattern and needs to write to a scratch dir + upload to DA instead.

All entry data, screenshots, and the dashboard page itself instead live in
a private DA drafts space, read directly via `content.da.live` (never
through `admin.hlx.page` preview/live — see "Publishing the dashboard
page" below for why), so viewing any of it requires DA auth:

```
https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker/
```

This value is duplicated as the default `--da-base` in
`scripts/merge_entry.py` and in `references/da-page-template.html`'s
`__ENTRIES_URL__` placeholder — keep them in sync if the location ever
changes.

**Auth for the skill's own uploads** (this file, screenshots, the page
itself): `da-auth-helper token` (run `da-auth-helper login` first if it's
expired — opens a browser OAuth flow, so this needs to happen in an
interactive session, not delegated to a background agent).

**Auth for the page's own runtime reads is not our concern.** Confirmed
`content.da.live` returns `401` with no `Authorization` header and `200`
with one — but a logged-in employee's browser adds that header
transparently (via an internal extension), so `design-tracker.js`'s plain
`fetch()`/`img.src` calls against DA URLs just work with no token
handling in our code at all. **Do not add a token input, `sessionStorage`
token, or blob-URL image fetching** — this was tried and is explicitly the
wrong direction: it bakes a "paste your token" affordance into the page
for a problem that's already solved at the browser/network layer.

Every instruction below that involves writing a file means: write it to a
**scratch directory** (e.g. `/tmp/design-tracker/`), then upload via the
DA admin API — same pattern `build-content-from-figma` uses:

```bash
TOKEN=$(da-auth-helper token)
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.da.live/source/adobecom/da-dc/drafts/dusan/design-tracker/<relative-path>" \
  -H "Authorization: Bearer $TOKEN" \
  -F "data=@<local-scratch-path>;type=<mime-type>"
```

`entries.json` → `type=application/json`. Thumbnails/screenshots →
`image/png`. The dashboard page → `text/html` (see "Publishing the
dashboard page").

## When invoked

The user will either:
- **Add** a new pair: give you a Figma URL and a Jira URL to track.
- **Remove** a pair: give you a `jiraKey` or `figmaFileKey`/`figmaNodeId` to stop tracking.
- **Refresh**: ask you to pull fresh data for one entry or all entries.

## Remove a pair

1. Download the current `entries.json` from DA (see "Writing back" for the
   exact command).
2. Filter out the entry matching the given `jiraKey` (or
   `figmaFileKey`+`figmaNodeId`) — confirm with the user which entry you're
   about to remove before doing so if more than one plausible match exists.
3. Upload the filtered array back to DA (see "Writing back").
4. **Leave that entry's thumbnail/screenshot files in DA** — deleting them
   is optional cleanup, not required for correctness (an orphaned image
   with no entry referencing it is harmless). If the user explicitly asks
   for cleanup, use `curl -X DELETE` against the same
   `admin.da.live/source/...` path.

## Add a new pair

1. Parse the Figma URL:
   - `figmaFileKey`: the path segment after `/design/`.
   - `figmaNodeId`: the `node-id` query param, with `-` converted to `:`
     (e.g. `392-16552` → `392:16552`). **If the URL has no `node-id` at
     all, set `figmaNodeId` to JSON `null`** — this means "track the whole
     file" (see "Whole-file tracking" below), not "track nothing."
2. Parse the Jira URL: `jiraKey` is the path segment after `/browse/`.
3. Download the current `entries.json` from DA (see "Writing back") and
   append a new entry object (create the array if empty) with `addedDate`
   set to today and all other Figma/Jira data fields set to `null` — then
   immediately run the **Refresh** steps below for this entry.
4. **Always pull the full version history for a newly-added design, not
   just current state** — run "Version-history change bars" below (it's
   optional for a routine *refresh* of an already-tracked design, but
   mandatory the first time a design is added, so the user gets the whole
   history immediately rather than only change data going forward from
   today). Pass a high `--max-versions` (well above the default 60) so a
   design with a long history doesn't get truncated — if the script's
   `--since`/`--max-versions` error fires (see that section), that's the
   signal to raise `--max-versions` further, not to accept partial
   history. Also run "End-of-day screenshots" for the same reason, unless
   the user says they don't want screenshots for this one.

## Refresh Figma data (per entry)

1. **Name + thumbnail**: call `get_screenshot` (Figma MCP) with the
   entry's `figmaFileKey`/`figmaNodeId`. It returns a **short-lived** URL —
   it will expire, so never store it directly in `entries.json`. Instead,
   immediately `curl` it down to
   `/tmp/design-tracker/thumbnails/<figmaFileKey>-<figmaNodeId with : replaced by ->.png`,
   upload that file to DA at
   `.../design-tracker/thumbnails/<same filename>` (see "Data lives in DA"
   above), and set `figmaThumbnailUrl` in the entry to the resulting
   **`content.da.live` URL** (e.g.
   `https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker/thumbnails/q87sUm2fvForRQzxGum5wE-392-16552.png`)
   — not a Figma URL and not a local/relative path. `design-tracker.js`
   fetches thumbnails with an auth header, which only resolves against a
   real DA URL. Use `get_metadata` on the node to get a human-readable name for
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

1. **Download the current `entries.json` from DA first** — it's the
   source of truth now, not a file tracked in this repo:
   ```bash
   TOKEN=$(da-auth-helper token)
   mkdir -p /tmp/design-tracker
   curl -s -H "Authorization: Bearer $TOKEN" \
     "https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker/entries.json" \
     -o /tmp/design-tracker/entries.json
   ```
   On the very first run ever, this 404s / comes back empty — start from
   `[]` instead of treating that as a failure.
2. Merge the updated entry (or entries) into that local scratch copy,
   matching on `figmaFileKey` + `figmaNodeId` (not a fixed triple-key —
   `jiraKey` is only used to disambiguate the rare case where the *same*
   node is tracked under more than one ticket, not as a third required
   match field every time), and pretty-print (2-space indent).
3. **Upload the merged file back to DA**:
   ```bash
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.da.live/source/adobecom/da-dc/drafts/dusan/design-tracker/entries.json" \
     -H "Authorization: Bearer $TOKEN" \
     -F "data=@/tmp/design-tracker/entries.json;type=application/json"
   ```

**Never write this file inside the milo repo** — `tools/design-tracker/entries.json`
is gitignored specifically to catch a script or habit that reverts to the
old local-file pattern.

**Prefer `scripts/merge_entry.py` over hand-written merge code** for step 2.
Writing this matching/merge logic inline from memory each session is
exactly the kind of repetitive glue code that caused real bugs (see git
history — the `id`/`box`/`dayScreenshots` fields from a `diff_versions.py`
run sat unused for a full session because the merge step was never
documented). Use:
```bash
python3 $SKILL_DIR/scripts/merge_entry.py \
  --entries /tmp/design-tracker/entries.json \
  --file-key <figmaFileKey> --node-id <figmaNodeId> \
  --diff-output <path to diff_versions.py's JSON output> \
  --scratch-dir /tmp/design-tracker \
  --da-base https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker
```
It handles matching, deduping `versionChanges` by `versionId` (union, kept
sorted by date — so a partial `--since` refresh doesn't need to guess
whether to splice or clobber), and rewrites each `dayScreenshots` path from
a local `--scratch-dir` path to its DA URL (`--da-base`) — **you must have
already uploaded that screenshot to DA** before merging; the script only
rewrites the reference, it doesn't upload. If you must merge by hand
instead, replicate that dedupe behavior rather than blindly overwriting
the array.

**Token-expiry vs rate-limiting**: an `HTTP 401`/`403` from any script's
`api_get`/Jira call almost always means the token itself is dead — tell
the user to regenerate it (Figma: account settings → Personal access
tokens; Jira: same PAT page referenced in the jira-integration skill) —
retrying won't help. `HTTP 429` is the rate limiter and *is* worth
retrying/backing off (already handled automatically, see below). Don't
confuse the two when triaging a failed run.

## Publishing the dashboard page

The actual dashboard the user opens is a DA page, not anything in this
repo. It's a thin shell — `references/da-page-template.html` — that loads
`design-tracker.js`/`.css` and points `window.DESIGN_TRACKER_DATA_URL` at
DA's `entries.json`. It fetches data live on every page load (no baked-in
data, no regeneration needed when entries.json changes) — only re-upload
this shell if the template itself changes.

**View it via `content.da.live` directly — never `admin.hlx.page`
preview/live.** `adobecom/da-dc` is Adobe's real production Acrobat site
(canonical URL points at `www.adobe.com`, loads `/acrobat/scripts/scripts.js`,
full global nav/footer). Confirmed by testing: uploading this page and
calling `/preview/` or `/live/` routes it through that site's own EDS page
template, which processes `<main>` through its own block-decoration JS and
**silently drops every custom `<head>` tag and all of our markup** — the
rendered result was the full Acrobat site chrome with a completely empty
`<main>`, nothing of ours anywhere.

The fix: `content.da.live` is a plain authenticated static-file store —
confirmed a raw `.html` upload comes back with `content-type: text/html`
and renders correctly as a normal page when fetched directly (bypassing
the EDS pipeline entirely, since `admin.hlx.page` is never involved).
The dashboard's real URL is therefore:
```
https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker.html
```
**Never call `admin.hlx.page/preview` or `/live` for this page or for
`design-tracker.js`/`.css`/`entries.json`.** Those endpoints are for
authoring real site content through da-dc's block pipeline — not relevant
here, and calling `/live/` in particular would make it genuinely public on
`aem.live` with no auth wall at all (confirmed this directly — do not
repeat that mistake).

**This dashboard must never reference milo's own site as a source for
`design-tracker.js`/`.css`.** There is no such thing as
"main--milo--adobecom.aem.live" — milo is a shared library other site
repos consume, not a standalone deployed site itself (verified: even
`scripts/scripts.js`, guaranteed to exist, 404s at every branch alias
tried). The only way to make milo's own files reachable at a URL would be
pushing this work onto `stage`/`main` and into a real site's deploy —
**never do that for this dashboard.** Instead, `design-tracker.js`/`.css`
are uploaded into the *same DA folder* as the page, making the whole thing
self-contained:

1. Upload the current copies of `tools/design-tracker/design-tracker.js`
   and `.css` from this repo (read-only source — this repo's copies stay
   the canonical source of the code, DA just gets a copy to serve):
   ```bash
   TOKEN=$(da-auth-helper token)
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.da.live/source/adobecom/da-dc/drafts/dusan/design-tracker/design-tracker.js" \
     -H "Authorization: Bearer $TOKEN" \
     -F "data=@tools/design-tracker/design-tracker.js;type=text/javascript"
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.da.live/source/adobecom/da-dc/drafts/dusan/design-tracker/design-tracker.css" \
     -H "Authorization: Bearer $TOKEN" \
     -F "data=@tools/design-tracker/design-tracker.css;type=text/css"
   ```
   Re-run this step whenever `tools/design-tracker/design-tracker.js`/`.css`
   change in this repo — DA's copies don't update on their own.
2. Fill in the page template's placeholders:
   - `__ENTRIES_URL__` → `https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker/entries.json`
   - `__DA_BASE__` → `https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker`
   - `__CACHE_BUST__` → today's date (`YYYYMMDD`), same convention as
     `index.html`'s own `?v=` cache-buster
3. Upload it as `text/html`:
   ```bash
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.da.live/source/adobecom/da-dc/drafts/dusan/design-tracker.html" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: text/html" \
     --data-binary @<filled-in-template-path>
   ```
4. The dashboard is now live (in the "already updated" sense, not the EDS
   "published" sense) at
   `https://content.da.live/adobecom/da-dc/drafts/dusan/design-tracker.html` —
   open it directly, no preview/publish step needed or wanted.

## Version-history change bars (mandatory when adding a design, optional otherwise)

**Required step of "Add a new pair"** (see above) — run this for the full
history immediately when a design is newly tracked, not just on request.
For a routine refresh of an already-tracked design, it's optional/on-request
as before. Either way, use `scripts/diff_versions.py` to see the
*magnitude* of design changes over time (rendered as bars in the UI). It requires
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

## End-of-day screenshots + highlight overlay (mandatory when adding a design, optional otherwise)

Also part of "Add a new pair"'s required full-history pull — skip only if
the user explicitly says no screenshots for this design. For a routine
refresh, it's optional/on-request as before. Pass `--screenshot-dir <dir>`
to `diff_versions.py` to additionally fetch
one best-effort preview image per calendar day that had a real change
(scale is computed dynamically from the tracked node's own bounding box to
target ~700px on the longer edge — don't hardcode a fixed scale, a fixed
0.3 produced an 81MB/image disaster on a 36k×50k-px node before this was
fixed). Point it at a **scratch directory**, not this repo — a per-node
subdirectory so two tracked designs in the same file don't collide:
```bash
python3 $SKILL_DIR/scripts/diff_versions.py \
  --file-key <figmaFileKey> --node-id <figmaNodeId> \
  --screenshot-dir /tmp/design-tracker/thumbnails/days/<figmaNodeId with : replaced by ->
```
Then **upload every file under that directory to DA** (same
`admin.da.live/source/.../design-tracker/thumbnails/days/<node>/<file>`
pattern as elsewhere) before merging — `merge_entry.py` rewrites paths to
DA URLs assuming the upload already happened, it does not do the upload
itself.

The script's JSON output includes a top-level `dayScreenshots` object
(`{ "YYYY-MM-DD": { "path": ..., "nodeBox": {...} } }`) alongside
`results`/`errors` — **this must also be merged into the entry** (as
`entry.dayScreenshots`), with `path` rewritten from the local
`--scratch-dir` path to its DA URL. `merge_entry.py` does this
automatically (`--scratch-dir`/`--da-base`); if merging by hand, don't
just copy `results` and forget `dayScreenshots` (this happened for a full
session before it was caught), and don't leave `path` pointing at a local
scratch file that won't exist on anyone else's machine.

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
