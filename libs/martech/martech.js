/* eslint-disable no-underscore-dangle */
import { getConfig, getMetadata, loadIms, loadLink, loadScript } from '../utils/utils.js';

const ALLOY_SEND_EVENT = 'alloy_sendEvent';
const ALLOY_SEND_EVENT_ERROR = 'alloy_sendEvent_error';
const TARGET_TIMEOUT_MS = 4000;
const ENTITLEMENT_TIMEOUT = 3000;

const setDeep = (obj, path, value) => {
  const pathArr = path.split('.');
  let currentObj = obj;

  for (const key of pathArr.slice(0, -1)) {
    if (!currentObj[key] || typeof currentObj[key] !== 'object') {
      currentObj[key] = {};
    }
    currentObj = currentObj[key];
  }

  currentObj[pathArr[pathArr.length - 1]] = value;
};

// eslint-disable-next-line max-len
const waitForEventOrTimeout = (eventName, timeout, returnValIfTimeout) => new Promise((resolve) => {
  const listener = (event) => {
    // eslint-disable-next-line no-use-before-define
    clearTimeout(timer);
    resolve(event.detail);
  };

  const errorListener = () => {
    // eslint-disable-next-line no-use-before-define
    clearTimeout(timer);
    resolve({ error: true });
  };

  const timer = setTimeout(() => {
    window.removeEventListener(eventName, listener);
    if (returnValIfTimeout !== undefined) {
      resolve(returnValIfTimeout);
    } else {
      resolve({ timeout: true });
    }
  }, timeout);

  window.addEventListener(eventName, listener, { once: true });
  window.addEventListener(ALLOY_SEND_EVENT_ERROR, errorListener, { once: true });
});

const getExpFromParam = (expParam) => {
  const lastSlash = expParam.lastIndexOf('/');
  return {
    experiments: [{
      experimentPath: expParam.substring(0, lastSlash),
      variantLabel: expParam.substring(lastSlash + 1),
    }],
  };
};

const handleAlloyResponse = (response) => {
  const items = (
    (response.propositions?.length && response.propositions)
    || (response.decisions?.length && response.decisions)
    || []
  ).map((i) => i.items).flat();

  if (!items?.length) return [];

  return items
    .map((item) => {
      const content = item?.data?.content;
      if (!content || !(content.manifestLocation || content.manifestContent)) return null;

      return {
        manifestPath: content.manifestLocation || content.manifestPath,
        manifestUrl: content.manifestLocation,
        manifestData: content.manifestContent?.experiences?.data || content.manifestContent?.data,
        manifestPlaceholders: content.manifestContent?.placeholders?.data,
        manifestInfo: content.manifestContent?.info.data,
        name: item.meta['activity.name'],
        variantLabel: item.meta['experience.name'] && `target-${item.meta['experience.name']}`,
        meta: item.meta,
      };
    })
    .filter(Boolean);
};

function roundToQuarter(num) {
  return Math.ceil(num / 250) / 4;
}

function calculateResponseTime(responseStart) {
  const responseTime = Date.now() - responseStart;
  return roundToQuarter(responseTime);
}

function sendTargetResponseAnalytics(failure, responseStart, timeout, message) {
  // temporary solution until we can decide on a better timeout value
  const responseTime = calculateResponseTime(responseStart);
  const timeoutTime = roundToQuarter(timeout);
  let val = `target response time ${responseTime}:timed out ${failure}:timeout ${timeoutTime}`;
  if (message) val += `:${message}`;
  window.alloy('sendEvent', {
    documentUnloading: true,
    xdm: {
      eventType: 'web.webinteraction.linkClicks',
      web: {
        webInteraction: {
          linkClicks: { value: 1 },
          type: 'other',
          name: val,
        },
      },
    },
    data: { _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName: val } } } } },
  });
}

