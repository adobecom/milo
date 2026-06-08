import {
  MAS_OSI_SELECTOR,
  watchForMasContent,
  unwatchForMasContent,
  injectMasBadges,
  removeMasBadges,
} from '../mep-mas.js';
import {
  injectCaasBadges,
  removeCaasBadges,
  watchForCaasBlocks,
  unwatchForCaasBlocks,
} from '../mep-caas.js';
import { mepMasSubCollections } from '../mep-mas-subcollection.js';
import {
  getMetadata,
  getConfig,
  lingoActive,
  normCountryCode,
  getCookie,
  getGeoLocalePrefix,
  resolveDetectedMarketCountry,
} from '../../../../utils/utils.js';
import {
  US_GEO,
  getFileName,
  normalizePath,
} from '../../../personalization/personalization.js';
import {
  getMiloLocaleSettings,
  isMasGeoDetectionEnabled,
} from '../../../../blocks/merch/merch.js';

const HIGHLIGHT_KEYS = {
  mep: 'mepMepHighlight',
  caas: 'mepCaasHighlight',
  mas: 'mepMasHighlight',
  other: 'mepOtherHighlight',
};

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';

export const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page`,
  pageDataByURL: `${API_DOMAIN}/get-page?url=`,
  save: `${API_DOMAIN}/save-mep-call`,
  report: `${API_DOMAIN}/get-report`,
};

const STAGE_ALLOWED_HOSTS = [
  'business.stage.adobe.com',
  'www.stage.adobe.com',
  'milo.stage.adobe.com',
];

function buildResult(domain, path, prefix) {
  return { page: path.replace(`/${prefix}/`, '/'), url: `${domain}${path}` };
}

function parsePageAndUrl(config, windowLocation, prefix) {
  const { stageDomainsMap, env } = config;
  const { pathname, origin } = windowLocation;
  const originHost = origin.replace('https://', '');

  if (env?.name === 'prod' || !stageDomainsMap || STAGE_ALLOWED_HOSTS.includes(originHost)) {
    return buildResult(origin.replace('stage.adobe.com', 'adobe.com'), pathname, prefix);
  }

  const mappedDomain = Object.keys(stageDomainsMap).find((key) => {
    try {
      return STAGE_ALLOWED_HOSTS.includes(new URL(`https://${key}`).host);
    } catch (e) {
      /* c8 ignore next */
      return false;
    }
  });

  const domain = mappedDomain ? `https://${mappedDomain}` : origin;
  let path = pathname.replace('/homepage/index-loggedout', '/');
  if (!path.endsWith('/') && !path.endsWith('.html') && !domain.includes('milo')) {
    path += '.html';
  }

  return buildResult(domain.replace('stage.adobe.com', 'adobe.com'), path, prefix);
}

function toActivity({
  name, event, manifest, variantNames, selectedVariantName,
  disabled, analyticsTitle, source, geoRestriction, mktgAction,
}) {
  let pathname = manifest;
  try { pathname = new URL(manifest).pathname; } catch (e) { /* do nothing */ }
  return {
    targetActivityName: name,
    variantNames,
    selectedVariantName,
    url: manifest,
    disabled,
    source,
    eventStart: event?.start,
    eventEnd: event?.end,
    pathname,
    analyticsTitle,
    geoRestriction,
    mktgAction,
  };
}

function parseMepConfig() {
  const config = getConfig();
  const { mep, locale } = config;
  if (!mep || !locale) return null;

  const { experiments, prefix, highlight } = mep;
  const { page, url } = parsePageAndUrl(config, window.location, prefix);

  return {
    page: {
      url,
      page,
      target: getMetadata('target') || 'off',
      personalization: getMetadata('personalization') ? 'on' : 'off',
      geo: prefix === US_GEO ? '' : prefix,
      locale: locale?.ietf,
      region: locale?.region,
      highlight,
    },
    activities: experiments.map(toActivity),
  };
}

function formatDate(dateTime, format = 'local') {
  if (!dateTime) return '';
  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  if (format === 'iso') return dateObj.toISOString();
  const date = dateObj.toLocaleDateString(false, { year: 'numeric', month: 'short', day: 'numeric' });
  const time = dateObj.toLocaleTimeString(false, { timeStyle: 'short' });
  return `${date} ${time}`;
}

const TARGET_MAP = { postlcp: 'postlcp', true: 'on', false: 'off' };

