import { createAxiosWithRetry } from './utils.js';

const axiosWithRetry = createAxiosWithRetry();

const IMS_TOKEN_URL = 'https://ims-na1.adobelogin.com/ims/token/v3';

const {
  PREVIEW_INDEXER_IMS_CLIENT_ID = '',
  PREVIEW_INDEXER_IMS_CLIENT_SECRET = '',
  PREVIEW_INDEXER_IMS_SCOPE = 'openid,AdobeID,additional_info.projectedProductContext,aem.frontend.all,read_organizations',
} = process.env;

let cachedToken = null;
let tokenExpiresAt = 0;
let pendingRequest = null;

async function getImsToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (pendingRequest) {
    return pendingRequest;
  }

  console.log('Fetching IMS token...');
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: PREVIEW_INDEXER_IMS_CLIENT_ID,
    client_secret: PREVIEW_INDEXER_IMS_CLIENT_SECRET,
    scope: PREVIEW_INDEXER_IMS_SCOPE,
  });

  pendingRequest = axiosWithRetry({
    method: 'POST',
    url: IMS_TOKEN_URL,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: params.toString(),
  }).then((response) => {
    const { access_token, expires_in } = response.data;
    cachedToken = access_token;
    tokenExpiresAt = Date.now() + (expires_in * 1000) - 300000;
    console.log('IMS token fetched, expires in', expires_in, 'seconds');
    return cachedToken;
  }).catch((error) => {
    throw new Error(`IMS token request failed: ${error.message} (${error.response?.status || 'unknown'})`);
  }).finally(() => {
    pendingRequest = null;
  });

  return pendingRequest;
}

export { getImsToken };
