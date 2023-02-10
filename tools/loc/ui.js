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
  createTag,
  getPathFromUrl,
  loadingOFF,
  loadingON,
  setStatus, simulatePreview, stripExtension,
} from './utils.js';
import {
  saveFile,
  getFile,
  connect as connectToSP,
  getSpViewUrl,
  copyFile, updateExcelTable,
} from './sharepoint.js';
import { init as initProject, PROJECT_STATUS, updateProjectWithDocs } from './project.js';
import {
  connect as connectToGLaaS,
  sendToGLaaS,
  updateProject as updateGLaaSStatus,
  getAssetFromGLaaS,
} from './glaas.js';
import rollout from './rollout.js';
import updateFragments from './fragments.js';

let projectDetail;
let project;
const MAX_RETRIES = 5;

function setError(msg, error) {
  document.getElementById('loading').classList.remove('hidden');
  setStatus(msg, 'level-0');
  // eslint-disable-next-line no-console
  console.error(msg, error);
}

function setProjectUrl() {
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

async function appendLanguages($tr, config, projects, customSuffix) {
  projects.forEach((projectInfo, language) => {
    const workflowName = customSuffix || projectInfo?.workflowDetail?.name;
    if (workflowName) {
      $tr.appendChild(createHeaderColumn(`${language} (${workflowName})`));
    }
  });
}

async function createTableWithHeaders(config) {
  const $table = createTag('table');
  const $tr = createRow('header');
  $tr.appendChild(createHeaderColumn('URL'));
  $tr.appendChild(createHeaderColumn('Source File'));
  $tr.appendChild(createHeaderColumn('En Langstore File'));
  $tr.appendChild(createHeaderColumn('En Langstore Info'));
  await appendLanguages($tr, config, projectDetail.englishCopyProjects, 'English Copy');
  await appendLanguages($tr, config, projectDetail.rolloutProjects, 'Rollout');
  await appendLanguages($tr, config, projectDetail.translationProjects);
  $table.appendChild($tr);
  return $table;
}

function getAnchorHtml(url, text) {
  return `<a href="${url}" target="_new">${text}</a>`;
}

function getSharepointStatus(doc) {
  let sharepointStatus = 'Connect to Sharepoint';
  let hasSourceFile = false;
  let modificationInfo = 'N/A';
  if (doc && doc.sp) {
    if (doc.sp.status === 200) {
      sharepointStatus = `${doc.filePath}`;
      hasSourceFile = true;
      modificationInfo = `By ${doc.sp?.lastModifiedBy?.user?.displayName} at ${doc.sp?.lastModifiedDateTime}`;
    } else {
      sharepointStatus = 'Source file not found!';
    }
  }
  return { hasSourceFile, msg: sharepointStatus, modificationInfo };
}

function createButton(innerHtml) {
  const $button = createTag('button', { type: 'button' });
  $button.innerHTML = innerHtml;
  return $button;
}

function getStatus(subproject, url) {
  const status = { innerHtml: '', viewButtons: [] };
  if (!subproject) {
    return status;
  }
  const pageInfo = subproject.urls.get(url);

  function updateStatus(langInfo, prepend) {
    const failureMessage = langInfo?.failureMessage ? langInfo.failureMessage : '';
    if (subproject.failedPages.includes(langInfo.languageFilePath)) {
      status.innerHtml += `${prepend} Failed <br/>${failureMessage}<br/>`;
      return;
    }
    const langStatus = langInfo.status;
    if (langStatus === PROJECT_STATUS.COMPLETED) {
      status.innerHtml += `${prepend}<br/>${PROJECT_STATUS.COMPLETED}<br/>`;
      if (langInfo?.sp?.status === 200) {
        const viewButton = createButton(prepend || 'Primary');
        viewButton.addEventListener('click', () => window.open(langInfo.sp.webUrl));
        status.viewButtons.push(viewButton);
      }
    } else {
      const innerHtmlPrefix = langStatus === PROJECT_STATUS.YET_TO_START ? '' : prepend;
      status.innerHtml += `${innerHtmlPrefix} ${langStatus} ${failureMessage}<br/>`;
    }
  }
  let prepend = true;
  if (subproject.language !== 'en') {
    prepend = pageInfo.langInfo.status === PROJECT_STATUS.COMPLETED;
    updateStatus(pageInfo.langInfo, prepend ? 'Primary' : '');
  }
  if (pageInfo?.altLangInfo && prepend) {
    updateStatus(pageInfo.altLangInfo, 'AltLang');
    if (status.viewButtons.length === 1 && subproject.language !== 'en') {
      status.viewButtons = [];
    }
  }

  return status;
}

async function initRollout(task, language) {
  const status = { success: false, language, errorMsg: '' };
  const failedRollouts = [];

  async function executeRollout(langInfo) {
    const { languageFilePath } = langInfo;
    const fileBlob = await getFile(langInfo);
    if (!fileBlob) {
      throw new Error(`File not found ${languageFilePath}`);
    }
    const file = { path: languageFilePath, blob: fileBlob };
    loadingON(`Rollout live-copy folders of ${languageFilePath} in progress..`);
    const failedRolloutPages = await rollout(file, langInfo.livecopyFolders);
    failedRollouts.push(...failedRolloutPages);
    loadingON(`Rollout to live-copy folders of ${languageFilePath} complete..`);
  }
  try {
    await executeRollout(task.langInfo);
    if (task?.altLangInfo) {
      await executeRollout(task.altLangInfo);
    }
    status.success = true;
    if (failedRollouts.length > 0) {
      loadingON(`Rollout in progress. Failed for following - ${failedRollouts}`);
    }
  } catch (error) {
    status.errorMsg = error.message;
  }
  status.failedRollouts = failedRollouts;
  return status;
}

async function rolloutAll(projectInfo) {
  const { language } = projectInfo;
  let failedRollouts = [];
  loadingON(`Rollout to target folders of ${language}`);
  if (projectInfo.status === PROJECT_STATUS.COMPLETED) {
    const rolloutStatuses = await Promise.all(
      [...projectInfo.urls].map((taskArray) => initRollout(taskArray[1], language)),
    );
    failedRollouts = rolloutStatuses.filter(
      (status) => !status.success || status.failedRollouts.length > 0,
    ).map(
      (status) => (status.failedRollouts.length > 0 ? status.failedRollouts : [status.errorMsg]),
    );
  }
  loadingON(`Rollout to target folders of ${language} complete`);
  if (failedRollouts.length > 0) {
    loadingON(`Rollout failed for <br/> ${failedRollouts.flat(1).join('<br/>')}`);
  }
}

function getLinkedPagePath(spShareUrl, pagePath) {
  return getAnchorHtml(spShareUrl.replace('<relativePath>', pagePath), pagePath);
}

function getLinkOrDisplayText(spViewUrl, docStatus) {
  const pathOrMsg = docStatus.msg;
  return docStatus.hasSourceFile ? getLinkedPagePath(spViewUrl, pathOrMsg) : pathOrMsg;
}

function showButtons(buttonIds) {
  buttonIds.forEach((buttonId) => {
    document.getElementById(buttonId).classList.remove('hidden');
  });
}

function hideButtons(buttonIds) {
  buttonIds.forEach((buttonId) => {
    document.getElementById(buttonId).classList.add('hidden');
  });
}

async function displayProjectDetail() {
  if (!projectDetail) {
    return;
  }
  const config = await getConfig();
  if (!config) {
    return;
  }
  const container = getProjectDetailContainer();
  const subprojects = new Map([
    ...projectDetail.englishCopyProjects,
    ...projectDetail.rolloutProjects,
    ...projectDetail.translationProjects,
  ]);
  const $table = await createTableWithHeaders(config);
  let metdataColumns = 4;

  const connectedToGLaaS = config.glaas.accessToken;
  const spViewUrl = await getSpViewUrl();

  function displayPageStatuses(url, projects, langstoreDocExists, row) {
    projects.forEach((projectInfo) => {
      const $td = createTag('td');
      if (!langstoreDocExists) {
        $td.innerHTML = 'No Source';
      } else {
        const status = getStatus(projectInfo, url);
        if (status?.viewButtons.length > 0) {
          status.viewButtons.forEach((button) => $td.appendChild(button));
        } else {
          $td.innerHTML = status.innerHtml;
        }
      }
      row.appendChild($td);
    });
  }

  function displayProjectStatuses(projects, row) {
    projects.forEach((projectInfo) => {
      if (projectInfo.status === PROJECT_STATUS.COMPLETED) {
        const $td = createTag('td');
        if (!(projectInfo?.savedStatus)) {
          const $saveAllButton = createButton('Save');
          $saveAllButton.addEventListener('click', () => saveAll(projectInfo));
          $td.appendChild($saveAllButton);
        }
        const $rolloutAllButton = createButton('Rollout');
        $rolloutAllButton.addEventListener('click', () => {
          rolloutAll(projectInfo);
        });
        $td.appendChild($rolloutAllButton);
        row.appendChild($td);
      } else {
        row.appendChild(createColumn());
      }
    });
  }
  projectDetail.urls.forEach((urlInfo, url) => {
    const $tr = createRow();
    const pageUrl = getAnchorHtml(url, getPathFromUrl(url));
    $tr.appendChild(createColumn(pageUrl));
    const usEnDocStatus = getSharepointStatus(urlInfo.doc);
    const usEnDocDisplayText = getLinkOrDisplayText(spViewUrl, usEnDocStatus);
    $tr.appendChild(createColumn(usEnDocDisplayText));
    const langstoreDocStatus = getSharepointStatus(urlInfo.langstoreDoc);
    const langstoreEnDisplayText = getLinkOrDisplayText(spViewUrl, langstoreDocStatus);
    const langstoreDocExists = langstoreDocStatus.hasSourceFile;
    $tr.appendChild(createColumn(langstoreEnDisplayText));
    $tr.appendChild(createColumn(langstoreDocStatus.modificationInfo));
    displayPageStatuses(url, subprojects, langstoreDocExists, $tr);
    $table.appendChild($tr);
  });

  const finalRow = createRow();
  while (metdataColumns > 0) {
    finalRow.appendChild(createColumn());
    metdataColumns -= 1;
  }
  displayProjectStatuses(subprojects, finalRow);
  $table.appendChild(finalRow);
  container.appendChild($table);
  let hideIds = ['send', 'reload', 'updateFragments', 'copyToEn'];
  let showIds = projectDetail.translationProjects.size > 0 ? ['refresh'] : [];
  const { projectStarted } = projectDetail;
  if (!projectStarted) {
    showIds = ['reload', 'updateFragments', 'copyToEn'];
    hideIds = ['refresh'];
    if (connectedToGLaaS || projectDetail?.translationProjects.size === 0) {
      showIds.push('send');
    }
  }
  showButtons(showIds);
  hideButtons(hideIds);
}

async function createEnglishCopies(file, targetFolders) {
  return Promise.all(targetFolders.map((targetFolder) => saveFile(file.blob, file.path.replace('/langstore/en/', `/langstore/${targetFolder}/`))));
}

function handleRolloutProjects() {
  function updateStatus(projectInfo, langInfo) {
    if (langInfo?.sp?.status !== 200) {
      projectInfo.failedPages.push(langInfo.languageFilePath);
      const failureMsg = `Page Not found ${langInfo.languageFilePath}<br/>`;
      projectInfo.failureMessage += failureMsg;
      langInfo.status = PROJECT_STATUS.FAILED;
      langInfo.failureMessage = failureMsg;
      projectInfo.status = PROJECT_STATUS.FAILED;
    } else {
      langInfo.status = PROJECT_STATUS.COMPLETED;
    }
  }
  projectDetail.rolloutProjects.forEach((projectInfo) => {
    projectInfo.urls.forEach((urlInfo) => {
      const { langInfo } = urlInfo;
      updateStatus(projectInfo, langInfo);
      if (urlInfo?.altLangInfo) {
        const { altLangInfo } = urlInfo;
        updateStatus(projectInfo, altLangInfo);
      }
    });
    if (projectInfo.status !== PROJECT_STATUS.FAILED) {
      projectInfo.status = PROJECT_STATUS.COMPLETED;
      projectInfo.savedStatus = PROJECT_STATUS.COMPLETED;
    }
  });
}

async function handleEnglishCopyProjects(langstoreEnFiles) {
  loadingON('Starting English Copy Projects');
  const targetLanguages = [];
  projectDetail.englishCopyProjects.forEach((projectInfo) => {
    targetLanguages.push(projectInfo.language);
    if (projectInfo?.altLangInfo?.language) {
      targetLanguages.push(projectInfo.altLangInfo.language);
    }
  });
  const englishCopiesStatus = await Promise.all(
    langstoreEnFiles.map((file) => createEnglishCopies(file, targetLanguages)),
  );
  const failedPagesStatus = englishCopiesStatus
    .filter(({ success }) => !success);
  const failedPages = failedPagesStatus.length > 0
    ? failedPagesStatus.map(({ path }) => path) : [];

  function updateStatus(urlLangInfo, projectInfo, type = 'primary') {
    let status = PROJECT_STATUS.COMPLETED;
    const currentLangPath = urlLangInfo.languageFilePath;
    if (failedPages.includes(currentLangPath)) {
      status = PROJECT_STATUS.FAILED;
      projectInfo.status = PROJECT_STATUS.FAILED;
      projectInfo.failedPages.push(currentLangPath);
      projectInfo.failureMessage += `Could not save English Copy for ${currentLangPath}<br/>`;
    }
    urlLangInfo.status = status;
  }
  const statusValues = [];
  projectDetail.englishCopyProjects.forEach((projectInfo) => {
    loadingON(`Updating status for project ${projectInfo.language}...`);
    projectInfo.urls.forEach((urlInfo) => {
      updateStatus(urlInfo.langInfo, projectInfo);
      if (urlInfo?.altLangInfo) {
        updateStatus(urlInfo.altLangInfo, projectInfo, 'altLang');
      }
    });
    if (projectInfo.status !== PROJECT_STATUS.FAILED) {
      projectInfo.status = PROJECT_STATUS.COMPLETED;
      projectInfo.savedStatus = PROJECT_STATUS.COMPLETED;
    }
    statusValues.push(
      [projectInfo.language, projectInfo.status, projectInfo.status, projectInfo.status,
        projectInfo.status, projectInfo.failureMessage, projectInfo.failedPages.join('\n')],
    );
    loadingON(`Updated status for project ${projectInfo.language}...`);
  });
  loadingON('Update excel with english copy statues...');
  await updateExcelTable(project.excelPath, 'Status', statusValues);
  loadingON('Updated excel with english copy statues...');
  loadingON('Refreshing project Json...');
  await project.purge();
}

async function getFileBlob(docInfo) {
  const doc = docInfo.langstoreDoc;
  const { url } = docInfo;
  const file = { path: doc.filePath };
  try {
    if (doc && doc?.sp?.status === 200) {
      const response = await fetch(doc.sp['@microsoft.graph.downloadUrl']);
      const blob = await response.blob();
      blob.path = doc.filePath;
      blob.URL = url;
      file.blob = blob;
      return file;
    }
  } catch (error) {
    file.errorMsg = error.message;
  }
  return file;
}

async function getLangstoreFileBlobs() {
  const langstoreFileBlobs = {
    files: [],
    failedFiles: [],
  };
  const langstoreFilesInfo = [];
  projectDetail.urls.forEach((urlInfo, url) => {
    langstoreFilesInfo.push({ langstoreDoc: urlInfo.langstoreDoc, url });
  });
  const fileBlobs = await Promise.all(langstoreFilesInfo.map(
    (langstoreFileInfo) => getFileBlob(langstoreFileInfo),
  ));
  fileBlobs.forEach((fileblob) => {
    if (fileblob?.errorMsg) {
      langstoreFileBlobs.failedFiles.push(fileblob);
    } else {
      langstoreFileBlobs.files.push(fileblob);
    }
  });
  return langstoreFileBlobs;
}

async function handleTranslationProject(projectInfo, language, files) {
  loadingON(`Creating ${language} handoff in GLaaS`);
  try {
    await sendToGLaaS(projectDetail, projectInfo, files);
    return { type: 'gLaaS', success: true, language };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Failed to send to GLaaS ${error.message}`);
    return { type: 'gLaaS', success: false, errorMsg: error.message, language };
  }
}

async function handleTranslationProjects(files) {
  await Promise.all(
    [...projectDetail.translationProjects].map(
      (translationProjectsArray) => handleTranslationProject(
        translationProjectsArray[1],
        translationProjectsArray[0],
        files,
      ),
    ),
  );
}

async function startProject() {
  try {
    if (projectDetail?.rolloutProjects.size > 0) {
      handleRolloutProjects();
      projectDetail.projectStarted = true;
    }
    if ((projectDetail?.englishCopyProjects.size > 0)
      || (projectDetail?.translationProjects.size > 0)) {
      const langstoreEnDocs = await getLangstoreFileBlobs();
      if (langstoreEnDocs.failedFiles.length > 0) {
        projectDetail.projectStarted = false;
        loadingON(`Project Not Started. Langstore Pages Missing ${langstoreEnDocs.failedFiles.map((failedFile) => failedFile.path)}`);
        return;
      }
      if (projectDetail?.englishCopyProjects.size > 0) {
        await handleEnglishCopyProjects(langstoreEnDocs.files);
      }
      if (projectDetail?.translationProjects.size > 0) {
        await handleTranslationProjects(langstoreEnDocs.files);
      }
    }
    loadingON('Subprojects started.. Updating Statuses...');
    await updateGLaaSStatus(projectDetail);
    loadingON('Status updated! Updating UI.');
    await displayProjectDetail();
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when starting the project ${error.message}`);
  }
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
  await updateProjectWithDocs(projectDetail);
  loadingON('Update Rollout Projects...');
  await handleRolloutProjects();
  loadingON('Updating GLaaS Status...');
  await updateGLaaSStatus(projectDetail);
  loadingON('Status updated! Updating UI.');
  await displayProjectDetail();
  loadingOFF();
}

