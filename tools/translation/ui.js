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
/* eslint-disable no-use-before-define */
/*  global window, document */

import { getPathForLocale, getWorkflowForLocale, getConfig } from './config.js';
import { asyncForEach, createTag } from './utils.js';

import {
  saveFile,
  connect as connectToSP,
  updateTracker as updateTrackerWithSPStatus,
} from './sharepoint.js';

import {
  compute as computeTracker,
  init as initTracker,
  purge as purgeTracker,
} from './tracker.js';

import {
  connect as connectToGLaaS,
  createHandoff,
  getFile as getFileFromGLaaS,
  updateTracker as updateTrackerWithGLaaSStatus,
} from './glaas.js';

let tracker;
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const STATUS_LEVELS = ['level-0', 'level-4'];

function setStatus(msg, level = 'level-4') {
  status.classList.remove(STATUS_LEVELS.filter((l) => l !== level));
  status.classList.add(level);
  status.innerHTML = msg;
}

function loadingON(txt) {
  loading.classList.remove('hidden');
  setStatus(txt);
}

function loadingOFF() {
  loading.classList.add('hidden');
}

function setError(msg, error) {
  // TODO UI
  setStatus(msg, 'level-0');
  // eslint-disable-next-line no-console
  console.error(msg, error);
}

function setTrackerURL(trackerConfig) {
  const u = new URL(trackerConfig.url);
  document.getElementById('trackerURL').innerHTML = `<a href="${trackerConfig.sp}">${trackerConfig.name}</a>`;
}

async function preview(task, locale) {
  loadingON('Downloading file from GLaaS');
  const file = await getFileFromGLaaS(task, locale);

  const trackerConfig = await initTracker();
  const u = new URL(trackerConfig.url);
  const dest = `${u.pathname.slice(0, -5)}_preview/${await getPathForLocale(locale)}${task.filePath}`.toLowerCase();

  loadingON('Saving file to Sharepoint');
  await saveFile(file, dest);

  loadingOFF();
  window.open(`${u.origin}${dest.slice(0, -5)}`);
}

async function view(task, locale) {
  const trackerConfig = await initTracker();
  const u = new URL(trackerConfig.url);
  const dest = task.draftLocalePath;
  window.open(`${u.origin}${dest}`);
}

async function drawTracker() {
  if (!tracker) {
    return;
  }

  const container = document.getElementsByClassName('tracker')[0];
  container.innerHTML = '';

  const $table = createTag('table');
  let $tr = createTag('tr', { class: 'header' });
  let $th = createTag('th', { class: 'header' });
  $th.innerHTML = 'URL';
  $tr.appendChild($th);

  $th = createTag('th', { class: 'header' });
  $th.innerHTML = 'Source file';
  $tr.appendChild($th);

  await asyncForEach(tracker.locales, async (loc) => {
    $th = createTag('th', { class: 'header' });
    const wf = await getWorkflowForLocale(loc);
    $th.innerHTML = `${loc} (${wf.name})`;

    $tr.appendChild($th);
  });
  $table.appendChild($tr);

  let connectedToGLaaS = false;
  let taskFoundInGLaaS = false;
  let canSaveAll = false;

  await asyncForEach(tracker.urls, async (url) => {
    $tr = createTag('tr', { class: 'row' });
    $th = createTag('th', { class: 'row' });
    const u = new URL(url);
    $th.innerHTML = `<a href="${url}" target="_new">${u.pathname}</a>`;
    $tr.appendChild($th);

    $th = createTag('th');
    $th.innerHTML = 'Connect to Sharepoint';
    const doc = tracker.docs[url];
    let hasSourceFile = false;
    if (doc && doc.sp) {
      if (doc.sp.status === 200) {
        $th.innerHTML = `${doc.filePath}`;
        hasSourceFile = true;
      } else {
        $th.innerHTML = 'Source file not found!';
      }
    }
    $tr.appendChild($th);

    await asyncForEach(tracker.locales, async (locale) => {
      const $td = createTag('td');
      $td.innerHTML = 'N/A';
      const task = tracker[locale].find((t) => t.URL === url);
      if (task) {
        const glaas = (await getConfig()).glaas;
        if (task.glaas && task.glaas.status) {
          connectedToGLaaS = true;
          taskFoundInGLaaS = true;
          if (task.glaas.status === 'COMPLETED') {
            $td.innerHTML = '';
            if (task.sp) {
              canSaveAll = true;
              const $saveToLocalSP = createTag('button', { type: 'button' });
              let $view;
              if (task.sp.status !== 200) {
                $saveToLocalSP.innerHTML = 'Save';
              } else {
                $saveToLocalSP.innerHTML = 'Overwrite';

                $view = createTag('button', { type: 'button' });
                $view.innerHTML = 'View';
                $view.addEventListener('click', () => {
                  view(task, locale);
                });
              }
              $saveToLocalSP.addEventListener('click', () => {
                save(task, true, locale);
              });
              $td.appendChild($saveToLocalSP);
              if ($view) {
                $td.appendChild($view);
              }
            }
          } else {
            $td.innerHTML = task.glaas.status;
          }
        } else if (glaas.accessToken) {
          connectedToGLaaS = true;
          if (task.sp) {
            if (hasSourceFile) {
              $td.innerHTML = 'Ready for translation';
            } else {
              $td.innerHTML = 'No source';
            }
          }
        } else {
          $td.innerHTML = 'Connect to GLaaS first';
        }

        // if (task.sp && task.sp.status === 200) {
        //   $td.innerHTML += ' | File exists in Sharepoint, be careful';
        // }
      }

      $tr.appendChild($td);
    });

    $table.appendChild($tr);
  });

  if (canSaveAll) {
    $tr = createTag('tr', { class: 'row' });
    $th = createTag('th');
    $tr.appendChild($th);

    $th = createTag('th');
    $tr.appendChild($th);

    tracker.locales.forEach((locale) => {
      const $td = createTag('td');
      const $saveAllSP = createTag('button', { type: 'button' });
      $saveAllSP.innerHTML = `Save all ${locale} files in Sharepoint`;
      $saveAllSP.addEventListener('click', () => {
        saveAll(locale);
      });
      $td.appendChild($saveAllSP);
      $tr.appendChild($td);
    });

    $table.appendChild($tr);
  }

  container.appendChild($table);

  const sendPanel = document.getElementById('send');
  const refreshPanel = document.getElementById('refresh');
  const reloadPanel = document.getElementById('reload');
  if (!taskFoundInGLaaS) {
    // show the send button only if task has not been found in GLaaS
    if (connectedToGLaaS) {
      sendPanel.classList.remove('hidden');
    }
    reloadPanel.classList.remove('hidden');
    refreshPanel.classList.add('hidden');
  } else {
    sendPanel.classList.add('hidden');
    reloadPanel.classList.add('hidden');
    refreshPanel.classList.remove('hidden');
  }
}

