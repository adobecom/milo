#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, import/no-extraneous-dependencies, import/extensions */
// BC drawer layout check (pushed vs. narrower viewport). See README.md in this folder.
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');
const { chromium } = require('playwright');
const { PNG } = require('playwright-core/lib/utilsBundle');

const { values: args } = parseArgs({
  options: {
    pages: { type: 'string', default: path.join(__dirname, 'pages.txt') },
    milolibs: { type: 'string', default: 'local' },
    widths: { type: 'string', default: '1920,1600,1440,1280' },
    drawer: { type: 'string', default: '400' },
    out: { type: 'string', default: `test-drawer-layout-results/${new Date().toISOString().replace(/[:.]/g, '-')}` },
    concurrency: { type: 'string', default: '3' },
    height: { type: 'string', default: '900' },
  },
});
const DRAWER = Number(args.drawer);
const WIDTHS = args.widths.split(',').map(Number);
const OUT = path.resolve(args.out);
const HEIGHT = Number(args.height);
// Jarvis can't mount into the drawer from hosted bundles yet; blocking it keeps the drawer shell (and its
// push) deterministic and keeps a native floating window from covering content.
const BLOCK = /(^|\.)messaging\.adobe\.com$|(^|\.)assistant\.adobe\.com$|^assistant-[a-z]+\.adobe\.io$/;
const HIDE_CSS = [
  '.dynamic-nav-status', // stage-only gnav badge
  '#onetrust-consent-sdk', // cookie banner
  '#acomAssistant-gnav-mount', // drawer entry point (Jarvis gnav icon)
  '.feds-bc-wrapper', // gnav BC entry point intentionally collapses while the drawer is open
].map((s) => `${s} { visibility: hidden !important; }`).join('\n');

function freezeMedia() {
  const stop = (m) => {
    m.pause();
    if (!m.dataset.layoutCheckFrozen) {
      m.dataset.layoutCheckFrozen = '1';
      if (m.currentTime) m.currentTime = 0;
    }
  };
  HTMLMediaElement.prototype.play = function play() { stop(this); return Promise.resolve(); };
  document.addEventListener('play', (e) => stop(e.target), true);
}

// Condensed from Adobe-acom/nala-visual-runner tools/screenshot-diff/lib/settle.js: wait for Milo's staged
// section loading and footer, force lazy images, then require a quiet period with no layout changes.
async function settle(page, { quietMs = 2500, capMs = 30000 } = {}) {
  return page.evaluate(async ({ quiet, cap }) => {
    const start = performance.now();
    let changedAt = start;
    let sig = '';
    const sleep = (ms = 100) => new Promise((r) => { setTimeout(r, ms); });
    const expired = () => performance.now() - start >= cap;
    const height = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const miloPending = () => {
      if (document.querySelectorAll('main > div[data-status]').length) return true;
      const footer = document.querySelector('footer');
      const off = document.querySelector('meta[name="footer"]')?.content === 'off';
      return !(off || !footer || footer.childElementCount > 0);
    };
    const eager = () => { [...document.images].forEach((i) => { if (i.loading === 'lazy') i.loading = 'eager'; }); };
    const obs = new PerformanceObserver((l) => { if (l.getEntries().length) changedAt = performance.now(); });
    obs.observe({ type: 'layout-shift', buffered: true });
    try {
      while (miloPending() && !expired()) await sleep();
      for (let y = 0; y < height() && !expired(); y += 600) { window.scrollTo(0, y); eager(); await sleep(); }
      window.scrollTo(0, 0);
      changedAt = performance.now();
      while (!expired()) {
        eager();
        const next = `${height()}|${document.documentElement.scrollWidth}`;
        const busy = [...document.images].some((i) => !i.complete)
          || document.fonts.status !== 'loaded' || miloPending();
        if (next !== sig || busy) { sig = next; changedAt = performance.now(); window.scrollTo(0, 0); }
        if (performance.now() - changedAt >= quiet) return { settled: true, ms: Math.round(performance.now() - start) };
        await sleep();
      }
      return { settled: false, ms: Math.round(performance.now() - start) };
    } finally { obs.disconnect(); }
  }, { quiet: quietMs, cap: capMs });
}

