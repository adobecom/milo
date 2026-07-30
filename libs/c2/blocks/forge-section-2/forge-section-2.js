/**
 * forge-section-2 — a Milo C2 three-up "app spotlight" bento section
 * (Acrobat / Firefly / Photoshop). Each column is a rounded media card
 * (background asset + optional floating layers + floating chips) above a copy
 * block (headline, body, CTA).
 *
 * DA serializes the authored block as a FLAT, class-LESS run of nodes in
 * document order — NO grid/column/card wrappers survive (C24). For this section
 * that flat run is, per column, roughly:
 *   <picture>(base) … <picture>(layers/icons) <p>(chip labels)
 *   <p>(headline) <p>(body) <a>(CTA)
 * …repeated three times. This decorator PROBES that flat content by SHAPE
 * (never by an authored class or a fixed index — C2) and RECONSTRUCTS the rich
 * layout the Figma frame shows:
 *
 *   .forge-section-2
 *     .fs2-grid
 *       .fs2-col            (one per detected column)
 *         .fs2-card         rounded, aspect-locked media box (reserves layout)
 *           picture.fs2-bg      first asset, object-fit:cover full-bleed
 *           picture.fs2-bg      extra full-bleed layer (single overlay case)
 *           picture.fs2-layer   floating inset mockup(s) (multi/chipped case)
 *           .fs2-chip           floating pill: icon picture(s) + label span
 *         .fs2-copy
 *           h2.fs2-headline + p.fs2-body
 *           a.fs2-cta > span.fs2-cta-label + chevron svg
 *
 * The column boundary is derived from content order (a CTA, or a run of copy
 * paragraphs, followed by the next card's first image) so it is robust to the
 * flat run and NEVER drops a node — every <picture>, paragraph and link is
 * placed. Existing <picture>/<img>/<a> nodes are MOVED (not re-serialized) so
 * their loading/width/height/srcset and any MEP markers survive (C4/C11).
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT (L30).
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-section-2';
const SVG_NS = 'http://www.w3.org/2000/svg';

// Local element factory — keeps the block self-contained and lint-clean.
function createTag(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => v != null && node.setAttribute(k, v));
  children.forEach((c) => c != null && node.append(c));
  return node;
}

// Re-tag a node while preserving its attributes + child nodes (used to promote
// an authored headline <p> to a semantic <h2> — L8: only one h1 per block).
function retag(node, tagName) {
  const out = createTag(tagName);
  [...node.attributes].forEach((a) => out.setAttribute(a.name, a.value));
  while (node.firstChild) out.appendChild(node.firstChild);
  return out;
}

// MEP / personalization markers Milo may stamp on the wrapper we discard. Copy
// any present marker up onto the block root BEFORE the rebuild (C11).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

// A thin ">" chevron built via the SVG DOM (no innerHTML). stroke=currentColor
// so it inherits the link colour set explicitly in CSS (C20).
function buildChevron() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 7 12');
  svg.setAttribute('width', '7');
  svg.setAttribute('height', '12');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('fs2-cta-arrow');
  const poly = document.createElementNS(SVG_NS, 'polyline');
  poly.setAttribute('points', '1,1 6,6 1,11');
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', 'currentColor');
  poly.setAttribute('stroke-width', '1.5');
  poly.setAttribute('stroke-linecap', 'round');
  poly.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(poly);
  return svg;
}

// Deterministic analytics floor (independent of author compliance; C7).
function tagAnalytics(scope, label) {
  const slug = (t) => String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let li = 0;
  scope.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    n.setAttribute('daa-ll', `${label}|${slug(n.textContent) || `link-${li}`}`);
  });
  let ii = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    ii += 1;
    img.setAttribute('daa-im', `${label}|${slug(img.getAttribute('alt')) || `image-${ii}`}`);
  });
}

// Collect the flat authored content as an ordered token list. Skips wrapper
// nodes so a <p><a>…</a></p> CTA is one token, and a <picture> is one token.
function collectTokens(el) {
  const raw = [...el.querySelectorAll('picture, p, a, h1, h2, h3, h4, h5, h6')];
  const seen = new Set();
  const tokens = [];
  raw.forEach((node) => {
    if (seen.has(node)) return;
    if (node.tagName === 'PICTURE') {
      tokens.push({ kind: 'media', node });
      node.querySelectorAll('*').forEach((n) => seen.add(n));
      return;
    }
    if (node.tagName === 'A' && node.getAttribute('href')) {
      tokens.push({ kind: 'cta', node, text: node.textContent.trim() });
      return;
    }
    const innerLink = node.querySelector?.('a[href]');
    if (innerLink) {
      tokens.push({ kind: 'cta', node: innerLink, text: innerLink.textContent.trim() });
      seen.add(innerLink);
      return;
    }
    if (node.querySelector?.('picture')) return; // wrapper of a media token
    const text = node.textContent.trim();
    if (text) tokens.push({ kind: 'text', node, text });
  });
  return tokens;
}

// Split the flat token run into columns. A new column starts at a media token
// that follows a CTA OR a run of >=2 consecutive copy paragraphs — so it works
// whether the CTA is a real link or plain text, and never merges cards.
function splitColumns(tokens) {
  const columns = [];
  let cur = [];
  let textRun = 0;
  tokens.forEach((t, i) => {
    const prev = tokens[i - 1];
    const startNew = cur.length && t.kind === 'media'
      && (textRun >= 2 || prev?.kind === 'cta');
    if (startNew) { columns.push(cur); cur = []; textRun = 0; }
    cur.push(t);
    textRun = t.kind === 'text' ? textRun + 1 : 0;
  });
  if (cur.length) columns.push(cur);
  return columns;
}

// Classify one column's tokens into base / floating layers / chips / copy.
// Everything is accounted for: the trailing two paragraphs are headline+body,
// earlier paragraphs are chip labels bound to their preceding icon image(s).
function classifyColumn(ct) {
  const texts = ct.filter((t) => t.kind === 'text');
  const cta = ct.find((t) => t.kind === 'cta') || texts[texts.length - 1] || null;
  const copy = texts.filter((t) => t !== cta).slice(-2);
  const headline = copy[0] || null;
  const body = copy.length === 2 ? copy[1] : null;
  const chipLabels = new Set(texts.filter((t) => t !== cta && !copy.includes(t)));

  let base = null;
  let buf = [];
  const layers = [];
  const chips = [];
  ct.forEach((t) => {
    if (t.kind === 'media') {
      if (!base) base = t.node; else buf.push(t.node);
    } else if (t.kind === 'text' && chipLabels.has(t)) {
      const icons = buf.slice(-2);
      layers.push(...buf.slice(0, Math.max(0, buf.length - 2)));
      chips.push({ icons, label: t.text });
      buf = [];
    }
  });
  layers.push(...buf); // ragged: trailing media with no chip label

  return {
    base, layers, chips, headline, body, cta,
  };
}

// Build one column's DOM from its classified parts.
function buildColumn(col, colIdx) {
  const card = createTag('div', { class: 'fs2-card' });
  // A single extra overlay with no chips reads as a full-bleed composite; two+
  // layers or any chip read as floating mockups on the base.
  const layersAreInsets = col.chips.length > 0 || col.layers.length >= 2;

  if (col.base) {
    col.base.classList.add('fs2-bg');
    col.base.querySelector('img')?.classList.add('fs2-media-img');
    card.appendChild(col.base);
  }
  col.layers.forEach((pic, i) => {
    const img = pic.querySelector('img');
    if (layersAreInsets) {
      pic.classList.add('fs2-layer', `fs2-layer--${i}`);
      img?.classList.add('fs2-layer-img');
    } else {
      pic.classList.add('fs2-bg');
      img?.classList.add('fs2-media-img');
    }
    card.appendChild(pic);
  });
  col.chips.forEach((chip, i) => {
    const pos = i % 2 === 0 ? 'fs2-chip--br' : 'fs2-chip--tl';
    const chipEl = createTag('div', { class: `fs2-chip ${pos}` });
    chip.icons.forEach((pic) => {
      pic.classList.add('fs2-chip-icon');
      pic.querySelector('img')?.classList.add('fs2-chip-icon-img');
      chipEl.appendChild(pic);
    });
    chipEl.appendChild(createTag('span', { class: 'fs2-chip-label' }, chip.label));
    card.appendChild(chipEl);
  });

  const headgroup = createTag('div', { class: 'fs2-headgroup' });
  if (col.headline) {
    const h = retag(col.headline.node, 'h2');
    h.classList.add('fs2-headline');
    col.headline.node.remove();
    headgroup.appendChild(h);
  }
  if (col.body) {
    col.body.node.classList.add('fs2-body');
    headgroup.appendChild(col.body.node);
  }

  const copy = createTag('div', { class: 'fs2-copy' }, headgroup);
  if (col.cta) {
    let ctaEl = col.cta.node;
    if (!ctaEl || ctaEl.tagName !== 'A') {
      ctaEl = createTag('button', { type: 'button' });
    }
    const label = createTag('span', { class: 'fs2-cta-label' });
    label.textContent = col.cta.text || 'Learn more';
    ctaEl.textContent = '';
    ctaEl.classList.add('fs2-cta');
    ctaEl.append(label, buildChevron());
    copy.appendChild(ctaEl);
  }

  const column = createTag('div', { class: 'fs2-col' });
  if (col.base || col.layers.length) column.appendChild(card);
  column.appendChild(copy);
  column.dataset.fs2Col = String(colIdx);
  return column;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Lift MEP markers off the (about-to-be-discarded) content wrapper.
  const inner = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(inner?.parentElement || inner, el);

  const tokens = collectTokens(el);
  const columns = splitColumns(tokens).map(classifyColumn);

  const grid = createTag('div', { class: 'fs2-grid' });
  columns.forEach((col, i) => grid.appendChild(buildColumn(col, i)));

  // Assemble once and swap in — never innerHTML='' the block (C3).
  el.replaceChildren(grid);

  // Run Milo's own text decorator (typography + button/a11y wiring), guarded so
  // a service hiccup never bricks the section. decorateViewportContent handles
  // both single- and per-viewport authored tables.
  try {
    const decorate = (scope) => decorateBlockText(scope, { heading: '2', body: 'md', button: 'md' });
    if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
    else decorate(el);
  } catch (e) {
    window.lana?.log(`${BLOCK} decorate: ${e?.message || e}`, { tags: 'forge' });
  }

  tagAnalytics(el, BLOCK);
  el.dataset.forgeAuthored = BLOCK;
}
