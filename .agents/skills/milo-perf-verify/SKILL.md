---
name: milo-perf-verify
description: >
  Before/after performance check for ANY Milo PR: does the change add CLS on mobile, tablet or
  desktop, add network requests before LCP, add TBT, or change what starts a request (initiator
  stacks) or what runs inside long tasks? Interleaves cold loads of the same page on the base
  and the PR under Lighthouse-style throttling, then writes a GitHub-ready report.md with a
  PASS / WATCH / REGRESSION verdict. Use for "perf check this PR", "did we add CLS", "any new
  requests before LCP", "does this add TBT", "milo-perf-verify", or as the perf gate of a review.
  Pair with milo-local-testpage when no page exercises the change, and with milo-perf-short
  to film the result.
---

# Milo performance verification

Every Milo PR changes code that runs on many consumer sites, so every PR should answer four
questions before it merges:

1. **CLS:** does the page shift more, on mobile, tablet or desktop, during load or while scrolling?
2. **Requests before LCP:** is anything new fetched before the largest paint, which competes with it?
3. **TBT:** is there more main-thread blocking (tasks over 50 ms after FCP)?
4. **Code paths ("stack traces"):** for the requests both sides make, did the JS stack that
   starts them change? Did any script's share of the long tasks change?

`perf.mjs` answers all four by comparing **the same page, measured the same way**, before and
after the change. It never scores a page against an absolute budget. Lab numbers on a laptop are
only meaningful as a delta.

## Step 1: pick a page that runs the changed code

The check is worthless when the page doesn't load what the PR changed. **Verify this first.**
The changed block's JS and CSS must appear in the request list (`runs.json` → `requests[].norm`).
Look for `{milo}/libs/blocks/<block>/` or `{milo}/libs/c2/blocks/<block>/`.

Sources, in order:

- The PR body's test URLs. Prefer `.aem.live` over `.aem.page`: `.page` hosts usually answer 401
  without a login cookie, and the harness has none.
- A nala spec for the block (`nala/blocks/<block>/*.spec.js` lists its test paths).
- Milo's docs pages: `https://main--milo--adobecom.aem.live/docs/library/blocks/<block>`.
- **None of them loads the block, or the page authors an old block name:** build a local test page
  with the **milo-local-testpage** skill, and measure in local mode (below).

Gotchas seen in practice:

- On a C2 page (`<meta name="foundation" content="c2">`) only names listed in `C2_BLOCKS`
  (`libs/utils/utils.js`) load from `libs/c2/blocks/`. A page that authors `blog-header` when the
  block is `forge-blog-header` loads nothing, silently. A 404 for `<page-dir>/undefined.js` is the tell.
- Add `martech=off` unless martech is what the PR changes. It removes the biggest source of noise.

## Step 2: run it

