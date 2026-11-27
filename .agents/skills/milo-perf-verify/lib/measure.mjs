// One measured page load: in-page PerformanceObservers (LCP, layout shifts, FCP), CDP network events with
// initiator stacks, and a Chrome trace for main-thread long tasks (TBT) and what ran inside them.
import { PROFILES, throttle, routeLocalLibs } from './profiles.mjs';

// Runs in the page before any page script. Keeps entries plus a short selector for every element involved.
export const COLLECTOR = () => {
  const sel = (n) => {
    if (!n || n.nodeType !== 1) return n ? n.nodeName : null;
    const parts = []; let e = n;
    for (let i = 0; i < 4 && e && e.nodeType === 1 && e !== document.body && e !== document.documentElement; i += 1) {
      let s = e.tagName.toLowerCase();
      if (e.id) s += `#${e.id}`;
      const c = [...e.classList].filter((k) => !/^(is-|has-)?(loaded|visible|ready|hidden|active)$/.test(k)).slice(0, 3);
      if (c.length) s += `.${c.join('.')}`;
      parts.unshift(s); e = e.parentElement;
    }
    return parts.join(' > ');
  };
  const rect = (r) => (r ? { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) } : null);
  const P = { lcp: [], shifts: [], fcp: null, lcpEl: null };
  window.__perf = P;
  const obs = (type, fn) => { try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true }); } catch { /* unsupported */ } };
  obs('largest-contentful-paint', (e) => {
    P.lcpEl = e.element || null;
    P.lcp.push({ t: e.startTime, size: e.size, url: e.url || null, el: sel(e.element) });
  });
  obs('layout-shift', (e) => P.shifts.push({
    t: e.startTime, value: e.value, input: e.hadRecentInput,
    sources: (e.sources || []).map((s) => ({ el: sel(s.node), prev: rect(s.previousRect), cur: rect(s.currentRect) })),
  }));
  obs('paint', (e) => { if (e.name === 'first-contentful-paint') P.fcp = e.startTime; });
  P.lt = [];
  obs('longtask', (e) => P.lt.push({ t: Math.round(e.startTime), dur: Math.round(e.duration) }));
  P.snapshot = () => {
    const r = P.lcpEl && P.lcpEl.isConnected ? P.lcpEl.getBoundingClientRect() : null;
    return {
      timeOrigin: performance.timeOrigin, now: performance.now(), fcp: P.fcp, lcp: P.lcp.at(-1) || null,
      lcpRect: r ? { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), width: Math.round(r.width), height: Math.round(r.height) } : null,
      shifts: P.shifts.slice(), longtasks: P.lt.slice(), scrollHeight: document.documentElement.scrollHeight,
    };
  };
};

// web-vitals CLS: the largest session window (gaps < 1 s, window <= 5 s) of shifts without recent input.
export function clsOf(shifts) {
  let best = 0; let cur = 0; let first = null; let last = null;
  for (const s of shifts.filter((x) => !x.input).sort((a, b) => a.t - b.t)) {
    if (first !== null && s.t - last < 1000 && s.t - first < 5000) cur += s.value;
    else { cur = s.value; first = s.t; }
    last = s.t; best = Math.max(best, cur);
  }
  return best;
}

const RENDER_KINDS = new Set(['Layout', 'UpdateLayoutTree', 'Paint', 'ParseHTML', 'ParseAuthorStyleSheet', 'PrePaint', 'Layerize', 'CommitLoad', 'HitTest']);
const SCRIPT_KINDS = new Set(['FunctionCall', 'EvaluateScript', 'v8.evaluateModule', 'v8.compile', 'v8.compileModule', 'TimerFire', 'EventDispatch', 'FireAnimationFrame', 'v8.produceModuleCache', 'XHRReadyStateChange']);

