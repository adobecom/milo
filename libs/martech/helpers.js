/* eslint-disable no-underscore-dangle */
const AMCV_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
const KNDCTR_COOKIE_KEYS = [
  'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_identity',
  'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_cluster',
];

const KNDCTR_CONSENT_COOKIE = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent';
const OPT_ON_AND_CONSENT_COOKIE = 'OptanonConsent';

const DATA_STREAM_IDS_PROD = { default: '913eac4d-900b-45e8-9ee7-306216765cd2' };
const DATA_STREAM_IDS_STAGE = { default: 'e065836d-be57-47ef-b8d1-999e1657e8fd' };

let dataStreamId = '';

function getDomainWithoutWWW() {
  const domain = window?.location?.hostname;
  return domain.replace(/^www\./, '');
}

const hitTypeEventTypeMap = {
  propositionFetch: 'decisioning.propositionFetch',
  pageView: 'web.webpagedetails.pageViews',
  propositionDisplay: 'decisioning.propositionDisplay',
};

function generateUUIDv4() {
  const randomValues = new Uint8Array(16);
  crypto.getRandomValues(randomValues);
  randomValues[6] = (randomValues[6] % 16) + 64;
  randomValues[8] = (randomValues[8] % 16) + 128;
  let uuid = '';
  randomValues.forEach((byte, index) => {
    const hex = byte.toString(16).padStart(2, '0');
    if (index === 4 || index === 6 || index === 8 || index === 10) {
      uuid += '-';
    }
    uuid += hex;
  });

  return uuid;
}

function getDeviceInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    screenOrientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

function getCookie(key) {
  const cookie = document.cookie.split(';')
    .map((x) => decodeURIComponent(x.trim()).split(/=(.*)/s))
    .find(([k]) => k === key);

  return cookie ? cookie[1] : null;
}

function setCookie(key, value, options = {}) {
  const expires = options.expires || 730;
  const date = new Date();
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
  const expiresString = `expires=${date.toUTCString()}`;

  document.cookie = `${key}=${value}; ${expiresString}; path=/ ; domain=.${getDomainWithoutWWW()};`;
}

export const getVisitorStatus = ({
  expiryDays = 30,
  cookieName = 's_nr',
  domain = `.${(new URL(window.location.origin)).hostname}`,
}) => {
  const currentTime = new Date().getTime();
  const cookieValue = getCookie(cookieName) || '';
  const cookieAttributes = { expires: new Date(currentTime + expiryDays * 24 * 60 * 60 * 1000) };

  if (domain) {
    cookieAttributes.domain = domain;
  }

  if (!cookieValue) {
    setCookie(cookieName, `${currentTime}-New`, cookieAttributes);
    return 'New';
  }

  const [storedTime, storedState] = cookieValue.split('-').map((value) => value.trim());

  if (currentTime - storedTime < 30 * 60 * 1000 && storedState === 'New') {
    setCookie(cookieName, `${currentTime}-New`, cookieAttributes);
    return 'New';
  }

  setCookie(cookieName, `${currentTime}-Repeat`, cookieAttributes);
  return 'Repeat';
};

function getOrGenerateUserId() {
  const amcvCookieValue = getCookie(AMCV_COOKIE);

  if (!amcvCookieValue || (amcvCookieValue.indexOf('MCMID|') === -1)) {
    const fpidValue = generateUUIDv4();
    return {
      FPID: [{
        id: fpidValue,
        authenticatedState: 'ambiguous',
        primary: true,
      }],
    };
  }

  return {
    ECID: [{
      id: amcvCookieValue.match(/MCMID\|([^|]+)/)?.[1],
      authenticatedState: 'ambiguous',
      primary: true,
    }],
  };
}

function getUpdatedVisitAttempt() {
  const { hostname } = window.location;
  const secondVisitAttempt = Number(localStorage.getItem('secondHit')) || 0;

  const isAdobeDomain = hostname === 'www.adobe.com' || hostname === 'www.stage.adobe.com';
  const consentCookieValue = getCookie(OPT_ON_AND_CONSENT_COOKIE);

  if (!consentCookieValue?.includes('C0002:0') && isAdobeDomain && secondVisitAttempt <= 2) {
    const updatedVisitAttempt = secondVisitAttempt === 0 ? 1 : secondVisitAttempt + 1;
    localStorage.setItem('secondHit', updatedVisitAttempt);
    return updatedVisitAttempt;
  }

  return secondVisitAttempt;
}

