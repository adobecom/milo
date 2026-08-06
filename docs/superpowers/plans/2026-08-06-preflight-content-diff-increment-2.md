# Preflight Content Diff — Increment 2 (Compare Panel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. **Task 1 is a spike — a browser validation, not TDD; it gates the concrete approach for Tasks 3–4.**

**Goal:** Add the rendered side-by-side "compare to live" view to preflight — the UX from the reporter's screenshot: two rendered panes (live | preview), per-node green/amber/red highlights, a change list with jump-to, Content/Metadata tabs, and a last-modified header.

**Architecture:** A new `panels/diff.js` (htm-preact, module-level signals) renders both panes as same-origin DOM: the **preview pane** is a clone of the current page's `main`; the **live pane** is the fetched live `.plain.html` mounted in a scoped container and decorated via Milo's `loadArea(area)` (confirmed in the Increment-1 spike to decorate a detached area without global side effects). Highlights are applied by resolving each change's XPath `path` (from the Increment-1 `diffContent`) to the element in each pane. Consumes the Increment-1 engine (`checks/diff.js` results) — no new diffing logic.

**Tech Stack:** Milo `htm-preact` (signals/useEffect), `loadArea` from `utils.js`, Web Test Runner + `@esm-bundle/chai` + `sinon`, Playwright (spike only). No new runtime deps.

## Global Constraints

- All new code under `libs/blocks/preflight/`. No new runtime dependencies.
- Reuse the Increment-1 engine: the `diff` check result (`{ content:{added,modified,removed}, metadata, unpublishedFragments, status, skipped }`) via `getPreflightResults`. Do NOT re-diff.
- Both panes are same-origin DOM (no iframes). Live pane via `loadArea(container)` on the fetched `.plain.html`.
- Match existing preflight panel patterns: `panels/merch.js` for on-page highlight (`classList.add`, `getBlockLocation`, `scrollToElement`) and `panels/general.js`/`assets.js` for panel structure (default-export htm-preact component, module-level `signal(...)`, `useEffect(()=>{},[])`).
- **Commit message subjects: plain imperative, NO `MWPW-` ticket prefix.** Keep the `Co-Authored-By:` trailer.
- Comment style: one short human line only on genuinely non-obvious logic; no narration.
- Env: the panel opens wherever preflight opens; it renders inside the modal and never annotates the real page (satisfies "stage doesn't show differences").
- Tests mirror `test/blocks/preflight/panels/*.test.js`; the pre-commit hook lints staged files (airbnb: 100 max-len is disabled repo-wide, single quotes, `i += 1`, object-curly-newline 6+).

---

### Task 1: SPIKE — live-pane rendering + highlight-mapping validation (browser)

**Not TDD.** A time-boxed investigation that produces a findings note and a go/no-go. It de-risks Tasks 3–4.

**Files:**
- Create (throwaway, git-ignored): a scratch harness or Playwright script under `$CLAUDE_JOB_DIR/tmp/` — do NOT commit it.
- Produce: `docs/superpowers/specs/2026-08-06-live-pane-spike-findings.md` (committed).

**Questions to answer (each with evidence):**
- [ ] **Step 1:** On a real `*.aem.page` page (via `?milolibs=MWPW-199318-preflight-content-diff--milo--adobecom`), fetch the live `.plain.html`, mount it in a detached `div`, and call `loadArea(div)`. Confirm it decorates (sections get `.section`, blocks decorate) WITHOUT running global document side effects (no nav/footer/analytics, no `page-load-ok-milo`). Capture a screenshot.
- [ ] **Step 2:** Clone the current page's `main` into a second detached `div` (the preview pane). Confirm it renders as-is.
- [ ] **Step 3:** For a known changed element, compute its `getXPath(el, main)` on the preview clone, and confirm the SAME path resolves (via a matching walk) to the corresponding element in the decorated live pane — i.e. decoration preserves the content structure closely enough that path-based mapping works. Note any divergence (decoration-injected wrappers) and whether mapping needs to run on `.plain.html` roots instead of decorated roots.
- [ ] **Step 4:** Decide: **decorate-in-container** (primary) confirmed viable, or fall back to **dual iframes + postMessage highlight agent**. Record the decision + rationale in the findings doc.
- [ ] **Step 5:** Commit the findings doc. Message: `add live-pane rendering spike findings`.

