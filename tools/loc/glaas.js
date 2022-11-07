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
import { getPathFromUrl, stripExtension } from './utils.js';
import { getSpFiles } from './sharepoint.js';
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

async function getGLaaSTaskStatus(tasksAPI, gLaaSProjectName) {
  const { glaas } = await getConfig();
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${tasksAPI.tasks.get.baseURI}/${gLaaSProjectName}`, {
    method: 'GET',
    headers,
  });
}

function createGLaaSTask(glaas, tasksAPI, language, gLaaSProjectName) {
  const payload = {
    ...tasksAPI.tasks.create.payload,
    name: gLaaSProjectName,
    targetLocales: [language],
  };
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${tasksAPI.tasks.create.uri}`, {
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

async function getAssetFromGLaaS(tasksAPI, assetPath) {
  const { glaas } = await getConfig();
  const response = await fetch(
    `${glaas.url}${tasksAPI.tasks.assets.baseURI}/${assetPath}`,
    { headers: getAuthorizationHeaders(glaas) },
  );

  if (response.ok) {
    return response.blob();
  }
  throw new Error(`Cannot download the file from GLaaS: ${assetPath}`);
}

async function addAssetsToCreatedTask(glaas, glaasProjectInfo, files) {
  const formData = new FormData();
  files.forEach((fileInfo, index) => {
    const file = fileInfo.blob || fileInfo;
    const filePath = file.path;
    const assetName = getAssetNameFromPath(filePath);
    formData.append(`file${index > 0 ? index : ''}`, file, assetName);
    formData.append(`asset${index > 0 ? index : ''}`, new Blob([JSON.stringify({
      assetName,
      metadata: { 'source-preview-url': `${stripExtension(filePath)}?taskName=${glaasProjectInfo.gLaaSProjectName}&locale=${glaasProjectInfo.language}` },
    })], { type: 'application/json; charset=utf-8' }), '_asset_metadata_');
  });

  return fetch(`${glaas.url}${glaasProjectInfo.tasksAPI.tasks.assets.baseURI}/${glaasProjectInfo.gLaaSProjectName}/assets?targetLanguages=${glaasProjectInfo.language}`, {
    method: 'POST',
    headers: getAuthorizationHeaders(glaas),
    body: formData,
  });
}

function markTaskAsCreated(glaas, projectInfo) {
  const data = new URLSearchParams();
  data.append('newStatus', 'CREATED');
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${projectInfo.tasksAPI.tasks.updateStatus.baseURI}/${projectInfo.gLaaSProjectName}/${projectInfo.language}/updateStatus`, {
    method: 'POST',
    headers,
    body: data,
  });
}

async function taskHasNoAssets(taskStatus) {
  const statusJson = await taskStatus.json();
  return statusJson && statusJson[0] && statusJson[0]?.assets?.length === 0;
}

async function triggerGLaaSProject(projectInfo, files) {
  const { glaas } = await getConfig();
  const createdGLaaSTask = await createGLaaSTask(
    glaas,
    projectInfo.tasksAPI,
    projectInfo.language,
    projectInfo.gLaaSProjectName,
  );
  let emptyTaskExists = false;
  if (createdGLaaSTask.status === 409) {
    const existingTask = await getGLaaSTaskStatus(
      projectInfo.tasksAPI,
      projectInfo.gLaaSProjectName,
    );
    if (await taskHasNoAssets(existingTask)) {
      emptyTaskExists = true;
    }
  }
  if (!createdGLaaSTask.ok && !emptyTaskExists) {
    throw new Error('Cannot create the GLaaS task');
  }
  const addedAssets = await addAssetsToCreatedTask(glaas, projectInfo, files);
  if (!addedAssets.ok) {
    throw new Error('Cannot add assets to created GLaaS Task');
  }
  const taskStatus = await markTaskAsCreated(glaas, projectInfo);
  if (!taskStatus.ok) {
    throw new Error('Cannot update GLaaS task as newly created.');
  }
}

async function getFilesFromSpToSendForAltLang(urls) {
  const langstoreFilePaths = [];
  const filesToBeSentForAltLang = [];
  urls.forEach((urlInfo) => {
    langstoreFilePaths.push(urlInfo.langInfo.languageFilePath);
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
  await Promise.all(filesToBeSentForAltLang.map(async (file) => {
    try {
      const response = await fetch(file['@microsoft.graph.downloadUrl']);
      const fileBlob = await response.blob();
      fileBlob.path = file.path;
      fileBlobsToBeSentForAltLang.push(fileBlob);
    } catch (error) {
      // Do nothing
    }
  }));
  return fileBlobsToBeSentForAltLang;
}

async function getTranslatedFileFromGLaaS(langInfo, asset) {
  const fileInfo = {};
  try {
    const assetPath = getGLaaSAssetPathFromAsset(langInfo, asset);
    const filePath = getPathFromAssetName(asset.name);
    const file = await getAssetFromGLaaS(langInfo.tasksAPI, assetPath);
    file.path = `/langstore/${langInfo.language}${filePath}`;
    fileInfo.success = true;
    fileInfo.file = file;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Could not get file from GLaaS ${error.message}`);
    fileInfo.success = false;
  }
  return fileInfo;
}

