import { escapeHtml, LABEL_DIVIDER, cellText, buildGlobeSkeleton, parseCommonRows } from '../../../../utils/globe/ui.js';

export const DEFAULT_MACHINE_TAG = 'acom_ff_globe_assets';

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
  return {
    categoryId: categoryId || null,
    machineTag: machineTag || DEFAULT_MACHINE_TAG,
    cgenId,
    ctaLabel,
    ...parseCommonRows(hintTextRow, a11yRow, pullQuoteRow),
  };
}

// `gid` makes the modal's document-wide aria-labelledby/describedby id refs unique per instance.

const CANVAS_STYLE = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;pointer-events:auto;touch-action:pan-y;';

const modalInfoHtml = (labels, ctaLabel) => (gid) => `
    <div class="globe-modal-info" data-lenis-prevent>
      <p class="globe-modal-name" id="globe-modal-name-${gid}" tabindex="-1" autofocus aria-describedby="globe-modal-description-${gid} globe-modal-position-${gid}">
        <img class="globe-modal-model-icon" alt="" aria-hidden="true">
        <span class="globe-modal-model-label"></span>
      </p>
      <span class="globe-modal-position sr-only" id="globe-modal-position-${gid}" aria-hidden="true"></span>
      <div class="globe-modal-description" id="globe-modal-description-${gid}" role="document"></div>
      <a class="globe-modal-cta con-button blue" target="_blank" rel="noopener noreferrer" daa-ll="open_in_firefly--globe_card_modal" hidden>${escapeHtml(ctaLabel)}</a>
    </div>
`;

export function buildGlobeDom(el, labels, { touchHint, ctaLabel = '', pullQuote = null }) {
  return buildGlobeSkeleton(el, 'firefly-globe', labels, {
    touchHint,
    pullQuote,
    canvasStyle: CANVAS_STYLE,
    modalInfoHtml: modalInfoHtml(labels, ctaLabel),
  });
}

const MODEL_ICON = {
  google: 'google.svg',
  openai: 'gpt.svg',
  flux: 'flux.svg',
  ideogram: 'ideogram.svg',
  kling: 'kling.svg',
  luma: 'luma.svg',
  pika: 'pika.svg',
  runway: 'runway.svg',
  seedance: 'seedance.svg',
  topaz: 'topaz.svg',
  firefly: 'firefly.svg',
};

function setLang(el, lang) {
  if (lang) el.lang = lang;
  else el.removeAttribute('lang');
}

export function renderModalContent(targetEl, meta, iconBaseUrl) {
  const nameEl = targetEl.querySelector('.globe-modal-name');
  const modelLabel = meta.modelVersionName || meta.modelId || '';
  if (nameEl) {
    const iconEl = nameEl.querySelector('.globe-modal-model-icon');
    const labelEl = nameEl.querySelector('.globe-modal-model-label');
    const file = MODEL_ICON[meta.modelId?.toLowerCase()];
    const url = (file && iconBaseUrl) ? `${iconBaseUrl}${file}` : '';
    if (iconEl) {
      if (url) { iconEl.src = url; iconEl.removeAttribute('hidden'); } else iconEl.setAttribute('hidden', '');
    }
    if (labelEl) labelEl.textContent = modelLabel;
  }
  const descEl = targetEl.querySelector('.globe-modal-description');
  if (descEl) {
    descEl.textContent = meta.prompt || '';
    setLang(descEl, meta.lang);
  }
  const ctaEl = targetEl.querySelector('.globe-modal-cta');
  if (ctaEl) {
    if (meta.fireflyUrl) {
      ctaEl.href = meta.fireflyUrl;
      ctaEl.removeAttribute('hidden');
    } else {
      ctaEl.removeAttribute('href');
      ctaEl.setAttribute('hidden', '');
    }
  }
  return { descEl, speech: [[modelLabel], [meta.prompt, meta.lang]] };
}
