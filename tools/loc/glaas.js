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
import { asyncForEach, getPathFromUrl } from './utils.js';
import { getFiles } from './sharepoint.js';
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

function getGLaaSLanguage(language) {
  return language === 'en' ? 'en-GB' : language;
}

function createGLaaSTask(glaas, language, gLaaSProjectName) {
  const localeAPI = glaas.localeApi(language);
  const payload = {
    ...localeAPI.tasks.create.payload,
    name: gLaaSProjectName,
    targetLocales: [getGLaaSLanguage(language)],
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

async function addAssetsToCreatedTask(glaas, language, files, gLaaSProjectName) {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index > 0 ? index : ''}`, file, file.path.replace(/\//gm, '_'));
  });

  return fetch(`${glaas.url}${(glaas.localeApi(language)).tasks.assets.baseURI}/${gLaaSProjectName}/assets?targetLanguages=${getGLaaSLanguage(language)}`, {
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
  return fetch(`${glaas.url}${(glaas.localeApi(language)).tasks.updateStatus.baseURI}/${gLaaSProjectName}/${getGLaaSLanguage(language)}/updateStatus`, {
    method: 'POST',
    headers,
    body: data,
  });
}

async function sendToGLaaS(project, language) {
  const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, language);
  const files = await getFiles(project, language);
  if (!files || files.length === 0) {
    throw new Error('No valid files found to send for translation');
  }
  const { glaas } = await getConfig();
  const createdGLaaSTask = await createGLaaSTask(glaas, language, gLaaSProjectName);
  if (!createdGLaaSTask.ok) {
    throw new Error('Cannot create the GLaaS task');
  }
  const addedAssets = await addAssetsToCreatedTask(glaas, language, files, gLaaSProjectName);
  if (!addedAssets.ok) {
    throw new Error('Cannot add assets to created GLaaS Task');
  }
  const taskStatus = await markTaskAsCreated(glaas, language, gLaaSProjectName);
  if (!taskStatus.ok) {
    throw new Error('Cannot update GLaaS task as newly created.');
  }
}

function getGLaaSTaskStatus(glaas, language, gLaaSProjectName) {
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${((glaas.localeApi(language))).tasks.get.baseURI}/${gLaaSProjectName}`, {
    method: 'GET',
    headers,
  });
}

function getPathFromAssetName(assetName) {
  return assetName.replace(/_/gm, '/');
}

function updateProjectWithTaskStatus(project, language, gLaaSProjectName, gLaaSTaskStatus) {
  const taskStatus = gLaaSTaskStatus.status;
  const defaultStatus = taskStatus === 'CREATED' ? 'IN PROGRESS' : taskStatus;
  gLaaSTaskStatus.assets.forEach((asset) => {
    const path = getPathFromAssetName(asset.name);
    const task = project[language].find((t) => t.filePath === path);
    if (!task) {
      return;
    }
    task.glaas = task.glaas || {};
    task.glaas.status = asset.status !== 'DRAFT' ? asset.status : defaultStatus;
    task.glaas.assetPath = `${gLaaSProjectName}/assets/${getGLaaSLanguage(language)}/${asset.name}`;
  });
}

async function updateProject(project, callback) {
  if (!project) {
    return;
  }
  const { glaas } = await getConfig();
  await asyncForEach(project.languages, async (language) => {
    const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, language);
    const status = await getGLaaSTaskStatus(glaas, language, gLaaSProjectName);
    const statusJson = await status.json();
    if (statusJson && statusJson[0] && statusJson[0].assets) {
      updateProjectWithTaskStatus(project, language, gLaaSProjectName, statusJson[0]);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Could not find assets in ${gLaaSProjectName}...`);
    }
  });

  if (callback) await callback();
}

async function getFile(task, language) {
  const { glaas } = await getConfig();
  const response = await fetch(
    `${glaas.url}${(glaas.localeApi(language)).tasks.assets.baseURI}/${task.glaas.assetPath}`,
    { headers: getAuthorizationHeaders(glaas) },
  );

  if (response.ok) {
    // Stream response into the file.
    return response.blob();
  }
  throw new Error(`Cannot download the file from GLaaS: ${task.glaas.assetPath}`);
}

export { sendToGLaaS, updateProject, connect, getFile };
