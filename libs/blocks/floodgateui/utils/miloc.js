import {
  allowSendForLoc,
  allowSyncToLangstore,
  heading,
  languages,
  projectStatus,
  serviceStatus,
  allowRollout,
  serviceStatusDate,
  allActionStatus,
  copyStatusCheck,
  deleteStatusCheck,
  promoteStatusCheck,
  cssStatusCopy,
  cssStatusDelete,
  cssStatusPromote,
  fgColor
} from './state.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import { origin } from '../../locui/utils/franklin.js';
import { setExcelStatus, setStatus } from './status.js';
import getServiceConfig from '../../../utils/service-config.js';
import '../../../deps/md5.min.js';
import { getStatus } from '../../locui/utils/franklin.js';
import { loadFgColor } from '../floodgate/index.js';

const DOT_MILO = '/.milo/config.json';
const MOCK_REFERRER = 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B12F9079D-E580-4407-973D-2330B171B2CB%7D&file=DemoFgUI.xlsx&action=default&mobileredirect=true';

const urlParams = new URLSearchParams(window.location.search);


const INTERVAL = 3000;
const MAX_COUNT = 1200; // 3000 x 1200 = 3600000s = 1 hour
const ROLLOUT_ALL_AVAILABLE = ['completed', 'translated'];

async function getMilocUrl() {
  const env = heading.value.env || null;
  const { miloc } = await getServiceConfig(origin, env);
  return miloc.url;
}

export async function getParamsFg(config) {
  await loadFgColor();
  const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
  const json = await getStatus('', editUrl);
  const resourcePath = json.resourcePath;
  const path = resourcePath.replace(/\.[^/.]+$/, '');
  let projectPath = path + '.xlsx';
  const adminPageUri = 'https://main--milo--adobecom.hlx.page?project=milo--adobecom&referrer=https://main--milo--adobecom.hlx.page';
  const fgShareUrl = config.sharepoint.site.fgShareUrl;
  const fgShareUrlColor = fgShareUrl.replace(/<fgColor>/g, fgColor.value);
  const fgRootFolder = config.sharepoint.site.fgRootFolder;
  const fgRootFolderColor = fgRootFolder.replace(/<fgColor>/g, fgColor.value);
  const params = {
    adminPageUri: adminPageUri,
    projectExcelPath: projectPath,
    shareUrl: config.sharepoint.site.shareUrl,
    fgShareUrl: fgShareUrlColor,
    rootFolder: config.sharepoint.site.rootFolder,
    fgRootFolder: fgRootFolderColor,
    promoteIgnorePaths: config.promoteIgnorePaths || [],
    driveId: config.sharepoint.site.driveId || '',
    fgColor: fgColor.value,
  };
  return params;
}

export async function postData(url, params) {
  const urlEncodedParams = new URLSearchParams(params).toString();
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncodedParams,
  });
  return resp.json();
}

export async function fetchStatusAction() {
  // fetch copy status
  const config = await getServiceConfigFg(origin);
  const paramsFg = await getParamsFg(config);
  const excelPath = paramsFg.projectExcelPath
  let params = { type: 'copy', projectExcelPath: excelPath, fgShareUrl: paramsFg.fgShareUrl, fgColor: fgColor.value};
  const copyStatus = await postData(config.stage.milofg.status.url, params);
  // fetch promote status
  params = { type: 'promote', fgShareUrl: paramsFg.fgShareUrl, fgColor: fgColor.value };
  const promoteStatus = await postData(config.stage.milofg.status.url, params);
  // fetch delete status
  params = { type: 'delete', fgShareUrl: paramsFg.fgShareUrl, fgColor: fgColor.value };
  const deleteStatus = await postData(config.stage.milofg.status.url, params);
  return({ copyStatus, promoteStatus, deleteStatus });
}

export async function copyToFloodgateTree() {
  try {
    copyStatusCheck.value = 'IN PROGRESS';
    setStatus('details', 'info', 'Copying files to the Floodgate Tree. Check the status card for further updates.');
    const config = await getServiceConfigFg(origin);
    const params = { ...await getParamsFg(config), spToken: accessToken };
    const url = config.stage.milofg.copy.url;

    const copyStatus = await postData(url, params);
    allActionStatus.value.copyStatus = copyStatus;
    copyStatusCheck.value = copyStatus.payload.action.status;
    cssStatusCopy.value = copyStatus.payload.action.status;

    setStatus('details', '', '');

    const intervalId = setInterval(async () => {
      const status = await fetchStatusAction();
      const newCopyStatus = status.copyStatus;
      allActionStatus.value = status;
      copyStatusCheck.value = newCopyStatus.payload.action.status;
      cssStatusCopy.value = newCopyStatus.payload.action.status;

      if (newCopyStatus.payload.action.status !== 'IN PROGRESS') {
        copyStatusCheck.value = newCopyStatus.payload.action.status;
        allActionStatus.value.copyStatus = newCopyStatus;
        cssStatusCopy.value = newCopyStatus.payload.action.status;
        clearInterval(intervalId);
      } else {
        cssStatusCopy.value = newCopyStatus.payload.action.status;
        allActionStatus.value.copyStatus = newCopyStatus;
      }
    }, 3000);

  } catch {
    copyStatusCheck.value = 'ERROR';
    setStatus('details', 'error', 'Error copying files to Floodgate Tree. Please check the excel sheet for further details.');
  }
}

