/**
 * forge-create-beautifully — a Milo C2 block.
 *
 * Section intent (Figma 9943:38240): a "Create beautifully." document-showcase —
 * a responsive collage of PDF/document "cards" (a preview cover + a filename
 * badge) broken up by copy blocks (heading + body + Learn more), followed by a
 * "Test drive a PDF Space now." call-to-action.
 *
 * DA serialises a block's authored content FLAT and class-LESS: init(el) receives
 * a run of <picture>/<h3>/<p>/<div> text fragments in document order with NO grid,
 * row or tile wrappers and NONE of the Figma descriptive classes. So this decorator
 * RECONSTRUCTS the visual structure from content ORDER — probing by shape, never by
 * an authored class — grouping each (cover + text + `*.pdf` badge) cluster into a
 * card, wrapping card runs in a responsive grid, and keeping the copy/CTA blocks as
 * distinct panels. It builds the new tree with createTag + appendChild and swaps it
 * in once via replaceChildren (never innerHTML-wipes), then runs Milo's own text
 * decorators over the copy panels.
 *
 * CANONICAL DEPTH: libs/c2/blocks/<name>/ → libs/utils/*.js is THREE hops up
 * (blocks -> c2 -> libs). The '../../../' specifiers below are CORRECT.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-create-beautifully';
const CTA_RE = /^(learn more|try (the )?demo)$/i;
const PDF_RE = /\.pdf\s*$/i;
// Inline tags that never start a new content block; a node whose only element
// children are these is a "leaf" carrying a single line of text and/or one image.
const INLINE = new Set(['SPAN', 'A', 'BR', 'STRONG', 'EM', 'B', 'I', 'SUP', 'SUB',
  'SMALL', 'U', 'MARK', 'SVG', 'PATH', 'PICTURE', 'IMG', 'SOURCE', 'LABEL']);

// MEP / personalization markers Milo may stamp on the row/cell wrapper we discard.
// Copy them onto the block root BEFORE the rebuild so a later Target/MEP swap finds them.
function preserveMep(el) {
  const wrappers = [...el.querySelectorAll(':scope > div, :scope > div > div')];
  wrappers.forEach((w) => {
    [...w.attributes].forEach((a) => {
      if ((a.name === 'data-manifest-id' || a.name === 'data-adobe-target-testid'
        || a.name.startsWith('data-mep-')) && !el.hasAttribute(a.name)) {
        el.setAttribute(a.name, a.value);
      }
    });
  });
}

function lineText(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll('br').forEach((b) => b.replaceWith(' '));
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

// An image authored at a large intrinsic width is a decorative "connecting lines"
// background plate, not a card cover — drop it so it never becomes a card.
function isDecorMedia(node) {
  const img = node.tagName === 'IMG' ? node : node.querySelector('img');
  return parseInt(img?.getAttribute('width') || '0', 10) >= 500;
}

// Walk the flat authored tree into an ordered token stream of media / heading / text.
function collectTokens(node, out) {
  [...node.children].forEach((child) => {
    const tag = child.tagName;
    if (tag === 'PICTURE' || tag === 'IMG') { out.push({ t: 'media', node: child }); return; }
    if (/^H[1-6]$/.test(tag)) { out.push({ t: 'heading', node: child, level: +tag[1] }); return; }
    const pic = child.querySelector('picture, img');
    const txt = lineText(child);
    if (tag === 'P') {
      if (txt) out.push({ t: 'text', node: child, text: txt, para: true });
      else if (pic) out.push({ t: 'media', node: pic });
      return;
    }
    const hasBlockKids = [...child.children].some((c) => !INLINE.has(c.tagName));
    if (hasBlockKids) { collectTokens(child, out); return; }
    if (txt) out.push({ t: 'text', node: child, text: txt, para: false });
    else if (pic) out.push({ t: 'media', node: pic });
  });
}

// Group the token stream into ordered render items: cards, headings, paragraphs, CTAs.
function toItems(tokens) {
  const items = [];
  let card = null;
  const flush = () => {
    if (card && (card.media || card.title || card.badge)) items.push({ kind: 'card', card });
    card = null;
  };
  tokens.forEach((tk) => {
    if (tk.t === 'heading') { flush(); items.push({ kind: 'heading', node: tk.node, level: tk.level }); return; }
    if (tk.t === 'media') {
      if (isDecorMedia(tk.node)) return;
      if (!card) card = {};
      if (!card.media) card.media = tk.node;
      return;
    }
    // text
    if (tk.para) { flush(); items.push({ kind: 'para', node: tk.node }); return; }
    if (CTA_RE.test(tk.text)) { flush(); items.push({ kind: 'cta', text: tk.text }); return; }
    if (PDF_RE.test(tk.text)) { if (!card) card = {}; card.badge = tk.text; flush(); return; }
    if (!card) card = {};
    if (!card.title) card.title = tk.text;
    else if (!card.sub) card.sub = tk.text;
  });
  flush();
  return items;
}

function buildCard(card) {
  const wrap = createTag('div', { class: 'fcb-card' });
  const cover = createTag('div', { class: 'fcb-card__cover' });
  if (card.media) {
    const img = card.media.tagName === 'IMG' ? card.media : card.media.querySelector('img');
    if (img) {
      const w = parseInt(img.getAttribute('width') || '', 10);
      const h = parseInt(img.getAttribute('height') || '', 10);
      if (w && h) img.style.aspectRatio = `${w} / ${h}`;
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      img.classList.add('fcb-card__img');
    }
    cover.classList.add('fcb-card__cover--media');
    cover.append(card.media);
  } else {
    cover.classList.add('fcb-card__cover--tile');
    if (card.title) {
      const t = createTag('span', { class: 'fcb-card__title' });
      t.textContent = card.title;
      cover.append(t);
    }
    if (card.sub) {
      const s = createTag('span', { class: 'fcb-card__sub' });
      s.textContent = card.sub;
      cover.append(s);
    }
  }
  wrap.append(cover);
  if (card.badge) {
    const badge = createTag('span', { class: 'fcb-card__badge' });
    badge.textContent = card.badge;
    wrap.append(badge);
  }
  return wrap;
}

function buildCta(text, solid) {
  const btn = createTag('button', { type: 'button', class: `fcb-cta${solid ? ' fcb-cta--solid' : ''}` });
  btn.textContent = text;
  return btn;
}

function prepHeading(node) {
  node.classList.add('fcb-heading');
  return node;
}

// Decorative, aria-hidden "app window" plate — echoes the Figma PDF-Space frame
// without trying to reconstruct its (unrecoverable) inner chrome from flat text.
function buildFrame() {
  const frame = createTag('div', { class: 'fcb-try__frame', 'aria-hidden': 'true' });
  frame.append(createTag('div', { class: 'fcb-try__bar' }));
  frame.append(createTag('div', { class: 'fcb-try__canvas' }));
  return frame;
}

function render(items) {
  const inner = createTag('div', { class: `${BLOCK}__inner` });
  let grid = null;
  let copy = null;
  let tryWrap = null;
  let tryCopy = null;
  let inTry = false;

  items.forEach((it) => {
    // The single h2 ("Test drive a PDF Space now.") opens the CTA region.
    if (!inTry && it.kind === 'heading' && it.level <= 2) {
      inTry = true; grid = null; copy = null;
      tryWrap = createTag('div', { class: 'fcb-try' });
      tryCopy = createTag('div', { class: 'fcb-try__copy' });
      tryWrap.append(tryCopy, buildFrame());
      inner.append(tryWrap);
    }

    if (inTry) {
      if (it.kind === 'heading') tryCopy.append(prepHeading(it.node));
      else if (it.kind === 'para') tryCopy.append(it.node);
      else if (it.kind === 'cta') {
        const actions = createTag('div', { class: 'fcb-try__actions' });
        actions.append(buildCta(it.text, true));
        tryWrap.append(actions);
      }
      return; // showcase cards inside the app UI are unrecoverable noise — skip.
    }

    if (it.kind === 'card') {
      copy = null;
      if (!grid) { grid = createTag('div', { class: 'fcb-grid' }); inner.append(grid); }
      grid.append(buildCard(it.card));
      return;
    }
    grid = null;
    if (!copy) { copy = createTag('div', { class: 'fcb-copy' }); inner.append(copy); }
    if (it.kind === 'heading') copy.append(prepHeading(it.node));
    else if (it.kind === 'para') copy.append(it.node);
    else if (it.kind === 'cta') copy.append(buildCta(it.text, false));
  });
  return inner;
}

function slug(s) {
  return String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

function tagAnalytics(el, lh) {
  el.querySelectorAll('a, button').forEach((n, i) => {
    if (!n.hasAttribute('daa-ll')) n.setAttribute('daa-ll', `${lh}|${slug(n.textContent) || `link-${i + 1}`}`);
  });
  el.querySelectorAll('img').forEach((im, i) => {
    if (!im.hasAttribute('daa-im')) im.setAttribute('daa-im', `${lh}|${slug(im.getAttribute('alt')) || `image-${i + 1}`}`);
  });
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);
  preserveMep(el);

  const tokens = [];
  collectTokens(el, tokens);
  if (!tokens.length) return;

  const inner = render(toItems(tokens));
  if (!inner.children.length) return;
  el.replaceChildren(inner);

  // Promote copy headings/body to C2 typography via Milo's own services.
  try {
    const decorate = (scope) => {
      (scope || el).querySelectorAll('.fcb-copy, .fcb-try__copy').forEach((panel) => decorateBlockText(panel));
    };
    if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
    else decorate(el);
  } catch (e) { /* text decoration is best-effort; never block the rebuild */ }

  tagAnalytics(el, BLOCK);
  el.dataset.forgeAuthored = BLOCK;
}
