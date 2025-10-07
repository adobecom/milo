import {
  createTag, getConfig, loadArea, loadScript, loadStyle, localizeLink, SLD, getMetadata,
  shouldAllowKrTrial,
} from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

// MAS Component Names
export const MAS_COMMERCE_SERVICE = 'commerce';
export const MAS_MERCH_CARD = 'merch-card';
export const MAS_MERCH_CARD_COLLECTION = 'merch-card-collection';
export const MAS_MERCH_MNEMONIC_LIST = 'merch-mnemonic-list';
export const MAS_MERCH_OFFER_SELECT = 'merch-offer-select';
export const MAS_MERCH_QUANTITY_SELECT = 'merch-quantity-select';
export const MAS_MERCH_SECURE_TRANSACTION = 'merch-secure-transaction';
export const MAS_MERCH_SIDENAV = 'merch-sidenav';
export const MAS_MERCH_WHATS_INCLUDED = 'merch-whats-included';

export const CHECKOUT_LINK_CONFIG_PATH = '/commerce/checkout-link.json'; // relative to libs.
export const CHECKOUT_LINK_SANDBOX_CONFIG_PATH = '/commerce/checkout-link-sandbox.json'; // relative to libs.

export const PRICE_TEMPLATE_DISCOUNT = 'discount';
export const PRICE_TEMPLATE_OPTICAL = 'optical';
export const PRICE_TEMPLATE_REGULAR = 'price';
export const PRICE_TEMPLATE_STRIKETHROUGH = 'strikethrough';
export const PRICE_TEMPLATE_ANNUAL = 'annual';
export const PRICE_TEMPLATE_LEGAL = 'legal';

const PRICE_TEMPLATE_MAPPING = new Map([
  ['priceDiscount', PRICE_TEMPLATE_DISCOUNT],
  [PRICE_TEMPLATE_DISCOUNT, PRICE_TEMPLATE_DISCOUNT],
  ['priceOptical', PRICE_TEMPLATE_OPTICAL],
  [PRICE_TEMPLATE_OPTICAL, PRICE_TEMPLATE_OPTICAL],
  ['priceStrikethrough', PRICE_TEMPLATE_STRIKETHROUGH],
  [PRICE_TEMPLATE_STRIKETHROUGH, PRICE_TEMPLATE_STRIKETHROUGH],
  ['priceAnnual', PRICE_TEMPLATE_ANNUAL],
  [PRICE_TEMPLATE_ANNUAL, PRICE_TEMPLATE_ANNUAL],
  [PRICE_TEMPLATE_LEGAL, PRICE_TEMPLATE_LEGAL],
]);

export const PLACEHOLDER_KEY_DOWNLOAD = 'download';

export const CC_SINGLE_APPS = [
  ['3D_TEXTURING'],
  ['3DI'],
  ['ACROBAT', 'ACROBAT_STOCK_BUNDLE'],
  ['AFTEREFFECTS', 'AFTER_EFFECTS_STOCK_BUNDLE'],
  ['AUDITION', 'AUDITION_STOCK_BUNDLE'],
  ['CC_EXPRESS'],
  ['FLASH', 'FLASH_STOCK_BUNDLE'],
  ['DREAMWEAVER', 'DREAMWEAVER_STOCK_BUNDLE'],
  ['EDGE_ANIMATE'],
  ['ILLUSTRATOR', 'ILLUSTRATOR_STOCK_BUNDLE'],
  ['INCOPY', 'INCOPY_STOCK_BUNDLE'],
  ['INDESIGN', 'INDESIGN_STOCK_BUNDLE'],
  ['PHOTOGRAPHY', 'PHOTOGRAPHY_STOCK_BUNDLE'],
  ['PHOTOSHOP_LIGHTROOM'],
  ['PHOTOSHOP', 'PHOTOSHOP_STOCK_BUNDLE'],
  ['PREMIERE', 'PREMIERE_STOCK_BUNDLE'],
  ['RUSH'],
  ['XD'],
];

const LanguageMap = {
  en: 'US',
  'en-gb': 'GB',
  'es-mx': 'MX',
  'fr-ca': 'CA',
  da: 'DK',
  et: 'EE',
  ar: 'DZ',
  el: 'GR',
  iw: 'IL',
  he: 'IL',
  id: 'ID',
  ms: 'MY',
  nb: 'NO',
  sl: 'SI',
  sv: 'SE',
  cs: 'CZ',
  uk: 'UA',
  hi: 'IN',
  'zh-hans': 'CN',
  'zh-hant': 'TW',
  ja: 'JP',
  ko: 'KR',
  fil: 'PH',
  th: 'TH',
  vi: 'VN',
};

const GeoMap = {
  ar: 'AR_es',
  be_en: 'BE_en',
  be_fr: 'BE_fr',
  be_nl: 'BE_nl',
  br: 'BR_pt',
  ca: 'CA_en',
  ch_de: 'CH_de',
  ch_fr: 'CH_fr',
  ch_it: 'CH_it',
  cl: 'CL_es',
  co: 'CO_es',
  la: 'DO_es',
  mx: 'MX_es',
  pe: 'PE_es',
  africa: 'MU_en',
  dk: 'DK_da',
  de: 'DE_de',
  ee: 'EE_et',
  eg_ar: 'EG_ar',
  eg_en: 'EG_en',
  es: 'ES_es',
  fr: 'FR_fr',
  gr_el: 'GR_el',
  gr_en: 'GR_en',
  ie: 'IE_en',
  il_he: 'IL_iw',
  it: 'IT_it',
  lv: 'LV_lv',
  lt: 'LT_lt',
  lu_de: 'LU_de',
  lu_en: 'LU_en',
  lu_fr: 'LU_fr',
  my_en: 'MY_en',
  my_ms: 'MY_ms',
  hu: 'HU_hu',
  mt: 'MT_en',
  mena_en: 'DZ_en',
  mena_ar: 'DZ_ar',
  nl: 'NL_nl',
  no: 'NO_nb',
  pl: 'PL_pl',
  pt: 'PT_pt',
  ro: 'RO_ro',
  si: 'SI_sl',
  sk: 'SK_sk',
  fi: 'FI_fi',
  se: 'SE_sv',
  tr: 'TR_tr',
  uk: 'GB_en',
  at: 'AT_de',
  cz: 'CZ_cs',
  bg: 'BG_bg',
  ru: 'RU_ru',
  ua: 'UA_uk',
  au: 'AU_en',
  in_en: 'IN_en',
  in_hi: 'IN_hi',
  id_en: 'ID_en',
  id_id: 'ID_id',
  nz: 'NZ_en',
  sa_ar: 'SA_ar',
  sa_en: 'SA_en',
  sg: 'SG_en',
  cn: 'CN_zh-Hans',
  tw: 'TW_zh-Hant',
  hk_zh: 'HK_zh-hant',
  jp: 'JP_ja',
  kr: 'KR_ko',
  za: 'ZA_en',
  ng: 'NG_en',
  cr: 'CR_es',
  ec: 'EC_es',
  pr: 'US_es', // not a typo, should be US
  gt: 'GT_es',
  cis_en: 'TM_en',
  cis_ru: 'TM_ru',
  sea: 'SG_en',
  th_en: 'TH_en',
  th_th: 'TH_th',
};

