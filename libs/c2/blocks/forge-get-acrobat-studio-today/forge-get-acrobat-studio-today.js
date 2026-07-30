/**
 * forge-get-acrobat-studio-today — a Milo C2 block authored by Forge.
 *
 * A full-bleed dark hero/marquee: a background photograph, a design-specified
 * gradient scrim, and a centred copy lockup (eyebrow, headline, body, price and
 * two CTA pills).
 *
 * DA serialises this section as a FLAT, class-LESS run of nodes in document
 * order — a <picture>, then <p> eyebrow, <h2>, <p> body, <p> price, and the CTA
 * paragraphs. The authored Figma classes (.foreground/.media/…) DO NOT EXIST at
 * runtime, so init() probes by CONTENT SHAPE (never by class) and RECONSTRUCTS
 * the rich layout: it lifts the photo into an absolutely-positioned .background
 * layer, drops a .scrim over it, and groups the copy into a centred .foreground
 * lockup — then runs Milo's own decorateBlockText (which promotes the headline,
 * eyebrow and body, and styles the CTA links into con-buttons) so the block is a
 * real Milo decorator, not an inert capture shim.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-get-acrobat-studio-today';
const PRICE_RE = /(\$|\/\s*mo\b|\/\s*month|per month|billed|\bmonthly\b)/i;
const CTA_MAX = 32; // a CTA label is short; a body sentence is not.

// MEP / personalization markers Milo stamps on the row/cell wrapper. The
// un-wrap discards that wrapper, so copy any present marker up onto the block
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

// `a` precedes `ref` in document order?
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

  const eyebrow = paras.find((p) => precedes(p, heading)) || null;
  const rest = paras.filter((p) => p !== eyebrow && (!heading || !precedes(p, heading)));
  const price = rest.find((p) => PRICE_RE.test(p.textContent)) || null;
  const ctaParas = rest.filter((p) => p !== price
    && (p.querySelector('a') || p.textContent.trim().length <= CTA_MAX));
  const bodyParas = rest.filter((p) => p !== price && !ctaParas.includes(p));

  // --- Reconstruct the rich layout with created containers + moved nodes. ---
  const foreground = make('div', 'foreground');
  const copy = make('div', 'copy');
  if (eyebrow) { eyebrow.classList.add('eyebrow'); copy.appendChild(eyebrow); }
  if (heading) copy.appendChild(heading);
  bodyParas.forEach((p) => copy.appendChild(p));
  foreground.appendChild(copy);

  const actions = make('div', 'actions');
  if (price) { price.classList.add('price'); actions.appendChild(price); }
  // Move CTA paragraphs in first so decorateBlockText/decorateButtons can style
  // any authored links; bare-text CTAs are converted below.
  ctaParas.forEach((p) => actions.appendChild(p));
  if (actions.children.length) foreground.appendChild(actions);

  const rebuilt = [];
  if (picture) {
    const background = make('div', 'background');
    background.appendChild(picture);
    background.setAttribute('aria-hidden', 'true');
    rebuilt.push(background);
    rebuilt.push(make('div', 'scrim'));
  }
  rebuilt.push(foreground);
  el.replaceChildren(...rebuilt);

  // Milo semantics: promotes headline/eyebrow/body typography and turns authored
  // strong/em CTA links into con-buttons. Content is identical across viewports
  // (CSS handles the visual reflow) so no decorateViewportContent split is needed.
  decorateBlockText(foreground);

  // Group the decorated CTAs into a single pill row. Real DA links become
  // .con-buttons here; if none were authored (bare text), synthesise buttons so
  // the row is never empty.
  if (ctaParas.length) {
    const group = make('div', 'button-group');
    const conButtons = [...actions.querySelectorAll('.con-button')];
    if (conButtons.length) {
      conButtons.forEach((btn) => group.appendChild(btn));
    } else {
      ctaParas.forEach((p, i) => {
        const btn = make('button', `con-button ${i === 0 ? 'blue' : 'outline'}`);
        btn.type = 'button';
        btn.textContent = p.textContent.trim();
        group.appendChild(btn);
      });
    }
    // Drop the CTA paragraph wrappers left behind once their buttons moved out.
    actions.querySelectorAll('p').forEach((p) => {
      if (p !== price && !p.querySelector('.con-button')) p.remove();
    });
    if (group.children.length) actions.appendChild(group);
  }

  // --- Analytics floor (C7): daa-lh on root, daa-im on media, daa-ll on CTAs. ---
  const img = el.querySelector('img');
  if (img && !img.hasAttribute('daa-im')) {
    img.setAttribute('daa-im', `${BLOCK}|${slug(img.getAttribute('alt')) || 'background'}`);
  }
  el.querySelectorAll('.con-button, a, button').forEach((node) => {
    if (node.hasAttribute('daa-ll')) return;
    const text = node.textContent || node.getAttribute('aria-label') || '';
    node.setAttribute('daa-ll', `${BLOCK}|${slug(text) || 'cta'}`);
  });

  el.dataset.forgeAuthored = BLOCK;
}