async function getTranslatedFilesFromGLaaS(langInfo) {
  const fileBlobsToBeSentForAltLang = [];
  const gLaaSStatus = langInfo.statusInfo;
  const filesFromGLaaS = await Promise.all(
    gLaaSStatus.assets.map(
      (asset) => getTranslatedFileFromGLaaS(langInfo, asset),
    ),
  );
  filesFromGLaaS.forEach((fileInfo) => {
    if (fileInfo.success) {
      fileBlobsToBeSentForAltLang.push(fileInfo.file);
    }
  });
  return fileBlobsToBeSentForAltLang;
}

async function updateAltLangContent(project, langInfo, altLangProjectName, altLangInfo) {
  const subProject = project.translationProjects.get(langInfo.language);
  const files = subProject.urls;
  const fileBlobsToBeSentForAltLang = await (langInfo.statusInfo
    ? getTranslatedFilesFromGLaaS(langInfo) : getFilesFromSpToSendForAltLang(files));
  if (fileBlobsToBeSentForAltLang.length === 0) {
    return altLangProjectName;
  }
  await triggerGLaaSProject({
    gLaaSProjectName: altLangProjectName,
    language: altLangInfo.language,
    tasksAPI: altLangInfo.glaasTasksAPI,
  }, fileBlobsToBeSentForAltLang);
  return altLangProjectName;
}

async function getAltLangTaskStatus(project, altLangInfo) {
  const altLangGLaaSProjectName = `${computeGLaaSProjectName(project.url, project.name, altLangInfo.language)}`;
  const altLangStatus = await getGLaaSTaskStatus(
    altLangInfo.glaasTasksAPI,
    altLangGLaaSProjectName,
  );
  return { taskName: altLangGLaaSProjectName, taskStatus: altLangStatus };
}

async function getOrCreateAltLangTask(project, langInfo, altLangInfo) {
  const altLangStatus = await getAltLangTaskStatus(project, altLangInfo);
  if (altLangStatus.taskStatus.status === 404 || await taskHasNoAssets(altLangStatus.taskStatus)) {
    await updateAltLangContent(project, langInfo, altLangStatus.taskName, altLangInfo);
  }
  return getAltLangTaskStatus(project, altLangInfo);
}

function updateAssetStatusForTask(languageTask, filePathsToPositions, langInfo, defaultStatus) {
  if (languageTask.length === 0) {
    return;
  }
  langInfo.statusInfo.assets.forEach((asset) => {
    let path = getPathFromAssetName(asset.name);
    if (langInfo.pathModifier) {
      path = langInfo.pathModifier(languageTask.language, path);
    }
    const isAltLang = languageTask?.altLangInfo?.language === langInfo.language;
    const positionPrefix = 'urls|';
    const positions = filePathsToPositions.get(path)
      .filter((position) => position.startsWith(positionPrefix));
    if (positions.length === 1) {
      const position = positions[0];
      const positionSuffix = position.endsWith('|langstoreDoc') ? '|langstoreDoc' : '|doc';
      const url = position.substring(
        position.indexOf(positionPrefix) + positionPrefix.length,
        position.indexOf(positionSuffix),
      );
      const task = languageTask.urls.get(url);
      if (!task) {
        return;
      }
      const toBeUpdated = isAltLang ? task.altLangInfo : task.langInfo;
      toBeUpdated.glaas = toBeUpdated.glaas || {};
      const assetStatus = asset.status !== 'DRAFT' ? asset.status : defaultStatus;
      const assetPath = getGLaaSAssetPathFromAsset(langInfo, asset);
      toBeUpdated.status = assetStatus;
      toBeUpdated.glaas.assetPath = assetPath;
    }
  });
}

function removeLangstorePrefix(language, path) {
  return path.replace(`/langstore/${language}/`, '/');
}

