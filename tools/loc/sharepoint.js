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

let accessToken;
const BATCH_REQUEST_LIMIT = 20;

const getAccessToken = () => accessToken;

async function connect() {
  let connected = false;
  const { sp } = await getConfig();
  const publicClientApplication = new msal.PublicClientApplication(sp.clientApp);
  let account = publicClientApplication.getAllAccounts()[0];
  if (!account) {
    await publicClientApplication.loginPopup(sp.login);
    account = publicClientApplication.getAllAccounts()[0];
  }
  const accessTokenRequest = {
    scopes: ['files.readwrite', 'sites.readwrite.all'],
    account,
  };
  try {
    const res = await publicClientApplication.acquireTokenSilent(accessTokenRequest);
    accessToken = res.accessToken;
    connected = true;
  } catch (error) {
    // Acquire token silent failure, and send an interactive request
    if (error.name === 'InteractionRequiredAuthError') {
      try {
        const res = await publicClientApplication.acquireTokenPopup(accessTokenRequest);
        // Acquire token interactive success
        accessToken = res.accessToken;
        connected = true;
      } catch (err) {
        throw new Error(`Cannot connect to Sharepoint: ${err.message}`);
      }
    }
  }
  return connected;
}

function validateConnection() {
  if (!accessToken) {
    throw new Error('You need to sign-in first');
  }
}

