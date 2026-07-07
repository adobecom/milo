/**
 * forge-watermark-section — a Milo C2 decorative-watermark band.
 *
 * The Figma section (node 8477:87987, "full-width dark") is a purely decorative
 * layer: a large monoline "M" brand mark stroked over a dark background, sitting
 * BEHIND the page's foreground content. DA strips the authored `.mono-watermark`
 * class and serializes the cell as a flat, class-less run (checklist C24), so
 * this decorator RECONSTRUCTS the structure from content order rather than
 * trusting any authored class:
 *   - it lifts the flat cell children up to the block root,
 *   - separates real authored content (headings / copy / media / links) from the
 *     empty decorative cell,
 *   - builds an aria-hidden `.mono-watermark` SVG layer (inline, non-scaling
 *     stroke) that ALWAYS renders — so the band never collapses to zero height,
 *   - stacks any authored content in a foreground layer above the watermark and
 *     promotes it with Milo's own decorate services.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/* is THREE hops up
// (blocks -> c2 -> libs). Decorate services come ONLY from utils/decorate.js;
// createTag comes from utils/utils.js (L30).
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-watermark-section';

// The Monobloc monoline "M" mark: two rounded humps drawn as a single open
// stroke (fill:none, non-scaling stroke set in CSS). preserveAspectRatio keeps
// the glyph centered as the container reflows.
const MARK_PATH = 'M14 86 L14 44 Q14 16 39 16 Q60 16 60 40 L60 48 Q60 16 82 16 Q106 16 106 44 L106 86';
const MARK_SVG = `<svg class="${BLOCK}__mark" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">`
  + `<path class="${BLOCK}__mark-path" d="${MARK_PATH}" /></svg>`;

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so copy any present marker up onto the block root FIRST.
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

// A node is meaningful foreground content if it carries text, a link/button, or
// media. Empty wrappers (the decorative cell's leftovers) are dropped.
function hasContent(node) {
  if (!node || node.nodeType !== 1) return false;
  if (node.querySelector?.('picture, img, a, button')) return true;
  return (node.textContent || '').trim().length > 0;
}

export default async function init(el) {
  if (!el) return;
  // Section-level analytics handle (idiomatic Milo; daa-ll stays section-owned).
  el.setAttribute('daa-lh', BLOCK);

  // Un-wrap the single content cell so we walk the real flat children (C24: never
  // key on authored classes — probe by content). Lift MEP markers before discard.
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    preserveMepAttrs(inner.parentElement, el);
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }

  // Account for EVERY flat child: keep the ones carrying real content, drop empty
  // decorative wrappers. Never assume a fixed shape.
  const flat = [...el.childNodes];
  const contentNodes = flat.filter((n) => n.nodeType === 1 && hasContent(n));

  const rebuilt = [];

  // Foreground: any authored heading/copy/media/CTA, centered above the mark.
  let foreground = null;
  if (contentNodes.length) {
    foreground = createTag('div', { class: `${BLOCK}__content` });
    // appendChild MOVES each node intact — its own data-mep-*/attributes and any
    // <picture>/<img> loading/width/height/srcset survive (C4, C11).
    contentNodes.forEach((n) => foreground.appendChild(n));
    rebuilt.push(foreground);
  }

  // Decorative watermark layer — aria-hidden, pointer-events:none (in CSS). Always
  // present so the band reserves real height even with no authored content.
  const watermark = createTag('div', { class: `${BLOCK}__watermark`, 'aria-hidden': 'true' }, MARK_SVG);
  rebuilt.push(watermark);

  // Swap in the reconstructed section once (C3: never innerHTML-wipe authored DOM).
  el.replaceChildren(...rebuilt);

  // Promote authored text + buttons via Milo's own services (real decorator, not a
  // capture shim). Wrapped in decorateViewportContent so per-viewport tables each
  // decorate; guarded so a single-viewport table still decorates when it's absent.
  if (foreground) {
    const decorate = (scope) => {
      const target = scope?.contains?.(foreground) ? foreground : scope;
      // decorateBlockText promotes headings→heading-* / copy→body-* and calls
      // decorateButtons internally (buttons + hash modifiers + a11y wiring).
      if (target) decorateBlockText(target);
    };
    if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
    else decorate(el);

    // Analytics + a11y wiring on any interactive/media node the author supplied.
    foreground.querySelectorAll('a, button').forEach((link) => {
      if (!link.hasAttribute('daa-ll')) {
        const label = (link.textContent || 'link').trim().slice(0, 30) || 'link';
        link.setAttribute('daa-ll', label);
      }
    });
    foreground.querySelectorAll('img').forEach((img, i) => {
      if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', String(i + 1));
    });
  }

  el.dataset.forgeAuthored = BLOCK;
}
