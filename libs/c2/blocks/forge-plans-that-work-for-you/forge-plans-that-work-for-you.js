/**
 * forge-plans-that-work-for-you — Milo C2 block (distinctive section, no catalog match).
 *
 * WHAT IT RENDERS: the "Plans that work for you." pricing section — a centered
 * title, a segmented tab pill row, a responsive row of plan cards (each: brand
 * tag, name, description, price, CTA, "Secure transaction" line, and grouped
 * feature lists), and a "Compare Plans" + carousel-nav footer row.
 *
 * WHY IT REBUILDS FROM CONTENT ORDER (checklist C24): DA serializes this block as
 * a FLAT, class-LESS run of semantic nodes (an <h2>, then paragraphs/bare text in
 * document order) — the Figma grid/row/card/tile wrappers and every `.s8-*` class
 * are GONE at runtime. So init() PROBES by content shape (never by an authored
 * class or a fixed child index) and RECONSTRUCTS the rich layout with
 * createElement + classList, stamping its OWN `.ptw__*` classes that the scoped
 * stylesheet keys on. Card boundaries are found from a stable content anchor
 * ("Secure transaction", one per card) — never an assumed child count — so every
 * flat token is accounted for and the grid is never left empty.
 *
 * SINGLE RESPONSIBILITY (L28/C18): the flat content also carries a trailing
 * AI-search band and a full site footer (link columns, social, wordmark). Those
 * are separate sections / footer chrome Milo provides via federated fragments, so
 * this block renders ONLY the plans section and stops at "Compare Plans".
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is THREE
// hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-plans-that-work-for-you';
const P = 'ptw';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The rebuild
// discards that wrapper, so copy any present marker onto the block root FIRST so a
// later Target/MEP swap still resolves (C11).
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

/** Small tag helper — uses textContent (never innerHTML) so text is never parsed as markup. */
function h(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

/**
 * Flatten the block into an ordered token list. Handles BOTH shapes DA can emit:
 * per-line <p>/<h*> leaf elements AND bare text nodes (a multi-line text node is
 * split back into one token per line). Whitespace-only nodes are dropped.
 */
function collectTokens(root) {
  const out = [];
  const pushText = (raw, tag) => {
    String(raw).split('\n').forEach((line) => {
      const t = line.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
      if (t) out.push({ text: t, tag });
    });
  };
  const walk = (node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) pushText(child.textContent, node.nodeName);
      else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.children.length) walk(child);
        else pushText(child.textContent, child.nodeName);
      }
    });
  };
  walk(root);
  return out;
}

const isSecure = (t) => /^secure transaction/i.test(t);
const isCompare = (t) => /^compare plans/i.test(t);
const isFeatureHead = (t) => /^(core pdf tools|ai assistant|creation tools)$/i.test(t)
  || /^\d+\+\s*pdf tools$/i.test(t);
const isAiHead = (t) => /^ai assistant$/i.test(t);
const isFreePrice = (t) => /^free$/i.test(t || '');
const isDarkTag = (t) => /^best value$/i.test(t || '');

/** Build one plan card from its ordered field slice + feature tokens. */
function buildCard(fields, features) {
  const [tag, name, desc, price, priceSub, cta] = fields;
  const dark = isDarkTag(tag);
  const card = h('article', `${P}__card${dark ? ` ${P}__card--dark` : ''}`);

  const head = h('div', `${P}__card-head`);
  const tagRow = h('div', `${P}__tag-row`);
  tagRow.append(h('span', `${P}__tag-icon`), h('span', `${P}__tag`, tag || ''));
  head.append(tagRow);

  const info = h('div', `${P}__info`);
  info.append(h('h3', `${P}__name`, name || ''));
  if (desc) info.append(h('p', `${P}__desc`, desc));
  head.append(info);

  const priceWrap = h('div', `${P}__price-wrap`);
  const priceBlock = h('div', `${P}__price-block`);
  if (price) priceBlock.append(h('div', `${P}__price`, price));
  if (priceSub) priceBlock.append(h('div', `${P}__price-sub`, priceSub));
  priceWrap.append(priceBlock);
  if (cta) {
    const outline = isFreePrice(price);
    const ctaWrap = h('div', `${P}__cta`);
    const btn = h('button', `${P}__btn ${P}__btn--${outline ? 'outline' : 'solid'}`, cta);
    btn.type = 'button';
    ctaWrap.append(btn);
    priceWrap.append(ctaWrap);
  }
  head.append(priceWrap);

  const secure = h('div', `${P}__secure`);
  secure.append(h('span', `${P}__lock`), h('span', `${P}__secure-text`, 'Secure transaction'));
  head.append(secure);
  card.append(head);

  const feat = h('div', `${P}__features`);
  let group = null;
  features.forEach((tok) => {
    if (isFeatureHead(tok.text)) {
      group = h('div', `${P}__fgroup`);
      const fhead = h('div', `${P}__fhead`);
      fhead.append(
        h('span', `${P}__ficon${isAiHead(tok.text) ? ` ${P}__ficon--ai` : ''}`),
        h('span', `${P}__flabel`, tok.text),
      );
      group.append(fhead);
      feat.append(group);
    } else {
      if (!group) { group = h('div', `${P}__fgroup`); feat.append(group); }
      group.append(h('div', `${P}__fitem`, tok.text));
    }
  });
  if (feat.children.length) card.append(feat);
  return card;
}

