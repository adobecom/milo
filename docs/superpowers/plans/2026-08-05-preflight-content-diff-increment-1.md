# Preflight Content Diff — Increment 1 (Engine + Wiring) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the preview-vs-live diff engine and wire it into preflight so that, on preview, the page's content and metadata changes are computed, logged to milo-logs, and surfaced as a nudge — with no compare UI yet (console/nudge-demoable).

**Architecture:** Pure functions do the work (`diffContent`, `diffMetadata` over `.plain.html` DOM trees; `fetchVersions` for acquisition), a thin `checks/diff.js` adapts them to preflight's check contract and registers in `preflightApi.js`, and existing hooks (`captureMetrics`, the `previewed` listener) are extended. The compare panel is a separate follow-up plan.

**Tech Stack:** Vanilla ESM, Milo `htm-preact` (later, for the panel), Web Test Runner + `@esm-bundle/chai` + `sinon`. No new dependencies.

## Global Constraints

- All new code lives under `libs/blocks/preflight/` (feature stays inside preflight).
- No new runtime dependencies; browser-native DOM APIs only.
- Diff engine functions are **pure** (DOM/values in, plain objects out) — no network, no rendering, no module-level mutable state.
- Check result shape must match existing checks: `{ name|title, status, severity, details }` with `status ∈ {pass,fail,limbo,empty}` (`checks/constants.js` `STATUS`) and `severity ∈ {critical,warning}` (`SEVERITY`).
- Preview = the new version (current page); Live = the old version. "added" = in preview not live; "removed" = in live not preview; "modified" = same slot, text changed.
- Auto-run/nudge only in the authoring/preview context (`*.aem.page`); never on `*.aem.live`.
- Tests: mirror `test/blocks/preflight/checks/merch.test.js` conventions (`import { expect } from '@esm-bundle/chai'; import sinon from 'sinon';`, `sinon.restore()` in `afterEach`).

---

### Task 1: Node path + text helpers

**Files:**
- Create: `libs/blocks/preflight/checks/diff/nodePath.js`
- Test: `test/blocks/preflight/checks/diff/nodePath.test.js`

**Interfaces:**
- Produces: `normalizeText(text: string) → string`; `getXPath(node: Element, root: Element) → string` (XPath-style path relative to `root`, e.g. `/div[1]/p[2]`).

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import { normalizeText, getXPath } from '../../../../../libs/blocks/preflight/checks/diff/nodePath.js';

