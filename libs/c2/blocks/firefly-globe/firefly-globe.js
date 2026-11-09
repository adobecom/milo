import { getConfig } from '../../../utils/utils.js';
import {
  clamp01, createBaseFrame, createBaseFrameInput, deriveBaseFrame, logGlobe, travelSpanPx,
  TEXT_APPEAR_START,
} from '../../../utils/globe/core.js';
import {
  escapeHtml, setLang, LABEL_DIVIDER, cellText, buildGlobeSkeleton, fetchGlobeData, parseCommonRows,
} from '../../../utils/globe/authoring.js';
import { initGlobeBlock } from '../../../utils/globe/runtime.js';

const NAME = 'firefly-globe';

export const DEFAULT_MACHINE_TAG = 'acom_ff_globe_assets';

const ALT_MAX_CHARS = 120;
const FF_API_URL = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const FF_API_KEY = 'milo-ff-gallery-unity';

function componentRenditionHref(previewHref, id) {
  const base = previewHref.split('/rendition/')[0];
  const tmpl = 'format/{format}/dimension/{dimension}/size/{size}';
  return `${base}/dcx/${id}/rendition/output/resource/version/0/${tmpl}`;
}

const LANGUAGE_ALIASES = { no: 'nb' };
const parsedLocales = new Map();

const text = (v) => (typeof v === 'string' ? v.trim() : '');
const bcp47 = (tag) => tag.replaceAll('_', '-');

function parseLocale(tag) {
  if (parsedLocales.has(tag)) return parsedLocales.get(tag);
  try {
    const { language, script, region } = new Intl.Locale(bcp47(tag)).maximize();
    parsedLocales.set(tag, { language: LANGUAGE_ALIASES[language] ?? language, script, region });
  } catch {
    parsedLocales.set(tag, null);
  }
  return parsedLocales.get(tag);
}

const langTag = (tag) => (tag && parseLocale(tag) ? bcp47(tag) : '');

function getLocalizedPrompt(prompts, locale) {
  const want = parseLocale(locale);
  const score = (key) => {
    const have = parseLocale(key);
    if (!want || !have || have.language !== want.language || have.script !== want.script) return 0;
    return have.region === want.region ? 2 : 1;
  };
  const entries = Object.entries(prompts ?? {}).filter(([, v]) => text(v));
  const match = (minScore) => entries.find(([key]) => score(key) >= minScore);
  const [key = '', value] = match(2) ?? match(1) ?? entries.find(([k]) => k === 'en-US') ?? entries[0] ?? [];
  return [langTag(key), text(value)];
}

function tagValue(tags, prefix) {
  return tags?.find((t) => t.startsWith(prefix))?.slice(prefix.length) ?? '';
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
  ].find(([, v]) => v) ?? ['', ''];
  const fireflyUrl = asset.urn
    ? `https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=${asset.urn}`
    : null;
  return {
    renditionHref: componentRenditionHref(rendition.href, asset.id),
    maxWidth: rendition.max_width || null,
    maxHeight: rendition.max_height || null,
    alt: prompt.slice(0, ALT_MAX_CHARS),
    modelId: tagValue(asset.machine_tags, 'modelId:'),
    modelVersionName: tagValue(asset.machine_tags, 'modelVersionName:'),
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
  return fetchGlobeData(NAME, url, { headers: { 'x-api-key': FF_API_KEY } }, async (resp) => {
    const data = await resp.json();
    // eslint-disable-next-line no-underscore-dangle
    const assets = data._embedded?.assets ?? [];
    const cards = assets.map((a) => apiAssetToCard(a, loc)).filter(Boolean);
    if (!cards.length) {
      logGlobe(NAME, `no usable assets (${assets.length} returned): ${url}`);
      return null;
    }
    if (cards.length < assets.length) {
      logGlobe(NAME, `${assets.length - cards.length} of ${assets.length} assets skipped, no rendition: ${url}`, 'info');
    }
    return cards;
  });
}

const FF_SOURCE = 'adobe-com';
const DEFAULT_FF_CAMPAIGN = 'marketing-page';
const LEGACY_CAMPAIGN_ID = 'NQCJQWSV';

export function appendFireflyParams(cards, campaignId) {
  const campaign = !campaignId || campaignId === LEGACY_CAMPAIGN_ID
    ? DEFAULT_FF_CAMPAIGN : campaignId;
  const params = new URLSearchParams({ ff_source: FF_SOURCE, ff_campaign: campaign });
  cards.forEach((card) => {
    if (card.fireflyUrl) card.fireflyUrl += `&${params}`;
  });
}

export function fireflyRenditionUrl(card, px, axis = 'width') {
  if (!card?.renditionHref) return '';
  return card.renditionHref
    .replace('{format}', 'jpg')
    .replace('{dimension}', axis)
    .replace('{size}', Math.round(px));
}

export function parseAuthoredContent(el) {
  const [cardsRow, hintTextRow, a11yRow, pullQuoteRow] = [...el.children];
  const firstCell = cardsRow?.querySelector(':scope > div');
  const [categoryId = '', machineTag = '', campaignId = '', ctaLabel = ''] = cellText(firstCell)
    .split(LABEL_DIVIDER)
    .map((s) => s.trim());
  return {
    categoryId: categoryId || null,
    machineTag: machineTag || DEFAULT_MACHINE_TAG,
    campaignId,
    ctaLabel,
    ...parseCommonRows(hintTextRow, a11yRow, pullQuoteRow),
  };
}

