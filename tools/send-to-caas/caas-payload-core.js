// Self-contained CaaS card -> XDM payload logic.
//
// This is a LEAF module: it intentionally does NOT import libs/utils/utils.js or
// libs/blocks/caas/utils.js, so it can be bundled into a single self-contained
// file (those two files drag in Milo's entire bootstrap + lazy chunks, which
// breaks bundling). The only libs/ import allowed here is getUuid.js, which is
// itself leaf-safe (only uses crypto.subtle / TextEncoder).
//
// The functions inlined below (getMetadata, lingoActive, getLocale, LOCALES,
// LANGS, getPageLocale, getGrayboxExperienceId and the lang-first subsystem) are
// verbatim copies of their counterparts in libs/utils/utils.js and
// libs/blocks/caas/utils.js. Keep them in sync if the originals change.
//
// window / document references are intentionally kept as-is: a vm context is
// expected to provide them when this runs outside the browser.

/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */
import getUuid from '../../libs/utils/getUuid.js';
// The 706KB caas-tags.js taxonomy is NOT imported here. It is only needed as a
// fallback when the network tag fetch fails, so the host injects it lazily via
// setConfig({ getCaasTagsFallback }). Keeping it out of the leaf means: (a) the
// browser never eagerly downloads 706KB when the network fetch succeeds, and
// (b) the standalone UMD bundle stays small and single-file (a static import
// would bloat it; a dynamic import would force an unsupported code-split).

const CAAS_TAG_URL = 'https://www.adobe.com/chimera-api/tags';
const VALID_URL_RE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const VALID_MODAL_RE = /fragments(.*)#[a-zA-Z0-9_-]+$/;

const LANG_FIRST_SOURCE_MAPPINGS = { cc: 'hawks', dc: 'doccloud' };

const isKeyValPair = /(\s*\S+\s*:\s*\S+\s*)/;
const isValidUrl = (u) => VALID_URL_RE.test(u);
const isValidModal = (u) => VALID_MODAL_RE.test(u);

// ---------------------------------------------------------------------------
// Inlined leaf-safe copies of libs/utils/utils.js helpers
// ---------------------------------------------------------------------------

const LANGSTORE = 'langstore';
const PREVIEW = 'target-preview';
const PAGE_URL = new URL(window.location.href);

// Copied verbatim from libs/utils/utils.js (getMetadata).
function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

// Copied verbatim from libs/utils/utils.js (lingoActive).
function lingoActive() {
  const langFirst = (PAGE_URL.searchParams.get('langfirst') || getMetadata('langfirst'))?.toLowerCase();
  return ['true', 'on'].includes(langFirst);
}

// Copied verbatim from libs/utils/utils.js (hydrateLocale).
function hydrateLocale(locales, key) {
  const locale = locales[key];

  const buildExpandedLocale = (localeData, localeKey) => ({
    ...localeData,
    prefix: localeKey ? `/${localeKey}` : '',
    region: localeData.region || localeKey.split('_')[0] || 'us',
  });

  const isBaseLocale = !('base' in locale);
  if (isBaseLocale) {
    const hydratedChildren = Object.entries(locales)
      .filter(([, childLocale]) => childLocale.base === key)
      .reduce((acc, [childKey, childLocale]) => {
        const mergedLocale = { ...locale, ...childLocale, base: childLocale.base };
        acc[childKey] = buildExpandedLocale(mergedLocale, childKey);
        return acc;
      }, {});

    const hydratedBase = buildExpandedLocale(locale, key);
    return { ...hydratedBase, regions: hydratedChildren };
  }

  const hasValidBase = 'base' in locale && locales[locale.base] !== undefined;
  if (hasValidBase) {
    const baseLocale = locales[locale.base];
    const mergedLocale = { ...baseLocale, ...locale };
    return buildExpandedLocale(mergedLocale, key);
  }

  return { ...locale };
}

// Copied verbatim from libs/utils/utils.js (getLocale).
function getLocale(locales, pathname = window.location.pathname) {
  if (!locales) return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };

  const split = pathname.split('/');
  const localeString = split[1];
  const specialPrefix = [LANGSTORE, PREVIEW].includes(localeString) ? localeString : '';
  const ietfSegment = split[2];

  let matchedKey = '';
  if (specialPrefix) {
    matchedKey = Object.keys(locales).find((key) => locales[key]?.ietf?.startsWith(ietfSegment)) ?? '';
  } else if (localeString in locales) {
    matchedKey = localeString;
  }

  const locale = hydrateLocale(locales, matchedKey);
  if (specialPrefix) locale.prefix = `/${specialPrefix}${ietfSegment ? `/${ietfSegment}` : ''}`;
  return locale;
}

// ---------------------------------------------------------------------------
// Inlined leaf-safe copies of libs/blocks/caas/utils.js helpers
// ---------------------------------------------------------------------------

