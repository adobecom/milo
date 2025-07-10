import { getPreflightResults } from './preflightApi.js';

let preflightResults;

const executePreflightChecks = async () => {
  if (preflightResults) {
    return preflightResults;
  }

  const url = window.location.pathname;
  const area = document;

  preflightResults = getPreflightResults(url, area).then((results) => {
    preflightResults = results.runChecks;
    return results.runChecks;
  });

  return preflightResults;
};

export function hasPreflightFailures(results = null) {
  const cache = results || preflightResults;
  if (!cache) return false;
  const allResults = [
    ...(cache.assets || []),
    ...(cache.performance || []),
    ...(cache.seo || []),
  ];
  return allResults.some((result) => result.status === 'fail');
}

export function getPreflightStatus() {
  return preflightResults ? 'completed' : 'not-started';
}

export { executePreflightChecks };
