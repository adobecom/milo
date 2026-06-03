# Milo World Dashboard Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two bugs (KPI delta arrow direction, charts blank until refresh), improve clarity (info tooltips, all-time total placement, clickable alerts), and cut load time (frontend parallelization + a backend read-route response cache).

**Architecture:** All frontend changes are in the `milo-dashboard` block (`libs/blocks/milo-dashboard/`), served live off the `milo-world-dashboard` branch via `?ref=`. One backend change adds an in-process, short-TTL single-flight cache to read-only aggregate routes in `milo-logs-deploy`, reducing shared-DB load without touching `pool max: 1`.

**Tech Stack:** Vanilla JS milo block (`createTag`, `loadStyle`), echarts (SVG renderer, bundled `deps/echarts.common.min.js`), web-test-runner + `@esm-bundle/chai` (frontend), Node/Express + Jest + supertest (backend).

---

## File Structure

**milo (frontend) — branch `milo-world-dashboard`:**
- `libs/blocks/milo-dashboard/panels/kpi-cards.js` — split delta color/direction classes (Change 1)
- `libs/blocks/milo-dashboard/panels/alerts.js` — expand-in-place "+N more" (Change 2)
- `libs/blocks/milo-dashboard/panels/totals-strip.js` — per-site list only; header stat split out (Change 4)
- `libs/blocks/milo-dashboard/panels/consumer-bars.js` — T1 info tooltip (Change 3)
- `libs/blocks/milo-dashboard/panels/health-gauge.js` — info tooltip pass-through (Change 3)
- `libs/blocks/milo-dashboard/info-tip.js` — NEW reusable accessible `?` tooltip helper (Change 3)
- `libs/blocks/milo-dashboard/charts.js` — ResizeObserver in makeChart/clearCharts (Change 6)
- `libs/blocks/milo-dashboard/milo-dashboard.js` — await correct CSS, header restructure, parallelize loads, info tooltips on KPI/panels (Changes 3, 4, 6, 7)
- `libs/blocks/milo-dashboard/milo-dashboard.css` — delta classes, info-tip styles, header all-time stat (Changes 1, 3, 4)
- `test/blocks/milo-dashboard/...` — matching tests

**milo-logs-deploy (backend) — branch `milo-world-dashboard`:**
- `src/utils/query-cache.js` — NEW single-flight TTL cache helper (Change 8)
- `src/routes/index.js` — wire cached read handlers (Change 8)
- `tests/query-cache.test.js` — NEW (Change 8)

---

## Task 1: Fix KPI delta arrow direction (Change 1)

Decouple the arrow glyph (numeric sign) from the color (goodness). Today both come from one `up`/`down` class, so "Pages Below 70 −100%" shows a green ↗.

**Files:**
- Modify: `libs/blocks/milo-dashboard/panels/kpi-cards.js:27-48`
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.css:233-249`
- Test: `test/blocks/milo-dashboard/panels/kpi-cards.test.js`

- [ ] **Step 1: Update the failing tests for the new class scheme**

Replace the two delta-class assertions and add the bug-case test. In `test/blocks/milo-dashboard/panels/kpi-cards.test.js`, change the "up" test and add coverage:

```javascript
it('shows a positive change on a higher-is-better metric as good + rose', () => {
  renderKpiCards(container, fixture, 'month');
  const delta = container.querySelectorAll('.kpi-card .kpi-delta')[0]; // Publishes +20%
  expect(delta.textContent).to.equal('+20%');
  expect(delta.classList.contains('good')).to.equal(true);
  expect(delta.classList.contains('rose')).to.equal(true);
  expect(delta.classList.contains('bad')).to.equal(false);
  expect(delta.classList.contains('fell')).to.equal(false);
});

it('shows a drop in a lower-is-better metric as good but with a down arrow', () => {
  // fixture: pages_below_70 current 12 vs prior 20 => -40%, higherIsBetter:false => good
  renderKpiCards(container, fixture, 'month');
  const delta = container.querySelectorAll('.kpi-card .kpi-delta')[4]; // Pages Below 70
  expect(delta.textContent).to.equal('-40%');
  expect(delta.classList.contains('good')).to.equal(true); // fewer bad pages = good
  expect(delta.classList.contains('fell')).to.equal(true); // but the number fell => down arrow
  expect(delta.classList.contains('up')).to.equal(false);
  expect(delta.classList.contains('rose')).to.equal(false);
});
```

Also update the existing "shows a zero percent change as flat" test if it asserts `.up`/`.down` (it should keep only `.flat`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/kpi-cards.test.js`
Expected: FAIL — `.good`/`.rose`/`.fell` classes don't exist yet (code still adds `.up`/`.down`).

- [ ] **Step 3: Update kpi-cards.js to split color from direction**

In `kpi-cards.js`, replace the class-assignment block inside `renderKpiCards`:

```javascript
    const deltaEl = createTag('div', { class: 'kpi-delta' }, pct === null ? '—' : formatPercent(pct));
    if (pct === null || Math.round(pct) === 0) {
      deltaEl.classList.add('flat');
    } else {
      const good = higherIsBetter ? pct > 0 : pct < 0;
      deltaEl.classList.add(good ? 'good' : 'bad'); // color = goodness
      deltaEl.classList.add(pct > 0 ? 'rose' : 'fell'); // arrow = numeric direction
    }
```