// Breakpoint-independent check: visible content extending under the open drawer (x > limit).
function findUnderDrawer(limit) {
  const panel = document.querySelector('#chat-panel');
  const hits = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (panel?.contains(el) || el.closest('#acomAssistant-gnav-mount, .dynamic-nav-status')) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.right <= limit + 2) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const pcs = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(pcs.overflowX) && p.getBoundingClientRect().right <= limit + 2) return;
    }
    if (hits.some((h) => h.el.contains(el))) return;
    const classes = el.classList.length ? `.${[...el.classList].slice(0, 2).join('.')}` : '';
    hits.push({
      el,
      name: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${classes}`,
      right: Math.round(r.right),
      position: cs.position,
      top: Math.round(r.top + window.scrollY),
    });
  });
  return hits.map(({ el, ...h }) => h);
}

function withParams(url, params) {
  const u = new URL(url);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.href;
}

async function capture(browser, { url, width, drawerOpen, file }) {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  try {
    await context.addInitScript(freezeMedia);
    // Open the drawer through Milo's reopen path (prior open state + BC session cookie) rather than
    // clicking the Jarvis gnav icon, which never renders while Jarvis is blocked.
    if (drawerOpen) {
      await context.addInitScript(() => {
        localStorage.setItem('bc-side-overlay', 'open');
        document.cookie = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_bc_session_id=layout-check; path=/';
      });
    }
    await context.route((u) => BLOCK.test(u.hostname), (r) => r.abort());
    const page = await context.newPage();
    // Both sides have the flag on (same gnav); only A opens the drawer.
    await page.goto(withParams(url, { milolibs: args.milolibs, 'acom-assistant-panel': 'on', martech: 'off' }), { waitUntil: 'load', timeout: 60000 });
    if (drawerOpen) {
      await page.waitForFunction(() => document.body.classList.contains('chat-panel-open'), null, { timeout: 30000 });
    }
    const status = await settle(page);
    const underDrawer = drawerOpen ? await page.evaluate(findUnderDrawer, width - DRAWER) : [];
    const foundation = await page.evaluate(() => document.querySelector('meta[name="foundation"]')?.content || 'c1');
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({
      path: file,
      fullPage: true,
      animations: 'disabled',
      style: HIDE_CSS,
      clip: { x: 0, y: 0, width: drawerOpen ? width - DRAWER : width, height: docHeight },
    });
    return { ...status, foundation, underDrawer };
  } finally {
    await context.close();
  }
}

// Per-pixel diff over the overlapping region; differing pixels red, the rest a faded copy of A.
function compare(fileA, fileB, fileDiff) {
  const a = PNG.sync.read(fs.readFileSync(fileA));
  const b = PNG.sync.read(fs.readFileSync(fileB));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width, height });
  let pixels = 0;
  let firstDiffY = null;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const ia = (y * a.width + x) * 4;
      const ib = (y * b.width + x) * 4;
      const id = (y * width + x) * 4;
      const delta = Math.max(
        Math.abs(a.data[ia] - b.data[ib]),
        Math.abs(a.data[ia + 1] - b.data[ib + 1]),
        Math.abs(a.data[ia + 2] - b.data[ib + 2]),
      );
      if (delta > 51) {
        pixels += 1;
        if (firstDiffY === null) firstDiffY = y;
        diff.data.set([255, 0, 0, 255], id);
      } else {
        const g = 200 + ((a.data[ia] + a.data[ia + 1] + a.data[ia + 2]) / 3) * (55 / 255);
        diff.data.set([g, g, g, 255], id);
      }
    }
  }
  fs.writeFileSync(fileDiff, PNG.sync.write(diff));
  return { ratio: pixels / (width * height), heightA: a.height, heightB: b.height, firstDiffY };
}

async function pool(items, n, fn) {
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (next < items.length) {
      const i = next;
      next += 1;
      results[i] = await fn(items[i]);
    }
  }));
  return results;
}

function report(rows) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rel = (f) => path.relative(OUT, f);
  const section = (r) => {
    const head = `<h2>${esc(r.url)} @ W=${r.width} (B=${r.width - DRAWER})</h2>`;
    if (r.error) return `<section class="err">${head}<pre>${esc(r.error)}</pre></section>`;
    const under = r.a.underDrawer.length
      ? esc(r.a.underDrawer.map((h) => `${h.name} (right ${h.right}, ${h.position}, y ${h.top})`).join('; '))
      : 'none';
    return `<section class="${r.cmp.ratio > 0.01 || r.a.underDrawer.length ? 'bad' : 'ok'}">${head}
  <p>diff ${(r.cmp.ratio * 100).toFixed(2)}% · height A ${r.cmp.heightA} / B ${r.cmp.heightB} · first diff y=${r.cmp.firstDiffY ?? '–'}
   · foundation ${esc(r.a.foundation)} · settled A ${r.a.settled} B ${r.b.settled}</p>
  <p>under drawer: ${under}</p>
  <div class="row"><figure><figcaption>A: drawer open, cropped</figcaption><img src="${rel(r.fileA)}"></figure>
  <figure><figcaption>B: no drawer at W−${DRAWER}</figcaption><img src="${rel(r.fileB)}"></figure>
  <figure><figcaption>diff</figcaption><img src="${rel(r.fileDiff)}"></figure></div></section>`;
  };
  fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><title>drawer layout check</title>
<style>body{font:14px system-ui;margin:16px} section{border-left:6px solid #2a2;padding:4px 12px;margin:16px 0}
section.bad{border-color:#d33} section.err{border-color:#999} .row{display:flex;gap:8px;align-items:flex-start}
figure{margin:0;flex:1;max-height:80vh;overflow:auto;border:1px solid #ccc} img{width:100%;display:block}</style>
<h1>BC drawer layout check</h1><p>milolibs=${esc(args.milolibs)} · drawer ${DRAWER}px · widths ${WIDTHS.join(', ')}</p>
${rows.map(section).join('\n')}
<script>document.querySelectorAll('.row').forEach((row) => {
  const figs = [...row.querySelectorAll('figure')];
  figs.forEach((f) => f.addEventListener('scroll', () => {
    const synced = f.scrollTop === f.syncTop && f.scrollLeft === f.syncLeft;
    f.syncTop = null; f.syncLeft = null;
    if (synced) return;
    figs.forEach((o) => {
      if (o === f) return;
      const [top, left] = [o.scrollTop, o.scrollLeft];
      o.scrollTop = f.scrollTop; o.scrollLeft = f.scrollLeft;
      if (o.scrollTop !== top || o.scrollLeft !== left) [o.syncTop, o.syncLeft] = [o.scrollTop, o.scrollLeft];
    });
  }));
});</script>`);
}

