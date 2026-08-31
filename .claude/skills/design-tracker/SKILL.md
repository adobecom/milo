---
name: design-tracker
description: >
  Tracks Figma design changes paired with the Jira tickets that relate to
  them, for the dashboard hosted as a DA page (never in this repo). Adds,
  removes, or refreshes Figma+Jira pairs and uploads the result to DA as
  entries.json, which is embedded into the dashboard page at publish time.
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

All entry data and screenshots live in a private DA drafts space under
`adobecom/milo`, so viewing any of it requires DA auth.

**One page = one self-contained tracker (per-page layout).** Each tracker is
a single DA page that holds *both* a hand-edited `Design Links` input block
*and* the generated `design-tracker` dashboard block, with its own data
stored **beside the page** (page `<page-path>` → data at
`<page-path>/entries.json`, `<page-path>/thumbnails/`, `<page-path>/detail/`).
This lets people make a `wave1` page, a `wave2` page, etc., each independently
tracked, and re-sync any one by sending its link. `<page-path>` below is a
placeholder for that page's own path (e.g. `drafts/dusan/wave1`) — there is
no single fixed design-tracker path anymore; everything is relative to the
page being synced. The running example path in this doc is
`drafts/dusan/wave1`.

**Auth for the skill's own uploads** (this file, screenshots, the page
itself): `da-auth-helper token` (run `da-auth-helper login` first if it's
expired — opens a browser OAuth flow, so this needs to happen in an
interactive session, not delegated to a background agent).

**The published dashboard does not read `content.da.live` at runtime at all**
— `embed_page.py` embeds `entries.json`'s contents into the page and Helix
re-hosts images same-origin at preview time (see "Publishing the dashboard
page"), so there's no runtime DA fetch to authenticate. (An earlier static-
page design *did* fetch DA live and this section warned against adding a
token input for it; that design is obsolete, but the "never add a token
paste affordance" rule still stands — nothing here should ever fetch
`content.da.live` from the browser.)

Every instruction below that involves writing a file means: write it to a
**scratch directory** (e.g. `/tmp/design-tracker/`), then upload via the
DA admin API — same pattern `build-content-from-figma` uses:

```bash
TOKEN=$(da-auth-helper token)
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.da.live/source/adobecom/milo/<page-path>/<relative-path>" \
  -H "Authorization: Bearer $TOKEN" \
  -F "data=@<local-scratch-path>;type=<mime-type>"
```