describe('preflight diff nodePath', () => {
  it('normalizeText collapses whitespace and trims', () => {
    expect(normalizeText('  a\n  b   c ')).to.equal('a b c');
    expect(normalizeText(undefined)).to.equal('');
  });

  it('getXPath builds a tag[index] path relative to root', () => {
    const root = document.createElement('main');
    root.innerHTML = '<div><p>one</p><p>two</p></div><div><h2>h</h2></div>';
    const secondP = root.querySelectorAll('p')[1];
    const h2 = root.querySelector('h2');
    expect(getXPath(secondP, root)).to.equal('/div[1]/p[2]');
    expect(getXPath(h2, root)).to.equal('/div[2]/h2[1]');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/checks/diff/nodePath.test.js --node-resolve`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
// libs/blocks/preflight/checks/diff/nodePath.js
export function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

export function getXPath(node, root) {
  const segs = [];
  let el = node;
  while (el && el !== root && el.parentElement) {
    let index = 1;
    let sib = el.previousElementSibling;
    while (sib) {
      if (sib.tagName === el.tagName) index += 1;
      sib = sib.previousElementSibling;
    }
    segs.unshift(`${el.tagName.toLowerCase()}[${index}]`);
    el = el.parentElement;
  }
  return `/${segs.join('/')}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx wtr test/blocks/preflight/checks/diff/nodePath.test.js --node-resolve`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/preflight/checks/diff/nodePath.js test/blocks/preflight/checks/diff/nodePath.test.js
git commit -m "MWPW-199318: add node path/text helpers for preflight diff"
```

---

### Task 2: Content diff engine (`diffContent`)

**Files:**
- Create: `libs/blocks/preflight/checks/diff/diffContent.js`
- Test: `test/blocks/preflight/checks/diff/diffContent.test.js`

**Interfaces:**
- Consumes: `normalizeText`, `getXPath` (Task 1).
- Produces: `diffContent(previewRoot: Element, liveRoot: Element) → { added: Change[], modified: Change[], removed: Change[], unchanged: number }` where `Change = { type, path, tag, previewEl?, liveEl?, previewText?, liveText? }`. Element-level: matches content elements (`p, h1-6, li, a, img, button, blockquote`) by identity (tag + own text; href for `a`; src for `img`).

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import diffContent from '../../../../../libs/blocks/preflight/checks/diff/diffContent.js';

function root(htmlStr) {
  const el = document.createElement('main');
  el.innerHTML = htmlStr;
  return el;
}

describe('preflight diffContent', () => {
  it('reports no changes for identical trees', () => {
    const a = root('<div><p>hello</p></div>');
    const b = root('<div><p>hello</p></div>');
    const r = diffContent(a, b);
    expect(r.added).to.have.length(0);
    expect(r.modified).to.have.length(0);
    expect(r.removed).to.have.length(0);
    expect(r.unchanged).to.equal(1);
  });

  it('detects an added element in preview', () => {
    const preview = root('<div><p>hello</p><p>brand new</p></div>');
    const live = root('<div><p>hello</p></div>');
    const r = diffContent(preview, live);
    expect(r.added).to.have.length(1);
    expect(r.added[0].previewText).to.equal('brand new');
    expect(r.removed).to.have.length(0);
  });

  it('detects a removed element (in live, not preview)', () => {
    const preview = root('<div><p>hello</p></div>');
    const live = root('<div><p>hello</p><p>going away</p></div>');
    const r = diffContent(preview, live);
    expect(r.removed).to.have.length(1);
    expect(r.removed[0].liveText).to.equal('going away');
    expect(r.added).to.have.length(0);
  });

  it('detects a modified element (same slot, text changed)', () => {
    const preview = root('<div><h2>New title</h2></div>');
    const live = root('<div><h2>Old title</h2></div>');
    const r = diffContent(preview, live);
    expect(r.modified).to.have.length(1);
    expect(r.modified[0].previewText).to.equal('New title');
    expect(r.modified[0].liveText).to.equal('Old title');
    expect(r.modified[0].path).to.equal('/div[1]/h2[1]');
  });

  it('treats an added link inside preview as added', () => {
    const preview = root('<div><p>see the</p><a href="/x">report</a></div>');
    const live = root('<div><p>see the</p></div>');
    const r = diffContent(preview, live);
    expect(r.added).to.have.length(1);
    expect(r.added[0].tag).to.equal('A');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/checks/diff/diffContent.test.js --node-resolve`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
// libs/blocks/preflight/checks/diff/diffContent.js
import { normalizeText, getXPath } from './nodePath.js';

const CONTENT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, a, img, button, blockquote';

function ownText(el) {
  if (el.tagName === 'IMG') return normalizeText(el.getAttribute('alt') || '');
  return normalizeText(el.textContent);
}

function identity(el) {
  if (el.tagName === 'IMG') return `img|${el.getAttribute('src') || ''}`;
  if (el.tagName === 'A') return `a|${el.getAttribute('href') || ''}|${ownText(el)}`;
  return `${el.tagName.toLowerCase()}|${ownText(el)}`;
}

function collect(rootEl) {
  return [...rootEl.querySelectorAll(CONTENT_SELECTOR)].map((el) => ({
    el,
    path: getXPath(el, rootEl),
    tag: el.tagName,
    text: ownText(el),
    sig: identity(el),
  }));
}

// Longest-common-subsequence match on signatures; returns [liveIdx, previewIdx] pairs.
function lcsPairs(live, preview) {
  const n = live.length;
  const m = preview.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = live[i].sig === preview[j].sig
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (live[i].sig === preview[j].sig) { pairs.push([i, j]); i += 1; j += 1; } else if (dp[i + 1][j] >= dp[i][j + 1]) i += 1;
    else j += 1;
  }
  return pairs;
}

export default function diffContent(previewRoot, liveRoot) {
  const preview = collect(previewRoot);
  const live = collect(liveRoot);
  const pairs = lcsPairs(live, preview);
  const matchedLive = new Set(pairs.map(([i]) => i));
  const matchedPreview = new Set(pairs.map(([, j]) => j));

  const removedCand = live.filter((_, i) => !matchedLive.has(i));
  const addedCand = preview.filter((_, j) => !matchedPreview.has(j));

  const modified = [];
  const removed = [];
  const usedAdded = new Set();
  removedCand.forEach((r) => {
    const mIdx = addedCand.findIndex((a, idx) => !usedAdded.has(idx)
      && a.tag === r.tag && a.path === r.path);
    if (mIdx >= 0) {
      usedAdded.add(mIdx);
      const a = addedCand[mIdx];
      modified.push({
        type: 'modified', path: a.path, tag: a.tag, previewEl: a.el, liveEl: r.el, previewText: a.text, liveText: r.text,
      });
    } else {
      removed.push({
        type: 'removed', path: r.path, tag: r.tag, liveEl: r.el, liveText: r.text,
      });
    }
  });
  const added = addedCand
    .filter((_, idx) => !usedAdded.has(idx))
    .map((a) => ({
      type: 'added', path: a.path, tag: a.tag, previewEl: a.el, previewText: a.text,
    }));

  return { added, modified, removed, unchanged: pairs.length };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx wtr test/blocks/preflight/checks/diff/diffContent.test.js --node-resolve`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/preflight/checks/diff/diffContent.js test/blocks/preflight/checks/diff/diffContent.test.js
git commit -m "MWPW-199318: add element-level content diff engine"
```

---

### Task 3: Metadata diff engine (`diffMetadata`)

**Files:**
- Create: `libs/blocks/preflight/checks/diff/diffMetadata.js`
- Test: `test/blocks/preflight/checks/diff/diffMetadata.test.js`

**Interfaces:**
- Consumes: `normalizeText` (Task 1).
- Produces: `parseMetadata(root: Element) → Record<string,string>`; default `diffMetadata(previewRoot, liveRoot) → { added: Kv[], modified: Kv[], removed: Kv[] }` where `Kv = { key, previewValue?, liveValue? }`. Reads the authored `.metadata` block (`div > div(key) + div(value)` rows).

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import diffMetadata, { parseMetadata } from '../../../../../libs/blocks/preflight/checks/diff/diffMetadata.js';

function root(rows) {
  const el = document.createElement('main');
  el.innerHTML = `<div class="metadata">${rows}</div>`;
  return el;
}
const row = (k, v) => `<div><div>${k}</div><div>${v}</div></div>`;

describe('preflight diffMetadata', () => {
  it('parses metadata rows into a key/value map (keys lowercased)', () => {
    const meta = parseMetadata(root(`${row('Title', 'Hello')}${row('Description', 'D')}`));
    expect(meta).to.deep.equal({ title: 'Hello', description: 'D' });
  });

  it('classifies added, modified, removed keys', () => {
    const preview = root(`${row('Title', 'New')}${row('Robots', 'noindex')}`);
    const live = root(`${row('Title', 'Old')}${row('Keywords', 'a,b')}`);
    const r = diffMetadata(preview, live);
    expect(r.modified).to.deep.equal([{ key: 'title', previewValue: 'New', liveValue: 'Old' }]);
    expect(r.added).to.deep.equal([{ key: 'robots', previewValue: 'noindex' }]);
    expect(r.removed).to.deep.equal([{ key: 'keywords', liveValue: 'a,b' }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/checks/diff/diffMetadata.test.js --node-resolve`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
// libs/blocks/preflight/checks/diff/diffMetadata.js
import { normalizeText } from './nodePath.js';

export function parseMetadata(rootEl) {
  const meta = {};
  const block = rootEl.querySelector('.metadata');
  if (!block) return meta;
  [...block.children].forEach((rowEl) => {
    const cells = rowEl.children;
    if (cells.length >= 2) {
      const key = normalizeText(cells[0].textContent).toLowerCase();
      if (key) meta[key] = normalizeText(cells[1].textContent);
    }
  });
  return meta;
}

export default function diffMetadata(previewRoot, liveRoot) {
  const pv = parseMetadata(previewRoot);
  const lv = parseMetadata(liveRoot);
  const added = [];
  const modified = [];
  const removed = [];
  new Set([...Object.keys(pv), ...Object.keys(lv)]).forEach((key) => {
    const p = pv[key];
    const l = lv[key];
    if (p !== undefined && l === undefined) added.push({ key, previewValue: p });
    else if (p === undefined && l !== undefined) removed.push({ key, liveValue: l });
    else if (p !== l) modified.push({ key, previewValue: p, liveValue: l });
  });
  return { added, modified, removed };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx wtr test/blocks/preflight/checks/diff/diffMetadata.test.js --node-resolve`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/preflight/checks/diff/diffMetadata.js test/blocks/preflight/checks/diff/diffMetadata.test.js
git commit -m "MWPW-199318: add metadata diff engine"
```

---

### Task 4: Version acquisition (`fetchVersions`)

**Files:**
- Create: `libs/blocks/preflight/checks/diff/adminStatus.js` (extracted, reusable admin-status helper)
- Create: `libs/blocks/preflight/checks/diff/fetchVersions.js`
- Modify: `libs/blocks/preflight/panels/general.js` — import `getAdminUrl` from the new `adminStatus.js` instead of its private copy (DRY; behavior unchanged).
- Test: `test/blocks/preflight/checks/diff/fetchVersions.test.js`

**Interfaces:**
- Produces (`adminStatus.js`): `getAdminUrl(url: URL, type: string) → string|false` (copied verbatim from `general.js:78-90`); `getPageStatus(url: URL) → { lastModified, lastModifiedBy } for preview & live` as `{ preview, live } | null`.
- Produces (`fetchVersions.js`): `deriveLiveUrl(url: URL) → URL`; default `fetchVersions(previewUrl: URL) → { preview: {html}|null, live: {html}|null, status: {preview,live}|null, skipped: boolean }`. `skipped:true` when live is not older than preview (nothing unpublished).

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import fetchVersions, { deriveLiveUrl } from '../../../../../libs/blocks/preflight/checks/diff/fetchVersions.js';

describe('preflight fetchVersions', () => {
  afterEach(() => sinon.restore());

  it('deriveLiveUrl swaps aem.page for aem.live', () => {
    const live = deriveLiveUrl(new URL('https://main--milo--adobecom.aem.page/a/b'));
    expect(live.hostname).to.equal('main--milo--adobecom.aem.live');
    expect(live.pathname).to.equal('/a/b');
  });

  it('returns skipped=true when preview is not newer than live', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      if (String(u).includes('admin.hlx.page')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({
          preview: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' },
        }) });
      }
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main></main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.skipped).to.equal(true);
  });

  it('fetches both .plain.html when preview is newer', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      const s = String(u);
      if (s.includes('admin.hlx.page')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT', lastModifiedBy: 'alice' },
          live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT', lastModifiedBy: 'bob' },
        }) });
      }
      if (s.includes('aem.live')) return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>live</main>') });
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>preview</main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.skipped).to.equal(false);
    expect(res.preview.html).to.contain('preview');
    expect(res.live.html).to.contain('live');
    expect(res.status.preview.lastModifiedBy).to.equal('alice');
  });

  it('returns live=null when live 404s', async () => {
    sinon.stub(window, 'fetch').callsFake((u) => {
      const s = String(u);
      if (s.includes('admin.hlx.page')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({
          preview: { lastModified: 'Thu, 02 Jan 2026 00:00:00 GMT' },
          live: { lastModified: null },
        }) });
      }
      if (s.includes('aem.live')) return Promise.resolve({ ok: false, status: 404 });
      return Promise.resolve({ ok: true, text: () => Promise.resolve('<main>preview</main>') });
    });
    const res = await fetchVersions(new URL('https://main--milo--adobecom.aem.page/p'));
    expect(res.live).to.equal(null);
    expect(res.preview.html).to.contain('preview');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/checks/diff/fetchVersions.test.js --node-resolve`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
// libs/blocks/preflight/checks/diff/adminStatus.js
const CROSS_REPO_PREFIXES = [
  { prefix: '/federal/', owner: 'adobecom', repo: 'federal', branch: 'main' },
];

export function getAdminUrl(url, type) {
  const crossRepo = CROSS_REPO_PREFIXES.find(({ prefix }) => url.pathname.startsWith(prefix));
  let owner; let repo; let branch;
  if (crossRepo) {
    ({ owner, repo, branch } = crossRepo);
  } else {
    if (!(/adobecom\.(hlx|aem)./.test(url.hostname))) return false;
    const project = url.hostname === 'localhost' ? 'main--milo--adobecom' : url.hostname.split('.')[0];
    [branch, repo, owner] = project.split('--');
  }
  const base = `https://admin.hlx.page/${type}/${owner}/${repo}/${branch}${url.pathname}`;
  return type === 'status' ? `${base}?editUrl=auto` : base;
}

