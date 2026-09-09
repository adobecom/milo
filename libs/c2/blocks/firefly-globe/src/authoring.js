export function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

// Fallback only; authored inline so it stays localizable.
const DEFAULT_GALLERY_INSTRUCTIONS = 'Press Enter to enter the gallery, then Tab through the images.';

const DEFAULT_HINT = 'Click & Drag';
const DEFAULT_TOUCH_HINT = 'Click and drag to rotate. Tap to dive deep into the artwork.';

const LABEL_DIVIDER = '||';
const DEFAULT_LABELS = [
  DEFAULT_GALLERY_INSTRUCTIONS,
  'Rotate left', 'Rotate right', 'Pause spinning', 'Resume spinning',
  'Previous card', '{index} of {count}', 'Next card', 'Close',
];
const CARD_TPL_INDEX = 6;

function buildLabels(parts) {
  const at = (i) => parts[i] || DEFAULT_LABELS[i];
  const cardTplRaw = parts[CARD_TPL_INDEX];
  const cardTpl = cardTplRaw?.includes('{index}') && cardTplRaw?.includes('{count}')
    ? cardTplRaw
    : DEFAULT_LABELS[CARD_TPL_INDEX];
  return {
    rotateLeft: at(1),
    rotateRight: at(2),
    pauseSpin: at(3),
    resumeSpin: at(4),
    prevCard: at(5),
    nextCard: at(7),
    closeBtn: at(8),
    cardLabel: (index, count) => cardTpl
      .replace('{index}', String(index))
      .replace('{count}', String(count)),
  };
}

function cellText(cell) {
  if (!cell) return '';
  const paras = [...cell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
  return (paras.length ? paras.join(' ') : cell.textContent).trim();
}

function cellParas(cell) {
  return cell ? [...cell.querySelectorAll('p')].filter((x) => x.textContent.trim()) : [];
}

// Move the authored <p>s into a container.
export function renderParagraphs(container, paras) {
  if (container) container.replaceChildren(...paras);
}

// The <em>/<strong> text, but only when it IS the whole paragraph.
function wholeParaChild(p, selector) {
  const child = p.querySelector(selector);
  const text = child?.textContent.trim();
  return text && text === p.textContent.trim() ? text : '';
}

function parseFragmentCardSegment(nodes) {
  let img = null;
  let prompt = ''; let name = '';

  nodes.forEach((node) => {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) return;

    if (/^H[1-6]$/.test(tag)) {
      if (!name) name = node.textContent.trim();
    } else if (tag === 'P') {
      const inlineImg = node.querySelector('img'); // <picture> or bare <img>; first wins
      if (inlineImg) {
        if (!img) img = inlineImg;
        return;
      }
      if (!prompt) {
        const em = wholeParaChild(node, 'em');
        if (em) { prompt = em; return; }
      }
      if (!name) {
        const strong = wholeParaChild(node, 'strong');
        if (strong) { name = strong; }
      }
    } else if (tag === 'PICTURE' || tag === 'IMG') {
      const bare = tag === 'IMG' ? node : node.querySelector('img');
      if (!img && bare) img = bare;
    }
  });

  if (!img) {
    const label = nodes.map((n) => n.textContent || '').join(' ').trim().slice(0, 60);
    window.lana?.log?.(
      `firefly-globe: fragment section skipped, no image — "${label}"`,
      { tags: 'firefly-globe', severity: 'info' },
    );
    return null;
  }
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    alt: (img.getAttribute('alt') || '').trim(),
    name,
    prompt,
  };
}

