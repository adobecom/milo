/**
 * forge-get-acrobat-studio-today — Milo C2 hero block.
 *
 * A centred call-to-action hero rendered OVER a full-bleed background image:
 * eyebrow + display heading + description, then a price line and two CTAs.
 *
 * DA serialises the authored block as a FLAT, class-LESS run of semantic tags in
 * document order — `<picture>` (background), `<p>` (eyebrow), `<h1>`, `<p>`
 * (description), `<p>` (price), `<a>`, `<a>` — with NO grid/row/tile wrappers and
 * NONE of the Figma classes in `section.html`. So `init(el)` PROBES by content
 * shape (never by an authored class or a fixed child index), then RECONSTRUCTS
 * the rich hero layout: it MOVES the existing nodes (preserving their attributes
 * + MEP markers) into wrappers it builds with `createTag`, stamping its own
 * block-scoped classes that the co-authored CSS keys on.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateButtons } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-get-acrobat-studio-today';

// A paragraph is the "price" line when it reads like a price/billing string,
// not prose. Everything else after the heading is description body copy.
const PRICE_RE = /(\$|\/mo\b|\/yr\b|\bmonth|\byear|\bbilled\b|\bprice\b)/i;

// MEP / personalization markers Milo stamps on the row/cell wrapper we discard.
// Copy any present marker up onto the block root BEFORE we rebuild so Target/MEP
// stays wired. `data-mep-*` is an open family — copy every attr in it.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null && !to.hasAttribute(attr)) to.setAttribute(attr, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-') && !to.hasAttribute(a.name)) {
      to.setAttribute(a.name, a.value);
    }
  });
}

// Short, stable analytics label from a link's text.
function daaLabel(node, fallback) {
  const text = (node.textContent || '').trim().replace(/\s+/g, ' ');
  return text.slice(0, 30) || fallback;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Copy MEP markers off the outer row/cell wrapper(s) onto the block root
  // before we tear the wrappers down.
  el.querySelectorAll(':scope > div, :scope > div > div').forEach((w) => preserveMepAttrs(w, el));

  // --- PROBE the flat content by shape, in document order (never by index) ---
  const pictures = [...el.querySelectorAll('picture')];
  // A bare authored <img> not already inside a <picture> counts as media too.
  const looseImgs = [...el.querySelectorAll('img')].filter((img) => !img.closest('picture'));
  const media = [...pictures, ...looseImgs];
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...el.querySelectorAll('a')];
  const paragraphs = [...el.querySelectorAll('p')];

  // Split paragraphs relative to the heading: those before it are eyebrow(s);
  // those after it are description prose or the price line.
  const eyebrows = [];
  const afterHeading = [];
  paragraphs.forEach((p) => {
    if (!heading) { afterHeading.push(p); return; }
    // eslint-disable-next-line no-bitwise
    const isBefore = heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING;
    if (isBefore) eyebrows.push(p);
    else afterHeading.push(p);
  });
  const priceEls = afterHeading.filter((p) => PRICE_RE.test(p.textContent || ''));
  const descriptions = afterHeading.filter((p) => !priceEls.includes(p));

  // --- RECONSTRUCT the hero layout (move real nodes; do not serialise) ---
  const fragChildren = [];

  // Background media (absolute, behind everything).
  if (media.length) {
    const mediaWrap = createTag('div', { class: 'media', 'aria-hidden': 'true' });
    media.forEach((m) => {
      const img = m.tagName === 'IMG' ? m : m.querySelector('img');
      if (img) img.setAttribute('daa-im', 'true');
      mediaWrap.append(m);
    });
    fragChildren.push(mediaWrap);
  }

  // Dark gradient scrim so the white copy stays legible over the photo.
  fragChildren.push(createTag('div', { class: 'overlay', 'aria-hidden': 'true' }));

  // Foreground: centred content column.
  const textGroup = createTag('div', { class: 'text' });
  eyebrows.forEach((p) => { p.classList.add('eyebrow'); textGroup.append(p); });
  if (heading) { heading.classList.add('heading'); textGroup.append(heading); }
  descriptions.forEach((p) => { p.classList.add('description'); textGroup.append(p); });
  // Milo typography semantics (eyebrow / heading-N / body-*) — additive.
  decorateBlockText(textGroup);

  const actions = createTag('div', { class: 'actions' });
  priceEls.forEach((p) => { p.classList.add('price'); actions.append(p); });

  if (links.length) {
    const buttons = createTag('p', { class: 'buttons' });
    links.forEach((a, i) => {
      a.setAttribute('daa-ll', daaLabel(a, `cta-${i + 1}`));
      // Wrap so Milo's decorateButtons stamps con-button + type: the first CTA
      // is the solid/primary (strong -> blue), the rest are outline (em).
      const wrapper = createTag(i === 0 ? 'strong' : 'em');
      wrapper.append(a);
      buttons.append(wrapper);
    });
    actions.append(buttons);
    decorateButtons(actions, 'button-l');
  }

  const content = createTag('div', { class: 'content' });
  content.append(textGroup);
  if (actions.childElementCount) content.append(actions);

  const foreground = createTag('div', { class: 'foreground' });
  foreground.append(content);
  fragChildren.push(foreground);

  // Single mutation at the end — never innerHTML = '' (nothing is lost: every
  // meaningful node was already MOVED into fragChildren above).
  el.replaceChildren(...fragChildren);
  el.dataset.forgeAuthored = BLOCK;
}
