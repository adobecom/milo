import { getConfig } from './config.js';
import {
  getUrlInfo,
  fetchProjectFile,
} from '../../loc/utils.js';
import {
  getProjectFileStatus,
  getHelixAdminApiUrl,
  readProjectFile,
} from '../../loc/project.js';
import { getFilesData } from '../../loc/sharepoint.js';
import { getDocPathFromUrl, getFloodgateUrl } from './utils.js';

let project;

const PROJECT_STATUS = {
  NOT_STARTED: 'NOT STARTED',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_ERROR: 'COMPLETED WITH ERROR',
};

/**
 * Makes the sharepoint file data part of `projectDetail` per URL.
 */
function injectSharepointData(projectUrls, filePaths, docPaths, spFiles, isFloodgate) {
  for (let i = 0; i < spFiles.length; i += 1) {
    let fileBody = {};
    let status = 404;
    if (!spFiles[i].error) {
      fileBody = spFiles[i];
      status = 200;
    }
    const filePath = docPaths[i];
    const urls = filePaths.get(filePath);
    urls.forEach((key) => {
      const urlObjVal = projectUrls.get(key);
      if (isFloodgate) {
        urlObjVal.doc.fg.sp = fileBody;
        urlObjVal.doc.fg.sp.status = status;
      } else {
        urlObjVal.doc.sp = fileBody;
        urlObjVal.doc.sp.status = status;
      }
    });
  }
}

async function updateProjectWithDocs(projectDetail) {
  if (!projectDetail || !projectDetail?.filePaths) {
    return;
  }
  const { filePaths } = projectDetail;
  const docPaths = [...filePaths.keys()];
  const spFiles = await getFilesData(docPaths);
  injectSharepointData(projectDetail.urls, filePaths, docPaths, spFiles);
  const fgSpFiles = await getFilesData(docPaths, true);
  injectSharepointData(projectDetail.urls, filePaths, docPaths, fgSpFiles, true);
}

async function initProject() {
  if (project) return project;
  const config = await getConfig();
  const urlInfo = getUrlInfo();
  if (!urlInfo.isValid()) {
    throw new Error('Invalid Url Parameters that point to project file');
  }

  // helix API to get the details/status of the file
  const hlxAdminStatusUrl = getHelixAdminApiUrl(urlInfo, config.admin.api.status.baseURI);

  // get the status of the project file
  const projectFileStatus = await getProjectFileStatus(hlxAdminStatusUrl, urlInfo.sp);
  if (!projectFileStatus || !projectFileStatus?.webPath) {
    throw new Error('Project file does not have valid web path');
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
    async getDetails() {
      const projectFileJson = await readProjectFile(projectUrl);
      if (!projectFileJson) {
        return {};
      }

      const urlsData = projectFileJson.urls.data;
      const urls = new Map();
      const filePaths = new Map();
      urlsData.forEach((urlRow) => {
        const url = urlRow.URL;
        const docPath = getDocPathFromUrl(url);
        urls.set(url, { doc: { filePath: docPath, url, fg: { url: getFloodgateUrl(url) } } });
        // Add urls data to filePaths map
        if (filePaths.has(docPath)) {
          filePaths.get(docPath).push(url);
        } else {
          filePaths.set(docPath, [url]);
        }
      });

      return { url: projectUrl, name: projectName, urls, filePaths };
    },
  };
  return project;
}

/**
 * Purge project file from cache and reload it to pick-up the latest changes.
 */
async function purgeAndReloadProjectFile() {
  const projectFile = await initProject();
  await projectFile.purge();
  await fetchProjectFile(projectFile.url, 1);
  window.location.reload();
}

function getStatusData(projectJson, field) {
  const actionData = projectJson[field].data;
  const lastRun = actionData[actionData.length - 1]['End Timestamp'];
  const failedPages = actionData[actionData.length - 1]['Failed Pages'];
  const failedPreviews = actionData[actionData.length - 1]['Failed Previews'];
  const status = (failedPages.length > 0 || failedPreviews.length > 0)
    ? PROJECT_STATUS.COMPLETED_WITH_ERROR
    : PROJECT_STATUS.COMPLETED;
  return { lastRun, status };
}

async function updateProjectStatus(projectData) {
  // Get project action data from excel
  const projectJson = await readProjectFile(projectData.url);
  const status = {};
  const defaultData = { lastRun: '-', status: PROJECT_STATUS.NOT_STARTED };

  if (!projectJson) return status;

  status.copy = projectJson.copystatus?.data?.length > 0 ? getStatusData(projectJson, 'copystatus') : defaultData;
  status.promote = projectJson.promotestatus?.data?.length > 0 ? getStatusData(projectJson, 'promotestatus') : defaultData;

  return status;
}

export {
  initProject,
  updateProjectWithDocs,
  purgeAndReloadProjectFile,
  updateProjectStatus,
};
