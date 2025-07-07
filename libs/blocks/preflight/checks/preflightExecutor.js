import { getPreflightResults } from './preflightApi.js';

let preflightResults;

export default async function executePreflightChecks() {
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