All commands run from the milo repo root (Playwright comes from milo's `node_modules`).

**Remote mode** (both sides published as branches; the consumer page picks Milo via `?milolibs=`):

```sh
node .agents/skills/milo-perf-verify/perf.mjs \
  --page "https://main--da-bacom--adobecom.aem.live/some/page" \
  --milolibs-before stage --milolibs-after <pr-branch> \
  --label-before stage --label-after "PR #NNNN" \
  --out tmp/perf/prNNNN
```

`--milolibs-*` takes a branch on adobecom/milo, or `branch--milo--<owner>` for a fork. The
consumer's head script turns it into `https://<branch>--milo--adobecom.aem.live/libs`.

**Local mode** (a local test page, or an unpushed change). Use one worktree per side, each
serving the same page from its own port:

```sh
git worktree add --detach ../milo-before <base-branch>
git worktree add --detach ../milo-after  <pr-branch>
# same test page in both: tmp/ is gitignored and aem up serves it raw
(cd ../milo-before && npx aem up --port=6471 --no-open --livereload=false) &
(cd ../milo-after  && npx aem up --port=6472 --no-open --livereload=false) &
node .agents/skills/milo-perf-verify/perf.mjs \
  --before "http://localhost:6471/tmp/perf/<page>.html?martech=off" \
  --after  "http://localhost:6472/tmp/perf/<page>.html?martech=off" \
  --block geo2.adobe.com --out tmp/perf/prNNNN
```

For a consumer page with `?milolibs=local`, pass `--page <url> --local-before-port 6471
--local-after-port 6472`. Both sides then ask for `localhost:6456`, and each side's requests to it
are routed to its own port. Both sides go through the same interception.

**Never compare a remote side with a local side.** CDN and localhost latency differ by more than
any change you're looking for.

Options:

| Option | Default | Use |
|---|---|---|
| `--runs` | 5 | Cold loads per side per viewport. Raise to 9 when a delta sits near the noise. |
| `--warmup` | 1 | Discarded loads per side first, so CDN and disk caches are warm on both sides. |
| `--viewports` | `mobile,tablet,desktop` | Profiles in `lib/profiles.mjs`. |
| `--no-scroll` | scroll on | Skip the scroll-to-bottom pass (lazy sections, sticky elements). |
| `--block` | none | Hosts aborted on BOTH sides. Use it for a third party that hangs from your network (`geo2.adobe.com` times out after about 5 s off VPN and gates FCP). Say so in the writeup. |
| `--federal` | `same-origin` | Federal content (`getFederatedContentRoot`: gnav, icons, footers) comes from `main--federal--adobecom.aem.*` on localhost and `*.aem.*`, but from the page's own origin on production (`www.adobe.com/federal/...`). By default each federal URL is fetched once and replayed under the same throttle, with no extra connection, so a change that starts loading federal content isn't charged a cross-origin cost production never pays. Use `as-is` to measure the preview hosts; the report says which mode ran. |
| `--rerender <dir>` | | Rebuild report.md/json from a saved `runs.json` without measuring. |
| `PERF_SAVE_TRACE=<prefix>` | | Env var: keep every Chrome trace (open it in DevTools → Performance). |

A full run is about 36 loads and takes 8–12 minutes. Start it in the background and keep working.

## What it measures

| Profile | Viewport | CPU | Network |
|---|---|---|---|
| mobile | 412×915 @2x, touch, Android UA | 4× | 1.6 Mbps, 150 ms RTT (Lighthouse mobile) |
| tablet | 820×1180 @2x, touch | 2× | 10 Mbps, 40 ms |
| desktop | 1440×900 @1x | 1× | 10 Mbps, 40 ms (Lighthouse desktop) |

Each load uses a fresh browser context with service workers blocked:

- In-page `PerformanceObserver`s (installed before any page script) record LCP with its element,
  layout shifts with their source elements and rects, FCP, and `longtask` entries.
- CDP `Network.*` records every request with its start time on the page clock and its
  **initiator stack**.
- A Chrome trace (`devtools.timeline`) gives the main-thread tasks. Each long task is attributed
  to the functions (`fn @ file`) and rendering steps (Layout, style recalc and so on) inside it.

The load window ends when the network has been quiet for 2 s, and at least 4.5 s after navigation,
so Milo's delayed phase (`libs/scripts/delayed.js`, about 3 s after LCP) is inside it. Then the page
is scrolled to the bottom and shifts are collected again ("with scroll").

Definitions:

- **CLS**: the web-vitals session-window score (gaps under 1 s, windows up to 5 s), ignoring shifts
  after input.
- **TBT**: the sum over long tasks of (time after FCP − 50 ms), within FCP and the end of the load window.
- **Before LCP**: the request started before the final LCP entry's `startTime`.

URLs are compared with the side's Milo origin as `{milo}` and the page origin as `{site}`. Cache
busters and `milolibs`/`martech` are dropped. Stacks compare the top three frames as
`function@url`, without line numbers, so a line shift alone isn't a change.

## Step 3: read the verdict

| Finding | Rule | Level |
|---|---|---|
| CLS (load or with scroll) rose | Δ median > max(0.01, IQR) | regression |
| TBT rose | Δ median > max(30 ms, 10 % of before, IQR) | regression |
| New request before LCP | in ≥ half the after loads, < half the before loads | regression |
| LCP rose | Δ median > max(100 ms, 5 %, IQR) | watch |
| LCP element changed | most common element differs | watch |
| Renamed or moved file | same type, same file name, or same JS initiator and size ±5 % | info, not a new request |

Under the verdict table, **Suggested fixes** names the likely cause from the evidence alone:

- **LCP waits on X**: a new request started by code (it has a JS stack), finishing within 120 ms of LCP
  in at least half the loads. It names the block and the outermost block function that started it.
  Usually it means `init` awaits something LCP doesn't need, such as an icon or a config. Render first and
  let it fill in, with its box reserved.
- **Block adds N requests LCP doesn't wait on**: move them later (`await import()` on demand, after LCP,
  `delayed.js`).