function getUpdatedAcrobatVisitAttempt() {
  const { hostname, pathname } = window.location;
  const secondVisitAttempt = Number(localStorage.getItem('acrobatSecondHit')) || 0;

  const isAdobeDomain = (hostname === 'www.adobe.com' || hostname === 'www.stage.adobe.com') && /\/acrobat/.test(pathname);
  const consentCookieValue = getCookie(OPT_ON_AND_CONSENT_COOKIE);

  if (!consentCookieValue?.includes('C0002:0') && isAdobeDomain && secondVisitAttempt <= 2) {
    const updatedVisitAttempt = secondVisitAttempt === 0 ? 1 : secondVisitAttempt + 1;
    localStorage.setItem('acrobatSecondHit', updatedVisitAttempt);
    return updatedVisitAttempt;
  }

  return secondVisitAttempt;
}

export function getPageNameForAnalytics() {
  const { hostname, pathname } = new URL(window.location.href);
  const urlRegions = Object.fromEntries(['ae_ar', 'ae_en', 'africa', 'apac', 'ar', 'at', 'au', 'be', 'be_en', 'be_fr', 'be_nl',
    'bg', 'br', 'ca', 'ca_es', 'ca_fr', 'ch', 'ch_de', 'ch_fr', 'ch_it', 'cin', 'cis_en', 'cis_ru', 'cl', 'cn', 'co', 'cr', 'cs',
    'cs_cz', 'cy', 'cy_en', 'cz', 'da', 'da_dk', 'de', 'de_de', 'dk', 'ec', 'ee', 'eeurope', 'eg_ar', 'eg_en', 'en', 'en_gb',
    'en_us', 'es', 'es_es', 'eu_es', 'fi', 'fi_fi', 'fr', 'fr_fr', 'gr', 'gr_el', 'gr_en', 'gt', 'hk', 'hk_en', 'hk_zh', 'hr',
    'hr_hr', 'hu', 'hu_hu', 'id_en', 'id_id', 'ie', 'il', 'il_en', 'il_he', 'in', 'in_hi', 'it', 'it_it', 'ja', 'ja_jp', 'jp',
    'ko', 'ko_kr', 'kr', 'kw_ar', 'kw_en', 'la', 'lt', 'lu', 'lu_de', 'lu_en', 'lu_fr', 'lv', 'mena', 'mena_ar', 'mena_en',
    'mena_fr', 'mt', 'mx', 'my_en', 'my_ms', 'na', 'nb', 'nb_no', 'ng', 'nl', 'nl_nl', 'no', 'nz', 'pe', 'ph_en', 'ph_fil',
    'pl', 'pl_pl', 'pr', 'pt', 'pt_br', 'qa_ar', 'qa_en', 'ro', 'ro_ro', 'rs', 'ru', 'ru_ru', 'sa_ar', 'sa_en', 'se', 'sea',
    'sg', 'si', 'sk', 'sk_sk', 'sl_si', 'sv', 'sv_se', 'th', 'th_en', 'th_th', 'tr', 'tr_tr', 'tw', 'tw_cn', 'ua', 'uk', 'uk_ua',
    'us', 'vn_en', 'vn_vi', 'za', 'zh-Hans', 'zh-Hant', 'zh-tw', 'zh_cn', 'zh_tw'].map((r) => [r, 1]));

  const path = pathname.replace(/\.(aspx|php|html)/g, '').split('/').filter((s) => s && !urlRegions[s.toLowerCase()]).join(':');
  return `${hostname.replace('www.', '')}${path ? `:${path}` : ''}`;
}

