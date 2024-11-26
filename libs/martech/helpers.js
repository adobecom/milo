const TARGET_TIMEOUT_MS = 4000;
const params = new URL(window.location.href).searchParams;
export const timeout = parseInt(params.get('target-timeout'), 10)
    || parseInt(getMetadata('target-timeout'), 10)
    || TARGET_TIMEOUT_MS;

export function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export function getEnv(conf) {
  const PAGE_URL = new URL(window.location.href);
  const SLD = PAGE_URL.hostname.includes('.aem.') ? 'aem' : 'hlx';
  const ENVS = {
    stage: {
      name: 'stage',
      ims: 'stg1',
      adobeIO: 'cc-collab-stage.adobe.io',
      adminconsole: 'stage.adminconsole.adobe.com',
      account: 'stage.account.adobe.com',
      edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
      pdfViewerClientId: '600a4521c23d4c7eb9c7b039bee534a0',
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
    || host.includes('graybox.adobe')) {
    return { ...ENVS.stage, consumer: conf.stage };
  }
  return { ...ENVS.prod, consumer: conf.prod };
  /* c8 ignore stop */
}

/**
 * Generates a unique UUID based on timestamp and random values.
 * Follows the UUIDv4 pattern.
 * 
 * @returns {string} A UUID string in the format 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
 */
export function generateUUID() {
  let timestamp = new Date().getTime(); // Timestamp
  let microseconds = (typeof performance !== 'undefined' && performance.now)
    ? performance.now() * 1000
    : 0; // Microseconds since page load or 0 if unsupported

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let randomVal = Math.random() * 16;

    if (timestamp > 0) { // Use timestamp until depleted
      randomVal = (timestamp + randomVal) % 16 | 0;
      timestamp = Math.floor(timestamp / 16);
    } else { // Use microseconds since page-load if supported
      randomVal = (microseconds + randomVal) % 16 | 0;
      microseconds = Math.floor(microseconds / 16);
    }

    return (c === 'x' ? randomVal : (randomVal & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Determines the Adobe Target property value based on the page's region.
 * 
 * @returns {string} Adobe Target property value.
 */
function getTargetPropertyBasedOnPageRegion() {
  const { pathname } = window.location;
  const env = getEnv({})?.name;

  if (env !== 'prod') return 'bc8dfa27-29cc-625c-22ea-f7ccebfc6231'; // Default for non-prod environments

  //EMEA & LATAM
  if (
    pathname.search(
      /(\/africa\/|\/be_en\/|\/be_fr\/|\/be_nl\/|\/cis_en\/|\/cy_en\/|\/dk\/|\/de\/|\/ee\/|\/es\/|\/fr\/|\/gr_en\/|\/ie\/|\/il_en\/|\/it\/|\/lv\/|\/lu_de\/|\/lu_en\/|\/lu_fr\/|\/hu\/|\/mt\/|\/mena_en\/|\/nl\/|\/no\/|\/pl\/|\/pt\/|\/ro\/|\/ch_de\/|\/si\/|\/sk\/|\/ch_fr\/|\/fi\/|\/se\/|\/ch_it\/|\/tr\/|\/uk\/|\/at\/|\/cz\/|\/bg\/|\/ru\/|\/cis_ru\/|\/ua\/|\/il_he\/|\/mena_ar\/|\/lt\/|\/sa_en\/|\/ae_en\/|\/ae_ar\/|\/sa_ar\/|\/ng\/|\/za\/|\/qa_ar\/|\/eg_en\/|\/eg_ar\/|\/kw_ar\/|\/eg_ar\/|\/qa_en\/|\/kw_en\/|\/gr_el\/|\/br\/|\/cl\/|\/la\/|\/mx\/|\/co\/|\/ar\/|\/pe\/|\/gt\/|\/pr\/|\/ec\/|\/cr\/)/
    ) !== -1
  ) {
    return "488edf5f-3cbe-f410-0953-8c0c5c323772";
  }
  else if (  //APAC
    pathname.search(
      /(\/au\/|\/hk_en\/|\/in\/|\/nz\/|\/sea\/|\/cn\/|\/hk_zh\/|\/tw\/|\/kr\/|\/sg\/|\/th_en\/|\/th_th\/|\/my_en\/|\/my_ms\/|\/ph_en\/|\/ph_fil\/|\/vn_en\/|\/vn_vi\/|\/in_hi\/|\/id_id\/|\/id_en\/)/
    ) !== -1
  ) {
    return "3de509ee-bbc7-58a3-0851-600d1c2e2918";
  }
  //JP
  else if (pathname.indexOf("/jp/") !== -1) {
    return "ba5bc9e8-8fb4-037a-12c8-682384720007";
  }

  return 'bc8dfa27-29cc-625c-22ea-f7ccebfc6231'; // Default
}

/**
 * Retrieves device-related information such as screen and viewport dimensions.
 * 
 * @returns {Object} Object containing device and viewport information.
 */
function getDeviceInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    screenOrientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

/**
   * Retrieves the value of a specific cookie by its key.
   * 
   * @param {string} key - The cookie key.
   * @returns {string|null} The cookie value or null if the cookie doesn't exist.
   */
function getCookie(key) {
  const cookie = document.cookie.split(';')
    .map(x => x.trim().split('='))
    .find(([k]) => k === key);
  return cookie ? cookie[1] : null;
}

/**
 * Sets a cookie with a specified expiration time (default 730 days).
 * 
 * @param {string} key - The cookie key.
 * @param {string} value - The cookie value.
 * @param {Object} [options={}] - Optional settings for cookie properties.
 */
function setCookie(key, value, options = {}) {
  // Default expiration (24 months)
  const expires = options.expires || 730;
  const date = new Date();
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
  const expiresString = `expires=${date.toUTCString()}`;

  document.cookie = `${key}=${value}; ${expiresString}; path=/`;
}

/**
 * Checks for the presence of the FPID cookie, or generates and sets a new one.
 * 
 * @returns {string} The FPID cookie value.
 */
function getOrCreateFPIDCookie() {
  let fpidCookie = getCookie('FPID');
  if (!fpidCookie) {
    fpidCookie = generateUUID();
    setCookie('FPID', fpidCookie);
  }
  return fpidCookie;
}

/**
 * Retrieves the page name for analytics, modified for the current locale.
 * 
 * @param {Object} params - The parameters.
 * @param {string} params.locale - The locale object containing prefix info.
 * @returns {string} The modified page name.
 */
function getPageNameForAnalytics({ locale }) {
  const { host, pathname } = new URL(window.location.href);
  const [modifiedPath] = pathname.split('/').filter(x => x !== locale.prefix).join(':').split('.');
  return host.replace('www.', '') + ':' + modifiedPath;
}

/**
 * Creates the updated context for the request payload.
 * 
 * @param {number} screenWidth - Screen width.
 * @param {number} screenHeight - Screen height.
 * @param {string} screenOrientation - Orientation of the screen.
 * @param {number} viewportWidth - Viewport width.
 * @param {number} viewportHeight - Viewport height.
 * @param {string} localTime - The local time in ISO format.
 * @param {number} timezoneOffset - The timezone offset.
 * @returns {Object} The updated context for the request payload.
 */
function getUpdatedContext({
  screenWidth, screenHeight, screenOrientation, viewportWidth, viewportHeight, localTime, timezoneOffset
}) {
  return {
    device: {
      screenHeight,
      screenWidth,
      screenOrientation,
    },
    environment: {
      type: "browser",
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

/**
   * Retrieves specific MarTech cookies by their keys.
   * 
   * @returns {Array} List of MarTech cookies with key and value.
   */
const getMarctechCookies = () => {
  const KNDCTR_COOKIE_KEYS = [
    'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_identity',
    'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_cluster',
  ];
  return document.cookie.split(';')
    .map(x => x.trim().split('='))
    .filter(([key]) => KNDCTR_COOKIE_KEYS.includes(key))
    .map(([key, value]) => ({ key, value }));
};

/**
 * Creates the request payload for Adobe Analytics and Target.
 * 
 * @param {Object} params - Parameters required to create the payload.
 * @returns {Object} The request payload.
 */
function createRequestPayload({ updatedContext, fpidCookie, pageName, locale, env }) {
  const prevPageName = getCookie('gpv');

  const REPORT_SUITES_ID = env === 'prod' ? ['adbadobenonacdcprod'] : ['adbadobenonacdcqa'];
  let AT_PROPERTY_VAL = getTargetPropertyBasedOnPageRegion();

  return {
    event: {
      xdm: {
        ...updatedContext,
        identityMap: {
          FPID: [{
            id: fpidCookie,
            authenticatedState: "ambiguous",
            primary: true,
          }],
        },
        web: {
          webPageDetails: {
            URL: window.location.href,
            siteSection: "www.adobe.com",
            server: "www.adobe.com",
            isErrorPage: false,
            isHomePage: false,
            name: pageName,
            pageViews: { value: 0 },
          },
          webInteraction: {
            name: "Martech-API",
            type: "other",
            linkClicks: { value: 1 },
          },
          webReferrer: { URL: document.referrer },
        },
        timestamp: new Date().toISOString(),
        eventType: "decisioning.propositionFetch",
      },
      data: {
        _adobe_corpnew: {
          marketingtech: { adobe: { alloy: { approach: "martech-API" } } },
          __adobe: {
            target: { is404: false, authState: "loggedOut", hitType: "propositionFetch", isMilo: true },
          },
          digitalData: {
            page: { pageInfo: { language: locale.ietf } },
            diagnostic: { franklin: { implementation: "milo" } },
            previousPage: { pageInfo: { pageName: prevPageName } },
            primaryUser: { primaryProfile: { profileInfo: { authState: "loggedOut", returningStatus: "Repeat" } } },
          },
        },
      },
    },
    query: {
      identity: { fetch: ["ECID"] },
      personalization: {
        schemas: [
          "https://ns.adobe.com/personalization/default-content-item",
          "https://ns.adobe.com/personalization/html-content-item",
          "https://ns.adobe.com/personalization/json-content-item",
          "https://ns.adobe.com/personalization/redirect-item",
          "https://ns.adobe.com/personalization/dom-action",
        ],
        decisionScopes: ["__view__"],
      },
    },
    meta: {
      configOverrides: { com_adobe_analytics: { reportSuites: REPORT_SUITES_ID }, com_adobe_target: { propertyToken: AT_PROPERTY_VAL } },
      state: {
        domain: "localhost",
        cookiesEnabled: true,
        entries: getMarctechCookies(),
      },
    },
  };
}

/**
 * Extracts the ECID (Experience Cloud ID) from the API response.
 * 
 * @param {Object} data - The response data from the API.
 * @returns {string|null} The ECID value, or null if not found.
 */
function extractECID(data) {
  return data.handle
    .flatMap(item => item.payload)
    .find(p => p.namespace?.code === "ECID")?.id || null;
}

/**
 * Updates the AMCV cookie with the new ECID.
 * 
 * @param {string} ECID - The Experience Cloud ID (ECID).
 */
function updateAMCVCookie(ECID) {
  const cookieName = 'AMCV_9E1005A551ED61CA0A490D45%40AdobeOrg';
  const cookieValue = `MCMID|${ECID}`;

  if (getCookie(cookieName) !== cookieValue) {
    setCookie(cookieName, `MCMID|${ECID}`);
  }
}



/**
 * Loads analytics and interaction data based on the user and page context.
 * Sends the data to Adobe Analytics and Adobe Target for personalization.
 * 
 * This function gathers data such as device details, user authentication state, and page information.
 * It sends the data to Adobe's marketing solutions to enable personalized content and tracking.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} params.locale - The locale object containing language/region info.
 * 
 * @returns {Promise<Object>} A promise that resolves to the personalization propositions fetched from Adobe Target.
 */
export async function loadAnalyticsAndInteractionData({ locale}) {
  const env = getEnv({})?.name;  // Get the current environment (prod, dev, etc.)

  // Define constants based on environment
  const DATA_STREAM_ID = env === 'prod' ? '5856abb0-95d8-4f9a-bb92-37f99d2bd492' : '87f9b644-5fd3-4015-81d5-f68ad81c3561';
  const TARGET_API_URL = 'https://edge.adobedc.net/ee/v2/interact';

  // Device and viewport information
  const { screenWidth, screenHeight, screenOrientation, viewportWidth, viewportHeight } = getDeviceInfo();

  // Date and Time Constants
  const CURRENT_DATE = new Date();
  const LOCAL_TIME = CURRENT_DATE.toISOString();
  const LOCAL_TIMEZONE_OFFSET = CURRENT_DATE.getTimezoneOffset();

  const fpidCookie = getOrCreateFPIDCookie();
  const pageName = getPageNameForAnalytics({ locale });

  const updatedContext = getUpdatedContext({
    screenWidth, screenHeight, screenOrientation, viewportWidth, viewportHeight, LOCAL_TIME, LOCAL_TIMEZONE_OFFSET
  });

  // Prepare the body for the request
  const requestBody = createRequestPayload({
    updatedContext,
    fpidCookie,
    pageName,
    locale,
    env,
  });

  try {
    const targetResp = await Promise.race([
      fetch(`${TARGET_API_URL}?dataStreamId=${DATA_STREAM_ID}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);

    if(!targetResp.ok){
      throw new Error('Failed to fetch interact call');
    }
    const targetRespJson = await targetResp.json();
    const ECID = extractECID(targetRespJson);

    // Update the AMCV cookie with ECID
    updateAMCVCookie(ECID);

    // Resolve or reject based on propositions
    const resultPayload = targetRespJson?.handle?.find(d => d.type === 'personalization:decisions')?.payload;

    return new Promise((resolve, reject) => {
      if (resultPayload.length > 0) {
        resolve({
          type: 'propositionFetch',
          result: {
            propositions: resultPayload,
          },
        });
      } else {
        reject('No propositions found');
      }
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Checks if the user is signed out based on the server timing and navigation performance.
 * 
 * @returns {boolean} True if the user is signed out, otherwise false.
 */
export function isSignedOut() {
  let w = window, perf = w.performance, serverTiming = {};

  if (perf && perf.getEntriesByType) {
    serverTiming = Object.fromEntries(
      perf.getEntriesByType("navigation")?.[0]?.serverTiming?.map?.(
        ({ name, description }) => ([name, description])
      ) ?? []
    );
  }

  const isSignedOutOnStagingOrProd = serverTiming && serverTiming.sis === '0';

  // Return true if it's a dev environment or signed out on staging/prod
  return !Object.keys(serverTiming || {}).length || isSignedOutOnStagingOrProd;
}

/**
 * Enables personalization (V2) for the page.
 * 
 * @returns {boolean} True if personalization is enabled, otherwise false.
 */
export function enablePersonalizationV2() {
  const enablePersV2 = document.head.querySelector(`meta[name="personalization-v2"]`);
  return enablePersV2 && isSignedOut();
}
