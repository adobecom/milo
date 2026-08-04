/**
 * forge-get-acrobat-studio-today — a Milo C2 centred hero authored by Forge.
 *
 * Runtime input (DA serialisation) is a FLAT, class-LESS run of nodes in
 * document order — a background <picture>, an eyebrow <p>, the <h1>, a subhead
 * <p>, a price <p>, and two CTA <a>s. NONE of the Figma structural classes
 * survive authoring, so init() PROBES the content by shape (never by an
 * authored class or a fixed child index) and RECONSTRUCTS the rich hero:
 *
 *   .forge-…-media      full-bleed background picture (absolute, object-fit)
 *   .forge-…-overlay    dark top→bottom gradient scrim
 *   .forge-…-foreground centred copy lockup + pricing/CTA lockup
 *
 * The scoped stylesheet keys ONLY on the classes stamped here.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ → libs/utils/ is THREE hops up
// (blocks → c2 → libs). Keep the 3-hop '../../../' form.
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-get-acrobat-studio-today';

// MEP / personalization markers Milo stamps on the row/cell wrapper we discard
// during the rebuild — copy any present marker up onto the block root first so a
// later Target/MEP swap still finds them.
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

const slug = (text) => String(text || '')
  .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  .slice(0, 40);

// Disambiguates daa-lh across N same-name instances on one page.
function instanceSuffix(el) {
  const all = [...document.querySelectorAll(`.${BLOCK}`)];
  const idx = all.indexOf(el);
  return all.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

// Read the flat text run in DOCUMENT ORDER (querySelectorAll is ordered): the
// <p>s that precede the heading are eyebrow candidates, the first <p> after it
// is the subhead, and any remaining <p>s are pricing lines. Walking the actual
// order (never a fixed index, never compareDocumentPosition) means authored
// reordering or an extra paragraph can't silently drop a node.
function readCopy(el) {
  const flow = [...el.querySelectorAll('h1, h2, h3, p')]
    .filter((n) => isHeading(n) || !n.querySelector('picture, img'));
  const headingIdx = flow.findIndex(isHeading);
  const heading = headingIdx >= 0 ? flow[headingIdx] : null;
  const before = [];
  const after = [];
  flow.forEach((n, i) => {
    if (isHeading(n)) return;
    if (headingIdx < 0 || i < headingIdx) before.push(n);
    else after.push(n);
  });
  return {
    heading,
    eyebrow: before[before.length - 1] || null,
    subhead: after[0] || null,
    priceLines: after.slice(1),
  };
}

export default async function init(el) {
  if (!el) return;

  const daaLh = `${BLOCK}${instanceSuffix(el)}`;
  el.setAttribute('daa-lh', daaLh);

  // Lift MEP markers off the (soon-discarded) cell/row wrapper onto the root.
  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(cell?.parentElement || cell, el);

  // PROBE by content shape (C2) — never children[N].
  const pic = el.querySelector('picture') || el.querySelector('img');
  const anchors = [...el.querySelectorAll('a')];
  const { heading, eyebrow, subhead, priceLines } = readCopy(el);

  // --- Background media (moved, not recreated → keeps srcset/width/height/loading) ---
  const media = createTag('div', { class: `${BLOCK}-media`, 'aria-hidden': 'true' });
  if (pic) {
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img && !img.hasAttribute('daa-im')) img.setAttribute('daa-im', `${daaLh}|background`);
    if (img && !img.getAttribute('alt')) img.setAttribute('alt', '');
    media.append(pic);
  }

  const overlay = createTag('div', { class: `${BLOCK}-overlay`, 'aria-hidden': 'true' });

  // --- Copy lockup ---
  const copy = createTag('div', { class: `${BLOCK}-copy` });
  if (eyebrow) { eyebrow.classList.add(`${BLOCK}-eyebrow`, 'eyebrow'); copy.append(eyebrow); }
  if (heading) { heading.classList.add(`${BLOCK}-heading`); copy.append(heading); }
  if (subhead) { subhead.classList.add(`${BLOCK}-subhead`, 'body-l'); copy.append(subhead); }

  // --- Pricing + CTA lockup ---
  const ctaGroup = createTag('div', { class: `${BLOCK}-cta-group` });
  priceLines.forEach((p) => { p.classList.add(`${BLOCK}-price`); ctaGroup.append(p); });

  if (anchors.length) {
    const buttons = createTag('div', { class: `${BLOCK}-buttons` });
    anchors.forEach((a, i) => {
      const label = (a.textContent || '').replace(/\s+/g, ' ').trim();
      a.textContent = label;
      a.classList.add('con-button', i === 0 ? 'primary' : 'secondary');
      if (!a.getAttribute('daa-ll')) a.setAttribute('daa-ll', `${daaLh}|${slug(label) || `cta-${i + 1}`}`);
      buttons.append(a);
    });
    ctaGroup.append(buttons);
  }

  const foreground = createTag('div', { class: `${BLOCK}-foreground foreground` });
  if (copy.childElementCount) foreground.append(copy);
  if (ctaGroup.childElementCount) foreground.append(ctaGroup);

  // Build then swap once (C3 — never innerHTML wipe).
  el.replaceChildren(media, overlay, foreground);
  el.dataset.forgeAuthored = BLOCK;
}
