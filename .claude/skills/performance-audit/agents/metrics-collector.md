# Metrics Collector

Used by SKILL.md Phases 1 and 2. Launches a Playwright browser, applies the requested throttling profile, navigates to the URL, collects runtime performance metrics (FPS, CPU, GPU, INP, long tasks, animations, resources), and — **on Milo/C2 pages, automatically, in the same navigation** — a per-component-block breakdown (network/GPU/CPU per block, plus LCP/CLS/INP). Returns a single `MetricsBundle`.

**There are exactly two passes total for the whole audit: baseline and throttled.** Per-block attribution is not a separate set of passes — it's additional data collected inside these same two navigations. Never navigate to the target URL a third time to "also" get block-level data; if you find yourself writing a third `page.goto` to the audited URL, stop and fold that measurement into Phase 1 or Phase 2 instead.

## Inputs

- `url` — the page URL to test
- `profile` — `desktop-baseline` or `throttled-desktop` (see `references/throttling-profiles.md` — `throttled-desktop` is CPU 4× **and** network throttle combined, not CPU alone)
- `baselineBlockCount` — `0` for the baseline pass; for the throttled pass, the baseline MetricsBundle's `settledBlockCount` (see Step 2's settle logic for why)

## Procedure

### Step 1 — Reset browser state

**For `throttled-desktop` only:** call `browser_close` first. This clears the baseline browser state so the throttled pass gets a clean page. The baseline pass skips this step — calling `browser_close` with no open browser triggers an unnecessary browser launch/close cycle.

**Never call `browser_navigate` before `browser_run_code`.** `browser_navigate` loads the page once (using `waitUntil: 'load'`, which can take 15–20 s), and then `page.goto()` inside `browser_run_code` loads it a second time — doubling the wait. The correct flow is:

```
desktop-baseline:   browser_run_code       ← receives a fresh blank page; goto() is the only navigation
throttled-desktop:  browser_close          ← resets MCP state, no navigation
                    browser_run_code       ← receives a fresh blank page; goto() is the only navigation
```

Inside `browser_run_code`, use the `page` object directly. Never create new pages (`context.newPage()`) and never close the page — doing either corrupts the MCP's tracked state.

### Step 2 — Single `browser_run_code` call containing all steps

Run the complete script below in one `browser_run_code` call. The script:

1. Sets viewport and CDP; clears cache/cookies (both passes); conditionally applies CPU **+ network** throttle together (`throttled-desktop` only)
2. Injects Web Vitals + long task + RAF observers **and** the LCP/CLS/INP/Long-Animation-Frame observers used for block attribution, before navigation
3. Navigates (`domcontentloaded`)
4. Detects the Milo/EDS block markup (`.section > [class]`) and, if present, starts a CDP trace immediately — before settle, so it covers the whole post-navigation lifecycle, not just scroll
5. Waits 3 s, then adaptively polls block-count/resource-count for stability (cross-pass floor on the throttled pass) — or a flat 7 s wait on non-Milo pages
6. Detects the Milo/C2 block convention (`isMiloSite`/`c2Blocks`)
7. Polls LCP/CLS for stability, then snapshots them — **before** the click-pass or scroll, since scroll does not reliably stop LCP from recording new candidates (see the snapshot comment below for why this matters)
8. Runs a safe synthetic click-pass for INP samples (buttons only, never `<a href>`, modal-opening blocks excluded), then polls the INP-event count for stability
9. Scrolls in viewport-height steps with 2 s pauses, recording per-frame timing — **this is the human-like incremental scroll and must never be replaced with, or followed by, an instant `scrollTo` jump**
10. Polls the resource count for stability, then captures resource timing — after scroll, so scroll-triggered lazy-loaded resources are actually counted
11. Ends the CDP trace right after that same resource-stability poll confirms genuine quiet (a real page-visible signal — `Tracing.dataCollected` does not stream live in this Chrome build, so polling trace-event volume directly is a no-op; see the comment at `Tracing.end` for how this was found)
12. Collects CDP metrics, vitals, long tasks, animation audit, and — if Milo — aggregates the per-block breakdown, and returns the `MetricsBundle`

