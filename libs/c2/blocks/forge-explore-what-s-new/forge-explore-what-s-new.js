/**
 * forge-explore-what-s-new — a Milo C2 block authored by Forge for a centered
 * "features & releases" text intro that matched no existing catalog block.
 *
 * DA serializes a block's authored content as a FLAT, class-LESS run of semantic
 * nodes (`<p>`, `<h1>`, `<p>`, CTAs …) nested in EDS row/cell `<div>`s — the
 * Figma grouping classes (`.foreground`/`.content`) DO NOT exist at runtime. So
 * `init(el)` PROBES that flat run by content shape (never by an authored class),
 * then RECONSTRUCTS the rich centered layout with `createElement`: an eyebrow +
 * heading + body copy column (`.content`) inside a `.foreground` wrapper, plus a
 * side-by-side `.action-area` for any CTAs. Milo's own decorators then promote
 * the text to C2 typography (`decorateBlockText` → heading-2 / eyebrow / body-md)
 * and the CTAs to `.con-button`s (`decorateButtons`), so this is a real Milo
 * decorator, not an inert capture shim. Content is MOVED (never serialized), so
 * `<picture>`/`<img>` attributes and MEP markers survive the rebuild.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateButtons, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-explore-what-s-new';

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

// Disambiguates daa-lh across N same-name instances on one page (a 1-based
// index suffix), mirroring how Milo's decorateSectionAnalytics indexes repeats.
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Flatten EDS wrapper <div>s and return the meaningful content nodes in document
// order — accounting for EVERY child so nothing is dropped (a stray non-empty
// text node is wrapped in <p> rather than discarded).
function collectContentNodes(root) {
  const nodes = [];
  [...root.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        nodes.push(p);
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'DIV') { nodes.push(...collectContentNodes(node)); return; }
    nodes.push(node);
  });
  return nodes;
}

// A CTA node is an anchor/button itself, or a wrapper whose ENTIRE text is the
// text of the button-like links it holds (so prose paragraphs with an inline
// link stay body copy, not CTAs).
function isCtaNode(node) {
  if (node.matches?.('a[href], button')) return true;
  if (/^H[1-6]$/.test(node.tagName)) return false;
  const links = node.querySelectorAll?.('a[href], button');
  if (!links || !links.length) return false;
  const stripped = node.textContent.replace(/\s+/g, '');
  const linkText = [...links].map((l) => l.textContent).join('').replace(/\s+/g, '');
  return !!linkText && stripped === linkText;
}

// Move a CTA node's button-bearing markup into the action area. strong/em
// wrappers are moved intact so decorateButtons can read the `strong a`/`em a`
// idiom (filled vs. outline); a bare anchor/button moves as-is.
function extractCtas(node, actionArea) {
  if (node.matches?.('a[href], button')) { actionArea.append(node); return; }
  [...node.children].forEach((child) => {
    if (child.matches?.('strong, em, a[href], button')) actionArea.append(child);
  });
  node.remove();
}

// Deterministic analytics floor (forge-owned; independent of AI-author
// compliance). Idempotent: skips any node already carrying daa-ll/daa-im.
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
  // Section-level analytics handle, disambiguated across same-name instances.
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // EDS wraps the single content cell in row/cell divs; lift MEP markers off the
  // wrapper before we discard it, then probe the flat content it holds.
  const inner = el.querySelector(':scope > div > div');
  const source = inner || el;
  if (inner) preserveMepAttrs(inner.parentElement, el);
  const nodes = collectContentNodes(source);

  // RECONSTRUCT: centered content column + a side-by-side action area. Build with
  // createElement and MOVE the probed nodes in (preserving picture/img + MEP
  // attributes); classes are our own scoped hooks, added via className.
  const foreground = document.createElement('div');
  foreground.className = 'foreground';
  const content = document.createElement('div');
  content.className = 'content';
  foreground.append(content);
  const actionArea = document.createElement('div');
  actionArea.className = 'action-area';

  // Account for EVERY probed node: CTAs → action area, everything else → content.
  nodes.forEach((node) => {
    if (isCtaNode(node)) { extractCtas(node, actionArea); return; }
    content.append(node);
  });
  if (actionArea.children.length) content.append(actionArea);

  // Promote via Milo's own services: headings → heading-2, eyebrow on the
  // heading's prior sibling, unclassed copy → body-md, and CTAs → con-buttons.
  const decorate = () => {
    decorateBlockText(content);
    if (actionArea.children.length) decorateButtons(actionArea, 'button-l');
  };
  // decorateViewportContent decorates once when there are no per-viewport tables
  // (our case) and per-variation when there are; guard for older builds.
  if (typeof decorateViewportContent === 'function') decorateViewportContent(foreground, decorate);
  else decorate();

  // Single structural swap (never innerHTML wipe) — preserves authored DOM intent.
  el.replaceChildren(foreground);

  // Tag anything the services left untagged (links/buttons/images).
  forgeTagAnalytics(el, daaLh);

  el.dataset.forgeAuthored = BLOCK;
}
