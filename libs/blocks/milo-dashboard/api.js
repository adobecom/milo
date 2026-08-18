const DEFAULT_LOCAL = 'http://localhost:8080';
const PROD_BACKEND = 'https://milo-core-prod.adobe.io';

const MILO_CORE_IMS_CLIENT_ID = 'milo-logs-claude-mcp';
const MILO_CORE_IMS_INSTANCE = 'miloCoreIms';

function defaultBase() {
  if (window.location.hostname.includes('localhost')) return DEFAULT_LOCAL;
  return PROD_BACKEND;
}

function imsEnv() {
  const override = new URLSearchParams(window.location.search).get('ims_env');
  if (override === 'prod' || override === 'stg1') return override;
  const host = window.location.hostname;
  return (host === 'localhost' || host.includes('stage')) ? 'stg1' : 'prod';
}

function imsRelayOrigin(env) {
  return env === 'prod' ? PROD_BACKEND : 'https://milo-core-stage.adobe.io';
}

let relayedToken = null;
let relayListenerAdded = false;
function addRelayListener(relayOrigin) {
  if (relayListenerAdded) return;
  relayListenerAdded = true;
  window.addEventListener('message', (e) => {
    if (e.origin !== relayOrigin) return;
    if (e.data?.type === 'pc-ims-token' && e.data.access_token) relayedToken = e.data.access_token;
  });
}

let miloCoreImsPromise;
async function loadMiloCoreIms() {
  miloCoreImsPromise = miloCoreImsPromise || (async () => {
    const env = imsEnv();
    const relayOrigin = imsRelayOrigin(env);
    addRelayListener(relayOrigin);
    if (!window.adobeImsFactory) {
      await new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = 'https://auth.services.adobe.com/imslib/imslib.min.js';
        el.addEventListener('load', () => resolve(), { once: true });
        el.addEventListener('error', () => reject(new Error('imslib failed to load')), { once: true });
        document.head.appendChild(el);
      });
    }
    if (!window[MILO_CORE_IMS_INSTANCE]) {
      window.adobeImsFactory.createIMSLib({
        client_id: MILO_CORE_IMS_CLIENT_ID,
        scope: 'AdobeID,openid,email',
        environment: env,
        autoValidateToken: true,
        useLocalStorage: false,
        modalMode: true,
        redirect_uri: `${relayOrigin}/imslib-callback?origin=${encodeURIComponent(window.location.origin)}`,
      }, MILO_CORE_IMS_INSTANCE);
    }
    await window[MILO_CORE_IMS_INSTANCE].initialize();
    return window[MILO_CORE_IMS_INSTANCE];
  })();
  return miloCoreImsPromise;
}

function miloCoreToken() {
  try {
    return window[MILO_CORE_IMS_INSTANCE]?.getAccessToken?.()?.token ?? relayedToken;
  } catch {
    return relayedToken;
  }
}

export function signIn() {
  window[MILO_CORE_IMS_INSTANCE]?.signIn?.();
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
  const base = cfg.api || defaultBase();
  if (inIframe && loadDaSdk) {
    try {
      const sdk = await Promise.race([
        loadDaSdk(),
        new Promise((_, reject) => { setTimeout(() => reject(new Error('da-timeout')), 1500); }),
      ]);
      return {
        mode: 'da', base, token: sdk.token, getToken: () => sdk.token, clientId: cfg.clientid || MILO_CORE_IMS_CLIENT_ID, daContext: sdk.context,
      };
    } catch (e) { /* fall through to non-DA */ }
  }

  if (!cfg.token && base !== DEFAULT_LOCAL) {
    try { await loadMiloCoreIms(); } catch { /* proceed tokenless -> 401 -> sign-in button */ }
  }
  const getToken = () => cfg.token || miloCoreToken();
  return { mode: base === DEFAULT_LOCAL ? 'local' : 'standalone', base, token: getToken(), getToken, clientId: cfg.clientid || MILO_CORE_IMS_CLIENT_ID };
}

export function createClient({ base, token, clientId, getToken }) {
  async function request(path, params = {}, { method = 'GET', body, extraHeaders } = {}) {
    const url = new URL(`${base}${path}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
    const headers = { ...extraHeaders };
    const tok = getToken ? getToken() : token;
    if (tok) {
      headers.Authorization = `Bearer ${tok}`;
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
