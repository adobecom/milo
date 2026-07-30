/**
 * forge-address-your-biggest-customer-experience-challenges-with-adobe
 *
 * A "solution pillars" value-proposition section: a lead-in (title + lede) above a
 * grid of solution cards. Compact cards are text-only tiles; a card that carries a
 * media asset renders as a full-width feature row (media + copy). That split is the
 * design INTENT captured from the section reference — the media-bearing pillars span
 * the grid — NOT literal frame pixels.
 *
 * DA serializes an authored block as FLAT, class-LESS semantic HTML in document order
 * (h2, lede p, then per card: an optional <picture>, an eyebrow, an <h3>, a body <p>
 * and an <a>). None of the authored grid/tile/row wrappers survive to runtime, so
 * init(el) probes the content by SHAPE (never by an authored class) and RECONSTRUCTS
 * the rich layout with createElement + one replaceChildren at the end. Content nodes
 * are MOVED (not cloned) so MEP markers and media attributes are preserved. Whether a
 * card is compact or a wide feature is derived from CONTENT (does it ship a picture),
 * so the reconstruction never keys on an authored class.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// THREE hops up from libs/c2/blocks/<name>/ to libs/utils/ (blocks -> c2 -> libs).
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-address-your-biggest-customer-experience-challenges-with-adobe';

// MEP / personalization markers Milo stamps on the wrapper Forge unwraps. Copy any
// present marker onto the block root BEFORE the wrapper is discarded so a later
// Target/MEP swap still finds them.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from.nodeType !== 1) return;
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

const createEl = (tag, className) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

// Walk the (unknown-depth, class-less) authored subtree into an ordered token stream.
// Relevant leaves become typed tokens; bare text (an eyebrow authored as loose text)
// is captured too. A <p> that only wraps media is normalised to a picture token.
function collectStream(root) {
  const stream = [];
  const walk = (node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) stream.push({ type: 'text', text });
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      if (child.matches('picture')) { stream.push({ type: 'picture', node: child }); return; }
      if (child.matches('img') && !child.closest('picture')) { stream.push({ type: 'picture', node: child }); return; }
      if (child.matches('h1, h2')) { stream.push({ type: 'title', node: child }); return; }
      if (child.matches('h3, h4, h5, h6')) { stream.push({ type: 'heading', node: child }); return; }
      if (child.matches('a')) { stream.push({ type: 'link', node: child }); return; }
      if (child.matches('p')) {
        const media = child.querySelector('picture, img');
        if (media && !child.textContent.trim()) {
          stream.push({ type: 'picture', node: media.closest('picture') || media });
          return;
        }
        stream.push({ type: 'p', node: child, text: child.textContent.trim() });
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return stream;
}

// Group the stream into a lead-in (title + lede) and an ordered list of cards.
// A card is anchored on a heading; an eyebrow (loose text or a pre-heading p) and an
// optional picture precede it, the body p and link follow. Order is preserved exactly.
function parseContent(stream) {
  let title = null;
  let lede = null;
  const cards = [];
  let cur = null;
  const ensure = () => { if (!cur) cur = {}; return cur; };
  const flush = () => { if (cur && cur.heading) cards.push(cur); cur = null; };

  stream.forEach((tok) => {
    switch (tok.type) {
      case 'title':
        if (!title) { title = tok.node; break; }
        flush(); ensure().heading = tok.node; break;
      case 'picture':
        if (cur && cur.heading) flush();
        ensure().picture = tok.node; break;
      case 'text':
        if (cur && cur.heading) flush();
        if (!ensure().eyebrow) cur.eyebrow = { text: tok.text }; break;
      case 'heading':
        if (cur && cur.heading) flush();
        ensure().heading = tok.node; break;
      case 'p':
        if (cur && cur.heading) { if (!cur.body) cur.body = tok.node; break; }
        if (title && !lede && !cur) { lede = tok.node; break; }
        if (!ensure().eyebrow) cur.eyebrow = { node: tok.node, text: tok.text }; break;
      case 'link':
        ensure().link = tok.node; flush(); break;
      default:
    }
  });
  flush();
  return { title, lede, cards };
}

function buildEyebrow(eyebrow) {
  if (!eyebrow) return null;
  if (eyebrow.node) return eyebrow.node; // reuse authored element (keeps its attrs)
  const p = createEl('p');
  p.textContent = eyebrow.text;
  return p;
}

function buildCard(card, label) {
  const isWide = !!card.picture;
  const article = createEl('article', isWide ? `${BLOCK}__card ${BLOCK}__card--wide` : `${BLOCK}__card`);

  let media = null;
  if (card.picture) {
    media = createEl('div', `${BLOCK}__media`);
    const img = card.picture.matches?.('img') ? card.picture : card.picture.querySelector('img');
    if (img) {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      img.setAttribute('daa-im', `${label}|${slugify(img.getAttribute('alt')) || 'image'}`);
    }
    media.appendChild(card.picture);
  }

  const body = createEl('div', `${BLOCK}__body`);
  const eyebrow = buildEyebrow(card.eyebrow);
  if (eyebrow) { eyebrow.classList.add('eyebrow', `${BLOCK}__eyebrow`); body.appendChild(eyebrow); }
  if (card.heading) body.appendChild(card.heading);
  if (card.body) body.appendChild(card.body);
  if (card.link) {
    card.link.classList.add(`${BLOCK}__link`);
    card.link.setAttribute('daa-ll', `${label}|${slugify(card.link.textContent) || 'explore'}`);
    body.appendChild(card.link);
  }

  if (media) article.appendChild(media);
  article.appendChild(body);
  // Promote card text to C2 typography via Milo's own service (h3 -> heading-4,
  // eyebrow -> .eyebrow, body -> body-sm; also wires any real button links).
  decorateBlockText(body, { heading: '4', body: 'sm', button: 'md' });
  return article;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  const wrapper = el.querySelector(':scope > div');
  const { title, lede, cards } = parseContent(collectStream(el));
  if (!title && !cards.length) return; // nothing recognisable — leave DOM untouched

  const head = createEl('div', `${BLOCK}__head`);
  if (title) { title.classList.add(`${BLOCK}__title`); head.appendChild(title); }
  if (lede) { lede.classList.add('body-lg', `${BLOCK}__lede`); head.appendChild(lede); }
  decorateBlockText(head, { heading: '2', body: 'lg', button: 'md' });

  const grid = createEl('div', `${BLOCK}__grid`);
  cards.forEach((card, i) => {
    const label = `card-${slugify(card.eyebrow?.text) || i + 1}`;
    grid.appendChild(buildCard(card, label));
  });

  const rebuilt = createEl('div', `${BLOCK}__inner`);
  if (title || lede) rebuilt.appendChild(head);
  rebuilt.appendChild(grid);
  preserveMepAttrs(wrapper, el);
  el.replaceChildren(rebuilt);
  el.dataset.forgeAuthored = BLOCK;
}
