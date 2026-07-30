/**
 * forge-hero — a Milo C2 hero block authored by Forge for a "split-media" newsroom
 * hero that matched no existing catalog block (closest sibling: rich-content).
 *
 * RUNTIME CONTRACT (the reason this file reconstructs rather than styles-in-place):
 * DA serializes the authored block as a FLAT, class-LESS run of semantic nodes in
 * document order —
 *   <p>eyebrow</p><h1>id</h1><p>featured eyebrow</p><h2>featured title</h2>
 *   <a href>cta</a><picture><img></picture>
 * — with NO .container / .hero__lead / .hero__media wrappers and NONE of the Figma
 * classes that section.html carries. So init() PROBES the content by shape (never by
 * an authored class, never by child index) and REBUILDS the split-media layout with
 * createTag, MOVING the real nodes (preserving <picture>/<img> attributes + any MEP
 * markers) into the reconstructed tree, then hands the text to Milo's own
 * decorateBlockText (which also decorates the CTA via decorateButtons — analytics +
 * a11y + #_button-* hash handling). One el.replaceChildren at the end; el.innerHTML is
 * never wiped.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/*.js is THREE hops up
// (blocks -> c2 -> libs). decorate* services come ONLY from utils/decorate.js.
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-hero';

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
  const heading = el.querySelector('h1');
  const subhead = el.querySelector('h2');
  const media = el.querySelector('picture')
    || el.querySelector('img')?.closest('p, div')
    || el.querySelector('img');
  const cta = el.querySelector('a[href]');
  // Text paragraphs that are not media carriers, in document order.
  const paras = [...el.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());

  // The <p> before the h1 is the section eyebrow; the next one is the featured label.
  let eyebrowP = null;
  let featuredP = null;
  paras.forEach((p) => {
    const before = heading
      && (heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING);
    if (before && !eyebrowP) eyebrowP = p;
    else if (!featuredP) featuredP = p;
  });

  // ---- Reconstruct the split-media layout (createTag + move real nodes) ----
  const container = createTag('div', { class: 'container' });
  const lead = createTag('div', { class: 'hero__lead' });

  if (eyebrowP) { eyebrowP.classList.add('eyebrow'); lead.append(eyebrowP); }
  if (heading) { heading.classList.add('hero__id'); lead.append(heading); }

  const featured = createTag('div', { class: 'featured' });
  if (featuredP) { featuredP.classList.add('eyebrow', 'featured__eyebrow'); featured.append(featuredP); }
  if (subhead) { subhead.classList.add('featured__title'); featured.append(subhead); }
  if (cta) {
    // Wrap in <p><strong>a</strong></p> so Milo's decorateButtons promotes it to a
    // primary con-button (analytics + a11y + #_button-* hash decoration) — no
    // hard-coded suffix anchors, no bespoke button markup.
    const ctaText = cta.textContent.trim();
    const actionP = createTag('p', { class: 'hero__cta' });
    const strong = createTag('strong');
    strong.append(cta); // moves the real anchor (keeps href + MEP attrs)
    actionP.append(strong);
    featured.append(actionP);
    if (!cta.hasAttribute('daa-ll')) cta.setAttribute('daa-ll', `${slug(ctaText) || 'cta'}-1`);
  }
  if (featured.childElementCount) lead.append(featured);

  container.append(lead);

  if (media) {
    const mediaWrap = createTag('div', { class: 'hero__media' });
    mediaWrap.append(media); // moves the real <picture>/<img> (keeps all attrs)
    // Tag the moved media with block-owned classes so the CSS styles the block's
    // own elements (never a bare img/picture selector that reaches page-level media).
    if (media.tagName === 'PICTURE') media.classList.add('hero__picture');
    const img = mediaWrap.querySelector('img');
    if (img) {
      img.classList.add('hero__img');
      if (!img.hasAttribute('daa-im')) {
        img.setAttribute('daa-im', slug(img.getAttribute('alt')) || 'hero-image');
      }
    }
    container.append(mediaWrap);
  }

  // Milo typography + CTA decoration (headings -> heading-N, copy -> body-*,
  // eyebrow toggle, and decorateButtons on the wrapped CTA).
  decorateBlockText(lead);

  // Single structural swap — never wipes el.innerHTML, preserves el's own attrs.
  el.replaceChildren(container);

  el.dataset.forgeAuthored = BLOCK;
}
