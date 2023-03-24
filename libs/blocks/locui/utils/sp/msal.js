/* global msal */
import { loadScript, getConfig } from '../../../../utils/utils.js';
import { getSiteConfig } from '../state.js';

let msalConfig;

const login = { redirectUri: '/tools/loc/spauth' };

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

export default function getMSALConfig() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!msalConfig) {
      const { sp } = await getSiteConfig();
      const { clientId, authority, site, rootFolders } = sp.data[0];

      const auth = { clientId, authority };
      const config = getConfig();
      const base = config.miloLibs || config.codeRoot;
      await loadScript(`${base}/deps/msal-browser-2.34.0.js`);
      msalConfig = {
        login,
        auth,
        cache,
        telemetry,
        baseUri: `${site}/drive/root:${rootFolders}`,
        system: {
          loggerOptions: {
            logLevel: msal.LogLevel.Error,
            loggerCallback: (level, message, containsPii) => {
              if (containsPii) { return; }
              switch (level) {
                case msal.LogLevel.Error:
                  console.error(message);
                  return;
                case msal.LogLevel.Info:
                  console.info(message);
                  return;
                case msal.LogLevel.Verbose:
                  console.debug(message);
                  return;
                case msal.LogLevel.Warning:
                  console.warn(message);
                  return;
                default:
                  console.log(message);
              }
            },
          },
        },
      };
      resolve(msalConfig);
    }
    resolve(msalConfig);
  });
}
