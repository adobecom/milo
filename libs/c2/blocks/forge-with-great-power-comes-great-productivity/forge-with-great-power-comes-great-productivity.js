/**
 * forge-with-great-power-comes-great-productivity — a distinctive Milo C2 section
 * that no catalog block covered. It has two visual bands:
 *   1. HERO   — a centred eyebrow (app-id) + <h1> + body copy + a black CTA promo
 *               pill, sitting above a staggered masonry image collage that fades
 *               into the page.
 *   2. AUDIENCE — a display <h2> ("Work faster."), a horizontally-scrolling row of
 *               use-case cards (label + tall image + one-line description) and a
 *               faded partner-logo strip.
 *
 * DA strips authored classes and serialises the block as a FLAT, class-less run
 * of <picture>/<h1>/<h2>/<p>/text in document order (see mocks/body.html). So this
 * init() NEVER reads an authored class or a fixed child index — it walks the flat
 * children, detects the repeating units by CONTENT BOUNDARY (a new mosaic tile at
 * each <picture>; a new use-case card at each label text), and RECONSTRUCTS the
 * rich DOM with its own `.forge-with-great-power-comes-great-productivity`-scoped
 * classes that the co-authored stylesheet keys on. Original <picture> nodes are
 * MOVED (never re-created) so loading/width/height/srcset survive (C4).
 *
 * @param {HTMLElement} el  the block root Milo passes to every C2 decorator
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils is THREE hops up
// (blocks -> c2 -> libs). Keep the 3-hop specifier — L30 validates it.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-with-great-power-comes-great-productivity';
const SVGNS = 'http://www.w3.org/2000/svg';
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];

/* Copy MEP / Target markers off a wrapper we are about to discard onto the block
   root, so a later Target/MEP swap still finds them (C11). */
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

function tag(name, { cls, text, attrs, kids } = {}) {
  const node = document.createElement(name);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  (kids || []).forEach((k) => k && node.appendChild(k));
  return node;
}

const isPic = (n) => !!n && n.nodeType === 1
  && (n.tagName === 'PICTURE' || (!!n.querySelector?.('picture, img') && !n.textContent.trim()));
const isHeading = (n) => !!n && /^H[1-6]$/.test(n.tagName || '');
const textOf = (n) => (n?.textContent || '').replace(/\s+/g, ' ').trim();

/* Return the real <picture> for a flat node (moved, not cloned, to keep attrs). */
function pictureFrom(node) {
  if (!node) return null;
  if (node.tagName === 'PICTURE') return node;
  const pic = node.querySelector?.('picture');
  if (pic) return pic;
  const img = node.querySelector?.('img');
  return img ? tag('picture', { kids: [img] }) : null;
}

/* Reserve layout space (C19/CLS): stamp the natural ratio on collage images. */
function applyRatio(pic, fallback) {
  const img = pic?.querySelector('img');
  if (!img) return;
  const w = Number(img.getAttribute('width'));
  const h = Number(img.getAttribute('height'));
  img.style.aspectRatio = (w && h) ? `${w} / ${h}` : fallback;
}

function chevron(dir) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVGNS, 'path');
  path.setAttribute('d', dir === 'right' ? 'M9 5l7 7-7 7' : 'M5 9l7 7 7-7');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

/* Black promo pill: main action button + a chevron toggle (C9 — real actions
   with no navigable href are <button>, never <a href="#">). */
function buildCta(iconPic, label) {
  const main = tag('button', { cls: 'fwp-cta-main', attrs: { type: 'button' } });
  if (iconPic) { iconPic.classList.add('fwp-cta-icon'); main.appendChild(iconPic); }
  main.appendChild(tag('span', { cls: 'fwp-cta-text', text: label || 'Start an Acrobat free trial' }));
  const toggle = tag('button', {
    cls: 'fwp-cta-toggle',
    attrs: { type: 'button', 'aria-label': 'Show more options' },
    kids: [chevron('down')],
  });
  return tag('div', { cls: 'fwp-cta', kids: [main, toggle] });
}

function buildCard(card) {
  const hdr = tag('div', {
    cls: 'fwp-card-hdr',
    kids: [
      tag('span', { cls: 'fwp-card-label', text: card.label || '' }),
      tag('span', { cls: 'fwp-card-chevron', attrs: { 'aria-hidden': 'true' }, kids: [chevron('right')] }),
    ],
  });
  const kids = [hdr];
  const pic = pictureFrom(card.img);
  if (pic) {
    pic.classList.add('fwp-card-pic');
    kids.push(tag('div', { cls: 'fwp-card-media', kids: [pic] }));
  }
  if (card.desc) {
    kids.push(tag('div', { cls: 'fwp-card-ftr', kids: [tag('span', { cls: 'fwp-card-desc', text: card.desc })] }));
  }
  return tag('div', { cls: 'fwp-card', kids });
}

/* Deterministic analytics floor (C7) — never double-tags. */
function tagAnalytics(scope) {
  const slug = (t) => String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let li = 0;
  scope.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    const t = n.textContent || n.getAttribute('aria-label') || '';
    n.setAttribute('daa-ll', `${slug(t) || `action-${li}`}`);
  });
  let ii = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    ii += 1;
    img.setAttribute('daa-im', `${slug(img.getAttribute('alt')) || `image-${ii}`}`);
  });
}

