import { getConfig } from '../../utils/utils.js';

const DEFAULT_LOCAL = 'http://localhost:8080';

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
  const clientId = cfg.clientid || imsClientId;
  if (inIframe && loadDaSdk) {
    try {
      const sdk = await Promise.race([
        loadDaSdk(),
        new Promise((_, reject) => { setTimeout(() => reject(new Error('da-timeout')), 1500); }),
      ]);
      return { mode: 'da', base: cfg.api || DEFAULT_LOCAL, token: sdk.token, clientId, daContext: sdk.context };
    } catch (e) { /* fall through to non-DA */ }
  }
  const token = cfg.token || window.adobeIMS?.getAccessToken()?.token;
  return { mode: cfg.api ? 'standalone' : 'local', base: cfg.api || DEFAULT_LOCAL, token, clientId };
}

export function createClient({ base, token, clientId }) {
  async function request(path, params = {}) {
    const url = new URL(`${base}${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      if (clientId) url.searchParams.set('clientId', clientId);
    }
    const res = await fetch(url, { headers });
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
  };
}

// eslint-disable-next-line import/no-unresolved
export const loadDaSdk = () => import('https://da.live/nx/utils/sdk.js').then((m) => m.default);
