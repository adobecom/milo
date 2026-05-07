# Metrics Collector Agent

Delegated from SKILL.md Phases 1 and 2. Launches a Playwright browser, applies the requested throttling profile, navigates to the URL, collects all performance metrics, and returns a `MetricsBundle`.

## Inputs

- `url` — the page URL to test
- `profile` — `desktop-baseline` or `throttled-desktop` (see `references/throttling-profiles.md`)
- `screenshot_path` — local path to save the above-fold screenshot

## Procedure

### Step 1 — Reset browser state, then use the provided page

**Before calling `browser_run_code`, always call `browser_close` first.** This resets the Playwright MCP's tracked page state so the next `browser_run_code` gets a clean blank page.

**Never call `browser_navigate` before `browser_run_code`.** `browser_navigate` loads the page once (using `waitUntil: 'load'`, which can take 15–20 s), and then `page.goto()` inside `browser_run_code` loads it a second time — doubling the wait. The correct flow is:

```
1. browser_close          ← resets MCP state, no navigation
2. browser_run_code       ← receives a fresh blank page; goto() is the only navigation
```

Inside `browser_run_code`, use the `page` object directly. Never create new pages (`context.newPage()`) and never close the page — doing either corrupts the MCP's tracked state.

```javascript
// Use the page provided by browser_run_code — do not open new tabs, do not close.
await page.setViewportSize({ width: 1440, height: 900 });
const cdp = await page.context().newCDPSession(page);

// throttled-desktop only — apply before navigation:
if (profile === 'throttled-desktop') {
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}

await cdp.send('Performance.enable');
```

The throttled run navigates the same page again (a fresh `page.goto()` clears all prior state), so no new tab is needed.

### Step 2 — Inject Web Vitals observer before navigation

Injecting before `goto` ensures early LCP and CLS entries are captured:

```javascript
await page.addInitScript(() => {
  window.__perf = { lcp: null, cls: 0, inp: null, shifts: [] };

  new PerformanceObserver(list => {
    const entries = list.getEntries();
    window.__perf.lcp = entries[entries.length - 1].startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });

  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      if (!e.hadRecentInput) {
        window.__perf.cls += e.value;
        window.__perf.shifts.push({
          value: e.value,
          sources: e.sources?.map(s => s.node?.outerHTML?.slice(0, 120)),
        });
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });

  new PerformanceObserver(list => {
    for (const e of list.getEntries()) {
      if (!window.__perf.inp || e.duration > window.__perf.inp)
        window.__perf.inp = e.duration;
    }
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
});
```

### Step 3 — Navigate

Use `domcontentloaded` — it fires as soon as the HTML is parsed and synchronous scripts run (~2–5 s on most pages). Do **not** use `load` or `networkidle`: `load` waits for all subresources and can take 15–20 s on heavy JS pages; `networkidle` can hang indefinitely on pages with long-polling. Always navigate inside `browser_run_code`, never with `browser_navigate` (which forces `load` and cannot inject the init script before navigation).

```javascript
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
```

### Step 4 — Wait before scrolling

Wait 10 seconds for deferred scripts and lazy-loaded content to fully settle:

```javascript
await page.waitForTimeout(10000);
```

### Step 5 — Collect and summarise resource timing

Summarise inside `page.evaluate` — never return the raw resource list. Pages routinely load 200+ resources; returning them all produces a JSON payload too large to read back from `browser_run_code`. Aggregate totals by type and keep only the top 8 entries per type by decoded size:

```javascript
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

  // Aggregate totals by type
  const totals = {};
  for (const r of all) {
    if (!totals[r.type]) totals[r.type] = { count: 0, transferKB: 0 };
    totals[r.type].count++;
    totals[r.type].transferKB += r.transferKB;
  }

  // Top 8 per type by decoded size (most impactful for analysis)
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
      .map(({ url: _url, ...rest }) => rest); // drop full URL, keep filename
  }

  return { resourceSummary: top, resourceTotals: totals };
});
```

### Step 6 — Finalise LCP before scrolling

Dispatch a synthetic `pointerdown` on `document.body` to stop the LCP PerformanceObserver from accepting new candidates. In real user sessions LCP finalises on first user input; without this, `window.scrollTo()` in headless mode loads lazy off-screen images that become new LCP candidates, inflating the reading by 5–10 s.

