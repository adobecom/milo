/* global msal */
import { getMSALConfig } from './msal.js';
import { accessToken, accessTokenExtra, account } from './state.js';

export default async function login({ scopes, extraScopes, telemetry = {} }) {
  const msalConfig = await getMSALConfig(telemetry);
  const pca = new msal.PublicClientApplication(msalConfig);
  let tmpAccount = pca.getAllAccounts()[0];
  if (!tmpAccount) {
    await pca.loginPopup(msalConfig.login);
    [tmpAccount] = pca.getAllAccounts();
  }
  const reqDetails = { account: tmpAccount, scopes };
  try {
    const res = await pca.acquireTokenSilent(reqDetails);
    account.value = res.account;
    accessToken.value = res.accessToken;
    if (extraScopes) {
      const extraRes = await pca.acquireTokenSilent({ account: tmpAccount, scopes: extraScopes });
      accessTokenExtra.value = extraRes.accessToken;
    }
  } catch (err) {
    throw new Error(`Cannot connect to Sharepoint: ${err.message}`);
  }
}
