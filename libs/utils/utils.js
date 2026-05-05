/* eslint-disable no-console */
const BOT_REGEX = /GoogleBot|Google-InspectionTool|BingBot|PerplexityBot|Perplexity-User|ClaudeBot|Claude-User|Claude-SearchBot|Tokowaka-AI|ChatGPT-User|GPTBot|OAI-SearchBot|AdobeEdgeOptimize-AI/i;
export const isBot = () => BOT_REGEX.test(navigator.userAgent);

const MILO_TEMPLATES = [
  '404',
  'featured-story',
];
const C1_BLOCKS = [
  'accordion',
  'action-item',
  'action-scroller',
  'adobetv',
  'article-feed',
  'article-header',
  'aside',
  'author-header',
  'brand-concierge',
  'brick',
  'bulk-publish',
  'bulk-publish-v2',
  'caas',
  'caas-config',
  'caas-marquee',
  'caas-marquee-metadata',
  'card',
  'card-horizontal',
  'card-metadata',
  'carousel',
  'chart',
  'columns',
  'comparison-table',
  'editorial-card',
  'email-collection',
  'faas',
  'featured-article',
  'figure',
  'form',
  'fragment',
  'featured-article',
  'gist',
  'global-footer',
  'global-navigation',
  'graybox',
  'footer',
  'gnav',
  'hero-marquee',
  'how-to',
  'icon-block',
  'iframe',
  'instagram',
  'language-selector',
  'language-banner',
  'market-selector',
  'locui',
  'locui-create',
  'm7',
  'marketo',
  'marketo-config',
  'marquee',
  'marquee-anchors',
  'martech-metadata',
  'media',
  'merch',
  'merch-card',
  'merch-card-autoblock',
  'merch-card-collection-autoblock',
  'merch-offers',
  'mmm',
  'mnemonic-list',
  'mobile-app-banner',
  'modal',
  'modal-metadata',
  'notification',
  'nps-csat-form',
  'pdf-viewer',
  'quote',
  'read-more',
  'recommended-articles',
  'region-nav',
  'review',
  'section-metadata',
  'slideshare',
  'preflight',
  'promo',
  'quick-facts',
  'quiz',
  'quiz-entry',
  'quiz-marquee',
  'quiz-results',
  'tabs',
  'table-of-contents',
  'text',
  'timeline',
  'walls-io',
  'table',
  'table-metadata',
  'tags',
  'tag-selector',
  'tiktok',
  'twitter',
  'video',
  'vimeo',
  'youtube',
  'z-pattern',
  'share',
  'susi-light-login',
  'reading-time',
];

const C2_BLOCKS = [
  'base-card',
  'box',
  'brand-concierge',
  'carousel-c2',
  'elastic-carousel',
  'explore-card',
  'global-footer',
  'global-navigation',
  'martech-metadata',
  'modal',
  'news',
  'region-nav',
  'rich-content',
  'router-marquee',
  'section-metadata',
  'visually-hidden',
];

const AUTO_BLOCKS = [
  { adobetv: 'tv.adobe.com' },
  { gist: 'gist.github.com' },
  { caas: '/tools/caas' },
  { faas: '/tools/faas' },
  { fragment: '/fragments/', styles: false },
  { instagram: 'instagram.com' },
  { slideshare: 'slideshare.net', styles: false },
  { tiktok: 'tiktok.com', styles: false },
  { twitter: 'twitter.com' },
  { vimeo: 'vimeo.com' },
  { vimeo: 'player.vimeo.com' },
  { youtube: 'youtube.com' },
  { youtube: 'youtu.be' },
  { 'pdf-viewer': '.pdf', styles: false },
  { video: '.mp4' },
  { merch: '/tools/ost?' },
  { merch: '/miniplans' },
  { 'merch-card-collection-autoblock': 'mas.adobe.com/studio.html#content-type=merch-card-collection', styles: false },
  { 'merch-card-autoblock': 'mas.adobe.com/studio.html', styles: false },
  { m7: '/creativecloud/business-plans', styles: false },
  { m7: '/creativecloud/education-plans', styles: false },
];
const DO_NOT_INLINE = [
  'accordion',
  'columns',
  'z-pattern',
];

const ENVS = {
  stage: {
    name: 'stage',
    ims: 'stg1',
    adobeIO: 'cc-collab-stage.adobe.io',
    adminconsole: 'stage.adminconsole.adobe.com',
    account: 'stage.account.adobe.com',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
    pdfViewerClientId: 'a76f1668fd3244d98b3838e189900a5e',
  },
  prod: {
    name: 'prod',
    ims: 'prod',
    adobeIO: 'cc-collab.adobe.io',
    adminconsole: 'adminconsole.adobe.com',
    account: 'account.adobe.com',
    edgeConfigId: '2cba807b-7430-41ae-9aac-db2b0da742d5',
    pdfViewerClientId: '3c0a5ddf2cc04d3198d9e48efc390fa9',
  },
};
ENVS.local = {
  ...ENVS.stage,
  name: 'local',
};

export const MILO_EVENTS = {
  DEFERRED: 'milo:deferred',
  QUERY_INDEX_PRIMARY_LOADED: 'milo:query-index:primary-loaded',
  QUERY_INDEX_ALL_LOADED: 'milo:query-index:all-loaded',
};
const TARGET_TIMEOUT_MS = 4000;

const LANGSTORE = 'langstore';
const PREVIEW = 'target-preview';
const PAGE_URL = new URL(window.location.href);
// TODO remove LANGUAGE_BASED_PATHS once news.adobe.com is using new langFirst site structure
const LANGUAGE_BASED_PATHS = [
  // don't add milo too. It's a special case because of tools, merch, etc.
  'news.adobe.com',
];
const DEFAULT_LANG = 'en';
export const SLD = 'aem';

const PROMO_PARAM = 'promo';
let isMartechLoaded = false;

let langConfig;
const queryIndexes = {};
let baseQueryIndex;
let lingoSiteMapping;
let lingoSiteMappingLoaded;
let isLoadingQueryIndexes = false;
let queryIndexesAllLoaded = false;
let siteQueryIndexMapLingo = [];
let lingoModule = null;
let langRoutingConfig = null;
let langBannerPromise;
export const getLangRoutingConfig = () => langRoutingConfig;
export const setLangRoutingConfig = (config) => { langRoutingConfig = config; };

const parseList = (str) => str.split(/[\n,]+/).map((t) => t.trim()).filter(Boolean);

export function getEnv(conf) {
  const { host } = window.location;
  const query = PAGE_URL.searchParams.get('env');

  if (query) return { ...ENVS[query], consumer: conf[query] };

  const { clientEnv } = conf;
  if (clientEnv) return { ...ENVS[clientEnv], consumer: conf[clientEnv] };

  if (host.includes('localhost')) return { ...ENVS.local, consumer: conf.local };
  /* c8 ignore start */
  if (host.includes(`${SLD}.page`)
    || host.includes(`${SLD}.live`)
    || host.includes('stage.adobe')
    || host.includes('corp.adobe')
    || host.includes('graybox.adobe')
    || host.includes('aem.reviews')) {
    return { ...ENVS.stage, consumer: conf.stage };
  }
  return { ...ENVS.prod, consumer: conf.prod };
  /* c8 ignore stop */
}

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

