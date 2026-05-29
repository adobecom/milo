# Milo World Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `milo-dashboard` Milo block that visualizes preview/publish activity and preflight health across Milo projects — org-wide overview with trend deltas, drill-in per project — runnable locally, standalone, and as a DA custom app, backed by new time-series routes in `milo-logs-deploy`.

**Architecture:** New read-only trend/overview routes in `milo-logs-deploy` (Postgres `date_trunc` aggregations over `eds_admin_log` + `publish_logs`), exposed via REST and MCP. A new Milo block consumes them through a thin data client that auto-resolves environment + auth (local LOCAL-bypass, DA SDK IMS token, or standalone config). echarts (already bundled in Milo) renders the charts. A stubbed traffic adapter leaves room for RUM/Analytics later.

**Tech Stack:** Node 20 / Express / PostgreSQL / Jest (backend); vanilla ESM Milo block / echarts / web-test-runner + chai + sinon (frontend); DA SDK for embedding.

**Two repos** — paths are prefixed `[milo-logs-deploy]` or `[milo]`. Each repo is on branch `milo-world-dashboard`. Commit in the repo the changed files belong to.

**Conventions to honor (do not violate):**
- `[milo-logs-deploy]` ESM, `.js` extensions, `dbRead` for all reads, `logger` not `console`, MCP tools delegate to route functions and return JSON for aggregates. Every new route gets `requireAuth`. Run `/security-review` after adding routes. Tests: `tests/*.test.js`, Jest ESM with `jest.unstable_mockModule`.
- `[milo]` block default-exports `init(block)`, register in `C1_BLOCKS` in `libs/utils/utils.js`, scope all CSS under `.milo-dashboard`, use Milo design tokens, `.js` import extensions (eslint airbnb-base). Tests: `test/blocks/<name>/<name>.test.js`, web-test-runner + `@esm-bundle/chai` + sinon, fixtures in `mocks/`.

---

## PHASE 1 — Backend trend & overview routes (the data spine)

All four route functions live in one new module so they share helpers, mirroring `getEdsLogs.js`.

### Task 1: `parseInterval` helper for date_trunc

**Files:**
- Modify: `[milo-logs-deploy] src/utils/time-window.js`
- Test: `[milo-logs-deploy] tests/time-window.test.js`

**Step 1: Write failing tests** — append to `tests/time-window.test.js`:

```js
import { parseInterval } from '../src/utils/time-window.js';

describe('parseInterval', () => {
  test('maps valid intervals to postgres units', () => {
    expect(parseInterval('day')).toBe('day');
    expect(parseInterval('week')).toBe('week');
    expect(parseInterval('month')).toBe('month');
  });
  test('defaults to day when missing', () => {
    expect(parseInterval()).toBe('day');
  });
  test('throws 400 on invalid interval', () => {
    expect(() => parseInterval('fortnight')).toThrow();
    try { parseInterval('fortnight'); } catch (e) { expect(e.statusCode).toBe(400); }
  });
});
```

**Step 2: Run, expect fail**
Run: `npm test -- time-window` → FAIL (`parseInterval is not a function`).

**Step 3: Implement** — add to `src/utils/time-window.js`:

```js
const VALID_INTERVALS = new Set(['day', 'week', 'month']);

// Validate a bucket interval for date_trunc. Returns the value (safe to interpolate
// into SQL since it's checked against an allowlist). Throws 400 on invalid input.
export function parseInterval(interval) {
  const val = interval ?? 'day';
  if (!VALID_INTERVALS.has(val)) {
    const err = new Error(`Invalid interval: "${val}". Valid values: day, week, month`);
    err.statusCode = 400;
    throw err;
  }
  return val;
}
```

**Step 4: Run, expect pass** — `npm test -- time-window` → PASS.

**Step 5: Commit**
```bash
git add src/utils/time-window.js tests/time-window.test.js
git commit -m "feat: add parseInterval helper for trend bucketing"
```

---

### Task 2: `getEdsTrends` — time-bucketed publish/preview volume

**Files:**
- Create: `[milo-logs-deploy] src/routes/getTrends.js`
- Test: `[milo-logs-deploy] tests/getTrends.test.js`

