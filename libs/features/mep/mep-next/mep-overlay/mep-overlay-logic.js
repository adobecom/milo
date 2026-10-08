import { HIGHLIGHT_KEYS } from './mep-overlay-highlight.js';
import { applyGeoSpoof } from '../spoof-country-ip.js';
import { getMarketConfig, marketsLangForLocale } from '../../../../utils/market.js';
import { hasMasSurfaces } from '../mep-mas.js';
import {
  getMetadata,
  getConfig,
  lingoActive,
  normCountryCode,
  getCookie,
  getGeoLocalePrefix,
  resolveDetectedMarketCountry,
  getPromoMepEnablement,
} from '../../../../utils/utils.js';
import { normalizePath } from '../../../personalization/personalization.js';
import {
  API_URLS,
  parseMepConfig,
  formatDate,
  buildManifestEntry,
  getManifestList,
  getMasSummary,
} from '../mep-next.js';

export { API_URLS, getManifestList, getMasSummary };

export const CARD_STORAGE_KEY = 'mep-expanded-cards';

export function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable; setting just won't persist
  }
}

export function getExpandedCards() {
  try {
    const parsed = JSON.parse(safeGetItem(CARD_STORAGE_KEY));
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
  } catch { return {}; }
}

// Session-scoped so the choice survives a preview reload but doesn't linger into
// a later QA session (a sticky "don't apply manifests" would be a footgun).
export const EXCLUDE_MANIFEST_PARAMS_KEY = 'mep-exclude-manifest-params';

export function getExcludeManifestParams() {
  try {
    return sessionStorage.getItem(EXCLUDE_MANIFEST_PARAMS_KEY) === 'true';
  } catch { return false; }
}

export function setExcludeManifestParams(on) {
  try {
    sessionStorage.setItem(EXCLUDE_MANIFEST_PARAMS_KEY, on ? 'true' : 'false');
  } catch { /* storage unavailable (private mode) — non-fatal */ }
}

export const toSlug = (str) => str.toLowerCase().replace(/@|\s+/g, (m) => (m === '@' ? 'a' : '-')).replace(/[^\w-]/g, '');

const TARGET_MAP = { postlcp: 'postlcp', true: 'on', false: 'off' };

function getManifestsFound() {
  const mepconfig = parseMepConfig();
  return mepconfig?.activities?.length ?? 0;
}

export function getPageId() {
  const mepConfig = parseMepConfig();
  const { page } = mepConfig ?? {};
  return page?.pageId ? `-${page.pageId}` : '';
}

function getFoundation() {
  return (getMetadata('foundation') || 'c1').toUpperCase();
}

function getTheme() {
  return (getMetadata('theme') || 'None');
}

function isTargetOn() {
  const { page } = parseMepConfig();
  const mepTarget = TARGET_MAP[getConfig().mep?.targetEnabled];
  const targetValue = mepTarget === undefined ? page.target : mepTarget;
  return !!targetValue && targetValue !== 'off';
}

function getTargetIntegration() {
  return isTargetOn() ? 'on' : 'off';
}

function getLoadTargetFaster() {
  if (!isTargetOn()) return 'n/a';
  return getMetadata('personalization-v2') ? 'on' : 'off';
}

function getPromoMetadata() {
  return getPromoMepEnablement() ? 'on' : 'off';
}

function getMepParam() {
  const { manifests } = getManifestList();
  return manifests.some((manifest) => manifest.source?.includes('mep param')) ? 'on' : 'off';
}

export function getLocale() {
  const { page } = parseMepConfig();
  return page.locale?.toLowerCase();
}

export function getLastSeen() {
  const { page } = parseMepConfig();
  return formatDate(page.lastSeen) || null;
}

function getPersonalizationMetadata() {
  const { page } = parseMepConfig();
  return page.personalization;
}

function getPerformanceConsent() {
  const { consentState } = getConfig().mep;
  return consentState?.performance ? 'on' : 'off';
}

function getAdvertisingConsent() {
  const { consentState } = getConfig().mep;
  return consentState?.advertising ? 'on' : 'off';
}

function getLingoUpdates() {
  const regionalFragments = document.querySelectorAll('[data-mep-lingo-roc]');
  const fallbackFragments = document.querySelectorAll('[data-mep-lingo-fallback]');
  return `${regionalFragments.length} of ${regionalFragments.length + fallbackFragments.length}`;
}

function getLangFirst() {
  return lingoActive() ? 'on' : 'off';
}

