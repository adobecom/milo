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

const runChecks = async (url, area) => {
  const assets = await Promise.all(runChecksAssets(url, area));
  const performance = await Promise.all(runChecksPerformance(url, area));
  const seo = await Promise.all(runChecksSeo({ url, area }));
  return { assets, performance, seo };
};

export async function getPreflightResults(url, area, useCache = true) {
  if (useCache && checks) {
    const cachedChecks = await checks;
    const allResults = [
      ...(cachedChecks.assets || []),
      ...(cachedChecks.performance || []),
      ...(cachedChecks.seo || []),
    ];
    return {
      isViewportTooSmall: isViewportTooSmall(),
      runChecks: cachedChecks,
      hasFailures: allResults.some((result) => result.status === 'fail'),
    };
  }

  const res = useCache ? (checks = runChecks(url, area)) : runChecks(url, area);
  const runChecksResult = await res;

  const allResults = [
    ...(runChecksResult.assets || []),
    ...(runChecksResult.performance || []),
    ...(runChecksResult.seo || []),
  ];

  return {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: runChecksResult,
    hasFailures: allResults.some((result) => result.status === 'fail'),
  };
}
