import { runDeterministicChecks } from './preflightApi.js';
import { getMetadata } from '../../../utils/utils.js';

let preflightResults;

const preflightMode = () => {
  const mode = getMetadata('preflight-mode');
  return mode === 'aso' ? 'aso' : 'deterministic';
};

/**
 * TODO: Implement ASO API integration
 */
const runASOChecks = async (url, area) => {

  return runDeterministicChecks(url, area);
};

const convertASOToStandardFormat = (asoResults) => asoResults;
// TODO: Also dependent to the ASO API to be implemented

const executePreflightChecks = async () => {
  if (preflightResults) {
    return preflightResults;
  }

  const url = window.location.pathname;
  const area = document;
  const mode = preflightMode();

  let results;

  if (mode === 'aso') {
    const asoResults = await runASOChecks(url, area);
    // Convert ASO results to standard format for consistent caching
    results = convertASOToStandardFormat(asoResults);
  } else {
    results = await runDeterministicChecks(url, area);
  }
  preflightResults = results;
  return results;
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
