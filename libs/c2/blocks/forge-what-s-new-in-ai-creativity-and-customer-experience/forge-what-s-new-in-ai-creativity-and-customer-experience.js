/**
 * forge-what-s-new-in-ai-creativity-and-customer-experience — a Milo C2 block
 * authored by Forge for a "What's new" announcement section that matched no
 * existing catalog block (closest was rich-content, score 0.77).
 *
 * DA serializes a block's content as a FLAT, class-LESS run of semantic nodes in
 * document order — here: <p>(eyebrow), <h2>(section title), then three repeated
 * clusters of <picture> + badge-text + <h3> + <p> + <a>. The authored grid /
 * card wrappers in section.html DO NOT survive to runtime, so init(el) probes by
 * CONTENT SHAPE (grouping each cluster on its leading <picture> anchor — never by
 * an authored class or child index) and RECONSTRUCTS the 3-up feature-card grid
 * with createElement, stamping the structural classes the scoped CSS keys on
 * (.section-head / .cards-3 / .feature-card / .feature-card__media /
 * .feature-card__body / .badge / .textlink). Authored nodes are MOVED (not
 * cloned) so <picture>/<img> attributes (loading, srcset, sizes) and any MEP
 * markers travel with them. Milo's own decorateBlockText runs over the rebuilt
 * DOM (wrapped in decorateViewportContent) to promote C2 typography + wire
 * button/link a11y, so this is a real decorator, not an inert capture shim.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-what-s-new-in-ai-creativity-and-customer-experience';

// MEP / personalization markers Milo may stamp on the row/cell wrapper. The
// rebuild discards that wrapper, so copy any present marker onto the block root
// FIRST — a node swap that drops them silently disables Target/MEP on the section.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  // data-mep-* is an open family — copy every attribute in that namespace.
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

// Disambiguates daa-lh across N same-name instances on one page (1-based suffix).
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

function createEl(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

// Walk the block in document order and emit an ordered token list, capturing the
// semantic elements AND the loose badge text nodes (DA serializes "New" /
// "Now available" as bare text between the <picture> and the <h3>). Text already
// inside a text-hosting element is skipped (it is captured via its own element).
const SEMANTIC = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'PICTURE']);
const TEXT_HOSTS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'SPAN', 'EM', 'STRONG', 'B', 'I', 'LI', 'BUTTON']);
function orderedTokens(root) {
  const tokens = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      const host = node.parentElement;
      if (text && !(host && TEXT_HOSTS.has(host.tagName))) tokens.push({ kind: 'badge', text });
    } else if (SEMANTIC.has(node.tagName)) {
      tokens.push({ kind: node.tagName.toLowerCase(), node });
    }
    node = walker.nextNode();
  }
  return tokens;
}

// Group the flat token stream into card clusters, each anchored on a <picture>.
// Within a cluster: first badge (bare text or a leading class-less <p>) → pill,
// first heading → title, remaining <p> → body copy, first <a> → learn-more link.
function groupCards(tokens, startIdx) {
  const groups = [];
  let cur = null;
  for (let i = startIdx; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (t.kind === 'picture') {
      cur = { picture: t.node, badge: '', heading: null, body: null, link: null };
      groups.push(cur);
    } else if (!cur) {
      // stray content before the first picture is handled as the section head
    } else if (t.kind === 'badge' && !cur.badge && !cur.heading) {
      cur.badge = t.text;
    } else if (/^h[1-6]$/.test(t.kind) && !cur.heading) {
      cur.heading = t.node;
    } else if (t.kind === 'p') {
      if (!cur.badge && !cur.heading) cur.badge = t.node.textContent.trim();
      else if (!cur.body) cur.body = t.node;
    } else if (t.kind === 'a' && !cur.link) {
      cur.link = t.node;
    }
  }
  return groups;
}

function buildCard(group, daaLh, index) {
  const article = createEl('article', 'feature-card');

  if (group.picture) {
    group.picture.classList.add('feature-card__media');
    const img = group.picture.querySelector('img');
    if (img) {
      // Own the <img> with a block class so the CSS never has to reach a bare
      // element selector (page-level `img` reach) to size/crop the media.
      img.classList.add('feature-card__img');
      if (!img.hasAttribute('daa-im')) {
        img.setAttribute('daa-im', `${daaLh}|${slugify(img.getAttribute('alt')) || `image-${index + 1}`}`);
      }
    }
    article.appendChild(group.picture);
  }

  const body = createEl('div', 'feature-card__body');
  if (group.badge) {
    const badge = createEl('span', 'badge');
    badge.textContent = group.badge;
    body.appendChild(badge);
  }
  if (group.heading) body.appendChild(group.heading);
  if (group.body) body.appendChild(group.body);
  if (group.link) {
    const { link } = group;
    link.classList.add('textlink');
    if (!link.hasAttribute('daa-ll')) {
      const label = slugify(group.heading?.textContent) || `learn-more-${index + 1}`;
      link.setAttribute('daa-ll', `${daaLh}|${label}`);
    }
    body.appendChild(link);
  }

  article.appendChild(body);
  return article;
}

export default async function init(el) {
  if (!el) return;

  // Section-level analytics handle, disambiguated across N same-name instances.
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // Preserve MEP markers off the row/cell wrapper before the rebuild drops it.
  const wrapper = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(wrapper?.parentElement || wrapper, el);

  const tokens = orderedTokens(el);
  const firstPicIdx = tokens.findIndex((t) => t.kind === 'picture');
  const headTokens = firstPicIdx === -1 ? tokens : tokens.slice(0, firstPicIdx);

  const heading = headTokens.find((t) => t.kind === 'h2')?.node
    || headTokens.find((t) => /^h[1-6]$/.test(t.kind))?.node;
  const eyebrowTok = headTokens.find((t) => t.kind === 'p' || t.kind === 'badge');

  const sectionHead = createEl('div', 'section-head');
  if (eyebrowTok) {
    if (eyebrowTok.node) {
      eyebrowTok.node.classList.add('eyebrow');
      sectionHead.appendChild(eyebrowTok.node);
    } else {
      const eyebrow = createEl('p', 'eyebrow');
      eyebrow.textContent = eyebrowTok.text;
      sectionHead.appendChild(eyebrow);
    }
  }
  if (heading) sectionHead.appendChild(heading);

  const groups = firstPicIdx === -1 ? [] : groupCards(tokens, firstPicIdx);
  const cards = createEl('div', 'cards-3');
  groups.forEach((group, i) => cards.appendChild(buildCard(group, daaLh, i)));

  // Single atomic swap (C3: never innerHTML-wipe; build then replaceChildren once).
  const rebuilt = [];
  if (sectionHead.childNodes.length) rebuilt.push(sectionHead);
  if (cards.childNodes.length) rebuilt.push(cards);
  if (rebuilt.length) el.replaceChildren(...rebuilt);

  // Promote text to C2 typography + wire button/link a11y via Milo's own service.
  // decorateViewportContent decorates each per-viewport variation, or the single
  // table once; guard so a missing helper still decorates.
  const decorate = (scope) => { if (scope) decorateBlockText(scope); };
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
  else decorate(el);

  el.dataset.forgeAuthored = BLOCK;
}
