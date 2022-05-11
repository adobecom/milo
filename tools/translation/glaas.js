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

function createGLaaSTask(glaas, locale, gLaaSProjectName) {
  const localeAPI = glaas.localeApi(locale);
  const payload = {
    ...localeAPI.tasks.create.payload,
    name: gLaaSProjectName,
    targetLocales: [locale],
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

async function addAssetsToCreatedTask(glaas, locale, files, gLaaSProjectName) {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index > 0 ? index : ''}`, file, file.path.replace(/\//gm, '_'));
  });

  return fetch(`${glaas.url}${(glaas.localeApi(locale)).tasks.assets.baseURI}/${gLaaSProjectName}/assets?targetLanguages=${locale}`, {
    method: 'POST',
    headers: getAuthorizationHeaders(glaas),
    body: formData,
  });
}

function markTaskAsCreated(glaas, locale, gLaaSProjectName) {
  const data = new URLSearchParams();
  data.append('newStatus', 'CREATED');
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${(glaas.localeApi(locale)).tasks.updateStatus.baseURI}/${gLaaSProjectName}/${locale}/updateStatus`, {
    method: 'POST',
    headers,
    body: data,
  });
}

async function sendToGLaaS(project, locale) {
  const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, locale);
  const files = await getFiles(project, locale);
  if (!files || files.length === 0) {
    throw new Error('No valid files found to send for translation');
  }
  const { glaas } = await getConfig();
  const createdGLaaSTask = await createGLaaSTask(glaas, locale, gLaaSProjectName);
  if (!createdGLaaSTask.ok) {
    throw new Error('Cannot create the GLaaS task');
  }
  const addedAssets = await addAssetsToCreatedTask(glaas, locale, files, gLaaSProjectName);
  if (!addedAssets.ok) {
    throw new Error('Cannot add assets to created GLaaS Task');
  }
  const taskStatus = await markTaskAsCreated(glaas, locale, gLaaSProjectName);
  if (!taskStatus.ok) {
    throw new Error('Cannot update GLaaS task as newly created.');
  }
}

function getGLaaSTaskStatus(glaas, locale, gLaaSProjectName) {
  const headers = getAuthorizationHeaders(glaas);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  return fetch(`${glaas.url}${((glaas.localeApi(locale))).tasks.get.baseURI}/${gLaaSProjectName}`, {
    method: 'GET',
    headers,
  });
}

function getPathFromAssetName(assetName) {
  return assetName.replace(/_/gm, '/');
}

function updateProjectWithTaskStatus(project, locale, gLaaSProjectName, gLaaSTaskStatus) {
  const taskStatus = gLaaSTaskStatus.status;
  const defaultStatus = taskStatus === 'CREATED' ? 'IN PROGRESS' : taskStatus;
  gLaaSTaskStatus.assets.forEach((asset) => {
    const path = getPathFromAssetName(asset.name);
    const task = project[locale].find((t) => t.filePath === path);
    if (!task) {
      return;
    }
    task.glaas = task.glaas || {};
    task.glaas.status = asset.status !== 'DRAFT' ? asset.status : defaultStatus;
    task.glaas.assetPath = `${gLaaSProjectName}/assets/${locale}/${asset.name}`;
  });
}

async function updateProject(project, callback) {
  if (!project) {
    return;
  }
  const { glaas } = await getConfig();
  await asyncForEach(project.locales, async (locale) => {
    const gLaaSProjectName = computeGLaaSProjectName(project.url, project.name, locale);
    const status = await getGLaaSTaskStatus(glaas, locale, gLaaSProjectName);
    const statusJson = await status.json();
    if (statusJson && statusJson[0] && statusJson[0].assets) {
      updateProjectWithTaskStatus(project, locale, gLaaSProjectName, statusJson[0]);
    } else {
      // eslint-disable-next-line no-console
      console.error(`Could not find assets in ${gLaaSProjectName}...`);
    }
  });

  if (callback) await callback();
}

async function getFile(task, locale) {
  const { glaas } = await getConfig();
  const response = await fetch(
    `${glaas.url}${(await glaas.localeApi(locale)).tasks.assets.baseURI}/${task.glaas.assetPath}`,
    { headers: getAuthorizationHeaders(glaas) },
  );

  if (response.ok) {
    // Stream response into the file.
    return response.blob();
  }
  throw new Error(`Cannot download the file from GLaaS: ${task.glaas.assetPath}`);
}

export { sendToGLaaS, updateProject, connect, getFile };