// Copied verbatim from libs/blocks/caas/utils.js (LANGS).
const LANGS = {
  en: 'en',
  de: 'de',
  fr: 'fr',
  'fr-ca': 'fr-ca',
  ja: 'ja',
  ar: 'ar',
  arabic: 'ar',
  bg: 'bg',
  cs: 'cs',
  da: 'da',
  es: 'es',
  et: 'et',
  fi: 'fi',
  he: 'he',
  hu: 'hu',
  it: 'it',
  ko: 'ko',
  lt: 'lt',
  lv: 'lv',
  nl: 'nl',
  no: 'no',
  pl: 'pl',
  pt: 'pt',
  ro: 'ro',
  ru: 'ru',
  sk: 'sk',
  sl: 'sl',
  sv: 'sv',
  tr: 'tr',
  uk: 'uk',
  'zh-hant': 'zh-hant',
  th: 'th',
  fil: 'fil',
  id: 'id',
  ms: 'ms',
  vi: 'vi',
  hi: 'hi',
  el: 'el',
  '': 'en',
};

// Copied verbatim from libs/blocks/caas/utils.js (LOCALES).
const LOCALES = {
  // Americas
  ar: { ietf: 'es-AR' },
  br: { ietf: 'pt-BR' },
  ca: { ietf: 'en-CA' },
  ca_fr: { ietf: 'fr-CA' },
  cl: { ietf: 'es-CL' },
  co: { ietf: 'es-CO' },
  cr: { ietf: 'es-CR' },
  ec: { ietf: 'es-EC' },
  el: { ietf: 'es-EL' },
  gt: { ietf: 'es-GT' },
  la: { ietf: 'es-LA' },
  mx: { ietf: 'es-MX' },
  pe: { ietf: 'es-PE' },
  pr: { ietf: 'es-PR' },
  '': { ietf: 'en-US' },
  langstore: { ietf: 'en-US' },
  // EMEA
  africa: { ietf: 'en-africa' },
  gb: { ietf: 'xx-gb' },
  be_fr: { ietf: 'fr-BE' },
  be_en: { ietf: 'en-BE' },
  be_nl: { ietf: 'nl-BE' },
  be: { ietf: 'xx-be' },
  cy_en: { ietf: 'en-CY' },
  cy: { ietf: 'xx-cy' },
  dk: { ietf: 'da-DK' },
  de: { ietf: 'de-DE' },
  ee: { ietf: 'et-EE' },
  eg_ar: { ietf: 'ar-EG' },
  eg_en: { ietf: 'en-GB' },
  eg: { ietf: 'xx-eg' },
  es: { ietf: 'es-ES' },
  fr: { ietf: 'fr-FR' },
  gr_en: { ietf: 'en-GR' },
  gr_el: { ietf: 'el-GR' },
  gr: { ietf: 'xx-gr' },
  ie: { ietf: 'en-IE' },
  il_en: { ietf: 'en-IL' },
  il_he: { ietf: 'he-il' },
  il: { ietf: 'xx-il' },
  it: { ietf: 'it-IT' },
  kw_ar: { ietf: 'ar-KW' },
  kw_en: { ietf: 'en-GB' },
  kw: { ietf: 'xx-kw' },
  lv: { ietf: 'lv-LV' },
  lt: { ietf: 'lt-LT' },
  lu_de: { ietf: 'de-LU' },
  lu_en: { ietf: 'en-LU' },
  lu_fr: { ietf: 'fr-LU' },
  lu: { ietf: 'xx-lu' },
  hu: { ietf: 'hu-HU' },
  mt: { ietf: 'en-MT' },
  mena_en: { ietf: 'en-mena' },
  mena_ar: { ietf: 'ar-mena' },
  mena: { ietf: 'xx-mena' },
  ng: { ietf: 'en-NG' },
  nl: { ietf: 'nl-NL' },
  no: { ietf: 'no-NO' },
  pl: { ietf: 'pl-PL' },
  pt: { ietf: 'pt-PT' },
  qa_ar: { ietf: 'ar-QA' },
  qa_en: { ietf: 'en-GB' },
  qa: { ietf: 'xx-qa' },
  ro: { ietf: 'ro-RO' },
  sa_en: { ietf: 'en-sa' },
  ch_fr: { ietf: 'fr-CH' },
  ch_de: { ietf: 'de-CH' },
  ch_it: { ietf: 'it-CH' },
  ch: { ietf: 'xx-ch' },
  si: { ietf: 'sl-SI' },
  sk: { ietf: 'sk-SK' },
  fi: { ietf: 'fi-FI' },
  se: { ietf: 'sv-SE' },
  tr: { ietf: 'tr-TR' },
  ae_en: { ietf: 'en-ae' },
  uk: { ietf: 'en-GB' },
  at: { ietf: 'de-AT' },
  cz: { ietf: 'cs-CZ' },
  bg: { ietf: 'bg-BG' },
  ru: { ietf: 'ru-RU' },
  cis: { ietf: 'xx-cis' },
  ua: { ietf: 'uk-UA' },
  ae_ar: { ietf: 'ar-ae' },
  ae: { ietf: 'xx-ae' },
  sa_ar: { ietf: 'ar-sa' },
  sa: { ietf: 'xx-sa' },
  za: { ietf: 'en-ZA' },
  // Asia Pacific
  apac: { ietf: 'xx-apac' },
  hk: { ietf: 'xx-hk' },
  au: { ietf: 'en-AU' },
  hk_en: { ietf: 'en-HK' },
  in: { ietf: 'en-in' },
  id_id: { ietf: 'id-id' },
  id_en: { ietf: 'en-id' },
  id: { ietf: 'xx-id' },
  my_ms: { ietf: 'ms-my' },
  my_en: { ietf: 'en-my' },
  my: { ietf: 'xx-my' },
  nz: { ietf: 'en-nz' },
  ph_en: { ietf: 'en-ph' },
  ph_fil: { ietf: 'fil-PH' },
  ph: { ietf: 'xx-ph' },
  sg: { ietf: 'en-SG' },
  th_en: { ietf: 'en-th' },
  in_hi: { ietf: 'hi-in' },
  th_th: { ietf: 'th-th' },
  th: { ietf: 'xx-th' },
  cn: { ietf: 'zh-CN' },
  hk_zh: { ietf: 'zh-HK' },
  tw: { ietf: 'zh-TW' },
  jp: { ietf: 'ja-JP' },
  kr: { ietf: 'ko-KR' },
  vn_en: { ietf: 'en-vn' },
  vn_vi: { ietf: 'vi-VN' },
  vn: { ietf: 'xx-vn' },
  sea: { ietf: 'xx-sea' },
};