```javascript
// ── Pre-navigation setup (keep minimal to reduce blank-page wait time) ─────
await page.setViewportSize({ width: 1440, height: 900 });

// throttled-desktop: must apply CPU + network throttle BEFORE navigation so
// they cover JS parsing and the initial document/resource fetches. Baseline
// defers most CDP setup until after goto(), but cache-clearing must happen
// pre-navigation on BOTH passes — the Playwright profile directory persists
// disk cache across separate browser_close cycles within the same session,
// so a page that's been tested earlier today will under-report transfer
// sizes (near-0 KB for anything already cached) unless the cache is cleared
// first. This matters most for the per-block network numbers in
// blockBreakdown, which are only read from the baseline pass.
let cdp = await page.context().newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.clearBrowserCache');
await cdp.send('Network.clearBrowserCookies');
await cdp.send('Page.enable'); // needed for Page.getFrameTree — see CPU-by-file frame filtering below
if ('%%PROFILE%%' === 'throttled-desktop') {
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 400 * 1024 / 8, // 400 Kbps
    uploadThroughput: 400 * 1024 / 8,
    latency: 150, // ms RTT
  });
}

// ── Observer injection (must happen before goto) ───────────────────────────
await page.addInitScript(() => {
  window.__perf = { inp: null, longTasks: [] };
  window.__loaf = [];
  window.__cls = [];
  window.__lcp = null;
  window.__inpEvents = [];

  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      if (!window.__perf.inp || e.duration > window.__perf.inp)
        window.__perf.inp = e.duration;
    }
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 });

  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      window.__perf.longTasks.push({
        durationMs: Math.round(e.duration),
        startMs: Math.round(e.startTime),
      });
    }
  }).observe({ type: 'longtask', buffered: true });

  // Long Animation Frame — used for per-block forced-layout attribution
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__loaf.push({
        startTime: e.startTime,
        duration: e.duration,
        scripts: (e.scripts || []).map(s => ({
          sourceURL: s.sourceURL,
          duration: s.duration,
          forcedStyleAndLayoutDuration: s.forcedStyleAndLayoutDuration,
        })),
      });
    }
  }).observe({ type: 'long-animation-frame', buffered: true });

  // CLS — entry.sources[].node is a live DOM ref, only usable inside the
  // same page.evaluate call that reads window.__cls later.
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      window.__cls.push({ value: entry.value, node: entry.sources?.[0]?.node || null });
    }
  }).observe({ type: 'layout-shift', buffered: true });

  // LCP — take the last entry (the final candidate) when read later.
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    window.__lcp = entries[entries.length - 1];
  }).observe({ type: 'largest-contentful-paint', buffered: true });

  // INP-qualifying discrete interactions (click/keydown/pointerdown, not
  // wheel/scroll) — needs a real interaction to fire; see the synthetic
  // click pass below.
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (['click', 'keydown', 'keyup', 'pointerdown', 'pointerup'].includes(e.name)) {
        window.__inpEvents.push({ duration: e.duration, target: e.target });
      }
    }
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
});

// ── Navigate immediately ───────────────────────────────────────────────────
// Use domcontentloaded — fires when HTML is parsed and sync scripts run.
// Do not use 'load' (waits for all subresources, 15–20 s on heavy pages)
// or 'networkidle' (hangs on long-polling pages).
await page.goto('%%URL%%', { waitUntil: 'domcontentloaded', timeout: 30000 });

// ── Post-navigation CDP setup ─────────────────────────────────────────────
await cdp.send('Performance.enable');
const { frameTree } = await cdp.send('Page.getFrameTree');
const topFrameId = frameTree.frame.id;

// ── Page settle ────────────────────────────────────────────────────────────
// Wait 3 s for above-fold content to render, then adaptively for block
// decoration to actually finish — NOT a second fixed wait.
//
// Root cause this replaces (found by direct measurement, not guessed): milo
// sets `block.dataset.blockStatus = 'loaded'` (utils.js:1391) once a block
// finishes decorating. On baseline, essentially everything reaches "loaded"
// within ~10s, so a flat "wait 7 more seconds" happened to look sufficient.
// Under real CPU 4× + network throttle, milo's OWN decoration pipeline is
// throttled too — confirmed by polling live: brand-concierge didn't exist
// in the DOM until ~18s under throttle and wasn't fully decorated until
// ~24s. A flat 10s settle on the throttled pass was measuring the page
// *before* it reached the same lifecycle point baseline was measured at —
// not "brand-concierge costs nothing under throttle," but "brand-concierge
// hadn't loaded yet, so there was nothing there to measure." That mismatch
// is what produces impossible-looking results like a block's CPU dropping
// to ~0 under throttle when baseline showed a real cost: throttle can't
// make a genuine CPU-bound cost disappear, it can only make it arrive late.
//
// Fix: poll for the loaded-block count to stop growing (stable across two
// consecutive 2s checks) instead of assuming a fixed duration is enough —
// this makes baseline and throttled comparable at the same lifecycle stage
// rather than the same wall-clock time. Generous cap (60s) so a genuinely
// stuck page doesn't hang the whole pass; note if the cap was hit.
await page.waitForTimeout(3000);
let settleNotes = [];
// Use `.section > [class]` (Milo's block markup convention) to decide whether
// this page uses the adaptive settle loop at all — NOT `[data-block-status]`.
// Root cause this replaces (found by direct measurement, not guessed): a live
// throttled run checked `[data-block-status]` at this exact 3s mark and found
// none — because under severe throttle, decoration genuinely hadn't started
// yet (confirmed elsewhere in this file: blockCount sits at 0 for the first
// several seconds). That single false reading made the check wrongly conclude
// "not a Milo page" and fall through to a flat 7s wait for the ENTIRE rest of
// the pass, skipping the adaptive loop (and its cross-pass floor below)
// completely — the page was measured after only ~10s total, mid-load.
// `.section > [class]` is server-rendered HTML present from the moment
// `domcontentloaded` fires, independent of whether any JS decoration has run
// yet, so it can't produce this false negative.
const usesBlockStatus = await page.evaluate(() => !!document.querySelector('.section > [class]'));

// ── Start CDP trace NOW, before settle/click-pass (Milo sites only) ───────
// Root cause this fixes (found by direct measurement, not guessed): tracing
// used to start right before the scroll loop, AFTER decoration and the
// synthetic click-pass had already finished. A direct trace capture proved
// this was hiding real, substantial per-block CPU cost: brand-concierge.js
// alone showed ~92ms of main-thread execution during a scroll-only window
// with no click at all (its own scroll/intersection-driven setup) — none of
// which the old scroll-only trace window could ever see, since that work
// happens before tracing started. A block's real cost is dominated by its
// own init()/decoration and any interaction handlers, not by what happens
// during the scroll loop specifically. Fix: start the trace here, before the
// settle loop and click-pass, and keep it running through scroll — one
// continuous capture of the whole post-navigation lifecycle.
const traceEvents = [];
let tracingActive = false;
if (usesBlockStatus) {
  cdp.on('Tracing.dataCollected', (data) => { traceEvents.push(...(data.value || [])); });
  await cdp.send('Tracing.start', {
    categories: 'devtools.timeline,disabled-by-default-devtools.timeline,v8,blink.user_timing',
    transferMode: 'ReportEvents',
  });
  tracingActive = true;
}

// Cross-pass floor: 0 on the baseline pass (no prior pass to compare against
// yet). On throttled-desktop, SKILL.md substitutes baseline's own final
// settled block count here. Root cause this guards against (found by direct
// measurement, not guessed): blocks arrive in slow, spaced-out waves under
// real network throttle, and a lull BETWEEN waves — mid-load, with most
// blocks still missing — can hold blockCount/resourceCount flat for a full
// 4-check (12s) window and look identical to "actually done." A live run hit
// exactly this: the throttled pass settled cleanly (no cap-timeout note) at
// only 13 block *types* with brand-concierge entirely absent and 5 images
// (vs. baseline's 27 images, 11 block types, brand-concierge present) — the
// stability check was satisfied during a lull, not at genuine completion. A
// page cannot legitimately have FEWER real blocks under throttle than it has
// unthrottled; throttle can only delay content, never remove it. So the
// throttled pass must not accept "stable" below baseline's own count — if it
// hasn't reached that count yet, keep polling (up to the same 90s cap) no
// matter how flat the reading looks.
let minBlockTarget = %%BASELINE_BLOCK_COUNT%%;
let finalBlockCount = 0;
if (!usesBlockStatus) {
  // Genuinely not a Milo/EDS page (no `.section > [class]` block markup at
  // all) — the adaptive poll below has nothing to key off. Fall back to the
  // flat wait this replaced.
  await page.waitForTimeout(7000);
} else {
  // Require BOTH the loaded-block count AND the resource-timing count to be
  // flat across 4 consecutive checks (12s of genuine silence, not 4s) before
  // concluding decoration has actually finished. Cap raised to 90s to give
  // real throttled loads room to finish within it.
  let lastBlockCount = -1;
  let lastResourceCount = -1;
  let stableChecks = 0;
  const maxChecks = 30; // 30 × 3s = 90s hard cap
  for (let i = 0; i < maxChecks; i++) {
    await page.waitForTimeout(3000);
    const { blockCount, resourceCount } = await page.evaluate(() => ({
      blockCount: document.querySelectorAll('[data-block-status="loaded"]').length,
      resourceCount: performance.getEntriesByType('resource').length,
    }));
    // blockCount === 0 held flat, or blockCount still below the cross-pass
    // floor, is NOT settling — see comment above. Require real content
    // (blockCount > 0) AND meeting the floor before flatness counts.
    const meetsFloor = blockCount > 0 && blockCount >= minBlockTarget;
    if (meetsFloor && blockCount === lastBlockCount && resourceCount === lastResourceCount) {
      stableChecks++;
      if (stableChecks >= 4) break; // stable across 4 consecutive checks (12s)
    } else {
      stableChecks = 0;
    }
    lastBlockCount = blockCount;
    lastResourceCount = resourceCount;
    if (i === maxChecks - 1) settleNotes.push(`Block decoration did not stabilize within the 90s cap (last block count: ${blockCount}, floor: ${minBlockTarget || 'n/a'}, last resource count: ${resourceCount}) — some blocks may still be loading when measured.`);
  }
  finalBlockCount = lastBlockCount;
}

// ── Milo/C2 block detection (once, reused for the rest of this pass) ──────
// Same selector as usesBlockStatus above — no need to re-query the DOM.
const isMiloSite = usesBlockStatus;
const c2Blocks = isMiloSite ? await page.evaluate(() => {
  const blocks = new Set();
  document.querySelectorAll('.section > [class]').forEach(el => {
    if (el.classList[0]) blocks.add(el.classList[0]);
  });
  return [...blocks];
}) : [];

// ── LCP/CLS stabilization poll (Milo sites only) ──────────────────────────
// Root cause this fixes (found by direct measurement, not guessed): the
// block-count settle loop above answers "has milo's decoration pipeline gone
// quiet," which is a completely different question from "has the browser's
// own Largest Contentful Paint algorithm stopped nominating new candidates."
// Two back-to-back identical throttled runs (4x CPU + 400Kbps/150ms network)
// against the same real page (adobe.com) produced wildly different results
// because of this gap: Run A settled with LCP = 39,184ms, won by a <video>
// poster image that finished downloading just in time; Run B settled with
// LCP = 8,752ms, won by an <h2> heading — and even after the full 90s settle
// cap elapsed in that run, the same poster image never became the largest
// rendered candidate at all. The block-count heuristic can fire while the
// true LCP candidate is still mid-flight — a coin flip depending on real
// network timing — and whichever state happens to exist at that exact
// snapshot instant gets reported as "the" LCP, even though window.__lcp
// would have kept updating for longer if given the chance.
//
// Fix: after block-count settles, separately poll window.__lcp.startTime and
// window.__cls (entry count + summed value) until THEY stop changing, before
// taking the cwvSnapshot below. This doesn't need the same 12s/4-check
// window as block-count settling — LCP/CLS entries are cheap to poll, so a
// short 3-consecutive-check requirement (at 1.5s each) is enough to confirm
// stability without needlessly extending every pass by tens of seconds once
// it's already genuinely stable. Bounded at 30s so a page where LCP
// genuinely never stabilizes (an infinite carousel, a live video with no
// scriptable "settled" endpoint) can't hang the whole pass — if the cap is
// hit, note it so the report doesn't silently present a mid-flight reading
// as final.
if (isMiloSite) {
  let lastLcpStartTime = -1;
  let lastClsCount = -1;
  let lastClsValue = -1;
  let cwvStableChecks = 0;
  const maxCwvChecks = 20; // 20 × 1.5s = 30s hard cap
  for (let i = 0; i < maxCwvChecks; i++) {
    await page.waitForTimeout(1500);
    const { lcpStartTime, clsCount, clsValue } = await page.evaluate(() => ({
      lcpStartTime: window.__lcp ? window.__lcp.startTime : null,
      clsCount: window.__cls.length,
      clsValue: window.__cls.reduce((sum, s) => sum + s.value, 0),
    }));
    if (lcpStartTime === lastLcpStartTime && clsCount === lastClsCount && clsValue === lastClsValue) {
      cwvStableChecks++;
      if (cwvStableChecks >= 3) break; // stable across 3 consecutive checks (4.5s)
    } else {
      cwvStableChecks = 0;
    }
    lastLcpStartTime = lcpStartTime;
    lastClsCount = clsCount;
    lastClsValue = clsValue;
    if (i === maxCwvChecks - 1) settleNotes.push(`LCP/CLS did not stabilize within the 30s cap (last LCP startTime: ${lcpStartTime}, last CLS count/value: ${clsCount}/${clsValue}) — the reported LCP/CLS may not reflect the page's true eventual state.`);
  }
}

