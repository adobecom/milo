import { getConfig, getFederatedContentRoot } from '../../../utils/utils.js';
import { fetchPreflightChecks } from './asoApi.js';
import { isViewportTooSmall, checkImageDimensions, runChecks as runChecksAssets } from './assets.js';
import {
  getLcpEntry,
  checkSingleBlock,
  checkForPersonalization,
  checkLcpEl,
  checkImageSize,
  checkVideoPoster,
  checkFragments,
  checkPlaceholders,
  checkIcons,
  runChecks as runChecksPerformance,
} from './performance.js';
import {
  checkH1s,
  checkTitle,
  checkCanon,
  checkDescription,
  checkBody,
  checkLorem,
  connectionError,
  checkLinks,
  runChecks as runChecksSeo,
} from './seo.js';

let checksSuite = null;

export default {
  assets: {
    isViewportTooSmall,
    checkImageDimensions,
    runChecks: runChecksAssets,
  },
  performance: {
    getLcpEntry,
    checkSingleBlock,
    checkForPersonalization,
    checkLcpEl,
    checkImageSize,
    checkVideoPoster,
    checkFragments,
    checkPlaceholders,
    checkIcons,
    runChecks: runChecksPerformance,
  },
  seo: {
    checkH1s,
    checkTitle,
    checkCanon,
    checkDescription,
    checkBody,
    checkLorem,
    connectionError,
    checkLinks,
    runChecks: runChecksSeo,
  },
};

export const getChecksSuite = () => {
  if (checksSuite) return checksSuite;
  return new Promise((resolve) => {
    const config = getConfig();
    fetch(`${getFederatedContentRoot()}/federal/preflight/preflight-config.json`)
      .then((r) => r.json())
      .then((consumersList) => {
        const isAsoEnabled = consumersList?.data?.find((item) => item.value === config.imsClientId);
        const suite = isAsoEnabled ? 'ASO' : 'OG';
        checksSuite = suite;
        resolve(suite);
      })
      .catch(() => {
        checksSuite = 'OG';
        resolve(checksSuite);
      });
  });
};

const runChecks = async (url, area) => {
  const isASO = (await getChecksSuite()) === 'ASO';
  const assets = await Promise.all(runChecksAssets(url, area));
  const performance = await Promise.all(runChecksPerformance(url, area));
  const seo = isASO ? await fetchPreflightChecks() : runChecksSeo({ url, area });
  return { assets, performance, seo };
};

const processResults = (results) => {
  const allResults = [
    ...(results.assets || []),
    ...(results.performance || []),
    ...(results.seo || []),
  ];

  return {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: results,
    hasFailures: allResults.some((result) => result.status === 'fail'),
  };
};

export async function getPreflightResults(url, area) {
  const results = await runChecks(url, area);
  return processResults(results);
}