const CARD_CONTENT_TAGS = /^(P|PICTURE|IMG|H[1-6])$/;

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => CARD_CONTENT_TAGS.test(n.nodeName));

  if (!hasDirectContent) {
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

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

const FF_API_URL = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const FF_API_KEY = 'milo-ff-gallery-unity';

function buildRenditionUrl(href, size) {
  return href
    .replace(/{format}/g, 'jpg')
    .replace(/{dimension}/g, 'width')
    .replace(/{size}/g, size);
}

function getLocalizedPrompt(prompts, locale) {
  if (!prompts) return '';
  return prompts[locale]
    || prompts[locale.split('-')[0]]
    || prompts['en-US']
    || Object.values(prompts)[0]
    || '';
}

function apiAssetToCard(asset, locale, cgenId) {
  // eslint-disable-next-line no-underscore-dangle
  const rendition = asset?._links?.rendition;
  if (!rendition?.href) return null;
  const width = Math.min(rendition.max_width || 1024, 1024);
  const img = buildRenditionUrl(rendition.href, width);
  // eslint-disable-next-line no-underscore-dangle
  const owner = asset._embedded?.owner;
  const name = owner?.display_name
    || `${owner?.first_name || ''} ${owner?.last_name || ''}`.trim()
    || owner?.user_name
    || '';

  // eslint-disable-next-line no-underscore-dangle
  const images = owner?._links?.images;
  let avatarUrl = '';
  if (images?.length) {
    const sorted = [...images].sort((a, b) => Math.abs(a.width - 50) - Math.abs(b.width - 50));
    avatarUrl = sorted[0].href;
  }

  const prompts = asset.custom?.input?.['firefly#prompts'];
  const role = getLocalizedPrompt(prompts, locale);
  let fireflyUrl = null;
  if (asset.urn) {
    fireflyUrl = `https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=${asset.urn}`;
    if (cgenId) fireflyUrl += `&promoid=${cgenId}&mv=other`;
  }
  return {
    img,
    alt: '',
    name,
    avatarUrl,
    prompt: role,
    fireflyUrl,
    crossOrigin: 'anonymous', // cdn.cp.adobe.io is cross-origin; required for WebGL texSubImage2D
  };
}

export async function fetchFireflyAssets(categoryId, locale = 'en-US', cgenId = '') {
  try {
    const resp = await fetch(
      `${FF_API_URL}?size=50&sort=updated_desc&include_pending_assets=false&cursor=&category_id=${categoryId}`,
      { headers: { 'x-api-key': FF_API_KEY } },
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    // eslint-disable-next-line no-underscore-dangle
    const assets = (data._embedded?.assets || []);
    const cards = assets.map((a) => apiAssetToCard(a, locale, cgenId)).filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

export async function fetchFragmentCards(href) {
  try {
    const resp = await fetch(`${href}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    // DOMParser yields an inert document, so card <img>/<picture> never fetch here — only the
    // right-sized texture URL is downloaded.
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.body.querySelectorAll(':scope > div')]
      .flatMap((section) => parseFragmentCards(section))
      .filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

// Cards ask by height, the modal by width; non-media URLs pass through.
export function optimizeImgUrl(src, px, axis = 'width') {
  if (!src) return src;
  try {
    const url = new URL(src, window.location.href);
    if (!/(^|\/)media_[0-9a-f]/i.test(url.pathname)) return src;
    return `${url.origin}${url.pathname}?${axis}=${Math.round(px)}&format=webply`;
  } catch (e) {
    return src;
  }
}

// Positional rows. Fragment links are authored with #_dnb so Milo skips auto-resolution;
// the hash is stripped before fetching.
// Authoring: [cardsRow, hintTextRow, a11yRow]
// cardsRow first cell: "categoryId || cgenId || ctaLabel" (API) or a fragment link (legacy).
export function parseAuthoredContent(el) {
  const [cardsRow, hintTextRow, a11yRow] = [...el.children];
  const firstCell = cardsRow?.querySelector(':scope > div');
  const [categoryId = '', cgenId = '', ctaLabel = ''] = cellText(firstCell)
    .split(LABEL_DIVIDER)
    .map((s) => s.trim());
  const fragmentLink = cardsRow?.querySelector('a[href]');
  // hintTextRow is two cells: the barrel's bottom-row copy, then the hint plane / cursor label.
  const cells = hintTextRow ? [...hintTextRow.querySelectorAll(':scope > div')] : [];
  const parts = (a11yRow?.textContent ?? '').split(LABEL_DIVIDER).map((s) => s.trim());
  return {
    categoryId: categoryId || null,
    cgenId,
    ctaLabel,
    fragmentHref: fragmentLink ? fragmentLink.href.replace(/#.*$/, '') : null,
    touchHint: { paras: cellParas(cells[0]), text: cellText(cells[0]) || DEFAULT_TOUCH_HINT },
    hintText: cellText(cells[1]) || DEFAULT_HINT,
    instructions: parts[0] || DEFAULT_GALLERY_INSTRUCTIONS,
    labels: buildLabels(parts),
  };
}

// `gid` makes the modal's document-wide aria-labelledby/describedby id refs unique per instance.
const buildMarkup = (gid, labels, ctaLabel) => `
  <div class="firefly-globe-world">
    <canvas class="firefly-globe-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
    <div class="firefly-globe-hover-card" aria-hidden="true">
      <div class="firefly-globe-hover-user">
        <img class="firefly-globe-hover-avatar" alt="" loading="lazy">
        <span class="firefly-globe-hover-name"></span>
      </div>
      <p class="firefly-globe-hover-prompt"></p>
    </div>
    <div class="firefly-globe-controls">
      <button class="firefly-globe-control firefly-globe-spin-toggle" type="button" daa-ll="pause_spin--firefly_globe" aria-label="${escapeHtml(labels.pauseSpin)}">
        <svg class="firefly-globe-icon-pause" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="8" y="5" width="3" height="14" rx="1" fill="currentColor"/><rect x="13" y="5" width="3" height="14" rx="1" fill="currentColor"/></svg>
        <svg class="firefly-globe-icon-play" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>
      </button>
      <div class="firefly-globe-hint">
        <button class="firefly-globe-control firefly-globe-rotate" type="button" data-dir="-1" daa-ll="rotate_left--firefly_globe" aria-label="${escapeHtml(labels.rotateLeft)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="firefly-globe-hint-text"></div>
        <button class="firefly-globe-control firefly-globe-rotate" type="button" data-dir="1" daa-ll="rotate_right--firefly_globe" aria-label="${escapeHtml(labels.rotateRight)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div class="firefly-globe-modal" aria-hidden="true">
    <div class="firefly-globe-modal-backdrop"></div>
  </div>

  <canvas class="firefly-globe-modal-canvas" style="position:fixed;top:0;left:0;width:100%;height:100vh;z-index:14;display:none;pointer-events:none;"></canvas>

  <dialog class="firefly-globe-modal-chrome">
    <div class="firefly-globe-modal-info" data-lenis-prevent>
      <p class="firefly-globe-modal-name" id="firefly-globe-modal-name-${gid}" tabindex="-1" autofocus aria-describedby="firefly-globe-modal-prompt-${gid} firefly-globe-modal-position-${gid}"></p>
      <span class="firefly-globe-modal-position sr-only" id="firefly-globe-modal-position-${gid}" aria-hidden="true"></span>
      <div class="firefly-globe-modal-prompt" id="firefly-globe-modal-prompt-${gid}" role="document"></div>
      <a class="firefly-globe-modal-cta" target="_blank" rel="noopener noreferrer" daa-ll="open_in_firefly--globe_card_modal" hidden>${escapeHtml(ctaLabel)}</a>
    </div>
    <!-- sr-only alt for the WebGL photo; after the info so the heading is read first. -->
    <span class="firefly-globe-modal-image sr-only" role="img"></span>
    <!-- Controls after the info scrim so they paint on top of it. -->
    <button class="firefly-globe-modal-nav firefly-globe-modal-nav-prev" type="button" daa-ll="prev_card-1--globe_card_modal" aria-label="${escapeHtml(labels.prevCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="firefly-globe-modal-counter" aria-hidden="true"></div>
    <span class="firefly-globe-modal-position sr-only" role="note"></span>
    <button class="firefly-globe-modal-nav firefly-globe-modal-nav-next" type="button" daa-ll="next_card-2--globe_card_modal" aria-label="${escapeHtml(labels.nextCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="firefly-globe-modal-close" type="button" daa-ll="close-3--globe_card_modal" aria-label="${escapeHtml(labels.closeBtn)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <span class="firefly-globe-modal-announce sr-only" aria-live="polite"></span>
  </dialog>
`;

let globeInstanceSeq = 0;

export function buildGlobeDom(el, labels, { touchHint, ctaLabel = '' }) {
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  el.innerHTML = buildMarkup(gid, labels, ctaLabel);
  const hintEl = el.querySelector('.firefly-globe-hint-text');
  if (touchHint.paras.length) renderParagraphs(hintEl, touchHint.paras);
  else hintEl.textContent = touchHint.text;
  return gid;
}

const SCATTER_KEY = 'One day I will return to your side';
const SCATTER_MOD = 2147483647;

function seedFrom(key) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % SCATTER_MOD;
  return h || 1;
}

export function scatterCards(cards) {
  const out = cards.map((card, i) => ({ ...card, authoredIndex: i }));
  let rand = seedFrom(SCATTER_KEY);
  for (let i = out.length - 1; i > 0; i -= 1) {
    rand = (rand * 48271) % SCATTER_MOD;
    const j = Math.floor((rand / SCATTER_MOD) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