export function getProcessedPageNameForAnalytics() {
  const pageName = getPageNameForAnalytics().toLowerCase();
  const pageArray = pageName.split(':');

  const FILTERS = {
    lightroom: ['lightroom.adobe.com', 'embed', 'shares', 'libraries', 'gallery', 'learn', 'tutorial', 'discover', 'remix', 'api', 'feedback', 'lrdesktop', 'albums', 'shared-with-you', 'search', 'gallery', 'incomplete', 'assets', 'u', 'slideshow'],
    stock: ['stock.adobe.com', '3d-assets', 'aaid', 'category', 'collections', 'contributor', 'download', 'downloadfiledirectly', 'id', 'images', 'Library', 'pages', 'sc', 'search', 'stock-photo', 'templates', 'urn', 'video', 'editorial', 'free', 'audio', 'premium', 'login', 'generate', 'artisthub'],
    xd: ['xd.adobe.com', 'embed', 'grid', 'screen', 'specs', 'view', 'spec'],
    express: ['express.adobe.com', 'aaid', 'accept-invite', 'branding', 'design', 'design-remix', 'folders', 'libraries', 'manage-access', 'page', 'post', 'remix', 'sc', 'sp', 'urn', 'video', 'new', 'projects', 'app-licensing', 'app-licensing-homepage'],
    account: ['accounts.adobe.com', 'account.adobe.com', '30_free_days', '60_free_days', '90_free_days', 'agent_chat', 'cancel-plan', 'change-plan', 'change reason selected modal', 'complete', 'cs_help', 'edit-payment', 'modal', 'new-change-plan-offers-loaded', 'no_offershown', 'offer_search', 'plans', 'promotion', 'review', 'save_offer', 'switch', 'temp_license_prod', 'billing-history', 'cancel-reason', 'change reason selected modal', 'cs_help', 'details', 'manage plan modal', 'modal', 'offer_search', 'orders', 'other', 'plan-benefits-modal', 'plan-details', 'returns', 'save_offer', 'downloads'],
    adminconsole: ['adminconsole.adobe.com', 'account', 'administrators', 'add-products', 'all-packages', 'billing-history', 'contract', 'contracts-and-agreements', 'enterprise', 'identity', 'packages', 'products', 'profile', 'profiles', 'overview', 'quick-assign-products', 'renew-products', 'requests', 'review-user-introductions', 'settings', 'storage', 'support', 'user-management', 'users', 'version.xml', 'all-users', 'directories', 'summary', 'user-groups'],
    community: ['community.adobe.com', 'account-payment-plan-discussions', 'acrobat-discussions', 'acrobat-reader-discussions', 'acrobat-reader-mobile-discussions', 'acrobat-sdk-discussions', 'acrobat-services-api-discussions', 'adobe-acrobat-online-discussions', 'adobe-acrobat-sign-discussions', 'adobe-aero-bugs', 'adobe-aero-discussions', 'adobe-color-discussions', 'adobe-express-bugs', 'adobe-express-discussions', 'adobe-firefly-bugs', 'adobe-firefly-discussions', 'adobe-firefly-ideas', 'adobe-fonts-discussions', 'adobe-learning-manager-discussions', 'adobe-media-encoder-discussions', 'adobe-scan-discussions', 'adobe-xd-discussions', 'after-effects-beta-discussions', 'after-effects-bugs', 'after-effects-discussions', 'after-effects-ideas', 'air-discussions', 'animate-discussions', 'audition-discussions', 'badges', 'bridge-discussions', 'business-catalyst-discussions-read-only', 'camera-raw-discussions', 'captivate-discussions', 'character-animator-discussions', 'coldfusion-discussions', 'color-management-discussions', 'connect-discussions', 'contentarchivals', 'creative-cloud-desktop-discussions', 'creative-cloud-services-discussions', 'digital-editions-discussions', 'dimension-discussions', 'download-install-discussions', 'dreamweaver-discussions', 'enterprise-teams-discussions', 'exchange-discussions', 'fireworks-discussions', 'flash-player-discussions', 'forums', 'framemaker-discussions', 'fresco-discussions', 'illustrator-discussions', 'illustrator-draw-discussions', 'illustrator-on-the-ipad-discussions', 'incopy-discussions', 'indesign-discussions', 'kudos', 'lightroom-classic-bugs', 'lightroom-classic-discussions', 'lightroom-classic-ideas', 'lightroom-ecosystem-cloud-based-bugs', 'lightroom-ecosystem-cloud-based-discussions', 'lightroom-ecosystem-cloud-based-ideas', 'mixamo-discussions', 'muse-discussions', 'photoshop-beta-bugs', 'photoshop-beta-discussions', 'photoshop-discussions', 'photoshop-ecosystem-bugs', 'photoshop-ecosystem-discussions', 'photoshop-ecosystem-ideas', 'photoshop-elements-discussions', 'photoshop-express-discussions', 'photoshop-sketch-discussions', 'postscript-discussions', 'premiere-elements-discussions', 'premiere-pro-beta-bugs', 'premiere-pro-beta-discussions', 'premiere-pro-bugs', 'premiere-pro-discussions', 'premiere-pro-ideas', 'premiere-rush-discussions', 'robohelp-discussions', 'stock-contributors-discussions', 'stock-discussions', 'substance-3d-designer-discussions', 'substance-3d-painter-bugs', 'substance-3d-painter-discussions', 'substance-3d-plugins-discussions', 'substance-3d-sampler-discussions', 'substance-3d-stager-discussions', 't5', 'team-projects-discussions', 'the-lounge-discussions', 'type-typography-discussions', 'user', 'using-the-community-discussions', 'video', 'video-hardware-discussions', 'video-lounge-discussions', 'xd-discussions'],
    acrobat: ['acrobat.adobe.com', 'aaid', 'documents', 'gdrive', 'id', 'link', 'onedrive', 'sc', 'urn'],
    behance: ['behance.net', 'appreciated', 'collection', 'collections', 'dailycc', 'discover', 'drafts', 'editor', 'followers', 'following', 'font', 'gallery', 'inbox', 'info', 'insights', 'joblist', 'live', 'loggedout', 'moodboard', 'profile', 'projects', 'report', 'resume', 'search', 'talent'],
    fonts: ['fonts.adobe.com', 'confirm', 'fonts', 'results', 'select', 'upload', 'vs'],
    photoshop: ['photoshop.adobe.com', 'id', 'urn', 'aaid', 'sc', 'us', 'ap', 'eu', 'va6c2', 'va7'],
    plan: ['plan.adobe.com', 'cancel', 'cancel-reason', 'change', 'entitlements', 'interest', 'learn-more', 'loss-aversion-page', 'offers', 'offers-loaded', 'quiz', 'reasons', 'review', 'select-licenses', 'switch', 'switch-plan', 'view', 'plans', 'view-offer-details', 'saved', 'results'],
    color: ['color.adobe.com', 'cloud', 'color', 'color-accessibility', 'color-contrast-analyzer', 'color-wheel', 'color-wheel-game', 'image', 'image-gradient', 'mythemes', 'urn', 'aaid', 'sc', 'library', 'trends', 'create'],
    creative: ['creative.adobe.com', 'code', 'redeem', 'share'],
    portfolio: ['portfolio.adobe.com', 'account-swaps', 'admin', 'preview', 'editor', 'firsteditor', 'switch-theme', 'user'],
    schedule: ['schedule.adobe.com', 'calendar', 'connect', 'finalise'],
    newexpress: ['new.express.adobe.com', 'aaid', 'branding', 'brands', 'design', 'design-remix', 'id', 'libraries', 'link', 'page', 'post', 'sc', 'sp', 'template', 'urn', 'video', 'webpage', 'your-stuff'],
  };

  const SPECIAL_DOMAINS = [
    'lightroom.adobe.com', 'stock.adobe.com', 'xd.adobe.com', 'express.adobe.com',
    'accounts.adobe.com', 'account.adobe.com', 'adminconsole.adobe.com',
    'community.adobe.com', 'acrobat.adobe.com', 'behance.net', 'fonts.adobe.com',
    'photoshop.adobe.com', 'plan.adobe.com', 'color.adobe.com', 'creative.adobe.com',
    'portfolio.adobe.com', 'schedule.adobe.com', 'new.express.adobe.com',
  ];

  const signMatch = pageName.match(/.*\.echosign\..*|.*\.adobesign\..*|.*documents\.adobe\.com.*/);
  if (signMatch) {
    return signMatch[1];
  }
  if (document.title && document.title.includes('404')) {
    return 'adobe.com:404';
  }
  if (pageName.match(/^stock\.adobe\.com:..:(1|2|3[^\d]|4|5|6|7|8|9)|^stock\.adobe\.com:(1|2|3[^\d]|4|5|6|7|8|9)/)) {
    return 'stock.adobe.com:file';
  }
  for (const [, filter] of Object.entries(FILTERS)) {
    if (pageName.startsWith(filter[0])) {
      const filtered = pageArray.filter((value) => filter.includes(value)).join(':');
      return SPECIAL_DOMAINS.includes(filtered) ? pageName : filtered;
    }
  }

  return pageName;
}

