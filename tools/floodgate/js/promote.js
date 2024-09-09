import {
  getFileNameFromPath,
  getFolderFromPath,
  getAuthorizedRequestOption,
  saveFile,
  updateExcelTable,
  validateConnection,
  fetchWithRetry,
} from '../../loc/sharepoint.js';
import {
  hideButtons,
  loadingON,
  showButtons,
  simulatePreview,
} from '../../loc/utils.js';
import { getConfig as getFloodgateConfig } from './config.js';
import { ACTION_BUTTON_IDS } from './ui.js';
import { delay, getFile, handleExtension } from './utils.js';

const BATCH_REQUEST_PROMOTE = 20;
const DELAY_TIME_PROMOTE = 3000;
const MAX_CHILDREN = 1000;

/**
 * Copies the Floodgated files back to the main content tree.
 * Creates intermediate folders if needed.
 */
async function promoteCopy(srcPath, destinationFolder, newName) {
  validateConnection();
  const { sp } = await getFloodgateConfig();
  const { baseURI, fgBaseURI } = sp.api.file.copy;
  const rootFolder = baseURI.split('/').pop();
  const payload = { ...sp.api.file.copy.payload, parentReference: { path: `${rootFolder}${destinationFolder}` } };
  if (newName) {
    payload.name = newName;
  }
  const options = getAuthorizedRequestOption({
    method: sp.api.file.copy.method,
    body: JSON.stringify(payload),
  });
  const copyStatusInfo = await fetchWithRetry(`${fgBaseURI}${srcPath}:/copy?@microsoft.graph.conflictBehavior=replace`, options);
  const statusUrl = copyStatusInfo.headers.get('Location');
  let copySuccess = false;
  let copyStatusJson = {};
  while (statusUrl && !copySuccess && copyStatusJson.status !== 'failed') {
    const status = await fetchWithRetry(statusUrl);
    if (status.ok) {
      copyStatusJson = await status.json();
      copySuccess = copyStatusJson.status === 'completed';
    }
  }
  return copySuccess;
}

/**
 * Iteratively finds all files under a specified root folder.
 */
async function findAllFloodgatedFiles(baseURI, options, rootFolder, fgFiles, fgFolders) {
  while (fgFolders.length !== 0) {
    const uri = `${baseURI}${fgFolders.shift()}:/children?$top=${MAX_CHILDREN}`;
    const res = await fetchWithRetry(uri, options);
    if (res.ok) {
      const json = await res.json();
      const driveItems = json.value;
      driveItems?.forEach((item) => {
        const itemPath = `${item.parentReference.path.replace(`/drive/root:/${rootFolder}`, '')}/${item.name}`;
        if (item.folder) {
          // it is a folder
          fgFolders.push(itemPath);
        } else {
          const downloadUrl = item['@microsoft.graph.downloadUrl'];
          fgFiles.push({ fileDownloadUrl: downloadUrl, filePath: itemPath });
        }
      });
    }
  }

  return fgFiles;
}

async function findAllFiles() {
  const { sp } = await getFloodgateConfig();
  const baseURI = `${sp.api.excel.update.fgBaseURI}`;
  const rootFolder = baseURI.split('/').pop();
  const options = getAuthorizedRequestOption({ method: 'GET' });

  return findAllFloodgatedFiles(baseURI, options, rootFolder, [], ['']);
}

async function promoteFloodgatedFiles(project) {
  function updateAndDisplayPromoteStatus(promoteStatus, srcPath) {
    const promoteDisplayText = promoteStatus
      ? `Promoted ${srcPath} to main content tree`
      : `Failed to promote ${srcPath} to the main content tree`;
    loadingON(promoteDisplayText);
  }

  async function promoteFile(downloadUrl, filePath) {
    const status = { success: false };
    try {
      let promoteSuccess = false;
      loadingON(`Promoting ${filePath} ...`);
      const folder = getFolderFromPath(filePath);
      const filename = getFileNameFromPath(filePath);
      const copyFileStatus = await promoteCopy(filePath, folder, filename);
      if (copyFileStatus) {
        promoteSuccess = true;
      } else {
        const file = await getFile(downloadUrl);
        const saveStatus = await saveFile(file, filePath);
        if (saveStatus.success) {
          promoteSuccess = true;
        }
      }
      updateAndDisplayPromoteStatus(promoteSuccess, filePath);
      status.success = promoteSuccess;
      status.srcPath = filePath;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error occurred when trying to promote files to main content tree ${error.message}`);
    }
    return status;
  }

  hideButtons(ACTION_BUTTON_IDS);
  const startPromote = new Date();
  // Iterate the floodgate tree and get all files to promote
  const allFloodgatedFiles = await findAllFiles();

  // create batches to process the data
  const batchArray = [];
  for (let i = 0; i < allFloodgatedFiles.length; i += BATCH_REQUEST_PROMOTE) {
    const arrayChunk = allFloodgatedFiles.slice(i, i + BATCH_REQUEST_PROMOTE);
    batchArray.push(arrayChunk);
  }

  // process data in batches
  const promoteStatuses = [];
  for (let i = 0; i < batchArray.length; i += 1) {
    promoteStatuses.push(...await Promise.all(
      batchArray[i].map((file) => promoteFile(file.fileDownloadUrl, file.filePath)),
    ));
    // eslint-disable-next-line no-promise-executor-return
    await delay(DELAY_TIME_PROMOTE);
  }
  const endPromote = new Date();

  loadingON('Previewing promoted files... ');
  const previewStatuses = [];
  for (let i = 0; i < promoteStatuses.length; i += 1) {
    if (promoteStatuses[i].success) {
      const result = await simulatePreview(handleExtension(promoteStatuses[i].srcPath), 1);
      previewStatuses.push(result);
    }
    // eslint-disable-next-line no-promise-executor-return
    await delay();
  }
  loadingON('Completed Preview for promoted files... ');

  const failedPromotes = promoteStatuses.filter((status) => !status.success)
    .map((status) => status.srcPath || 'Path Info Not available');
  const failedPreviews = previewStatuses.filter((status) => !status.success)
    .map((status) => status.path);

  const excelValues = [['PROMOTE', startPromote, endPromote, failedPromotes.join('\n'), failedPreviews.join('\n')]];
  await updateExcelTable(project.excelPath, 'PROMOTE_STATUS', excelValues);
  loadingON('Project excel file updated with promote status... ');
  showButtons(ACTION_BUTTON_IDS);

  if (failedPromotes.length > 0 || failedPreviews.length > 0) {
    loadingON('Error occurred when promoting floodgated content. Check project excel sheet for additional information<br/><br/>'
      + 'Reloading page... please wait.');
  } else {
    loadingON('Promoted floodgate tree successfully. Reloading page... please wait.');
  }
  setTimeout(() => window.location.reload(), 3000);
}

export default promoteFloodgatedFiles;
