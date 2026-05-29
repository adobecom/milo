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
  if (inIframe && loadDaSdk) {
    try {
      const sdk = await Promise.race([
        loadDaSdk(),
        new Promise((_, reject) => { setTimeout(() => reject(new Error('da-timeout')), 1500); }),
      ]);
      return { mode: 'da', base: cfg.api || DEFAULT_LOCAL, token: sdk.token, daContext: sdk.context };
    } catch (e) { /* fall through to non-DA */ }
  }
  return { mode: cfg.api ? 'standalone' : 'local', base: cfg.api || DEFAULT_LOCAL, token: cfg.token };
}

export function createClient({ base, token }) {
  return {
    async get(path, params = {}) {
      const url = new URL(`${base}${path}`);
      Object.entries(params).forEach(([k, v]) => {
        if (v != null && v !== '') url.searchParams.set(k, v);
      });
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        url.searchParams.set('clientId', 'milo-dashboard');
      }
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const e = new Error(`api ${res.status}`);
        e.status = res.status;
        throw e;
      }
      return res.json();
    },
  };
}

// eslint-disable-next-line import/no-unresolved
export const loadDaSdk = () => import('https://da.live/nx/utils/sdk.js').then((m) => m.default);
