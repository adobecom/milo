// eslint-disable-next-line import/no-relative-packages
import { getFederatedUrl } from '../../../../utils/utils.js';

export function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

// The authored SVG URL (href, or the visible URL text) if this anchor is a badge logo.
function badgeSvgUrl(a) {
  const href = a.getAttribute('href') || '';
  if (href.includes('.svg')) return href;
  const text = a.textContent.trim();
  return text.includes('.svg') ? text : '';
}

function isSvgAnchor(a) {
  return !!badgeSvgUrl(a);
}

// Inline <picture> markup for a badge logo URL, or null. getFederatedUrl (not decorateSVG) and
// aria-hidden: see README (Card shape).
function badgeIconHtml(url) {
  if (!url) return null;
  const src = getFederatedUrl(url);
  return `<picture class="globe-gallery-modal-badge-icon" aria-hidden="true"><img loading="lazy" src="${escapeHtml(src)}" alt=""></picture>`;
}

// See README (Authoring contract) for the authored-row layout.

// English fallback for the a11y entry-widget instructions when row 2 has no
// second paragraph. Authored inline (row 2, 2nd <p>) so it's localizable
// without the placeholders sheet.
const DEFAULT_GALLERY_INSTRUCTIONS = 'Press Enter to enter the gallery, then Tab through the images.';

const LABEL_DIVIDER = '||';
const DEFAULT_LABELS = ['Previous card', '{index} of {count}', 'Next card', 'Close'];

function buildLabels(labelPara) {
  const parts = labelPara
    ? labelPara.textContent.split(LABEL_DIVIDER).map((s) => s.trim())
    : [];
  const [prevCard, cardTplRaw, nextCard, closeBtn] = parts;
  const cardTpl = cardTplRaw?.includes('{index}') && cardTplRaw?.includes('{count}')
    ? cardTplRaw
    : DEFAULT_LABELS[1];
  return {
    prevCard: prevCard || DEFAULT_LABELS[0],
    nextCard: nextCard || DEFAULT_LABELS[2],
    closeBtn: closeBtn || DEFAULT_LABELS[3],
    cardLabel: (index, count) => cardTpl
      .replace('{index}', String(index))
      .replace('{count}', String(count)),
  };
}

function parseArcCopy(row) {
  if (!row) return { title: '', body: '' };
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img'))
    .map((p) => p.textContent)
    .filter(Boolean);
  return {
    title: heading ? heading.textContent : paras.shift() || '',
    body: paras.join(' '),
  };
}

function parsePullQuote(row) {
  const quoteEl = row.querySelector('blockquote') || row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')].map((p) => p.textContent).filter(Boolean);
  return {
    quote: quoteEl ? quoteEl.textContent : paras.shift() || '',
    name: paras[0] || '',
    role: paras[1] || '',
  };
}

