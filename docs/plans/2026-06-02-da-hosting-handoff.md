# Milo World Dashboard — DA Hosting & Handoff

_Written: 2026-06-02. Purpose: hand off to a fresh Claude session. Read this top-to-bottom before doing anything._

---

## 0. TL;DR — where we are right now

- A **Milo dashboard block** (`libs/blocks/milo-dashboard/`) is **built, fully working, and visually polished**. Every interaction works (timeframe windows, per-consumer comparison, alerts, drill-in, deep-linking, loading states, totals).
- Its **backend API is built, merged, and DEPLOYED to stage + prod** (milo-logs-deploy PR #26). Real data exists behind it.
- **BUT the dashboard still renders MOCK data only.** It only runs in a local demo page that fakes `fetch`. Against the real backend it currently **401s** — there is an **unsolved auth handshake** (details in §4).
- **Immediate goal (this user's priority): host the dashboard as a DA custom app.** §5 has the plan. Note the DA app will hit the *same* auth blocker for real data (§4).

**The honest one-liner:** real UI + real deployed data API, but they're not talking yet because of an IMS-token/`clientId` validation problem.

---

## 1. What this project is

"Milo World Dashboard" — a single scannable view of what's happening across Milo: preview/publish activity + preflight health per consumer, with drill-in per project. Brief from **Okan Sahin** (osahin@adobe.com, Senior FE Eng, Milo Core; DM channel `D082FNY20M7`). It's a **low-pressure, AI-first pet project**; VP **Alok** asked for something like it ~1.5y ago. Possible **demo at the Milo Core sync (Thursdays)**. Non-goals Okan stated: don't over-invest, keep it AI-driven, don't over-cover use-cases. **Bonus he wants: live as a DA custom app the team can open.**

Full feedback is in memory: `~/.claude/projects/-Users-skholkhojaev-Repos/memory/milo_dashboard_okan_feedback.md` and `milo_world_dashboard.md`.

---

## 2. What's been built & shipped

### Backend — `milo-logs-deploy` (repo: `git.corp.adobe.com/dream-team-hq/milo-logs-deploy`, GHES)
- **PR #26 — MERGED & DEPLOYED to stage AND prod.** (Okan approved; deploy is `main → stage → prod` automatically, no gate.)
- New read-only routes (all `requireAuth`), backed by the real prod Postgres (`eds_admin_log`, `publish_logs`, `page_index`):
  - `GET /overview?since=` — org KPIs (publishes, previews, avg health, active projects, pages_below_70) for current window + prior equal window + deltas.
  - `GET /trends/eds?since=&interval=day|week|month` — publish/preview volume bucketed.
  - `GET /trends/preflight?since=&interval=` — avg preflight scores bucketed.
  - `GET /projects?since=` — per-consumer publishes/previews/avg_health.
  - `GET /totals` — pages per consumer + grand total.
  - `GET /test-pages` — test/draft pages that reached live (CSV).
  - Matching MCP tools: `get_eds_trends`, `get_preflight_trends`, `get_milo_overview`, `get_milo_projects`, `get_milo_totals`.
- Verified live: hitting any of these on `https://milo-core-stage.adobe.io` or `https://milo-core-prod.adobe.io` returns **401 "Missing token or clientId"** (= deployed, auth-gated; before the merge they were 404).
- Security review run (Adobe `/security-review` skill) → **clean, no findings**.
- Also fixed 4 pre-existing broken test suites (Okan asked) → full backend suite green (24 suites / 369 tests).

### Frontend — `milo` block (repo: `github.com/adobecom/milo`)
- Block at `libs/blocks/milo-dashboard/`: `milo-dashboard.js` (orchestration), `api.js` (data client + auth), `charts.js` (echarts loader/disposal), `panels/*` (kpi-cards, health-gauge [pie-ring, since bundled echarts has no gauge], volume-trend, health-trend, project-table, project-drilldown, worst-pages, consumer-bars, totals-strip, alerts, traffic [stub]), `milo-dashboard.css`, `README.md`, `demo/index.html` (mock demo).
- ~110 tests pass; eslint + stylelint clean. Registered in `C1_BLOCKS` in `libs/utils/utils.js`.
- Features delivered across v1 + v2 + QoL: overview KPIs with **% vs previous period**, per-consumer comparison bars (metric toggle + T1 filter), platform health gauge + category bars, volume & health trend charts, sortable project table, project drill-in (worst pages w/ fix-in-DA links), **alerts/danger panel** (test-pages-live + health anomalies), **totals strip**, **loading skeletons**, **header date-range + Updated + Refresh**, **clickable bars/alerts → drill-in**, **URL-hash deep-linking** (`#/project/<site>`, back/forward + shareable), **drill-in inherits timeframe**, **keyboard a11y**, **env badge**, color-coded worst-page scores.
- **Timeframe model:** Day = 1d vs prior day / 30 daily chart points; Week = 7d vs prior / 12 weekly; Month = 30d vs prior / 12 monthly. The toggle drives every number (not just chart bucketing).

---

## 3. Branch / PR / repo state (exact)

| Repo | Branch | Origin state | Local state | PR |
|---|---|---|---|---|
| milo-logs-deploy | `milo-world-dashboard` | pushed, **PR #26 MERGED** | clean, == origin | #26 (merged) |
| milo | `milo-world-dashboard` | **on origin at `080ddf2b`** | **1 commit ahead** (`7205f5c` = IMS auth fix, NOT pushed) | **NOT opened yet** |

- The milo block is **already `?milolibs=milo-world-dashboard`-loadable** — the code is on origin. BUT origin is missing the latest auth fix (`7205f5c`); push it to make the branch current.
- The **milo block PR has not been opened** (was intentionally held until backend merged; backend is now merged, so it can be opened).
- Git prefs (memory `git_prefs.md`): **no `Co-Authored-By` trailer**; all git commands pre-approved **except `git push`** (always ask first). milo PRs base = `stage`; milo-logs-deploy base = `main`.

---

## 4. THE AUTH BLOCKER (the thing that's actually unsolved)

The dashboard's `api.js` now authenticates like Milo's preflight tool (`libs/blocks/preflight/checks/captureMetrics.js`):
```js
const token = window.adobeIMS?.getAccessToken()?.token;   // signed-in user's IMS token
const { imsClientId } = getConfig();                       // e.g. 'adobedotcom-cc' on adobe.com pages
fetch(`${base}/overview?...&clientId=${clientId}`, { headers: { authorization: `Bearer ${token}` } });
```

Backend `requireAuth` (milo-logs-deploy `src/middleware/auth.js`):
1. needs `Authorization: Bearer <token>` + `?clientId=` (else 401 "Missing token or clientId").
2. calls IMS: `GET https://ims-na1.adobelogin.com/ims/validate_token/v1?client_id=<clientId>&type=access_token` with `Authorization: Bearer <token>`.
3. if `validation.valid !== true` → **401 "Invalid token"**.
4. then fetches `/ims/profile/v1`; requires `@adobe.com` (403 else) and email in `BETA_USERS` (403 "Not in beta" else).
- **`skholkhojaev@adobe.com` IS in `BETA_USERS`** (confirmed in deployed code) — so the allowlist is NOT the problem.
- `IMS_HOST` defaults to `ims-na1.adobelogin.com` (prod IMS).

### What we observed (testing from a signed-in adobe.com page, DevTools)
- `window.adobeid.client_id` = **`adobedotcom-cc`**, token length ~1220 (so user IS signed in).
- `GET https://milo-core-prod.adobe.io/overview?since=7d&clientId=adobedotcom-cc` with the bearer → **`401 {"error":"Invalid token"}`**.
- The page's OWN preflight `captureMetrics` POST to `/preflight-logs?clientId=adobedotcom-cc` **also 401s** → so this is **not our block's bug**; it's the milo-core token/validation contract. Either preflight logging is also mis-authing in prod, or there's a specific client/token required.
- Tried `clientId` = `adobedotcom-cc`, `feds-milo`, `window.adobeid.client_id` → **all 401**.

### The NEXT diagnostic step (do this first in the new session, if pursuing real data)
Have the user run this on a signed-in adobe.com page (DevTools console) — it reads the token's REAL client and replicates milo-core's exact IMS call:
```js
const t = window.adobeIMS.getAccessToken().token;
const p = JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
console.log('TOKEN client_id:', p.client_id, '| type:', p.type, '| as:', p.as, '| scope:', (p.scope||'').slice(0,80));
const v = await fetch(`https://ims-na1.adobelogin.com/ims/validate_token/v1?client_id=${p.client_id}&type=access_token`,
  { headers: { Authorization: `Bearer ${t}` } });
console.log('IMS says:', await v.json());
```
Interpretation:
- **`{valid:true}` + a client_id we haven't tried** → that's the client to send; set it in the block (api.js currently uses `getConfig().imsClientId`; may need an override or to use the token's client).
- **`{valid:false}` even with the token's own client_id** → milo-core's `requireAuth` is calling IMS `validate_token` wrong (IMS may want the token as a `token=` param, not in the `Authorization` header). That's a **backend bug to fix in milo-logs-deploy** (and it explains why preflight capture also 401s). Cross-check IMS `validate_token/v1` API docs.
- **`as:` shows a stage IMS host** → token/host env mismatch.

> The user explicitly chose to set this aside and prioritise the DA app. But real data in *any* host (DA app included) is gated on resolving this. Surface that honestly.

---

## 5. DA custom app — how to host it (the user's current priority)

### How DA apps work (from da.live research; some details marked "verify")
- A DA app = **an EDS-hosted HTML page loaded as an iframe inside DA**.
- The page imports `DA_SDK` from `https://da.live/nx/utils/sdk.js`; the default export resolves to `{ ...context (org, repo, path), token, actions }`. `actions` includes `daFetch, sendText, sendHTML, setHref, setHash, setTitle, closeLibrary, getSelection`. `token` is an IMS token; `context` has org/repo/path. (Our `api.js` already detects DA mode via `loadDaSdk` and uses `sdk.token` + `sdk.context` as `daContext`.)
- **Registration (VERIFY):** an `apps` sheet in the DA site config at `https://da.live/config#/<org>/<site>/`, columns `title, description, image, path, ref`. Then the app shows in DA and loads the page URL in an iframe.
- Source page URL pattern: `https://<ref>--<repo>--<owner>.aem.page/<path>` (preview) / `.aem.live` (live).

### Prerequisites (what's missing for the DA app)
1. **Branch current on origin** — push `7205f5c` (the auth fix) to `origin/milo-world-dashboard`. (Code is already on origin, just 1 commit behind.) — _needs user OK to push._
2. **A host page that contains the `milo-dashboard` block** — this DOES NOT EXIST YET. It must be authored content (a DA doc) with the block table + an `api` config row, on some DA-backed site. This page (run with `?milolibs=milo-world-dashboard` until the PR merges) is what DA iframes.
3. **Register the app** in that DA site's config (Okan offered to help; or do it via DA admin API if we have access).

### CRITICAL: code vs content — why a branch URL alone 404s
EDS serves a page as **code (from the git branch) + content (from the site's DA/SharePoint source)**. The repo branch only provides the block **code**; it does **not** create pages. So visiting e.g. `https://milo-world-dashboard--milo--adobecom.aem.page/tools/milo-core/vitals` **404s today** because no document exists at that path. To make any URL render the block you MUST:
1. **Author a document** at the desired path (e.g. `/tools/milo-core/vitals`) in Milo's content source (DA) containing the `milo-dashboard` block table + `api` row.
2. **Preview it** (lands it on the content bus / `aem.page`).
3. Then `https://<branch>--milo--adobecom.aem.page/<path>` = that branch's **code** + that **content** → the block renders. (Even then: real data needs the §4 auth fix; otherwise panels show empty/error states. No mock on a real aem.page.)

Candidate path discussed with user: `/tools/milo-core/vitals`. Need to confirm the DA **org/repo** for Milo's content (likely `adobecom/milo`) before authoring. Can push the doc via the `da-auth` skill + DA admin API (`admin.da.live`).

### Block authoring (how the block reads config)
The block reads `:scope > div` rows as key/value. Relevant rows:
- `api` → backend base URL (e.g. `https://milo-core-prod.adobe.io`). Default if absent: `http://localhost:8080`.
- `since` → (currently unused; timeframe drives windows).
- `token` / `clientid` → optional explicit overrides (normally not set; DA/IMS provide them).

Example authored block:
```
| milo-dashboard |
| api | https://milo-core-prod.adobe.io |
```

### Open questions for the user (BLOCKING the DA app — ask early)
- **Which DA org/site** should host the dashboard page? (a team sandbox? the milo site? one Okan designates?) — needed to create the page + register the app.
- Is there **already a DA page/site** with the block (maybe Okan set one up), or create from scratch?
- Who registers the app in DA config — us (need access) or **Okan** (he offered)?
- Tools to create the page programmatically: the `da-auth` skill (IMS token for admin.da.live, cached at `~/.aem/da-token.json` via `da-auth-helper login`) + DA admin API (push HTML to `admin.da.live`). See also skills `create-site`, `build-content-from-figma` for DA-push patterns.

---

## 6. Next steps (prioritized, for the fresh session)

**Track A — DA app (user's stated priority):**
1. Confirm DA org/site to host in (ask user / Okan). 
2. Get user OK to **push `7205f5c`** to `origin/milo-world-dashboard` (makes branch current).
3. Create the **host page** (DA doc with the `milo-dashboard` block + `api` row → prod) in the chosen site, via DA admin API (`da-auth` skill) or hand spec to Okan.
4. Verify the page renders the block via `?milolibs=milo-world-dashboard` (mock or real depending on auth).
5. **Register the DA app** (apps config) — with Okan, or directly if access.
6. Open it in DA → confirm iframe loads + `DA_SDK` resolves.

**Track B — real data (gated, can run in parallel):**
7. Resolve the auth handshake (§4 diagnostic). Likely outcome is either a different `clientId`, or a `requireAuth` fix in milo-logs-deploy. Note: the DA app's `DA_SDK` token may validate where the adobe.com token didn't — worth testing once embedded.

**Track C — finish the frontend:**
8. **Open the milo block PR** (base `stage`) — held until now; backend's merged so it can go. Includes the auth fix + all QoL.
9. Deferred (Okan: don't over-invest): monthly-publishes-per-consumer chart; prev/next period nav.

---

## 7. How to run the local demo (works today, mock data)
```bash
cd /Users/skholkhojaev/Repos/milo
python3 -m http.server 3000
# open: http://localhost:3000/libs/blocks/milo-dashboard/demo/index.html
```
- Mocks `fetch` in-browser; charts use the real echarts bundle. The mock varies by `since`/`interval` so Day/Week/Month visibly change.
- Puppeteer note: the headless screenshot `width` is NOT a real layout viewport (can't trust it for true mobile). Module cache persists in-session — restart the browser (new `launchOptions`) or bump a `?v=N` query AND restart to bust it.

---

## 8. Key references
- Reference auth pattern (copy this): `milo/libs/blocks/preflight/checks/captureMetrics.js`.
- Backend auth: `milo-logs-deploy/src/middleware/auth.js` (BETA_USERS, requireAuth), `src/oauth/ims.js` (IMS_HOST).
- Backend routes: `milo-logs-deploy/src/routes/getTrends.js`, `src/routes/index.js`, `src/routes/searchPages.js` (getTestPages), `src/mcp/server.js`.
- Block: `milo/libs/blocks/milo-dashboard/` (start with `milo-dashboard.js` + `api.js` + `README.md`).
- Design/plan docs: `milo/docs/plans/2026-05-29-milo-world-dashboard-design.md`, `...-milo-world-dashboard.md` (impl plan).
- Memory files (auto-loaded): `milo_world_dashboard.md`, `milo_dashboard_okan_feedback.md`, `git_prefs.md`, `user_role.md`.
- Live endpoints: `https://milo-core-stage.adobe.io` and `https://milo-core-prod.adobe.io` (the new routes are deployed on both; `/ping` is public, rest need auth).
- Slack: Okan DM channel `D082FNY20M7` (workspace `slack-mwp`). Use the slack-mwp MCP; look up real account via email; never post as the bot. PR #26 review lives on GHES.

## 9. Watch-outs / gotchas
- Bundled `echarts.common.min.js` has **no gauge chart** — health "gauge" is a pie/doughnut ring. Don't reintroduce `type:'gauge'`.
- Postgres `numeric` comes back as **strings** via node-postgres — always `Number()` before formatting/comparing (panels already do).
- Jest `unstable_mockModule` factories must declare **every export the real consumer imports**, or the suite fails to load (this bit us 4×).
- `curl`/`head`/`tr` are NOT on PATH in the Bash tool here — use `python3` for HTTP probes.
- Pushing straight to `milo-logs-deploy` main = **deploys to prod** (no gate). milo block changes are lower risk (library code, gated by PR + ?milolibs).
- Hardcoded user-facing strings in the block (no `replaceKey` i18n) — known, low priority for an internal tool; could be flagged in PR review.
