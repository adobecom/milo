/**
 * forge-work-smarter-than-ever-with-documents — a Milo C2 3-up "use-case" card grid.
 *
 * DA serializes this block's authored content as a FLAT, class-less run inside
 * the EDS cell wrappers: a document-order stream of <picture>/<h3>/<p> with NO
 * grid, NO row wrappers, NO Figma `.usecase`/`.bento`/`.appicon` classes (they are
 * stripped before init runs — C24). So `init(el)` PROBES by content shape (C2),
 * SLICES the flat stream into cards at picture boundaries, and RECONSTRUCTS the
 * rich 3-column layout: each card is a rounded media panel (hero fill + optional
 * app-mnemonic badge overlay + floating overlay thumbs + pill "chip" labels) above
 * a copy column (headline + body + a chevroned "Explore …" CTA).
 *
 * Every <picture>/<img> is MOVED, never re-serialized, so loading/width/height/
 * srcset/sizes and any MEP marker survive (C4/C11). Typography is promoted with
 * Milo's own decorateBlockText service (C5), and the tree is committed once via
 * el.replaceChildren — never a destructive innerHTML wipe (C3/L2).
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT (L30).
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-work-smarter-than-ever-with-documents';
const SVGNS = 'http://www.w3.org/2000/svg';

// MEP / personalization markers Milo stamps on the row/cell wrappers we discard in
// replaceChildren — copy any present marker up onto the block root FIRST so a swap
// never silently disables Target/MEP. data-mep-* is an open family (copy the set).
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

// Disambiguates daa-lh across N same-name instances on one page (1-based suffix).
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

const slugify = (t) => String(t || '').trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

// An app-mnemonic badge is Figma's small brand glyph, exported as "B_app_Adobe…".
// Detect by that naming convention only — never by product words (which also
// appear in hero alts), so a hero image is never mistaken for a badge.
const isBadge = (pic) => /^b[_\s-]?app\b/i.test(
  (pic.querySelector('img')?.getAttribute('alt') || '').trim());

// Chevron built in the SVG namespace (no markup-string parsing — L2-clean).
// currentColor makes it inherit the CTA colour.
function chevron() {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('width', '7');
  svg.setAttribute('height', '12');
  svg.setAttribute('viewBox', '0 0 7 12');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVGNS, 'path');
  path.setAttribute('d', 'M1 1.5L5.5 6L1 10.5');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

// Class-agnostic ordered probe: pictures + headings + non-empty paragraphs in
// document order, at whatever wrapper depth DA nested them (C2/C24). A <p> that
// only wraps a picture is skipped so pictures are never counted twice.
function orderedContent(el) {
  return [...el.querySelectorAll('picture, h1, h2, h3, h4, h5, h6, p')].filter((n) => {
    if (n.tagName === 'PICTURE') return true;
    if (n.querySelector('picture')) return false;
    return n.textContent.trim() !== '';
  });
}

// Slice the flat run into cards WITHOUT assuming a fixed shape. A card owns a
// media/chip run FOLLOWED by a heading + its body/CTA copy; the boundary marker
// is the FIRST picture that appears once the current card already has a heading
// (start of the next card). Every flat child lands in exactly one card — nothing
// is dropped, so N pictures never yield an empty grid (defensive grouping).
function groupCards(nodes) {
  const cards = [];
  let cur = null;
  const fresh = () => { cur = { media: [], chips: [], heading: null, texts: [] }; cards.push(cur); };
  nodes.forEach((n) => {
    const tag = n.tagName;
    const isPic = tag === 'PICTURE';
    const isHeading = /^H[1-6]$/.test(tag);
    if (!cur || (isPic && cur.heading)) fresh();
    if (isPic) cur.media.push(n);
    else if (isHeading && !cur.heading) cur.heading = n;
    else if (!cur.heading) cur.chips.push(n); // pre-heading text = overlay pill
    else cur.texts.push(n); // post-heading text = body copy / trailing CTA
  });
  return cards;
}

function stampImg(pic, cls, daaIm) {
  const img = pic.querySelector('img');
  if (!img) return;
  img.classList.add(cls);
  if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', daaIm);
}

function buildMedia(card, daaLh, idx) {
  const media = createTag('div', { class: `${BLOCK}-media` });
  const badge = card.media.find(isBadge);
  const visuals = card.media.filter((p) => p !== badge);

  // First visual fills the panel; the rest float as overlay thumbnails so every
  // authored picture keeps real space (never discarded, never collapsed).
  const [hero, ...overlays] = visuals;
  if (hero) {
    hero.classList.add(`${BLOCK}-hero`);
    stampImg(hero, `${BLOCK}-hero-img`, `${daaLh}|card${idx + 1}-hero`);
    media.appendChild(hero);
  }
  if (overlays.length) {
    const wrap = createTag('div', { class: `${BLOCK}-overlays` });
    overlays.forEach((pic, i) => {
      pic.classList.add(`${BLOCK}-overlay`);
      stampImg(pic, `${BLOCK}-overlay-img`, `${daaLh}|card${idx + 1}-overlay-${i + 1}`);
      wrap.appendChild(pic);
    });
    media.appendChild(wrap);
  }
  if (badge) {
    badge.classList.add(`${BLOCK}-appicon`);
    stampImg(badge, `${BLOCK}-appicon-img`, `${daaLh}|card${idx + 1}-app`);
    media.appendChild(badge);
  }
  if (card.chips.length) {
    const chips = createTag('div', { class: `${BLOCK}-chips` });
    card.chips.forEach((p) => { p.classList.add(`${BLOCK}-chip`); chips.appendChild(p); });
    media.appendChild(chips);
  }
  return media.childElementCount ? media : null;
}

function buildCopy(card, daaLh) {
  const copy = createTag('div', { class: `${BLOCK}-copy` });
  const textWrap = createTag('div', { class: `${BLOCK}-text` });
  if (card.heading) textWrap.appendChild(card.heading);

  // Split the post-heading paragraphs: the trailing one is the "Explore …" CTA
  // when there is more than one; a lone paragraph stays body (never invent a CTA).
  const texts = card.texts.slice();
  const ctaP = texts.length >= 2 ? texts.pop() : null;
  texts.forEach((p) => textWrap.appendChild(p));

  if (textWrap.childElementCount) {
    // Promote to C2 typography via Milo's own service, THEN add our scoped hooks.
    decorateBlockText(textWrap, { heading: '2', body: 'md' });
    card.heading?.classList.add(`${BLOCK}-title`);
    textWrap.querySelectorAll('p').forEach((p) => p.classList.add(`${BLOCK}-body`));
    copy.appendChild(textWrap);
  }
  if (ctaP) {
    const label = ctaP.textContent.trim();
    const cta = createTag('span', { class: `${BLOCK}-cta`, 'daa-ll': `${daaLh}|${slugify(label) || 'cta'}` });
    cta.append(createTag('span', { class: `${BLOCK}-cta-label` }, label), chevron());
    copy.appendChild(cta);
  }
  return copy.childElementCount ? copy : null;
}

export default async function init(el) {
  if (!el) return;

  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Lift MEP markers off the EDS row/cell wrappers before we discard them.
  el.querySelectorAll(':scope > div, :scope > div > div').forEach((w) => preserveMepAttrs(w, el));

  const cards = groupCards(orderedContent(el))
    .filter((c) => c.heading || c.media.length || c.texts.length);

  const grid = createTag('div', { class: `${BLOCK}-grid` });
  cards.forEach((card, i) => {
    const cardEl = createTag('div', { class: `${BLOCK}-card` });
    const media = buildMedia(card, daaLh, i);
    const copy = buildCopy(card, daaLh);
    if (media) cardEl.appendChild(media);
    if (copy) cardEl.appendChild(copy);
    if (cardEl.childElementCount) grid.appendChild(cardEl);
  });

  // Commit once — never wipe authored DOM destructively (C3/L2). Guard against an
  // empty rebuild so a probe miss leaves the authored content intact.
  if (grid.childElementCount) el.replaceChildren(grid);
  el.dataset.forgeAuthored = BLOCK;
}
