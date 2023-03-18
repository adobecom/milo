import { getConfig } from './config.js';
import {
  loadingOFF,
  loadingON,
  simulatePreview,
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
  updateProjectStatus,
} from './project.js';
import {
  updateProjectInfo,
  updateProjectDetailsUI,
  updateProjectStatusUI,
  ACTION_BUTTON_IDS,
} from './ui.js';
import promoteFloodgatedFiles from './promote.js';
import { handleExtension } from './utils.js';

async function reloadProject() {
  loadingON('Purging project file cache and reloading... please wait');
  await purgeAndReloadProjectFile();
}

async function refreshPage(config, projectDetail, project) {
  // Inject Sharepoint file metadata
  loadingON('Updating Project with the Sharepoint Docs Data...');
  await updateProjectWithDocs(projectDetail);

  // Render the data on the page
  loadingON('Updating table with project details..');
  await updateProjectDetailsUI(projectDetail, config);

  // Read the project action status
  loadingON('Updating project status...');
  const status = await updateProjectStatus(project);
  updateProjectStatusUI(status);

  loadingON('UI updated..');
  loadingOFF();
}

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
      loadingON(`Copying ${srcPath} to pink folder`);
      let copySuccess = false;
      if (urlInfo.doc.fg?.sp?.status !== 200) {
        const destinationFolder = `${srcPath.substring(0, srcPath.lastIndexOf('/'))}`;
        copySuccess = await copyFile(srcPath, destinationFolder, undefined, true);
        updateAndDisplayCopyStatus(copySuccess, srcPath);
      } else {
        // Get the source file
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
        updateAndDisplayCopyStatus(copySuccess, srcPath);
      }
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
  const copyStatuses = await Promise.all(
    [...projectDetail.urls].map((valueArray) => copyFilesToFloodgateTree(valueArray[1])),
  );
  const endCopy = new Date();

  loadingON('Previewing for copied files... ');
  const previewStatuses = await Promise.all(
    copyStatuses
      .filter((status) => status.success)
      .map((status) => simulatePreview(handleExtension(status.srcPath), 1, true)),
  );
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

function setListeners(project, projectDetail) {
  document.querySelector('#reloadProject button').addEventListener('click', reloadProject);
  document.querySelector('#copyFiles button').addEventListener('click', () => floodgateContent(project, projectDetail));
  document.querySelector('#promoteFiles button').addEventListener('click', () => promoteFloodgatedFiles(project));
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function init() {
  try {
    // Read the Floodgate Sharepoint Config
    loadingON('Fetching Floodgate Config...');
    const config = await getConfig();
    if (!config) {
      return;
    }
    loadingON('Floodgate Config loaded...');

    // Initialize the Floodgate Project by setting the required project info
    loadingON('Fetching Project Config...');
    const project = await initProject();
    await project.purge();
    loadingON(`Fetching project details for ${project.url}`);

    // Update project name on the admin page
    updateProjectInfo(project);

    // Read the project excel file and parse the data
    const projectDetail = await project.getDetails();
    loadingON('Project Details loaded...');

    // Set the listeners on the floodgate action buttons
    setListeners(project, projectDetail);

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint!');
    await refreshPage(config, projectDetail, project);
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }
}

export default init;