// ── Snapshot LCP/CLS now — after the stabilization poll above, before
// click-pass or scroll (Milo sites only) ──────────────────────────────────
// LCP is documented to stop recording new candidates on the first user
// input, including scroll (web.dev/LCP). Empirically this is NOT what
// happens with our own CDP-dispatched wheel scroll: a live trace showed LCP
// correctly resolve at 848ms (a video poster) right after settle AND right
// after the click-pass, then jump to 22,740ms at the very first scroll stop
// — recorded against a totally different, much larger image that only
// starts loading because our own scroll wheel triggers its lazy-load. That
// image was never the real LCP; it's an artifact of testing with a scroll
// interaction a real passive page-load measurement wouldn't have. Every
// prior report's "~25s LCP" finding was this artifact, not a real result.
// Fix: capture LCP/CLS right here, after LCP/CLS have stabilized (poll
// above) and before click-pass/scroll can contaminate them, and treat
// this snapshot — not whatever window.__lcp/__cls contain at the very end —
// as authoritative for the report.
const cwvSnapshot = isMiloSite ? await page.evaluate((blocks) => {
  const findBlock = (el) => {
    let node = el;
    while (node && node !== document.body) {
      const parent = node.parentElement;
      if (parent && parent.classList && parent.classList.contains('section')) return node.classList[0] || null;
      node = parent;
    }
    return null;
  };
  const lcp = window.__lcp ? {
    startTime: Math.round(window.__lcp.startTime),
    block: window.__lcp.element ? findBlock(window.__lcp.element) : null,
    tag: window.__lcp.element ? window.__lcp.element.tagName : null,
    url: window.__lcp.url || null,
  } : null;
  const clsByBlock = {};
  let clsTotal = 0;
  for (const shift of window.__cls) {
    clsTotal += shift.value;
    if (shift.node) {
      const block = findBlock(shift.node);
      if (block && blocks.indexOf(block) !== -1) clsByBlock[block] = (clsByBlock[block] || 0) + shift.value;
    }
  }
  return { lcp, cls: { total: clsTotal, byBlock: clsByBlock } };
}, c2Blocks) : null;