// In libs/blocks/caas/utils.js, pageLocales derives from the page-level config
// (pageConfigHelper().locales). The leaf must not import utils.js, and the
// send-to-caas config carries no `.locales`, so the page locale list is empty
// here. getPageLocale then defaults to '' (en_US), matching the browser path
// for the send-to-caas tool which never populates page locales.
const pageLocales = [];

// Copied verbatim from libs/blocks/caas/utils.js (getPageLocale).
function getPageLocale(currentPath, locales = pageLocales) {
  const possibleLocale = currentPath.split('/')[1];
  if (locales.includes(possibleLocale)) {
    return possibleLocale;
  }
  // defaults to en_US
  return '';
}

// Copied verbatim from libs/blocks/caas/utils.js (getGrayboxExperienceId).
const getGrayboxExperienceId = (
  hostname = window.location?.hostname || '',
  pathname = window.location?.pathname || '',
) => {
  // Only allow trusted Adobe graybox domains
  const isAdobeGraybox = /^[^.]+\.([a-z-]+-)?graybox\.adobe\.com$/.test(hostname);
  const isStageGraybox = (
    (hostname.endsWith('.aem.page') || hostname.endsWith('.aem.live'))
    && hostname.includes('graybox')
  );

  // Check for graybox.adobe.com format: https://[exn].[pn]-graybox.adobe.com/[path].html
  if (isAdobeGraybox) {
    const parts = hostname.split('.');
    if (parts.length >= 3 && (parts[1] === 'graybox' || parts[1].includes('-graybox'))) {
      return parts[0]; // Return the experience ID (first part)
    }
  }

  // Check for stage format: https://stage--[pn]-graybox–adobecom.aem.page/[exn]/[path]
  if (isStageGraybox) {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      return pathParts[0]; // Return the experience ID (first path segment)
    }
  }

  return null;
};

// ---- Lang-first subsystem (copied from libs/blocks/caas/utils.js) ----

