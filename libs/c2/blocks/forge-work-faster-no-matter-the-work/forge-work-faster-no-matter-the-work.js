/**
 * forge-work-faster-no-matter-the-work — a Milo C2 block.
 *
 * Renders the "Work faster. No matter the work." section: a centered copy block
 * (title + subtitle) above a 4-up audience-routing carousel — Sales / Marketing /
 * Legal / Human Resources, each card = label + media + caption (the HR card
 * carries a base photo plus a contained overlay layer) — followed by a faded
 * partner/customer logo strip.
 *
 * WHY THIS REBUILDS FROM CONTENT ORDER (not authored classes):
 * DA serializes a block's content FLAT and CLASS-LESS — at runtime init() receives
 * an <h2>, a subtitle <p>, then a repeating run of [label text, <picture>, caption
 * <p>] with NO grid/row/card wrappers and NONE of the Figma structural classes.
 * So init() PROBES BY CONTENT SHAPE + DOCUMENT ORDER (never by class or by
 * el.children[N]) and RECONSTRUCTS the card grid with createElement, moving the
 * authored nodes (preserving <picture>/<img> attributes + MEP markers) into it.
 *
 * CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
 * (blocks -> c2 -> libs). The 3-hop '../../../' specifier is CORRECT.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-work-faster-no-matter-the-work';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The rebuild
// discards those wrappers, so copy any present marker up onto the block root FIRST
// (data-manifest-id, data-adobe-target-testid, and every data-mep-* attr) — a
// node swap that drops them silently disables Target/MEP on the section.
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

function createEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// Disambiguates daa-lh across N same-name instances on one page.
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Deterministic analytics floor: label every link/button/image not already tagged.
function forgeTagAnalytics(scope, label) {
  if (!scope) return;
  const slug = (t) => String(t || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let li = 0;
  scope.querySelectorAll('a, button').forEach((n) => {
    if (n.hasAttribute('daa-ll')) return;
    li += 1;
    const t = n.textContent || n.getAttribute('aria-label') || n.getAttribute('title') || '';
    n.setAttribute('daa-ll', `${label}|${slug(t) || `link-${li}`}`);
  });
  let ii = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    ii += 1;
    img.setAttribute('daa-im', `${label}|${slug(img.getAttribute('alt')) || `image-${ii}`}`);
  });
}

// Flatten el's descendant content into an ordered token stream. Probes by SHAPE:
// headings, media (<picture>/bare <img>), and leaf text — never by authored class.
function collectTokens(root) {
  const TEXT_TAGS = new Set(['p', 'span', 'strong', 'em', 'b', 'i', 'a', 'li', 'h2', 'h3']);
  const tokens = [];
  const visit = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent.trim();
        if (t) tokens.push({ kind: 'text', text: t, node: null });
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName.toLowerCase();
      if (tag === 'picture' || (tag === 'img' && !child.closest('picture'))) {
        tokens.push({ kind: 'media', node: child });
      } else if (/^h[1-6]$/.test(tag)) {
        tokens.push({ kind: 'head', node: child, text: child.textContent.trim() });
      } else if (child.querySelector('picture, img, h1, h2, h3, h4, h5, h6')) {
        visit(child); // container wrapping media/headings — recurse
      } else if (TEXT_TAGS.has(tag)) {
        const t = child.textContent.trim();
        if (t) tokens.push({ kind: 'text', text: t, node: child });
      } else {
        visit(child); // plain wrapper div — recurse to reach bare-text/leaf nodes
      }
    }
  };
  visit(root);
  return tokens;
}

// Group the post-copy token run into cards. A card accumulates a label (leading
// text), one-or-more consecutive pictures (base + optional overlay layers), then a
// caption (trailing text); the caption closes the card so the next token opens a
// new one. A media-only group with no label/caption is the logo strip.
function parseCards(tokens, startIdx) {
  const cards = [];
  let cur = null;
  const open = () => { cur = { label: '', labelEl: null, pics: [], tag: '', tagEl: null, done: false }; cards.push(cur); return cur; };
  for (let i = startIdx; i < tokens.length; i += 1) {
    const tk = tokens[i];
    if (tk.kind === 'text') {
      if (!cur || cur.done) open();
      if (cur.pics.length === 0) {
        cur.label = cur.label ? `${cur.label} ${tk.text}` : tk.text;
        cur.labelEl = cur.labelEl || (tk.node?.nodeType === 1 ? tk.node : null);
      } else {
        cur.tag = tk.text;
        cur.tagEl = tk.node?.nodeType === 1 ? tk.node : null;
        cur.done = true;
      }
    } else if (tk.kind === 'media') {
      if (!cur || cur.done) open();
      cur.pics.push(tk.node);
    }
  }
  return cards;
}

export default async function init(el) {
  if (!el) return;
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(cell?.parentElement || cell, el);

  const tokens = collectTokens(el);
  const headTok = tokens.find((t) => t.kind === 'head');
  const hasMedia = tokens.some((t) => t.kind === 'media');
  // Nothing recognizable to rebuild — leave authored DOM intact (never wipe).
  if (!headTok || !hasMedia) { el.dataset.forgeAuthored = BLOCK; return; }

  const startIdx = tokens.indexOf(headTok);
  // First text token after the heading is the subtitle; cards start after it.
  let subEl = null;
  let cardStart = startIdx + 1;
  for (let i = startIdx + 1; i < tokens.length; i += 1) {
    if (tokens[i].kind === 'media') { cardStart = i; break; }
    if (tokens[i].kind === 'text') {
      subEl = tokens[i].node?.nodeType === 1 ? tokens[i].node : createEl('p', null, tokens[i].text);
      cardStart = i + 1;
      break;
    }
  }

  const cards = parseCards(tokens, cardStart);

  // --- Rebuild the section ---
  const inner = createEl('div', 'fwf__inner');

  const copy = createEl('div', 'fwf__copy');
  const title = headTok.node;
  title.classList.add('fwf__title');
  copy.appendChild(title);
  if (subEl) { subEl.classList.add('fwf__sub'); copy.appendChild(subEl); }
  inner.appendChild(copy);

  const content = createEl('div', 'fwf__content');
  const carousel = createEl('div', 'fwf__carousel');
  let logos = null;

  cards.forEach((card) => {
    // A media-only group (no label + no caption) is the partner-logo strip.
    if (!card.label && !card.tag && card.pics.length) {
      logos = createEl('div', 'fwf__logos');
      card.pics.forEach((p) => logos.appendChild(p));
      return;
    }
    if (!card.pics.length && !card.label && !card.tag) return;

    const cardEl = createEl('div', 'fwf__card');

    const hdr = createEl('div', 'fwf__card-hdr');
    const lbl = card.labelEl || createEl('span', null, card.label);
    lbl.classList.add('fwf__card-lbl');
    hdr.appendChild(lbl);
    cardEl.appendChild(hdr);

    const imgWrap = createEl('div', 'fwf__card-img');
    card.pics.forEach((p, i) => { if (i > 0) p.classList.add('fwf__layer'); imgWrap.appendChild(p); });
    cardEl.appendChild(imgWrap);

    if (card.tag || card.tagEl) {
      const ftr = createEl('div', 'fwf__card-ftr');
      const tag = card.tagEl || createEl('p', null, card.tag);
      tag.classList.add('fwf__card-tag');
      ftr.appendChild(tag);
      cardEl.appendChild(ftr);
    }
    carousel.appendChild(cardEl);
  });

  content.appendChild(carousel);
  if (logos) content.appendChild(logos);
  inner.appendChild(content);

  // One structural swap at the end — never innerHTML='' (preserves nodes/attrs).
  el.replaceChildren(inner);

  // Milo services: promote the copy block's heading/body typography (also runs
  // decorateButtons internally). Wrapped in decorateViewportContent so a
  // per-viewport authored table decorates each variation and a single table once.
  const runDecorate = () => decorateBlockText(copy);
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, runDecorate);
  else runDecorate();

  forgeTagAnalytics(el, daaLh);
  el.dataset.forgeAuthored = BLOCK;
}
