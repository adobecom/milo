# Milo World Dashboard — Handoff (2026-06-03)

_Supersedes `2026-06-02-da-hosting-handoff.md`. Read this top-to-bottom before doing anything. Written to hand off to a fresh Claude session._

---

## 0. TL;DR — where we are right now

- The **Milo World dashboard is LIVE in DA, working end-to-end with real prod data.** Honwai confirmed access; the user confirmed the new DA-native look renders.
- It's hosted as a **DA custom app**, opened via:
  **`https://da.live/app/adobecom/milo/tools/milo-core/vitals?ref=milo-world-dashboard`**
- The `?ref=milo-world-dashboard` param makes DA serve the **milo branch code directly** (EDS code + the authored SharePoint content page). So **every push to the branch is instantly live at that URL — no merge needed** for frontend changes.
- The **milo block PR has still NOT been opened.** Frontend runs entirely off the branch via `?ref=`. (Opening + merging to main is what would let the plain `/vitals` URL work without `?ref`.)
- Backend fixes ARE merged to `milo-logs-deploy` main and deployed to stage+prod.

**Honest one-liner:** fully working DA app on real prod data, served off the milo branch via `?ref=`; backend hardening is deployed; remaining work is feature polish + eventually merging the milo block PR.

---

## 1. What this is

"Milo World" — one scannable view of preview/publish activity + preflight health across all Milo consumers, with drill-in per project. Brief from **Okan Sahin** (osahin@adobe.com, Senior FE Eng, Milo Core; DM channel `D082FNY20M7` in `slack-mwp`). Low-pressure, **AI-first pet project**; VP **Alok** asked for something like it ~1.5y ago. Demo target was the **Milo Core Thursday sync**, then a feedback session with **Honwai Wong** (hwong@adobe.com, Lead Architect; DM `D09L68NJ2GH`).

Okan's non-goals (still apply): don't over-invest, keep it AI-driven, don't over-cover use-cases.

---

## 2. Architecture / how hosting works (important, was a source of confusion)

