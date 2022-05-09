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
import { asyncForEach, getPathFromUrl } from './utils.js';
import getConfig from './config.js';

const PROJECTS_ROOT_PATH = '/drafts/localization/projects/';

let project;

function getUrlInfo() {
  const location = new URL(document.location.href);
  function getParam(name) {
    return location.searchParams.get(name);
  }
  const sp = getParam('sp');
  const owner = getParam('owner');
  const repo = getParam('repo');
  const ref = getParam('ref');
  return {
    sp,
    owner,
    repo,
    ref,
    origin: `${location.origin}`,
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
  if (json && json.data) {
    return json.data;
  }
  return undefined;
}

function getProjectFolder(path) {
  return path.substring(0, path.lastIndexOf('.'));
}

function getSharepointLocationFromUrl(url) {
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

function shouldBeTranslated(targetLocale, translationRow) {
  return translationRow[targetLocale] && `${translationRow[targetLocale]}`.toLowerCase() === 'y';
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
  const targetLocale = task.locale;
  addToExistingOrCreate(projectDetail, urlToTranslate, task);
  addToExistingOrCreate(projectDetail, targetLocale, task);
  addToArrayIfNotPresent(projectDetail.locales, targetLocale);
  addToArrayIfNotPresent(projectDetail.urls, urlToTranslate);
  if (!projectDetail.docs[urlToTranslate]) {
    projectDetail.docs[urlToTranslate] = { filePath: task.filePath };
  }
}

async function addLocaleTasksToProject(projectDetail, projectFolder, locConfig, translationTask) {
  const localesConfig = locConfig.locales;
  const urlToTranslate = translationTask.URL;
  await asyncForEach(localesConfig, async (localeConfig) => {
    const targetLocale = localeConfig.locale;
    if (shouldBeTranslated(targetLocale, translationTask)) {
      const srcPath = getSharepointLocationFromUrl(urlToTranslate);
      const targetLocalePath = await locConfig.getPathForLocale(targetLocale);
      const task = {
        URL: urlToTranslate,
        locale: targetLocale,
        path: srcPath,
        filePath: `${srcPath}.docx`,
        localePath: `/${targetLocalePath}${srcPath}`,
        localeFilePath: `/${targetLocalePath}${srcPath}.docx`,
        draftLocalePath: `${projectFolder}/${targetLocalePath}${srcPath}`,
        draftLocaleFilePath: `${projectFolder}/${targetLocalePath}${srcPath}.docx`,
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
    name: projectFileStatus.edit.name,
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
      const projectDetail = { locales: [], urls: [], url: projectUrl, docs: {}, name: projectName };
      if (!projectFileJson) {
        return projectDetail;
      }
      const projectFolder = getProjectFolder(projectPath);
      await asyncForEach(projectFileJson, async (translationTask) => {
        const urlToTranslate = translationTask.URL;
        if (!urlToTranslate) {
          return;
        }
        await addLocaleTasksToProject(
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