export function getLocale(locales, pathname = window.location.pathname) {
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

export function getLanguage(languages, locales, pathname = window.location.pathname) {
  const split = pathname.split('/');
  const locOffset = [LANGSTORE, PREVIEW].includes(split[1]) ? 1 : 0;
  const languageString = split[locOffset + 1];
  const region = split[locOffset + 2];
  let regionPath = '';

  const language = languages?.[languageString];
  if (language && region && language.regions) {
    const [matchingRegion] = language.regions.filter((r) => r.region === region);
    if (matchingRegion?.region) language.region = matchingRegion.region;
    if (matchingRegion?.ietf) language.ietf = matchingRegion.ietf;
    if (matchingRegion?.tk) language.tk = matchingRegion.tk;
    regionPath = matchingRegion ? `/${region}` : '';
  }

  const isLegacyLocaleRoutingMode = !language
    || (language.languageBased === false && !language.region);
  if (isLegacyLocaleRoutingMode) {
    const locale = getLocale(locales, pathname);
    const englishLang = languages?.en;
    if (locale.prefix === '' && englishLang) {
      locale.language = DEFAULT_LANG;
      if (englishLang.region) locale.region = englishLang.region;
      if (englishLang.ietf) locale.ietf = englishLang.ietf;
      if (englishLang.tk) locale.tk = englishLang.tk;
    }
    return locale;
  }

  if (!language.ietf) language.ietf = `${languageString}${language.region ? `_${language.region.toUpperCase()}` : ''}`;
  language.language = languageString;
  language.prefix = `${languageString === DEFAULT_LANG && !regionPath ? '' : '/'}${languageString}${regionPath}`;
  return language;
}

export function setInternational(prefix) {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
  const maxAge = 365 * 24 * 60 * 60; // max-age in seconds for 365 days
  document.cookie = `international=${prefix};max-age=${maxAge};path=/;${domain}`;
  sessionStorage.setItem('international', prefix);
}

export function setMarket(marketCode) {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
  const maxAge = 365 * 24 * 60 * 60;
  document.cookie = `country=${marketCode};max-age=${maxAge};path=/;${domain}`;
  sessionStorage.setItem('market', marketCode);
}

export function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

(() => { if (getMetadata('mweb') === 'on') document.body.classList.add('mweb-enabled'); })();

const handleEntitlements = (() => {
  const { martech } = Object.fromEntries(PAGE_URL.searchParams);
  if (martech === 'off') return () => { };
  let entResolve;
  const entPromise = new Promise((resolve) => {
    entResolve = resolve;
  });

  return (resolveVal) => {
    if (resolveVal !== undefined) {
      entResolve(resolveVal);
    }
    return entPromise;
  };
})();

function setupMiloObj(config) {
  window.milo ||= {};
  window.milo.deferredPromise = new Promise((resolve) => {
    config.resolveDeferred = resolve;
  });
}

export const [setConfig, updateConfig, getConfig] = (() => {
  let config = {};
  return [
    (conf) => {
      const origin = conf.origin || window.location.origin;
      const pathname = conf.pathname || window.location.pathname;
      config = { env: getEnv(conf), ...conf };
      config.codeRoot = conf.codeRoot ? `${origin}${conf.codeRoot}` : origin;
      config.base = config.miloLibs || config.codeRoot;
      config.locale = conf.languages
        ? getLanguage(conf.languages, conf.locales, pathname) : getLocale(conf.locales, pathname);
      config.pathname = pathname;
      config.autoBlocks = conf.autoBlocks ? [...AUTO_BLOCKS, ...conf.autoBlocks] : AUTO_BLOCKS;
      config.signInContext = conf.signInContext || {};
      config.doNotInline = conf.doNotInline
        ? [...DO_NOT_INLINE, ...conf.doNotInline]
        : DO_NOT_INLINE;
      const lang = getMetadata('content-language') || config.locale.ietf;
      document.documentElement.setAttribute('lang', lang);
      try {
        const dir = getMetadata('content-direction')
          || config.locale.dir
          || (config.locale.ietf && (new Intl.Locale(config.locale.ietf)?.textInfo?.direction))
          || 'ltr';
        document.documentElement.setAttribute('dir', dir);
      } catch (e) {
        console.log('Invalid or missing locale:', e);
      }
      config.locale.contentRoot = `${origin}${config.locale.prefix}${config.contentRoot ?? ''}`;
      config.useDotHtml = !PAGE_URL.origin.includes(`.${SLD}.`)
        && (conf.useDotHtml ?? PAGE_URL.pathname.endsWith('.html'));
      config.entitlements = handleEntitlements;
      config.consumerEntitlements = conf.entitlements || [];
      setupMiloObj(config);

      return config;
    },
    (conf) => (config = conf),
    () => config,
  ];
})();

let federatedContentRoot;
export const getFederatedContentRoot = () => {
  if (federatedContentRoot) return federatedContentRoot;

  const cdnWhitelistedOrigins = [
    'https://www.adobe.com',
    'https://business.adobe.com',
    'https://blog.adobe.com',
    'https://milo.adobe.com',
    'https://news.adobe.com',
    'graybox.adobe.com',
  ];
  const { allowedOrigins = [], origin: configOrigin, fedContentPrefix } = getConfig();
  if (federatedContentRoot) return federatedContentRoot;
  // Non milo consumers will have its origin from config
  const origin = configOrigin || window.location.origin;

  const isAllowedOrigin = [...allowedOrigins, ...cdnWhitelistedOrigins].some((o) => {
    const originNoStage = origin.replace('.stage', '');
    return o.startsWith('https://')
      ? originNoStage === o
      : originNoStage.endsWith(o);
  });
  federatedContentRoot = isAllowedOrigin ? origin : 'https://www.adobe.com';

  if (origin.includes('localhost') || origin.includes(`.${SLD}.`)) {
    federatedContentRoot = `https://main--federal--adobecom.aem.${origin.endsWith('.live') ? 'live' : 'page'}`;
  }

  if (fedContentPrefix) {
    federatedContentRoot = `${federatedContentRoot}${fedContentPrefix}`;
  }

  return federatedContentRoot;
};

export const getFederatedUrl = (url = '') => {
  if (typeof url !== 'string' || !url.includes('/federal/')) return url;
  if (url.startsWith('/')) return `${getFederatedContentRoot()}${url}`;
  try {
    const { fedContentPrefix, locale } = getConfig();
    const { pathname, search, hash } = new URL(url);
    const hasPrefix = fedContentPrefix && (pathname.startsWith(fedContentPrefix)
      || pathname.startsWith(`${locale.prefix}${fedContentPrefix}`));
    return `${getFederatedContentRoot()}${hasPrefix
      ? pathname.replace(fedContentPrefix, '') : pathname}${search}${hash}`;
  } catch (e) {
    window.lana?.log(`getFederatedUrl errored parsing the URL: ${url}: ${e.toString()}`, {
      tags: 'utils',
      severity: 'error',
    });
  }
  return url;
};

function isPathMatch(path, href) {
  if (path.includes('*')) {
    const regex = new RegExp(path.replace(/\*/g, '[a-zA-Z]{1}'));
    return regex.test(href);
  }
  return href.includes(path);
}

export function hasLanguageLinks(area, paths = LANGUAGE_BASED_PATHS) {
  if (!area) return false;
  const links = area.querySelectorAll('a');
  return Array.from(links).some((link) => {
    const { href } = link;
    if (!href) return false;
    return paths.some((path) => isPathMatch(path, href));
  });
}

export async function loadLanguageConfig() {
  if (langConfig) return langConfig;

  try {
    const response = await fetch(`${getFederatedContentRoot()}/federal/assets/data/languages-config.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const configJson = await response.json();

    langConfig = {
      localeToLanguageMap: configJson['locale-to-language-map']?.data,
      siteLanguages: configJson['site-languages']?.data?.map((site) => ({
        ...site,
        pathMatches: parseList(site.pathMatches),
        languages: parseList(site.languages),
      })),
      nativeToEnglishMapping: configJson['langmap-native-to-en']?.data || [],
    };

    return langConfig;
  } catch (e) {
    window.lana?.log(`Failed to load language-config.json: ${e}`, {
      tags: 'utils',
      severity: 'error',
    });
  }

  return {};
}

let fedsPlaceholderConfig;
export const getFedsPlaceholderConfig = ({ useCache = true } = {}) => {
  if (useCache && fedsPlaceholderConfig) return fedsPlaceholderConfig;

  const { locale, placeholders } = getConfig();
  const libOrigin = getFederatedContentRoot();

  fedsPlaceholderConfig = {
    locale: {
      ...locale,
      contentRoot: `${libOrigin}${locale.prefix}/federal/globalnav`,
    },
    placeholders,
  };

  return fedsPlaceholderConfig;
};

/**
 * TODO: This method will be deprecated and removed in a future version.
 * @see https://jira.corp.adobe.com/browse/MWPW-173470
 * @see https://jira.corp.adobe.com/browse/MWPW-174411
*/
export const shouldAllowKrTrial = (link, localePrefix) => {
  const allowKrTrialHash = '#_allow-kr-trial';
  const hasAllowKrTrial = link.href?.includes(allowKrTrialHash);
  if (hasAllowKrTrial) {
    link.href = link.href.replace(allowKrTrialHash, '');
    const modalHash = link.getAttribute('data-modal-hash');
    if (modalHash) link.setAttribute('data-modal-hash', modalHash.replace(allowKrTrialHash, ''));
  }
  return localePrefix === '/kr' && hasAllowKrTrial;
};

/**
 * TODO: This method will be deprecated and removed in a future version.
 * @see https://jira.corp.adobe.com/browse/MWPW-173470
 * @see https://jira.corp.adobe.com/browse/MWPW-174411
*/
export const shouldBlockFreeTrialLinks = (link) => {
  const localePrefix = getConfig()?.locale?.prefix;
  if (shouldAllowKrTrial(link, localePrefix) || localePrefix !== '/kr'
      || (!link.dataset?.modalPath?.includes('/kr/cc-shared/fragments/trial-modals')
       && !['free-trial', 'free trial', '무료 체험판', '무료 체험하기', '{{try-for-free}}', '무료', 'free']
         .some((pattern) => link.textContent?.toLowerCase()?.includes(pattern.toLowerCase())))) {
    return false;
  }

  if (link.dataset.wcsOsi) {
    link.classList.add('hidden-osi-trial-link');
    return false;
  }

  const parent = link.parentElement;
  const elementToRemove = (parent?.tagName === 'STRONG' || parent?.tagName === 'EM') && parent?.children?.length === 1 ? parent : link;
  elementToRemove.remove();
  return true;
};

export function isInTextNode(node) {
  return (node.parentElement.childNodes.length > 1 && node.parentElement.firstChild.tagName === 'A') || node.parentElement.firstChild.nodeType === Node.TEXT_NODE;
}

export function lingoActive() {
  const langFirst = (PAGE_URL.searchParams.get('langfirst') || getMetadata('langfirst'))?.toLowerCase();
  return ['true', 'on'].includes(langFirst);
}

export function mepLingoSkipQI() {
  const skip = (PAGE_URL.searchParams.get('mep-lingo-skip-qi') || getMetadata('mep-lingo-skip-qi'))?.toLowerCase();
  return lingoActive() && ['true', 'on'].includes(skip);
}

export function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (html.nodeType === Node.ELEMENT_NODE
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

function getExtension(path) {
  const pageName = path.split('/').pop();
  return pageName.includes('.') ? pageName.split('.').pop() : '';
}

function getPrefixBySite(locale, url, relative) {
  let { prefix } = locale;
  // eslint-disable-next-line max-len
  const site = langConfig?.siteLanguages?.find((s) => s.pathMatches.some((d) => isPathMatch(d, url.href)));
  const localeSiteWithLanguageTarget = !locale.language && site && langConfig?.localeToLanguageMap;
  const languageSiteWithLocaleTarget = locale.language && !relative && !site?.languages.some((l) => (l === DEFAULT_LANG ? '' : `/${l}`) === prefix);
  if (localeSiteWithLanguageTarget) {
    const mappedLanguageFromPrefix = langConfig?.localeToLanguageMap?.find((m) => `${m.locale === '' ? '' : '/'}${m.locale}` === prefix);
    const languageInUseBySite = site.languages.find((l) => `${l}` === mappedLanguageFromPrefix.languagePath);
    if (languageInUseBySite) {
      prefix = languageInUseBySite === DEFAULT_LANG ? '' : `/${languageInUseBySite}`;
    }
  }
  if (languageSiteWithLocaleTarget) {
    const mappedLocaleFromLanguage = langConfig?.localeToLanguageMap?.find((m) => `/${m.languagePath}` === prefix);
    prefix = mappedLocaleFromLanguage ? `${mappedLocaleFromLanguage.locale === '' ? '' : '/'}${mappedLocaleFromLanguage.locale}` : prefix;
  }

  return prefix;
}

function isLocalizedPath(path, locales) {
  const langstorePath = path.startsWith(`/${LANGSTORE}`);
  const isMerchLink = path === '/tools/ost';
  const previewPath = path.startsWith(`/${PREVIEW}`);
  const anyTypeOfLocaleOrLanguagePath = langConfig?.localeToLanguageMap
    && (langConfig.localeToLanguageMap.some((l) => l.locale !== '' && (path.startsWith(`/${l.locale}/`) || path === `/${l.locale}`))
      || (langConfig.localeToLanguageMap.some((l) => path.startsWith(`/${l.languagePath}/`) || path === `/${l.languagePath}`)));
  const legacyLocalePath = locales && Object.keys(locales).some((loc) => loc !== '' && (path.startsWith(`/${loc}/`)
    || path.endsWith(`/${loc}`)));
  return langstorePath
    || isMerchLink
    || previewPath
    || anyTypeOfLocaleOrLanguagePath
    || legacyLocalePath;
}

function processQueryIndexMap(link, domain) {
  const result = {
    pathsRequest: null,
    requestResolved: false,
    domains: [domain],
  };

  result.pathsRequest = fetch(`${link}?limit=30000`)
    .then((response) => response.json())
    .then((json) => json.data?.map((d) => (d.path ?? d.Path)?.replace(/\.html$/, '')) ?? [])
    .catch((error) => {
      window.lana?.log(`Failed to load query index: ${link} | ${error}`, {
        tags: 'utils',
        severity: 'error',
      });
      return [];
    })
    .finally(() => {
      result.requestResolved = true;
    });

  return result;
}
const getDomainLingo = (path) => path?.split('/*')[0];

export function resolveCrossSiteIndex(
  { queryIndexWebPath, stageHost },
  prefix,
  suffix,
  currentHost,
) {
  const prodHost = getDomainLingo(queryIndexWebPath);
  let host = prodHost;
  let sfx = '';

  if (/\.stage\.adobe\.com$/.test(currentHost) && stageHost) {
    host = stageHost;
    sfx = suffix;
  }

  const path = queryIndexWebPath.slice(prodHost.length)
    .replace('/*', prefix)
    .replace(/\/query-index\.json$/, `/query-index${sfx}.json`);
  return { url: `https://${host}${path}`, host };
}

async function loadQueryIndexes(prefix, links = []) {
  const config = getConfig();
  const suffix = config.env?.name === 'prod' || window.location.host.includes(`${SLD}.live`) ? '' : '-preview';

  if (links.length && links.some((l) => l.includes('/federal/')) && !queryIndexes.federal) {
    const fedRoot = getFederatedContentRoot();
    queryIndexes.federal = processQueryIndexMap(
      `${fedRoot}${prefix}/federal/assets/lingo/query-index${suffix}.json`,
      fedRoot.replace('https://', ''),
    );
    queryIndexes.federal.domains.push(window.location.hostname);
  }
  if (lingoSiteMapping || isLoadingQueryIndexes) return;
  isLoadingQueryIndexes = true;

  const origin = config.origin || window.location.origin;
  const contentRoot = config.contentRoot ?? '';
  const siteId = config.uniqueSiteId ?? '';
  const host = window.location.hostname;
  const indexUrl = (pfx, sfx = suffix) => `${origin}${pfx}${contentRoot}/assets/lingo/query-index${sfx}.json`;

  queryIndexes[siteId] = processQueryIndexMap(indexUrl(prefix), host);

  const { base: localeBase, prefix: localePrefix } = config.locale;
  let basePfx = localePrefix ?? '';
  if (localeBase !== undefined) basePfx = localeBase ? `/${localeBase}` : '';
  baseQueryIndex = processQueryIndexMap(indexUrl(basePfx, ''), host);

  Promise.all([queryIndexes[siteId]?.pathsRequest, baseQueryIndex?.pathsRequest].filter(Boolean))
    .then(() => window.dispatchEvent(new CustomEvent(MILO_EVENTS.QUERY_INDEX_PRIMARY_LOADED)));

  lingoSiteMapping = (async () => {
    try {
      const resp = await fetch(`${getFederatedContentRoot()}/federal/assets/data/lingo-site-mapping.json`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      siteQueryIndexMapLingo = json['site-query-index-map']?.data ?? [];
      const localesData = json['site-locales']?.data ?? [];

      const existingDomain = getDomainLingo(
        siteQueryIndexMapLingo.find((d) => d.uniqueSiteId === siteId)?.queryIndexWebPath,
      );
      if (existingDomain) {
        [queryIndexes[siteId], baseQueryIndex].forEach((qi) => {
          if (qi && !qi.domains.includes(existingDomain)) qi.domains.push(existingDomain);
        });
      }

      siteQueryIndexMapLingo
        .filter((d) => d.uniqueSiteId !== siteId
          && config.prodDomains?.includes(getDomainLingo(d.queryIndexWebPath)))
        .forEach(({ uniqueSiteId: uid, queryIndexWebPath, stageHost }) => {
          const hasRegional = localesData
            .some((s) => s.uniqueSiteId === uid && parseList(s.regionalSites).includes(prefix));
          if (!hasRegional) return;
          const prodDomain = getDomainLingo(queryIndexWebPath);
          const { url, host: envHost } = resolveCrossSiteIndex(
            { queryIndexWebPath, stageHost },
            prefix,
            suffix,
            window.location.hostname,
          );
          queryIndexes[uid] = processQueryIndexMap(url, prodDomain);
          if (envHost !== prodDomain) queryIndexes[uid].domains.push(envHost);
        });
    } catch (e) {
      window.lana?.log(`Failed to load lingo-site-mapping.json: ${e}`, { tags: 'utils', severity: 'error' });
    } finally {
      lingoSiteMappingLoaded = true;
    }
  })();

  const lingoImport = import('./lingo.js').then((mod) => { lingoModule = mod; });

  lingoSiteMapping.then(() => Promise.all([
    ...Object.values(queryIndexes).map((q) => q.pathsRequest).filter(Boolean),
    lingoImport,
  ])).then(() => {
    queryIndexesAllLoaded = true;
    window.dispatchEvent(new CustomEvent(MILO_EVENTS.QUERY_INDEX_ALL_LOADED));
  });
}

function attachLingoPendingListener(a, hostname, rawPath, basePrefix, regionalPrefix, isBasePage) {
  let primaryHandler;
  let allHandler;
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    window.removeEventListener(MILO_EVENTS.QUERY_INDEX_PRIMARY_LOADED, primaryHandler);
    window.removeEventListener(MILO_EVENTS.QUERY_INDEX_ALL_LOADED, allHandler);
  };

  const handle = (isFinal) => {
    if (!a.isConnected) { cleanup(); return; }
    (lingoModule ? Promise.resolve(lingoModule) : import('./lingo.js'))
      .then((mod) => mod.tryLocalizeLink(
        a,
        hostname,
        rawPath,
        basePrefix,
        regionalPrefix,
        isBasePage,
        Object.values(queryIndexes),
        baseQueryIndex,
        isFinal,
      ))
      .then((done) => { if (done) cleanup(); })
      .catch(() => { if (isFinal) cleanup(); });
  };

  primaryHandler = () => handle(false);
  allHandler = () => handle(true);

  if (queryIndexesAllLoaded) {
    handle(true);
  } else {
    window.addEventListener(MILO_EVENTS.QUERY_INDEX_PRIMARY_LOADED, primaryHandler);
    window.addEventListener(MILO_EVENTS.QUERY_INDEX_ALL_LOADED, allHandler);
    if (lingoSiteMapping) {
      lingoSiteMapping.then(() => {
        if (cleaned || !a.isConnected) return;
        const hasIndex = Object.values(queryIndexes)
          .some((q) => q.domains.includes(hostname));
        if (!hasIndex) {
          if (!isBasePage && regionalPrefix !== basePrefix) {
            const { origin, search, hash } = new URL(a.href);
            a.href = `${origin}${regionalPrefix}${rawPath}${search}${hash}`;
          }
          cleanup();
        }
      });
    }
  }
}

function localizeLinkCore(
  href,
  originHostName,
  overrideDomain,
  useAsync,
  { overridePrefix = null, overrideBase = null, aTag = null } = {},
) {
  try {
    const url = new URL(href);
    const relative = url.hostname === originHostName;
    const processedHref = relative ? href.replace(url.origin, '') : href;
    if (url.hash.includes('#_dnt')) return processedHref.replace('#_dnt', '');
    const path = url.pathname;
    const extension = getExtension(path);
    if (!['', 'html', 'json'].includes(extension)) return processedHref;
    const { locale, locales, languages, prodDomains, uniqueSiteId } = getConfig();
    if (!locale || !(locales || languages)) return processedHref;
    const isLocalizable = relative
      || (url.hostname && prodDomains?.includes(url.hostname))
      || overrideDomain
      || (url.hostname && getFederatedContentRoot().includes(url.hostname));
    if (!isLocalizable || isLocalizedPath(path, locales)) return processedHref;

    const isFragment = path.includes('/fragments/');
    const isMepLingoFragment = isFragment && aTag?.dataset.mepLingo === 'true';
    const prefix = overridePrefix ?? getPrefixBySite(locale, url, relative);
    const buildUrl = (pfx) => {
      const urlPath = `${pfx}${path}${url.search}${url.hash}`;
      return relative ? urlPath : `${url.origin}${urlPath}`;
    };

    const isLingoPage = locale.base !== undefined || !!locale.regions;
    const isLcpSection = aTag?.closest('.section')?.dataset.idx === '0';
    const siteId = uniqueSiteId ?? '';
    const qiResolved = queryIndexes[siteId]?.requestResolved;
    const skipQueryIndex = isMepLingoFragment
        && (mepLingoSkipQI() || (isLcpSection && !qiResolved));
    const enterAsync = useAsync && aTag && extension !== 'json' && !skipQueryIndex
      && lingoActive() && isLingoPage
      && (!isFragment || (isMepLingoFragment && !!locale.regions));

    if (enterAsync) {
      return (async () => {
        loadQueryIndexes(prefix, [href]);
        const base = overrideBase ?? locale.base;
        const basePrefix = base === '' ? '' : `/${base}`;

        if (isMepLingoFragment) {
          if (!(queryIndexes[siteId]?.requestResolved || lingoSiteMappingLoaded)) {
            await Promise.all([
              queryIndexes[siteId]?.pathsRequest,
              lingoSiteMapping,
            ].filter(Boolean));
          }
          if (!lingoModule) lingoModule = await import('./lingo.js');
        }

        const matchingIndexes = Object.values(queryIndexes)
          .filter((q) => q.domains.includes(url.hostname)
            && (isMepLingoFragment || q.requestResolved));
        const needsListener = !isMepLingoFragment && !queryIndexesAllLoaded;

        const domainInSiteMap = !lingoSiteMappingLoaded
          || Object.values(queryIndexes).some((q) => q.domains.includes(url.hostname));
        const isBasePage = !!locale.regions;

        let resolvedPrefix = basePrefix;
        if (lingoModule) {
          resolvedPrefix = await lingoModule.resolveLingoPrefix(
            path,
            prefix,
            basePrefix,
            url.hostname,
            matchingIndexes,
            baseQueryIndex,
            aTag,
            { isMepLingo: isMepLingoFragment, domainInSiteMap, isBasePage },
          );
        }

        if (needsListener && resolvedPrefix === basePrefix) {
          attachLingoPendingListener(aTag, url.hostname, path, basePrefix, prefix, isBasePage);
        }

        return buildUrl(resolvedPrefix);
      })();
    }

    if (skipQueryIndex && aTag) aTag.dataset.mepLingoSkippedQI = 'true';
    return buildUrl(prefix);
  } catch (error) {
    return href;
  }
}

function setCountry() {
  const country = window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming
    ?.find((timing) => timing?.name === 'geo')?.description?.toLowerCase();
  if (!country) return;
  sessionStorage.setItem('akamai', country);
  sessionStorage.setItem('feds_location', JSON.stringify({ country: country.toUpperCase() }));
}

export async function getCountry(skipFallback = false) {
  if (isBot()) return null;

  const rawAkamai = PAGE_URL.searchParams.get('akamaiLocale');
  const akamaiLocale = /^[a-zA-Z]{2,6}$/.test(rawAkamai) ? rawAkamai : null;
  const country = akamaiLocale || sessionStorage.getItem('akamai');
  if (country || skipFallback) return country?.toLowerCase();

  try {
    const { getAkamaiCode } = await import('./geo.js');
    return await getAkamaiCode();
  } catch (error) {
    window.lana?.log(`Error getting Akamai code: ${error}`, { severity: 'error' });
    return null;
  }
}

export const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

export function normCountryCode(country) {
  if (country == null || typeof country !== 'string') return undefined;
  const lower = country.toLowerCase();
  return lower === 'uk' ? 'gb' : lower.split('_')[0];
}

export function computeDetectedMarketCountry(search, cookieCountry, countryFromGeo) {
  const params = new URLSearchParams(search);
  const countryParam = normCountryCode(params.get('country'));
  const akamaiParam = normCountryCode(params.get('akamaiLocale'));
  return countryParam || akamaiParam || cookieCountry || normCountryCode(countryFromGeo);
}

export async function resolveDetectedMarketCountry() {
  if (isBot()) return null;
  const cookieMarket = getCookie('country');
  const countryFromGeo = await getCountry();
  let detectedMarket = computeDetectedMarketCountry(
    window.location.search,
    cookieMarket,
    countryFromGeo,
  );
  if (!detectedMarket) {
    try {
      const { default: getAkamaiCode } = await import('./geo.js');
      detectedMarket = normCountryCode(await getAkamaiCode());
    } catch (error) {
      window.lana?.log(`Error getting Akamai code: ${error}`, { severity: 'error' });
    }
  }
  return detectedMarket;
}

export async function getLingoRegion() {
  if (!lingoActive()) return null;
  const config = getConfig();
  const { locale } = config || {};
  const { regions } = locale || {};

  if (!regions || !Object.keys(regions).length) return null;

  const country = (await resolveDetectedMarketCountry())?.toLowerCase();
  if (!country) return null;

  const localeKey = locale.prefix === '' ? 'en' : locale.prefix.replace('/', '');

  let regionKey = Object.entries(regions).find(
    ([key]) => key === country || key === `${country}_${localeKey}`,
  )?.[0];

  if (!regionKey && config.mepLingoCountryToRegion) {
    regionKey = Object.entries(config.mepLingoCountryToRegion).find(
      ([key, countries]) => Array.isArray(countries) && countries.includes(country) && regions[key],
    )?.[0];
  }

  return regionKey ? regions[regionKey] : null;
}

export async function getGeoLocalePrefix() {
  const region = await getLingoRegion();
  return region?.prefix ?? null;
}

let mepLingoModulePreloaded = false;

function preloadMepLingoModule() {
  if (mepLingoModulePreloaded) return;
  mepLingoModulePreloaded = true;
  import('../features/mep/lingo.js');
}

function detectMepLingoSwap(a) {
  if (!a) return;
  const isInsertHash = a.href.includes('#_mep-lingo-insert');
  const isRemoveHash = !isInsertHash && a.href.includes('#_mep-lingo-remove');
  const isRegularHash = !isInsertHash && !isRemoveHash && a.href.includes('#_mep-lingo');

  if (isInsertHash || isRemoveHash || isRegularHash) {
    let hashToRemove = '#_mep-lingo';
    if (isInsertHash) hashToRemove = '#_mep-lingo-insert';
    if (isRemoveHash) hashToRemove = '#_mep-lingo-remove';

    a.dataset.mepLingo = 'true';
    if (isInsertHash) a.dataset.mepLingoInsert = 'true';
    if (isRemoveHash) a.dataset.mepLingoRemove = 'true';
    a.dataset.originalHref = a.href.replace(hashToRemove, '');
    a.href = a.href.replace(hashToRemove, '');
    if (lingoActive()) preloadMepLingoModule();
    if (isInsertHash || isRemoveHash) return;
  }
  const row = a.closest('.section > div > div');
  const firstCellText = row?.children[0]?.textContent?.toLowerCase().trim();

  if (firstCellText === 'mep-lingo') {
    a.dataset.mepLingo = 'true';
    a.dataset.originalHref = a.href;
    if (lingoActive()) preloadMepLingoModule();
    const swapBlock = a.closest('.section > div[class]');
    if (a.closest('.section-metadata')) {
      a.dataset.mepLingoSectionSwap = 'true';
    } else if (swapBlock) {
      const [blockName] = swapBlock.classList;
      a.dataset.mepLingoBlockSwap = blockName;

      if (blockName === 'mep-lingo') {
        if (swapBlock.classList.contains('insert')) {
          a.dataset.mepLingoInsert = 'true';
        } else if (swapBlock.classList.contains('remove')) {
          a.dataset.mepLingoRemove = 'true';
        }
      }
    }
  }
}

export async function localizeLinkAsync(
  href,
  originHostName = window.location.hostname,
  overrideDomain = false,
  aTag = null,
) {
  if (!href) return href;

  detectMepLingoSwap(aTag);
  const effectiveHref = href.replace(/#_mep-lingo(-insert|-remove)?/g, '');
  const isMepLingoLink = aTag?.dataset?.mepLingo
    || aTag?.dataset?.mepLingoSectionSwap
    || aTag?.dataset?.mepLingoBlockSwap;

  const { locale } = getConfig() || {};
  const isBasePage = !!locale?.regions;
  const needsOverride = lingoActive()
    && (isMepLingoLink || isBasePage || locale?.base !== undefined);

  let prefix = null;
  let base = null;
  if (needsOverride) {
    const isFragment = effectiveHref.includes('/fragments/');
    if (isBasePage) {
      const isRegularFragment = isFragment && !isMepLingoLink;
      prefix = (aTag && !isRegularFragment) ? await getGeoLocalePrefix() : (locale?.prefix ?? '');
      base = locale?.prefix?.replace('/', '') ?? '';
    } else {
      const basePrefix = locale?.base === '' ? '' : `/${locale?.base}`;
      prefix = (isFragment || aTag) ? (locale?.prefix || null) : basePrefix;
      base = locale?.base ?? '';
    }
  }

  return localizeLinkCore(
    effectiveHref,
    originHostName,
    overrideDomain,
    true,
    { overridePrefix: prefix, overrideBase: base, aTag },
  );
}

// this method is deprecated - use localizeLinkAsync instead
export function localizeLink(
  href,
  originHostName = window.location.hostname,
  overrideDomain = false,
) {
  return localizeLinkCore(href, originHostName, overrideDomain, false, {});
}

export function loadLink(href, {
  id, as, callback, crossorigin, rel, fetchpriority,
} = {}) {
  let link = document.head.querySelector(`link[href="${href}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    if (id) link.setAttribute('id', id);
    if (as) link.setAttribute('as', as);
    if (crossorigin) link.setAttribute('crossorigin', crossorigin);
    if (fetchpriority) link.setAttribute('fetchpriority', fetchpriority);
    link.setAttribute('href', href);
    if (callback) {
      link.onload = (e) => callback(e.type);
      link.onerror = (e) => callback(e.type);
    }
    document.head.appendChild(link);
  } else if (callback) {
    callback('noop');
  }
  return link;
}

export function loadStyle(href, callback) {
  return loadLink(href, { rel: 'stylesheet', callback });
}

export function appendHtmlToCanonicalUrl() {
  const { useDotHtml } = getConfig();
  if (!useDotHtml) return;
  const canonEl = document.head.querySelector('link[rel="canonical"]');
  if (!canonEl) return;
  const canonUrl = new URL(canonEl.href);
  if (canonUrl.pathname.endsWith('/') || canonUrl.pathname.endsWith('.html')) return;
  const pagePath = PAGE_URL.pathname.replace('.html', '');
  if (pagePath !== canonUrl.pathname) return;
  canonEl.setAttribute('href', `${canonEl.href}.html`);
}

export function appendSuffixToTitles() {
  const appendage = getMetadata('title-append');
  if (!appendage) return;
  document.title = `${document.title} ${appendage}`;
  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (ogTitleEl) ogTitleEl.setAttribute('content', document.title);
  const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitleEl) twitterTitleEl.setAttribute('content', document.title);
}

export function appendHtmlToLink(link) {
  const { useDotHtml } = getConfig();
  if (!useDotHtml) return;
  const href = link.getAttribute('href');
  if (!href?.length || href.includes('#_nohtml')) return;

  const { autoBlocks = [], htmlExclude = [] } = getConfig();

  const HAS_EXTENSION = /\..*$/;
  let url = { pathname: href };

  try { url = new URL(href, PAGE_URL); } catch (e) { /* do nothing */ }

  if (!(href.startsWith('/') || href.startsWith(PAGE_URL.origin))
    || url.pathname?.endsWith('/')
    || href === PAGE_URL.origin
    || HAS_EXTENSION.test(href.split('/').pop())
    || htmlExclude?.some((excludeRe) => excludeRe.test(href))) {
    return;
  }

  const relativeAutoBlocks = autoBlocks
    .map((b) => Object.values(b)[0])
    .filter((b) => b.startsWith('/'));
  const isAutoblockLink = relativeAutoBlocks.some((block) => href.includes(block));
  if (isAutoblockLink) return;

  try {
    const linkUrl = new URL(href.startsWith('http') ? href : `${PAGE_URL.origin}${href}`);
    if (linkUrl.pathname && !linkUrl.pathname.endsWith('.html')) {
      linkUrl.pathname = `${linkUrl.pathname}.html`;
      link.setAttribute('href', href.startsWith('/')
        ? `${linkUrl.pathname}${linkUrl.search}${linkUrl.hash}`
        : linkUrl.href);
    }
  } catch (e) {
    window.lana?.log(`Error while attempting to append '.html' to ${link}: ${e}`, {
      tags: 'utils',
      severity: 'error',
    });
  }
}

export const loadScript = (url, type, { mode, id } = {}) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (id) script.setAttribute('id', id);
    if (type) {
      script.setAttribute('type', type);
    }
    if (['async', 'defer'].includes(mode)) script.setAttribute(mode, true);
    head.append(script);
  }

  if (script.dataset.loaded) {
    resolve(script);
    return;
  }

  const onScript = (event) => {
    script.removeEventListener('load', onScript);
    script.removeEventListener('error', onScript);

    if (event.type === 'error') {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === 'load') {
      script.dataset.loaded = true;
      resolve(script);
    }
  };

  script.addEventListener('load', onScript);
  script.addEventListener('error', onScript);
});

export async function loadTemplate() {
  const template = getMetadata('template');
  if (!template) return;
  const name = template.toLowerCase().replace(/[^0-9a-z]/gi, '-');
  document.body.classList.add(name);
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs && MILO_TEMPLATES.includes(name) ? miloLibs : codeRoot;
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${base}/templates/${name}/${name}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        await import(`${base}/templates/${name}/${name}.js`);
      } catch (err) {
        console.log(`failed to load module for ${name}`, err);
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
}

function getBlockData(block) {
  const name = block.classList[0];
  const { miloLibs, codeRoot, mep, externalLibs } = getConfig();
  const isC2Page = getMetadata('foundation') === 'c2';
  const isC1Block = C1_BLOCKS.includes(name);
  const isC2Block = C2_BLOCKS.includes(name);
  const isAutoBlock = AUTO_BLOCKS.some((autoBlock) => autoBlock[name]);

  if (isC2Page && isC1Block && !isC2Block && !isAutoBlock) return { name, isInvalid: true };

  let base = codeRoot;
  if (externalLibs) {
    try {
      const list = Array.isArray(externalLibs) ? externalLibs : [externalLibs];
      const match = list.find((lib) => {
        if (!lib || typeof lib !== 'object') return false;
        if (!Array.isArray(lib.blocks)) return false;
        if (!lib.base || typeof lib.base !== 'string') return false;

        return lib.blocks.includes(name);
      });
      if (match?.base) base = match.base;
    } catch (error) {
      window.lana?.log(`Invalid externalLibs configuration: ${error.message || error}`, {
        tags: 'utils',
        severity: 'error',
      });
    }
  }

  if (miloLibs && isC1Block && (!isC2Page || isAutoBlock)) base = miloLibs;
  if (isC2Page && isC2Block) base = `${miloLibs ?? base}/c2`;

  let path = `${base}/blocks/${name}`;
  if (mep?.blocks?.[name]) path = mep.blocks[name];
  const blockPath = `${path}/${name}`;
  const hasStyles = AUTO_BLOCKS.find((ab) => Object.keys(ab).includes(name))?.styles ?? true;

  return { blockPath, name, hasStyles };
}

export async function loadBlock(block) {
  if (block.classList.contains('hide-block')) {
    block.remove();
    return null;
  }
  const { name, blockPath, hasStyles, isInvalid } = getBlockData(block);
  if (isInvalid) {
    block.dataset.failed = 'true';
    block.dataset.reason = `${name} is a C1 block and cannot be used on C2 pages`;
    return block;
  }
  const styleLoaded = hasStyles && new Promise((resolve) => {
    loadStyle(`${blockPath}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        const { default: init } = await import(`${blockPath}.js`);
        await init(block);
        block.dataset.blockStatus = 'loaded';
      } catch (err) {
        console.log(`Failed loading ${name}`, err);
        const config = getConfig();
        if (config.env.name !== 'prod') {
          const { showError } = await import('../blocks/fallback/fallback.js');
          showError(block, name);
        }
      }
      resolve();
    })();
  });

  await Promise.all([styleLoaded, scriptLoaded]);
  return block;
}