**Deliverable:** findings doc with the go/no-go and, if "go", the confirmed mapping approach (decorated-root vs plain-html-root) that Tasks 3–4 will implement.

---

### Task 2: Panel registration + skeleton

**Files:**
- Create: `libs/blocks/preflight/panels/diff.js`
- Modify: `libs/blocks/preflight/preflight.js` (4 touch points)
- Modify: `libs/blocks/preflight/preflight.css` (tab icon if needed)
- Test: `test/blocks/preflight/panels/diff.test.js`

**Interfaces:**
- Produces: `export default function DiffPanel()` — htm-preact component; initially renders a container with a loading state and, on mount (`useEffect`), calls `getPreflightResults({ url: window.location.href })` and stores `results.runChecks.diff[0].details` into a module `signal`.

- [ ] **Step 1: Write the failing test** — render `DiffPanel` into a container, assert it mounts a `.preflight-diff` root and shows a loading indicator initially.

```js
import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import DiffPanel from '../../../../libs/blocks/preflight/panels/diff.js';

it('DiffPanel mounts with a loading state', () => {
  const el = document.createElement('div');
  render(html`<${DiffPanel} />`, el);
  expect(el.querySelector('.preflight-diff')).to.exist;
});
```

- [ ] **Step 2: Run** `npx wtr test/blocks/preflight/panels/diff.test.js --node-resolve` → FAIL (module missing).
- [ ] **Step 3: Implement** the skeleton `panels/diff.js` (module `signal`s for `details`/`loading`; `useEffect` fetching results; render loading → empty ("No unpublished changes") → placeholder for panes). Wire the 4 `preflight.js` touch points: import; add `ICONS.diff`; add `{ title: 'Content Diff', desc: 'Compare preview vs live', icon: ICONS.diff }` to the `tabs` signal; add the `setPanel` case `return html\`<${DiffPanel} />\``.
- [ ] **Step 4: Run** the test → PASS; run the full preflight suite `npx wtr "test/blocks/preflight/**/*.test.js" --node-resolve` → green (tab count updated).
- [ ] **Step 5: Commit** — `add Content Diff preflight tab skeleton`.

---

### Task 3: Render the two panes (`diff-render.js`)

**Files:**
- Create: `libs/blocks/preflight/panels/diff-render.js`
- Test: `test/blocks/preflight/panels/diff-render.test.js`

**Interfaces:**
- Consumes: `loadArea` from `utils.js`; the spike's confirmed mapping approach.
- Produces: `clonePreviewPane(main = document.querySelector('main')) → HTMLElement` (deep clone, tagged with `data-diff-key` per content node via `getXPath`); `async renderLivePane(liveHtml) → HTMLElement` (parse `.plain.html`, mount in a scoped `div`, `await loadArea(div)`, tag nodes with `data-diff-key`).