// ── Safe synthetic click pass for INP (Milo sites only) ────────────────────
// Buttons only — never <a href>, which risks navigating away mid-test.
//
// "Safe" only covers navigation — it does NOT mean side-effect-free. Several
// block buttons open a modal (verified: brand-concierge.js:322 calls
// getModal() for a full chat-widget dialog). A click→dismiss approach was
// tried here previously (click, wait, poll for the curtain to close, force-
// clear as a fallback) — directly observed to still be unreliable in
// practice: even with polling, the open→close→wait sequence sometimes lands
// right before the scroll phase starts, producing a visible "click, modal
// flashes open and closed, pause, then scroll" pattern instead of one clean,
// continuous human-like scroll session. Fix: don't open it at all. Exclude
// any block known to open a modal from the click pass entirely — a skipped
// click is a small INP-coverage gap for that one block; a contaminated
// scroll pass affects every measurement the rest of this file collects.
const MODAL_OPENING_BLOCKS = ['brand-concierge'];
if (isMiloSite) {
  await page.evaluate(async (blocks) => {
    const findBlock = (el) => {
      let node = el;
      while (node && node !== document.body) {
        const parent = node.parentElement;
        if (parent && parent.classList && parent.classList.contains('section')) return node.classList[0] || null;
        node = parent;
      }
      return null;
    };
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const seen = new Set();
    for (const btn of document.querySelectorAll('button')) {
      const block = findBlock(btn);
      if (!block || blocks.indexOf(block) === -1 || seen.has(block)) continue;
      seen.add(block);
      try { btn.click(); } catch (e) {}
      await wait(200);
    }
  }, c2Blocks.filter((b) => !MODAL_OPENING_BLOCKS.includes(b)));

  // INP-event stability poll — same audit, same bug class as the LCP/CLS and
  // resource/trace fixes above, applied here defensively: the click-pass
  // loop above only waits 200ms per click with no wait after the loop
  // itself, and window.__inpEvents is read much later in this script (after
  // the full scroll phase), so in practice it already gets tens of seconds
  // of buffer before being read — but that buffer is incidental, not
  // guaranteed by this code's own logic. Make it explicit rather than
  // implicit: poll window.__inpEvents.length for stability (2 consecutive
  // checks, 300ms apart — discrete interaction timing entries resolve much
  // faster than LCP/CLS, so this doesn't need anywhere near as long a
  // window) before moving on. Capped at 3s.
  let lastInpEventCount = -1;
  let inpStableChecks = 0;
  for (let i = 0; i < 10; i++) { // 10 × 300ms = 3s cap
    await page.waitForTimeout(300);
    const inpEventCountNow = await page.evaluate(() => window.__inpEvents.length);
    if (inpEventCountNow === lastInpEventCount) {
      inpStableChecks++;
      if (inpStableChecks >= 2) break;
    } else {
      inpStableChecks = 0;
    }
    lastInpEventCount = inpEventCountNow;
  }
}

