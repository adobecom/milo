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

// Sync, best-effort detected-market country — mirrors the precedence of
// utils.computeDetectedMarketCountry (country param > akamaiLocale param > cookie > Akamai
// geo already stashed in sessionStorage). No network. A wrong guess is harmless: the
// browser reuses a preload only on an exact-URL match, so the block simply fetches the
// correct URL instead.
function getSyncMarketCountry() {
  const params = new URLSearchParams(window.location.search);
  return normCountry(params.get('country'))
    || normCountry(params.get('akamaiLocale'))
    || normCountry(getCookie('country'))
    || normCountry(sessionStorage.getItem('akamai'));
}

// Intentionally a DOM-only variant of merch.js's getMetadata-based isMasGeoDetectionEnabled,
// since this module runs before Milo config exists.
function isMasGeoDetectionEnabled() {
  const param = new URLSearchParams(window.location.search).get('mas-geo-detection');
  const meta = document.querySelector('meta[name="mas-geo-detection"]')?.content;
  const val = (param ?? meta)?.toLowerCase();
  return val === 'on' || val === 'true';
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
 * @param {{ locale?: {prefix?: string}, apiKey?: string }} [opts]
 *   locale — pass the consumer's resolved locale ({ prefix }); before loadArea getConfig()
 *   isn't populated yet, so the caller supplies it. apiKey — override the default wcs key.
 * @returns {string|null} the preloaded URL, or null if nothing was preloaded
 */
export function preloadMasFragment(a, { locale: miloLocale, apiKey } = {}) {
  const fragmentId = getMasFragmentId(a);
  if (!fragmentId) return null;

  const settings = getMiloLocaleSettings(miloLocale);
  const { language, country: localeCountry } = settings;
  // MEP fragment-id overrides haven't resolved yet (they run inside loadArea) — the
  // authored id is used, which is the correct id on the vast majority of pages.
  let { locale } = settings;
  let country = localeCountry;
  if (isMasGeoDetectionEnabled()) {
    const detected = getSyncMarketCountry();
    if (detected) {
      const market = detected.toUpperCase();
      country = market;
      // Mirror merch.js: a non-localized page (e.g. global-EN) serving an AU/IN/GB visitor
      // fetches that market's Global-EN locale, not en_US + country.
      if (market !== localeCountry) {
        const override = MARKET_LOCALE_OVERRIDES[language]?.[market];
        if (override) {
          locale = override;
          if (override.endsWith(`_${market}`)) country = undefined;
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
