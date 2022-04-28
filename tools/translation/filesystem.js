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
/* global */
import { asyncForEach } from './utils.js';
import getConfig from './config.js';

async function getFile(dirHandle, path) {
  let parentDirHandle = dirHandle;
  const folders = path.split('/');
  await asyncForEach(folders, async (folder, i) => {
    if (folder && i < folders.length - 1) {
      parentDirHandle = await parentDirHandle.getDirectoryHandle(folder);
    }
  });
  const fileHandle = await parentDirHandle.getFileHandle(folders[folders.length - 1]);
  if (fileHandle) {
    return fileHandle.getFile();
  }
  throw new Error(`Could not find fileHandle for ${path}`);
}

async function getFiles(dirHandle, tracker, locale) {
  if (!dirHandle) {
    throw new Error('Not valid directory handle provided');
  }
  const files = [];
  await asyncForEach(tracker[locale], async (t) => {
    // eslint-disable-next-line no-underscore-dangle
    const path = t._filePath;
    const file = await getFile(dirHandle, path);

    file.path = path;
    file.URL = t.URL;

    if (!file) {
      throw new Error(`Could not find file for ${path}.`);
    }

    files.push(file);
  });

  return files;
}

async function saveFile(dirHandle, task, locale) {
  if (!dirHandle) {
    throw new Error('No directory handle provided');
  }

  // eslint-disable-next-line no-underscore-dangle
  const path = `/${locale}${task._filePath}`;
  let parentDirHandle = dirHandle;
  const folders = path.split('/');
  await asyncForEach(folders, async (folder, i) => {
    if (folder && i < folders.length - 1) {
      parentDirHandle = await parentDirHandle.getDirectoryHandle(folder, { create: true });
    }
  });

  const fileHandle = await parentDirHandle.getFileHandle(
    folders[folders.length - 1],
    { create: true },
  );

  const glaas = (await getConfig()).glaas;

  const writable = await fileHandle.createWritable();
  // eslint-disable-next-line no-underscore-dangle
  const response = await fetch(`${glaas.url}${await glaas.localeApi(locale).tasks.assets.baseURI}/${task._assetPath}`, {
    headers: {
      'X-GLaaS-ClientId': glaas.clientId,
      'X-GLaaS-AuthToken': glaas.accessToken,
    },
  });
  // Stream the response into the file.
  await response.body.pipeTo(writable);
}

export {
  getFiles,
  saveFile,
};