// Long tasks on the page's main thread from a Chrome trace, each with its top-level work attributed to a
// script (function @ file) or a rendering step. Times in ms from navigationStart.
export function longTasksFromTrace(trace, pageUrl, norm) {
  const evs = trace.traceEvents || [];
  const target = new URL(pageUrl);
  const navs = evs.filter((e) => e.name === 'navigationStart' && e.args?.data?.isOutermostMainFrame !== false
    && String(e.args?.data?.documentLoaderURL || '').startsWith(target.origin + target.pathname));
  const nav = navs.at(-1);
  if (!nav) return { error: 'no navigationStart for the page in the trace', tasks: [] };
  const { pid, tid } = nav; const t0 = nav.ts;
  const mine = evs.filter((e) => e.pid === pid && e.tid === tid && e.ph === 'X' && e.ts >= t0).sort((a, b) => a.ts - b.ts);
  const tasks = [];
  for (const task of mine.filter((e) => e.name === 'RunTask' && e.dur >= 50000)) {
    const end = task.ts + task.dur; const work = new Map(); let curEnd = task.ts;
    for (const c of mine) {
      if (c.ts < task.ts || c.ts >= end || c === task) continue;
      if (!SCRIPT_KINDS.has(c.name) && !RENDER_KINDS.has(c.name)) continue;
      if (c.ts < curEnd) continue; // nested inside an already-counted child
      curEnd = c.ts + (c.dur || 0);
      const d = c.args?.data || {};
      const key = SCRIPT_KINDS.has(c.name)
        ? `${d.functionName || c.name}${d.url ? ` @ ${norm(d.url)}` : ''}`
        : c.name;
      work.set(key, (work.get(key) || 0) + (c.dur || 0) / 1000);
    }
    const top = [...work.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key, ms]) => ({ key, ms: Math.round(ms) }));
    tasks.push({ start: Math.round((task.ts - t0) / 1000), dur: Math.round(task.dur / 1000), top });
  }
  return { tasks };
}

// Lighthouse-style TBT: the part of each long task after FCP, beyond 50 ms, within [fcp, windowEnd].
export function tbtOf(tasks, fcp, windowEnd) {
  let tbt = 0;
  for (const t of tasks) {
    const s = Math.max(t.start, fcp); const e = Math.min(t.start + t.dur, windowEnd);
    if (e - s > 50) tbt += e - s - 50;
  }
  return Math.round(tbt);
}

// URL normalization so before and after are comparable: the side's Milo origin becomes {milo}, the page's own
// origin {site}, volatile query parameters go.
export function makeNormalizer(pageUrl, miloOrigin) {
  const site = new URL(pageUrl).origin;
  return (raw) => {
    let u;
    try { u = new URL(raw); } catch { return raw; }
    if (u.protocol === 'data:' || u.protocol === 'blob:') return `${u.protocol}…`;
    for (const k of [...u.searchParams.keys()]) {
      if (/^(milolibs|martech|t|ts|_|cb|cachebust(er)?|v|rnd|nocache)$/i.test(k)) u.searchParams.delete(k);
    }
    let origin = u.origin;
    if (miloOrigin && origin === miloOrigin) origin = '{milo}';
    else if (origin === site) origin = '{site}';
    const q = u.searchParams.toString();
    return `${origin}${u.pathname}${q ? `?${q}` : ''}`;
  };
}

function stackOf(initiator, norm) {
  const frames = [];
  for (let s = initiator?.stack; s && frames.length < 8; s = s.parent) {
    for (const f of s.callFrames || []) {
      if (frames.length >= 8) break;
      frames.push({ fn: f.functionName || '(anonymous)', url: norm(f.url), line: f.lineNumber + 1 });
    }
  }
  return frames;
}

// Wait until the network has been quiet for quietMs and at least minMs passed since navigation; capped.
async function settle(page, net, { quietMs = 2000, minMs = 0, capMs = 30000 }) {
  const start = Date.now();
  for (;;) {
    const elapsed = Date.now() - start;
    if (elapsed > capMs) return 'cap';
    if (elapsed >= minMs && Date.now() - net.lastActivity >= quietMs && net.inflight.size === 0) return 'quiet';
    await page.waitForTimeout(250);
  }
}

