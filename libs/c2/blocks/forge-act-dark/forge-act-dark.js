/**
 * forge-act-dark — a dark "Explore all Adobe business products" catalog section.
 *
 * The design is a header row (section title + a ghost "Explore all products"
 * CTA), a row of category chips, and a featured product panel: an intro column
 * (heading + lede + a text link + a visual) beside a 2-up grid of product tiles
 * (each an <a>; the newer products carry a "New" badge appended to their label).
 *
 * DA serializes an authored block as FLAT, class-LESS semantic HTML in document
 * order (h2, a, six loose category labels, h3, a lede <p>, a link <p>, a
 * <picture>, then the product <a>s). None of the authored grid/panel/chip
 * wrappers survive to runtime, so init(el) probes the content by SHAPE — never
 * by an authored class — and RECONSTRUCTS the rich layout with createElement +
 * a single replaceChildren at the end. Content nodes are MOVED (not cloned) so
 * MEP markers and media/link attributes are preserved. The tile "New" badge and
 * the header-vs-panel-vs-tile roles are derived from CONTENT ORDER, so the
 * reconstruction never depends on a class that was stripped.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// THREE hops up from libs/c2/blocks/<name>/ to libs/utils/ (blocks -> c2 -> libs).
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-act-dark';

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

// A product label may carry a trailing "New" badge glued to the name
// ("Brand VisibilityNew"). Split only when a word char precedes "New" so genuine
// names are never truncated.
const NEW_RE = /^(.+?[A-Za-z0-9)])\s*(New)$/;

// Walk the (unknown-depth, class-less) authored subtree into an ordered token
// stream. Relevant leaves become typed tokens; a <p> that only wraps a single
// link is normalised to a link token, and loose text (a category label authored
// as bare text) is captured too. Order is preserved exactly.
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
      if (child.matches('a')) { stream.push({ type: 'link', node: child, text: child.textContent.trim() }); return; }
      if (child.matches('p')) {
        const link = child.querySelector('a');
        const media = child.querySelector('picture, img');
        if (media && !child.textContent.trim()) {
          stream.push({ type: 'picture', node: media.closest('picture') || media });
          return;
        }
        if (link && link.textContent.trim() === child.textContent.trim()) {
          stream.push({ type: 'link', node: link, text: link.textContent.trim() });
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

// Group the ordered stream into: the section title, the header CTA, the category
// labels (everything before the first sub-heading), and the featured panel
// (sub-heading + lede + text link + visual + the product tiles that follow).
function parseContent(stream) {
  const res = {
    title: null,
    headerCta: null,
    tabs: [],
    panel: { heading: null, lede: null, cta: null, picture: null },
    tiles: [],
  };
  let inPanel = false;
  stream.forEach((tok) => {
    if (tok.type === 'title') { if (!res.title) res.title = tok.node; return; }
    if (tok.type === 'heading') { inPanel = true; if (!res.panel.heading) res.panel.heading = tok.node; return; }
    if (!inPanel) {
      if (tok.type === 'link') { if (!res.headerCta) res.headerCta = tok.node; return; }
      // A category label may arrive as its own element OR as one loose text node
      // holding every label on its own line — split so either shape yields N chips.
      if ((tok.type === 'text' || tok.type === 'p') && tok.text) {
        tok.text.split('\n').map((s) => s.trim()).filter(Boolean).forEach((t) => res.tabs.push(t));
      }
      return;
    }
    if (tok.type === 'picture') { if (!res.panel.picture) res.panel.picture = tok.node; return; }
    if (tok.type === 'p') { if (!res.panel.lede) res.panel.lede = tok.node; return; }
    if (tok.type === 'link') {
      if (!res.panel.cta) res.panel.cta = tok.node;
      else res.tiles.push(tok.node);
    }
  });
  return res;
}

function buildTile(anchor, label) {
  const raw = (anchor.textContent || '').trim();
  const m = raw.match(NEW_RE);
  const name = m ? m[1].trim() : raw;
  anchor.replaceChildren();
  anchor.classList.add(`${BLOCK}__tile`);
  const nameEl = createEl('span', `${BLOCK}__tile-name`);
  nameEl.textContent = name;
  anchor.appendChild(nameEl);
  if (m) {
    const badge = createEl('span', `${BLOCK}__tile-new`);
    badge.textContent = 'New';
    anchor.appendChild(badge);
  }
  anchor.setAttribute('daa-ll', `${label}|${slugify(name) || 'tile'}`);
  return anchor;
}

function buildHead(res, label) {
  const head = createEl('div', `${BLOCK}__head`);
  if (res.title) { res.title.classList.add(`${BLOCK}__title`); head.appendChild(res.title); }
  if (res.headerCta) {
    res.headerCta.classList.add(`${BLOCK}__headcta`);
    res.headerCta.setAttribute('daa-ll', `${label}|${slugify(res.headerCta.textContent) || 'explore-all'}`);
    head.appendChild(res.headerCta);
  }
  decorateBlockText(head, { heading: '2' });
  return head;
}

function buildCats(tabs, label) {
  if (!tabs.length) return null;
  const cats = createEl('div', `${BLOCK}__cats`);
  tabs.forEach((text, i) => {
    const btn = createEl('button', `${BLOCK}__cat${i === 0 ? ' is-active' : ''}`);
    btn.type = 'button';
    btn.textContent = text;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.setAttribute('daa-ll', `${label}|${slugify(text) || `cat-${i + 1}`}`);
    cats.appendChild(btn);
  });
  // Single-select chip group (no motion). Toggling active state is a legitimate
  // UI state change, not an invented reveal — see C10/C13.
  cats.addEventListener('click', (e) => {
    const btn = e.target.closest(`.${BLOCK}__cat`);
    if (!btn) return;
    cats.querySelectorAll(`.${BLOCK}__cat`).forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });
  return cats;
}

function buildIntro(panel, label) {
  const intro = createEl('div', `${BLOCK}__intro`);
  if (panel.heading) { panel.heading.classList.add(`${BLOCK}__panel-title`); intro.appendChild(panel.heading); }
  if (panel.lede) { panel.lede.classList.add(`${BLOCK}__lede`, 'body-lg'); intro.appendChild(panel.lede); }
  if (panel.cta) {
    panel.cta.classList.add(`${BLOCK}__cta`);
    panel.cta.setAttribute('daa-ll', `${label}|${slugify(panel.cta.textContent) || 'explore'}`);
    intro.appendChild(panel.cta);
  }
  decorateBlockText(intro, { heading: '3' });
  if (panel.picture) {
    const media = createEl('div', `${BLOCK}__media`);
    const pic = panel.picture;
    const img = pic.matches?.('img') ? pic : pic.querySelector('img');
    if (img) {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      img.setAttribute('daa-im', `${label}|${slugify(img.getAttribute('alt')) || 'visual'}`);
    }
    media.appendChild(pic);
    intro.appendChild(media);
  }
  return intro;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  const wrapper = el.querySelector(':scope > div');
  const res = parseContent(collectStream(el));
  // Nothing recognisable — leave the DOM untouched rather than blank the section.
  if (!res.title && !res.panel.heading && !res.tiles.length) return;

  const inner = createEl('div', `${BLOCK}__inner`);
  const head = buildHead(res, BLOCK);
  if (head.childElementCount) inner.appendChild(head);

  const cats = buildCats(res.tabs, BLOCK);
  if (cats) inner.appendChild(cats);

  const panel = createEl('div', `${BLOCK}__panel`);
  const intro = buildIntro(res.panel, BLOCK);
  if (intro.childElementCount) panel.appendChild(intro);

  if (res.tiles.length) {
    const tiles = createEl('div', `${BLOCK}__tiles`);
    res.tiles.forEach((a) => tiles.appendChild(buildTile(a, BLOCK)));
    panel.appendChild(tiles);
  }
  if (panel.childElementCount) inner.appendChild(panel);

  preserveMepAttrs(wrapper, el);
  el.replaceChildren(inner);
  el.dataset.forgeAuthored = BLOCK;
}