- **Preconnect**: only ever for new cross-origin hosts. Federal hosts under `--federal as-is` are called
  out as same-origin on production, so a preconnect won't help there.
- **CLS / TBT**: the top new shift source or the script whose long-task time grew.

Requests that were already made and are only before LCP now, because LCP moved later, are effects, not
causes, so they never produce a suggestion. These are hints to check against the code, not findings.

Then work through the report:

- **New before LCP**: each entry names the stack that started it. The fix is usually to import it
  on demand (`await import()` on the interaction), move it to `delayed.js`, or lazy-load it
  (`loading="lazy"`, IntersectionObserver).
- **No longer before LCP / "still requested, but after LCP now"**: an improvement. Say so in the PR.
- **Initiator stacks changed**: the same URL is now started by different code. It's expected when
  the PR refactors that path; otherwise it's a hint the change reaches further than intended.
- **Long-task work that changed**: per-script milliseconds inside long tasks, averaged per load.
  This is what to look at when TBT moves.
- **Layout-shift sources**: the elements that moved, by phase. For a new source, check reserved
  space (`aspect-ratio`, `min-height`), font swaps, and content inserted above the fold after load.

A regression the PR intends (a new above-the-fold image that is the LCP, say) is fine. Name it in
the PR rather than leaving it to be discovered.

## Step 4: review → fix → re-measure

When the PR gets a fix for a finding, measure the fix head against the same base with the same flags as
the run that found it (page, `--block`, `--federal`, viewports), then compare the two reports:

```sh
# was: base vs the reviewed head; now: base vs the fix head (re-point the after worktree to the fix)
node .agents/skills/milo-perf-verify/fixcheck.mjs --was tmp/perf/prNNNN-<head> --now tmp/perf/prNNNN-<fix> \
  --label-was <head> --label-now <fix> [--direct tmp/perf/prNNNN-head-vs-fix]
```

It writes `fixcheck.md` and `fixcheck.json` into the `--now` folder (or `--out`). For each viewport and
metric it says whether the finding is **resolved** (within noise now, the same limit `judge` uses),
**partly** resolved (smaller but still beyond noise), **persists**, or is **new**. For each new
pre-LCP request it gives the same outcome, adding "now after LCP" or "no longer new". The overall
outcome is effective, effective with new findings, partly effective, not effective, or nothing to fix.

It refuses two reports that differ in federal mode, blocked hosts, page path or profiles; exit 2 means
they are not comparable. `--direct` adds an optional head-vs-fix run, shown as its own row. Exit 1 means
not effective or partly effective, otherwise exit 0. Post `fixcheck.md` as a reply to the review comment
that raised the finding.

## Step 5: post it

`report.md` is written to be pasted as a PR comment:

```sh
gh pr comment <N> -R adobecom/milo --body-file tmp/perf/prNNNN/report.md
```

Lead with one plain sentence of your own above it: what changed, at which viewports, and why.
Disclose any `--block` hosts, local mode, and a test page you built (link it or attach the HTML).
To film the result, run **milo-perf-short** on the same output folder.

## Files

- `perf.mjs`: the CLI (interleaving, warm-ups, output).
- `lib/profiles.mjs`: device profiles, throttling, the local-libs route.
- `lib/measure.mjs`: one cold load (observers, CDP network, trace, long-task attribution).
- `lib/report.mjs`: the comparison, the verdict, report.md and the suggested fixes.
- `fixcheck.mjs`, `lib/fixcheck.mjs`: the review → fix → re-measure comparison.
- Output: `runs.json` (every load, raw), `report.json` (comparison), `report.md` (writeup).
