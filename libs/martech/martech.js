/* global _satellite */

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
  const items = response.propositions?.[0]?.items
    || response.decisions?.[0]?.items;

  if (!items) return [];
  // loop through items for each manifest info

  return items
    .map((item) => {
      if (item?.data?.content) {
        // const manifestData = JSON.parse(item.data.content);
        return {
          experimentPath: item.data.content.experiment || item.meta['offer.name'],
          manifestData: item.data.content.manifest,
          experimentName: item.meta['activity.name'],
          variantLabel: item.meta['experience.name'],
          meta: item.meta,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

const getExperiments = async () => {
  if (navigator.userAgent.match(/bot|crawl|spider/i)) {
    return {};
  }

  const timeoutParam = parseInt(new URL(window.location.href).searchParams.get('timeout'), 10);
  const EXPERIMENT_TIMEOUT_MS = timeoutParam || 3000;

  const experimentParam = new URL(window.location.href).searchParams.get('experiment');

  if (experimentParam) {
    const lastSlash = experimentParam.lastIndexOf('/');
    return {
      experiments: [{
        experimentPath: experimentParam.substring(0, lastSlash),
        variantLabel: experimentParam.substring(lastSlash + 1),
      }],
    };
  }

  const timeout = new Promise((resolve) => {
    setTimeout(() => resolve('TIMEOUT'), EXPERIMENT_TIMEOUT_MS, false);
  });

  let response = false;
  try {
    response = await Promise.race([window.alloy_load.sent, timeout]);
  } catch (e) {
    console.log('Promise error', e);
  }

  if (!response || response === 'TIMEOUT') return {};

  let experiments = handleAlloyResponse(response);

  if (!experiments?.length) {
    experiments = [{ experimentPath: utils.getMetadata('experiment')?.toLowerCase() }];
  }

  const instantExperiment = utils.getMetadata('instant-experiment')?.toLowerCase();

  return {
    experiments,
    instantExperiment,
  };
};

const consolidateObjects = (arr, prop) => arr.reduce((propMap, item) => {
  Object.entries(item[prop])
    .forEach(([key, val]) => {
      propMap[key] = val;
    });
  return propMap;
}, {});

const checkForExperiments = async () => {
  const { experiments, instantExperiment } = await getExperiments();
  if (!experiments) return null;
  const { runExperiment } = await import('../scripts/experiments.js');
  const experimentPromises = experiments.map(async (experiment) => {
    const {
      experimentPath,
      manifestData,
      variantLabel,
    } = experiment;
    if (!manifestData || !variantLabel) return null;
    return runExperiment(experimentPath, variantLabel, manifestData, instantExperiment, document.querySelector('main'), utils.createTag);
  }).filter(Boolean);
  const results = await Promise.all(experimentPromises);
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