**Step 1: Write failing test** — `tests/getTrends.test.js`:

```js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/utils/db-manager.js', () => ({
  dbRead: jest.fn(), dbWrite: jest.fn(),
}));

const { dbRead } = await import('../src/utils/db-manager.js');
const { getEdsTrends } = await import('../src/routes/getTrends.js');

beforeEach(() => dbRead.mockReset());

describe('getEdsTrends', () => {
  test('400 on missing since', async () => {
    await expect(getEdsTrends({})).rejects.toMatchObject({ statusCode: 400 });
  });
  test('400 on bad interval', async () => {
    await expect(getEdsTrends({ since: '30d', interval: 'x' })).rejects.toMatchObject({ statusCode: 400 });
  });
  test('buckets by interval and converts ms timestamp to_timestamp', async () => {
    dbRead.mockResolvedValue({ rows: [{ bucket: '2026-05-01T00:00:00.000Z', route: 'live', amount: '10' }] });
    const rows = await getEdsTrends({ since: '30d', interval: 'week' });
    expect(rows).toHaveLength(1);
    const [sql] = dbRead.mock.calls[0];
    expect(sql).toMatch(/date_trunc\('week'/);
    expect(sql).toMatch(/to_timestamp\(timestamp \/ 1000\)/);
    expect(sql).toMatch(/GROUP BY bucket, route/);
  });
  test('applies site filter as parameter', async () => {
    dbRead.mockResolvedValue({ rows: [] });
    await getEdsTrends({ since: '30d', interval: 'day', site: 'da-blog' });
    const [sql, params] = dbRead.mock.calls[0];
    expect(sql).toMatch(/site = \$/);
    expect(params).toContain('da-blog');
  });
});
```

**Step 2: Run, expect fail** — `npm test -- getTrends`.

**Step 3: Implement** — `src/routes/getTrends.js`:

```js
import { dbRead } from '../utils/db-manager.js';
import { parseWindowMs, parseInterval } from '../utils/time-window.js';

// Time-bucketed EDS request volume. eds_admin_log.timestamp is BIGINT ms.
export async function getEdsTrends({ since, interval, route, site } = {}) {
  const trunc = parseInterval(interval);
  const timeSince = Date.now() - parseWindowMs(since);

  const conditions = ['timestamp >= $1'];
  const params = [timeSince];
  if (route) { params.push(route); conditions.push(`route = $${params.length}`); }
  if (site)  { params.push(site);  conditions.push(`site = $${params.length}`); }

  const sql = `
    SELECT date_trunc('${trunc}', to_timestamp(timestamp / 1000)) AS bucket,
           route,
           COUNT(*)::int AS amount
    FROM eds_admin_log
    WHERE ${conditions.join(' AND ')}
    GROUP BY bucket, route
    ORDER BY bucket ASC
  `;
  const result = await dbRead(sql, params);
  return result.rows;
}
```

**Step 4: Run, expect pass.**

**Step 5: Commit**
```bash
git add src/routes/getTrends.js tests/getTrends.test.js
git commit -m "feat: add getEdsTrends time-bucketed volume route fn"
```

---

### Task 3: `getPreflightTrends` — time-bucketed health scores

**Files:** Modify `src/routes/getTrends.js`; Test `tests/getTrends.test.js`.

**Step 1: Add failing tests:**

```js
const { getPreflightTrends } = await import('../src/routes/getTrends.js');

describe('getPreflightTrends', () => {
  test('400 on missing since', async () => {
    await expect(getPreflightTrends({})).rejects.toMatchObject({ statusCode: 400 });
  });
  test('buckets avg scores over publish_logs.created_at', async () => {
    dbRead.mockResolvedValue({ rows: [{ bucket: '2026-05-01T00:00:00.000Z', avg_overall: 82.5, checks: 40 }] });
    const rows = await getPreflightTrends({ since: '30d', interval: 'day' });
    expect(rows[0].avg_overall).toBe(82.5);
    const [sql] = dbRead.mock.calls[0];
    expect(sql).toMatch(/date_trunc\('day', created_at\)/);
    expect(sql).toMatch(/AVG\(performance_score\)/);
    expect(sql).toMatch(/AVG\(seo_category_score\)/);
    expect(sql).toMatch(/COUNT\(\*\)::int AS checks/);
  });
  test('narrows to a project_key', async () => {
    dbRead.mockResolvedValue({ rows: [] });
    await getPreflightTrends({ since: '30d', interval: 'day', project: 'milo' });
    const [sql, params] = dbRead.mock.calls[0];
    expect(sql).toMatch(/project_key = \$/);
    expect(params).toContain('milo');
  });
});
```