export async function getPageStatus(url) {
  const adminUrl = getAdminUrl(url, 'status');
  if (!adminUrl) return null;
  const resp = await fetch(adminUrl);
  if (!resp.ok) return null;
  const json = await resp.json();
  const pick = (o) => ({ lastModified: o?.lastModified || null, lastModifiedBy: o?.lastModifiedBy || null });
  return { preview: pick(json.preview), live: pick(json.live) };
}
```

```js
// libs/blocks/preflight/checks/diff/fetchVersions.js
import { getPageStatus } from './adminStatus.js';

export function deriveLiveUrl(url) {
  const live = new URL(url.href);
  live.hostname = live.hostname.replace('hlx.page', 'hlx.live').replace('aem.page', 'aem.live');
  return live;
}

async function fetchPlain(url) {
  const plain = new URL(url.href);
  plain.pathname = `${plain.pathname.replace(/\/$/, '')}.plain.html`;
  try {
    const resp = await fetch(plain.href);
    if (!resp.ok) return null;
    return { html: await resp.text() };
  } catch {
    return null;
  }
}

export default async function fetchVersions(previewUrl) {
  const liveUrl = deriveLiveUrl(previewUrl);
  const status = await getPageStatus(previewUrl).catch(() => null);

  const pMod = status?.preview?.lastModified ? Date.parse(status.preview.lastModified) : NaN;
  const lMod = status?.live?.lastModified ? Date.parse(status.live.lastModified) : NaN;
  if (!Number.isNaN(pMod) && !Number.isNaN(lMod) && pMod <= lMod) {
    return { preview: null, live: null, status, skipped: true };
  }

  const [preview, live] = await Promise.all([fetchPlain(previewUrl), fetchPlain(liveUrl)]);
  return { preview, live, status, skipped: false };
}
```

Then edit `libs/blocks/preflight/panels/general.js`: remove its private `getAdminUrl` (lines 17-19 `CROSS_REPO_PREFIXES` and 78-90) and add at the top `import { getAdminUrl } from '../checks/diff/adminStatus.js';`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx wtr test/blocks/preflight/checks/diff/fetchVersions.test.js --node-resolve`
Expected: PASS (4 tests).
Run: `npx wtr test/blocks/preflight/panels/*.test.js --node-resolve` — confirm general panel tests still pass after the import refactor.

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/preflight/checks/diff/adminStatus.js libs/blocks/preflight/checks/diff/fetchVersions.js libs/blocks/preflight/panels/general.js test/blocks/preflight/checks/diff/fetchVersions.test.js
git commit -m "MWPW-199318: add version acquisition + share admin-status helper"
```

---

### Task 5: Preflight check wrapper + registration

**Files:**
- Create: `libs/blocks/preflight/checks/diff.js`
- Modify: `libs/blocks/preflight/checks/preflightApi.js` — register the `diff` category (default export `:36-68`; `runChecks` `:105-121`; result spread/return `:150-163`).
- Test: `test/blocks/preflight/checks/diff/diff.test.js`

**Interfaces:**
- Consumes: `fetchVersions` (Task 4), `diffContent` (Task 2), `diffMetadata` (Task 3), `checkUnpublishedFragments` from `checks/merch.js` (existing), `SEVERITY`/`STATUS` from `checks/constants.js`.
- Produces: `runChecks({ area, url }) → [Promise<Result>]` where `Result = { name:'Content Diff', status, severity, details:{ content, metadata, unpublishedFragments, status, skipped } }`. `status` = `pass` when zero changes, `fail` when any changes, `limbo` when versions couldn't be fetched.

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import * as fetchVersionsMod from '../../../../../libs/blocks/preflight/checks/diff/fetchVersions.js';
import { runChecks } from '../../../../../libs/blocks/preflight/checks/diff.js';
import { SEVERITY } from '../../../../../libs/blocks/preflight/checks/constants.js';

const PREVIEW = '<main><div><p>hello</p><p>new line</p></div></main>';
const LIVE = '<main><div><p>hello</p></div></main>';

describe('preflight diff check', () => {
  afterEach(() => sinon.restore());

  it('reports fail + WARNING with the added change when preview differs', async () => {
    sinon.stub(fetchVersionsMod, 'default').resolves({
      preview: { html: PREVIEW }, live: { html: LIVE }, status: null, skipped: false,
    });
    const [promise] = runChecks({ area: document, url: new URL('https://main--milo--adobecom.aem.page/p') });
    const res = await promise;
    expect(res.name).to.equal('Content Diff');
    expect(res.status).to.equal('fail');
    expect(res.severity).to.equal(SEVERITY.WARNING);
    expect(res.details.content.added).to.have.length(1);
  });

  it('reports pass when there are no changes (skipped)', async () => {
    sinon.stub(fetchVersionsMod, 'default').resolves({
      preview: null, live: null, status: null, skipped: true,
    });
    const [promise] = runChecks({ area: document, url: new URL('https://main--milo--adobecom.aem.page/p') });
    const res = await promise;
    expect(res.status).to.equal('pass');
  });

  it('reports limbo when fetch fails', async () => {
    sinon.stub(fetchVersionsMod, 'default').rejects(new Error('network'));
    const [promise] = runChecks({ area: document, url: new URL('https://main--milo--adobecom.aem.page/p') });
    const res = await promise;
    expect(res.status).to.equal('limbo');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/checks/diff/diff.test.js --node-resolve`
