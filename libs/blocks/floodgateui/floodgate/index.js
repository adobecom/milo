import {
  heading,
  urls,
  showLogin,
  telemetry,
  allowFindFragments,
  canRefresh,
  fgColor,
  loadHeadingCheck,
  loadDetailsCheck,
} from '../utils/state.js';
import { setStatus } from '../utils/status.js';
import { getStatus, preview } from '../../locui/utils/franklin.js';
import login from '../../../tools/sharepoint/login.js';
import { getServiceUpdates } from '../utils/miloc.js';
import { getUrls } from '../../locui/loc/index.js';

const MOCK_REFERRER = 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B12F9079D-E580-4407-973D-2330B171B2CB%7D&file=DemoFgUI.xlsx&action=default&mobileredirect=true';

const urlParams = new URLSearchParams(window.location.search);

let resourcePath;
let previewPath;

async function loadProjectSettings(projSettings) {
  const settings = projSettings.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
  heading.value = { ...heading.value, env: settings.env, projectId: settings['Project ID'] };
  if (settings['Project ID']) {
    setStatus('service', 'info', 'Connecting to localization service.');
    await getServiceUpdates();
    setStatus('service');
  } else {
    canRefresh.value = true;
    allowFindFragments.value = true;
  }
}

export async function loadFgColor() {
  try {
    const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
    const jsonUrl = await getStatus('', editUrl);
    previewPath = jsonUrl.preview.url;
    const resp = await fetch(previewPath);
    const json = await resp.json();
    fgColor.value = json.fgcolor.data[0]?.FloodgateColor || 'pink';
  } catch {
    setStatus('details', 'error', 'Error getting the floodgate folder');
  }
}

async function loadDetails() {
  setStatus('details', 'info', 'Loading Project Status and URLs.');
  try {
    const resp = await fetch(previewPath);
    const json = await resp.json();
    const jsonUrls = json.urls.data.map((item) => new URL(item.URL));
    const projectUrls = getUrls(jsonUrls, true);
    urls.value = projectUrls;
    if (json.settings) loadProjectSettings(json.settings.data);
    loadDetailsCheck.value = true;
    setStatus('details');
  } catch {
    setStatus('details', 'error', 'Error loading Project Status and URLs.');
  }
}

async function loadHeading() {
  setStatus('details', 'info', 'Getting latest project info.');
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
