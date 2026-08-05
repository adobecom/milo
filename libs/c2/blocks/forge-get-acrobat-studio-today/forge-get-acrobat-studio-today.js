/**
 * forge-get-acrobat-studio-today — a full-bleed rich-content hero (Milo C2).
 *
 * DISTINCTIVE section: DA serializes the authored block as a FLAT, class-less
 * run inside `block > div > div`:
 *     <picture>          (background photo)
 *     <p>Acrobat Studio</p>            (eyebrow)
 *     <h1>Get Acrobat Studio today.</h1>
 *     <p>…subhead…</p>
 *     <p>US$24.99/mo annual, billed monthly</p>   (price)
 *     <a>Free Trial</a> <a>Compare Plans</a>       (CTAs)
 * The Figma structural classes (.img-section-bg/.img-copy-lockup/…) DO NOT exist
 * at runtime, so init() PROBES by content shape (never by class or fixed index)
 * and RECONSTRUCTS the rich hero: a background media layer + a dark gradient
 * overlay + a centred copy lockup (headline group) + an actions group
 * (price + pill CTAs). All layout hooks are OUR OWN `.forge-…`-scoped classes so
 * the co-authored scoped CSS actually matches the rebuilt DOM.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-get-acrobat-studio-today';
// A paragraph is the PRICE line when it reads like currency / a billing cadence.
const PRICE_RE = /(\$|US\$|€|£|\/mo\b|\/yr\b|per\s+month|per\s+year|billed|month|year)/i;

// MEP / personalization markers Milo stamps on the row/cell wrapper. The rebuild
// discards that wrapper, so copy any present marker onto the block root FIRST — a
// node swap that drops them silently disables Target/MEP on the section (C11).
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

// Disambiguates daa-lh across N same-name instances on one page (1-based suffix).
function forgeInstanceSuffix(el, blockName) {
  const instances = [...document.querySelectorAll(`.${blockName}`)];
  const idx = instances.indexOf(el);
  return instances.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

// Deterministic analytics floor (forge-owned; idempotent — never double-tags a
// node that already carries daa-ll / daa-im). Satisfies C7.
function forgeTagAnalytics(scope, label) {
  if (!scope) return;
  const slugify = (text) => String(text || '')
    .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  let linkIdx = 0;
  scope.querySelectorAll('a, button').forEach((node) => {
    if (node.hasAttribute('daa-ll')) return;
    linkIdx += 1;
    const text = node.textContent || node.getAttribute('aria-label') || '';
    node.setAttribute('daa-ll', `${label}|${slugify(text) || `link-${linkIdx}`}`);
  });
  let imgIdx = 0;
  scope.querySelectorAll('img').forEach((img) => {
    if (img.hasAttribute('daa-im')) return;
    imgIdx += 1;
    img.setAttribute('daa-im', `${label}|${slugify(img.getAttribute('alt')) || `image-${imgIdx}`}`);
  });
}

export default async function init(el) {
  if (!el) return;
  const daaLh = `${BLOCK}${forgeInstanceSuffix(el, BLOCK)}`;
  el.setAttribute('daa-lh', daaLh);

  // The authored content lives in the single cell (`block > div > div`); fall
  // back to the block itself if EDS did not add the extra wrappers.
  const cell = el.querySelector(':scope > div > div') || el.querySelector(':scope > div') || el;
  preserveMepAttrs(cell.parentElement, el);

  // ---- Probe by content shape (C2/C24) — never by authored class or index. ----
  const picture = cell.querySelector('picture')
    || (cell.querySelector('img') ? cell.querySelector('img').closest('picture') || cell.querySelector('img') : null);
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...cell.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const links = [...cell.querySelectorAll('a[href]')];

  // Document-order index lets us tell "before the heading" (eyebrow) from
  // "after" (subhead / price) without positional assumptions about the run.
  const ordered = [...cell.querySelectorAll('h1, h2, h3, h4, h5, h6, p')];
  const headingIdx = heading ? ordered.indexOf(heading) : -1;

  // Classify the paragraph run so EVERY node is placed, none discarded.
  const eyebrow = headingIdx > 0
    ? paras.find((p) => ordered.indexOf(p) < headingIdx) : undefined;
  const price = paras.find((p) => p !== eyebrow && PRICE_RE.test(p.textContent));
  const subheads = paras.filter((p) => p !== eyebrow && p !== price);

  // ---- Reconstruct the rich hero DOM (createTag + move authored nodes). ----
  const inner = createTag('div', { class: `${BLOCK}-inner` });
  const lockup = createTag('div', { class: `${BLOCK}-lockup` });

  // Headline group: eyebrow → heading → subhead(s).
  const headline = createTag('div', { class: `${BLOCK}-headline` });
  if (eyebrow) { eyebrow.classList.add(`${BLOCK}-eyebrow`); headline.append(eyebrow); }
  if (heading) { heading.classList.add(`${BLOCK}-heading`); headline.append(heading); }
  subheads.forEach((p) => { p.classList.add(`${BLOCK}-subhead`); headline.append(p); });
  if (headline.children.length) {
    // Promote text to C2 typography (heading-1 / body-lg / eyebrow) via Milo's
    // own service; our scoped CSS overrides size + colour for the dark hero.
    decorateBlockText(headline, { heading: '1', body: 'lg' });
    lockup.append(headline);
  }

  // Actions group: price + pill CTAs (first = primary, rest = secondary).
  const actions = createTag('div', { class: `${BLOCK}-actions` });
  if (price) { price.classList.add(`${BLOCK}-price`); actions.append(price); }
  if (links.length) {
    const buttons = createTag('div', { class: `${BLOCK}-buttons action-area` });
    links.forEach((a, i) => {
      a.classList.add(`${BLOCK}-button`, `${BLOCK}-button--${i === 0 ? 'primary' : 'secondary'}`);
      // Collapse any stray whitespace-only markup the author left inside the link.
      a.textContent = a.textContent.trim();
      buttons.append(a);
    });
    actions.append(buttons);
  }
  if (actions.children.length) lockup.append(actions);
  inner.append(lockup);

  // Background media layer + dark gradient overlay behind the copy.
  const rebuilt = [];
  if (picture) {
    const bg = createTag('div', { class: `${BLOCK}-bg`, 'aria-hidden': 'true' });
    bg.append(picture);
    rebuilt.push(bg, createTag('div', { class: `${BLOCK}-overlay`, 'aria-hidden': 'true' }));
  }
  rebuilt.push(inner);

  // Single swap at the end — never innerHTML-wipe (C3). Authored nodes were
  // MOVED (not cloned) so their attributes / MEP hooks are preserved (C4/C11).
  el.replaceChildren(...rebuilt);

  forgeTagAnalytics(el, daaLh);
  el.dataset.forgeAuthored = BLOCK;
}
