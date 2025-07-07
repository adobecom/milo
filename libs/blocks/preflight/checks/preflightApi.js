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

let preflightResults;

export async function getPreflightResults(url, area, useCache = true) {
  if (useCache && checks) {
    preflightResults = await checks;
    const returnValue = {
      isViewportTooSmall: isViewportTooSmall(),
      runChecks: preflightResults,
    };
    return returnValue;
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

  preflightResults = await checks;

  return {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: preflightResults,
  };
}

export function hasPreflightFailures() {
  if (!preflightResults) return false;

  const runChecks = preflightResults.runChecks || preflightResults;
  const allResults = [
    ...(runChecks.assets || []),
    ...(runChecks.performance || []),
    ...(runChecks.seo || []),
  ];
  return allResults.some((result) => result.status === 'fail');
}
