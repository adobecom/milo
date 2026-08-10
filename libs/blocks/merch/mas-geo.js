/*
 * MAS geo/locale derivation + early fragment preload.
 *
 * This module is intentionally dependency-free (zero imports) so a consumer bootstrap
 * (e.g. da-cc, da-dc) can load and run it at the very start of the page — before Milo's
 * utils.js/merch.js and before `loadArea` — to start the first-section MAS fragment fetch
 * as early as possible and win the LCP race.
 *
 * The GeoMap table and locale logic are the single source of truth: blocks/merch/merch.js
 * re-exports `GeoMap` and `getMiloLocaleSettings` from here, so the preload URL is derived
 * exactly the way the merch block derives it — no duplicated GeoMap.
 */

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

export const GeoMap = {
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
  il_he: 'IL_he',
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
  cn: 'CN_zh',
  tw: 'TW_zh',
  hk_zh: 'HK_zh',
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
 * MAS WCS `locale` when it differs from `${language}_${country}` derived from {@link GeoMap}.
 * @type {Record<string, string>}
 */
const EXTRA_MAS_LOCALES = { pr: 'es_PR' };

/**
 * MAS locale overrides for markets that share a language but have different country codes.
 * Also consumed by merch.js's geo-market resolution — kept here as the single source of truth.
 */
export const MARKET_LOCALE_OVERRIDES = { en: { AU: 'en_GB', IN: 'en_GB', GB: 'en_GB' } };

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
    locale: EXTRA_MAS_LOCALES[geo] ?? `${language}_${country}`,
  };
}

/* ---------------------------------------------------------------------------
 * Supported-markets validation (shared with utils/market.js)
 *
 * These are the *pure* parts of market.js's getValidatedMarket — the clamp that
 * maps a detected country to the page's supported markets. They live here (the
 * dependency-free layer) so the early preload can run them without booting
 * utils.js, and utils/market.js re-imports them so there is one source of truth.
 * ------------------------------------------------------------------------- */

/** Normalise the supported-markets JSON to a flat languages array. */
export function parseMarketsLanguages(marketsConfigJson) {
  return marketsConfigJson?.languages?.data ?? marketsConfigJson?.data ?? [];
}

/** Pick the language entry for a page locale. Mirrors market.js. */
export function marketsLangForLocale(marketsConfig, locale) {
  if (!marketsConfig?.languages?.length) return undefined;
  const { languages } = marketsConfig;
  const pagePrefix = locale?.prefix?.replace(/^\//, '') || '';
  let languageEntry = languages.find((lang) => (lang.prefix || '') === pagePrefix);
  if (!languageEntry && locale?.base) {
    languageEntry = languages.find((lang) => (lang.prefix || '') === locale.base);
  }
  return languageEntry || languages[0];
}

/**
 * Clamp a detected country to the page's supported markets — falls back to the
 * page language's defaultMarket when the detected country isn't supported.
 * `marketConfig` is `{ languages: [...] }` (see {@link parseMarketsLanguages}).
 * This is the exact tail of market.js's getValidatedMarket.
 */
export function validateMarket(marketConfig, detectedMarket, locale) {
  if (!marketConfig?.languages?.length) return detectedMarket || 'us';
  const currLang = marketsLangForLocale(marketConfig, locale);
  if (!currLang) return detectedMarket || 'us';
  const market = detectedMarket || currLang.defaultMarket || 'us';
  const supported = currLang.supportedRegions?.split(',').map((m) => m.trim().toLowerCase()) || [];
  const validated = supported.includes(market.toLowerCase()) ? market : currLang.defaultMarket;
  return validated || 'us';
}

/* ---------------------------------------------------------------------------
 * Early first-section fragment preload
 * ------------------------------------------------------------------------- */

// Autoblock links that reference a MAS fragment (see AUTO_BLOCKS in utils.js).
const MAS_STUDIO_LINK = 'mas.adobe.com/studio.html';
const MAS_FRAGMENT_API = 'https://www.adobe.com/mas/io/fragment';
const DEFAULT_MAS_FRAGMENT_API_KEY = 'wcms-commerce-ims-ro-user-milo';

export function isMasFragmentLink(a) {
  return typeof a?.href === 'string' && a.href.includes(MAS_STUDIO_LINK);
}

/** Fragment id carried in a MAS studio link's hash, or null. Mirrors merch.js getOptions. */
export function getMasFragmentId(a) {
  try {
    const { hash } = new URL(a.href);
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    return params.get('fragment') || params.get('query') || null;
  } catch (e) {
    return null;
  }
}

function normCountry(v) {
  if (typeof v !== 'string') return undefined;
  const lower = v.toLowerCase();
  return lower === 'uk' ? 'gb' : lower.split('_')[0];
}

function getCookie(name) {
  return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1];
}

