# milo-dashboard

## What it is

`milo-dashboard` is a unified preview/publish + preflight health dashboard for the Milo
world. It renders an org-wide overview — KPI stat cards with prior-period trend deltas, an
overall health gauge with per-category breakdown, and volume/health trend charts — plus a
sortable project table that drills into a single project (scoped KPIs, score history, and
the worst-scoring pages). All data comes from the `milo-logs-deploy` backend (Postgres read
replica) over its REST API.

## Authoring the block

Add a block whose first cell is `milo-dashboard`. Config rows are read by `api.js`
`readConfig`, which walks `:scope > div` rows and keys each row by its lowercased first
cell. Recognized keys:

| Key     | Purpose                                                        | Default                 |
|---------|----------------------------------------------------------------|-------------------------|
| `api`      | Backend base URL (no trailing slash). Selects which backend to talk to (prod default). | `http://localhost:8080` |
| `since`    | Default time window for queries (e.g. `30d`, `7d`)             | `30d`                   |
| `token`    | IMS Bearer token override — **standalone mode only** (see Auth modes) | (signed-in IMS token) |
| `clientid` | IMS client id override                                         | `getConfig().imsClientId` |

Example block table:

| milo-dashboard |                              |
|----------------|------------------------------|
| api            | https://milo-core-prod.adobe.io |
| since          | 30d                          |

`token` is intentionally omitted from authored content for normal use. On a signed-in Milo
page the block authenticates with the current user's IMS access token
(`window.adobeIMS.getAccessToken().token`) plus `getConfig().imsClientId` — the same pattern
as preflight's `captureMetrics`. In DA-embedded mode the token comes from the DA SDK instead,
and in local mode (`LOCAL=true` backend) auth is bypassed. Only set `token`/`clientid` to
override these for a standalone page talking to a protected backend.

## Running locally

1. In milo: `npm run libs` (serves milo at `http://localhost:6456`).
2. Run the backend from `milo-logs-deploy`: `LOCAL=true npm run start:dev`. `LOCAL=true`
   bypasses IMS auth and the beta allowlist, so no token is needed.
3. Author a page containing the block with an `api` row of `http://localhost:8080`
   (or omit `api` to use the default local base).

With no `api` row and not in an iframe, the block resolves to `local` mode and targets
`http://localhost:8080` with no token.

## Backend endpoints used

All are read-only routes on `milo-logs-deploy` (see `src/routes/getTrends.js` + `index.js`):

- `GET /overview` — org-wide totals plus deltas vs the prior period (publishes, previews,
  avg health, active projects, pages below threshold).
- `GET /trends/eds` — time-bucketed preview/publish volume from `eds_admin_log`
  (`since`, `interval=day|week|month`).
- `GET /trends/preflight` — time-bucketed preflight health (overall + per-category averages)
  from `publish_logs`.
- `GET /projects` — per-project snapshot: latest health, publish/preview counts, trend delta.
- `GET /preflight-logs` — worst-scoring pages for a project (drill-in); called with
  `projectKey`, `maxScore`, `sortBy`, `sortOrder`, `limit`.

## Embedding as a DA custom app

The block runs inside DA (da.live) as a fullscreen custom app loaded in an iframe.

**Registration** (confirmed against the DA docs and SDK source):

1. Host the page on EDS. The app's codebase source is an EDS-hosted HTML page, e.g.
   `https://main--<repo>--<org>.aem.live/tools/<name>.html` (the `<ref>--<repo>--<owner>`
   pattern; `.aem.page` for preview, `.aem.live` for live).
2. Register it in the site config sheet at `https://da.live/config#/<org>/<site>/` by adding
   an **`apps`** sheet. Each row is one app card; columns: `title`, `description`, `image`,
   `path`, and `ref`.
3. The `path` resolves to a DA app URL of the form `https://da.live/app/<org>/<site>/<path>`.
   DA loads that app inside an iframe and obfuscates the underlying EDS URL.

**Token / context** comes from the DA SDK, not from authored config. The block imports the
SDK default export from `https://da.live/nx/utils/sdk.js` (see `api.js` `loadDaSdk`). The
default export (`DA_SDK`) is a promise; inside `sdk.js` it resolves to `{ ...e.data, actions }`
where `e.data` is the parent's `ready` init message posted over a transferred `MessagePort`.
In practice that resolved object exposes:

- `context` — `{ org, repo, path }` (DA org/repo and current document path). `api.js`
  stores this as `daContext`; the drill-in uses `daContext.org` / `daContext.repo` to build
  `https://da.live/edit#/<org>/<repo><path>` "Fix in DA" links.
- `token` — the current user's IMS access token, used as `Authorization: Bearer <token>`
  plus a `clientId=<getConfig().imsClientId>` query param on backend calls (a real registered
  IMS client, so `requireAuth` validates the token against IMS).
- `actions` — helper methods: `daFetch`, `sendText`, `sendHTML`, `setHref`, `setHash`,
  `setTitle`, `closeLibrary`, `getSelection`.

For the embedded app to reach the backend:

- The user **must be on the `milo-logs` beta allowlist** — `requireAuth` validates an IMS
  Bearer token, an `@adobe.com` identity, and the beta allowlist.
- The **prod backend base URL must be in the `milo-logs` CORS allowlist**.
  `milo-core-prod.adobe.io` is already listed.

TODO/verify:
- Whether `milo-core-prod.adobe.io` is the final prod `milo-logs` base URL.
- The exact `org`/`site` and `apps`-sheet row values for the registered Milo World app.
- That the SDK `context` keys are exactly `org`/`repo`/`path` for this app (the SDK spreads
  the parent's init payload verbatim; the drill-in and DA docs both assume `org`/`repo`).

## Auth modes

`api.js` `resolveContext` picks one of three modes:

In every non-DA mode the token defaults to the signed-in Milo IMS token
(`window.adobeIMS.getAccessToken().token`) and the clientId to `getConfig().imsClientId`,
matching preflight's `captureMetrics`. A `token`/`clientid` config row overrides these.

- **local** — not in an iframe and no `api` row. Base `http://localhost:8080`. Pair with
  `LOCAL=true` on the backend to bypass auth (the IMS token is still sent if present).
- **standalone** — not DA-embedded but an `api` row is present. Base = the `api` row; token
  = `token` row override or the signed-in IMS token; clientId = `clientid` row override or
  `getConfig().imsClientId` (sent as `Authorization: Bearer` + `clientId`).
- **da** — running in an iframe and the DA SDK resolves (raced against a 1.5s timeout). Base
  = `api` row or local default; token = the DA SDK IMS token; clientId =
  `getConfig().imsClientId`; `daContext` = SDK `context`.