export function decorateSVG(a) {
  const { textContent, href } = a;
  if (!(textContent.includes('.svg') || href.includes('.svg'))) return a;
  try {
    // Mine for URL and alt text
    const splitText = textContent.split('|');
    const authoredUrl = new URL(splitText.shift().trim());
    const altText = splitText.join('|').trim();

    // Relative link checking
    const hrefUrl = a.href.startsWith('/')
      ? new URL(`${window.location.origin}${a.href}`)
      : new URL(a.href);

    const src = (authoredUrl.hostname.includes('.hlx.') || authoredUrl.hostname.includes('.aem.'))
      ? authoredUrl.pathname
      : authoredUrl;

    const img = createTag('img', { loading: 'lazy', src, alt: altText || '' });
    const pic = createTag('picture', null, img);

    if (altText) {
      const parentHeading = a.parentElement.closest('h1, h2, h3, h4, h5, h6');
      parentHeading?.appendChild(createTag('span', { class: 'hidden' }, altText));
    }

    if (authoredUrl.pathname === hrefUrl.pathname) {
      a.parentElement.replaceChild(pic, a);
      return pic;
    }
    a.textContent = '';
    a.append(pic);
    return a;
  } catch (e) {
    console.log('Failed to create SVG.', e.message);
    return a;
  }
}