function resolveAgiCampaignAndFlag() {
  const { hostname, pathname, href } = window.location;
  const consentValue = getCookie('OptanonConsent');
  const EXPIRY_TIME_IN_DAYS = 90;
  const CAMPAIGN_PAGE_VALUE = '1';
  const ACROBAT_DOMAIN_VALUE = '2';

  if (!consentValue?.includes('C0002:1')) {
    return { agiCampaign: false, setAgICampVal: false };
  }

  const agiCookie = getCookie('agiCamp');
  const setAgiCookie = (value) => {
    setCookie('agiCamp', value, {
      expires: EXPIRY_TIME_IN_DAYS,
      domain: getDomainWithoutWWW(),
    });
  };

  const campaignRegex = /ttid=(all-in-one|reliable|versatile|combine-organize-e-sign|webforms-edit-e-sign)/;
  const isGotItPage = pathname.includes('/acrobat/campaign/acrobats-got-it.html') && campaignRegex.test(href);
  const isAcrobatDomain = hostname === 'acrobat.adobe.com' || (hostname === 'www.adobe.com' && pathname.includes('/acrobat'));

  let agiCampaign = false;

  if (isGotItPage && (!agiCookie || agiCookie !== ACROBAT_DOMAIN_VALUE)) {
    setAgiCookie(CAMPAIGN_PAGE_VALUE);
    agiCampaign = CAMPAIGN_PAGE_VALUE;
  } else if (isAcrobatDomain && (!agiCookie || agiCookie !== CAMPAIGN_PAGE_VALUE)) {
    if (agiCookie === ACROBAT_DOMAIN_VALUE) return { agiCampaign: false, setAgICampVal: false };
    setAgiCookie(ACROBAT_DOMAIN_VALUE);
    agiCampaign = ACROBAT_DOMAIN_VALUE;
  }

  const setAgICampVal = agiCampaign === CAMPAIGN_PAGE_VALUE || agiCampaign === ACROBAT_DOMAIN_VALUE;
  return { agiCampaign, setAgICampVal };
}

function getGlobalPrivacyControl() {
  if (!navigator || !navigator.globalPrivacyControl) return '';
  return navigator.globalPrivacyControl.toString();
}

