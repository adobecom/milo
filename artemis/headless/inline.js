window.ssr = true;

  const getUnityLibs = (prodLibs = '/unitylibs') => {
    const { hostname, search } = window.location;
    if (!/\.hlx\.|\.aem\.|local|stage/.test(hostname)) return prodLibs;
    const branch = new URLSearchParams(search).get('unitylibs') || 'main';
    if (branch === 'main' && hostname === 'www.stage.adobe.com') return prodLibs;
    const env = hostname.includes('.hlx.') ? 'hlx' : 'aem';
    return `https://${branch}${branch.includes('--')? '' : '--unity--adobecom'}.${env}.live/unitylibs`;
  }

  const setLibs = (prodLibs, location = window.location) => {
    const { hostname, search } = location;
    if (!/\.hlx\.|\.aem\.|local|stage/.test(hostname)) return prodLibs;
    // eslint-disable-next-line compat/compat
    const branch = new URLSearchParams(search).get('milolibs') || 'main';
    if (branch === 'main' && hostname === 'www.stage.adobe.com') return '/libs';
    if (branch === 'local') return 'http://localhost:6456/libs';
    const env = hostname.includes('.aem.') ? 'aem' : 'hlx';
    return `https://${branch}${branch.includes('--') ? '' : '--milo--adobecom'}.${env}.live/libs`;
  };

  const getLocale = (locales, pathname = window.location.pathname) => {
    if (!locales) {
      return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
    }
    const LANGSTORE = 'langstore';
    const split = pathname.split('/');
    const localeString = split[1];
    const locale = locales[localeString] || locales[''];
    if (localeString === LANGSTORE) {
      locale.prefix = `/${localeString}/${split[2]}`;
      if (
        Object.values(locales)
          .find((loc) => loc.ietf?.startsWith(split[2]))?.dir === 'rtl'
      ) locale.dir = 'rtl';
      return locale;
    }
    const isUS = locale.ietf === 'en-US';
    locale.prefix = isUS ? '' : `/${localeString}`;
    locale.region = isUS ? 'us' : localeString.split('_')[0];
    return locale;
  };

  // Add project-wide styles here.
const STYLES = '/acrobat/styles/styles.css';

// Use '/libs' if your live site maps '/libs' to milo's origin.
const LIBS = '/libs'


