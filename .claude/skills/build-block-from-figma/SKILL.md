---
name: build-block-from-figma
description: >
  Builds a new C2 block component from Figma designs using the Figma MCP,
  validates visually with Playwright MCP, then runs accessibility and
  performance audits.  Provide a preview URL (localhost, DA preview, or
  DA published) and one or more Figma frame URLs for different device
  sizes.  For DA published pages (.aem.live), code is pushed to a
  feature branch and tested via ?milolibs=.
---

# Build Block Skill

You are building a new block component for the **C2 design system** inside
the `adobecom/milo` repository.  Components are plain HTML blocks styled
with plain CSS and initialised by an external orchestrator that calls
`init()` on load — you never add self-initialisation logic.

> **Critical path rules**
>
> - Block code patterns come **exclusively** from `libs/c2/blocks/`.
>   Never reference or imitate blocks under `libs/blocks/`.
>   **Never copy or create files in `libs/blocks/`** — if the page
>   does not load C2 blocks, the foundation metadata is missing
>   (see Phase 1 gate).  Do not work around this.
> - Shared utilities live in `libs/utils/decorate.js`
>   (`decorateBlockText`, `decorateTextOverrides`, and the viewport
>   content parser) and `libs/utils/utils.js` (`createTag`).
>   Re-use these; do not duplicate their logic.
> - Design tokens live in `libs/c2/styles/styles.css`.
> - The platform is **Adobe EDS**.  Use the **Fluffyjaws MCP** to look
>   up any EDS conventions you are unsure about.

## Bundled resources

Do **not** load these upfront.  Each phase below tells you which file
to read at the point it becomes relevant.

### references/
| File | Purpose |
|------|---------|
| `design-tokens.md` | `--s2a-` token mapping rules, font-family exceptions, responsive token behaviour. |
| `grid-system.md` | Breakpoints, column counts, container variants, n-up layouts, masonry. |
| `viewport-content.md` | Per-device content authoring spec, inheritance rules, `decorateViewportContent` API. |
| `eds-patterns.md` | EDS block anatomy, shared utilities, CTA patterns, Fluffyjaws MCP usage. |
| `acceptance-criteria.md` | JS/CSS rules, quality checklists, media-query syntax, token usage. |
| `remote-branch-workflow.md` | `.aem.page` publishing, branch creation, push procedure, CDN refresh, iteration batching. |

### agents/
| File | Purpose |
|------|---------|
| `visual-comparison.md` | Playwright screenshot loop — layout, spacing, colour, media fidelity checks. |
| `accessibility-check.md` | axe-core WCAG 2.2 AA audit scoped to the block. |
| `performance-check.md` | Lighthouse CLI audit — LCP, CLS, INP, TBT, overall score. |

---

## Inputs

Ask the user to provide the following before proceeding:

| Input | Required | Example |
|---|---|---|
| **Preview URL** | Yes | `http://localhost:6456/...`, `https://main--repo--org.aem.page/path`, or `https://main--repo--org.aem.live/path` |
| **Figma URL — Mobile** (S, up to 767 px) | At least one Figma URL | frame link |
| **Figma URL — Tablet** (M, 768–1279 px) | | frame link |
| **Figma URL — Desktop** (L, 1280–1440 px) | | frame link |
| **Figma URL — HD** (XL, 1441 px +) | | frame link |
| **Base branch** | No (default: `stage`) | `my-experiment`, `feature/viewport-parser` |

Do not proceed until you have the preview URL and at least one Figma URL.

If a custom base branch is provided, it must be available on
`adobecom/milo`. If it only exists locally, the skill will push it
to `adobecom/milo` automatically during branch creation
(see `remote-branch-workflow.md` section 2, step 3).

---

## Phase 0 — Preview URL resolution

After collecting the preview URL, determine its type and resolve it
to a usable URL before proceeding.

### Localhost (`http://localhost:...`)

No special handling. Proceed directly to Phase 1.

### DA preview (`.aem.page`)

A `.aem.page` URL is only a preview and will not work with
`?milolibs=`. Inform the user that a published (`.aem.live`) URL
is required. Offer two options:
- Provide a published URL themselves.
- Let Claude publish the page via the EDS admin API.

If the user wants Claude to publish, **load
`references/remote-branch-workflow.md` section 1 now** and follow
the publishing procedure (path safety check, API calls).