/**
 * Used when 3in1 modals are configured with ms=e or cs=t extra parameter, but 3in1 is disabled.
 * Dexter modals should deeplink to plan=edu or plan=team tabs.
 * @type {Record<string, string>}
 */
const TAB_DEEPLINK_MAPPING = {
  ms: 'plan',
  cs: 'plan',
  e: 'edu',
  t: 'team',
};

const LANG_STORE_PREFIX = 'langstore/';

function getDefaultLangstoreCountry(language) {
  let country = LanguageMap[language];
  if (!country && GeoMap[language]) {
    country = language; // es, fr, pt, de
  }
  if (!country && language.includes('-')) {
    [country] = language.split('-'); // variations like es-419, pt-PT
  }

  return country || 'US';
}

export function getMiloLocaleSettings(miloLocale) {
  const localePrefix = miloLocale?.prefix || 'US_en';
  const geo = localePrefix.replace('/', '') ?? '';
  let [country = 'US', language = 'en'] = (GeoMap[geo] ?? geo).split('_', 2);

  if (
    geo.startsWith(LANG_STORE_PREFIX)
    || window.location.pathname.startsWith(`/${LANG_STORE_PREFIX}`)
  ) {
    const localeLang = geo.replace(LANG_STORE_PREFIX, '').toLowerCase();
    country = getDefaultLangstoreCountry(localeLang);
    language = localeLang;
  }

  country = country.toUpperCase();
  language = language.toLowerCase();

  return {
    language,
    country,
    locale: `${language}_${country}`,
  };
}

export async function getGeoLocaleSettings(miloLocale) {
  const settings = getMiloLocaleSettings(miloLocale);
  let country = (new URLSearchParams(window.location.search)).get('akamaiLocale')?.toLowerCase()
    || sessionStorage.getItem('akamai');
  if (!country) {
    try {
      const { getAkamaiCode } = await import('../../features/georoutingv2/georoutingv2.js');
      country = await getAkamaiCode(true);
    } catch (error) {
      window.lana?.log(`Error getting Akamai code (will go with default country): ${error}`);
    }
  }
  if (country) {
    country = country.toUpperCase();
    settings.country = country;
  }
  return settings;
}

export async function getLocaleSettings(miloLocale) {
  const geoDetection = getMetadata('mas-geo-detection');
  if (!geoDetection || !['on', 'true'].includes(geoDetection)) {
    return Promise.resolve(getMiloLocaleSettings(miloLocale));
  }
  return getGeoLocaleSettings(miloLocale);
}

/* Optional checkout link params that are appended to checkout urls as is */
export const CHECKOUT_ALLOWED_KEYS = [
  'af',
  'ai',
  'apc',
  'appctxid',
  'cli',
  'co',
  'csm',
  'ctx',
  'ctxRtUrl',
  'DCWATC',
  'dp', // Enable digital payments for iframe context
  'fr', // represents the commerce app redirecting to UC
  'gsp',
  'ijt',
  'lang',
  'lo',
  'mal',
  'ms',
  'cs',
  'mv',
  'mv2',
  'nglwfdata',
  'ot',
  'otac',
  'pa',
  'pcid', // Unified Paywall configuration ID for analytics
  'promoid',
  'q',
  'rf',
  'sc',
  'scl',
  'sdid',
  'sid', // x-adobe-clientsession
  'spint',
  'svar',
  'th',
  'thm',
  'trackingid',
  'usid',
  'workflowid',
  'context.guid',
  'so.ca',
  'so.su',
  'so.tr',
  'so.va',
  // below keys are mapped to shorted versions.
  'quantity',
  'authCode',
  'checkoutPromoCode',
  'rurl',
  'curl',
  'ctxrturl',
  'country',
  'language',
  'clientId',
  'context',
  'productArrangementCode',
  'offerType',
  'marketSegment',
];

export const CC_SINGLE_APPS_ALL = CC_SINGLE_APPS.flatMap((item) => item);

export const CC_ALL_APPS = [
  'CC_ALL_APPS',
  'CC_ALL_APPS_STOCK_BUNDLE',
  'CC_PRO',
];

const NAME_LOCALE = 'LOCALE';
const NAME_PRODUCT_FAMILY = 'PRODUCT_FAMILY';
const FREE_TRIAL_PATH = 'FREE_TRIAL_PATH';
const BUY_NOW_PATH = 'BUY_NOW_PATH';
const FREE_TRIAL_HASH = 'FREE_TRIAL_HASH';
const BUY_NOW_HASH = 'BUY_NOW_HASH';
const OFFER_TYPE_TRIAL = 'TRIAL';
const LOADING_ENTITLEMENTS = 'loading-entitlements';

let log;
let upgradeOffer = null;
let litPromise;

/**
 * Given a url, calculates the hostname of MAS platform.
 * Supports, www prod, stage, local and feature branches.
 * if params are missing, it will return the latest calculated or default value.
 * @param {string} hostname optional
 * @param {string} maslibs optional
 * @returns base url for mas platform
 */
