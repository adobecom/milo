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

import getConfig from './config.js';
import { asyncForEach, createTag, getPathFromUrl } from './utils.js';
import { saveFile, connect as connectToSP, updateProjectWithSpStatus as updateSPStatus } from './sharepoint.js';
import { init as initProject } from './project.js';
import { connect as connectToGLaaS, sendToGLaaS, getFile as getFileFromGLaaS, updateProject as updateGLaaSStatus } from './glaas.js';

let projectDetail;
const status = document.getElementById('status');
const loading = document.getElementById('loading');
const STATUS_LEVELS = ['level-0', 'level-4'];
const MAX_RETRIES = 5;

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

function setProjectUrl(project) {
  const projectName = project.name.replace(/\.[^/.]+$/, '').replaceAll('_', ' ');
  document.getElementById('project-url').innerHTML = `<a href="${project.sp}">${projectName}</a>`;
}

async function view(task) {
  window.open(`${task.sp.webUrl}`);
}

function getProjectDetailContainer() {
  const container = document.getElementsByClassName('project-detail')[0];
  container.innerHTML = '';
  return container;
}

function createRow(classValue = 'default') {
  return createTag('tr', { class: `${classValue}` });
}

function createColumn(innerHtml, classValue = 'default') {
  const $th = createTag('th', { class: `${classValue}` });
  if (innerHtml) {
    $th.innerHTML = innerHtml;
  }
  return $th;
}

function createHeaderColumn(innerHtml) {
  return createColumn(innerHtml, 'header');
}

async function appendLocales($tr, config, locales) {
  await asyncForEach(locales, async (locale) => {
    const gLaaSWorkflow = await config.getWorkflowForLocale(locale);
    const localeAndGLaaSWF = `${locale} (${gLaaSWorkflow.name})`;
    $tr.appendChild(createHeaderColumn(localeAndGLaaSWF));
  });
}

async function createTableWithHeaders(config) {
  const $table = createTag('table');
  const $tr = createRow('header');
  $tr.appendChild(createHeaderColumn('URL'));
  $tr.appendChild(createHeaderColumn('Source file'));
  await appendLocales($tr, config, projectDetail.locales);
  $table.appendChild($tr);
  return $table;
}

function getAnchorHtml(url) {
  return `<a href="${url}" target="_new">${getPathFromUrl(url)}</a>`;
}

function getSharepointStatus(url) {
  let sharepointStatus = 'Connect to Sharepoint';
  const doc = projectDetail.docs[url];
  let hasSourceFile = false;
  if (doc && doc.sp) {
    if (doc.sp.status === 200) {
      sharepointStatus = `${doc.filePath}`;
      hasSourceFile = true;
    } else {
      sharepointStatus = 'Source file not found!';
    }
  }
  return { hasSourceFile, msg: sharepointStatus };
}

function isSentToGLaaS(task) {
  return task?.glaas?.status;
}

function fileAlreadySavedInSharepoint(task) {
  return task.sp.status === 200;
}

function createButton(innerHtml) {
  const $button = createTag('button', { type: 'button' });
  $button.innerHTML = innerHtml;
  return $button;
}

function getPersistButtons(task, locale) {
  const fileInSharepoint = fileAlreadySavedInSharepoint(task);
  const $saveButton = createButton(fileInSharepoint ? 'Overwrite' : 'Save');
  $saveButton.addEventListener('click', async () => { await save(task, locale); });
  if (fileInSharepoint) {
    const $viewButton = createButton('View');
    $viewButton.addEventListener('click', () => { view(task); });
    return [$saveButton, $viewButton];
  }
  return [$saveButton];
}

function getGLaaSStatus(config, locale, url, hasSourceFile) {
  const gLaaSStatus = { innerHtml: 'N/A', taskFoundInGLaaS: false, canSaveAll: false };
  const localeTask = projectDetail[locale].find((task) => task.URL === url);
  if (!localeTask) {
    return gLaaSStatus;
  }
  gLaaSStatus.innerHtml = 'Connect to GLaaS first';
  const gLaaSConfig = config.glaas;
  const taskInGLaaS = isSentToGLaaS(localeTask);
  if (taskInGLaaS) {
    gLaaSStatus.innerHtml = taskInGLaaS;
    gLaaSStatus.taskFoundInGLaaS = true;
    if (taskInGLaaS === 'COMPLETED' && localeTask.sp) {
      gLaaSStatus.canSaveAll = true;
      gLaaSStatus.persistButtons = getPersistButtons(localeTask, locale);
    }
  } else if (gLaaSConfig.accessToken) {
    if (localeTask.sp) {
      gLaaSStatus.innerHtml = hasSourceFile ? 'Ready for translation' : 'No source';
    }
  }
  return gLaaSStatus;
}

