import { getErrorMessage } from './stages.js';

const DEFAULT_RETRIES = 2;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {{ fetchImpl?: typeof fetch, retries?: number }} [runtimeOptions]
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(
  url,
  options = {},
  { fetchImpl = fetch, retries = DEFAULT_RETRIES } = {},
) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl(url, options);
      if (response.ok || !RETRYABLE_STATUS.has(response.status) || attempt === retries) {
        return response;
      }
      console.warn(`[warn] Retry ${attempt + 1}/${retries} for ${url} after ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
      console.warn(`[warn] Retry ${attempt + 1}/${retries} for ${url}: ${getErrorMessage(error)}`);
    }

    await delay(250 * 2 ** attempt);
  }

  throw lastError;
}

/**
 * @param {string} url
 * @param {RequestInit} [requestOptions]
 * @param {{ fetchImpl?: typeof fetch, retries?: number }} [runtimeOptions]
 * @returns {Promise<Response>}
 */
export async function fetchJson(
  url,
  requestOptions = {},
  runtimeOptions = {},
) {
  const response = await fetchWithRetry(url, {
    ...requestOptions,
    headers: {
      accept: 'application/json',
      ...(requestOptions.headers || {}),
    },
  }, runtimeOptions);

  return response;
}

/**
 * @param {string} url
 * @param {RequestInit} [requestOptions]
 * @param {{ fetchImpl?: typeof fetch, retries?: number }} [runtimeOptions]
 * @returns {Promise<Response>}
 */
export async function fetchText(
  url,
  requestOptions = {},
  runtimeOptions = {},
) {
  const response = await fetchWithRetry(url, requestOptions, runtimeOptions);
  return response;
}
