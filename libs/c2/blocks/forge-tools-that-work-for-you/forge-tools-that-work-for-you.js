/**
 * forge-tools-that-work-for-you — a Milo C2 block authored by Forge.
 *
 * A full-bleed dark hero/marquee: a background photograph, a design-specified
 * gradient scrim (dark at the top so the copy stays legible, clear across the
 * middle, dark again at the base), and a centred copy lockup sitting near the
 * top — a headline, a supporting line, and a single outline "See all products"
 * pill.
 *
 * DA serialises this section as a FLAT, class-LESS run of nodes in document
 * order — a <picture>, an <h2>, a <p> body line, then the CTA <a>. The authored
 * Figma classes DO NOT EXIST at runtime, so init() probes by CONTENT SHAPE
 * (never by class) and RECONSTRUCTS the rich layout: it lifts the photo into an
 * absolutely-positioned .background layer, drops a .scrim over it, groups the
 * copy into a centred .foreground lockup, and moves the CTA link into a
 * .button-group pill row — then runs Milo's own decorateBlockText so the block
 * is a real Milo decorator (headline/body typography + link decoration), not an
 * inert capture shim.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-tools-that-work-for-you';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The
// rebuild discards that wrapper, so copy any present marker up onto the block
// root FIRST — a rebuild that drops them silently disables Target/MEP.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

function make(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function slug(text) {
  return String(text || '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

// `node` precedes `ref` in document order?
function precedes(node, ref) {
  if (!node || !ref) return false;
  // eslint-disable-next-line no-bitwise
  return !!(ref.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING);
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // MEP markers live on the row/cell wrapper — lift them to the root before we
  // rebuild the section's DOM out from under them.
  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  if (cell) preserveMepAttrs(cell.parentElement || cell, el);

  // --- Probe the FLAT content by shape (never by authored class). ---
  let picture = el.querySelector('picture');
  if (!picture) {
    const loneImg = el.querySelector('img');
    if (loneImg) { picture = make('picture'); picture.appendChild(loneImg); }
  }
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...el.querySelectorAll('p')]
    .filter((p) => p.textContent.trim() && !p.querySelector('picture, img'));
  // A line before the heading is an eyebrow; a CTA line only holds a link.
  const eyebrow = paras.find((p) => precedes(p, heading)) || null;
  const bodyParas = paras.filter((p) => p !== eyebrow && !p.querySelector('a'));
  const links = [...el.querySelectorAll('a')].filter((a) => a.textContent.trim());

  // --- Reconstruct the rich layout with created containers + moved nodes. ---
  const foreground = make('div', 'foreground');
  const copy = make('div', 'copy');
  if (eyebrow) { eyebrow.classList.add('eyebrow'); copy.appendChild(eyebrow); }
  if (heading) copy.appendChild(heading);
  bodyParas.forEach((p) => copy.appendChild(p));
  foreground.appendChild(copy);

  if (links.length) {
    const actions = make('div', 'actions');
    const group = make('div', 'button-group');
    // Bare authored links (no strong/em wrapper) are not touched by Milo's
    // decorateButtons, so style them as outline pills here.
    links.forEach((a) => { a.classList.add('con-button', 'outline'); group.appendChild(a); });
    actions.appendChild(group);
    foreground.appendChild(actions);
  }

  const rebuilt = [];
  if (picture) {
    const background = make('div', 'background');
    background.setAttribute('aria-hidden', 'true');
    background.appendChild(picture);
    rebuilt.push(background);
    rebuilt.push(make('div', 'scrim'));
  }
  rebuilt.push(foreground);
  el.replaceChildren(...rebuilt);

  // Milo semantics: promotes headline/body typography and decorates any authored
  // strong/em links. Content is identical across viewports (CSS handles the
  // reflow) so no decorateViewportContent split is needed.
  decorateBlockText(foreground);

  // --- Analytics floor (C7): daa-lh on root, daa-im on media, daa-ll on CTAs. ---
  const img = el.querySelector('img');
  if (img && !img.hasAttribute('daa-im')) {
    img.setAttribute('daa-im', `${BLOCK}|${slug(img.getAttribute('alt')) || 'background'}`);
  }
  el.querySelectorAll('a, button').forEach((node) => {
    if (node.hasAttribute('daa-ll')) return;
    const text = node.textContent || node.getAttribute('aria-label') || '';
    node.setAttribute('daa-ll', `${BLOCK}|${slug(text) || 'cta'}`);
  });

  el.dataset.forgeAuthored = BLOCK;
}