**Step 2: Run, expect fail.**

**Step 3: Implement** — append to `src/routes/getTrends.js`:

```js
import { parseWindowSince } from '../utils/time-window.js'; // add to existing import line

export async function getPreflightTrends({ since, interval, project } = {}) {
  const trunc = parseInterval(interval);
  const sinceTs = parseWindowSince(since); // ms; throws 400 if missing

  const conditions = ['created_at >= to_timestamp($1 / 1000)'];
  const params = [sinceTs];
  if (project) { params.push(project); conditions.push(`project_key = $${params.length}`); }

  const sql = `
    SELECT date_trunc('${trunc}', created_at) AS bucket,
           AVG(performance_score)::numeric(5,2)              AS avg_overall,
           AVG(performance_category_score)::numeric(5,2)     AS avg_performance,
           AVG(seo_category_score)::numeric(5,2)             AS avg_seo,
           AVG(accessibility_category_score)::numeric(5,2)   AS avg_accessibility,
           AVG(assets_category_score)::numeric(5,2)          AS avg_assets,
           COUNT(*)::int                                     AS checks,
           COUNT(*) FILTER (WHERE performance_score < 50)::int  AS pages_below_50,
           COUNT(*) FILTER (WHERE performance_score < 70)::int  AS pages_below_70
    FROM publish_logs
    WHERE ${conditions.join(' AND ')}
    GROUP BY bucket
    ORDER BY bucket ASC
  `;
  const result = await dbRead(sql, params);
  return result.rows;
}
```

> Note: `getPreflightStats` (in `getPreflightLogs.js`) already filters by time; confirm the `created_at` column type there and mirror its comparison style if it differs from `to_timestamp`.

**Step 4: Run, expect pass. Step 5: Commit** `feat: add getPreflightTrends health-score trend route fn`.

---

### Task 4: `getOverview` — org-wide KPIs with prior-period deltas

**Files:** Modify `src/routes/getTrends.js`; Test `tests/getTrends.test.js`.

**Step 1: Add failing test:**

```js
const { getOverview } = await import('../src/routes/getTrends.js');

describe('getOverview', () => {
  test('returns current + prior counts and computes deltas', async () => {
    // current window
    dbRead
      .mockResolvedValueOnce({ rows: [{ publishes: 100, previews: 200, active_projects: 5 }] })
      .mockResolvedValueOnce({ rows: [{ avg_health: 80, pages_below_70: 12 }] })
      // prior window
      .mockResolvedValueOnce({ rows: [{ publishes: 80, previews: 150, active_projects: 4 }] })
      .mockResolvedValueOnce({ rows: [{ avg_health: 75, pages_below_70: 20 }] });
    const out = await getOverview({ since: '7d' });
    expect(out.current.publishes).toBe(100);
    expect(out.prior.publishes).toBe(80);
    expect(out.delta.publishes).toBe(20);
    expect(out.delta.avg_health).toBeCloseTo(5);
  });
  test('400 on missing since', async () => {
    await expect(getOverview({})).rejects.toMatchObject({ statusCode: 400 });
  });
});
```

**Step 2: Run, expect fail.**

**Step 3: Implement** — append to `src/routes/getTrends.js`. Run two EDS queries (current/prior windows over `eds_admin_log`) and two preflight queries, then compute deltas:

