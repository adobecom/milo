/**
 * forge-introducing-color-mode — a Milo C2 "featured media card" section.
 *
 * DA serializes this block's authored content as a FLAT, class-less run inside
 * the EDS cell wrappers (`block > div > div > <picture><picture><h2><p><a>`):
 *   1. a full-bleed before/after color-grade comparison image (the hero),
 *   2. a small Premiere-Pro app-mnemonic badge (overlay, top-left),
 *   3. the headline, 4. the body copy, 5. the "Explore Premiere" CTA link.
 * The Figma classes (`.foreground`/`.media`) DO NOT survive to runtime, so
 * `init(el)` PROBES by content shape (C2/C24) and RECONSTRUCTS the rich layout:
 * a rounded media panel (hero + badge overlay) above a copy row (headline + body
 * on the left, CTA on the right). Nodes are MOVED (never re-serialized) so every
 * <picture>/<img> attribute — loading/width/height/srcset/sizes — and any MEP
 * marker is preserved (C4/C11). Typography is promoted with Milo's own
 * decorateBlockText service (C5), and the built tree is committed once via
 * el.replaceChildren (never a destructive DOM wipe — C3/L2).
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT (L30).
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-introducing-color-mode';
const SVGNS = 'http://www.w3.org/2000/svg';

// MEP / personalization markers Milo stamps on the row/cell wrappers. We discard
// those wrappers when we replaceChildren(el, rebuilt), so copy any present marker
// up onto the block root FIRST — a swap that drops them silently disables
// Target/MEP on the section. data-mep-* is an open family (copy the whole set).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null && !to.hasAttribute(attr)) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-') && !to.hasAttribute(a.name)) to.setAttribute(a.name, a.value);
  }
}

// Disambiguates daa-lh across N same-name instances on one page (1-based suffix).
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

const slugify = (text) => String(text || '')
  .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

// An app-mnemonic badge is a small brand glyph (e.g. "B_app_PremierePro"), not the
// hero comparison image. Detect by Figma's app-asset naming convention, or by a
// short single-token label — NOT by product words, which also appear in the hero's
// descriptive alt ("Premiere Pro Color Mode — before and after…").
const isBadge = (pic) => {
  const alt = (pic.querySelector('img')?.getAttribute('alt') || '').trim();
  if (!alt) return false;
  if (/^b[_\s-]?app\b/i.test(alt)) return true;
  return alt.length <= 24 && !/\s/.test(alt);
};

// Chevron built in the SVG namespace (no markup-string parsing — keeps the block
// L2-clean). currentColor makes it inherit the CTA link colour.
function chevron() {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('width', '7');
  svg.setAttribute('height', '12');
  svg.setAttribute('viewBox', '0 0 7 12');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVGNS, 'path');
  path.setAttribute('d', 'M1 1.5L5.5 6L1 10.5');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

export default async function init(el) {
  if (!el) return;

  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Lift MEP markers off the EDS row/cell wrappers before we discard them.
  el.querySelectorAll(':scope > div, :scope > div > div').forEach((w) => preserveMepAttrs(w, el));

  // PROBE by content shape (C2) across whatever wrapper depth DA produced —
  // never by a fixed child index and never by an authored class (C24).
  const pictures = [...el.querySelectorAll('picture')];
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const cta = el.querySelector('a[href]');
  const bodies = [...el.querySelectorAll('p')].filter((p) => {
    const text = p.textContent.trim();
    if (!text) return false;
    return !(cta && p.contains(cta) && text === cta.textContent.trim());
  });

  // Split media: every non-badge picture is a hero; the badge (if any) overlays.
  const badgePic = pictures.find(isBadge) || (pictures.length > 1 ? pictures[pictures.length - 1] : null);
  const heroPics = pictures.filter((p) => p !== badgePic);

  const foreground = createTag('div', { class: `${BLOCK}-foreground` });

  // --- Media panel (rounded, overflow-clipped; hero + badge overlay). ---
  if (heroPics.length || badgePic) {
    const media = createTag('div', { class: `${BLOCK}-media` });
    heroPics.forEach((pic, i) => {
      pic.classList.add(`${BLOCK}-media-img`);
      const img = pic.querySelector('img');
      if (img) {
        // Stamp our OWN scoped class so the CSS styles the block's image, never a
        // bare `img` that would reach page-level media outside this block.
        img.classList.add(`${BLOCK}-hero-img`);
        if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', `${daaLh}|hero${i ? `-${i + 1}` : ''}`);
      }
      media.appendChild(pic);
    });
    if (badgePic) {
      badgePic.classList.add(`${BLOCK}-badge`);
      const bimg = badgePic.querySelector('img');
      if (bimg) {
        bimg.classList.add(`${BLOCK}-badge-img`);
        if (!bimg.hasAttribute('daa-im')) bimg.setAttribute('daa-im', `${daaLh}|app-badge`);
      }
      media.appendChild(badgePic);
    }
    foreground.appendChild(media);
  }

  // --- Copy row: headline + body (left), CTA (right). ---
  if (heading || bodies.length || cta) {
    const content = createTag('div', { class: `${BLOCK}-content` });
    const copy = createTag('div', { class: `${BLOCK}-copy` });
    if (heading) copy.appendChild(heading);
    bodies.forEach((p) => copy.appendChild(p));
    if (copy.childElementCount) content.appendChild(copy);

    if (cta) {
      const label = cta.textContent.trim();
      cta.classList.add(`${BLOCK}-cta`, 'label');
      cta.replaceChildren(createTag('span', { class: `${BLOCK}-cta-label` }, label), chevron());
      if (!cta.hasAttribute('daa-ll')) cta.setAttribute('daa-ll', `${daaLh}|${slugify(label) || 'cta'}`);
      content.appendChild(cta);
    }

    // Promote to C2 typography via Milo's own service (headings -> heading-2,
    // body copy -> body-md). Scoped CSS tunes size/colour toward the comp.
    decorateBlockText(copy, { heading: '2', body: 'md' });
    foreground.appendChild(content);
  }

  // Commit the rebuilt tree in one shot — never destructively wipe authored DOM.
  el.replaceChildren(foreground);
  el.dataset.forgeAuthored = BLOCK;
}
