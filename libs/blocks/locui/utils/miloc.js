import { getConfig, loadScript } from '../../../utils/utils.js';
import { allowFindFragments, heading, languages, polling } from './state.js';
import { getItemId } from '../../../tools/sharepoint/shared.js';
import updateExcelTable from '../../../tools/sharepoint/excel.js';
import { origin, preview } from './franklin.js';
import { setExcelStatus, setStatus } from './status.js';
import getServiceConfig from '../../../utils/service-config.js';

const INTERVAL = 3000;

async function getMilocUrl() {
  const env = heading.value.env || null;
  const { miloc } = await getServiceConfig(origin, env);
  return miloc.url;
}

function handleProjectStatusDetail(detail) {
  console.log(detail);
  languages.value = [...languages.value.map((lang) => ({ ...lang, ...detail[lang.code] }))];
}

export async function getProjectStatus(url) {
  const resp = await fetch(`${url}project-status?project=${heading.value.projectId}`);
  const json = await resp.json();
  setStatus('service', 'info', json.projectStatusText);
  handleProjectStatusDetail(json);
  return json;
}

export async function startSync(url) {
  setExcelStatus('Sync to langstore/en.', '');
  const opts = { method: 'POST' };
  const resp = await fetch(`${url}start-sync?project=${heading.value.projectId}`, opts);
  return resp.status;
}

export async function startProject(url) {
  setExcelStatus('Sending to localization service.', '');
  const opts = { method: 'POST' };
  const resp = await fetch(`${url}start-project?project=${heading.value.projectId}`, opts);
  return resp.status;
}

export async function rolloutLang(languageCode, reroll = false) {
  const url = await getMilocUrl();
  const opts = { method: 'POST' };
  const resp = await fetch(`${url}start-rollout?project=${heading.value.projectId}&languageCode=${languageCode}&reroll=${reroll}`, opts);
  console.log(resp);
  return resp.json();
}

export async function createProject(url) {
  setExcelStatus('Creating new project', '');
  const body = `${origin}${heading.value.path}.json`;
  const opts = { method: 'POST', body };
  const resp = await fetch(`${url}create-project`, opts);
  if (resp.status === 201) {
    allowFindFragments.value = false;
    const { base } = getConfig();
    await loadScript(`${base}/deps/md5.js`);
    const projectId = window.md5(body);
    heading.value = { ...heading.value, projectId };
    const values = [['Project ID', projectId]];
    const itemId = getItemId();
    await updateExcelTable({ itemId, tablename: 'settings', values });
    preview(`${heading.value.path}.json`);
    return startSync(url);
  }
  return resp.status;
}

export function getServiceUpdates(url, expectedStatus) {
  if (polling.value) {
    console.log('Already polling');
    return false;
  }
  return new Promise((resolve) => {
    let count = 1;
    const excelUpdated = setInterval(async () => {
      const json = await getProjectStatus(url);
      const { projectStatus } = json;
      count += 1;
      if (expectedStatus === projectStatus || count > 1000) {
        setStatus('service', 'info', json.projectStatusText, null, 3000);
        clearInterval(excelUpdated);
        resolve();
      }
    }, INTERVAL);
  });
}
