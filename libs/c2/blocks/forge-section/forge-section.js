/**
 * forge-section — a Milo C2 block: a "customer proof" section made of a centered
 * section heading, a responsive brand-logo wall, a "read more" link, and a
 * featured customer quote card. Authored by Forge for a section that matched no
 * existing C2 catalog block closely enough to bind (closest: rich-content, 0.83).
 *
 * DA serializes a block's content FLAT and CLASS-LESS: at runtime init() receives
 * a run of <h2>/<a>/<p>/<blockquote> in document order with NO grid/row/tile
 * wrappers and NONE of the authored Figma classes (.logos/.quote/.brand/...).
 * So this decorator PROBES BY CONTENT SHAPE — the two headings anchor the two
 * zones, links between them are logos + a CTA, the plain-text line before the
 * second heading is the quote brand — and RECONSTRUCTS the rich layout with
 * createElement, MOVING the authored nodes (never serialising / innerHTML-wiping,
 * so Target/MEP/authored DOM survive) and calling el.replaceChildren once.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT for the shipped
// location — do NOT "fix" it to 2 hops.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-section';
// A link whose label reads like a call-to-action ("Read more stories") rather
// than a brand name ("Coca-Cola") — used to split the CTA out of the logo wall.
const CTA_RE = /\b(read|see|view|explore|learn|browse|discover|find|all|more)\b|stories|story/i;
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];

// The un-wrap discards the EDS row/cell wrapper, so copy any personalization
// markers off it onto the target first — a swap that drops them silently
// disables Target/MEP on the section.
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

const text = (n) => (n?.textContent || '').trim();
const isHeading = (n) => n?.nodeType === 1 && /^H[1-6]$/.test(n.tagName);
const isQuote = (n) => n?.nodeType === 1 && n.tagName === 'BLOCKQUOTE';
const anchorIn = (n) => {
  if (n?.nodeType !== 1) return null;
  if (n.tagName === 'A') return n;
  return n.querySelector?.('a[href]') || n.querySelector?.('a') || null;
};

function slug(s) {
  return String(s || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function makeEl(tag, cls) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
}

// Move an anchor into `parent`, tag it for analytics (daa-ll), give it `cls`.
function placeLink(anchor, parent, daaLh, cls) {
  if (!anchor) return;
  if (cls) anchor.classList.add(cls);
  if (!anchor.hasAttribute('daa-ll')) {
    anchor.setAttribute('daa-ll', `${daaLh}|${slug(text(anchor)) || 'link'}`);
  }
  parent.appendChild(anchor);
}

export default async function init(el) {
  if (!el) return;

  const daaLh = BLOCK;
  el.setAttribute('daa-lh', daaLh);

  // Locate the authored content cell. EDS wraps single-cell block content in
  // block > div (row) > div (cell); fall back gracefully to an already-flat DOM.
  const cell = el.querySelector(':scope > div > div')
    || el.querySelector(':scope > div')
    || el;
  preserveMepAttrs(cell.parentElement, el);
  preserveMepAttrs(cell, el);

  // Normalise: promote significant top-level text nodes (a bare "Workday" line)
  // to <p> so all probing below is element-only and shape-robust.
  [...cell.childNodes].forEach((n) => {
    if (n.nodeType === 3 && n.textContent.trim()) {
      const p = makeEl('p');
      p.textContent = n.textContent.trim();
      cell.replaceChild(p, n);
    }
  });

  const nodes = [...cell.children].filter((n) => text(n) || anchorIn(n));
  if (!nodes.length) return;

  // Probe by content shape (never children[N]): the two headings anchor the
  // section head and the featured quote.
  const headings = nodes.filter(isHeading);
  const title = headings[0] || null;
  const quoteHeading = headings[1] || null;
  const titleIdx = title ? nodes.indexOf(title) : -1;
  const qIdx = quoteHeading ? nodes.indexOf(quoteHeading) : nodes.length;

  // Zone A — logo wall + "read more" CTA (between the two headings).
  const preQuote = nodes.slice(titleIdx + 1, qIdx);
  const preLinks = preQuote.filter((n) => anchorIn(n));
  const centerLinkNode = preLinks.find((n) => CTA_RE.test(text(n))) || null;
  const logoNodes = preLinks.filter((n) => n !== centerLinkNode);
  const brandNode = preQuote.find(
    (n) => !anchorIn(n) && !isHeading(n) && !isQuote(n) && text(n),
  ) || null;

  // Zone B — featured quote card (the second heading onward).
  const quoteZone = nodes.slice(qIdx);
  const quoteMark = quoteZone.find(isQuote) || null;
  const readNode = quoteZone.filter((n) => anchorIn(n)).pop() || null;
  const whoNode = quoteZone.find(
    (n) => n !== quoteHeading && !isQuote(n) && !anchorIn(n) && text(n),
  ) || null;

  // ---- Reconstruct (createElement + move; no innerHTML wipe) ----
  const container = makeEl('div', 'container');

  if (title) {
    const head = makeEl('div', 'section-head');
    title.classList.add('title');
    head.appendChild(title);
    container.appendChild(head);
  }

  if (logoNodes.length) {
    const logos = makeEl('ul', 'logos');
    logoNodes.forEach((n) => {
      const a = anchorIn(n);
      if (!a) return;
      const li = makeEl('li');
      placeLink(a, li, daaLh, 'logo-item');
      logos.appendChild(li);
    });
    container.appendChild(logos);
  }

  if (centerLinkNode) {
    const a = anchorIn(centerLinkNode);
    const wrap = centerLinkNode.tagName === 'A' ? makeEl('p') : centerLinkNode;
    wrap.className = 'center-link body-md';
    placeLink(a, wrap, daaLh);
    container.appendChild(wrap);
  }

  if (quoteHeading || quoteMark || brandNode) {
    const quote = makeEl('figure', 'quote');
    if (brandNode) {
      brandNode.classList.add('brand', 'eyebrow');
      quote.appendChild(brandNode);
    }
    if (quoteHeading) {
      quoteHeading.classList.add('quote-title');
      quote.appendChild(quoteHeading);
    }
    if (quoteMark) {
      quoteMark.classList.add('quote-body', 'body-lg');
      quote.appendChild(quoteMark);
    }
    if (whoNode) {
      whoNode.classList.add('who', 'body-md');
      quote.appendChild(whoNode);
    }
    if (readNode) {
      const a = anchorIn(readNode);
      const wrap = readNode.tagName === 'A' ? makeEl('p') : readNode;
      wrap.className = 'read body-md';
      placeLink(a, wrap, daaLh);
      quote.appendChild(wrap);
    }
    container.appendChild(quote);
  }

  // Swap in the rebuilt tree once (replaceChildren, never innerHTML = '').
  el.replaceChildren(container);

  // Run Milo's own decorators: typography promotion, wrapped in
  // decorateViewportContent so a per-viewport authored table decorates each
  // variation and a single-viewport table (this one) decorates once.
  const decorate = (scope) => decorateBlockText(scope);
  if (typeof decorateViewportContent === 'function') {
    decorateViewportContent(el, decorate);
  } else {
    decorate(el);
  }

  el.setAttribute('data-forge-authored', BLOCK);
}