export function getManifestList() {
  const mepConfig = parseMepConfig();
  const { activities, page } = mepConfig;
  const { pageId = 0 } = page;
  const manifestParameter = [];

  const manifests = activities.map((manifest, mIdx) => {
    const {
      url,
      variantNames,
      selectedVariantName = 'default',
      targetActivityName,
      source,
      analyticsTitle,
      eventStart,
      eventEnd,
      disabled,
      geoRestriction,
      mktgAction,
    } = manifest;

    const editPath = normalizePath(url);
    const variants = typeof variantNames === 'string' ? variantNames.split('||') : variantNames;
    const isDefaultSelected = !variantNames.includes(selectedVariantName) && pageId === 0;

    if (isDefaultSelected) manifestParameter.push(`${url}--default`);

    const options = [
      { name: `${editPath}${pageId}`, value: '', title: 'none', label: "None (Don't add manifest)" },
      {
        name: `${editPath}${pageId}`,
        value: 'default',
        id: `${editPath}${pageId}--default`,
        dataManifest: editPath,
        title: 'Default (control)',
        label: 'Default (control)',
        selected: isDefaultSelected,
      },
    ];

    variants.forEach((variant) => {
      const isSelected = variant === selectedVariantName;
      if (isSelected) manifestParameter.push(`${url}--${variant}`);
      options.push({
        name: `${editPath}${pageId}`,
        value: variant,
        id: `${editPath}${pageId}--${variant}`,
        dataManifest: editPath,
        title: variant,
        label: variant,
        selected: isSelected,
      });
    });

    return {
      index: mIdx + 1,
      editUrl: url,
      fileName: getFileName(url),
      analyticsTitle,
      targetActivityName: targetActivityName ?? null,
      isDefaultSelected,
      selectedVariantName,
      source: Array.isArray(source) ? source.join(', ') : source,
      mktgAction,
      geoRestriction: geoRestriction ? geoRestriction.toUpperCase() : null,
      showActive: !!(eventStart && eventEnd) || !!disabled,
      isActive: disabled ? 'inactive' : 'active',
      eventStart: eventStart ? formatDate(eventStart) : null,
      eventStartIso: eventStart ? formatDate(eventStart, 'iso') : null,
      eventEnd: eventEnd ? formatDate(eventEnd) : null,
      lastSeen: manifest.lastSeen ? formatDate(new Date(manifest.lastSeen)) : null,
      pageId,
      options,
    };
  });

  return { manifests, manifestParameter };
}

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

function getTargetIntegration() {
  const { page } = parseMepConfig();
  const mepTarget = TARGET_MAP[getConfig().mep?.targetEnabled];
  if (mepTarget === undefined) return page.target;
  return { postlcp: 'on post LCP' }[mepTarget] ?? mepTarget;
}

export function getLocale() {
  const { page } = parseMepConfig();
  return page.locale?.toLowerCase();
}

export function getLastSeen() {
  const { page } = parseMepConfig();
  return formatDate(new Date(page.lastSeen));
}

function getPersonalization() {
  const { page } = parseMepConfig();
  return page.personalization;
}

function getPerformanceConsent() {
  const { consentState } = getConfig().mep;
  return consentState?.functional ? 'on' : 'off';
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
    ['Target Integration', getTargetIntegration()],
    ['Personalization', getPersonalization()],
  ]);
}

