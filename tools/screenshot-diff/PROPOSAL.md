# Screenshot Diff Tool — Status & Proposal

**Status:** Production-ready PoC, running on 6-Mac-Mini self-hosted pool, 7 sites onboarded
**Owner:** Jacky Sun ([xiasun@adobe.com](mailto:xiasun@adobe.com))
**Last updated:** 2026-05-20

## TL;DR

A self-service visual regression tool for verifying that **milo PRs don't
visually break downstream sites** (BACOM, CC, DC, Express, Homepage,
bacom-blog) plus graybox PoC publish parity. Backed by:

- **6 self-hosted Mac Mini runners** in the SJ datacenter
  (sj1010122072225/226/231/234/235/236)
- **Internal S3** for artifacts (s3-sj3.corp.adobe.com/milo)
- **Existing nala-auto viewer** ([http://nala-auto.corp.adobe.com/imagediff/&lt;site&gt;](http://nala-auto.corp.adobe.com/imagediff/bacom))
  for human review — zero new UI built
- **GitHub Actions workflows** in `JackySun9/milo` fork on the
  `screenshot-diff-tool` branch ([pending upstream PR](https://github.com/JackySun9/milo/tree/screenshot-diff-tool))

Triggering 7 sites end-to-end takes **~29 minutes** (small sites finish in 3–7 min,
BACOM tail at ~29 min) — well within "review before merging the PR" budget.

## What works today

```
                                     ┌──────────────────────────────────┐
   gh workflow run screenshot-       │  Mac Mini pool (6 runners)       │
   diff-nala-parallel \              │  labels: self-hosted macOS       │
     -f site=bacom                   │          screendiff               │
                ↓                    │  • SJ corp network               │
   GitHub Actions dispatch           │  • can reach internal S3 ✓       │
                ↓                    │  • Chromium-only browser         │
   ┌──────────────────────────┐      └──────────────────────────────────┘
   │  capture-chrome  ─┐      │                  ↑
   │  capture-ipad    ─┤───── │  matrix job → 1 runner per viewport
   │  capture-iphone  ─┘      │                  │
   │  (iphone bundles merge)  │                  │
   └──────────────────────────┘                  │
                ↓ uploads PNGs + results-<viewport>.json
   ┌──────────────────────────┐                  │
   │  Internal S3             │  ← writes shards  ┘
   │  s3-sj3.corp.adobe.com/  │  (3 viewports × 1 site = 3 shards)
   │  milo/screenshots/<site>/│
   └──────────────────────────┘
                ↑ reads, merges, re-uploads results.json
                │
   iphone capture job's "merge" step:
     • polls nala-auto proxy for chrome + ipad shards
     • runs lib/merge.js locally
     • uploads consolidated results.json
                ↓
   ┌──────────────────────────────────────────────┐
   │  nala-auto.corp.adobe.com/imagediff/<site>   │
   │  (existing internal viewer)                  │
   │  - reads /api/milo/screenshots/<site>/       │
   │  - shows side-by-side + diff highlights      │
   └──────────────────────────────────────────────┘
```

## Sites onboarded (7)

| Site | URLs | Mode | Comparison |
|---|---|---|---|
| **bacom** | 62 | milolibs | aem.live URL vs URL + `?milolibs=stage` (main vs stage milo, BACOM-native) |
| **bacom-blog** | 18 | milolibs | same pattern, aem.live URLs |
| **cc** | 14 | milolibs | stage URL (loads main milo via self-hosted mirror) vs URL + `?milolibs=stage` |
| **dc** | 6 | milolibs | same pattern |
| **express** | 12 | milolibs | same pattern |
| **homepage** | 9 | milolibs (scroll wait) | same pattern, plus scroll dance for lazy hydration |
| **graybox-poc** | 10 | a/b pair (scroll wait) | aem.reviews preview vs business-graybox publish (env compare, not milo version) |

**Total: 131 URLs × 3 viewports × 2 captures = 786 screenshots per full run.**

Data files live in `milo/nala/features/visual/sot.<site>.yml`. Adding a new
site = drop a new yml file (no code change). yaml supports two formats:

```yaml
# milolibs mode (one URL, B = URL + MILO_LIBS):
'CreativeCloud': 'https://www.stage.adobe.com/creativecloud.html'

# Explicit a/b pair (for graybox / cross-env comparisons):
'pocone-customer-success-stories':
  a: 'https://dapocone--main--da-bacom--adobecom.aem.reviews/customer-success-stories/customer-success-stories'
  b: 'https://dapocone.business-graybox.adobe.com/customer-success-stories/customer-success-stories.html'
```

Per-site config block:
```yaml
__config__:
  waitStrategy: scroll   # 'footer' (default) or 'scroll' (for Intersection-Observer-heavy pages)
```

## Performance (last full 7-site run, large→small order)

| Site | Run time | Notes |
|---|---|---|
| bacom        | 14:46 | Triggered first → grabbed 3 runners immediately |
| bacom-blog   | 7:38  | Cascade |
| cc           | 14:53 | |
| express      | 16:30 | |
| graybox-poc  | 17:12 | scroll wait adds time |
| homepage     | 23:40 | scroll wait + last triggered |
| dc           | ~4:00 | |
| **Total wall** | **~24 min** | (constrained by homepage tail) |

In **small→large order** (what we recommend for team UX):

| Site | Run time | Notes |
|---|---|---|
| dc           | 3:12  | DC team can review **3 min after trigger** |
| graybox-poc  | 6:15  | |
| homepage     | 7:45  | |
| express      | 10:57 | |
| cc           | 14:59 | |
| bacom-blog   | 16:02 | |
| bacom        | 29:39 | Last to finish, but BACOM team is used to ~13 min cycles anyway |
| **Total wall** | **~29 min** | |

The 5-min trade-off (24 → 29) is worth it: **each downstream team gets feedback as soon as their site is done**, not waiting for the slowest site in the batch.

## Diff quality

Real numbers comparing the pre-optimization baseline to current state:

| Site | Before opt | After opt | Change |
|---|---|---|---|
| **homepage**    | 24/27 = 89% | **1/27 = 4%** | **🎉 −85 pts** (cookie/storage reset killed personalization noise) |
| **bacom**       | 47/186 = 25% | 28/189 = 15% | −10 pts |
| **bacom-blog**  | 22/54 = 41%  | 18/54 = 33% | −8 pts (mobile still high — content really varies) |
| express       | 9/36 = 25%   | 10/36 = 28% | flat |
| cc            | 8/42 = 19%   | 8/42 = 19%  | flat |
| dc            | 10/18 = 56%  | 12/18 = 67% | flat (high % is real — content drift) |
| graybox-poc   | 16/30 = 53%  | 17/30 = 57% | flat (high % is expected — env compare) |
| **Total**     | **136/393 = 35%** | **94/396 = 24%** | **−11 pts overall** |

## Architecture decisions

### D1. Milo `tools/` over DA, scripts in milo's `nala/` folder

We host data + driver in `adobecom/milo/nala/features/visual/`, matching milo's
existing nala convention. Shared screenshot lib lives in
`tools/screenshot-diff/lib/` (engine code).

### D2. Internal S3 only; dropped public S3 path entirely

`s3-sj3.corp.adobe.com/milo/` for all artifacts. Removed the public-S3 / STS
code path (~150 LOC). User-facing reads go through
`nala-auto.corp.adobe.com/api/milo/*` (existing proxy).

### D3. Self-hosted Mac Mini pool

6 Macs registered as repo-level runners on `JackySun9/milo`:

| Host | Status | Notes |
|---|---|---|
| sj1010122072225 | online | added later |
| sj1010122072226 | online | added later |
| sj1010122072231 | online | added later |
| sj1010122072234 | online | replaces unreachable .233 |
| sj1010122072235 | online | original |
| sj1010122072236 | online | original; also runs other Jenkins worker (coexist OK) |

All 6 have `LaunchAgent` with `KeepAlive: true` (auto-restart if killed,
fixes the stuck-busy bug from earlier setup).

### D4. Chromium-only viewports, not WebKit

iPhone / iPad emulation via Playwright's `devices['iPhone X']` /
`devices['iPad Mini']` device presets, but launched on **Chromium**. BACOM
has done this for 1+ year in production without missing real Safari bugs.
Saves the WebKit engine startup + per-capture overhead. Also halves the
Playwright browser download (~150 MB saved).

### D5. Yaml-driven config, two URL modes

- **String value** → milolibs mode: `A = URL`, `B = URL + ?milolibs=stage`
  (smart `?` vs `&` joining for URLs that already have query strings)
- **Object `{ a, b }`** → explicit pair: full URLs for both sides
- **`__config__.waitStrategy`** → `footer` (default) or `scroll`

### D6. 3-shard matrix (chrome, ipad, iphone)

Each site = 3 capture jobs. With 6 runners, up to 2 sites run concurrently.

We tried 4-shard (splitting iphone into halves) — total wall time went UP
because each site occupied 4 runners, only 1.5 sites concurrent in our
6-runner pool. Reverted.

### D7. Bundled merge inside iphone capture (no separate merge job)

Original design had a `merge` job with `needs: capture`. With 6 runners and
7 sites, that produced 21 capture + 7 merge = 28 queued jobs; merges piled
up behind captures. Observed dc-merge wait: 15 minutes.

Fix: iphone capture (always the slowest viewport) bundles the merge as
inline steps:
1. Capture iphone shard, upload to S3
2. Poll nala-auto for chrome + ipad shards (5 s × 60 tries)
3. Run `lib/merge.js` locally to consolidate
4. Upload merged `results.json` + `timestamp.json`

Removes 7 jobs from the queue per 7-site batch.

### D8. Quality optimizations (5 stacked)

| | Where | Effect |
|---|---|---|
| Comparator threshold + maxDiffPixelRatio | `lib/utils.js`, `lib/compare.mjs`, `sot.run.js` | Suppress per-pixel anti-aliasing noise (matches nala's `visual.config.js` tolerance) |
| `reducedMotion: 'reduce'` browser context | `sot.run.js` | Stop CSS animations / carousel frame races |
| `waitStrategy: scroll` (opt-in per site yaml) | `sot.run.js` | Trigger Intersection-Observer lazy load → no loading-spinner captures |
| Reset cookies + localStorage between A and B | `take.js` (new `beforeBeta` hook) + `sot.run.js` | Server-side personalization doesn't carry over → kills homepage's 89% false-positive rate |
| Smart `?` vs `&` join | `sot.run.js` (`appendQuery`) | URLs like `?mep=off` get `&milolibs=stage` not `?...?milolibs=stage` |

## Operational gotchas (learned the hard way)

### G1. Mac Mini sleep

`.233` went offline mid-week. Confirmed asleep (no ping, no SSH). For
production stability, all Macs need `sudo pmset -a sleep 0 disksleep 0 womp 1`
to prevent system sleep. Done on new Macs; pending on `.235` / `.236`.

### G2. Self-hosted runner "stuck busy"

If Runner.Worker is killed mid-job (SIGKILL), the listener may report
`busy=true` to GH indefinitely. Fix: enable `KeepAlive: true` in the
LaunchAgent plist so launchd auto-restarts the listener if Worker dies
unexpectedly. All 4 new Macs have this; .235/.236 don't yet.

### G3. milolibs param has surprising semantics

- `URL + ?milolibs=stage` → loads `https://stage--milo--adobecom.aem.live/libs/*` ✓
- `URL + ?milolibs=main` → loads default self-hosted libs (no-op on stage hosts)
- `URL` (no param) → loads self-hosted libs (which mirror **stage** milo on
  `www.stage.adobe.com` — confirmed via `last-modified` headers)
- On `www.adobe.com` (prod): milolibs param is **ignored entirely** by
  `setLibs` (the `.aem./.hlx./.stage.` guard fails). So you can't test stage
  milo on prod URLs.

### G4. GitHub Actions cancel is graceful, not SIGKILL

Canceled jobs run to completion of the current step (e.g., a long `npm ci`)
before honoring the cancel. To force-stop: SSH to runner and `pkill -9 -f
"Runner.Worker"`. With `KeepAlive: true` LaunchAgent, the listener
auto-restarts and GH sees the runner online again.

## What's next

| | Description | Priority |
|---|---|---|
| **PR to upstream** | `JackySun9/milo` → `adobecom/milo` | High (real "standard tool" status) |
| **Auto-trigger** | Run on every milo `stage→main` PR via webhook | Medium |
| **Add 4 more Mac Minis** | 10 runners → 29 min wall drops to ~15 min | Medium |
| **uar-ai site** | Needs different schema (quiz interactions, not URL list) | Low |
| **S3 lifecycle policy** | Auto-delete old runs to control bucket size | Low |
| **Mac Mini ops doc** | Sleep prevention, KeepAlive, registration steps | Medium |

## How to evaluate

```bash
# 1. Trigger a single site
gh workflow run screenshot-diff-nala-parallel.yml \
  --repo JackySun9/milo --ref screenshot-diff-tool \
  -f site=bacom

# 2. Trigger all 7 sites in your preferred order
for site in dc homepage graybox-poc express cc bacom-blog bacom; do
  gh workflow run screenshot-diff-nala-parallel.yml \
    --repo JackySun9/milo --ref screenshot-diff-tool \
    -f site="$site"
  sleep 2
done

# 3. Watch results land
open http://nala-auto.corp.adobe.com/imagediff/bacom
```

Ad-hoc 2-URL diff (no yml needed):
```
gh workflow run screenshot-diff.yml --repo JackySun9/milo --ref screenshot-diff-tool \
  -f url_a=https://main--milo--adobecom.aem.live/ \
  -f url_b=https://main--milo--adobecom.aem.page/ \
  -f project=adhoc
```

## File map

```
milo/
├── .github/workflows/
│   ├── screenshot-diff.yml                ← ad-hoc 2-URL
│   ├── screenshot-diff-nala.yml           ← single-runner sequential (legacy)
│   └── screenshot-diff-nala-parallel.yml  ← MAIN: 3-shard matrix with bundled merge
├── nala/features/visual/
│   ├── sot.bacom.yml                      ← per-site data files
│   ├── sot.bacom-blog.yml
│   ├── sot.cc.yml
│   ├── sot.dc.yml
│   ├── sot.express.yml
│   ├── sot.graybox-poc.yml
│   ├── sot.homepage.yml
│   └── sot.run.js                         ← driver (read yml → capture → diff → upload)
└── tools/screenshot-diff/
    ├── lib/
    │   ├── config.js                      ← env-driven S3 + path config
    │   ├── take.js                        ← Playwright screenshot helpers (with beforeBeta hook)
    │   ├── compare.mjs                    ← pixel diff
    │   ├── merge.js                       ← consolidate results-*.json shards
    │   ├── utils.js                       ← path validation, comparator (lazy-loaded)
    │   ├── upload-s3.js                   ← S3 PUT (parameterized)
    │   ├── upload-one.js                  ← single-file upload (used by merge step)
    │   └── clean-s3.js                    ← interactive cleanup
    ├── run.js                             ← ad-hoc 2-URL driver
    ├── setup-runner.sh                    ← Mac Mini bootstrap
    ├── README.md                          ← user-facing docs
    └── PROPOSAL.md                        ← this file
```

## References

- **Branch (current state)**: [JackySun9/milo @ screenshot-diff-tool](https://github.com/JackySun9/milo/tree/screenshot-diff-tool)
- **Workflow runs**: [Actions tab](https://github.com/JackySun9/milo/actions)
- **Live results viewer**: [nala-auto.corp.adobe.com/imagediff/&lt;site&gt;](http://nala-auto.corp.adobe.com/imagediff/bacom)
- **Source of original code**: [adobecom/nala/libs/screenshot/](https://github.com/adobecom/nala/tree/main/libs/screenshot)
- **Self-hosted runner setup wiki**: [internal](https://wiki.corp.adobe.com/spaces/adobedotcom/pages/3715918184/Set+up+GitHub+Actions+Self-Hosted+Runner)