(async () => {
  const pages = fs.readFileSync(path.resolve(args.pages), 'utf8').split('\n').map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    channel: 'chrome',
    // Public stage pages loading ?milolibs=local from localhost.
    args: ['--disable-features=LocalNetworkAccessChecks,LocalNetworkAccessChecksWebRTC'],
  });
  const jobs = pages.flatMap((url) => WIDTHS.map((width) => ({ url, width })));
  const t0 = Date.now();
  const rows = await pool(jobs, Number(args.concurrency), async ({ url, width }) => {
    const slug = `${new URL(url).pathname.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home'}-${width}`;
    const fileA = path.join(OUT, `${slug}-a.png`);
    const fileB = path.join(OUT, `${slug}-b.png`);
    const fileDiff = path.join(OUT, `${slug}-diff.png`);
    try {
      const a = await capture(browser, { url, width, drawerOpen: true, file: fileA });
      const b = await capture(browser, { url, width: width - DRAWER, drawerOpen: false, file: fileB });
      const cmp = compare(fileA, fileB, fileDiff);
      console.log(`${(cmp.ratio * 100).toFixed(2).padStart(6)}%  W=${width}  ${url}  (under drawer: ${a.underDrawer.length})`);
      a.underDrawer.slice(0, 6).forEach((h) => console.log(`         ↳ ${h.name} right=${h.right} ${h.position} y=${h.top}`));
      return {
        url, width, a, b, cmp, fileA, fileB, fileDiff,
      };
    } catch (error) {
      console.log(`  ERROR  W=${width}  ${url}: ${error.message.split('\n')[0]}`);
      return { url, width, error: error.message };
    }
  });
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(rows, null, 2));
  report(rows);
  console.log(`\n${rows.length} comparisons in ${Math.round((Date.now() - t0) / 1000)}s → ${path.join(OUT, 'index.html')}`);
})().catch((e) => { console.error(e); process.exit(1); });
