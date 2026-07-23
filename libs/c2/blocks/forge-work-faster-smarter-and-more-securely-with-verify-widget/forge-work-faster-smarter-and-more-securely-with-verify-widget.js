/**
 * forge-work-faster-smarter-and-more-securely-with-verify-widget
 *
 * A hero/marquee section (eyebrow · headline · body · dual CTA · hero image)
 * authored by Forge because the section matched no existing C2 catalog block
 * (R3: ambiguous, 0.49, closest `news`).
 *
 * DA serializes block content as a FLAT, class-less run of semantic nodes
 * inside the EDS `block > div > div` cell wrapper — there are NO authored
 * layout classes at runtime. So `init(el)` probes by CONTENT SHAPE (never by an
 * authored class or child index) and RECONSTRUCTS the two-column hero with
 * `createElement`, then `replaceChildren` once. Milo's own `decorateBlockText`
 * supplies C2 typography + button wiring; nothing is re-rolled by hand.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// Canonical depth: libs/c2/blocks/<name>/ -> libs/utils is THREE hops up
// (blocks -> c2 -> libs). Do not "correct" to two hops.
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-work-faster-smarter-and-more-securely-with-verify-widget';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The
// rebuild discards that wrapper, so copy any present marker onto the surviving
// node first — dropping them silently disables Target/MEP on the section.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  // data-mep-* is an open family — copy every attribute in that namespace.
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

const hasPicture = (n) => !!n?.querySelector?.('picture, img');
const hasLink = (n) => !!n?.querySelector?.('a[href]');
const hasText = (n) => !!n?.textContent?.trim();

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Lift MEP markers off the (about-to-be-discarded) cell wrapper onto the root.
  const cell = el.querySelector(':scope > div > div');
  preserveMepAttrs(cell?.parentElement, el);

  // Probe by content shape, in document order (never by class / child index).
  const heading = el.querySelector('h1, h2, h3');
  const picture = el.querySelector('picture');
  const flow = [...el.querySelectorAll('h1, h2, h3, p')];
  const hIdx = heading ? flow.indexOf(heading) : -1;

  let eyebrow = null;
  let actionsSrc = null;
  const bodyParas = [];
  flow.forEach((node, i) => {
    if (node === heading || hasPicture(node)) return; // heading + media handled apart
    if (hasLink(node)) { actionsSrc = node; return; } // CTA row
    if (!hasText(node)) return;
    if (hIdx !== -1 && i < hIdx && !eyebrow) eyebrow = node; // pre-heading kicker
    else bodyParas.push(node);
  });

  // Content column.
  const content = createTag('div', { class: 'content' });
  if (eyebrow) { eyebrow.classList.add('eyebrow'); content.append(eyebrow); }
  if (heading) content.append(heading);
  bodyParas.forEach((p) => content.append(p));

  // Milo C2 typography (heading-N + body-*). eyebrow is pre-classed so the
  // body-class pass skips it; our plain anchors are untouched by decorateButtons.
  decorateBlockText(content);

  // CTA row — real URLs stay <a>, placeholder (#/empty) becomes <button> (L9/C9).
  if (actionsSrc) {
    const actions = createTag('div', { class: 'action-area' });
    [...actionsSrc.querySelectorAll('a[href]')].forEach((a, i) => {
      const label = a.textContent.trim();
      const href = a.getAttribute('href') || '';
      const isReal = href && href !== '#';
      const variant = i === 0 ? 'blue' : 'outline';
      let ctl;
      if (isReal) {
        a.classList.add('con-button', variant);
        ctl = a;
      } else {
        ctl = createTag('button', { type: 'button', class: `con-button ${variant}` }, label);
        preserveMepAttrs(a, ctl);
      }
      ctl.setAttribute('daa-ll', label || `cta-${i + 1}`);
      actions.append(ctl);
    });
    if (actions.children.length) content.append(actions);
  }

  const rebuilt = createTag('div', { class: 'hero' }, content);

  // Media column — preserve every <picture>/<source>/<img> attribute by moving
  // the authored node (loading/width/height/srcset/sizes stay intact).
  if (picture) {
    const img = picture.querySelector('img');
    if (img) img.setAttribute('daa-im', 'true');
    rebuilt.append(createTag('div', { class: 'media' }, picture));
  }

  el.replaceChildren(rebuilt);
  el.dataset.forgeAuthored = BLOCK;
}
