import { getImsToken } from '../../../tools/send-to-caas/send-utils.js';
import { fetchWithTimeout } from '../caas/utils.js';
import { loadScript } from '../../utils/utils.js';
import {
  getLocalStorage,
  setLocalStorage,
} from '../review/utils/localStorageUtils.js';

export const ADMIN_BASE_URL = 'https://admin.hlx.page';
const THROTTLING_DELAY_MS = 100;
export const BULK_CONFIG_FILE_PATH = '/tools/bulk-config.json';
export const BULK_REPORT_FILE_PATH = '/tools/bulk-report';
const BULK_AUTHORIZED_USERS = 'bulkAuthorizedUsers';
export const BULK_SUPPORTED_SITES = 'bulkSupportedSites';
export const BULK_STORED_URL_IDX = 'bulkStoredUrlIdx';
const BULK_STORED_COMPLETED = 'bulkStoredCompleted';
const BULK_STORED_URLS = 'bulkStoredUrls';
const BULK_STORED_RESULTS = 'bulkStoredResults';
const BULK_STORED_OPERATION = 'bulkStoredOperation';
const UNSUPPORTED_SITE_STATUS = 'unsupported domain';
const DUPLICATE_STATUS = 'duplicate';

// eslint-disable-next-line no-promise-executor-return
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const getStoredOperation = () => {
  const name = getLocalStorage(BULK_STORED_OPERATION);
  const urlIdx = getLocalStorage(BULK_STORED_URL_IDX);
  const urls = getLocalStorage(BULK_STORED_URLS);
  const completed = getLocalStorage(BULK_STORED_COMPLETED);
  return {
    name,
    urlIdx,
    urls,
    completed,
  };
};

export const getStoredUrlInput = () => {
  const storedUrls = getStoredOperation().urls;
  return storedUrls ? storedUrls.join('\n') : '';
};

export const storeUrls = (urls) => {
  setLocalStorage(BULK_STORED_URLS, urls);
};

export const storeOperation = (operation) => {
  setLocalStorage(BULK_STORED_OPERATION, operation);
};
export const getUser = async () => {
  const profile = await window.adobeIMS?.getProfile();
  return profile
    ? { name: profile.name, email: profile.email }
    : { name: 'anonymous', email: 'anonymous' };
};

export const signIn = async () => {
  // force user to sign in
  const accessToken = await getImsToken(loadScript);
  if (!accessToken) {
    window.adobeIMS.signIn();
    return false;
  }
  return true;
};

export const signOut = (e) => {
  e.preventDefault();
  window.adobeIMS?.signOut();
};

export const getAuthorizedUsers = async () => {
  let authorizedUsers = getLocalStorage(BULK_AUTHORIZED_USERS);
  if (authorizedUsers) return authorizedUsers;
  const resp = await fetch(BULK_CONFIG_FILE_PATH);
  const json = await resp.json();
  authorizedUsers = json.users.data.map((user) => user.user);
  setLocalStorage(BULK_AUTHORIZED_USERS, authorizedUsers);
  return authorizedUsers;
};

const getSupportedSites = async () => {
  let supportedSites = getLocalStorage(BULK_SUPPORTED_SITES);
  if (supportedSites) return supportedSites;
  const resp = await fetch(BULK_CONFIG_FILE_PATH);
  const json = await resp.json();
  supportedSites = json.sites.data.map((site) => site.origin);
  setLocalStorage(BULK_SUPPORTED_SITES, supportedSites);
  return supportedSites;
};

export const userIsAuthorized = async () => {
  const { email } = await getUser();
  const users = await getAuthorizedUsers();
  return users.includes(email);
};

const siteIsSupported = async (url) => {
  try {
    const { origin } = new URL(url);
    const sites = await getSupportedSites();
    return sites.includes(origin);
  } catch (e) {
    return false;
  }
};

export const getUrls = (element) => {
  return element.current?.value.split('\n')
    .filter((url) => url.length > 0)
    .map((e) => e.trim());
};