export function getMasBase(hostname, maslibs) {
  let { baseUrl } = getMasBase;
  if (!baseUrl) {
    if (maslibs === 'stage') {
      baseUrl = 'https://www.stage.adobe.com/mas';
    } else if (maslibs === 'local') {
      baseUrl = 'http://localhost:9001';
    } else if (maslibs) {
      // Extract SLD (Second Level Domain) from hostname
      const hostnameParts = hostname.split('.');
      let sld = 'hlx'; // default
      if (hostnameParts.length >= 2) {
        // Get the second-to-last part (before .page or .live)
        const extensionIndex = hostname.endsWith('.page') ? hostnameParts.length - 1 : hostnameParts.length;
        if (extensionIndex >= 2) {
          sld = hostnameParts[extensionIndex - 2];
        }
      }
      const extension = /.page$/.test(hostname) ? 'page' : 'live';
      baseUrl = `https://${maslibs}.${sld}.${extension}`;
    } else {
      baseUrl = 'https://www.adobe.com/mas';
    }
    getMasBase.baseUrl = baseUrl;
  }
  return baseUrl;
}

/**
 * Gets the base URL for loading web components based on maslibs parameter
 * @returns {string|null} Base URL for web components or null if maslibs not present
 */
export function getMasLibs() {
  const urlParams = new URLSearchParams(window.location.search);
  const masLibs = urlParams.get('maslibs');

  if (!masLibs || masLibs.trim() === '') return null;

  const sanitizedMasLibs = masLibs.trim().toLowerCase();

  if (sanitizedMasLibs === 'local') {
    return 'http://localhost:3030/web-components/dist';
  }
  if (sanitizedMasLibs === 'main') {
    return 'https://mas.adobe.com/web-components/dist';
  }

  // Detect current domain extension (.page or .live)
  const { hostname } = window.location;
  const extension = hostname.endsWith('.page') ? 'page' : 'live';

  if (sanitizedMasLibs.includes('--mas--')) {
    return `https://${sanitizedMasLibs}.aem.${extension}/web-components/dist`;
  }
  if (sanitizedMasLibs.includes('--')) {
    return `https://${sanitizedMasLibs}.aem.${extension}/web-components/dist`;
  }
  return `https://${sanitizedMasLibs}--mas--adobecom.aem.${extension}/web-components/dist`;
}

/**
 * Gets the URL for loading fragment-client.js based on maslibs parameter
 * @returns {string|null} URL for fragment-client.js or null if maslibs not present
 */
function getFragmentClientUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const masLibs = urlParams.get('maslibs');

  if (!masLibs || masLibs.trim() === '') return null;

  const sanitizedMasLibs = masLibs.trim().toLowerCase();

  if (sanitizedMasLibs === 'local') {
    return 'http://localhost:3030/studio/libs/fragment-client.js';
  }
  if (sanitizedMasLibs === 'main') {
    return 'https://mas.adobe.com/studio/libs/fragment-client.js';
  }

  // Detect current domain extension (.page or .live)
  const { hostname } = window.location;
  const extension = hostname.endsWith('.page') ? 'page' : 'live';

  if (sanitizedMasLibs.includes('--mas--')) {
    return `https://${sanitizedMasLibs}.aem.${extension}/studio/libs/fragment-client.js`;
  }
  if (sanitizedMasLibs.includes('--')) {
    return `https://${sanitizedMasLibs}.aem.${extension}/studio/libs/fragment-client.js`;
  }
  return `https://${sanitizedMasLibs}--mas--adobecom.aem.${extension}/studio/libs/fragment-client.js`;
}

/**
 * Cache for failed external loads to avoid repeated attempts
 */
const failedExternalLoads = new Set();

const loadingPromises = new Map();

/**
 * Loads lit dependency dynamically when needed
 * @returns {Promise} Promise that resolves when lit is loaded
 */
export async function loadLitDependency() {
  if (litPromise) return litPromise;

  if (window.customElements?.get('lit-element')) {
    return Promise.resolve();
  }

  const { base } = getConfig();
  litPromise = import(`${base}/deps/lit-all.min.js`);

  return litPromise;
}

/**
 * Loads a MAS component either from external URL (if masLibs present) or local deps
 * @param {string} componentName - Name of the component to load (e.g., 'commerce', 'merch-card')
 * @returns {Promise} Promise that resolves when component is loaded
 */
export async function loadMasComponent(componentName) {
  if (loadingPromises.has(componentName)) {
    return loadingPromises.get(componentName);
  }

  if (customElements.get(componentName)) {
    return Promise.resolve();
  }

  const loadPromise = (async () => {
    const masLibsBase = getMasLibs();

    if (masLibsBase) {
      const externalUrl = `${masLibsBase}/${componentName}.js`;

      if (failedExternalLoads.has(externalUrl)) {
        throw new Error(`Failed to load component from ${externalUrl}`);
      }

      try {
        return await import(externalUrl);
      } catch (error) {
        failedExternalLoads.add(externalUrl);
        throw error;
      }
    } else {
      return import(`../../deps/mas/${componentName}.js`);
    }
  })();

  loadingPromises.set(componentName, loadPromise);
  loadPromise.finally(() => loadingPromises.delete(componentName));

  return loadPromise;
}

function getCommercePreloadUrl() {
  const { env } = getConfig();
  if (env.name === 'prod') {
    return 'https://commerce.adobe.com/store/iframe/preload.js';
  }
  return 'https://commerce-stg.adobe.com/store/iframe/preload.js';
}

export async function polyfills() {
  if (polyfills.promise) return polyfills.promise;
  let isSupported = false;
  document.createElement('div', {
    // eslint-disable-next-line getter-return
    get is() {
      isSupported = true;
    },
  });

  if (isSupported) {
    polyfills.promise = Promise.resolve();
  } else {
    const { base } = getConfig();
    polyfills.promise = await loadScript(`${base}/deps/custom-elements.js`);
  }
  return polyfills.promise;
}

