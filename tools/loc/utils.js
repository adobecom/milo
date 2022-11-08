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
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const STATUS_LEVELS = ['level-0', 'level-4'];

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

export function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  }
  return el;
}

export function getPathFromUrl(url) {
  return new URL(url).pathname;
}

export function setStatus(msg, level = 'level-4') {
  status.classList.remove(STATUS_LEVELS.filter((l) => l !== level));
  status.classList.add(level);
  status.innerHTML = msg;
}

export function loadingON(txt) {
  loading.classList.remove('hidden');
  setStatus(txt);
}

export function loadingOFF() {
  loading.classList.add('hidden');
}

export function getSharepointLocationFromUrl(url) {
  let path = getPathFromUrl(url);
  if (!path) {
    return undefined;
  }
  if (path.endsWith('/')) {
    path += 'index';
  } else if (path.endsWith('.html')) {
    path = path.slice(0, -5);
  }
  return path;
}