function getGeoFolder() {
  const { page } = parseMepConfig();
  return page.geo || 'Us (None)';
}

function getCountryCookie() {
  const searchParams = new URLSearchParams(window.location.search);
  const countryParam = normCountryCode(searchParams.get('country'));
  const countryCookie = countryParam
    || normCountryCode(getCookie('country'))
    || 'None';
  return countryCookie ?? '';
}

async function getUserCountry() {
  return await resolveDetectedMarketCountry() ?? '';
}

async function getGeoUser() {
  const { locale } = getConfig();
  if (!Object.keys(locale?.regions || {}).length || !lingoActive()) return 'Not Applicable';
  return (await getGeoLocalePrefix()) ? 'Supported' : 'Not Supported';
}

const resolvePairs = (pairs) => Promise.all(
  pairs.map(async ([label, value]) => [label, await value]),
);

export function getPageSummary() {
  return resolvePairs([
    ['Manifests Found', getManifestsFound()],
    ['Foundation', getFoundation()],
    ['Theme', getTheme()],
    ['Load Target Faster (v2)', getLoadTargetFaster()],
    ['Manifest Sources', resolvePairs([
      ['Target Integration', getTargetIntegration()],
      ['Personalization Metadata', getPersonalizationMetadata()],
      ['Promo Metadata', getPromoMetadata()],
      ['MEP Param', getMepParam()],
    ])],
  ]);
}

export function getConsentSummary() {
  return resolvePairs([
    ['Level 2 | Performance', getPerformanceConsent()],
    ['Level 4 | Advertising', getAdvertisingConsent()],
  ]);
}

export function getLingoSummary() {
  return resolvePairs([
    ['Mep Lingo Updates', getLingoUpdates()],
    ['Lang First | Lingo', getLangFirst()],
    ['Geo Folder', getGeoFolder()],
    ['Country Cookie', getCountryCookie()],
    ['User Country', getUserCountry()],
    ['Geo + User', getGeoUser()],
  ]);
}

export function getCaasSummary() {
  return null;
}

const RELEVANT_CONTENT_SELECTOR = [
  'merch-card', 'mas-field', '[data-mas-block]', '[data-wcs-osi]',
  '[data-caas-block]', '[data-card-url]',
  '[data-manifest-id]', '[data-code-manifest-id]', '[data-removed-manifest-id]',
  '[data-mep-lingo-roc]', '[data-mep-lingo-fallback]', '[data-fragment-default]', '[data-path]',
].join(',');

const isRelevantContentNode = (node) => (
  node.nodeType === Node.ELEMENT_NODE
  && (node.matches(RELEVANT_CONTENT_SELECTOR) || node.querySelector(RELEVANT_CONTENT_SELECTOR))
);

export const hasRelevantContentChanges = (mutations) => mutations.some(
  ({ addedNodes }) => [...addedNodes].some(isRelevantContentNode),
);

let additionalManifests;
export async function getAdditionalManifests() {
  const mepConfig = parseMepConfig();
  if (!mepConfig || additionalManifests) return additionalManifests;

  try {
    const url = `${API_URLS.pageDataByURL}${mepConfig.page.url}&lastSeen=week`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');

    const data = await response.json();
    const existingPaths = new Set(mepConfig.activities.map((a) => normalizePath(a.url)));
    const { pageId = 0 } = mepConfig.page;
    data.activities = data.activities
      .filter((a) => !existingPaths.has(normalizePath(a.url)))
      .map((a, mIdx) => buildManifestEntry({ ...a, source: 'MMM' }, mIdx, pageId, []));

    additionalManifests = data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching 7-day page data:', error);
  }
  return additionalManifests;
}