export default async function init(el) {
  if (!el) return;
  try {
    el.setAttribute('daa-lh', BLOCK);

    // Locate the content cell (EDS: block > row > cell). Fall back gracefully.
    const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div') || el;
    preserveMepAttrs(cell.parentElement, el);
    preserveMepAttrs(cell, el);
    const nodes = [...cell.children].filter((n) => n.nodeType === 1);
    if (!nodes.length) return;

    const h1i = nodes.findIndex((n) => n.tagName === 'H1');
    const h2i = nodes.findIndex((n) => n.tagName === 'H2');
    const headIdx = h1i === -1 ? nodes.findIndex(isHeading) : h1i;
    const heroEnd = h2i === -1 ? nodes.length : h2i;

    const frag = document.createDocumentFragment();

    /* ───────────────────────── HERO ───────────────────────── */
    const copy = tag('div', { cls: 'fwp-copy' });

    // Eyebrow / app-id: everything before the headline (icon + label text).
    const eyebrow = tag('div', { cls: 'fwp-appid' });
    nodes.slice(0, headIdx < 0 ? 0 : headIdx).forEach((n) => {
      if (isPic(n)) {
        const p = pictureFrom(n);
        if (p) { p.classList.add('fwp-appid-icon'); eyebrow.appendChild(p); }
      } else if (textOf(n)) {
        eyebrow.appendChild(tag('span', { cls: 'fwp-appid-text', text: textOf(n) }));
      }
    });
    if (eyebrow.childNodes.length) copy.appendChild(eyebrow);

    // Headline.
    if (headIdx >= 0) { nodes[headIdx].classList.add('fwp-headline'); copy.appendChild(nodes[headIdx]); }

    let i = headIdx < 0 ? 0 : headIdx + 1;
    // Body copy = first text after the headline.
    if (i < heroEnd && !isPic(nodes[i]) && !isHeading(nodes[i])) {
      nodes[i].classList.add('fwp-body'); copy.appendChild(nodes[i]); i += 1;
    }
    // CTA pill = the next picture (+ its label text).
    if (i < heroEnd && isPic(nodes[i])) {
      const icon = pictureFrom(nodes[i]); i += 1;
      let label = '';
      if (i < heroEnd && !isPic(nodes[i]) && !isHeading(nodes[i])) { label = textOf(nodes[i]); i += 1; }
      copy.appendChild(buildCta(icon, label));
    }

    const hero = tag('div', { cls: 'fwp-hero', kids: [copy] });

    // Masonry collage = every remaining hero node. New tile at each <picture>;
    // trailing text lines attach to the current tile as a caption (this is how the
    // signature card + the special-report doc keep their labels).
    const mosaic = tag('div', { cls: 'fwp-mosaic', attrs: { 'aria-hidden': 'true' } });
    let tile = null;
    nodes.slice(i, heroEnd).forEach((n) => {
      if (isPic(n)) {
        const p = pictureFrom(n);
        tile = tag('div', { cls: 'fwp-tile' });
        if (p) { p.classList.add('fwp-tile-pic'); applyRatio(p, '3 / 4'); tile.appendChild(p); }
        mosaic.appendChild(tile);
      } else {
        if (!tile) { tile = tag('div', { cls: 'fwp-tile' }); mosaic.appendChild(tile); }
        tile.classList.add('fwp-tile--doc');
        let cap = tile.querySelector('.fwp-tile-cap');
        if (!cap) { cap = tag('div', { cls: 'fwp-tile-cap' }); tile.appendChild(cap); }
        cap.appendChild(tag('span', { cls: 'fwp-tile-cap-line', text: textOf(n) }));
      }
    });
    if (mosaic.children.length) {
      hero.appendChild(tag('div', {
        cls: 'fwp-hero-media',
        kids: [mosaic, tag('div', { cls: 'fwp-hero-fade', attrs: { 'aria-hidden': 'true' } })],
      }));
    }
    frag.appendChild(hero);

    /* ─────────────────────── AUDIENCE ─────────────────────── */
    if (h2i !== -1) {
      nodes[h2i].classList.add('fwp-aud-heading');
      const aud = tag('div', { cls: 'fwp-aud', kids: [nodes[h2i]] });

      // Group the flat run into cards (label → image → description). A picture
      // that arrives once the current card is complete is the partner-logo strip.
      const cards = [];
      let cur = null;
      let logos = null;
      nodes.slice(h2i + 1).forEach((n) => {
        if (isPic(n)) {
          if (cur && !cur.img) cur.img = n;
          else logos = n;
        } else {
          const t = textOf(n);
          if (!t) return;
          if (!cur || cur.desc) { cur = { label: t, img: null, desc: '' }; cards.push(cur); }
          else if (cur.img && !cur.desc) cur.desc = t;
          else cur.label = cur.label ? `${cur.label} ${t}` : t;
        }
      });

      const grid = tag('div', { cls: 'fwp-cards' });
      cards.forEach((c) => grid.appendChild(buildCard(c)));
      if (grid.children.length) aud.appendChild(grid);

      const logoPic = pictureFrom(logos);
      if (logoPic) {
        logoPic.classList.add('fwp-logos-img');
        aud.appendChild(tag('div', { cls: 'fwp-logos', kids: [logoPic] }));
      }
      frag.appendChild(aud);
    }

    // Single swap via replaceChildren — no destructive markup reset (C3/L2). The
    // rebuilt DOM replaces the EDS row/cell wrappers in one pass.
    el.replaceChildren(frag);

    // Promote hero copy typography via Milo's own service (safe scope: only the
    // text column, so it never mangles the collage/cards).
    try { decorateBlockText(copy); } catch (e) { /* typography is best-effort */ }

    tagAnalytics(el);
    el.dataset.forgeAuthored = BLOCK;
  } catch (e) {
    window.lana?.log?.(`${BLOCK} init failed: ${e?.message || e}`, { tags: 'forge,c2' });
  }
}