After obtaining the `.aem.live` URL (whether user-provided or just
published), **fall through to the DA published section below** to
parse it and set `remote-branch-mode`.

### DA published (`.aem.live`)

Parse the URL to extract org, repo, and page path:
```
https://main--<repo>--<org>.aem.live/<path>
```

Store these values — they are needed in Phase 1 for branch creation
and in Phase 5 for Playwright URL construction.

Set an internal flag: **`remote-branch-mode = true`**.

> **STOP**: Do NOT proceed to Phase 1 until you have either a
> localhost URL or a resolved `.aem.live` URL. From this point
> forward, the resolved URL is referred to as the **page URL**.

---

## Phase 1 — Validate environment & infer component name

Use Playwright MCP to navigate to the page URL.

### Foundation check (gate)

Before inspecting the block, verify that the page is running the C2
foundation.  Check the `<head>` for a `<meta>` tag:

```html
<meta name="foundation" content="c2">
```

If this meta tag is **missing**, **stop and ask the user** to add the
`foundation: c2` metadata to the page before continuing.  Do not
attempt to work around this by copying files to `libs/blocks/` or
modifying import paths — the C2 foundation loader handles all path
resolution automatically once the metadata is present.

**Remote-branch-mode recovery**: if the metadata is missing on a
published page, the user must add `foundation: c2` to the
document's metadata block in DA, then re-preview and re-publish.
Offer to handle the preview and publish steps via the EDS admin API
(same procedure as `references/remote-branch-workflow.md` section 1).
Wait for the page to update before continuing.

### Infer component name

Inspect the DOM inside `<main>` only — ignore header, footer, and nav.
Look for the block identifier (a distinctive class name, e.g.
`class="hero-banner"`).  Derive the component name in **kebab-case**.
Confirm the inferred name with the user before continuing.

### Create feature branch (remote-branch-mode only)

Skip this section if `remote-branch-mode` is `false` (localhost).

**Load `references/remote-branch-workflow.md` section 2 now** and
follow the branch creation procedure.  Do NOT proceed to Phase 2
until the user confirms the branch.

---

## Phase 2 — Read existing patterns

Before writing any code:

1. **List the directory `libs/c2/blocks/`** to see available blocks,
   then read **2–3 blocks from that listing**.  Every block you read
   must come from `libs/c2/blocks/` — **never from `libs/blocks/`**.
   The `libs/blocks/` directory is the legacy (non-C2) codebase and
   its patterns are incompatible.  If you catch yourself reading from
   `libs/blocks/`, stop and correct course.
   For each block you read, study:
   - Folder structure: `block-name/block-name.js` + `block-name.css`
   - How `init(el)` is structured and exported
   - CSS class namespacing conventions
   - How the JS interacts with the DOM
2. **Load `references/eds-patterns.md` now** — it covers EDS block
   anatomy, shared utilities, and CTA patterns.
3. Read `libs/c2/styles/styles.css` and extract every CSS custom
   property.  Pay special attention to `--s2a-` prefixed tokens —
   these are the design-token source of truth.
   **Load `references/design-tokens.md` now** for the full mapping rules.
4. Read `libs/utils/decorate.js` to understand `decorateBlockText`,
   `decorateTextOverrides`, and the viewport content parser
   (`decorateViewportContent`).
   **Load `references/viewport-content.md` now** — but only if the
   block's authored DOM contains `mobile-viewport`, `tablet-viewport`,
   or `desktop-viewport` keywords.  If it does not, skip this reference.
5. Read `libs/utils/utils.js` for `createTag` and any other helpers.
6. Skim `libs/c2/blocks/section-metadata/section-metadata.css` for
   the grid/container system.
   **Load `references/grid-system.md` now.**

---

## Phase 3 — Read Figma designs

Use the **Figma MCP** to retrieve each provided frame URL.
For each frame, extract:

- Layout structure (flex / grid, direction, gaps, padding, margins)
- Typography (font family, size, weight, line height, letter spacing)
- Colours — match against `--s2a-` CSS variables.  Always prefer a
  matching variable over a hardcoded value.
- Spacing — match against spacing tokens.
- Imagery, iconography, and decorative elements
- Stacking and element ordering — pay close attention to whether
  elements are **stacked vertically** or placed **side-by-side**.
  Figma layers from top to bottom often mean vertical stacking, not
  horizontal.  When in doubt, check the Figma auto-layout direction.

