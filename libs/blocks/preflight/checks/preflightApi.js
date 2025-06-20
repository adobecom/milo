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

// should import Metadata from utils/utils.js
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

export const prefetchPreflightChecks = async () => {
  console.log('prefetchPreflightChecks starting...');
  try {
    const url = window.location.pathname;
    const area = document;

    window.miloPreflightCache = {
      assets: await runChecksAssets(url, area),
      performance: await runChecksPerformance(url, area),
      seo: await runChecksSeo({ url, area }),
    };
    const results = window.miloPreflightCache;
    console.log('prefetchPreflightChecks results:', results);
    return results;
  } catch (error) {
    console.log('prefetchPreflightChecks failed:', error);
    throw error;
  }
};

// Preflight should check if there is a Cached results
// Use global cache to persist across module reloads
if (!window.miloPreflightCache) {
  window.miloPreflightCache = null;
}

export const getPreflightCache = async () => {
  if (window.miloPreflightCache) {
    console.log('Cache hit:', window.miloPreflightCache);
    return window.miloPreflightCache;
  }
  console.log('Cache miss, preflightCache is:', window.miloPreflightCache);
  console.log('Running prefetchPreflightChecks...');
  return (window.miloPreflightCache = await prefetchPreflightChecks());
};

// Legacy function name for backward compatibility
export const prefetchAllPreflightChecks = getPreflightCache;

// Check if preflight has any failures
export function hasPreflightFailures(results = null) {
  const cache = results || window.miloPreflightCache;
  if (!cache) return false;

  const allResults = [
    ...(cache.assets || []),
    ...(cache.performance || []),
    ...(cache.seo || []),
  ];

  return allResults.some((result) => result.status === 'fail');
}

export function getPreflightStatus() {
  return window.miloPreflightCache ? 'completed' : 'not-started';
}

// if not then run Preflight checks

// if failed then return a "Preflight didnt execute" to the Publish button
