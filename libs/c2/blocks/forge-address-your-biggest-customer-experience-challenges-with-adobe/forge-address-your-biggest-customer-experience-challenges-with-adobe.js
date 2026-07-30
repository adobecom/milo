/**
 * forge-address-your-biggest-customer-experience-challenges-with-adobe
 * — a Milo C2 block authored by Forge for a "customer-experience challenges"
 * value-proposition section that matched no existing catalog block (closest was
 * base-card, score 0.81).
 *
 * DA serializes a block's content as a FLAT, class-LESS run of semantic nodes in
 * document order — here: <h2>(section title) + <p>(intro), then FIVE challenge
 * clusters. The first two clusters lead with a <picture> (media cards); the last
 * three are text-only. Every cluster is [picture?] + <p>(eyebrow) + <h3> + <p>
 * (body) + <a>(link). The authored grid / article wrappers in section.html DO
 * NOT survive to runtime, so init(el) probes by CONTENT SHAPE (never by an
 * authored class or child index) and RECONSTRUCTS the 6-column bento grid with
 * createElement, stamping the structural classes the scoped CSS keys on
 * (.section-head / .section-intro / .challenge-grid / .challenge /
 * .challenge--media / .challenge--text / .challenge__media / .challenge__img /
 * .challenge__body / .eyebrow / .textlink).
 *
 * PROPORTIONS ARE THE DESIGN: section.html specifies 2 media cards (span 3 →
 * 2-up first row) then 3 text cards (span 2 → 3-up second row) on a 6-col grid.
 * That exact cadence is carried here as card-TYPE spans (media → span 3, text →
 * span 2) expressed in relative fr units — never pinned frame pixels (L27).
 *
 * Authored nodes are MOVED (not cloned) so <picture>/<img> attributes (loading,
 * srcset, sizes, width/height) and any MEP markers travel with them. Milo's own
 * decorateBlockText runs over the rebuilt DOM (wrapped in decorateViewportContent)
 * to promote C2 typography + wire link a11y, so this is a real decorator.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-address-your-biggest-customer-experience-challenges-with-adobe';

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

// Walk the block in document order and emit an ordered token list of the
// semantic elements. <picture> is atomic (its <img>/<source> descendants are not
// separate tokens); an inline <a>/<p> nested inside another paragraph/heading is
// skipped (it travels with its host), so the top-level clusters read out cleanly.
const HEADINGS = /^h[1-6]$/;
function orderedTokens(root) {
  const tokens = [];
  const nodes = [...root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, picture')];
  for (const node of nodes) {
    const tag = node.tagName;
    if (tag === 'PICTURE') { tokens.push({ kind: 'picture', node }); continue; }
    if ((tag === 'A' || tag === 'P') && node.parentElement?.closest('p, h1, h2, h3, h4, h5, h6')) continue;
    tokens.push({ kind: tag.toLowerCase(), node });
  }
  return tokens;
}

// Group the flat token stream (from the first card token onward) into challenge
// clusters. A new card starts on a <picture> (media card) or on an eyebrow <p>
// that follows a completed card (text card). Within a cluster: leading <p> →
// eyebrow, <h3> → title, following <p> → body copy, first <a> → learn-more link.
function groupCards(tokens, start) {
  const groups = [];
  let cur = null;
  const startCard = (init) => {
    cur = {
      picture: null, eyebrow: null, heading: null, body: null, link: null, ...init,
    };
    groups.push(cur);
    return cur;
  };
  for (let i = start; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (t.kind === 'picture') { startCard({ picture: t.node }); continue; }
    if (HEADINGS.test(t.kind)) {
      if (!cur || cur.heading) startCard({});
      cur.heading = t.node;
      continue;
    }
    if (t.kind === 'p') {
      if (!cur || (cur.heading && (cur.body || cur.link))) { startCard({ eyebrow: t.node }); continue; }
      if (!cur.eyebrow && !cur.heading) { cur.eyebrow = t.node; continue; }
      if (cur.heading && !cur.body) { cur.body = t.node; continue; }
      if (!cur.body) cur.body = t.node;
      continue;
    }
    if (t.kind === 'a') {
      if (!cur) startCard({});
      if (!cur.link) cur.link = t.node;
    }
  }
  return groups;
}

function buildCard(group, daaLh, index) {
  const hasMedia = !!group.picture;
  const article = createEl('article', `challenge ${hasMedia ? 'challenge--media' : 'challenge--text'}`);

  if (group.picture) {
    group.picture.classList.add('challenge__media');
    const img = group.picture.querySelector('img');
    if (img) {
      // Own the <img> with a block class so the CSS never reaches a bare element
      // selector to size/crop the media (C4: attrs preserved because we MOVE it).
      img.classList.add('challenge__img');
      if (!img.hasAttribute('daa-im')) {
        img.setAttribute('daa-im', `${daaLh}|${slugify(img.getAttribute('alt')) || `image-${index + 1}`}`);
      }
    }
    article.appendChild(group.picture);
  }

  const body = createEl('div', 'challenge__body');
  if (group.eyebrow) {
    group.eyebrow.classList.add('eyebrow');
    body.appendChild(group.eyebrow);
  }
  if (group.heading) body.appendChild(group.heading);
  if (group.body) body.appendChild(group.body);
  if (group.link) {
    const { link } = group;
    link.classList.add('textlink');
    if (!link.hasAttribute('daa-ll')) {
      const label = slugify(group.heading?.textContent) || `explore-${index + 1}`;
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

  // Card region begins at the first <picture>, else at the eyebrow <p> preceding
  // the first <h3>; everything before that is the section head.
  const firstPic = tokens.findIndex((t) => t.kind === 'picture');
  const firstH3 = tokens.findIndex((t) => t.kind === 'h3');
  let cardStart = tokens.length;
  if (firstPic !== -1 && (firstH3 === -1 || firstPic < firstH3)) {
    cardStart = firstPic;
  } else if (firstH3 !== -1) {
    cardStart = (firstH3 > 0 && tokens[firstH3 - 1].kind === 'p') ? firstH3 - 1 : firstH3;
  }

  const headTokens = tokens.slice(0, cardStart);
  const title = headTokens.find((t) => t.kind === 'h2')?.node
    || headTokens.find((t) => HEADINGS.test(t.kind))?.node;
  const intro = headTokens.find((t) => t.kind === 'p')?.node;

  const sectionHead = createEl('div', 'section-head');
  if (title) sectionHead.appendChild(title);
  if (intro) { intro.classList.add('section-intro'); sectionHead.appendChild(intro); }

  const groups = groupCards(tokens, cardStart);
  const grid = createEl('div', 'challenge-grid');
  groups.forEach((group, i) => grid.appendChild(buildCard(group, daaLh, i)));

  // Single atomic swap (C3: never innerHTML-wipe; build then replaceChildren once).
  const rebuilt = [];
  if (sectionHead.childNodes.length) rebuilt.push(sectionHead);
  if (grid.childNodes.length) rebuilt.push(grid);
  if (rebuilt.length) el.replaceChildren(...rebuilt);

  // Promote text to C2 typography + wire link a11y via Milo's own service.
  // decorateViewportContent decorates each per-viewport variation, or the single
  // table once; guard so a missing helper still decorates.
  const decorate = (scope) => { if (scope) decorateBlockText(scope); };
  if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
  else decorate(el);

  el.dataset.forgeAuthored = BLOCK;
}
