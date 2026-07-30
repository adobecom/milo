/**
 * forge-tools-that-work-for-you-3 — a Milo C2 hero/marquee section.
 *
 * Visual target: a centred copy lockup on a black stage — a bold display
 * heading, a supporting line of body copy, and an outline "pill" CTA — sitting
 * over a warm bottom-centre glow (the Figma comp shows a lamp-lit desk photo
 * there; DA authoring carries only the text + link, so the glow is CSS-only
 * decoration, never a fabricated <img>).
 *
 * DA STRIPS CLASSES (checklist C24): at runtime init(el) receives a FLAT,
 * class-less run — a heading, one or more paragraphs, and an anchor — with NO
 * lockup/foreground wrappers. So this decorator PROBES BY CONTENT SHAPE (never
 * by an authored class or a fixed child index), then RECONSTRUCTS the rich
 * lockup with createTag + append and stamps its OWN scoped classes, which the
 * co-located stylesheet keys on. Every flat child is accounted for (headings +
 * body copy → the copy column; every anchor → the action area) so nothing is
 * dropped and no empty container is emitted.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ → libs/utils/ is THREE hops up
// (blocks → c2 → libs). The 3-hop specifier is correct — do NOT "fix" to 2.
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-tools-that-work-for-you-3';

// MEP / personalization markers Milo may stamp on the row/cell wrapper we
// discard during un-wrap. Copy any present marker up onto a surviving node
// FIRST so a later Target/MEP swap still finds them (C11).
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

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

// Disambiguate daa-lh across N same-name instances on one page (1-based idx).
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// A flat child is a CTA when it is (or wraps) an anchor and carries no heading.
function extractAnchor(child) {
  if (child.matches?.('a')) return child;
  if (child.querySelector?.('h1, h2, h3, h4, h5, h6')) return null;
  return child.querySelector?.(':scope > a, a') || null;
}

function decorateCta(anchor, daaLh) {
  anchor.classList.add('cta', 'con-button', 'outline');
  anchor.textContent = anchor.textContent.trim();
  if (!anchor.hasAttribute('daa-ll')) {
    anchor.setAttribute('daa-ll', `${daaLh}|${slugify(anchor.textContent) || 'cta'}`);
  }
}

export default async function init(el) {
  if (!el) return;

  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Un-wrap the single DA cell so we own a clean, flat content run. Lift MEP
  // markers off the wrapper onto the block root BEFORE discarding it.
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    preserveMepAttrs(inner.parentElement, el);
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }

  // Reconstruct the lockup. Walk EVERY flat child in document order and route
  // it: anchors → the action area; headings + body copy → the copy column.
  const foreground = createTag('div', { class: 'foreground' });
  const copy = createTag('div', { class: 'copy' });
  const actionArea = createTag('div', { class: 'action-area' });

  [...el.children].forEach((child) => {
    if (child.nodeType !== 1) return;
    const anchor = extractAnchor(child);
    if (anchor) {
      decorateCta(anchor, daaLh);
      actionArea.append(anchor); // moves the node out of any wrapping <p>
      // If the wrapper (e.g. <p><a/></p>) is now empty, drop it; if it still
      // holds real text/media, keep it in the copy column — never discard nodes.
      if (child !== anchor) {
        if (child.textContent.trim() || child.querySelector('img, picture')) copy.append(child);
        else child.remove();
      }
      return;
    }
    copy.append(child); // heading or body paragraph — move node, keep attrs
  });

  if (copy.children.length) foreground.append(copy);
  if (actionArea.children.length) foreground.append(actionArea);

  // Build-then-swap once via replaceChildren (never wipe markup — preserves
  // Target / MEP / authored DOM).
  el.replaceChildren(foreground);

  // Promote text to C2 typography (heading-2 / body-md) via Milo's own service,
  // then stamp our scoped role classes so the stylesheet always matches.
  decorateBlockText(copy);
  copy.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => h.classList.add('title'));
  copy.querySelectorAll('p').forEach((p) => p.classList.add('subtitle'));

  el.dataset.forgeAuthored = BLOCK;
}