function updateProjectWithTaskStatus(project, langInfo, altLangInfo) {
  const taskStatus = altLangInfo ? altLangInfo?.statusInfo?.status : langInfo?.statusInfo?.status;
  const defaultStatus = taskStatus === 'CREATED' ? 'IN PROGRESS' : taskStatus;
  const languageTask = project.translationProjects.get(langInfo.language);
  const filePathsToPositions = project.filePathsToReferencePositions;
  languageTask.status = defaultStatus;
  if (langInfo?.statusInfo) {
    updateAssetStatusForTask(languageTask, filePathsToPositions, langInfo, defaultStatus);
  }
  if (altLangInfo) {
    altLangInfo.pathModifier = removeLangstorePrefix;
    updateAssetStatusForTask(languageTask, filePathsToPositions, altLangInfo, defaultStatus);
  }
}

async function executeAltLangFlow(project, langInfo, altLangInfo, statusOnly) {
  const altLanguage = altLangInfo.language;
  const altLangTaskInfo = statusOnly
    ? await getAltLangTaskStatus(project, altLangInfo)
    : await getOrCreateAltLangTask(project, langInfo, altLangInfo);
  const altLangStatusJson = await altLangTaskInfo.taskStatus.json();
  if (altLangStatusJson && altLangStatusJson[0] && altLangStatusJson[0]?.assets?.length > 0) {
    project.projectStarted = true;
    const altLangTaskStatusInfo = altLangStatusJson[0];
    const altLangGLaaSProjectInfo = {
      language: altLanguage,
      gLaaSProjectName: altLangTaskInfo.taskName,
      statusInfo: altLangTaskStatusInfo,
    };
    updateProjectWithTaskStatus(project, langInfo, altLangGLaaSProjectInfo);
  } else {
    // eslint-disable-next-line no-console
    console.error(`Could not find assets in ${altLangTaskInfo?.taskName}...`);
    throw new Error(`Could not find assets in ${altLangTaskInfo?.taskName}`);
  }
}

async function sendToGLaaS(project, subproject, files) {
  const { language } = subproject;
  const isNotEnglish = language !== 'en';
  const tasksAPI = subproject.glaasTasksAPI;
  if (isNotEnglish) {
    const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, language);
    await triggerGLaaSProject({ gLaaSProjectName, language, tasksAPI }, files);
  } else {
    const altLanguage = subproject?.altLangInfo?.language;
    if (altLanguage) {
      await executeAltLangFlow(
        project,
        { language, skipTranslation: true, tasksAPI },
        subproject.altLangInfo,
      );
    }
  }
}

async function updateSubProject(project, subproject) {
  const language = subproject[0];
  const projectInfo = subproject[1];
  const updateStatus = { updated: true, language };

  function updateErrorStatus(errorMessage) {
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    updateStatus.updated = false;
    updateStatus.errorMsg = errorMessage;
  }

  try {
    const isEnglish = language === 'en';
    const altLanguage = projectInfo?.altLangInfo?.language;
    if (isEnglish && altLanguage) {
      await executeAltLangFlow(project, { language, isEnglish }, projectInfo.altLangInfo, true);
    } else {
      const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, language);
      const status = await getGLaaSTaskStatus(projectInfo.glaasTasksAPI, gLaaSProjectName);
      const statusJson = await status.json();
      if (statusJson && statusJson[0] && statusJson[0]?.assets?.length > 0) {
        project.projectStarted = true;
        const langInfo = {
          language,
          gLaaSProjectName,
          statusInfo: statusJson[0],
          tasksAPI: projectInfo.glaasTasksAPI,
        };
        const isGLaaSProjectCompleted = statusJson[0].status === 'COMPLETED';
        if (isGLaaSProjectCompleted && altLanguage) {
          await executeAltLangFlow(project, langInfo, projectInfo.altLangInfo);
        } else {
          updateProjectWithTaskStatus(project, langInfo);
        }
      } else {
        updateErrorStatus(`Could not find assets in ${gLaaSProjectName}...`);
      }
    }
  } catch (error) {
    updateErrorStatus(`Error occurred when trying to update project with GLaaS Info ${error.message}`);
  }
  return updateStatus;
}

async function updateProject(project, callback) {
  if (!project) {
    return;
  }
  await Promise.all(
    [...project.translationProjects].map((subproject) => updateSubProject(project, subproject)),
  );
  if (callback) await callback();
}

export {
  sendToGLaaS,
  updateProject,
  connect,
  getAssetFromGLaaS,
};