Expected: FAIL — `checks/diff.js` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
// libs/blocks/preflight/checks/diff.js
import { SEVERITY, STATUS } from './constants.js';
import fetchVersions from './diff/fetchVersions.js';
import diffContent from './diff/diffContent.js';
import diffMetadata from './diff/diffMetadata.js';
import { checkUnpublishedFragments } from './merch.js';

function parseMain(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.querySelector('main') || doc.body;
}

function countChanges(content, metadata, unpublished) {
  return content.added.length + content.modified.length + content.removed.length
    + metadata.added.length + metadata.modified.length + metadata.removed.length
    + unpublished.length;
}

export function runChecks({ area = document, url = new URL(window.location.href) } = {}) {
  return [(async () => {
    try {
      const versions = await fetchVersions(url instanceof URL ? url : new URL(url));
      if (versions.skipped || !versions.preview) {
        return {
          name: 'Content Diff', status: STATUS.PASS, severity: SEVERITY.WARNING, details: { skipped: true },
        };
      }
      const previewRoot = parseMain(versions.preview.html);
      const liveRoot = versions.live ? parseMain(versions.live.html) : document.createElement('main');
      const content = diffContent(previewRoot, liveRoot);
      const metadata = diffMetadata(previewRoot, liveRoot);
      const { unpublished } = await checkUnpublishedFragments({ area }).catch(() => ({ unpublished: [] }));
      const total = countChanges(content, metadata, unpublished);
      return {
        name: 'Content Diff',
        status: total > 0 ? STATUS.FAIL : STATUS.PASS,
        severity: SEVERITY.WARNING,
        details: {
          content, metadata, unpublishedFragments: unpublished, status: versions.status, skipped: false,
        },
      };
    } catch (e) {
      window.lana?.log?.(`[preflight][diff] ${e.message}`, { tags: 'preflight', errorType: 'i' });
      return {
        name: 'Content Diff', status: STATUS.LIMBO, severity: SEVERITY.WARNING, details: { error: e.message },
      };
    }
  })()];
}
```

Then in `libs/blocks/preflight/checks/preflightApi.js`:
- Add import: `import { runChecks as runChecksDiff } from './diff.js';`
- Add to the default export object: `diff: { runChecks: runChecksDiff },`
- In the internal `runChecks` (`:105`), add: `const diff = await Promise.all(runChecksDiff({ area, url }));`
- Add `diff` to the returned object and to the `allResults` spread in `getPreflightResults`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx wtr test/blocks/preflight/checks/diff/diff.test.js --node-resolve`
Expected: PASS (3 tests).
Run: `npx wtr test/blocks/preflight/preflight.test.js --node-resolve` — confirm nothing regressed.

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/preflight/checks/diff.js libs/blocks/preflight/checks/preflightApi.js test/blocks/preflight/checks/diff/diff.test.js
git commit -m "MWPW-199318: add content-diff check and register in preflight"
```

---

### Task 6: Telemetry columns

**Files:**
- Modify: `libs/blocks/preflight/checks/captureMetrics.js` — add diff counts to the payload.
- Test: `test/blocks/preflight/checks/captureMetrics.test.js` (create if absent; else extend).

**Interfaces:**
- Consumes: the `diff` category result from Task 5 (`results.diff`).
- Produces: `contextData` gains `diff_content_added_count`, `diff_content_modified_count`, `diff_content_removed_count`, `diff_metadata_changed_count`.

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import { buildDiffCounts } from '../../../../libs/blocks/preflight/checks/captureMetrics.js';

describe('captureMetrics diff counts', () => {
  it('sums content and metadata change counts from the diff result', () => {
    const diffResult = [{
      details: {
        content: { added: [1, 2], modified: [1], removed: [] },
        metadata: { added: [1], modified: [], removed: [1] },
      },
    }];
    expect(buildDiffCounts(diffResult)).to.deep.equal({
      diff_content_added_count: 2,
      diff_content_modified_count: 1,
      diff_content_removed_count: 0,
      diff_metadata_changed_count: 2,
    });
  });

  it('returns zeros when there is no diff detail', () => {
    expect(buildDiffCounts([{ details: { skipped: true } }])).to.deep.equal({
      diff_content_added_count: 0,
      diff_content_modified_count: 0,
      diff_content_removed_count: 0,
      diff_metadata_changed_count: 0,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/checks/captureMetrics.test.js --node-resolve`
