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
import { getSpFiles } from '../../loc/sharepoint.js';
import { getDocPathFromUrl, getFloodgateUrl } from './utils.js';
import { getHelixAdminConfig } from '../../loc/config.js';

let project;

const PROJECT_STATUS = {
  NOT_STARTED: 'NOT STARTED',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_ERROR: 'COMPLETED WITH ERROR',
};

/**
 * Makes the sharepoint file data part of `projectDetail` per URL.
 */
function injectSharepointData(projectUrls, filePaths, docPaths, spBatchFiles, isFloodgate) {
  spBatchFiles.forEach((spFiles) => {
    if (!spFiles?.responses) return;
    spFiles.responses.forEach(({ id, status, body }) => {
      const filePath = docPaths[id];
      const fileBody = status === 200 ? body : {};
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
    });
  });
}

async function updateProjectWithDocs(projectDetail) {
  if (!projectDetail || !projectDetail?.filePaths) {
    return;
  }
  const { filePaths } = projectDetail;
  const docPaths = [...filePaths.keys()];
  const spBatchFiles = await getSpFiles(docPaths);
  injectSharepointData(projectDetail.urls, filePaths, docPaths, spBatchFiles);
  const fgSpBatchFiles = await getSpFiles(docPaths, true);
  injectSharepointData(projectDetail.urls, filePaths, docPaths, fgSpBatchFiles, true);
}

async function getProjFileStatus(urlInfo) {
  const adminConfig = getHelixAdminConfig();
  // helix API to get the details/status of the file
  const hlxAdminStatusUrl = getHelixAdminApiUrl(urlInfo, adminConfig.api.status.baseURI);

  // get the status of the project file
  const projectFileStatus = await getProjectFileStatus(hlxAdminStatusUrl, urlInfo.sp);
  if (!projectFileStatus || !projectFileStatus?.webPath) {
    throw new Error('Project file does not have valid web path');
  }

  return projectFileStatus;
}

async function getFloodgateColor() {
  const urlInfo = getUrlInfo();
  if (!urlInfo.isValid()) {
    throw new Error('Invalid Url Parameters that point to project file');
  }

  const projectFileStatus = await getProjFileStatus(urlInfo);

  const projectPath = projectFileStatus.webPath;
  const projectUrl = `${urlInfo.origin}${projectPath}`;
  const projectFileJson = await readProjectFile(projectUrl);
  if (!projectFileJson) {
    throw new Error('Could not read the profile file');
  }

  return projectFileJson.fgcolor.data[0]?.FloodgateColor || 'pink';
}

async function initProject(fgColor) {
  if (project) return project;
  if (!fgColor) {
    throw new Error('Invalid Floodgate Color');
  }
  const config = await getConfig(fgColor);
  const urlInfo = getUrlInfo();
  if (!urlInfo.isValid()) {
    throw new Error('Invalid Url Parameters that point to project file');
  }

  const projectFileStatus = await getProjFileStatus(urlInfo);
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
    fgColor,
    purge() {
      const hlxAdminPreviewUrl = getHelixAdminApiUrl(urlInfo, config.admin.api.preview.baseURI);
      return fetch(`${hlxAdminPreviewUrl}${projectPath}`, { method: 'POST' });
    },
    async detail() {
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
        const fgUrl = getFloodgateUrl(url, fgColor);
        urls.set(url, { doc: { filePath: docPath, url, fg: { url: fgUrl } } });
        // Add urls data to filePaths map
        if (filePaths.has(docPath)) {
          filePaths.get(docPath).push(url);
        } else {
          filePaths.set(docPath, [url]);
        }
      });

      return { url: projectUrl, name: projectName, urls, filePaths, fgColor };
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
  getFloodgateColor,
};
