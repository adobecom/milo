/**
 * forge-section-1 — a Milo C2 "Color Mode" feature section.
 *
 * DA serializes the authored block as a FLAT, class-LESS run of nodes in
 * document order: [picture (comparison composite)], [picture (Pr app badge)],
 * <p> headline, <p> body, <a> CTA. This decorator PROBES that flat content by
 * shape (never by an authored class — DA strips them) and RECONSTRUCTS the rich
 * layout the Figma frame shows:
 *
 *   .forge-section-1
 *     .fs1-foreground
 *       .fs1-media           rounded, aspect-locked asset box (reserves layout)
 *         picture.fs1-media-img   the before/after comparison, object-fit:cover
 *         picture.fs1-badge       the Premiere Pro app mnemonic, top-left
 *       .fs1-copy            row: text column (left) + CTA (right)
 *         .fs1-text > h2.fs1-headline + p.fs1-body
 *         a.fs1-cta > span.fs1-cta-label + chevron svg
 *
 * Existing <picture>/<img>/<a> nodes are MOVED (not re-serialized) so their
 * loading/width/height/srcset and any MEP markers survive. Milo's own
 * decorateBlockText (wrapped in decorateViewportContent) then wires typography +
 * a11y so this is a real Milo decorator, not a capture shim.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT (L30).
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-section-1';
const SVG_NS = 'http://www.w3.org/2000/svg';

// Local element factory — keeps the block self-contained (no reliance on a
// createTag export) while staying lint-clean.
function createTag(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => v != null && node.setAttribute(k, v));
  children.forEach((c) => c != null && node.append(c));
  return node;
}

// MEP / personalization markers Milo may stamp on the row/cell wrapper we
// discard. Copy any present marker up onto the block root BEFORE the rebuild so
// a later Target/MEP swap still finds them (C11).
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

// Re-tag a node to a new element while preserving its attributes + child nodes
// (used to promote the authored headline <p> to a semantic <h2> — L8: only one
// h1 per block, sub-headings are h2/h3).
function retag(node, tagName) {
  const out = createTag(tagName);
  [...node.attributes].forEach((a) => out.setAttribute(a.name, a.value));
  while (node.firstChild) out.appendChild(node.firstChild);
  return out;
}

// A thin ">" chevron built via the SVG DOM (no innerHTML). stroke=currentColor
// so it inherits the link colour explicitly set in CSS (C20).
function buildChevron() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 7 12');
  svg.setAttribute('width', '7');
  svg.setAttribute('height', '12');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('fs1-cta-arrow');
  const poly = document.createElementNS(SVG_NS, 'polyline');
  poly.setAttribute('points', '1,1 6,6 1,11');
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', 'currentColor');
  poly.setAttribute('stroke-width', '1.5');
  poly.setAttribute('stroke-linecap', 'round');
  poly.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(poly);
  return svg;
}

// Deterministic analytics floor (independent of author compliance; C7).
function tagAnalytics(scope, label) {
  const slug = (t) => String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let li = 0;
  scope.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    n.setAttribute('daa-ll', `${label}|${slug(n.textContent) || `link-${li}`}`);
  });
  let ii = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    ii += 1;
    img.setAttribute('daa-im', `${label}|${slug(img.getAttribute('alt')) || `image-${ii}`}`);
  });
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Lift MEP markers off the (about-to-be-discarded) content wrapper.
  const inner = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(inner?.parentElement || inner, el);

  // PROBE the flat content by shape (C2 — never by index or authored class).
  const pics = [...el.querySelectorAll('picture')];
  const cta = el.querySelector('a[href]');
  const textEls = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]
    .filter((n) => n.textContent.trim() && !(cta && n.contains(cta)));
  const [headlineEl, ...restText] = textEls;
  const bodyEl = restText.find((n) => n !== headlineEl) || null;

  // Stamp OUR OWN class on both the <picture> and its inner <img> so the CSS keys
  // on block-owned classes (never a bare `img`/`main`/`section` element that the
  // block does not own — that reads as a page capture, not a reusable block).
  const classifyPicture = (pic, picClass, imgClass) => {
    pic.classList.add(picClass);
    const img = pic.querySelector('img');
    if (img) img.classList.add(imgClass);
    return pic;
  };

  // --- Media asset: first picture is the full comparison, a second picture is
  // the Premiere Pro app badge pinned top-left. Every picture is accounted for. ---
  const media = createTag('div', { class: 'fs1-media' });
  if (pics[0]) media.appendChild(classifyPicture(pics[0], 'fs1-media-img', 'fs1-media-el'));
  if (pics[1]) media.appendChild(classifyPicture(pics[1], 'fs1-badge', 'fs1-badge-el'));
  // Any further pictures (ragged content) stack into the media box, not dropped.
  pics.slice(2).forEach((p) => media.appendChild(classifyPicture(p, 'fs1-media-extra', 'fs1-media-el')));

  // --- Copy row: text column + CTA ---
  const textCol = createTag('div', { class: 'fs1-text' });
  if (headlineEl) {
    const h = retag(headlineEl, 'h2');
    h.classList.add('fs1-headline');
    headlineEl.remove();
    textCol.appendChild(h);
  }
  if (bodyEl) {
    bodyEl.classList.add('fs1-body');
    textCol.appendChild(bodyEl);
  }

  const copy = createTag('div', { class: 'fs1-copy' }, textCol);
  if (cta) {
    const label = createTag('span', { class: 'fs1-cta-label' });
    label.textContent = cta.textContent.trim() || 'Learn more';
    cta.textContent = '';
    cta.classList.add('fs1-cta');
    cta.append(label, buildChevron());
    copy.appendChild(cta);
  }

  // Assemble once and swap in (C3 — never innerHTML='' the block).
  const foreground = createTag('div', { class: 'fs1-foreground' });
  if (pics.length) foreground.appendChild(media);
  foreground.appendChild(copy);
  el.replaceChildren(foreground);

  // Run Milo's own text decorator (typography + button/a11y wiring), guarded so
  // a service hiccup never bricks the section. decorateViewportContent handles
  // both single- and per-viewport authored tables.
  try {
    const decorate = (scope) => decorateBlockText(scope, { heading: '2', body: 'md', button: 'md' });
    if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
    else decorate(el);
  } catch (e) {
    window.lana?.log(`${BLOCK} decorate: ${e?.message || e}`, { tags: 'forge' });
  }

  tagAnalytics(el, BLOCK);
  el.dataset.forgeAuthored = BLOCK;
}
