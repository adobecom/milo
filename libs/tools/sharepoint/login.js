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
    const res = await pca.acquireTokenSilent(reqDetails).catch(async (error) => {
      if (error instanceof msal.InteractionRequiredAuthError) {
        return pca.acquireTokenPopup(reqDetails).catch((err) => {
          console.error(err);
        });
      }
      console.error(error);
      return null;
    });
    account.value = res.account;
    accessToken.value = res.accessToken;
    if (extraScopes) {
      const extraReq = { account: tmpAccount, scopes: extraScopes };
      const extraRes = await pca.acquireTokenSilent(extraReq)
        .catch(async (error) => {
          if (error instanceof msal.InteractionRequiredAuthError) {
            return pca.acquireTokenPopup(extraReq).catch((err) => {
              console.error(err);
            });
          }
          console.error(error);
          return null;
        });
      accessTokenExtra.value = extraRes.accessToken;
    }
  } catch (err) {
    throw new Error(`Cannot connect to Sharepoint: ${err.message}`);
  }
}
