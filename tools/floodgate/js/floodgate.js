import { getConfig } from './config.js';
import {
  loadingOFF,
  loadingON,
} from '../../loc/utils.js';
import { connect as connectToSP } from '../../loc/sharepoint.js';
import {
  initProject,
  updateProjectWithDocs,
  purgeAndReloadProjectFile,
} from './project.js';
import {
  updateProjectInfo,
  updateProjectDetailsUI,
} from './ui.js';

async function reloadProject() {
  loadingON('Purging project file cache and reloading... please wait');
  await purgeAndReloadProjectFile();
}

function setListeners() {
  document.querySelector('#reloadProject button').addEventListener('click', reloadProject);
  document.querySelector('#loading').addEventListener('click', loadingOFF);
}

async function init() {
  try {
    // Set the listeners on the floodgate action buttons
    setListeners();

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
    loadingON(`Fetching project details for ${project.url}`);

    // Update project name on the admin page
    updateProjectInfo(project);

    // Read the project excel file and parse the data
    const projectDetail = await project.getDetails();
    loadingON('Project Details loaded...');

    loadingON('Connecting now to Sharepoint...');
    const connectedToSp = await connectToSP();
    if (!connectedToSp) {
      loadingON('Could not connect to sharepoint...');
      return;
    }
    loadingON('Connected to Sharepoint!');

    // Inject Sharepoint file metadata
    loadingON('Updating Project with the Sharepoint Docs Data...');
    await updateProjectWithDocs(projectDetail);

    // Render the data on the page
    loadingON('Updating UI..');
    await updateProjectDetailsUI(projectDetail, config);
    loadingON('UI updated..');
    loadingOFF();
  } catch (error) {
    loadingON(`Error occurred when initializing the Floodgate project ${error.message}`);
  }
}

export default init;