```js
async function edsWindow(from, to) {
  const sql = `
    SELECT COUNT(*) FILTER (WHERE route = 'live'  AND method != 'DELETE')::int AS publishes,
           COUNT(*) FILTER (WHERE route = 'preview')::int                       AS previews,
           COUNT(DISTINCT site)::int                                            AS active_projects
    FROM eds_admin_log
    WHERE timestamp >= $1 AND timestamp < $2`;
  return (await dbRead(sql, [from, to])).rows[0];
}

async function preflightWindow(from, to) {
  const sql = `
    SELECT AVG(performance_score)::numeric(5,2)               AS avg_health,
           COUNT(*) FILTER (WHERE performance_score < 70)::int AS pages_below_70
    FROM publish_logs
    WHERE created_at >= to_timestamp($1 / 1000) AND created_at < to_timestamp($2 / 1000)`;
  return (await dbRead(sql, [from, to])).rows[0];
}

export async function getOverview({ since } = {}) {
  const win = parseWindowMs(since);          // throws 400 if missing
  const now = Date.now();
  const curFrom = now - win, priorFrom = now - 2 * win;

  const [curEds, curPf, priEds, priPf] = await Promise.all([
    edsWindow(curFrom, now), preflightWindow(curFrom, now),
    edsWindow(priorFrom, curFrom), preflightWindow(priorFrom, curFrom),
  ]);
  const current = { ...curEds, ...curPf };
  const prior   = { ...priEds, ...priPf };
  const delta = {};
  for (const k of Object.keys(current)) delta[k] = Number(current[k] ?? 0) - Number(prior[k] ?? 0);
  return { since, current, prior, delta };
}
```

> The test mocks 4 sequential `dbRead` calls; `Promise.all` preserves call order so `mockResolvedValueOnce` ordering above matches (curEds, curPf, priEds, priPf). Keep that order in the test.

**Step 4: Run, expect pass. Step 5: Commit** `feat: add getOverview org KPIs with prior-period deltas`.

---

### Task 5: `getProjects` — per-project snapshot for the drill-down table

**Files:** Modify `src/routes/getTrends.js`; Test `tests/getTrends.test.js`.

**Step 1: Add failing test:**

```js
const { getProjects } = await import('../src/routes/getTrends.js');

describe('getProjects', () => {
  test('returns per-site publish/preview + per-project avg health', async () => {
    dbRead
      .mockResolvedValueOnce({ rows: [{ site: 'milo', publishes: 50, previews: 90 }] })
      .mockResolvedValueOnce({ rows: [{ project_key: 'milo', avg_health: 78, checks: 30 }] });
    const rows = await getProjects({ since: '30d' });
    expect(rows[0].site).toBe('milo');
    expect(rows[0].avg_health).toBe(78);
  });
});
```

**Step 2: Run, expect fail.**

**Step 3: Implement** — append to `getTrends.js`. Query EDS grouped by `site` and preflight grouped by `project_key`, then merge on name (site ≈ project_key; left-join in JS, tolerate mismatches):

```js
export async function getProjects({ since } = {}) {
  const from = Date.now() - parseWindowMs(since);
  const eds = (await dbRead(`
    SELECT site,
           COUNT(*) FILTER (WHERE route='live' AND method!='DELETE')::int AS publishes,
           COUNT(*) FILTER (WHERE route='preview')::int                   AS previews
    FROM eds_admin_log WHERE timestamp >= $1 AND site IS NOT NULL
    GROUP BY site ORDER BY publishes DESC`, [from])).rows;
  const pf = (await dbRead(`
    SELECT project_key,
           AVG(performance_score)::numeric(5,2) AS avg_health,
           COUNT(*)::int AS checks
    FROM publish_logs WHERE created_at >= to_timestamp($1 / 1000)
    GROUP BY project_key`, [from])).rows;
  const pfByKey = Object.fromEntries(pf.map((r) => [r.project_key, r]));
  return eds.map((e) => ({ ...e, ...(pfByKey[e.site] || { avg_health: null, checks: 0 }) }));
}
```

**Step 4: Run, expect pass. Step 5: Commit** `feat: add getProjects per-project snapshot route fn`.

---

### Task 6: Register REST routes

**Files:** Modify `[milo-logs-deploy] src/routes/index.js`; Test `tests/getTrends.test.js` (or a small supertest in `tests/routes.trends.test.js`).

**Step 1:** Add imports + routes in `index.js`:

