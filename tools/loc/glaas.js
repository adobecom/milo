/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import getConfig from './config.js';
import { asyncForEach, getAltLanguage, getPathFromUrl, stripExtension } from './utils.js';
import { getFiles, getSpFiles } from './sharepoint.js';
import { PROJECTS_ROOT_PATH } from './project.js';

const LOCALSTORAGE_ITEM = 'glaas-auth-token';

function computeGLaaSProjectName(url, name, locale) {
  let pathname = getPathFromUrl(url);
  pathname = pathname.replace(PROJECTS_ROOT_PATH, '');
  const fileName = name.replace('.xlsx', '');
  const root = pathname.substring(0, pathname.lastIndexOf('/'));
  const tn = `${root}/${fileName}/${locale}`;
  return tn.replace(/\//gm, '_');
}

function getAuthorizationHeaders(gLaaS) {
  const headers = new Headers();
  headers.append('X-GLaaS-ClientId', gLaaS.clientId);
  headers.append('X-GLaaS-AuthToken', gLaaS.accessToken);
  return headers;
}

async function validateSession(token) {
  const { glaas } = await getConfig();
  const authToken = token || glaas.accessToken;
  // client must validate token
  const response = await fetch(`${glaas.url}${glaas.api.session.check.uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'X-GLaaS-ClientId': glaas.clientId,
      'X-GLaaS-AuthToken': authToken,
    },
  });
  if (!response.ok) {
    throw new Error('Could not validate the GLaaS session');
  }
}

function getTokenFromLocalStorage() {
  return localStorage.getItem(LOCALSTORAGE_ITEM);
}

async function validateSessionWithToken() {
  const token = getTokenFromLocalStorage();
  if (token) {
    try {
      await validateSession(token);
    } catch (error) {
      localStorage.removeItem(LOCALSTORAGE_ITEM);
      return null;
    }
  }
  return token;
}

function setGLaaSAccessToken(newToken, glaas) {
  glaas.accessToken = newToken;
  localStorage.setItem(LOCALSTORAGE_ITEM, newToken);
}

async function setGLaaSAccessTokenAndValidate(newToken, glaas, callback) {
  setGLaaSAccessToken(newToken, glaas);
  await validateSessionWithToken();
  if (callback) await callback();
}

function triggerUserAuthenticationFlow(glaas, callback) {
  window.setGLaaSAccessToken = async (newToken) => {
    await setGLaaSAccessTokenAndValidate(newToken, glaas, callback);
  };
  const url = `${glaas.url}${glaas.authorizeURI}?response_type=token&state=home&client_id=${glaas.clientId}&redirect_uri=${glaas.redirectURI}`;
  window.open(url, 'Connect to GLaaS', 'width=500,height=800');
}

async function connect(callback) {
  const token = await validateSessionWithToken();
  const { glaas } = await getConfig();
  if (!token) {
    triggerUserAuthenticationFlow(glaas, callback);
  } else {
    setGLaaSAccessToken(token, glaas);
    if (callback) await callback();
  }
}

async function getGLaaSTaskStatus(language, gLaaSProjectName) {
  const { glaas } = await getConfig();
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${((glaas.localeApi(language))).tasks.get.baseURI}/${gLaaSProjectName}`, {
    method: 'GET',
    headers,
  });
}

function createGLaaSTask(glaas, language, gLaaSProjectName) {
  const localeAPI = glaas.localeApi(language);
  const payload = {
    ...localeAPI.tasks.create.payload,
    name: gLaaSProjectName,
    targetLocales: [language],
  };
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${localeAPI.tasks.create.uri}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

function getPathFromAssetName(assetName) {
  return assetName.replace(/_/gm, '/');
}

function getGLaaSAssetPathFromAsset(langInfo, asset) {
  return `${langInfo.gLaaSProjectName}/assets/${langInfo.language}/${asset.name}`;
}

function getAssetNameFromPath(path) {
  return path.replace(/\//gm, '_');
}

async function getAssetFromGLaaS(language, assetPath) {
  const { glaas } = await getConfig();
  const response = await fetch(
    `${glaas.url}${(glaas.localeApi(language)).tasks.assets.baseURI}/${assetPath}`,
    { headers: getAuthorizationHeaders(glaas) },
  );

  if (response.ok) {
    return response.blob();
  }
  throw new Error(`Cannot download the file from GLaaS: ${assetPath}`);
}

async function addAssetsToCreatedTask(glaas, language, files, gLaaSProjectName) {
  const formData = new FormData();
  files.forEach((file, index) => {
    const filePath = file.path;
    const assetName = getAssetNameFromPath(filePath);
    formData.append(`file${index > 0 ? index : ''}`, file, assetName);
    formData.append(`asset${index > 0 ? index : ''}`, new Blob([JSON.stringify({
      assetName,
      metadata: { 'source-preview-url': `${stripExtension(filePath)}?taskName=${gLaaSProjectName}&locale=${language}` },
    })], { type: 'application/json; charset=utf-8' }), '_asset_metadata_');
  });

  return fetch(`${glaas.url}${(glaas.localeApi(language)).tasks.assets.baseURI}/${gLaaSProjectName}/assets?targetLanguages=${language}`, {
    method: 'POST',
    headers: getAuthorizationHeaders(glaas),
    body: formData,
  });
}

function markTaskAsCreated(glaas, language, gLaaSProjectName) {
  const data = new URLSearchParams();
  data.append('newStatus', 'CREATED');
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${(glaas.localeApi(language)).tasks.updateStatus.baseURI}/${gLaaSProjectName}/${language}/updateStatus`, {
    method: 'POST',
    headers,
    body: data,
  });
}

async function taskHasNoAssets(taskStatus) {
  const statusJson = await taskStatus.json();
  return statusJson && statusJson[0] && statusJson[0]?.assets?.length === 0;
}

async function triggerGLaaSProject(name, language, files) {
  const { glaas } = await getConfig();
  const createdGLaaSTask = await createGLaaSTask(glaas, language, name);
  let emptyTaskExists = false;
  if (createdGLaaSTask.status === 409) {
    const existingTask = await getGLaaSTaskStatus(language, name);
    if (await taskHasNoAssets(existingTask)) {
      emptyTaskExists = true;
    }
  }
  if (!createdGLaaSTask.ok && !emptyTaskExists) {
    throw new Error('Cannot create the GLaaS task');
  }
  const addedAssets = await addAssetsToCreatedTask(glaas, language, files, name);
  if (!addedAssets.ok) {
    throw new Error('Cannot add assets to created GLaaS Task');
  }
  const taskStatus = await markTaskAsCreated(glaas, language, name);
  if (!taskStatus.ok) {
    throw new Error('Cannot update GLaaS task as newly created.');
  }
}

async function getFilesFromSpToSendForAltLang(tasks) {
  const langstoreFilePaths = [];
  const filesToBeSentForAltLang = [];
  tasks.forEach((task) => {
    langstoreFilePaths.push(task.languageFilePath);
  });
  const spBatchFiles = await getSpFiles(langstoreFilePaths);
  spBatchFiles.forEach((spFiles) => {
    if (spFiles && spFiles.responses) {
      spFiles.responses.forEach((file) => {
        const filePath = langstoreFilePaths[file.id];
        const spFileStatus = file.status;
        const fileBody = spFileStatus === 200 ? file.body : {};
        const lastModified = new Date(fileBody.lastModifiedDateTime);
        const altLangLastFetched = fileBody.AltLangLastFetched
          ? new Date(fileBody.AltLangLastFetched) : undefined;
        if (!altLangLastFetched || lastModified > altLangLastFetched) {
          fileBody.path = filePath;
          filesToBeSentForAltLang.push(fileBody);
        }
      });
    }
  });
  const fileBlobsToBeSentForAltLang = [];
  await asyncForEach(filesToBeSentForAltLang, async (file) => {
    const response = await fetch(file['@microsoft.graph.downloadUrl']);
    const fileBlob = await response.blob();
    fileBlob.path = file.path;
    fileBlobsToBeSentForAltLang.push(fileBlob);
  });
  return fileBlobsToBeSentForAltLang;
}

async function getTranslatedFilesFromGLaaS(langInfo) {
  const fileBlobsToBeSentForAltLang = [];
  const gLaaSStatus = langInfo.statusInfo;
  await asyncForEach(gLaaSStatus.assets, async (asset) => {
    const assetPath = getGLaaSAssetPathFromAsset(langInfo, asset);
    const filePath = getPathFromAssetName(asset.name);
    const file = await getAssetFromGLaaS(langInfo.language, assetPath);
    file.path = `/langstore/${langInfo.language}${filePath}`;
    fileBlobsToBeSentForAltLang.push(file);
  });
  return fileBlobsToBeSentForAltLang;
}

async function updateAltLangContent(project, langInfo, altLangProjectName, altLangCode) {
  const tasks = project[langInfo.language];
  const fileBlobsToBeSentForAltLang = await (langInfo.statusInfo
    ? getTranslatedFilesFromGLaaS(langInfo) : getFilesFromSpToSendForAltLang(tasks));
  if (fileBlobsToBeSentForAltLang.length === 0) {
    return altLangProjectName;
  }
  await triggerGLaaSProject(altLangProjectName, altLangCode, fileBlobsToBeSentForAltLang);
  return altLangProjectName;
}

async function getAltLangTaskStatus(project, altLanguage) {
  const altLangGLaaSProjectName = `${computeGLaaSProjectName(project.url, project.name, altLanguage)}`;
  const altLangStatus = await getGLaaSTaskStatus(altLanguage, altLangGLaaSProjectName);
  return { taskName: altLangGLaaSProjectName, taskStatus: altLangStatus };
}

async function getOrCreateAltLangTask(project, langInfo, altLanguage) {
  const altLangStatus = await getAltLangTaskStatus(project, altLanguage);
  if (altLangStatus.taskStatus.status === 404 || await taskHasNoAssets(altLangStatus.taskStatus)) {
    await updateAltLangContent(project, langInfo, altLangStatus.taskName, altLanguage);
  }
  return getAltLangTaskStatus(project, altLanguage);
}

function updateAssetStatusForTask(languageTask, langInfo, defaultStatus) {
  if (languageTask.length === 0) {
    return;
  }
  langInfo.statusInfo.assets.forEach((asset) => {
    let path = getPathFromAssetName(asset.name);
    if (langInfo.pathModifier) {
      path = langInfo.pathModifier(languageTask[0].language, path);
    }
    const task = languageTask.find((t) => t.filePath === path);
    if (!task) {
      return;
    }
    task.glaas = task.glaas || {};
    const assetStatus = asset.status !== 'DRAFT' ? asset.status : defaultStatus;
    const assetPath = getGLaaSAssetPathFromAsset(langInfo, asset);
    task.glaas[langInfo.statusResultProps.status] = assetStatus;
    task.glaas[langInfo.statusResultProps.assetPath] = assetPath;
    task.glaas[langInfo.statusResultProps.combinedStatus] = defaultStatus;
  });
}

function removeLangstorePrefix(language, path) {
  return path.replace(`/langstore/${language}/`, '/');
}

function updateProjectWithTaskStatus(project, langInfo, altLangInfo) {
  const taskStatus = altLangInfo ? altLangInfo?.statusInfo?.status : langInfo?.statusInfo?.status;
  const defaultStatus = taskStatus === 'CREATED' ? 'IN PROGRESS' : taskStatus;
  const languageTask = project[langInfo.language];
  if (langInfo?.statusInfo) {
    updateAssetStatusForTask(languageTask, langInfo, defaultStatus);
  }
  if (altLangInfo) {
    altLangInfo.pathModifier = removeLangstorePrefix;
    updateAssetStatusForTask(languageTask, altLangInfo, defaultStatus);
  }
}

async function executeAltLangFlow(project, langInfo, altLanguage, statusOnly) {
  const altLangTaskInfo = statusOnly
    ? await getAltLangTaskStatus(project, altLanguage)
    : await getOrCreateAltLangTask(project, langInfo, altLanguage);
  const altLangStatusJson = await altLangTaskInfo.taskStatus.json();
  if (altLangStatusJson && altLangStatusJson[0] && altLangStatusJson[0]?.assets?.length > 0) {
    const altLangTaskStatusInfo = altLangStatusJson[0];
    const altLangInfo = {
      language: altLanguage,
      gLaaSProjectName: altLangTaskInfo.taskName,
      statusInfo: altLangTaskStatusInfo,
      statusResultProps: { status: 'altLangStatus', assetPath: 'altLangAssetPath', combinedStatus: 'altLangCombinedStatus' },
    };
    updateProjectWithTaskStatus(project, langInfo, altLangInfo);
  } else {
    // eslint-disable-next-line no-console
    console.error(`Could not find assets in ${altLangTaskInfo.taskName}...`);
  }
}

async function sendToGLaaS(project, language) {
  const skipTranslation = !project[language][0]?.skipLanguageTranslation;
  if (skipTranslation) {
    const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, language);
    const files = await getFiles(project, language);
    if (!files || files.length === 0) {
      throw new Error('No valid files found to send for translation');
    }
    await triggerGLaaSProject(gLaaSProjectName, language, files);
  } else {
    const altLanguage = getAltLanguage(project, language);
    if (altLanguage) {
      await executeAltLangFlow(project, { language, skipTranslation: true }, altLanguage);
    }
  }
}

async function updateProject(project, callback) {
  if (!project) {
    return;
  }
  await asyncForEach(project.languages, async (language) => {
    const skipTranslation = project[language]?.length > 0
      && project[language][0].skipLanguageTranslation;
    const altLanguage = getAltLanguage(project, language);
    if (skipTranslation && altLanguage) {
      await executeAltLangFlow(project, { language, skipTranslation }, altLanguage, true);
    } else {
      const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, language);
      const status = await getGLaaSTaskStatus(language, gLaaSProjectName);
      const statusJson = await status.json();
      if (statusJson && statusJson[0] && statusJson[0]?.assets?.length > 0) {
        const langInfo = {
          language,
          gLaaSProjectName,
          statusInfo: statusJson[0],
          statusResultProps: { status: 'status', assetPath: 'assetPath', combinedStatus: 'combinedStatus' },
        };
        const isGLaaSProjectCompleted = statusJson[0].status === 'COMPLETED';
        if (isGLaaSProjectCompleted && altLanguage) {
          await executeAltLangFlow(project, langInfo, altLanguage);
        } else {
          updateProjectWithTaskStatus(project, langInfo);
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(`Could not find assets in ${gLaaSProjectName}...`);
      }
    }
  });

  if (callback) await callback();
}

async function getFile(task, language) {
  const assetPath = task.altlanguage === language
    ? task.glaas.altLangAssetPath : task.glaas.assetPath;
  return getAssetFromGLaaS(language, assetPath);
}

export { sendToGLaaS, updateAltLangContent, getGLaaSTaskStatus, updateProject, connect, getFile };
