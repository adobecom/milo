import { getConfig } from './config.js';
import { loadingOFF, loadingON } from '../../loc/utils.js';
import { getParams, postData } from './utils.js';
import { enableRetry, connect as connectToSP, getAccessToken } from '../../loc/sharepoint.js';
import {
  initProject,
  updateProjectWithDocs,
  purgeAndReloadProjectFile,
  updateProjectStatus,
} from './project.js';
import {
  updateProjectInfo,
  updateProjectDetailsUI,
  updateProjectStatusUIFromAction,
  updateProjectStatusUI,
} from './ui.js';

async function reloadProject() {
  loadingON('Purging project file cache and reloading... please wait');
  await purgeAndReloadProjectFile();
}

async function floodgateContentAction(project, config) {
  const params = getParams(project, config);
  params.spToken = getAccessToken();
  const copyStatus = await postData(config.sp.aioCopyAction, params);
  updateProjectStatusUIFromAction({ copyStatus });
}

async function promoteContentAction(project, config) {
  const params = getParams(project, config);
  params.spToken = getAccessToken();
  const promoteStatus = await postData(config.sp.aioPromoteAction, params);
  updateProjectStatusUIFromAction({ promoteStatus });
}

async function fetchStatusAction(project, config) {
  // fetch copy status
  let params = {
    projectExcelPath: project.excelPath,
    projectRoot: config.sp.rootFolders,
  };
  const copyStatus = await postData(config.sp.aioStatusAction, params);
  // fetch promote status
  params = { projectRoot: config.sp.fgRootFolder };
  const promoteStatus = await postData(config.sp.aioStatusAction, params);
  updateProjectStatusUIFromAction({ copyStatus, promoteStatus });
}

async function refreshPage(config, projectDetail, project) {
  // Inject Sharepoint file metadata
  loadingON('Updating Project with the Sharepoint Docs Data... please wait');
  await updateProjectWithDocs(projectDetail);

  // Render the data on the page
  loadingON('Updating table with project details..');
  await updateProjectDetailsUI(projectDetail, config);

  // Read the project action status
  loadingON('Updating project status...');
  const status = await updateProjectStatus(project);
  updateProjectStatusUI(status);

  await fetchStatusAction(project, config);
  loadingON('UI updated..');
  loadingOFF();
}

function setListeners(project, config) {
  const modal = document.getElementById('fg-modal');
  const handleFloodgateConfirm = ({ target }) => {
    modal.style.display = 'none';
    floodgateContentAction(project, config);
    target.removeEventListener('click', handleFloodgateConfirm);
  };
  const handlePromoteConfirm = ({ target }) => {
    modal.style.display = 'none';
    promoteContentAction(project, config);
    target.removeEventListener('click', handlePromoteConfirm);
  };
  document.querySelector('#reloadProject button').addEventListener('click', reloadProject);
  document.querySelector('#copyFiles button').addEventListener('click', (e) => {
    modal.getElementsByTagName('p')[0].innerText = `Confirm to ${e.target.textContent}`;
    modal.style.display = 'block';
    document.querySelector('#fg-modal #yes-btn').addEventListener('click', handleFloodgateConfirm);
  });
  document.querySelector('#promoteFiles button').addEventListener('click', (e) => {
    modal.getElementsByTagName('p')[0].innerText = `Confirm to ${e.target.textContent}`;
    modal.style.display = 'block';
    document.querySelector('#fg-modal #yes-btn').addEventListener('click', handlePromoteConfirm);
  });
  document.querySelector('#fg-modal #no-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function init() {
  try {
    // Read the Floodgate Sharepoint Config
    loadingON('Fetching Floodgate Config...');
    enableRetry(); // Adding this for checking rate limit code for floodgate
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
    setListeners(project, config);

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
