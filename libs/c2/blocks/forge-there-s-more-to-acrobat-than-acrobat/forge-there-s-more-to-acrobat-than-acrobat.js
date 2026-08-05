/**
 * forge-there-s-more-to-acrobat-than-acrobat — Milo C2 block.
 *
 * DISTINCTIVE section: DA serializes the authored block as a FLAT, class-less run
 * of <h2>/<p>/<picture>/<h3>/<p>… in document order (NO grid/row/tile wrappers,
 * NO Figma classes). This decorator PROBES that flat content by shape (never by an
 * authored class — DA strips them) and RECONSTRUCTS the rich "bento" layout:
 *   • an intro copy block (heading + subheading), then
 *   • a two-up cards row: card 0 is the large OVERLAY card (photo fills the tile,
 *     text overlaid on a gradient); card 1+ are PANEL cards (contained image card
 *     on top, title/body/CTA below).
 * Boundary marker = each <picture> starts a new card; pre-picture text is intro;
 * every flat child is accounted for (leftovers attach to the nearest card), so the
 * grid never renders empty. Nodes are MOVED (not serialized) to preserve
 * <picture>/<img> attributes + MEP markers, then mounted once via replaceChildren.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT (L30).
import { decorateButtons } from '../../../utils/decorate.js';

const BLOCK = 'forge-there-s-more-to-acrobat-than-acrobat';
const CTA_RE = /^(learn|read|see|get started|explore|discover|try|find out|watch|start)\b/i;
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];

function ce(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// Copy any MEP/Target markers off a wrapper we are about to discard onto the
// block root, so a later personalization swap still finds them (C11).
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((a) => {
    const v = from.getAttribute?.(a);
    if (v != null) to.setAttribute(a, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

// Disambiguate daa-lh when several same-name instances share a page.
function forgeInstanceSuffix(el, name) {
  const list = [...document.querySelectorAll(`.${name}`)];
  const idx = list.indexOf(el);
  return list.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Deterministic analytics floor (C7): daa-ll on links/buttons, daa-im on images.
function tagAnalytics(scope, label) {
  if (!scope) return;
  const slug = (t) => String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let li = 0;
  scope.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    n.setAttribute('daa-ll', `${label}|${slug(n.textContent) || `link-${li}`}`);
  });
  let ii = 0;
  scope.querySelectorAll('img').forEach((im) => {
    if (im.hasAttribute('daa-im')) return;
    ii += 1;
    im.setAttribute('daa-im', `${label}|${slug(im.getAttribute('alt')) || `image-${ii}`}`);
  });
}

// Gather the flat content in document order, keeping only top-level semantic
// nodes (drop anything nested inside another gathered node, e.g. an <a> in a <p>).
function gatherContent(el) {
  const sel = 'h1, h2, h3, h4, h5, h6, p, picture, img, a, button, ul, ol';
  const all = [...el.querySelectorAll(sel)];
  return all.filter((n) => {
    if (all.some((o) => o !== n && o.contains(n))) return false;
    if (n.tagName === 'PICTURE' || n.tagName === 'IMG') return true;
    return (n.textContent || '').trim().length > 0;
  });
}

const isMedia = (n) => n.tagName === 'PICTURE' || n.tagName === 'IMG';

function isCta(node) {
  if (!node) return false;
  if (node.tagName === 'A' || node.tagName === 'BUTTON') return true;
  if (node.querySelector?.('a, button')) return true;
  const t = (node.textContent || '').trim();
  return CTA_RE.test(t) && t.split(/\s+/).length <= 4;
}

function buildCta(node) {
  const cta = ce('div', 'jtbd-cta');
  const anchor = node.tagName === 'A' ? node : node.querySelector?.('a');
  const href = anchor?.getAttribute('href');
  const label = (node.textContent || '').trim() || 'Learn more';
  let labelEl;
  if (anchor && href && href !== '#') {
    anchor.textContent = label;
    anchor.classList.add('jtbd-cta-link');
    labelEl = anchor;
  } else {
    labelEl = ce('span', 'jtbd-cta-label');
    labelEl.textContent = label;
  }
  const arrow = ce('span', 'jtbd-cta-arrow');
  arrow.setAttribute('aria-hidden', 'true');
  cta.append(labelEl, arrow);
  return cta;
}

// Card 0: photo fills the tile, gradient overlay, text overlaid top-left.
function buildOverlayCard(group) {
  const card = ce('div', 'jtbd-card jtbd-card--overlay');
  const media = ce('div', 'jtbd-card__media');
  if (group.media) media.appendChild(group.media);
  const overlay = ce('div', 'jtbd-card__overlay');
  overlay.setAttribute('aria-hidden', 'true');
  const text = ce('div', 'jtbd-card__text');
  group.texts.forEach((n, i) => {
    n.classList.add(i === 0 ? 'jtbd-overlay-title' : 'jtbd-overlay-body');
    text.appendChild(n);
  });
  card.append(media, overlay, text);
  return card;
}

// Card 1+: contained image card on top, title/body/CTA copy below.
function buildPanelCard(group) {
  const card = ce('div', 'jtbd-card jtbd-card--panel');
  const imgcard = ce('div', 'jtbd-card__imgcard');
  if (group.media) imgcard.appendChild(group.media);
  const copy = ce('div', 'jtbd-card__copy');
  const hb = ce('div', 'jtbd-card__hb');
  const texts = [...group.texts];
  const ctaNode = texts.length && isCta(texts[texts.length - 1]) ? texts.pop() : null;
  texts.forEach((n, i) => {
    n.classList.add(i === 0 ? 'jtbd-panel-title' : 'jtbd-panel-body');
    hb.appendChild(n);
  });
  copy.appendChild(hb);
  if (ctaNode) copy.appendChild(buildCta(ctaNode));
  card.append(imgcard, copy);
  return card;
}

export default async function init(el) {
  if (!el) return;
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Preserve MEP markers off the row/cell wrappers before the rebuild drops them.
  const row = el.querySelector(':scope > div');
  preserveMepAttrs(row, el);
  preserveMepAttrs(row?.querySelector(':scope > div'), el);

  // PROBE the flat DA content by shape, then group at each media boundary.
  const nodes = gatherContent(el);
  const intro = [];
  const groups = [];
  let cur = null;
  nodes.forEach((n) => {
    if (isMedia(n)) {
      cur = { media: n, texts: [] };
      groups.push(cur);
    } else if (cur) {
      cur.texts.push(n);
    } else {
      intro.push(n);
    }
  });

  // Nothing recognizable — leave the authored DOM untouched (never wipe).
  if (!intro.length && !groups.length) {
    el.dataset.forgeAuthored = BLOCK;
    return;
  }

  const inner = ce('div', 'jtbd-inner');

  if (intro.length) {
    const copy = ce('div', 'jtbd-copy');
    intro.forEach((n, i) => {
      if (i === 0) n.classList.add('jtbd-heading', 'heading-2');
      else n.classList.add('jtbd-subheading', 'body-md');
      copy.appendChild(n);
    });
    inner.appendChild(copy);
  }

  if (groups.length) {
    const section = ce('div', 'jtbd-cards-section');
    const cardsRow = ce('div', 'jtbd-cards-row');
    groups.forEach((group, i) => {
      cardsRow.appendChild(i === 0 ? buildOverlayCard(group) : buildPanelCard(group));
    });
    section.appendChild(cardsRow);
    inner.appendChild(section);
  }

  // Single mount — never innerHTML-wipe (C3/L2).
  el.replaceChildren(inner);

  // Milo service: wire any authored bold/italic action links (a11y + analytics).
  try { decorateButtons(el); } catch { /* best-effort: no authored action links */ }

  tagAnalytics(el, daaLh);
  el.dataset.forgeAuthored = BLOCK;
}
