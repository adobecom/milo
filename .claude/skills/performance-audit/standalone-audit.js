#!/usr/bin/env node
/**
 * Standalone performance audit — no Claude, no repo required.
 *
 * Setup (one time):
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   node standalone-audit.js <url> [output.json]
 *
 * Then transfer the output JSON to your Mac and run:
 *   /performance-audit /path/to/output.json
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const url        = process.argv[2];
const outputFile = process.argv[3] || 'perf-audit.json';

if (!url || !url.startsWith('http')) {
  console.error('Usage: node standalone-audit.js <url> [output.json]');
  process.exit(1);
}

async function runPass(url, profile) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page    = await context.newPage();

  await page.setViewportSize({ width: 1440, height: 900 });

  let cdp;
  if (profile === 'throttled-desktop') {
    cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  await page.addInitScript(() => {
    window.__perf = { inp: null, longTasks: [] };

    new PerformanceObserver(list => {
      for (const e of list.getEntries())
        if (!window.__perf.inp || e.duration > window.__perf.inp)
          window.__perf.inp = e.duration;
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });

    new PerformanceObserver(list => {
      for (const e of list.getEntries())
        window.__perf.longTasks.push({ durationMs: Math.round(e.duration), startMs: Math.round(e.startTime) });
    }).observe({ type: 'longtask', buffered: true });
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  if (!cdp) cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');

  await page.waitForTimeout(3000);
  await page.waitForTimeout(7000);

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
    for (const r of all) { if (!byType[r.type]) byType[r.type] = []; byType[r.type].push(r); }
    const top = {};
    for (const [type, items] of Object.entries(byType))
      top[type] = items.sort((a, b) => b.decodedKB - a.decodedKB).slice(0, 8).map(({ url: _u, ...rest }) => rest);
    return { resourceSummary: top, resourceTotals: totals };
  });

  await page.mouse.move(720, 450);

  await page.evaluate(() => {
    window.__rafTrack = { durations: [], lastTs: null };
    const track = ts => {
      if (window.__rafTrack.lastTs !== null)
        window.__rafTrack.durations.push(Math.round(ts - window.__rafTrack.lastTs));
      window.__rafTrack.lastTs = ts;
      requestAnimationFrame(track);
    };
    requestAnimationFrame(track);
  });

  const { numStops } = await page.evaluate(() => ({
    numStops: Math.min(
      Math.ceil(Math.max(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight, 0) / window.innerHeight),
      12
    ),
  }));

  for (let i = 0; i < numStops; i++) {
    for (let t = 0; t < 5; t++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(16); }
    await page.waitForTimeout(2000);
  }

  // Guarantee the bottom is reached regardless of smooth-scroll inertia (Lenis etc.)
  await page.evaluate(() => window.scrollTo(0, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)));
  await page.waitForTimeout(1000);

  const scrollStats = await page.evaluate(() => {
    const d = window.__rafTrack.durations;
    if (!d.length) return { fpsAvg: 60, fpsMin: 60, fpsMax: 60, rafP50: 16, rafP95: 16, rafMax: 16, jankFrames: 0, totalFrames: 0 };
    const sorted = [...d].sort((a, b) => a - b);
    const p = pct => sorted[Math.min(Math.floor(sorted.length * pct / 100), sorted.length - 1)];
    const avg = Math.round(d.reduce((a, b) => a + b, 0) / d.length);
    return {
      fpsAvg:      avg > 0 ? Math.round(1000 / avg) : 0,
      fpsMin:      Math.round(1000 / sorted[sorted.length - 1]),
      fpsMax:      Math.round(1000 / sorted[0]),
      rafP50:      p(50),
      rafP95:      p(95),
      rafMax:      sorted[sorted.length - 1],
      jankFrames:  d.filter(x => x > 33).length,
      totalFrames: d.length,
    };
  });

  await page.waitForTimeout(1500);

  const { metrics } = await cdp.send('Performance.getMetrics');
  const cdpMetrics  = Object.fromEntries(metrics.map(m => [m.name, m.value]));

  const vitals = await page.evaluate(() => {
    const p = window.__perf;
    return {
      inpMs: p.inp,
      longTasks: (p.longTasks || []).sort((a, b) => b.durationMs - a.durationMs).slice(0, 10),
      totalBlockingTimeMs: (p.longTasks || []).reduce((sum, t) => sum + Math.max(t.durationMs - 50, 0), 0),
    };
  });

  const animationAudit = await page.evaluate(() => {
    const results = [], seen = new Set();
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el), name = s.animationName, wc = s.willChange;
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

  await context.close();
  await browser.close();

  return {
    profile,
    url,
    vitals: { inpMs: vitals.inpMs },
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
    screenshotPath: null,
    notes: [],
  };
}

(async () => {
  console.log('[1/2] Baseline pass (unthrottled)...');
  const baseline = await runPass(url, 'desktop-baseline');

  console.log('[2/2] Throttled pass (4× CPU)...');
  const throttled = await runPass(url, 'throttled-desktop');

  fs.writeFileSync(outputFile, JSON.stringify({ baseline, throttled }, null, 2));
  console.log('Done → ' + path.resolve(outputFile));
  console.log('Transfer to Mac and run: /performance-audit ' + outputFile);
})().catch(e => { console.error(e.message); process.exit(1); });