export const isValidHtmlUrl = (url) => {
  const regex = /^https:\/\/[^\s]+$/;
  return regex.test(url);
};

export function decorateImageLinks(el) {
  const images = el.querySelectorAll('img[alt*="|"]');
  if (!images.length) return;
  [...images].forEach((img) => {
    const [source, alt, icon] = img.alt.split('|');
    try {
      if (!isValidHtmlUrl(source.trim())) return;
      const url = new URL(source.trim());
      const href = (url.hostname.includes('.aem.') || url.hostname.includes('.hlx.')) ? `${url.pathname}${url.search}${url.hash}` : url.href;
      img.alt = alt?.trim() || '';
      const pic = img.closest('picture');
      const picParent = pic.parentElement;
      if (href.includes('.mp4')) {
        const a = createTag('a', { href: url, 'data-video-poster': pic.outerHTML });
        a.innerHTML = url;
        pic.replaceWith(a);
      } else {
        const aTag = createTag('a', { href, class: 'image-link' });
        picParent.insertBefore(aTag, pic);
        if (icon) {
          import('./image-video-link.js').then((mod) => mod.default(picParent, aTag, icon));
        } else {
          aTag.append(pic);
        }
      }
    } catch (e) {
      console.log('Error:', `${e.message} '${source.trim()}'`);
    }
  });
}

export function isTrustedAutoBlock(autoBlock, url) {
  if (!url.href.includes(autoBlock)) return false;
  const urlHostname = url.hostname.replace('www.', '');
  const locationHostname = window.location.hostname.replace('www.', '');
  return urlHostname === locationHostname
    || urlHostname.endsWith('.adobe.com')
    || urlHostname === 'adobe.com'
    || urlHostname === autoBlock
    || !!urlHostname.match(/\.(hlx|aem)\.(page|live)$/)
    || (autoBlock === '.pdf' && url.pathname.endsWith(autoBlock));
}

