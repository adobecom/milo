/**
 * forge-get-acrobat-studio-today — a Milo C2 centred hero.
 *
 * DA serialises the authored block as a FLAT, class-less run of semantic nodes
 * (eyebrow <p>, <h1>, sub-copy <p>, price <p>, and CTA <a>s) wrapped in one or
 * two structural <div>s. This decorator PROBES that flat content by shape
 * (never by an authored class, never by child index) and RECONSTRUCTS the rich
 * centred lockup — text group + price + pill action row — stamping its own
 * `.forge-get-acrobat-studio-today`-scoped classes that the co-authored CSS keys on.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// From libs/c2/blocks/<name>/ to libs/utils/* is THREE hops up (blocks -> c2 -> libs).
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-get-acrobat-studio-today';
const PRICE_RE = /(US?\$|\/mo\b|\/yr\b|month|year|billed|annual)/i;

// MEP / personalization markers Milo stamps on the cell wrapper. The rebuild
// discards that wrapper, so lift any present marker onto the block root first
// (dropping them silently disables Target/MEP on the section).
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  for (const attr of ['data-manifest-id', 'data-adobe-target-testid']) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

const slug = (text) => String(text || '')
  .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  .slice(0, 40);

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Lift MEP markers off the (soon-discarded) cell wrapper onto the block root.
  preserveMepAttrs(el.querySelector(':scope > div'), el);

  // Standard C2 typography (headings, body, eyebrow) BEFORE we add our own
  // scoped classes — the shared Milo primitive, with our classes layered on top.
  decorateBlockText(el);

  // ---- Probe the flat content by shape, in document order (C2). ----
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const eyebrow = [];
  const copy = [];
  let price = null;
  const ctas = [];
  const handled = new WeakSet();

  [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a')].forEach((node) => {
    if (handled.has(node) || node === heading) return;
    if (node.tagName === 'A') { ctas.push(node); return; }
    if (node.tagName !== 'P') return;
    const link = node.querySelector('a');
    if (link) {
      node.querySelectorAll('a').forEach((a) => { ctas.push(a); handled.add(a); });
      return;
    }
    const text = node.textContent.trim();
    if (!text) return;
    // Position relative to the heading decides eyebrow vs. body.
    const before = heading
      && (heading.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING);
    if (before) eyebrow.push(node);
    else if (!price && PRICE_RE.test(text)) price = node;
    else copy.push(node);
  });

  // ---- Reconstruct the rich centred lockup. ----
  const textGroup = createTag('div', { class: 'text-group' });
  eyebrow.forEach((p) => { p.classList.add('eyebrow', 'label'); textGroup.appendChild(p); });
  if (heading) { heading.classList.add('headline'); textGroup.appendChild(heading); }
  copy.forEach((p) => { p.classList.add('copy', 'body-lg'); textGroup.appendChild(p); });

  const content = createTag('div', { class: 'content' }, textGroup);

  if (price || ctas.length) {
    const ctaGroup = createTag('div', { class: 'cta-group' });
    if (price) { price.classList.add('price'); ctaGroup.appendChild(price); }
    if (ctas.length) {
      const actions = createTag('div', { class: 'action-area' });
      ctas.forEach((a, i) => {
        a.classList.add('cta', 'con-button', i === 0 ? 'primary' : 'secondary');
        a.setAttribute('daa-ll', slug(a.textContent) || `cta-${i + 1}`);
        actions.appendChild(a);
      });
      ctaGroup.appendChild(actions);
    }
    content.appendChild(ctaGroup);
  }

  const foreground = createTag('div', { class: 'foreground' }, content);
  // Single wipe-free swap: replace the flat authored content with the rebuild.
  el.replaceChildren(foreground);
}