export function getConsentSummary() {
  return resolvePairs([
    ['Performance Consent', getPerformanceConsent()],
    ['Advertising Consent', getAdvertisingConsent()],
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

export function getMasSummary() {
  const config = getConfig();

  const collectionContainers = document.querySelectorAll('[data-mas-block="collection"]');
  const subCollectionCount = [...collectionContainers]
    .reduce((sum, c) => sum + (mepMasSubCollections.get(c)?.length || 0), 0);
  const standaloneOfferCount = [...document.querySelectorAll(MAS_OSI_SELECTOR)]
    .filter((el) => !el.closest('merch-card')).length;

  const counts = {
    collection: collectionContainers.length,
    subCollection: subCollectionCount,
    card: document.querySelectorAll('merch-card').length,
    inlineField: document.querySelectorAll('mas-field').length,
    standaloneOffer: standaloneOfferCount,
  };
  const surfaces = counts.collection + counts.card + counts.inlineField + counts.standaloneOffer;

  const geoOn = isMasGeoDetectionEnabled();
  const geoParam = new URLSearchParams(window.location.search).get('mas-geo-detection');
  const geoMeta = getMetadata('mas-geo-detection');
  let geoSource = 'none';
  if (geoOn) {
    geoSource = geoParam ? 'URL param' : 'Metadata';
  } else if (geoParam || geoMeta) {
    geoSource = geoParam ? 'URL param (off)' : 'Metadata (off)';
  }

  const liveCountry = document.head.querySelector('mas-commerce-service')?.getAttribute('country');
  const localeCountry = getMiloLocaleSettings(config.locale)?.country;
  const pageMarket = (liveCountry || localeCountry || '').toUpperCase() || 'unknown';

  return [
    ['Mas Geo Detection', geoOn ? 'on' : 'off'],
    ['Geo Source', geoSource],
    ['Page Market', pageMarket],
    ['Market Source', liveCountry ? 'mas-commerce-service' : 'page locale'],
    ['Surfaces', [
      ['Detected', surfaces],
      ['Collections', counts.collection, true],
      ['Sub-collections', counts.subCollection, true],
      ['Cards', counts.card, true],
      ['Inline Fields', counts.inlineField, true],
      ['Standalone Offers', counts.standaloneOffer, true],
    ]],
  ];
}

export async function setPreviewButton() {
  function getManifestInputParams(popup) {
    return [...popup.querySelectorAll('input[type="text"].mep-load-manifest')]
      .filter((input) => input.value)
      .map((input) => {
        try { return new URL(input.value).pathname || input.value; } catch { return input.value; }
      });
  }

  function getCheckedOptionParams(popup) {
    return [...popup.querySelectorAll('option:checked')]
      .filter((option) => !option.closest('select')?.disabled && option.value)
      .map((option) => `${option.dataset.manifest}--${option.value}`);
  }

  const getCheckboxParam = (popup, id) => (popup.querySelector(`input[type="checkbox"]#${id}`)?.checked ? true : null);

  const popup = document.querySelector('#mep-drawer');
  const manifestParameter = [
    ...getManifestInputParams(popup),
    ...getCheckedOptionParams(popup),
  ];

  const simulateHref = new URL(window.location.href);
  simulateHref.searchParams.set('mep', manifestParameter.join('---'));

  const setOrDelete = (key, value) => (value
    ? simulateHref.searchParams.set(key, value)
    : simulateHref.searchParams.delete(key));

  setOrDelete(HIGHLIGHT_KEYS.mep, getCheckboxParam(popup, 'toggle-mep'));
  setOrDelete(HIGHLIGHT_KEYS.caas, getCheckboxParam(popup, 'toggle-caas'));
  setOrDelete(HIGHLIGHT_KEYS.mas, getCheckboxParam(popup, 'toggle-mas'));
  setOrDelete(HIGHLIGHT_KEYS.other, getCheckboxParam(popup, 'toggle-other-fragments'));
  popup.querySelector('.mep-footer a.con-button')?.setAttribute('href', simulateHref.href);
}

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
    data.activities = data.activities
      .filter((a) => !existingPaths.has(normalizePath(a.url)))
      .map((a) => ({ ...a, source: 'MMM' }));

    additionalManifests = data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching 7-day page data:', error);
  }
  return additionalManifests;
}

export function getParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    mepMepHighlight: urlParams.get(HIGHLIGHT_KEYS.mep),
    mepCaasHighlight: urlParams.get(HIGHLIGHT_KEYS.caas),
    mepMasHighlight: urlParams.get(HIGHLIGHT_KEYS.mas),
    mepOtherHighlight: urlParams.get(HIGHLIGHT_KEYS.other),
  };
}

export function toggleHighlight(event) {
  const HIGHLIGHT_HANDLERS = {
    'toggle-mep': {
      dataKey: HIGHLIGHT_KEYS.mep,
      on: [],
      off: [],
    },
    'toggle-caas': {
      dataKey: HIGHLIGHT_KEYS.caas,
      on: [watchForCaasBlocks, injectCaasBadges],
      off: [unwatchForCaasBlocks, removeCaasBadges],
    },
    'toggle-mas': {
      dataKey: HIGHLIGHT_KEYS.mas,
      on: [watchForMasContent, injectMasBadges],
      off: [unwatchForMasContent, removeMasBadges],
    },
    'toggle-other-fragments': {
      dataKey: HIGHLIGHT_KEYS.other,
      on: [],
      off: [],
    },
  };

  const { checked, id } = event.target;
  const handler = HIGHLIGHT_HANDLERS[id];
  if (!handler) return;
  document.body.dataset[handler.dataKey] = checked;
  (checked ? handler.on : handler.off).forEach((fn) => fn());
}

export function getPageUpdates() {
  const count = 0;
  return `${count} Page Updates`;
}
