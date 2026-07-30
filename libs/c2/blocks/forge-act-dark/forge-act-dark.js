/**
 * forge-act-dark — a Milo C2 "act / drive-action" block authored by Forge for a
 * dark split-media newsroom section that matched no existing catalog block
 * (closest sibling: rich-content, tight-variant score 0.85).
 *
 * RUNTIME CONTRACT (why this file RECONSTRUCTS rather than styles-in-place):
 * DA serializes the authored block as a FLAT, class-LESS run of semantic nodes in
 * document order —
 *   <picture><img></picture><p>eyebrow</p><h3>title</h3><p>body</p><a href>cta</a>
 * — with NO .container / .summit__media / .summit__copy wrappers and NONE of the
 * Figma classes section.html carries (those are stripped before init() runs). So
 * init() PROBES the content by shape (never by an authored class, never by child
 * index) and REBUILDS the split-media layout with createTag, MOVING the real nodes
 * (preserving <picture>/<img> attributes + any MEP markers) into the reconstructed
 * tree, then hands the copy to Milo's own decorateBlockText (headings -> heading-2,
 * body -> body-md, eyebrow toggle, and decorateButtons for the CTA — analytics +
 * a11y + #_button-* hash handling). One el.replaceChildren at the end; el.innerHTML
 * is never wiped.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/*.js is THREE hops up
// (blocks -> c2 -> libs). decorate* services come ONLY from utils/decorate.js;
// createTag comes ONLY from utils/utils.js (L30 validates the specifier).
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-act-dark';

// MEP / personalization markers Milo may stamp on the row/cell wrappers that the
// rebuild discards. Copy any present marker onto the block root FIRST so a later
// Target/MEP swap still finds them (dropping them silently disables MEP).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null && !to.hasAttribute(attr)) to.setAttribute(attr, v);
  }
  // data-mep-* is an open family — copy every attribute in that namespace.
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-') && !to.hasAttribute(a.name)) {
      to.setAttribute(a.name, a.value);
    }
  }
}

// Slugify link/alt text into a short daa- analytics label.
function slug(text) {
  return String(text || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Lift MEP markers off the EDS row/cell wrappers before they are discarded.
  el.querySelectorAll(':scope > div, :scope > div > div').forEach((w) => preserveMepAttrs(w, el));

  // PROBE the flat content by shape (never by authored class / positional index).
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const media = el.querySelector('picture')
    || el.querySelector('img')?.closest('p, div')
    || el.querySelector('img');
  const cta = el.querySelector('a[href]');
  // Non-media text paragraphs, in document order.
  const paras = [...el.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());

  // The <p> before the heading is the eyebrow; everything else is body copy.
  let eyebrowP = null;
  const bodyPs = [];
  paras.forEach((p) => {
    const before = heading
      && (heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING);
    if (before && !eyebrowP) eyebrowP = p;
    else bodyPs.push(p);
  });

  // ---- Reconstruct the split-media layout (createTag + move real nodes) ----
  const container = createTag('div', { class: 'container' });

  // Media slot — moves the real <picture>/<img> (keeps loading/width/height/srcset).
  if (media) {
    const mediaWrap = createTag('div', { class: 'act-dark__media' });
    mediaWrap.append(media);
    if (media.tagName === 'PICTURE') media.classList.add('act-dark__picture');
    const img = mediaWrap.querySelector('img');
    if (img) {
      img.classList.add('act-dark__img');
      if (!img.hasAttribute('daa-im')) {
        img.setAttribute('daa-im', slug(img.getAttribute('alt')) || 'act-dark-image');
      }
    }
    container.append(mediaWrap);
  }

  // Copy slot — eyebrow + heading + body + CTA.
  const copy = createTag('div', { class: 'act-dark__copy' });
  if (eyebrowP) { eyebrowP.classList.add('eyebrow'); copy.append(eyebrowP); }
  if (heading) copy.append(heading);
  bodyPs.forEach((p) => copy.append(p));

  if (cta) {
    // Wrap in <p class><em><a></em></p> so Milo's decorateButtons promotes it to an
    // OUTLINE con-button (ghost look on dark) with analytics + a11y + #_button-* hash
    // decoration — no bespoke button markup, no hard-coded suffix anchors. The p
    // carries a class so decorateBlockText's body-md pass skips it.
    const ctaText = cta.textContent.trim();
    const actionP = createTag('p', { class: 'act-dark__cta' });
    const em = createTag('em');
    em.append(cta); // moves the real anchor (keeps href + MEP attrs)
    actionP.append(em);
    copy.append(actionP);
    if (!cta.hasAttribute('daa-ll')) cta.setAttribute('daa-ll', `${slug(ctaText) || 'cta'}-1`);
  }
  container.append(copy);

  // Milo typography + CTA decoration (heading -> heading-2, copy -> body-md,
  // eyebrow toggle, and decorateButtons on the wrapped CTA).
  decorateBlockText(copy);

  // Single structural swap — never wipes el.innerHTML, preserves el's own attrs.
  el.replaceChildren(container);

  el.dataset.forgeAuthored = BLOCK;
}