export function decorateAutoBlock(a) {
  const config = getConfig();
  let url;
  try {
    url = new URL(a.href);
  } catch (e) {
    window.lana?.log(`Cannot make URL from decorateAutoBlock - ${a?.href}: ${e.toString()}`, {
      tags: 'utils',
      severity: 'error',
    });
    return false;
  }

  return config.autoBlocks.find((candidate) => {
    const key = Object.keys(candidate)[0];
    if (!isTrustedAutoBlock(candidate[key], url)) return false;

    if (key === 'pdf-viewer' && !a.textContent.includes('.pdf')) {
      a.target = '_blank';
      return false;
    }

    const hasExtension = a.href.split('/').pop().includes('.');
    const mp4Match = a.textContent.match('media_.*.mp4');
    if (key === 'fragment' && (!hasExtension || mp4Match)) {
      if (a.href === window.location.href) {
        return false;
      }

      if (a.dataset.mepLingoSectionSwap || a.dataset.mepLingoBlockSwap) {
        a.dataset.mepLingo = 'true';
        a.className = `${key} link-block`;
        return true;
      }

      const isInlineFrag = url.hash.includes('#_inline');
      if (url.hash === '' || isInlineFrag) {
        const { parentElement } = a;
        const { nodeName, innerHTML } = parentElement;
        const noText = innerHTML === a.outerHTML;
        if (noText && nodeName === 'P') {
          const div = createTag('div', null, a);
          parentElement.parentElement.replaceChild(div, parentElement);
        }
      }

      // previewing a fragment page with mp4 video
      if (mp4Match) {
        a.className = 'video link-block';
        return false;
      }

      // Modals (exclude special fragment hashes)
      if (url.hash !== '' && !isInlineFrag && !url.hash.includes('#_replacecell')) {
        a.dataset.modalPath = url.pathname;
        a.dataset.modalHash = url.hash;
        a.href = url.hash;
        a.className = `modal link-block ${[...a.classList].join(' ')}`;
        return true;
      }
    }

    // slack uploaded mp4s
    if (key === 'video' && !a.textContent.match('media_.*.mp4')) {
      return false;
    }

    a.className = `${key} link-block`;
    return true;
  });
}

const decorateCopyLink = (a, evt) => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|mobile/.test(userAgent) && !/ipad/.test(userAgent);
  if (!isMobile || !navigator.share) {
    a.remove();
    return;
  }
  const link = a.href.replace(evt, '');
  const isConButton = ['EM', 'STRONG'].includes(a.parentElement.nodeName)
    || a.classList.contains('con-button');
  if (!isConButton) a.classList.add('static', 'copy-link');
  a.href = '';
  a.addEventListener('click', async (e) => {
    e.preventDefault();
    if (navigator.share) await navigator.share({ title: link, url: link });
  });
};

export function convertStageLinks({ anchors, config, hostname, href }) {
  const { env, stageDomainsMap, locale } = config;
  if (env?.name === 'prod' || !stageDomainsMap) return;
  const matchedRules = Object.entries(stageDomainsMap)
    .find(([domain]) => (new RegExp(domain)).test(href));
  if (!matchedRules) return;
  const [, domainsMap] = matchedRules;
  [...anchors].forEach((a) => {
    const hasLocalePrefix = a.pathname.startsWith(`${locale.prefix}/`);
    const noLocaleLink = hasLocalePrefix ? a.href.replace(`/${locale.prefix.replace(/^\//, '')}/`, '/') : a.href;
    const matchedDomain = Object.keys(domainsMap)
      .find((domain) => (new RegExp(domain)).test(noLocaleLink));
    if (!matchedDomain) return;
    const convertedLink = noLocaleLink.replace(
      new RegExp(matchedDomain),
      domainsMap[matchedDomain] === 'origin'
        ? `${matchedDomain.includes('https') ? 'https://' : ''}${hostname}`
        : domainsMap[matchedDomain],
    );
    const convertedUrl = new URL(convertedLink);
    convertedUrl.pathname = `${hasLocalePrefix ? locale.prefix : ''}${convertedUrl.pathname}`;
    a.href = convertedUrl.toString();
    if (/(\.page|\.live).*\.html(?=[?#]|$)/.test(a.href)) a.href = a.href.replace(/\.html(?=[?#]|$)/, '');
  });
}

function decorateLinkElement(a, config, hasDnt) {
  if (hasDnt) a.dataset.hasDnt = true;
  if (a.href.includes('http:')) a.setAttribute('data-http-link', 'true');
  decorateSVG(a);
  if (a.href.includes('#_blank')) {
    a.setAttribute('target', '_blank');
    a.href = a.href.replace('#_blank', '');
  }
  if (a.href.includes('#_alloy')) {
    import('../martech/alloy-links.js').then(({ default: processAlloyLink }) => {
      processAlloyLink(a);
    });
  }
  if (a.href.includes('#_nofollow')) {
    a.setAttribute('rel', 'nofollow');
    a.href = a.href.replace('#_nofollow', '');
  }
  if (a.href.includes('#_nohtml')) {
    a.href = a.href.replace('#_nohtml', '');
  }
  // Custom action links
  const loginEvent = '#_evt-login';
  if (a.href.includes(loginEvent)) {
    a.href = a.href.replace(loginEvent, '');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const { signInContext } = config;
      window.adobeIMS?.signIn(signInContext);
    });
  }
  const copyEvent = '#_evt-copy';
  if (a.href.includes(copyEvent)) {
    decorateCopyLink(a, copyEvent);
  }
  const branchQuickLink = 'app.link';
  if (a.href.includes(branchQuickLink)) {
    (async () => {
      const { default: processQuickLink } = await import('../features/branch-quick-links/branch-quick-links.js');
      processQuickLink(a);
    })();
  }
  // Append aria-label
  const pipeRegex = /\s?\|([^|]*)$/;
  if (pipeRegex.test(a.textContent) && !/\.[a-z]+/i.test(a.textContent)) {
    const node = [...a.childNodes].reverse()[0];
    const ariaLabel = node.textContent.match(pipeRegex)?.[1];
    node.textContent = node.textContent.replace(pipeRegex, '');
    a.setAttribute('aria-label', (ariaLabel || '').trim());
  }
}

function processLinkDecoration(a, config, hasDnt) {
  decorateLinkElement(a, config, hasDnt);
  if (a.href.includes('#_dnb')) {
    a.href = a.href.replace('#_dnb', '');
    return null;
  }
  const autoBlock = decorateAutoBlock(a);
  return autoBlock ? a : null;
}

function setupLinksDecoration(el) {
  const config = getConfig();
  decorateImageLinks(el);
  const anchors = el.getElementsByTagName('a');
  const { hostname, href } = window.location;
  return { config, anchors, hostname, href };
}

const decoratedLinks = new WeakSet();

export async function decorateLinksAsync(el) {
  const { config, anchors, hostname, href } = setupLinksDecoration(el);

  const linksPromises = [...anchors].map(async (a) => {
    if (decoratedLinks.has(a)) {
      return a.classList.contains('link-block') ? a : null;
    }
    if (a.href.startsWith('https://#')) a.href = a.href.replace('https://', '');
    appendHtmlToLink(a);
    const hasDnt = a.href.includes('#_dnt');
    if (!a.dataset.hasDnt) {
      a.href = await localizeLinkAsync(
        a.href,
        window.location.hostname,
        false,
        a,
      );
    }
    decoratedLinks.add(a);
    return processLinkDecoration(a, config, hasDnt);
  });

  const links = (await Promise.all(linksPromises)).filter(Boolean);
  convertStageLinks({ anchors, config, hostname, href });
  return links;
}

// this method is deprecated - use decorateLinksAsync instead
export function decorateLinks(el) {
  const { config, anchors, hostname, href } = setupLinksDecoration(el);

  const links = [...anchors].reduce((rdx, a) => {
    if (a.href.startsWith('https://#')) a.href = a.href.replace('https://', '');
    appendHtmlToLink(a);
    const hasDnt = a.href.includes('#_dnt');
    if (!a.dataset?.hasDnt) a.href = localizeLink(a.href);
    const result = processLinkDecoration(a, config, hasDnt);
    if (result) rdx.push(result);
    return rdx;
  }, []);

  convertStageLinks({ anchors, config, hostname, href });
  return links;
}

function decorateContent(el) {
  const children = [el];
  let child = el;
  while (child) {
    child = child.nextElementSibling;
    if (child && child.nodeName !== 'DIV') {
      children.push(child);
    } else {
      break;
    }
  }
  const block = document.createElement('div');
  block.className = 'content';
  block.append(...children);
  block.dataset.block = '';
  return block;
}

function decorateDefaults(el) {
  const firstChild = ':scope > *:not(div):first-child';
  const afterBlock = ':scope > div + *:not(div)';
  const children = el.querySelectorAll(`${firstChild}, ${afterBlock}`);
  children.forEach((child) => {
    const prev = child.previousElementSibling;
    const content = decorateContent(child);
    if (prev) {
      prev.insertAdjacentElement('afterend', content);
    } else {
      el.insertAdjacentElement('afterbegin', content);
    }
  });
}

export async function getGnavSource() {
  const { locale, dynamicNavKey } = getConfig();
  let url = getMetadata('gnav-source') || `${locale?.contentRoot ?? window.location.origin}/gnav`;
  if (dynamicNavKey) {
    const { default: dynamicNav } = await import('../features/dynamic-navigation/dynamic-navigation.js');
    url = dynamicNav(url, dynamicNavKey);
  }
  return url;
}

export function isLocalNav() {
  const { locale = {} } = getConfig();
  const gnavSource = getMetadata('gnav-source') || `${locale?.contentRoot ?? window.location.origin}/gnav`;
  let newNavEnabled = new URLSearchParams(window.location.search).get('newNav');
  newNavEnabled = newNavEnabled ? newNavEnabled !== 'false' : getMetadata('mobile-gnav-v2') !== 'off';
  return gnavSource.split('/').pop().startsWith('localnav-') && newNavEnabled;
}

async function decorateHeader() {
  const breadcrumbs = document.querySelector('.breadcrumbs');
  breadcrumbs?.remove();
  const header = document.querySelector('header');
  if (!header) return;
  const headerMeta = getMetadata('header');
  if (headerMeta === 'off') {
    document.body.classList.add('nav-off');
    header.remove();
    return;
  }
  header.className = headerMeta || 'global-navigation';
  const metadataConfig = getMetadata('breadcrumbs')?.toLowerCase()
    || getConfig().breadcrumbs;
  if (metadataConfig === 'off') return;
  const baseBreadcrumbs = getMetadata('breadcrumbs-base')?.length;

  const autoBreadcrumbs = getMetadata('breadcrumbs-from-url') === 'on';
  const dynamicNavActive = getMetadata('dynamic-nav') === 'on'
    && window.sessionStorage.getItem('gnavSource') !== null;
  if (!dynamicNavActive && (baseBreadcrumbs || breadcrumbs || autoBreadcrumbs)) header.classList.add('has-breadcrumbs');
  if (isLocalNav()) {
    // Preserving space to avoid CLS issue
    const localNavWrapper = createTag('div', { class: 'feds-localnav' });
    header.after(localNavWrapper);
  }
  if (breadcrumbs) header.append(breadcrumbs);
  const promo = getMetadata('gnav-promo-source');
  if (promo?.length) {
    const fedsPromoWrapper = createTag('div', { class: 'feds-promo-aside-wrapper' });
    header.before(fedsPromoWrapper);
    header.classList.add('has-promo');
  }
}

async function decorateIcons(area, config) {
  let icons = area.querySelectorAll('span.icon');
  if (icons.length === 0) return;
  const { base, iconsExcludeBlocks } = config;
  if (iconsExcludeBlocks) {
    if (['doodlebug', 'max25'].includes(getMetadata('theme'))) {
      // TODO: Remove after correcting core logic
      const includeIcons = [...icons].filter((icon) => !iconsExcludeBlocks.some((block) => icon.closest(`div.${block}`)));
      if (!includeIcons.length) return;
      icons = includeIcons;
    } else {
      const excludedIconsCount = [...icons].filter((icon) => iconsExcludeBlocks.some((block) => icon.closest(`div.${block}`))).length;
      if (excludedIconsCount === icons.length) return;
    }
  }
  loadStyle(`${base}/features/icons/icons.css`);
  const { default: loadIcons } = await import('../features/icons/icons.js');
  await loadIcons(icons, config);
}

export async function customFetch({ resource, withCacheRules }) {
  const options = {};
  if (withCacheRules) {
    const params = new URLSearchParams(window.location.search);
    options.cache = params.get('cache') === 'off' ? 'reload' : 'default';
  }
  return fetch(resource, options);
}

const findReplaceableNodes = (area) => {
  const regex = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
  const walker = document.createTreeWalker(area, NodeFilter.SHOW_ALL);
  const nodes = [];
  let node = walker.nextNode();
  while (node !== null) {
    let matchFound = false;
    if (node.nodeType === Node.TEXT_NODE) {
      matchFound = regex.test(node.nodeValue);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const { attributes } = node;
      for (let i = 0; i < attributes.length; i += 1) {
        const { value: attrValue } = attributes[i];
        if (regex.test(attrValue)) {
          matchFound = true;
        }
      }
    }
    if (matchFound) {
      nodes.push(node);
      regex.lastIndex = 0;
    }
    node = walker.nextNode();
  }
  return nodes;
};

export function getPlaceholderPaths(config) {
  const root = `${config.locale?.contentRoot}/placeholders`;
  const paths = [`${root}.json`];
  if (config.env.name !== 'prod'
    && getMetadata('placeholders-stage') === 'on') paths.push(`${root}-stage.json`);
  return paths;
}

let placeholderRequest;
export async function decoratePlaceholders(area, config) {
  if (!area) return;
  const nodes = findReplaceableNodes(area);
  if (!nodes.length) return;
  area.dataset.hasPlaceholders = 'true';
  const phPaths = getPlaceholderPaths(config);
  placeholderRequest ||= Promise.all(
    phPaths.map((path) => customFetch({ resource: path, withCacheRules: true })),
  ).catch(() => ({}));
  const { decoratePlaceholderArea } = await import('../features/placeholders.js');
  await decoratePlaceholderArea({
    placeholderPath: phPaths[0],
    placeholderRequest,
    nodes,
  });
}

async function loadFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const footerMeta = getMetadata('footer');
  if (footerMeta === 'off') {
    footer.remove();
    return;
  }
  footer.className = footerMeta || 'global-footer';
  await loadBlock(footer);
}

