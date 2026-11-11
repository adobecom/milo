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

// Visible content outside the content area: under the drawer (x > limit) or cut off at the left edge (x < 0).
// Only elements that paint something count (transparent wrappers and overlays are skipped). Hits are grouped by
// the outermost Milo block ([data-block-status]) they belong to, or by the element itself outside any block.
function findOutsideContent(limit) {
  const panel = document.querySelector('#chat-panel');
  const REPLACED = /^(img|video|canvas|svg|iframe|input|button|select|textarea)$/i;
  const paints = (el, cs) => REPLACED.test(el.tagName)
    || cs.backgroundImage !== 'none'
    || !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor)
    || cs.boxShadow !== 'none'
    || ['Top', 'Right', 'Bottom', 'Left'].some((side) => parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none')
    || [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  const hits = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (panel?.contains(el) || el.closest('#acomAssistant-gnav-mount, .dynamic-nav-status')) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const side = (r.right > limit + 2 && 'under drawer') || (r.left < -2 && 'off left edge');
    if (!side || hits.some((h) => h.el.contains(el))) return;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
    const cs = getComputedStyle(el);
    if (!paints(el, cs)) return;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const pr = p.getBoundingClientRect();
      const clips = /(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX);
      if (clips && (side === 'under drawer' ? pr.right <= limit + 2 : pr.left >= -2)) return;
    }
    const name = (node) => `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.classList.length ? `.${[...node.classList].slice(0, 2).join('.')}` : ''}`;
    let block = null;
    for (let p = el; p && p !== document.body; p = p.parentElement) if (p.hasAttribute('data-block-status') || p.hasAttribute('data-block')) block = p;
    hits.push({
      el,
      name: block ? name(block) : name(el),
      side,
      left: Math.round(r.left),
      right: Math.round(r.right),
      position: cs.position,
      top: Math.round(r.top + window.scrollY),
    });
  });
  const groups = new Map();
  hits.forEach(({ el, ...h }) => {
    const key = `${h.name}|${h.side}`;
    const g = groups.get(key);
    if (!g) {
      groups.set(key, { ...h, elements: 1 });
      return;
    }
    g.elements += 1;
    g.left = Math.min(g.left, h.left);
    g.right = Math.max(g.right, h.right);
    g.top = Math.min(g.top, h.top);
  });
  return [...groups.values()];
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
    // Below the page's push breakpoint the drawer overlays content instead of pushing it: nothing to compare.
    // (Checked after settling: the push padding animates in.)
    if (drawerOpen && !parseFloat(await page.evaluate(() => getComputedStyle(document.body).paddingRight))) {
      return { overlay: true };
    }
    const outside = drawerOpen ? await page.evaluate(findOutsideContent, width - DRAWER) : [];
    const foundation = await page.evaluate(() => document.querySelector('meta[name="foundation"]')?.content || 'c1');
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({
      path: file,
      fullPage: true,
      animations: 'disabled',
      style: HIDE_CSS,
      clip: { x: 0, y: 0, width: drawerOpen ? width - DRAWER : width, height: docHeight },
    });
    return { ...status, foundation, outside };
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
  let diffStartY = null;
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
        if (diffStartY === null) diffStartY = y;
        diff.data.set([255, 0, 0, 255], id);
      } else {
        const g = 200 + ((a.data[ia] + a.data[ia + 1] + a.data[ia + 2]) / 3) * (55 / 255);
        diff.data.set([g, g, g, 255], id);
      }
    }
  }
  fs.writeFileSync(fileDiff, PNG.sync.write(diff));
  return { ratio: pixels / (width * height), heightA: a.height, heightB: b.height, diffStartY };
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

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = (ratio) => `${(ratio * 100).toFixed(2)}%`;
const STYLE = `body{font:14px system-ui;margin:16px} a{color:#1473e6} .meta{color:#555}
table{border-collapse:collapse} th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;vertical-align:top}
td.ok{background:#eef8ee} td.bad{background:#fdecea} td.err,td.overlay{background:#eee} td a{display:block;text-decoration:none;color:inherit}
td .ratio{font-weight:600} td small{display:block;color:#555}
.row{display:flex;gap:8px;align-items:flex-start} figure{margin:0;flex:1;max-height:80vh;overflow:auto;border:1px solid #ccc}
figcaption{position:sticky;top:0;background:#fff;padding:2px 4px;font-weight:600} img{width:100%;display:block}`;
// Scrolling any figure in a .row scrolls the others to the same position (same image widths => same page y).
const SYNC_SCRIPT = `<script>document.querySelectorAll('.row').forEach((row) => {
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
});
document.querySelector('#jump')?.addEventListener('click', (e) => {
  const fig = document.querySelector('.row figure');
  const img = fig.querySelector('img');
  fig.scrollTop = Number(e.target.dataset.y) * (img.clientWidth / img.naturalWidth) - 40;
});</script>`;

