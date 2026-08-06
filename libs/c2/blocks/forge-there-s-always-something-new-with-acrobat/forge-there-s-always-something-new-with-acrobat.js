/**
 * forge-there-s-always-something-new-with-acrobat
 *
 * A "Features and Releases" section: a centered header (eyebrow + display h1)
 * over a two-row, three-up feature grid. Row 1 = three real feature cards
 * (image, heading, body, "Learn more" link). Row 2 = three teaser / "coming
 * soon" cards (a reserved placeholder tile + baked-copy imagery grouped by CTA).
 *
 * DA serialises this block as a FLAT, class-less run of <p>/<h1>/<picture>/
 * <h2|h3>/<p>/<a> in document order — the authored .wn-* grouping classes DO
 * NOT survive to runtime. So init() probes by CONTENT SHAPE (media boundaries +
 * presence of heading/body text), never by an authored class, and reconstructs
 * the grid with createTag + a single el.replaceChildren() at the end (never
 * innerHTML). Moved nodes keep their attributes (href, srcset, loading,
 * width/height, MEP markers).
 *
 * CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/ is THREE hops up
 * (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT.
 *
 * @param {HTMLElement} el  The block root Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateButtons, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-there-s-always-something-new-with-acrobat';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
// Alt text that marks a baked CTA image — closes a teaser-card group.
const CTA_RE = /learn more|get started|explore|try |buy |sign|download|discover/i;
// MEP / personalization markers that ride on the discarded EDS wrapper.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
const CHEVRON = '<svg width="6" height="10" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 1L4 4.5L1 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

const slug = (t) => String(t || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

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

/**
 * Flatten el's authored content into ordered typed items — depth-agnostic, so
 * it works whether DA nests the run in wrapper <div>s or emits it flat.
 */
function collectItems(el) {
  const items = [];
  const captured = [];
  el.querySelectorAll(`picture, ${HEADINGS}, p, a`).forEach((n) => {
    if (captured.some((c) => c !== n && c.contains(n))) return; // skip nested dupes
    let type;
    let node = n;
    if (n.matches('picture')) type = 'media';
    else if (n.matches(HEADINGS)) type = 'heading';
    else if (n.matches('a')) type = 'link';
    else {
      const pic = n.querySelector('picture');
      const anchor = n.querySelector('a');
      if (pic) {
        type = 'media';
        node = pic;
      } else if (!n.textContent.trim()) {
        return;
      } else if (anchor && anchor.textContent.trim() === n.textContent.trim()) {
        type = 'link';
        node = anchor;
      } else {
        type = 'body';
      }
    }
    captured.push(n);
    items.push({ node, type });
  });
  return items;
}

function buildFeatureCard(card) {
  const pic = card.media;
  pic.classList.add('wn-card-pic');
  pic.querySelector('img')?.classList.add('wn-card-img');
  const hb = createTag('div', { class: 'wn-hb' });
  const copy = createTag('div', { class: 'wn-copy' }, hb);
  card.text.forEach((it) => {
    if (it.type === 'heading') {
      it.node.classList.add('wn-h3');
      hb.appendChild(it.node);
    } else if (it.type === 'body') {
      it.node.classList.add('wn-body');
      hb.appendChild(it.node);
    } else if (it.type === 'link') {
      const a = it.node;
      a.classList.add('wn-cta');
      const label = createTag('span', { class: 'wn-cta-label' }, a.textContent.trim() || 'Learn more');
      a.replaceChildren(label, createTag('span', { class: 'wn-chevron', 'aria-hidden': 'true' }, CHEVRON));
      copy.appendChild(a);
    }
  });
  return createTag('div', { class: 'wn-col' }, [pic, copy]);
}

function buildTeaser(pics) {
  const copy = createTag('div', { class: 'wn-teaser-copy' });
  pics.forEach((pic) => {
    const img = pic.querySelector('img');
    const isCta = CTA_RE.test(img?.getAttribute('alt') || '');
    pic.classList.add(isCta ? 'wn-teaser-cta' : 'wn-teaser-txt');
    img?.classList.add('wn-teaser-img');
    copy.appendChild(pic);
  });
  const box = createTag('div', { class: 'wn-placeholder', 'aria-hidden': 'true' });
  return createTag('div', { class: 'wn-col wn-col--teaser' }, [box, copy]);
}

function tagAnalytics(el, label) {
  let i = 0;
  el.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    i += 1;
    n.setAttribute('daa-ll', `${label}|${slug(n.textContent) || `link-${i}`}`);
  });
  let j = 0;
  el.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    j += 1;
    img.setAttribute('daa-im', `${label}|${slug(img.getAttribute('alt')) || `image-${j}`}`);
  });
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);
  preserveMepAttrs(el.querySelector(':scope > div'), el);

  const items = collectItems(el);
  if (!items.length) return;

  // Header = the leading run before the first media item (eyebrow + title).
  const firstMedia = items.findIndex((it) => it.type === 'media');
  const headItems = firstMedia === -1 ? items : items.slice(0, firstMedia);
  const rest = firstMedia === -1 ? [] : items.slice(firstMedia);

  const head = createTag('div', { class: 'wn-head' });
  headItems.forEach((it) => {
    it.node.classList.add(it.type === 'heading' ? 'wn-title' : 'wn-eyebrow');
    head.appendChild(it.node);
  });

  // Cluster the remainder: each cluster starts at a media node and absorbs the
  // following heading/body/link items until the next media node.
  const clusters = [];
  let cur = null;
  rest.forEach((it) => {
    if (it.type === 'media') {
      cur = { media: it.node, text: [] };
      clusters.push(cur);
    } else if (cur) {
      cur.text.push(it);
    }
  });
  const featureCards = clusters.filter((c) => c.text.length);
  const loosePics = clusters.filter((c) => !c.text.length).map((c) => c.media);

  // Group the media-only run into teaser cards, closing each at its CTA image.
  const teasers = [];
  let group = null;
  loosePics.forEach((pic) => {
    if (!group) { group = []; teasers.push(group); }
    group.push(pic);
    if (CTA_RE.test(pic.querySelector('img')?.getAttribute('alt') || '')) group = null;
  });

  const wrap = createTag('div', { class: 'wn-wrap' }, head);
  if (featureCards.length) {
    wrap.appendChild(createTag('div', { class: 'wn-row wn-row--features' }, featureCards.map(buildFeatureCard)));
  }
  if (teasers.length) {
    wrap.appendChild(createTag('div', { class: 'wn-row wn-row--teasers' }, teasers.map(buildTeaser)));
  }
  el.replaceChildren(wrap);

  // Milo services: promote typography (headings -> title-N, copy -> body-*) and
  // decorate any button-styled links, per viewport when the table varies.
  const run = (scope) => { decorateBlockText(scope); decorateButtons(scope); };
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, run);
  else run(el);

  tagAnalytics(el, BLOCK);
  el.dataset.forgeAuthored = BLOCK;
}
