# Preflight Content Diff — Increment 2 (Compare Panel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add the rendered side-by-side "compare to live" view to preflight — the UX from the reporter's screenshot: two rendered panes (live | preview), per-node green/amber/red highlights, a change list with jump-to, Content/Metadata tabs, and a last-modified header.

**Architecture (Approach B — stable keys):** A new `panels/diff.js` (htm-preact, module-level signals) renders BOTH panes symmetrically from their `.plain.html` via Milo's `loadArea(area)` (confirmed in the Inc-1 spike to decorate a detached area without global side effects). Before decorating each pane, every content node is stamped with `data-diff-key = getXPath(node, main)` — the SAME address the Inc-1 `diffContent` already records per change. Highlighting then resolves by attribute (`[data-diff-key="…"]`), so it's immune to the DOM reshaping decoration does (links→buttons, `img`→`picture`, injected wrappers). Consumes the Inc-1 engine results — no new diffing logic.

**Why B:** the stamp-before-decorate key removes the one real risk (post-decoration index drift causing a silently-wrong highlight) and keeps engine and panel decoupled through an explicit id. See the design note in the Inc-1 spec §9.

**Tech Stack:** Milo `htm-preact` (signals/useEffect), `loadArea`/`getXPath` from existing code, Web Test Runner + `@esm-bundle/chai` + `sinon`. No new runtime deps.

## Global Constraints

- All new code under `libs/blocks/preflight/`. No new runtime dependencies.
- Reuse the Inc-1 engine result (`getPreflightResults().runChecks.diff[0].details` = `{ content:{added,modified,removed}, metadata, unpublishedFragments, status, skipped }`). Each content change already carries a `path` (from `getXPath`). Do NOT re-diff.
- Both panes are same-origin DOM (no iframes), each rendered from its `.plain.html` via `loadArea(container)`, and each content node stamped with `data-diff-key = getXPath(node, main)` BEFORE `loadArea`. Reuse `getXPath` from `checks/diff/nodePath.js` — do not reimplement.
- Highlight by attribute lookup `[data-diff-key="<change.path>"]`, never by re-walking indices on the decorated tree.
- Match existing preflight patterns: `panels/merch.js` for on-page highlight (`classList.add`, `getBlockLocation`, `scrollToElement`) and `panels/general.js`/`assets.js` for panel structure (default-export htm-preact component, module-level `signal`, `useEffect(()=>{},[])`).
- **Commit subjects: plain imperative, NO `MWPW-` ticket prefix.** Keep the `Co-Authored-By:` trailer.
- Comment style: one short human line only on genuinely non-obvious logic; no narration.
- The panel renders inside the modal and never annotates the real page (satisfies "stage doesn't show differences").
- Tests mirror `test/blocks/preflight/panels/*.test.js`; pre-commit hook lints staged files (airbnb; `max-len` disabled repo-wide; single quotes; `i += 1`).

---

### Task 1: Panel skeleton + registration

**Files:** Create `libs/blocks/preflight/panels/diff.js`; Modify `libs/blocks/preflight/preflight.js` (4 touch points); Test `test/blocks/preflight/panels/diff.test.js`.

**Interfaces:** Produces `export default function DiffPanel()` — on mount (`useEffect`) calls `getPreflightResults({ url: window.location.href })`, stores `results.runChecks.diff[0].details` into a module `signal`; renders loading → empty ("No unpublished changes") → panes placeholder.

- [ ] **Step 1: Failing test** — render `DiffPanel`; assert a `.preflight-diff` root + a loading indicator initially.
- [ ] **Step 2: Run** `npx wtr test/blocks/preflight/panels/diff.test.js --node-resolve` → FAIL (missing module).
- [ ] **Step 3: Implement** skeleton + the 4 `preflight.js` touch points: import; `ICONS.diff`; add `{ title: 'Content Diff', desc: 'Compare preview vs live', icon: ICONS.diff }` to `tabs`; `setPanel` case returning `html\`<${DiffPanel} />\``.
- [ ] **Step 4: Run** the file test → PASS; full preflight suite `npx wtr "test/blocks/preflight/**/*.test.js" --node-resolve` → green.
- [ ] **Step 5: Commit** — `add Content Diff preflight tab skeleton`.

---

### Task 2: Render both panes + stamp keys (`diff-render.js`)

**Files:** Create `libs/blocks/preflight/panels/diff-render.js`; Test `test/blocks/preflight/panels/diff-render.test.js`.

