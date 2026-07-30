/**
 * forge-contact — a Milo C2 "contact" section block: a centered dark band with a
 * round mnemonic, a heading, an inquiries paragraph, and a row of destination
 * links (each an icon stacked over a label).
 *
 * WHY THIS RECONSTRUCTS (C24): DA serializes a block's authored content as a
 * FLAT, class-LESS run of semantic nodes in document order — `<picture>`, `<h2>`,
 * `<p>`, then three route `<a>`s — with NO grid/tile/row wrappers and NONE of the
 * descriptive classes the reference `section.html` shows (`.contact__icon`,
 * `.routes`, `.route`…). At runtime those classes DO NOT EXIST, so init() must
 * probe the content BY SHAPE (never by an authored class) and REBUILD the visual
 * structure with `createElement`, stamping the block-owned classes the scoped CSS
 * keys on. Authored `<picture>`/`<img>` nodes are MOVED (not recreated) so their
 * loading/width/height/srcset attributes survive (C4). MEP/Target markers on the
 * discarded row wrapper are copied up onto the block root first (C11). A single
 * `el.replaceChildren(...)` performs the one sanctioned wipe-and-rebuild (C3) — the
 * block DOM is never cleared with innerHTML.
 *
 * @param {HTMLElement} el  The block element Milo passes to every C2 decorator.
 * @returns {Promise<void>}
 */
// CANONICAL DEPTH: libs/c2/blocks/<name>/ -> libs/utils/ is THREE hops up
// (blocks -> c2 -> libs). The 3-hop specifier is CORRECT and lint-validated (L30);
// do NOT "correct" it to 2 hops.
import { decorateBlockText } from '../../../utils/decorate.js';

const BLOCK = 'forge-contact';

// MEP / personalization markers Milo stamps on the row/cell wrapper. The un-wrap
// discards that wrapper, so copy any present marker up onto the block root FIRST —
// a rebuild that drops them silently disables Target/MEP on the section (C11).
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

const slugify = (text) => String(text || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40);

function createEl(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// Tag an authored image for analytics + give it the block-owned media class the
// scoped CSS reserves space for (no bare `img` selector escapes the block scope).
function adoptImage(pic, imLabel) {
  const img = pic?.tagName === 'IMG' ? pic : pic?.querySelector('img');
  if (!img) return;
  img.classList.add(`${BLOCK}__media`);
  if (!img.hasAttribute('daa-im')) img.setAttribute('daa-im', imLabel);
}

// Demote an authored h1 to h2 (C8: at most one h1 per block; a contact section is
// never the page's primary heading). Moves child nodes + attributes — no innerHTML.
function asSubHeading(heading) {
  if (!heading || heading.tagName !== 'H1') return heading;
  const h2 = createEl('h2');
  [...heading.attributes].forEach((a) => h2.setAttribute(a.name, a.value));
  while (heading.firstChild) h2.append(heading.firstChild);
  return h2;
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Un-wrap: DA nests the authored cell as block > div > div > content. Read from
  // that inner cell (or the block itself if already flat) and lift MEP markers up.
  const inner = el.querySelector(':scope > div > div');
  if (inner) preserveMepAttrs(inner.parentElement, el);
  const source = inner || el;

  // Probe the flat content BY SHAPE (C2 — never by an authored class):
  //  • icon   = first <picture>/<img> that is NOT inside a link (route icons are).
  //  • heading/inquiries = first heading / first paragraph.
  //  • routes = anchors that live OUTSIDE the inquiries paragraph (mailto links
  //    live inside it), preserved in authored order.
  const iconMedia = [...source.querySelectorAll('picture, img')]
    .find((m) => !m.closest('a') && !(m.tagName === 'IMG' && m.closest('picture')));
  const heading = source.querySelector('h1, h2, h3, h4, h5, h6');
  const inquiries = source.querySelector('p');
  const routeLinks = [...source.querySelectorAll('a')].filter((a) => !a.closest('p'));

  // RECONSTRUCT the section: build block-owned classes the scoped CSS keys on.
  const container = createEl('div', `${BLOCK}__container`);

  if (iconMedia) {
    const iconWrap = createEl('span', `${BLOCK}__icon`);
    iconWrap.append(iconMedia);
    adoptImage(iconMedia, `${BLOCK}|icon`);
    container.append(iconWrap);
  }

  let headingEl = null;
  if (heading) {
    headingEl = asSubHeading(heading);
    container.append(headingEl);
  }

  if (inquiries) container.append(inquiries);

  let routesWrap = null;
  if (routeLinks.length) {
    routesWrap = createEl('div', `${BLOCK}__routes`);
    routeLinks.forEach((link, i) => {
      const label = link.textContent.trim();
      const pic = link.querySelector('picture, img');
      const parts = [];
      if (pic) {
        const iconSpan = createEl('span', `${BLOCK}__route-icon`);
        iconSpan.append(pic.tagName === 'IMG' && pic.closest('picture') ? pic.closest('picture') : pic);
        adoptImage(iconSpan.querySelector('picture, img'), `${BLOCK}|${slugify(label) || `route-${i + 1}`}`);
        parts.push(iconSpan);
      }
      const labelSpan = createEl('span', `${BLOCK}__route-label`);
      labelSpan.textContent = label;
      parts.push(labelSpan);
      link.classList.add(`${BLOCK}__route`);
      link.replaceChildren(...parts);
      if (!link.hasAttribute('daa-ll')) {
        link.setAttribute('daa-ll', `${BLOCK}|${slugify(label) || `route-${i + 1}`}`);
      }
      routesWrap.append(link);
    });
    container.append(routesWrap);
  }

  // Run Milo's own text decorator so headings become C2 typography (title/heading)
  // and the inquiries copy becomes body-* — the same primitive real C2 blocks use.
  // Called BEFORE the block-owned inquiries class is added so its `:not([class])`
  // body probe still matches the paragraph.
  decorateBlockText(container);

  if (headingEl) headingEl.classList.add(`${BLOCK}__title`);
  if (inquiries) {
    inquiries.classList.add(`${BLOCK}__inquiries`);
    // C20: on this dark band the mailto links must set their own readable color —
    // never inherit the global near-black. Tag + class them (no bare `a` selector).
    inquiries.querySelectorAll('a[href]').forEach((link, i) => {
      link.classList.add(`${BLOCK}__link`);
      if (!link.hasAttribute('daa-ll')) {
        link.setAttribute('daa-ll', `${BLOCK}|${slugify(link.textContent) || `inquiry-${i + 1}`}`);
      }
    });
  }

  // One sanctioned wipe-and-rebuild: swap the flat authored run for the rich tree.
  el.replaceChildren(container);
  el.dataset.forgeAuthored = BLOCK;
}
