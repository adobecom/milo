// eslint-disable-next-line import/no-relative-packages
import { createTag } from '../../../../utils/utils.js';

export function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

// Fallback only; authored inline so it stays localizable.
const DEFAULT_GALLERY_INSTRUCTIONS = 'Press Enter to enter the gallery, then Tab through the images.';

const DEFAULT_HINT = 'Click & Drag';
export const DEFAULT_MACHINE_TAG = 'acom_ff_globe_assets';
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

function parsePullQuote(row) {
  const quoteEl = row.querySelector('blockquote') || row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !quoteEl?.contains(p))
    .map((p) => p.textContent)
    .filter(Boolean);
  return {
    quote: quoteEl ? quoteEl.textContent : paras.shift() || '',
    name: paras[0] || '',
    role: paras[1] || '',
  };
}

// Move the authored <p>s into a container.
function renderParagraphs(container, paras) {
  if (container) container.replaceChildren(...paras);
}

const OPENING_MARK = /^[\p{Ps}\p{Pi}\p{Pf}"']/u;

function gutterOf(el) {
  return el ? parseFloat(getComputedStyle(el).paddingInlineStart) || 0 : 0;
}

function hangOpeningMark(el, room) {
  const text = el.textContent;
  if (!room || !OPENING_MARK.test(text)) return;
  const mark = [...text][0];
  const span = createTag('span', { class: 'hang-opening-quote' }, mark);
  el.replaceChildren(span, document.createTextNode(text.slice(mark.length)));
  const advance = span.offsetWidth;
  if (advance >= parseFloat(getComputedStyle(el).fontSize) * 0.8 || advance > room) {
    el.textContent = text;
  }
}

const QUOTE_TEXT = new WeakMap();

export function plainQuote(quoteEl) {
  if (!quoteEl) return '';
  if (!QUOTE_TEXT.has(quoteEl)) QUOTE_TEXT.set(quoteEl, quoteEl.textContent);
  const text = QUOTE_TEXT.get(quoteEl).trim();
  quoteEl.textContent = text;
  hangOpeningMark(quoteEl, gutterOf(quoteEl.closest('.firefly-globe-pullquote')));
  return text;
}

const ALT_MAX_CHARS = 120;
const FF_API_URL = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const FF_API_KEY = 'milo-ff-gallery-unity';

function componentRenditionHref(previewHref, id) {
  const base = previewHref.split('/rendition/')[0];
  const tmpl = 'format/{format}/dimension/{dimension}/size/{size}';
  return `${base}/dcx/${id}/rendition/output/resource/version/0/${tmpl}`;
}

function buildRenditionUrl(href, size, dimension = 'width') {
  return href
    .replace(/{format}/g, 'jpg')
    .replace(/{dimension}/g, dimension)
    .replace(/{size}/g, size);
}

const LANGUAGE_ALIASES = { no: 'nb' };
const parsedLocales = new Map();

const text = (v) => (typeof v === 'string' ? v.trim() : '');

function parseLocale(tag) {
  if (parsedLocales.has(tag)) return parsedLocales.get(tag);
  try {
    const { language, script, region } = new Intl.Locale(tag.replace(/_/g, '-')).maximize();
    parsedLocales.set(tag, { language: LANGUAGE_ALIASES[language] || language, script, region });
  } catch {
    parsedLocales.set(tag, null);
  }
  return parsedLocales.get(tag);
}

const langTag = (tag) => (tag && parseLocale(tag) ? tag.replace(/_/g, '-') : '');

function getLocalizedPrompt(prompts, locale) {
  const want = parseLocale(locale);
  const score = (key) => {
    const have = parseLocale(key);
    if (!want || !have || have.language !== want.language || have.script !== want.script) return 0;
    return have.region === want.region ? 2 : 1;
  };
  const entries = Object.entries(prompts || {}).filter(([, v]) => text(v));
  const match = (minScore) => entries.find(([key]) => score(key) >= minScore);
  const [key = '', value] = match(2) || match(1) || entries.find(([k]) => k === 'en-US') || entries[0] || [];
  return [langTag(key), text(value)];
}

function parseModelTags(machineTags) {
  const tags = machineTags || [];
  const modelId = (tags.find((t) => t.startsWith('modelId:')) || '').slice('modelId:'.length);
  const modelVersionName = (tags.find((t) => t.startsWith('modelVersionName:')) || '').slice('modelVersionName:'.length);
  return { modelId, modelVersionName };
}

function apiAssetToCard(asset, locale) {
  // eslint-disable-next-line no-underscore-dangle
  const rendition = asset?._links?.rendition;
  if (!rendition?.href || !asset.id) return null;

  const input = asset.custom?.input;
  const [lang, prompt] = [
    getLocalizedPrompt(input?.['firefly#prompts'], locale),
    [langTag(text(input?.['firefly#locale'])), text(input?.['firefly#originalPrompt'])],
    ['', text(asset.title)],
  ].find(([, v]) => v) || ['', ''];
  const fireflyUrl = asset.urn
    ? `https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=${asset.urn}`
    : null;
  const { modelId, modelVersionName } = parseModelTags(asset.machine_tags);
  return {
    renditionHref: componentRenditionHref(rendition.href, asset.id),
    maxWidth: rendition.max_width || null,
    maxHeight: rendition.max_height || null,
    alt: prompt.slice(0, ALT_MAX_CHARS),
    modelId,
    modelVersionName,
    prompt,
    lang,
    fireflyUrl,
    crossOrigin: 'anonymous',
  };
}

export async function fetchFireflyAssets(categoryId, locale, machineTag) {
  const loc = locale || 'en-US';
  const params = new URLSearchParams({
    size: '50',
    sort: 'updated_desc',
    include_pending_assets: 'false',
    cursor: '',
    category_id: categoryId,
  });
  // The API escapes single quotes / backslashes in machine tags with a backslash.
  if (machineTag) params.append('machine_tag', machineTag.replace(/(['\\])/g, '\\$1'));
  const url = `${FF_API_URL}?${params}`;
  try {
    const resp = await fetch(url, { headers: { 'x-api-key': FF_API_KEY } });
    if (!resp.ok) {
      window.lana?.log?.(
        `firefly-globe: assets request failed (${resp.status}): ${url}`,
        { tags: 'firefly-globe', severity: 'error' },
      );
      return null;
    }
    const data = await resp.json();
    // eslint-disable-next-line no-underscore-dangle
    const assets = (data._embedded?.assets || []);
    const cards = assets.map((a) => apiAssetToCard(a, loc)).filter(Boolean);
    if (!cards.length) {
      window.lana?.log?.(
        `firefly-globe: no usable assets (${assets.length} returned): ${url}`,
        { tags: 'firefly-globe', severity: 'warn' },
      );
      return null;
    }
    return cards;
  } catch (e) {
    window.lana?.log?.(
      `firefly-globe: assets fetch error (${e.message}): ${url}`,
      { tags: 'firefly-globe', severity: 'error' },
    );
    return null;
  }
}

export function fireflyRenditionUrl(card, px, axis = 'width') {
  if (!card?.renditionHref) return '';
  return buildRenditionUrl(card.renditionHref, Math.round(px), axis);
}

export function parseAuthoredContent(el) {
  const [cardsRow, hintTextRow, a11yRow, pullQuoteRow] = [...el.children];
  const firstCell = cardsRow?.querySelector(':scope > div');
  const [categoryId = '', machineTag = '', cgenId = '', ctaLabel = ''] = cellText(firstCell)
    .split(LABEL_DIVIDER)
    .map((s) => s.trim());
  const cells = hintTextRow ? [...hintTextRow.querySelectorAll(':scope > div')] : [];
  const parts = (a11yRow?.textContent ?? '').split(LABEL_DIVIDER).map((s) => s.trim());
  return {
    categoryId: categoryId || null,
    machineTag: machineTag || DEFAULT_MACHINE_TAG,
    cgenId,
    ctaLabel,
    touchHint: { paras: cellParas(cells[0]), text: cellText(cells[0]) || DEFAULT_TOUCH_HINT },
    hintText: cellText(cells[1]) || DEFAULT_HINT,
    instructions: parts[0] || DEFAULT_GALLERY_INSTRUCTIONS,
    labels: buildLabels(parts),
    pullQuote: pullQuoteRow ? parsePullQuote(pullQuoteRow) : null,
  };
}

// `gid` makes the modal's document-wide aria-labelledby/describedby id refs unique per instance.
const buildMarkup = (gid, labels, ctaLabel) => `
  <div class="firefly-globe-world">
    <canvas class="firefly-globe-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
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

  <div class="firefly-globe-pullquote-pin">
    <div class="firefly-globe-pullquote-rail">
      <figure class="firefly-globe-pullquote">
        <blockquote class="firefly-globe-pullquote-quote heading-1"></blockquote>
        <figcaption class="firefly-globe-pullquote-attribution">
          <p class="firefly-globe-pullquote-name body-lg"></p>
          <p class="firefly-globe-pullquote-role body-lg"></p>
        </figcaption>
      </figure>
    </div>
  </div>

  <div class="firefly-globe-modal" aria-hidden="true">
    <div class="firefly-globe-modal-backdrop"></div>
  </div>

  <canvas class="firefly-globe-modal-canvas" style="position:fixed;top:0;left:0;width:100%;height:100vh;z-index:14;display:none;pointer-events:none;"></canvas>

  <dialog class="firefly-globe-modal-chrome">
    <div class="firefly-globe-modal-info" data-lenis-prevent>
      <p class="firefly-globe-modal-name" id="firefly-globe-modal-name-${gid}" tabindex="-1" autofocus aria-describedby="firefly-globe-modal-prompt-${gid} firefly-globe-modal-position-${gid}">
        <img class="firefly-globe-modal-model-icon" alt="" aria-hidden="true">
        <span class="firefly-globe-modal-model-label"></span>
      </p>
      <span class="firefly-globe-modal-position sr-only" id="firefly-globe-modal-position-${gid}" aria-hidden="true"></span>
      <div class="firefly-globe-modal-prompt" id="firefly-globe-modal-prompt-${gid}" role="document"></div>
      <a class="firefly-globe-modal-cta con-button blue" target="_blank" rel="noopener noreferrer" daa-ll="open_in_firefly--globe_card_modal" hidden>${escapeHtml(ctaLabel)}</a>
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

export function buildGlobeDom(el, labels, { touchHint, ctaLabel = '', pullQuote = null }) {
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  el.innerHTML = buildMarkup(gid, labels, ctaLabel);
  const hintEl = el.querySelector('.firefly-globe-hint-text');
  if (touchHint.paras.length) renderParagraphs(hintEl, touchHint.paras);
  else hintEl.textContent = touchHint.text;
  if (pullQuote) {
    el.querySelector('.firefly-globe-pullquote-quote').textContent = pullQuote.quote;
    el.querySelector('.firefly-globe-pullquote-name').textContent = pullQuote.name;
    el.querySelector('.firefly-globe-pullquote-role').textContent = pullQuote.role;
  } else {
    el.querySelector('.firefly-globe-pullquote-pin')?.remove();
  }
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