`entries.json` → `type=application/json`. Thumbnails/screenshots →
`image/png`. The dashboard page → `text/html` (see "Publishing the
dashboard page").

## When invoked

**Default: sync from an input page.** If the invocation includes a DA page URL
(and no other explicit instruction), treat it as "sync this page" — run the
"Sync from an input page" flow below, no verb like "sync" required. Editing
the page's "Design Links" table is how the user adds/removes designs; this
skill just reconciles `entries.json` to whatever the table now lists. This is
the normal, primary path.

The other modes below are legacy manual operations, kept for the rare case the
user asks for one directly by name — they are **not** needed for routine
add/remove (that's done by editing the table + syncing):
- **Add** a new pair: give you a Figma URL and a Jira URL to track.
- **Remove** a pair: give you a `jiraKey` or `figmaFileKey`/`figmaNodeId` to stop tracking.
- **Refresh**: ask you to pull fresh data for one entry or all entries.

## Sync from an input page

Each tracker page carries a hand-editable **"Design Links"** block (a
two-column table in the DA editor: Figma link, optional Jira link — stored as
`<div class="design-links">`) right alongside its generated `design-tracker`
dashboard block. Routine add/remove needs no skill invocation — the user just
edits that table in DA (add a row to track, delete a row to un-track). When
they hand you **that page's URL**, reconcile the page's own
`<page-path>/entries.json` to whatever the table now lists, then regenerate
the dashboard block **on the same page** (the input block is preserved
verbatim — see "Publishing the dashboard page"). The input block and the
dashboard live on one page; the sync reads and writes the same page.

**Removing a row soft-disables, it does not delete.** A design dropped from
the table keeps its full tracked history in `entries.json` but gets
`trackingDisabled: true` (+ `disabledDate`), so `design-tracker.js` hides it
from the default view. Re-adding the same row later reactivates it
(`trackingDisabled` cleared) with prior history intact — only the gap since
`disabledDate` is re-pulled, never the whole history again. This is why the
sync flow never hard-deletes an entry.

Steps:

1. **Resolve the page location.** From the given URL, work out `org`/`repo`/
   `<page-path>` (e.g. `adobecom` / `milo` / `drafts/dusan/wave1`). Any URL
   form the user pastes (`.aem.page` preview, `da.live/edit`,
   `content.da.live`) maps to that same org/repo/page-path. Everything below
   is relative to this page: its data is at `<page-path>/entries.json`.

2. **Parse the input block** — don't hand-roll HTML parsing:
   ```bash
   TOKEN=$(da-auth-helper token)
   python3 $SKILL_DIR/scripts/parse_input_block.py \
     --org adobecom --repo milo --path drafts/dusan/wave1 \
     --token "$TOKEN"
   ```
   It reads the page's **raw DA source** (no preview needed) and prints
   `{rows: [{figmaUrl, jiraUrl}, ...], warnings}`. It finds the block by CSS
   class `design-links` (DA stores authored blocks as nested divs, not
   `<table>`, and a block named "Design Links" gets `class="design-links"`).
   Surface any `warnings` to the user. A row's `jiraUrl` may be `null` —
   that's allowed (tracks under "Untracked", same as a Jira-less manual add).

3. **Resolve each row into concrete target entries.** For each `figmaUrl`,
   apply "Add a new pair" step 1's parsing: derive `figmaFileKey` /
   `figmaNodeId`, and if a URL has no `node-id`, split it into one target per
   viewport-variant frame via `get_metadata` (Figma MCP) exactly as that
   section describes. Derive `jiraKey` from `jiraUrl` (or `null`). Write the
   resulting flat list to `/tmp/design-tracker/targets.json` as
   `[{figmaFileKey, figmaNodeId, jiraKey, figmaUrl, jiraUrl}, ...]`.

4. **Download this page's `entries.json`** from `<page-path>/entries.json`
   (see "Writing back" step 1). On a brand-new page it 404s — start from `[]`.

5. **Reconcile** — this both classifies each design and updates the disabled
   flags in place, so history is never dropped and stale flags never linger:
   ```bash
   python3 $SKILL_DIR/scripts/reconcile_input.py \
     --entries /tmp/design-tracker/entries.json \
     --targets /tmp/design-tracker/targets.json
   ```
   It prints `{toAdd, toRefresh, toReactivate, toSoftDisable}` and rewrites
   the local `entries.json` scratch copy with `trackingDisabled`/`disabledDate`
   set on soft-disabled entries and cleared on reactivated ones. **It does
   not fetch anything or add new entries** — you run those pulls next.

6. **Run the pulls per bucket:**
   - `toAdd`: run the full "Add a new pair" flow (append the new entry with
     nulls, then the mandatory full-history + screenshots pull), for each
     target.
   - `toRefresh` and `toReactivate`: run "Refresh Figma data" / "Refresh
     Jira data". For history, an incremental pull is enough — pass
     `--since <the entry's latest existing versionChanges date>` to
     `diff_versions.py` rather than re-pulling the whole history (for a
     reactivated entry this fills only the gap since `disabledDate`).
   - `toSoftDisable`: nothing to fetch — the script already flagged these.
     Just report them to the user so a surprise removal is visible.
   Merge every pull result into the scratch `entries.json` via
   `merge_entry.py` as usual.

7. **Upload `entries.json`** back to `<page-path>/entries.json` ("Writing
   back" step 3), then **regenerate and re-publish the page** ("Publishing
   the dashboard page") — `embed_page.py` keeps the `design-links` input
   block verbatim and rewrites the `design-tracker` block beside it, so the
   sync is immediately visible on the same page.

### Creating a new tracker page

Anyone can make a new tracker (`wave1`, `wave2`, …) themselves in the DA
editor: create a page, insert a block named **Design Links**, give it two
columns (Figma link, optional Jira link), add rows, then send you the link
to sync. If asked to scaffold one, author the page with a
`<div class="design-links">` block (rows: `<div><div>figma-link</div><div>jira-link</div></div>`;
an optional first header row `Figma`/`Jira` is skipped by the parser), upload
to `admin.da.live/source/adobecom/milo/<page-path>.html` (`text/html`) and
preview it. The first sync then generates the `design-tracker` block on that
same page. After creation the user maintains the table themselves in DA's
editor — the skill only reads it on sync.

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
     all, don't default to whole-file tracking** — call `get_metadata`
     (Figma MCP, no `nodeId`) to see the file's top-level pages, then
     `get_metadata` again on the relevant page to see its top-level frames.
     A Figma page commonly holds one umbrella design as several viewport
     variants side by side (e.g. `xl - 1441+`, `lg - 1280-1440`,
     `md - 1279...`, `sm - 768...`) plus non-design annotation frames (a
     "SSOT" marker, notes, etc.) — **split each real viewport-variant frame
     into its own separate entry** (own `figmaNodeId`, own `figmaFileName`
     from the frame's name), not one `figmaNodeId: null` blob for the whole
     file. If it's genuinely ambiguous which top-level frames are real
     variants vs. annotations, ask the user rather than guessing — but
     default to splitting, since that's almost always what "no node-id"
     means in practice. Only fall back to true whole-file tracking (see
     "Whole-file tracking" below) if the user explicitly asks to track
     everything as one unit.
2. Parse the Jira URL: `jiraKey` is the path segment after `/browse/`.
3. Download the current `entries.json` from DA (see "Writing back") and
   append a new entry object (create the array if empty) with `addedDate`
   set to today and all other Figma/Jira data fields set to `null` — **one
   entry per identified frame** if step 1 found multiple viewport variants
   under one umbrella design, not one entry for the whole group. All
   variants from the same add share the same `jiraKey`/`jiraUrl` (if any)
   so they group together on the dashboard as one ticket's designs — only
   `figmaNodeId`/`figmaFileName` (and everything Refresh fills in
   per-entry) differ between them. Then immediately run the **Refresh**
   steps below for each new entry.
4. **Always pull the full version history for a newly-added design, not
   just current state** — run "Version-history change bars" below (it's
   optional for a routine *refresh* of an already-tracked design, but
   mandatory the first time a design is added, so the user gets the whole
   history immediately rather than only change data going forward from
   today) — **for every entry added**, not just one, when step 1 split a
   URL into multiple viewport variants. Pass a high `--max-versions` (well
   above the default 60) so a design with a long history doesn't get
   truncated — if the script's `--since`/`--max-versions` error fires (see
   that section), that's the signal to raise `--max-versions` further, not
   to accept partial history. Also run "End-of-day screenshots" for the
   same reason, unless the user says they don't want screenshots for this
   one.

## Refresh Figma data (per entry)

1. **Name + thumbnail**: call `get_screenshot` (Figma MCP) with the
   entry's `figmaFileKey`/`figmaNodeId`. It returns a **short-lived** URL —
   it will expire, so never store it directly in `entries.json`. Instead,
   immediately `curl` it down to
   `/tmp/design-tracker/thumbnails/<figmaFileKey>-<figmaNodeId with : replaced by ->.png`,
   upload that file to DA at this page's own
   `<page-path>/thumbnails/<same filename>` (see "Data lives in DA" above),
   and set `figmaThumbnailUrl` in the entry to the resulting
   **`content.da.live` URL** (e.g.
   `https://content.da.live/adobecom/milo/drafts/dusan/wave1/thumbnails/q87sUm2fvForRQzxGum5wE-392-16552.png`)
   — not a Figma URL and not a local/relative path. At publish time
   `embed_page.py` re-hosts these same-origin; the DA URL is the build-time
   source. Use `get_metadata` on the node to get a human-readable name for
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

## Whole-file tracking (figmaNodeId: null) — rare, explicit-request-only fallback

**Not the default for a no-node-id URL** — see "Add a new pair" step 1:
a no-node-id URL almost always means "split into each viewport-variant
frame," each getting its own real `figmaNodeId`. Only use whole-file
tracking (`figmaNodeId: null`) when the user explicitly says they want the
entire file tracked as a single unit rather than split per design.

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

1. **Download this page's `entries.json` from DA first** — it's the
   source of truth, not a file tracked in this repo. It lives beside the
   page being synced, at `<page-path>/entries.json`:
   ```bash
   TOKEN=$(da-auth-helper token)
   mkdir -p /tmp/design-tracker
   curl -s -H "Authorization: Bearer $TOKEN" \
     "https://content.da.live/adobecom/milo/drafts/dusan/wave1/entries.json" \
     -o /tmp/design-tracker/entries.json
   ```
   On a brand-new page this 404s / comes back empty — start from
   `[]` instead of treating that as a failure.
2. Merge the updated entry (or entries) into that local scratch copy,
   matching on `figmaFileKey` + `figmaNodeId` (not a fixed triple-key —
   `jiraKey` is only used to disambiguate the rare case where the *same*
   node is tracked under more than one ticket, not as a third required
   match field every time), and pretty-print (2-space indent).
3. **Upload the merged file back to DA** (same `<page-path>/entries.json`):
   ```bash
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.da.live/source/adobecom/milo/drafts/dusan/wave1/entries.json" \
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
  --da-base https://content.da.live/adobecom/milo/<page-path>
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

**This describes the current block-based pipeline. An earlier version of
this skill served a static page from `adobecom/da-dc` via `content.da.live`
whose JS `fetch()`ed `entries.json` live, and warned "never call
`admin.hlx.page/preview`."** That's obsolete — the dashboard is now a real
milo block (`libs/blocks/design-tracker/design-tracker.js`/`.css`) whose data
and images are **embedded** into an authored page by `scripts/embed_page.py`,
which is then genuinely **previewed** through Helix so the block decorates
and images re-host same-origin. The old static shell
(`references/da-page-template.html`) and the `tools/design-tracker/` copy of
the JS/CSS are leftovers from that superseded design — don't use them.

**One page holds both blocks; data sits beside it.** For a tracker page at
`<page-path>` (e.g. `drafts/dusan/wave1`):
- **The page** (`<page-path>.html`) holds the hand-edited `design-links` input
  block **and** the generated `design-tracker` dashboard block. It's served
  through Helix's preview pipeline (that's how the block decorates). This is
  what the user opens and edits.
- **`embed_page.py` regenerates the `design-tracker` block on every publish
  but preserves the `design-links` block verbatim** (it reads the current
  page and carries the input block across untouched). That's how the two
  coexist on one regenerated page without the input being wiped.
- **Data store** — `<page-path>/entries.json`, `<page-path>/thumbnails/`,
  `<page-path>/detail/` offloaded docs — read via `content.da.live` as
  *build-time source* only; the published page embeds their contents, so the
  browser never fetches `content.da.live` at runtime.

The page lives on a **dedicated, long-lived branch: `design-tracker-dashboard`**.
(It previously rode on `parallax-garage-door-mask`, a branch slated for
deletion — anything pointing there would break, so it was moved.) Use this
branch for every upload/preview below and as `embed_page.py`'s `--page-branch`.

Steps:

1. **Build the page HTML** with `embed_page.py` (embeds `entries.json`'s
   data + an image gallery, and offloads any oversized day's detail to its
   own DA doc — see "Version-history change bars"):
   ```bash
   TOKEN=$(da-auth-helper token)
   python3 $SKILL_DIR/scripts/embed_page.py \
     --entries /tmp/design-tracker/entries.json \
     --token "$TOKEN" \
     --page-org-repo adobecom/milo \
     --page-branch design-tracker-dashboard \
     --page-path drafts/dusan/wave1 \
     --out /tmp/design-tracker/page.html
   ```
   `--page-path` also tells it which page to read the `design-links` input
   block from (to preserve) — the output reports `inputTablePreserved`.
2. **Upload the page HTML** to DA source (same `<page-path>.html`):
   ```bash
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.da.live/source/adobecom/milo/drafts/dusan/wave1.html" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: text/html" \
     --data-binary @/tmp/design-tracker/page.html
   ```
3. **Preview it through Helix** so the block decorates and any embedded
   `<img>` re-hosts same-origin:
   ```bash
   curl -s -w "\n%{http_code}" -X POST \
     "https://admin.hlx.page/preview/adobecom/milo/design-tracker-dashboard/drafts/dusan/wave1" \
     -H "Authorization: Bearer $TOKEN"
   ```
   (`embed_page.py` already previews each *offloaded detail doc* it uploads;
   this step previews the main page itself.)
4. The page renders at the branch's `.aem.page` preview alias, path
   `<page-path>`. Confirm the exact URL from the `preview` response's
   `preview.url` field rather than hand-assembling it. Do **not** call
   `/live/` — preview is auth-gated; `/live/` would publish it with no auth
   wall.

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
