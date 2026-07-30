/**
 * forge-get-acrobat-studio-today — a Milo C2 hero block authored by Forge.
 *
 * The Figma section is a centred marketing hero: an eyebrow, a large display
 * headline, a supporting paragraph, a price line and two pill CTAs, laid over a
 * dark full-bleed scene. DA serialises that lockup as a FLAT, class-less run of
 * `<p>/<h1>/<p>/<p>/<a>/<a>` inside the block cell — every Figma wrapper
 * (`.acro-copy-lockup`, `.acro-text-group`, `.acro-cta-group`, `.acro-btn-row`)
 * is stripped before this decorator runs. So `init` PROBES the flat content by
 * shape/order (never by an authored class or a fixed index) and RECONSTRUCTS the
 * rich lockup with `createElement` + `appendChild`, stamping its own
 * `.forge-get-acrobat-studio-today`-scoped classes that the co-located CSS keys
 * on. Nothing is discarded — every flat child is routed to a slot or kept as a
 * leftover — so the section can never regress to an empty/heading-only band.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop '../../../' specifier is REQUIRED by L30.
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const BLOCK = 'forge-get-acrobat-studio-today';

// A paragraph that reads like a price / billing line (belongs beside the CTAs,
// not in the body copy). Matches "US$24.99/mo", "billed monthly", "/yr", etc.
const PRICE_RE = /(?:US)?\$\s*\d|\/\s*(?:mo|yr|month|year)|\bbilled\b|\bper (?:month|year)\b/i;

// MEP / personalization markers Milo may stamp on the row/cell wrapper we drop.
// Copy them onto the block root BEFORE the rebuild so a later Target/MEP swap
// still finds them (a node swap that drops them silently disables MEP).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to || from === to) return;
  for (const attr of MEP_ATTRS) {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  }
  for (const a of [...(from.attributes || [])]) {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  }
}

function tag(name, className, attrs) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

const slug = (text) => String(text || '')
  .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

// Disambiguates daa-lh across N same-name instances on one page (1-based).
function instanceSuffix(el) {
  const instances = [...document.querySelectorAll(`.${BLOCK}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

export default async function init(el) {
  if (!el) return;

  const daaLh = `${BLOCK}${instanceSuffix(el)}`;
  el.setAttribute('daa-lh', daaLh);

  // Preserve MEP markers from the EDS row/cell wrapper before we rebuild.
  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div');
  preserveMepAttrs(cell, el);

  // --- PROBE the flat content by shape + document order (never by class/index) ---
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = [...el.querySelectorAll('p')];
  // Standalone CTAs only — skip inline links living inside copy/headings/lists.
  const INLINE_PARENTS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN'];
  const ctas = [...el.querySelectorAll('a')]
    .filter((a) => !INLINE_PARENTS.includes(a.parentElement?.tagName));
  // Any standalone media (defensive: this hero is text-only, but never drop it).
  const media = [...el.querySelectorAll('picture')]
    .concat([...el.querySelectorAll('img')].filter((img) => !img.closest('picture')));

  // Document-order split around the headline (index compare — no bitwise ops).
  const flow = [...el.querySelectorAll('p, h1, h2, h3, h4, h5, h6')];
  const headingIdx = heading ? flow.indexOf(heading) : -1;
  const isEyebrow = (p) => headingIdx >= 0 && flow.indexOf(p) < headingIdx;
  const eyebrows = paragraphs.filter(isEyebrow);
  const rest = paragraphs.filter((p) => !isEyebrow(p));
  const price = rest.find((p) => PRICE_RE.test(p.textContent));
  const body = rest.filter((p) => p !== price);

  // --- RECONSTRUCT the rich lockup ---
  const foreground = tag('div', 'foreground');
  const lockup = tag('div', 'lockup');
  const textGroup = tag('div', 'text-group');

  media.forEach((m) => {
    const alt = m.querySelector?.('img')?.alt || m.getAttribute?.('alt');
    m.setAttribute('daa-im', `${daaLh}|${slug(alt) || 'media'}`);
    textGroup.append(m);
  });
  eyebrows.forEach((p) => { p.classList.add('eyebrow'); textGroup.append(p); });
  if (heading) { heading.classList.add('headline'); textGroup.append(heading); }
  body.forEach((p) => { p.classList.add('body-copy'); textGroup.append(p); });
  lockup.append(textGroup);

  if (price || ctas.length) {
    const ctaGroup = tag('div', 'cta-group');
    if (price) { price.classList.add('price'); ctaGroup.append(price); }
    if (ctas.length) {
      const row = tag('div', 'btn-row');
      ctas.forEach((a, i) => {
        a.classList.add('cta', i === 0 ? 'cta--primary' : 'cta--secondary');
        a.setAttribute('daa-ll', `${daaLh}|${slug(a.textContent) || `cta-${i + 1}`}`);
        row.append(a);
      });
      ctaGroup.append(row);
    }
    lockup.append(ctaGroup);
  }

  // Ragged safety net: every classified node was MOVED out of `el` above, so a
  // content query on `el` now returns only genuine leftovers (a stray heading,
  // extra paragraph, orphan image). Adopt each top-most one so nothing is lost;
  // empty EDS wrapper divs never match this selector, so they are dropped.
  const CONTENT = 'p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, picture, img';
  const leftovers = [...el.querySelectorAll(CONTENT)]
    .filter((n) => (n.textContent && n.textContent.trim()) || n.matches('picture, img'));
  leftovers
    .filter((n) => !leftovers.some((other) => other !== n && other.contains(n)))
    .forEach((n) => textGroup.append(n));

  foreground.append(lockup);
  el.replaceChildren(foreground); // C3: rebuild, never innerHTML = ''

  // Layer Milo's own typography service over the text lockup (heading-2 / eyebrow
  // / body-md + C2 button decoration) so this is a real Milo decorator, not a
  // capture shim. Wrapped in decorateViewportContent for consistent SSR/CSR, and
  // in try/catch so a service hiccup never bricks the rebuilt section.
  try {
    const decorate = () => decorateBlockText(textGroup);
    if (typeof decorateViewportContent === 'function') decorateViewportContent(el, decorate);
    else decorate();
  } catch (e) {
    window.lana?.log(`${BLOCK}: text decoration failed — ${e?.message || e}`, { tags: 'forge' });
  }

  el.dataset.forgeAuthored = BLOCK;
}