export function filterDuplicatedLinkBlocks(blocks) {
  if (!blocks?.length) return [];
  const uniqueModalKeys = new Set();
  const uniqueBlocks = [];
  for (const obj of blocks) {
    if (obj.className.includes('modal')) {
      const key = `${obj.dataset.modalHash}-${obj.dataset.modalPath}`;
      if (!uniqueModalKeys.has(key)) {
        uniqueModalKeys.add(key);
        uniqueBlocks.push(obj);
      }
    } else {
      uniqueBlocks.push(obj);
    }
  }
  return uniqueBlocks;
}

async function decorateSection(section, idx) {
  section.dataset.status = 'pending';
  section.dataset.idx = idx;
  let links = await decorateLinksAsync(section);
  decorateDefaults(section);
  const blocks = section.querySelectorAll(':scope > div[class]:not(.content)');

  const { doNotInline } = getConfig();
  const blockLinks = [...blocks].reduce((blkLinks, block) => {
    const blockName = block.classList[0];
    const blocksList = getMetadata('foundation') === 'c2' ? C2_BLOCKS : C1_BLOCKS;
    links.filter((link) => block.contains(link))
      .forEach((link) => {
        if (link.classList.contains('fragment') && link.href.includes('#_replacecell')) {
          link.href = link.href.replace('#_replacecell', '');
        } else if (link.classList.contains('fragment')
          && blocksList.includes(blockName) // do not inline consumer blocks (for now)
          && !doNotInline.includes(blockName)
          && link.dataset.mepLingo !== 'true') {
          if (!link.href.includes('#_inline')) {
            link.href = `${link.href}#_inline`;
          }
          blkLinks.inlineFrags.push(link);
        } else if (link.classList.contains('link-block')) {
          blkLinks.autoBlocks.push(link);
        }
      });
    return blkLinks;
  }, { inlineFrags: [], autoBlocks: [] });

  const embeddedLinks = [...blockLinks.inlineFrags, ...blockLinks.autoBlocks];
  if (embeddedLinks.length) {
    links = links.filter((link) => !embeddedLinks.includes(link));
  }

  section.className = `${section.classList.contains('section') ? section.className : 'section'}`;
  section.dataset.status = 'decorated';
  return {
    blocks: [...links, ...blocks],
    el: section,
    idx,
    preloadLinks: filterDuplicatedLinkBlocks(blockLinks.autoBlocks),
  };
}

export async function decorateFooterPromo(doc = document) {
  const footerPromoTag = getMetadata('footer-promo-tag', doc);
  const footerPromoType = getMetadata('footer-promo-type', doc);
  if (!footerPromoTag && footerPromoType !== 'taxonomy') return;

  const { default: initFooterPromo } = await import('../features/footer-promo.js');
  await initFooterPromo(footerPromoTag, footerPromoType, doc);
}

const getMepValue = (val) => {
  const valMap = { on: true, off: false, postLCP: 'postlcp' };
  const finalVal = val?.toLowerCase().trim();
  if (finalVal in valMap) return valMap[finalVal];
  return finalVal;
};

const getMdValue = (key) => {
  const value = getMetadata(key);
  if (value) {
    return getMepValue(value);
  }
  return false;
};

const getPromoMepEnablement = () => {
  const mds = [
    'apac_manifestnames',
    'emea_manifestnames',
    'americas_manifestnames',
    'jp_manifestnames',
    'manifestnames',
  ];
  const mdObject = mds.reduce((obj, key) => {
    const val = getMdValue(key);
    if (val) {
      obj[key] = val;
    }
    return obj;
  }, {});
  if (Object.keys(mdObject).length) {
    return mdObject;
  }
  return false;
};

export const getMepEnablement = (mdKey, paramKey = false) => {
  const paramValue = PAGE_URL.searchParams.get(paramKey || mdKey);
  if (paramValue) return getMepValue(paramValue);
  if (PROMO_PARAM === paramKey) return getPromoMepEnablement();
  return getMdValue(mdKey);
};

let imsLoaded;
export async function loadIms() {
  imsLoaded = imsLoaded || (async () => {
    const lingoRegion = lingoActive() ? await getLingoRegion() : null;
    return new Promise((resolve, reject) => {
      const {
        locale, imsClientId, imsScope, env, base, adobeid, imsTimeout,
      } = getConfig();
      if (!imsClientId) {
        reject(new Error('Missing IMS Client ID'));
        return;
      }
      const [unavMeta, ahomeMeta, imsGuest] = [getMetadata('universal-nav')?.trim(), getMetadata('adobe-home-redirect'), getMetadata('ims-guest-token')];
      const defaultScope = `AdobeID,openid,gnav${unavMeta && unavMeta !== 'off' ? ',pps.read,firefly_api,additional_info.roles,read_organizations,account_cluster.read' : ''}`;
      const timeout = setTimeout(() => reject(new Error('IMS timeout')), imsTimeout || 5000);
      window.adobeid = {
        client_id: imsClientId,
        scope: imsScope || defaultScope,
        locale: (lingoRegion?.ietf || locale?.ietf)?.replace('-', '_') || 'en_US',
        redirect_uri: ahomeMeta === 'on'
          ? `https://www${env.name !== 'prod' ? '.stage' : ''}.adobe.com${locale.prefix}` : undefined,
        autoValidateToken: true,
        environment: env.ims,
        useLocalStorage: false,
        onReady: () => {
          resolve();
          clearTimeout(timeout);
        },
        onError: reject,
        ...(imsGuest === 'on' && {
          api_parameters: { check_token: { guest_allowed: true } },
          enableGuestAccounts: true,
          enableGuestTokenForceRefresh: true,
        }),
        ...adobeid,
      };
      const path = PAGE_URL.searchParams.get('useAlternateImsDomain')
        ? 'https://auth.services.adobe.com/imslib/imslib.min.js'
        : `${base}/deps/imslib.min.js`;
      loadScript(path);
    });
  })().then(() => {
    if (getMepEnablement('xlg') === 'loggedout') {
      /* c8 ignore next */
      getConfig().entitlements();
    } else if (!window.adobeIMS?.isSignedInUser()) {
      getConfig().entitlements([]);
    }
  }).catch((e) => {
    getConfig().entitlements([]);
    throw e;
  });

  return imsLoaded;
}

export async function loadMartech({
  persEnabled = false,
  persManifests = [],
  postLCP = false,
} = {}) {
  // eslint-disable-next-line no-underscore-dangle
  if (window.marketingtech?.adobe?.launch && window._satellite) {
    return true;
  }

  if (PAGE_URL.searchParams.get('martech') === 'off'
    || PAGE_URL.searchParams.get('marketingtech') === 'off'
    || getMetadata('martech') === 'off') {
    return false;
  }

  window.targetGlobalSettings = { bodyHidingEnabled: false };
  loadIms().catch(() => { });

  const { default: initMartech } = await import('../martech/martech.js');
  await initMartech({ persEnabled, persManifests, postLCP });
  isMartechLoaded = true;

  return true;
}

/**
 * Checks if the user is signed out based on the server timing and navigation performance.
 *
 * @returns {boolean} True if the user is signed out, otherwise false.
 */
export function isSignedOut() {
  const serverTiming = window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming?.reduce(
    (acc, { name, description }) => ({ ...acc, [name]: description }),
    {},
  );

  return !Object.keys(serverTiming || {}).length || serverTiming?.sis === '0';
}

/**
 * Enables personalization (V2) for the page.
 *
 * @returns {boolean} True if personalization is enabled, otherwise false.
 */
export function enablePersonalizationV2() {
  const enablePersV2 = getMepEnablement('personalization-v2');
  return !!enablePersV2 && isSignedOut();
}

export function loadMepAddons() {
  const mepAddons = ['lob', 'event-id'];
  const promises = {};
  mepAddons.forEach((addon) => {
    const enablement = getMepEnablement(addon);
    if (enablement === false) return;
    const addonName = addon.split('-')[0];
    promises[addonName] = (async () => {
      const { default: init } = await import(`../features/mep/addons/${addonName}.js`);
      return init(enablement);
    })();
  });
  return promises;
}

async function checkForPageMods() {
  const {
    mep: mepParam,
    mepHighlight,
    mepButton,
    martech,
  } = Object.fromEntries(PAGE_URL.searchParams);
  let targetInteractionPromise = null;
  let countryIPPromise = null;
  let calculatedTimeout = null;

  if (mepParam === 'off') return;
  const pzn = getMepEnablement('personalization');
  const pznroc = getMepEnablement('personalization-roc');
  const promo = getMepEnablement('manifestnames', PROMO_PARAM);
  const target = martech === 'off' ? false : getMepEnablement('target');
  const xlg = martech === 'off' ? false : getMepEnablement('xlg');
  const ajo = martech === 'off' ? false : getMepEnablement('ajo');
  const mepgeolocation = getMepEnablement('mepgeolocation');
  const mepMarketingDecrease = getMepEnablement('mep-marketing-decrease');

  if (!(pzn || pznroc || target || promo || mepParam
    || mepHighlight || mepButton || mepParam === '' || xlg || ajo || mepMarketingDecrease)) return;

  loadLink(`${getConfig().base}/martech/helpers.js`, { rel: 'preload', as: 'script', crossorigin: 'anonymous' });

  const promises = loadMepAddons();
  const akamaiCode = getMepEnablement('akamaiLocale') || await getCountry(true);
  if (mepgeolocation && !akamaiCode) {
    countryIPPromise = getCountry();
  }
  const enablePersV2 = enablePersonalizationV2();
  if ((target || xlg) && enablePersV2) {
    const params = new URL(window.location.href).searchParams;
    calculatedTimeout = parseInt(params.get('target-timeout'), 10)
      || parseInt(getMetadata('target-timeout'), 10)
      || TARGET_TIMEOUT_MS;

    const { locale } = getConfig();
    targetInteractionPromise = (async () => {
      const { loadAnalyticsAndInteractionData } = await import('../martech/helpers.js');
      const now = performance.now();
      performance.mark('interaction-start');
      const data = await loadAnalyticsAndInteractionData(
        { locale, env: getEnv({})?.name, calculatedTimeout },
      );
      performance.mark('interaction-end');
      performance.measure('total-time', 'interaction-start', 'interaction-end');
      const respTime = performance.getEntriesByName('total-time')[0];

      return { targetInteractionData: data, respTime, respStartTime: now };
    })();
  } else if ((target || xlg || ajo) && !isMartechLoaded) loadMartech();
  else if ((pzn || pznroc) && martech !== 'off') {
    loadIms()
      .then(() => {
        /* c8 ignore next */
        if (window.adobeIMS?.isSignedInUser() && !isMartechLoaded) loadMartech();
      })
      .catch((e) => { console.log('Unable to load IMS:', e); });
  }

  const { init } = await import('../features/personalization/personalization.js');
  await init({
    mepParam,
    mepHighlight,
    mepButton,
    pzn,
    pznroc,
    promo,
    target,
    ajo,
    countryIPPromise,
    mepgeolocation,
    targetInteractionPromise,
    calculatedTimeout,
    enablePersV2,
    promises,
    mepMarketingDecrease,
    akamaiCode,
  });
}