async function displayProjectDetail() {
  if (!projectDetail) {
    return;
  }
  const config = await getConfig();
  const container = getProjectDetailContainer();
  const $table = await createTableWithHeaders(config);

  const connectedToGLaaS = config.glaas.accessToken;
  let taskFoundInGLaaS = false;
  let canSaveAll = false;

  await asyncForEach(projectDetail.urls, async (url) => {
    const $tr = createRow();
    const pageUrl = getAnchorHtml(url);
    $tr.appendChild(createColumn(pageUrl));
    const sharepointStatus = getSharepointStatus(url);
    $tr.appendChild(createColumn(sharepointStatus.msg));
    await asyncForEach(projectDetail.locales, async (locale) => {
      const $td = createTag('td');
      const gLaaSStatus = getGLaaSStatus(config, locale, url, sharepointStatus.hasSourceFile);
      if (gLaaSStatus.persistButtons) {
        gLaaSStatus.persistButtons.forEach((button) => $td.appendChild(button));
      } else {
        $td.innerHTML = gLaaSStatus.innerHtml;
      }
      if (gLaaSStatus.taskFoundInGLaaS) {
        taskFoundInGLaaS = gLaaSStatus.taskFoundInGLaaS;
      }
      if (gLaaSStatus.canSaveAll) {
        canSaveAll = gLaaSStatus.canSaveAll;
      }
      $tr.appendChild($td);
    });

    $table.appendChild($tr);
  });

  if (canSaveAll) {
    const finalRow = createRow();
    finalRow.appendChild(createColumn());
    finalRow.appendChild(createColumn());

    projectDetail.locales.forEach((locale) => {
      const $td = createTag('td');
      const $saveAllButton = createButton('Save all');
      $saveAllButton.addEventListener('click', () => { saveAll(locale); });
      $td.appendChild($saveAllButton);
      finalRow.appendChild($td);
    });

    $table.appendChild(finalRow);
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

async function sendForTranslation() {
  await asyncForEach(projectDetail.locales, async (locale) => {
    loadingON(`Creating ${locale} handoff in GLaaS`);
    await sendToGLaaS(projectDetail, locale);
  });
  loadingON('Handoffs created in GLaaS. Updating the project with status from GLaaS...');
  await updateGLaaSStatus(projectDetail);
  loadingON('Status updated! Updating UI.');
  await displayProjectDetail();
  loadingOFF();
}

async function fetchProjectFile(url, retryAttempt) {
  const response = await fetch(url);
  if (!response.ok && retryAttempt <= MAX_RETRIES) {
    await fetchProjectFile(url, retryAttempt + 1);
  }
  return response;
}

async function reloadProjectFile() {
  const projectFile = await initProject();
  loadingON('Purging project file');
  await projectFile.purge();
  loadingON('Waiting for project file to be available');
  await fetchProjectFile(projectFile.url, 1);
  loadingON('Reloading the App');
  window.location.reload();
}

async function refresh() {
  loadingON('Update Sharepoint Status...');
  await updateSPStatus(projectDetail);
  loadingON('Updating GLaaS Status...');
  await updateGLaaSStatus(projectDetail);
  loadingON('Status updated! Updating UI.');
  await displayProjectDetail();
  loadingOFF();
}

function fileExistsInSharepoint(task) {
  return task.sp && task.sp.status === 200;
}

async function save(task, locale, doRefresh = true) {
  const dest = `${task.draftLocaleFilePath}`.toLowerCase();
  if (fileExistsInSharepoint(task)) {
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
  }
}

async function saveAll(locale) {
  await asyncForEach(projectDetail[locale], async (task) => {
    if (task.glaas) {
      await save(task, locale, false);
    }
  });
  loadingOFF();
  await refresh();
}

function setListeners() {
  document.querySelector('#send button').addEventListener('click', sendForTranslation);
  document.querySelector('#refresh button').addEventListener('click', refresh);
  document.querySelector('#reload button').addEventListener('click', reloadProjectFile);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function getSafely(method, errMsg) {
  let info;
  try {
    info = await method();
  } catch (err) {
    setError(errMsg, err);
  }
  return info;
}

async function init() {
  setListeners();
  loadingON('Fetching Localization Config...');
  const config = await getSafely(getConfig, 'Something is wrong with the Localization Configuration');
  if (!config) {
    return;
  }
  loadingON('Localization Config loaded');
  loadingON('Fetching Project Config...');
  const project = await getSafely(initProject, 'Could not read the project file');
  if (!project) {
    return;
  }
  loadingON(`Fetching project details for ${project.url}`);
  setProjectUrl(project);
  projectDetail = await project.detail();
  loadingON('Project Details loaded');
  await displayProjectDetail();
  loadingON('Connecting now to Sharepoint...');
  await connectToSP(async () => {
    loadingON('Connected to Sharepoint! Updating the Sharepoint Status...');
    await updateSPStatus(projectDetail, async () => {
      loadingON('Status updated! Updating UI.');
      await displayProjectDetail();
      loadingOFF();
    });
  });
  loadingON('Connecting now to GLaaS...');
  await connectToGLaaS(async () => {
    loadingON('Connected to GLaaS! Updating the GLaaS Status...');
    await updateGLaaSStatus(projectDetail, async () => {
      loadingON('Status updated! Updating UI.');
      await displayProjectDetail();
      loadingOFF();
    });
  });
  loadingON('App loaded.');
  loadingOFF();
}

export default init;
