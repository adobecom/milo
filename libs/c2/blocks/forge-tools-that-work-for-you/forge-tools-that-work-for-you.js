/**
 * forge-tools-that-work-for-you — a Milo C2 block authored by Forge for a section that matched no
 * existing catalog block (the deterministic floor; build-block-from-figma's
 * agentic author replaces this with a richer init on the deploy lane).
 *
 * EDS wraps a single-cell block's content in extra row/cell `<div>`s
 * (`block > div > div > <content>`). The scoped stylesheet `forge-tools-that-work-for-you.css`
 * targets the section's NATURAL structure, so this decorator lifts the content
 * out of those wrappers and then stamps Milo-semantic structural classes
 * (`foreground`/`media`/`content`) ADDITIVELY onto the lifted top-level
 * children — never replacing the authored classes the scoped CSS keys on — so
 * downstream Milo conventions (and any later overlay) have stable hooks.
 * After stamping it runs Milo's own decorate services over the content
 * (`decorateBlockText` promotes headings to title-N + body to body-*; wrapped
 * in `decorateViewportContent` so a per-viewport authored table decorates each
 * variation, and a single-viewport table decorates once) so the block is a real,
 * reusable Milo decorator — not an inert capture shim.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). The 3-hop '../../../' form below is
// CORRECT — do NOT 'correct' it to 2 hops on the basis of stale prose.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-tools-that-work-for-you';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so copy any present marker up onto the block root FIRST
// (data-manifest-id, data-adobe-target-testid, and every data-mep-* attr) — a
// node swap that drops them silently disables Target/MEP on the section.
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

// Milo-semantic role for a lifted top-level child: a node whose only meaningful
// content is an image/picture is the `media` slot; everything else is
// text/`content`. Purely additive — the authored class list is preserved so
// the generated scoped CSS keeps matching.
function semanticRole(node) {
  if (!node || node.nodeType !== 1) return null;
  const onlyMedia = node.matches?.('picture, img')
    || (node.querySelector?.('picture, img')
      && !node.querySelector?.('h1, h2, h3, h4, h5, h6, p, ul, ol, a, button'));
  return onlyMedia ? 'media' : 'content';
}

// Disambiguates daa-lh across N same-name instances on one page (a 1-based
// index suffix). Borrows the "index disambiguates repeats" idea behind
// Milo's own decorateSectionAnalytics (a "b<idx>|" prefix for blocks that
// don't pre-set daa-lh) but is not identical to it — see daa-tagging.js.
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Deterministic analytics tagging (forge-owned; NOT dependent on AI-author
// compliance — see block-author.js C7). Milo's own per-link auto-labeling
// (decorateDefaultLinkAnalytics, invoked from decorateSectionAnalytics) only
// runs on a block with NO daa-lh of its own; this block sets its own daa-lh
// above, so it opted OUT of that free labeling — this is the replacement.
// Idempotent: skips any link/button/image that already carries daa-ll/daa-im
// (an AI-authored node that already complied with C7) so it never double-tags.
function forgeTagAnalytics(scope, label) {
  if (!scope) return;
  const slugify = (text) => String(text || '')
    .trim()
    .toLowerCase()
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

export default async function init(el) {
  if (!el) return;
  // Section-level analytics handle, disambiguated across N same-name
  // instances on the page (see forgeInstanceSuffix above).
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Un-wrap: lift the single content cell's children up to the block root so the
  // scoped CSS (which targets the natural, un-wrapped structure) applies. This
  // structural contract is COUPLED to scopeRulesForSection — keep it intact.
  // BEFORE discarding the wrapper, lift its MEP markers onto el so a later
  // Target/MEP swap still finds them (the wrapper is the cell's parent, inner.parentElement).
  const inner = el.querySelector(':scope > div > div');
  if (inner) {
    preserveMepAttrs(inner.parentElement, el);
    while (inner.firstChild) el.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }

  // Stamp Milo-semantic structural classes onto the lifted top-level children,
  // ADDITIVELY (classList.add never drops the authored classes the CSS keys on).
  // The first content child is the `foreground` (the marquee/hero idiom).
  const children = [...el.children].filter((n) => n.nodeType === 1);
  let foregroundStamped = false;
  let foreground = null;
  for (const child of children) {
    const role = semanticRole(child);
    if (!role) continue;
    child.classList.add(role);
    if (role === 'content' && !foregroundStamped) {
      child.classList.add('foreground');
      foreground = child;
      foregroundStamped = true;
    }
  }

  // Promote text to C2 typography (headings → title-N, copy → body-*) via Milo's
  // own service, on the foreground/content child when one exists. decorateBlockText
  // is the same primitive marquee/text/media C2 blocks use — running it here is what
  // makes this a real Milo decorator rather than a structural un-wrap.
  const decorate = (scope) => {
    const target = (foreground && scope.contains?.(foreground)) ? foreground : scope;
    if (target) decorateBlockText(target);
  };
  // Wrap in decorateViewportContent so a per-viewport authored table decorates
  // each variation; its no-variation branch decorates the single table once.
  // Guard the helper so a single-viewport table still decorates if it is absent.
  if (typeof decorateViewportContent === 'function') {
    decorateViewportContent(el, decorate);
  } else {
    decorate(el);
  }

  // Deterministic analytics floor — tags any link/button/image left untagged
  // by the above (independent of AI-author compliance; see forgeTagAnalytics above).
  forgeTagAnalytics(el, daaLh);

  el.dataset.forgeAuthored = BLOCK;
}