async function decorateMeta() {
  const { origin } = window.location;
  const contents = document.head.querySelectorAll('[content*=".hlx."]:not([data-localized]), [content*=".aem."]:not([data-localized]), [content*="/federal/"]:not([data-localized])');
  await Promise.all(Array.from(contents).map(async (meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    if (name === 'hlx:proxyUrl' || name?.endsWith('schedule') || meta.getAttribute('http-equiv') === 'Content-Security-Policy') return;
    try {
      const url = new URL(meta.content);
      const localizedLink = await localizeLinkAsync(`${origin}${url.pathname}`);
      const localizedURL = localizedLink.includes(origin) ? localizedLink : `${origin}${localizedLink}`;
      meta.setAttribute('content', `${localizedURL}${url.search}${url.hash}`);
      meta.dataset.localized = 'true';
    } catch (e) {
      window.lana?.log(`Cannot make URL from metadata - ${meta.content}: ${e.toString()}`, {
        tags: 'utils',
        severity: 'error',
      });
    }
  }));
}

function initModalEventListener() {
  window.addEventListener('modal:open', async (e) => {
    const { miloLibs } = getConfig();
    const { findDetails, getModal } = await import('../blocks/modal/modal.js');
    loadStyle(`${miloLibs}/blocks/modal/modal.css`);
    const details = await findDetails(e.detail.hash);
    if (details) getModal(details);
  });
}

async function loadPostLCP(config) {
  import('./favicon.js').then(({ default: loadFavIcon }) => loadFavIcon(createTag, getConfig(), getMetadata));

  await decoratePlaceholders(document.body.querySelector('header'), config);
  const sk = document.querySelector('aem-sidekick, helix-sidekick');
  if (sk) import('./sidekick-decorate.js').then((mod) => { mod.default(sk); });
  if (config.mep?.targetEnabled === 'postlcp') {
    /* c8 ignore next 2 */
    const { init } = await import('../features/personalization/personalization.js');
    await init({ postLCP: true });
    if (enablePersonalizationV2() && !isMartechLoaded) loadMartech();
  } else if (!isMartechLoaded) loadMartech();

  const languageBanner = PAGE_URL.searchParams.get('languageBanner') ?? (getMetadata('languagebanner') || config.languageBanner);
  const georouting = getMetadata('georouting') || config.geoRouting;
  config.georouting = { loadedPromise: Promise.resolve(), enabled: config.geoRouting };

  if (languageBanner === 'on') {
    const routingConfig = getLangRoutingConfig();
    if (routingConfig?.showBanner && routingConfig.markets?.length) {
      const { default: init } = await import('../features/language-banner/language-banner.js');
      await init();
    } else if (routingConfig?.showModal && routingConfig.markets?.length) {
      const { default: showRegionModal } = await import('../features/region-modal/region-modal.js');
      await showRegionModal(routingConfig, config, createTag, loadStyle, loadBlock);
    }
  } else if (georouting === 'on') {
    const jsonPromise = fetch(`${config.contentRoot ?? ''}/georoutingv2.json`);
    config.georouting.loadedPromise = (async () => {
      const { default: loadGeoRouting } = await import('../features/georoutingv2/georoutingv2.js');
      await loadGeoRouting(config, createTag, getMetadata, loadBlock, loadStyle, jsonPromise);
    })();
    // This is used only in webapp-prompt.js
  }
  const header = document.querySelector('header');
  if (header) {
    header.classList.add('gnav-hide');
    performance.mark('Gnav-Start');

    loadBlock(header);
    header.classList.remove('gnav-hide');
  }
  loadTemplate();
  const { default: loadFonts } = await import('./fonts.js');
  loadFonts(config.locale, loadStyle);

  if (config?.mep) {
    import('../features/personalization/personalization.js')
      .then(({ addMepAnalytics }) => addMepAnalytics(config, header));
  }
  if (getMetadata('foundation') === 'c2') {
    await Promise.all([
      new Promise((resolve) => { loadStyle(`${config.base}/deps/lenis.min.css`, resolve); }),
      loadScript(`${config.base}/deps/lenis.min.js`),
    ]);
    const lerp = parseFloat(PAGE_URL.searchParams.get('inertialFactor')) || 0.08;
    const fsThreshold = 110;
    const fsFactor = 0.11;
    const fsDelay = 700;
    const lenisPreventClasses = ['dialog-modal', 'ot-sdk-container', 'global-navigation'];
    window.lenis = new window.Lenis({
      autoRaf: true,
      lerp,
      prevent: (node) => lenisPreventClasses.some((cls) => node.classList?.contains(cls)),
    });
    // Reduce inertia during fast scrolling to avoid sustained RAF CPU usage
    let fsScrollTimer;
    window.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > fsThreshold) {
        window.lenis.options.lerp = fsFactor;
        clearTimeout(fsScrollTimer);
        fsScrollTimer = setTimeout(() => { window.lenis.options.lerp = lerp; }, fsDelay);
      }
    }, { passive: true });
  }
  // load privacy here if quick-link is present in first section
  const quickLink = document.querySelector('div.section')?.querySelector('.quick-link');
  if (!quickLink || window.adobePrivacy) return;
  import('../scripts/delayed.js').then(({ loadPrivacy }) => {
    loadPrivacy(getConfig, loadScript);
  });
}

export function scrollToHashedElement(hash) {
  if (!hash || /=/.test(hash)) return; // skip if hash is used for deeplinking.
  const elementId = decodeURIComponent(hash).slice(1);
  let targetElement;
  try {
    targetElement = document.querySelector(`#${elementId}:not(.dialog-modal)`);
  } catch (e) {
    window.lana?.log(`Could not query element because of invalid hash - ${elementId}: ${e.toString()}`, {
      tags: 'utils',
      severity: 'error',
    });
  }
  if (!targetElement) return;
  const bufferHeight = document.querySelector('.global-navigation')?.offsetHeight || 0;
  const topOffset = targetElement.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: topOffset - bufferHeight,
    behavior: 'smooth',
  });
}

export async function loadDeferred(area, blocks, config) {
  area.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));

  if (area !== document) {
    return;
  }

  config.resolveDeferred?.(true);

  if (config.links === 'on') {
    const path = `${config.contentRoot || ''}${getMetadata('links-path') || '/seo/links.json'}`;
    import('../features/links.js').then((mod) => mod.default(path, area));
  }

  if (config.locale?.ietf === 'ja-JP') {
    // Japanese word-wrap
    import('../features/japanese-word-wrap.js').then(({ default: controlJapaneseLineBreaks }) => {
      controlJapaneseLineBreaks(config, area);
    });
  }

  if (getMetadata('pageperf') === 'on') {
    import('./logWebVitals.js')
      .then((mod) => mod.default(getConfig().mep, {
        delay: getMetadata('pageperf-delay'),
        sampleRate: parseInt(getMetadata('pageperf-rate'), 10),
      }));
  }
  if (config.mep?.preview) {
    import('../features/personalization/preview.js')
      .then(({ default: decoratePreviewMode }) => decoratePreviewMode());
  }
  if (config?.dynamicNavKey && config?.env?.name !== 'prod') {
    const { miloLibs } = config;
    loadStyle(`${miloLibs}/features/dynamic-navigation/status.css`);
    const { default: loadDNStatus } = await import('../features/dynamic-navigation/status.js');
    loadDNStatus();
  }
}

function initSidekick() {
  const initPlugins = async () => {
    const { default: init } = await import('./sidekick.js');
    init({ createTag, loadBlock, loadScript, loadStyle });
  };

  if (document.querySelector('aem-sidekick, helix-sidekick')) {
    initPlugins();
  } else {
    document.addEventListener('sidekick-ready', () => {
      initPlugins();
    });
  }
}

export function getMarketsSourceKey() {
  const { env, marketsSource } = getConfig();
  const sourceFromUrl = PAGE_URL.searchParams.get('marketsSource');
  const allowedMarkets = ['express']; // TODO: remove allowedMarkets once feature is stable
  return (/^[a-zA-Z0-9-]+$/.test(sourceFromUrl) && (env?.name !== 'prod' || allowedMarkets.includes(sourceFromUrl)) && sourceFromUrl)
    || getMetadata('marketssource')
    || marketsSource
    || null;
}

export function usesBannerFlow() {
  const onlyBanner = PAGE_URL.searchParams.get('onlybanner') ?? getMetadata('onlybanner') ?? getConfig().onlybanner ?? false;
  return onlyBanner === true || ['true', 'on'].includes(String(onlyBanner).toLowerCase());
}
export function getMarketsUrl() {
  const { contentRoot } = getConfig();
  const marketsSourceKey = getMarketsSourceKey();
  if (marketsSourceKey) return `${contentRoot ?? ''}/assets/supported-markets/supported-markets-${marketsSourceKey}.json`;
  return `${getFederatedContentRoot()}/federal/assets/supported-markets/supported-markets.json`;
}

const isUsEntry = ({ prefix = '' } = {}) => prefix === '' || prefix === 'us';
function excludeUsUnlessExplicit(markets, geoIp) {
  if (markets.length <= 1) return markets;
  const usEntry = markets.find(isUsEntry);
  if (!usEntry) return markets;
  const usListsGeo = usEntry.regionPriorities?.split(',').some((pair) => pair.trim().split(':')[0].toLowerCase() === geoIp);
  return usListsGeo ? markets : markets.filter((market) => !isUsEntry(market));
}

function getMarketsByRegionPriority(markets, geoIp) {
  const marketsWithPriority = [];
  markets.forEach((market) => {
    if (!market.regionPriorities) return;
    const match = market.regionPriorities.split(',')
      .find((e) => e.trim().split(':')[0].toLowerCase() === geoIp);
    if (match) marketsWithPriority.push({ market, priority: parseInt(match.trim().split(':')[1], 10) });
  });
  if (!marketsWithPriority.length) return null;
  marketsWithPriority.sort((a, b) => a.priority - b.priority);
  return marketsWithPriority.map(({ market }) => market);
}

function reserveBannerSpace() {
  document.body.prepend(createTag('div', { class: 'language-banner', 'daa-lh': 'language-banner' }));
  const existingWrapper = document.querySelector('.feds-promo-aside-wrapper');
  if (existingWrapper) {
    existingWrapper.remove();
    document.querySelector('.global-navigation')?.classList.remove('has-promo');
  }
}

