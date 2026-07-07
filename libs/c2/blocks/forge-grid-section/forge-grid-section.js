/**
 * forge-grid-section — a distinctive Milo C2 "asset grid" section: a dark band of
 * poster-like document cards (each a rounded preview panel + a "*.pdf" file pill)
 * laid out in rows, with a right-aligned "Create beautifully." headline + body.
 *
 * RUNTIME REALITY (checklist C24): DA serialises this block's content as a FLAT,
 * class-LESS run of <p> (and one <h1>) in document order — NO grid/row/card/pill
 * wrappers and NONE of the Figma structural classes (.usecase/.bento/.card/…).
 * So init(el) MUST probe by CONTENT SHAPE and RECONSTRUCT the rich layout:
 *   - walk the flat children in order;
 *   - a <p> whose text ends in ".pdf" is a card's file-pill and marks the card
 *     BOUNDARY — everything accumulated before it is that card's preview text;
 *   - whatever trails the final card (the <h1> + its <p>) is the copy block.
 * We build .content-frame > .grid-rows > .row > .card(.preview + .file-pill) and
 * a trailing .copy with createTag, MOVING the authored nodes (never serialising),
 * then el.appendChild once. Scoped CSS keys ONLY on the classes stamped here.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). Do NOT "correct" to 2 hops.
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-grid-section';
const CARDS_PER_ROW = 4;

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so copy any present marker up onto the block root first.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  // data-mep-* is an open family — copy every attribute in that namespace.
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

const textOf = (node) => (node?.textContent || '').trim();
const isHeading = (node) => /^H[1-6]$/.test(node?.tagName || '');
// A card boundary: a paragraph whose text is a "*.pdf" file label (the pill).
const isPill = (node) => node?.tagName === 'P' && /\.pdf$/i.test(textOf(node));

// Build one reconstructed card: a rounded preview panel holding the card's text
// (moved, not serialised) + the file pill below it. `idx` (1-based) drives the
// per-card background/typography modifier in the scoped CSS.
function buildCard({ texts, pill }, idx) {
  const cardEl = createTag('div', { class: `card card--${idx}` });
  const preview = createTag('div', { class: 'preview' });
  texts.forEach((t, k) => {
    t.classList.add(k === 0 ? 'card-title' : 'card-line');
    preview.append(t);
  });
  cardEl.append(preview);
  if (pill) {
    pill.classList.add('pill-label');
    const pillWrap = createTag('div', { class: 'file-pill' });
    pillWrap.append(pill);
    cardEl.append(pillWrap);
  }
  return cardEl;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // EDS wraps a single-cell block as block > div > div > <flat content>. Read the
  // flat authored run out of that inner cell (fall back to el for a bare fixture).
  const inner = el.querySelector(':scope > div > div') || el;
  preserveMepAttrs(inner.parentElement, el);
  const flat = [...inner.children].filter((n) => n.nodeType === 1);

  // GROUP: slice the flat run into cards at each ".pdf" pill boundary. Every node
  // is accounted for — text accumulates into the current card; the pill closes it;
  // anything trailing the last card (the headline + body) becomes the copy block.
  const cards = [];
  let pending = [];
  flat.forEach((node) => {
    if (isPill(node)) {
      cards.push({ texts: pending, pill: node });
      pending = [];
    } else {
      pending.push(node);
    }
  });
  const copyNodes = pending; // leftover after the final pill == copy content

  const frame = createTag('div', { class: 'content-frame' });

  // Rows of CARDS_PER_ROW, preserving the authored count + order (N pills -> N cards).
  if (cards.length) {
    const gridRows = createTag('div', { class: 'grid-rows' });
    for (let i = 0; i < cards.length; i += CARDS_PER_ROW) {
      const row = createTag('div', { class: `row row-${i / CARDS_PER_ROW + 1}` });
      cards.slice(i, i + CARDS_PER_ROW).forEach((card, j) => {
        row.append(buildCard(card, i + j + 1));
      });
      gridRows.append(row);
    }
    frame.append(gridRows);
  }

  // Copy block: the trailing headline + body, moved into a right-aligned column.
  if (copyNodes.length) {
    const copy = createTag('div', { class: 'copy' });
    const headlineBody = createTag('div', { class: 'headline-body' });
    copyNodes.forEach((n) => {
      n.classList.add(isHeading(n) ? 'copy-heading' : 'copy-body');
      headlineBody.append(n);
    });
    copy.append(headlineBody);
    frame.append(copy);
    // Milo typography service over the copy (heading-N + button/a11y wiring).
    try { decorateBlockText(headlineBody); } catch (e) { /* non-fatal */ }
  }

  // Discard the now-empty EDS wrapper, then attach the rebuilt section once.
  if (inner !== el) inner.parentElement?.remove();
  el.append(frame);

  el.dataset.forgeAuthored = BLOCK;
}
