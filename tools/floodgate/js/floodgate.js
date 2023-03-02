import { getConfig } from './config.js';
import {
  loadingOFF,
  loadingON,
  simulatePreview,
  stripExtension,
  showButtons,
  hideButtons,
} from '../../loc/utils.js';
import {
  connect as connectToSP,
  copyFile,
  getFile,
  saveFile,
  updateExcelTable,
} from '../../loc/sharepoint.js';
import {
  initProject,
  updateProjectWithDocs,
  purgeAndReloadProjectFile,
} from './project.js';
import {
  updateProjectInfo,
  updateProjectDetailsUI,
  ACTION_BUTTON_IDS,
} from './ui.js';

let projectDetail;
let project;
let config;

async function reloadProject() {
  loadingON('Purging project file cache and reloading... please wait');
  await purgeAndReloadProjectFile();
}

async function refreshPage() {
  // Inject Sharepoint file metadata
  loadingON('Updating Project with the Sharepoint Docs Data...');
  await updateProjectWithDocs(projectDetail);

  // Render the data on the page
  loadingON('Updating tabeke with project details..');
  await updateProjectDetailsUI(projectDetail, config);
  loadingON('UI updated..');
  loadingOFF();
}

async function floodgateContent() {
  function updateAndDisplayCopyStatus(copyStatus, srcPath) {
    let copyDisplayText = `Copied ${srcPath} to floodgated content folder`;
    if (!copyStatus) {
      copyDisplayText = `Failed to copy ${srcPath} to floodgated content folder`;
    }
    loadingON(copyDisplayText);
  }

  async function copyFilesToFloodgateTree(urlInfo) {
    const status = { success: false };
    try {
      const srcPath = urlInfo?.doc?.filePath;
      loadingON(`Copying ${srcPath} to pink folder`);
      let copySuccess = false;
      if (urlInfo?.doc?.fg?.sp?.status !== 200) {
        const destinationFolder = `${srcPath.substring(0, srcPath.lastIndexOf('/'))}`;
        copySuccess = await copyFile(srcPath, destinationFolder, undefined, true);
        updateAndDisplayCopyStatus(copySuccess, srcPath);
      } else {
        // Get the source file
        const file = await getFile(urlInfo.doc);
        if (file) {
          const destination = urlInfo?.doc?.filePath;
          if (destination) {
            // Save the file in the floodgate destination location
            const saveStatus = await saveFile(file, destination, true);
            if (saveStatus.success) {
              copySuccess = true;
            }
          }
        }
        updateAndDisplayCopyStatus(copySuccess, srcPath);
      }
      status.success = copySuccess;
      status.srcPath = srcPath;
      status.dstPath = srcPath;
      status.url = urlInfo.doc.url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error occurred when trying to copy files to floodgated content folder ${error.message}`);
    }
    return status;
  }

  hideButtons(ACTION_BUTTON_IDS);
  const startCopy = new Date();
  const copyStatuses = await Promise.all(
    [...projectDetail.urls].map((valueArray) => copyFilesToFloodgateTree(valueArray[1])),
  );
  const endCopy = new Date();

  loadingON('Previewing for copied files... ');
  const previewStatuses = await Promise.all(
    copyStatuses
      .filter((status) => status.success)
      .map((status) => simulatePreview(stripExtension(status.dstPath), 1, true)),
  );
  loadingON('Completed Preview for copied files... ');

  const failedCopies = copyStatuses.filter((status) => !status.success)
    .map((status) => status.srcPath || 'Path Info Not available');
  const failedPreviews = previewStatuses.filter((status) => !status.success)
    .map((status) => status.path);

  const excelValues = [['COPY', startCopy, endCopy, failedCopies.join('\n')]];
  await updateExcelTable(project.excelPath, 'STATUS', excelValues);
  loadingON('Project excel file updated with copy status... ');
  showButtons(ACTION_BUTTON_IDS);

  if (failedCopies.length > 0 || failedPreviews.length > 0) {
    let failureMessage = failedCopies.length > 0 ? `Failed to copy ${failedCopies} to floodgate content folder. Check project excel sheet for additional information\n` : '';
    failureMessage += failedPreviews.length > 0 ? `Failed to preview ${failedPreviews}. Kindly manually preview these files.` : '';
    loadingON(failureMessage);
  } else {
    loadingOFF();
    await refreshPage();
  }
}

function setListeners() {
  document.querySelector('#reloadProject button').addEventListener('click', reloadProject);
  document.querySelector('#copyFiles button').addEventListener('click', floodgateContent);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function init() {
  try {
    // Set the listeners on the floodgate action buttons
    setListeners();

    // Read the Floodgate Sharepoint Config
    loadingON('Fetching Floodgate Config...');
    config = await getConfig();
    if (!config) {
      return;
    }
    loadingON('Floodgate Config loaded...');

    // Initialize the Floodgate Project by setting the required project info
    loadingON('Fetching Project Config...');
    project = await initProject();
    loadingON(`Fetching project details for ${project.url}`);

    // Update project name on the admin page
    updateProjectInfo(project);

    // Read the project excel file and parse the data
    projectDetail = await project.getDetails();
    loadingON('Project Details loaded...');

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint!');
    await refreshPage();
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }
}

export default init;
