import { getConfig } from './config.js';
import { loadingOFF, loadingON } from '../../loc/utils.js';
import { enableRetry, connect as connectToSP } from '../../loc/sharepoint.js';
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

function setListeners(project, projectDetail) {
  const modal = document.getElementById('fg-modal');
  const handleFloodgateConfirm = ({ target }) => {
    modal.style.display = 'none';
    floodgateContent(project, projectDetail);
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
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }
}

export default init;
