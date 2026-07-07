/**
 * forge-grid-section — a distinctive Milo C2 "brand collage" masonry section.
 *
 * DA serializes the block as a FLAT, class-less run of headings / paragraphs /
 * lists in document order (see mocks/body.html). The rich column/card structure
 * the Figma frame shows is GONE at runtime, so init() PROBES the flat content by
 * shape (never by an authored class or a fixed child index), groups the run into
 * the seven document-mockup cards it encodes, then RECONSTRUCTS a staggered
 * 5-column masonry — building every tile with createTag + classList.add and its
 * own `.forge-grid-section`-scoped classes. The scoped CSS keys ONLY on those
 * stamped classes. Decorative photo tiles (aria-hidden gradient placeholders)
 * are interleaved to reproduce the collage density; they carry no content.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils is THREE hops up
// (blocks -> c2 -> libs). Decorate services come ONLY from utils/decorate.js.
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-grid-section';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so lift any present marker onto the block root FIRST.
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

const txt = (n) => (n?.textContent || '').replace(/\s+/g, ' ').trim();
// Text of the first node in the group whose text matches re, else ''.
const pick = (g, re) => { const n = g.nodes.find((x) => re.test(txt(x))); return n ? txt(n) : ''; };
const bars = (n) => Array.from({ length: n }, () => '<span class="fgs-bar"></span>').join('');

// Ordered card signatures. Each `match` fires on the FIRST flat node that opens
// that card; subsequent nodes accrue to the open card until the next opens — so
// every flat child lands in exactly one group and no node is discarded.
const SPECS = [
  { type: 'survey', match: (t) => /survey result/i.test(t) },
  { type: 'pipeline', match: (t) => /pipeline generation/i.test(t) },
  { type: 'sign', match: (t) => /^sign$/i.test(t) },
  { type: 'invoice', match: (t) => /murphy design co/i.test(t) },
  { type: 'benefits', match: (t) => /benefits overview/i.test(t) },
  { type: 'msa', match: (t) => /murphyslaw|master service agreement/i.test(t) },
  { type: 'cert', match: (t) => /certification|part 3|enter password/i.test(t) },
];

function groupCards(nodes) {
  const groups = [];
  let idx = -1;
  for (const node of nodes) {
    const t = txt(node);
    const next = SPECS[idx + 1];
    if (next && next.match(t)) { idx += 1; groups.push({ type: next.type, nodes: [] }); }
    if (idx < 0) { idx = 0; groups.push({ type: SPECS[0].type, nodes: [] }); }
    groups[groups.length - 1].nodes.push(node);
  }
  return groups;
}

// ---- Card builders (each returns a scoped tile element) --------------------
const BUILDERS = {
  survey(g) {
    const eyebrow = txt(g.nodes[0]) || 'Employee Survey Result';
    const pct = pick(g, /%/) || '46%';
    const cap = pick(g, /\b(said|company|years)\b/i) || txt(g.nodes[g.nodes.length - 1]);
    return createTag('div', { class: 'fgs-card fgs-survey' }, `
      <div class="fgs-survey-top"><span class="fgs-mark" aria-hidden="true">✦</span><span class="fgs-eyebrow">${eyebrow}</span></div>
      <div class="fgs-ring"><span class="fgs-ring-track" aria-hidden="true"></span><span class="fgs-pct">${pct}</span></div>
      <p class="fgs-cap">${cap}</p>`);
  },
  pipeline(g) {
    const title = pick(g, /pipeline/i) || 'Pipeline Generation';
    const pct = pick(g, /%/) || '23%';
    const sub = pick(g, /increase|june|sep/i) || '';
    return createTag('div', { class: 'fgs-card fgs-pipeline' }, `
      <span class="fgs-mark" aria-hidden="true">▲</span>
      <h2 class="fgs-pipe-title">${title}</h2>
      <div class="fgs-pipe-big"><span class="fgs-arrow" aria-hidden="true">↑</span><span>${pct}</span></div>
      <p class="fgs-pipe-sub">${sub}</p>`);
  },
  sign(g) {
    const label = pick(g, /signature/i) || 'Signature';
    return createTag('div', { class: 'fgs-card fgs-sign' }, `
      <span class="fgs-sign-flag" aria-hidden="true"><span>Sign</span></span>
      <span class="fgs-sign-scribble" aria-hidden="true"></span>
      <span class="fgs-sign-line" aria-hidden="true"></span>
      <span class="fgs-sign-label">${label}</span>`);
  },
  invoice(g) {
    const co = pick(g, /murphy design/i) || 'MURPHY DESIGN CO.';
    const total = pick(g, /\$/) || '$70,150';
    return createTag('div', { class: 'fgs-card fgs-invoice' }, `
      <div class="fgs-inv-tab" aria-hidden="true">INVOICE</div>
      <div class="fgs-inv-paper">
        <p class="fgs-inv-co">${co}</p>
        <div class="fgs-inv-rows" aria-hidden="true">${bars(6)}</div>
        <div class="fgs-inv-total">${total}</div>
        <div class="fgs-inv-foot">INVOICE</div>
      </div>`);
  },
  benefits(g) {
    const title = pick(g, /benefits overview/i) || 'Benefits Overview 2025';
    const team = pick(g, /people team/i) || 'People Team';
    const ftitle = pick(g, /plans comparison/i) || 'Plans Comparison';
    const card = createTag('div', { class: 'fgs-card fgs-benefits' }, `
      <div class="fgs-ben-body">
        <h3 class="fgs-ben-title">${title}</h3>
        <span class="fgs-ben-team">${team}</span>
      </div>
      <div class="fgs-ben-foot"><span class="fgs-ben-eyebrow">${title}</span><span class="fgs-ben-ftitle">${ftitle}</span></div>`);
    // Preserve the authored ordered list verbatim (real content, not a rebuild).
    const ol = g.nodes.find((n) => n.tagName === 'OL');
    if (ol) { ol.classList.add('fgs-ben-list'); card.querySelector('.fgs-ben-body').appendChild(ol); }
    return card;
  },
  msa(g) {
    const brand = pick(g, /murphyslaw/i) || 'MURPHYSLAW.COM';
    const title = pick(g, /master service/i) || 'MASTER SERVICE AGREEMENT';
    const card = createTag('div', { class: 'fgs-card fgs-msa' }, `
      <div class="fgs-msa-paper">
        <div class="fgs-msa-head"><span class="fgs-mark" aria-hidden="true">✦</span><span class="fgs-msa-brand">${brand}</span></div>
        <h2 class="fgs-msa-title">${title}</h2>
        <div class="fgs-msa-prep">
          <div><span class="fgs-msa-cap">PREPARED FOR</span><span class="fgs-bars" aria-hidden="true">${bars(3)}</span></div>
          <div><span class="fgs-msa-cap">PREPARED BY</span><span class="fgs-bars" aria-hidden="true">${bars(3)}</span></div>
        </div>
        <div class="fgs-msa-secs"></div>
      </div>`);
    // Move the authored numbered clauses (1., 2., 2.1 …) into the sections slot.
    const secs = card.querySelector('.fgs-msa-secs');
    g.nodes.filter((n) => /^\d+(\.\d+)*[.\s]/.test(txt(n))).forEach((n) => {
      n.classList.add(/^\d+\.\s*[A-Za-z]/.test(txt(n)) ? 'fgs-msa-h' : 'fgs-msa-sub');
      secs.appendChild(n);
    });
    return card;
  },
  cert(g) {
    const h1 = pick(g, /certification|part 3/i) || 'Part 3  Certification';
    const h2 = pick(g, /counterparts/i) || 'Counterparts';
    const ph = pick(g, /password/i) || 'Enter Password';
    const card = createTag('div', { class: 'fgs-card fgs-cert' }, `
      <div class="fgs-cert-faded" aria-hidden="true">
        <p class="fgs-cert-h">${h1}</p>${bars(3)}
        <p class="fgs-cert-h">${h2}</p>${bars(2)}
      </div>
      <div class="fgs-cert-input">
        <span class="fgs-lock" aria-hidden="true">🔒</span>
        <span class="fgs-cert-ph">${ph}</span>
      </div>`);
    const go = createTag('button', { type: 'button', class: 'fgs-cert-go', 'aria-label': 'Unlock', 'daa-ll': 'unlock' }, '→');
    card.querySelector('.fgs-cert-input').appendChild(go);
    return card;
  },
};

function buildCard(group) {
  const build = BUILDERS[group.type];
  if (build) return build(group);
  // Unknown group — never discard: emit its nodes inside a generic tile.
  const tile = createTag('div', { class: 'fgs-card fgs-generic' });
  group.nodes.forEach((n) => tile.appendChild(n));
  return tile;
}

const photo = (mod) => createTag('div', { class: `fgs-photo fgs-${mod}`, 'aria-hidden': 'true' });

// Design column order (from the Figma frame): content cards interleaved with
// decorative photo tiles. Photos are placeholders and gate on nothing.
const LAYOUT = [
  ['survey', 'p:couch', 'pipeline'],
  ['p:report', 'sign', 'p:team'],
  ['p:orange', 'invoice'],
  ['benefits', 'p:desk', 'msa'],
  ['p:maroon', 'cert', 'p:coffee'],
];

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Un-wrap the EDS row/cell so we probe the raw content run; lift MEP markers.
  const inner = el.querySelector(':scope > div > div');
  if (inner) preserveMepAttrs(inner.parentElement, el);
  const source = inner || el;
  const nodes = [...source.children].filter((n) => n.nodeType === 1);

  const cards = new Map();
  groupCards(nodes).forEach((g) => { if (!cards.has(g.type)) cards.set(g.type, buildCard(g)); });

  const canvas = createTag('div', { class: 'fgs-canvas' });
  const masonry = createTag('div', { class: 'fgs-masonry' }, '', { parent: canvas });

  let placed = 0;
  LAYOUT.forEach((items, i) => {
    const col = createTag('div', { class: `fgs-col fgs-col-${i + 1}` });
    items.forEach((item) => {
      if (item.startsWith('p:')) { col.appendChild(photo(item.slice(2))); return; }
      const card = cards.get(item);
      if (card) { col.appendChild(card); placed += 1; }
    });
    if (col.children.length) masonry.appendChild(col);
  });

  // Defensive fallback: if probing found no known cards, never render an empty
  // grid — drop every source node into a single column so content survives.
  if (placed === 0 && nodes.length) {
    const col = createTag('div', { class: 'fgs-col fgs-col-1' });
    nodes.forEach((n) => col.appendChild(n));
    masonry.appendChild(col);
  }

  const band = createTag('div', { class: 'fgs-band', 'aria-hidden': 'true' });
  el.replaceChildren(band, canvas);

  // Run Milo's text decorator so headings/copy pick up C2 typography + a11y wiring.
  decorateBlockText(el);

  el.dataset.forgeAuthored = BLOCK;
}