function fileExistsInSharepoint(taskLangInfo) {
  return taskLangInfo?.sp?.status === 200;
}

async function save(taskLangInfo, glaasTaskAPI) {
  try {
    const dest = taskLangInfo.languageFilePath.toLowerCase();
    const overrideMsg = fileExistsInSharepoint(taskLangInfo) ? `File ${dest} exists! Overriding it. <br/>` : '';
    loadingON(`${overrideMsg}Downloading ${dest} file from GLaaS`);
    const file = await getAssetFromGLaaS(glaasTaskAPI, taskLangInfo.glaas.assetPath);
    loadingON(`Saving ${dest} file to Sharepoint`);
    await saveFile(file, dest);
    loadingON(`File ${dest} is now in Sharepoint`);
  } catch (err) {
    setError('Could not save the file.', err);
  }
}

async function saveAll(projectInfo) {
  async function saveTask(task) {
    try {
      let primaryFileSaved = projectInfo.language === 'en';
      if (task?.langInfo?.glaas?.assetPath) {
        await save(task.langInfo, projectInfo?.glaasTasksAPI);
        primaryFileSaved = true;
      }
      if (primaryFileSaved && projectInfo?.altLangInfo?.language
        && task?.altLangInfo?.glaas?.assetPath) {
        await save(
          task.altLangInfo,
          projectInfo.altLangInfo?.glaasTasksAPI,
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error occurred when trying to save file ${error.message}`);
    }
  }

  await Promise.all([...projectInfo.urls].map((taskArray) => saveTask(taskArray[1])));
  loadingOFF();
  await refresh();
}

async function copyFilesToLangstoreEn() {
  function updateAndDisplayCopyStatus(copyStatus, srcPath) {
    let copyDisplayText = `Copied ${srcPath} to languages/en`;
    if (!copyStatus) {
      copyDisplayText = `Failed to copy ${srcPath} to languages/en`;
    }
    loadingON(copyDisplayText);
  }

  async function copyFileToLangstore(urlInfo) {
    const status = { success: false };
    try {
      const srcPath = urlInfo?.doc?.filePath;
      loadingON(`Copying ${srcPath} to languages/en`);
      // Conflict behaviour replace for copy not supported in one drive, hence if file exists,
      // then use saveFile.
      let copySuccess = false;
      if (urlInfo?.langstoreDoc?.sp?.status !== 200) {
        const destinationFolder = `/langstore/en${srcPath.substring(0, srcPath.lastIndexOf('/'))}`;
        copySuccess = await copyFile(srcPath, destinationFolder);
        updateAndDisplayCopyStatus(copySuccess, srcPath);
      } else {
        const file = await getFile(urlInfo.doc);
        if (file) {
          const destination = urlInfo?.langstoreDoc?.filePath;
          if (destination) {
            const saveStatus = await saveFile(file, destination);
            if (saveStatus.success) {
              copySuccess = true;
            }
          }
        }
        updateAndDisplayCopyStatus(copySuccess, srcPath);
      }
      status.success = copySuccess;
      status.srcPath = srcPath;
      status.dstPath = `/langstore/en${srcPath}`;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error occurred when trying to copy to langstore ${error.message}`);
    }
    return status;
  }

  const copyStatuses = await Promise.all(
    [...projectDetail.urls].map(((valueArray) => copyFileToLangstore(valueArray[1]))),
  );
  loadingON('Previewing for copied files... ');
  const previewStatuses = await Promise.all(
    copyStatuses
      .filter((status) => status.success)
      .map((status) => simulatePreview(stripExtension(status.dstPath))),
  );
  loadingON('Completed Preview for copied files... ');
  const failedCopies = copyStatuses
    .filter((status) => !status.success)
    .map((status) => status?.srcPath || 'Path Info Not available');
  const failedPreviews = previewStatuses
    .filter((status) => !status.success)
    .map((status) => status.path);
  if (failedCopies.length > 0 || failedPreviews.length > 0) {
    let failureMessage = failedCopies.length > 0 ? `Failed to copy ${failedCopies} to languages/en` : '';
    failureMessage = failedPreviews.length > 0 ? `${failureMessage} Failed to preview ${failedPreviews}. Kindly manually preview these files before starting the project` : '';
    loadingON(failureMessage);
  } else {
    loadingOFF();
    await refresh();
  }
}

async function triggerUpdateFragments() {
  loadingON('Fetching and updating fragments..');
  const status = await updateFragments();
  loadingON(status);
}

function setListeners() {
  document.querySelector('#reload button').addEventListener('click', reloadProjectFile);
  document.querySelector('#copyToEn button').addEventListener('click', copyFilesToLangstoreEn);
  document.querySelector('#send button').addEventListener('click', startProject);
  document.querySelector('#refresh button').addEventListener('click', refresh);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
  document.querySelector('#updateFragments button').addEventListener('click', triggerUpdateFragments);
}

async function init() {
  try {
    setListeners();
    loadingON('Fetching Localization Config...');
    const config = await getConfig();
    if (!config) {
      return;
    }
    loadingON('Localization Config loaded...');
    loadingON('Fetching Project Config...');
    project = await initProject();
    loadingON('Refreshing Project Config...');
    await project.purge();
    loadingON('Fetching Project Config after refresh...');
    await fetchProjectFile(project.url, 1);
    project = await initProject();
    if (!project) {
      loadingON('Could load project file...');
      return;
    }
    loadingON(`Fetching project details for ${project.url}`);
    setProjectUrl();
    projectDetail = await project.detail();
    loadingON('Project Details loaded...');
    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint! Updating the Sharepoint Status...');
    await updateProjectWithDocs(projectDetail);
    loadingON('Update Rollout Projects...');
    await handleRolloutProjects();
    if (projectDetail?.translationProjects.size > 0) {
      loadingON('Connecting now to GLaaS...');
      await connectToGLaaS(async () => {
        loadingON('Connected to GLaaS! Updating the GLaaS Status...');
        await updateGLaaSStatus(projectDetail, async () => {
          loadingON('Status updated! Updating UI..');
          await displayProjectDetail();
          loadingOFF();
        });
      });
    } else {
      await displayProjectDetail();
    }
    loadingON('App loaded..');
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the project ${error.message}`);
  }
}

export default init;