export async function pageExist(url) {
  const headResp = await fetch(url, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
  if (headResp?.status !== 401) return headResp?.ok ?? false;
  if (!(url.includes('.aem.page') || url.includes('.aem.live'))) return false;
  return (await fetch(url, { method: 'GET', cache: 'no-store' }).catch(() => null))?.ok ?? false;
}

export async function decorateLanguageBanner() {
  const { locale, locales, languageBanner } = getConfig();
  const languageBannerEnabled = PAGE_URL.searchParams.get('languageBanner') ?? (getMetadata('languagebanner') || languageBanner);
  if (languageBannerEnabled !== 'on') return;
  const internationalCookie = getCookie('international');
  let showBanner = false;
  if (internationalCookie === (locale.prefix?.replace('/', '') || 'us')) return;
  const pageLang = locale.ietf.split('-')[0];
  const prefLang = internationalCookie
    ? (locales[internationalCookie === 'us' ? '' : internationalCookie]?.ietf?.split('-')[0] || internationalCookie.split('_').pop())
    : navigator.language?.split('-')[0] || null;

  const [geoIpCode, marketsConfig] = await Promise.all([
    getCountry(),
    fetch(getMarketsUrl())
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null),
  ]);

  if (!geoIpCode || !marketsConfig) return;
  getConfig().marketsConfig = marketsConfig;
  const rawEntries = marketsConfig.languages?.data ?? marketsConfig.data;
  if (!rawEntries?.length) return;
  const geoIp = geoIpCode.toLowerCase();
  const languageEntries = rawEntries.map((entry) => ({
    ...entry,
    supportedRegions: entry.supportedRegions.split(',').map((r) => r.trim().toLowerCase()),
    dir: locales?.[entry.prefix || '']?.dir || 'ltr',
  }));
  const pagePrefix = locale.prefix?.replace('/', '') || '';
  const pageMarket = languageEntries.find((m) => m.prefix === pagePrefix)
    ?? languageEntries.find((m) => m.prefix === locale.base);
  const isSupportedMarket = pageMarket?.supportedRegions.includes(geoIp);

  const candidateMarkets = [];
  const addAndShow = (...ms) => {
    showBanner = true;
    candidateMarkets.push(...ms);
  };

  const useBannerFlow = usesBannerFlow();
  // Supported Market Path
  if (isSupportedMarket) {
    if (!prefLang || pageLang === prefLang) return;
    const prefMarket = languageEntries.find((market) => (
      market.lang === prefLang
      && market.supportedRegions.includes(geoIp)
    ));
    if (prefMarket) addAndShow(prefMarket);
    else return;
  } else {
    // Unsupported Market Path
    const marketsForGeo = languageEntries.filter((market) => (
      market.supportedRegions.includes(geoIp)));
    if (!marketsForGeo.length) return;
    if (useBannerFlow) {
      let prefMarketForGeo;
      if (prefLang) {
        prefMarketForGeo = marketsForGeo.find((market) => market.lang === prefLang);
        if (prefMarketForGeo) addAndShow(prefMarketForGeo);
      }
      if (!prefMarketForGeo) {
        const marketsSortedByPriority = getMarketsByRegionPriority(marketsForGeo, geoIp);
        addAndShow(...(marketsSortedByPriority ?? [marketsForGeo[0]]));
      }
    } else {
      // ACOM flow: US exclusion + regionPriorities filter, multi-option modal
      const marketsForGeoFiltered = excludeUsUnlessExplicit(marketsForGeo, geoIp);
      if (prefLang) {
        const marketsWithPrefLang = marketsForGeoFiltered.filter((m) => m.lang === prefLang);
        if (marketsWithPrefLang.length === 1) {
          addAndShow(marketsWithPrefLang[0]);
        } else if (marketsWithPrefLang.length > 1) {
          const marketsSortedByPriority = getMarketsByRegionPriority(marketsWithPrefLang, geoIp);
          addAndShow(...(marketsSortedByPriority ?? marketsWithPrefLang));
        }
      }
      if (!showBanner) {
        const marketsSortedByPriority = getMarketsByRegionPriority(marketsForGeoFiltered, geoIp);
        addAndShow(...(marketsSortedByPriority ?? marketsForGeoFiltered));
      }
    }
  }

  if (!showBanner) return;

  if (!useBannerFlow && !isSupportedMarket) {
    setLangRoutingConfig({
      showBanner: false,
      showModal: true,
      markets: candidateMarkets,
      geoMarketCode: geoIp,
    });
    return;
  }

  const { pathname, origin } = window.location;
  const pagePath = locale.prefix ? pathname.replace(locale.prefix, '') : pathname;

  const fetchPromises = candidateMarkets.map((market) => {
    const url = `${origin}${market.prefix ? `/${market.prefix}` : ''}${pagePath}`;
    return pageExist(url).then((ok) => ({ market, ok }));
  });

  if (useBannerFlow) {
    let targetMarket = null;
    for (const promise of fetchPromises) {
      const { market, ok } = await promise;
      if (ok) { targetMarket = market; break; }
    }
    if (!targetMarket) return;
    setLangRoutingConfig({ showBanner: true, showModal: false, markets: [targetMarket] });
    reserveBannerSpace();
  } else {
    // ACOM : supported market, show banner
    const results = await Promise.all(fetchPromises);
    const validatedMarkets = results.filter((r) => r.ok).map((r) => r.market);
    if (!validatedMarkets.length) return;
    setLangRoutingConfig({ showBanner: true, showModal: false, markets: validatedMarkets });
    reserveBannerSpace();
  }
}

export function preloadMarketsConfig(callback) {
  const config = getConfig();
  if (config.marketsConfig) return;
  const languageBannerEnabled = PAGE_URL.searchParams.get('languageBanner') ?? (getMetadata('languagebanner') || config.languageBanner);
  const masGeoDetect = PAGE_URL.searchParams.get('mas-geo-detection') ?? getMetadata('mas-geo-detection');
  const isMasGeoDetectionEnabled = ['on', 'true'].includes(masGeoDetect?.toLowerCase());
  if (languageBannerEnabled !== 'on' && !isMasGeoDetectionEnabled) return;
  const marketsUrl = getMarketsUrl();
  loadLink(marketsUrl, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload', callback });
}

async function decorateDocumentExtras() {
  await decorateMeta();
  await decorateHeader();
  langBannerPromise = decorateLanguageBanner();
}

async function documentPostSectionLoading(config) {
  const injectBlock = getMetadata('injectblock');
  if (injectBlock) {
    import('./injectblock.js').then((module) => module.default(injectBlock));
  }

  decorateFooterPromo();
  import('../scripts/accessibility.js').then((accessibility) => {
    accessibility.default();
  });
  if (getMetadata('seotech-structured-data') === 'on' || getMetadata('seotech-video-url')) {
    import('../features/seotech/seotech.js').then((module) => module.default(
      { locationUrl: window.location.href, getMetadata, createTag, getConfig },
    ));
  }
  const richResults = getMetadata('richresults');
  if (richResults) {
    const { default: addRichResults } = await import('../features/richresults.js');
    addRichResults(richResults, { createTag, getMetadata });
  }
  loadFooter();
  if (config.experiment?.selectedVariant?.scripts?.length) {
    config.experiment.selectedVariant.scripts.forEach((script) => loadScript(script));
  }
  initSidekick();

  const { default: delayed } = await import('../scripts/delayed.js');
  delayed([getConfig, getMetadata, loadScript, loadStyle, loadIms]);

  import('../martech/attributes.js').then((analytics) => {
    document.querySelectorAll('main > div').forEach((section, idx) => analytics.decorateSectionAnalytics(section, idx, config));
  });

  document.body.appendChild(createTag('div', { id: 'page-load-ok-milo', style: 'display: none;' }));
}

export function partition(arr, fn) {
  return arr.reduce(
    (acc, val, i, ar) => {
      acc[fn(val, i, ar) ? 0 : 1].push(val);
      return acc;
    },
    [[], []],
  );
}

const preloadBlockResources = (blocks = []) => blocks.map((block) => {
  if (block.classList.contains('hide-block')) return null;
  const { blockPath, hasStyles, name } = getBlockData(block);
  if (['marquee', 'hero-marquee'].includes(name)) {
    loadLink(`${getConfig().base}/utils/decorate.js`, { rel: 'preload', as: 'script', crossorigin: 'anonymous' });
  }
  loadLink(`${blockPath}.js`, { rel: 'preload', as: 'script', crossorigin: 'anonymous' });
  return hasStyles && new Promise((resolve) => { loadStyle(`${blockPath}.css`, resolve); });
}).filter(Boolean);

async function loadFragments(section, selector) {
  const anchors = [...section.querySelectorAll(selector)];
  if (!anchors.length) return false;

  const { default: loadFragment } = await import('../blocks/fragment/fragment.js');
  await Promise.all(anchors.map((anchor) => loadFragment(anchor)));
  return true;
}

async function resolveHighPriorityFragments(section) {
  section.el.querySelectorAll('a[data-mep-lingo-block-swap], a[href*="#_inline"][data-mep-lingo]').forEach((a) => {
    const bName = a.dataset.mepLingoBlockSwap;
    const block = bName ? a.closest(`.${bName}`) : a.closest('.section > div[class]');
    if (block?.classList.contains('hide-block')) block.remove();
  });

  // Load in cascading order: section swaps → block swaps → inline fragments
  const hadSectionSwaps = await loadFragments(section.el, 'a[data-mep-lingo-section-swap]');
  const hadBlockSwaps = await loadFragments(section.el, 'a[data-mep-lingo-block-swap]');
  const hadInlineFrags = await loadFragments(section.el, 'a[href*="#_inline"]');

  if (hadSectionSwaps || hadBlockSwaps || hadInlineFrags) {
    const redecorated = await decorateSection(section.el, section.idx);
    section.blocks = redecorated.blocks;
    section.preloadLinks = redecorated.preloadLinks;
  }
}

async function processSection(section, config, isDoc, lcpSectionId) {
  await resolveHighPriorityFragments(section);
  const isLcpSection = lcpSectionId === section.idx;
  const stylePromises = isLcpSection ? preloadBlockResources(section.blocks) : [];
  preloadBlockResources(section.preloadLinks);
  await Promise.all([
    decoratePlaceholders(section.el, config),
    decorateIcons(section.el, config),
  ]);
  const loadBlocks = [...stylePromises];
  if (section.preloadLinks.length) {
    const [modals, blocks] = partition(section.preloadLinks, (block) => block.classList.contains('modal'));
    await Promise.all(blocks.map((block) => loadBlock(block)));
    modals.forEach((block) => loadBlock(block));
  }

  section.blocks.forEach((block) => loadBlocks.push(loadBlock(block)));

  if (isLcpSection && langBannerPromise) await langBannerPromise;

  // Only move on to the next section when all blocks are loaded.
  await Promise.all(loadBlocks);

  delete section.el.dataset.status;
  if (isDoc && isLcpSection) await loadPostLCP(config);
  delete section.el.dataset.idx;
  return section.blocks;
}

function loadLingoIndexes(area = document) {
  const config = getConfig();
  const { locale } = config || {};
  if (locale?.base || locale?.base === '') {
    loadQueryIndexes(config.locale.prefix, [...area.querySelectorAll('.section a')].map((a) => a.href).filter(Boolean));
    return;
  }
  getGeoLocalePrefix().then((prefix) => {
    if (prefix) {
      loadQueryIndexes(prefix, [...area.querySelectorAll('.section a')].map((a) => a.href).filter(Boolean));
    }
  }).catch((e) => window.lana?.log(`Failed to get mep lingo prefix: ${e}`, { tags: 'lingo', severity: 'error' }));
}

export async function loadArea(area = document) {
  const isDoc = area === document;
  if (isDoc) {
    if (document.getElementById('page-load-ok-milo')) return;
    setCountry();
    preloadMarketsConfig();
    await checkForPageMods();
    appendHtmlToCanonicalUrl();
    appendSuffixToTitles();
  }
  const config = getConfig();
  const isLingoActive = lingoActive();

  if (!langConfig && (config.languages || hasLanguageLinks(area))) {
    await loadLanguageConfig();
  }

  if (isDoc) {
    await decorateDocumentExtras();
    initModalEventListener();
  }

  const htmlSections = [...area.querySelectorAll(isDoc ? 'body > main > div' : ':scope > div')];
  htmlSections.forEach((section) => { section.className = 'section'; section.dataset.status = 'pending'; });

  if (isLingoActive) loadLingoIndexes(area);

  const areaBlocks = [];
  let lcpSectionId = null;

  for (const htmlSection of htmlSections) {
    const section = await decorateSection(htmlSection, htmlSections.indexOf(htmlSection));
    const isLastSection = section.idx === htmlSections.length - 1;
    if (lcpSectionId === null && (section.blocks.length !== 0 || isLastSection)) {
      lcpSectionId = section.idx;
    }
    const sectionBlocks = await processSection(section, config, isDoc, lcpSectionId);
    areaBlocks.push(...sectionBlocks);

    areaBlocks.forEach((block) => {
      if (!block.className.includes('metadata')) block.dataset.block = '';
    });
  }

  const currentHash = window.location.hash;
  if (currentHash) {
    scrollToHashedElement(currentHash);
  }

  if (isDoc) await documentPostSectionLoading(config);

  await loadDeferred(area, areaBlocks, config);
}

export const utf8ToB64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
export const b64ToUtf8 = (str) => decodeURIComponent(escape(window.atob(str)));

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function createIntersectionObserver({ el, callback, once = true, options = {} }) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        if (once) observer.unobserve(entry.target);
        callback(entry.target, entry);
      }
    });
  }, options);
  io.observe(el);
  return io;
}

export function loadLana(options = {}) {
  if (window.lana) return;

  const lanaError = (e) => {
    window.lana?.log(e.reason || e.error || e.message, { errorType: 'i', severity: 'error' });
  };

  window.lana = {
    log: async (...args) => {
      window.removeEventListener('error', lanaError);
      window.removeEventListener('unhandledrejection', lanaError);
      await import('./lana.js');
      return window.lana.log(...args);
    },
    debug: false,
    options,
  };

  window.addEventListener('error', lanaError);
  window.addEventListener('unhandledrejection', lanaError);
}

export const reloadPage = () => window.location.reload();