function getEntityId() {
  if (window.location.href === 'https://www.adobe.com/express/') {
    return 'a2c4e4e4-eaa9-11ed-a05b-0242ac120003';
  }
  const metaTag = document.querySelector('meta[name="entity_id"]');
  return metaTag ? metaTag.getAttribute('content') : null;
}

function getPrimaryProduct() {
  const productNameMeta = document.querySelector('meta[name="primaryproductname"]');
  return productNameMeta?.content || null;
}

const LOCALE_MAPPINGS = {
  '': 'en-US', ar: 'es-AR', br: 'pt-BR', ca: 'en-CA', ca_fr: 'fr-CA', cl: 'es-CL', co: 'es-CO', la: 'es-LA', mx: 'es-MX', pe: 'es-PE', africa: 'en-AFRICA', be_fr: 'fr-BE', be_en: 'en-BE', be_nl: 'nl-BE', cy_en: 'en-CY', dk: 'da-DK', de: 'de-DE', ee: 'et-EE', es: 'es-ES', fr: 'fr-FR', gr_en: 'en-GR', ie: 'en-IE', il_en: 'en-IL', it: 'it-IT', lv: 'lv-LV', lt: 'lt-LT', lu_de: 'de-LU', lu_en: 'en-LU', lu_fr: 'fr-LU', hu: 'hu-HU', mt: 'en-MT', mena_en: 'en-MENA', nl: 'nl-NL', no: 'no-NO', pl: 'pl-PL', pt: 'pt-PT', ro: 'ro-RO', sa_en: 'en-SA', ch_de: 'de-CH', si: 'sl-SI', sk: 'sk-SK', ch_fr: 'fr-CH', fi: 'fi-FI', se: 'sv-SE', ch_it: 'it-CH', tr: 'tr-TR', ae_en: 'en-AE', uk: 'en-UK', at: 'de-AT', cz: 'cs-CZ', bg: 'bg-BG', ru: 'ru-RU', ua: 'uk-UA', il_he: 'iw-IL', ae_ar: 'ar-AE', mena_ar: 'ar-MENA', sa_ar: 'ar-SA', au: 'en-AU', hk_en: 'en-HK', in: 'en-IN', id_id: 'in-ID', id_en: 'en-ID', my_ms: 'ms-MY', my_en: 'en-MY', nz: 'en-NZ', ph_en: 'en-PH', ph_fil: 'fil-PH', sg: 'en-SG', th_en: 'en-TH', in_hi: 'hi-IN', th_th: 'th-TH', cn: 'zh-CN', hk_zh: 'zh-HK', tw: 'zh-hant-TW', jp: 'ja-JP', kr: 'ko-KR', langstore: 'en-US', za: 'en-ZA', ng: 'en-NG', cr: 'es-CR', ec: 'es-EC', pr: 'es-PR', gt: 'es-GT', eg_ar: 'ar-EG', kw_ar: 'ar-KW', qa_ar: 'ar-QA', eg_en: 'en-EG', kw_en: 'en-KW', qa_en: 'en-QA', gr_el: 'el-GR', vn_en: 'en-VN', vn_vi: 'vi-VN', cis_ru: 'ru-CIS', cis_en: 'en-CIS',
};