const modalInfoHtml = (ctaLabel) => (gid) => `
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

export function buildGlobeDom(el, { labels, touchHint, ctaLabel = '', pullQuote = null }) {
  return buildGlobeSkeleton(el, NAME, {
    labels,
    touchHint,
    pullQuote,
    modalInfoHtml: modalInfoHtml(ctaLabel),
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

export function renderModalContent(targetEl, meta, iconBaseUrl) {
  const modelLabel = meta.modelVersionName || meta.modelId || '';
  const iconEl = targetEl.querySelector('.globe-modal-model-icon');
  const file = MODEL_ICON[meta.modelId?.toLowerCase()];
  iconEl.hidden = !(file && iconBaseUrl);
  if (!iconEl.hidden) iconEl.src = `${iconBaseUrl}${file}`;
  targetEl.querySelector('.globe-modal-model-label').textContent = modelLabel;
  const descEl = targetEl.querySelector('.globe-modal-description');
  descEl.textContent = meta.prompt || '';
  setLang(descEl, meta.lang);
  const ctaEl = targetEl.querySelector('.globe-modal-cta');
  ctaEl.hidden = !meta.fireflyUrl;
  if (meta.fireflyUrl) ctaEl.href = meta.fireflyUrl;
  else ctaEl.removeAttribute('href');
  return { descEl, speech: [[modelLabel], [meta.prompt, meta.lang]] };
}

export const TRAVEL_EASE_POW = 3;

export const SPHERE_INTERACTIVE_T = 0.02;

export const createFrame = createBaseFrame;
export const createFrameInput = createBaseFrameInput;

export function deriveFrame(frame, input) {
  const { blockDocTop, blockHeight, travelPx, viewportH } = input;

  const scrolled = deriveBaseFrame(frame, input) - blockDocTop;

  frame.sphereFormT = clamp01(1 + scrolled / Math.max(1, viewportH));
  frame.scrollT = clamp01(scrolled / travelSpanPx({ blockHeight, travelPx }));
  frame.interactive = frame.sphereFormT >= SPHERE_INTERACTIVE_T;
  frame.orientReset = !frame.interactive;
  frame.hintEntryT = clamp01((frame.sphereFormT - TEXT_APPEAR_START) / (1 - TEXT_APPEAR_START));
  frame.hintRetirable = frame.sphereFormT >= 1;
  return frame;
}

const BREAKPOINTS = {
  sm: {
    minWidth: 0,
    SPHERE_R: 16,
    CARD_H_SPHERE: 11.0,
    CAM_Z_ENTRY: 100,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -18,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.5,
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    CYL_COLS_FIT: 0.65,
    DRAG_GEARING: 0.53, // fraction of 1:1 surface tracking
  },
  md: {
    minWidth: 768,
    SPHERE_R: 35,
    CARD_H_SPHERE: 10,
    CAM_Z_ENTRY: 140,
    CAM_Z_SPHERE: 80,
    CAM_Z_END: -30,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.6,
    CARD_FACE_CAMERA: 0, // 0 = radially outward (true sphere)
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking
  },
};

const CSS_ENTRY_LIFT = !!window.CSS?.supports?.('animation-timeline: view()');
const ICON_BASE_URL = new URL('./icons/', import.meta.url).href;
const ENTRY_LIFT_H = 0.45;

function createHooks(ctx) {
  return {
    entryCamZ: () => ctx.bp.CAM_Z_ENTRY,
    viewOffsetY({ sphereFormT }) {
      const release = CSS_ENTRY_LIFT || sphereFormT >= 1 ? 0 : 1 - sphereFormT ** 2;
      return ctx.navH / 2 - ENTRY_LIFT_H * ctx.H * release;
    },
    browseScrollTop: () => Math.ceil(ctx.blockDocTop),
  };
}

const SPEC = {
  name: NAME,
  breakpoints: BREAKPOINTS,
  timeline: { createFrame, createFrameInput, deriveFrame, TRAVEL_EASE_POW },
  pullQuote: {},
  modal: {
    hoistToBody: true,
    tracksCanvasTop: true,
    renderContent: (el, meta) => renderModalContent(el, meta, ICON_BASE_URL),
  },
  cardImageUrl: (meta, cap) => fireflyRenditionUrl(meta, cap, 'height'),
  modalImageUrl(meta, cap) {
    const axis = (meta.maxHeight || 0) > (meta.maxWidth || 0) ? 'height' : 'width';
    return fireflyRenditionUrl(meta, cap, axis);
  },
  createHooks,
  parseContent: parseAuthoredContent,
  buildDom: buildGlobeDom,
  async loadCards({ categoryId, machineTag, campaignId }) {
    if (!categoryId) {
      logGlobe(NAME, 'no categoryId authored');
      return null;
    }
    const cards = await fetchFireflyAssets(categoryId, getConfig().locale?.ietf, machineTag);
    if (cards) appendFireflyParams(cards, campaignId);
    return cards;
  },
};

export default function init(el) {
  return initGlobeBlock(el, SPEC);
}