**Interfaces:**
- Consumes: `loadArea` (`utils.js`), `getXPath` (`checks/diff/nodePath.js`).
- Produces: `stampKeys(main) → void` (walk the same content nodes `diffContent` uses — `p,h1..h6,li,a,img,button,blockquote` — set `el.dataset.diffKey = getXPath(el, main)`); `async renderPane(plainHtml, { decorate = loadArea } = {}) → HTMLElement` (parse `.plain.html` to a detached container's `main`, `stampKeys(main)`, `await decorate(container)`, return it). `decorate` is injectable so tests don't need the full Milo runtime.

- [ ] **Step 1: Failing test** — `renderPane('<main><div><p>hi</p></div></main>', { decorate: fakeDecorate })` resolves to an element whose `<p>` carries a `data-diff-key`; assert the key equals `getXPath` of that node; assert **the key survives the (fake) decorate step** (fake decorate wraps the `<p>` in a div → key still queryable via `[data-diff-key]`). This is the core Approach-B guarantee.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `stampKeys` + `renderPane`.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `render compare panes and stamp stable diff keys`.

---

### Task 3: Highlight by key + jump-to (`diff-highlight.js`)

**Files:** Create `libs/blocks/preflight/panels/diff-highlight.js`; Modify `libs/blocks/preflight/preflight.css`; Test `test/blocks/preflight/panels/diff-highlight.test.js`.

**Interfaces:**
- Consumes: diff `details` (each change has `path`, `type`); the two stamped panes from Task 2.
- Produces: `applyHighlights(previewPane, livePane, diff)` — for each change, `pane.querySelector('[data-diff-key="' + CSS.escape(change.path) + '"]')` and add `preflight-diff-added` (green, preview pane), `preflight-diff-modified` (amber, both panes), `preflight-diff-removed` (red, live pane only); `scrollToChange(pane, change)` reusing the `getBlockLocation`/`scrollToElement` idiom from `merch.js`.

- [ ] **Step 1: Failing test** — build two panes with known `data-diff-key`s + a diff object; assert `applyHighlights` puts the right class on the right element per pane (added→preview only; removed→live only; modified→both). Include a change whose element was wrapped by decoration to prove attribute lookup still finds it.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**; add CSS to `preflight.css` mirroring the `preflight-mas-unpublished` ribbon (`::before` "New"/"Changed"/"Removed", green/amber/red outline), design tokens, logical properties, scoped to `.preflight-diff`.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `highlight changed nodes by stable key in compare panes`.

---

### Task 4: Change list + Content/Metadata tabs + last-modified header

**Files:** Modify `libs/blocks/preflight/panels/diff.js`, `preflight.css`; Test extend `diff.test.js`.

**Interfaces:** Consumes `details.content`, `details.metadata`, `details.status`. Produces the Content/Metadata toggle (the reporter's two tabs), a change list (type badge + path + click→`scrollToChange` on both panes), and a header "Live: <lastModifiedBy> · Preview: <lastModifiedBy>".

- [ ] **Step 1: Failing test** — with stubbed `details`: change list renders one row per change with the right badge; clicking a row invokes the scroll handler; Metadata tab lists key/value changes; header shows both last-modified values.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** list, tabs, header; Content tab = two panes + list, Metadata tab = key/value diff table.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `add compare change list, metadata tab, and last-modified header`.

---

### Task 5: Polish — toggle persistence, sync-scroll, states

**Files:** Modify `libs/blocks/preflight/panels/diff.js`, `preflight.css`; Test extend `diff.test.js`.

- [ ] **Step 1: Failing test** — highlight on/off toggle persists to `localStorage` and re-reads on mount; empty/error/retry states render.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the toggle (`body.preflight-diff-active` + `localStorage`), optional synchronized pane scrolling, and empty/loading/error/retry states. Where trivial, resolve the Inc-1 deferred double-fetch by reusing the diff result's `unpublishedFragments` rather than re-calling.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `add compare toggle persistence and empty/error states`.

---

## Increment 2 done — definition of done

- Opening the Content Diff tab renders live | preview side by side with per-node green/amber/red highlights (robust to decoration via `data-diff-key`), a jump-to change list, Content/Metadata tabs, and a last-modified header — the reporter's screenshot UX.
- Full preflight suite green; feature demoable end-to-end via `?milolibs=`.

## Self-Review

- **Spec coverage:** rendered side-by-side (T2), robust node highlights (T3), change list + jump-to (T4), Content+Metadata tabs (T4), last-modified header (T4), toggle (T5). Approach-B key survival is asserted in T2 Step 1. ✅
- **Placeholder scan:** every task has concrete test + impl steps; the one prior unknown (post-decoration mapping) is designed out by B, not deferred. ✅
- **Type consistency:** `stampKeys`/`renderPane`/`applyHighlights`/`scrollToChange` signatures and the `data-diff-key`↔`change.path` contract are consistent across T2–T4. ✅
