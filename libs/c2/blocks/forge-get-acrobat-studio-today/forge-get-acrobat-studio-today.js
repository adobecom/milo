/**
 * forge-get-acrobat-studio-today — a Milo C2 hero/marquee section.
 *
 * DA serialises this section's authored content as a FLAT, class-less run of
 * semantic nodes in document order:
 *
 *   <p>Acrobat Studio</p>            (eyebrow — sits before the heading)
 *   <h1>Get Acrobat Studio today.</h1>
 *   <p>The highly secure PDF…</p>    (body copy)
 *   <p>US$24.99/mo annual…</p>       (price — matches PRICE_RE)
 *   <a href="#">Free Trial</a>       (primary CTA)
 *   <a href="#">Compare Plans</a>    (secondary CTA)
 *
 * The rich Figma layout (a centred hero column over a dark backdrop) exists only
 * as PROPORTIONS at runtime — none of the Figma classes survive. So init() PROBES
 * by content shape (heading anchor + price regex + leading eyebrow), then
 * RECONSTRUCTS the hero column with createElement + append, stamping its OWN
 * `.forge-get-acrobat-studio-today*`-scoped classes that the block CSS keys on.
 * The original authored nodes are MOVED (never serialised) so href / MEP / picture
 * attributes are preserved, and the section is committed with a single
 * el.replaceChildren() — never an innerHTML wipe.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). decorateBlockText also runs decorateButtons + the
// eyebrow/heading/body typography pass, so it is the one Milo service this
// text-first hero needs.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-get-acrobat-studio-today';
// A price/pricing paragraph — currency glyph, a "/mo" cadence, or billing prose.
const PRICE_RE = /[$€£]|\bUS\$|\/mo\b|\bbilled\b|per\s*month|\bmonthly\b/i;

// MEP / personalization markers Milo stamps on the row/cell wrapper. Un-wrapping
// discards that wrapper, so copy any present marker onto the block root FIRST —
// a rebuild that drops them silently disables Target/MEP on the section.
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  // data-mep-* is an open family — copy every attribute in that namespace.
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

// Disambiguate daa-lh across N same-name instances on one page (1-based suffix).
function instanceSuffix(el) {
  const all = [...document.querySelectorAll(`.${BLOCK}`)];
  const idx = all.indexOf(el);
  return all.length > 1 && idx >= 0 ? `-${idx + 1}` : '';
}

function tag(cls, name = 'div') {
  const node = document.createElement(name);
  if (cls) node.className = cls;
  return node;
}

function slug(text, fallback) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || fallback;
}

export default async function init(el) {
  if (!el) return;

  // Section-level analytics handle, disambiguated across repeats on the page.
  const daaLh = `${BLOCK}${instanceSuffix(el)}`;
  el.setAttribute('daa-lh', daaLh);

  // Locate the content cell. DA renders block > row > cell > content; probe by
  // structure (never a class) and fall back to the block itself.
  const cell = el.querySelector(':scope > div > div')
    || el.querySelector(':scope > div')
    || el;
  if (cell !== el) preserveMepAttrs(cell.parentElement, el);

  // ---- PROBE by content shape (DA strips authored classes) ----
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...cell.querySelectorAll('a[href]')];
  const paras = [...cell.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
  // Document-order test (no bitwise): a paragraph is an eyebrow if it appears
  // before the heading in the flat run.
  const ordered = [...cell.querySelectorAll('p, h1, h2, h3, h4, h5, h6')];
  const headingIdx = heading ? ordered.indexOf(heading) : -1;
  const isBefore = (node) => headingIdx >= 0 && ordered.indexOf(node) < headingIdx;
  const eyebrows = paras.filter(isBefore);
  const afters = paras.filter((p) => !isBefore(p));
  const price = afters.find((p) => PRICE_RE.test(p.textContent || ''));
  const body = afters.filter((p) => p !== price);

  // ---- RECONSTRUCT the centred hero column ----
  const foreground = tag(`${BLOCK}__foreground content`);
  const textWrap = tag(`${BLOCK}__text`);
  eyebrows.forEach((p) => textWrap.append(p));
  if (heading) textWrap.append(heading);
  body.forEach((p) => textWrap.append(p));
  foreground.append(textWrap);

  // Milo typography service: eyebrow (pre-heading <p>) + heading-N + body-*.
  // Run it BEFORE stamping our own classes so its `:not([class])` probe still
  // sees the raw paragraphs, then add our scoped hooks additively.
  decorateBlockText(textWrap);
  eyebrows.forEach((p) => p.classList.add(`${BLOCK}__eyebrow`));
  heading?.classList.add(`${BLOCK}__heading`);
  body.forEach((p) => p.classList.add(`${BLOCK}__body`));

  if (price || links.length) {
    const actions = tag(`${BLOCK}__actions`);
    if (price) {
      price.classList.add(`${BLOCK}__price`);
      actions.append(price);
    }
    if (links.length) {
      const group = tag(`${BLOCK}__cta-group`);
      links.forEach((a, i) => {
        const wrapper = a.closest('p');
        const kind = i === 0 ? 'primary' : 'secondary';
        a.classList.add('con-button', `${BLOCK}__cta`, `${BLOCK}__cta--${kind}`);
        if (!a.hasAttribute('daa-ll')) {
          a.setAttribute('daa-ll', `${daaLh}|${slug(a.textContent, `cta-${i + 1}`)}`);
        }
        group.append(a);
        // Discard the now-empty authored <p> that had only wrapped this link.
        if (wrapper && wrapper !== group && !wrapper.textContent.trim()) wrapper.remove();
      });
      actions.append(group);
    }
    foreground.append(actions);
  }

  // Commit once — replaceChildren keeps the block root (and its MEP attrs),
  // never an innerHTML wipe.
  el.replaceChildren(foreground);
  el.dataset.forgeAuthored = BLOCK;
}
