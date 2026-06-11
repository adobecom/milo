# GWP Project Tracking — milo block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port GWP Project Tracking (paste page URLs → per-URL preview/publish status + "% previewed / % published" rollup) from the React `milostudio-ui` prototype to a vanilla **milo block** that runs on the DA/EDS tools surface, where per-user auth already works via the DA SDK (`darkalley`) token — no IMS-console or Milo Studio changes.

**Architecture:** New block `libs/blocks/project-tracking/` in `adobecom/milo`. It reuses the milo-dashboard block's `api.js` (`resolveContext` → DA SDK token; `createClient` → milo-core), to which we add a `post()` method for the `POST /page-status` call. The pure `computeRollup` ports verbatim. UI is built with `createTag` and styled by a scoped CSS file with hardcoded values (DA cross-origin = design tokens out of scope, same as `milo-dashboard.css`).

**Tech Stack:** Vanilla JS milo block (`init(block)` export, `createTag`, `loadStyle`), milo's web-test-runner harness (`@esm-bundle/chai` + `sinon`), echarts not needed.

**Branch:** work on a new branch `project-tracking` off `milo-world-dashboard` (so the dashboard's `api.js` DA path is present). **All local — do NOT push.**

**Source of truth for the port:** `~/Repo/milostudio-ui/src/routes/projectTracking/` (`ProjectTracking.jsx`, `rollup.js`, `pageStatus.js`).

---

## File Structure

- **Modify** `libs/blocks/milo-dashboard/api.js` — add a `post(path, body, params)` method to `createClient` (refactor the internal `request` to take method/body). Shared client; benefits both blocks.
- **Create** `libs/blocks/project-tracking/rollup.js` — pure `computeRollup` (ported verbatim from milostudio-ui).
- **Create** `libs/blocks/project-tracking/project-tracking.js` — the block: `init(block)`, `parseUrls`, fetch `/page-status`, render input + results (stat cards, count-from-date, per-URL table), loading/error states.
- **Create** `libs/blocks/project-tracking/project-tracking.css` — scoped styles, hardcoded values.
- **Modify** `libs/utils/utils.js` — add `'project-tracking'` to `C1_BLOCKS`.
- **Create** `test/blocks/project-tracking/rollup.test.js` — rollup unit tests (chai).
- **Create** `test/blocks/project-tracking/project-tracking.test.js` — `parseUrls` unit tests (chai).
- **Modify** `test/blocks/milo-dashboard/api.test.js` — add a test for the new `post()` method.

---

### Task 1: Add `post()` to the shared milo-core client

**Files:**
- Modify: `libs/blocks/milo-dashboard/api.js`
- Test: `test/blocks/milo-dashboard/api.test.js`

- [ ] **Step 1: Write the failing test** (append inside the top-level `describe` in `test/blocks/milo-dashboard/api.test.js`)

```js
describe('createClient.post', () => {
  it('POSTs a JSON body and returns parsed JSON, with auth + clientId', async () => {
    const fetchStub = sinon.stub(window, 'fetch').resolves(
      new Response(JSON.stringify([{ url: 'u', previewed: true }]), { status: 200 }),
    );
    const client = createClient({ base: 'https://api.example', token: 'tok', clientId: 'darkalley' });
    const out = await client.post('/page-status', { urls: ['u'] });

    expect(out).to.deep.equal([{ url: 'u', previewed: true }]);
    const [calledUrl, opts] = fetchStub.firstCall.args;
    expect(calledUrl.toString()).to.contain('https://api.example/page-status');
    expect(calledUrl.toString()).to.contain('clientId=darkalley');
    expect(opts.method).to.equal('POST');
    expect(opts.headers.Authorization).to.equal('Bearer tok');
    expect(opts.headers['Content-Type']).to.equal('application/json');
    expect(JSON.parse(opts.body)).to.deep.equal({ urls: ['u'] });
  });

  it('throws an error carrying .status on a non-2xx response', async () => {
    sinon.stub(window, 'fetch').resolves(new Response('nope', { status: 403 }));
    const client = createClient({ base: 'https://api.example', token: 't', clientId: 'c' });
    let err;
    try { await client.post('/page-status', { urls: [] }); } catch (e) { err = e; }
    expect(err).to.exist;
    expect(err.status).to.equal(403);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:file -- test/blocks/milo-dashboard/api.test.js`
Expected: FAIL — `client.post is not a function`.

- [ ] **Step 3: Implement** — in `libs/blocks/milo-dashboard/api.js`, replace the `createClient` function (lines 58–88) with this version (refactors `request` to accept method/body/extra headers; adds `post`; `get`/`getText` behavior unchanged):

```js
export function createClient({ base, token, clientId }) {
  async function request(path, params = {}, { method = 'GET', body, extraHeaders } = {}) {
    const url = new URL(`${base}${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
    const headers = { ...extraHeaders };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      if (clientId) url.searchParams.set('clientId', clientId);
    }
    const res = await fetch(url, { method, headers, body });
    if (!res.ok) {
      const e = new Error(`api ${res.status}`);
      e.status = res.status;
      throw e;
    }
    return res;
  }

  return {
    async get(path, params = {}) {
      const res = await request(path, params);
      return res.json();
    },
    async getText(path, params = {}) {
      const res = await request(path, params);
      return res.text();
    },
    async post(path, body, params = {}) {
      const res = await request(path, params, {
        method: 'POST',
        body: JSON.stringify(body),
        extraHeaders: { 'Content-Type': 'application/json' },
      });
      return res.json();
    },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:file -- test/blocks/milo-dashboard/api.test.js`
Expected: PASS — existing api tests + the 2 new `post` tests all green.

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/milo-dashboard/api.js test/blocks/milo-dashboard/api.test.js
git commit -m "feat(milo-dashboard): add post() to the milo-core api client"
```

---

### Task 2: Port the pure rollup

**Files:**
- Create: `libs/blocks/project-tracking/rollup.js`
- Test: `test/blocks/project-tracking/rollup.test.js`

- [ ] **Step 1: Write the failing test** — create `test/blocks/project-tracking/rollup.test.js`:

```js
import { expect } from '@esm-bundle/chai';

const { computeRollup } = await import('../../../libs/blocks/project-tracking/rollup.js');

const row = (lastPreview, lastPublish) => ({ lastPreview, lastPublish });

describe('project-tracking rollup', () => {
  it('empty input → zeroed rollup, no divide-by-zero', () => {
    expect(computeRollup([])).to.deep.equal({
      total: 0, previewed: 0, published: 0, previewedPct: 0, publishedPct: 0,
    });
  });

  it('counts over all pasted links (denominator = total)', () => {
    const rows = [
      row('2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z'),
      row('2024-01-01T00:00:00Z', null),
      row('2024-01-01T00:00:00Z', '2024-01-03T00:00:00Z'),
      row(null, null),
    ];
    expect(computeRollup(rows)).to.deep.equal({
      total: 4, previewed: 3, published: 2, previewedPct: 75, publishedPct: 50,
    });
  });

  it('percentages round to whole numbers', () => {
    const rows = [row('2024-01-01T00:00:00Z', null), row(null, null), row(null, null)];
    const r = computeRollup(rows);
    expect(r.previewedPct).to.equal(33);
    expect(r.publishedPct).to.equal(0);
  });

  it('since filter: only events on/after the date count', () => {
    const rows = [
      row('2024-01-10T00:00:00Z', '2024-01-10T00:00:00Z'),
      row('2023-12-01T00:00:00Z', '2023-12-01T00:00:00Z'),
    ];
    const r = computeRollup(rows, { since: '2024-01-01' });
    expect(r.previewed).to.equal(1);
    expect(r.published).to.equal(1);
    expect(r.total).to.equal(2);
  });

  it('invalid since is ignored (treated as no filter)', () => {
    const rows = [row('2020-01-01T00:00:00Z', null)];
    expect(computeRollup(rows, { since: 'not-a-date' }).previewed).to.equal(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:file -- test/blocks/project-tracking/rollup.test.js`
Expected: FAIL — cannot find `rollup.js`.

- [ ] **Step 3: Implement** — create `libs/blocks/project-tracking/rollup.js`:

```js
// Pure rollup logic for GWP Project Tracking. A page "counts" as previewed/
// published if it has that event timestamp and — when a start-tracking date is
// given — the event is on/after it. The denominator is always the total pasted
// links (locked scope: "% of the copied links").
function counts(when, sinceMs) {
  if (!when) return false;
  if (sinceMs == null) return true;
  const t = new Date(when).getTime();
  return !Number.isNaN(t) && t >= sinceMs;
}

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

export function computeRollup(rows = [], { since } = {}) {
  const sinceTime = since != null ? new Date(since).getTime() : NaN;
  const sinceMs = Number.isNaN(sinceTime) ? null : sinceTime;

  const total = rows.length;
  let previewed = 0;
  let published = 0;
  rows.forEach((r) => {
    if (counts(r.lastPreview, sinceMs)) previewed += 1;
    if (counts(r.lastPublish, sinceMs)) published += 1;
  });

  return {
    total,
    previewed,
    published,
    previewedPct: pct(previewed, total),
    publishedPct: pct(published, total),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:file -- test/blocks/project-tracking/rollup.test.js`
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/project-tracking/rollup.js test/blocks/project-tracking/rollup.test.js
git commit -m "feat(project-tracking): add pure computeRollup"
```

---

### Task 3: The block — `parseUrls` + render + data flow

**Files:**
- Create: `libs/blocks/project-tracking/project-tracking.js`
- Test: `test/blocks/project-tracking/project-tracking.test.js`

- [ ] **Step 1: Write the failing test** — create `test/blocks/project-tracking/project-tracking.test.js`:

```js
import { expect } from '@esm-bundle/chai';

const { parseUrls } = await import('../../../libs/blocks/project-tracking/project-tracking.js');

describe('project-tracking parseUrls', () => {
  it('splits on newlines, trims, drops empties', () => {
    expect(parseUrls('  a \n\n b \n')).to.deep.equal(['a', 'b']);
  });
  it('also splits on commas', () => {
    expect(parseUrls('a, b ,c')).to.deep.equal(['a', 'b', 'c']);
  });
  it('returns [] for empty/whitespace/undefined', () => {
    expect(parseUrls('')).to.deep.equal([]);
    expect(parseUrls('   \n ')).to.deep.equal([]);
    expect(parseUrls(undefined)).to.deep.equal([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:file -- test/blocks/project-tracking/project-tracking.test.js`
Expected: FAIL — cannot find `project-tracking.js`.

- [ ] **Step 3: Implement** — create `libs/blocks/project-tracking/project-tracking.js`:

```js
import { createTag, loadStyle } from '../../utils/utils.js';
import { resolveContext, createClient, loadDaSdk } from '../milo-dashboard/api.js';
import { computeRollup } from './rollup.js';

const PLACEHOLDER = [
  'https://main--da-bacom--adobecom.aem.page/de/some-campaign-page',
  'https://main--da-bacom--adobecom.aem.page/fr/some-campaign-page',
  'https://main--da-bacom--adobecom.aem.page/jp/some-campaign-page',
].join('\n');

// Split a pasted blob into trimmed, non-empty URL lines (newline- or comma-separated).
export function parseUrls(text) {
  return (text || '')
    .split(/\n|,/)
    .map((u) => u.trim())
    .filter(Boolean);
}

function statusCell(when) {
  if (!when) return createTag('td', { class: 'pt-cell pt-empty' }, '—');
  const date = new Date(when).toLocaleDateString();
  const cell = createTag('td', { class: 'pt-cell pt-ok', title: when });
  cell.append(createTag('span', { class: 'pt-check' }, '✓'), ` ${date}`);
  return cell;
}

function statCard(label, pctValue, count, total, variant) {
  const card = createTag('div', { class: `pt-stat pt-stat--${variant}` });
  const head = createTag('div', { class: 'pt-stat-head' });
  head.append(
    createTag('span', { class: 'pt-stat-label' }, label),
    createTag('span', { class: 'pt-stat-frac' }, `${count} / ${total}`),
  );
  const big = createTag('div', { class: 'pt-stat-pct' }, `${pctValue}%`);
  const bar = createTag('div', { class: 'pt-bar' });
  bar.append(createTag('div', { class: 'pt-bar-fill', style: `width:${pctValue}%` }));
  card.append(head, big, bar);
  return card;
}

function renderResults(mount, rows, since) {
  mount.replaceChildren();
  if (rows.length === 0) {
    mount.append(createTag('p', { class: 'pt-muted' }, 'No URLs to check.'));
    return;
  }
  const rollup = computeRollup(rows, { since: since || undefined });

  const stats = createTag('div', { class: 'pt-stats' });
  stats.append(
    statCard('Previewed', rollup.previewedPct, rollup.previewed, rollup.total, 'previewed'),
    statCard('Published', rollup.publishedPct, rollup.published, rollup.total, 'published'),
  );

  const table = createTag('table', { class: 'pt-table' });
  const thead = createTag('tr');
  thead.append(
    createTag('th', {}, 'Page'),
    createTag('th', {}, 'Previewed'),
    createTag('th', {}, 'Published'),
  );
  table.append(createTag('thead', {}, thead));
  const tbody = createTag('tbody');
  rows.forEach((r) => {
    const tr = createTag('tr');
    const linkCell = createTag('td', { class: 'pt-cell pt-url' });
    linkCell.append(createTag('a', {
      class: 'pt-link', href: r.url, target: '_blank', rel: 'noopener noreferrer',
    }, r.url));
    tr.append(linkCell, statusCell(r.lastPreview), statusCell(r.lastPublish));
    tbody.append(tr);
  });
  table.append(tbody);

  mount.append(stats, createTag('div', { class: 'pt-table-wrap' }, table));
}

export default async function init(block) {
  await new Promise((resolve) => { loadStyle(import.meta.url.replace('.js', '.css'), resolve); });

  const ctx = await resolveContext(block, { loadDaSdk });
  const client = createClient(ctx);

  block.replaceChildren();

  const header = createTag('div', { class: 'pt-header' });
  const checkBtn = createTag('button', { type: 'button', class: 'pt-check-btn' }, 'Check status');
  header.append(createTag('h2', { class: 'pt-title' }, 'Project Tracking'), checkBtn);

  const label = createTag('label', { class: 'pt-label', for: 'pt-urls' }, 'Pages to track');
  const hint = createTag('p', { class: 'pt-hint' }, 'Paste one URL per line, then Check status.');
  const textarea = createTag('textarea', {
    id: 'pt-urls', class: 'pt-textarea', placeholder: PLACEHOLDER, inputmode: 'url',
  });
  const count = createTag('p', { class: 'pt-count' }, '0 URLs entered');

  const since = createTag('input', { type: 'date', class: 'pt-since' });
  const sinceLabel = createTag('label', { class: 'pt-since-label' }, 'Count from date ');
  sinceLabel.append(since);

  const results = createTag('div', { class: 'pt-results' },
    createTag('p', { class: 'pt-muted' }, 'Results will appear here after you check status.'));

  block.append(header, label, hint, textarea, count, sinceLabel, results);

  let rows = null;

  const updateCount = () => {
    const n = parseUrls(textarea.value).length;
    count.textContent = `${n} URL${n === 1 ? '' : 's'} entered`;
  };

  const rerender = () => {
    if (rows) renderResults(results, rows, since.value);
  };

  const check = async () => {
    const urls = parseUrls(textarea.value);
    if (urls.length === 0 || checkBtn.disabled) return;
    checkBtn.disabled = true;
    checkBtn.textContent = 'Checking…';
    results.replaceChildren(createTag('p', { class: 'pt-muted' }, 'Checking…'));
    try {
      rows = await client.post('/page-status', { urls });
      renderResults(results, rows, since.value);
    } catch (e) {
      rows = null;
      const msg = e.status === 401 || e.status === 403
        ? 'Not authorized — sign in to Adobe and make sure you have access.'
        : `Could not reach page-status (${e.message}).`;
      results.replaceChildren(createTag('p', { class: 'pt-error' }, msg));
    } finally {
      checkBtn.disabled = false;
      checkBtn.textContent = 'Check status';
    }
  };

  textarea.addEventListener('input', updateCount);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); }
  });
  checkBtn.addEventListener('click', check);
  since.addEventListener('change', rerender);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:file -- test/blocks/project-tracking/project-tracking.test.js`
Expected: PASS — 3 `parseUrls` tests. (Importing the module does not call `loadDaSdk`, so no network.)

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/project-tracking/project-tracking.js test/blocks/project-tracking/project-tracking.test.js
git commit -m "feat(project-tracking): block render + page-status data flow"
```

---

### Task 4: Block CSS

**Files:**
- Create: `libs/blocks/project-tracking/project-tracking.css`

- [ ] **Step 1: Create the stylesheet** — `libs/blocks/project-tracking/project-tracking.css` (hardcoded values mirror `milo-dashboard.css` / DA Spectrum-2 light mode; scoped to `.project-tracking`):

```css
/* Project Tracking — styling matched to the milo-dashboard block (DA Spectrum 2
   light mode). Values hardcoded: in DA the block runs cross-origin, so DA :root
   tokens are out of scope. */
.project-tracking {
  --pt-accent: #3b63fb;
  --pt-good: #079355;
  --pt-ink: #292929;
  --pt-ink-soft: #505050;
  --pt-line: #e1e1e1;
  --pt-radius: 12px;

  padding: 24px;
  font-family: var(--body-font-family, "Adobe Clean", adobe-clean, sans-serif);
  color: var(--pt-ink);

  & .pt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 16px;
  }

  & .pt-title { font-size: 22px; font-weight: 700; margin: 0; }

  & .pt-check-btn {
    background: var(--pt-accent);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    min-height: 44px;
  }
  & .pt-check-btn:disabled { opacity: 0.6; cursor: default; }

  & .pt-label { display: block; margin-block-end: 4px; font-size: 15px; font-weight: 700; }
  & .pt-hint { margin: 0 0 10px; font-size: 13px; color: var(--pt-ink-soft); }

  & .pt-textarea {
    width: 100%;
    box-sizing: border-box;
    min-height: 280px;
    resize: vertical;
    padding: 14px 16px;
    border: 1px solid var(--pt-line);
    border-radius: var(--pt-radius);
    font: inherit;
    font-size: 14px;
    line-height: 1.6;
    color: var(--pt-ink);
    background: #fff;
  }
  & .pt-textarea:focus {
    outline: none;
    border-color: var(--pt-accent);
    box-shadow: 0 0 0 2px #eaeeff;
  }

  & .pt-count { margin-block-start: 10px; font-size: 13px; font-weight: 600; color: var(--pt-ink-soft); }

  & .pt-since-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-block: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--pt-ink-soft);
  }
  & .pt-since {
    border: 1px solid var(--pt-line);
    border-radius: 8px;
    padding: 6px 8px;
    font: inherit;
    font-size: 13px;
  }

  & .pt-muted { color: var(--pt-ink-soft); font-size: 14px; }
  & .pt-error { color: #d32011; font-size: 14px; }

  & .pt-stats { display: flex; flex-wrap: wrap; gap: 16px; margin-block: 8px 24px; }
  & .pt-stat {
    flex: 1;
    min-width: 200px;
    border: 1px solid var(--pt-line);
    border-radius: var(--pt-radius);
    padding: 16px 20px;
  }
  & .pt-stat--previewed { background: #eaeeff; }
  & .pt-stat--published { background: #edfcf1; }
  & .pt-stat-head { display: flex; justify-content: space-between; align-items: baseline; }
  & .pt-stat-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pt-ink-soft);
  }
  & .pt-stat-frac { font-size: 12px; color: var(--pt-ink-soft); }
  & .pt-stat-pct { font-size: 34px; font-weight: 700; line-height: 1.15; margin-block-start: 2px; }
  & .pt-stat--previewed .pt-stat-pct { color: var(--pt-accent); }
  & .pt-stat--published .pt-stat-pct { color: var(--pt-good); }
  & .pt-bar {
    margin-block-start: 10px;
    height: 8px;
    border-radius: 99px;
    background: #fff;
    border: 1px solid var(--pt-line);
    overflow: hidden;
  }
  & .pt-stat--previewed .pt-bar-fill { background: var(--pt-accent); }
  & .pt-stat--published .pt-bar-fill { background: var(--pt-good); }
  & .pt-bar-fill { height: 100%; border-radius: 99px; }

  & .pt-table-wrap { border: 1px solid var(--pt-line); border-radius: var(--pt-radius); overflow: hidden; }
  & .pt-table { width: 100%; border-collapse: collapse; text-align: start; font-size: 14px; }
  & .pt-table th {
    background: #f5f5f5;
    color: var(--pt-ink-soft);
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: start;
  }
  & .pt-cell { padding: 12px 16px; }
  & .pt-table tbody tr { border-block-start: 1px solid #efefef; }
  & .pt-url { word-break: break-all; }
  & .pt-link { color: var(--pt-accent); text-decoration: none; }
  & .pt-link:hover { text-decoration: underline; }
  & .pt-ok { color: var(--pt-good); white-space: nowrap; }
  & .pt-check { font-weight: 700; }
  & .pt-empty { color: #b0b0b0; }
}
```

- [ ] **Step 2: Verify lint** — Run: `npm run lint:css -- libs/blocks/project-tracking/` (if that script exists; otherwise `npm run lint`). Expected: no errors for the new file.

- [ ] **Step 3: Commit**

```bash
git add libs/blocks/project-tracking/project-tracking.css
git commit -m "feat(project-tracking): block styles (DA light-mode, hardcoded)"
```

---

### Task 5: Register the block

**Files:**
- Modify: `libs/utils/utils.js`

- [ ] **Step 1: Add to `C1_BLOCKS`** — in `libs/utils/utils.js`, in the `C1_BLOCKS` array, add `'project-tracking',` immediately after the `'milo-dashboard',` entry (keep alphabetical-ish grouping consistent with neighbors).

```js
  'milo-dashboard',
  'project-tracking',
```

- [ ] **Step 2: Verify the full unit suite + lint still pass**

Run: `npm run test:file -- test/blocks/project-tracking/project-tracking.test.js test/blocks/project-tracking/rollup.test.js test/blocks/milo-dashboard/api.test.js`
Then: `npm run lint:js -- libs/blocks/project-tracking/ libs/utils/utils.js`
Expected: all tests pass; lint clean.

- [ ] **Step 3: Commit**

```bash
git add libs/utils/utils.js
git commit -m "feat(project-tracking): register block in C1_BLOCKS"
```

---

### Task 6: Manual DA-draft demo (verification — not committed)

No code change. This proves the block runs with real auth on the DA surface. Requires the user's da.live login.

- [ ] **Step 1: Author a draft tool doc in DA.** In da.live for `adobecom/milo`, create a draft document (e.g. `/drafts/<you>/project-tracking`) containing a single `project-tracking` block table (one cell with the block name; no config rows needed — `resolveContext` derives base + DA SDK token automatically). Save.

- [ ] **Step 2: Open it on the branch.** Visit the DA app URL for that draft with `?ref=project-tracking` (the branch), e.g.
  `https://da.live/app/adobecom/milo/drafts/<you>/project-tracking?ref=project-tracking`
  (mirrors how the dashboard is opened with `?ref=milo-world-dashboard`).

- [ ] **Step 3: Exercise it.** Paste a few `langstore/<locale>/…` URLs (reliable preview-only signal) → Check status. Expect: per-URL Previewed/Published cells + the % stat cards, from real prod data, authed silently via the DA SDK `darkalley` token. Set "Count from date" → the rollup recomputes.

**Exit criterion:** the block renders real `/page-status` data on the DA surface with no manual token. If it 401s, confirm you're signed into da.live (DA SDK token present) and that milo-core CORS allows the `…aem.page` origin (it already does).

---

## Self-Review

**Spec coverage (the design):**
- Reuse DA-SDK auth via `api.js` → Task 3 imports `resolveContext/createClient/loadDaSdk`. ✓
- `POST /page-status` → Task 1 adds `post()`; Task 3 calls it. ✓
- Per-URL status + % rollup + count-from-date → Task 2 (`computeRollup`) + Task 3 (`renderResults`, `since`). ✓
- Vanilla milo block conventions (`init`, `createTag`, `loadStyle(import.meta.url…)`, scoped CSS, test file, C1_BLOCKS) → Tasks 3–5. ✓
- Demo on DA surface, self-service (draft doc + `?ref`) → Task 6. ✓
- All local, no push → stated in header; every step commits locally only. ✓

**Placeholder scan:** none — every code step has complete code.

**Type/name consistency:** `parseUrls`, `computeRollup({since})`, `createClient(...).post(path, body, params)`, `renderResults(mount, rows, since)`, CSS classes (`pt-stat--previewed/published`, `pt-bar-fill`, `pt-link`, `pt-ok`, `pt-empty`) are used consistently across tasks. The `/page-status` row shape `{ url, lastPreview, lastPublish }` matches `computeRollup` + `statusCell`.

**Out of scope (deferred):** published SharePoint `/tools/...` page (Okan/content — last mile); localization via placeholders (tool is English, matches milo-dashboard precedent); the milo PR itself (no push until the user finalizes).