const locales = {
  // Americas
  ar: { ietf: 'es-AR', tk: 'oln4yqj.css' },
  br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
  ca: { ietf: 'en-CA', tk: 'pps7abe.css' },
  ca_fr: { ietf: 'fr-CA', tk: 'vrk5vyv.css' },
  cl: { ietf: 'es-CL', tk: 'oln4yqj.css' },
  co: { ietf: 'es-CO', tk: 'oln4yqj.css' },
  la: { ietf: 'es', tk: 'oln4yqj.css' },
  mx: { ietf: 'es-MX', tk: 'oln4yqj.css' },
  pe: { ietf: 'es-PE', tk: 'oln4yqj.css' },
  '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  // EMEA
  africa: { ietf: 'en', tk: 'pps7abe.css' },
  be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
  be_en: { ietf: 'en-BE', tk: 'pps7abe.css' },
  be_nl: { ietf: 'nl-BE', tk: 'cya6bri.css' },
  cy_en: { ietf: 'en-CY', tk: 'pps7abe.css' },
  dk: { ietf: 'da-DK', tk: 'aaz7dvd.css' },
  de: { ietf: 'de-DE', tk: 'vin7zsi.css' },
  ee: { ietf: 'et-EE', tk: 'aaz7dvd.css' },
  es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
  fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
  gr_en: { ietf: 'en-GR', tk: 'pps7abe.css' },
  ie: { ietf: 'en-GB', tk: 'pps7abe.css' },
  il_en: { ietf: 'en-IL', tk: 'pps7abe.css' },
  it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
  lv: { ietf: 'lv-LV', tk: 'aaz7dvd.css' },
  lt: { ietf: 'lt-LT', tk: 'aaz7dvd.css' },
  lu_de: { ietf: 'de-LU', tk: 'vin7zsi.css' },
  lu_en: { ietf: 'en-LU', tk: 'pps7abe.css' },
  lu_fr: { ietf: 'fr-LU', tk: 'vrk5vyv.css' },
  hu: { ietf: 'hu-HU', tk: 'aaz7dvd.css' },
  mt: { ietf: 'en-MT', tk: 'pps7abe.css' },
  mena_en: { ietf: 'en', tk: 'pps7abe.css' },
  nl: { ietf: 'nl-NL', tk: 'cya6bri.css' },
  no: { ietf: 'no-NO', tk: 'aaz7dvd.css' },
  pl: { ietf: 'pl-PL', tk: 'aaz7dvd.css' },
  pt: { ietf: 'pt-PT', tk: 'inq1xob.css' },
  ro: { ietf: 'ro-RO', tk: 'qxw8hzm.css' },
  sa_en: { ietf: 'en-SA', tk: 'pps7abe.css' },
  ch_de: { ietf: 'de-CH', tk: 'vin7zsi.css' },
  si: { ietf: 'sl-SI', tk: 'aaz7dvd.css' },
  sk: { ietf: 'sk-SK', tk: 'aaz7dvd.css' },
  ch_fr: { ietf: 'fr-CH', tk: 'vrk5vyv.css' },
  fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
  se: { ietf: 'sv-SE', tk: 'fpk1pcd.css' },
  ch_it: { ietf: 'it-CH', tk: 'bbf5pok.css' },
  tr: { ietf: 'tr-TR', tk: 'aaz7dvd.css' },
  ae_en: { ietf: 'ar-EN', tk: 'pps7abe.css', dir: 'ltr' },
  uk: { ietf: 'en-GB', tk: 'pps7abe.css' },
  at: { ietf: 'de-AT', tk: 'vin7zsi.css' },
  cz: { ietf: 'cs-CZ', tk: 'aaz7dvd.css' },
  bg: { ietf: 'bg-BG', tk: 'aaz7dvd.css' },
  ru: { ietf: 'ru-RU', tk: 'aaz7dvd.css' },
  ua: { ietf: 'uk-UA', tk: 'aaz7dvd.css' },
  il_he: { ietf: 'he', tk: 'nwq1mna.css', dir: 'rtl' },
  ae_ar: { ietf: 'ar-AE', tk: 'nwq1mna.css', dir: 'rtl' },
  mena_ar: { ietf: 'ar', tk: 'dis2dpj.css', dir: 'rtl' },
  sa_ar: { ietf: 'ar-SA', tk: 'nwq1mna.css', dir: 'rtl' },
  // Asia Pacific
  au: { ietf: 'en-AU', tk: 'pps7abe.css' },
  hk_en: { ietf: 'en-HK', tk: 'pps7abe.css' },
  in: { ietf: 'en-IN', tk: 'pps7abe.css' },
  id_id: { ietf: 'id-ID', tk: 'czc0mun.css' },
  id_en: { ietf: 'en-ID', tk: 'pps7abe.css' },
  my_ms: { ietf: 'ms-MY', tk: 'sxj4tvo.css' },
  my_en: { ietf: 'en-MY', tk: 'pps7abe.css' },
  nz: { ietf: 'en-NZ', tk: 'pps7abe.css' },
  ph_en: { ietf: 'en-PH', tk: 'pps7abe.css' },
  ph_fil: { ietf: 'tl-PH', tk: 'ict8rmp.css' },
  sg: { ietf: 'en-SG', tk: 'pps7abe.css' },
  th_en: { ietf: 'en-TH', tk: 'pps7abe.css' },
  in_hi: { ietf: 'hi-IN', tk: 'aaa8deh.css' },
  th_th: { ietf: 'th-TH', tk: 'aaz7dvd.css' },
  cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  hk_zh: { ietf: 'zh-HK', tk: 'jay0ecd' },
  tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
  jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
  kr: { ietf: 'ko-KR', tk: 'qjs5sfm' },
  // Langstore Support.
  langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
  // geo expansion MWPW-124903
  za: { ietf: 'en-ZA', tk: 'pps7abe.css' }, // South Africa (GB English)
  ng: { ietf: 'en-NG', tk: 'pps7abe.css' }, // Nigeria (GB English)
  cr: { ietf: 'es-CR', tk: 'oln4yqj.css' }, // Costa Rica (Spanish Latin America)
  ec: { ietf: 'es-EC', tk: 'oln4yqj.css' }, // Ecuador (Spanish Latin America)
  pr: { ietf: 'es-PR', tk: 'oln4yqj.css' }, // Puerto Rico (Spanish Latin America)
  gt: { ietf: 'es-GT', tk: 'oln4yqj.css' }, // Guatemala (Spanish Latin America)
  eg_ar: { ietf: 'ar-EG', tk: 'nwq1mna.css', dir: 'rtl' }, // Egypt (Arabic)
  kw_ar: { ietf: 'ar-KW', tk: 'nwq1mna.css', dir: 'rtl' }, // Kuwait (Arabic)
  qa_ar: { ietf: 'ar-QA', tk: 'nwq1mna.css', dir: 'rtl' }, // Quatar (Arabic)
  eg_en: { ietf: 'en-EG', tk: 'pps7abe.css' }, // Egypt (GB English)
  kw_en: { ietf: 'en-KW', tk: 'pps7abe.css' }, // Kuwait (GB English)
  qa_en: { ietf: 'en-QA', tk: 'pps7abe.css' }, // Qatar (GB English)
  gr_el: { ietf: 'el-GR', tk: 'fnx0rsr.css' }, // Greece (Greek)
  el: { ietf: 'el', tk: 'aaz7dvd.css' },
  vn_vi: { ietf: 'vi-VN', tk: 'jii8bki.css' },
  vn_en: { ietf: 'en-VN', tk: 'pps7abe.css' },
};