function getAuthorizedRequestOption({
  body = null,
  json = true,
  method = 'GET',
} = {}) {
  validateConnection();
  const bearer = `Bearer ${accessToken}`;
  const headers = new Headers();
  headers.append('Authorization', bearer);
  if (json) {
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return options;
}

const loadSharepointData = (spBatchApi, payload) => {
  const options = getAuthorizedRequestOption({ method: 'POST' });
  options.body = JSON.stringify(payload);
  return fetch(spBatchApi, options);
};

function getSharepointFileRequest(spConfig, fileIndex, filePath) {
  return {
    id: fileIndex,
    url: `${spConfig.api.file.get.baseURI}${filePath}`.replace(spConfig.api.url, ''),
    method: 'GET',
  };
}

async function getSpViewUrl() {
  const { sp } = await getConfig();
  return sp.shareUrl;
}

async function getSpFiles(filePaths) {
  let index = 0;
  const spFilePromises = [];
  const { sp } = await getConfig();
  const spBatchApi = `${sp.api.batch.uri}`;

  while (index < filePaths.length) {
    const payload = { requests: [] };
    for (let i = 0; i < BATCH_REQUEST_LIMIT && index < filePaths.length; index += 1, i += 1) {
      const filePath = filePaths[index];
      payload.requests.push(getSharepointFileRequest(sp, index, filePath));
    }
    spFilePromises.push(loadSharepointData(spBatchApi, payload));
  }
  const spFileResponses = await Promise.all(spFilePromises);
  return Promise.all(spFileResponses.map((file) => file.json()));
}

async function getFile(doc) {
  if (doc && doc.sp && doc.sp.status === 200) {
    const response = await fetch(doc.sp['@microsoft.graph.downloadUrl']);
    return response.blob();
  }
  return undefined;
}

async function createFolder(folder) {
  validateConnection();
  const { sp } = await getConfig();

  const options = getAuthorizedRequestOption({ method: sp.api.directory.create.method });
  options.body = JSON.stringify(sp.api.directory.create.payload);

  const res = await fetch(`${sp.api.directory.create.baseURI}${folder}`, options);
  if (res.ok) {
    return res.json();
  }
  throw new Error(`Could not create folder: ${folder}`);
}

function getFolderFromPath(path) {
  if (path.includes('.')) {
    return path.substring(0, path.lastIndexOf('/'));
  }
  return path;
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
  const options = getAuthorizedRequestOption({ method: sp.api.file.createUploadSession.method });
  options.body = JSON.stringify(payload);

  const createdUploadSession = await fetch(`${sp.api.file.createUploadSession.baseURI}${dest}:/createUploadSession`, options);
  return createdUploadSession.ok ? createdUploadSession.json() : undefined;
}

async function uploadFile(sp, uploadUrl, file) {
  const options = getAuthorizedRequestOption({
    json: false,
    method: sp.api.file.upload.method,
  });
  // TODO API is limited to 60Mb, for more, we need to batch the upload.
  options.headers.append('Content-Length', file.size);
  options.headers.append('Content-Range', `bytes 0-${file.size - 1}/${file.size}`);
  options.headers.append('Prefer', 'bypass-shared-lock');
  options.body = file;
  return fetch(`${uploadUrl}`, options);
}

async function deleteFile(sp, filePath) {
  const options = getAuthorizedRequestOption({
    json: false,
    method: sp.api.file.delete.method,
  });
  options.headers.append('Prefer', 'bypass-shared-lock');
  return fetch(filePath, options);
}

async function renameFile(spFileUrl, filename) {
  const options = getAuthorizedRequestOption({ method: 'PATCH', body: JSON.stringify({ name: filename }) });
  options.headers.append('Prefer', 'bypass-shared-lock');
  return fetch(spFileUrl, options);
}

async function releaseUploadSession(sp, uploadUrl) {
  await deleteFile(sp, uploadUrl);
}

function getLockedFileNewName(filename) {
  const extIndex = filename.indexOf('.');
  const fileNameWithoutExtn = filename.substring(0, extIndex);
  const fileExtn = filename.substring(extIndex);
  return `${fileNameWithoutExtn}-locked-${Date.now()}${fileExtn}`;
}

async function createSessionAndUploadFile(sp, file, dest, filename) {
  const createdUploadSession = await createUploadSession(sp, file, dest, filename);
  const status = {};
  if (createdUploadSession) {
    const uploadSessionUrl = createdUploadSession.uploadUrl;
    if (!uploadSessionUrl) {
      return status;
    }
    status.sessionUrl = uploadSessionUrl;
    const uploadedFile = await uploadFile(sp, uploadSessionUrl, file);
    if (!uploadedFile) {
      return status;
    }
    if (uploadedFile.ok) {
      status.uploadedFile = await uploadedFile.json();
      status.success = true;
    } else if (uploadedFile.status === 423) {
      status.locked = true;
    }
  }
  return status;
}

async function getVersionOfFile(filePath, versionNumber) {
  validateConnection();
  const { sp } = await getConfig();
  const options = getAuthorizedRequestOption();
  const versionFile = await fetch(`${sp.api.file.get.baseURI}${filePath}:/versions/${versionNumber}/content`, options);
  if (versionFile.ok) {
    return versionFile.blob();
  }
  throw new Error(`Could not get version ${versionNumber} of ${filePath}`);
}

async function getFileMetadata(filePath) {
  validateConnection();
  const { sp } = await getConfig();
  const options = getAuthorizedRequestOption();
  const itemFields = await fetch(`${sp.api.file.get.baseURI}${filePath}:/listItem/fields`, options);
  if (itemFields.ok) {
    return itemFields.json();
  }
  if (itemFields.status === 404) {
    return { status: 404 };
  }
  throw new Error(`Could not get the file metadata ${filePath}`);
}

async function getFileVersionInfo(filePath) {
  validateConnection();
  const { sp } = await getConfig();
  const options = getAuthorizedRequestOption();
  options.method = 'GET';
  const versionInfo = await fetch(`${sp.api.file.update.baseURI}${filePath}:/versions/current`, options);
  if (versionInfo.ok) {
    const versionInfoJson = await versionInfo.json();
    return versionInfoJson.id;
  }
  throw new Error(`Could not get file version ${filePath}`);
}

async function updateFile(dest, metadata, customMetadata = {}) {
  validateConnection();
  const payload = {
    RolloutVersion: metadata.rolloutVersion,
    Rollout: metadata.rolloutTime,
    ...customMetadata,
  };
  const { sp } = await getConfig();
  const options = getAuthorizedRequestOption({
    method: sp.api.file.update.method,
    body: JSON.stringify(payload),
  });
  const updateMetadata = await fetch(`${sp.api.file.update.baseURI}${dest}:/listItem/fields`, options);
  if (updateMetadata.ok) {
    return updateMetadata.json();
  }
  throw new Error(`Could not update file with metadata ${metadata}`);
}

async function getMetadata(srcPath, file) {
  const metadata = {};
  if (file) {
    metadata.rolloutTime = new Date().toISOString();
    metadata.rolloutVersion = await getFileVersionInfo(srcPath);
  }
  return metadata;
}

async function copyFile(srcPath, destinationFolder, newName) {
  validateConnection();
  await createFolder(destinationFolder);
  const { sp } = await getConfig();
  const { baseURI } = sp.api.file.copy;
  const rootFolder = baseURI.split('/').pop();

  const payload = { ...sp.api.file.copy.payload, parentReference: { path: `${rootFolder}${destinationFolder}` } };
  if (newName) {
    payload.name = newName;
  }
  const options = getAuthorizedRequestOption({
    method: sp.api.file.copy.method,
    body: JSON.stringify(payload),
  });
  const copyStatusInfo = await fetch(`${baseURI}${srcPath}:/copy`, options);
  const statusUrl = copyStatusInfo.headers.get('Location');
  let copySuccess = false;
  let copyStatusJson = {};
  while (!copySuccess && copyStatusJson.status !== 'failed') {
    // eslint-disable-next-line no-await-in-loop
    const status = await fetch(statusUrl);
    if (status.ok) {
      // eslint-disable-next-line no-await-in-loop
      copyStatusJson = await status.json();
      copySuccess = copyStatusJson.status === 'completed';
    }
  }
  return copySuccess;
}

async function copyFileAndUpdateMetadata(srcPath, destinationFolder) {
  const copyStatus = await copyFile(srcPath, destinationFolder);
  const fileName = srcPath.split('/').pop();
  if (copyStatus) {
    const { sp } = await getConfig();
    const copiedFile = await fetch(`${sp.api.file.get.baseURI}${destinationFolder}/${getFileNameFromPath(srcPath)}`, getAuthorizedRequestOption());
    if (copiedFile.ok) {
      const copiedFileJson = await copiedFile.json();
      await updateFile(`${destinationFolder}/${fileName}`, await getMetadata(srcPath, copiedFileJson));
      return copiedFileJson;
    }
  }
  throw new Error(`Could not copy file ${destinationFolder}`);
}

async function saveFile(file, dest) {
  try {
    validateConnection();
    const folder = getFolderFromPath(dest);
    const filename = getFileNameFromPath(dest);
    await createFolder(folder);
    const { sp } = await getConfig();
    let uploadFileStatus = await createSessionAndUploadFile(sp, file, dest, filename);
    if (uploadFileStatus.locked) {
      await releaseUploadSession(sp, uploadFileStatus.sessionUrl);
      const lockedFileNewName = getLockedFileNewName(filename);
      const spFileUrl = `${sp.api.file.get.baseURI}${dest}`;
      await renameFile(spFileUrl, lockedFileNewName);
      const newLockedFilePath = `${folder}/${lockedFileNewName}`;
      const copyFileStatus = await copyFile(newLockedFilePath, folder, filename);
      if (copyFileStatus) {
        uploadFileStatus = await createSessionAndUploadFile(sp, file, dest, filename);
        if (uploadFileStatus.success) {
          await deleteFile(sp, `${sp.api.file.get.baseURI}${newLockedFilePath}`);
        }
      }
    }
    const uploadedFileJson = uploadFileStatus.uploadedFile;
    if (uploadedFileJson) {
      return { success: true, uploadedFileJson, path: dest };
    }
  } catch (error) {
    return { success: false, path: dest, errorMsg: error.message };
  }
  return { success: false, path: dest };
}

async function saveFileAndUpdateMetadata(srcPath, file, dest, customMetadata = {}) {
  const uploadedFile = await saveFile(file, dest);
  if (uploadedFile) {
    await updateFile(dest, await getMetadata(srcPath, uploadedFile), customMetadata);
    return uploadedFile;
  }
  throw new Error(`Could not upload file ${dest}`);
}

async function updateExcelTable(excelPath, tableName, values) {
  const { sp } = await getConfig();

  const options = getAuthorizedRequestOption({
    body: JSON.stringify({ values }),
    method: sp.api.excel.update.method,
  });

  const res = await fetch(
    `${sp.api.excel.update.baseURI}${excelPath}:/workbook/tables/${tableName}/rows/add`,
    options,
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error(`Failed to update excel sheet ${excelPath} table ${tableName}.`);
}

async function addWorksheetToExcel(excelPath, worksheetName) {
  const { sp } = await getConfig();

  const options = getAuthorizedRequestOption({
    body: JSON.stringify({ name: worksheetName }),
    method: 'POST',
  });

  const res = await fetch(
    `${sp.api.excel.update.baseURI}${excelPath}:/workbook/worksheets/add`,
    options,
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error(`Failed to add worksheet ${worksheetName} to ${excelPath}.`);
}

export {
  connect,
  copyFile,
  copyFileAndUpdateMetadata,
  getAccessToken,
  getAuthorizedRequestOption,
  getFile,
  getFileVersionInfo,
  getFileMetadata,
  getSpFiles,
  getSpViewUrl,
  getVersionOfFile,
  saveFile,
  saveFileAndUpdateMetadata,
  updateExcelTable,
  addWorksheetToExcel,
};