Expected: FAIL — `buildDiffCounts` is not exported.

- [ ] **Step 3: Write minimal implementation**

Add to `libs/blocks/preflight/checks/captureMetrics.js`:

```js
export function buildDiffCounts(diffResults) {
  const d = diffResults?.[0]?.details || {};
  const c = d.content || { added: [], modified: [], removed: [] };
  const m = d.metadata || { added: [], modified: [], removed: [] };
  return {
    diff_content_added_count: c.added.length,
    diff_content_modified_count: c.modified.length,
    diff_content_removed_count: c.removed.length,
    diff_metadata_changed_count: m.added.length + m.modified.length + m.removed.length,
  };
}
```

Then, in the existing `capture(results)`, resolve `results.diff` alongside the others and merge `buildDiffCounts(resolvedDiff)` into `contextData`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx wtr test/blocks/preflight/checks/captureMetrics.test.js --node-resolve`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add libs/blocks/preflight/checks/captureMetrics.js test/blocks/preflight/checks/captureMetrics.test.js
git commit -m "MWPW-199318: log content-diff counts to milo-logs"
```

---

### Task 7: Nudge on preview

**Files:**
- Modify: `libs/utils/preflight-notification.js` — extend the `previewed` path to compute diff counts and, on `*.aem.page`, show a "N changes vs live" nudge.
- Test: `test/blocks/preflight/preflight-notification.test.js` (create if absent; test the pure count/message helper).

