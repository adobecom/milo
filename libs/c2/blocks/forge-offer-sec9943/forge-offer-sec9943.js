/**
 * forge-offer-sec9943 — a Milo C2 block.
 *
 * Renders the "scattered documents" section: a decorative COLLAGE of overlapping
 * rotated document previews (the leading run of pictures) above a responsive
 * DOCUMENT GRID of tiles — each tile is a mini document card (glyph / tag chips /
 * title / body / amount, or a photo) with a filename label beneath it.
 *
 * WHY THIS REBUILDS FROM CONTENT ORDER (not authored classes):
 * DA serializes a block's content FLAT and CLASS-LESS. At runtime init() does NOT
 * receive the Figma `.oi9943/.dg9943/.dc9943/.sc9943` wrappers — it receives a bare
 * run of <picture> and text lines in document order. So init() PROBES BY CONTENT
 * SHAPE + ORDER (never by class or el.children[N]): the leading consecutive
 * pictures become the collage, and everything after is sliced into tiles at each
 * filename label (the boundary marker) — N labels -> N tiles, every node kept.
 *
 * CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
 * (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-offer-sec9943';

// A filename label closes a tile. Whitelist document extensions + trailing
// ellipsis (truncated names) so a body line like "…monobloc.com" is NOT mistaken
// for a boundary (".com" is not a document extension).
const LABEL_RE = /(\.(pdf|docx?|xlsx?|pptx?|pages|numbers|key|ai|psd|txt)|\.\.\.|…)\s*$/i;

// The per-item PROPORTIONS of the scatter cluster (aspect-ratio + rotation +
// relative size/position) ARE the design and vanish from the runtime content —
// carry them positionally, one entry per leading picture, expressed responsively
// (% + aspect-ratio) so the collage scales to its container, never to frame px.
const COLLAGE = [
  { l: '1%', t: '3%', w: '31%', ar: '430 / 268', r: '35.46deg', z: 2 },
  { l: '50%', t: '25%', w: '22%', ar: '296 / 398', r: '18.22deg', z: 3 },
  { l: '72%', t: '41%', w: '22%', ar: '298 / 346', r: '-27.38deg', z: 2 },
  { l: '33%', t: '0%', w: '41%', ar: '572 / 650', r: '-14.58deg', z: 4 },
  { l: '46%', t: '17%', w: '32%', ar: '446 / 556', r: '-2deg', z: 5 },
];

// MEP / personalization markers Milo stamps on the row/cell wrapper. The rebuild
// discards that wrapper, so copy any present marker onto the block root FIRST — a
// node swap that drops them silently disables Target/MEP on the section.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

function createEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// Disambiguates daa-lh across N same-name instances on one page.
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Deterministic analytics floor: label every link/button/image not already tagged.
function forgeTagAnalytics(scope, label) {
  if (!scope) return;
  const slug = (t) => String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let li = 0;
  scope.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    const t = n.textContent || n.getAttribute('aria-label') || n.getAttribute('title') || '';
    n.setAttribute('daa-ll', `${label}|${slug(t) || `link-${li}`}`);
  });
  let ii = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    ii += 1;
    img.setAttribute('daa-im', `${label}|${slug(img.getAttribute('alt')) || `image-${ii}`}`);
  });
}

// Flatten el into an ordered token stream. Probes by SHAPE: media (<picture> or a
// bare <img>) and leaf text — never by authored class. Element text tokens keep
// their node so <br> line breaks and MEP attrs survive the move.
function collectTokens(root) {
  const TEXT_TAGS = new Set(['p', 'span', 'strong', 'em', 'b', 'i', 'a', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const tokens = [];
  const visit = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent.trim();
        if (t) tokens.push({ kind: 'text', text: t, node: null });
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName.toLowerCase();
      if (tag === 'picture' || (tag === 'img' && !child.closest('picture'))) {
        tokens.push({ kind: 'media', node: child });
      } else if (child.querySelector('picture, img')) {
        visit(child); // wrapper around media — recurse
      } else if (TEXT_TAGS.has(tag)) {
        const t = child.textContent.trim();
        if (t) tokens.push({ kind: 'text', text: t, node: child });
      } else {
        visit(child); // plain wrapper div — recurse to reach leaf nodes
      }
    }
  };
  visit(root);
  return tokens;
}

// Slice the post-collage token run into tiles at each filename label. Every token
// is accounted for: media + text accumulate into the current tile; a label token
// closes it. A trailing group with no label is still kept (never discard nodes).
function parseTiles(tokens, startIdx) {
  const tiles = [];
  let cur = null;
  const open = () => { cur = { media: [], lines: [], label: '', labelEl: null }; return cur; };
  for (let i = startIdx; i < tokens.length; i += 1) {
    const tk = tokens[i];
    if (!cur) open();
    if (tk.kind === 'media') {
      cur.media.push(tk.node);
    } else if (LABEL_RE.test(tk.text)) {
      cur.label = tk.text;
      cur.labelEl = tk.node;
      tiles.push(cur);
      cur = null;
    } else {
      cur.lines.push(tk);
    }
  }
  if (cur && (cur.media.length || cur.lines.length)) tiles.push(cur);
  return tiles;
}

const isShortCaps = (t) => /^[A-Z0-9][A-Z0-9 .&$]{0,9}$/.test(t);

// Build the inner copy of a document tile from its text lines. Classifies each
// line by shape into glyph / tag chips / title / amount / body — tags only count
// before the title (they are the header chips), so a single ALL-CAPS header like
// "INVOICE" becomes the title, while "DIGITAL"+"Q4 MIX" pairs become chips.
function buildCopy(lines) {
  const copy = createEl('div', 'doc-card-copy');
  let titleSet = false;
  let prevTag = false;
  let tagRow = null;
  const flushTags = () => { if (tagRow) { copy.appendChild(tagRow); tagRow = null; } };
  lines.forEach((tk, i) => {
    const text = tk.text;
    const next = lines[i + 1]?.text || '';
    const useEl = (cls, tag) => {
      const node = tk.node?.nodeType === 1 ? tk.node : createEl(tag || 'p', null, text);
      node.classList.add(cls);
      return node;
    };
    if (i === 0 && !titleSet && text.length <= 2) {
      // A short LEADING token is a logo glyph badge (e.g. the "M"); a short token
      // mid-card (e.g. a "TV" chart label) is body copy, not a badge.
      flushTags();
      copy.appendChild(useEl('doc-glyph', 'span'));
      prevTag = false;
    } else if (/^\s*\$/.test(text)) {
      flushTags();
      copy.appendChild(useEl('doc-amount', 'span'));
      prevTag = false;
    } else if (!titleSet && isShortCaps(text) && (isShortCaps(next) || prevTag)) {
      if (!tagRow) tagRow = createEl('div', 'doc-tags');
      tagRow.appendChild(useEl('doc-tag', 'span'));
      prevTag = true;
    } else if (!titleSet) {
      flushTags();
      copy.appendChild(useEl('doc-title', 'p'));
      titleSet = true;
      prevTag = false;
    } else {
      flushTags();
      copy.appendChild(useEl('doc-copy-line', 'p'));
      prevTag = false;
    }
  });
  flushTags();
  return copy;
}

// Palette used to tint text-only cards so the grid reads as varied documents
// even though the flat content carries no per-card color.
const CARD_TINTS = ['doc-card--flyer', 'doc-card--invoice', 'doc-card--chart', 'doc-card--dark', 'doc-card--mono', 'doc-card--paper', 'doc-card--brand', 'doc-card--photo'];

function buildTile(tile, index) {
  const doc = createEl('div', 'doc');
  const card = createEl('div', 'doc-card');
  card.classList.add(CARD_TINTS[index % CARD_TINTS.length]);

  const hasMedia = tile.media.length > 0;
  const hasLines = tile.lines.length > 0;

  if (hasMedia) {
    const media = createEl('div', 'doc-media');
    tile.media.forEach((m) => media.appendChild(m));
    card.appendChild(media);
    card.classList.add(hasLines ? 'doc-card--media-copy' : 'doc-card--media');
  }
  if (hasLines) card.appendChild(buildCopy(tile.lines));
  if (!hasMedia && !hasLines) card.classList.add('doc-card--blank');

  doc.appendChild(card);

  const label = tile.labelEl?.nodeType === 1 ? tile.labelEl : createEl('div', null, tile.label);
  label.classList.add('doc-label');
  if (tile.label || tile.labelEl) doc.appendChild(label);
  return doc;
}

export default async function init(el) {
  if (!el) return;
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(cell?.parentElement || cell, el);

  const tokens = collectTokens(el);
  const hasMedia = tokens.some((t) => t.kind === 'media');
  const hasText = tokens.some((t) => t.kind === 'text');
  // Nothing recognizable to rebuild — leave authored DOM intact (never wipe).
  if (!hasMedia && !hasText) { el.dataset.forgeAuthored = BLOCK; return; }

  // The leading consecutive pictures (before the first text token) are the
  // decorative scatter collage; the rest is the document stream.
  let firstText = tokens.findIndex((t) => t.kind === 'text');
  if (firstText < 0) firstText = tokens.length;
  const collagePics = tokens.slice(0, firstText).filter((t) => t.kind === 'media').map((t) => t.node);
  const tiles = parseTiles(tokens, firstText);

  const inner = createEl('div', 'sec9943-inner');

  if (collagePics.length) {
    const collage = createEl('div', 'collage');
    collagePics.forEach((pic, i) => {
      const cfg = COLLAGE[i] || COLLAGE[COLLAGE.length - 1];
      const cardWrap = createEl('div', 'collage-card');
      cardWrap.style.cssText = `left:${cfg.l};top:${cfg.t};width:${cfg.w};aspect-ratio:${cfg.ar};transform:rotate(${cfg.r});z-index:${cfg.z};`;
      cardWrap.appendChild(pic);
      collage.appendChild(cardWrap);
    });
    inner.appendChild(collage);
  }

  if (tiles.length) {
    const grid = createEl('div', 'docgrid');
    tiles.forEach((tile, i) => grid.appendChild(buildTile(tile, i)));
    inner.appendChild(grid);
  }

  // One structural swap at the end — never innerHTML='' (preserves nodes/attrs).
  el.replaceChildren(inner);

  // Milo service: promote any heading/body typography and wire buttons. Wrapped
  // in decorateViewportContent so a per-viewport table decorates each variation
  // and a single-viewport table decorates once.
  const runDecorate = () => decorateBlockText(inner);
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, runDecorate);
  else runDecorate();

  forgeTagAnalytics(el, daaLh);
  el.dataset.forgeAuthored = BLOCK;
}
