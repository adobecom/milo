/**
 * forge-there-s-more-to-acrobat-than-acrobat — a distinctive Milo C2 section block
 * authored by Forge (build-block-from-figma). The section is a centered
 * headline/subhead over a two-column media row: a tall left photo card and a
 * right column holding a collaboration screenshot card + copy ("Collaborate
 * effortlessly." + a "Learn more" text link).
 *
 * DA serializes a block's authored content as a FLAT, class-LESS run of
 * <h2>/<p>/<picture>/<h3>/<p>/<a> in document order — NO grid/row/tile wrappers,
 * NONE of the Figma structural classes survive to runtime (checklist C24). So
 * init() PROBES the content by shape (never by an authored class or a fixed
 * child index), then RECONSTRUCTS the rich two-column layout with createElement
 * + classList, stamping its OWN .forge-*-scoped classes that the co-located
 * scoped stylesheet keys on. Every flat child is accounted for — leftover copy
 * and media attach to the nearest group so nothing is dropped (empty-grid bug).
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/decorate.js is THREE
// hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-there-s-more-to-acrobat-than-acrobat';
const c = (suffix) => `${BLOCK}-${suffix}`;

// MEP / personalization markers Milo can stamp on the row/cell wrapper we
// discard when we rebuild — copy any present marker up onto the block root so a
// later Target/MEP swap still finds them (C11).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
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

function tag(name, cls) {
  const node = document.createElement(name);
  if (cls) node.className = cls;
  return node;
}

// Inline chevron for the "Learn more" link — built entirely with the DOM API
// (no innerHTML anywhere in this block). stroke=currentColor so it inherits the
// link color (C20).
const SVG_NS = 'http://www.w3.org/2000/svg';
function chevron() {
  const span = tag('span', c('cta-icon'));
  span.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '6');
  svg.setAttribute('height', '10');
  svg.setAttribute('viewBox', '0 0 6 10');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M1 1.5 4.5 5 1 8.5');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  span.append(svg);
  return span;
}

const isAfter = (ref, node) => !!ref && !!node
  && !!(ref.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING);

export default async function init(el) {
  if (!el) return;
  try {
    el.setAttribute('daa-lh', BLOCK);
    // Lift MEP markers off the immediate content wrapper(s) before we rebuild.
    const wrapper = el.querySelector(':scope > div');
    preserveMepAttrs(wrapper?.firstElementChild, el);
    preserveMepAttrs(wrapper, el);

    // --- PROBE the flat DA content by shape (C2: never by class or index). ---
    const headings = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    const pictures = [...el.querySelectorAll('picture')];
    const anchors = [...el.querySelectorAll('a')];
    // Real copy paragraphs: carry text and are not a bare link wrapper.
    const paras = [...el.querySelectorAll('p')].filter((p) => p.textContent.trim()
      && !(p.children.length === 1 && p.querySelector(':scope > a')));

    if (!headings.length && !pictures.length) return; // nothing to build

    // Section headline = the first top-level heading; the card heading is the
    // next heading. Subhead = first paragraph before the first picture; card
    // body = first remaining paragraph after the card heading.
    const headline = headings[0] || null;
    const cardHeading = headings.find((h) => h !== headline) || null;
    // Subhead = first paragraph the first picture FOLLOWS (i.e. before the media).
    const subhead = paras.find((p) => !pictures[0] || isAfter(p, pictures[0])) || null;
    const cardBody = paras.find((p) => p !== subhead
      && (!cardHeading || isAfter(cardHeading, p))) || null;
    const cta = anchors[0] || null;

    // --- RECONSTRUCT the rich layout (in document order). ---
    const inner = tag('div', c('inner'));

    // Header copy cluster (centered headline + subhead).
    const copy = tag('div', c('copy'));
    if (headline) { headline.classList.add(c('headline')); copy.append(headline); }
    if (subhead) { subhead.classList.add(c('subhead')); copy.append(subhead); }
    if (copy.childElementCount) inner.append(copy);

    // Two-column media row.
    const cols = tag('div', c('cols'));

    // Left: the tall hero photo card = first picture.
    if (pictures[0]) {
      const left = tag('div', c('left'));
      left.append(pictures[0]);
      cols.append(left);
    }

    // Right column: screenshot card + copy (+ any ragged extras appended).
    const right = tag('div', c('right'));
    pictures.slice(1).forEach((pic) => {
      const media = tag('div', c('right-media'));
      media.append(pic);
      right.append(media);
    });

    const cardCopy = tag('div', c('card-copy'));
    const cardText = tag('div', c('card-text'));
    if (cardHeading) { cardHeading.classList.add(c('headline-sm')); cardText.append(cardHeading); }
    if (cardBody) { cardBody.classList.add(c('body-sm')); cardText.append(cardBody); }
    // Leftover copy paragraphs attach to the card so no node is dropped.
    paras.filter((p) => p !== subhead && p !== cardBody).forEach((p) => {
      p.classList.add(c('body-sm'));
      cardText.append(p);
    });
    if (cardText.childElementCount) cardCopy.append(cardText);

    if (cta) {
      const label = cta.textContent.trim() || 'Learn more';
      cta.textContent = '';
      cta.classList.add(c('cta'));
      const span = tag('span', c('cta-label'));
      span.textContent = label;
      cta.append(span, chevron());
      cta.setAttribute('daa-ll', label.slice(0, 40));
      cardCopy.append(cta);
    }
    if (cardCopy.childElementCount) right.append(cardCopy);
    if (right.childElementCount) cols.append(right);
    if (cols.childElementCount) inner.append(cols);

    // Analytics on preserved media (C7). These images come from the authored
    // DOM, so trust their loading/width/height (C4) — just tag them.
    inner.querySelectorAll('img').forEach((img, i) => {
      if (!img.hasAttribute('daa-im')) {
        img.setAttribute('daa-im', (img.getAttribute('alt') || `image-${i + 1}`).slice(0, 40));
      }
    });

    // One structural swap — never innerHTML-wipe the block (C3).
    el.replaceChildren(inner);

    // Promote text via Milo's own service (additive typography classes); our
    // scoped rules are prefixed with the block-root class so they always win.
    try { decorateBlockText(inner); } catch (e) { /* non-fatal */ }

    el.dataset.forgeAuthored = BLOCK;
  } catch (e) {
    window.lana?.log?.(`${BLOCK} init failed: ${e?.message || e}`);
  }
}