```js
import { getEdsTrends, getPreflightTrends, getOverview, getProjects } from './getTrends.js';
// ...after the /eds-logs routes:
router.get('/trends/eds',       requireAuth, handle(async (req, res) => res.json(await getEdsTrends(req.query))));
router.get('/trends/preflight', requireAuth, handle(async (req, res) => res.json(await getPreflightTrends(req.query))));
router.get('/overview',         requireAuth, handle(async (req, res) => res.json(await getOverview(req.query))));
router.get('/projects',         requireAuth, handle(async (req, res) => res.json(await getProjects(req.query))));
```

**Step 2: Test** with supertest + `LOCAL=true` (mock the route module) — assert each path returns 200 JSON and 400 propagates. Pattern: see `tests/oauth-router.test.js` for supertest+app wiring.

**Step 3: Run** `npm test`. **Step 4: Commit** `feat: register trends/overview/projects REST routes`.

---

### Task 7: MCP parity tools

**Files:** Modify `[milo-logs-deploy] src/mcp/server.js`; Test `tests/getTrends.test.js` (handlers are covered; just verify wiring).

**Step 1:** Import the new fns and add to the `TOOLS` array (JSON handlers — these are aggregates):

```js
import { getEdsTrends, getPreflightTrends, getOverview, getProjects } from '../routes/getTrends.js';

const INTERVAL = z.enum(['day', 'week', 'month']).optional().default('day').describe('Bucket size for the trend series');

// add to TOOLS:
{ name: 'get_eds_trends',
  schema: { since: SINCE, interval: INTERVAL, route: z.string().optional(), site: SITE },
  handler: json(getEdsTrends) },
{ name: 'get_preflight_trends',
  schema: { since: SINCE, interval: INTERVAL, project: z.string().optional().describe('project_key') },
  handler: json(getPreflightTrends) },
{ name: 'get_milo_overview',
  schema: { since: SINCE },
  handler: json(getOverview) },
{ name: 'get_milo_projects',
  schema: { since: SINCE },
  handler: json(getProjects) },
```

**Step 2: Run** `npm test`. **Step 3: Commit** `feat: expose trend/overview MCP tools`.

**Step 4: Security review** — Run `/security-review`. New routes use `requireAuth`; confirm no SQL injection (interval is allowlisted, all user values parameterized).

**Manual verification (Phase 1 done):** Start with `LOCAL=true npm run start:dev`, then:
```bash
curl 'http://localhost:8080/overview?since=7d'
curl 'http://localhost:8080/trends/eds?since=30d&interval=week'
curl 'http://localhost:8080/trends/preflight?since=30d&interval=day'
curl 'http://localhost:8080/projects?since=30d'
```
Expect JSON. (Empty arrays/zeros are acceptable on a fresh local DB — proves wiring.)

---

## PHASE 2 — Block scaffold, data client, env/auth detection

### Task 8: Register the block + empty scaffold

**Files:**
- Create: `[milo] libs/blocks/milo-dashboard/milo-dashboard.js`, `.css`
- Modify: `[milo] libs/utils/utils.js` (add `'milo-dashboard'` to `C1_BLOCKS`, alphabetical)
- Test: `[milo] test/blocks/milo-dashboard/milo-dashboard.test.js`, `mocks/body.html`

**Step 1: Failing test** — `test/blocks/milo-dashboard/mocks/body.html`:
```html
<div class="milo-dashboard"><div><div>api</div><div>http://localhost:8080</div></div></div>
```
`milo-dashboard.test.js`:
```js
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/milo-dashboard/milo-dashboard.js');

describe('milo-dashboard', () => {
  beforeEach(async () => { document.body.innerHTML = await readFile({ path: './mocks/body.html' }); });
  it('renders a dashboard shell with header and panel grid', async () => {
    const block = document.querySelector('.milo-dashboard');
    await init(block);
    expect(block.querySelector('.dashboard-header')).to.exist;
    expect(block.querySelector('.dashboard-grid')).to.exist;
  });
});
```

**Step 2: Run** `npm run test:file -- test/blocks/milo-dashboard/milo-dashboard.test.js` → FAIL.

