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

const runChecks = async (url, area, injectVisualMetadata = false) => {
  const assets = await Promise.all(runChecksAssets(url, area, injectVisualMetadata));
  const performance = await Promise.all(runChecksPerformance(url, area));
  const seo = runChecksSeo({ url, area });
  return { assets, performance, seo };
};

export async function getPreflightResults(
  url,
  area,
  useCache = true,
  injectVisualMetadata = false,
) {
  if (useCache && !injectVisualMetadata) {
    // Cache calls for without visual metadata
    if (!checks) checks = runChecks(url, area, injectVisualMetadata);
    const cachedChecks = await checks;
    const allResults = [
      ...(cachedChecks.assets || []),
      ...(cachedChecks.performance || []),
      ...(cachedChecks.seo || []),
    ];
    return {
      isViewportTooSmall: isViewportTooSmall(),
      runChecks: cachedChecks,
      hasFailures: allResults.some((result) => result.status === 'fail' && result.severity === SEVERITY.CRITICAL),
    };
  }

  const res = await runChecks(url, area, injectVisualMetadata);
  const allResults = [
    ...(res.assets || []),
    ...(res.performance || []),
    ...(res.seo || []),
  ];

  return {
    isViewportTooSmall: isViewportTooSmall(),
    runChecks: res,
    hasFailures: allResults.some((result) => result.status === 'fail' && result.severity === SEVERITY.CRITICAL),
  };
}
