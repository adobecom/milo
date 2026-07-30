/**
 * forge-act2 — a dark "Contact our team" section: a centered lede (info icon +
 * heading + inquiry copy with mailto links) above a responsive grid of
 * icon-led navigation tiles (About Adobe / Corporate Responsibility / Investor
 * Relations).
 *
 * At RUNTIME the block receives DA's FLAT, class-less serialization — a single
 * run of <picture>, <h2>, <p>, then N icon-bearing <a> in document order, with
 * NO .lede / .tiles / .tile wrappers (those authored classes are stripped
 * before init runs). So init() must RECONSTRUCT the layout from content SHAPE
 * (never from an authored class): the standalone <picture> is the info icon,
 * the <h2>+<p> are the lede copy, and every <a> that carries its own image is a
 * tile. The scoped CSS keys ONLY on the classes rebuilt here.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// From libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifier is correct — L30.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-act2';

// MEP / personalization markers Milo may stamp on the row/cell wrapper we
// discard. Copy them onto the block root BEFORE the rebuild so a later
// Target/MEP swap still finds them (dropping them silently disables MEP).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

const slugify = (text) => String(text || '')
  .trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40);

function el2(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// The standalone media (a <picture>/<img> NOT inside a link) is the info icon.
function findInfoMedia(root) {
  return [...root.querySelectorAll('picture, img')].find((m) => !m.closest('a')) || null;
}

// Move a media node into a target, preserving <picture>/<source>/<img> attrs.
function adoptMedia(media) {
  const pic = media.tagName === 'PICTURE' ? media : (media.closest('picture') || media);
  const img = pic.querySelector('img') || (pic.tagName === 'IMG' ? pic : null);
  return { pic, img };
}

// Rebuild one authored icon-link into a tile: keep the <a> (href + MEP + attrs
// intact), split the trailing "→" glyph out of the label into its own span.
function buildTile(anchor, daaLh, index) {
  const { pic, img } = adoptMedia(anchor.querySelector('picture, img'));
  if (img) {
    img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', `${daaLh}|${slugify(img.getAttribute('alt')) || `icon-${index + 1}`}`);
  }
  const label = anchor.textContent.replace(/[→➡>\s]+$/u, '').trim();
  anchor.classList.add('tile');
  const labelSpan = el2('span', 'tile-label');
  labelSpan.textContent = label;
  const arrow = el2('span', 'arw');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  const mediaWrap = el2('span', 'tile-ic');
  if (pic) mediaWrap.appendChild(pic);
  anchor.replaceChildren(mediaWrap, labelSpan, arrow);
  if (!anchor.hasAttribute('daa-ll')) anchor.setAttribute('daa-ll', `${daaLh}|${slugify(label) || `tile-${index + 1}`}`);
  return anchor;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Preserve MEP markers off the wrapper cell(s) we are about to discard.
  const row = el.querySelector(':scope > div');
  preserveMepAttrs(row?.querySelector(':scope > div') || row, el);

  // Probe by content SHAPE, never by authored class (they are stripped).
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const para = el.querySelector('p');
  const infoMedia = findInfoMedia(el);
  const tileLinks = [...el.querySelectorAll('a')].filter((a) => a.querySelector('picture, img'));

  // Without a heading there is nothing to reconstruct — leave the DOM intact.
  if (!heading) {
    el.dataset.forgeAuthored = BLOCK;
    return;
  }

  const wrap = el2('div', 'wrap');
  const lede = el2('div', 'lede');

  if (infoMedia) {
    const { pic, img } = adoptMedia(infoMedia);
    if (pic) {
      pic.classList.add('info-ic');
      if (img) {
        img.setAttribute('aria-hidden', 'true');
        if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', `${BLOCK}|info`);
      }
      lede.appendChild(pic);
    }
  }

  // Text sub-container so Milo's decorateBlockText sees a clean heading + body
  // (heading has no media previous-sibling to mis-tag as an eyebrow).
  const copy = el2('div', 'lede-copy');
  copy.appendChild(heading);
  if (para) copy.appendChild(para);
  lede.appendChild(copy);
  wrap.appendChild(lede);

  if (tileLinks.length) {
    const tiles = el2('div', 'tiles');
    tileLinks.forEach((a, i) => tiles.appendChild(buildTile(a, BLOCK, i)));
    wrap.appendChild(tiles);
  }

  // Single mount — never innerHTML-wipe (preserves any node identity above).
  el.replaceChildren(wrap);

  // Real Milo typography wiring (heading-N + body-*), viewport-aware. Guarded so
  // a service hiccup can never strand the reconstructed layout.
  try {
    decorateViewportContent(copy, (scope) => decorateBlockText(scope));
  } catch (e) {
    window.lana?.log(`${BLOCK} decorateBlockText failed: ${e?.message || e}`);
  }
  if (para) para.classList.add('inq');

  el.dataset.forgeAuthored = BLOCK;
}
