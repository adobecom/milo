/**
 * forge-get-acrobat-studio-today — a Milo C2 block authored by Forge from a Figma
 * section that matched no existing catalog block. It renders a centered, dark
 * "Get Acrobat Studio today." hero lockup: eyebrow, headline, body copy, a price
 * line, and two pill CTAs (a filled primary + an outlined secondary).
 *
 * MAGIC STEP — DA strips authored classes and serializes the block content as a
 * FLAT, class-less run of <p>/<h1>/<picture> plus loose CTA-label text nodes in
 * document order (see mocks/body.html). This decorator PROBES that flat content
 * by shape (never by index or by an authored class) and RECONSTRUCTS the rich,
 * centered hero DOM with its own `.forge-get-acrobat-studio-today`-scoped classes
 * so the scoped stylesheet has stable hooks.
 *
 * CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up
 * (blocks -> c2 -> libs). The '../../../' specifiers below are CORRECT.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-get-acrobat-studio-today';
// A paragraph that reads like a price / billing line (not body copy).
const PRICE_RE = /(\$|€|£|\/\s*mo\b|per\s*month|billed|\/yr\b|\/year)/i;

// MEP / personalization markers Milo stamps on the row/cell wrappers we discard
// during the rebuild — copy any present marker up onto the block root FIRST so a
// later Target/MEP swap still finds them.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null && !to.hasAttribute(attr)) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-') && !to.hasAttribute(a.name)) to.setAttribute(a.name, a.value);
  }
}

// Slug for analytics labels (daa-ll / daa-im).
function slug(text) {
  return String(text || '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

// Walk siblings in one direction, returning the immediately-adjacent <picture>
// (skipping only whitespace). Stops at the first real element or labelled text
// node so one CTA never steals another CTA's icon.
function adjacentPicture(node, dir) {
  let sib = node[dir];
  while (sib) {
    if (sib.nodeType === Node.ELEMENT_NODE) {
      return sib.matches?.('picture') ? sib : null;
    }
    if (sib.nodeType === Node.TEXT_NODE && sib.textContent.trim()) return null;
    sib = sib[dir];
  }
  return null;
}

// Detect the CTA units from the flat content. Primary path: loose text nodes
// (the author-content shape) flanked by decorative <picture> icons. Fallback:
// paragraphs that carry an icon <picture> are treated as CTA lines.
function collectActions(cell) {
  const looseLabels = [...cell.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  if (looseLabels.length) {
    return looseLabels.map((ln) => ({
      label: ln.textContent.trim(),
      left: adjacentPicture(ln, 'previousSibling'),
      right: adjacentPicture(ln, 'nextSibling'),
    }));
  }
  return [...cell.querySelectorAll('p')]
    .filter((p) => p.querySelector('picture') && p.textContent.trim())
    .map((p) => {
      const pics = [...p.querySelectorAll('picture')];
      return { label: p.textContent.trim(), left: pics[0] || null, right: pics[1] || null };
    });
}

function buildIcon(pic) {
  if (!pic) return null;
  pic.classList.add(`${BLOCK}__cta-icon`);
  pic.setAttribute('aria-hidden', 'true');
  pic.querySelectorAll('img').forEach((img) => {
    img.setAttribute('alt', '');
    img.setAttribute('aria-hidden', 'true');
    if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', `${BLOCK}|cta-icon`);
  });
  return pic;
}

function buildCta({ label, left, right }, index, daaLh) {
  const btn = document.createElement('button');
  btn.type = 'button';
  const variant = index === 0 ? 'fill' : 'outline';
  btn.className = `${BLOCK}__cta ${BLOCK}__cta--${variant}`;
  btn.setAttribute('daa-ll', `${daaLh}|${slug(label) || `cta-${index + 1}`}`);
  const leftIcon = buildIcon(left);
  if (leftIcon) btn.append(leftIcon);
  const span = document.createElement('span');
  span.className = `${BLOCK}__cta-label`;
  span.textContent = label;
  btn.append(span);
  const rightIcon = buildIcon(right);
  if (rightIcon) btn.append(rightIcon);
  return btn;
}

export default async function init(el) {
  if (!el) return;
  try {
    el.setAttribute('daa-lh', BLOCK);

    // EDS wraps a single-cell block as block > div(row) > div(cell). Probe for
    // the deepest content cell; fall back to the block root if unwrapped.
    const cell = el.querySelector(':scope > div > div')
      || el.querySelector(':scope > div')
      || el;
    preserveMepAttrs(cell, el);
    preserveMepAttrs(cell.parentElement, el);

    // Probe the flat content by SHAPE (never by index / authored class).
    const heading = cell.querySelector('h1, h2, h3');
    const contentParas = [...cell.querySelectorAll('p')]
      .filter((p) => !p.querySelector('picture') && p.textContent.trim());
    const prevP = heading?.previousElementSibling;
    const eyebrow = (prevP?.matches?.('p') && !prevP.querySelector('picture'))
      ? prevP : contentParas[0];
    const price = contentParas.find((p) => PRICE_RE.test(p.textContent));
    const body = contentParas.find((p) => p !== eyebrow && p !== price);
    const actions = collectActions(cell);

    // RECONSTRUCT the centered hero lockup, MOVING (never cloning) the existing
    // nodes so their attributes / MEP markers survive.
    const lockup = document.createElement('div');
    lockup.className = `${BLOCK}__lockup`;

    if (eyebrow) { eyebrow.classList.add(`${BLOCK}__eyebrow`); lockup.append(eyebrow); }
    if (heading) { heading.classList.add(`${BLOCK}__title`); lockup.append(heading); }
    if (body) { body.classList.add(`${BLOCK}__body`); lockup.append(body); }
    // Attach any ragged/extra body paragraph rather than discarding it.
    contentParas
      .filter((p) => p !== eyebrow && p !== price && p !== body)
      .forEach((p) => { p.classList.add(`${BLOCK}__body`); lockup.append(p); });
    if (price) { price.classList.add(`${BLOCK}__price`); lockup.append(price); }

    if (actions.length) {
      const actionArea = document.createElement('div');
      actionArea.className = `${BLOCK}__actions`;
      actions.forEach((spec, i) => actionArea.append(buildCta(spec, i, BLOCK)));
      lockup.append(actionArea);
    }

    // Single mutation: swap the flat cell for the reconstructed lockup.
    el.replaceChildren(lockup);

    // Layer Milo's own typography service over the rebuilt lockup so headings →
    // heading-*, eyebrow toggle, and body copy pick up C2 conventions. Wrapped in
    // decorateViewportContent to honour any per-viewport authored variation.
    const runDecorate = () => decorateBlockText(lockup);
    if (typeof decorateViewportContent === 'function') {
      decorateViewportContent(el, runDecorate);
    } else {
      runDecorate();
    }
  } catch (e) {
    window.lana?.log?.(`${BLOCK} decorate failed: ${e?.message || e}`, { tags: 'forge' });
  }

  el.dataset.forgeAuthored = BLOCK;
}
