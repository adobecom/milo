/**
 * forge-get-acrobat-studio-today-1 — a Milo C2 block authored by Forge from a Figma
 * section that matched no existing catalog block. It is a centered copy-lockup
 * CTA band on a dark gradient: eyebrow → heading → description → price → two
 * CTA pills.
 *
 * DA strips authored classes: at runtime `init(el)` receives a FLAT, class-less
 * run of <p>/<h2>/<a> in document order (never the Figma `.copy-lockup`/`.actions`
 * wrappers). So this decorator PROBES by content shape (never by class or fixed
 * index) and RECONSTRUCTS the lockup with createTag + append, stamping its own
 * `.forge-get-acrobat-studio-today-1`-scoped classes the CSS keys on.
 *
 * Canonical import depth: from libs/c2/blocks/<name>/ to libs/utils/ is THREE
 * hops up (blocks -> c2 -> libs). Do NOT "correct" these to 2 hops.
 *
 * @param {HTMLElement} el The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-get-acrobat-studio-today-1';

// MEP / personalization markers Milo stamps on the row/cell wrapper we discard.
// Copy any present marker onto the block root BEFORE the rebuild so a later
// Target/MEP swap still finds them. Content nodes are MOVED (not cloned), so any
// data-mep-* on those nodes survives automatically.
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

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Preserve MEP markers off the authored wrappers before they are discarded.
  const wrapper = el.querySelector(':scope > div');
  preserveMepAttrs(wrapper, el);
  preserveMepAttrs(wrapper?.querySelector(':scope > div'), el);

  // PROBE the flat content by shape (not by class/index). The heading anchors
  // the lockup; paragraphs split into eyebrow (before it) and copy (after it);
  // anchors become the CTA pills. Paragraphs that only wrap an anchor are
  // excluded so a <p><a></p> serialization does not steal a copy slot.
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...el.querySelectorAll('a')];
  const paras = [...el.querySelectorAll('p')]
    .filter((p) => p.textContent.trim() && !p.querySelector('a'));

  const before = [];
  const after = [];
  paras.forEach((p) => {
    if (heading && (heading.compareDocumentPosition(p)
      & Node.DOCUMENT_POSITION_PRECEDING)) before.push(p);
    else after.push(p);
  });

  const eyebrow = before[0] || null;
  const description = after[0] || null;
  // Any remaining copy paragraphs are treated as the price line(s); the last
  // one is the closest boundary to the CTAs. Never discard ragged extras.
  const priceEls = after.slice(1);

  // RECONSTRUCT the rich lockup from the probed nodes, in document order.
  const foreground = createTag('div', { class: 'foreground' });
  const copy = createTag('div', { class: 'copy' });
  if (eyebrow) { eyebrow.classList.add('eyebrow'); copy.append(eyebrow); }
  if (heading) copy.append(heading);
  if (description) copy.append(description);
  if (copy.childElementCount) foreground.append(copy);

  const actions = createTag('div', { class: 'actions' });
  priceEls.forEach((p) => { p.classList.add('price'); actions.append(p); });
  if (links.length) {
    const group = createTag('div', { class: 'button-group' });
    links.forEach((a, i) => {
      a.classList.add('con-button', i === 0 ? 'cta-primary' : 'cta-secondary');
      a.setAttribute('daa-ll', `${BLOCK}|${(a.textContent || `link-${i + 1}`).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`);
      group.append(a);
    });
    actions.append(group);
  }
  if (actions.childElementCount) foreground.append(actions);

  // Milo typography service: heading -> heading-2, copy -> body-md, eyebrow
  // promotion (C2). Run on the copy group only so the price keeps its own class.
  if (copy.childElementCount) decorateBlockText(copy, { heading: '2', body: 'md' });
  if (description) description.classList.add('description');

  // Single, non-destructive swap (C3): content nodes were moved into the rebuild.
  el.replaceChildren(foreground);
  el.dataset.forgeAuthored = BLOCK;
}
