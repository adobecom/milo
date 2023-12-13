import {
  copyFile,
  getFile,
  saveFile,
  updateExcelTable,
} from '../../loc/sharepoint.js';
import { hideButtons, loadingON, showButtons, simulatePreview } from '../../loc/utils.js';
import { ACTION_BUTTON_IDS } from './ui.js';
import { delay, handleExtension } from './utils.js';

const BATCH_REQUEST_COPY = 20;
const DELAY_TIME_COPY = 3000;

async function floodgateContent(project, projectDetail) {
  function updateAndDisplayCopyStatus(copyStatus, srcPath) {
    const copyDisplayText = copyStatus
      ? `Copied ${srcPath} to floodgated content folder`
      : `Failed to copy ${srcPath} to floodgated content folder`;
    loadingON(copyDisplayText);
  }

  async function copyFilesToFloodgateTree(urlInfo) {
    const status = { success: false };
    if (!urlInfo?.doc) return status;

    try {
      const srcPath = urlInfo.doc.filePath;
      loadingON(`Copying ${srcPath} to FG folder`);
      let copySuccess = false;
      const destinationFolder = `${srcPath.substring(0, srcPath.lastIndexOf('/'))}`;
      copySuccess = await copyFile(srcPath, destinationFolder, undefined, true);
      if (copySuccess === false) {
        const file = await getFile(urlInfo.doc);
        if (file) {
          const destination = urlInfo.doc.filePath;
          if (destination) {
            // Save the file in the floodgate destination location
            const saveStatus = await saveFile(file, destination, true);
            if (saveStatus.success) {
              copySuccess = true;
            }
          }
        }
      }
      updateAndDisplayCopyStatus(copySuccess, srcPath);
      status.success = copySuccess;
      status.srcPath = srcPath;
      status.url = urlInfo.doc.url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error occurred when trying to copy files to floodgated content folder ${error.message}`);
    }
    return status;
  }

  hideButtons(ACTION_BUTTON_IDS);
  const startCopy = new Date();
  // create batches to process the data
  const contentToFloodgate = [...projectDetail.urls];
  const batchArray = [];
  for (let i = 0; i < contentToFloodgate.length; i += BATCH_REQUEST_COPY) {
    const arrayChunk = contentToFloodgate.slice(i, i + BATCH_REQUEST_COPY);
    batchArray.push(arrayChunk);
  }

  // process data in batches
  const copyStatuses = [];
  for (let i = 0; i < batchArray.length; i += 1) {
    copyStatuses.push(...await Promise.all(
      batchArray[i].map((files) => copyFilesToFloodgateTree(files[1])),
    ));
    // eslint-disable-next-line no-promise-executor-return
    await delay(DELAY_TIME_COPY);
  }
  const endCopy = new Date();

  loadingON('Previewing for copied files... ');
  const previewStatuses = [];
  for (let i = 0; i < copyStatuses.length; i += 1) {
    if (copyStatuses[i].success) {
      const extn = handleExtension(copyStatuses[i].srcPath);
      const result = await simulatePreview(extn, 1, true, project.fgColor);
      previewStatuses.push(result);
    }
    // eslint-disable-next-line no-promise-executor-return
    await delay();
  }
  loadingON('Completed Preview for copied files... ');

  const failedCopies = copyStatuses.filter((status) => !status.success)
    .map((status) => status.srcPath || 'Path Info Not available');
  const failedPreviews = previewStatuses.filter((status) => !status.success)
    .map((status) => status.path);

  const excelValues = [['COPY', startCopy, endCopy, failedCopies.join('\n'), failedPreviews.join('\n')]];
  await updateExcelTable(project.excelPath, 'COPY_STATUS', excelValues);
  loadingON('Project excel file updated with copy status... ');
  showButtons(ACTION_BUTTON_IDS);

  if (failedCopies.length > 0 || failedPreviews.length > 0) {
    loadingON('Error occurred when floodgating content. Check project excel sheet for additional information<br/><br/>'
      + 'Reloading page... please wait.');
  } else {
    loadingON('Copied content to floodgate tree successfully. Reloading page... please wait.');
  }
  setTimeout(() => window.location.reload(), 3000);
}

export default floodgateContent;
