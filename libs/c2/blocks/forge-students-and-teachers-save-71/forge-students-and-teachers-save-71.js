/**
 * forge-students-and-teachers-save-71 — Milo C2 hero for the Education slide
 * ("Students and teachers save 71%.").
 *
 * DA serializes a block's content as a FLAT, class-less cell: a run of bare text
 * nodes ("Education", "Free trial", the category labels), <h2>, <p> and <picture>
 * in document order — the authored .s3-* grid/tile classes DO NOT exist at runtime.
 * The desktop + mobile subtrees are BOTH serialized, so the same heading / body /
 * CTAs / tab labels appear twice, plus a "Sign In" nav-chrome token and a trailing
 * "Optimized Workflows" trio. So init() probes by CONTENT SHAPE (never by class),
 * de-dupes repeats, drops nav chrome, and RECONSTRUCTS the hero: full-bleed
 * background + scrim, a copy column (eyebrow / h2 / body / CTAs) and a category
 * tab router, followed by an optional white "Optimized Workflows" band.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// THREE hops up (libs/c2/blocks/<name>/ -> libs): blocks -> c2 -> libs.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-students-and-teachers-save-71';
const TAB_LABELS = [
  'Creativity and design',
  'Content creation',
  'PDF and productivity',
  'Adobe for Business',
  'Students and teachers',
];
const ACTIVE_TAB = 'Students and teachers';
const DROP = new Set(['Sign In']);
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];

function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((a) => {
    const v = from.getAttribute?.(a);
    if (v != null) to.setAttribute(a, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

const slug = (t) => String(t || '').trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

function mk(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

const norm = (node) => (node.textContent || '').replace(/\s+/g, ' ').trim();

// One bare label line -> the right bucket. CTAs and tab labels arrive as bare
// text; adjacent lines with no element between them collapse into a SINGLE text
// node, so callers split on newlines and classify each line here.
function classifyLabel(parts, ctaSeen, t) {
  if (!t || DROP.has(t)) return; // whitespace / nav chrome ("Sign In")
  if (TAB_LABELS.includes(t)) {
    if (!parts.tabs.includes(t)) parts.tabs.push(t);
    return;
  }
  if (!parts.heading) { parts.eyebrow = t; return; } // label before the heading
  if (t === parts.eyebrow) return; // duplicated eyebrow from the mobile subtree
  if (!ctaSeen.has(t)) { parts.ctas.push(t); ctaSeen.add(t); } // hero CTA
}

// Walk the flat DA cell and bucket each node by CONTENT SHAPE (never by class).
// First-wins + a seen-set drops the duplicated desktop/mobile serialization.
function parseContent(container) {
  const parts = {
    bg: null, eyebrow: '', heading: null, body: null,
    ctas: [], tabs: [], subtitle: null, subhead: null, subdesc: null,
  };
  const ctaSeen = new Set();
  [...container.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Consecutive bare lines are ONE text node — split so each label is seen.
      node.textContent.split('\n')
        .forEach((line) => classifyLabel(parts, ctaSeen, line.replace(/\s+/g, ' ').trim()));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('picture, img') || node.querySelector?.('picture, img')) {
      if (!parts.bg) parts.bg = node; // first picture is the hero background
      return;
    }
    const tag = node.tagName;
    if (tag === 'H1' || tag === 'H2') {
      if (!parts.heading) parts.heading = node;
      return;
    }
    if (tag === 'H3') {
      if (!parts.subhead) parts.subhead = node;
      return;
    }
    if (tag === 'P') {
      const t = norm(node);
      if (/^optimized workflows$/i.test(t)) { if (!parts.subtitle) parts.subtitle = node; return; }
      if (parts.subhead && !parts.subdesc) { parts.subdesc = node; return; }
      if (!parts.body) parts.body = node;
    }
  });
  return parts;
}

function buildTab(label) {
  const active = label === ACTIVE_TAB;
  const tab = mk('button', `s2t-tab${active ? ' s2t-tab--active' : ''}`);
  tab.type = 'button';
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-selected', active ? 'true' : 'false');
  tab.setAttribute('daa-ll', `tab-${slug(label)}`);
  const icon = mk('span', 's2t-tab-icon');
  icon.setAttribute('aria-hidden', 'true');
  const chev = mk('span', 's2t-tab-chevron');
  chev.setAttribute('aria-hidden', 'true');
  tab.append(icon, mk('span', 's2t-tab-lbl', label), chev);
  return tab;
}

function buildHero(parts) {
  const hero = mk('div', 's2t-hero');

  if (parts.bg) {
    const bg = mk('div', 's2t-bg');
    const img = parts.bg.matches?.('img') ? parts.bg : parts.bg.querySelector('img');
    if (img) {
      img.setAttribute('loading', img.getAttribute('loading') || 'eager');
      img.setAttribute('daa-im', `${BLOCK}|background`);
    }
    bg.appendChild(parts.bg);
    hero.appendChild(bg);
  }
  hero.appendChild(mk('div', 's2t-scrim'));

  const frame = mk('div', 's2t-frame');
  const copy = mk('div', 's2t-copy');
  if (parts.eyebrow) copy.appendChild(mk('span', 's2t-eyebrow eyebrow', parts.eyebrow));
  if (parts.heading) { parts.heading.classList.add('s2t-heading'); copy.appendChild(parts.heading); }
  if (parts.body) { parts.body.classList.add('s2t-body'); copy.appendChild(parts.body); }
  if (parts.ctas.length) {
    const ctas = mk('div', 's2t-ctas');
    parts.ctas.slice(0, 2).forEach((label, i) => {
      const btn = mk('button', `s2t-cta ${i === 0 ? 's2t-cta--fill' : 's2t-cta--outline'} con-button`, label);
      btn.type = 'button';
      btn.setAttribute('daa-ll', slug(label));
      ctas.appendChild(btn);
    });
    copy.appendChild(ctas);
  }
  frame.appendChild(copy);

  if (parts.tabs.length) {
    const router = mk('div', 's2t-router');
    const tabs = mk('div', 's2t-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Browse categories');
    parts.tabs.forEach((label) => tabs.appendChild(buildTab(label)));
    router.appendChild(tabs);
    const play = mk('button', 's2t-play');
    play.type = 'button';
    play.setAttribute('aria-label', 'Pause slideshow');
    play.setAttribute('daa-ll', 'pause-slideshow');
    router.appendChild(play);
    frame.appendChild(router);
  }
  hero.appendChild(frame);
  return { hero, copy };
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Un-wrap: the single content cell (block > row > cell) holds the flat content.
  const cell = el.querySelector(':scope > div > div');
  if (cell) preserveMepAttrs(cell.parentElement, el);
  const container = cell || el;

  const parts = parseContent(container);
  const { hero, copy } = buildHero(parts);

  // Build the full rebuilt tree, then swap it in ONCE (never wipe via innerHTML).
  const rebuilt = document.createDocumentFragment();
  rebuilt.appendChild(hero);

  if (parts.subtitle || parts.subhead || parts.subdesc) {
    const band = mk('div', 's2t-below');
    if (parts.subtitle) { parts.subtitle.classList.add('s2t-below-eyebrow'); band.appendChild(parts.subtitle); }
    if (parts.subhead) { parts.subhead.classList.add('s2t-below-head'); band.appendChild(parts.subhead); }
    if (parts.subdesc) { parts.subdesc.classList.add('s2t-below-desc'); band.appendChild(parts.subdesc); }
    rebuilt.appendChild(band);
  }

  el.replaceChildren(rebuilt);

  // Milo typography service over the copy column (real decorator, not a shim).
  try { decorateBlockText(copy); } catch (e) { window.lana?.log?.(`${BLOCK} decorateBlockText: ${e}`); }

  el.dataset.forgeAuthored = BLOCK;
}
