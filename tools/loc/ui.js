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
import {
  asyncForEach,
  createTag,
  getPathFromUrl, getSharepointLocationFromUrl, isAltLang,
  loadingOFF,
  loadingON,
  setStatus,
} from './utils.js';
import {
  saveFile,
  connect as connectToSP,
  getSpViewUrl,
  updateProjectWithSpStatus as updateSPStatus, copyFile,
} from './sharepoint.js';
import { init as initProject } from './project.js';
import {
  connect as connectToGLaaS,
  sendToGLaaS,
  getFile as getFileFromGLaaS,
  updateProject as updateGLaaSStatus,
} from './glaas.js';
import { rollout } from './rollout.js';
import updateFragments from './fragments.js';

let projectDetail;
const MAX_RETRIES = 5;
const GLAAS_COMPLTETE_STATUS = 'COMPLETED';

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

async function appendLanguages($tr, config, locales) {
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
  $tr.appendChild(createHeaderColumn('English Langstore file'));
  await appendLanguages($tr, config, projectDetail.languages);
  $table.appendChild($tr);
  return $table;
}

function getAnchorHtml(url, text) {
  return `<a href="${url}" target="_new">${text}</a>`;
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

function fileAlreadySavedInSharepoint(task) {
  return task.sp.status === 200;
}

function createButton(innerHtml) {
  const $button = createTag('button', { type: 'button' });
  $button.innerHTML = innerHtml;
  return $button;
}

function getPersistButtons(task, language) {
  const fileInSharepoint = fileAlreadySavedInSharepoint(task);
  const $saveButton = createButton(fileInSharepoint ? 'Overwrite' : 'Save');
  $saveButton.addEventListener('click', async () => { await save(task, language); });
  const buttons = [];
  if (fileInSharepoint) {
    const $viewButton = createButton('Primary');
    $viewButton.addEventListener('click', () => { window.open(task.sp.webUrl); });
    buttons.push($viewButton);
    if (task.altlanguage && task.altlangsp.status === 200) {
      const $viewAltLangButton = createButton('AltLang');
      $viewAltLangButton.addEventListener('click', () => { window.open(task.altlangsp.webUrl); });
      buttons.push($viewAltLangButton);
    }
    const $rolloutButton = createButton('Rollout');
    $rolloutButton.addEventListener('click', async () => {
      loadingON(`Rollout to target folders of ${task.languageFilePath} in progress..`);
      await initRollout(task);
      loadingON(`Rollout ${task.languageFilePath} completed`);
    });
    loadingOFF();
    return buttons;
  }
  return buttons;
}

function getGLaaSStatus(config, language, url, hasSourceFile) {
  const gLaaSStatus = { innerHtml: 'N/A', taskFoundInGLaaS: false, canSaveAll: false };
  const languageTask = projectDetail[language].find((task) => task.URL === url);
  if (!languageTask) {
    return gLaaSStatus;
  }
  gLaaSStatus.innerHtml = 'Connect to GLaaS first';
  const gLaaSConfig = config.glaas;
  const gLaaSStatusObject = languageTask?.glaas;
  const altLang = languageTask.altlanguage;
  const regularStatusInGLaaS = gLaaSStatusObject?.status;
  if (regularStatusInGLaaS) {
    gLaaSStatus.taskFoundInGLaaS = true;
    if (!altLang) {
      gLaaSStatus.innerHtml = `${regularStatusInGLaaS}`;
      if (regularStatusInGLaaS === GLAAS_COMPLTETE_STATUS && languageTask.sp) {
        gLaaSStatus.canSaveAll = gLaaSStatusObject?.combinedStatus === GLAAS_COMPLTETE_STATUS;
        gLaaSStatus.persistButtons = getPersistButtons(languageTask, language);
      }
    } else {
      const altLangStatusInGLaaS = gLaaSStatusObject.altLangStatus ? gLaaSStatusObject.altLangStatus : 'PENDING';
      const bothComplete = regularStatusInGLaaS === GLAAS_COMPLTETE_STATUS
        && altLangStatusInGLaaS === GLAAS_COMPLTETE_STATUS;
      gLaaSStatus.innerHtml = bothComplete ? GLAAS_COMPLTETE_STATUS : `Translation<br/>${regularStatusInGLaaS}<br/> AltLang<br/> ${altLangStatusInGLaaS}`;
      if (bothComplete && languageTask.sp && languageTask?.altlangsp) {
        gLaaSStatus.canSaveAll = gLaaSStatusObject?.combinedStatus === GLAAS_COMPLTETE_STATUS
          && gLaaSStatusObject?.altLangCombinedStatus === GLAAS_COMPLTETE_STATUS;
        gLaaSStatus.persistButtons = getPersistButtons(languageTask, language);
      }
    }
  } else if (gLaaSStatusObject && languageTask.skipLanguageTranslation && altLang) {
    gLaaSStatus.taskFoundInGLaaS = true;
    const altLangStatusInGLaaS = gLaaSStatusObject.altLangStatus ? gLaaSStatusObject.altLangStatus : 'PENDING';
    gLaaSStatus.innerHtml = altLangStatusInGLaaS;
    if (altLangStatusInGLaaS === GLAAS_COMPLTETE_STATUS) {
      gLaaSStatus.canSaveAll = gLaaSStatusObject?.altLangCombinedStatus === GLAAS_COMPLTETE_STATUS;
      gLaaSStatus.persistButtons = getPersistButtons(languageTask, language);
    }
  } else if (gLaaSConfig.accessToken) {
    if (languageTask.sp) {
      gLaaSStatus.innerHtml = hasSourceFile ? 'Ready for translation' : 'No source';
    }
  }
  return gLaaSStatus;
}

async function initRollout(task) {
  const failedRollouts = [];
  loadingON(`Rollout live-copy folders of ${task.languageFilePath} complete..`);
  const failedRolloutPages = await rollout(task.languageFilePath, task.livecopyFolders);
  failedRollouts.push(failedRolloutPages);
  loadingON(`Rollout to live-copy folders of ${task.languageFilePath} complete..`);
  if (task.altlanguage) {
    loadingON(`Rollout to alt-lang folders of ${task.altLanguageFilePath} in progress..`);
    const failedRolloutPages = await rollout(task.altLanguageFilePath, task.altLangFolders);
    failedRollouts.push(failedRolloutPages);
    loadingON(`Rollout to alt-lang folders of ${task.altLanguageFilePath} complete..`);
  }
  if (failedRollouts.length > 0) {
    loadingON(`Rollout complete. Failed for following - ${failedRollouts}`);
  }
}

async function rolloutAll(language) {
  loadingON(`Rollout to target folders of ${language}`);
  await asyncForEach(projectDetail[language], async (task) => {
    if (task.glaas || task.rolloutOnly) {
      await initRollout(task);
    }
  });
  loadingON(`Rollout to target folders of ${language} complete`);
  loadingOFF();
  await refresh();
}

async function getLinkedPagePath(pagePath) {
  const spViewUrl = await getSpViewUrl(pagePath);
  return getAnchorHtml(spViewUrl, pagePath);
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
  let showCombinedPersistRow = false;
  const combinedSavePerLanguage = new Map();
  const hideCombinedRolloutPerLanguage = new Map();

  await asyncForEach(projectDetail.urls, async (url) => {
    const $tr = createRow();
    const pageUrl = getAnchorHtml(url, getPathFromUrl(url));
    $tr.appendChild(createColumn(pageUrl));
    const sharepointStatus = getSharepointStatus(url);
    const pathOrMsg = sharepointStatus.msg;
    const usEnLinkedPath = sharepointStatus.hasSourceFile
      ? await getLinkedPagePath(pathOrMsg) : pathOrMsg;
    $tr.appendChild(createColumn(usEnLinkedPath));
    const langstoreEnLinkedPath = sharepointStatus.hasSourceFile
      ? await getLinkedPagePath(`/langstore/en${pathOrMsg}`) : pathOrMsg;
    $tr.appendChild(createColumn(langstoreEnLinkedPath));
    await asyncForEach(projectDetail.languages, async (language) => {
      let filesMissingInSharepoint = false;
      const $td = createTag('td');
      const gLaaSStatus = getGLaaSStatus(config, language, url, sharepointStatus.hasSourceFile);
      if (gLaaSStatus.persistButtons) {
        gLaaSStatus.persistButtons.forEach((button) => $td.appendChild(button));
      } else {
        $td.innerHTML = gLaaSStatus.innerHtml;
      }
      if (gLaaSStatus.taskFoundInGLaaS) {
        taskFoundInGLaaS = gLaaSStatus.taskFoundInGLaaS;
      }
      if (gLaaSStatus.canSaveAll) {
        showCombinedPersistRow = true;
        combinedSavePerLanguage.set(language, gLaaSStatus.canSaveAll);
        filesMissingInSharepoint = gLaaSStatus.persistButtons.length === 0;
        if (filesMissingInSharepoint) {
          hideCombinedRolloutPerLanguage.set(language, true);
        }
      }
      $tr.appendChild($td);
    });

    $table.appendChild($tr);
  });

  if (showCombinedPersistRow) {
    const finalRow = createRow();
    finalRow.appendChild(createColumn());
    finalRow.appendChild(createColumn());
    finalRow.appendChild(createColumn());

    projectDetail.languages.forEach((language) => {
      if (combinedSavePerLanguage.get(language)) {
        const $td = createTag('td');
        const $saveAllButton = createButton('Save');
        $saveAllButton.addEventListener('click', () => {
          saveAll(language);
        });
        $td.appendChild($saveAllButton);
        if (!hideCombinedRolloutPerLanguage.get(language)) {
          const $rolloutAllButton = createButton('Rollout');
          $rolloutAllButton.addEventListener('click', () => {
            rolloutAll(language);
          });
          $td.appendChild($rolloutAllButton);
        }
        finalRow.appendChild($td);
      } else {
        finalRow.appendChild(createColumn());
      }
    });

    $table.appendChild(finalRow);
  }

  container.appendChild($table);

  const sendPanel = document.getElementById('send');
  const copyToEnPanel = document.getElementById('copyToEn');
  const updateFragmentsPanel = document.getElementById('updateFragments');
  const refreshPanel = document.getElementById('refresh');
  const reloadPanel = document.getElementById('reload');
  if (!taskFoundInGLaaS) {
    // show the send button only if task has not been found in GLaaS
    if (connectedToGLaaS) {
      sendPanel.classList.remove('hidden');
    }
    reloadPanel.classList.remove('hidden');
    updateFragmentsPanel.classList.remove('hidden');
    copyToEnPanel.classList.remove('hidden');
    refreshPanel.classList.add('hidden');
  } else {
    sendPanel.classList.add('hidden');
    reloadPanel.classList.add('hidden');
    updateFragmentsPanel.classList.add('hidden');
    copyToEnPanel.classList.add('hidden');
    refreshPanel.classList.remove('hidden');
  }
}

async function sendForTranslation() {
  await asyncForEach(projectDetail.languages, async (language) => {
    loadingON(`Creating ${language} handoff in GLaaS`);
    await sendToGLaaS(projectDetail, language);
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

function fileExistsInSharepoint(task, altLang) {
  const sp = altLang ? task.altlangsp : task.sp;
  return sp && sp.status === 200;
}

function getSavePath(task, altLang) {
  return altLang ? task.altLanguageFilePath : task.languageFilePath;
}

async function save(task, language, doRefresh = true) {
  const altLang = isAltLang(task, language);
  if (task.skipLanguageTranslation && !altLang) {
    return;
  }
  const dest = `${getSavePath(task, altLang)}`.toLowerCase();
  if (fileExistsInSharepoint(task, altLang)) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(`File ${dest} exists already. Are you sure you want to overwrite the current production version ?`);
    if (!confirm) return;
  }
  loadingON(`Downloading ${dest} file from GLaaS`);
  try {
    const file = await getFileFromGLaaS(task, language);
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

async function saveAll(language) {
  await asyncForEach(projectDetail[language], async (task) => {
    if (task.glaas) {
      await save(task, language, false);
      if (task.altlanguage && task.glaas.altLangStatus) {
        await save(task, task.altlanguage, false);
      }
    }
  });
  loadingOFF();
  await refresh();
}

async function copyFilesToLanguageEn() {
  await asyncForEach(projectDetail.urls, async (url) => {
    const srcPath = `${getSharepointLocationFromUrl(url)}.docx`;
    loadingON(`Copying ${srcPath} to languages/en`);
    const destinationFolder = `/langstore/en${srcPath.substring(0, srcPath.lastIndexOf('/'))}`;
    await copyFile(srcPath, destinationFolder);
    loadingON(`Copied ${srcPath} to languages/en`);
  });
  loadingOFF();
}

async function triggerUpdateFragments() {
  loadingON('Fetching and updating fragments..');
  const status = await updateFragments();
  loadingON(status);
}

function setListeners() {
  document.querySelector('#reload button').addEventListener('click', reloadProjectFile);
  document.querySelector('#copyToEn button').addEventListener('click', copyFilesToLanguageEn);
  document.querySelector('#send button').addEventListener('click', sendForTranslation);
  document.querySelector('#refresh button').addEventListener('click', refresh);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
  document.querySelector('#updateFragments button').addEventListener('click', triggerUpdateFragments);
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
