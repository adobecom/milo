/**
 * forge-section-3 — a distinctive Milo C2 section block authored by Forge
 * (build-block-from-figma). The section is a decorative COLLAGE of five rotated,
 * overlapping "business document" cards over a light-grey stage: an Industry
 * Report (with a scatter chart), a black White-Paper cover, a plum Growth /
 * "Monthly User Acquisition" card, a blue Invoice, and a front-most teal
 * Media-Mix treemap card.
 *
 * DA serializes a block's authored content as a FLAT, class-LESS run of
 * <h2>/<h3>/<p>/<picture> in document order — NO grid/row/tile wrappers, and
 * NONE of the Figma structural classes survive to runtime (checklist C24). So
 * init() PROBES the flat content by TEXT/shape (never by an authored class or a
 * fixed child index — C2) and RECONSTRUCTS the collage: it walks the flat run,
 * splits it into five content clusters at known anchor strings, wraps each in a
 * card it builds with createElement + classList, and stamps its OWN
 * .forge-section-3-scoped classes that the co-located scoped stylesheet keys on.
 * Every flat node is accounted for (nothing dropped), then a single
 * el.replaceChildren swaps in the rebuilt collage (never an innerHTML wipe — C3).
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/decorate.js is THREE
// hops up (blocks -> c2 -> libs). The 3-hop '../../../' form is CORRECT (L30).
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-section-3';
const c = (suffix) => `${BLOCK}-${suffix}`;

// MEP / personalization markers Milo can stamp on the row/cell wrapper we
// discard when we rebuild — copy any present marker up onto the block root so a
// later Target/MEP swap still finds them (C11).
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

function tag(name, cls) {
  const node = document.createElement(name);
  if (cls) node.className = cls;
  return node;
}

const txt = (n) => (n?.textContent || '').replace(/\s+/g, ' ').trim();
const isMediaNode = (n) => !!n && (n.matches?.('picture, img')
  || (!txt(n) && !!n.querySelector?.('img, picture')));
const isHeadingNode = (n) => !!n && (/^h[1-6]$/i.test(n.tagName)
  || !!n.querySelector?.('h1, h2, h3, h4, h5, h6'));
const isEyebrow = (n) => {
  const t = txt(n);
  return !!t && t.length <= 16 && /[A-Z]/.test(t) && t === t.toUpperCase();
};

// The five cards, in flat-content order. Each is anchored by a stable text
// marker that opens the cluster; matching is by TEXT (tag-agnostic) so it is
// robust to however DA tagged the node (C2 — probe by shape, not class/index).
const CARD_DEFS = [
  { key: 'report', match: (t) => /marvard/i.test(t) },
  { key: 'whitepaper', match: (t) => /^white paper$/i.test(t) },
  { key: 'growth', match: (t) => /^growth$/i.test(t) },
  { key: 'invoice', match: (t) => /^info\b/i.test(t) || /^invoice$/i.test(t) },
  { key: 'media', match: (t) => /^media$/i.test(t) },
];

// Tag every <img> for analytics (C7) — these come from the authored DOM so we
// keep their loading/width/height (C4) and only add daa-im when missing.
function tagImgs(scope) {
  scope.querySelectorAll?.('img').forEach((img, i) => {
    if (!img.hasAttribute('daa-im')) {
      img.setAttribute('daa-im', (img.getAttribute('alt') || `image-${i + 1}`).slice(0, 40));
    }
  });
}

// Additively stamp a Milo-semantic role class onto each node of a cluster so the
// scoped CSS has a stable hook, then move it into the card (document order kept).
function fillCard(card, nodes) {
  nodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    if (isMediaNode(n)) { n.classList.add(c('media')); tagImgs(n); }
    else if (isHeadingNode(n)) n.classList.add(c('title'));
    else if (isEyebrow(n)) n.classList.add(c('eyebrow'));
    else n.classList.add(c('copy'));
    card.append(n);
  });
}

// Turn the first two eyebrow nodes of a card into a tab pair (active + outline)
// — the "GROWTH / MAU" and "MEDIA / Q3 MIX" toggles in the design.
function buildTabs(card) {
  const eyebrows = [...card.querySelectorAll(`.${c('eyebrow')}`)].slice(0, 2);
  if (eyebrows.length < 2) return;
  const row = tag('div', c('tabs'));
  card.insertBefore(row, card.firstChild);
  eyebrows.forEach((e, i) => {
    e.classList.remove(c('eyebrow'));
    e.classList.add(c('tab'), i === 0 ? c('tab--active') : c('tab--ghost'));
    row.append(e);
  });
}

// Card-specific refinements applied after the generic stamping.
function refineCard(key, card) {
  if (key === 'growth' || key === 'media') buildTabs(card);

  if (key === 'growth') {
    // The first media in this cluster is the stray "photo behind invoice"
    // rectangle that flat order parks here; keep it in the DOM (nothing dropped)
    // but flag it as a decorative backer the CSS hides so it never renders as a
    // random photo inside the growth card. The real chart-line media stays.
    const media = [...card.querySelectorAll(`.${c('media')}`)];
    if (media.length > 1) media[0].classList.add(c('media--bg'));
  }

  if (key === 'media') {
    // Reconstruct the treemap: the "Digital 56%" / "OOH 18%" / ... labels become
    // proportional stacked cells (index-keyed so the CSS colours each band).
    // Match by TEXT (contains a %), not by role class — the all-caps labels
    // ("OOH 18%", "CTV 9%") get stamped as eyebrow, the mixed-case ones as copy,
    // so both roles must be considered or bands go missing.
    const cells = [...card.querySelectorAll(`.${c('copy')}, .${c('eyebrow')}`)]
      .filter((n) => /\d\s*%/.test(txt(n)));
    if (cells.length) {
      const tree = tag('div', c('treemap'));
      cells.forEach((cell, i) => {
        cell.classList.remove(c('copy'), c('eyebrow'));
        cell.classList.add(c('cell'));
        cell.dataset.cell = String(i);
        tree.append(cell);
      });
      card.append(tree);
    }
  }

  if (key === 'report') {
    // Group the run of chart-marker pictures into one chart strip so the CSS can
    // lay them out as a scatter row rather than a full-height image stack (C24).
    const media = [...card.querySelectorAll(`.${c('media')}`)];
    if (media.length > 2) {
      const chart = tag('div', c('chart'));
      media[0].before(chart);
      media.forEach((m) => chart.append(m));
    }
  }

  if (key === 'invoice') {
    // Promote the big "INVOICE" / firm-name lines from eyebrow to headline size.
    card.querySelectorAll(`.${c('eyebrow')}`).forEach((n) => {
      if (/^invoice$/i.test(txt(n)) || /murphy design co/i.test(txt(n))) {
        n.classList.remove(c('eyebrow'));
        n.classList.add(c('title'));
      }
    });
  }
}

export default async function init(el) {
  if (!el) return;
  try {
    el.setAttribute('daa-lh', BLOCK);

    // Lift MEP markers off the immediate content wrapper(s) before we rebuild.
    const row = el.querySelector(':scope > div');
    const cell = el.querySelector(':scope > div > div');
    preserveMepAttrs(cell, el);
    preserveMepAttrs(row, el);

    // The flat DA run lives in whichever nesting level actually holds it — for a
    // single-cell block that is el > div > div, but pick by child count so a
    // el > div layout is handled too (robust, not positional — C2).
    const wrapper = [cell, row, el].filter(Boolean).reduce(
      (best, cur) => ((cur.children?.length || 0) > (best?.children?.length || 0) ? cur : best),
      el,
    );

    // The flat DA run (element children of the innermost content wrapper).
    const nodes = [...wrapper.children].filter((n) => n.nodeType === 1);
    if (!nodes.length) return;

    // Find each card's anchor node (searching forward, in order).
    const anchorIdx = {};
    let from = 0;
    CARD_DEFS.forEach((def) => {
      for (let i = from; i < nodes.length; i += 1) {
        const t = txt(nodes[i]);
        if (t && def.match(t)) { anchorIdx[def.key] = i; from = i + 1; break; }
      }
    });
    const present = CARD_DEFS.filter((d) => anchorIdx[d.key] != null);
    if (!present.length) return;

    // Cluster start indices. A card may absorb the single media node that
    // immediately precedes its anchor (the White-Paper cover picture, the photo
    // that leads the growth cluster) so lead-in media travel with their card.
    const starts = present.map((d, i) => {
      let start = anchorIdx[d.key];
      const prevStart = i > 0 ? anchorIdx[present[i - 1].key] : -1;
      if (start - 1 > prevStart && isMediaNode(nodes[start - 1])) start -= 1;
      return start;
    });
    starts[0] = 0; // first card owns any lead-in nodes

    const collage = tag('div', c('collage'));
    present.forEach((d, i) => {
      const end = i + 1 < starts.length ? starts[i + 1] : nodes.length;
      const cluster = nodes.slice(starts[i], end);
      const card = tag('div', `${c('card')} ${c(`card--${d.key}`)}`);
      fillCard(card, cluster);
      refineCard(d.key, card);
      if (card.childElementCount) collage.append(card);
    });

    if (!collage.childElementCount) return;

    // One structural swap — never innerHTML-wipe the block (C3).
    el.replaceChildren(collage);

    // Promote text via Milo's own service (additive typography); our scoped
    // rules are all prefixed with the block root so they still win.
    try { decorateBlockText(collage); } catch (e) { /* non-fatal */ }

    el.dataset.forgeAuthored = BLOCK;
  } catch (e) {
    window.lana?.log?.(`${BLOCK} init failed: ${e?.message || e}`);
  }
}