```javascript
await page.evaluate(() => {
  document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
});
```

### Step 7 — Scroll the full page and measure FPS

Scroll duration is time-based (6 seconds end-to-end) so the speed is realistic regardless of page height. FPS is sampled concurrently throughout the scroll, not after it — this captures actual scroll-time frame budget, not idle FPS.

```javascript
const { fps } = await page.evaluate(() => new Promise(resolve => {
  const DURATION = 6000; // ms
  const maxY = document.body.scrollHeight - window.innerHeight;
  const start = performance.now();
  let frames = 0;

  const tick = (now) => {
    frames++;
    const elapsed = now - start;
    const progress = Math.min(elapsed / DURATION, 1);
    window.scrollTo(0, progress * maxY);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      resolve({ fps: Math.round(frames / (DURATION / 1000)) });
    }
  };

  requestAnimationFrame(tick);
}));
```

### Step 8 — Collect CDP metrics and Web Vitals

Wait 1.5 s for LCP to settle after scroll:

```javascript
await page.waitForTimeout(1500);

const { metrics } = await cdp.send('Performance.getMetrics');
const cdpMetrics = Object.fromEntries(metrics.map(m => [m.name, m.value]));

const vitals = await page.evaluate(() => {
  const p = window.__perf;
  return {
    lcp: p.lcp,
    cls: p.cls,
    inp: p.inp,
    // Keep only the top 5 shifts by value; trim source strings to 80 chars
    shifts: (p.shifts || [])
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(s => ({
        value: s.value,
        sources: (s.sources || []).filter(Boolean).map(h => h.slice(0, 80)),
      })),
  };
});
```

Key CDP fields to extract:

| Field | Description |
|-------|-------------|
| `TaskDuration` | Total main-thread busy time (s) |
| `ScriptDuration` | JS execution time (s) |
| `RecalcStyleDuration` | Style recalc time (s) |
| `LayoutDuration` | Layout time (s) |
| `JSHeapUsedSize` | JS heap in bytes |
| `GPUMainFrameUsedTextureMegaBytes` | GPU texture pressure (MB) |

### Step 9 — Screenshot + return (inside browser_run_code)

Take the screenshot and return the MetricsBundle JSON **as the last two statements of the same `browser_run_code` call**. Do not call a separate `browser_take_screenshot` tool — it cannot write to a file path and will not produce a saved screenshot.

```javascript
await page.screenshot({ path: screenshot_path, fullPage: false });

return JSON.stringify({ /* MetricsBundle as documented below */ });
```

Both statements must be inside the single `browser_run_code` invocation so that `page` is in scope for the screenshot and the return value carries the metrics.

### Step 10 — Close browser (throttled-desktop profile only)

After `browser_run_code` returns, if `profile` is `throttled-desktop`, call `browser_close`. This is the final pass and the browser is no longer needed. Do **not** call `browser_close` after the baseline pass — the throttled pass needs a clean browser state and will call `browser_close` itself at Step 1.

## Output — MetricsBundle

Return a compact structured object. **Never return the raw resource list** — use the pre-summarised `resourceSummary` and `resourceTotals` from Step 5.

```json
{
  "profile": "desktop-baseline | throttled-desktop",
  "url": "<url>",
  "vitals": {
    "lcpMs": 1234,
    "cls": 0.05,
    "inpMs": 80,
    "shifts": [{ "value": 0.03, "sources": ["<img class=\"hero\"..."] }]
  },
  "fps": 58,
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
    "font":   { "count": 4,  "transferKB": 120 },
    "fetch":  { "count": 6,  "transferKB": 40 }
  },
  "resourceSummary": {
    "img": [
      { "filename": "hero.jpg", "type": "img", "durationMs": 340, "transferKB": 180, "decodedKB": 920, "renderBlocking": false }
    ],
    "script": [
      { "filename": "main.js", "type": "script", "durationMs": 210, "transferKB": 95, "decodedKB": 310, "renderBlocking": true }
    ]
  },
  "screenshotPath": "/tmp/perf-baseline.png",
  "notes": []
}
```

Include any timeout fallbacks or anomalies in `notes`.