export function getLanguageCode(locale) {
  const prefix = locale?.prefix?.replace(/^\//, '') || '';
  return LOCALE_MAPPINGS[prefix] || LOCALE_MAPPINGS[''];
}

function getUpdatedContext({
  screenWidth, screenHeight, screenOrientation,
  viewportWidth, viewportHeight, localTime, timezoneOffset,
}) {
  return {
    device: {
      screenHeight,
      screenWidth,
      screenOrientation,
    },
    environment: {
      type: 'browser',
      browserDetails: {
        viewportWidth,
        viewportHeight,
      },
    },
    placeContext: {
      localTime,
      localTimezoneOffset: timezoneOffset,
    },
  };
}

const getMartechCookies = () => document.cookie.split(';')
  .map((x) => x.trim().split('='))
  .filter(([key]) => KNDCTR_COOKIE_KEYS.includes(key))
  .map(([key, value]) => ({ key, value }));

function createRequestPayload({ updatedContext, pageName, processedPageName, locale, hitType }) {
  const prevPageName = getCookie('gpv');
  const isCollectCall = hitType === 'propositionDisplay';
  const isPageViewCall = hitType === 'pageView';
  const webPageDetails = {
    URL: window.location.href,
    siteSection: window.location.hostname,
    server: window.location.hostname,
    isErrorPage: false,
    isHomePage: false,
    name: pageName,
    pageViews: { value: Number(isPageViewCall) },
  };
  const consentCookie = getCookie(OPT_ON_AND_CONSENT_COOKIE) || '';

  const consentState = (() => {
    const hasOptOnCookie = getCookie(OPT_ON_AND_CONSENT_COOKIE);
    if (!hasOptOnCookie) return 'unknown';
    return getCookie(KNDCTR_CONSENT_COOKIE) ? 'post' : 'pre';
  })();

  const eventObj = {
    xdm: {
      ...updatedContext,
      identityMap: getOrGenerateUserId(),
      web: {
        webPageDetails,
        webInteraction: isPageViewCall || isCollectCall ? undefined : {
          name: 'Martech-API',
          type: 'other',
          linkClicks: { value: 1 },
        },
        webReferrer: { URL: document.referrer },
      },
      timestamp: new Date().toISOString(),
      eventType: hitTypeEventTypeMap[hitType],
      eventMergeId: generateUUIDv4(),
      ...(getPrimaryProduct() && { productListItems: [{ SKU: getPrimaryProduct() }] }),
    },
    data: {
      __adobe: {
        target: {
          is404: false,
          authState: 'loggedOut',
          hitType,
          isMilo: true,
          adobeLocale: getLanguageCode(locale),
          hasGnav: true,
          ...(getEntityId() ? { 'entity.id': getEntityId() } : {}),
        },
      },
      eventMergeId: generateUUIDv4(),
      _adobe_corpnew: {
        configuration: { edgeConfigId: dataStreamId },
        digitalData: {
          page: { pageInfo: { language: getLanguageCode(locale) } },
          diagnostic: { franklin: { implementation: 'milo' } },
          previousPage: { pageInfo: { pageName: prevPageName } },
          primaryUser: { primaryProfile: { profileInfo: { authState: 'loggedOut', returningStatus: getVisitorStatus({}) } } },
        },
        otherConsents: { configuration: { advertising: consentCookie && consentCookie.includes('C0004:0') ? 'false' : 'true' } },
        cmp: { state: consentState },
      },
      marketingtech: {
        adobe: {
          alloy: {
            approach: 'martech-API',
            personalisation: 'hybrid',
          },
        },
      },
    },
  };

  if (isPageViewCall) {
    const {
      href, origin, protocol, host, hostname, port, pathname, search, hash,
    } = window.location;
    const { data, xdm } = eventObj;
    const { digitalData } = data._adobe_corpnew;
    const { pageInfo } = digitalData.page;
    const { agiCampaign, setAgICampVal } = resolveAgiCampaignAndFlag();
    pageInfo.pageName = pageName;
    pageInfo.processedPageName = processedPageName;
    pageInfo.location = {
      href, origin, protocol, host, hostname, port, pathname, search, hash,
    };
    pageInfo.siteSection = webPageDetails.siteSection;
    digitalData.diagnostic.franklin.implementation = 'milo';
    digitalData.primaryUser.primaryProfile.profileInfo = {
      ...digitalData.primaryUser.primaryProfile.profileInfo,
      entitlementCreativeCloud: 'unknown',
      entitlementStatusCreativeCloud: 'unknown',
    };
    data.web = {
      webPageDetails,
      webReferrer: { URL: document.referrer },
    };
    data.eventType = hitTypeEventTypeMap[hitType];

    if (getUpdatedVisitAttempt() === 2) {
      digitalData.adobe = {
        ...digitalData.adobe,
        libraryVersions: 'alloy-api',
        experienceCloud: {
          ...digitalData.adobe?.experienceCloud,
          secondVisits: 'setEvent',
        },
      };
    }
    if (getUpdatedAcrobatVisitAttempt() === 2) {
      digitalData.adobe = {
        ...digitalData.adobe,
        experienceCloud: {
          ...digitalData.adobe?.experienceCloud,
          acrobatSecondVisits: 'setEvent',
        },
      };
    }
    digitalData.adobe = {
      ...digitalData.adobe,
      experienceCloud: {
        ...digitalData.adobe?.experienceCloud,
        agiCampaign: setAgICampVal ? agiCampaign : '',
      },
      gpc: getGlobalPrivacyControl(),
    };
    xdm.implementationDetails = {
      name: 'https://ns.adobe.com/experience/alloy/reactor',
      version: '2.0',
      environment: 'browser',
    };
  }

  const eventValue = isCollectCall ? { events: [{ ...eventObj }] } : { event: { ...eventObj } };

  return {
    ...eventValue,
    query: {
      identity: { fetch: ['ECID'] },
      personalization: isCollectCall ? undefined : {
        schemas: [
          'https://ns.adobe.com/personalization/default-content-item',
          'https://ns.adobe.com/personalization/html-content-item',
          'https://ns.adobe.com/personalization/json-content-item',
          'https://ns.adobe.com/personalization/redirect-item',
          'https://ns.adobe.com/personalization/ruleset-item',
          'https://ns.adobe.com/personalization/message/in-app',
          'https://ns.adobe.com/personalization/message/content-card',
          'https://ns.adobe.com/personalization/dom-action',
        ],
        surfaces: [`web://${window.location.host + window.location.pathname}`],
        decisionScopes: ['__view__'],
      },
    },
    meta: {
      target: { migration: true },
      state: {
        domain: getDomainWithoutWWW(),
        cookiesEnabled: true,
        entries: getMartechCookies(),
      },
    },
  };
}

function updateMartechCookies(cookieData) {
  cookieData?.forEach(({ key, value }) => {
    const currentCookie = getCookie(key);
    if (!currentCookie) {
      setCookie(encodeURIComponent(key), value);
    }
  });
}

function updateAMCVCookie(ECID) {
  const cookieValue = getCookie(AMCV_COOKIE);

  if (!cookieValue) {
    setCookie(encodeURIComponent(AMCV_COOKIE), `MCMID|${ECID}`);
  } else if (cookieValue.indexOf('MCMID|') === -1) {
    setCookie(encodeURIComponent(AMCV_COOKIE), `${cookieValue}|MCMID|${ECID}`);
  }
}

function getUrl(isCollectCall) {
  const PAGE_URL = new URL(window.location.href);
  const { host } = window.location;
  const query = PAGE_URL.searchParams.get('env');
  const url = `https://edge.adobedc.net/ee/v2/${isCollectCall ? 'collect' : 'interact'}`;

  /* c8 ignore start */
  if (query || host.includes('localhost') || host.includes('.page')
    || host.includes('.live')) {
    return url;
  }

  /* c8 ignore start */
  if (host.includes('stage.adobe')
    || host.includes('corp.adobe')
    || host.includes('graybox.adobe')) {
    return `https://www.stage.adobe.com/experienceedge/v2/${isCollectCall ? 'collect' : 'interact'}`;
  }

  const { origin } = window.location;
  return `${origin}/experienceedge/v2/${isCollectCall ? 'collect' : 'interact'}`;
}

export const createRequestUrl = ({
  env,
  hitType,
}) => {
  const TARGET_API_URL = getUrl(hitType === 'propositionDisplay');
  dataStreamId = env === 'prod' ? DATA_STREAM_IDS_PROD.default : DATA_STREAM_IDS_STAGE.default;
  return `${TARGET_API_URL}?dataStreamId=${dataStreamId}&requestId=${generateUUIDv4()}`;
};

const setGpvCookie = (pageName) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 1800000);
  setCookie('gpv', pageName, { expires });
};

