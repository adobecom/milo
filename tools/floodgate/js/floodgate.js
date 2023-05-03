import { getConfig } from './config.js';
import { loadingOFF, loadingON } from '../../loc/utils.js';
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
  updateProjectStatusUI,
} from './ui.js';
import promoteFloodgatedFiles from './promote.js';
import floodgateContent from './copy.js';

async function reloadProject() {
  loadingON('Purging project file cache and reloading... please wait');
  await purgeAndReloadProjectFile();
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

  loadingON('UI updated..');
  loadingOFF();
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function floodgateContentAction(project) {
  const params = {
    spToken: getAccessToken(),
    adminPageUri: window.location.href,
    projectExcelPath: project.excelPath,
  };
  return postData('https://14257-milofg-sirivuri.adobeioruntime.net/api/v1/web/milo-fg/copy.json', params);
}

async function projectStatus(project) {
  const params = { projectExcelPath: project.excelPath };
  return postData('https://14257-milofg-sirivuri.adobeioruntime.net/api/v1/web/milo-fg/status.json', params);
}

function setListeners(project) {
  const modal = document.getElementById('fg-modal');
  const handleFloodgateConfirm = ({ target }) => {
    modal.style.display = 'none';
    floodgateContentAction(project);
    target.removeEventListener('click', handleFloodgateConfirm);
  };
  const handlePromoteConfirm = ({ target }) => {
    modal.style.display = 'none';
    promoteFloodgatedFiles(project);
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
  document.querySelector('#fg-modal #no-btn').addEventListener('click', () => { modal.style.display = 'none'; });
  document.querySelector('#projectStatus button').addEventListener('click', () => { projectStatus(project); });
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
    setListeners(project, projectDetail);

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint!');
    await refreshPage(config, projectDetail, project);

    // Check status of recent floodgate action.
    projectStatus(project);
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }
}

export default init;