- [ ] **Step 1: Write the failing test** — `clonePreviewPane` returns a detached clone whose content nodes carry `data-diff-key`; `renderLivePane('<main>…</main>')` resolves to an element containing the decorated sections. (Stub `loadArea` via a `sinon` spy on the module or pass an injected decorator to keep it unit-testable; per the spike's guidance.)
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** per the spike's confirmed approach (decorate-in-container). Keep `loadArea` injectable (default import, overridable param) so the test doesn't need a full Milo runtime.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `render preview and live compare panes`.

---

### Task 4: Node highlighting + jump-to (`diff-highlight.js`)

**Files:**
- Create: `libs/blocks/preflight/panels/diff-highlight.js`
- Modify: `libs/blocks/preflight/preflight.css` (highlight classes)
- Test: `test/blocks/preflight/panels/diff-highlight.test.js`

**Interfaces:**
- Consumes: the diff `details` (each change has `path`, `type`); the two panes from Task 3.
- Produces: `applyHighlights(previewPane, livePane, diff)` — resolve each change `path` to the element in the relevant pane and add `preflight-diff-added` (green, preview), `preflight-diff-modified` (amber, both), `preflight-diff-removed` (red, live pane only); `scrollToChange(previewPane, livePane, change)` — scroll both panes to the change (reuse `getBlockLocation`/`scrollToElement` idiom from `merch.js`).

- [ ] **Step 1: Write the failing test** — build two small pane DOMs with known `data-diff-key`s + a diff object; assert `applyHighlights` adds the correct class to the correct element in each pane (added→preview only; removed→live only; modified→both).
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**; add CSS to `preflight.css` mirroring the `preflight-mas-unpublished` ribbon pattern (`::before` label "New"/"Changed"/"Removed", green/amber/red outline), using design tokens, logical properties, scoped to `.preflight-diff`.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `highlight changed nodes in compare panes`.

---

### Task 5: Change list + Content/Metadata tabs + last-modified header

**Files:**
- Modify: `libs/blocks/preflight/panels/diff.js`
- Modify: `libs/blocks/preflight/preflight.css`
- Test: extend `test/blocks/preflight/panels/diff.test.js`

**Interfaces:**
- Consumes: `details.content`, `details.metadata`, `details.status` (last-modified from Increment-1 `fetchVersions`).
- Produces: in-panel Content/Metadata toggle; a change list (type badge + path + click→`scrollToChange`); a header line "Live: <lastModifiedBy> · Preview: <lastModifiedBy>".

- [ ] **Step 1: Write the failing test** — with a stubbed diff `details`, assert: the change list renders one row per change with the right type badge; clicking a row calls the scroll handler; the Metadata tab lists key/value changes; the header shows both last-modified values.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the change list, the Content/Metadata tabs (the reporter's two toggles), and the last-modified header. Content tab shows the two panes + list; Metadata tab shows a key/value diff table.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `add compare change list, metadata tab, and last-modified header`.

---

### Task 6: Polish — toggle persistence, sync-scroll, states

**Files:**
- Modify: `libs/blocks/preflight/panels/diff.js`, `preflight.css`
- Test: extend `test/blocks/preflight/panels/diff.test.js`

- [ ] **Step 1: Write the failing test** — highlight on/off toggle persists to `localStorage` and re-reads on mount; empty/error/retry states render.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the highlight toggle (`body.preflight-diff-active` + `localStorage`), optional synchronized pane scrolling, and empty/loading/error/retry states.
- [ ] **Step 4: Run** → PASS; full suite green.
- [ ] **Step 5: Commit** — `add compare toggle persistence and empty/error states`.

---

## Increment 2 done — definition of done

- Opening the Content Diff tab renders live | preview side by side with per-node green/amber/red highlights, a jump-to change list, Content/Metadata tabs, and a last-modified header — the reporter's screenshot UX.
- Increment-1 minors resolved where they touch the panel (e.g. reuse a single `checkUnpublishedFragments` result rather than double-fetching, if trivial during Task 3).
- Full preflight suite green; feature demoable end-to-end via `?milolibs=`.

## Self-Review

- **Spec coverage:** rendered side-by-side (T3), node highlights (T4), change list + jump-to (T5), Content+Metadata tabs (T5), last-modified header (T5), toggle (T6). Spike de-risks the rendering (T1). ✅
- **Placeholder scan:** Task 1 is explicitly a spike (validation, not code); Tasks 2–6 have concrete test+impl steps. The render/highlight impl specifics are confirmed by T1 before T3/T4 run — flagged, not hidden. ✅
- **Scope:** one cohesive UI increment; depends only on the committed Increment-1 engine. ✅