// Add any config options.
const CONFIG = {
  codeRoot: '/acrobat',
  contentRoot: '/dc-shared',
  imsClientId: 'acrobatmilo',
  commerce: { checkoutClientId: 'doc_cloud' },
  local: {
    edgeConfigId: 'e065836d-be57-47ef-b8d1-999e1657e8fd',
    pdfViewerClientId: 'ec572982b2a849d4b16c47d9558d66d1',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  page: {
    pdfViewerClientId: '332f83ea8edc489e9d1bd116affe3fe2', // client id for aem.page domain
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  stagePage: {
    pdfViewerClientId: '2522674a708e4ddf8bbd62e18585ae4b',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  stage: {
    edgeConfigId: 'e065836d-be57-47ef-b8d1-999e1657e8fd',
    marTechUrl: 'https://www.stage.adobe.com/marketingtech/d4d114c60e50/a0e989131fd5/launch-2c94beadc94f-development.min.js',
    pdfViewerClientId: '5bfb3a784f2642f88ecf9d2ff4cd573e',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  live: {
    pdfViewerClientId: '2ecc42a42bf24c6bb5dca41a25908a1f', // client id for aem.live domain
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  prod: {
    edgeConfigId: '913eac4d-900b-45e8-9ee7-306216765cd2',
    pdfViewerClientId: '8a1d0707bf0f45af8af9f3bead0d213e',
    pdfViewerReportSuite: 'adbadobenonacdcprod,adbadobedxprod,adbadobeprototype',
  },
  hlxPage: {
    pdfViewerClientId: 'a42d91c0e5ec46f982d2da0846d9f7d0',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  hlxLive: {
    edgeConfigId: 'e065836d-be57-47ef-b8d1-999e1657e8fd',
    pdfViewerClientId: '18e9175fc6754b9892d315cae9f346f1',
    pdfViewerReportSuite: 'adbadobedxqa',
  },
  locales,
  // geoRouting: 'on',
  prodDomains: ['www.adobe.com', 'business.adobe.com', 'helpx.adobe.com'],
  stageDomainsMap: {
    '--dc--adobecom.hlx.page': {
      'www.adobe.com': 'www.stage.adobe.com',
      'business.adobe.com': 'business.adobe.com',
      'blog.adobe.com': 'blog.adobe.com',
      'developer.adobe.com': 'developer.adobe.com',
      'firefly.adobe.com': 'firefly.adobe.com',
      'helpx.adobe.com': 'helpx.adobe.com',
      'milo.adobe.com': 'milo.adobe.com',
      'news.adobe.com': 'news.adobe.com',
    },
    '--dc--adobecom.hlx.live': {
      'www.adobe.com': 'www.adobe.com',
      'business.adobe.com': 'business.adobe.com',
      'blog.adobe.com': 'blog.adobe.com',
      'developer.adobe.com': 'developer.adobe.com',
      'firefly.adobe.com': 'firefly.adobe.com',
      'helpx.adobe.com': 'helpx.adobe.com',
      'milo.adobe.com': 'milo.adobe.com',
      'news.adobe.com': 'news.adobe.com',
    },
    'www.stage.adobe.com': {
      'www.adobe.com': 'origin',
      'business.adobe.com': 'business.stage.adobe.com',
      'blog.adobe.com': 'blog.stage.adobe.com',
      'developer.adobe.com': 'developer-stage.adobe.com',
      'firefly.adobe.com': 'firefly-stage.corp.adobe.com',
      'helpx.adobe.com': 'helpx.stage.adobe.com',
      'milo.adobe.com': 'milo-stage.corp.adobe.com',
      'news.adobe.com': 'news.stage.adobe.com',
    },
  },
  jarvis: {
    id: 'DocumentCloudWeb1',
    version: '1.0',
    onDemand: false,
  },
  htmlExclude: [
    /www\.adobe\.com\/(\w\w(_\w\w)?\/)?express(\/.*)?/,
    /www\.adobe\.com\/(\w\w(_\w\w)?\/)?go(\/.*)?/,
    /www\.adobe\.com\/(\w\w(_\w\w)?\/)?learn(\/.*)?/,
  ],
  imsScope: 'AdobeID,openid,gnav,pps.read,firefly_api,additional_info.roles,read_organizations,account_cluster.read',
};

const IMS_GUEST = document.querySelector('meta[name="ims-guest"]')?.content;

if (IMS_GUEST) {
  const CLIENT_ID = document.querySelector('meta[name="ims-cid"]')?.content;

  CONFIG.adobeid = {
    client_id: CLIENT_ID,
    scope: 'AdobeID,openid,gnav,additional_info.roles,read_organizations,pps.read,account_cluster.read,DCAPI',

    enableGuestAccounts: true,
    enableGuestTokenForceRefresh: true,

    api_parameters: { check_token: { guest_allowed: true } },

    onAccessToken: (accessToken) => {
      window.dc_hosted?.ims_callbacks?.onAccessToken?.(accessToken);
    },
    onReauthAccessToken: (reauthTokenInformation) => {
      window.dc_hosted?.ims_callbacks?.onReauthAccessToken?.(reauthTokenInformation);
    },
    onAccessTokenHasExpired: () => {
      window.dc_hosted?.ims_callbacks?.onAccessTokenHasExpired?.();
    },
  };
}


const miloLibs = setLibs(LIBS);
const unityLibs = getUnityLibs();
// Import base milo features and run them
const { loadArea, setConfig, loadLana, getMetadata, loadIms } = await import(`${miloLibs}/utils/utils.js`);
// addLocale(ietf);
setConfig({ ...CONFIG, miloLibs });
// const { default: init } = await import('https://artm--milo--amitbikram.hlx.live/libs/blocks/global-navigation/global-navigation.js')
// const header = document.querySelector('header')
// init(header);

loadIms().then(() => {
  const imsIsReady = new CustomEvent('IMS:Ready');
  window.dispatchEvent(imsIsReady);
}).catch((err) => {
  window.dispatchEvent(new CustomEvent('DC_Hosted:Error', { detail: { wrappedException: err } }));
});

const unityEl = document.querySelector('.unity');
if(unityEl) {
    const { default: unityInit } = await import('https://www.adobe.com/acrobat/blocks/unity/unity.js')
    unityInit(unityEl);
}

const verbEl = document.querySelector('.verb-widget');
if(verbEl) {
  verbEl.addEventListener('click', (e) => {
    verbEl.querySelector('#file-upload').click();
  });
}

const navItem = document.querySelectorAll('.feds-navLink[aria-haspopup="true"]');
    for (var i = 0; i < navItem.length; i++) {
      navItem[i].addEventListener('click', (event) => {
        const isOpen = event.currentTarget.getAttribute('aria-expanded');
        navItem.forEach(el => {
          el.setAttribute('aria-expanded', 'false');
        });
        event.currentTarget.setAttribute('aria-expanded', isOpen == 'false' ? 'true' : 'false');
    }, false);
  }
  document.addEventListener('click', (event) => {
      const openElemSelector = '.global-navigation [aria-expanded="true"]';
      const isClickedElemOpen = [...document.querySelectorAll(openElemSelector)]
      .find((openItem) => openItem.parentElement.contains(event.target));
      if (!isClickedElemOpen) {
          navItem.forEach(el => el.setAttribute('aria-expanded', 'false'));
      }
  });
  const hamburger = document.querySelector('.feds-toggle');
  hamburger.addEventListener('click', (event) => {
    const navWrapper = document.getElementById('feds-nav-wrapper');
    if (navWrapper.matches('.feds-nav-wrapper--expanded')) {
      navWrapper.classList.remove('feds-nav-wrapper--expanded');
    } else {
      navWrapper.classList.add('feds-nav-wrapper--expanded');
    }
  });

  await import ('https://artm--milo--amitbikram.hlx.live/artemis/tools/dist/hydration/loader.js');

const arr = document.querySelectorAll('.caas');
if(arr.length > 0) {
    const { default: caasInit } = await import(`${miloLibs}/blocks/caas/caas.js`);
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', `${miloLibs}/blocks/caas/caas.css`);
    document.head.append(link);
    arr.forEach(function(elem){
        caasInit(elem)
    });
}
