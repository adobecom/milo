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

import { asyncForEach } from './utils.js';
import getConfig from './config.js';

let accessToken;
const BATCH_REQUEST_LIMIT = 20;

async function connect(callback) {
  const { sp } = await getConfig();
  const publicClientApplication = new msal.PublicClientApplication(sp.clientApp);
  await publicClientApplication.loginPopup(sp.login);
  const account = publicClientApplication.getAllAccounts()[0];
  const accessTokenRequest = {
    scopes: ['files.readwrite', 'sites.readwrite.all'],
    account,
  };

  try {
    const res = await publicClientApplication.acquireTokenSilent(accessTokenRequest);
    accessToken = res.accessToken;
    if (callback) await callback();
  } catch (error) {
    // Acquire token silent failure, and send an interactive request
    if (error.name === 'InteractionRequiredAuthError') {
      try {
        const res = await publicClientApplication.acquireTokenPopup(accessTokenRequest);
        // Acquire token interactive success
        accessToken = res.accessToken;
        if (callback) await callback();
      } catch (err) {
        throw new Error(`Cannot connect to Sharepoint: ${err.message}`);
      }
    }
  }
}

function validateConnection() {
  if (!accessToken) {
    throw new Error('You need to sign-in first');
  }
}

function getAuthorizedRequestOption() {
  validateConnection();
  const bearer = `Bearer ${accessToken}`;
  const headers = new Headers();
  headers.append('Authorization', bearer);
  return {
    method: 'GET',
    headers,
  };
}

const loadSharepointData = (spBatchApi, payload) => {
  const options = getAuthorizedRequestOption();
  options.headers.append('Accept', 'application/json');
  options.headers.append('Content-Type', 'application/json');
  options.body = JSON.stringify(payload);
  options.method = 'POST';
  return fetch(spBatchApi, options);
};

function getSharepointFileRequest(spConfig, fileIndex, filePath) {
  return {
    id: fileIndex,
    url: `${spConfig.api.file.get.baseURI}${filePath}`.replace(spConfig.api.url, ''),
    method: 'GET',
  };
}

async function getSpFiles(projectFiles) {
  let index = 0;
  const spFilePromises = [];
  const { sp } = await getConfig();
  const spBatchApi = `${sp.api.batch.uri}`;

  while (index < projectFiles.length) {
    const payload = { requests: [] };
    for (let i = 0; i < BATCH_REQUEST_LIMIT && index < projectFiles.length; index += 1, i += 1) {
      const projectFile = projectFiles[index];
      const filePath = projectFile.draftLocaleFilePath || projectFile.filePath;
      payload.requests.push(getSharepointFileRequest(sp, index, filePath));
    }
    spFilePromises.push(loadSharepointData(spBatchApi, payload));
  }
  const spFileResponses = await Promise.all(spFilePromises);
  return Promise.all(spFileResponses.map((file) => file.json()));
}

function getEnFilePaths(project) {
  const enFilePaths = [];
  project.urls.forEach((u) => {
    enFilePaths.push(project.docs[u]);
  });
  return enFilePaths;
}

function getLocaleFilePaths(project) {
  let localeFilePaths = [];
  project.locales.forEach((l) => {
    localeFilePaths = localeFilePaths.concat(project[l]);
  });
  return localeFilePaths;
}

async function updateProjectWithSpStatus(project, callback) {
  if (!project) {
    return;
  }
  const filePaths = [].concat(getEnFilePaths(project), getLocaleFilePaths(project));
  const spBatchFiles = await getSpFiles(filePaths);
  spBatchFiles.forEach((spFiles) => {
    if (spFiles && spFiles.responses) {
      spFiles.responses.forEach((file) => {
        const filePath = filePaths[file.id];
        const spFileStatus = file.status;
        filePath.sp = spFileStatus === 200 ? file.body : {};
        filePath.sp.status = spFileStatus;
      });
    }
  });
  if (callback) await callback();
}

async function getFile(project, url) {
  const doc = project.docs[url];
  if (doc && doc.sp && doc.sp.status === 200) {
    const response = await fetch(doc.sp['@microsoft.graph.downloadUrl']);
    return response.blob();
  }
  return undefined;
}

async function getFiles(project, locale) {
  validateConnection();
  const files = [];
  await asyncForEach(project[locale], async (task) => {
    const url = task.URL;
    const file = await getFile(project, url);
    if (file) {
      file.path = task.filePath;
      file.URL = url;
      files.push(file);
    }
  });

  return files;
}

