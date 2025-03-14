/* eslint-disable no-underscore-dangle */
const AMCV_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
const KNDCTR_COOKIE_KEYS = [
  'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_identity',
  'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_cluster',
];

const KNDCTR_CONSENT_COOKIE = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent';
const OPT_ON_AND_CONSENT_COOKIE = 'OptanonConsent';

const DATA_STREAM_IDS_PROD = { default: '913eac4d-900b-45e8-9ee7-306216765cd2', business: '0fd7a243-507d-4035-9c75-e42e42f866a0' };
const DATA_STREAM_IDS_STAGE = { default: 'e065836d-be57-47ef-b8d1-999e1657e8fd', business: '2eedf777-b932-4f2a-a0c5-b559788929bf' };

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
  const consentCookieValue = getCookie('OptanonConsent');

  if (consentCookieValue?.includes('C0002:1') && isAdobeDomain) {
    const updatedVisitAttempt = secondVisitAttempt === 0 ? 1 : secondVisitAttempt + 1;
    localStorage.setItem('secondHit', updatedVisitAttempt);
    return updatedVisitAttempt;
  }

  return secondVisitAttempt;
}

function getPageNameForAnalytics({ locale }) {
  const { host, pathname } = new URL(window.location.href);
  const [modifiedPath] = pathname.split('/').filter((x) => x !== locale.prefix).join(':').split('.');
  return `${host.replace('www.', '')}:${modifiedPath}`;
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

function isFirstVisit() {
  const identityCookie = getCookie(KNDCTR_COOKIE_KEYS[0]);
  if (!identityCookie) {
    window.marketingtech = window.marketingtech || {};
    window.marketingtech.isFirstVisit = true;
    return true;
  }
  return false;
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

  const eventMergeId = generateUUIDv4();

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
      eventMergeId,
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
      eventMergeId,
      _adobe_corpnew: {
        configuration: { edgeConfigId: dataStreamId },
        digitalData: {
          page: { pageInfo: { language: getLanguageCode(locale) } },
          diagnostic: { franklin: { implementation: 'milo' } },
          previousPage: { pageInfo: { pageName: prevPageName } },
          primaryUser: { primaryProfile: { profileInfo: { authState: 'loggedOut', returningStatus: getVisitorStatus({}) } } },
        },
        otherConsents: { configuration: { advertising: (!!consentCookie?.includes('C0004:1')).toString() } },
        user: { firstVisit: isFirstVisit() },
        cmp: { state: consentState },
        web: {
          location: {
            href: window.location.href,
            origin: window.location.origin,
            protocol: window.location.protocol,
            host: window.location.host,
            hostname: window.location.hostname,
            port: window.location.port,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
          },
        },
      },
      marketingtech: {
        adobe: {
          alloy: {
            approach: 'martech-API',
            edgeConfigIdLaunch: dataStreamId,
            edgeConfigId: dataStreamId,
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
        libraryVersions: 'alloy-api',
        experienceCloud: { secondVisits: 'setEvent' },
      };
    }
    xdm.implementationDetails = {
      name: 'https://ns.adobe.com/experience/alloy',
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
  const { hostname } = window.location;
  if (hostname.includes('business.adobe')) {
    dataStreamId = DATA_STREAM_IDS_PROD.business;
  } else if (
    hostname.includes('business.stage.adobe')
    || hostname.includes('bacom--adobecom.hlx')
    || hostname.includes('bacom--adobecom.aem')
  ) {
    dataStreamId = DATA_STREAM_IDS_STAGE.business;
  } else {
    dataStreamId = env === 'prod' ? DATA_STREAM_IDS_PROD.default : DATA_STREAM_IDS_STAGE.default;
  }
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
    const padStart = (string, targetLength, padString) => (`${string}`).padStart(targetLength, padString);
    const YYYY = date.getFullYear();
    const MM = padStart(date.getMonth() + 1, 2, '0');
    const DD = padStart(date.getDate(), 2, '0');
    const hh = padStart(date.getHours(), 2, '0');
    const mm = padStart(date.getMinutes(), 2, '0');
    const ss = padStart(date.getSeconds(), 2, '0');
    const mmm = padStart(date.getMilliseconds(), 3, '0');
    const timezoneOffset = Number(date.getTimezoneOffset()) || 0;
    const ts = timezoneOffset > 0 ? '-' : '+';
    const th = padStart(Math.floor(Math.abs(timezoneOffset) / 60), 2, '0');
    const tm = padStart(Math.abs(timezoneOffset) % 60, 2, '0');
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}.${mmm}${ts}${th}:${tm}`;
  };
  const localTime = getLocalISOString();
  const CURRENT_DATE = new Date();
  const localTime = CURRENT_DATE.toISOString();
  const timezoneOffset = CURRENT_DATE.getTimezoneOffset();
  if (hybridPersEnabled) {
    window.hybridPers = true;
  }
  const hitType = hybridPersEnabled ? 'pageView' : 'propositionFetch';
  const pageName = getPageNameForAnalytics({ locale });
  const updatedContext = getUpdatedContext({ ...getDeviceInfo(), localTime, timezoneOffset });
  const requestUrl = createRequestUrl({
    env,
    hitType,
  });
  const requestPayload = { updatedContext, pageName, locale, env, hitType };
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