If multiple frames are provided, explicitly note layout differences
between breakpoints — these drive your CSS overrides.

### Cache Figma frames to disk

After retrieving each frame, **save the Figma frame image** to a local
cache directory so it remains available during Phase 5 even if the
Figma MCP session expires:

```
/tmp/build-block-figma/
  mobile.png
  tablet.png
  desktop.png
  hd.png
```

Use Playwright MCP or shell commands to write the images.  Phase 5
should read from this cache instead of re-fetching from Figma.

### Build a per-breakpoint element inventory

After reading all Figma frames, compile a **comparison table** that
lists every visible element at each breakpoint.  This is essential
for catching cross-viewport omissions.  Example format:

```
Element         | Mobile | Tablet | Desktop | HD
─────────────────────────────────────────────────
Heading         | ✓      | ✓      | ✓       | ✓
Body text       | ✓      | ✓      | ✓       | ✓
CTA button      | ✓      | ✓      | ✓       | ✓
Hero image      | ✓      | ✓      | ✓       | ✓
Background      | solid  | gradient| gradient| gradient
```

If an element (especially media — images, video, icons) appears in
**any** Figma frame, explicitly flag which breakpoints include it and
which do not.  Carry this inventory forward into Phase 4 as a
checklist — the implementation must match element presence per
breakpoint exactly.

---

## Phase 4 — Build the component

### Check out the working branch (remote-branch-mode only)

Skip this section if `remote-branch-mode` is `false` (localhost).

**Load `references/remote-branch-workflow.md` section 3 now** and
follow steps 1-2 only (fetch and check out the temporary local
branch from the upstream feature branch). Do **not** commit or push
yet. All file creation and editing below happens on this temporary
branch.

### Create block files

Create files at:
- `libs/c2/blocks/<name>/<name>.js`
- `libs/c2/blocks/<name>/<name>.css`

### Register the block in the C2 block list

Open `libs/utils/utils.js` and find the `C2_BLOCKS` array (or
similarly named constant that lists known C2 block names).  Add
the new block's kebab-case name to this list.  **This step is
mandatory** — without it, the EDS block loader will not find the
block under `libs/c2/blocks/` and will fall back to `libs/blocks/`,
which is exactly the failure we need to prevent.

### JS and CSS rules + acceptance criteria

**Load `references/acceptance-criteria.md` now.** It contains all JS
rules (init pattern, utility re-use, viewport content, media parity),
CSS rules (mobile-first, media-query syntax, token usage), and both
quality checklists. Follow every item during implementation.

### Lint and fix

Run ESLint on the newly created files before proceeding:

```bash
npx eslint libs/c2/blocks/<name>/<name>.js --fix
```

If errors remain after `--fix`, resolve them manually.  Do not
move to Phase 5 until the block's JS passes ESLint with zero
errors.

### Commit and push (remote-branch-mode only)

Skip this section if `remote-branch-mode` is `false` (localhost).

Complete the remaining steps from `remote-branch-workflow.md`
section 3 (steps 3-4): commit the block's JS, CSS, and
`libs/utils/utils.js`, push to the feature branch, then clean up
the temporary local branch.

---

## Phase 5 — Visual comparison loop

### 5a. Refresh DA preview (localhost only)

Skip this section if `remote-branch-mode` is `true`.

If you modified the DA HTML at any point (e.g. adding metadata in
Phase 1), force-refresh the preview so the dev server picks up the
new content:

```bash
curl -s -X POST \
  "https://admin.hlx.page/preview/<org>/<repo>/main/<page-path>"
```

### 5b. Construct the Playwright URL

**Localhost mode:** use the page URL as-is.

**Remote-branch-mode:** append `?milolibs=<branch-name>` to the
page URL:

```
<page-url>?milolibs=<branch-name>
```

Example:
```
https://main--<repo>--<org>.aem.live/drafts/<your-ldap>/test-page?milolibs=base-card-autogenerated
```

This URL is referred to as the **Playwright URL** in all subsequent
steps and agents.

### 5c. Force-refresh after code push (remote-branch-mode only)

Skip this section if `remote-branch-mode` is `false`.

Follow the CDN force-refresh procedure in
`references/remote-branch-workflow.md` section 4.

### 5d. Pre-flight check

Before taking any screenshots, navigate to the Playwright URL
(constructed in 5b) and verify the block actually loaded.  Run a JS
evaluation on the page:

