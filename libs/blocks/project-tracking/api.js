const DEFAULT_LOCAL = 'http://localhost:8080';
const PROD_BACKEND = 'https://milo-core-prod.adobe.io';
const IMS_CLIENT_ID = 'milo-logs-claude-mcp';
const IMS_INSTANCE = 'miloCoreIms';
const TOKEN_KEY = 'milocore.ims.token';

function defaultBase() {
  return window.location.hostname.includes('localhost') ? DEFAULT_LOCAL : PROD_BACKEND;
}

function imsEnv(base) {
  const override = new URLSearchParams(window.location.search).get('ims_env');
  if (override === 'prod' || override === 'stg1') return override;
  let host;
  try { host = new URL(base).hostname; } catch { host = window.location.hostname; }
  return (host === 'localhost' || host === 'forge-dev.adobe.io' || host.includes('stage')) ? 'stg1' : 'prod';
}

function relayOriginFor(env) {
  return env === 'prod' ? PROD_BACKEND : 'https://milo-core-stage.adobe.io';
}

let relayedToken = null;
const tokenListeners = new Set();
export function onToken(fn) {
  tokenListeners.add(fn);
  return () => tokenListeners.delete(fn);
}
function persist(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
    return true;
  } catch { return false; }
}
function storeToken(token) {
  relayedToken = token || null;
  persist(token);
  if (token) tokenListeners.forEach((fn) => fn(token));
}
function storedToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function instanceToken() {
  try { return window[IMS_INSTANCE]?.getAccessToken?.()?.token ?? null; } catch { return null; }
}
function currentToken() {
  return instanceToken() ?? relayedToken ?? storedToken();
}

let relayListening = false;
function listenForRelay(relayOrigin) {
  if (relayListening) return;
  relayListening = true;
  window.addEventListener('message', (e) => {
    if (e.origin === relayOrigin && e.data?.type === 'pc-ims-token' && e.data.access_token) {
      storeToken(e.data.access_token);
    }
  });
}

let imsPromise;
function loadIms(base) {
  imsPromise = imsPromise || (async () => {
    try {
      const env = imsEnv(base);
      const relayOrigin = relayOriginFor(env);
      listenForRelay(relayOrigin);
      if (!window.adobeImsFactory) {
        await new Promise((resolve, reject) => {
          const el = document.createElement('script');
          el.src = 'https://auth.services.adobe.com/imslib/imslib.min.js';
          el.addEventListener('load', resolve, { once: true });
          el.addEventListener('error', () => reject(new Error('imslib failed')), { once: true });
          document.head.appendChild(el);
        });
      }
      if (!window[IMS_INSTANCE]) {
        window.adobeImsFactory.createIMSLib({
          client_id: IMS_CLIENT_ID,
          scope: 'AdobeID,openid,email',
          environment: env,
          autoValidateToken: true,
          useLocalStorage: false,
          modalMode: true,
          redirect_uri: `${relayOrigin}/imslib-callback?origin=${encodeURIComponent(window.location.origin)}`,
          onAccessToken: () => storeToken(instanceToken()),
          onReauthAccessToken: () => storeToken(instanceToken()),
          onAccessTokenHasExpired: () => storeToken(null),
          onError: () => {},
        }, IMS_INSTANCE);
      }
      await window[IMS_INSTANCE].initialize();
      return window[IMS_INSTANCE];
    } catch {
      return null;
    }
  })();
  return imsPromise;
}

export function signIn() {
  window[IMS_INSTANCE]?.signIn?.();
}

function readConfig(block) {
  const cfg = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const [k, v] = [...row.children].map((c) => c.textContent.trim());
    if (k) cfg[k.toLowerCase()] = v;
  });
  return cfg;
}

export async function resolveContext(block) {
  const cfg = readConfig(block);
  const base = cfg.api || defaultBase();
  if (!cfg.token && base !== DEFAULT_LOCAL) await loadIms(base);
  return {
    base,
    clientId: cfg.clientid || IMS_CLIENT_ID,
    getToken: () => cfg.token || currentToken(),
  };
}

export function createClient({ base, clientId, getToken }) {
  return {
    async post(path, body) {
      const url = new URL(`${base}${path}`);
      const headers = { 'Content-Type': 'application/json' };
      const token = getToken?.();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        if (clientId) url.searchParams.set('clientId', clientId);
      }
      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!res.ok) {
        const err = new Error(`api ${res.status}`);
        err.status = res.status;
        throw err;
      }
      return res.json();
    },
  };
}
