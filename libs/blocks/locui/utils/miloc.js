import {
  allowSendForLoc,
  allowSyncToLangstore,
  heading,
  languages,
  projectStatus,
  canRefresh,
  serviceStatus,
  allowRollout,
  serviceStatusDate,
  projectCancelled,
  allowCancelProject,
  polling,
} from './state.js';
import { getItemId } from '../../../tools/sharepoint/shared.js';
import updateExcelTable from '../../../tools/sharepoint/excel.js';
import { origin, preview } from './franklin.js';
import { setExcelStatus, setStatus } from './status.js';
import getServiceConfig from '../../../utils/service-config.js';
import '../../../deps/md5.min.js';

const INTERVAL = 3000;
const MAX_COUNT = 1200; // 3000 x 1200 = 3600000s = 1 hour
const ROLLOUT_ALL_AVAILABLE = ['completed', 'translated'];

let waiting = false;

async function getMilocUrl() {
  const env = heading.value.env || null;
  const { miloc } = await getServiceConfig(origin, env);
  return miloc.url;
}

function handleProjectStatusDetail(detail) {
  allowRollout.value = Object.keys(detail).some(
    (key) => ROLLOUT_ALL_AVAILABLE.includes(detail[key].status),
  );
  languages.value = [...languages.value.map((lang) => ({ ...lang, ...detail[lang.code] }))];
}

export async function getProjectStatus() {
  try {
    const url = await getMilocUrl();
    const resp = await fetch(`${url}project-status?project=${heading.value.projectId}`, { cache: 'reload' });
    const json = await resp.json();

    if (json.errors) {
      setStatus('service-error', 'error', `${json['error-phase']}`, json.errors);
    } else {
      setStatus('service-error');
    }

    if (json.projectStatus === 'sync') {
      allowSyncToLangstore.value = false;
    }

    if (json.projectStatus === 'sync'
    || json.projectStatus === 'created'
    || json.projectStatus === 'download'
    || json.projectStatus === 'start-glaas') {
      allowSyncToLangstore.value = false;
      allowSendForLoc.value = false;
      allowCancelProject.value = false;
      setStatus('service', 'info', json.projectStatusText);
    }

    if (json.projectStatus === 'sync-done') {
      setStatus('service');
      allowSyncToLangstore.value = true;
      allowSendForLoc.value = true;
      allowCancelProject.value = true;
    }

    if (json.projectStatus === 'waiting') {
      setStatus('service');
      allowSyncToLangstore.value = false;
      allowSendForLoc.value = false;
      allowCancelProject.value = true;
    }

    if (json.projectStatus === 'cancelled') {
      projectCancelled.value = true;
      allowCancelProject.value = false;
      allowSyncToLangstore.value = false;
      allowSendForLoc.value = false;
    }

    handleProjectStatusDetail(json);
    return json;
  } catch (e) {
    return null;
  }
}

export async function startSync() {
  setStatus('service', 'info', 'Syncing documents to Langstore.');
  const url = await getMilocUrl();
  setExcelStatus('Sync to langstore/en', '');
  const opts = { method: 'POST' };
  const resp = await fetch(`${url}start-sync?project=${heading.value.projectId}`, opts);
  return resp.status;
}

export async function startProject({ skipSync }) {
  let url = await getMilocUrl();
  setStatus('service', 'info', 'Starting project');
  const opts = { method: 'POST' };
  url = `${url}start-project?project=${heading.value.projectId}`;
  if (skipSync) url = `${url}&skipsync=true`;
  const resp = await fetch(url, opts);
  if (resp.status === 201) setExcelStatus('Sent to localization service', '');
  setStatus('service');
  return resp.status;
}

export async function cancelProject() {
  allowSyncToLangstore.value = false;
  allowSendForLoc.value = false;
  allowCancelProject.value = false;
  let url = await getMilocUrl();
  setStatus('service', 'info', 'Cancelling project');
  const opts = { method: 'POST' };
  url = `${url}cancel-project?project=${heading.value.projectId}`;
  const resp = await fetch(url, opts);
  if (resp.status === 200) setExcelStatus('Project cancelled', '');
  if (resp.status === 500) {
    const json = await resp.json();
    setStatus('service', 'error', 'Cancelling project', json.error);
    return resp.status;
  }
  setStatus('service', 'info', 'Successfully Cancelled Project', null, 5000);
  return resp.status;
}

export async function rolloutLang(
  languageCode,
  reroll = false,
  ep = 'start-rollout',
  statAction = 'Rolling out.',
) {
  let statNotes = `Lang: ${languageCode}`;
  if (ep === 'start-rollout') { statNotes = `${statNotes} - Reroll: ${reroll ? 'yes' : 'no'}`; }
  setExcelStatus(statAction, statNotes);
  const url = await getMilocUrl();
  const opts = { method: 'POST' };
  const resp = await fetch(`${url}${ep}?project=${heading.value.projectId}&languageCode=${languageCode}&reroll=${reroll}`, opts);
  return resp.json();
}

export async function createProject() {
  const url = await getMilocUrl();
  setStatus('service', 'info', 'Creating new project.');
  const body = `${origin}${heading.value.path}.json`;
  const opts = { method: 'POST', body };
  const resp = await fetch(`${url}create-project`, opts);
  if (resp.status === 201) {
    setExcelStatus('Project Created', '');
    canRefresh.value = false;
    const projectId = window.md5(body);
    heading.value = { ...heading.value, projectId };
    const values = [['Project ID', projectId]];
    const itemId = getItemId();
    await updateExcelTable({ itemId, tablename: 'settings', values });
    await preview(`${heading.value.path}.json`);
  } else if (resp.status === 500) {
    const json = await resp.json();
    setStatus('service', 'error', 'Creating project', json.error);
  }
  return resp.status;
}

export async function getServiceUpdates() {
  const url = await getMilocUrl();
  let count = 1;
  polling.value = true;
  const excelUpdated = setInterval(async () => {
    serviceStatus.value = 'connected';
    serviceStatusDate.value = new Date();
    if (!waiting && polling.value) {
      waiting = true;
      const json = await getProjectStatus(url);
      if (json) {
        projectStatus.value = json;
        // stop polling for project status if project cancelled
        if (json.projectStatus === 'cancelled') {
          clearInterval(excelUpdated);
          polling.value = false;
        }
      }
      waiting = false;
    }
    count += 1;
    // Stop syncing after an hour
    if (count > MAX_COUNT) {
      setStatus(
        'service',
        'info',
        'Sync stopped after 1 hour.',
        'Please refresh the page if you wish to see the latest updates on your project',
      );
      clearInterval(excelUpdated);
    }
  }, INTERVAL);
  return getProjectStatus(url);
}
