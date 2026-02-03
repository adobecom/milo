import { getConfig, getFederatedContentRoot } from '../../../utils/utils.js';
import { fetchPreflightChecks, asoCache } from './asoApi.js';
import { isViewportTooSmall, checkImageDimensions, runChecks as runChecksAssets } from './assets.js';
import runChecksAccessibility from './accessibility.js';
import captureMetrics from './captureMetrics.js';
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
import { runChecks as runChecksStructure } from './structure.js';
import { SEVERITY } from './constants.js';

let checksSuite = null;

const globalPreflightCache = new Map();

function getGlobalMetricsSentCache() {
  const cacheKey = '__miloPreflightMetricsSent';
  if (!window[cacheKey]) {
    window[cacheKey] = new Set();
  }
  return window[cacheKey];
}

function getMetricsDedupeKey(isASO) {
  return `${window.location.origin}${window.location.pathname}_${isASO ? 'ASO' : 'OG'}`;
}

export default {
  accessibility: { runChecks: runChecksAccessibility },
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
  structure: { runChecks: runChecksStructure },
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

const isUrlExcluded = (url, exclusionPatterns = {}) => {
  if (!exclusionPatterns.data) return false;

  return exclusionPatterns.data.some((item) => {
    const pattern = item.path;
    if (!pattern) return false;

    const regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*\\\*/g, '.*')
      .replace(/\\\*/g, '[^/]*');
    const regex = new RegExp(regexPattern);
    return regex.test(url);
  });
};

const runChecks = async (url, area, injectVisualMetadata = false) => {
  const isASO = (await getChecksSuite()) === 'ASO';
  const accessibility = await Promise.all(runChecksAccessibility({ area }));
  const assets = await Promise.all(runChecksAssets(url, area, injectVisualMetadata));
  const performance = await Promise.all(runChecksPerformance(url, area));
  const seo = isASO ? await fetchPreflightChecks() : runChecksSeo({ url, area });
  const structure = await Promise.all(runChecksStructure({ area }));
  return {
    accessibility,
    assets,
    performance,
    seo,
    structure,
  };
};

function generateCacheKey(url, injectVisualMetadata, isASO, asoAuthed) {
  return `${url}_${injectVisualMetadata}_${isASO}_${asoAuthed}`;
}

export async function getPreflightResults(options = {}) {
  const {
    url = window.location.href,
    area = document,
    useCache = true,
    injectVisualMetadata = false,
  } = options;

  const excludedURLS = await fetch(`${getFederatedContentRoot()}/federal/preflight/preflight-config.json?sheet=preflight-exclusions`)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  if (isUrlExcluded(url, excludedURLS)) return null;

  const isASO = (await getChecksSuite()) === 'ASO';
  const asoAuthed = isASO ? !!asoCache.sessionToken : false;
  const cacheKey = generateCacheKey(url, injectVisualMetadata, isASO, asoAuthed);

  if (useCache && globalPreflightCache.has(cacheKey)) {
    return globalPreflightCache.get(cacheKey);
  }

  const res = await runChecks(url, area, injectVisualMetadata);
  const allResults = [
    ...(res.accessibility || []),
    ...(res.assets || []),
    ...(res.performance || []),
    ...(res.seo || []),
    ...(res.structure || []),
  ];

  const result = {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: res,
    hasFailures: allResults.some((check) => check.status === 'fail' && check.severity === SEVERITY.CRITICAL),
  };

  const metricsSentCache = getGlobalMetricsSentCache();
  const metricsDedupeKey = getMetricsDedupeKey(isASO);
  if (!metricsSentCache.has(metricsDedupeKey)) {
    metricsSentCache.add(metricsDedupeKey);
    await captureMetrics(res);
  }

  if (useCache) globalPreflightCache.set(cacheKey, result);

  return result;
}