export async function promoteFiles(doPublish) {
  try {
    setStatus('details', 'info', 'Promoting files to the Floodgate Tree. Check the status card for further updates.');
    const config = await getServiceConfigFg(origin);
    const params = { ...await getParamsFg(config), spToken: accessToken, doPublish };
    const url = config.stage.milofg.promote.url;

    const promoteStatus = await postData(url, params);
    allActionStatus.value.promoteStatus = promoteStatus;
    promoteStatusCheck.value = promoteStatus.payload.action.status;
    cssStatusPromote.value = promoteStatus.payload.action.status;

    setStatus('details', '', '');

    const intervalId = setInterval(async () => {
      const status = await fetchStatusAction();
      const newPromoteStatus = status.promoteStatus;
      allActionStatus.value = status;
      promoteStatusCheck.value = newPromoteStatus.payload.action.status;
      cssStatusPromote.value = newPromoteStatus.payload.action.status;

      if (newPromoteStatus.payload.action.status !== 'IN PROGRESS') {
        promoteStatusCheck.value = newPromoteStatus.payload.action.status;
        allActionStatus.value.promoteStatus = newPromoteStatus;
        cssStatusPromote.value = newPromoteStatus.payload.action.status;
        clearInterval(intervalId);
      } else {
        cssStatusPromote.value = newPromoteStatus.payload.action.status;
        allActionStatus.value.promoteStatus = newPromoteStatus;
      }
    }, 3000);

  } catch {
    promoteStatusCheck.value = 'ERROR';
    setStatus('details', 'error', 'Error while promoting files to Floodgate Tree.');
  }
}

export async function deleteFgTree() {
  try {
    setStatus('details', 'info', 'Deleting the Floodgate Tree. Check the status table for further updates.');
    const config = await getServiceConfigFg(origin);
    const params = { ...await getParamsFg(config), spToken: accessToken };
    const url = config.stage.milofg.delete.url;

    const deleteStatus = await postData(url, params);
    allActionStatus.value.deleteStatus = deleteStatus;
    deleteStatusCheck.value = deleteStatus.payload.action.status;
    cssStatusDelete.value = deleteStatus.payload.action.status;

    setStatus('details', '', '');

    const intervalId = setInterval(async () => {
      const status = await fetchStatusAction();
      const newDeleteStatus = status.deleteStatus;
      allActionStatus.value = status;
      deleteStatusCheck.value = newDeleteStatus.payload.action.status;
      cssStatusDelete.value = newDeleteStatus.payload.action.status;

      if (newDeleteStatus.payload.action.status !== 'IN PROGRESS') {
        deleteStatusCheck.value = newDeleteStatus.payload.action.status;
        allActionStatus.value.deleteStatus = newDeleteStatus;
        cssStatusDelete.value = newDeleteStatus.payload.action.status;
        clearInterval(intervalId);
      } else {
        cssStatusDelete.value = newDeleteStatus.payload.action.status;
        allActionStatus.value.deleteStatus = newDeleteStatus;
      }
    }, 3000);

  } catch {
    deleteStatusCheck.value = 'ERROR';
    setStatus('details', 'error', 'Error while deleting the Floodgate Tree.');
  }
}

export async function getServiceConfigFg(origin) {
  const resp = await fetch(`${origin}${DOT_MILO}`);
  if (!resp.ok) return { error: 'Could not fetch .milo/config.' };
  const json = await resp.json();
  const configs = {};
  json.floodgate.data.forEach((conf) => {
    const [confEnv, confService, confType, confUrl] = conf.key.split('.');
    configs[confEnv] ??= {};
    configs[confEnv][confService] ??= {};
    configs[confEnv][confService][confType] ??= {};

    // Check if confUrl is defined
    if (confUrl !== undefined) {
      configs[confEnv][confService][confType][confUrl] = conf.value;
    } else {
      configs[confEnv][confService][confType] = conf.value;
    }
  });
  configs.promoteIgnorePaths = [];
  json.promoteignorepaths.data.forEach((path) => {
    configs.promoteIgnorePaths.push(path.FilesToIgnoreFromPromote);
  });
  return configs;
}

function handleProjectStatusDetail(detail) {
  allowRollout.value = Object.keys(detail).some(
    (key) => ROLLOUT_ALL_AVAILABLE.includes(detail[key].status),
  );
  languages.value = [...languages.value.map((lang) => ({ ...lang, ...detail[lang.code] }))];
}

export async function getProjectStatus() {
  const url = await getMilocUrl();
  const resp = await fetch(`${url}project-status?project=${heading.value.projectId}`, { cache: 'reload' });
  const json = await resp.json();

  if (json.projectStatus === 'sync'
    || json.projectStatus === 'download'
    || json.projectStatus === 'start-glaas') {
    setStatus('service', 'info', json.projectStatusText);
  }

  if (json.projectStatus === 'sync-done') {
    setStatus('service');
    allowSyncToLangstore.value = true;
    allowSendForLoc.value = true;
  }

  if (json.projectStatus === 'waiting') {
    setStatus('service');
    allowSyncToLangstore.value = false;
    allowSendForLoc.value = false;
  }

  handleProjectStatusDetail(json);
  return json;
}

export async function startSync() {
  setStatus('service', 'info', 'Syncing documents to Langstore.');
  const url = await getMilocUrl();
  setExcelStatus('Sync to langstore/en.', '');
  const opts = { method: 'POST' };
  const resp = await fetch(`${url}start-sync?project=${heading.value.projectId}`, opts);
  return resp.status;
}

export async function getServiceUpdates() {
  const url = await getMilocUrl();
  let count = 1;
  const excelUpdated = setInterval(async () => {
    serviceStatus.value = 'connected';
    serviceStatusDate.value = new Date();
    projectStatus.value = await getProjectStatus(url);
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
