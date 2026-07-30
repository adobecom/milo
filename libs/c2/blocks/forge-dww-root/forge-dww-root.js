/**
 * forge-dww-root — a Milo C2 hero band authored by Forge for a section that
 * matched no existing catalog block.
 *
 * RUNTIME SHAPE (the trap): DA serializes this block's content as a FLAT,
 * class-LESS run of semantic nodes in document order — a hero <picture>, a
 * heading <p>, a sub-copy <p>, and a CTA <a>. The Figma section's structural
 * classes (.dww-hero-wrap / .dww-lockup / .dww-btn …) DO NOT EXIST at runtime,
 * so this decorator PROBES BY CONTENT SHAPE (never by an authored class or a
 * fixed child index) and RECONSTRUCTS the rich hero layout with createElement +
 * classList.add, stamping its OWN `.forge-dww-root-*` classes that the scoped
 * stylesheet keys on. It builds three layers — a full-bleed media plate, a
 * top+bottom gradient scrim, and a centred copy lockup (heading + sub + CTA).
 *
 * Every flat child is accounted for: the first heading/paragraph becomes the
 * <h2> title, the remaining paragraphs become sub-copy, and every <a> becomes a
 * pill button — nothing is dropped. Original nodes are MOVED (not cloned) so
 * <picture>/<img> attributes (loading, width, height, srcset) and MEP markers
 * survive; the block root is rebuilt with replaceChildren (never innerHTML="").
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). Do NOT "correct" this to 2 hops.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-dww-root';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The
// rebuild discards that wrapper, so copy any present marker onto its target
// FIRST — a swap that drops them silently disables Target/MEP on the section.
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

// Disambiguates daa-lh across N same-name instances on one page (1-based idx).
function forgeInstanceSuffix(root, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(root);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

const slugify = (text) => String(text || '')
  .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40);

// A <p>/<h*> counts as TEXT only when it carries copy of its own — a paragraph
// whose entire text is a single link is an ACTION, not a heading/sub-copy.
function isTextEl(node) {
  const text = node.textContent.trim();
  if (!text) return false;
  const link = node.querySelector('a');
  return !(link && link.textContent.trim() === text);
}

export default async function init(el) {
  if (!el) return;

  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // The authored content lives in the innermost EDS cell; lift MEP markers off
  // it before the rebuild so a later Target/MEP swap still finds them.
  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div') || el;
  preserveMepAttrs(cell, el);

  // PROBE BY CONTENT SHAPE (never by class or a fixed index) — walk the whole
  // block so nesting depth doesn't matter.
  const picture = el.querySelector('picture');
  const loneImg = !picture ? el.querySelector('img') : null;
  const links = [...el.querySelectorAll('a')];
  const textEls = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p')].filter(isTextEl);

  // ---- media plate (full-bleed background) ----
  const media = document.createElement('div');
  media.className = `${BLOCK}-media`;
  if (picture) {
    media.appendChild(picture);
  } else if (loneImg) {
    const pic = document.createElement('picture');
    pic.appendChild(loneImg);
    media.appendChild(pic);
  }
  const img = media.querySelector('img');
  if (img) img.setAttribute('daa-im', `${daaLh}|${slugify(img.getAttribute('alt')) || 'hero'}`);

  // ---- gradient scrim (keeps the copy legible over the photo) ----
  const scrim = document.createElement('div');
  scrim.className = `${BLOCK}-scrim`;
  scrim.setAttribute('aria-hidden', 'true');

  // ---- copy lockup ----
  const content = document.createElement('div');
  content.className = `${BLOCK}-content`;
  const lockup = document.createElement('div');
  lockup.className = `${BLOCK}-lockup`;
  content.appendChild(lockup);

  if (textEls.length) {
    const texts = document.createElement('div');
    texts.className = `${BLOCK}-texts`;
    // First text node → <h2> title (h2 not h1: avoids multi-h1 across the page;
    // the display weight comes from CSS, not the tag). Move childNodes so any
    // inline markup + MEP survive.
    const [headSrc, ...subSrc] = textEls;
    const heading = document.createElement('h2');
    heading.className = `${BLOCK}-heading`;
    while (headSrc.firstChild) heading.appendChild(headSrc.firstChild);
    preserveMepAttrs(headSrc, heading);
    texts.appendChild(heading);
    // Remaining paragraphs → sub-copy (moved intact so MEP/markup survive).
    subSrc.forEach((p) => {
      p.classList.add(`${BLOCK}-sub`);
      texts.appendChild(p);
    });
    lockup.appendChild(texts);
  }

  if (links.length) {
    const actions = document.createElement('div');
    actions.className = `${BLOCK}-actions`;
    links.forEach((a, i) => {
      a.classList.add(`${BLOCK}-btn`);
      if (!a.hasAttribute('daa-ll')) {
        a.setAttribute('daa-ll', `${daaLh}|${slugify(a.textContent) || `cta-${i + 1}`}`);
      }
      actions.appendChild(a);
    });
    lockup.appendChild(actions);
  }

  // Rebuild the block root once (never innerHTML="" — that wipes Target/MEP).
  const layers = [];
  if (media.querySelector('picture, img')) layers.push(media);
  layers.push(scrim, content);
  el.replaceChildren(...layers);

  // Promote typography via Milo's own service (adds heading-2 → correct display
  // font-family + analytics wiring). Guarded: a service hiccup must not brick
  // the already-rebuilt hero.
  try {
    decorateBlockText(content);
  } catch (error) {
    window.lana?.log?.(`${BLOCK} decorateBlockText failed: ${error}`, { tags: BLOCK, severity: 'info' });
  }

  el.dataset.forgeAuthored = BLOCK;
}
