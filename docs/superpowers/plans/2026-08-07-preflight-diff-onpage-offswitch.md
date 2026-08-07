# Preflight Content Diff — On-Page Off-Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an author dismiss the on-page unpublished-content highlights from a control **on the page itself**, without reopening preflight — satisfying AC#2's "switch off … for an undisturbed view."

**Architecture:** The panel already paints highlights on the real page via `highlightOnPage(diff, root)` (in `panels/diff-onpage.js`), driven by the module-level `highlightsOn` signal in `panels/diff.js`. This adds a small page-injected control (same technique as the existing `showReturnPopover`) that appears whenever highlights are showing and, when clicked, clears them and flips `highlightsOn` off. Because the control lives in imperative page DOM (not the Preact modal tree), it survives closing preflight — so it works whether or not the modal is open. Separately, the toggle state changes from **localStorage-persistent** to **session-scoped** (defaults on every page load) so a one-time dismissal can never silently hide the feature on other pages (the AC#1-erosion hazard raised in review).

**Tech Stack:** Milo `htm-preact` (module-level `signal`), `createTag` from `utils.js`, Web Test Runner + `@esm-bundle/chai` + `sinon`. No new runtime deps.

## Global Constraints

- All changes under `libs/blocks/preflight/`. No new runtime dependencies.
- **Commit subjects: plain imperative, NO `MWPW-` ticket prefix.** Keep the `Co-Authored-By:` trailer.
- Comment style: one short human line only on genuinely non-obvious logic; no narration of obvious code.
- The on-page control is injected onto `document.body` (outside the modal), mirroring `showReturnPopover` in `panels/diff-onpage.js`. It must be removed by `clearHighlights`, so it never outlives the highlights it controls.
- Single source of truth for on/off is the module-level `highlightsOn` signal in `panels/diff.js`. The page control flips it via a callback passed into `highlightOnPage` — do NOT import `highlightsOn` into `diff-onpage.js` (that would create a circular import; `diff.js` already imports from `diff-onpage.js`).
- Off is **session-scoped**: `highlightsOn` defaults to `true` on every page load; no `localStorage`/`sessionStorage` persistence. Toggling off lasts only for the current page session.
- CSS: scope to `preflight`-prefixed classes, use `--s2a-*` design tokens and logical properties (`inset-inline-*`, `inset-block-*`), no `!important`, mirror the existing `.preflight-return-*` rules. Interactive control meets the 44px touch-target rule (milo-accessibility).
- Tests mirror `test/blocks/preflight/panels/diff.test.js` and `test/blocks/preflight/panels/diff-onpage.test.js`; pre-commit hook lints staged files (airbnb; single quotes; `i += 1`).
- **Non-goals (do NOT touch):** the compute-on-load / cache-consumption idea (dropped); the dead side-by-side files (`panels/diff-render.js`, `panels/diff-highlight.js` and their tests) — that cleanup is a separate task.

---

### Task 1: Session-scope the highlight toggle (drop localStorage persistence)

**Files:**
- Modify: `libs/blocks/preflight/panels/diff.js`
- Test: `test/blocks/preflight/panels/diff.test.js`

**Interfaces:**
- Consumes: existing module signal `const highlightsOn = signal(true);` (unchanged).
- Produces: `toggleHighlights()` now only flips the signal (no persistence). `readHighlightsPref`/`setHighlightsPref` and `HIGHLIGHTS_KEY` are removed. The render body no longer re-reads a stored preference on mount.

- [ ] **Step 1: Update the failing tests first.** In `test/blocks/preflight/panels/diff.test.js`:
  - Remove the `const HIGHLIGHTS_KEY = 'preflight-diff-highlights';` line and the two `window.localStorage.removeItem(HIGHLIGHTS_KEY)` calls in `beforeEach`/`afterEach`.
  - Replace the `describe('highlight toggle', ...)` test (`re-reads a persisted off-state on mount`) with one asserting the stored value is now **ignored**:

```javascript
  describe('highlight toggle', () => {
    it('ignores any previously stored preference and defaults highlights on (session-scoped)', async () => {
      window.localStorage.setItem('preflight-diff-highlights', 'false');
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-highlight-toggle'));

      expect(container.querySelector('.preflight-diff').classList.contains('preflight-diff-active')).to.equal(true);
      expect(container.querySelector('.preflight-diff-highlight-toggle').getAttribute('aria-pressed')).to.equal('true');
      window.localStorage.removeItem('preflight-diff-highlights');
    });
  });
```

  - Replace the `with changes` test named `defaults highlights on and persists off-toggle to localStorage` with a session-scoped version (no persistence):

```javascript
    it('defaults highlights on and toggling off does not persist to storage', async () => {
      const root = container.querySelector('.preflight-diff');
      const toggle = container.querySelector('.preflight-diff-highlight-toggle');
      expect(root.classList.contains('preflight-diff-active')).to.equal(true);
      expect(toggle.getAttribute('aria-pressed')).to.equal('true');

      toggle.click();
      await waitFor(() => toggle.getAttribute('aria-pressed') === 'false');

      expect(root.classList.contains('preflight-diff-active')).to.equal(false);
      expect(window.localStorage.getItem('preflight-diff-highlights')).to.equal(null);
    });
```

- [ ] **Step 2: Run** `npx wtr test/blocks/preflight/panels/diff.test.js --node-resolve` → the two updated tests FAIL (code still persists / re-reads).

- [ ] **Step 3: Implement** in `libs/blocks/preflight/panels/diff.js`:
  - Delete `const HIGHLIGHTS_KEY = 'preflight-diff-highlights';`.
  - Delete `readHighlightsPref` and `setHighlightsPref` entirely.
  - Simplify `toggleHighlights`:

```javascript
function toggleHighlights() {
  highlightsOn.value = !highlightsOn.value;
}
```

  - In the `DiffPanel` render body, delete the line `highlightsOn.value = readHighlightsPref();` (keep the `hasLoadedRef`/`loadDiff` guard around it):

```javascript
  if (selected && !hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadDiff(url);
  }
```

- [ ] **Step 4: Run** `npx wtr test/blocks/preflight/panels/diff.test.js --node-resolve` → PASS; then the full suite `npx wtr "test/blocks/preflight/**/*.test.js" --node-resolve` → green.

- [ ] **Step 5: Commit** — `make preflight diff highlight toggle session-scoped`.

---

### Task 2: On-page dismiss control

**Files:**
- Modify: `libs/blocks/preflight/panels/diff-onpage.js`
- Modify: `libs/blocks/preflight/panels/diff.js` (pass the dismiss callback into `highlightOnPage`)
- Modify: `libs/blocks/preflight/preflight.css`
- Test: `test/blocks/preflight/panels/diff-onpage.test.js`, `test/blocks/preflight/panels/diff.test.js`

**Interfaces:**
- Consumes: `createTag` (already imported in `diff-onpage.js`), `clearHighlights(root)`, the existing `apply`/overlay logic in `highlightOnPage`.
- Produces:
  - `highlightOnPage(diff, root, onDismiss)` — new optional third arg. When at least one overlay is applied and `onDismiss` is a function, injects the page control. Return value (cleanup) unchanged.
  - `clearHighlights(root)` — additionally removes `.preflight-diff-highlight-control` from the document.
  - New page control DOM: `<div class="preflight-diff-highlight-control" role="region" aria-label="Unpublished content highlights">` containing a `.preflight-diff-control-label` and a `.preflight-diff-control-hide` button. The button handler calls `clearHighlights(root)` (removes overlays + the control immediately, works even when the modal is closed) then `onDismiss()` (flips the signal so a reopened panel reflects the off state).

- [ ] **Step 1: Write the failing tests** in `test/blocks/preflight/panels/diff-onpage.test.js` (mirror the file's existing `highlightOnPage`/`clearHighlights` setup — a detached `<main>` root with elements matching the change paths):

```javascript
  describe('on-page dismiss control', () => {
    it('injects a dismiss control when highlights are applied and onDismiss is provided', () => {
      const onDismiss = sinon.spy();
      highlightOnPage(diff, root, onDismiss);
      const control = document.querySelector('.preflight-diff-highlight-control');
      expect(control).to.exist;
      expect(control.querySelector('.preflight-diff-control-hide')).to.exist;
    });

    it('does not inject a control when there is nothing to highlight', () => {
      highlightOnPage({ added: [], modified: [] }, root, sinon.spy());
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });

    it('does not inject a control when no onDismiss is given', () => {
      highlightOnPage(diff, root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });

    it('clicking Hide clears overlays, removes the control, and calls onDismiss', () => {
      const onDismiss = sinon.spy();
      highlightOnPage(diff, root, onDismiss);
      document.querySelector('.preflight-diff-control-hide').click();

      expect(root.querySelector('.preflight-diff-overlay')).to.not.exist;
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
      expect(onDismiss.calledOnce).to.equal(true);
    });

    it('clearHighlights removes the injected control', () => {
      highlightOnPage(diff, root, sinon.spy());
      clearHighlights(root);
      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
    });
  });
```

  (Ensure `clearHighlights` is exported from `diff-onpage.js` for the last test — if it isn't already, add it to the exports; it is currently module-internal.)

- [ ] **Step 2: Run** `npx wtr test/blocks/preflight/panels/diff-onpage.test.js --node-resolve` → FAIL.

- [ ] **Step 3: Implement** in `libs/blocks/preflight/panels/diff-onpage.js`:
  - Add a class constant near the others: `const CONTROL_CLASS = 'preflight-diff-highlight-control';`
  - In `clearHighlights(root)`, add a line to remove the page control (it lives on `document.body`, not under `root`):

```javascript
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
```

  - Add the injector (mirrors `showReturnPopover`); the Hide handler is self-sufficient so it also works after the modal is closed:

```javascript
// Page-injected control (like showReturnPopover) so highlights can be dismissed without
// reopening preflight. Hide clears immediately (works with the modal closed) and flips the
// panel's toggle via onDismiss so a reopened panel reflects the off state.
function showHighlightControl(root, onDismiss) {
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
  const label = createTag('span', { class: 'preflight-diff-control-label' }, 'Unpublished changes highlighted');
  const hide = createTag('button', { class: 'preflight-diff-control-hide' }, 'Hide');
  const control = createTag(
    'div',
    { class: CONTROL_CLASS, role: 'region', 'aria-label': 'Unpublished content highlights' },
    [label, hide],
  );
  hide.addEventListener('click', () => {
    clearHighlights(root);
    onDismiss();
  });
  document.body.append(control);
}
```

  - In `highlightOnPage(diff, root, onDismiss)`: add the third param, count successful applies, and inject the control at the end (before `return cleanup`):

```javascript
export function highlightOnPage(diff, root, onDismiss) {
  clearHighlights(root);

  let applied = 0;
  const apply = (change, modifierClass) => {
    let el = null;
    try {
      el = resolveOnPage(change.path, root, change.kind);
    } catch {
      el = null;
    }
    if (!el) {
      logUnmapped(change);
      return;
    }
    const host = ensureOverlayHost(el);
    const overlay = createTag('span', { class: `${OVERLAY_CLASS} ${modifierClass}`, 'aria-hidden': 'true' });
    host.append(overlay);
    applied += 1;
  };

  (diff?.added || []).forEach((change) => apply(change, ADDED_MODIFIER));
  (diff?.modified || []).forEach((change) => apply(change, MODIFIED_MODIFIER));

  if (applied > 0 && typeof onDismiss === 'function') showHighlightControl(root, onDismiss);

  return function cleanup() {
    clearHighlights(root);
  };
}
```

  - Export `clearHighlights` (change `function clearHighlights` to `export function clearHighlights`) so the test can call it directly.

- [ ] **Step 4: Wire the callback** in `libs/blocks/preflight/panels/diff.js` — the highlight `useEffect` passes a dismiss handler that flips the session signal:

```javascript
  useEffect(() => {
    if (!highlightsOn.value || !contentDiff.value) return undefined;
    const root = document.querySelector('main');
    if (!root) return undefined;
    return highlightOnPage(contentDiff.value, root, () => { highlightsOn.value = false; });
  });
```

- [ ] **Step 5: Add the CSS** to `libs/blocks/preflight/preflight.css`, after the `.preflight-return-*` rules, mirroring their tokens/shape (fixed, bottom-start so it doesn't collide with the top-start return popover; RTL-safe logical properties; 44px touch target on the button):

```css
/* Page-injected: dismiss on-page unpublished-content highlights without reopening preflight. */
.preflight-diff-highlight-control {
  position: fixed;
  inset-block-end: var(--s2a-spacing-16);
  inset-inline-start: var(--s2a-spacing-16);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: var(--s2a-spacing-12);
  max-width: calc(100vw - 32px);
  padding-block: var(--s2a-spacing-8);
  padding-inline-start: var(--s2a-spacing-16);
  padding-inline-end: var(--s2a-spacing-8);
  background: var(--s2a-color-background-default);
  color: var(--s2a-color-content-default);
  border: 1px solid var(--s2a-color-border-subtle);
  border-radius: var(--s2a-border-radius-999);
  box-shadow: 0 8px 24px var(--s2a-color-transparent-black-24);
  font-family: var(--preflight-font);
  font-size: var(--s2a-font-size-14);
}

.preflight-diff-control-label {
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  white-space: nowrap;
}

@media (max-width: 599px) {
  .preflight-diff-control-label {
    display: none;
  }
}

.preflight-diff-control-hide {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 var(--s2a-spacing-16);
  border: none;
  border-radius: var(--s2a-border-radius-999);
  background: var(--s2a-color-blue-900);
  color: var(--s2a-color-gray-25);
  font-family: var(--preflight-font);
  font-size: var(--s2a-font-size-14);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;
}

.preflight-diff-control-hide:hover {
  background: var(--s2a-color-blue-1000);
}

.preflight-diff-control-hide:focus-visible {
  outline: 2px solid var(--s2a-color-focus-ring-default);
  outline-offset: 2px;
}
```

- [ ] **Step 6: Add a panel-level integration test** in `test/blocks/preflight/panels/diff.test.js`, inside the existing `describe('on-page highlighting and jump-to', ...)` block (its `beforeEach` already sets up `pageMain`; add cleanup for the control in that block's `afterEach`: `document.querySelector('.preflight-diff-highlight-control')?.remove();`):

```javascript
    it('shows an on-page dismiss control that clears highlights when clicked', async () => {
      stubFetchWithChanges();
      render(html`<${DiffPanel} url=${TEST_URL} />`, container);
      await waitFor(() => container.querySelector('.preflight-diff-change-item'));
      await waitFor(() => pageMain.querySelector('.preflight-diff-overlay'));

      const control = document.querySelector('.preflight-diff-highlight-control');
      expect(control).to.exist;

      control.querySelector('.preflight-diff-control-hide').click();
      await waitFor(() => !pageMain.querySelector('.preflight-diff-overlay'));

      expect(document.querySelector('.preflight-diff-highlight-control')).to.not.exist;
      expect(container.querySelector('.preflight-diff').classList.contains('preflight-diff-active')).to.equal(false);
    });
```

- [ ] **Step 7: Run** `npx wtr test/blocks/preflight/panels/diff-onpage.test.js --node-resolve` and `npx wtr test/blocks/preflight/panels/diff.test.js --node-resolve` → PASS; then the full suite `npx wtr "test/blocks/preflight/**/*.test.js" --node-resolve` → green; then `npm run lint` on staged files → clean.

- [ ] **Step 8: Commit** — `add on-page control to dismiss unpublished-content highlights`.

---

## Increment done — definition of done

- With highlights on the preview page, a page-level control appears; clicking **Hide** clears the highlights and flips the panel toggle off — and it works whether preflight is open or already closed.
- The off state is session-scoped (defaults on next page load), so a dismissal never silently hides unpublished content on other pages.
- Full preflight suite green; lint clean.

## Self-Review

- **Spec coverage:** on-page off-switch (Task 2), survives modal close (Hide handler is self-sufficient via `clearHighlights` + injected on `body`), single source of truth (callback flips `highlightsOn`, no circular import), session-scoped persistence (Task 1). ✅
- **Placeholder scan:** every step has concrete code — the `highlightOnPage`/`clearHighlights`/`showHighlightControl` bodies, the CSS, and all test cases are written out. ✅
- **Type consistency:** `highlightOnPage(diff, root, onDismiss)` third-arg contract matches the `diff.js` call site; `clearHighlights` export matches its direct test use; the injected classnames (`preflight-diff-highlight-control`, `-control-label`, `-control-hide`) are identical across JS, CSS, and tests. ✅
