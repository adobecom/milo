/**
 * forge-section-3 — a "document collage" distinctive section.
 *
 * At runtime DA hands init() a FLAT, class-LESS run of headings / paragraphs and
 * two <picture>s in document order (see mocks/body.html) — NONE of the Figma
 * structure (the .usecase / .bento / row wrappers) survives. So init():
 *   1. PROBES that flat run (never a positional / class read),
 *   2. SEGMENTS it into the 5 overlapping "document" cards by forward-only
 *      content markers (White Paper → Growth → Invoice → Media), and
 *   3. RECONSTRUCTS the overlapping collage, stamping its OWN
 *      .forge-section-3-scoped classes that the co-authored CSS keys on.
 *
 * All geometry is expressed in container-query width units (cqw) against a
 * 768×642 design canvas, so the collage scales to whatever width the Milo
 * section gives it (L27: no pinned design-width pixels).
 *
 * Depth note: from libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up
 * (blocks → c2 → libs). The 3-hop specifier below is CORRECT (L30) — do not
 * "fix" it to two hops.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-section-3';
const CANVAS_W = 768;

// px (in the 768-wide Figma space) → container-query width units.
const cq = (px) => `${((px / CANVAS_W) * 100).toFixed(3)}cqw`;

// Absolute geometry of each card within the 768×642 collage (from section.html).
const LAYOUT = {
  report: { l: 630, t: 68, w: 312, h: 438, r: 0.62 },
  whitepaper: { l: 458, t: 202, w: 268, h: 372, r: 0.33 },
  growth: { l: -68, t: 338, w: 204, h: 232, r: -0.48 },
  invoice: { l: 50, t: 78, w: 242, h: 342, r: -0.25 },
  mediamix: { l: 237, t: 203, w: 265, h: 352, r: 0 },
};
// Append (paint) order — later cards sit on top; media-mix is frontmost.
const ORDER = ['report', 'whitepaper', 'growth', 'invoice', 'mediamix'];
const BAR_COLORS = ['#3d5572', '#40739b', '#588cb4', '#a5bdcf'];
const BAR_WIDTHS = [100, 76, 55, 40];

const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  for (const a of MEP_ATTRS) {
    const v = from.getAttribute?.(a);
    if (v != null) to.setAttribute(a, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

const INLINE = new Set(['BR', 'STRONG', 'EM', 'B', 'I', 'SPAN', 'A', 'SUP', 'SUB', 'U', 'SMALL', 'FONT']);
function isTextLeaf(node) {
  if (!(node.textContent || '').trim()) return false;
  return [...node.children].every((c) => INLINE.has(c.tagName));
}

// Flatten `root` into an ordered stream of {type:'pic'|'text', node, text},
// robust to whatever class-less <div>/<p> wrapping DA produced.
function collectItems(root, out = []) {
  for (const child of [...root.children]) {
    if (child.tagName === 'PICTURE') { out.push({ type: 'pic', node: child }); continue; }
    const hasPic = child.querySelector && child.querySelector('picture');
    if (isTextLeaf(child) && !hasPic) {
      out.push({ type: 'text', node: child, text: child.textContent.trim() });
    } else {
      collectItems(child, out);
    }
  }
  return out;
}

function ce(name, className, text) {
  const n = document.createElement(name);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}
function svg(name, attrs) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  return n;
}
function lineChart(cls, points, stroke) {
  const s = svg('svg', { class: cls, viewBox: '0 0 100 40', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  s.appendChild(svg('polyline', {
    points, fill: 'none', stroke, 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }));
  return s;
}
// Move an authored node into `parent`, restyling with our class — keeps its
// text, media and any MEP/analytics attributes intact (C11).
function place(parent, node, cls) {
  if (cls) node.className = cls;
  parent.appendChild(node);
  return node;
}

function makeCard(key) {
  const g = LAYOUT[key];
  const card = ce('div', `fs3-card fs3-card--${key}`);
  card.style.cssText = `left:${cq(g.l)};top:${cq(g.t)};width:${cq(g.w)};height:${cq(g.h)};transform:rotate(${g.r}deg);`;
  return card;
}

function buildReport(card, items) {
  const inner = ce('div', 'fs3-report-inner');
  let phase = 'head';
  items.filter((i) => i.type === 'text').forEach((it) => {
    const t = it.text;
    if (t.length > 80) { phase = 'body'; place(inner, it.node, 'fs3-body fs3-body--tiny'); return; }
    if (phase === 'body') phase = 'foot';
    if (phase === 'head') {
      const eyebrow = t === t.toUpperCase();
      place(inner, it.node, eyebrow ? 'fs3-eyebrow' : 'fs3-title fs3-title--report');
    } else if (/^fig\b/i.test(t)) {
      place(inner, it.node, 'fs3-caption');
    } else {
      place(inner, it.node, 'fs3-chartlabel');
    }
  });
  const chart = lineChart('fs3-chart fs3-chart--report',
    '0,20 9,30 18,3 27,16 36,36 45,19 54,21 63,29 72,6 81,43 90,5 100,11', '#332c6c');
  const caption = inner.querySelector('.fs3-caption');
  if (caption) inner.insertBefore(chart, caption); else inner.appendChild(chart);
  card.appendChild(inner);
}

function buildWhitePaper(card, items) {
  const pic = items.find((i) => i.type === 'pic');
  const uniq = [];
  items.filter((i) => i.type === 'text').forEach((it) => {
    if (uniq.length && uniq[uniq.length - 1].text.toLowerCase() === it.text.toLowerCase()) return;
    uniq.push(it);
  });
  if (pic) { const slot = ce('div', 'fs3-wp-media'); place(slot, pic.node); card.appendChild(slot); }
  const body = ce('div', 'fs3-wp-body');
  uniq.forEach((it, i) => place(body, it.node, i === 0 ? 'fs3-title fs3-title--wp' : 'fs3-wp-contact'));
  card.appendChild(body);
}

function buildGrowth(card, items) {
  const pic = items.find((i) => i.type === 'pic');
  const texts = items.filter((i) => i.type === 'text');
  if (pic) { const bg = ce('div', 'fs3-growth-photo'); place(bg, pic.node); card.appendChild(bg); }
  const chip = texts.find((it) => it.text.toLowerCase() === 'growth');
  const badge = texts.find((it) => /%/.test(it.text));
  const title = texts.find((it) => it !== chip && it !== badge && it.text.trim().split(/\s+/).length >= 2);
  if (chip) place(card, chip.node, 'fs3-growth-chip');
  const panel = ce('div', 'fs3-growth-panel');
  const tabs = ce('div', 'fs3-tabs');
  texts.forEach((it) => {
    if (it === chip || it === title || it === badge) return;
    place(tabs, it.node, 'fs3-tab');
  });
  if (tabs.children.length) {
    tabs.firstElementChild.classList.add('fs3-tab--active');
    panel.appendChild(tabs);
  }
  if (title) place(panel, title.node, 'fs3-title fs3-title--growth');
  const wrap = ce('div', 'fs3-growth-chartwrap');
  wrap.appendChild(lineChart('fs3-chart fs3-chart--growth', '0,36 15,30 30,23 45,16 60,10 80,5 100,2', '#f0877b'));
  if (badge) place(wrap, badge.node, 'fs3-growth-badge');
  panel.appendChild(wrap);
  card.appendChild(panel);
}

function buildInvoice(card, items) {
  const inner = ce('div', 'fs3-inv-inner');
  // Header (title + subtitle) spans full width; the dense body fills the card
  // in two columns so it reads like the multi-column invoice in the comp.
  const body = ce('div', 'fs3-inv-body');
  items.filter((i) => i.type === 'text').forEach((it, i) => {
    if (i === 0) { place(inner, it.node, 'fs3-inv-title'); return; }
    if (i === 1) { place(inner, it.node, 'fs3-inv-sub'); return; }
    let cls = 'fs3-inv-line';
    if (/^\$[\d,]+$/.test(it.text)) cls = 'fs3-inv-amount';
    else if (it.text.length < 24 && it.text === it.text.toUpperCase()) cls = 'fs3-inv-head';
    place(body, it.node, cls);
  });
  inner.appendChild(body);
  card.appendChild(inner);
}

function buildMediaMix(card, items) {
  const texts = items.filter((i) => i.type === 'text');
  const inner = ce('div', 'fs3-mm-inner');
  const titleIdx = texts.findIndex((it) => /media mix/i.test(it.text));
  const cut = titleIdx >= 0 ? titleIdx : 2;
  const tabs = ce('div', 'fs3-tabs');
  texts.slice(0, cut).forEach((it) => place(tabs, it.node, 'fs3-tab'));
  if (tabs.children.length) tabs.firstElementChild.classList.add('fs3-tab--active');
  inner.appendChild(tabs);
  if (titleIdx >= 0) place(inner, texts[titleIdx].node, 'fs3-title fs3-title--mm');
  inner.appendChild(ce('div', 'fs3-mm-divider'));
  const rest = texts.slice(cut + (titleIdx >= 0 ? 1 : 0));
  const joined = rest.map((it) => it.text).join(' ');
  const pairs = [...joined.matchAll(/([A-Za-z][A-Za-z ]*?)\s*(\d{1,3})\s*%/g)].map((m) => ({ label: m[1].trim(), pct: +m[2] }));
  const bars = ce('div', 'fs3-mm-bars');
  if (pairs.length) {
    pairs.forEach((p, i) => {
      const bar = ce('div', `fs3-mm-bar${i === pairs.length - 1 ? ' fs3-mm-bar--light' : ''}`);
      const width = BAR_WIDTHS[i] != null ? BAR_WIDTHS[i] : Math.max(30, Math.min(100, p.pct * 1.7));
      bar.style.cssText = `width:${width}%;height:${cq(p.pct * 2.2)};background:${BAR_COLORS[i] || BAR_COLORS[BAR_COLORS.length - 1]};`;
      bar.appendChild(ce('span', 'fs3-mm-bar-label', p.label));
      bar.appendChild(ce('span', 'fs3-mm-bar-val', `${p.pct}%`));
      bars.appendChild(bar);
    });
  } else {
    rest.forEach((it) => place(bars, it.node, 'fs3-inv-line'));
  }
  inner.appendChild(bars);
  card.appendChild(inner);
}

const BUILDERS = {
  report: buildReport,
  whitepaper: buildWhitePaper,
  growth: buildGrowth,
  invoice: buildInvoice,
  mediamix: buildMediaMix,
};

// Keep at most one <h1> (L8): recreate any extra h1 as an h2, attrs + children intact.
function normalizeHeadings(root) {
  [...root.querySelectorAll('h1')].slice(1).forEach((h1) => {
    const h2 = document.createElement('h2');
    for (const a of h1.attributes) h2.setAttribute(a.name, a.value);
    while (h1.firstChild) h2.appendChild(h1.firstChild);
    h1.replaceWith(h2);
  });
}

// Deterministic analytics floor (C7) — idempotent, never double-tags.
function tagAnalytics(root, lh) {
  root.setAttribute('daa-lh', lh);
  let li = 0;
  root.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    n.setAttribute('daa-ll', `${lh}|${(n.textContent || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24) || `link-${li}`}`);
  });
  let ii = 0;
  root.querySelectorAll('img').forEach((n) => {
    if (n.hasAttribute('daa-im')) return;
    ii += 1;
    n.setAttribute('daa-im', `${lh}|image-${ii}`);
  });
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);
  // Copy MEP markers off the row/cell wrapper before we discard it.
  const cell = el.querySelector(':scope > div > div');
  preserveMepAttrs(cell?.parentElement, el);

  const items = collectItems(el);
  const cards = { report: [], whitepaper: [], growth: [], invoice: [], mediamix: [] };
  const idx = (k) => ORDER.indexOf(k);
  let ci = 0;
  let pics = 0;
  items.forEach((it) => {
    if (it.type === 'pic') {
      pics += 1;
      ci = Math.max(ci, idx(pics >= 2 ? 'growth' : 'whitepaper'));
    } else {
      const t = it.text.toLowerCase();
      if (t === 'white paper') ci = Math.max(ci, idx('whitepaper'));
      else if (t === 'growth') ci = Math.max(ci, idx('growth'));
      else if (t === 'invoice') ci = Math.max(ci, idx('invoice'));
      else if (t === 'media') ci = Math.max(ci, idx('mediamix'));
    }
    cards[ORDER[ci]].push(it);
  });

  const collage = ce('div', 'fs3-collage');
  collage.setAttribute('role', 'img');
  collage.setAttribute('aria-label',
    'Collage of sample business documents: an industry report, a white paper, a growth chart, an invoice and a quarterly media mix.');
  ORDER.forEach((key) => {
    const its = cards[key];
    if (!its.length) return;
    const card = makeCard(key);
    try {
      BUILDERS[key](card, its);
    } catch (e) {
      its.forEach((it) => it.node && card.appendChild(it.node));
    }
    if (card.children.length) collage.appendChild(card);
  });

  normalizeHeadings(collage);
  el.replaceChildren(collage);

  // Milo typography service (canonical specifier, L30) — additive/idempotent.
  const run = (scope) => { try { decorateBlockText(scope); } catch (e) { /* noop */ } };
  try { decorateViewportContent(el, run); } catch (e) { run(el); }

  tagAnalytics(el, BLOCK);
  el.dataset.forgeAuthored = BLOCK;
}