function isMasImsLoginEnabled() {
  const param = new URLSearchParams(window.location.search).get('mas-ims-login');
  const meta = document.querySelector('meta[name="mas-ims-login"]')?.content;
  return (param ?? meta)?.toLowerCase() === 'on';
}

// The Akamai geo lives on the page's own `Server-Timing: geo` response header (the same
// source utils.setCountry() stashes into sessionStorage). Reading it directly means we don't
// depend on setCountry() having run yet, and it's present on a cold first visit — so the
// utils.getCountry() network fallback (geo.js) essentially never applies here.
function getGeoFromServerTiming() {
  try {
    const nav = window.performance?.getEntriesByType?.('navigation')?.[0];
    return nav?.serverTiming?.find((t) => t?.name === 'geo')?.description;
  } catch (e) {
    return undefined;
  }
}

// Sync, best-effort detected-market country — mirrors the precedence of
// utils.computeDetectedMarketCountry (country param > akamaiLocale param > cookie >
// ims_country_code when IMS login is on > Akamai geo). No network. A wrong guess is
// harmless: the browser reuses a preload only on an exact-URL match, so the block simply
// fetches the correct URL instead.
function getSyncMarketCountry() {
  const params = new URLSearchParams(window.location.search);
  const ims = isMasImsLoginEnabled() ? normCountry(getCookie('ims_country_code')) : undefined;
  return normCountry(params.get('country'))
    || normCountry(params.get('akamaiLocale'))
    || normCountry(getCookie('country'))
    || ims
    || normCountry(sessionStorage.getItem('akamai'))
    || normCountry(getGeoFromServerTiming());
}

// Intentionally a DOM-only variant of merch.js's getMetadata-based isMasGeoDetectionEnabled,
// since this module runs before Milo config exists.
function isMasGeoDetectionEnabled() {
  const param = new URLSearchParams(window.location.search).get('mas-geo-detection');
  const meta = document.querySelector('meta[name="mas-geo-detection"]')?.content;
  const val = (param ?? meta)?.toLowerCase();
  return val === 'on' || val === 'true';
}

// Default supported-markets.json URL, reproduced dependency-free from utils.getMarketsUrl /
// getFederatedContentRoot for the federal (non-marketsSource) case. Returns null when a
// marketsSource override is configured — that URL needs Milo config we don't have yet, so
// the caller falls back to the raw sync country (no clamp) on those pages.
//
// Exported so a consumer bootstrap can kick this fetch off at T=0, in parallel with
// importing this module, and hand the result to resolveMasMarket({ marketsConfig }). A
// consumer that must start the fetch *before* the import resolves has to inline the same
// URL — keep the two in sync; the shape is stable (unlike GeoMap).
export function getMasMarketsUrl() {
  const src = new URLSearchParams(window.location.search).get('marketsSource')
    || document.querySelector('meta[name="marketssource"]')?.content;
  if (src) return null;
  const { origin } = window.location;
  let root;
  if (origin.includes('localhost') || origin.includes('.aem.') || origin.includes('.hlx.')) {
    root = `https://main--federal--adobecom.aem.${origin.endsWith('.live') ? 'live' : 'page'}`;
  } else {
    root = origin.replace('.stage', '') === 'https://www.adobe.com' ? origin : 'https://www.adobe.com';
  }
  return `${root}/federal/assets/supported-markets/supported-markets.json`;
}