export async function fetchEntitlements() {
  fetchEntitlements.promise = fetchEntitlements.promise
    ?? import('../global-navigation/utilities/getUserEntitlements.js').then(
      ({ default: getUserEntitlements }) => getUserEntitlements({
        params: [{ name: 'include', value: 'OFFER.PRODUCT_ARRANGEMENT_V2' }],
        format: 'raw',
      }),
    );
  return fetchEntitlements.promise;
}

export async function fetchCheckoutLinkConfigs(base = '', env = '') {
  const params = new URLSearchParams(window.location.search);
  const path = params.get('checkout-link-sandbox') === 'on' && env !== 'prod'
    ? `${base}${CHECKOUT_LINK_SANDBOX_CONFIG_PATH}`
    : `${base}${CHECKOUT_LINK_CONFIG_PATH}`;
  fetchCheckoutLinkConfigs.promise = fetchCheckoutLinkConfigs.promise
    ?? fetch(path)
      .catch((e) => {
        log?.error('Failed to fetch checkout link configs', e);
      })
      .then((mappings) => {
        if (!mappings?.ok) return { data: [] };
        return mappings.json();
      });
  return fetchCheckoutLinkConfigs.promise;
}

function getSvar(extraOptions) {
  if (!extraOptions) return undefined;

  const extraOptionsObj = JSON.parse(extraOptions);
  return extraOptionsObj.svar;
}

function addToConfigsForMatchingProduct(config, productCode, svar, targetConfigs) {
  const match = config[NAME_PRODUCT_FAMILY] === productCode || (svar && config[NAME_PRODUCT_FAMILY] === `${productCode}+${svar}`);
  const alreadyThere = targetConfigs.some((item) => item[NAME_PRODUCT_FAMILY] === `${productCode}+${svar}`);
  if (match && !alreadyThere) {
    targetConfigs.push(config);
  }
}

function addToConfigs(config, svar, configs, paCode, productCode, productFamily) {
  addToConfigsForMatchingProduct(config, paCode, svar, configs.paCodeConfigs);
  addToConfigsForMatchingProduct(config, productCode, svar, configs.productCodeConfigs);
  addToConfigsForMatchingProduct(config, productFamily, svar, configs.productFamilyConfigs);
}

export async function getCheckoutLinkConfig(
  productFamily,
  productCode,
  paCode,
  options,
) {
  const extraOptions = options?.extraOptions;
  const svar = getSvar(extraOptions);
  if (svar) {
    const extraOptionsObj = JSON.parse(extraOptions);
    delete extraOptionsObj.svar;
    options.extraOptions = JSON.stringify(extraOptionsObj);
  }
  let { base } = getConfig();
  const { env } = getConfig();
  if (/\.page$/.test(document.location.origin)) {
    /* c8 ignore next 2 */
    base = base.replace('.live', '.page');
  }
  const checkoutLinkConfigs = await fetchCheckoutLinkConfigs(base, env);
  if (!checkoutLinkConfigs.data.length) return undefined;
  const { locale: { region } } = getConfig();

  // place items with extra options first
  checkoutLinkConfigs.data.sort((itema, itemb) => {
    const apf = itema[NAME_PRODUCT_FAMILY];
    const bpf = itemb[NAME_PRODUCT_FAMILY];
    return apf.includes('+') && !bpf.includes('+') ? -1 : 1;
  });

  const { paCodeConfigs, productCodeConfigs, productFamilyConfigs } = checkoutLinkConfigs
    .data.reduce(
      (acc, config) => {
        addToConfigs(config, svar, acc, paCode, productCode, productFamily);
        return acc;
      },
      { paCodeConfigs: [], productCodeConfigs: [], productFamilyConfigs: [] },
    );

  // helps to fallback to product family config
  // if no locale specific config is found below.
  const productCheckoutLinkConfigs = [
    ...paCodeConfigs,
    ...productCodeConfigs,
    ...productFamilyConfigs,
  ];

  if (!productCheckoutLinkConfigs.length) return undefined;
  const checkoutLinkConfig = productCheckoutLinkConfigs.find(
    ({ [NAME_LOCALE]: locale }) => locale === '',
  );
  const checkoutLinkConfigOverride = productCheckoutLinkConfigs.find(
    ({ [NAME_LOCALE]: locale }) => locale === region,
  ) ?? {};
  const overrides = Object.fromEntries(
    Object.entries(checkoutLinkConfigOverride).filter(([, value]) => value),
  );
  const finalConfig = { ...checkoutLinkConfig, ...overrides };
  Object.entries(finalConfig).forEach(([key, value]) => {
    if (value === 'X' || value === '❌') {
      finalConfig[key] = '';
    }
  });
  return finalConfig;
}

export async function getDownloadAction(
  options,
  imsSignedInPromise,
  [
    {
      offerType,
      productArrangementCode,
      productArrangement: { productCode, productFamily: offerFamily } = {},
    },
  ],
) {
  if (options.entitlement !== true) return undefined;
  const loggedIn = await imsSignedInPromise;
  if (!loggedIn) return undefined;
  const entitlements = await fetchEntitlements();
  if (!entitlements?.length) return undefined;
  const checkoutLinkConfig = await getCheckoutLinkConfig(
    offerFamily,
    productCode,
    productArrangementCode,
    options,
  );
  if (!checkoutLinkConfig?.DOWNLOAD_URL) return undefined;
  const offer = entitlements.find(
    ({ offer: { product_arrangement_v2: { family: subscriptionFamily } } }) => {
      if (CC_ALL_APPS.includes(subscriptionFamily)) return true; // has all apps
      if (CC_ALL_APPS.includes(offerFamily)) return false; // hasn't all apps and cta is all apps
      const singleAppFamily = CC_SINGLE_APPS.find(
        (
          singleAppFamilies, // has single and and cta is single app
        ) => singleAppFamilies.includes(offerFamily),
      );
      return singleAppFamily?.includes(subscriptionFamily);
    },
  );
  if (!offer) return undefined;
  const config = getConfig();
  const text = await replaceKey(
    checkoutLinkConfig.DOWNLOAD_TEXT || PLACEHOLDER_KEY_DOWNLOAD,
    config,
  );
  const url = localizeLink(checkoutLinkConfig.DOWNLOAD_URL);
  const type = offerType?.toLowerCase() ?? '';
  return { text, className: `download ${type}`, url };
}