**Step 3: Implement** minimal `milo-dashboard.js`:
```js
import { createTag, loadStyle } from '../../utils/utils.js';

export default async function init(block) {
  loadStyle(`${import.meta.url.split('/milo-dashboard.js')[0]}/milo-dashboard.css`);
  block.innerHTML = '';
  block.append(
    createTag('div', { class: 'dashboard-header' }),
    createTag('div', { class: 'dashboard-grid' }),
  );
}
```
Minimal `.css`: `.milo-dashboard { display: block; } .milo-dashboard .dashboard-grid { display: grid; gap: var(--spacing-m); }`

**Step 4: Run, expect pass. Step 5: Commit** (`[milo]`) `feat: scaffold milo-dashboard block`.

---

### Task 9: Config + environment/auth resolution (`api.js`)

**Files:** Create `[milo] libs/blocks/milo-dashboard/api.js`; Test `.../milo-dashboard.test.js`.

**Behavior:** `resolveContext(block)` reads config rows (`api` → base URL) and detects mode:
- If running in an iframe and `DA_SDK` resolves within ~1.5s → `{ mode: 'da', base, token, daContext }`.
- Else → `{ mode: 'standalone'|'local', base, token: undefined }`.
`createClient(ctx)` returns `{ get(path, params) }` that builds the URL, adds `Authorization: Bearer` + `clientId` when a token exists, and `fetch`es JSON.

**Step 1: Failing tests** (mock `window.fetch` with sinon; for DA, stub a fake `DA_SDK` module via an injected resolver — keep `DA_SDK` import behind a function param so tests can pass a fake). Assert: base URL read from config row; `get()` appends query params; bearer header present only when token set.

**Step 2: Run, expect fail.**

**Step 3: Implement** `api.js`:
```js
export function readConfig(block) {
  const cfg = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const [k, v] = [...row.children].map((c) => c.textContent.trim());
    if (k) cfg[k.toLowerCase()] = v;
  });
  return cfg;
}

const DEFAULT_LOCAL = 'http://localhost:8080';

export async function resolveContext(block, { loadDaSdk } = {}) {
  const cfg = readConfig(block);
  const inIframe = window.self !== window.top;
  if (inIframe && loadDaSdk) {
    try {
      const sdk = await Promise.race([
        loadDaSdk(),
        new Promise((_, r) => setTimeout(() => r(new Error('da-timeout')), 1500)),
      ]);
      return { mode: 'da', base: cfg.api || DEFAULT_LOCAL, token: sdk.token, daContext: sdk.context };
    } catch { /* fall through */ }
  }
  return { mode: cfg.api ? 'standalone' : 'local', base: cfg.api || DEFAULT_LOCAL, token: cfg.token };
}

export function createClient({ base, token }) {
  return {
    async get(path, params = {}) {
      const url = new URL(`${base}${path}`);
      Object.entries(params).forEach(([k, v]) => v != null && v !== '' && url.searchParams.set(k, v));
      const headers = {};
      if (token) { headers.Authorization = `Bearer ${token}`; url.searchParams.set('clientId', 'milo-dashboard'); }
      const res = await fetch(url, { headers });
      if (!res.ok) { const e = new Error(`api ${res.status}`); e.status = res.status; throw e; }
      return res.json();
    },
  };
}

export const loadDaSdk = () => import('https://da.live/nx/utils/sdk.js').then((m) => m.default);
```

**Step 4: Run, expect pass. Step 5: Commit** `feat: add milo-dashboard data client + env/auth resolution`.

---

### Task 10: echarts loader wrapper (`charts.js`)

**Files:** Create `[milo] libs/blocks/milo-dashboard/charts.js`; Test `.../milo-dashboard.test.js`.

**Step 1: Failing test** — stub `loadScript` (sinon) to set `window.echarts = { init: () => ({ setOption: sinon.spy(), resize: sinon.spy() }) }`; assert `loadCharts()` resolves echarts and `lineChart(el, opts)` calls `setOption`.

**Step 3: Implement:**
```js
import { loadScript, getConfig } from '../../utils/utils.js';

let loading;
export function loadCharts() {
  if (window.echarts) return Promise.resolve(window.echarts);
  if (!loading) {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    loading = loadScript(`${base}/deps/echarts.common.min.js`).then(() => window.echarts);
  }
  return loading;
}

export function makeChart(el, option) {
  const chart = window.echarts.init(el, null, { renderer: 'svg' });
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
  return chart;
}
```
(Theme/option builders for line/area/gauge added in Phase 3 panels.)

