# Preflight Content Diff — Design

- **Ticket:** [MWPW-199318](https://jira.corp.adobe.com/browse/MWPW-199318) — *Automatic highlighting of unpublished content on preview page*
- **Epic:** [MWPW-197394](https://jira.corp.adobe.com/browse/MWPW-197394) — Fruitbasket (Pre-flight capability area)
- **Reporter:** Danni Holmes · **Assignee:** Sino Kholkhojaev
- **Date:** 2026-08-04 (revised 2026-08-05 after reviewing the reporter's attached screenshot)
- **Status:** Approved — ready for implementation

---

## 1. Problem & user story

> As an author or production lead, I want visibility of the unpublished content on a page so that I
> can clearly identify what will be pushed live before publishing.

Multiple producers touch the same page in overlapping timeframes (global vs regional projects). Staged
changes that shouldn't go live yet must be clearly identifiable when viewed on preview. Today authors
either publish blind or reach for the external **Milo All-in-one** browser extension's *compare → live*
feature — a multi-click manual tool. This brings that capability natively into Milo preflight.

### Functional acceptance (from ticket) and how this design meets it

1. **"No action to view; the diffcheck happens as part of preview generation."** → We compute the diff
   automatically on the sidekick `previewed` event and surface a nudge; the compare view opens in one click.
2. **"Author can switch the highlight off/on for an undisturbed view of the content."** → Highlights live
   *inside the compare view* (per-category toggles), never on the real page. The reporter's screenshot
   confirms this: the toggles are "Content Changes" / "Metadata Changes" in the compare toolbar.
3. **"Stage does not show the differences."** → The compare view is a preflight modal tool; it never
   annotates the actual rendered page, so no environment shows diffs on the page itself. Practically: run
   the auto-compute + nudge in the authoring/preview context (`aem.page`); compare against `aem.live`.

### Reference UX — the reporter's screenshot (authoritative)

Danni attached a screenshot of the extension's *compare* view. It is the target UX and it drove the
revisions in this spec. What it shows:

- **A true side-by-side of two rendered pages**, with a **Live vs Preview** label and a **viewport
  switcher** (mobile / tablet / laptop / desktop) in the top toolbar.
- **Two diff categories as toolbar toggles: "Content Changes" and "Metadata Changes."**
- **A change-list panel** down the left: each entry tagged **Modified / Added / Deleted** with an
  **XPath-style location** (e.g. `//main/div[1]/div[2]/p[1]/text()[1]`).
- **Highlights painted on the rendered content in each pane** — modified text runs in one colour, an added
  link underlined in another — i.e. **node/element-level**, not coarse block-level.

---

## 2. Context & prior art

### 2.1 The existing Milo preflight already implements ~80% of the plumbing — narrowly

Milo preflight (`libs/blocks/preflight/`) is a sidekick-launched modal with a panel + check architecture.
The exact pattern this ticket needs already exists, but only for M@S fragments:

| Capability needed | Exists today | Location |
|---|---|---|
| Detect unpublished content | `checkUnpublishedFragments` (per-fragment publish probe) | `checks/merch.js:20-68` |
| On-page highlight + "Not published" ribbon | `preflight-mas-unpublished` class | `panels/merch.js:101-116`, `preflight.css:1778-1806` |
| Scroll / jump to element | `getBlockLocation` / `scrollToElement` | `panels/merch.js:53-57` |
| Auto-run on preview generation | `previewed` / `published` sidekick listeners | `utils/preflight-notification.js:14-25` |
| Notification nudge | `.milo-preflight-overlay` banner + "review" button | `utils/preflight-notification.js:51-87` |
| Toggle via body class | `body.preflight-assets-analysis` pattern | `visual-metadata.js`, `panels/assets.js:269` |
| Telemetry to milo-logs | `captureMetrics` → `/preflight-logs` | `checks/captureMetrics.js` |
| preview↔live URL derivation | `aem.page`→`aem.live` rewrite | `checks/seo.js:291-292` |
| admin status (preview/live lastModified **+ lastModifiedBy**) | `getStatus` / `getAdminUrl` | `panels/general.js:78-115` |
| Add a check + panel | 4 hand-wired touch points | `preflightApi.js:36-68`, `preflight.js:33-147` |

**The gap** is narrow: generalize from *"is this one fragment published? (yes/no)"* to *"diff the whole
preview vs live and classify every node as added / modified / removed,"* across both **content** and
**metadata**, and render it side by side.

Note Danni's third example — content that didn't publish (separate fragments, assets) — is exactly the
existing unpublished-fragment signal. The content diff should **surface that existing merch signal too**,
not just structural text differences (a referenced-but-unpublished fragment can look identical in
`.plain.html` yet be unpublished on live).

### 2.2 Forge decision — self-contained, compose later (do not depend)

The archived Forge engine (MWPW-199219) reorganized into 7 areas. The relevant ones:

- **Review & Collaboration (MWPW-201255)** — *"comment-on-a-page as a service"* (human review threads;
  `pc_*` tables, `@adobe/annotations-core`, SSE). **Not** an automated content-diff engine. Milo already
  integrates it via the `custom:annotations` sidekick event + `?pcThread=` param (`utils/sidekick.js:30`).
- **Design Fidelity (MWPW-202795)** — has a *"Render diff,"* but that is **design-vs-generated-output**
  (Figma → rendered PNG diff), a different problem.
- **Verification & Governance (MWPW-202798)** — CI gates / FQS evals. Not relevant.

Ayub Kadkly's Forge-overlap mapping in the epic comment listed ~20 tickets that duplicate Forge;
**MWPW-199318 was not among them.** This is correctly net-new and belongs in Milo preflight.

**Decision:** build self-contained in Milo preflight. Keep the diff output as clean structured data so a
future "comment on this changed node" action can hand off to Forge's annotations service via the existing
`custom:annotations` seam — the two compose (diff detection vs review conversation); they don't merge.

---

## 3. Goals & non-goals

### Goals

- On preview generation, automatically compute what differs between the page's **preview** and **live**
  versions, at **node/element level**, classified added / modified / removed — for **content** and for
  **metadata**.
- Surface a non-intrusive nudge with a change count when there are unpublished changes.
- Provide an on-demand **rendered side-by-side compare view** in preflight (live | preview) with:
  - per-node highlights (green added / amber modified / red removed) painted in the panes,
  - a change-list with type + location and click-to-jump (both panes scroll),
  - **Content Changes / Metadata Changes** toggles,
  - a header showing **live vs preview last-modified user + timestamp** (serves the "coordinate with
    whoever touched it" use case).
- Emit diff metrics to milo-logs (feeds the Preview-activity view).
- Live entirely within `libs/blocks/preflight/`, following existing conventions.

### Non-goals (YAGNI)

- **Viewport switcher** (mobile/tablet/desktop in the compare) — deferred; nice-to-have, not core.
- No server/edge-computed diff artifact in v1 (the `fetchVersions` boundary makes it a later drop-in).
- No cross-page or site-wide diff; single page only.
- No pixel/visual regression diff (that is Design Fidelity's render-diff).
- No dependency on Forge's annotations service.

---

## 4. Architecture

Isolated, independently-testable units plus a rendered compare panel.

```
previewed event / manual open
        │
        ▼
┌─────────────────────┐   fetch .plain.html (preview + live)
│  fetchVersions(url)  │   + admin status (lastModified/By pre-gate)
└─────────┬───────────┘
          │  { preview, live, previewStatus, liveStatus }
          ▼
┌──────────────────────────┐  pure, DOM in → change list out
│ diffContent(pRoot, lRoot) │  → node-level { added, modified, removed }
│ diffMetadata(pMeta,lMeta) │  → key-level  { added, modified, removed }
└─────────┬────────────────┘
          │
          ├────────────► checks/diff.js  runChecks()  → preflight result + counts
          │                                   ├─► captureMetrics (milo-logs)
          │                                   └─► notification nudge ("N changes vs live")
          │
          └────────────► panels/diff.js  rendered side-by-side compare (on demand)
                              ├─ Content Changes tab (node highlights + list)
                              ├─ Metadata Changes tab (key-value diff)
                              └─ header: live vs preview last-modified-by + time
```

### 4.1 `checks/diff/fetchVersions.js` — content acquisition

```
fetchVersions(url) → {
  preview:      { html },              // .plain.html of the current (preview) page
  live:         { html } | null,       // null when live 404s (brand-new page)
  previewStatus:{ lastModified, lastModifiedBy } | null,
  liveStatus:   { lastModified, lastModifiedBy } | null,
}
```

- Derives the live URL from the preview URL (`aem.page`→`aem.live`, `hlx.page`→`hlx.live`), reusing
  `checks/seo.js:291-292`.
- Reads admin `status` (reusing `getAdminUrl`/`getStatus` from `panels/general.js:78-115`) for the
  **cheap pre-gate** (skip if preview not newer than live) **and** the last-modified user/time shown in
  the compare header.
- Fetches `.plain.html` for both versions.
- Error handling: live 404 → `live: null` (all content is "added"); auth/network error → returns a flag so
  the check resolves to `limbo`; never throws.

### 4.2 `checks/diff/diffContent.js` — content diff engine (pure, DOM tree diff)

```
diffContent(previewRoot, liveRoot) → {
  added:    [ Change ],
  modified: [ Change ],
  removed:  [ Change ],
  unchanged: <number>,
}
Change = { type, path, key, previewNode?, liveNode?, text? }
```

- Operates on the two `.plain.html` DOM trees (`main`). Walks both, aligning children at each level by a
  **stable key** (tag + normalized-text hash + position), recursing into matched elements. Produces
  **node/element-level** changes — down to text runs, links, images — each with an **XPath-style `path`**
  relative to `main` (matching the reporter's change-list format) and a `key` for matching.
- Keyed matching so a *moved* node is not reported as delete+add.
- Pure and deterministic: takes DOM nodes, returns a plain object. Tested by building DOM from fixture
  `.plain.html` strings (browser DOM under Web Test Runner). No network, no rendering.
- **Also folds in the unpublished-fragment signal**: reuse `checks/merch.js checkUnpublishedFragments` so a
  referenced-but-unpublished fragment is reported as a change even when the markup is structurally identical.

### 4.3 `checks/diff/diffMetadata.js` — metadata diff (pure)

```
diffMetadata(previewMeta, liveMeta) → { added:[Kv], modified:[Kv], removed:[Kv] }
Kv = { key, previewValue?, liveValue? }
```

- Compares the page's metadata key-values (the authored `.metadata` block in `.plain.html`, plus
  title/description). Small, pure, fixture-tested.

### 4.4 `checks/diff.js` — preflight check wrapper

- `runChecks({ area, url })` calls `fetchVersions` + `diffContent` + `diffMetadata` and returns a standard
  preflight result: `{ name: 'Content Diff', status, severity: SEVERITY.WARNING, details: { content:
  {added,modified,removed}, metadata: {...}, status: {previewStatus, liveStatus} } }`.
- Registered in `preflightApi.js` default export (`:36-68`) and `getPreflightResults` (`:105-163`) as a new
  `diff` category, so it participates in caching, the `previewed` recompute, and metrics.

### 4.5 `panels/diff.js` — rendered side-by-side compare view

Both panes are **same-origin DOM we fully control** — no iframes, so no `X-Frame-Options`/CSP framing risk:

- **Preview pane** = a clone of the current page's `main` (already rendered — we are on the preview page).
- **Live pane** = the fetched live `.plain.html` mounted in a scoped container and decorated via Milo's own
  `loadArea` so it renders faithfully. Scoped to `main` (no global nav/footer/analytics).
- **Toolbar** with **Content Changes / Metadata Changes** toggles (the reporter's UX) and a **header**
  showing live vs preview **last-modified-by + timestamp**.
- **Content tab:** node highlights painted in both panes by resolving each change's `path` to the element
  in each rendered pane (spike — see §9); classes `preflight-diff-added` (green), `preflight-diff-modified`
  (amber), `preflight-diff-removed` (red, live pane only). Modified text runs get a wrapping span to
  highlight the exact text (as the screenshot shows). Change-list with type + path; clicking scrolls both
  panes (reuse `getBlockLocation`/`scrollToElement` from `panels/merch.js`).
- **Metadata tab:** a key-value table of added/modified/removed metadata (preview vs live values).
- **Toggle** (acceptance #2): the per-category toggles turn the highlight overlays on/off; a
  `body.preflight-diff-active` class + `localStorage` persist the on/off state.

**Fallback (documented, not v1 default):** if decorating live content in a container has unacceptable side
effects, fall back to dual iframes + a small Milo-side `postMessage` highlight agent gated by
`?preflightCompare=1`. Decided by the §9 spike.

---

## 5. Integration points (all existing hooks)

- **Check registry:** add `diff` to `preflightApi.js` default export and `getPreflightResults`.
- **Panel registration (`preflight.js`):** the 4 touch points — import (`:6-12`), tab descriptor (`:33-41`),
  `setPanel` case (`:128-147`), optional badge count (`:55-96`).
- **Auto-run:** extend the existing `previewed` listener (`preflight-notification.js:14-25`) to compute the
  diff and, when changes exist, surface *"N changes vs live — Compare"* whose button opens the diff panel.
- **Telemetry:** extend `captureMetrics.js` `ID_TO_COLUMN` + `contextData` with
  `diff_content_added/modified/removed_count` and `diff_metadata_changed_count` → milo-logs.

---

## 6. Environment gating ("stage does not show")

Reporter/assignee mapping: **`aem.page` = preview (stage), `aem.live` = live.** Because the compare is a
preflight **modal** tool that never annotates the actual rendered page, acceptance #3 is satisfied by
construction — no viewer of either page sees diff highlights on the page. The only gating:

- Auto-compute + nudge run only in the authoring/preview context (`*.aem.page`), reusing the hostname gate
  idiom at `scripts/delayed.js:111-126`. On `aem.live` (what stakeholders view), the sidekick/preflight
  isn't present for regular viewers anyway, so nothing shows.

---

## 7. Edge cases & error handling

- **Brand-new page (live 404):** `live: null` → all nodes reported "added"; live pane shows an empty state.
- **Identical content + metadata:** zero changes → no nudge; panel shows "No unpublished changes."
- **Auth / network failure:** check resolves to `limbo`; panel shows a retry state; never throws.
- **Large pages:** run `diffContent` in `requestIdleCallback`; the rendered compare is on demand only.
- **Fragments / merch hydration in the live pane:** decorating live content triggers real fragment/commerce
  hydration; acceptable for a compare tool; scope decoration to `main`.
- **Reordered nodes:** matched by key → unchanged (or a distinct "moved" class if cheap), not add+remove.
- **Decoration noise:** because both panes are decorated identically, matching content yields matching
  decorated structure; the spike validates that diff noise from decoration is acceptable (fallback: diff the
  `.plain.html` trees and map to panes by structural path).

---

## 8. Testing strategy

- **`diffContent` (pure) unit tests** — build DOM from `.plain.html` fixtures: identical, added node,
  removed node, modified text run, added link/image, reordered, brand-new-page (no live). Highest value.
- **`diffMetadata` (pure) unit tests** — added/modified/removed keys; title/description changes.
- **`fetchVersions` tests** — stubbed `fetch`: live 404, auth failure, network error, preview-not-newer
  pre-gate, last-modified parsing.
- **`panels/diff.js` test** (merch/assets pattern in `test/blocks/preflight/panels/`): both panes mount,
  correct highlight classes per change, Content/Metadata toggle, click-to-jump, last-modified header.
- Conventions: Web Test Runner + Chai `expect` + Sinon; dynamic import; fixtures via `readFile`.

---

## 9. Risks & spikes

1. **Live-pane rendering + node highlight mapping (primary risk, spike FIRST).** Confirm: decorate fetched
   `.plain.html` via `loadArea` in a scoped container, and that each change `path` resolves to the right
   element in each rendered pane for highlighting. Fallback: dual iframes + `postMessage` agent (verify
   `X-Frame-Options`/CSP on `aem.live` first).
2. **Diff granularity / noise.** Validate the node-level tree diff yields the reporter's fidelity
   (text-run, link, image) without decoration noise; validate the stable-key scheme on reordered/duplicated
   nodes.
3. **Performance** on very large pages — measure `diffContent`; move to idle/worker if needed.

---

## 10. Build order (TDD)

**Increment 1 — engine + wiring (console-demoable, no UI):**
1. `diffContent` — failing fixture tests first, then implement node-level tree diff.
2. `diffMetadata` — failing tests, then implement.
3. `fetchVersions` — stubbed-fetch tests, then implement (URL derive + status pre-gate + `.plain.html`).
4. `checks/diff.js` — wire the above into the result shape; register in `preflightApi.js`; extend
   `captureMetrics`; hook the `previewed` nudge. **Milestone: diff logged/nudged on preview, no panel yet.**

**Increment 2 — the compare panel:**
5. **Spike the live-pane render + highlight mapping** (§9) before building the panel body.
6. `panels/diff.js` — side-by-side, Content + Metadata tabs, node highlights, change-list + click-to-jump,
   last-modified header; register the 4 `preflight.js` touch points; panel test.

**Increment 3 — polish:** sync-scroll, empty/loading/error/retry states, CSS, toggle persistence.
(Deferred: viewport switcher.)

---

## 11. Open questions

- None blocking. Viewport switcher intentionally deferred (§3). Live-pane rendering resolved by the §9 spike
  at the start of Increment 2.