export async function setPreviewButton() {
  function getManifestInputParams(popup) {
    return [...popup.querySelectorAll('input[type="text"].mep-load-manifest')]
      .filter((input) => input.value)
      .map((input) => {
        try { return new URL(input.value).pathname || input.value; } catch { return input.value; }
      });
  }

  function getManifestOptionParams(popup) {
    return [...popup.querySelectorAll('.mep-manifest-variants option:checked')]
      .filter((option) => !option.closest('select')?.disabled && option.value)
      .map((option) => `${option.dataset.manifest}--${option.value}`);
  }

  function getSpoofGeoParams(popup) {
    return popup.querySelector('select.mep-spoof-geo')?.value || null;
  }

  const getCheckboxParam = (popup, id) => (popup.querySelector(`input[type="checkbox"]#${id}`)?.checked ? true : null);

  const popup = document.querySelector('#mep-drawer');
  const manifestParameter = [
    ...getManifestInputParams(popup),
    ...getManifestOptionParams(popup),
  ];

  const simulateHref = new URL(window.location.href);
  const setOrDelete = (key, value) => (value
    ? simulateHref.searchParams.set(key, value)
    : simulateHref.searchParams.delete(key));

  if (getCheckboxParam(popup, 'toggle-manifest-parameters')) {
    // Bare `mep` still shows the MEP button in prod (utils checks `mepParam === ''`).
    simulateHref.searchParams.set('mep', '');
  } else {
    simulateHref.searchParams.set('mep', manifestParameter.join('---'));
  }

  applyGeoSpoof(simulateHref.searchParams, getSpoofGeoParams(popup));
  setOrDelete('mepButton', getCheckboxParam(popup, 'toggle-preview-link') && 'off');
  setOrDelete(HIGHLIGHT_KEYS.mep, getCheckboxParam(popup, 'toggle-mep'));
  setOrDelete(HIGHLIGHT_KEYS.caas, getCheckboxParam(popup, 'toggle-caas'));
  setOrDelete(HIGHLIGHT_KEYS.mas, getCheckboxParam(popup, 'toggle-mas'));
  setOrDelete(HIGHLIGHT_KEYS.other, getCheckboxParam(popup, 'toggle-other-fragments'));
  simulateHref.searchParams.delete('mepFragments');
  // URLSearchParams serializes an empty value as `mep=`; drop the `=` for a bare `mep`.
  const href = simulateHref.href.replace(/([?&]mep)=(?=[&#]|$)/, '$1');
  popup.querySelector('.mep-footer a.con-button')?.setAttribute('href', href);
}

export function getLingoRegions() {
  const { locale } = getConfig();
  return Object.keys(locale?.regions || {});
}

export async function getMasRegions() {
  const { locale } = getConfig();
  const marketsConfig = await getMarketConfig();
  const lang = marketsConfig ? marketsLangForLocale(marketsConfig, locale) : null;
  return lang?.supportedRegions?.split(',').map((r) => r.trim().toLowerCase()).filter(Boolean) ?? [];
}

export const TOP_MARKETS = ['', 'jp', 'us', 'ca', 'au', 'kr', 'in', 'mx', 'br', 'de', 'gb', 'fr'];

export function getTopMarketsAvailability() {
  return true;
}

export function getLingoAvailability() {
  return lingoActive() && getLingoRegions().length > 0;
}

export async function getMasAvailability() {
  return hasMasSurfaces() && (await getMasRegions()).length > 0;
}

const toGeoOption = (key, currentAkamaiLocale) => ({
  value: key,
  label: key,
  selected: currentAkamaiLocale === key,
});

export async function findGeoGroupForLocale(locale) {
  const masRegions = await getMasRegions();
  const groups = [
    ['spoof-geo-top-markets', TOP_MARKETS],
    ['spoof-geo-mep-lingo', getLingoRegions()],
    ['spoof-geo-lingo-mas', masRegions],
  ];
  const match = groups.find(([, regions]) => regions.includes(locale));
  return match ? match[0] : null;
}

export async function getSpoofGeoOptions(id) {
  const urlParams = new URLSearchParams(window.location.search);
  const masMarketChecked = urlParams.get('masMarketChecked') === 'true';
  const currentAkamaiLocale = masMarketChecked ? null : urlParams.get('akamaiLocale');

  const toOption = (key) => {
    const region = key?.includes('_') ? key.split('_')[0] : key;
    const opt = toGeoOption(region, currentAkamaiLocale);
    return { ...opt, label: region ? region.toUpperCase() : "None (Don't spoof)" };
  };

  const sortOptions = (options) => {
    const noneOption = options.find((opt) => !opt.value);
    const rest = options
      .filter((opt) => opt.value)
      .sort((a, b) => a.label.localeCompare(b.label));
    return noneOption ? [noneOption, ...rest] : rest;
  };

  if (id === 'spoof-geo-top-markets' && getTopMarketsAvailability()) {
    return sortOptions(TOP_MARKETS.map(toOption));
  }

  if (id === 'spoof-geo-mep-lingo' && getLingoAvailability()) {
    return sortOptions(getLingoRegions().map(toOption));
  }

  if (id === 'spoof-geo-lingo-mas' && await getMasAvailability()) {
    return sortOptions((await getMasRegions()).map(toOption));
  }

  return [];
}