export async function getUpgradeAction(
  options,
  imsSignedInPromise,
  [{ productArrangement: { productFamily: offerFamily } = {} }],
  el,
) {
  if (!options.upgrade) return undefined;
  const loggedIn = await imsSignedInPromise;
  if (!loggedIn) return undefined;
  const entitlements = await fetchEntitlements();
  if (upgradeOffer === null) {
    upgradeOffer = undefined;
    // will enter only once
    upgradeOffer = await document.querySelector(
      '.merch-offers.upgrade [data-wcs-osi]',
    );
  }
  await upgradeOffer?.onceSettled();
  if (upgradeOffer && entitlements?.length && offerFamily) {
    const { default: handleUpgradeOffer } = await import('./upgrade.js');
    const upgradeAction = await handleUpgradeOffer(
      offerFamily,
      upgradeOffer,
      entitlements,
      CC_SINGLE_APPS_ALL,
      CC_ALL_APPS,
    );
    el?.closest('merch-card')?.querySelector('merch-addon')?.remove();
    return upgradeAction;
  }
  return undefined;
}

async function openFragmentModal(path, getModal) {
  const root = createTag('div');
  root.style.visibility = 'hidden';
  createTag('a', { href: `${path}` }, '', { parent: root });
  const modal = await getModal(null, {
    id: 'checkout-link-modal',
    content: root,
    closeEvent: 'closeModal',
    class: 'commerce-frame',
  });
  await loadArea(modal);
  root.style.visibility = '';
  return modal;
}

function appendTabName(url, el) {
  if (el?.is3in1Modal) {
    if (el.marketSegment === 'EDU') {
      url.searchParams.set('plan', 'edu');
    } else if (el.customerSegment === 'TEAM') {
      url.searchParams.set('plan', 'team');
    }
  }
  const metaPreselectPlan = document.querySelector(
    'meta[name="preselect-plan"]',
  );
  if (!metaPreselectPlan?.content) return url;
  url.searchParams.set('plan', metaPreselectPlan.content);
  return url;
}

function appendExtraOptions(url, extraOptions) {
  if (!extraOptions) return url;
  const extraOptionsObj = JSON.parse(extraOptions);
  Object.keys(extraOptionsObj).forEach((key) => {
    if (CHECKOUT_ALLOWED_KEYS.includes(key)) {
      const value = extraOptionsObj[key];
      url.searchParams.set(
        TAB_DEEPLINK_MAPPING[key] ?? key,
        TAB_DEEPLINK_MAPPING[value] ?? value,
      );
    }
  });
  return url;
}

// TODO this should migrate to checkout.js buildCheckoutURL
export function appendDexterParameters(url, extraOptions, el) {
  const isRelativePath = url.startsWith('/');
  let absoluteUrl;
  try {
    absoluteUrl = new URL(
      isRelativePath ? `${window.location.origin}${url}` : url,
    );
  } catch (err) {
    window.lana?.log(`Invalid URL ${url} : ${err}`);
    return url;
  }
  absoluteUrl = appendExtraOptions(absoluteUrl, extraOptions);
  absoluteUrl = appendTabName(absoluteUrl, el);
  return isRelativePath
    ? absoluteUrl.href.replace(window.location.origin, '')
    : absoluteUrl.href;
}

async function openExternalModal(url, getModal, extraOptions, el) {
  loadStyle(`${getConfig().base}/blocks/iframe/iframe.css`);
  const root = createTag('div', { class: 'milo-iframe' });
  const absoluteUrl = appendDexterParameters(url, extraOptions, el);
  createTag(
    'iframe',
    {
      src: absoluteUrl,
      frameborder: '0',
      marginwidth: '0',
      marginheight: '0',
      allowfullscreen: 'true',
      loading: 'lazy',
    },
    '',
    { parent: root },
  );
  return getModal(null, {
    id: 'checkout-link-modal',
    content: root,
    closeEvent: 'closeModal',
    class: 'commerce-frame',
  });
}

const isInternalModal = (url) => /\/fragments\//.test(url);

const closeModalWithoutEvent = (modalId) => {
  if (!modalId) return;
  document.querySelectorAll(`#${modalId}`).forEach((mod) => {
    if (mod.classList.contains('dialog-modal')) {
      const modalCurtain = document.querySelector(`#${modalId}~.modal-curtain`);
      if (modalCurtain) {
        modalCurtain.remove();
      }
      mod.remove();
    }
    document.querySelector(`[data-modal-hash="#${mod.id}"]`)?.focus();
  });

  if (!document.querySelectorAll('.modal-curtain').length) {
    document.body.classList.remove('disable-scroll');
  }

  [...document.querySelectorAll('header, main, footer')]
    .forEach((element) => element.removeAttribute('aria-disabled'));
};

// Modal state handling: see merch-modal.md
export const modalState = { isOpen: false };

export async function updateModalState({ cta, closedByUser } = {}) {
  const { hash } = window.location;

  if (hash?.includes('=')) {
    const modal = document.querySelector('.dialog-modal');
    if (!modal) return modalState.isOpen;
    modalState.isOpen = false;
    closeModalWithoutEvent(modal.id);
    return modalState.isOpen;
  }

  const openedDialog = document.querySelector(`.dialog-modal${hash}`) || document.querySelector('.dialog-modal#checkout-link-modal');
  const isLocaleModal = openedDialog?.id?.includes('locale-modal');
  const modal = isLocaleModal ? null : openedDialog;

  if (hash && !cta && modalState.isOpen && !modal) {
    const dialog = document.querySelector('.dialog-modal');
    if (!dialog) return modalState.isOpen;
    closeModalWithoutEvent(dialog.id);
    modalState.isOpen = false;
    return modalState.isOpen;
  }

  if (hash && !cta && !modalState.isOpen && !modal) {
    const ctaToClick = document.querySelector(`[is=checkout-link][data-modal-id=${hash.replace('#', '')}]`);
    if (ctaToClick && !ctaToClick.dataset.clickDisabled) {
      ctaToClick.dataset.clickDisabled = 'true';
      ctaToClick.click();
      modalState.isOpen = true;
      setTimeout(() => {
        delete ctaToClick.dataset.clickDisabled;
      }, 1000);
    }
    return modalState.isOpen;
  }

  if (hash && hash === `#${cta?.getAttribute('data-modal-id')}` && !modalState.isOpen && !modal) {
    cta.click();
    modalState.isOpen = true;
    return modalState.isOpen;
  }

  if (closedByUser && document.querySelector('#checkout-link-modal')) {
    modalState.isOpen = false;
    return modalState.isOpen;
  }

  if (closedByUser && modal) {
    modalState.isOpen = false;
    return modalState.isOpen;
  }

  if (!hash && modal) {
    modalState.isOpen = false;
    const { closeModal } = await import('../modal/modal.js');
    closeModal(modal);
  }

  return modalState.isOpen;
}