// ── Scroll with wheel events + 2 s pauses + per-frame timing ─────────────
// Uses page.mouse.wheel() so smooth-scroll libraries (e.g. Lenis) intercept
// the events and apply their own inertia — more realistic than window.scrollTo().
// 5 rapid ticks × 200 px per stop mimics a short scroll burst; Lenis then
// animates the remainder. RAF frame durations are captured in the browser
// context throughout the full scroll session for jank analysis.
//
// THIS IS THE HUMAN-LIKE INCREMENTAL SCROLL AND THE ONLY SCROLL MECHANISM IN
// THIS PASS. Do not simplify it to an instant window.scrollTo() jump, and do
// not add one afterward either (a prior version did, as a "guarantee we
// reached the bottom" step — removed after direct observation that it
// produced exactly the robotic, instant jump this pass exists to avoid; see
// the comment where it used to be, right after this loop, for why).

// Position the pointer in the middle of the viewport so wheel events land on
// the main scroll container (required by Lenis / pointer-based listeners).
await page.mouse.move(720, 450);

// Start a continuous RAF probe in the page context.
await page.evaluate(() => {
  window.__rafTrack = { durations: [], lastTs: null };
  const track = (ts) => {
    if (window.__rafTrack.lastTs !== null)
      window.__rafTrack.durations.push(Math.round(ts - window.__rafTrack.lastTs));
    window.__rafTrack.lastTs = ts;
    requestAnimationFrame(track);
  };
  requestAnimationFrame(track);
});

const getScrollRoom = () => page.evaluate(() => ({
  room: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight,
  innerHeight: window.innerHeight,
}));

// Guard against a false "nothing to scroll" reading: numStops is derived from
// scrollHeight at this single instant, and if it's checked mid-layout (a race,
// not a real short page) it silently produces numStops = 0 — the scroll `for`
// loop then never runs a single iteration and the pass reports zero scroll
// frames even though the page legitimately has content below the fold. Do one
// bounded re-check (not a loop — a genuinely short/stalled page, e.g. under
// severe throttle, is a real result, not a bug) before trusting a 0 reading.
let { room: scrollRoom, innerHeight } = await getScrollRoom();
if (scrollRoom <= 0) {
  await page.waitForTimeout(3000);
  ({ room: scrollRoom, innerHeight } = await getScrollRoom());
  if (scrollRoom <= 0) {
    settleNotes.push('Page had no scrollable content below the fold at scroll-phase start (re-checked once after 3s) — 0 scroll stops is a real reading, not a skipped test.');
  }
}
const numStops = Math.min(Math.ceil(Math.max(scrollRoom, 0) / innerHeight), 12);

for (let i = 0; i < numStops; i++) {
  // 5 rapid wheel ticks (~1 frame apart) to simulate a real scroll burst
  for (let t = 0; t < 5; t++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(16);
  }
  // Wait 2 s for Lenis inertia (or native momentum) to settle
  await page.waitForTimeout(2000);
}

// NO instant scrollTo jump here — removed after direct observation (not
// assumed): an unconditional `window.scrollTo(0, maxHeight)` "guarantee we
// reached the bottom" step right after the human-like wheel-tick loop is
// itself a robotic, instant jump — exactly the kind of movement this pass
// exists to NOT produce. The wheel-tick loop above is the sole scroll
// mechanism, full stop. If a very tall page isn't fully covered by numStops'
// worth of wheel ticks (capped at 12 stops), that's an honest limitation of a
// bounded human-like scroll session — a real visitor doesn't necessarily
// reach the literal bottom of a long page either. Do not reintroduce an
// instant jump to "fix" that; the correct fix, if ever needed, is more wheel
// stops, never a `scrollTo`.
await page.waitForTimeout(500);

const scrollStats = await page.evaluate(() => {
  const d = window.__rafTrack.durations;
  if (!d.length) return { fpsAvg:60, fpsMin:60, fpsMax:60, rafP50:16, rafP95:16, rafMax:16, jankFrames:0, totalFrames:0 };
  const sorted = [...d].sort((a, b) => a - b);
  const p = (pct) => sorted[Math.min(Math.floor(sorted.length * pct / 100), sorted.length - 1)];
  const avg = Math.round(d.reduce((a, b) => a + b, 0) / d.length);
  return {
    fpsAvg:     avg > 0 ? Math.round(1000 / avg) : 0,
    fpsMin:     Math.round(1000 / sorted[sorted.length - 1]),
    fpsMax:     Math.round(1000 / sorted[0]),
    rafP50:     p(50),
    rafP95:     p(95),
    rafMax:     sorted[sorted.length - 1],
    jankFrames: d.filter(x => x > 33).length,
    totalFrames: d.length,
  };
});

