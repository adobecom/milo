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

let checks = null;

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

export async function runDeterministicChecks(url, area) {
  if (checks) {
    return checks;
  }

  checks = (async () => {
    const assets = await Promise.all(runChecksAssets(url, area));
    const performance = await Promise.all(runChecksPerformance(url, area));
    const seo = await Promise.all(runChecksSeo({ url, area }));
    return {
      assets,
      performance,
      seo,
    };
  })();

  return checks;
}

export async function getPreflightResults(url, area) {
  const results = await runDeterministicChecks(url, area);
  return {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: results,
  };
}

// Cleaner API method following the recommendation pattern
export async function getResults(url, area) {
  const results = await runDeterministicChecks(url, area);
  return {
    isViewportTooSmall: isViewportTooSmall(),
    assets: results.assets,
    performance: results.performance,
    seo: results.seo,
  };
}
