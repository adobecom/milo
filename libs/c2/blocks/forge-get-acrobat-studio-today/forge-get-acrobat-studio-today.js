/**
 * forge-get-acrobat-studio-today — a Milo C2 hero block authored by Forge from a
 * Figma section that matched no existing catalog block.
 *
 * THE MAGIC STEP (C24): at runtime DA hands `init(el)` a FLAT, class-LESS run of
 * semantic nodes in document order — here: <p>(eyebrow), <h1>, <p>(body),
 * <p>(price), <a>(CTA), <a>(CTA) — with NO wrappers and NONE of the Figma
 * structural classes from section.html. This decorator PROBES that flat content
 * by shape/order (never by an authored class or a fixed index), then
 * RECONSTRUCTS the rich centred hero lockup with createTag + classList, stamping
 * its OWN `.forge-get-acrobat-studio-today`-scoped classes that the scoped CSS
 * keys on. Nothing is discarded — every flat child is routed into a group.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils is THREE hops up
// (blocks -> c2 -> libs). Do NOT "correct" to 2 hops.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-get-acrobat-studio-today';
const PRICE_RE = /(?:us)?\$\s?\d|\/\s?mo\b|\/\s?yr\b|per\s+(?:month|year)|billed|month|year/i;

// MEP / personalization markers Milo stamps on nodes. Copy them from a source
// node onto a rebuilt node BEFORE the old node is dropped, or a swap silently
// disables Target/MEP on the section.
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

// Disambiguate daa-lh across N same-name instances on one page.
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

const slugify = (text) => String(text || '').trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

// Lift the DA cell wrapper's children up to the block root so we probe the flat
// content directly, and carry any MEP markers up onto el first.
function unwrap(el) {
  const inner = el.querySelector(':scope > div > div');
  if (!inner) return;
  preserveMepAttrs(inner.parentElement, el);
  while (inner.firstChild) el.appendChild(inner.firstChild);
  inner.parentElement?.remove();
}

// An anchor is a CTA when it stands alone (direct child of the block, or the
// only meaningful content of its paragraph) — not an inline link inside body copy.
function isActionLink(a, el) {
  const p = a.parentElement;
  if (!p) return false;
  if (p === el) return true;
  return p.textContent.trim() === a.textContent.trim();
}

// Build one CTA. `href="#"` / empty is a placeholder action → render a <button>
// (L9: an <a href="#"> styled as a button harms keyboard nav). A real URL keeps
// the authored <a>. Either way it looks identical and carries analytics.
function buildCta(source, primary, label) {
  const href = (source.getAttribute('href') || '').trim();
  const real = href && href !== '#' && !/^javascript:/i.test(href);
  const text = source.textContent.trim();
  let node;
  if (real) {
    node = source;
  } else {
    node = createTag('button', { type: 'button' }, text);
    preserveMepAttrs(source, node);
    // The replacement is a NEW node; drop the orphaned placeholder anchor so the
    // safety-net sweep can't re-home it as a duplicate.
    source.remove();
  }
  node.classList.add('con-button', 'gast-cta', primary ? 'gast-cta--primary' : 'gast-cta--secondary');
  node.setAttribute('daa-ll', `${label}|${slugify(text) || (primary ? 'cta-1' : 'cta-2')}`);
  return node;
}

export default async function init(el) {
  if (!el) return;
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  unwrap(el);

  // --- Probe the flat content by shape/order (C2: never el.children[N]). ---
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  // Eyebrow: a text-only <p> that sits before the heading.
  let eyebrow = null;
  if (heading) {
    const prev = heading.previousElementSibling;
    if (prev?.tagName === 'P' && !prev.querySelector('a, picture, img')) eyebrow = prev;
  }
  // Action links anywhere in the block, in document order.
  const ctaSources = [...el.querySelectorAll('a')].filter((a) => isActionLink(a, el));
  // Paragraphs after the heading that aren't the eyebrow and aren't CTA-only.
  const paras = [...el.querySelectorAll(':scope > p')].filter((p) => {
    if (p === eyebrow) return false;
    if (heading && !(heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)) return false;
    return !p.querySelector('a');
  });
  // Price = first following paragraph that reads like a price; rest are body copy.
  const price = paras.find((p) => PRICE_RE.test(p.textContent));
  const bodyParas = paras.filter((p) => p !== price);

  // Run Milo's own text decorator over the flat content while order is intact:
  // promotes the heading to heading-2, the pre-heading <p> to `eyebrow`, and
  // unclassed copy to body-md — wrapped in decorateViewportContent for parity.
  const decorate = (scope) => decorateBlockText(scope);
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
  else decorate(el);

  // --- Reconstruct the rich centred lockup (createTag + append, in order). ---
  const copy = createTag('div', { class: 'gast-copy' });
  if (eyebrow) { eyebrow.classList.add('gast-eyebrow', 'eyebrow'); copy.append(eyebrow); }
  if (heading) { heading.classList.add('gast-headline'); copy.append(heading); }
  bodyParas.forEach((p) => { p.classList.add('gast-body', 'body-md'); copy.append(p); });

  const cta = createTag('div', { class: 'gast-cta-block' });
  if (price) { price.classList.add('gast-price'); cta.append(price); }
  if (ctaSources.length) {
    const actions = createTag('div', { class: 'gast-actions' });
    ctaSources.forEach((a, i) => actions.append(buildCta(a, i === 0, daaLh)));
    cta.append(actions);
  }

  // Safety net: never drop authored nodes. Every routed node has already been
  // MOVED out of el (append() re-parents), so whatever is still a direct child
  // of el is an unrouted leftover — attach it to the copy group, never discard.
  [...el.children].forEach((child) => {
    if (child.textContent.trim() || child.querySelector('img, picture')) {
      child.classList.add('gast-extra');
      copy.append(child);
    }
  });

  const foreground = createTag('div', { class: 'gast-foreground' });
  foreground.append(copy);
  if (cta.childElementCount) foreground.append(cta);

  // Rebuild the block in one pass (C3: no innerHTML wipe).
  el.replaceChildren(foreground);
  el.dataset.forgeAuthored = BLOCK;
}
