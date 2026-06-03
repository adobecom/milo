# Milo World Dashboard — Polish Pass (Tier A+B) — Design

_2026-06-03. Frontend-only changes to the `milo-dashboard` block. Lives on the
`milo-world-dashboard` branch, served via `?ref=` (no merge needed). Sourced
from a user review of the live dashboard; triaged against the code in
`libs/blocks/milo-dashboard/`._

## Scope

Eight focused changes: six in the milo block (clarity, two bug fixes, frontend
perf) and one backend perf change in `milo-logs-deploy` (read-route response
cache). Two deferred items captured for Okan.

Out of scope (deferred — design/data decisions, raise with Okan):
- **#1 Trim KPI cards** — which of the 5 KPIs to keep (Active Projects and
  Pages Below 70 overlap other panels). Design call, not a bug.
- **#8 Projects search / too few projects** — root cause is upstream, not UI:
  `getProjects` only returns sites with activity in the window, and the
  ingestor only ingests `INGEST_SITES` (~4 sites today). A search box can't
  surface un-ingested consumers. Matches Okan's roadmap ("onboard ~130 more
  consumers"). Frontend search adds little until then.

## Change 1 — Fix the KPI delta arrow (bug)

**Problem:** `panels/kpi-cards.js` picks a single `up`/`down` class from
*goodness* (`good = higherIsBetter ? pct>0 : pct<0`), and `milo-dashboard.css`
ties the arrow glyph (↗ `\2197` / ↘ `\2198`) to that same class. So
"Pages Below 70: −100%" (a drop, which is good because `higherIsBetter:false`)
gets class `up` → a green **↗** next to a negative number. Arrow points up while
the value fell.

**Fix:** decouple glyph from color. Per metric compute two independent things:
- **arrow** from the numeric sign: `pct > 0` → `rose` (↗), `pct < 0` → `fell` (↘)
- **color** from goodness: `good` (green) / `bad` (red); `pct === null` or
  rounded `0` → `flat` (no arrow, neutral color)

`kpi-cards.js`: replace the single `up`/`down`/`flat` assignment with separate
color (`good`/`bad`/`flat`) and direction (`rose`/`fell`) classes on
`.kpi-delta`. When flat, add neither direction class.

CSS (`milo-dashboard.css` ~233–249): replace `.kpi-delta.up` / `.kpi-delta.down`
(which set both color and `::before` glyph) with:
- `.kpi-delta.good { color/background = good }`
- `.kpi-delta.bad  { color/background = bad }`
- `.kpi-delta.flat { neutral }` (unchanged)
- `.kpi-delta.rose::before { content: "\2197" }`
- `.kpi-delta.fell::before { content: "\2198" }`

Result: "Pages Below 70 −100%" → green **↘** ("down, which is good").

## Change 2 — Make "+N more" alerts actionable (bug)

**Problem:** `panels/alerts.js:61-63` renders `+N more` as a static `<div>`;
the rest of the alerts are unreachable. No "all alerts" view/route exists, and
backend work is out of scope.

**Fix:** expand-in-place. Render `+N more` as a `<button>`. On click it renders
the full alert list (drop the `MAX_SHOWN` slice) and swaps the button to
"Show less", which collapses back. Keep per-alert behavior (the `high`-severity
items stay clickable buttons that drill into the consumer). Panel body stays
scrollable via existing CSS.

## Change 3 — Info tooltips (clarity)

**Problem:** no card explains where its number comes from; several are not
self-explanatory (#3, #5, #6).

**Fix:** add a small reusable accessible info affordance and attach it where
needed.

Affordance: a `<button class="info-tip" aria-label="…">` with a `?` glyph and a
CSS tooltip shown on hover **and** keyboard focus. Meets a11y rules: real
button (keyboard operable for free), `aria-label` carrying the explanation,
≥44px hit area (padding-expanded if the glyph is smaller). Implemented as a
helper (e.g. `infoTip(text)` returning the button) reused across panels.

Attach to:
- **Live pages (header all-time stat, see Change 4)** — "All-time count of live
  pages across consumers. Not affected by the Day / Week / Month toggle."
- **Platform preflight health** (gauge panel title) — "Average preflight score
  (0–100) from the latest checks: performance, SEO, accessibility, assets."
- **By consumer → T1 toggle** — "Tier-1 consumers (CC, DC, Express, Bacom,
  Blog). Toggle off to see all consumers."
