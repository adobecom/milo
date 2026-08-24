/* eslint-disable no-console */

const GEO_TIMEOUT_MS = 5000;

// Shared in-flight promise so concurrent callers don't issue duplicate fetches.
let inflight = null;

/**
 * Gets the Akamai country code from the geo2.adobe.com service.
 * Times out after GEO_TIMEOUT_MS and deduplicates concurrent calls.
 * @returns {Promise<string>} Resolves to the lowercase country code.
 */
export const getAkamaiCode = () => {
  /* c8 ignore next */
  if (inflight) return inflight;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

  /* c8 ignore next 15 */
  inflight = fetch('https://geo2.adobe.com/json/', {
    cache: 'no-cache',
    signal: controller.signal,
  }).then((resp) => {
    if (resp.ok) {
      return resp.json().then((data) => {
        const code = data.country.toLowerCase();
        sessionStorage.setItem('akamai', code);
        return code;
      });
    }
    throw new Error(`Something went wrong getting the akamai Code. Response status text: ${resp.statusText}`);
  }).catch((error) => {
    throw new Error(`Something went wrong getting the akamai Code. ${error.message}`);
  }).finally(() => {
    clearTimeout(timeout);
    inflight = null;
  });

  return inflight;
};

export default getAkamaiCode;