export const getActionName = (action, gerund) => {
  let name;
  switch (action) {
    case null:
    case 'preview':
      name = (!gerund) ? 'Preview' : 'Previewing';
      break;
    case 'publish':
      name = (!gerund) ? 'Publish' : 'Publishing';
      break;
    default:
      name = (!gerund) ? 'Preview & publish' : 'Previewing & publishing';
  }
  return name;
};

const executeAction = async (action, url) => {
  const operation = (action === 'preview') ? 'preview' : 'live';
  const siteAllowed = await siteIsSupported(url);
  if (!siteAllowed) return UNSUPPORTED_SITE_STATUS;
  const { hostname, pathname } = new URL(url);
  const [branch, repo, owner] = hostname.split('.')[0].split('--');
  const adminURL = `${ADMIN_BASE_URL}/${operation}/${owner}/${repo}/${branch}${pathname}`;
  const resp = await fetchWithTimeout(adminURL, { method: 'POST' });
  return resp.status;
};

const isProcessed = (url, results) => results.some((result) => result.url === url);

export const executeActions = async (resume, setResult) => {
  const results = [];
  const operation = getStoredOperation().name;
  const actions = operation.split('&');
  const { urls } = getStoredOperation();
  const startUrlIdx = resume ? getLocalStorage(BULK_STORED_URL_IDX) + 1 : 0;
  setLocalStorage(BULK_STORED_COMPLETED, false);
  if (startUrlIdx > urls.length - 1) {
    // eslint-disable-next-line no-console
    console.error(`incorrect url index: ${startUrlIdx}`);
    return null;
  }

  // display results from previous run
  const storedResults = getLocalStorage(BULK_STORED_RESULTS);
  if (storedResults && startUrlIdx > 0) {
    storedResults.forEach((result) => {
      results.push(result);
      setResult([...results]);
    });
  }

  // eslint-disable-next-line no-plusplus
  for (let i = startUrlIdx; i < urls.length; i++) {
    const url = urls[i];
    const status = {};
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];
      if (isProcessed(url, results)) {
        status[action] = DUPLICATE_STATUS;
      } else {
        // eslint-disable-next-line no-await-in-loop
        status[action] = await executeAction(action, url);
        // eslint-disable-next-line no-await-in-loop
        await delay(THROTTLING_DELAY_MS);
      }
    }
    results.push({
      url,
      status,
    });
    setResult([...results]);
    setLocalStorage(BULK_STORED_URL_IDX, i);
    setLocalStorage(BULK_STORED_RESULTS, results);
  }
  setLocalStorage(BULK_STORED_COMPLETED, true);
  return results;
};

export const getCompletion = (results) => {
  let previewTotal = 0;
  let publishTotal = 0;
  let previewSuccess = 0;
  let publishSuccess = 0;
  results.forEach((result) => {
    const { status } = result;
    if (status.preview) previewTotal += 1;
    if (status.publish) publishTotal += 1;
    if (status.preview === 200) previewSuccess += 1;
    if (status.publish === 200) publishSuccess += 1;
  });
  return {
    preview: {
      total: previewTotal,
      success: previewSuccess,
    },
    publish: {
      total: publishTotal,
      success: publishSuccess,
    },
  };
};

export const getReport = async (results, action) => {
  const origins = {};
  results.forEach((result) => {
    let origin;
    try {
      const urlObj = new URL(result.url);
      origin = urlObj.origin;
    } catch (e) {
      origin = result.url;
    }
    if (!origins[origin]) {
      origins[origin] = {
        total: 0,
        success: 0,
      };
    }
    if (action === 'preview&publish') {
      origins[origin].total += 2;
    } else {
      origins[origin].total += 1;
    }
    if (result.status.preview === 200) {
      origins[origin].success += 1;
    }
    if (result.status.publish === 200) {
      origins[origin].success += 1;
    }
  });
  const timestamp = new Date().toISOString();
  const { email } = await getUser();
  return Object.keys(origins).map((origin) => ({
    timestamp,
    email,
    action: getActionName(action),
    domain: origin,
    urls: origins[origin].total,
    success: origins[origin].success,
  }));
};

export const sendReport = async (results, action) => {
  const rows = await getReport(results, action);
  rows.forEach((row) => {
    fetch(BULK_REPORT_FILE_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: row }),
    });
  });
};