// One cold load. opts: { url, profile, localPort, scroll, video: { dir } , trace }
export async function measureRun(browser, opts) {
  const { url, profile, localPort, scroll = true, video, trace = true, block = [] } = opts;
  const p = PROFILES[profile];
  const contextOpts = { ...p.context, ignoreHTTPSErrors: false, serviceWorkers: 'block' };
  if (video) contextOpts.recordVideo = { dir: video.dir, size: p.context.viewport };
  const context = await browser.newContext(contextOpts);
  const tCreated = Date.now();
  const page = await context.newPage();
  await page.addInitScript(COLLECTOR);
  await routeLocalLibs(page, localPort);
  // Hosts the caller chose to take out of the comparison (a third party that hangs from this network).
  for (const host of block) await context.route((u) => u.hostname === host, (r) => r.abort('blockedbyclient'));
  const cdp = await throttle(context, page, profile);

  const reqs = new Map(); const net = { lastActivity: Date.now(), inflight: new Set() };
  cdp.on('Network.requestWillBeSent', (e) => {
    net.lastActivity = Date.now(); net.inflight.add(e.requestId);
    const prev = reqs.get(e.requestId);
    reqs.set(e.requestId, {
      url: e.request.url, method: e.request.method, type: e.type, wallTime: e.wallTime, ts: e.timestamp,
      initiator: e.initiator, redirects: prev ? [...(prev.redirects || []), prev.url] : [],
    });
  });
  cdp.on('Network.responseReceived', (e) => {
    const r = reqs.get(e.requestId); if (!r) return;
    r.status = e.response.status; r.mime = e.response.mimeType; r.protocol = e.response.protocol;
    r.cache = e.response.fromDiskCache || e.response.fromServiceWorker || e.response.fromPrefetchCache || false;
  });
  const done = (e, failed) => {
    net.lastActivity = Date.now(); net.inflight.delete(e.requestId);
    const r = reqs.get(e.requestId); if (!r) return;
    r.endTs = e.timestamp; r.bytes = e.encodedDataLength ?? 0; if (failed) r.failed = e.errorText || true;
  };
  cdp.on('Network.loadingFinished', (e) => done(e, false));
  cdp.on('Network.loadingFailed', (e) => done(e, true));

  if (trace) {
    await browser.startTracing(page, {
      categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink.user_timing', 'loading', 'v8.execute', 'toplevel'],
    });
  }
  const tNav = Date.now();
  let navError = null;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  } catch (e) { navError = e.message.split('\n')[0]; }
  // Milo's delayed phase (libs/scripts/delayed.js) starts ~3 s after LCP; wait past it so its work is counted.
  const settled = await settle(page, net, { quietMs: 2000, minMs: 4500, capMs: 40000 });
  const load = await page.evaluate(() => window.__perf.snapshot());

  let afterScroll = null;
  if (scroll && !navError) {
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => { setTimeout(r, 350); });
      }
    });
    await settle(page, net, { quietMs: 1500, minMs: 1000, capMs: 15000 });
    afterScroll = await page.evaluate(() => window.__perf.snapshot());
  }

  let traceJson = null;
  if (trace) traceJson = JSON.parse((await browser.stopTracing()).toString('utf8'));
  if (trace && process.env.PERF_SAVE_TRACE) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(`${process.env.PERF_SAVE_TRACE}-${profile}-${Date.now()}.json`, JSON.stringify(traceJson));
  }
  const finalUrl = page.url();
  const videoPath = video ? await page.video()?.path() : null;
  await context.close();

  // The side's Milo origin: wherever utils.js came from.
  const utils = [...reqs.values()].find((r) => /\/libs\/utils\/utils\.js(\?|$)/.test(r.url));
  const miloOrigin = utils ? new URL(utils.url).origin : null;
  const norm = makeNormalizer(url, miloOrigin);
  const t0 = load.timeOrigin;
  const lcpMs = load.lcp?.t ?? null;
  const requests = [...reqs.values()].filter((r) => /^https?:/.test(r.url)).map((r) => {
    const startMs = r.wallTime * 1000 - t0;
    const endMs = r.endTs != null ? startMs + (r.endTs - r.ts) * 1000 : null;
    return {
      url: r.url, norm: norm(r.url), type: r.type, method: r.method, status: r.status ?? null, failed: r.failed || false,
      bytes: r.bytes ?? 0, startMs: Math.round(startMs), endMs: endMs != null ? Math.round(endMs) : null,
      preLcp: lcpMs != null && startMs < lcpMs,
      initiator: { type: r.initiator?.type, url: r.initiator?.url ? norm(r.initiator.url) : null, stack: stackOf(r.initiator, norm) },
    };
  }).sort((a, b) => a.startMs - b.startMs);

  const lt = traceJson ? longTasksFromTrace(traceJson, finalUrl, norm) : { tasks: [] };
  const windowEnd = Math.round(load.now);
  const loadShifts = load.shifts;
  const allShifts = afterScroll ? afterScroll.shifts : loadShifts;
  return {
    url, finalUrl, profile, navError, settled, miloOrigin,
    videoPath, videoOffsetMs: video ? tNav - tCreated : null,
    fcp: load.fcp != null ? Math.round(load.fcp) : null,
    lcp: load.lcp ? { t: Math.round(load.lcp.t), el: load.lcp.el, url: load.lcp.url ? norm(load.lcp.url) : null, size: load.lcp.size, rect: load.lcpRect } : null,
    cls: { load: Number(clsOf(loadShifts).toFixed(4)), withScroll: Number(clsOf(allShifts).toFixed(4)) },
    shifts: allShifts.filter((s) => !s.input).map((s) => ({ ...s, value: Number(s.value.toFixed(5)), phase: s.t <= windowEnd ? 'load' : 'scroll' })),
    tbt: load.fcp != null ? tbtOf(lt.tasks, load.fcp, windowEnd) : null,
    tbtWindowMs: windowEnd,
    longTasks: lt.tasks, traceError: lt.error || null,
    // The page's own longtask observer, as a cross-check on the trace (it cannot attribute, the trace can).
    observedLongTasks: load.longtasks,
    requests, scrollHeight: load.scrollHeight,
  };
}
