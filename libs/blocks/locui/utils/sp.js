/* global msal */
import { getSiteConfig, user, spAccessToken, heading, setStatus } from './state.js';
import getMSALConfig from './msal.js';

const GRAPH_API = 'https://graph.microsoft.com/v1.0';

function getSharepointConfig(sp) {
  const spConfig = sp.data[0];
  const baseUri = `${spConfig.site}/drive/root:${spConfig.rootFolders}`;
  return {
    ...spConfig,
    baseUri,
    login: { redirectUri: '/tools/loc/spauth' },
    clientApp: {
      cache: { cacheLocation: 'sessionStorage' },
      auth: { clientId: spConfig.clientId, authority: spConfig.authority },
    },
  };
}

export default async function loginToSharePoint() {
  const siteConfig = await getSiteConfig();
  const spConfig = getSharepointConfig(siteConfig.sp);
  const msalConfig = await getMSALConfig(spConfig);
  const pca = new msal.PublicClientApplication(msalConfig);

  let account = pca.getAllAccounts()[0];
  if (!account) {
    await pca.loginPopup(spConfig.login);
    [account] = pca.getAllAccounts();
  }
  user.value = account.username;

  const scopes = ['files.readwrite', 'sites.readwrite.all'];
  const reqDetails = { account, scopes };

  try {
    const res = await pca.acquireTokenSilent(reqDetails);
    spAccessToken.value = res.accessToken;
  } catch {
    // couldn't get access token
  }
}

function getReqOptions({ body = null, method = 'GET' } = {}) {
  const bearer = `Bearer ${spAccessToken.value}`;
  const headerOpts = { Authorization: bearer, 'Content-Type': 'application/json' };
  const headers = new Headers(headerOpts);
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}

export async function updateExcelTable(values) {
  setStatus('sharepoint', 'info', 'Adding URLs to your project.');
  const siteConfig = await getSiteConfig();
  const { baseUri } = getSharepointConfig(siteConfig.sp);

  const excel = `${heading.value.path}.xlsx`;
  const path = `${baseUri}${excel}:/workbook/tables/URL/rows/add`;
  const options = getReqOptions({ body: { values }, method: 'POST' });

  const res = await fetch(path, options);
  if (!res.ok) {
    setStatus('sharepoint', 'error', 'Couldn\'t add URLs to project.');
    return null;
  }
  const json = await res.json();
  setStatus('sharepoint');
  return json;
}
