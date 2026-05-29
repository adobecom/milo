# Milo World Dashboard — Design

_Date: 2026-05-29_
_Author: Sino Kholkhojaev (milo-core)_
_Status: Approved (brainstorming) → ready for implementation plan_

## Problem

There is no unified "single pane of glass" showing what is happening across the Milo
world. Preflight health lives in the Preflight Dashboard / Milo Studio; preview & publish
activity lives only in raw EDS/Helix audit logs; traffic lives in RUM/Analytics. Nothing
joins **publish/preview activity + preflight health (+ traffic)** per project, over time,
with trends vs. the prior period, and big-picture → drill-in navigation.

`milo-logs-deploy` already stores the raw data (Postgres) and exposes it via REST + an MCP
server, but only as **point-in-time aggregates** — no time-bucketed series, no deltas.

## Goal

A `milo-dashboard` Milo block that:
- Shows org-wide overview KPIs with trend deltas (vs prior period).
- Charts preview/publish volume and preflight health over daily/weekly/monthly windows.
- Drills into a single project for case-studies (worst pages, score history, block usage).
- Runs locally (milo `aem up` + `milo-logs-deploy` LOCAL), standalone, and embedded as a
  DA custom app.
- Has a stubbed traffic panel ready for RUM / Adobe Analytics later.

## Data source: milo-logs-deploy

Postgres, read replica (`dbRead`). Relevant tables:

- **`publish_logs`** — preflight runs. `url`, `project_key`, `email`, `created_at`, overall
  `performance_score`, category scores (`performance_category_score`, `seo_category_score`,
  `accessibility_category_score`, `assets_category_score`, all 0–100), plus pass/fail flags.
- **`eds_admin_log`** — every EDS request. `timestamp` (ms, BIGINT), `route` (live|preview),
  `status`, `method`, `site`, `org`, `repo`, `owner`, `path`.
- **`page_index`** — searchable page content (`blocks`, `state`, `last_indexed_at`).

Existing endpoints return one aggregate per group (`get_preflight_stats`, `get_eds_stats`,
`get_preflight_bad_pages`, `count_published_pages`, search/block tools). Auth = IMS Bearer +
`clientId` + beta allowlist, or `LOCAL=true` bypass. CORS allows `localhost:*`,
`milo-core-prod/stage.adobe.io`, `claude.ai`.

## Decisions (from brainstorming)

- **MVP:** trends + drill-down spine first.
- **Traffic:** design now (adapter + panel slot), defer wiring.
- **Backend:** add new trend/overview routes in milo-logs-deploy; block auths via DA SDK IMS
  token in prod, LOCAL bypass in dev.
- **Visual:** clean BI / health-dashboard, matching the DA look & feel (neutral palette,
  system font, subtle borders, Adobe-red accent), using Milo design tokens + echarts.

## Backend changes (milo-logs-deploy)

New read-only routes (replica), each also exposed as an MCP tool. Built TDD (Jest).

| Route | Params | Returns |
|---|---|---|
| `GET /trends/eds` | `since`, `interval=day\|week\|month`, `route?`, `site?`, `groupBy?` | `[{ bucket, route, site?, amount }]` (date_trunc over `eds_admin_log`) |
| `GET /trends/preflight` | `since`, `interval`, `project?`, `category?` | `[{ bucket, project_key?, avg_overall, avg_performance, avg_seo, avg_accessibility, avg_assets, checks, pages_below_50, … }]` |
| `GET /overview` | `since` (+ auto prior-window compare) | org-wide totals **and deltas vs prior period**: publishes, previews, avg health, active projects, pages-below-threshold |
| `GET /projects` | `since` | per-project snapshot: latest health, publish/preview counts, trend delta |

MCP parity tools: `get_eds_trends`, `get_preflight_trends`, `get_milo_overview`,
`get_milo_projects`. Add indexes only if `date_trunc` queries require them (existing
route/site/timestamp index likely suffices for EDS).

## Block: libs/blocks/milo-dashboard/

```
milo-dashboard/
  milo-dashboard.js   # init(block): env+auth detect, layout, orchestration
  milo-dashboard.css  # DA-matching styles, Milo tokens
  api.js              # data client: base URL + auth resolution, all fetches
  charts.js           # echarts wrappers (loadScript /libs/deps/echarts.common.min.js)
  panels/             # kpi-cards, health-gauge, volume-trend, health-trend,
                      # project-table, project-drilldown, traffic (stub)
```

Registered in `C1_BLOCKS` in `libs/utils/utils.js`. Default export `init(block)`.

### Env / auth resolution

1. `loadStyle(import.meta.url)` + `loadScript(echarts)`.
2. Resolve context: race `DA_SDK` (`https://da.live/nx/utils/sdk.js`) with a short timeout.
   - DA resolves → DA mode, use `actions.token` / SDK token as `Authorization: Bearer` +
     `clientId`, base = prod milo-logs.
   - Else → read block-config rows (API base, token source); fall back to local-dev
     defaults (`localhost:8080`, LOCAL bypass, no token).
3. Build `api.js` client.
4. Fetch `/overview` + `/trends/*` → render. Filters re-fetch.

Block-config rows (authored table): API base URL, default time window, project filter.

## Layout

- Header: title · Day/Week/Month toggle · date range · project-scope selector.
- KPI stat cards (delta vs prior + sparkline): Publishes · Previews · Avg Health · Active
  Projects · Pages below threshold.
