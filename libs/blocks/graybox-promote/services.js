import getServiceConfig from '../../utils/service-config.js';
import login from '../../tools/sharepoint/login.js';
import { accessToken, accessTokenExtra } from '../../tools/sharepoint/state.js';
import { ADMIN, KEYS, TELEMETRY, CONFIG } from './constants.js';

let serviceUrl;

export const getServiceUrl = (env, service) => {
  if (serviceUrl) return `${serviceUrl}/${service}`;
  const envMap = {
    dev: 'https://14257-graybox-sabmukhe.adobeioruntime.net/api/v1/web/graybox',
    stage: 'https://14257-graybox-stage.adobeioruntime.net/api/v1/web/graybox',
    prod: 'https://14257-graybox.adobeioruntime.net/api/v1/web/graybox',
  };
  serviceUrl = envMap[env] || envMap.prod;
  return `${serviceUrl}/${service}`;
};

export const getJson = async (url, errMsg = `Failed to fetch ${url}`) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(errMsg, res.status, res.statusText);
  }
  const sheet = await res.json();
  return sheet;
};

export const getSheetValue = (data, key) => data?.find(
  (obj) => obj.key?.toLowerCase() === key?.toLowerCase(),
)?.value;

export const getAemInfo = (context) => {
  const search = new URLSearchParams(window.location.search);
  ['ref', 'repo', 'owner', 'referrer'].forEach((key) => {
    context[key] = search.get(key) || '';
  });
};

export const getProjectInfo = async (context) => {
  const sheet = await getJson(
    `${context.previewUrl.href}?sheet=settings`,
    'Failed to fetch project info',
  );
  context.setup.experienceName = getSheetValue(
    sheet.data,
    KEYS.PROJECT_INFO.EXPERIENCE_NAME,
  );
  context.grayboxIoEnv = getSheetValue(sheet.data, KEYS.PROJECT_INFO.GRAYBOX_IO_ENV);
};

export const getGrayboxConfig = async (context) => {
  const { ref, repo, owner, grayboxIoEnv } = context;
  const sheet = await getJson(
    `https://${ref}--${repo}--${owner}.aem.page/.milo/graybox-config.json`,
    'Failed to fetch graybox config',
  );

  const grayboxData = sheet.graybox?.data;
  context.enablePromote = getSheetValue(grayboxData, KEYS.CONFIG.ENABLE_PROMOTE)?.toLowerCase() === 'true';
  context.promoteUrl = getSheetValue(
    grayboxData,
    KEYS.CONFIG.PROMOTE_URL[(grayboxIoEnv || 'prod').toUpperCase()],
  );
  context.baseUrl = getSheetValue(
    grayboxData,
    KEYS.CONFIG.BASE_URL[(grayboxIoEnv || 'prod').toUpperCase()],
  );
  context.setup.draftsOnly = getSheetValue(
    grayboxData,
    KEYS.CONFIG.PROMOTE_DRAFTS_ONLY,
  )?.toLowerCase() === 'true';
  context.setup.promoteIgnorePaths = sheet.promoteignorepaths?.data
    ?.map((item) => item?.[KEYS.CONFIG.PROMOTE_IGNORE_PATHS])
    .join(',');
};

export const getSharepointData = async (context) => {
  const liveOrigin = context.previewUrl.origin.replace('-graybox', '').replace('.aem.page', '.aem.live');
  const { sharepoint } = await getServiceConfig(liveOrigin);
  context.setup.rootFolder = `/${sharepoint.rootMapping.replace('-graybox', '')}`;
  context.setup.gbRootFolder = `/${sharepoint.rootMapping}`;
  context.setup.driveId = sharepoint.driveId;
};

export const getFilePath = async (context) => {
  const { ref, repo, owner, referrer } = context;
  const status = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${referrer}`);
  if (!status.ok) throw new Error('Failed to fetch file path. Please ensure you\'re signed in to Sidekick.');
  const statusResp = await status.json();
  context.previewUrl = statusResp.preview.status === 200 && new URL(statusResp.preview.url);
  context.setup.projectExcelPath = (new URL(statusResp.preview.url)).pathname.replace('.json', '.xlsx');
  context.setup.projectExcelUrl = referrer;
};

export const preview = async (context) => {
  const { owner, repo, ref, setup: { projectExcelPath } } = context;
  const res = await fetch(`${ADMIN}/preview/${owner}/${repo}/${ref}${projectExcelPath.replace('.xlsx', '.json')}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to preview your file. Please ensure you\'re signed in to Sidekick.');
  context.previewUrl = new URL((await res.json()).preview.url);
};

export const loginToSharepoint = async (context) => login({
  scopes: ['files.readwrite', 'sites.readwrite.all'],
  telemetry: TELEMETRY,
  config: CONFIG,
  suppliedOrigin: window.location.origin,
})
  .then(() => {
    context.setup.spToken = accessToken.value || accessTokenExtra.value;
  });

export async function findFragments(baseUrl, params) {
  const apiUrl = `${baseUrl}/find-fragments?${params.toString()}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.fragmentLinks && Array.isArray(data.fragmentLinks)) {
    return data.fragmentLinks;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

export async function fetchBulkCopyStatus(baseUrl, repo, experienceName) {
  // Handle special case for repo 'cc-graybox' where the sharepoint folder is 'www-graybox'.
  // Only for CC, the repo and sharepoint folder names don't match hence map to the correct sharepoint folder. 
  const sharepointRootFolder = `${repo}` === 'cc-graybox' ? 'www-graybox' : `${repo}`;
  const statusUrl = `${baseUrl}/file-status.json?showContent=graybox_promote/`
    + `${sharepointRootFolder}/${experienceName}/bulk-copy-status.json`;
  const response = await fetch(statusUrl);
  if (!response.ok) throw new Error('Failed to fetch bulk copy status');
  return response.json();
}

// eslint-disable-next-line max-len
export function pollBulkCopyStatus(baseUrl, repo, experienceName, onStatusUpdate, onError, intervalMs = 3000) {
  let isPolling = false;
  let intervalId = null;

  const poll = async () => {
    if (isPolling) {
      try {
        const status = await fetchBulkCopyStatus(baseUrl, repo, experienceName);
        onStatusUpdate(status);
      } catch (error) {
        onError(error);
      }
    }
  };

  const start = () => {
    if (!isPolling) {
      isPolling = true;
      // Initial fetch
      poll();
      // Set up interval for subsequent fetches
      intervalId = setInterval(poll, intervalMs);
    }
  };

  const stop = () => {
    isPolling = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return {
    start,
    stop,
    isPolling: () => isPolling,
  };
}

export async function initiateBulkCopy(baseUrl, params) {
  const bulkCopyUrl = `${baseUrl}/bulk-copy?${params.toString()}`;
  const response = await fetch(bulkCopyUrl);
  const data = await response.json();

  if (response.ok) {
    return data;
  }
  throw new Error(data?.payload || 'Failed to initiate bulk copy');
}

export async function initiatePromotion(baseUrl, setup) {
  const promote = await fetch(`${baseUrl}/promote.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(setup).toString(),
  });
  const promoteRes = await promote.json();
  if (promoteRes?.code === 200) {
    return promoteRes;
  }
  throw new Error(`Could not promote: ${promoteRes.payload}`);
}

export async function fetchPromoteStatus(baseUrl, repo, experienceName) {
  const statusUrl = `${baseUrl}/file-status.json?showContent=graybox_promote/${repo}/${experienceName}/status.json`;
  const response = await fetch(statusUrl);
  if (!response.ok) throw new Error('Failed to fetch promote status');
  return response.json();
}
