import { createFolder, getAuthorizedRequestOption, saveFile, validateConnection } from '../../loc/sharepoint.js';
import { hideButtons, loadingOFF, loadingON } from '../../loc/utils.js';
import { getConfig as getFloodgateConfig } from './config.js';
import { ACTION_BUTTON_IDS } from './ui.js';

/**
 * Copies the Floodgated files back to the main content tree.
 * Creates intermediate folders if needed.
 */
async function promoteCopy(srcPath, destinationFolder) {
  validateConnection();
  await createFolder(destinationFolder);
  const { sp } = await getFloodgateConfig();
  const destRootFolder = `${sp.api.file.copy.baseURI}`.split('/').pop();

  const payload = { ...sp.api.file.copy.payload, parentReference: { path: `${destRootFolder}${destinationFolder}` } };
  const options = getAuthorizedRequestOption({
    method: sp.api.file.copy.method,
    body: JSON.stringify(payload),
  });

  // copy source is the pink directory for promote
  const copyStatusInfo = await fetch(`${sp.api.file.copy.fgBaseURI}${srcPath}:/copy`, options);
  const statusUrl = copyStatusInfo.headers.get('Location');
  let copySuccess = false;
  let copyStatusJson = {};
  while (statusUrl && !copySuccess && copyStatusJson.status !== 'failed') {
    // eslint-disable-next-line no-await-in-loop
    const status = await fetch(statusUrl);
    if (status.ok) {
      // eslint-disable-next-line no-await-in-loop
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
    const uri = `${baseURI}${fgFolders.shift()}:/children`;
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(uri, options);
    if (res.ok) {
      // eslint-disable-next-line no-await-in-loop
      const json = await res.json();
      const driveItems = json.value;
      if (driveItems) {
        driveItems.forEach((item) => {
          const itemPath = `${item.parentReference.path.replace(`/drive/root:/${rootFolder}`, '')}/${item.name}`;
          if (item.folder) {
            // it is a folder
            fgFolders.push(itemPath);
          } else {
            const downloadUrl = item['@microsoft.graph.downloadUrl'];
            fgFiles.push({ docDownloadUrl: downloadUrl, docPath: itemPath });
          }
        });
      }
    }
  }

  return fgFiles;
}

async function findAllFiles() {
  const { sp } = await getFloodgateConfig();
  const baseURI = `${sp.api.excel.update.fgBaseURI}`;
  const rootFolder = baseURI.split('/').pop();
  const options = getAuthorizedRequestOption({ method: 'GET' });

  const fgFiles = [];
  const fgFolders = [''];
  return findAllFloodgatedFiles(baseURI, options, rootFolder, fgFiles, fgFolders);
}

async function getFile(downloadUrl) {
  const response = await fetch(downloadUrl);
  return response.blob();
}

async function promoteFloodgatedFiles() {
  function updateAndDisplayPromoteStatus(promoteStatus, srcPath) {
    const promoteDisplayText = promoteStatus
      ? `Promoted ${srcPath} to main content tree`
      : `Failed to promote ${srcPath} to the main content tree`;
    loadingON(promoteDisplayText);
  }

  async function promoteFile(fileData) {
    const status = { success: false };
    try {
      let promoteSuccess = false;
      const { sp } = await getFloodgateConfig();
      const options = getAuthorizedRequestOption();
      const res = await fetch(`${sp.api.file.get.baseURI}${fileData.docPath}`, options);
      if (res.ok) {
        // File exists at the destination (main content tree)
        // Get the file in the pink directory
        // This is the downloadUrl value returned by the tree traversal
        const file = await getFile(fileData.docDownloadUrl);
        if (file) {
          // Save the file in the main content tree
          const saveStatus = await saveFile(file, fileData.docPath);
          if (saveStatus.success) {
            console.log(`save copied :: ${fileData.docPath}`);
            promoteSuccess = true;
          }
        }
      } else {
        // file does not exist at the destination (main content tree)
        // file can be copied directly
        const destinationFolder = `${fileData.docPath.substring(0, fileData.docPath.lastIndexOf('/'))}`;
        promoteSuccess = await promoteCopy(fileData.docPath, destinationFolder);
        console.log(`promote copied :: ${fileData.docPath}`);
      }
      status.success = promoteSuccess;
      status.srcPath = fileData.docPath;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error occurred when trying to promote files to main content tree ${error.message}`);
    }
    console.log('done');
    return status;
  }

  hideButtons(ACTION_BUTTON_IDS);

  // Iterate the floodgate tree and get all files to promote
  const allFiles = await findAllFiles();
  console.log(allFiles);

  const promoteStatuses = await Promise.all(allFiles.map((file) => promoteFile(file)));

  const failedPromotes = promoteStatuses.filter((status) => !status.success)
    .map((status) => status.srcPath || 'Path Info Not available');
  console.log(failedPromotes);

  // TODO: handle previews

  if (failedPromotes.length > 0 /*|| failedPreviews.length > 0*/) {
    let failureMessage = failedPromotes.length > 0 ? `Failed to promote ${failedPromotes} to main content tree. Check project excel sheet for additional information\n` : '';
    // failureMessage += failedPreviews.length > 0 ? `Failed to preview ${failedPreviews}. Kindly manually preview these files.` : '';
    loadingON(failureMessage);
  } else {
    loadingOFF();
    // await refreshPage();
  }
}

export default promoteFloodgatedFiles;