- **Frontend:** milo block at `libs/blocks/milo-dashboard/` in `github.com/adobecom/milo`, on branch `milo-world-dashboard`. Registered in `C1_BLOCKS` in `libs/utils/utils.js`.
- **Content page:** a doc at `/tools/milo-core/vitals` containing the `milo-dashboard` block. **Milo's main content is SharePoint-backed, NOT DA** (DA only holds `drafts/img/video` for adobecom/milo). Okan authored this page. **You cannot push the page via the DA admin API.** Edits to the page (e.g. an `api` config row) must be done in SharePoint — which is why we made the backend default code-side instead (see §3).
- **DA app:** the `da.live/app/.../vitals` entry iframes the EDS page. With `?ref=milo-world-dashboard` it loads the branch's code. Inside that iframe the block runs **cross-origin** (page origin is `…aem.page`, not `da.live`), so DA's `--s2-*` `:root` design tokens are NOT in scope — all styling values are hardcoded (see §5).
- **Auth inside DA:** the block reads the IMS token from the DA SDK (`import DA_SDK from 'https://da.live/nx/utils/sdk.js'` → `sdk.token`). Its `client_id` is **`darkalley`** (DA's IMS app). milo-core validates the token against the `clientId` query param, so the block MUST send the token's own `client_id` — see §3.
- **Backend:** `milo-logs-deploy` (GHES `git.corp.adobe.com/dream-team-hq/milo-logs-deploy`), Node/Express + Postgres. Deploy is automatic `main → stage → prod` (no gate). Both `milo-core-stage.adobe.io` and `milo-core-prod.adobe.io` are backed by the same prod Postgres.

---

## 3. What was fixed/shipped THIS session (2026-06-03)

### Backend — `milo-logs-deploy` (all MERGED to main + DEPLOYED to stage+prod)
- **PR #27 — IMS auth cache + single-flight** (`src/middleware/auth.js`). `requireAuth` made 2 IMS calls (`validate_token` + `/profile`) on **every** request with no caching. The dashboard fires ~6 requests at once → ~12 concurrent IMS validations → IMS throttled the burst → **intermittent 401 "Invalid token"** (the half-200/half-401 symptom). Fix: cache successful auth per `clientId+token` for 5 min + share one in-flight validation across concurrent requests. Failures not cached. Added `clearAuthCache()` for tests.
- **PR #28 — `/overview` 4→2 queries** (`src/routes/getTrends.js`). `getOverview` ran 4 serial window queries (current+prior × eds+preflight); with `pool max: 1` they serialize. Collapsed to 2 single-pass queries using conditional `FILTER` aggregates. Output shape unchanged.
- **PR #28 also — `hwong@adobe.com` added to `BETA_USERS`** (`src/middleware/auth.js`). Honwai's 403 was the beta allowlist, not the 401 issue. Full `BETA_USERS`: skholkhojaev, osahin, narcis, ramuntea, rbogos, sghimpos, nateekar, aur, hwong.
- Backend branch `milo-world-dashboard` was merged with origin/main (squash-merge of #27/#28 caused a conflict that's now resolved). Full suite green: **24 suites / 371 tests**. `/security-review` on the auth change was clean.

### Frontend — `milo` block (PUSHED to branch, LIVE via `?ref=`, NOT merged to main)
Commits on `milo-world-dashboard` (newest first): `3d7f30368 … 7afce779f` + earlier `7205f5cfb`.
- **clientId from token** (`api.js` `tokenClientId`): derive `clientId` from the JWT's `client_id` (so DA's `darkalley` token validates) instead of `getConfig().imsClientId`. Explicit `clientid` config row still wins. **This is what fixed the original 401.**
- **Default backend = prod** (`api.js` `defaultBase`): localhost in dev, otherwise `https://milo-core-prod.adobe.io`. (Milo's env maps `.aem.page`/`.aem.live` to "stage", but Okan wanted prod data everywhere; an `api` config row still overrides. Avoids needing to edit the SharePoint page.)
- **Progressive per-panel rendering** (`milo-dashboard.js`): was `await Promise.all([6 calls])` in one try/catch — nothing showed until the slowest finished and any single failure blanked the whole grid. Now each panel renders as its own data arrives; a failed endpoint shows a per-panel error; the top-level "check sign-in/access" error only appears if EVERY panel fails. (Okan asked for non-blocking rendering.)
- **DA-native design** (`milo-dashboard.css`): researched DA's real Spectrum 2 tokens (`da.live/nx/styles/nexter.css`). Added a **24px gutter** + DA **`#F5F5F5` canvas** with flat white cards (DA injects zero app padding — the app owns its gutter). Aligned ink/line/semantic colors + radii to DA's resolved light-mode values; replaced box-shadows with DA's flat border style. Values hardcoded (cross-origin iframe — DA `:root` tokens out of scope). Accent `#3b63fb` already == DA `--s2-blue-900`.
- All frontend tests pass (api 15, dashboard 15 incl. a progressive partial-failure test); eslint + stylelint clean.

---

## 4. Current branch / PR / repo state (exact)

| Repo | Branch | Origin | PR | Deployed? |
|---|---|---|---|---|
| milo-logs-deploy | `milo-world-dashboard` | pushed, == origin | #27 MERGED, #28 MERGED | ✅ stage+prod (auto) |
| milo | `milo-world-dashboard` | pushed, == origin (`3d7f30368`) | **NOT opened** | live via `?ref=` only |

- Git prefs (memory `git_prefs.md`): no `Co-Authored-By` trailer; all git commands pre-approved **except `git push`** (ask first). In `milo-logs-deploy` repo CLAUDE rules also restrict to `git add/commit/push` only — other git + non-git shell needs explicit OK.
- milo PRs base = `stage`; milo-logs-deploy base = `main` (= prod deploy).
- GHES: prefix `gh` with `GH_HOST=git.corp.adobe.com`.

---

## 5. Key facts that bit us / must not be relearned

- **clientId must equal the token's `client_id`** or milo-core's IMS `validate_token` rejects it (401 "Invalid token"). DA token's client = `darkalley`. (This was the long-standing §4 auth mystery in the old handoff.)
- **Milo content is SharePoint, not DA** — can't push the `/tools/milo-core/vitals` page or an `api` row programmatically. Backend default is code-side instead.
- **DA injects no padding**; iframe is `padding:0`. App must self-style. Tokens live in `da.live/nx/styles/nexter.css` but are out of scope cross-origin → hardcode resolved light-mode values.
- **`pool max: 1`** in milo-logs-deploy is intentional (per its CLAUDE.md) — it serializes all queries, the real cause of steady ~3s latency. Don't change without Okan.
- **DB cold-start**: Aurora scales to zero when idle; first request after idle can take ~30s. Normal.
- Bundled echarts has **no gauge** — health "gauge" is a pie/doughnut ring; don't reintroduce `type:'gauge'`.
- Postgres `numeric` comes back as **strings** — `Number()` before formatting.
- `curl`/`head` not on PATH in the Bash tool — use `python3` for HTTP probes.

---

## 6. Open / next (Okan's feedback list, prioritized)

Sourced from the Okan DM (`D082FNY20M7`). Nothing is urgent.

**Dashboard features (deferred, "good-to-haves"):**
- **Prev/next period navigation** buttons.
- **Publishes-per-month per-consumer chart** (spot anomalies).
- **RUM / Adobe Analytics traffic** data (traffic panel is a stub today).
- Consumer toggle limited to **T1 projects** (CC, DC, Express, Bacom, Blog, Bacom-blog) — already partly done.

**Backend / data quality:**
- **Make `POST /preflight-logs` unauthenticated** so we stop dropping logs (lots of 401s; dashboard shows far fewer preflight logs than publishes). Okan's guardrails: strict property validation, strict sanitization (injection-proof), daily write cap (~10k). DB cost is a non-issue.
- **`pool max: 1`** serialization — raise with Okan if deeper perf is wanted.
- Okan's own roadmap: onboard ~130 more consumers to the DB; single-container log indexing.

**Housekeeping:**
- **Open the milo block PR** (base `stage`) so the dashboard works without `?ref=` once merged to main.
- Decide whether to **broaden `BETA_USERS`** (any `@adobe.com`, or a group) so new viewers don't each need a code change + prod deploy.
- Confirm Honwai's access works fully post-deploy (he was retesting mid-rollout; user later said the new look renders).

---

## 7. How to run / test locally

**Demo page (mock data, no backend, no auth) — easiest:**
```bash
cd /Users/skholkhojaev/Repos/milo
python3 -m http.server 3000
# open http://localhost:3000/libs/blocks/milo-dashboard/demo/index.html
```
Mocks `fetch` in-browser; charts use real echarts. Hard-refresh (Cmd+Shift+R) after edits; module/CSS cache is sticky.

**Real backend (needs DB env vars from milologs vault):**
```bash
cd /Users/skholkhojaev/Repos/milo-logs-deploy
npm run start:dev   # LOCAL=true in .env bypasses IMS auth; serves :8080
# /ping → {"status":"ok"}
```

**Before/after visual compare of a CSS change** (puppeteer or just swap):
```bash
CSS=libs/blocks/milo-dashboard/milo-dashboard.css
cp $CSS /tmp/after.css
git show HEAD~1:$CSS > $CSS   # see BEFORE, hard-refresh demo
cp /tmp/after.css $CSS        # restore AFTER
```

**Tests / lint:**
```bash
# milo
npm run test:file -- test/blocks/milo-dashboard/api.test.js
npm run test:file -- test/blocks/milo-dashboard/milo-dashboard.test.js
npx eslint libs/blocks/milo-dashboard/*.js
npx stylelint libs/blocks/milo-dashboard/milo-dashboard.css
# milo-logs-deploy
npm test
```

---

## 8. Key references

- Block: `milo/libs/blocks/milo-dashboard/` — start with `milo-dashboard.js` (orchestration), `api.js` (data client + auth/clientId/base), `charts.js`, `panels/*`, `milo-dashboard.css`, `demo/index.html`, `README.md`.
- Backend auth: `milo-logs-deploy/src/middleware/auth.js` (BETA_USERS, requireAuth cache). Routes: `src/routes/getTrends.js` (overview/trends/projects/totals), `src/routes/searchPages.js` (getTestPages), `src/mcp/server.js`.
- Helper script (local burst auth proof): `milo-logs-deploy/scripts/auth-burst-check.mjs`.
- Design tokens (DA): `https://da.live/nx/styles/nexter.css` (Spectrum 2 `--s2-*`), `https://da.live/nx/utils/sdk.js` (messaging only, no CSS).
- Live: `https://milo-core-prod.adobe.io` + `https://milo-core-stage.adobe.io` (`/ping` public, rest need auth).
- DA app: `https://da.live/app/adobecom/milo/tools/milo-core/vitals?ref=milo-world-dashboard`.
- Slack: Okan DM `D082FNY20M7`, Honwai DM `D09L68NJ2GH` (workspace `slack-mwp`; use real account, never the bot).
- Prior docs: `2026-05-29-milo-world-dashboard-design.md`, `…-milo-world-dashboard.md` (impl plan), `2026-06-02-da-hosting-handoff.md` (now superseded).
- Memory: `milo_world_dashboard.md`, `milo_dashboard_okan_feedback.md`, `git_prefs.md`, `user_role.md`.