- [ ] **Step 4: Update CSS to separate color classes from arrow glyphs**

In `milo-dashboard.css`, replace the `.kpi-delta.up` / `.kpi-delta.down` rules (lines ~233-249) with:

```css
  & .kpi-delta.good {
    color: var(--md-good);
    background: var(--md-good-soft);
  }

  & .kpi-delta.bad {
    color: var(--md-bad);
    background: var(--md-bad-soft);
  }

  & .kpi-delta.rose::before {
    content: "\2197";
  }

  & .kpi-delta.fell::before {
    content: "\2198";
  }
```

Leave `.kpi-delta.flat` unchanged.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/kpi-cards.test.js`
Expected: PASS.

- [ ] **Step 6: Lint**

Run: `npx eslint libs/blocks/milo-dashboard/panels/kpi-cards.js && npx stylelint libs/blocks/milo-dashboard/milo-dashboard.css`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add libs/blocks/milo-dashboard/panels/kpi-cards.js libs/blocks/milo-dashboard/milo-dashboard.css test/blocks/milo-dashboard/panels/kpi-cards.test.js
git commit -m "fix(milo-dashboard): KPI delta arrow follows sign, color follows goodness"
```

---

## Task 2: Reusable info-tip helper (Change 3)

A small accessible `?` button with a CSS tooltip, reused across panels.

**Files:**
- Create: `libs/blocks/milo-dashboard/info-tip.js`
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.css` (append info-tip styles)
- Test: `test/blocks/milo-dashboard/info-tip.test.js`

- [ ] **Step 1: Write the failing test**

Create `test/blocks/milo-dashboard/info-tip.test.js`:

```javascript
import { expect } from '@esm-bundle/chai';

const { default: infoTip } = await import('../../../libs/blocks/milo-dashboard/info-tip.js');

