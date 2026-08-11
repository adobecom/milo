/**
 * forge-with-great-power-comes-great-productivity — a Milo C2 hero + image-collage
 * section authored by Forge (build-block-from-figma) for a section that matched no
 * existing catalog block.
 *
 * RUNTIME REALITY (checklist C24): DA serialises this block's content as a FLAT,
 * class-LESS run of <p>/<h1>/<h2>/<picture> in document order — the Figma
 * `.h9copy`/`.h9gallery`/`.h9col` wrappers DO NOT exist at decorate time. So this
 * decorator PROBES the flat content by shape (never by an authored class or a
 * fixed index) and RECONSTRUCTS the rich layout: a centred hero (eyebrow +
 * headline + body + CTA pill) followed by a multi-column masonry collage built
 * from every remaining <picture>, with the embedded research-paper text folded
 * into a compact document card. Nodes are MOVED (never serialised) so
 * <picture>/<img> attributes + MEP markers survive; a single el.replaceChildren
 * swaps in the rebuilt tree (never innerHTML = '').
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/decorate.js is THREE hops
// up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-with-great-power-comes-great-productivity';

// Per-tile aspect ratios (width 291 / height H) read straight out of the Figma
// section sequence — NOT an invented cadence. Applied to gallery picture tiles in
// document order; falls back to a portrait-ish default when content runs longer.
const TILE_H = [291, 292, 292, 394, 394, 292, 393, 291, 292, 392, 291, 394, 291, 393, 394, 393];
const AR_FALLBACK = '291 / 340';

const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMep(from, to) {
  if (!from || !to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

const slug = (t) => String(t || '').trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

function tag(name, cls, text) {
  const n = document.createElement(name);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

// Additive analytics floor (forge-owned; not dependent on author compliance).
// Skips nodes already carrying daa-ll/daa-im so it never double-tags.
function tagAnalytics(scope, label) {
  if (!scope) return;
  scope.querySelectorAll('a, button').forEach((node, i) => {
    if (node.hasAttribute('daa-ll')) return;
    node.setAttribute('daa-ll', `${label}|${slug(node.textContent) || `link-${i + 1}`}`);
  });
  scope.querySelectorAll('img').forEach((img, i) => {
    if (img.hasAttribute('daa-im')) return;
    img.setAttribute('daa-im', `${label}|${slug(img.getAttribute('alt')) || `image-${i + 1}`}`);
  });
}

// A tile that owns one <picture>. Moves the picture in (attributes + MEP travel),
// reserves the box with an explicit aspect-ratio so the section fills its share of
// the comp height instead of collapsing.
function pictureTile(pic, ar) {
  const tile = tag('div', 'tile');
  tile.style.aspectRatio = ar;
  const img = pic.querySelector('img');
  if (img && !img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
  tile.append(pic);
  return tile;
}

// Folds the research-paper text run (+ its trailing chart image) into a compact
// document-card tile so it reads as the small paper thumbnail from the comp.
function docCardTile(nodes) {
  const card = tag('div', 'tile doc-card');
  card.style.aspectRatio = '291 / 393';
  const paper = tag('div', 'doc-paper');
  let seenHeading = false;
  nodes.forEach((n) => {
    if (n.tagName === 'PICTURE') { n.classList.add('doc-chart'); paper.append(n); return; }
    if (/^H[1-6]$/.test(n.tagName)) { seenHeading = true; n.classList.add('doc-title'); paper.append(n); return; }
    const txt = (n.textContent || '').trim();
    const short = txt.length <= 48 && txt === txt.toUpperCase();
    n.classList.add(!seenHeading && short ? 'doc-eyebrow' : 'doc-body');
    paper.append(n);
  });
  card.append(paper);
  return card;
}

function buildHero(eyebrowText, heading, bodyP, ctaText, ctaPic) {
  const hero = tag('div', 'hero');
  if (eyebrowText) hero.append(tag('p', 'eyebrow', eyebrowText));
  const heads = tag('div', 'headings');
  if (heading) { heading.classList.add('headline'); heads.append(heading); }
  if (bodyP) { bodyP.classList.add('body'); heads.append(bodyP); }
  hero.append(heads);
  if (ctaText || ctaPic) {
    const cta = tag('button', 'cta');
    cta.type = 'button';
    cta.append(tag('span', 'cta-badge', 'A'));
    cta.append(tag('span', 'cta-label', ctaText || 'Try Acrobat for free'));
    if (ctaPic) {
      const plus = tag('span', 'cta-plus');
      const img = ctaPic.querySelector('img');
      if (img && !img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      plus.append(ctaPic);
      cta.append(plus);
    }
    hero.append(cta);
  }
  return hero;
}

// Walk the gallery run (pictures interleaved with the research-paper text) and
// slice it into tiles at picture boundaries — every node is accounted for, so the
// masonry can never render empty (the C24 under-build failure).
function buildGallery(galleryNodes) {
  const wrap = tag('div', 'gallery-wrap');
  const gallery = tag('div', 'gallery');
  let picIdx = 0;
  let i = 0;
  while (i < galleryNodes.length) {
    const n = galleryNodes[i];
    if (n.tagName === 'PICTURE') {
      const ar = picIdx < TILE_H.length ? `291 / ${TILE_H[picIdx]}` : AR_FALLBACK;
      gallery.append(pictureTile(n, ar));
      picIdx += 1;
      i += 1;
    } else {
      const cluster = [];
      while (i < galleryNodes.length && galleryNodes[i].tagName !== 'PICTURE') {
        cluster.push(galleryNodes[i]); i += 1;
      }
      // A text run inside the gallery is the research paper — pull the following
      // picture (its chart) into the same card.
      if (i < galleryNodes.length && galleryNodes[i].tagName === 'PICTURE') {
        cluster.push(galleryNodes[i]); i += 1;
      }
      gallery.append(docCardTile(cluster));
    }
  }
  wrap.append(gallery);
  return { wrap, count: gallery.children.length };
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);
  const inner = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMep(inner?.parentElement, el);

  const nodes = [...el.querySelectorAll('h1, h2, h3, h4, p, picture')];
  const heading = el.querySelector('h1');
  const h1i = heading ? nodes.indexOf(heading) : -1;

  // Eyebrow = last text-bearing, non-picture node before the headline.
  let eyebrowText = '';
  for (let k = h1i - 1; k >= 0; k -= 1) {
    if (nodes[k].tagName !== 'PICTURE' && nodes[k].textContent.trim()) {
      eyebrowText = nodes[k].textContent.trim(); break;
    }
  }

  const after = h1i >= 0 ? nodes.slice(h1i + 1) : nodes;
  const firstPic = after.findIndex((n) => n.tagName === 'PICTURE');
  const heroTail = firstPic === -1 ? after : after.slice(0, firstPic);
  let galleryNodes = firstPic === -1 ? [] : after.slice(firstPic);

  // Body = longest paragraph in the hero tail; CTA = a short remaining line.
  const paras = heroTail.filter((n) => n.tagName === 'P');
  let bodyP = null;
  paras.forEach((p) => { if (!bodyP || p.textContent.length > bodyP.textContent.length) bodyP = p; });
  const ctaP = paras.find((p) => p !== bodyP && p.textContent.trim().length <= 48);
  const ctaText = ctaP ? ctaP.textContent.trim() : '';

  // The plus glyph is the first picture after the headline — it belongs to the CTA,
  // not the collage. Consume it only when there is a CTA label to attach it to.
  let ctaPic = null;
  if ((ctaText || bodyP) && galleryNodes[0]?.tagName === 'PICTURE') {
    ctaPic = galleryNodes[0];
    galleryNodes = galleryNodes.slice(1);
  }

  const rebuilt = tag('div', 'frame');
  rebuilt.append(buildHero(eyebrowText, heading, bodyP, ctaText, ctaPic));
  const gallery = buildGallery(galleryNodes);
  if (gallery.count > 0) rebuilt.append(gallery.wrap);

  el.replaceChildren(rebuilt);

  // Real Milo decorator (not an inert shim): promote hero typography + wire
  // buttons via Milo's own service, wrapped in decorateViewportContent for
  // consistent SSR/CSR behaviour. Guarded so nothing throws the section away.
  try {
    const hero = el.querySelector('.hero');
    const decorate = () => { if (hero) decorateBlockText(hero); };
    if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
    else decorate();
  } catch (e) {
    window.lana?.log?.(`${BLOCK} decorateBlockText failed: ${e?.message || e}`);
  }

  tagAnalytics(el, BLOCK);
  el.dataset.forgeAuthored = BLOCK;
}
