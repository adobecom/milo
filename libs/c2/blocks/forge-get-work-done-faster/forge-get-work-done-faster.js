/**
 * forge-get-work-done-faster — a Milo C2 full-bleed hero block (Acrobat).
 *
 * DA serializes this section's authored table as a FLAT, class-LESS run of
 * <picture>/<h2>/<h3>/<p> ELEMENTS interleaved with BARE TEXT NODES: the top
 * nav chrome (logo glyph, "Adobe" link, "Sign In", the Ask bar) and the two CTA
 * labels arrive as loose text, and a trailing "Optimized Workflows" caption
 * follows the hero. None of section.html's structural classes (.s5-hero/.s5-copy/…)
 * survive to runtime — so init() cannot key on them. Instead it PROBES the
 * content by shape + document order, DROPS the nav chrome (L28 — gnav is a
 * federated fragment), and RECONSTRUCTS the rich hero (background + scrim +
 * copy + pill CTAs + a mobile caption) with createElement, stamping its own
 * scoped classes that the co-located stylesheet targets. Authored element nodes
 * (picture, headings, paragraphs) are MOVED (never re-serialized) so their
 * attributes — srcset/sizes/loading/width/height and MEP markers — survive.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: from libs/c2/blocks/<name>/ to libs/utils/decorate.js is
// THREE hops up (blocks -> c2 -> libs). Keep the 3-hop '../../../' specifier.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-get-work-done-faster';

// Nodes we treat as content "leaves" when flattening — everything else (the
// bare wrapper <div>s EDS injects) is descended into so we reach real content.
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
// block root BEFORE the rebuild so Target/MEP still resolves the section (C11).
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
// {type:'text'} token PER non-empty LINE (DA emits the CTA labels as loose
// newline-separated text the parser folds into a single node — the split
// recovers the one-label-per-line structure).
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

    // --- Hero copy: eyebrow (before heading), heading, description (after). ---
    // Any nav chrome (logo glyph, "Adobe" link, "Sign In", the Ask bar) sits
    // BEFORE the eyebrow in document order and is simply never referenced — so
    // the single rebuild swap drops it (L28: gnav is a federated fragment).
    const headingTok = tokens[headingIdx];
    const eyebrowTok = isCopy(tokens[headingIdx - 1]) && tokens[headingIdx - 1].type !== 'picture'
      ? tokens[headingIdx - 1] : null;
    const descTok = isCopy(tokens[headingIdx + 1]) ? tokens[headingIdx + 1] : null;

    // First picture = full-bleed background.
    const bgTok = tokens.find((t) => t.type === 'picture');

    // --- CTAs: text/links after the description, up to the next paragraph
    // (the caption's "Optimized Workflows" eyebrow) / picture / heading. ---
    const ctas = [];
    let i = descTok ? headingIdx + 2 : headingIdx + 1;
    for (; i < tokens.length; i += 1) {
      const t = tokens[i];
      if (t.type === 'picture' || isHeading(t) || t.type === 'p') break;
      if ((t.type === 'text' || t.type === 'a') && t.text) ctas.push(t);
    }

    // --- Caption (the "Optimized Workflows" panel): last sub-heading + the
    // paragraph before it (eyebrow) and after it (description). ---
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
    hero.appendChild(ce('div', 'hero__scrim', { 'aria-hidden': 'true' }));

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

    // Promote typography via Milo's own service (C2 heading/body classes + any
    // strong/em button links) — a real decorator step run on live nodes before
    // the swap. Guarded: it is an enhancement, never a hard dependency.
    try { decorateBlockText(copy); } catch (e) { /* enhancement only */ }

    el.replaceChildren(rebuilt); // single swap (C3 — never innerHTML wipe).
  } catch (e) {
    window.lana?.log?.(`${BLOCK} decorate failed: ${e?.message || e}`, { tags: 'forge' });
  }
}