describe('milo-dashboard info-tip', () => {
  it('returns a button carrying the explanation as accessible name', () => {
    const el = infoTip('All-time count of live pages.');
    expect(el.tagName).to.equal('BUTTON');
    expect(el.getAttribute('type')).to.equal('button');
    expect(el.getAttribute('aria-label')).to.equal('All-time count of live pages.');
    expect(el.classList.contains('info-tip')).to.equal(true);
  });

  it('exposes the text to sighted users via a tooltip element', () => {
    const el = infoTip('Tier-1 consumers only.');
    expect(el.querySelector('.info-tip-bubble').textContent).to.equal('Tier-1 consumers only.');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:file -- test/blocks/milo-dashboard/info-tip.test.js`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create info-tip.js**

```javascript
import { createTag } from '../../utils/utils.js';

// Small accessible "?" affordance. Real button => keyboard-operable for free;
// the explanation is both the aria-label (screen readers) and a visible bubble
// shown on hover/focus via CSS.
export default function infoTip(text) {
  const bubble = createTag('span', { class: 'info-tip-bubble', role: 'tooltip' }, text);
  return createTag(
    'button',
    { type: 'button', class: 'info-tip', 'aria-label': text },
    [createTag('span', { 'aria-hidden': 'true', class: 'info-tip-glyph' }, '?'), bubble],
  );
}
```

- [ ] **Step 4: Append info-tip styles to milo-dashboard.css**

Add at the end of the `.milo-dashboard { ... }` block (inside the block scope):

```css
  & .info-tip {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 13px; /* expands hit area to >= 44px */
    margin-inline-start: 6px;
    border: 1px solid var(--md-line);
    border-radius: 50%;
    background: var(--md-surface);
    color: var(--md-ink-soft);
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    cursor: help;
    vertical-align: middle;
  }

  & .info-tip-bubble {
    position: absolute;
    z-index: 5;
    inset-block-end: calc(100% + 6px);
    inset-inline-start: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: 260px;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--md-ink-strong);
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    text-align: start;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
  }

  & .info-tip:hover .info-tip-bubble,
  & .info-tip:focus-visible .info-tip-bubble {
    opacity: 1;
  }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:file -- test/blocks/milo-dashboard/info-tip.test.js`
Expected: PASS.

- [ ] **Step 6: Lint + commit**

```bash
npx eslint libs/blocks/milo-dashboard/info-tip.js && npx stylelint libs/blocks/milo-dashboard/milo-dashboard.css
git add libs/blocks/milo-dashboard/info-tip.js libs/blocks/milo-dashboard/milo-dashboard.css test/blocks/milo-dashboard/info-tip.test.js
git commit -m "feat(milo-dashboard): add reusable accessible info-tip helper"
```

---

## Task 3: Attach info tooltips (Change 3 + 6)

Attach `infoTip` to the gauge panel title, the T1 toggle, and the two non-obvious KPI cards. Panel titles are created by `makePanel` in `milo-dashboard.js`; KPI labels in `kpi-cards.js`; T1 in `consumer-bars.js`.

**Files:**
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.js` (makePanel accepts optional info; pass info to gauge panel)
- Modify: `libs/blocks/milo-dashboard/panels/kpi-cards.js` (info on Avg Health + Pages Below 70)
- Modify: `libs/blocks/milo-dashboard/panels/consumer-bars.js` (info on T1 toggle)
- Test: `test/blocks/milo-dashboard/panels/consumer-bars.test.js`, `kpi-cards.test.js`

- [ ] **Step 1: Write failing tests**

In `test/blocks/milo-dashboard/panels/consumer-bars.test.js` add:

```javascript
it('renders an info tip on the T1 toggle', async () => {
  const charts = { makeChart: () => ({ on() {} }) };
  renderConsumerBars(container, [{ site: 'cc', publishes: 1, previews: 1, avg_health: 90 }], charts, () => {});
  const tip = container.querySelector('.consumer-bars-controls .info-tip');
  expect(tip).to.not.equal(null);
  expect(tip.getAttribute('aria-label')).to.contain('Tier-1');
});
```

In `test/blocks/milo-dashboard/panels/kpi-cards.test.js` add:

```javascript
it('adds info tips to Avg Health and Pages Below 70 cards only', () => {
  renderKpiCards(container, fixture, 'month');
  const cards = container.querySelectorAll('.kpi-card');
  expect(cards[2].querySelector('.info-tip')).to.not.equal(null); // Avg Health
  expect(cards[4].querySelector('.info-tip')).to.not.equal(null); // Pages Below 70
  expect(cards[0].querySelector('.info-tip')).to.equal(null);     // Publishes (self-explanatory)
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/consumer-bars.test.js test/blocks/milo-dashboard/panels/kpi-cards.test.js`
Expected: FAIL — no `.info-tip` rendered yet.

- [ ] **Step 3: Add info to kpi-cards.js**

Add the import and an `info` field on the two metrics, render it into the label:

```javascript
import { createTag } from '../../../utils/utils.js';
import infoTip from '../info-tip.js';

const METRICS = [
  { key: 'publishes', label: 'Publishes', decimals: 0, higherIsBetter: true },
  { key: 'previews', label: 'Previews', decimals: 0, higherIsBetter: true },
  { key: 'avg_health', label: 'Avg Health Score', decimals: 1, higherIsBetter: true, info: 'Average preflight score (0–100) this period.' },
  { key: 'active_projects', label: 'Active Projects', decimals: 0, higherIsBetter: true },
  { key: 'pages_below_70', label: 'Pages Below 70', decimals: 0, higherIsBetter: false, info: 'Live pages scoring under 70 on preflight health. Lower is better.' },
];
```

Then in the `METRICS.forEach`, build the label with an optional tip:

```javascript
    const labelEl = createTag('div', { class: 'kpi-label' }, label);
    if (info) labelEl.append(infoTip(info));
```

and use `labelEl` (instead of the inline `createTag('div', { class: 'kpi-label' }, label)`) in the card.

- [ ] **Step 4: Add info to the T1 toggle in consumer-bars.js**

Add the import at top:

```javascript
import infoTip from '../info-tip.js';
```

After creating `t1Toggle` and appending it, also append a tip to the controls:

```javascript
  controls.append(t1Toggle);
  controls.append(infoTip('Tier-1 consumers (CC, DC, Express, Bacom, Blog). Toggle off to see all consumers.'));
```

- [ ] **Step 5: Add info to the gauge panel title via makePanel**

In `milo-dashboard.js`, change `makePanel` to accept an optional info string:

```javascript
    const makePanel = (cls, title, info) => {
      const panel = createTag('div', { class: `panel ${cls}` });
      if (title) {
        const titleEl = createTag('h3', { class: 'panel-title' }, title);
        if (info) titleEl.append(infoTip(info));
        panel.append(titleEl);
      }
      const body = createTag('div', { class: 'panel-body' });
      panel.append(body);
      return { panel, body };
    };
```

Add the import at the top of `milo-dashboard.js`:

```javascript
import infoTip from './info-tip.js';
```

Pass info to the gauge panel:

```javascript
    const gauge = makePanel('gauge-panel', 'Platform preflight health', 'Average preflight score (0–100) from the latest checks: performance, SEO, accessibility, assets.');
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/consumer-bars.test.js test/blocks/milo-dashboard/panels/kpi-cards.test.js`
Expected: PASS.

- [ ] **Step 7: Lint + commit**

```bash
npx eslint libs/blocks/milo-dashboard/panels/kpi-cards.js libs/blocks/milo-dashboard/panels/consumer-bars.js libs/blocks/milo-dashboard/milo-dashboard.js
git add libs/blocks/milo-dashboard/panels/kpi-cards.js libs/blocks/milo-dashboard/panels/consumer-bars.js libs/blocks/milo-dashboard/milo-dashboard.js test/blocks/milo-dashboard/panels/consumer-bars.test.js test/blocks/milo-dashboard/panels/kpi-cards.test.js
git commit -m "feat(milo-dashboard): add info tooltips to gauge, T1 toggle, and KPI cards"
```

---

## Task 4: Expand-in-place "+N more" alerts (Change 2)

`alerts.js:61-63` renders `+N more` as a static `<div>`. Make it a button that toggles the full list.

**Files:**
- Modify: `libs/blocks/milo-dashboard/panels/alerts.js`
- Test: `test/blocks/milo-dashboard/panels/alerts.test.js`

- [ ] **Step 1: Write the failing test**

In `test/blocks/milo-dashboard/panels/alerts.test.js` add (build >8 alerts so the "more" control appears):

```javascript
it('expands to the full list when "+N more" is clicked, then collapses', () => {
  const projects = Array.from({ length: 12 }, (_, i) => ({ site: `s${i}`, avg_health: 10 })); // all critical
  renderAlerts(container, { testPages: [], projects }, () => {});
  const more = container.querySelector('.alerts-more');
  expect(more.tagName).to.equal('BUTTON');
  expect(container.querySelectorAll('.alert-item').length).to.equal(8); // MAX_SHOWN
  more.click();
  expect(container.querySelectorAll('.alert-item').length).to.equal(12);
  const less = container.querySelector('.alerts-more');
  expect(less.textContent).to.equal('Show less');
  less.click();
  expect(container.querySelectorAll('.alert-item').length).to.equal(8);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/alerts.test.js`
Expected: FAIL — `.alerts-more` is a `DIV`, clicking does nothing.

- [ ] **Step 3: Rewrite renderAlerts to support expand/collapse**

Replace the body of `renderAlerts` (keep `buildAlerts`, `buildMsg`, constants):

```javascript
export default function renderAlerts(container, data, onConsumer) {
  const alerts = buildAlerts(data || {});
  let expanded = false;

  function draw() {
    container.replaceChildren();
    if (!alerts.length) {
      container.append(createTag('div', { class: 'alerts-empty' }, 'All clear — nothing flagged'));
      return;
    }
    const list = createTag('div', { class: 'alerts-list' });
    const shown = expanded ? alerts : alerts.slice(0, MAX_SHOWN);
    shown.forEach((alert) => {
      const sev = createTag('span', { class: `alert-sev ${alert.severity}` }, SEV_LABEL[alert.severity]);
      const msg = buildMsg(alert);
      if (alert.severity === 'high' && onConsumer) {
        const item = createTag('button', { type: 'button', class: 'alert-item' }, [sev, msg]);
        item.addEventListener('click', () => onConsumer(alert.site));
        list.append(item);
        return;
      }
      list.append(createTag('div', { class: 'alert-item' }, [sev, msg]));
    });

    if (alerts.length > MAX_SHOWN) {
      const label = expanded ? 'Show less' : `+${alerts.length - MAX_SHOWN} more`;
      const toggle = createTag('button', { type: 'button', class: 'alerts-more' }, label);
      toggle.addEventListener('click', () => { expanded = !expanded; draw(); });
      list.append(toggle);
    }
    container.append(list);
  }

  draw();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/alerts.test.js`
Expected: PASS.

- [ ] **Step 5: Confirm `.alerts-more` is styled as a button (CSS)**

Check `milo-dashboard.css` for an existing `.alerts-more` rule. If it sets only text styles, add `cursor: pointer; border: 0; background: none; font: inherit; color: var(--md-accent); padding: 6px 0;` so the button looks like the prior text link. (Add inside the block scope.)

- [ ] **Step 6: Lint + commit**

```bash
npx eslint libs/blocks/milo-dashboard/panels/alerts.js && npx stylelint libs/blocks/milo-dashboard/milo-dashboard.css
git add libs/blocks/milo-dashboard/panels/alerts.js libs/blocks/milo-dashboard/milo-dashboard.css test/blocks/milo-dashboard/panels/alerts.test.js
git commit -m "feat(milo-dashboard): make +N more alerts expand in place"
```

---

## Task 5: All-time total above the toggle (Change 4)

Lift the grand total into the header (above the timeframe toggle) and keep the per-site breakdown as a grid panel retitled "Live pages by consumer".

**Files:**
- Modify: `libs/blocks/milo-dashboard/panels/totals-strip.js` (render per-site list; render header stat)
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.js` (header stat element + retitle panel + wire totals)
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.css` (header all-time stat styles)
- Test: `test/blocks/milo-dashboard/panels/totals-strip.test.js`

- [ ] **Step 1: Write the failing test**

Replace/extend `test/blocks/milo-dashboard/panels/totals-strip.test.js`. The render now takes a header element and only draws the per-site list into the panel:

```javascript
import { expect } from '@esm-bundle/chai';

const { default: renderTotals } = await import('../../../../libs/blocks/milo-dashboard/panels/totals-strip.js');

const totals = { total: 168294, perSite: [{ site: 'da-dc', pages: 69014 }, { site: 'milo', pages: 123 }] };

describe('milo-dashboard totals-strip', () => {
  let panel; let headerStat;
  beforeEach(() => { panel = document.createElement('div'); headerStat = document.createElement('div'); });

  it('writes the grand total into the header stat element', () => {
    renderTotals(panel, totals, headerStat);
    expect(headerStat.querySelector('.allstat-number').textContent).to.equal('168,294');
    expect(headerStat.querySelector('.allstat-caption').textContent).to.contain('all-time');
  });

  it('renders only the per-site list (no grand total) in the panel', () => {
    renderTotals(panel, totals, headerStat);
    expect(panel.querySelector('.totals-total')).to.equal(null);
    expect(panel.querySelectorAll('.totals-item').length).to.equal(2);
  });

  it('shows a dash in the header when totals are missing', () => {
    renderTotals(panel, null, headerStat);
    expect(headerStat.querySelector('.allstat-number').textContent).to.equal('—');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/totals-strip.test.js`
Expected: FAIL — `renderTotals` ignores the third arg and still renders `.totals-total` in the panel.

- [ ] **Step 3: Rewrite totals-strip.js**

```javascript
import { createTag } from '../../../utils/utils.js';

// Renders the per-site breakdown into `container` (a grid panel body) and the
// all-time grand total into `headerStat` (a header element above the timeframe
// toggle). The total is NOT period-scoped — keeping it in the header avoids the
// impression that the Day/Week/Month toggle affects it.
export default function renderTotals(container, totals, headerStat) {
  container.replaceChildren();
  if (headerStat) headerStat.replaceChildren();

  const hasData = totals && totals.perSite;

  if (headerStat) {
    const number = hasData ? Number(totals.total).toLocaleString() : '—';
    headerStat.append(
      createTag('span', { class: 'allstat-number' }, number),
      createTag('span', { class: 'allstat-caption' }, 'live pages · all-time'),
    );
  }

  if (!hasData) {
    container.append(createTag('div', { class: 'totals-empty' }, 'No totals'));
    return;
  }

  const list = createTag('div', { class: 'totals-list' });
  totals.perSite.forEach(({ site, pages }) => {
    list.append(createTag('div', { class: 'totals-item' }, [
      createTag('span', { class: 'totals-site' }, site),
      createTag('span', { class: 'totals-count' }, Number(pages).toLocaleString()),
    ]));
  });
  container.append(list);
}
```

- [ ] **Step 4: Run the totals test to verify it passes**

Run: `npm run test:file -- test/blocks/milo-dashboard/panels/totals-strip.test.js`
Expected: PASS.

- [ ] **Step 5: Wire the header stat + retitle the panel in milo-dashboard.js**

In `showOverview`, build an all-time stat element and place it above the toggle. Change the header assembly so the order is: title row (title + meta), then the all-time stat, then the toggle. Concretely:

Replace the header/toggle construction with:

```javascript
    const header = createTag('div', { class: 'dashboard-header' }, [
      createTag('h2', { class: 'dashboard-title' }, 'Milo World'),
    ]);

    const allTimeStat = createTag('div', { class: 'dashboard-allstat' });
    allTimeStat.append(infoTip('All-time count of live pages across consumers. Not affected by the Day / Week / Month toggle.'));

    const toggle = createTag('div', { class: 'timeframe-toggle' });
```

Append in this order after building meta and buttons:

```javascript
    toggle.append(...buttons);
    // header gets meta (env/updated/refresh) first, then the all-time stat, then the toggle
    header.append(meta, allTimeStat, toggle);
```

Retitle the totals panel and pass the header stat to its fill:

```javascript
    const totals = makePanel('totals', 'Live pages by consumer');
```

and change the totals fill call (in `loadData`) to pass `allTimeStat`:

```javascript
        fill(totalsMount, 'totals', pTotals, (totalsData) => renderTotals(totalsMount, totalsData, allTimeStat)),
```

> Note: `allTimeStat` is created in `showOverview` scope, so it is in scope inside `loadData`. The info-tip text on `allTimeStat` is appended once at build; `renderTotals` calls `headerStat.replaceChildren()` which clears it — so move the `infoTip` append to AFTER render by having `renderTotals` not own the tip. Simplest: do NOT append infoTip in `showOverview`; instead append it to `allTimeStat` right after each `renderTotals` populates it is fragile. Use a stable wrapper: make `allStat` contain a fixed `.allstat-tip` span plus a `.allstat-body` that totals writes into.

Use this stable structure instead:

```javascript
    const allTimeBody = createTag('div', { class: 'allstat-body' });
    const allTimeStat = createTag('div', { class: 'dashboard-allstat' }, [
      allTimeBody,
      infoTip('All-time count of live pages across consumers. Not affected by the Day / Week / Month toggle.'),
    ]);
```

and pass `allTimeBody` (not `allTimeStat`) to `renderTotals`:

```javascript
        fill(totalsMount, 'totals', pTotals, (totalsData) => renderTotals(totalsMount, totalsData, allTimeBody)),
```

- [ ] **Step 6: Add header all-time stat CSS**

Append inside the block scope in `milo-dashboard.css`:

```css
  & .dashboard-allstat {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-block: 10px 14px;
  }

  & .dashboard-allstat .allstat-body {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  & .dashboard-allstat .allstat-number {
    font-size: 22px;
    font-weight: 700;
    color: var(--md-ink-strong);
  }

  & .dashboard-allstat .allstat-caption {
    font-size: 13px;
    color: var(--md-ink-soft);
  }
```

- [ ] **Step 7: Run the dashboard test suite**

Run: `npm run test:file -- test/blocks/milo-dashboard/milo-dashboard.test.js test/blocks/milo-dashboard/panels/totals-strip.test.js`
Expected: PASS. (If `milo-dashboard.test.js` asserts the old "Pages stored" panel title, update it to "Live pages by consumer".)

- [ ] **Step 8: Lint + commit**

```bash
npx eslint libs/blocks/milo-dashboard/panels/totals-strip.js libs/blocks/milo-dashboard/milo-dashboard.js && npx stylelint libs/blocks/milo-dashboard/milo-dashboard.css
git add libs/blocks/milo-dashboard/panels/totals-strip.js libs/blocks/milo-dashboard/milo-dashboard.js libs/blocks/milo-dashboard/milo-dashboard.css test/blocks/milo-dashboard/panels/totals-strip.test.js test/blocks/milo-dashboard/milo-dashboard.test.js
git commit -m "feat(milo-dashboard): lift all-time total above the timeframe toggle"
```

---

## Task 6: Fix charts blank until refresh (Change 6)

Two layers: (a) await the correct CSS before rendering charts; (b) add a `ResizeObserver` in `makeChart` so a chart initialized at 0 size recovers when its container gets a real box.

**Files:**
- Modify: `libs/blocks/milo-dashboard/charts.js`
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.js:85-91`
- Test: `test/blocks/milo-dashboard/charts.test.js`

- [ ] **Step 1: Write the failing test for the ResizeObserver wiring**

In `test/blocks/milo-dashboard/charts.test.js`, stub `window.echarts` and `window.ResizeObserver` and assert `makeChart` observes the element and `clearCharts` disconnects:

```javascript
it('observes the container with a ResizeObserver and disconnects on clear', () => {
  const observed = [];
  const disconnected = [];
  window.ResizeObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { observed.push(el); }
    disconnect() { disconnected.push(this); }
  };
  let resized = 0;
  window.echarts = { init: () => ({ setOption() {}, resize() { resized += 1; }, dispose() {} }) };

  const el = document.createElement('div');
  makeChart(el, {});
  expect(observed[0]).to.equal(el);

  clearCharts();
  expect(disconnected.length).to.equal(1);
});
```

(Import `makeChart`, `clearCharts` at the top of the test file if not already.)

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:file -- test/blocks/milo-dashboard/charts.test.js`
Expected: FAIL — `makeChart` never constructs a ResizeObserver.

- [ ] **Step 3: Add ResizeObserver to charts.js**

Replace `makeChart` and `clearCharts`:

```javascript
export function makeChart(el, option) {
  const chart = window.echarts.init(el, null, { renderer: 'svg' });
  chart.setOption(option);
  const onResize = () => chart.resize();
  window.addEventListener('resize', onResize);
  // A chart initialized before its container has a non-zero box (CSS not yet
  // applied) renders blank and never recovers on its own. Observe the box and
  // resize when it changes so the chart paints once it has real dimensions.
  let ro;
  if (window.ResizeObserver) {
    ro = new window.ResizeObserver(() => chart.resize());
    ro.observe(el);
  }
  instances.push({ chart, onResize, ro });
  return chart;
}

export function clearCharts() {
  instances.forEach(({ chart, onResize, ro }) => {
    window.removeEventListener('resize', onResize);
    ro?.disconnect();
    chart.dispose?.();
  });
  instances.length = 0;
}
```

- [ ] **Step 4: Run charts test to verify it passes**

Run: `npm run test:file -- test/blocks/milo-dashboard/charts.test.js`
Expected: PASS.

- [ ] **Step 5: Fix the CSS load in milo-dashboard.js**

In `init`, replace the buggy fire-and-forget line that loads the JS as CSS. Change:

```javascript
  loadStyle(import.meta.url);
```

to await the correct stylesheet before rendering:

```javascript
  await new Promise((resolve) => { loadStyle(import.meta.url.replace('.js', '.css'), resolve); });
```

(`loadStyle(href, callback)` invokes the callback on load — see `utils.js:1160`.)

- [ ] **Step 6: Run the full dashboard suite**

Run: `npm run test:file -- test/blocks/milo-dashboard/charts.test.js test/blocks/milo-dashboard/milo-dashboard.test.js`
Expected: PASS.

- [ ] **Step 7: Manual visual verification against the demo**

Run: `python3 -m http.server 3000` from repo root, open `http://localhost:3000/libs/blocks/milo-dashboard/demo/index.html`, hard-refresh. Confirm the gauge ring and By-consumer chart render on first load without clicking Refresh.

- [ ] **Step 8: Lint + commit**

```bash
npx eslint libs/blocks/milo-dashboard/charts.js libs/blocks/milo-dashboard/milo-dashboard.js
git add libs/blocks/milo-dashboard/charts.js libs/blocks/milo-dashboard/milo-dashboard.js test/blocks/milo-dashboard/charts.test.js
git commit -m "fix(milo-dashboard): render charts on first load (await CSS + ResizeObserver)"
```

---

## Task 7: Parallelize load ordering (Change 7)

`await loadCharts()` currently blocks before any API request fires. Start the echarts download alongside data fetching.

**Files:**
- Modify: `libs/blocks/milo-dashboard/milo-dashboard.js:85-91, 203-225`
- Test: covered by existing `milo-dashboard.test.js` (behavior unchanged; verify no regression)

- [ ] **Step 1: Reorder init() to overlap independent awaits**

In `init`, instead of `await loadCharts()` before `route()`, kick off chart loading and keep a promise the chart-rendering panels await. Minimal, safe change: start `loadCharts()` without blocking, and `await` it only right before the first `makeChart` use.

Change the top of `init`:

```javascript
  await new Promise((resolve) => { loadStyle(import.meta.url.replace('.js', '.css'), resolve); });

  const ctx = await resolveContext(block, { loadDaSdk });
  const client = createClient(ctx);
  const chartsReady = loadCharts(); // start the ~1MB echarts download now, don't block
  const charts = { makeChart };
```

In `loadData`, after firing the six request promises (`pOverview`, `pEds`, …), await charts only for the panels that draw charts. The simplest correct approach: `await chartsReady` once before the `Promise.all([...fill...])` that includes chart panels, but AFTER the requests are already in flight:

```javascript
      const pTestPages = client.getText('/test-pages', { since: trendSince, state: 'live', limit: 50 });

      rangeEl.textContent = formatRange(interval);
      await chartsReady; // requests are already in flight; this only gates chart rendering
```

This keeps the requests starting before echarts finishes downloading (the win) while guaranteeing `makeChart` is safe to call. Non-chart panels (kpi, totals, alerts, projects) still render as soon as their data arrives via `fill`.

- [ ] **Step 2: Run the dashboard suite to verify no regression**

Run: `npm run test:file -- test/blocks/milo-dashboard/milo-dashboard.test.js`
Expected: PASS. (The existing test mocks `loadCharts`/`makeChart`; confirm it still resolves. If the test stubs `loadCharts` to a non-promise, wrap with `Promise.resolve()` — `chartsReady = Promise.resolve(loadCharts())` — to keep `await` safe.)

- [ ] **Step 3: Lint + commit**

```bash
npx eslint libs/blocks/milo-dashboard/milo-dashboard.js
git add libs/blocks/milo-dashboard/milo-dashboard.js
git commit -m "perf(milo-dashboard): start data fetch in parallel with echarts download"
```

---

## Task 8: Backend read-route response cache (Change 8)

Add a single-flight TTL cache to the read-only aggregate routes in `milo-logs-deploy`. Reduces shared-DB load; does not touch `pool max: 1`.

**Files:**
- Create: `src/utils/query-cache.js`
- Modify: `src/routes/index.js`
- Test: `tests/query-cache.test.js`

> Run all backend commands from `/Users/skholkhojaev/Repos/milo-logs-deploy`. This repo restricts shell to `git add/commit/push` plus explicitly-approved commands — `npm test` and `npx eslint` need approval if not already granted.

- [ ] **Step 1: Write the failing test**

Create `tests/query-cache.test.js`:

```javascript
import { jest } from '@jest/globals';
import { cached, clearQueryCache } from '../src/utils/query-cache.js';

afterEach(() => clearQueryCache());

test('caches a result so the underlying fn runs once within TTL', async () => {
  const fn = jest.fn(async ({ since }) => ({ since, n: Math.random() }));
  const wrapped = cached('overview', fn, 1000);
  const a = await wrapped({ since: '7d' });
  const b = await wrapped({ since: '7d' });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(b).toEqual(a);
});

test('keys by normalized args', async () => {
  const fn = jest.fn(async ({ since }) => since);
  const wrapped = cached('overview', fn, 1000);
  await wrapped({ since: '7d' });
  await wrapped({ since: '30d' });
  expect(fn).toHaveBeenCalledTimes(2);
});

test('single-flights concurrent identical calls', async () => {
  let calls = 0;
  const fn = async () => { calls += 1; await new Promise((r) => setTimeout(r, 10)); return calls; };
  const wrapped = cached('totals', fn, 1000);
  const [a, b] = await Promise.all([wrapped({}), wrapped({})]);
  expect(calls).toBe(1);
  expect(a).toBe(b);
});

test('does not cache errors', async () => {
  let calls = 0;
  const fn = async () => { calls += 1; if (calls === 1) throw new Error('boom'); return 'ok'; };
  const wrapped = cached('projects', fn, 1000);
  await expect(wrapped({})).rejects.toThrow('boom');
  await expect(wrapped({})).resolves.toBe('ok');
  expect(calls).toBe(2);
});

test('expires after TTL', async () => {
  const fn = jest.fn(async () => 'v');
  const wrapped = cached('overview', fn, 5);
  await wrapped({ since: '7d' });
  await new Promise((r) => setTimeout(r, 20));
  await wrapped({ since: '7d' });
  expect(fn).toHaveBeenCalledTimes(2);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- query-cache`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create query-cache.js**

```javascript
// Short-TTL single-flight cache for read-only aggregate queries. Mirrors the
// authCache pattern in src/middleware/auth.js: store the in-flight promise so
// concurrent identical calls share one DB query (single-flight) and subsequent
// calls within the TTL resolve from memory. Errors are not cached. This strictly
// REDUCES load on the shared pool (max: 1) — it adds no queries and touches no
// shared infra.
const DEFAULT_TTL_MS = 60 * 1000;
const store = new Map();

export const clearQueryCache = () => store.clear();

export function cached(name, fn, ttlMs = DEFAULT_TTL_MS) {
  return (args = {}) => {
    const key = `${name}:${JSON.stringify(args)}`;
    const hit = store.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise;

    const promise = Promise.resolve().then(() => fn(args));
    store.set(key, { expires: Date.now() + ttlMs, promise });
    promise.catch(() => store.delete(key)); // don't cache failures
    return promise;
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- query-cache`
Expected: PASS (all 5 tests).

- [ ] **Step 5: Wire cached read handlers in routes/index.js**

Add the import:

```javascript
import { cached } from '../utils/query-cache.js';
```

Create cached wrappers near the top of the file (after imports), passing only the relevant params so the cache key isn't fragmented by `clientId`/token:

```javascript
const cOverview  = cached('overview',  ({ since }) => getOverview({ since }));
const cProjects  = cached('projects',  ({ since }) => getProjects({ since }));
const cTotals    = cached('totals',    () => getTotals());
const cEdsTrends = cached('eds',       ({ since, interval }) => getEdsTrends({ since, interval }));
const cPfTrends  = cached('preflight', ({ since, interval }) => getPreflightTrends({ since, interval }));
const cTestPages = cached('testpages', ({ since, state, limit }) => getTestPages({ since, state, limit }));
```

Replace the route handlers to call the cached wrappers:

```javascript
router.get('/trends/eds',       requireAuth, handle(async (req, res) => res.json(await cEdsTrends({ since: req.query.since, interval: req.query.interval }))));
router.get('/trends/preflight', requireAuth, handle(async (req, res) => res.json(await cPfTrends({ since: req.query.since, interval: req.query.interval }))));
router.get('/overview',         requireAuth, handle(async (req, res) => res.json(await cOverview({ since: req.query.since }))));
router.get('/projects',         requireAuth, handle(async (req, res) => res.json(await cProjects({ since: req.query.since }))));
router.get('/totals',           requireAuth, handle(async (req, res) => res.json(await cTotals({}))));
```

And the CSV test-pages route:

```javascript
router.get('/test-pages', requireAuth, handle(async (req, res) => {
  res.type('text/csv').send(await cTestPages({ since: req.query.since, state: req.query.state, limit: req.query.limit }));
}));
```

(Leave `/search-pages`, `/block-summary`, `/block-usage` on the plain `csv(...)` wrapper — they aren't dashboard hot paths.)

- [ ] **Step 6: Run the full backend suite**

Run: `npm test`
Expected: PASS — all suites green (the cache is transparent; existing route tests still pass because the wrappers call the same data functions).

- [ ] **Step 7: Lint + security review + commit**

Run: `npx eslint src/utils/query-cache.js src/routes/index.js`
Then per `milo-logs-deploy/.claude/rules/security.md`, run `/security-review` on `src/routes/index.js` (caching sits after `requireAuth`; confirm no auth bypass and no per-user data mixed under a shared key — the keys use only `since`/`interval`/`state`/`limit`, not identity).

```bash
git add src/utils/query-cache.js src/routes/index.js tests/query-cache.test.js
git commit -m "perf: cache read-only aggregate routes with single-flight TTL cache"
```

---

## Task 9: Final verification + deferred notes (Changes 5 & 9)

**Files:**
- Modify: next handoff doc (capture deferred items) — `milo/docs/plans/`

- [ ] **Step 1: Run both full test suites + lint**

milo:
```bash
cd /Users/skholkhojaev/Repos/milo
npm run test:file -- test/blocks/milo-dashboard/api.test.js test/blocks/milo-dashboard/milo-dashboard.test.js test/blocks/milo-dashboard/charts.test.js
npm run test:file -- test/blocks/milo-dashboard/info-tip.test.js
npx eslint libs/blocks/milo-dashboard/*.js libs/blocks/milo-dashboard/panels/*.js
npx stylelint libs/blocks/milo-dashboard/milo-dashboard.css
```
milo-logs-deploy:
```bash
cd /Users/skholkhojaev/Repos/milo-logs-deploy && npm test
```
Expected: all green, no lint errors.

- [ ] **Step 2: Record deferred items (#1, #8) for Okan**

Add to the "Open / next" section of the latest handoff (`milo/docs/plans/2026-06-03-milo-world-dashboard-handoff.md` or its successor):
- **#1 Trim KPI cards** — Active Projects + Pages Below 70 overlap other panels; decide which to keep.
- **#8 Few projects / search** — root cause is upstream: `getProjects` is window-scoped and the ingestor only ingests ~4 `INGEST_SITES`. A frontend search adds little until more consumers are onboarded (Okan's roadmap). Revisit then.

- [ ] **Step 3: Commit the handoff note**

```bash
cd /Users/skholkhojaev/Repos/milo
git add docs/plans/2026-06-03-milo-world-dashboard-handoff.md
git commit -m "docs: capture deferred Milo World items (KPI trim, projects search) for Okan"
```

- [ ] **Step 4: Push both branches (ASK FIRST — push is not pre-approved)**

Confirm with the user before pushing. Then:
```bash
# milo
git push origin milo-world-dashboard
# milo-logs-deploy (auto-deploys main→stage→prod; this is a feature branch, open a PR per handoff §4)
```

---

## Self-Review

**Spec coverage:**
- Change 1 (arrow) → Task 1 ✓
- Change 2 (+N more) → Task 4 ✓
- Change 3 (tooltips) → Tasks 2 + 3 ✓
- Change 4 (all-time placement) → Task 5 ✓
- Change 5 (deferred) → Task 9 ✓
- Change 6 (charts blank) → Task 6 ✓
- Change 7 (parallelize) → Task 7 ✓
- Change 8 (backend cache) → Task 8 ✓
- Change 9 (deferred capture) → Task 9 ✓

**Type/name consistency:** `infoTip(text)` defined Task 2, used Tasks 3 & 5. `renderTotals(container, totals, headerStat)` defined Task 5 (third arg = `allTimeBody`). `cached(name, fn, ttlMs)` + `clearQueryCache()` defined Task 8, used in the same task. `makeChart`/`clearCharts` instance shape gains `ro` in Task 6 (both functions updated together). Delta classes `good`/`bad`/`flat` + `rose`/`fell` consistent between Task 1 JS and CSS.

**Note on existing tests:** Tasks 1 and 5 modify assertions in existing test files (old `.up`/`.down`, old "Pages stored" title). Each task's steps call this out explicitly.
