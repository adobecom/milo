/**
 * forge-explore-what-s-new — the centered "Explore what's new." hero header
 * (eyebrow + title + subhead + two CTAs) authored as a Milo C2 block.
 *
 * DA serializes a block's content FLAT and CLASS-LESS (see author-content.html):
 *   <p>Features and Releases</p>
 *   <h1>Explore what's new.</h1>
 *   <p>Discover the latest product features from Adobe.</p>
 *   <a href="#">Label</a>  <a href="#">Label</a>
 * The authored Figma classes DO NOT exist at runtime, so init() PROBES the
 * content by shape/order (never by an authored class — C24) and RECONSTRUCTS
 * the centered layout the scoped CSS styles.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT (L30).
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-explore-what-s-new';

// MEP / personalization markers Milo stamps on the row/cell wrapper we discard.
// Copy any present marker up onto the block root FIRST so a later Target/MEP
// swap still finds them (C11).
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

function createTag(tag, attrs = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Lift MEP markers off the row/cell wrapper(s) before they are discarded.
  preserveMepAttrs(el.querySelector(':scope > div'), el);
  preserveMepAttrs(el.querySelector(':scope > div > div'), el);

  // --- PROBE the flat content by shape/order (C2/C24) ---
  // querySelectorAll yields document order, so a single walk tells us which
  // paragraphs sit BEFORE the heading (eyebrow) vs AFTER it (body).
  const flow = [...el.querySelectorAll('h1, h2, h3, h4, p')];
  const heading = flow.find((n) => /^H[1-4]$/.test(n.tagName));
  // Every anchor is a CTA; account for EVERY one (defensive grouping).
  const anchors = [...el.querySelectorAll('a[href]')];

  const eyebrows = [];
  const bodies = [];
  let seenHeading = false;
  flow.forEach((n) => {
    if (n === heading) { seenHeading = true; return; }
    if (n.tagName !== 'P' || n.querySelector('a[href]')) return; // skip CTA wrappers
    (seenHeading ? bodies : eyebrows).push(n);
  });

  // --- RECONSTRUCT the centered hero header (createElement + move nodes) ---
  const inner = createTag('div', { class: 'fewn-inner' });
  const copy = createTag('div', { class: 'fewn-copy' });
  eyebrows.forEach((p) => { p.classList.add('fewn-eyebrow'); copy.append(p); });
  if (heading) { heading.classList.add('fewn-title'); copy.append(heading); }
  bodies.forEach((p) => { p.classList.add('fewn-body'); copy.append(p); });
  inner.append(copy);

  if (anchors.length) {
    const actions = createTag('div', { class: 'fewn-actions' });
    anchors.forEach((a, i) => {
      // First CTA = filled (primary); the rest = outline (secondary).
      a.classList.add('fewn-cta', i === 0 ? 'fewn-cta--fill' : 'fewn-cta--outline');
      const label = (a.textContent || '').trim();
      a.setAttribute('daa-ll', label || `cta-${i + 1}`); // per-link analytics (C7)
      actions.append(a); // MOVE the authored anchor (keeps href/attrs/MEP)
    });
    inner.append(actions);
  }

  // Milo typography + semantics on the copy (headings -> heading-N, eyebrow
  // toggle on the pre-heading <p>). decorateButtons runs inside but no-ops here
  // because the CTAs live OUTSIDE `copy` and are styled by the block's own CSS.
  decorateBlockText(copy);

  // Single write; never innerHTML='' (C3). Probed nodes were MOVED into `inner`
  // so their text/attrs (incl. MEP) survive; the discarded wrappers held none.
  el.replaceChildren(inner);
  el.dataset.forgeAuthored = BLOCK;
}
