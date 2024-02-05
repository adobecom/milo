import { getConfig, loadIms, loadLink, loadScript } from '../utils/utils.js';

const ALLOY_SEND_EVENT = 'alloy_sendEvent';
const TARGET_TIMEOUT_MS = 2000;
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

const waitForEventOrTimeout = (eventName, timeout, timeoutVal) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    if (timeoutVal !== undefined) {
      resolve(timeoutVal);
    } else {
      reject(new Error(`Timeout waiting for ${eventName} after ${timeout}ms`));
    }
  }, timeout);

  window.addEventListener(eventName, (event) => {
    clearTimeout(timer);
    resolve(event.detail);
  }, { once: true });
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
      if (!content) return null;

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

const getTargetPersonalization = async () => {
  const params = new URL(window.location.href).searchParams;

  const experimentParam = params.get('experiment');
  if (experimentParam) return getExpFromParam(experimentParam);

  const timeout = parseInt(params.get('target-timeout'), 10) || TARGET_TIMEOUT_MS;

  let response;
  try {
    response = await waitForEventOrTimeout(ALLOY_SEND_EVENT, timeout);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  let manifests = [];
  if (response) {
    manifests = handleAlloyResponse(response.result);
  }

  return manifests;
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
    // eslint-disable-next-line no-underscore-dangle
    window._satellite.track('pageload');
  };

  await filesLoadedPromise();
  return filesLoadedPromise;
};

export default async function init({ persEnabled = false, persManifests = [] }) {
  const config = getConfig();

  const { url, edgeConfigId } = getDtmLib(config.env);
  loadLink(url, { as: 'script', rel: 'preload' });

  const martechPromise = loadMartechFiles(config, url, edgeConfigId);

  if (persEnabled) {
    loadLink(
      `${config.miloLibs || config.codeRoot}/features/personalization/personalization.js`,
      { as: 'script', rel: 'modulepreload' },
    );

    const targetManifests = await getTargetPersonalization();
    if (targetManifests?.length || persManifests?.length) {
      const { preloadManifests, applyPers } = await import('../features/personalization/personalization.js');
      const manifests = preloadManifests({ targetManifests, persManifests });
      await applyPers(manifests);
    }
  }

  return martechPromise;
}