export async function openModal(e, url, offerType, hash, extraOptions, el) {
  e.preventDefault();
  e.stopImmediatePropagation();
  if (modalState.isOpen) return;
  modalState.isOpen = true;
  const { getModal } = await import('../modal/modal.js');
  await import('../modal/modal.merch.js');
  const offerTypeClass = offerType === OFFER_TYPE_TRIAL ? 'twp' : 'crm';
  let modal;

  if (hash) window.location.hash = hash;

  if (el?.isOpen3in1Modal) {
    const { default: openThreeInOneModal, handle3in1IFrameEvents } = await import('./three-in-one.js');
    window.addEventListener('message', handle3in1IFrameEvents);
    if (!document.querySelector('.dialog-modal.three-in-one')) {
      modal = await openThreeInOneModal(el);
    }
    return;
  }
  if (isInternalModal(url)) {
    const fragmentPath = url.split(/(hlx|aem).(page|live)/).pop();
    modal = await openFragmentModal(fragmentPath, getModal);
  } else {
    modal = await openExternalModal(url, getModal, extraOptions, el);
  }
  modal.classList.add(offerTypeClass);
}

export function setCtaHash(el, checkoutLinkConfig, offerType) {
  if (!(el && checkoutLinkConfig && offerType)) return undefined;
  const hash = checkoutLinkConfig[
    `${offerType === OFFER_TYPE_TRIAL ? FREE_TRIAL_HASH : BUY_NOW_HASH}`
  ];
  if (hash) {
    el.setAttribute('data-modal-id', hash);
  }
  return hash;
}

const isProdModal = (url) => {
  try {
    return new URL(url).hostname.endsWith('.adobe.com');
  } catch (e) {
    return false;
  }
};

export async function getModalAction(offers, options, el) {
  if (!options.modal) return undefined;

  const preload = new URLSearchParams(window.location.search).get('commerce.preload') !== 'off';
  if (el?.isOpen3in1Modal && preload) {
    const baseUrl = getCommercePreloadUrl();
    // The script can preload more, based on clientId, but for the ones in use
    // ('mini-plans', 'creative') there is no difference, so we can just use either one.
    const client = 'creative';
    window.milo.deferredPromise.then(() => {
      setTimeout(() => {
        loadScript(`${baseUrl}?cli=${client}`, 'text/javascript', { mode: 'defer', id: 'ucv3-preload-script' });
      }, 1000);
    });
  }

  const [
    {
      offerType,
      productArrangementCode,
      productArrangement: { productCode, productFamily: offerFamily } = {},
    },
  ] = offers ?? [{}];
  const checkoutLinkConfig = await getCheckoutLinkConfig(
    offerFamily,
    productCode,
    productArrangementCode,
    options,
  );
  if (!checkoutLinkConfig) return undefined;
  const columnName = offerType === OFFER_TYPE_TRIAL ? FREE_TRIAL_PATH : BUY_NOW_PATH;
  const hash = setCtaHash(el, checkoutLinkConfig, offerType);
  let url = checkoutLinkConfig[columnName];
  if (!url && !el?.isOpen3in1Modal) return undefined;
  url = isInternalModal(url) || isProdModal(url)
    ? localizeLink(checkoutLinkConfig[columnName])
    : checkoutLinkConfig[columnName];
  return {
    url,
    handler: (e) => openModal(e, url, offerType, hash, options.extraOptions, el),
  };
}

export async function getCheckoutAction(
  offers,
  options,
  imsSignedInPromise,
  el,
) {
  try {
    await imsSignedInPromise;
    const [downloadAction, upgradeAction, modalAction] = await Promise.all([
      getDownloadAction(options, imsSignedInPromise, offers),
      getUpgradeAction(options, imsSignedInPromise, offers, el),
      getModalAction(offers, options, el),
    ]);
    return downloadAction || upgradeAction || modalAction;
  } catch (e) {
    log?.error('Failed to resolve checkout action', e);
    return [];
  }
}

export function setPreview(attributes) {
  const { host } = window.location;
  if (host.includes(`${SLD}.page`) || host === 'www.stage.adobe.com') {
    attributes.preview = 'on';
  }
}
/**
 * Activates commerce service and returns a promise resolving to its ready-to-use instance.
 */