- **KPI "Avg Health Score"** — "Average preflight score (0–100) this period."
- **KPI "Pages Below 70"** — "Live pages scoring under 70 on preflight health.
  Lower is better."

Strings are hardcoded. This deviates from the milo `no-hardcoded-strings`
rule, but is consistent with the entire `milo-dashboard` block, which hardcodes
all copy: it is an internal tool running in a cross-origin DA iframe where
`placeholders.json` / locale config is not wired. Noted intentionally.

## Change 4 — Separate all-time "Pages stored" from the timeframe (clarity)

**Problem:** `getTotals` (backend) takes no `since` — it is an all-time grand
total of live pages. But the "Pages stored" panel sits in the grid directly
below the Day / Week / Month toggle, implying the toggle scopes it. It does not.

**Fix:** lift the grand total into the header, **above** the timeframe toggle,
and keep the per-site breakdown as a grid panel.

Header (`milo-dashboard.js` `showOverview`) restructures to:
1. Title "Milo World" + meta (env badge, updated, refresh) — as today.
2. **New all-time stat line above the toggle:** e.g. `1,234,567 live pages ·
   all-time` + the Change-3 info tooltip. Clearly global.
3. Timeframe toggle + range label — everything below reflects the selected
   period.

Grid panel: the former "Pages stored" panel keeps the **per-site list only**,
retitled **"Live pages by consumer"** (reads as all-time, no toggle implication).

`renderTotals` splits responsibilities: it renders the per-site list into its
panel body (as today, minus the headline total), and updates the header stat
element (passed in, or via a small separate render call from `showOverview`).
The `/totals` fetch (`pTotals`) is unchanged and still feeds both. Keep error
isolation: a totals failure shows a per-panel error and leaves the header stat
blank/`—` rather than blanking the dashboard.

## Change 6 — Charts blank until refresh (bug)

**Problem:** on first load the doughnut ring (gauge) and the entire "By consumer"
chart render blank; they only appear after clicking Refresh or a timeframe
button.

**Root cause:** echarts charts initialize before the block's CSS is applied, so
their containers have zero height at `echarts.init()` and nothing resizes them.
- `charts.js:16-23` `makeChart` calls `echarts.init(el)`, which measures
  `clientHeight` once; the only recovery listener is `window` `resize`.
- The container heights live only in the block CSS (`.gauge { min-height:230px }`
  `css:270`, `.consumer-bars { min-height:300px }` `css:344`). With no CSS those
  divs are 0px tall.
- `milo-dashboard.js:86` calls `loadStyle(import.meta.url)` — but `import.meta.url`
  is the **`.js`** file, not the `.css`. `loadStyle` (`utils.js:1160`) tries to
  load the JS as a stylesheet; the browser rejects it. It loads no CSS and isn't
  awaited. No other block uses this pattern.
- On the live DA page the real CSS is loaded asynchronously by milo's `loadBlock`,
  racing the JS. `init()` builds the charts before the CSS lands → 0-height
  containers → echarts renders blank ("Can't get DOM width or height"). Refresh
  re-runs `makeChart` after CSS is applied → renders. The demo never shows the
  bug because `demo/index.html:9` hard-links the CSS in `<head>`.
- The HTML category bars render fine because they have no echarts size dependency.

**Fix (defense-in-depth, two layers):**
1. **Eliminate the race at the source:** load the correct CSS and await it before
   rendering charts — `loadStyle(import.meta.url.replace('.js', '.css'))` wrapped
   in a promise and awaited in `init()`.
2. **Durable backstop:** add a `ResizeObserver` in `makeChart` that calls
   `chart.resize()` when the container box becomes non-zero / changes; disconnect
   it in `clearCharts` alongside the existing window-resize cleanup. This replaces
   the window-only listener and permanently fixes any residual 0-size-at-init
   race or later container resize.

## Change 7 — Frontend load ordering (perf)

