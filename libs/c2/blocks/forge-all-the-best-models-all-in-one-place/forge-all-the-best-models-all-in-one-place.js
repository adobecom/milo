/**
 * forge-all-the-best-models-all-in-one-place — a Milo C2 hero block.
 *
 * DA serializes this section's authored table as a FLAT, class-LESS run of
 * <picture>/<h2>/<p> ELEMENTS interleaved with BARE TEXT NODES: the two CTA
 * labels ("Create with Firefly", "See plans") and the five category-router
 * labels ("Creativity and design" … "Students and teachers") arrive as loose
 * text, NOT tags, and there is NO media/element separator between the CTA run
 * and the tab run — so a positional read cannot tell them apart. None of
 * section.html's structural classes (.s4-content/.s4-tab/…) survive to runtime.
 *
 * init() therefore PROBES by content shape + document order and RECONSTRUCTS the
 * rich hero (full-bleed background + gradient scrim + copy with pill CTAs + a
 * bottom router of category tab-cards + a mobile-only caption) with
 * createElement, stamping its OWN scoped classes that the co-located stylesheet
 * targets. CTA-vs-tab is disambiguated by Adobe's fixed category taxonomy (a
 * content signal, never an index). Authored element nodes (picture, headings,
 * paragraphs) are MOVED — never re-serialized — so srcset/sizes/loading/
 * width/height and any MEP markers survive. The top nav stripe in the Figma
 * frame is intentionally dropped (Milo provides gnav; L28).
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). Keep the 3-hop '../../../' specifier.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-all-the-best-models-all-in-one-place';

// Element tags we treat as content "leaves" when flattening; everything else
// (bare wrapper <div>s EDS injects) is descended into to reach real content.
const LEAF = new Set(['PICTURE', 'IMG', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'BUTTON', 'UL', 'OL']);

// Adobe's fixed top-level category taxonomy — the router tab labels. Used to
// split the bare-text run into CTAs (before) and tabs (the taxonomy matches),
// so the boundary is a CONTENT signal, not a fragile child index.
const CATEGORY_SLUGS = new Set([
  'creativity-and-design',
  'content-creation',
  'pdf-and-productivity',
  'adobe-for-business',
  'students-and-teachers',
]);

// The comp highlights "Content creation" as the active category. The eyebrow
// ("Firefly") is not itself a category, so we resolve active by matching the
// eyebrow first, then fall back to this authored default — never a bare index.
const DEFAULT_ACTIVE_SLUG = 'content-creation';

const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const slug = (s) => norm(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);

function ce(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => v != null && node.setAttribute(k, v));
  return node;
}

// MEP / personalization markers: copy from the discarded wrapper onto the block
// root BEFORE the rebuild so Target/MEP still resolves the section (C11).
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
// {type:'text'} token PER non-empty LINE — DA emits the CTA and category
// labels as newline-separated loose text the parser folds into a single node,
// so splitting on the newline recovers the one-item-per-line structure.
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

function svg(markup) {
  const span = ce('span', 'hero__svg');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = markup;
  return span;
}
const CHEVRON = '<svg width="5" height="9" viewBox="0 0 4 7" fill="none"><path d="M1 1.3 3 3.5 1 5.7" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
    const eyebrowSlug = eyebrowTok ? slug(eyebrowTok.text) : '';

    // First picture = full-bleed background.
    const bgTok = tokens.find((t) => t.type === 'picture');

    // --- Walk everything after the description: bare-text before the first
    // taxonomy match = CTAs; the contiguous taxonomy matches = tab-cards; a
    // paragraph/heading after the tabs begins the caption region. ---
    const ctas = [];
    const cards = [];
    let i = descTok ? headingIdx + 2 : headingIdx + 1;
    for (; i < tokens.length; i += 1) {
      const t = tokens[i];
      if (t.type === 'picture') continue; // ignore any stray inline media
      if (isHeading(t)) break; // caption heading -> stop
      const s = slug(t.text);
      if (CATEGORY_SLUGS.has(s)) { cards.push({ label: t.text, slug: s }); continue; }
      if (cards.length) break; // first non-category after tabs -> caption region
      if ((t.type === 'text' || t.type === 'a') && t.text) { ctas.push(t); continue; }
      if (t.type === 'p') break; // an element paragraph w/o cards -> caption
    }

    // Resolve which tab is active (eyebrow match first, else authored default).
    const activeSlug = cards.some((c) => c.slug === eyebrowSlug) ? eyebrowSlug : DEFAULT_ACTIVE_SLUG;

    // --- Caption (mobile-only panel): last sub-heading that isn't the hero. ---
    let capTok = null;
    for (let j = tokens.length - 1; j > headingIdx; j -= 1) {
      if (/^h[2-6]$/.test(tokens[j].type) && tokens[j] !== headingTok) { capTok = tokens[j]; break; }
    }
    const capIdx = capTok ? tokens.indexOf(capTok) : -1;
    const capEyebrow = capIdx > 0 && tokens[capIdx - 1]?.type === 'p' ? tokens[capIdx - 1] : null;
    const capDesc = capIdx >= 0 && tokens[capIdx + 1]?.type === 'p' ? tokens[capIdx + 1] : null;

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

    const stage = ce('div', 'hero__inner');
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
    stage.appendChild(copy);

    if (cards.length) {
      const router = ce('div', 'hero__router');
      const list = ce('div', 'hero__cards', { role: 'tablist', 'aria-label': 'Product categories' });
      cards.forEach((card) => {
        const active = card.slug === activeSlug;
        const tab = ce('button', `hero__card${active ? ' is-active' : ''}`, {
          type: 'button', role: 'tab', 'aria-selected': active ? 'true' : 'false',
        });
        tab.setAttribute('daa-ll', `${BLOCK}|${card.slug || 'tab'}`);
        tab.appendChild(ce('span', 'hero__card-bar'));
        const cta = ce('span', 'hero__card-cta');
        const label = ce('span', 'hero__card-label');
        label.textContent = card.label;
        cta.appendChild(label);
        cta.appendChild(svg(CHEVRON));
        tab.appendChild(cta);
        list.appendChild(tab);
      });
      router.appendChild(list);
      const pp = ce('button', 'hero__pp', { type: 'button', 'aria-label': 'Pause slideshow' });
      pp.setAttribute('daa-ll', `${BLOCK}|pause`);
      pp.appendChild(svg(PAUSE));
      router.appendChild(pp);
      stage.appendChild(router);
    }
    hero.appendChild(stage);

    const rebuilt = document.createDocumentFragment();
    rebuilt.appendChild(hero);

    if (capTok) {
      const cap = ce('div', 'hero__caption');
      if (capEyebrow) { const p = capEyebrow.el; p.classList.add('hero__caption-eyebrow', 'eyebrow'); cap.appendChild(p); }
      const ch = capTok.el; ch.classList.add('hero__caption-heading', 'heading-3'); cap.appendChild(ch);
      if (capDesc) { const p = capDesc.el; p.classList.add('hero__caption-desc', 'body-md'); cap.appendChild(p); }
      rebuilt.appendChild(cap);
    }

    // Promote typography via Milo's own service, on the live copy container
    // before the swap (makes this a real decorator, not an inert shim).
    try { decorateBlockText(copy); } catch (e) { /* enhancement only */ }

    el.replaceChildren(rebuilt); // single swap (C3 — never innerHTML wipe).
  } catch (e) {
    window.lana?.log?.(`${BLOCK} decorate failed: ${e?.message || e}`, { tags: 'forge' });
  }
}
