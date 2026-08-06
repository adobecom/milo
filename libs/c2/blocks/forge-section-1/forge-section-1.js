/**
 * forge-section-1 — a Milo C2 block for a "parallax featured-card media" section:
 * five overlapping, slightly-tilted document mock cards (industry report, invoice,
 * white-paper, quarterly media-mix, plus a coral accent) floating on a light field.
 *
 * DA authoring serialises a block as a FLAT, class-LESS run of <h*>/<p>/<picture>
 * in document order — the grid/tile/row wrappers and the Figma classes are gone by
 * the time init() runs. So init() probes the flat stream by CONTENT shape (marker
 * text: "INVOICE", the first <picture>, "MEDIA"), partitions it into the four
 * content-bearing cards, and RECONSTRUCTS the collage with createElement, stamping
 * the part classes the scoped CSS keys on. The build is assembled detached and
 * swapped in with a single replaceChildren (never innerHTML-wipes authored DOM),
 * so a mid-build throw leaves the original content intact.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// Milo C2 services: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is THREE
// hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT (L30).
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-section-1';

// Design proportions that vanish from the flattened content (C24): the report's
// 12-bar sparkline heights and the media-mix bar widths/colours, carried as
// positional arrays keyed to the rebuilt DOM order.
const REPORT_BARS = [72, 85, 55, 45, 65, 35, 50, 40, 28, 38, 22, 18];
const MM_BARS = [
  { w: 100, bg: '#3d5572', light: false },
  { w: 57, bg: '#40739b', light: false },
  { w: 40, bg: '#588cb4', light: false },
  { w: 37, bg: '#a5bdcf', light: true },
];

// MEP / personalization markers Milo may stamp on authored nodes — carry them
// across the rebuild so a later Target/MEP swap still finds them (C11).
const MEP_RE = /^data-(manifest-id|adobe-target-testid|mep-)/;

function tag(name, className) {
  const node = document.createElement(name);
  if (className) node.className = className;
  return node;
}

function txt(node) {
  return (node?.textContent || '').replace(/\s+/g, ' ').trim();
}

function hasBreak(node) {
  return !!node?.querySelector?.('br');
}

function copyMep(from, to) {
  if (!from || !to) return;
  [...(from.attributes || [])].forEach((a) => {
    if (MEP_RE.test(a.name)) to.setAttribute(a.name, a.value);
  });
}

// Rebuild an authored flat node as `name.cls`, cloning its inline content so
// <br> and any inline markup survive, and carrying MEP markers over. Cloning
// (not moving) keeps the source DOM intact until the final replaceChildren.
function reTag(src, name, cls) {
  const out = tag(name, cls);
  [...src.childNodes].forEach((c) => out.appendChild(c.cloneNode(true)));
  copyMep(src, out);
  return out;
}

function pictureIn(node) {
  if (!node) return null;
  return node.matches?.('picture') ? node : node.querySelector?.('picture, img') || null;
}

function buildReport(nodes) {
  const card = tag('div', 'fs1-card fs1-report');
  const bodies = [];
  const labels = [];
  const heads = [];
  let title = null;
  let chartTitle = null;
  nodes.forEach((n) => {
    const t = txt(n);
    if (!t) return;
    if (!title && (/global fintech|opportunities/i.test(t) || hasBreak(n))) { title = reTag(n, 'h2', 'rpt__title'); return; }
    if (/adoption index/i.test(t)) { chartTitle = reTag(n, 'div', 'rpt__chart-title'); return; }
    if (t.length > 60) { bodies.push(reTag(n, 'p', 'rpt__body')); return; }
    if (t.length <= 3) { labels.push(t); return; }
    heads.push(t);
  });
  heads.slice(0, 2).forEach((h, i) => {
    const node = tag('div', i === 0 ? 'rpt__brand' : 'rpt__eyebrow');
    node.textContent = h;
    card.appendChild(node);
  });
  if (title) card.appendChild(title);
  bodies.forEach((b) => card.appendChild(b));
  if (chartTitle) card.appendChild(chartTitle);
  const bars = tag('div', 'rpt__bars');
  REPORT_BARS.forEach((h) => {
    const bar = tag('div', 'rpt__bar');
    bar.style.height = `${h}%`;
    bars.appendChild(bar);
  });
  card.appendChild(bars);
  if (labels.length) {
    const row = tag('div', 'rpt__labels');
    labels.forEach((l) => {
      const s = tag('div', 'rpt__label');
      s.textContent = l;
      row.appendChild(s);
    });
    card.appendChild(row);
  }
  return card;
}

function buildInvoice(nodes) {
  const card = tag('div', 'fs1-card fs1-invoice');
  if (nodes[0]) card.appendChild(reTag(nodes[0], 'h3', 'inv__title'));
  if (nodes[1]) card.appendChild(reTag(nodes[1], 'div', 'inv__co'));
  const mid = nodes.slice(2).filter((n) => txt(n));
  const footSrc = mid.length > 1 && /murphy design/i.test(txt(mid[mid.length - 1])) ? mid.pop() : null;
  const body = tag('div', 'inv__body');
  mid.forEach((n) => body.appendChild(reTag(n, 'div', 'inv__line')));
  card.appendChild(body);
  if (footSrc) card.appendChild(reTag(footSrc, 'div', 'inv__footer'));
  return card;
}

function buildWhitePaper(nodes) {
  const card = tag('div', 'fs1-card fs1-wp');
  const pics = [];
  let title = null;
  let contact = null;
  nodes.forEach((n) => {
    const pic = pictureIn(n);
    if (pic) { pics.push(pic.cloneNode(true)); return; }
    const t = txt(n);
    if (!t) return;
    if (/white paper/i.test(t)) title = reTag(n, 'h3', 'wp__title');
    else if (/think tank|monobloc|@/i.test(t)) contact = reTag(n, 'div', 'wp__contact');
  });
  const [decoOut, photo, decoIn] = pics;
  if (decoOut) { decoOut.classList.add('wp__deco-out'); card.appendChild(decoOut); }
  const frame = tag('div', 'wp__frame');
  if (photo) { photo.classList.add('wp__photo-pic'); frame.appendChild(photo); }
  const copy = tag('div', 'wp__copy');
  if (decoIn) { decoIn.classList.add('wp__deco-in'); copy.appendChild(decoIn); }
  const textWrap = tag('div', 'wp__text');
  if (title) textWrap.appendChild(title);
  if (contact) textWrap.appendChild(contact);
  copy.appendChild(textWrap);
  frame.appendChild(copy);
  card.appendChild(frame);
  return card;
}

function buildMediaMix(nodes) {
  const card = tag('div', 'fs1-card fs1-mm');
  const tabs = tag('div', 'mm__tabs');
  const bars = tag('div', 'mm__bars');
  let title = null;
  let barIdx = 0;
  nodes.forEach((n) => {
    const t = txt(n);
    if (!t) return;
    if (/media mix/i.test(t)) { title = reTag(n, 'h3', 'mm__title'); return; }
    if (/^(media|q3 mix)$/i.test(t)) {
      tabs.appendChild(reTag(n, 'div', /^media$/i.test(t) ? 'mm__tab mm__tab--active' : 'mm__tab'));
      return;
    }
    const cfg = MM_BARS[barIdx] || MM_BARS[MM_BARS.length - 1];
    const bar = tag('div', `mm__bar${cfg.light ? ' mm__bar--light' : ''}`);
    bar.style.width = `${cfg.w}%`;
    bar.style.background = cfg.bg;
    bar.appendChild(reTag(n, 'div', 'mm__bar-label'));
    bars.appendChild(bar);
    barIdx += 1;
  });
  if (tabs.children.length) card.appendChild(tabs);
  if (title) card.appendChild(title);
  card.appendChild(tag('div', 'mm__sep'));
  card.appendChild(bars);
  return card;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);
  try {
    // Un-wrap the EDS row/cell wrappers to reach the flat content, carrying any
    // MEP markers up to the block root before the wrapper is discarded.
    const inner = el.querySelector(':scope > div > div');
    if (inner) {
      copyMep(inner.parentElement, el);
      while (inner.firstChild) el.appendChild(inner.firstChild);
      inner.parentElement?.remove();
    }

    const nodes = [...el.children].filter((n) => (
      n.nodeType === 1 && (txt(n) || pictureIn(n))
    ));
    if (!nodes.length) { el.dataset.forgeAuthored = BLOCK; return; }

    // Partition the flat stream into the four content cards by content markers.
    const findIdx = (pred) => nodes.findIndex(pred);
    const iInvoice = findIdx((n) => /^invoice$/i.test(txt(n)));
    const iPic = findIdx((n) => pictureIn(n));
    const iMedia = findIdx((n) => /^media$/i.test(txt(n)));
    const end = nodes.length;
    const rEnd = iInvoice >= 0 ? iInvoice : (iPic >= 0 ? iPic : (iMedia >= 0 ? iMedia : end));
    const invEnd = iPic >= 0 ? iPic : (iMedia >= 0 ? iMedia : end);
    const wpEnd = iMedia >= 0 ? iMedia : end;

    const gReport = nodes.slice(0, rEnd);
    const gInvoice = iInvoice >= 0 ? nodes.slice(iInvoice, invEnd) : [];
    const gWp = iPic >= 0 ? nodes.slice(iPic, wpEnd) : [];
    const gMedia = iMedia >= 0 ? nodes.slice(iMedia) : [];

    const stage = tag('div', 'fs1-stage');
    const box = tag('div', 'fs1-inner');
    stage.appendChild(box);
    // Paint order = stacking order: report (back) → coral → invoice → wp → media (front).
    if (gReport.length) box.appendChild(buildReport(gReport));
    const coral = tag('div', 'fs1-card fs1-coral');
    coral.setAttribute('aria-hidden', 'true');
    box.appendChild(coral);
    if (gInvoice.length) box.appendChild(buildInvoice(gInvoice));
    if (gWp.length) box.appendChild(buildWhitePaper(gWp));
    if (gMedia.length) box.appendChild(buildMediaMix(gMedia));

    el.replaceChildren(stage);

    // Milo typography service (best-effort): promotes headings; our scoped part
    // classes are more specific, so the collage layout is unaffected.
    try { decorateBlockText(box); } catch { /* typography is non-critical */ }

    // Deterministic analytics floor: tag every rebuilt image; trust lazy-loading.
    [...el.querySelectorAll('img')].forEach((img, i) => {
      if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', `${BLOCK}|image-${i + 1}`);
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  } catch (e) {
    window.lana?.log?.(`${BLOCK} decorate failed: ${e}`, { tags: BLOCK, severity: 'error' });
  }
  el.dataset.forgeAuthored = BLOCK;
}
