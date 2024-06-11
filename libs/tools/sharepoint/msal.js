import getServiceConfig from '../../utils/service-config.js';
import { loadScript, getConfig } from '../../utils/utils.js';
import { accessToken, accessTokenExtra } from './state.js';

const BASE_CONFIG = {
  login: { redirectUri: '/tools/loc/spauth' },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export async function getMSALConfig(telemetry) {
  try {
    const { base } = getConfig();
    await loadScript(`${base}/deps/msal-browser-2.34.0.js`);

    const { sharepoint } = await getServiceConfig();

    const auth = {
      clientId: sharepoint.clientId,
      authority: sharepoint.authority,
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