// ── Resource-count stability poll, then resource timing ───────────────────
// Root cause this fixes (found by an audit of this same "snapshot too early"
// bug class that produced the LCP/CLS fix above, not guessed): resource
// timing used to be captured BEFORE the scroll loop even started — meaning
// any resource whose load is triggered by scrolling (a lazy-loaded image
// revealed as a section scrolls into view, exactly the kind of
// scroll-triggered lazy-load that was already proven to corrupt LCP earlier
// in this file) was invisible to resourceTotals/resourceSummary entirely,
// and under throttle, resources requested near the end of scroll may still
// be mid-flight the instant scroll stops. Fix: poll the resource count for
// stability (2 consecutive checks, 1.5s apart) after scroll finishes, same
// pattern as the LCP/CLS poll above, before capturing totals — capped at 10s
// since this is verifying a wind-down, not waiting out a fresh load.
let lastPostScrollResourceCount = -1;
let postScrollStableChecks = 0;
for (let i = 0; i < 7; i++) { // 7 × 1.5s = ~10.5s cap
  await page.waitForTimeout(1500);
  const resourceCountNow = await page.evaluate(() => performance.getEntriesByType('resource').length);
  if (resourceCountNow === lastPostScrollResourceCount) {
    postScrollStableChecks++;
    if (postScrollStableChecks >= 2) break;
  } else {
    postScrollStableChecks = 0;
  }
  lastPostScrollResourceCount = resourceCountNow;
}

// Summarise inside page.evaluate — never return the raw list.
// Pages routinely load 200+ resources; aggregate totals and keep top 8 per
// type by decoded size.
const { resourceSummary, resourceTotals } = await page.evaluate(() => {
  const all = performance.getEntriesByType('resource').map(r => ({
    url: r.name,
    filename: r.name.split('/').pop().split('?')[0],
    type: r.initiatorType,
    durationMs: Math.round(r.duration),
    transferKB: Math.round(r.transferSize / 1024),
    decodedKB: Math.round(r.decodedBodySize / 1024),
    renderBlocking: r.renderBlockingStatus === 'blocking',
  }));

  const totals = {};
  for (const r of all) {
    if (!totals[r.type]) totals[r.type] = { count: 0, transferKB: 0 };
    totals[r.type].count++;
    totals[r.type].transferKB += r.transferKB;
  }

  const byType = {};
  for (const r of all) {
    if (!byType[r.type]) byType[r.type] = [];
    byType[r.type].push(r);
  }
  const top = {};
  for (const [type, items] of Object.entries(byType)) {
    top[type] = items
      .sort((a, b) => b.decodedKB - a.decodedKB)
      .slice(0, 8)
      .map(({ url: _url, ...rest }) => rest);
  }

  return { resourceSummary: top, resourceTotals: totals };
});

// ── End CDP trace ────────────────────────────────────────────────────────
// Root cause this fixes (same audit, same bug class as the LCP/CLS fix
// above): tracing used to end right after a flat 500ms post-scroll wait,
// regardless of whether trace-worthy activity (a block's scroll-triggered
// handler, an IntersectionObserver callback, a lazy-load kickoff) was still
// happening — cutting it off mid-measurement in a way that varies run to run.
//
// First attempt at a fix here polled `traceEvents.length` for stability
// before calling `Tracing.end` — directly measured to be a no-op: with
// `transferMode: 'ReportEvents'`, this Chrome build does NOT stream
// `Tracing.dataCollected` events live during collection the way the category
// name suggests; `traceEvents.length` sat at exactly 0 through every poll
// iteration and only jumped to its real value (hundreds of events) once
// `Tracing.end` itself fired. Polling a value that can't change while tracing
// is active isn't a stability check, it's a disguised fixed wait — so that
// approach was removed rather than left in as a placebo.
//
// Real fix: rely on the resource-count stability poll immediately above,
// which already reached genuine quiet (a real, page-visible signal) before
// this point — end the trace right after it, with no separate poll needed.
// Resource loading and script execution are correlated closely enough on a
// real page that "resources have stopped arriving" is a reasonable proxy for
// "the page's activity has wound down," which is what actually matters here.
if (tracingActive) {
  const tracingComplete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
  await cdp.send('Tracing.end');
  await tracingComplete;
}

// ── CDP + vitals + long tasks + animation audit ────────────────────────────
await page.waitForTimeout(1500);

const { metrics } = await cdp.send('Performance.getMetrics');
const cdpMetrics  = Object.fromEntries(metrics.map(m => [m.name, m.value]));

const vitals = await page.evaluate(() => {
  const p = window.__perf;
  return {
    inpMs: p.inp,
    longTasks: (p.longTasks || [])
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, 10),
    totalBlockingTimeMs: (p.longTasks || [])
      .reduce((sum, t) => sum + Math.max(t.durationMs - 50, 0), 0),
  };
});

// Detect active CSS animations and will-change on visible elements
const animationAudit = await page.evaluate(() => {
  const results = [];
  const seen    = new Set();
  for (const el of document.querySelectorAll('*')) {
    const s    = getComputedStyle(el);
    const name = s.animationName;
    const wc   = s.willChange;
    if ((name && name !== 'none') || (wc && wc !== 'auto')) {
      const key = `${name}:${wc}:${el.className}`;
      if (!seen.has(key)) {
        seen.add(key);
        const cls = el.className?.toString().trim().split(/\s+/).slice(0, 3).join('.');
        results.push({
          selector: `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`.slice(0, 80),
          animationName: (name && name !== 'none') ? name : null,
          animationDuration: (name && name !== 'none') ? s.animationDuration : null,
          willChange: (wc && wc !== 'auto') ? wc : null,
        });
      }
      if (results.length >= 15) break;
    }
  }
  return results;
});

