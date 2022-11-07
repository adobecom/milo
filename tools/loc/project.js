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
import { getDocPathFromUrl, getUrlInfo } from './utils.js';
import getConfig from './config.js';
import { getSpFiles } from './sharepoint.js';

const PROJECTS_ROOT_PATH = '/drafts/localization/projects/';

let project;

const PROJECT_STATUS = {
  CONNECT_TO_GLAAS: 'Connect To GLaaS',
  YET_TO_START: 'NOT STARTED',
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

async function getProjectFileStatus(helixAdminApiUrl, sharepointProjectPath) {
  let projectFileStatusJson;
  try {
    const projectFileStatusUrl = `${helixAdminApiUrl}/?editUrl=${encodeURIComponent(sharepointProjectPath)}`;
    const projectFileStatus = await fetch(projectFileStatusUrl);
    if (projectFileStatus.ok) {
      projectFileStatusJson = await projectFileStatus.json();
    }
  } catch (error) {
    throw new Error(`Could not retrieve project file status from Helix Admin Api ${error}`);
  }
  return projectFileStatusJson;
}

async function generateProjectPreviewIf404(projectObject, projectFileStatus) {
  if (projectFileStatus.preview.status === 404) {
    await projectObject.purge();
  }
}

function getHelixAdminApiUrl(urlInfo, apiBaseUri) {
  return `${apiBaseUri}/${urlInfo.owner}/${urlInfo.repo}/${urlInfo.ref}`;
}

async function readProjectFile(projectWebUrl) {
  const resp = await fetch(projectWebUrl, { cache: 'no-store' });
  const json = await resp.json();
  if (json && json?.urls?.data) {
    return json;
  }
  return undefined;
}

function getArrayFromString(string, split) {
  return string ? string.split(split).filter((str) => str.trim().length > 0) : [];
}

function addOrAppendToMap(map, key, value) {
  if (map.has(key)) {
    map.get(key).push(value);
  } else {
    map.set(key, [value]);
  }
}

function getSubprojectsInfo(projectJson, config, urls, filePathToReferencePosition) {
  let projectStarted = false;
  const projectLanguages = projectJson?.languages?.data;
  const allLanguageInfo = config.locales;
  const activeLanguagesMap = new Map();
  projectLanguages
    .filter((language) => language.Action)
    .forEach((activeLanguage) => {
      activeLanguagesMap.set(activeLanguage.Language, activeLanguage);
    });
  const translationProjects = new Map();
  const englishCopyProjects = new Map();
  const rolloutProjects = new Map();

  function addUrls(langInfo, key) {
    const urlsMap = new Map();

    function getFolders(locales, srcDocPath) {
      return locales.map((locale) => `/${locale}${srcDocPath.substring(0, srcDocPath.lastIndexOf('/'))}`);
    }

    function getLangFilePath(language, srcDocPath) {
      return `/langstore/${language.toLowerCase()}${srcDocPath}`;
    }

    function getStatus(langFilePath) {
      let status = PROJECT_STATUS.YET_TO_START;
      if (langInfo.status !== PROJECT_STATUS.YET_TO_START) {
        status = langInfo.failedPages.includes(langFilePath)
          ? PROJECT_STATUS.FAILED : langInfo.status;
      }
      return status;
    }

    function getUrlLangInfo(langDetail, srcDocPath) {
      const langFilePath = getLangFilePath(langDetail.language, srcDocPath);
      return {
        languageFilePath: getLangFilePath(langDetail.language, srcDocPath),
        livecopyFolders: getFolders(langDetail.livecopies, srcDocPath),
        status: getStatus(langFilePath),
      };
    }

    urls.forEach((urlInfo, url) => {
      const srcDocPath = urlInfo.doc.filePath;
      const { language } = langInfo;
      const urlLangInfo = {
        langInfo: {
          srcDocPath,
          ...getUrlLangInfo(langInfo, srcDocPath, 'langInfo'),
        },
      };
      addOrAppendToMap(
        filePathToReferencePosition,
        urlLangInfo.langInfo.languageFilePath,
        `${key}|${language}|urls|${url}|langInfo`,
      );
      if (langInfo?.altLangInfo) {
        const { altLangInfo } = langInfo;
        urlLangInfo.altLangInfo = { ...getUrlLangInfo(altLangInfo, srcDocPath, 'altLangInfo') };
        addOrAppendToMap(
          filePathToReferencePosition,
          urlLangInfo.altLangInfo.languageFilePath,
          `${key}|${language}|urls|${url}|altLangInfo`,
        );
      }
      urlsMap.set(url, urlLangInfo);
    });
    langInfo.urls = urlsMap;
  }

  function getSelectedLivecopies(allLivecopies, livecopiesSelectedForRollout) {
    return livecopiesSelectedForRollout.length > 0 ? allLivecopies
      .filter((livecopy) => livecopiesSelectedForRollout.includes(livecopy)) : allLivecopies;
  }

  function getLanguageStatusMap() {
    const languageStatusMap = new Map();
    const languageStatusRows = projectJson?.status?.data;
    if (!languageStatusRows) {
      return languageStatusMap;
    }
    languageStatusRows.forEach((languageStatusRow) => {
      if (languageStatusRow?.Language) {
        languageStatusMap.set(languageStatusRow.Language, languageStatusRow);
      }
    });
    return languageStatusMap;
  }

  function isInvalidWorkflow(workflow) {
    return !workflow || !workflow?.product
      || !workflow?.project || !workflow?.workflowName;
  }
  function getTasksAPI(workflow) {
    if (isInvalidWorkflow(workflow)) {
      // eslint-disable-next-line no-console
      console.error('Workflow information not available in config.');
    }
    const { glaas } = config;
    return glaas.tasksApi(workflow);
  }

  const languageStatusMap = getLanguageStatusMap();
  allLanguageInfo.forEach((languageInfo) => {
    const { languagecode } = languageInfo;
    const { language } = languageInfo;
    const { altLanguagecode } = languageInfo;
    const livecopies = config.getLivecopiesForLanguage(languagecode);
    const livecopiesArray = getArrayFromString(livecopies, ',');
    if (activeLanguagesMap.has(language)) {
      const activeLanguage = activeLanguagesMap.get(language);
      const selectedRolloutLocalesArray = getArrayFromString(activeLanguage.Locales, '\n');
      const persistedStatus = languageStatusMap.get(languagecode);
      const workflowDetail = config.getWorkflowForLanguage(languagecode, activeLanguage?.Workflow);
      const langInfo = {
        language: languagecode,
        languageDisplayName: language,
        rolloutLocales: selectedRolloutLocalesArray,
        status: PROJECT_STATUS.YET_TO_START,
        failureMessage: '',
        failedPages: [],
        workflowDetail,
        livecopies: getSelectedLivecopies(livecopiesArray, selectedRolloutLocalesArray),
        glaasTasksAPI: language !== 'en' ? getTasksAPI(workflowDetail) : {},
      };
      if (persistedStatus) {
        projectStarted = true;
        langInfo.status = persistedStatus.Status;
        langInfo.savedStatus = persistedStatus.SavedStatus;
        langInfo.failureMessage = persistedStatus.FailureMessage;
        langInfo.failedPages = getArrayFromString(persistedStatus?.FailedPages);
      }
      if (altLanguagecode) {
        const altLangLocales = config.getLivecopiesForLanguage(altLanguagecode);
        const altLangLocalesArray = getArrayFromString(altLangLocales, ',');
        const altLangWorkflowDetail = config.getWorkflowForLanguage(altLanguagecode);
        langInfo.altLangInfo = {
          language: altLanguagecode,
          workflowDetail: altLangWorkflowDetail,
          livecopies: getSelectedLivecopies(altLangLocalesArray, selectedRolloutLocalesArray),
          glaasTasksAPI: config.glaas.tasksApi(altLangWorkflowDetail),
        };
      }
      const action = activeLanguage?.Action.toLowerCase();
      if (action === 'translate') {
        translationProjects.set(languagecode, langInfo);
        addUrls(langInfo, 'translationProjects');
      } else if (action === 'english copy') {
        englishCopyProjects.set(languagecode, langInfo);
        addUrls(langInfo, 'englishCopyProjects');
      } else if (action === 'rollout') {
        rolloutProjects.set(languagecode, langInfo);
        addUrls(langInfo, 'rolloutProjects');
      }
    }
  });
  return {
    projectStarted,
    subprojects: { translationProjects, englishCopyProjects, rolloutProjects },
  };
}

async function init() {
  if (project) return project;
  const config = await getConfig();
  const urlInfo = getUrlInfo();
  if (!urlInfo.isValid()) {
    throw new Error('Invalid Url Parameters that point to project file');
  }
  const hlxAdminStatusUrl = getHelixAdminApiUrl(urlInfo, config.admin.api.status.baseURI);
  const projectFileStatus = await getProjectFileStatus(hlxAdminStatusUrl, urlInfo.sp);
  if (!projectFileStatus || !projectFileStatus?.webPath) {
    throw new Error('Project File does not have valid web path');
  }
  const projectPath = projectFileStatus.webPath;
  const projectUrl = `${urlInfo.origin}${projectPath}`;
  const projectName = projectFileStatus.edit.name;
  project = {
    url: projectUrl,
    path: projectPath,
    name: projectName,
    excelPath: `${projectPath.substring(0, projectPath.lastIndexOf('/'))}/${projectName}`,
    sp: urlInfo.sp,
    owner: urlInfo.owner,
    repo: urlInfo.repo,
    ref: urlInfo.ref,
    purge() {
      const hlxAdminPreviewUrl = getHelixAdminApiUrl(urlInfo, config.admin.api.preview.baseURI);
      return fetch(`${hlxAdminPreviewUrl}${projectPath}`, { method: 'POST' });
    },
    async detail() {
      const projectFileJson = await readProjectFile(projectUrl);
      if (!projectFileJson) {
        return {};
      }
      const urlRows = projectFileJson.urls.data;
      const urls = new Map();
      const filePathToRefPosition = new Map();
      urlRows.forEach((urlRow) => {
        const url = urlRow.URL;
        const docPath = getDocPathFromUrl(url);
        const langstorePath = `/langstore/en${docPath}`;
        urls.set(url, {
          doc: { filePath: docPath },
          langstoreDoc: { filePath: langstorePath },
        });
        addOrAppendToMap(filePathToRefPosition, docPath, `urls|${url}|doc`);
        addOrAppendToMap(filePathToRefPosition, langstorePath, `urls|${url}|langstoreDoc`);
      });
      const subprojectInfo = getSubprojectsInfo(
        projectFileJson,
        config,
        urls,
        filePathToRefPosition,
      );
      const projectDetail = {
        projectStarted: subprojectInfo.projectStarted,
        url: projectUrl,
        name: projectName,
        urls,
        filePathsToReferencePositions: filePathToRefPosition,
        ...(subprojectInfo.subprojects),
      };
      window.projectDetail = projectDetail;
      return projectDetail;
    },
  };
  await generateProjectPreviewIf404(project, projectFileStatus);
  return project;
}

async function updateProjectWithDocs(projectDetail) {
  if (!projectDetail || !projectDetail?.filePathsToReferencePositions) {
    return;
  }
  const { filePathsToReferencePositions } = projectDetail;
  const filePaths = [...filePathsToReferencePositions.keys()];
  const spBatchFiles = await getSpFiles(filePaths);
  spBatchFiles.forEach((spFiles) => {
    if (spFiles && spFiles.responses) {
      spFiles.responses.forEach((file) => {
        const filePath = filePaths[file.id];
        const spFileStatus = file.status;
        const fileBody = spFileStatus === 200 ? file.body : {};
        const referencePositions = filePathsToReferencePositions.get(filePath);
        referencePositions.forEach((referencePosition) => {
          const keys = referencePosition.split('|');
          if (keys && keys.length > 0) {
            let position = projectDetail;
            keys.forEach((key) => {
              position = position[key] || position.get(key);
            });
            position.sp = fileBody;
            position.sp.status = spFileStatus;
          }
        });
      });
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export { init, updateProjectWithDocs, PROJECT_STATUS, PROJECTS_ROOT_PATH };