async function sendTracker() {
  await asyncForEach(tracker.locales, async (locale) => {
    loadingON(`Creating ${locale} handoff in GLaaS`);
    await createHandoff(tracker, locale);
  });
  loadingON('Handoffs created in GLaaS. Updating the tracker status with status from GLaaS...');
  await updateTrackerWithGLaaSStatus(tracker);
  loadingON('Status updated! Updating UI.');
  await drawTracker();
  loadingOFF();
}

async function reloadTracker() {
  const trackerConfig = await initTracker();
  loadingON(`Purging tracker file`);
  await purgeTracker();
  let res;
  do {
    loadingON('Waiting for tracker to be available');
    res = await fetch(trackerConfig.url);
  } while(!res.ok);

  loadingON('Reloading the application');
  // full UI reload
  window.location.reload();

}

async function refresh() {
  loadingON('Updating the tracker status with status from Sharepoint...');
  await updateTrackerWithSPStatus(tracker);
  loadingON('Updating the tracker status with status from GLaaS...');
  await updateTrackerWithGLaaSStatus(tracker);
  loadingON('Status updated! Updating UI.');
  await drawTracker();
  loadingOFF();
}

async function save(task, doRefresh=true, locale) {
  const dest = `${task.draftLocaleFilePath}`.toLowerCase();

  if (task.sp && task.sp.status === 200) {
    // file exists in Sharepoint, confirm overwrite
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(`File ${dest} exists already. Are you sure you want to overwrite the current production version ?`);
    if (!confirm) return;
  }
  loadingON(`Downloading ${dest} file from GLaaS`);
  try {
    const file = await getFileFromGLaaS(task, locale);

    loadingON(`Saving ${dest} file to Sharepoint`);
    await saveFile(file, dest);

    loadingON(`File ${dest} is now in Sharepoint`);

    if (doRefresh) {
      loadingOFF();
      await refresh();
    }
  } catch (err) {
    setError('Could not save the file.', err);
    return;
  }
}

async function saveAll(locale) {
  await asyncForEach(tracker[locale], async (task) => {
    if (task.glaas) {
      await save(task, false, locale);
    }
  });
  loadingOFF();
  await refresh();
}

function setListeners() {
  document.querySelector('#send button').addEventListener('click', sendTracker);
  document.querySelector('#refresh button').addEventListener('click', refresh);
  document.querySelector('#reload button').addEventListener('click', reloadTracker);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function init() {
  setListeners();
  loadingON('Initializing the application');
  try {
    await getConfig();
  } catch(err) {
    setError('Something is wrong with the application config', err);
    return;
  }
  loadingON('Config loaded');
  loadingON('Initialiating the tracker');
  let trackerConfig;
  try {
    trackerConfig = await initTracker();
  } catch (err) {
    setError('Could not find a valid tracker URL', err);
    return;
  }
  loadingON(`Fetching the tracker ${trackerConfig.url}`);
  setTrackerURL(trackerConfig);
  tracker = await computeTracker();
  loadingON('Tracker loaded.');
  await drawTracker();
  loadingON('Connecting now to Sharepoint...');
  await connectToSP(async () => {
    loadingON('Connected to Sharepoint! Updating the tracker status with status from Sharepoint...');
    await updateTrackerWithSPStatus(tracker, async () => {
      loadingON('Status updated! Updating UI.');
      await drawTracker();
      loadingOFF();
    });
  });
  loadingON('Connecting now to GLaaS...');
  await connectToGLaaS(async () => {
    loadingON('Connected to GLaaS! Updating the tracker status with status from GLaaS...');
    await updateTrackerWithGLaaSStatus(tracker, async () => {
      loadingON('Status updated! Updating UI.');
      await drawTracker();
      loadingOFF();
    });
  });
  loadingON('Application loaded.');
  loadingOFF();
}

export {
  // eslint-disable-next-line import/prefer-default-export
  init,
};
