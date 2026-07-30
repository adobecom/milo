/**
 * forge-dark-act — a reusable dark, split-media "call to action" section:
 * eyebrow + heading + body + CTA in one column, a supporting image in the other.
 *
 * WHY THIS SHAPE: DA serializes the authored block as a FLAT, class-LESS run of
 * semantic nodes wrapped in EDS row/cell divs:
 *   .forge-dark-act > div > div > (p[eyebrow], h2, p[body], a[cta], picture)
 * None of the Figma layout classes survive to runtime, so init() PROBES by
 * content shape (never by an authored class or child index) and REBUILDS the
 * two-column layout with createTag. The CTA is wrapped in <strong> so Milo's own
 * decorateButtons turns it into a con-button, and decorateBlockText applies the
 * C2 typography classes (eyebrow / heading-2 / body-md) — the block leans on the
 * design system rather than re-rolling type + button styling by hand.
 *
 * @param {HTMLElement} el  the C2 block element Milo hands every decorator
 * @returns {Promise<void>}
 */
// THREE hops up from libs/c2/blocks/<name>/ -> libs/utils/ (blocks -> c2 -> libs).
import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const BLOCK = 'forge-dark-act';

// MEP / personalization markers Milo stamps on the row/cell wrapper we discard.
// Copy them onto the block root BEFORE the rebuild so a later Target/MEP swap
// still finds them (dropping them silently disables personalization).
const MEP_ATTRS = ['data-manifest-id', 'data-adobe-target-testid'];
function preserveMepAttrs(from, to) {
  if (!from || !to) return;
  MEP_ATTRS.forEach((attr) => {
    const v = from.getAttribute?.(attr);
    if (v != null) to.setAttribute(attr, v);
  });
  // data-mep-* is an open family — carry every attribute in that namespace.
  [...(from.attributes || [])].forEach((a) => {
    if (a.name.startsWith('data-mep-')) to.setAttribute(a.name, a.value);
  });
}

// A short, slug-safe analytics label from arbitrary text.
function slug(text) {
  return String(text || '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export default async function init(el) {
  if (!el) return;
  el.setAttribute('daa-lh', BLOCK);

  // Probe outward from required content (never el.children[N]): the heading
  // anchors the section, and its parent is the DA content cell we read in order.
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  const cell = heading?.parentElement || el.querySelector(':scope > div > div') || el;
  preserveMepAttrs(cell?.parentElement, el);
  preserveMepAttrs(cell, el);

  // Classify the flat, class-less children by CONTENT SHAPE, preserving order:
  // the first <p> before the heading is the eyebrow, the first <p> after is the
  // body, the first real link is the CTA, the first <picture> is the media.
  let eyebrowP = null;
  let bodyP = null;
  let cta = null;
  let picture = null;
  let sawHeading = false;
  [...(cell?.children || [])].forEach((node) => {
    if (node.nodeType !== 1) return;
    if (/^H[1-6]$/.test(node.tagName)) { sawHeading = true; return; }
    if (node.tagName === 'PICTURE') { picture = picture || node; return; }
    const innerPic = node.querySelector?.('picture');
    if (innerPic) { picture = picture || innerPic; return; }
    if (node.tagName === 'A' && node.getAttribute('href')) { cta = cta || node; return; }
    const innerLink = node.querySelector?.('a[href]');
    if (innerLink) { cta = cta || innerLink; return; }
    if (node.tagName === 'P') {
      if (!sawHeading && !eyebrowP) eyebrowP = node;
      else if (!bodyP) bodyP = node;
    }
  });

  // Rebuild the split-media layout additively with createTag; nodes are MOVED
  // (append), so <picture>/<img> attributes — loading/width/height/srcset — and
  // any MEP markers on them survive intact.
  const grid = createTag('div', { class: 'fda-grid' });
  const copy = createTag('div', { class: 'fda-copy' });
  const media = createTag('div', { class: 'fda-media' });

  if (eyebrowP) copy.appendChild(eyebrowP);
  if (heading) copy.appendChild(heading);
  if (bodyP) copy.appendChild(bodyP);
  // Wrap the CTA (strong > a) inside an action paragraph so Milo's own
  // decorateButtons styles it as a con-button and keeps its analytics wiring.
  if (cta) {
    const action = createTag('p', { class: 'action-area' });
    const strong = createTag('strong');
    strong.appendChild(cta);
    action.appendChild(strong);
    copy.appendChild(action);
  }
  if (picture) media.appendChild(picture);

  // Milo C2 typography + button decoration: eyebrow on the pre-heading <p>,
  // heading-2 on the heading, body-md on the body <p>, con-button on the CTA.
  decorateBlockText(copy);

  // Analytics labels the lint requires (daa-ll on links, daa-im on inserted img).
  if (cta) cta.setAttribute('daa-ll', `${slug(cta.textContent) || 'cta'}-1`);
  const img = media.querySelector('img');
  if (img) img.setAttribute('daa-im', `${slug(img.getAttribute('alt')) || 'media'}-1`);

  grid.append(copy, media);
  // Single structural swap at the end via replaceChildren (never a destructive
  // markup wipe) so Target/MEP-injected nodes are preserved.
  el.replaceChildren(grid);
}