export async function initService(force = false, attributes = {}) {
  if (force) {
    initService.promise = undefined;
    document.head.querySelector('mas-commerce-service')?.remove();
    fetchEntitlements.promise = undefined;
    fetchCheckoutLinkConfigs.promise = undefined;
  }
  const { commerce, env: miloEnv, locale: miloLocale } = getConfig();

  const extraAttrs = [
    'checkout-workflow-step',
    'force-tax-exclusive',
    'checkout-client-id',
    'allow-override',
  ];

  extraAttrs.forEach((attr) => {
    const camelCaseAttr = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    // eslint-disable-next-line no-prototype-builtins
    if (commerce?.hasOwnProperty(camelCaseAttr)) {
      const value = commerce[camelCaseAttr];
      delete commerce[camelCaseAttr];
      commerce[attr] = value;
    }
  });
  initService.promise = initService.promise
    ?? polyfills().then(async () => {
      await loadMasComponent(MAS_COMMERCE_SERVICE);

      // Load fragment-client.js when maslibs is present
      const fragmentClientUrl = getFragmentClientUrl();
      if (fragmentClientUrl) {
        const { loadScript: loadScriptUtil } = await import('../../utils/utils.js');
        try {
          await loadScriptUtil(fragmentClientUrl, 'module');
        } catch (e) {
          log?.error('Failed to load fragment-client.js:', e);
        }
      }

      const { language, locale, country } = await getLocaleSettings(miloLocale);
      let service = document.head.querySelector('mas-commerce-service');
      if (!service) {
        setPreview(attributes);
        service = createTag('mas-commerce-service', {
          locale,
          language,
          country,
          ...attributes,
          ...commerce,
        });
        if (miloEnv?.name !== 'prod') {
          service.setAttribute('allow-override', '');
        }
        // Register checkout action if method exists (for backward compatibility)
        if (typeof service.registerCheckoutAction === 'function') {
          service.registerCheckoutAction(getCheckoutAction);
        }
        document.head.append(service);

        // Polyfill for older commerce service versions that don't have prefillWcsCache
        if (typeof service.prefillWcsCache !== 'function') {
          service.prefillWcsCache = () => {
            log?.warn(
              'prefillWcsCache not available in this version of commerce service',
            );
          };
        }

        service.imsSignedInPromise?.then((isSignedIn) => {
          if (isSignedIn) fetchEntitlements();
        });
      }
      if (country === 'AU') {
        loadStyle(`${getConfig().base}/blocks/merch/au-merch.css`);
      }
      return service;
    });
  return initService.promise;
}

export async function getCommerceContext(el, params) {
  const wcsOsi = params.get('osi');
  if (!wcsOsi) return null;
  const perpetual = params.get('perp') === 'true' || undefined;
  const promotionCode = (params.get('promo')
      ?? params.get('promotionCode')
      ?? el.closest('[data-promotion-code]')?.dataset.promotionCode)
    || undefined;
  return { promotionCode, perpetual, wcsOsi };
}

// TODO: remove this function once fallbackStep for DC is fully authored
function getHardcodedFallbackStep(wcsOsi, checkoutClientId) {
  if (checkoutClientId !== 'doc_cloud') return undefined;
  const osiToStepMap = {
    'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs': 'commitment',
    'ZZQMV2cU-SWQoDxuznonUFMRdxSyTr4J3fB77YBNakY': 'commitment',
    'vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE': 'email',
    'nTbB50pS4lLGv_x1l_UKggd-lxxo2zAJ7WYDa2mW19s': 'email',
    'QgYu51CVY2wKyFEqMuvec4N1tc1OaCypeKJjT5n2-Fc': 'commitment',
    'AW-jV275GNYtPao6Q7XWENqyv_Stkc1BbzF7ak2u1dk': 'email',
    'nIy-IPGnALw3KNncaqMjOJsMUrqElWi8sdGnBFBAgTw': 'commitment',
    WRe4gUHuyqJgCCr3ZywwU9CDP0ezBaCKoMk4xryVQhs: 'commitment',
    Hnk2P6L5wYhnpZLFYTW5upuk2Y3AJXlso8VGWQ0l2TI: 'commitment',
    '-lYm-YaTSZoUgv1gzqCgybgFotLqRsLwf8CgYdvdnsQ': 'commitment',
    WJLr3TF4T4qyJIGZTsDf9KPbTfxA7qAgStpaF2IgYao: 'commitment',
    '8Lr09qx_PHqAJUwvUNiof4FFFEKjsR1TTbvBUncV2b0': 'email',
    lI5NvdLBWJUJEHkP9CAx787kt0uCc3WnoCFVVIjECiA: 'email',
    'OQ1oCm1tZG35Gj7LCrkGeOOdUMfVlC7xx-7ml-CTWIE': 'commitment',
  };
  return osiToStepMap[wcsOsi];
}

export function isFallbackStepUsed({ modal, fallbackStep, wcsOsi, checkoutClientId }) {
  const is3in1Modal = ['twp', 'd2p', 'crm'].includes(modal);
  const masFF3in1 = document.querySelector('meta[name=mas-ff-3in1]');
  const is3in1Enabled = !masFF3in1 || masFF3in1.content !== 'off';
  return is3in1Modal && !is3in1Enabled && !!(fallbackStep
  ?? getHardcodedFallbackStep(wcsOsi, checkoutClientId));
}

export function getWorkflowStep({
  wcsOsi,
  modal,
  fallbackStep,
  checkoutWorkflowStep,
  checkoutClientId,
}) {
  if (!isFallbackStepUsed({
    modal,
    fallbackStep,
    wcsOsi,
    checkoutClientId,
  })) return checkoutWorkflowStep;
  return fallbackStep
    ?? getHardcodedFallbackStep(wcsOsi, checkoutClientId)
    ?? checkoutWorkflowStep;
}

/**
 * Checkout parameter can be set on the merch link,
 * code config (scripts.js) or be a default from tacocat.
 * To get the default, 'undefined' should be passed, empty string will trigger an error!
 *
 * clientId - code config -> default (adobe_com)
 * workflow - merch link -> metadata -> default (UCv3)
 * workflowStep - merch link -> default (email)
 * marketSegment - merch link -> default (COM)
 * @param {{params: URLSearchParams, service: {settings: object}}} context
 * @returns checkout context object required to build a checkout url
 */
export async function getCheckoutContext(el, params) {
  const context = await getCommerceContext(el, params);
  if (!context) return null;
  const { settings } = await initService();
  const { checkoutClientId } = settings;
  const checkoutMarketSegment = params.get('marketSegment');
  const checkoutWorkflowStep = params?.get('workflowStep') ?? settings.checkoutWorkflowStep;
  const entitlement = params?.get('entitlement');
  const upgrade = params?.get('upgrade');
  const modal = params?.get('modal');
  const fallbackStep = params?.get('fallbackStep');

  const extraOptions = {};
  params.forEach((value, key) => {
    if (CHECKOUT_ALLOWED_KEYS.includes(key)) {
      extraOptions[key] = value;
    }
  });

  return {
    ...context,
    checkoutClientId,
    checkoutWorkflowStep: getWorkflowStep({
      wcsOsi: context.wcsOsi,
      modal,
      fallbackStep,
      checkoutWorkflowStep,
      checkoutClientId,
    }),
    checkoutMarketSegment,
    entitlement,
    upgrade,
    modal: isFallbackStepUsed({
      modal,
      fallbackStep,
      wcsOsi: context.wcsOsi,
      checkoutClientId,
    }) ? undefined : modal,
    fallbackStep,
    extraOptions: JSON.stringify(extraOptions),
  };
}

