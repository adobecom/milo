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
import { asyncForEach, getSharepointLocationFromUrl } from './utils.js';
import getConfig from './config.js';

const PROJECTS_ROOT_PATH = '/drafts/localization/projects/';

let project;

function getUrlInfo() {
  const location = new URL(document.location.href);
  function getParam(name) {
    return location.searchParams.get(name);
  }

  const sub = location.hostname.split('.').shift().split('--');

  const sp = getParam('referrer');
  const owner = getParam('owner') || sub[2];
  const repo = getParam('repo') || sub[1];
  const ref = getParam('ref') || sub[0];
  return {
    sp,
    owner,
    repo,
    ref,
    origin: `https://${ref}--${repo}--${owner}.hlx.page`,
    isValid() {
      return sp && owner && repo && ref;
    },
  };
}

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
  if (json && json.translation && json.translation.data) {
    return json.translation.data;
  }
  return undefined;
}

function getProjectFolder(path) {
  return path.substring(0, path.lastIndexOf('.'));
}

function shouldGenerateEnglishCopy(action) {
  return action && action.toLowerCase() === 'english copy';
}

function shouldBeProcessed(language, translationRow) {
  return translationRow[language] && `${translationRow[language]}`;
}

function shouldRollout(action) {
  return action && action.toLowerCase() === 'rollout';
}

function addToExistingOrCreate(projectDetail, key, task) {
  projectDetail[key] = projectDetail[key] || [];
  projectDetail[key].push(task);
}

function addToArrayIfNotPresent(array, toAdd) {
  if (array.indexOf(toAdd) === -1) {
    array.push(toAdd);
  }
}

function updateProjectDetailWithTask(projectDetail, task) {
  const urlToTranslate = task.URL;
  const { language } = task;
  // addToExistingOrCreate(projectDetail, urlToTranslate, task);
  addToExistingOrCreate(projectDetail, language, task);
  addToArrayIfNotPresent(projectDetail.urls, urlToTranslate);
  addToArrayIfNotPresent(projectDetail.languages, language);
  if (!projectDetail.docs[urlToTranslate]) {
    projectDetail.docs[urlToTranslate] = { filePath: task.filePath };
  }
}

function getTargetFolders(srcPath, projectFolder, targetLocales) {
  const targetFolders = [];
  if (!targetLocales) {
    return targetFolders;
  }
  const targetLocalesArray = targetLocales.split(',');
  // eslint-disable-next-line no-restricted-syntax
  for (const targetLocale of targetLocalesArray) {
    targetFolders.push(`/${targetLocale}${srcPath.substring(0, srcPath.lastIndexOf('/'))}`);
  }
  return targetFolders;
}

async function addLanguageTasksToProject(projectDetail, projectFolder, locConfig, translationTask) {
  const localesConfig = locConfig.locales;
  const urlToTranslate = translationTask.URL;
  const srcPath = getSharepointLocationFromUrl(urlToTranslate);
  await asyncForEach(localesConfig, async (localeConfig) => {
    const languageCode = localeConfig.languagecode;
    const altLanguageCode = localeConfig.altLanguagecode;
    const { language } = localeConfig;
    if (languageCode === 'en' || shouldBeProcessed(language, translationTask)) {
      const action = translationTask[language];
      const targetLivecopies = await locConfig.getLivecopiesForLanguage(languageCode);
      const targetLivecopyFolders = getTargetFolders(srcPath, projectFolder, targetLivecopies);
      const targetAltLangLocales = await locConfig.getAltLangLocales(languageCode);
      const targetAltLangFolders = getTargetFolders(srcPath, projectFolder, targetAltLangLocales);
      const skipTranslation = languageCode === 'en' || shouldRollout(action);
      const task = {
        URL: urlToTranslate,
        language: languageCode,
        altlanguage: altLanguageCode,
        path: srcPath,
        skipLanguageTranslation: skipTranslation,
        rolloutOnly: skipTranslation && !altLanguageCode,
        englishCopy: shouldGenerateEnglishCopy(action),
        filePath: `${srcPath}.docx`,
        languagePath: `/langstore/${languageCode}${srcPath}`,
        languageFilePath: `/langstore/${languageCode}${srcPath}.docx`,
        altLanguagePath: altLanguageCode ? `/langstore/${altLanguageCode.toLowerCase()}${srcPath}` : '',
        altLanguageFilePath: altLanguageCode ? `/langstore/${altLanguageCode.toLowerCase()}${srcPath}.docx` : '',
        livecopyFolders: targetLivecopyFolders,
        altLangFolders: targetAltLangFolders,
      };
      updateProjectDetailWithTask(projectDetail, task);
    }
  });
}

async function init() {
  if (project) return project;
  const locConfig = await getConfig();
  const urlInfo = getUrlInfo();
  if (!urlInfo.isValid()) {
    throw new Error('Invalid Url Parameters that point to project file');
  }
  const hlxAdminStatusUrl = getHelixAdminApiUrl(urlInfo, locConfig.admin.api.status.baseURI);
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
      const hlxAdminPreviewUrl = getHelixAdminApiUrl(urlInfo, locConfig.admin.api.preview.baseURI);
      return fetch(`${hlxAdminPreviewUrl}${projectPath}`, { method: 'POST' });
    },
    async detail() {
      const projectFileJson = await readProjectFile(projectUrl);
      const projectDetail = {
        languages: [],
        urls: [],
        url: projectUrl,
        docs: {},
        name: projectName,
      };
      if (!projectFileJson) {
        return projectDetail;
      }
      const projectFolder = getProjectFolder(projectPath);
      await asyncForEach(projectFileJson, async (translationTask) => {
        const urlToTranslate = translationTask.URL;
        if (!urlToTranslate) {
          return;
        }
        await addLanguageTasksToProject(
          projectDetail,
          projectFolder,
          locConfig,
          translationTask,
        );
      });
      // For Debugging.
      window.projectDetail = projectDetail;
      return projectDetail;
    },
  };
  await generateProjectPreviewIf404(project, projectFileStatus);
  return project;
}

// eslint-disable-next-line import/prefer-default-export
export { init, PROJECTS_ROOT_PATH };