function parseFragmentCardSegment(nodes) {
  let img = null;
  let role = ''; let name = ''; let description = '';
  const badges = [];

  nodes.forEach((node) => {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) return;

    if (tag === 'P') {
      const pic = node.querySelector('picture');
      if (pic) {
        img = pic.querySelector('img');
        return;
      }
      const inlineImg = node.querySelector('img');
      if (inlineImg) {
        img = inlineImg;
        return;
      }
      const em = node.querySelector('em');
      if (em) {
        role = em.textContent.trim();
        return;
      }
      const strong = node.querySelector('strong');
      if (strong) {
        name = strong.textContent.trim();
        return;
      }
      const text = node.textContent.trim();
      if (text && !description) description = text;
    } else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach((li) => {
        // Row (on a clone, so authored DOM is untouched) = product; nested <ul> = its feature.
        const row = li.cloneNode(true);
        const featureLi = row.querySelector(':scope > ul > li');
        row.querySelector(':scope > ul')?.remove();

        const anchors = [...row.querySelectorAll('a')];
        const svgAnchor = anchors.find(isSvgAnchor) || null;
        const linkAnchor = anchors.find((a) => a !== svgAnchor) || null;
        const icon = badgeIconHtml(
          svgAnchor ? badgeSvgUrl(svgAnchor) : row.querySelector('img')?.getAttribute('src'),
        );
        svgAnchor?.remove(); // its URL text is markup, never part of the name

        const name = (linkAnchor ? linkAnchor.textContent : row.textContent).trim();
        if (name) {
          badges.push({
            name,
            role: featureLi?.textContent.trim() || '',
            href: linkAnchor?.getAttribute('href') || null,
            icon,
          });
        }
      });
    }
  });

  if (!img) return null;
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    alt: (img.getAttribute('alt') || '').trim(),
    name,
    role,
    description,
    badges,
  };
}

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => n.nodeName === 'P' || n.nodeName === 'UL');

  if (!hasDirectContent) {
    // Children are section divs (each fragment section = one card).
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

  // Flat content — split by <hr> for multiple cards in one section.
  const segments = [];
  let current = [];
  [...row.childNodes].forEach((node) => {
    if (node.nodeName === 'HR') {
      if (current.length) { segments.push(current); current = []; }
    } else if (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()) {
      current.push(node);
    }
  });
  if (current.length) segments.push(current);
  return segments.map((nodes) => parseFragmentCardSegment(nodes)).filter(Boolean);
}

