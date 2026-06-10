# Screenshot Diff

Visual regression for adobe.com pages. Captures two URLs with Playwright,
computes a pixel diff, and publishes results to internal S3.

## How it works

```
┌─────────────────────────────────┐
│ Milo tool UI (this folder)      │  ← Browser: pick project, view diffs
│ tools/screenshot-diff/index.html│
└─────────────────────────────────┘
              ↑ reads / triggers
              │
┌─────────────────────────────────┐
│ GitHub Actions workflow         │  ← Runs on Mac Mini pool
│ .github/workflows/              │     (self-hosted, macOS, screendiff)
│   screenshot-diff.yml           │
└─────────────────────────────────┘
              ↓ uploads
┌─────────────────────────────────┐
│ Internal S3                     │
│ s3-sj3.corp.adobe.com/milo/     │
│   screenshots/<project>/        │
│     shot-a.png                  │
│     shot-b.png                  │
│     shot-diff.png               │
│     results.json                │
│     timestamp.json              │
└─────────────────────────────────┘
```

The workflow only runs on Adobe corp network — internal S3 is not reachable
from GitHub-hosted runners. The Mac Mini pool is registered as org-level
self-hosted runners with the labels `self-hosted, macOS, screendiff`.

### Mac Mini pool

Three Mac Minis in the SJ datacenter back the runner pool:

| Host | Suggested runner name |
|---|---|
| `sj1010122072233.corp.adobe.com` | `mac-mini-233` |
| `sj1010122072235.corp.adobe.com` | `mac-mini-235` |
| `sj1010122072236.corp.adobe.com` | `mac-mini-236` |

To register a new Mac as a runner, SCP `setup-runner.sh` to the host and run:

```bash
# On your laptop:
scp tools/screenshot-diff/setup-runner.sh sj1010122072233.corp.adobe.com:~/

# On the Mac Mini (after grabbing a registration token from GitHub):
./setup-runner.sh mac-mini-233 \
  https://github.com/JackySun9/milo \
  <REGISTRATION_TOKEN_FROM_GITHUB>
```

The script installs Node 20 (via Homebrew), the actions-runner agent, and
registers it as a launchd service so it survives reboots. Get the
registration token at:
`https://github.com/<org>/<repo>/settings/actions/runners/new`.

When promoting to org-level (requires `adobecom` org admin), pass the org URL
instead: `https://github.com/adobecom`.

## Triggering a run

### From the Milo tool UI

`https://milo.adobe.com/tools/screenshot-diff/` (after merge to upstream).
For PoC: `https://main--milo--JackySun9.aem.page/tools/screenshot-diff/`.

1. Pick a project
2. Click **Trigger new run on GitHub** — opens the workflow_dispatch page
3. Fill in URL A / URL B and run

### From GitHub directly

[Run screenshot-diff.yml](https://github.com/JackySun9/milo/actions/workflows/screenshot-diff.yml)

### Locally

```bash
cd tools/screenshot-diff
npm install
npx playwright install chromium webkit

URL_A="https://www.adobe.com/" \
URL_B="https://main--milo--adobecom.aem.live/" \
PROJECT=milo \
VIEWPORT=chrome \
S3_ACCESS_KEY_ID=... S3_SECRET_ACCESS_KEY=... \
node run.js
```

Omit `S3_*` vars to skip the upload step (artifacts stay local).

## Required GitHub secrets

Configured at the `adobecom` org level (or repo level on this fork):

| Secret | Purpose |
|---|---|
| `SCREENSHOT_S3_ACCESS_KEY_ID` | S3 write key |
| `SCREENSHOT_S3_SECRET_ACCESS_KEY` | S3 write secret |

Optional repository/org **variables** (not secrets) for overrides:
`SCREENSHOT_S3_REGION`, `SCREENSHOT_S3_ENDPOINT`, `SCREENSHOT_S3_BUCKET`.

## Files

```
tools/screenshot-diff/
├── README.md                  ← this file
├── package.json               ← isolated deps for the tool
├── run.js                     ← driver: env vars in → S3 out
├── setup-runner.sh            ← Mac Mini runner bootstrap
├── index.html, .js, .css      ← Milo tool UI
└── lib/
    ├── config.js              ← env-driven S3 + path config
    ├── take.js                ← Playwright screenshot helpers
    ├── compare.mjs            ← pixel diff w/ baseline fetch
    ├── merge.js               ← merge per-worker results
    ├── utils.js               ← path validation, comparator
    ├── upload-s3.js           ← S3 PUT
    └── clean-s3.js            ← S3 DELETE (interactive, --force opt)
```

## S3 layout

```
milo/                                    (bucket)
└── screenshots/
    └── <project>/                       (e.g. milo, bacom, adhoc)
        ├── shot-a.png                   (URL A capture)
        ├── shot-b.png                   (URL B capture)
        ├── shot-diff.png                (only if pixels differ)
        ├── results.json                 (run metadata)
        └── timestamp.json               (last run wall-clock time)
```

Each new run **overwrites** the previous one for that project. Run history
is kept via GitHub Actions artifact retention (7 days) and any S3 lifecycle
rules configured on the bucket.

## Origin

Adapted from [adobecom/nala/libs/screenshot/](https://github.com/adobecom/nala/tree/main/libs/screenshot).
The Nala version is Playwright-test driven (each visual test calls the
helpers); this version exposes a single-shot driver suitable for ad-hoc use
from the Milo tool UI. Both share the same `take` / `compare` / `upload`
core.

## Migration notes vs. Nala

- `uploads3.js` → `upload-s3.js`, parameterised via `lib/config.js`
- `cleans3.js` → `clean-s3.js`, added `--force` for non-interactive use
- Public-S3 path (`uploads3Public.js`, STS) **dropped** — internal-only
- Env vars normalised: `s3accesskey` → `S3_ACCESS_KEY_ID`,
  `s3secretkey` → `S3_SECRET_ACCESS_KEY`
- `ALLOWED_BASE_DIRECTORY` → configurable via `SCREENSHOT_BASE_DIR`
