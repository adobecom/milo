import { loadScript, getConfig } from '../../utils/utils.js';
import { getSiteConfig, spAccessToken } from './state.js';

let msalConfig;

const login = { redirectUri: '/tools/loc/spauth' };
const siteKeys = ['clientId', 'authority', 'site', 'root'];
const cache = {
  cacheLocation: 'sessionStorage',
  storeAuthStateInCookie: false,
};

const telemetry = {
  application: {
    appName: 'Adobe Franklin Localization',
    appVersion: '0.0.1',
  },
};

export function getMSALConfig() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!msalConfig) {
      const { configs = {} } = await getSiteConfig();
      const { data = [] } = configs;
      const configValues = {};
      siteKeys.forEach((key) => {
        const currentData = data.find((item) => (item.key === `prod.sharepoint.${key}`));
        configValues[key] = currentData?.value;
      });
      const { clientId, authority, site, root } = configValues;
      const auth = { clientId, authority };
      const config = getConfig();
      const base = config.miloLibs || config.codeRoot;

      try {
        await loadScript(`${base}/deps/msal-browser-2.34.0.js`);
      } catch (err) {
        console.log(err);
      }
      msalConfig = {
        login,
        auth,
        cache,
        telemetry,
        site,
        baseUri: `${site}/drive/root:/${root}`,
      };
      resolve(msalConfig);
    }
    resolve(msalConfig);
  });
}

export function getReqOptions({ body = null, method = 'GET', contentType = 'application/json', accept = 'application/json' } = {}) {
  const bearer = `Bearer ${spAccessToken.value}`;
  const headerOpts = { Authorization: bearer, 'Content-Type': contentType, Accept: accept };
  const headers = new Headers(headerOpts);
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}