// ── Per-block breakdown (Milo/C2 sites only) ────────────────────────────────
let blockBreakdown = null;
if (isMiloSite) {
  // Find the main frame's script execution and sum time by source file —
  // this covers the whole post-navigation
  // lifecycle (decoration + click-pass + scroll), since tracing now starts
  // before the settle loop rather than just before scroll (see the trace
  // Tracing.start comment above for why the scroll-only window undercounted).
  //
  // Attribution is scoped by CDP frame ID (topFrameId, captured via
  // Page.getFrameTree right after navigation), NOT by "whichever thread has
  // the most RunTask events." Root cause the old thread-count heuristic hid
  // (found by direct measurement, not guessed): over the short scroll-only
  // window this heuristic happened to work, because the main frame's thread
  // usually had the most RunTask events during active scrolling. Once tracing
  // was extended to cover the full lifecycle (above), the longer capture
  // window let out-of-process iframes (adobe.com has several — georouting,
  // preload-optimized, personalization) accumulate MORE RunTask events than
  // the main frame during the long settle wait, so the heuristic silently
  // picked an iframe's renderer thread instead — one with zero block-matching
  // script URLs, producing cpuMs: 0 for every block despite real, measurable
  // cost existing (confirmed directly: filtering the same trace by frame ID
  // instead recovered real per-block costs, e.g. brand-concierge.js ~11ms,
  // carousel-c2.js ~24ms, that the thread-count heuristic had missed
  // entirely). Frame ID is stable regardless of how work is distributed
  // across processes/threads, so it doesn't have this failure mode.
  const relevantNames = new Set(['FunctionCall', 'EvaluateScript', 'v8.compile', 'V8.Execute']);
  const cpuByFile = {};
  for (const e of traceEvents) {
    if (e.ph !== 'X' || !e.dur) continue;
    if (!relevantNames.has(e.name)) continue;
    if (e.args?.data?.frame !== topFrameId) continue;
    const url = e.args?.data?.url || null;
    if (!url) continue;
    const filename = url.split('/').pop().split('?')[0];
    cpuByFile[filename] = (cpuByFile[filename] || 0) + e.dur;
  }

  const pageResult = await page.evaluate(({ blocks }) => {
    const findBlock = (el) => {
      let node = el;
      while (node && node !== document.body) {
        const parent = node.parentElement;
        if (parent && parent.classList && parent.classList.contains('section')) {
          return node.classList[0] || null;
        }
        node = parent;
      }
      return null;
    };

    // Forced-layout attempt (LoAF, full post-navigation lifecycle — decoration
    // + click-pass + scroll, same window as the CPU trace above) — often
    // sparse/zero, report honestly rather than fabricating a per-block split.
    const forcedByFile = {};
    for (const frame of window.__loaf) {
      for (const s of frame.scripts) {
        const filename = (s.sourceURL || '(unknown)').split('/').pop().split('?')[0] || '(inline)';
        forcedByFile[filename] = (forcedByFile[filename] || 0) + (s.forcedStyleAndLayoutDuration || 0);
      }
    }

    // GPU pressure proxy: count of elements per block with an active
    // will-change or CSS animation — DOM-structural, reproducible.
    const layerCountByBlock = {};
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      const hasLayer = (s.willChange && s.willChange !== 'auto') || (s.animationName && s.animationName !== 'none');
      if (!hasLayer) continue;
      const block = findBlock(el);
      if (block && blocks.indexOf(block) !== -1) layerCountByBlock[block] = (layerCountByBlock[block] || 0) + 1;
    }

    // Network weight per block: map media src filenames to their block,
    // then sum Resource Timing transfer size.
    const fileToBlock = {};
    document.querySelectorAll('video').forEach(el => {
      const block = findBlock(el);
      [el, ...el.querySelectorAll('source')].forEach(s => {
        const src = s.currentSrc || s.src;
        if (src) fileToBlock[src.split('/').pop().split('?')[0]] = block;
      });
    });
    document.querySelectorAll('img').forEach(el => {
      const src = el.currentSrc || el.src;
      if (src && !src.startsWith('data:')) fileToBlock[src.split('/').pop().split('?')[0]] = findBlock(el);
    });
    const netByBlock = {};
    performance.getEntriesByType('resource').forEach(r => {
      const filename = r.name.split('/').pop().split('?')[0];
      const bare = filename.replace(/\.(js|css)$/, '');
      let block = fileToBlock[filename] || null;
      if (!block && blocks.indexOf(bare) !== -1) block = bare;
      if (block && blocks.indexOf(block) !== -1) {
        netByBlock[block] = (netByBlock[block] || 0) + Math.round(r.transferSize / 1024);
      }
    });

    // INP per block — only meaningful for blocks that actually contain a
    // clicked button; most pages' nav controls live outside <main> entirely.
    const inpByBlock = {};
    for (const e of window.__inpEvents) {
      const block = e.target ? findBlock(e.target) : null;
      if (block && blocks.indexOf(block) !== -1) {
        inpByBlock[block] = Math.max(inpByBlock[block] || 0, Math.round(e.duration));
      }
    }

    return { forcedByFile, layerCountByBlock, netByBlock, inpByBlock, inpEventCount: window.__inpEvents.length };
  }, { blocks: c2Blocks });

  const perBlock = {};
  c2Blocks.forEach(b => { perBlock[b] = { cpuMs: 0, forcedMs: 0, layerCount: 0, netKB: 0 }; });
  for (const [filename, us] of Object.entries(cpuByFile)) {
    const bare = filename.replace(/\.(js|css)$/, '');
    if (c2Blocks.includes(bare)) perBlock[bare].cpuMs = Math.round(us / 1000);
  }
  for (const [filename, ms] of Object.entries(pageResult.forcedByFile)) {
    const bare = filename.replace(/\.(js|css)$/, '');
    if (c2Blocks.includes(bare)) perBlock[bare].forcedMs = Math.round(ms);
  }
  for (const [block, count] of Object.entries(pageResult.layerCountByBlock)) perBlock[block].layerCount = count;
  for (const [block, kb] of Object.entries(pageResult.netByBlock)) perBlock[block].netKB = kb;

  // LCP/CLS come from cwvSnapshot (captured before click-pass/scroll) —
  // NOT recomputed here. See the cwvSnapshot comment above for why: reading
  // window.__lcp/__cls at this point in the script reflects post-scroll
  // state, which is contaminated by scroll-triggered lazy-load artifacts.
  blockBreakdown = {
    blocks: c2Blocks,
    perBlock,
    cls: cwvSnapshot.cls,
    lcp: cwvSnapshot.lcp,
    inp: { byBlock: pageResult.inpByBlock, eventCount: pageResult.inpEventCount },
  };
}

