import { getConfig } from '../../utils/utils.js';

const DEFAULT_LOCAL = 'http://localhost:8080';
const PROD_BACKEND = 'https://milo-core-prod.adobe.io';

// Pick the backend from the host: localhost in dev, otherwise milo-core prod.
// (Milo's page env maps .aem.page/.aem.live to "stage", but the dashboard wants
// real prod data everywhere it's hosted — an authored `api` row can override.)
function defaultBase() {
  if (window.location.hostname.includes('localhost')) return DEFAULT_LOCAL;
  return PROD_BACKEND;
}

// milo-core's requireAuth validates the token against the clientId query param,
// so the clientId MUST match the token's own client_id (e.g. 'darkalley' for a
// DA SDK token) or IMS rejects it as invalid. Read it straight from the JWT.
function tokenClientId(token) {
  try {
    const seg = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(seg)).client_id;
  } catch (e) {
    return undefined;
  }
}

export function readConfig(block) {
  const cfg = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const [k, v] = [...row.children].map((c) => c.textContent.trim());
    if (k) cfg[k.toLowerCase()] = v;
  });
  return cfg;
}

export async function resolveContext(
  block,
  { loadDaSdk, inIframe = window.self !== window.top } = {},
) {
  const cfg = readConfig(block);
  const { imsClientId } = getConfig();
  const base = cfg.api || defaultBase();
  // clientId must match the token; an explicit config row wins, otherwise we
  // derive it from the token and fall back to Milo's imsClientId.
  const pickClientId = (token) => cfg.clientid || tokenClientId(token) || imsClientId;
  if (inIframe && loadDaSdk) {
    try {
      const sdk = await Promise.race([
        loadDaSdk(),
        new Promise((_, reject) => { setTimeout(() => reject(new Error('da-timeout')), 1500); }),
      ]);
      return { mode: 'da', base, token: sdk.token, clientId: pickClientId(sdk.token), daContext: sdk.context };
    } catch (e) { /* fall through to non-DA */ }
  }
  const token = cfg.token || window.adobeIMS?.getAccessToken()?.token;
  return { mode: base === DEFAULT_LOCAL ? 'local' : 'standalone', base, token, clientId: pickClientId(token) };
}

export function createClient({ base, token, clientId }) {
  async function request(path, params = {}, { method = 'GET', body, extraHeaders } = {}) {
    const url = new URL(`${base}${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
    const headers = { ...extraHeaders };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      if (clientId) url.searchParams.set('clientId', clientId);
    }
    const res = await fetch(url, { method, headers, body });
    if (!res.ok) {
      const e = new Error(`api ${res.status}`);
      e.status = res.status;
      throw e;
    }
    return res;
  }

  return {
    async get(path, params = {}) {
      const res = await request(path, params);
      return res.json();
    },
    async getText(path, params = {}) {
      const res = await request(path, params);
      return res.text();
    },
    async post(path, body, params = {}) {
      const res = await request(path, params, {
        method: 'POST',
        body: JSON.stringify(body),
        extraHeaders: { 'Content-Type': 'application/json' },
      });
      return res.json();
    },
  };
}

// eslint-disable-next-line import/no-unresolved
export const loadDaSdk = () => import('https://da.live/nx/utils/sdk.js').then((m) => m.default);
