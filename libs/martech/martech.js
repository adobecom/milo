/* global _satellite */

const EXPERIMENT_TIMEOUT_MS = 3000;

let utils;

const setDeep = (obj, path, value) => {
  const pathArr = path.split('.');
  pathArr.reduce((a, b, level) => {
    if (typeof a[b] === 'undefined' && level !== pathArr.length - 1) {
      a[b] = {};
      return a[b];
    }

    if (level === pathArr.length - 1) {
      a[b] = value;
      return value;
    }
    return a[b];
  }, obj);
};

const handleAlloyResponse = (response) => {
  const items = ((response.propositions?.length && response.propositions)
    || (response.decisions?.length && response.decisions)
    || []).map((i) => i.items).flat();

  if (!items?.length) return [];

  return items
    .map((item) => {
      const content = item?.data?.content;
      if (!content) return null;

      return {
        manifestPath: content.manifestLocation || content.manifestPath,
        manifestData: content.manifestContent?.data,
        experimentName: item.meta['activity.name'],
        variantLabel: item.meta['experience.name'] && `target-${item.meta['experience.name']}`,
        meta: item.meta,
      };
    })
    .filter((item) => item !== null);
};

const waitForEventOrTimeout = (eventName, timeout) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    reject(new Error(`Timeout waiting for ${eventName} after ${timeout}ms`));
  }, timeout);

  window.addEventListener(eventName, (event) => {
    clearTimeout(timer);
    resolve(event.detail);
  }, { once: true });
});


const getExperiments = async () => {
  if (navigator.userAgent.match(/bot|crawl|spider/i)) {
    return {};
  }
  const params = new URL(window.location.href).searchParams;

  const experimentParam = params.get('experiment');

  if (experimentParam) {
    const lastSlash = experimentParam.lastIndexOf('/');
    return {
      experiments: [{
        experimentPath: experimentParam.substring(0, lastSlash),
        variantLabel: experimentParam.substring(lastSlash + 1),
      }],
    };
  }

  const timeout = parseInt(params.get('timeout'), 10) || EXPERIMENT_TIMEOUT_MS;

  let response;
  try {
    response = await waitForEventOrTimeout(
      'alloy_sendEvent',
      timeout,
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  let experiments = [];
  if (response) {
    experiments = handleAlloyResponse(response.result);
  }

  // TODO: if there is personalization metadata AND target, how do we merge?

  const manifestStr = (utils.getMetadata('experiment') || utils.getMetadata('personalization') || '').toLowerCase();
  const manifests = manifestStr.split(/,|(\s+)|(\\n)/g)
    .filter((path) => path?.trim());
  experiments = experiments.concat(
    manifests.map((manifestPath) => (
      {
        manifestPath: manifestPath.endsWith('.json')
          ? manifestPath
          : `${manifestPath}.json`,
      }
    )),
  );

  return { experiments };
};

const consolidateObjects = (arr, prop) => arr.reduce((propMap, item) => {
  Object.entries(item[prop] || {})
    .forEach(([key, val]) => {
      propMap[key] = val;
    });
  return propMap;
}, {});

const checkForExperiments = async () => {
  const { experiments } = await getExperiments();
  if (!experiments) return null;

  const { runExperiment } = await import('../scripts/experiments.js');

  let results = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const experimentInfo of experiments) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await runExperiment(experimentInfo, utils.createTag));
  }

  // let results = await Promise.all(experimentPromises);
  results = results.filter(Boolean);
  return {
    experiments: results.map((r) => r.experiment),
    fragments: consolidateObjects(results, 'fragments'),
    blocks: consolidateObjects(results, 'blocks'),
  };
};

export default async function init({ experimentsEnabled = false, utilMethods }) {
  utils = utilMethods;

  const getDetails = (env) => ({
    edgeConfigId: env.consumer?.edgeConfigId || env.edgeConfigId,
    url:
      env.name === 'prod'
        ? 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-5dd5dd2177e6.min.js'
        // TODO: This is a custom launch script for milo-target - update before merging to main
        : 'https://assets.adobedtm.com/d4d114c60e50/a0e989131fd5/launch-a27b33fc2dc0-development.min.js',
  });

  const config = utils.getConfig();

  const { url, edgeConfigId } = getDetails(config.env);
  utils.preload(url);

  setDeep(
    window,
    'alloy_all.data._adobe_corpnew.digitalData.page.pageInfo.language',
    config.locale.ietf,
  );

  window.marketingtech = {
    adobe: {
      launch: { url, controlPageLoad: false },
      alloy: { edgeConfigId },
      target: false,
    },
  };
  window.edgeConfigId = edgeConfigId;

  setDeep(window, 'digitalData.diagnostic.franklin.implementation', 'milo');

  await utils.loadScript('/libs/deps/martech.main.standard.min.js');
  // eslint-disable-next-line no-underscore-dangle
  window._satellite.track('pageload');

  if (experimentsEnabled) {
    utils.preload('/libs/scripts/experiments.js', { crossorigin: 'use-credentials' });
    const experimentData = await checkForExperiments();
    if (experimentData) {
      // Currently required for preview.js
      window.hlx ??= {};
      window.hlx.experiments = experimentData.experiments;

      utils.setConfig({
        ...utils.getConfig(),
        experiments: experimentData.experiments,
        experimentBlocks: experimentData.blocks,
        experimentFragments: experimentData.fragments,
      });
    }
  }
}
