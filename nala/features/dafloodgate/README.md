# Floodgate for DA — Nala E2E Tests

End-to-end Playwright tests for the **Floodgate for DA** tool (`MWPW-189268`).
Tests run against `da.live` with the `da-floodgate` branch.

> **Tag**: All tests carry `@nopr` and are skipped by the default PR workflow
> (`run-nala-default.yml`). Run them locally or in a manual job.

---

## Prerequisites

- Node 20+
- Adobe SSO test account with **full access** to the `adobecom/da-events` repo
- Floodgate config at `/{org}/{repo}/.milo/floodgate/config.json` listing your
  account in `allAccessUsers` and at least one color (e.g. `pink`)

---

## Quick Start

```bash
# Install (only first time on this repo)
npm ci
npx playwright install

# 1. Log in to DA (one time — saves auth.json which is gitignored)
node nala/utils/da-login.js

# 2. Seed real event content into the test sandbox (one time, or after teardown)
node nala/features/dafloodgate/seed-real-content.js seed

# 3. Verify the sandbox has the expected files
node nala/features/dafloodgate/setup-test-data.js

# 4. Run tests
npx playwright test nala/features/dafloodgate/ \
  --project=milo-live-chromium --workers=1 --grep "@smoke"
```

---

## Run Tests

> Always use `--workers=1`. Tests share state in the FG repo and parallel
> workers race each other.

```bash
# Smoke (~2 min, 10 tests)
npx playwright test nala/features/dafloodgate/ \
  --project=milo-live-chromium --workers=1 --grep "@smoke"

# All copy tests (~4 min, 20 tests)
npx playwright test nala/features/dafloodgate/ \
  --project=milo-live-chromium --workers=1 --grep "@fg-copy"

# Full suite (~7 min, 51 tests)
npx playwright test nala/features/dafloodgate/ \
  --project=milo-live-chromium --workers=1

# Headed (watch the browser)
npx playwright test nala/features/dafloodgate/ \
  --project=milo-live-chromium --workers=1 --headed --grep "@smoke"
```

---

## Test Tags

| Tag | What |
|-----|------|
| `@smoke` | 10 must-pass tests covering the happy path |
| `@regression` | Full regression set (~37 tests) |
| `@floodgate` | All Floodgate-DA tests |
| `@nopr` | Excluded from PR auto-runs (set on every test in this directory) |
| `@fg-copy-*` | Copy workflow tests |
| `@fg-promote-*` | Promote workflow tests |
| `@fg-delete-*` | Delete workflow tests |
| `@fg-e2e-chain-*` | Full Copy → Promote → Delete chain |

---

## Files

| File | Purpose |
|------|---------|
| `floodgate.page.js` | Page Object Model with iframe + shadow DOM helpers |
| `floodgate.spec.js` | Test case definitions (51 cases) |
| `floodgate.test.js` | Playwright test implementations |
| `seed-real-content.js` | Seeds 5 real event pages + fragments into the sandbox |
| `setup-test-data.js` | Verifies sandbox state |

Auth artefact (gitignored, generated locally):
- `nala/utils/auth.json` — Playwright `storageState` from `da-login.js`

---

## Test Sandbox

Tests run against:

- **Source repo**: `/adobecom/da-events/drafts/nala-fg-test/`
- **Floodgate repo**: `/adobecom/da-events-fg-pink/drafts/nala-fg-test/`
- **Tool URL**: `https://da.live/#/adobecom/da-events/tools/floodgate?ref=da-floodgate`

The seeder populates this content (run-once or after `cleanup`):

```
drafts/nala-fg-test/
├── test1-single-block.html, test2-multiple-blocks.html, ...
├── google.link, test1.png, test2.png
├── assets/001.png
├── fragments/test-fragment-1.html
├── _fragments/...                 (static-href referenced fragments)
└── events/
    ├── summit-london.html, summit-munich.html, ...
    ├── creative-cafe-ny.html, creator-live-london.html, events-hub.html
    └── fragments/2026-XX-XX/      (date-based fragments loaded by chrono-box)
```

---

## Common Tasks

### Reset the sandbox

```bash
node nala/features/dafloodgate/seed-real-content.js cleanup   # remove seeded events
node nala/features/dafloodgate/seed-real-content.js seed      # repopulate
```

### Re-login (when auth.json expires, ~24h)

```bash
node nala/utils/da-login.js
```

### Point tests at a different repo

```bash
FG_ORG=adobecom FG_REPO=da-events FG_REF=da-floodgate FG_COLOR=pink \
  npx playwright test nala/features/dafloodgate/ \
  --project=milo-live-chromium --workers=1 --grep "@smoke"
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| All tests fail with `401` | `auth.json` expired → run `node nala/utils/da-login.js` |
| `Find Files` button stays disabled | Sandbox missing files → run `seed` |
| Delete test fails with "element not enabled" | Prior delete cleared the file → re-run `seed` or use `--workers=1` |
| iframe not found | da.live UI changed → check `floodgate.page.js` `initFrame()` |
| Locator times out | UI structure changed → check selector against shadow DOM |

---

## Notes

- **Auth.json is gitignored** — every contributor runs `da-login.js` locally.
- **Safe sandbox**: All operations target `/drafts/nala-fg-test/`. Drafts are
  staging-only — they don't get published to production by design — so the
  Copy / Promote / Delete tests are safe to run repeatedly.
- **CI**: `@nopr` tag keeps these out of `run-nala-default.yml`. Run manually.

Owner: Jacky Sun · JIRA: `MWPW-189268`
