/**
 * forge-tools-that-work-for-you — a Milo C2 block authored by Forge from a
 * Figma section that matched no existing catalog block: a distinctive,
 * centered hero copy-lockup on a dark cinematic background (heading +
 * subheading + an outlined pill CTA).
 *
 * RUNTIME SHAPE (the single biggest fidelity trap — DA strips classes):
 * `init(el)` does NOT receive the authored `.dw-copy`/`.dw-heading` structure
 * from the Figma section. DA serializes the block content as a FLAT, class-less
 * run of `<h2>`, `<p>`, `<a>` inside EDS row/cell wrappers. So this decorator
 * probes by CONTENT SHAPE (never by an authored class, never by a fixed child
 * index), then RECONSTRUCTS the rich lockup (`.foreground > .lockup >
 * .text-group` + `.actions`) with createElement + append, stamping its OWN
 * scoped classes that the co-located CSS keys on. Every flat child is accounted
 * for (headings/copy → text-group, links/buttons → actions) so no node drops.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-tools-that-work-for-you';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so copy any present marker onto the block root FIRST
// (data-manifest-id, data-adobe-target-testid, every data-mep-* attr) — a node
// swap that drops them silently disables Target/MEP on the section.
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

// Disambiguates daa-lh across N same-name instances on one page (a 1-based
// index suffix) — the "index disambiguates repeats" idea behind Milo's own
// decorateSectionAnalytics.
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Deterministic analytics floor (forge-owned; not dependent on AI-author
// compliance). Idempotent: skips any node that already carries daa-ll/daa-im.
function forgeTagAnalytics(scope, label) {
  if (!scope) return;
  const slugify = (text) => String(text || '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  let linkIdx = 0;
  scope.querySelectorAll('a, button').forEach((node) => {
    if (node.hasAttribute('daa-ll')) return;
    linkIdx += 1;
    const text = node.textContent || node.getAttribute('aria-label') || node.getAttribute('title') || '';
    node.setAttribute('daa-ll', `${label}|${slugify(text) || `link-${linkIdx}`}`);
  });
  let imgIdx = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    imgIdx += 1;
    img.setAttribute('daa-im', `${label}|${slugify(img.getAttribute('alt')) || `image-${imgIdx}`}`);
  });
}

// A flat child is an "action" if it IS a link/button, or is a paragraph/div
// whose entire text is a single link (a bare CTA row) — return that link so it
// can be lifted into the actions slot; otherwise null (it is copy/heading).
function extractAction(node) {
  if (node.matches('a, button')) return node;
  if (!node.matches('p, div') || node.querySelector('h1, h2, h3, h4, h5, h6')) return null;
  const link = node.querySelector('a, button');
  if (!link) return null;
  return node.textContent.trim() === link.textContent.trim() ? link : null;
}

export default async function init(el) {
  if (!el) return;
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Un-wrap: lift the single content cell's children up to the block root.
  // Preserve MEP markers off the discarded wrapper first.
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    preserveMepAttrs(inner.parentElement, el);
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }

  // Reconstruct the rich lockup from the FLAT content run (probe by shape).
  const foreground = document.createElement('div');
  foreground.className = 'foreground';
  const lockup = document.createElement('div');
  lockup.className = 'lockup';
  const textGroup = document.createElement('div');
  textGroup.className = 'text-group';
  const actions = document.createElement('div');
  actions.className = 'actions';

  // Account for EVERY flat child in document order; never index a fixed shape.
  // Leftover empty wrappers (e.g. a <p> we lifted a link out of) are discarded
  // by the single replaceChildren swap below, so no manual cleanup is needed.
  const sourceNodes = [...el.children].filter((n) => n.nodeType === 1);
  sourceNodes.forEach((node) => {
    const action = extractAction(node);
    if (action) {
      action.textContent = action.textContent.replace(/\s+/g, ' ').trim();
      action.classList.add('con-button', 'outline');
      actions.appendChild(action);
      return;
    }
    textGroup.appendChild(node);
  });

  lockup.appendChild(textGroup);
  if (actions.children.length) lockup.appendChild(actions);
  foreground.appendChild(lockup);
  // Build-then-swap once — never innerHTML='' (preserves authored/Target/MEP DOM).
  el.replaceChildren(foreground);

  // Promote text to C2 typography (heading → heading-2, copy → body-md) via
  // Milo's own service, wrapped in decorateViewportContent so a single-viewport
  // table decorates once (its no-variation branch).
  const decorate = () => {
    const tg = el.querySelector('.text-group');
    if (tg) decorateBlockText(tg);
  };
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
  else decorate();

  // Deterministic analytics floor for anything left untagged above.
  forgeTagAnalytics(el, daaLh);

  el.dataset.forgeAuthored = BLOCK;
}