**Interfaces:**
- Consumes: the `diff` result via `getPreflightResults` (already wired in Task 5).
- Produces: `getDiffChangeCount(results) → number`; `diffNudgeMessage(count) → string`.

- [ ] **Step 1: Write the failing test**

```js
import { expect } from '@esm-bundle/chai';
import { getDiffChangeCount, diffNudgeMessage } from '../../../libs/utils/preflight-notification.js';

describe('preflight diff nudge', () => {
  it('counts all content + metadata changes from results', () => {
    const results = { runChecks: { diff: [{ details: {
      content: { added: [1], modified: [1, 2], removed: [] },
      metadata: { added: [], modified: [1], removed: [] },
    } }] } };
    expect(getDiffChangeCount(results)).to.equal(4);
  });

  it('formats the nudge message with pluralization', () => {
    expect(diffNudgeMessage(1)).to.equal('1 change vs live — compare before publishing.');
    expect(diffNudgeMessage(3)).to.equal('3 changes vs live — compare before publishing.');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx wtr test/blocks/preflight/preflight-notification.test.js --node-resolve`
Expected: FAIL — helpers not exported.

- [ ] **Step 3: Write minimal implementation**

Add to `libs/utils/preflight-notification.js`:

```js
export function getDiffChangeCount(results) {
  const d = results?.runChecks?.diff?.[0]?.details || {};
  const c = d.content || { added: [], modified: [], removed: [] };
  const m = d.metadata || { added: [], modified: [], removed: [] };
  return c.added.length + c.modified.length + c.removed.length
    + m.added.length + m.modified.length + m.removed.length;
}

export function diffNudgeMessage(count) {
  return `${count} change${count === 1 ? '' : 's'} vs live — compare before publishing.`;
}
```