**Step 4: Run, expect pass. Step 5: Commit** `feat: add echarts loader wrapper for milo-dashboard`.

---

## PHASE 3 — Overview panels

### Task 11: KPI stat cards with deltas

**Files:** Create `[milo] libs/blocks/milo-dashboard/panels/kpi-cards.js`; Test `.../milo-dashboard.test.js`.

**Step 1: Failing test** — `renderKpiCards(container, overview)` with a fixture `{ current: { publishes: 100, previews: 200, avg_health: 80, active_projects: 5, pages_below_70: 12 }, delta: { publishes: 20, avg_health: -3, ... } }` renders 5 `.kpi-card`s, shows formatted values, and adds `.up`/`.down` class on the delta based on sign. (For `pages_below_70`, *down* is good — invert the semantic class; assert that.)

**Step 3: Implement** card builder with `createTag`, delta arrow + percentage, semantic up/down classes (configurable `higherIsBetter` per metric). **Step 4/5:** pass + commit `feat: add KPI stat cards panel`.

---

### Task 12: Overall health gauge + category breakdown

**Files:** Create `panels/health-gauge.js`; Test.

**Step 1: Failing test** — `renderHealthGauge(el, { avg_overall, avg_performance, avg_seo, avg_accessibility, avg_assets }, charts)` calls `charts.makeChart` once for the gauge and renders 4 category bars with width proportional to score. Stub `makeChart`.

**Step 3: Implement** echarts gauge option (0–100, color bands red/amber/green) + category bars (CSS widths). **Commit** `feat: add health gauge + category breakdown panel`.

---

### Task 13: Volume trend chart (publish vs preview)

**Files:** Create `panels/volume-trend.js`; Test.

**Step 1: Failing test** — `renderVolumeTrend(el, edsTrendRows, charts)` pivots `[{bucket,route,amount}]` into two series (live, preview) keyed by bucket and calls `makeChart` with an option containing both series names. Stub `makeChart`, assert series.

**Step 3: Implement** pivot + echarts stacked/area line option. **Commit** `feat: add publish/preview volume trend panel`.

---

### Task 14: Health trend chart (overall + per-category)

**Files:** Create `panels/health-trend.js`; Test.

**Step 1: Failing test** — `renderHealthTrend(el, preflightTrendRows, charts)` builds an overall line by default and exposes a category toggle that re-renders with the selected category series. Assert series name switches on toggle.

**Step 3: Implement** line option + toggle control. **Commit** `feat: add preflight health trend panel`.

---

### Task 15: Wire panels into `init` + header controls

**Files:** Modify `milo-dashboard.js`; Test `.../milo-dashboard.test.js`.

**Step 1: Failing test** — with `window.fetch` stubbed to return canned `/overview`, `/trends/eds`, `/trends/preflight` payloads and echarts stubbed, `init(block)` renders KPI cards + gauge + both trend charts; the Day/Week/Month toggle re-fetches `/trends/*` with the new `interval` (assert fetch called with `interval=week` after click).

**Step 3: Implement** — orchestrate: resolve context → client → `Promise.all` the three fetches → render panels into the grid; build header (title, Day/Week/Month segmented control, date-range/since selector) that re-fetches trends on change. Per-panel try/catch so one failure shows an inline error, not a blank board.

**Step 4: Run** full block test file. **Step 5: Commit** `feat: assemble milo-dashboard overview + time-window controls`.

**Manual verification (Phase 3):** `npm run libs` in milo + `LOCAL=true npm run start:dev` in milo-logs-deploy. Author a test page (or use a local fixture) with the `milo-dashboard` block + `api` row pointing at `http://localhost:8080`. Confirm cards, gauge, and charts render and the Day/Week/Month toggle updates the charts.

---

## PHASE 4 — Project table & drill-in

### Task 16: Sortable project table

**Files:** Create `panels/project-table.js`; Test.

**Step 1: Failing test** — `renderProjectTable(el, projectsRows, onSelect)` renders a row per project with publishes/previews/avg_health/checks; clicking a header sorts (assert order flips); clicking a row calls `onSelect(site)`.