/**
 * Resolve the exact (supported-markets-clamped) country for a geo-detection page — the same
 * answer market.js's getValidatedMarket lands on, but usable before Milo boots. The only
 * network cost is the small, cacheable supported-markets.json fetch (detected country comes
 * from the Server-Timing geo header, so no geo lookup). Returns null on non-geo-detection
 * pages (locale-in-URL is already exact) and degrades to the raw sync country on any failure.
 *
 * Pass `marketsConfig` (already-fetched supported-markets JSON) to skip the fetch entirely —
 * this is how a consumer bootstrap starts that fetch at T=0, in parallel with importing this
 * module, instead of serializing it behind the import. See {@link getMasMarketsUrl}.
 *
 * @param {{ locale?: {prefix?: string}, marketsUrl?: string, marketsConfig?: object }} [opts]
 * @returns {Promise<string|null>} clamped market (lowercase), sync guess, or null
 */
export async function resolveMasMarket({ locale, marketsUrl, marketsConfig } = {}) {
  if (!isMasGeoDetectionEnabled()) return null;
  const detected = getSyncMarketCountry();
  try {
    let json = marketsConfig;
    if (!json) {
      const url = marketsUrl || getMasMarketsUrl();
      if (!url) return detected || null;
      const resp = await fetch(url);
      if (!resp.ok) return detected || null;
      json = await resp.json();
    }
    const marketConfig = { languages: parseMarketsLanguages(json) };
    return validateMarket(marketConfig, detected, locale) || detected || null;
  } catch (e) {
    return detected || null;
  }
}

export function getMasFragmentUrl(fragmentId, { locale, country, apiKey } = {}) {
  const key = apiKey || DEFAULT_MAS_FRAGMENT_API_KEY;
  let endpoint = `${MAS_FRAGMENT_API}?id=${fragmentId}&api_key=${key}&locale=${locale}`;
  // country is only a separate param when it isn't already implied by the locale suffix
  // (matches aem-fragment.js / merch.js — e.g. locale=fr_CH + country=CH is redundant).
  if (country && !locale.endsWith(`_${country}`)) endpoint += `&country=${country}`;
  return endpoint;
}

/**
 * Fires a browser `<link rel=preload as=fetch>` for the fragment referenced by a MAS
 * studio link, so the fetch starts before Milo boots and wins the LCP race.
 *
 * Best-effort by design, and safe: the URL is matched by the browser cache in full, so a
 * miss (MEP-overridden id, or geo-detected country that differs from the sync guess) just
 * wastes one preload — it can never surface a wrong price, because the merch block always
 * builds and fetches its own exact URL.
 *
 * @param {HTMLAnchorElement} a  first-section MAS studio link
 * @param {{ locale?: {prefix?: string}, apiKey?: string, market?: string }} [opts]
 *   locale — pass the consumer's resolved locale ({ prefix }); before loadArea getConfig()
 *   isn't populated yet, so the caller supplies it. apiKey — override the default wcs key.
 *   market — the resolved (supported-markets-clamped) country from {@link resolveMasMarket};
 *   when omitted, a raw sync guess is used on geo-detection pages.
 * @returns {string|null} the preloaded URL, or null if nothing was preloaded
 */
export function preloadMasFragment(a, { locale: miloLocale, apiKey, market } = {}) {
  const fragmentId = getMasFragmentId(a);
  if (!fragmentId) return null;

  const settings = getMiloLocaleSettings(miloLocale);
  const { language, country: localeCountry } = settings;
  // MEP fragment-id overrides haven't resolved yet (they run inside loadArea) — the
  // authored id is used, which is the correct id on the vast majority of pages.
  let { locale } = settings;
  let country = localeCountry;
  if (isMasGeoDetectionEnabled()) {
    const detected = normCountry(market) || getSyncMarketCountry();
    if (detected) {
      const mkt = detected.toUpperCase();
      country = mkt;
      // Mirror merch.js: a non-localized page (e.g. global-EN) serving an AU/IN/GB visitor
      // fetches that market's Global-EN locale, not en_US + country.
      if (mkt !== localeCountry) {
        const override = MARKET_LOCALE_OVERRIDES[language]?.[mkt];
        if (override) {
          locale = override;
          if (override.endsWith(`_${mkt}`)) country = undefined;
        }
      }
    }
  }

  const href = getMasFragmentUrl(fragmentId, { locale, country, apiKey });

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'fetch';
  // Must match how aem-fragment.js issues the fetch, or the browser keeps the preload and
  // the real request as two separate fetches (wasteful, never wrong). Mirrors milo#6393.
  link.crossOrigin = 'anonymous';
  link.type = 'application/json';
  link.href = href;
  document.head.appendChild(link);
  return href;
}