1. Check that `document.querySelector('.<block-name>')` exists.
2. Check `data-block-status` equals `"loaded"`.
3. Check that the expected decorated classes are present (e.g.
   `.foreground`, `.media`, or whatever your `init()` adds).
4. Check browser console for block-loading errors (403/404 on the
   block's JS or CSS files).

**Common failures and fixes:**
- **Block JS 404/403** from the site path (e.g. `/upp/blocks/...`
  instead of `/libs/c2/blocks/...`): the `foundation: c2` meta tag
  is missing from the page, or the block name is not in the
  `C2_BLOCKS` array in `utils.js`.
- **Block loads on first visit but fails on reload**: browser HTTP
  cache is serving stale `utils.js` without the new `C2_BLOCKS`
  entry.  Ensure the Playwright `page.route()` cache bypass from
  `remote-branch-workflow.md` section 4b is active, then reload.
- **`data-block-status` is null**: the block JS was never fetched.
  Check the network/console for the root cause before proceeding.
- **(Remote-branch-mode) 404 on feature branch files**: the CDN
  may not have indexed the new files yet.  Trigger per-file code
  preview as described in `remote-branch-workflow.md` section 4a,
  wait 10-15 seconds, then reload.

Do **not** proceed to screenshots until the pre-flight check passes.

### 5e. Visual comparison

**Load `agents/visual-comparison.md` now** — it defines what to
assess (layout, spacing, colour, media) and how to identify fixes.

For each provided breakpoint, screenshot the component and compare
against the cached Figma frame.  Maximum **5 passes** total across
all breakpoints. Stop early if fidelity is high.

**What counts as one pass:**

- **Localhost mode**: identify issues → fix locally → reload →
  re-screenshot.
- **Remote-branch-mode**: identify issues → fix locally → batch
  with other fixes until high-confidence → push (section 3) →
  force-refresh (section 4) → re-screenshot. A single pass may
  contain multiple fixes but counts as one pass toward the limit.
  See `references/remote-branch-workflow.md` section 5 for the
  batching criteria.

**Important**: only after the visual loop is complete, proceed to
Phase 6 and Phase 7.  Do not run accessibility or performance checks
during visual iteration.

---

## Phase 6 — Accessibility audit

**Load `agents/accessibility-check.md` now** and follow its procedure.

Run axe-core against the block's container element.  Fix any WCAG 2.2 AA
violations found.  If fixes require code changes **and
`remote-branch-mode` is `true`**, push via
`references/remote-branch-workflow.md` section 3, then
force-refresh per section 4.
Report the subagent's **Obstacles Encountered** section in the
final summary.

---

## Phase 7 — Performance audit

**Load `agents/performance-check.md` now** and follow its procedure.

Run a Lighthouse audit against the Playwright URL.  Assess LCP
impact and flag any regressions.  If fixes require code changes
**and `remote-branch-mode` is `true`**, push via
`references/remote-branch-workflow.md` section 3, then
force-refresh per section 4.
Report the subagent's **Obstacles Encountered** section in the
final summary.

---

## Phase 8 — Summary

Output:

1. **Component name** and file paths created.
2. **Feature branch** (remote-branch-mode only) — branch name, repo,
   and number of commits pushed.
3. **Breakpoints implemented** and which Figma frames they correspond to.
4. **CSS variables used** — list every `--s2a-` token referenced.
5. **Hardcoded values** — any Figma values with no matching token,
   with an explanatory comment in the CSS.
6. **Acceptance criteria checklist** — confirm each criterion from
   Phase 4 passes (or note exceptions with reasoning).
7. **Accessibility results** — axe-core summary + any remaining issues.
8. **Performance results** — Lighthouse score, LCP, CLS, INP, TBT.
9. **Obstacles Encountered** — aggregated from all subagents, including
   visual discrepancies the user should review manually.

### Next steps (remote-branch-mode only)

After presenting the summary, suggest the user's likely next
actions:
- **Open a PR** from `<branch-name>` into `stage` for code review.
- **Test in context** at `<page-url>?milolibs=<branch-name>`.
- **Delete the feature branch** if the code was exploratory.

### Cleanup

After presenting the summary, ask the user whether to remove the
`.playwright-mcp` folder and the `/tmp/build-block-figma/` cache
created during the run.  If the user confirms, delete both:

```bash
rm -rf .playwright-mcp /tmp/build-block-figma
```

If the user declines, leave them in place.
