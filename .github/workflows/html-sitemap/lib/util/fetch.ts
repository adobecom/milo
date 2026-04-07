import { getErrorMessage } from './stages.ts';

const DEFAULT_RETRIES = 2;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  { fetchImpl = fetch, retries = DEFAULT_RETRIES }: { fetchImpl?: typeof fetch; retries?: number } = {},
): Promise<Response> {
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

export async function fetchJson(
  url: string,
  requestOptions: RequestInit = {},
  runtimeOptions: { fetchImpl?: typeof fetch; retries?: number } = {},
): Promise<Response> {
  const response = await fetchWithRetry(url, {
    ...requestOptions,
    headers: {
      accept: 'application/json',
      ...((requestOptions.headers as Record<string, string> | undefined) || {}),
    },
  }, runtimeOptions);

  return response;
}

export async function fetchText(
  url: string,
  requestOptions: RequestInit = {},
  runtimeOptions: { fetchImpl?: typeof fetch; retries?: number } = {},
): Promise<Response> {
  const response = await fetchWithRetry(url, requestOptions, runtimeOptions);
  return response;
}