- Overall health gauge + per-category breakdown.
- Volume trend (publish vs preview over time).
- Health trend (overall + per-category toggle, vs prior period).
- Project table (sortable; row → drill-in).
- Project drill-in: scoped KPIs, score history, worst-pages table (fix-in-DA links via
  `get_preflight_bad_pages`), latest pages, block usage.
- Traffic panel: in layout, stubbed; adapter interface ready for RUM/Analytics.

## DA custom app

Embedded as an iframe DA app. `DA_SDK` default export resolves to `{ ...context (org/repo/
path), token, actions }` where `actions` includes `daFetch`, `sendText`, `sendHTML`,
`setHref`, `setHash`, `setTitle`, `closeLibrary`, `getSelection`. Packaging + registration
pinned down against da-live during phase 5.

## Error handling

Auth failure → "sign in / not on allowlist" state. Empty data → per-panel empty state. API
down → inline retry. DA SDK absent → silent config fallback. Per-panel isolation — one
panel failing never blanks the board.

## Testing

TDD throughout. Block: web-test-runner units (mock `fetch`, mock `DA_SDK`, assert render +
interactions). Backend: Jest per route (SQL/handler + auth). Lint clean.

## Phasing

1. Backend trend/overview routes + tests (data spine).
2. Block scaffold + api.js + echarts + env/auth detect.
3. Overview: KPI cards + health gauge + volume & health trends.
4. Project table + drill-in.
5. DA custom-app packaging + docs.
6. Traffic adapter wiring (deferred follow-up).

## Open items (resolve during implementation, non-blocking)

- Exact prod `milo-logs` base URL (milo-core-prod.adobe.io candidate; verify).
- DA app registration specifics (from da-live, phase 5).
- Confirm Sino is on the milo-logs beta allowlist for prod testing.

## DA embedding — research notes (2026-05-29)

Research for Task 18, against the live DA SDK source, DA docs, and internal Slack
(via Fluffyjaws). GitHub API/MCP access to `adobe/da-live` was unavailable (404 /
bad credentials), so the SDK was read from the deployed `https://da.live/...` files.

**Confirmed:**

- **SDK source** (`https://da.live/nx/utils/sdk.js`): `DA_SDK` is the default export, a
  promise that resolves once the parent posts a `ready` message carrying a transferred
  `MessagePort`. It resolves to `{ ...e.data, actions }` — i.e. the parent's init payload
  spread, plus an `actions` object. `actions` = `{ daFetch, sendText, sendHTML, setHref,
  setHash, setTitle, closeLibrary, getSelection }`. (Source: live `nx/utils/sdk.js`.)
- **Token plumbing**: `e.data.token` is passed to `setImsDetails` in `nx/utils/daFetch.js`,
  which stores it as an IMS access token and sends it as `Authorization: Bearer <token>`.
  So the SDK's `token` is the current user's IMS access token. (Source: live
  `nx/utils/daFetch.js`.)
- **Resolved object shape** per DA docs: `{ context, token, actions }`. `context` holds the
  environment data (org/repo and current path); `actions` are plugin helpers. Our `api.js`
  reads `sdk.token` and `sdk.context` (stored as `daContext`); `worst-pages.js` uses
  `daContext.org` / `daContext.repo` to build `https://da.live/edit#/<org>/<repo><path>`
  links. (Sources: docs.da.live SDK recipes + developing-apps-and-plugins.)
- **App registration**: add an `apps` sheet to the site config at
  `https://da.live/config#/<org>/<site>/`. Columns: `title`, `description`, `image`,
  `path`, `ref`. (Source: docs.da.live developing-apps-and-plugins; corroborated by Slack
  via Fluffyjaws.)
- **URL patterns**: codebase source `https://main--<repo>--<org>.aem.live/tools/<name>.html`
  (EDS `<ref>--<repo>--<owner>` host; `.aem.page` preview / `.aem.live` live); the DA app
  URL is `https://da.live/app/<org>/<site>/<path>`, loaded in an iframe with the real EDS
  URL obfuscated. (Source: docs.da.live developing-apps-and-plugins.)
- **Backend auth gate**: `requireAuth` in milo-logs validates IMS Bearer + `@adobe.com` +
  beta allowlist; `LOCAL=true` bypasses. CORS allows `localhost:*`,
  `milo-core-prod/stage.adobe.io`, `claude.ai`. The DA SDK IMS token satisfies the Bearer
  check, so an embedded app works iff the user is on the beta allowlist and the prod base
  is CORS-allowed (`milo-core-prod.adobe.io` already is). (Source: milo-logs-deploy code,
  prior tasks.)

**Assumed / to verify:**

- That `context` keys are exactly `org`/`repo`/`path` for this app — the SDK spreads the
  parent payload verbatim, and docs/our code assume those keys, but they were not seen in a
  literal payload dump. Drill-in "Fix in DA" links depend on it.
- Final prod `milo-logs` base URL (`milo-core-prod.adobe.io` candidate).
- The exact `org`/`site` and `apps`-sheet row values for the registered Milo World app.

**Sources:** `https://da.live/nx/utils/sdk.js`, `https://da.live/nx/utils/daFetch.js`,
`https://docs.da.live/developers/reference/sdk-recipes`,
`https://docs.da.live/developers/guides/developing-apps-and-plugins`, internal Slack
(#da channel, via Fluffyjaws — names/dates not independently verified).
