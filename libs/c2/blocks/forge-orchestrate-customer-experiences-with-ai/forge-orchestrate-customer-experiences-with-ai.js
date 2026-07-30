/**
 * forge-orchestrate-customer-experiences-with-ai — a Milo C2 hero block.
 *
 * DA serializes this section's authored table as a FLAT, class-LESS run of
 * <picture>/<h2>/<p> ELEMENTS interleaved with BARE TEXT NODES (the CTA and
 * category-tab labels are loose text, not tags), and it carries BOTH a desktop
 * and a mobile copy of the hero plus a trailing "Optimized Workflows" caption.
 * None of section.html's structural classes (.s2-hero/.s2-card/…) survive to
 * runtime — so init() cannot key on them. Instead it PROBES the content by
 * shape + document order, DEDUPES the desktop/mobile repeats, and RECONSTRUCTS
 * the rich hero (background + scrim + copy + pill CTAs + a router row of
 * category tab-cards + a mobile caption) with createElement, stamping its own
 * scoped classes that the co-located stylesheet targets. Authored element nodes
 * (pictures, headings, paragraphs) are MOVED (never re-serialized) so their
 * attributes — srcset/sizes/loading/width/height and MEP markers — survive.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). Keep the 3-hop '../../../' specifier.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-orchestrate-customer-experiences-with-ai';

// Nodes we treat as content "leaves" when flattening — everything else (bare
// wrapper <div>s EDS injects) is descended into so we reach the real content.
const LEAF = new Set(['PICTURE', 'IMG', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BUTTON', 'UL', 'OL']);

const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const slug = (s) => norm(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

function ce(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => v != null && node.setAttribute(k, v));
  return node;
}

// MEP / personalization markers: copy from the discarded wrapper up onto the
// block root BEFORE the rebuild so Target/MEP still resolves the section.
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  ['data-manifest-id', 'data-adobe-target-testid'].forEach((a) => {
    const v = from.getAttribute?.(a);
    if (v != null) to.setAttribute(a, v);
  });
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

// Flatten the block to an ordered token stream. Element leaves become
// {type:'picture'|'h2'|'p'|'a'|…, el, text}; loose text nodes become one
// {type:'text'} token PER non-empty LINE. That per-line split matters: DA emits
// the CTA labels and the five category-tab labels as loose newline-separated
// text, which the HTML parser collapses into a SINGLE text node per run
// ("It starts with Adobe\nSee plans", "Content creation\nPDF…\nAdobe…\nStudents…").
// Splitting on the newline recovers the one-item-per-line structure the design
// encodes — without it every run would fold into a single mega-label.
function collectTokens(root) {
  const out = [];
  (function walk(node) {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/\r?\n/).forEach((line) => {
          const text = norm(line);
          if (text) out.push({ type: 'text', text });
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (LEAF.has(child.tagName)) {
          out.push({ type: child.tagName.toLowerCase(), el: child, text: norm(child.textContent) });
        } else {
          walk(child);
        }
      }
    });
  }(root));
  return out;
}

const isHeading = (t) => t && /^h[1-6]$/.test(t.type);
const isCopy = (t) => t && (t.type === 'text' || t.type === 'p');
// An SVG chevron / pause glyph created without a network dependency.
function svg(markup, attrs) {
  const span = ce('span', 'forge-o-svg', attrs);
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = markup;
  return span;
}
const CHEVRON = '<svg width="4" height="8" viewBox="0 0 4 7" fill="none"><path d="M1 1.3 3 3.5 1 5.7" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PAUSE = '<svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><rect x="0" y="0" width="4" height="14" rx="1"/><rect x="7" y="0" width="4" height="14" rx="1"/></svg>';

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);
  el.dataset.forgeAuthored = BLOCK;

  try {
    const inner = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
    if (inner) preserveMepAttrs(inner.parentElement || inner, el);

    const tokens = collectTokens(el);
    const headingIdx = tokens.findIndex(isHeading);
    if (headingIdx < 0) return; // nothing hero-shaped; leave authored DOM intact.

    // --- Hero copy: eyebrow (before heading), heading, description (after) ---
    const headingTok = tokens[headingIdx];
    const eyebrowTok = isCopy(tokens[headingIdx - 1]) && tokens[headingIdx - 1].type !== 'picture'
      ? tokens[headingIdx - 1] : null;
    const descTok = isCopy(tokens[headingIdx + 1]) ? tokens[headingIdx + 1] : null;
    const eyebrowText = eyebrowTok ? eyebrowTok.text : '';

    // First picture = full-bleed background.
    const bgTok = tokens.find((t) => t.type === 'picture');

    // --- CTAs: text/links after the description, up to the first picture. ---
    const ctas = [];
    let i = descTok ? headingIdx + 2 : headingIdx + 1;
    for (; i < tokens.length; i += 1) {
      const t = tokens[i];
      if (t.type === 'picture' || isHeading(t) || t.type === 'p') break;
      if ((t.type === 'text' || t.type === 'a') && t.text) ctas.push(t);
    }

    // --- Tab cards: (optional leading icon pictures) + a bare-text label. ---
    // Boundary marker = a new label text; STOP at the first element-level
    // p/heading/a/button (that is where the mobile duplicate + caption begin).
    const cards = [];
    let pendingIcons = [];
    for (; i < tokens.length; i += 1) {
      const t = tokens[i];
      if (t.type === 'picture') { pendingIcons.push(t.el); continue; }
      if (t.type === 'text' && t.text) { cards.push({ icons: pendingIcons, label: t.text }); pendingIcons = []; continue; }
      break; // p / heading / a / button -> end of the tab run
    }

    // --- Caption (mobile-only "Optimized Workflows" panel): last sub-heading. ---
    let capTok = null;
    for (let j = tokens.length - 1; j > headingIdx; j -= 1) {
      if (/^h[2-6]$/.test(tokens[j].type) && tokens[j] !== headingTok) { capTok = tokens[j]; break; }
    }
    const capEyebrow = capTok && tokens[tokens.indexOf(capTok) - 1]?.type === 'p'
      ? tokens[tokens.indexOf(capTok) - 1] : null;
    const capDesc = capTok && tokens[tokens.indexOf(capTok) + 1]?.type === 'p'
      ? tokens[tokens.indexOf(capTok) + 1] : null;

    // ------------------------------------------------------------------ build
    const hero = ce('div', 'hero');

    const bg = ce('div', 'hero__bg');
    if (bgTok) {
      bg.appendChild(bgTok.el); // MOVE the picture (keeps srcset/sizes/loading).
      const img = bg.querySelector('img');
      if (img) { img.setAttribute('daa-im', `${BLOCK}|background`); if (!img.alt) img.alt = ''; }
    }
    hero.appendChild(bg);
    hero.appendChild(ce('div', 'hero__scrim'));

    const inner2 = ce('div', 'hero__inner');
    const copy = ce('div', 'hero__copy');
    if (eyebrowTok) {
      const p = eyebrowTok.el || ce('p');
      if (!eyebrowTok.el) p.textContent = eyebrowTok.text;
      p.classList.add('hero__eyebrow', 'eyebrow');
      copy.appendChild(p);
    }
    const h = headingTok.el;
    h.classList.add('hero__heading', 'heading-2');
    copy.appendChild(h);
    if (descTok) {
      const p = descTok.el || ce('p');
      if (!descTok.el) p.textContent = descTok.text;
      p.classList.add('hero__desc', 'body-md');
      copy.appendChild(p);
    }
    if (ctas.length) {
      const ctaRow = ce('div', 'hero__ctas');
      ctas.forEach((c, idx) => {
        const variant = idx === 0 ? 'hero__cta--primary' : 'hero__cta--secondary';
        const href = c.type === 'a' && c.el?.getAttribute('href');
        // Real destination -> <a>; otherwise an in-page action -> <button> (C9).
        const btn = href && href !== '#' && href !== '/'
          ? ce('a', `hero__cta ${variant}`, { href }) : ce('button', `hero__cta ${variant}`, { type: 'button' });
        btn.textContent = c.text;
        btn.setAttribute('daa-ll', `${BLOCK}|${slug(c.text) || `cta-${idx + 1}`}`);
        ctaRow.appendChild(btn);
      });
      copy.appendChild(ctaRow);
    }
    inner2.appendChild(copy);

    if (cards.length) {
      const router = ce('div', 'hero__router');
      const list = ce('div', 'hero__cards', { role: 'tablist' });
      cards.forEach((card) => {
        const active = eyebrowText && slug(card.label) === slug(eyebrowText);
        const tab = ce('button', `hero__card${active ? ' is-active' : ''}`, { type: 'button', role: 'tab', 'aria-selected': active ? 'true' : 'false' });
        tab.setAttribute('daa-ll', `${BLOCK}|${slug(card.label) || 'tab'}`);
        tab.appendChild(ce('span', 'hero__card-bar'));
        const icons = ce('span', 'hero__card-icons');
        card.icons.forEach((pic) => {
          icons.appendChild(pic); // MOVE the icon picture (keeps its attrs).
          const im = pic.querySelector('img');
          if (im) { im.setAttribute('daa-im', `${BLOCK}|${slug(card.label)}-icon`); if (!im.alt) im.alt = ''; }
        });
        tab.appendChild(icons);
        const cta = ce('span', 'hero__card-cta');
        const label = ce('span', 'hero__card-label');
        label.textContent = card.label;
        cta.appendChild(label);
        cta.appendChild(svg(CHEVRON, { class: 'hero__card-chevron' }));
        tab.appendChild(cta);
        list.appendChild(tab);
      });
      router.appendChild(list);
      const pp = ce('button', 'hero__pp', { type: 'button', 'aria-label': 'Pause slideshow' });
      pp.appendChild(svg(PAUSE));
      router.appendChild(pp);
      inner2.appendChild(router);
    }
    hero.appendChild(inner2);

    const rebuilt = document.createDocumentFragment();
    rebuilt.appendChild(hero);

    if (capTok) {
      const cap = ce('div', 'hero__caption');
      if (capEyebrow) { const p = capEyebrow.el; p.classList.add('hero__caption-eyebrow', 'eyebrow'); cap.appendChild(p); }
      const ch = capTok.el; ch.classList.add('hero__caption-heading', 'heading-3'); cap.appendChild(ch);
      if (capDesc) { const p = capDesc.el; p.classList.add('hero__caption-desc', 'body-md'); cap.appendChild(p); }
      rebuilt.appendChild(cap);
    }

    // Promote typography via Milo's own service (C2 heading/body classes) — a
    // real decorator step, run before we swap so it operates on live nodes.
    try { decorateBlockText(copy); } catch (e) { /* enhancement only */ }

    el.replaceChildren(rebuilt); // single swap (C3 — never innerHTML wipe).
  } catch (e) {
    window.lana?.log?.(`${BLOCK} decorate failed: ${e?.message || e}`, { tags: 'forge' });
  }
}