// Fetch the fragment's .plain.html and parse all card sections from it.
export async function fetchFragmentCards(href) {
  try {
    const resp = await fetch(`${href}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    // DOMParser yields an inert document (no browsing context), so card <img>/<picture>
    // never fetch here — only the right-sized texture URL (optimizeImgUrl) is downloaded.
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.body.querySelectorAll(':scope > div')]
      .flatMap((section) => parseFragmentCards(section))
      .filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

// Right-size a helix/DA media image to the width we actually rasterize, so slow connections
// don't download the full-res source only for us to downscale it client-side. Requests webp at
// `width`px (mirrors the width/format convention in libs/utils/decorate.js's decoratePictures).
// Non-media URLs (external assets that don't honor these params) are returned as-is.
export function optimizeImgUrl(src, width) {
  if (!src) return src;
  try {
    const url = new URL(src, window.location.href);
    if (!/(^|\/)media_[0-9a-f]/i.test(url.pathname)) return src;
    return `${url.origin}${url.pathname}?width=${Math.round(width)}&format=webply`;
  } catch (e) {
    return src;
  }
}

// Positional rows (see README, Authoring contract). Fragment links are authored
// with #_dnb so Milo skips auto-resolution; the hash is stripped before fetching.
export function parseAuthoredContent(el) {
  const [arcCopyRow, cardsRow, hintTextRow, pullQuoteRow] = [...el.children];
  const fragmentLink = cardsRow?.querySelector('a[href]');
  const hintParas = hintTextRow ? [...hintTextRow.querySelectorAll('p')] : [];
  const hintText = (hintParas[0]?.textContent ?? hintTextRow?.textContent ?? '').trim();
  const instructions = hintParas[1]?.textContent.trim() || DEFAULT_GALLERY_INSTRUCTIONS;
  return {
    arcCopy: parseArcCopy(arcCopyRow),
    pullQuote: pullQuoteRow ? parsePullQuote(pullQuoteRow) : null,
    fragmentHref: fragmentLink ? fragmentLink.href.replace(/#.*$/, '') : null,
    hintText,
    instructions,
    labels: buildLabels(hintParas[2]),
  };
}

// Runtime queries nodes within the block root, so multiple globes can coexist.
// `gid` makes the two document-wide id refs unique per instance: the CA SVG
// filter (url(#ca-filter-<gid>)) and the modal's aria-labelledby/describedby.
const buildMarkup = (gid, labels) => `
  <div class="globe-gallery-world">
    <canvas class="globe-gallery-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:3;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
  </div>

  <svg class="globe-gallery-ca-svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      <filter id="ca-filter-${gid}" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rch"/>
        <feOffset in="rch" class="globe-gallery-ca-r-offset" dx="0" dy="0" result="rOff"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gch"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bch"/>
        <feOffset in="bch" class="globe-gallery-ca-b-offset" dx="0" dy="0" result="bOff"/>
        <feComposite in="rOff" in2="gch" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg"/>
        <feComposite in="rg" in2="bOff" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
    </defs>
  </svg>

  <div class="globe-gallery-arc-copy">
    <h2 class="globe-gallery-arc-copy-title"></h2>
    <p class="globe-gallery-arc-copy-body body-md"></p>
  </div>

  <div class="globe-gallery-pullquote-pin">
    <div class="globe-gallery-pullquote">
      <blockquote class="globe-gallery-pullquote-quote heading-1"></blockquote>
      <div class="globe-gallery-pullquote-attribution">
        <p class="globe-gallery-pullquote-name body-lg"></p>
        <p class="globe-gallery-pullquote-role body-lg"></p>
      </div>
    </div>
  </div>

  <div class="globe-gallery-modal" aria-hidden="true">
    <div class="globe-gallery-modal-backdrop"></div>
  </div>

  <canvas class="globe-gallery-modal-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:14;display:none;pointer-events:none;"></canvas>

  <dialog class="globe-gallery-modal-chrome" tabindex="-1" aria-labelledby="globe-gallery-modal-role-${gid} globe-gallery-modal-name-${gid} globe-gallery-modal-position-${gid}" aria-describedby="globe-gallery-modal-description-${gid}">
    <div class="globe-gallery-modal-info">
      <p class="globe-gallery-modal-role-label" id="globe-gallery-modal-role-${gid}"></p>
      <h2 class="globe-gallery-modal-name" id="globe-gallery-modal-name-${gid}" tabindex="-1" aria-describedby="globe-gallery-modal-role-${gid} globe-gallery-modal-position-${gid}"></h2>
      <p class="globe-gallery-modal-description" id="globe-gallery-modal-description-${gid}" data-lenis-prevent></p>
      <ul class="globe-gallery-modal-badges"></ul>
    </div>
    <!-- sr-only alt for the WebGL photo; after the info so the heading is read first. -->
    <span class="globe-gallery-modal-image globe-gallery-sr-only" role="img"></span>
    <!-- Controls after the info scrim so they paint on top of it. -->
    <button class="globe-gallery-modal-nav globe-gallery-modal-nav-prev" type="button" daa-ll="prev_card-1--globe_card_modal" aria-label="${escapeHtml(labels.prevCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="globe-gallery-modal-nav globe-gallery-modal-nav-next" type="button" daa-ll="next_card-2--globe_card_modal" aria-label="${escapeHtml(labels.nextCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="globe-gallery-modal-counter" aria-hidden="true"></div>
    <button class="globe-gallery-modal-close" type="button" daa-ll="close-3--globe_card_modal" aria-label="${escapeHtml(labels.closeBtn)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <span class="globe-gallery-modal-position globe-gallery-sr-only" id="globe-gallery-modal-position-${gid}"></span>
  </dialog>
`;

// Per-page instance counter → unique id suffix per globe.
let globeInstanceSeq = 0;

// Build the block's DOM; returns the `gid` for this instance's unique ids.
export function buildGlobeDom(el, labels, { arcCopy, pullQuote }) {
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  el.innerHTML = buildMarkup(gid, labels);
  el.querySelector('.globe-gallery-arc-copy-title').textContent = arcCopy.title;
  el.querySelector('.globe-gallery-arc-copy-body').textContent = arcCopy.body;
  if (pullQuote) {
    el.querySelector('.globe-gallery-pullquote-quote').textContent = pullQuote.quote;
    el.querySelector('.globe-gallery-pullquote-name').textContent = pullQuote.name;
    el.querySelector('.globe-gallery-pullquote-role').textContent = pullQuote.role;
  } else {
    el.querySelector('.globe-gallery-pullquote-pin').remove();
  }
  return gid;
}
