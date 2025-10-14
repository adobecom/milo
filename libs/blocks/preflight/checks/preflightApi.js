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
import { SEVERITY } from './constants.js';

let checksSuite = null;

const globalPreflightCache = new Map();

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

const runChecks = async (url, area, injectVisualMetadata = false) => {
  const isASO = (await getChecksSuite()) === 'ASO';
  const assets = await Promise.all(runChecksAssets(url, area, injectVisualMetadata));
  const performance = await Promise.all(runChecksPerformance(url, area));
  const seo = isASO ? await fetchPreflightChecks() : runChecksSeo({ url, area });
  return { assets, performance, seo };
};

function generateCacheKey(url, injectVisualMetadata, isASO) {
  return `${url}_${injectVisualMetadata}_${isASO}`;
}

export async function getPreflightResults(options = {}) {
  const {
    url = window.location.href,
    area = document,
    useCache = true,
    injectVisualMetadata = false,
  } = options;

  const isASO = (await getChecksSuite()) === 'ASO';
  const cacheKey = generateCacheKey(url, injectVisualMetadata, isASO);

  if (useCache && globalPreflightCache.has(cacheKey)) {
    return globalPreflightCache.get(cacheKey);
  }

  const res = await runChecks(url, area, injectVisualMetadata);
  const allResults = [
    ...(res.assets || []),
    ...(res.performance || []),
    ...(res.seo || []),
  ];

  const result = {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: res,
    hasFailures: allResults.some((check) => check.status === 'fail' && check.severity === SEVERITY.CRITICAL),
  };

  if (useCache) globalPreflightCache.set(cacheKey, result);

  return result;
}
