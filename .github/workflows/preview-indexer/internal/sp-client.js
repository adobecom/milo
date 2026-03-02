import { ConfidentialClientApplication } from '@azure/msal-node';
import crypto from 'crypto';
import { createAxiosWithRetry, getPreviewExcel } from './utils.js';

const GRAPH_URL_BASE = 'https://graph.microsoft.com/v1.0/';

const axiosWithRetry = createAxiosWithRetry();

const axiosWithRetryError = async (request) => {
  try {
    return await axiosWithRetry(request);
  } catch (error) {
    if (error.status === 404) {
      return { ok: false, status: error.status };
    }
    const message = `Request failed: ${error.message} (${error.response?.status || 'unknown'})`;
    const enhancedError = new Error(message);
    enhancedError.status = error.status;
    enhancedError.response = error.response;
    throw enhancedError;
  }
};

let token;

const parseCert = (content, password) => crypto.createPrivateKey({
  key: content,
  passphrase: password,
  format: 'pem'
}).export({
  format: 'pem',
  type: 'pkcs8'
});

const spClientId = process.env.SP_CLIENT_ID;
const spTenantId = process.env.SP_TENANT_ID;
const spCertPassword = process.env.SP_CERT_PASSWORD;
const spCertThumbprint = process.env.SP_CERT_THUMB_PRINT;
const spCertContent = process.env.SP_CERT_CONTENT;
const aemOrgToken = process.env.AEM_ORG_AUTH_TOKEN;
const rawCertContent = spCertContent.replace(/\\n/g, '\n');
const certContent = rawCertContent.replace(/\\n/g, '\n');
const authConfig = {
  auth: {
      clientId: spClientId,
      authority: `https://login.microsoftonline.com/${spTenantId}`,
      knownAuthorities: ['login.microsoftonline.com'],
      clientCertificate: {
          privateKey: parseCert(certContent, spCertPassword),
          thumbprint: spCertThumbprint,
      }
  }
};

const authClient = new ConfidentialClientApplication(authConfig);

const requestNewSpToken = async () => {
  const tokenResponse = await authClient.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default']
  });
  return {
      token: tokenResponse.accessToken,
      expiresTimestamp: tokenResponse.expiresOn.getTime(),
  };
};

const getMsalToken = async () => {
  if (token && token.expiresTimestamp > Date.now()) {
    return token;
  }
  token = await requestNewSpToken();
  return token;
};

const defaultHeaders = async () => {
  const msalToken = await getMsalToken();
  return {
    Authorization: `Bearer ${msalToken.token}`,
    'User-Agent': 'NONISV|Adobe|MiloPreviewIndexer/0.0.1',
  };
};

export default function SPClient(org, repo) {
  const spConfigUrl = `https://main--${repo}--${org}.aem.page/.milo/config.json?sheet=configs`;
  const CONFIGS = ['prod.sharepoint.site', 'prod.sharepoint.siteId', 'prod.sharepoint.clientId', 'prod.sharepoint.driveId', 'prod.sharepoint.rootMapping'];
  let siteConfigs = {};
  let graphBaseUrl = `${GRAPH_URL_BASE}/drive`;
  let rootPath = '';
  const init = async () => {
    const spConfigResponse = await axiosWithRetryError({
      url: spConfigUrl,
      headers: {
        Authorization: `token ${aemOrgToken}`
      }
    });
    if (spConfigResponse.status !== 200) {
      throw new Error(`Failed to get SP config: ${spConfigResponse.statusText}`);
    }
    for (const item of spConfigResponse?.data?.data) {
      if (CONFIGS.includes(item.key)) {
        siteConfigs[item.key] = item.value;
      }
    }
    graphBaseUrl = `${GRAPH_URL_BASE}/drives/${siteConfigs['prod.sharepoint.driveId']}`;
    rootPath = siteConfigs['prod.sharepoint.rootMapping']?.replace(/\/$/, '') || '';
    return this;
  };

  const uploadSimple = async (relativePath, fileBuffer, contentType) => {
    const headers = {
        'content-type': contentType,
        ...(await defaultHeaders()),
    };
    const url = `${graphBaseUrl}/root:/${rootPath}${relativePath}:/content`;
    console.log('url', url);
    const axiosConfig = {
        method: 'PUT',
        url,
        headers,
        data: fileBuffer,
        timeout: 60000,
        validateStatus: status => (status >= 200 && status < 300) || status === 423, // Accept 423 as well
        responseType: 'json'
    };
    const fileResponse = await axiosWithRetryError(axiosConfig);
    const success = fileResponse.status === 200 || fileResponse.status === 201 || fileResponse.status === 204;
    if (!success) {
      throw new Error(`Failed to upload file: ${fileResponse.statusText}`);
    }
    return {href: fileResponse.data?.webUrl, ok: !!fileResponse.data?.webUrl,  status: fileResponse.data?.webUrl ? 200 : 500};
  };

  const uploadPreview = async (relativePath, paths = []) => {
    const fileBuffer = await getPreviewExcel(paths);
    const excelContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return uploadSimple(relativePath, fileBuffer, excelContentType);
  }

  const uploadPreviewIndex = async (relativePath, daPreviewData) => {
    if (!daPreviewData || !daPreviewData.data) {
      throw new Error('Invalid DA Excel');
    }
    const paths = daPreviewData.data.map((item) => item.Path) || [];
    return uploadPreview(relativePath, paths);
  }

  async function getPreviewIndexJson(pathname) {
    const url = `https://main--${repo}--${org}.aem.page${pathname}.json?limit=999999`;
    console.log(`Getting preview index json: ${url}`);
    const piResponse = await axiosWithRetryError({
      url,
      headers: {
        Authorization: `token ${aemOrgToken}`
      }
    });
    return piResponse.data || { data: [] };
  }

  return { init, uploadPreview, uploadPreviewIndex, getPreviewIndexJson };
}