const getPayloadsByType = (data, type) => data?.handle?.filter((d) => d.type === type)
  .map((d) => d.payload)
  .reduce((acc, curr) => [...acc, ...curr], []);

const setWindowAlloy = (alloyData) => {
  const get = (obj, path) => path.split('.').reduce((current, segment) => (current !== undefined && current !== null ? current[segment] : undefined), obj);

  const set = (obj, path, val) => {
    path.split('.').reduce((current, segment, index, segments) => {
      if (index === segments.length - 1) current[segment] = val;
      else current[segment] = current[segment] || {};
      return current[segment];
    }, obj);

    return obj;
  };
  window.alloy_all = window.alloy_all || { get, set };
  if (alloyData?.destinations) {
    const xlgValue = 'data._adobe_corpnew.digitalData.adobe.xlg';
    const existingXlg = window.alloy_all.get(window.alloy_all, xlgValue) || '';
    const xlgIds = existingXlg ? new Set(existingXlg.split(',')) : new Set();

    for (const destination of alloyData.destinations) {
      for (const segment of destination.segments) {
        const segmentId = segment.id;
        if (!xlgIds.has(segmentId)) xlgIds.add(segmentId);
      }
    }
    const updatedXlg = Array.from(xlgIds).join(',');
    window.alloy_all.set(window.alloy_all, xlgValue, updatedXlg);
  }
};

const setTTMetaAndAlloyTarget = (propositions) => {
  const regex = /,|:/;
  const isEmpty = (val) => !val || val?.length === 0;
  const offerNames = [];
  const activityNames = [];
  let targetResponse = window.alloy_all.get(window.alloy_all, 'data._adobe_corpnew.digitalData.adobe.target.response') || '';
  const clean = (str) => (str || '').replace(regex, '');

  propositions.forEach((proposition) => {
    proposition.items?.forEach(({ meta }) => {
      if (isEmpty(meta)) return;

      const offerName = meta['option.name'];
      const activityName = meta['activity.name'];
      window.ttMETA = window.ttMETA || [];
      if (offerNames.indexOf(offerName) === -1 || activityNames.indexOf(activityName) === -1) {
        offerNames.push(offerName);
        activityNames.push(activityName);
        const data = {
          CampaignName: activityName,
          RecipeName: meta['experience.name'],
          CampaignId: meta['activity.id'],
          RecipeId: meta['experience.id'],
          OfferId: meta['option.id'],
          OfferName: offerName,
          TrafficId: meta['experience.trafficAllocationId'],
          TrafficType: meta['experience.trafficAllocationType'],
        };

        window.ttMETA.push(data);

        const activityId = data.CampaignId;
        if (targetResponse.indexOf(activityId) === -1) {
          // If there is already a response string, append a comma
          if (targetResponse) targetResponse += ',';

          targetResponse += `T:${[activityId, activityName, data.OfferId, offerName, data.RecipeId, data.RecipeName, data.TrafficId, data.TrafficType].map(clean).join(':')}`;
        }
      }
    });
  });
  window.alloy_all.set(window.alloy_all, 'data._adobe_corpnew.digitalData.adobe.target.response', targetResponse);
};