/** Chevron nav button (visual carousel affordance from the comp). */
function navButton(dir) {
  const btn = h('button', `${P}__nav ${P}__nav--${dir}`);
  btn.type = 'button';
  btn.setAttribute('aria-label', dir === 'prev' ? 'Previous plans' : 'Next plans');
  return btn;
}

export default async function init(el) {
  if (!el) return;
  try {
    const daaLh = BLOCK;
    el.setAttribute('daa-lh', daaLh);
    const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div') || el;
    preserveMepAttrs(cell.parentElement || cell, el);

    const tokens = collectTokens(el);
    if (!tokens.length) { el.dataset.forgeAuthored = BLOCK; return; }

    // Title = first heading (fallback: first token).
    let titleIdx = tokens.findIndex((t) => /^H[1-6]$/.test(t.tag));
    if (titleIdx < 0) titleIdx = 0;
    const titleText = tokens[titleIdx].text;

    // Everything after the title, bounded to the plans section (stop at Compare Plans).
    const body = tokens.slice(titleIdx + 1);
    const compareIdx = body.findIndex((t) => isCompare(t.text));
    const region = compareIdx >= 0 ? body.slice(0, compareIdx) : body;
    const compareText = compareIdx >= 0 ? body[compareIdx].text : 'Compare Plans';

    // Card anchor: "Secure transaction" appears once per card, preceded by a fixed
    // 6-field preamble [tag, name, desc, price, priceSub, cta]. Robust to card count.
    const secureIdxs = [];
    region.forEach((t, i) => { if (isSecure(t.text)) secureIdxs.push(i); });
    const cardStarts = secureIdxs.map((s) => Math.max(0, s - 6));
    const firstStart = cardStarts.length ? cardStarts[0] : region.length;

    // ---- Reconstruct ----
    const inner = h('div', `${P}__inner`);
    const header = h('div', `${P}__header`);
    header.append(h('h2', `${P}__title`, titleText));
    inner.append(header);

    // Tabs = tokens between the title and the first card. First is the active view.
    const tabTokens = region.slice(0, firstStart).filter((t) => t.text);
    if (tabTokens.length) {
      const tabs = h('div', `${P}__tabs`);
      tabs.setAttribute('role', 'tablist');
      tabTokens.forEach((t, i) => {
        const btn = h('button', `${P}__tab${i === 0 ? ' active' : ''}`, t.text);
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.addEventListener('click', () => {
          tabs.querySelectorAll(`.${P}__tab`).forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
        });
        tabs.append(btn);
      });
      inner.append(tabs);
    }

    // Cards — every card accounted for; features sliced up to the next card start.
    if (secureIdxs.length) {
      const cards = h('div', `${P}__cards`);
      secureIdxs.forEach((s, idx) => {
        const start = cardStarts[idx];
        const fields = region.slice(start, s).map((t) => t.text); // tag..cta (6)
        const featEnd = idx + 1 < cardStarts.length ? cardStarts[idx + 1] : region.length;
        const features = region.slice(s + 1, featEnd);
        cards.append(buildCard(fields, features));
      });
      inner.append(cards);
    }

    // Compare + nav row.
    const compareRow = h('div', `${P}__compare`);
    const compareBtn = h('button', `${P}__compare-btn`, compareText);
    compareBtn.type = 'button';
    compareRow.append(compareBtn, navButton('prev'), navButton('next'));
    inner.append(compareRow);

    // Single mount — never innerHTML-wipe authored DOM (C3/L2).
    el.replaceChildren(inner);

    // Milo text service on the title header only (promotes the h2; leaves the
    // custom card DOM untouched) — wrapped for per-viewport consistency (C5/C14).
    const runDecorate = () => decorateBlockText(header);
    try {
      if (typeof decorateViewportContent === 'function') decorateViewportContent(el, runDecorate);
      else runDecorate();
    } catch (e) {
      window.lana?.log?.(`${BLOCK} text decorate skipped: ${e.message}`);
    }

    // Deterministic analytics floor (C7): daa-ll on every button the rebuild made.
    let n = 0;
    el.querySelectorAll('button, a').forEach((node) => {
      if (node.hasAttribute('daa-ll')) return;
      n += 1;
      const label = (node.textContent || node.getAttribute('aria-label') || `item-${n}`)
        .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        .slice(0, 40);
      node.setAttribute('daa-ll', `${daaLh}|${label || `item-${n}`}`);
    });

    el.dataset.forgeAuthored = BLOCK;
  } catch (e) {
    window.lana?.log?.(`${BLOCK} init failed: ${e.message}`);
    el.dataset.forgeAuthored = BLOCK;
  }
}