// ── Return MetricsBundle ───────────────────────────────────────────────────
return JSON.stringify({
  profile: '%%PROFILE%%',
  url: '%%URL%%',
  vitals: {
    inpMs: vitals.inpMs,
  },
  scroll: scrollStats,
  longTasks: vitals.longTasks,
  totalBlockingTimeMs: vitals.totalBlockingTimeMs,
  animationAudit,
  cdp: {
    taskDurationS:        cdpMetrics.TaskDuration,
    scriptDurationS:      cdpMetrics.ScriptDuration,
    recalcStyleDurationS: cdpMetrics.RecalcStyleDuration,
    layoutDurationS:      cdpMetrics.LayoutDuration,
    jsHeapMB:             Math.round(cdpMetrics.JSHeapUsedSize / 1024 / 1024),
    gpuTextureMB:         cdpMetrics.GPUMainFrameUsedTextureMegaBytes ?? null,
  },
  resourceTotals,
  resourceSummary,
  isMiloSite,
  blockBreakdown,
  settledBlockCount: finalBlockCount,
  screenshotPath: null,
  notes: settleNotes,
});
```

**Before running this script**, replace every `%%PLACEHOLDER%%` with the actual values:
- `%%PROFILE%%` → the profile string (`desktop-baseline` or `throttled-desktop`)
- `%%URL%%` → the target URL
- `%%BASELINE_BLOCK_COUNT%%` → `0` on the baseline (`desktop-baseline`) pass — there is no prior pass yet. On the throttled (`throttled-desktop`) pass, substitute baseline's own `settledBlockCount` from the Phase 1 MetricsBundle (a bare number, e.g. `41`, not a string). This is what stops the throttled pass from falsely declaring itself "settled" during a mid-load lull with fewer real blocks than the page actually has.

The `return JSON.stringify(...)` must be the last statement of the `browser_run_code` invocation so that `page` is in scope.

### Step 3 — Close browser (throttled-desktop only)

After `browser_run_code` returns, if `profile` is `throttled-desktop`, call `browser_close`. This is the final pass **against the target URL** and the browser is no longer needed for testing it. Do **not** call `browser_close` after the baseline pass — the throttled pass needs a clean browser state and calls `browser_close` itself at Step 1.

If `agents/block-breakdown.md` runs afterward to render the dashboard chart, it will reopen the browser itself — that's a navigation to a local file server to screenshot a chart *we generated*, not a third test pass of the audited page. That file owns closing the browser again at the true end of its own work.

## Output — MetricsBundle

Return the raw JSON string exactly as produced by `browser_run_code`. No commentary.

```json
{
  "profile": "desktop-baseline | throttled-desktop",
  "url": "<url>",
  "vitals": {
    "inpMs": 80
  },
  "scroll": {
    "fpsAvg": 58, "fpsMin": 42, "fpsMax": 120,
    "rafP50": 14, "rafP95": 28, "rafMax": 67,
    "jankFrames": 4, "totalFrames": 72
  },
  "longTasks": [
    { "durationMs": 210, "startMs": 450 }
  ],
  "totalBlockingTimeMs": 320,
  "animationAudit": [
    { "selector": "div.elastic-carousel-item", "animationName": "elasticItemsGapShrink", "animationDuration": "3.5s", "willChange": "width, max-width" }
  ],
  "cdp": {
    "taskDurationS": 0.8,
    "scriptDurationS": 0.4,
    "recalcStyleDurationS": 0.05,
    "layoutDurationS": 0.02,
    "jsHeapMB": 24,
    "gpuTextureMB": 18
  },
  "resourceTotals": {
    "img":    { "count": 24, "transferKB": 1840 },
    "script": { "count": 18, "transferKB": 620 },
    "font":   { "count": 4,  "transferKB": 120 }
  },
  "resourceSummary": {
    "img": [
      { "filename": "hero.jpg", "type": "img", "durationMs": 340, "transferKB": 180, "decodedKB": 920, "renderBlocking": false }
    ]
  },
  "isMiloSite": true,
  "blockBreakdown": {
    "blocks": ["router-marquee", "elastic-carousel", "base-card"],
    "perBlock": {
      "router-marquee": { "cpuMs": 0, "forcedMs": 0, "layerCount": 0, "netKB": 2410 },
      "elastic-carousel": { "cpuMs": 4, "forcedMs": 0, "layerCount": 7, "netKB": 6 }
    },
    "cls": { "total": 0.33, "byBlock": { "section-background": 0.09 } },
    "lcp": { "startTime": 10408, "block": "section-background", "tag": "IMG", "url": "https://.../hero.jpg?width=4320" },
    "inp": { "byBlock": {}, "eventCount": 3 }
  },
  "settledBlockCount": 41,
  "screenshotPath": "/tmp/perf-baseline.png",
  "notes": []
}
```

`isMiloSite`/`blockBreakdown` are `false`/`null` on non-Milo pages — `agents/block-breakdown.md` (Phase 3.5) reads these fields directly rather than re-collecting anything.

`settledBlockCount` is the baseline pass's own cross-pass floor for the throttled pass (see Step 2's settle logic) — SKILL.md must read it out of the Phase 1 bundle and substitute it into Phase 2's `%%BASELINE_BLOCK_COUNT%%`.

Include any timeout fallbacks or anomalies in `notes`.