function filterPropositionInJson(payloads) {
  return payloads
    .filter((item) => item?.items?.some((i) => i?.data?.format === 'application/json'))
    .map(({ items, ...rest }) => ({
      ...rest,
      items: items.map(({ data, ...itemRest }) => itemRest),
    }));
}

function sendPropositionDisplayRequest(filteredPayload, env, requestPayload) {
  const reqUrl = createRequestUrl({ env, hitType: 'propositionDisplay' });
  const reqBody = createRequestPayload({ ...requestPayload, hitType: 'propositionDisplay' });

  const decisioning = {
    propositions: filteredPayload,
    propositionEventType: { display: 1 },
  };

  reqBody.events[0].xdm._experience = { decisioning };
  reqBody.events[0].data._experience = { decisioning };

  reqBody.events[0].xdm.documentUnloading = true;
  reqBody.events[0].data.documentUnloading = true;

  fetch(reqUrl, {
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
}

export const loadAnalyticsAndInteractionData = async (
  { locale, env, calculatedTimeout },
) => {
  const value = getCookie(KNDCTR_CONSENT_COOKIE);

  if (value === 'general=out') {
    return {};
  }
  const getLocalISOString = () => {
    const date = new Date();
    const tzOffset = -date.getTimezoneOffset();
    const diff = `${(tzOffset >= 0 ? '+' : '-')
                 + String(Math.floor(Math.abs(tzOffset) / 60)).padStart(2, '0')}:${
      String(Math.abs(tzOffset) % 60).padStart(2, '0')}`;
    return date.toISOString().replace('Z', diff);
  };
  const localTime = getLocalISOString();
  const CURRENT_DATE = new Date();
  const timezoneOffset = CURRENT_DATE.getTimezoneOffset();
  window.hybridPers = true;
  const hitType = 'pageView';
  const pageName = getPageNameForAnalytics();
  const processedPageName = getProcessedPageNameForAnalytics();
  const updatedContext = getUpdatedContext({ ...getDeviceInfo(), localTime, timezoneOffset });
  const requestUrl = createRequestUrl({
    env,
    hitType,
  });
  const requestPayload = {
    updatedContext, pageName, processedPageName, locale, env, hitType,
  };
  const requestBody = createRequestPayload(requestPayload);

  try {
    const targetResp = await Promise.race([
      fetch(requestUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }),
      new Promise((_, reject) => { setTimeout(() => reject(new Error('Request timed out')), calculatedTimeout); }),
    ]);

    if (!targetResp.ok) {
      throw new Error('Failed to fetch interact call');
    }
    const targetRespJson = await targetResp.json();

    const ECID = targetRespJson.handle
      .flatMap((item) => item.payload)
      .find((p) => p.namespace?.code === 'ECID')?.id || null;

    const extractedData = [];

    targetRespJson?.handle?.forEach((item) => {
      if (item?.type === 'state:store') {
        item?.payload?.forEach((payload) => {
          if (payload?.key === KNDCTR_COOKIE_KEYS[0] || payload?.key === KNDCTR_COOKIE_KEYS[1]) {
            extractedData.push({ ...payload });
          }
        });
      }
    });

    const resultPayload = getPayloadsByType(targetRespJson, 'personalization:decisions');
    const filteredPayload = filterPropositionInJson(resultPayload);
    if (filteredPayload.length) {
      sendPropositionDisplayRequest(filteredPayload, env, requestPayload);
    }
    const alloyData = {
      destinations: getPayloadsByType(targetRespJson, 'activation:pull'),
      propositions: resultPayload,
      inferences: getPayloadsByType(targetRespJson, 'rtml:inferences'),
      decisions: [],
    };
    window.dispatchEvent(new CustomEvent('alloy_sendEvent', { detail: alloyData }));
    setWindowAlloy(alloyData);
    setTTMetaAndAlloyTarget(resultPayload);

    updateAMCVCookie(ECID);
    updateMartechCookies(extractedData);

    if (resultPayload?.length === 0) throw new Error('No propositions found');

    setGpvCookie(pageName);
    return {
      type: hitType,
      result: { propositions: resultPayload },
    };
  } catch (err) {
    if (err.message !== 'No propositions found') {
      console.log(err);
    }
    setGpvCookie(pageName);
    return {};
  }
};

export default { loadAnalyticsAndInteractionData };
