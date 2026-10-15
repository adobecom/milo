import { loadScript, getConfig } from '../../utils/utils.js';
import { accessToken, accessTokenExtra } from './state.js';

const BASE_CONFIG = {
  login: { redirectUri: '/tools/loc/spauth' },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Milo's first-party Entra app and Adobe's tenant authority. Pinned here
// rather than read from getServiceConfig(), whose .milo/config.json is fetched
// from a client-controlled repo/owner origin: a poisoned config could otherwise
// point login at an attacker's app registration (MWPW-206105 / VULN-38270).
const CLIENT_ID = '008626ae-f818-43d8-9d7f-26afe05e771d';
const AUTHORITY = 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1';

export async function getMSALConfig(telemetry) {
  try {
    const { base } = getConfig();
    await loadScript(`${base}/deps/msal-browser-2.34.0.js`);

    const auth = {
      clientId: CLIENT_ID,
      authority: AUTHORITY,
    };

    return { ...BASE_CONFIG, auth, telemetry };
  } catch (err) {
    window.lana?.log(err);
    return { error: 'There was an error authenticating with Microsoft.' };
  }
}

export function getReqOptions(
  {
    body,
    method = 'GET',
    contentType = 'application/json',
    accept = 'application/json',
    extra = false,
  } = {},
) {
  const bearer = `Bearer ${extra ? accessTokenExtra.value : accessToken.value}`;
  const headerOpts = { Authorization: bearer, 'Content-Type': contentType, Accept: accept };
  const headers = new Headers(headerOpts);
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}