async function createFolder(folder) {
  validateConnection();
  const { sp } = await getConfig();

  const options = getAuthorizedRequestOption();
  options.headers.append('Accept', 'application/json');
  options.headers.append('Content-Type', 'application/json');
  options.method = sp.api.directory.create.method;
  options.body = JSON.stringify(sp.api.directory.create.payload);

  const res = await fetch(`${sp.api.directory.create.baseURI}${folder}`, options);
  if (res.ok) {
    return res.json();
  }
  throw new Error(`Could not create folder: ${folder}`);
}

function getFolderNameFromPath(path) {
  return path.substring(0, path.lastIndexOf('/'));
}

function getFileNameFromPath(path) {
  return path.split('/').pop().split('/').pop();
}

async function createUploadSession(sp, file, dest, filename) {
  const payload = {
    ...sp.api.file.createUploadSession.payload,
    description: 'Preview file',
    fileSize: file.size,
    name: filename,
  };
  const options = getAuthorizedRequestOption();
  options.headers.append('Accept', 'application/json');
  options.headers.append('Content-Type', 'application/json');
  options.method = sp.api.file.createUploadSession.method;
  options.body = JSON.stringify(payload);

  const createdUploadSession = await fetch(`${sp.api.file.createUploadSession.baseURI}${dest}:/createUploadSession`, options);
  return createdUploadSession.ok ? createdUploadSession.json() : undefined;
}

async function uploadFile(sp, uploadUrl, file) {
  const options = getAuthorizedRequestOption();
  // TODO API is limited to 60Mb, for more, we need to batch the upload.
  options.headers.append('Content-Length', file.size);
  options.headers.append('Content-Range', `bytes 0-${file.size - 1}/${file.size}`);
  options.method = sp.api.file.upload.method;
  options.body = file;

  const uploadedFile = await fetch(`${uploadUrl}`, options);
  return uploadedFile.ok ? uploadedFile.json() : undefined;
}

async function saveFile(file, dest) {
  validateConnection();
  const folder = getFolderNameFromPath(dest);
  const filename = getFileNameFromPath(dest);
  await createFolder(folder);
  const { sp } = await getConfig();
  const createdUploadSession = await createUploadSession(sp, file, dest, filename);
  if (createdUploadSession) {
    const uploadedFile = await uploadFile(sp, createdUploadSession.uploadUrl, file);
    if (uploadedFile) {
      return uploadedFile;
    }
  }
  throw new Error(`Could not upload file ${dest}`);
}

async function getFileVersionInfo(filePath) {
  validateConnection();
  const { sp } = await getConfig();
  const options = getAuthorizedRequestOption();
  options.headers.append('Accept', 'application/json');
  options.headers.append('Content-Type', 'application/json');
  options.method = 'GET';
  const versionInfo = await fetch(`${sp.api.file.update.baseURI}${filePath}:/versions/current`, options);
  if (versionInfo.ok) {
    const versionInfoJson = await versionInfo.json();
    return versionInfoJson.id;
  }
  throw new Error(`Could not get file version ${filePath}`);
}

async function updateFile(dest, metadata) {
  validateConnection();
  const payload = {
    RolloutVersion: metadata.rolloutVersion,
    Rollout: metadata.rolloutTime,
  };
  const options = getAuthorizedRequestOption();
  options.headers.append('Accept', 'application/json');
  options.headers.append('Content-Type', 'application/json');
  const { sp } = await getConfig();
  options.method = sp.api.file.update.method;
  options.body = JSON.stringify(payload);
  const updateMetadata = await fetch(`${sp.api.file.update.baseURI}${dest}:/listItem/fields`, options);
  if (updateMetadata.ok) {
    return updateMetadata.json();
  }
  throw new Error(`Could not update file with metadata ${metadata}`);
}

async function saveFileAndUpdateMetadata(srcPath, file, dest) {
  const uploadedFile = await saveFile(file, dest);
  const metadata = {};
  if (uploadedFile) {
    metadata.rolloutTime = uploadedFile.lastModifiedDateTime;
    metadata.rolloutVersion = await getFileVersionInfo(srcPath);
    await updateFile(dest, metadata);
    return uploadedFile;
  }
  throw new Error(`Could not upload file ${dest}`);
}

export { getFiles, saveFile, saveFileAndUpdateMetadata, connect, updateProjectWithSpStatus };
