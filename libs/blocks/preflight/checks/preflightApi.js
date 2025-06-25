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
import { getMetadata } from '../../../utils/utils.js';

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

function getPreflightMode() {
  const mode = getMetadata('preflight-mode');
  return mode === 'aso' ? 'aso' : 'deterministic';
}

async function runDeterministicChecks(url, area) {
  return {
    assets: await runChecksAssets(url, area),
    performance: await runChecksPerformance(url, area),
    seo: await runChecksSeo({ url, area }),
  };
}

/**
 * TODO: Implement ASO API integration
 */
async function runASOChecks(url, area) {
  // Placeholder for ASO API implementation
  // This will be implemented in future iterations
  console.warn('ASO API mode is not yet implemented, falling back to deterministic mode');
  return runDeterministicChecks(url, area);
}

/**
 * Converts ASO API results to match deterministic format
 * This ensures consistent cache format regardless of execution mode
 */
function convertASOToStandardFormat(asoResults) {
  // TODO: Implement conversion logic when ASO API is integrated
  // For now, return results as-is since we're falling back to deterministic
  return asoResults;
}

export const prefetchPreflightChecks = async () => {
  console.log('prefetchPreflightChecks starting...');
  const url = window.location.pathname;
  const area = document;
  const mode = getPreflightMode();
  
  console.log(`Using preflight mode: ${mode}`);
  
  let results;

  if (mode === 'aso') {
    const asoResults = await runASOChecks(url, area);
    // Convert ASO results to standard format for consistent caching
    results = convertASOToStandardFormat(asoResults);
  } else {
    results = await runDeterministicChecks(url, area);
  }

  window.miloPreflightCache = results;
  console.log('prefetchPreflightChecks results:', results);
  return results;
};

if (!window.miloPreflightCache) {
  window.miloPreflightCache = null;
}

export const getPreflightCache = async () => {
  if (window.miloPreflightCache) {
    console.log('Cache hit:', window.miloPreflightCache);
    return window.miloPreflightCache;
  }
  return (window.miloPreflightCache = await prefetchPreflightChecks());
};

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

// if failed then return a "Preflight didnt execute" to the Publish button
