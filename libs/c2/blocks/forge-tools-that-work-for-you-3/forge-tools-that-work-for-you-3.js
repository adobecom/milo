/**
 * forge-tools-that-work-for-you-3 — a Milo C2 hero/marquee block authored by Forge.
 *
 * DA serializes this block's authored content as a FLAT, class-less run of
 * semantic nodes in document order:
 *
 *   <picture>…</picture>   (section background fill)
 *   <picture>…</picture>   (wider hero composite)
 *   <h2>Tools that work for you.</h2>
 *   <p>Bring any idea to life…</p>
 *   <a href="#">See all products</a>
 *
 * There is NO grid/row/tile wrapper and NONE of the Figma descriptive classes
 * (`.dw-content`, `.dw-heading`, …) survive authoring. So `init(el)` PROBES by
 * content shape (never by class or child index) and RECONSTRUCTS the rich
 * layered hero: an absolutely-positioned media layer (the stacked background
 * pictures + a gradient scrim) with a centred foreground lockup on top. Nodes
 * are MOVED (not re-created) so `<picture>`/`<img>` attributes — loading,
 * width/height, srcset, sizes — and any MEP markers survive.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifiers below are REQUIRED —
// decorate* services resolve ONLY from utils/decorate.js, createTag from utils/utils.js.
import { createTag } from '../../../utils/utils.js';
import { decorateButtons } from '../../../utils/decorate.js';

const BLOCK = 'forge-tools-that-work-for-you-3';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so copy any present marker onto the block root FIRST.
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

const slugify = (text) => String(text || '')
  .trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40);

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Un-wrap the EDS row/cell wrappers (block > row > cell > content) so probing
  // sees the flat content run. Lift EVERY cell's children in document order —
  // whether the author put both images in one cell or split them across rows —
  // then drop the emptied row wrappers. MEP markers ride up onto the block root.
  const cells = [...el.querySelectorAll(':scope > div > div')];
  if (cells.length) {
    preserveMepAttrs(cells[0].parentElement, el);
    const rows = new Set();
    cells.forEach((cell) => {
      rows.add(cell.parentElement);
      while (cell.firstChild) el.appendChild(cell.firstChild);
    });
    rows.forEach((row) => row.remove());
  }

  // Probe by content shape, never by position (authors reorder rows).
  const pictures = [...el.querySelectorAll('picture')];
  const looseImgs = [...el.querySelectorAll('img')].filter((im) => !im.closest('picture'));
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  // Text paragraphs only — a paragraph that is merely a link wrapper is handled
  // as a CTA below, so it is excluded here (avoids an empty <p> in the lockup).
  const paras = [...el.querySelectorAll('p')]
    .filter((p) => p.textContent.trim() && !p.querySelector('a'));
  const links = [...el.querySelectorAll('a')];

  // --- Media layer: the stacked background composite + gradient scrim. --------
  const media = createTag('div', { class: 'hero-media', 'aria-hidden': 'true' });
  const mediaNodes = pictures.length ? pictures : looseImgs;
  mediaNodes.forEach((node, i) => {
    node.classList.add('hero-media-item');
    const img = node.matches('img') ? node : node.querySelector('img');
    if (img && !img.hasAttribute('daa-im')) {
      img.setAttribute('daa-im', `${BLOCK}|bg-${i + 1}`);
    }
    media.appendChild(node); // MOVE — preserves loading/srcset/sizes + MEP attrs
  });
  if (mediaNodes.length) {
    media.appendChild(createTag('div', { class: 'hero-scrim', 'aria-hidden': 'true' }));
  }

  // --- Foreground lockup: heading + subhead + CTA, centred over the media. ----
  const foreground = createTag('div', { class: 'hero-foreground' });
  const copy = createTag('div', { class: 'hero-copy' });
  if (heading) {
    heading.classList.add('hero-heading');
    copy.appendChild(heading);
  }
  paras.forEach((p) => {
    p.classList.add('hero-subhead');
    copy.appendChild(p);
  });
  if (copy.childElementCount) foreground.appendChild(copy);

  // CTAs — a real URL stays an <a>; a placeholder ("#"/empty/pure-hash) becomes
  // a <button> (action with no navigation) so we never ship `<a href="#">`.
  links.forEach((a, i) => {
    const href = (a.getAttribute('href') || '').trim();
    const label = (a.textContent || '').trim();
    const isReal = href && !href.startsWith('#');
    let cta;
    if (isReal) {
      cta = a; // reuse the anchor node (preserves its attributes)
    } else {
      cta = createTag('button', { type: 'button' }, label);
      [...a.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-')) cta.setAttribute(attr.name, attr.value);
      });
      a.remove();
    }
    cta.classList.add('hero-cta');
    cta.setAttribute('daa-ll', `${BLOCK}|${slugify(label) || `cta-${i + 1}`}`);
    foreground.appendChild(cta);
  });

  // Robustness: never discard authored content. Any element still parked on the
  // block that we did not classify (and that carries real text or media) rides
  // along in the lockup rather than being dropped by the replace below.
  [...el.children].forEach((node) => {
    if (node === media || node === foreground) return;
    if (node.textContent.trim() || node.querySelector?.('img, picture')) {
      foreground.appendChild(node);
    }
  });

  // Assemble once — media behind, foreground on top. Never emit an empty layer.
  const parts = [];
  if (media.childElementCount) parts.push(media);
  parts.push(foreground);
  el.replaceChildren(...parts);

  // Milo enhancement pass (analytics + a11y wiring for any authored strong/em
  // buttons). Defensive: a service hiccup must never brick decorate.
  try {
    decorateButtons(foreground);
  } catch (e) {
    window.lana?.log(`${BLOCK} decorateButtons failed: ${e?.message || e}`);
  }

  el.dataset.forgeAuthored = BLOCK;
}