export async function getPriceContext(el, params) {
  const context = await getCommerceContext(el, params);
  if (!context) return null;
  const annualEnabled = getMetadata('mas-ff-annual-price');
  const displayOldPrice = context.promotionCode ? params.get('old') : undefined;
  const displayPerUnit = params.get('seat');
  const displayRecurrence = params.get('term');
  const displayTax = params.get('tax');
  const displayPlanType = params.get('planType');
  const displayAnnual = (annualEnabled && params.get('annual') !== 'false') || undefined;
  const forceTaxExclusive = params.get('exclusive');
  const alternativePrice = params.get('alt');
  const quantity = params.get('quantity');
  // The PRICE_TEMPLATE_MAPPING supports legacy OST links
  const template = PRICE_TEMPLATE_MAPPING.get(params.get('type')) ?? PRICE_TEMPLATE_REGULAR;
  return {
    ...context,
    displayOldPrice,
    displayPerUnit,
    displayRecurrence,
    displayTax,
    displayPlanType,
    displayAnnual,
    forceTaxExclusive,
    alternativePrice,
    template,
    quantity,
  };
}

export async function addAriaLabelToCta(cta) {
  const productCode = cta.value[0]?.productArrangement?.productCode;
  const { marketSegment, customerSegment } = cta;
  const segment = marketSegment === 'EDU' ? marketSegment : customerSegment;
  let ariaLabel = cta.textContent;
  ariaLabel = productCode
    ? `${ariaLabel} - ${await replaceKey(productCode, getConfig())}`
    : ariaLabel;
  ariaLabel = segment
    ? `${ariaLabel} - ${await replaceKey(segment, getConfig())}`
    : ariaLabel;
  cta.setAttribute('aria-label', ariaLabel);
}

export async function buildCta(el, params) {
  const large = !!el.closest('.marquee');
  const strong = el.firstElementChild?.tagName === 'STRONG'
    || el.parentElement?.tagName === 'STRONG';
  if (el.closest('.merch-offers.upgrade')) {
    params.append('entitlement', 'false');
  }
  const context = await getCheckoutContext(el, params);
  if (!context) return null;
  const service = await initService();
  const text = el.textContent?.replace(/^CTA +/, '');
  const cta = service.createCheckoutLink(context, text);
  if (el.href.includes('#_tcl')) {
    el.href = el.href.replace('#_tcl', '');
  } else {
    cta.classList.add('con-button');
    cta.classList.toggle('button-l', large);
    cta.classList.toggle('blue', strong);
  }

  const customClasses = el.href.matchAll(/#_button-([a-zA-Z-]+)/g);
  for (const match of customClasses) {
    cta.classList.add(match[1]);
  }

  if (context.entitlement !== 'false') {
    cta.classList.add(LOADING_ENTITLEMENTS);
    cta.onceSettled().finally(() => {
      cta.classList.remove(LOADING_ENTITLEMENTS);
      updateModalState({ cta });
    });
  }

  // Adding aria-label for checkout-link using productCode and customerSegment as placeholder key.
  if (el.ariaLabel) {
    // If Milo aria-label available from sharepoint doc, just use it.
    cta.setAttribute('aria-label', el.ariaLabel);
  } else if (!cta.ariaLabel) {
    cta.onceSettled().then(async () => {
      await addAriaLabelToCta(cta);
    });
  }

  if (getMetadata('mas-ff-copy-cta') === 'on') {
    const { default: addCopyToClipboard } = await import(
      './copy-to-clipboard.js'
    );
    return addCopyToClipboard(el, cta);
  }

  /**
   * TODO: This code block will be deprecated and removed in a future version.
   * @see https://jira.corp.adobe.com/browse/MWPW-173470
   * @see https://jira.corp.adobe.com/browse/MWPW-174411
   */
  cta.onceSettled().then(() => {
    const prefix = getConfig()?.locale?.prefix;
    if (!(prefix === '/kr' && cta.value[0]?.offerType === OFFER_TYPE_TRIAL)) return;
    if (shouldAllowKrTrial(el, prefix)) {
      cta.classList.remove('hidden-osi-trial-link');
      return;
    }
    cta.remove();
  });

  return cta;
}

async function buildPrice(el, params) {
  const context = await getPriceContext(el, params);
  if (!context) return null;
  const service = await initService();
  const price = service.createInlinePrice(context);
  return price;
}

export const MEP_SELECTOR = 'mas';

export function overrideOptions(fragment, options) {
  const { mep } = getConfig();
  const fragments = mep?.inBlock?.[MEP_SELECTOR]?.fragments;
  if (fragments) {
    const command = fragments[fragment];
    if (command && command.action === 'replace') {
      return { ...options, fragment: command.content };
    }
  }
  return options;
}

export function getOptions(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  const options = {};
  for (const [key, value] of searchParams.entries()) {
    if (key === 'sidenav') options.sidenav = value === 'true';
    else if (key === 'fragment' || key === 'query') options.fragment = value;
  }
  return options;
}

export default async function init(el) {
  if (!el?.classList?.contains('merch')) return undefined;
  const { searchParams } = new URL(el.href);
  const isCta = searchParams.get('type') === 'checkoutUrl';
  const merch = await (isCta ? buildCta : buildPrice)(el, searchParams);
  const service = await initService();
  log = service.Log.module('merch');
  if (merch) {
    log.debug('Rendering:', { options: { ...merch.dataset }, merch, el });
    el.replaceWith(merch);
    return merch;
  }
  log.warn('Failed to get context:', { el });
  return null;
}

window.addEventListener('hashchange', updateModalState);

window.addEventListener('popstate', updateModalState);

window.addEventListener('milo:modal:closed', () => {
  updateModalState({ closedByUser: true });
});