Then, in the `previewed` listener, after metrics capture, if `window.location.hostname.endsWith('.aem.page')` and `getDiffChangeCount(results) > 0`, render the nudge (reuse `createPreflightNotification`, passing the diff message).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx wtr test/blocks/preflight/preflight-notification.test.js --node-resolve`
Expected: PASS (2 tests).

- [ ] **Step 5: Full suite + lint, then commit**

```bash
npm run test -- --group preflight   # or: npx wtr "test/blocks/preflight/**/*.test.js" --node-resolve
git add libs/utils/preflight-notification.js test/blocks/preflight/preflight-notification.test.js
git commit -m "MWPW-199318: nudge author when preview differs from live"
```

---

## Increment 1 done — definition of done

- `diffContent`, `diffMetadata`, `fetchVersions` are pure and unit-tested.
- The `diff` check is registered and runs inside `getPreflightResults` (so it runs on the `previewed` event).
- Diff counts flow to milo-logs; a nudge appears on `aem.page` when there are changes.
- No compare UI yet — this is the console/nudge-demoable milestone and a clean demo point.

## Follow-up (separate plan)

**Increment 2 — the compare panel** (`panels/diff.js` + the 4 `preflight.js` touch points): starts with the **live-pane rendering spike** (decorate fetched `.plain.html` via `loadArea` in a scoped container; confirm each change `path` resolves to the right element in each rendered pane; iframe fallback if not). Written as its own plan once the spike resolves the rendering approach.

---

## Self-Review

- **Spec coverage:** fetch both versions (T4), node-level content diff (T2), metadata diff (T3), unpublished-fragment fold-in (T5), auto-run on preview + nudge (T7), telemetry (T6), env gate to `aem.page` (T7). Compare panel / last-modified header / highlights are explicitly deferred to Increment 2. ✅
- **Placeholder scan:** all code steps contain real code; no TBD/TODO. ✅
- **Type consistency:** `Change`/`Kv` shapes, `runChecks` return `[Promise<Result>]`, and `details.{content,metadata}` used consistently across T2/T3/T5/T6/T7. ✅
