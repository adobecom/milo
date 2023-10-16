import { getConfig } from '../../../utils/utils.js';
import {
  heading,
  urls,
  getSiteConfig,
  showLogin,
  telemetry,
  allowFindFragments,
  canRefresh,
} from '../utils/state.js';
import { setStatus } from '../utils/status.js';
import { getStatus } from '../../locui/utils/franklin.js';
import login from '../../../tools/sharepoint/login.js';
import getServiceConfig from '../../../utils/service-config.js';
import { getProjectStatus, getServiceUpdates } from '../utils/miloc.js';
import { getUrls } from '../../locui/loc/index.js';

const MOCK_REFERRER = 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B654BFAD2-84A7-442D-A13D-18DE87A405B7%7D&file=DemoFG.xlsx&action=default&mobileredirect=true';

const urlParams = new URLSearchParams(window.location.search);

let resourcePath;
let previewPath;

async function loadProjectSettings(projSettings) {
  const settings = projSettings.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
  heading.value = { ...heading.value, env: settings.env, projectId: settings['Project ID'] };
  if (settings['Project ID']) {
    setStatus('service', 'info', 'Connecting to localiztion service.');
    await getServiceUpdates();
    setStatus('service');
  } else {
    canRefresh.value = true;
    allowFindFragments.value = true;
  }
}

async function loadDetails() {
  setStatus('details', 'info', 'Loading languages and URLs.');
  try {
    const resp = await fetch(previewPath);
    const json = await resp.json();
    const jsonUrls = json.urls.data.map((item) => new URL(item.URL));
    const projectUrls = getUrls(jsonUrls, true);
    urls.value = projectUrls;
    console.log(json)
    if (json.settings) loadProjectSettings(json.settings.data);
    setStatus('details');
  } catch {
    setStatus('details', 'error', 'Error loading languages and URLs.');
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
  window.document.title = `${projectName} - LocUI`;
  // await preview(`${path}.json`);
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
