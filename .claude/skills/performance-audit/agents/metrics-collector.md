# Metrics Collector

Used by SKILL.md Phases 1 and 2. Launches a Playwright browser, applies the requested throttling profile, navigates to the URL, collects runtime performance metrics (FPS, CPU, GPU, INP, long tasks, animations, resources), and returns a `MetricsBundle`.

## Inputs

- `url` — the page URL to test
- `profile` — `desktop-baseline` or `throttled-desktop` (see `references/throttling-profiles.md`)
- `screenshot_path` — local path to save the above-fold screenshot

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

1. Sets viewport and CDP
2. Injects Web Vitals + long task + RAF observers before navigation
3. Navigates
4. Waits 3 s for above-fold content, then freezes LCP, then waits 7 s more
5. Collects resource timing
6. Scrolls in viewport-height steps with 2 s pauses, recording per-frame timing
7. Collects CDP metrics, vitals, long tasks, and animation audit
8. Takes screenshot and returns the MetricsBundle

```javascript
// ── Pre-navigation setup (keep minimal to reduce blank-page wait time) ─────
await page.setViewportSize({ width: 1440, height: 900 });

// throttled-desktop only: must apply CPU throttle BEFORE navigation so it
// covers JS parsing. Baseline defers CDP setup until after goto().
let cdp;
if ('%%PROFILE%%' === 'throttled-desktop') {
  cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}

// ── Observer injection (must happen before goto) ───────────────────────────
await page.addInitScript(() => {
  window.__perf = {
    inp: null,
    longTasks: [],
  };

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
});

// ── Navigate immediately ───────────────────────────────────────────────────
// Use domcontentloaded — fires when HTML is parsed and sync scripts run.
// Do not use 'load' (waits for all subresources, 15–20 s on heavy pages)
// or 'networkidle' (hangs on long-polling pages).
await page.goto('%%URL%%', { waitUntil: 'domcontentloaded', timeout: 30000 });

// ── Post-navigation CDP setup ─────────────────────────────────────────────
// For baseline the CDP session is created here (after goto) to minimise
// blank-page time. For throttled it was created above and is reused.
if (!cdp) cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');

// ── Page settle ────────────────────────────────────────────────────────────
// Wait 3 s for above-fold content to render, then 7 s more for deferred
// scripts, lazy sections, and analytics to finish initialising before scroll.
await page.waitForTimeout(3000);
await page.waitForTimeout(7000);

// ── Resource timing ─────────────────────────────────────────────────────────
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

// ── Scroll with wheel events + 2 s pauses + per-frame timing ─────────────
// Uses page.mouse.wheel() so smooth-scroll libraries (e.g. Lenis) intercept
// the events and apply their own inertia — more realistic than window.scrollTo().
// 5 rapid ticks × 200 px per stop mimics a short scroll burst; Lenis then
// animates the remainder. RAF frame durations are captured in the browser
// context throughout the full scroll session for jank analysis.

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

const { numStops } = await page.evaluate(() => ({
  numStops: Math.min(
    Math.ceil(Math.max(document.body.scrollHeight - window.innerHeight, 0) / window.innerHeight),
    6
  ),
}));

for (let i = 0; i < numStops; i++) {
  // 5 rapid wheel ticks (~1 frame apart) to simulate a real scroll burst
  for (let t = 0; t < 5; t++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(16);
  }
  // Wait 2 s for Lenis inertia (or native momentum) to settle
  await page.waitForTimeout(2000);
}

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

// ── Screenshot ─────────────────────────────────────────────────────────────
await page.screenshot({ path: '%%SCREENSHOT_PATH%%', fullPage: false });

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
  screenshotPath: '%%SCREENSHOT_PATH%%',
  notes: [],
});
```

**Before running this script**, replace every `%%PLACEHOLDER%%` with the actual values:
- `%%PROFILE%%` → the profile string (`desktop-baseline` or `throttled-desktop`)
- `%%URL%%` → the target URL
- `%%SCREENSHOT_PATH%%` → the screenshot path

Both the screenshot statement and the `return JSON.stringify(...)` must be the last two statements of the same `browser_run_code` invocation so that `page` is in scope.

### Step 3 — Close browser (throttled-desktop only)

After `browser_run_code` returns, if `profile` is `throttled-desktop`, call `browser_close`. This is the final pass and the browser is no longer needed. Do **not** call `browser_close` after the baseline pass — the throttled pass needs a clean browser state and calls `browser_close` itself at Step 1.

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
  "screenshotPath": "/tmp/perf-baseline.png",
  "notes": []
}
```

Include any timeout fallbacks or anomalies in `notes`.