const getTargetPersonalization = async () => {
  const params = new URL(window.location.href).searchParams;

  const experimentParam = params.get('experiment');
  if (experimentParam) return getExpFromParam(experimentParam);

  const timeout = parseInt(params.get('target-timeout'), 10)
    || parseInt(getMetadata('target-timeout'), 10)
    || TARGET_TIMEOUT_MS;

  const responseStart = Date.now();
  window.addEventListener(ALLOY_SEND_EVENT, () => {
    const responseTime = calculateResponseTime(responseStart);
    window.lana.log(`target response time: ${responseTime}`, { tags: 'errorType=info,module=martech' });
  }, { once: true });

  let manifests = [];
  let propositions = [];
  const response = await waitForEventOrTimeout(ALLOY_SEND_EVENT, timeout);
  if (response.error) {
    window.lana.log('target response time: ad blocker', { tags: 'errorType=info,module=martech' });
    return [];
  }
  if (response.timeout) {
    waitForEventOrTimeout(ALLOY_SEND_EVENT, 5100 - timeout)
      .then(() => sendTargetResponseAnalytics(true, responseStart, timeout));
  } else {
    sendTargetResponseAnalytics(false, responseStart, timeout);
    manifests = handleAlloyResponse(response.result);
    propositions = response.result?.propositions || [];
  }

  return {
    targetManifests: manifests,
    targetPropositions: propositions,
  };
};

const getDtmLib = (env) => ({
  edgeConfigId: env.consumer?.edgeConfigId || env.edgeConfigId,
  url:
    env.name === 'prod'
      ? env.consumer?.marTechUrl || 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-5dd5dd2177e6.min.js'
      : env.consumer?.marTechUrl || 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-a27b33fc2dc0-development.min.js',
});

const setupEntitlementCallback = () => {
  const setEntitlements = async (destinations) => {
    const { default: parseEntitlements } = await import('../features/personalization/entitlements.js');
    return parseEntitlements(destinations);
  };

  const getEntitlements = (resolve) => {
    const handleEntitlements = (detail) => {
      if (detail?.result?.destinations?.length) {
        resolve(setEntitlements(detail.result.destinations));
      } else {
        resolve([]);
      }
    };
    waitForEventOrTimeout(ALLOY_SEND_EVENT, ENTITLEMENT_TIMEOUT, [])
      .then(handleEntitlements)
      .catch(() => resolve([]));
  };

  const { miloLibs, codeRoot, entitlements: resolveEnt } = getConfig();
  getEntitlements(resolveEnt);

  loadLink(
    `${miloLibs || codeRoot}/features/personalization/entitlements.js`,
    { as: 'script', rel: 'modulepreload' },
  );
};

let filesLoadedPromise = false;
const loadMartechFiles = async (config, url, edgeConfigId) => {
  if (filesLoadedPromise) return filesLoadedPromise;

  filesLoadedPromise = async () => {
    loadIms()
      .then(() => {
        if (window.adobeIMS.isSignedInUser()) setupEntitlementCallback();
      })
      .catch(() => {});

    setDeep(
      window,
      'alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.language',
      config.locale.ietf,
    );
    setDeep(window, 'digitalData.diagnostic.franklin.implementation', 'milo');

    window.marketingtech = {
      adobe: {
        launch: { url, controlPageLoad: true },
        alloy: { edgeConfigId },
        target: false,
      },
      milo: true,
    };
    window.edgeConfigId = edgeConfigId;

    const env = ['stage', 'local'].includes(config.env.name) ? '.qa' : '';
    const martechPath = `martech.main.standard${env}.min.js`;
    await loadScript(`${config.miloLibs || config.codeRoot}/deps/${martechPath}`);
    window._satellite.track('pageload');
  };

  await filesLoadedPromise();
  return filesLoadedPromise;
};

export default async function init({
  persEnabled = false,
  persManifests = [],
  postLCP = false,
}) {
  const config = getConfig();

  const { url, edgeConfigId } = getDtmLib(config.env);
  loadLink(url, { as: 'script', rel: 'preload' });

  const martechPromise = loadMartechFiles(config, url, edgeConfigId);

  if (persEnabled) {
    loadLink(
      `${config.miloLibs || config.codeRoot}/features/personalization/personalization.js`,
      { as: 'script', rel: 'modulepreload' },
    );

    const { targetManifests, targetPropositions } = await getTargetPersonalization();
    if (targetManifests?.length || persManifests?.length) {
      const { preloadManifests, applyPers } = await import('../features/personalization/personalization.js');
      const manifests = preloadManifests({ targetManifests, persManifests });
      await applyPers(manifests, postLCP);
      if (targetPropositions?.length && window._satellite) {
        window._satellite.track('propositionDisplay', targetPropositions);
      }
    }
  }

  return martechPromise;
}