**Problem:** `milo-dashboard.js:90` does `await loadCharts()` (echarts ~1MB)
*before* any data request fires, and `resolveContext` first awaits the DA SDK
(up to 1.5s). The largest download and the slow API calls run serially instead
of overlapping.

**Fix:** reorder `init()` so the data requests start in parallel with the echarts
download (and SDK load). Kick off the fetches and `loadCharts()` together; await
echarts only where a chart panel actually needs it. No behavior change — only the
sequencing of independent awaits (per milo-performance "parallelize independent
awaits"). Keep progressive per-panel rendering intact.

## Change 8 — Backend response cache (perf, milo-logs-deploy)

**Problem:** the dashboard's read-only aggregate routes (`/overview`,
`/projects`, `/totals`, `/trends/eds`, `/trends/preflight`, `/test-pages`) run
expensive aggregate queries against a Postgres pool capped at `max: 1`
(intentional — serializes queries). Concurrent dashboard requests and multiple
beta users queue behind one connection; first load after idle also hits Aurora
cold-start (~30s, out of scope here).

**Fix:** short-TTL in-process response cache + single-flight on those GET routes.
- A `Map` keyed by `route + normalized query`, entries `{ expires, promise }`,
  TTL ~60–120s. Mirrors the existing PR #27 `authCache` pattern in
  `src/middleware/auth.js`, including single-flight: concurrent identical
  requests share one in-flight DB query instead of queuing behind `pool max: 1`.
- Implemented as a small wrapper applied to the read handlers in
  `src/routes/index.js` (or a helper in `getTrends.js`/`searchPages.js`). Sits
  **inside** the handler, **after** `requireAuth` — no auth bypass. Only
  successful results cached; errors are not.
- **Safety / no harm to other products:** it strictly *removes* queries from the
  shared pool (less contention for everyone), changes no shared infra, and does
  **not** touch `pool max: 1` (raising that would risk connection pressure — the
  option we deliberately avoid). Aurora cold-start / keep-warm is explicitly out
  of scope.
- Tests: cache hit returns without a second DB call (assert query fn called
  once across two requests); entry expires after TTL; concurrent calls
  single-flight to one query; errors not cached. Add a cache-clear export for
  test isolation (mirrors `clearAuthCache()`).

## Change 9 — Capture deferred items

Add the #1 and #8 notes (above) to the next handoff's "Open / next" list so
they reach Okan. No code.

## Testing

- `kpi-cards` unit test: assert a negative `pct` on a `higherIsBetter:false`
  metric yields `fell` + `good` classes (the bug case); a positive on the same
  yields `rose` + `bad`; null/0 → `flat`, no direction class.
- `alerts` unit test: `+N more` is a button; clicking expands to full list and
  toggles to "Show less".
- `totals` unit test: per-site list renders in the panel; the header stat
  element receives the grand total.
- Add an `info-tip` smoke assertion (button present with `aria-label`).
- `npm run test:file` for the two existing suites, `eslint`, `stylelint`.
- Visual check against the demo page (`demo/index.html`) per the handoff.

## Files touched

- `libs/blocks/milo-dashboard/panels/kpi-cards.js`
- `libs/blocks/milo-dashboard/panels/alerts.js`
- `libs/blocks/milo-dashboard/panels/totals-strip.js`
- `libs/blocks/milo-dashboard/panels/consumer-bars.js` (T1 tooltip)
- `libs/blocks/milo-dashboard/milo-dashboard.js` (header restructure, info-tip wiring)
- `libs/blocks/milo-dashboard/milo-dashboard.css` (delta classes, info-tip, header stat)
- `libs/blocks/milo-dashboard/charts.js` (ResizeObserver in makeChart/clearCharts)
- `test/blocks/milo-dashboard/*.test.js`
- (optional) a tiny `infoTip` helper, colocated or in `milo-dashboard.js`

**milo-logs-deploy (backend, Change 8):**
- `src/routes/index.js` and/or `src/routes/getTrends.js` + `src/routes/searchPages.js`
  (cache wrapper on the read handlers)
- a small cache helper (mirror `authCache` in `src/middleware/auth.js`) with a
  test-only clear export
- backend test file(s) for cache hit / expiry / single-flight / error-not-cached
