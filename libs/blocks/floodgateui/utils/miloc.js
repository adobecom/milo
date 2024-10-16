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
  copyCompleteRender,
  enablePromoteButton,
  enableDeleteButton,
} from './state.js';
import { accessToken } from '../../../tools/sharepoint/state.js';
import { origin, getStatus } from '../../locui/utils/franklin.js';
import { setExcelStatus, setStatus } from './status.js';
import getServiceConfig from '../../../utils/service-config.js';
import '../../../deps/md5.min.js';

const DOT_MILO = '/.milo/config.json';
const DOT_EVENT = '/.milo/edge-worker-config.json';
const MOCK_REFERRER = 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B12F9079D-E580-4407-973D-2330B171B2CB%7D&file=DemoFgUI.xlsx&action=default&mobileredirect=true';

const urlParams = new URLSearchParams(window.location.search);

const INTERVAL = 3000;
const MAX_COUNT = 1200; // 3000 x 1200 = 3600000s = 1 hour
const ROLLOUT_ALL_AVAILABLE = ['completed', 'translated'];

function getPromoteIgnorePaths(config) {
  let promoteIgnorePaths = config.promoteIgnorePaths.get(heading.value.fgColor);
  if (promoteIgnorePaths === undefined
      || (Array.isArray(promoteIgnorePaths) && promoteIgnorePaths.length === 0)) {
    promoteIgnorePaths = config.promoteIgnorePaths.get('pink') || ['/.milo', '/.helix', '/metadata.xlsx'];
  }
  return promoteIgnorePaths;
}

export async function getParamsFg(config) {
  const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
  const json = await getStatus('', editUrl);
  const { resourcePath } = json;
  const path = resourcePath.replace(/\.[^/.]+$/, '');
  const projectPath = `${path}.xlsx`;
  const adminPageUri = window.location.href;
  const params = {
    adminPageUri,
    projectExcelPath: projectPath,
  };
  return params;
}

export async function postData(url, params) {
  const urlEncodedParams = new URLSearchParams(params).toString();
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Token': accessToken  },
    body: urlEncodedParams,
  });
  return resp.json();
}

export async function getServiceConfigFg(origin) {
  const resp = await fetch(`${origin}${DOT_MILO}`);
  if (!resp.ok) return { error: 'Could not fetch .milo/config.' };
  const json = await resp.json();
  const configs = {};
  const driveIdRowIndex = json.configs.data.findIndex((row) => row.key === 'prod.sharepoint.driveId');
  const siteRowIndex = json.configs.data.findIndex((row) => row.key === 'prod.sharepoint.site');
  let configDriveId;
  let configSite;
  if (driveIdRowIndex !== -1) {
    configDriveId = json.configs.data[driveIdRowIndex].value;
  }
  if (siteRowIndex !== -1) {
    configSite = json.configs.data[siteRowIndex].value;
  }
  const enablePromoteIndex = json.floodgate.data.findIndex((row) => row.key === 'sharepoint.site.enablePromote');
  if (enablePromoteIndex !== -1) {
    enablePromoteButton.value = json.floodgate.data[enablePromoteIndex].value === 'true';
  }
  const enableDeleteIndex = json.floodgate.data.findIndex((row) => row.key === 'sharepoint.site.enableDelete');
  if (enableDeleteIndex !== -1) {
    enableDeleteButton.value = json.floodgate.data[enableDeleteIndex].value === 'true';
  }
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
  if (driveIdRowIndex !== -1) {
    configs.driveId = configDriveId;
  }
  if (siteRowIndex !== -1) {
    configs.spSite = configSite;
  }
  configs.promoteIgnorePaths = new Map();
  json.promoteignorepaths.data.forEach((color) => {
    const paths = (color.paths.trim() === '') ? [] : color.paths.trim().split(',').map((item) => item.trim());
    configs.promoteIgnorePaths.set(color.color, paths);
  });
  return configs;
}

export async function fetchStatusAction() {
  // fetch copy status
  const config = await getServiceConfigFg(origin);
  const paramsFg = await getParamsFg(config);
  const excelPath = paramsFg.projectExcelPath;
  const env = heading.value.env;
  let params = { type: 'copy', projectExcelPath: excelPath, adminPageUri: paramsFg.adminPageUri };
  const copyStatus = await postData(config[env].milofg.status.url, params);
  // fetch promote status
  params = { type: 'promote', adminPageUri: paramsFg.adminPageUri, fgColor: heading.value.fgColor };
  const promoteStatus = await postData(config[env].milofg.status.url, params);
  // fetch delete status
  params = { type: 'delete', adminPageUri: paramsFg.adminPageUri, fgColor: heading.value.fgColor };
  const deleteStatus = await postData(config[env].milofg.status.url, params);
  return ({ copyStatus, promoteStatus, deleteStatus });
}

export async function copyToFloodgateTree() {
  try {
    copyStatusCheck.value = 'IN PROGRESS';
    setStatus('details', 'info', 'Copying files to the Floodgate Tree. Check the status card for further updates.');
    const config = await getServiceConfigFg(origin);
    const params = { ...await getParamsFg(config) };
    const env = heading.value.env;
    const { url } = config[env].milofg.copy;

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
        copyCompleteRender.value = copyCompleteRender.value + 1;
        clearInterval(intervalId);
      } else {
        cssStatusCopy.value = newCopyStatus.payload.action.status;
        allActionStatus.value.copyStatus = newCopyStatus;
      }
    }, 30000);
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
    params.enablePromote = enablePromoteButton.value;
    const env = heading.value.env;
    const { url } = config[env].milofg.promote;

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
    }, 30000);
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
    params.enableDelete = enableDeleteButton.value;
    const env = heading.value.env;
    const { url } = config[env].milofg.delete;

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
