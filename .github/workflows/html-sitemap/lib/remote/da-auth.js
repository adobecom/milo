/**
 * DA authorization header resolver. Prefers a direct DA token from env;
 * otherwise mints a Bearer token via the IMS OAuth Server-to-Server flow
 * (`client_credentials` grant). The IMS exchange is memoized so concurrent
 * stages share one token.
 */

import process from 'node:process';
import { fetchJson } from '../util/fetch.js';

/** @type {Promise<string> | null} */
let imsTokenPromise = null;

/**
 * @param {string} name
 * @returns {string | undefined}
 */
function getEnv(name) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/**
 * @returns {string | null}
 */
function getDirectToken() {
  const token = getEnv('DA_SOURCE_TOKEN') || getEnv('DA_TOKEN');
  if (!token) return null;
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

/**
 * @returns {{ imsUrl: string, clientId: string, clientSecret: string, scopes?: string } | null}
 */
function getImsEnv() {
  const imsUrl = getEnv('ROLLING_IMPORT_IMS_URL');
  const clientId = getEnv('ROLLING_IMPORT_CLIENT_ID');
  const clientSecret = getEnv('ROLLING_IMPORT_CLIENT_SECRET');
  const scopes = getEnv('ROLLING_IMPORT_SCOPES');

  if (!imsUrl || !clientId || !clientSecret) return null;
  return { imsUrl, clientId, clientSecret, scopes };
}

/**
 * @param {typeof fetch} fetchImpl
 * @returns {Promise<string>}
 */
async function fetchImsToken(fetchImpl) {
  const env = getImsEnv();
  if (!env) {
    throw new Error(
      'Push requires DA_SOURCE_TOKEN or DA_TOKEN, or the IMS OAuth Server-to-Server '
      + 'credential set: ROLLING_IMPORT_IMS_URL, ROLLING_IMPORT_CLIENT_ID, '
      + 'ROLLING_IMPORT_CLIENT_SECRET (and ROLLING_IMPORT_SCOPES if your integration '
      + 'requires explicit scopes).',
    );
  }

  const params = new URLSearchParams();
  params.append('client_id', env.clientId);
  params.append('client_secret', env.clientSecret);
  params.append('grant_type', 'client_credentials');
  if (env.scopes) params.append('scope', env.scopes);

  const response = await fetchJson(env.imsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  }, { fetchImpl });

  if (!response.ok) {
    // Capture IMS's response body so callers can see what was actually wrong
    // (most common: scope missing or not bound to the integration).
    let detail = '';
    try { detail = ` — ${await response.text()}`; } catch { /* ignore */ }
    throw new Error(`Failed to retrieve IMS token: HTTP ${response.status}${detail}`);
  }

  const json = await response.json();
  if (!json.access_token) {
    throw new Error('IMS token response did not include `access_token`.');
  }

  return `Bearer ${json.access_token}`;
}

/**
 * Return the `Authorization` header value for DA requests. Direct tokens
 * win; otherwise IMS-mints once and reuses the result for the process.
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<string>}
 */
export async function getDaAuthHeader(fetchImpl = fetch) {
  const directToken = getDirectToken();
  if (directToken) return directToken;

  imsTokenPromise ||= fetchImsToken(fetchImpl).catch((error) => {
    imsTokenPromise = null;
    throw error;
  });

  return imsTokenPromise;
}
