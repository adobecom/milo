import {
  heading,
  urls,
  showLogin,
  telemetry,
  allowFindFragments,
  canRefresh,
  loadHeadingCheck,
  loadDetailsCheck,
} from '../utils/state.js';
import { setStatus } from '../utils/status.js';
import { getStatus, preview } from '../../locui/utils/franklin.js';
import login from '../../../tools/sharepoint/login.js';
import { getUrls } from '../../locui/loc/index.js';
import { isUrl, getUrl, validateUrl } from '../utils/url.js';

const MOCK_REFERRER = 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B12F9079D-E580-4407-973D-2330B171B2CB%7D&file=DemoFgUI.xlsx&action=default&mobileredirect=true';
const REQUIRED_KEYS = ['ref', 'repo', 'owner', 'host', 'project', 'referrer'];

const urlParams = new URLSearchParams(window.location.search);
const repo = urlParams.get('repo') || 'milo';

let resourcePath;
let previewPath;

export function validateOrigin(urlStr) {
  try {
    const url = new URL(urlStr);
    const origins = [url.origin.replace('.aem.', '.hlx.'), url.origin.replace('.hlx.', '.aem.')];
    return origins.includes(origin);
  } catch {
    return false;
  }
}

export function validateUrlsFormat(projectUrls, removeMedia = false) {
  projectUrls.forEach((projectUrl, idx) => {
    const urlObj = getUrl(projectUrl);
    const url = isUrl(urlObj.alt) ?? urlObj;
    if (!validateOrigin(url.origin)) {
      const aemUrl = url.hostname?.split('--').length === 3;
      url.valid = !aemUrl ? 'not AEM url' : 'not same domain';
    }
    if ((/\.(gif|jpg|jpeg|tiff|png|webp)$/i).test(url.pathname)) {
      url.valid = 'media';
    }
    projectUrls[idx] = Array.isArray(projectUrls[idx]) ? [urlObj] : urlObj;
  });
  if (removeMedia) {
    return projectUrls.filter((url) => getUrl(url).valid !== 'media');
  }
  return projectUrls;
}

async function validatedUrls(projectUrls) {
  const validateUrls = [...projectUrls];
  while (validateUrls.length) {
    try {
      const reqs = await Promise.all(validateUrls.splice(0, 49).map(validateUrl));
      setStatus('details', 'info', 'Validating Project URLs');
      for (const res of reqs) {
        const projectUrl = projectUrls.find((url) => url.href === res.url);
        projectUrl.valid = res.ok || 'not found';
      }
    } catch (error) {
      setStatus('details', 'error', 'There was an error validating project URLs.', error);
    }
  }
  return validateUrlsFormat(projectUrls);
}

export async function loadProjectSettings(projSettings) {
  const settings = projSettings.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
  heading.value = {
    ...heading.value,
    env: settings.FloodgateIOEnv || 'prod',
    fgColor: settings.FloodgateColor || 'pink',
    source: `${repo}`,
    floodgate: `${repo}-${settings.FloodgateColor || 'pink'}`,
  };
  if (settings['Project ID']) {
    setStatus('service', 'info', 'Connecting to localization service.');
    setStatus('service');
  } else {
    canRefresh.value = true;
    allowFindFragments.value = true;
  }
}

export async function loadDetails() {
  setStatus('details', 'info', 'Loading Project Status and URLs.');
  try {
    const resp = await fetch(previewPath);
    const json = await resp.json();
    const jsonUrls = json.urls.data.map((item) => new URL(item.URL));
    const projectUrls = getUrls(jsonUrls, true);
    urls.value = await validatedUrls(projectUrls);
    if (json.settings) loadProjectSettings(json.settings.data);
    loadDetailsCheck.value = true;
    setStatus('details');
  } catch (error) {
    setStatus('details', 'error', 'Error loading Project Status and URLs.');
    const missingKeys = REQUIRED_KEYS.filter((key) => !urlParams.has(key));
    if (missingKeys.length > 0) {
      setStatus('details', 'error', 'Missing required URL parameter(s)');
    } else {
      console.error(error);
    }
  }
}

export async function loadHeading() {
  setStatus('details', 'info', 'Getting latest project info.');
  const missingKeys = REQUIRED_KEYS.filter((key) => !urlParams.has(key));
  if (missingKeys.length > 0) {
    return;
  }
  const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
  const json = await getStatus('', editUrl);
  resourcePath = json.resourcePath;
  previewPath = json.preview.url;
  const path = resourcePath.replace(/\.[^/.]+$/, '');
  setStatus('details');
  const projectName = json.edit.name.split('.').shift().replace('-', ' ');
  heading.value = { name: projectName, editUrl: json.edit.url, path };
  window.document.title = `${projectName} - FgUI`;
  await preview(`${path}.json`);
  loadHeadingCheck.value = true;
}

async function loginToSharePoint() {
  const scopes = ['files.readwrite', 'sites.readwrite.all'];
  await login({ scopes, telemetry });
}

export async function setup() {
  await loginToSharePoint();
  await loadHeading();
  await loadDetails();
}

export async function autoSetup() {
  try {
    await setup();
  } catch {
    showLogin.value = true;
  }
}
