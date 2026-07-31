/**
 * forge-introducing-color-mode — a Milo C2 block authored by Forge for a
 * "featured card media" hero that matched no existing catalog block.
 *
 * DA serializes a block's authored content as a FLAT, class-LESS run of semantic
 * nodes nested in EDS row/cell `<div>`s — the Figma grouping classes
 * (`.fc-asset`/`.fc-copy`/`.fc-badge`) DO NOT exist at runtime. `init(el)`
 * receives, in document order: the main before/after media `<picture>`, the
 * app-mnemonic badge `<picture>`, an `<h2>`, a body `<p>`, and a CTA `<a>`.
 *
 * So `init(el)` PROBES that flat run by CONTENT SHAPE (never by an authored
 * class) and RECONSTRUCTS the rich card: a rounded media asset (`.fic-asset`)
 * with the first picture as the object-fit fill and any later picture as an
 * absolutely-positioned badge overlay, followed by a copy row (`.fic-copy`)
 * whose text column (`.fic-text`) holds the heading + body and whose trailing
 * `<a>` becomes the chevron CTA (`.fic-cta`). Content is MOVED, never
 * serialized, so `<picture>`/`<img>` attributes and MEP markers survive the
 * rebuild. Milo's own `decorateBlockText` then promotes the text to C2
 * typography, so this is a real Milo decorator, not an inert capture shim.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-introducing-color-mode';

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

// A media node is a picture/img itself, or a wrapper whose only meaningful
// content is a picture/img (no heading/copy/action inside).
function isMediaNode(node) {
  if (node.matches?.('picture, img')) return true;
  return !!node.querySelector?.('picture, img')
    && !node.querySelector?.('h1, h2, h3, h4, h5, h6, p, ul, ol, a, button');
}

// Return the anchor/button element if this node is a CTA (a link/button, or a
// wrapper whose ENTIRE text is the link text), else null — so prose paragraphs
// with an inline link stay body copy, not CTAs.
function findCta(node) {
  if (node.matches?.('a[href], button')) return node;
  if (/^H[1-6]$/.test(node.tagName)) return null;
  const link = node.querySelector?.('a[href], button');
  if (!link) return null;
  const stripped = node.textContent.replace(/\s+/g, '');
  const linkText = link.textContent.replace(/\s+/g, '');
  return linkText && stripped === linkText ? link : null;
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

  // RECONSTRUCT the card with createElement (never innerHTML). Every probed node
  // is accounted for so nothing is dropped and no built container stays empty.
  const wrapper = document.createElement('div');
  wrapper.className = 'fic-inner';
  const asset = document.createElement('div');
  asset.className = 'fic-asset';
  const copy = document.createElement('div');
  copy.className = 'fic-copy';
  const textCol = document.createElement('div');
  textCol.className = 'fic-text';

  const ctas = [];
  let fillPlaced = false;
  nodes.forEach((node) => {
    if (isMediaNode(node)) {
      // First picture is the full-bleed fill; any later picture is a badge overlay.
      node.classList.add(fillPlaced ? 'fic-badge' : 'fic-fill');
      fillPlaced = true;
      asset.append(node);
      return;
    }
    const cta = findCta(node);
    if (cta) { ctas.push(cta); return; }
    // Everything else (headings, body copy, ragged leftovers) is text.
    textCol.append(node);
  });

  // Assemble only the containers that actually received content (no empty boxes).
  if (asset.children.length) wrapper.append(asset);
  if (textCol.children.length) copy.append(textCol);
  ctas.forEach((cta) => {
    cta.classList.add('fic-cta');
    const label = cta.textContent.trim();
    if (label) cta.textContent = label;
    copy.append(cta);
  });
  if (copy.children.length) wrapper.append(copy);

  // Promote the text to C2 typography via Milo's own service (headings →
  // heading-N, unclassed copy → body-*). Run it BEFORE we stamp our own hooks
  // so the copy is still class-less and gets picked up; wrap in
  // decorateViewportContent for consistent SSR/CSR behaviour.
  const decorate = () => { if (textCol.children.length) decorateBlockText(textCol); };
  if (typeof decorateViewportContent === 'function') decorateViewportContent(wrapper, decorate);
  else decorate();

  // Additive, scoped styling hooks (never drop the C2 classes just added).
  textCol.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('fic-headline');
  textCol.querySelectorAll('p').forEach((p) => p.classList.add('fic-body'));

  // Single structural swap (never an innerHTML wipe) — preserves authored intent.
  el.replaceChildren(wrapper);

  // Tag anything left untagged (CTA link + images) for analytics.
  forgeTagAnalytics(el, daaLh);

  el.dataset.forgeAuthored = BLOCK;
}