// Copied verbatim from libs/blocks/caas/utils.js (isLocaleInRegionalSites).
const isLocaleInRegionalSites = (regionalSites, locStr, langStr) => {
  if (!regionalSites) return false;
  const sites = regionalSites
    .split(',')
    .map((site) => site.trim().replace(/^\//, ''));
  return (
    sites.includes(locStr)
    || (Boolean(langStr) && sites.includes(`${locStr}_${langStr}`))
  );
};

// Copied verbatim from libs/blocks/caas/utils.js (fetchLingoSiteMapping).
let lingoSiteMappingPromise;
function fetchLingoSiteMapping(fqdn = 'www.adobe.com') {
  if (!lingoSiteMappingPromise) {
    lingoSiteMappingPromise = fetch(`https://www.adobe.com/federal/assets/data/lingo-site-mapping.json?${fqdn}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      });
  }
  return lingoSiteMappingPromise;
}

// Copied verbatim from libs/blocks/caas/utils.js (getLingoSiteLocale).
async function getLingoSiteLocale(origin, path, fqdn = 'www.adobe.com') {
  const host = origin.toLowerCase();
  let lingoSiteMapping = {
    country: 'xx',
    language: 'en',
  };

  // Extract pathname from URL if path includes domain
  let pathname = path;
  if (path.includes('://') || !path.startsWith('/')) {
    try {
      const url = new URL(path.startsWith('http') ? path : `https://${path}`);
      pathname = url.pathname;
    } catch (e) {
      // If it doesn't start with /, try to extract pathname manually
      if (!path.startsWith('/')) {
        const pathParts = path.split('/');
        // Remove domain part (first element)
        pathname = `/${pathParts.slice(1).join('/')}`;
      }
    }
  }
  const localeStr = pathname.split('/')[1];

  try {
    let siteId;
    const configJson = await fetchLingoSiteMapping(fqdn);

    const siteQueryIndexMap = configJson['site-query-index-map']?.data ?? [];
    const siteLocalesData = configJson['site-locales']?.data ?? [];

    // Map origin (caasOrigin) to uniqueSiteId for locale lookup
    const matchedByOrigin = siteQueryIndexMap.find(({ caasOrigin }) => host === caasOrigin);
    if (matchedByOrigin) {
      siteId = matchedByOrigin.uniqueSiteId;
    }
    // check if the localeStr is in the baseSite or regionalSites.
    // if not, use the og country/language logic
    if (!siteLocalesData.some(({ uniqueSiteId, baseSite, regionalSites }) => uniqueSiteId === siteId && (localeStr === baseSite.split('/')[1] || isLocaleInRegionalSites(regionalSites, localeStr)))) {
      const locale = LOCALES[localeStr]?.ietf || 'en-US';
      /* eslint-disable-next-line prefer-const */
      let [currLang, currCountry] = locale.split('-');
      return {
        country: currCountry,
        language: currLang,
      };
    }

    siteLocalesData
      .filter(({ uniqueSiteId }) => uniqueSiteId === siteId)
      .forEach(({ baseSite, regionalSites }) => {
        if (localeStr === baseSite.split('/')[1]) {
          lingoSiteMapping = {
            country: 'xx',
            language: baseSite.split('/')[1],
          };
          return;
        }
        if (isLocaleInRegionalSites(regionalSites, localeStr)) {
          if (baseSite === '/') {
            lingoSiteMapping = {
              country: localeStr,
              language: 'en',
            };
          }
          lingoSiteMapping = {
            country: localeStr,
            language: baseSite.split('/')[1],
          };
        }
      });
    return lingoSiteMapping;
  } catch (e) {
    window.lana?.log(`Failed to load lingo-site-mapping.json: ${e}`, {
      tags: 'caas',
      severity: 'error',
    });
    lingoSiteMapping.fromFallback = true;
  }
  return lingoSiteMapping;
}

// Copied verbatim from libs/blocks/caas/utils.js (getLanguageFirstCountryAndLang).
const getLanguageFirstCountryAndLang = async (path, origin, fqdn) => {
  const localeArr = path.split('/');
  let langStr = 'en';
  let countryStr = 'xx';
  let fromFallback = false;
  if (origin.toLowerCase() === 'news') {
    langStr = LANGS[localeArr[1]] ?? LANGS[''] ?? 'en';
    countryStr = LOCALES[localeArr[2]] ?? 'xx';
    if (typeof countryStr === 'object') {
      countryStr = countryStr.ietf?.split('-')[1] ?? 'xx';
    }
  } else {
    const mapping = await getLingoSiteLocale(origin, path, fqdn);
    fromFallback = mapping.fromFallback === true;
    countryStr = LOCALES[mapping.country.toLowerCase()] ?? 'xx';
    if (typeof countryStr === 'object') {
      countryStr = countryStr.ietf?.split('-')[1] ?? 'xx';
    }
    langStr = mapping.language ?? 'en';
  }
  return {
    country: countryStr.toLowerCase(),
    lang: langStr.toLowerCase(),
    ...(fromFallback && { fromFallback: true }),
  };
};

// ---------------------------------------------------------------------------
// CaaS card -> XDM payload logic (moved verbatim from send-utils.js)
// ---------------------------------------------------------------------------

const [setConfig, getConfig] = (() => {
  let config = {
    isInjectedDoc: () => this.doc !== document,
    doc: document,
  };
  return [
    (c) => {
      config = { ...config, ...c };
      return config;
    },
    () => config,
  ];
})();

const getKeyValPairs = (s) => {
  if (!s) return [];
  return s
    .split(',')
    .filter((v) => v.length)
    .filter((v) => isKeyValPair.test(v))
    .map((v) => {
      const [key, ...value] = v.split(':');
      return { [key.trim()]: value.join(':').trim() };
    });
};

const addHost = (url) => {
  if (url.startsWith('http')) return url;
  const { host } = getConfig();
  return `https://${host}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getMetaContent = (propType, propName) => {
  const metaEl = getConfig().doc.querySelector(`meta[${propType}='${propName}']`);
  if (!metaEl) return undefined;
  return metaEl.content;
};

const prefixHttps = (url) => {
  if (!(url?.startsWith('https://') || url?.startsWith('http://'))) {
    return `https://${url}`;
  }
  return url;
};

const flattenLink = (link) => {
  const htmlElement = document.createElement('div');
  htmlElement.innerHTML = link;
  return htmlElement.querySelector('a').getAttribute('href');
};

const checkUrl = (url, errorMsg) => {
  if (url === undefined || isValidModal(url)) return url;
  const flatUrl = url.includes('href=') ? flattenLink(url) : url;
  if (isValidModal(flatUrl)) {
    return flatUrl;
  }
  return isValidUrl(flatUrl) ? prefixHttps(flatUrl) : { error: errorMsg };
};

// Case-insensitive search through tag name, path, id and title for the searchStr
const findTag = (tags, searchStr, ignore = []) => {
  const childTags = [];
  let matchingTag = Object.values(tags).find((tag) => {
    if (
      ignore.includes(tag.title)
      || ignore.includes(tag.name)
      || ignore.includes(tag.path)
      || ignore.includes(tag.tagID)
    ) return false;

    if (tag.tags && Object.keys(tag.tags).length) {
      childTags.push(tag.tags);
    }

    const tagMatches = [
      tag.title.toLowerCase(),
      tag.name,
      tag.path,
      tag.path.replace('/content/cq:tags/', ''),
      /* c8 ignore next */
      tag.tagID.toLowerCase(),
    ];

    if (tagMatches.includes(searchStr.toLowerCase())) return true;

    return false;
  });

  if (!matchingTag) {
    childTags.some((childTag) => {
      matchingTag = findTag(childTag, searchStr, ignore);
      return matchingTag;
    });
  }

  return matchingTag;
};

const [getCaasTags, loadCaasTags] = (() => {
  let tags;
  return [
    () => tags,
    async () => {
      try {
        const resp = await fetch(CAAS_TAG_URL);
        if (resp.ok) {
          const json = await resp.json();
          tags = json.namespaces.caas.tags;
          return;
        }
      } catch (e) {
        // ignore
      }
      // Network fetch failed — use the host-injected fallback taxonomy if present.
      // The browser injects a lazy loader (see send-utils.js); the milo-caas
      // server path has network access so it normally never reaches here.
      const { getCaasTagsFallback } = getConfig();
      if (getCaasTagsFallback) {
        const fallback = await getCaasTagsFallback();
        tags = fallback?.namespaces?.caas?.tags;
      }
    }];
})();

const getTag = (tagName, errors) => {
  if (!tagName) return undefined;
  const caasTags = getCaasTags();
  // Skip the Events namespace root by tagID (not by title "Events", which would also
  // exclude unrelated tags like caas:newsroom/article/events). Falls back to a search
  // inside the Events subtree only if no non-Events match is found, preserving the
  // historical "prefer non-Events" resolution.
  const tag = findTag(caasTags, tagName, ['caas:events'])
    || findTag(caasTags.events.tags, tagName, []);

  if (!tag) {
    errors.push(tagName);
  }

  return tag;
};

const getTags = (s) => {
  let rawTags = [];
  if (s) {
    rawTags = s.toLowerCase().split(/,|(\s+)|(\\n)|;/g).filter((t) => t && t.trim() && t !== '\n');
  }

  const errors = [];

  const tagIds = rawTags.map((tag) => getTag(tag, errors))
    .filter((tag) => tag !== undefined)
    .map((tag) => tag.tagID);

  const tags = [...new Set(tagIds)]
    .map((tagID) => ({ id: tagID }));

  return {
    tagErrors: errors,
    tags,
  };
};

const getDateProp = (dateStr, errorMsg) => {
  if (!dateStr) return undefined;
  try {
    const date = new Date(dateStr);
    if (date.getFullYear() < 2000) return { error: `${errorMsg} - Date is before the year 2000` };
    return date.toISOString();
  } catch (e) {
    return { error: errorMsg };
  }
};

const processRepoForFloodgate = (repo, fgColor) => {
  if (repo && fgColor && fgColor !== 'default') {
    const fgInfix = `-fg-${fgColor}`;
    if (repo.endsWith(fgInfix)) {
      return repo.slice(0, repo.lastIndexOf(fgInfix));
    }
  }
  return repo;
};

export const getFloodgateColorFromHost = (host) => {
  const parts = host?.split('.')[0].split('--') || [];
  const repo = parts.length >= 3 ? parts.slice(1, -1).join('--') : '';
  const match = repo.match(/-fg-(\w+)$/);
  return match ? match[1] : '';
};

export const getOrigin = (fgColor) => {
  const { project, repo } = getConfig();
  const origin = project || processRepoForFloodgate(repo, fgColor);

  const originLC = LANG_FIRST_SOURCE_MAPPINGS[origin.toLowerCase()] || origin;
  if (originLC) {
    return originLC;
  }

  if (window.location.hostname.endsWith('.page')) {
    const [, singlePageRepo] = window.location.hostname.split('.')[0].split('--');
    return processRepoForFloodgate(singlePageRepo, fgColor);
  }

  throw new Error('No Project or Repo defined in config');
};

const getUrlWithoutFile = (url) => `${url.split('/').slice(0, -1).join('/')}/`;

const getImagePathMd = (keyName) => {
  const mdEl = getConfig().doc.querySelector('.card-metadata');
  if (!mdEl) return null;

  let url = '';
  [...mdEl.children].some((n) => {
    const key = n.firstElementChild.textContent?.trim().toLowerCase();
    if (key !== keyName) return false;

    const img = n.lastElementChild.querySelector('img');

    if (img) {
      let imgSrc = img.src;
      if (getConfig().bulkPublish) {
        const rawImgSrc = img.attributes.src.value;
        if (rawImgSrc.startsWith('./')) {
          const urlWithoutFile = getUrlWithoutFile(getConfig().pageUrl);
          imgSrc = `${urlWithoutFile}${rawImgSrc}`;
        } else if (rawImgSrc.startsWith('/')) {
          imgSrc = `${new URL(getConfig.pageUrl.origin)}${rawImgSrc}`;
        } else {
          imgSrc = rawImgSrc;
        }
      }
      url = new URL(imgSrc)?.pathname;
    } else { // url string to img
      url = n.lastElementChild.textContent?.trim();
    }
    return true;
  });
  return url;
};

const getCardImageUrl = () => {
  const { doc } = getConfig();
  const imageUrl = getImagePathMd('image')
    || getImagePathMd('cardimage')
    || getImagePathMd('cardimagepath')
    || doc.querySelector('main')?.querySelector('img')?.src.replace(/\?.*/, '')
    || doc.querySelector('meta[property="og:image"]')?.content;

  if (!imageUrl) return null;
  return addHost(imageUrl);
};

const getCardImageAltText = () => {
  // eslint-disable-next-line no-use-before-define
  const pageMd = parseCardMetadata();
  if (pageMd.cardimage) return '';
  const cardImageUrl = getCardImageUrl();
  const cardImagePath = new URL(cardImageUrl).pathname.split('/').pop();
  const imgTagForCardImage = getConfig().doc.querySelector(`img[src*="${cardImagePath}"]`);
  return imgTagForCardImage?.alt;
};

const getBadges = (p) => {
  const badges = [];
  if (p.badgeimage) {
    badges.push({ type: 'image', value: addHost(p.badgeimage) });
  }
  if (p.badgetext) {
    badges.push({ type: 'text', value: p.badgetext });
  }
  return badges;
};

const MAX_LANG_FIRST_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * Runs the language-first retry loop. Only retries when the resolver returns the
 * default (en/xx) because of an error (fromFallback: true), e.g. mapping fetch failed.
 * When the result is a real success (or default without error), returns immediately.
 * Used by getBulkPublishLangAttr; exported for tests.
 * @param {object} options - prodUrl, repo, host
 * @param {Function} getLangFirst - async (prodUrl, repo, host) => { country, lang, fromFallback? }
 * @param {{ retryDelayMs?: number }} [retryOpts] - optional; use in tests to avoid delay
 * @returns {Promise<string>} lang-country e.g. 'de-xx'
 */
export async function runLanguageFirstRetry(options, getLangFirst, retryOpts = {}) {
  const { retryDelayMs = RETRY_DELAY_MS } = retryOpts;

  let lastResult;
  for (let attempt = 0; attempt <= MAX_LANG_FIRST_RETRIES; attempt += 1) {
    if (attempt > 0) await delay(retryDelayMs);

    const result = await getLangFirst(
      options.prodUrl,
      options.repo,
      options.host,
    );
    const { country, lang, fromFallback } = result;
    lastResult = `${lang}-${country}`;

    const gotDefault = lang === 'en' && country === 'xx';
    if (!gotDefault || !fromFallback) return lastResult;
  }

  return lastResult;
}

const getBulkPublishLangAttr = async (options) => {
  let { getLocale: configGetLocale } = getConfig();
  if (options.languageFirst) {
    const mappedGetLangFirst = (path, repo, fqdn) => getLanguageFirstCountryAndLang(
      path,
      LANG_FIRST_SOURCE_MAPPINGS[repo.toLowerCase()] || repo,
      fqdn,
    );
    return runLanguageFirstRetry(options, mappedGetLangFirst);
  }
  if (!configGetLocale) {
    // Use the leaf-local getLocale (an inlined copy of libs/utils/utils.js).
    configGetLocale = getLocale;
    setConfig({ getLocale: configGetLocale });
  }
  return configGetLocale(LOCALES, options.prodUrl).ietf;
};

const getCountryAndLang = async (options, origin) => {
  const langFirst = lingoActive();
  if (langFirst) {
    const isBulkPublisher = window.location.pathname.includes('/tools/send-to-caas/bulkpublisher');
    const fqdn = isBulkPublisher ? 'bulkpublisher' : window.location.hostname;
    return getLanguageFirstCountryAndLang(
      window.location.pathname,
      LANG_FIRST_SOURCE_MAPPINGS[origin.toLowerCase()] || origin,
      fqdn,
    );
  }
  /* c8 ignore next */
  const langStr = window.location.pathname.includes('/tools/send-to-caas/bulkpublisher')
    ? await getBulkPublishLangAttr(options)
    : (LOCALES[window.location.pathname.split('/')[1]] || LOCALES['']).ietf;
  const langAttr = langStr?.toLowerCase().split('-') || [];

  const [lang = 'en', country = 'us'] = langAttr;
  return {
    country,
    lang,
  };
};

const parseCardMetadata = () => {
  const pageMd = {};
  const marqueeMetadata = getConfig().doc.querySelector('.caas-marquee-metadata');
  const cardMetadata = getConfig().doc.querySelector('.card-metadata');
  const mdEl = cardMetadata || marqueeMetadata;
  const allowHtml = ['description'];
  if (mdEl) {
    mdEl.childNodes.forEach((n) => {
      const key = n.children?.[0]?.textContent?.toLowerCase();
      let val = n.children?.[1]?.textContent;
      if (marqueeMetadata && allowHtml.includes(key)) {
        val = n.children?.[1]?.innerHTML;
      }
      if (!key) return;

      pageMd[key] = val;
    });
  }
  return pageMd;
};

function checkCtaUrl(s, options, i) {
  if ((s?.trim() === '' || s === undefined) && i > 1) return '';
  const url = (s?.trim() !== '' && s !== undefined) ? s : (options.prodUrl || window.location.origin + window.location.pathname);
  return checkUrl(url, `Invalid Cta${i}Url: ${url}`);
}

/**
 * Optionally injects the page locale into a CTA URL if configured via the metadata field.
 * @param {string|object} val - The result from checkCtaUrl (either URL string or error object).
 * @returns {string|object} - Possibly modified URL string or original value.
 */
function localizeCtaUrl(val) {
  if (typeof val !== 'string' || val.trim() === '') return val;
  try {
    const injectFlag = (getMetadata('caaslocaleinject') || '').toLowerCase() === 'true';
    const pageLocale = getPageLocale(window.location.pathname);
    if (!injectFlag || !pageLocale) return val;
    const urlObj = new URL(val, window.location.origin);
    if (!getPageLocale(urlObj.pathname)) {
      // prepend locale segment to the URL path (pathname always starts with '/')
      urlObj.pathname = `/${pageLocale}${urlObj.pathname}`;
      return urlObj.toString();
    }
  } catch {
    // ignore and return original value
  }
  return val;
}

/** card metadata props - either a func that computes the value or
 * 0 to use the string as is
 * funcs that return an object with { error: string } will report the error
 */
const props = {
  arbitrary: (s) => getKeyValPairs(s).map((pair) => (pair)),
  badgeimage: () => getImagePathMd('badgeimage'),
  badgetext: 0,
  bookmarkaction: 0,
  bookmarkenabled: (s = '') => {
    if (s) {
      const lcs = s.toLowerCase();
      if (lcs === 'true' || lcs === 'on' || lcs === 'yes') {
        return true;
      }
    }
    return undefined;
  },
  bookmarkicon: 0,
  carddescription: 0,
  cardtitle: 0,
  cardimage: () => getCardImageUrl(),
  cardimagealttext: (s) => s || getCardImageAltText(),
  contentid: (_, options) => getUuid(options.prodUrl),
  contenttype: (s) => s || getMetaContent('property', 'og:type') || getConfig().contentType,
  country: async (s, options) => {
    if (s) return s;
    const fgColor = options.floodgatecolor || getMetadata('floodgatecolor');
    const origin = getOrigin(fgColor);
    const { country } = await getCountryAndLang(options, origin);
    return country;
  },
  created: (s) => {
    if (s) {
      return getDateProp(s, `Invalid Created Date: ${s}`);
    }
    const cardDate = parseCardMetadata()?.carddate;
    if (cardDate) {
      return getDateProp(cardDate, `Invalid Date: ${cardDate}`);
    }

    const pubDate = getMetaContent('name', 'publishdate') || getMetaContent('name', 'publication-date');
    const { doc, lastModified } = getConfig();
    return pubDate
      ? getDateProp(pubDate, `publication-date metadata is not a valid date: ${pubDate}`)
      : getDateProp(lastModified || doc.lastModified, `document.lastModified is not a valid date: ${doc.lastModified}`);
  },
  cta1icon: (s) => checkUrl(s, `Invalid Cta1Icon url: ${s}`),
  cta1style: 0,
  cta1target: 0,
  cta1text: 0,
  cta1url: (s, options) => localizeCtaUrl(checkCtaUrl(s, options, 1)),
  cta2icon: (s) => checkUrl(s, `Invalid Cta2Icon url: ${s}`),
  cta2style: 0,
  cta2target: 0,
  cta2text: 0,
  cta2url: (s) => localizeCtaUrl(checkCtaUrl(s, {}, 2)),
  description: (s) => s || getMetaContent('name', 'description') || '',
  details: 0,
  entityid: (_, options) => {
    const floodGateColor = options.floodgatecolor || getMetadata('floodgatecolor') || '';
    const salt = floodGateColor === 'default' || floodGateColor === '' ? '' : floodGateColor;
    return getUuid(`${options.prodUrl}${salt}`);
  },
  env: (s) => s || '',
  eventduration: 0,
  eventend: (s) => getDateProp(s, `Invalid Event End Date: ${s}`),
  eventstart: (s) => getDateProp(s, `Invalid Event Start Date: ${s}`),
  floodgatecolor: (s, options) => s || options.floodgatecolor || getMetadata('floodgatecolor') || 'default',
  lang: async (s, options) => {
    if (s) return s;
    const fgColor = options.floodgatecolor || getMetadata('floodgatecolor');
    const origin = getOrigin(fgColor);
    const { lang } = await getCountryAndLang(options, origin);
    return lang;
  },
  modified: (s) => {
    const { doc, lastModified } = getConfig();
    return s
      ? getDateProp(s, `Invalid Modified Date: ${s}`)
      : getDateProp(lastModified || doc.lastModified, `document.lastModified is not a valid date: ${doc.lastModified}`);
  },
  origin: (s, options) => {
    if (s) return s;
    const fgColor = options.floodgatecolor || getMetadata('floodgatecolor');
    return getOrigin(fgColor);
  },

  playurl: (s) => checkUrl(s, `Invalid PlayURL: ${s}`),
  primarytag: (s) => {
    const tag = getTag(s);
    return tag ? { id: tag.tagID } : {};
  },
  style: (s) => s || 'default',
  tags: (s) => getTags(s),
  title: (s) => s || getMetaContent('property', 'og:title') || '',
  uci: (s, options) => s || options.prodUrl || window.location.pathname,
  url: (s, options) => {
    const url = s || options.prodUrl || window.location.origin + window.location.pathname;
    return checkUrl(url, `Invalid URL: ${url}`);
  },
};

// Map the flat props into the structure needed by CaaS
const getCaasProps = (p, pageUrl = null) => {
  // Get graybox experience ID if on graybox domain
  let grayboxExperienceId = null;

  if (pageUrl) {
    // Extract hostname and pathname from the provided URL
    try {
      const url = new URL(pageUrl);
      grayboxExperienceId = getGrayboxExperienceId(url.hostname, url.pathname);
    } catch (e) {
      // If URL parsing fails, fall back to window.location
      grayboxExperienceId = getGrayboxExperienceId();
    }
  } else {
    // Fall back to window.location if no URL provided
    grayboxExperienceId = getGrayboxExperienceId();
  }

  const caasProps = {
    entityId: p.entityid,
    contentId: p.contentid,
    contentType: p.contenttype,
    environment: p.env,
    url: p.url,
    floodGateColor: p.floodgatecolor,
    universalContentIdentifier: p.uci,
    title: p.cardtitle || p.title,
    description: p.carddescription || p.description,
    createdDate: p.created,
    modifiedDate: p.modified,
    tags: p.tags,
    primaryTag: p.primarytag,
    ...(p.cardimage && {
      thumbnail: {
        altText: p.cardimagealttext,
        url: p.cardimage,
      },
    }),
    country: p.country,
    language: p.lang,
    cardData: {
      style: p.style,
      headline: p.cardtitle || p.title,
      ...(p.details && { details: p.details }),
      ...((p.bookmarkenabled || p.bookmarkicon || p.bookmarkaction) && {
        bookmark: {
          enabled: p.bookmarkenabled,
          bookmarkIcon: p.bookmarkicon,
          action: p.bookmarkaction,
        },
      }),
      badges: getBadges(p),
      ...(p.playurl && { playUrl: p.playurl }),
      ...((p.cta1url || p.cta2url) && {
        cta: {
          ...(p.cta1url && {
            primaryCta: {
              text: p.cta1text,
              url: p.cta1url,
              style: p.cta1style,
              icon: p.cta1icon,
              target: p.cta1target,
            },
          }),
          ...((p.cta2url || (p.cta2style === 'button' && p.cta2text)) && {
            secondaryCta: {
              text: p.cta2text,
              url: p.cta2style === 'button' ? p.cta1url : p.cta2url,
              style: p.cta2style,
              icon: p.cta2icon,
              target: p.cta2target,
            },
          }),
        },
      }),
      ...((p.eventduration || p.eventstart || p.eventend) && {
        event: {
          duration: p.eventduration,
          startDate: p.eventstart,
          endDate: p.eventend,
        },
      }),
    },
    origin: p.origin,
    ...(p.arbitrary?.length && { arbitrary: p.arbitrary }),
    ...(grayboxExperienceId && { gbExperienceID: grayboxExperienceId }),
  };
  return caasProps;
};

const getCaaSMetadata = async (pageMd, options) => {
  const md = {};
  const errors = [];
  let tagErrors = [];
  let tags = [];
  // for-of required to await any async computeVal's
  for (const [key, computeFn] of Object.entries(props)) {
    const val = computeFn ? await computeFn(pageMd[key], options) : pageMd[key];
    if (val?.error) {
      errors.push(val.error);
    } else if (val?.tagErrors !== undefined) {
      tagErrors = val.tagErrors;
      md[key] = val.tags;
      tags = val.tags.map((t) => t.id);
    } else if (val !== undefined) {
      md[key] = val;
    }
  }
  if (!md.contenttype && tags.length) {
    md.contenttype = tags.find((tag) => tag.startsWith('caas:content-type'));
  }

  return { caasMetadata: md, errors, tags, tagErrors };
};

const getCardMetadata = async (options) => {
  const pageMd = parseCardMetadata();
  return getCaaSMetadata(pageMd, options);
};

// A page only participates in CaaS auto-publish if it has a .card-metadata block.
const hasCardMetadata = (dom) => !!dom?.querySelector?.('.card-metadata');

// Per-page explicit override: a row inside .card-metadata of the form
// "auto-publish | false" lets an author opt a single page out without
// touching the site config.
const isDisabledOnPage = (dom) => {
  if (!dom?.querySelector) return false;
  const md = dom.querySelector('.card-metadata');
  if (!md) return false;
  const rows = [...md.querySelectorAll(':scope > div')];
  return rows.some((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return false;
    const key = cells[0].textContent.trim().toLowerCase();
    const val = cells[1].textContent.trim().toLowerCase();
    return key === 'auto-publish' && val === 'false';
  });
};

// Public payload builder: runs the full card -> XDM transform but stops before
// posting, so non-browser hosts (e.g. the milo-caas scheduled service) can reuse
// the exact business logic. The caller supplies the parsed DOM and decides what
// to do with the result (post, skip on errors, skip when there are no tags, etc.).
const buildCaasXdmPayload = async ({
  dom,
  pageUrl,
  lastModified,
  host,
  repo,
  floodgatecolor = 'default',
  languageFirst,
} = {}) => {
  setConfig({
    bulkPublish: true,
    doc: dom,
    pageUrl,
    lastModified,
    host,
    repo,
  });
  await loadCaasTags();
  const { caasMetadata, errors, tags, tagErrors } = await getCardMetadata({
    prodUrl: pageUrl,
    host,
    repo,
    floodgatecolor,
    languageFirst,
  });
  const caasProps = caasMetadata && !errors?.length
    ? getCaasProps(caasMetadata, pageUrl)
    : null;
  return { caasProps, caasMetadata, errors, tags, tagErrors };
};

export {
  buildCaasXdmPayload,
  checkUrl,
  getCardMetadata,
  getCaasProps,
  getConfig,
  getKeyValPairs,
  hasCardMetadata,
  isDisabledOnPage,
  loadCaasTags,
  setConfig,
};