**Step 3: Implement** table + client-side sort + row click. **Commit** `feat: add sortable project table panel`.

---

### Task 17: Project drill-in view

**Files:** Create `panels/project-drilldown.js`; Modify `milo-dashboard.js` (wire `onSelect`); add API calls for `get_preflight_bad_pages` equivalent REST (`/preflight-logs?projectKey=&maxScore=&sortBy=perf_score`) + latest pages.

**Step 1: Failing test** — selecting a project fetches project-scoped `/trends/preflight?project=X`, `/preflight-logs?projectKey=X&maxScore=70` (worst pages), renders scoped health trend + a worst-pages table whose rows link to the page URL (and a DA-edit link when `daContext`/host known). A "back" control returns to the overview.

**Step 3: Implement** drill-in panel (scoped KPIs reuse panels from Phase 3; worst-pages table with fix-in-DA links; latest pages via `/eds-logs?raw=true&route=live&repo=X`; block usage via `/block-usage` CSV parse). **Commit** `feat: add project drill-in view`.

**Manual verification (Phase 4):** Click a project row → drill-in loads scoped charts + worst pages; back returns to overview.

---

## PHASE 5 — DA custom-app packaging + docs

### Task 18: Verify DA app embedding contract

**Files:** Research only (da-live). Confirm: how a custom app is registered (DA config sheet / `library` entry of type app), the iframe URL pattern (the block hosted on an EDS preview/live page, e.g. `https://<branch>--milo--adobecom.aem.page/tools/milo-dashboard`), and that `DA_SDK` token has the scopes milo-logs accepts. Use `mcp__fluffyjaws__*` / da-live repo if WebFetch 404s persist.

**Output:** short notes appended to the design doc.

### Task 19: Dashboard host page + DA registration doc

**Files:**
- Create: `[milo] libs/blocks/milo-dashboard/README.md` (authoring + config rows + DA registration steps + prod base URL).
- (If a tools page convention exists) document the host page path.

**Step:** Write authoring instructions (block table with `api` row), DA app registration steps, and the prod milo-logs base URL (verify `milo-core-prod.adobe.io`; it's in the OAuth/CORS allowlist). **Commit** `docs: milo-dashboard authoring + DA embedding guide`.

**Manual verification:** Register as a DA app against a stage/prod content repo; confirm the iframe loads, `DA_SDK` resolves, token authenticates against milo-logs (requires beta-allowlist membership — confirm Sino is on it).

---

## PHASE 6 — Traffic adapter (deferred wiring)

### Task 20: Traffic adapter interface + stub panel

**Files:** Create `panels/traffic.js`; Test.

**Step 1: Failing test** — `renderTraffic(el, adapter)` where `adapter` is `{ async getTraffic(scope) }`. With a null/stub adapter it renders a "Traffic — coming soon" empty state; with a fake adapter returning series it renders a chart. Assert both paths.

**Step 3: Implement** the panel + a `nullTrafficAdapter`. Document the future RUM adapter shape (helix rum-bundles: `https://rum.hlx.page/.../rum-bundles` + domain key) and Adobe Analytics MCP option in code comments. **Commit** `feat: add traffic panel with pluggable adapter (stubbed)`.

---

## Finalization

- Run `[milo] npm run lint` and `[milo-logs-deploy]` lint; fix all issues.
- Run full test suites in both repos; all green.
- Use superpowers:requesting-code-review before opening PRs.
- Open one PR per repo (milo, milo-logs-deploy) from `milo-world-dashboard`. milo PR body: test URL to the block on `.aem.page`, what/why, cross-block deps (none). milo-logs-deploy PR: note new routes + that `/security-review` was run.
- Use superpowers:finishing-a-development-branch to decide merge/PR/cleanup.

## Risks / open items
- Prod milo-logs base URL + Sino on beta allowlist (blocks prod DA testing only; local/dev unaffected).
- `publish_logs.created_at` comparison style — verify against `getPreflightStats` and align.
- `date_trunc` query cost on large windows — add an index on `eds_admin_log (route, timestamp)` / `publish_logs (created_at)` only if `EXPLAIN` shows a problem (existing indexes likely cover it).
- DA app registration specifics — pinned down in Task 18 before Phase 5 build.