function detailPage(r, prev, next) {
  const nav = `<p><a href="index.html">← all pages</a>${prev ? ` · <a href="${prev.slug}.html">← prev</a>` : ''}${next ? ` · <a href="${next.slug}.html">next →</a>` : ''}</p>`;
  const head = `<h1>${esc(r.url)} @ W=${r.width}</h1>`;
  const page = (body) => `<!doctype html><meta charset="utf-8"><title>${esc(r.slug)}</title><style>${STYLE}</style>${nav}${head}${body}`;
  if (r.error) return page(`<pre>${esc(r.error)}</pre>`);
  if (r.overlay) return page('<p>The drawer overlays the page at this width (no push), so there is nothing to compare.</p>');
  const outside = r.a.outside.length
    ? `<ul>${r.a.outside.map((h) => `<li>${esc(h.name)}: ${h.side} (${h.elements} element${h.elements > 1 ? 's' : ''}, x ${h.left}–${h.right}, from y ${h.top})</li>`).join('')}</ul>`
    : ' none';
  const rel = (f) => path.relative(OUT, f);
  return `<!doctype html><meta charset="utf-8"><title>${esc(r.slug)}</title><style>${STYLE}</style>${nav}${head}
<p class="meta">A: drawer open at W=${r.width}, cropped to ${r.width - DRAWER}px · B: no drawer at ${r.width - DRAWER}px</p>
<p>diff <b>${pct(r.cmp.ratio)}</b>
${r.cmp.diffStartY === null ? '' : `<button id="jump" data-y="${r.cmp.diffStartY}">jump to first difference</button>`}
· height A ${r.cmp.heightA} / B ${r.cmp.heightB} · settled A ${r.a.settled} B ${r.b.settled}</p>
<p>outside the content area:${outside}</p>
<div class="row"><figure><figcaption>A: drawer open, cropped</figcaption><img src="${rel(r.fileA)}"></figure>
<figure><figcaption>B: no drawer at W−${DRAWER}</figcaption><img src="${rel(r.fileB)}"></figure>
<figure><figcaption>diff</figcaption><img src="${rel(r.fileDiff)}"></figure></div>
${SYNC_SCRIPT}`;
}

function report(rows) {
  rows.forEach((r, i) => {
    fs.writeFileSync(path.join(OUT, `${r.slug}.html`), detailPage(r, rows[i - 1], rows[i + 1]));
  });
  const urls = [...new Set(rows.map((r) => r.url))];
  const cell = (r) => {
    if (!r) return '<td></td>';
    if (r.error) return `<td class="err"><a href="${r.slug}.html">error</a></td>`;
    if (r.overlay) return '<td class="overlay">overlay<small>(no push)</small></td>';
    const bad = r.cmp.ratio > 0.01 || r.a.outside.length;
    const outside = r.a.outside.length ? `<small>${r.a.outside.length} outside content area</small>` : '';
    return `<td class="${bad ? 'bad' : 'ok'}"><a href="${r.slug}.html"><span class="ratio">${pct(r.cmp.ratio)}</span>${outside}</a></td>`;
  };
  const body = urls.map((url) => `<tr><th>${esc(url)}</th>${WIDTHS.map((w) => cell(rows.find((r) => r.url === url && r.width === w))).join('')}</tr>`).join('\n');
  fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><title>drawer layout check</title>
<style>${STYLE}</style>
<h1>BC drawer layout check</h1>
<p class="meta">milolibs=${esc(args.milolibs)} · drawer ${DRAWER}px. Each cell compares the page at W with the drawer open
(cropped) against the page at W−${DRAWER} without it. diff = share of differing pixels. Click a cell for the side-by-side.</p>
<table><tr><th>page</th>${WIDTHS.map((w) => `<th>W=${w}<br><small>B=${w - DRAWER}</small></th>`).join('')}</tr>
${body}</table>`);
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
  // File names come from path + query; pages that would collide get a numeric suffix.
  const slugs = new Map();
  pages.forEach((url) => {
    const u = new URL(url);
    const base = `${u.pathname}${u.search}`.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home';
    let slug = base;
    for (let n = 2; [...slugs.values()].includes(slug); n += 1) slug = `${base}-${n}`;
    slugs.set(url, slug);
  });
  const jobs = pages.flatMap((url) => WIDTHS.map((width) => ({ url, width })));
  const t0 = Date.now();
  const rows = await pool(jobs, Number(args.concurrency), async ({ url, width }) => {
    const slug = `${slugs.get(url)}-${width}`;
    const fileA = path.join(OUT, `${slug}-a.png`);
    const fileB = path.join(OUT, `${slug}-b.png`);
    const fileDiff = path.join(OUT, `${slug}-diff.png`);
    try {
      const a = await capture(browser, { url, width, drawerOpen: true, file: fileA });
      if (a.overlay) {
        console.log(`overlay  W=${width}  ${url}  (drawer overlays at this width; skipped)`);
        return { url, width, slug, overlay: true };
      }
      const b = await capture(browser, { url, width: width - DRAWER, drawerOpen: false, file: fileB });
      const cmp = compare(fileA, fileB, fileDiff);
      console.log(`${pct(cmp.ratio).padStart(7)}  W=${width}  ${url}  (outside content area: ${a.outside.length})`);
      a.outside.slice(0, 6).forEach((h) => console.log(`         ↳ ${h.name} ${h.side} (${h.elements} el) x=${h.left}–${h.right} y=${h.top}`));
      return {
        url, width, slug, a, b, cmp, fileA, fileB, fileDiff,
      };
    } catch (error) {
      console.log(`  ERROR  W=${width}  ${url}: ${error.message.split('\n')[0]}`);
      return { url, width, slug, error: error.message };
    }
  });
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(rows, null, 2));
  report(rows);
  console.log(`\n${rows.length} comparisons in ${Math.round((Date.now() - t0) / 1000)}s → ${path.join(OUT, 'index.html')}`);
})().catch((e) => { console.error(e); process.exit(1); });
