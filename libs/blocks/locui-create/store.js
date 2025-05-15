import { signal } from '../../deps/htm-preact.js';
import login from '../../tools/sharepoint/login.js';
import { accessToken } from '../../tools/sharepoint/state.js';
import { origin } from '../locui/utils/franklin.js';
import { LOCALES, LOCALE_GROUPS, USER_WORKFLOW_TYPE } from './utils/constant.js';
import {
  processLocaleData,
  createPayload,
  getMilocUrl,
  getProject,
} from './utils/utils.js';

export const telemetry = { application: { appName: 'Adobe Localization' } };

export const authenticated = signal(false);
export const currentStep = signal(1);
export const loading = signal(false);
export const project = signal(null);
export const projectInfo = signal(null);
export const projectCreated = signal(false);
export const locales = signal([]);
export const localeRegion = signal([]);
export const locSelected = signal(null);
export const projectType = signal('rollout');
export const initByParams = signal(null);
export const env = signal('stage');
export const userWorkflowType = signal('normal');

export function nextStep() {
  currentStep.value += 1;
}

export function prevStep() {
  currentStep.value -= 1;
}

export function setProject(_project) {
  project.value = {
    ...project.value,
    ..._project,
  };
}

export function setInitByParams(params) {
  initByParams.value = {
    ...initByParams.value,
    ...params,
  };
}

export function setLocale(_locale) {
  locSelected.value = {
    ...locSelected.value,
    ..._locale,
  };
}

export function setUserWorkflowType(workflow) {
  userWorkflowType.value = workflow;
}

export function reset() {
  currentStep.value = 1;
  project.value = null;
}

export async function getUserToken() {
  if (accessToken.value) {
    return accessToken.value;
  }
  const scopes = ['files.readwrite', 'sites.readwrite.all'];
  let userToken = null;
  loading.value = true;
  try {
    await login({ scopes, telemetry });
    userToken = accessToken.value;
    authenticated.value = true;
  } catch {
    console.error('Sharepoint login failed. Unable to get User-Token!');
    authenticated.value = false;
  }
  loading.value = false;
  return userToken;
}

async function fetchLocales(tenantBaseUrl) {
  try {
    const response = await fetch(
      `${tenantBaseUrl}/.milo/config.json?sheet=${LOCALES}&sheet=${LOCALE_GROUPS}`,
    );
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }
    const localeData = await response.json();
    if (localeData.locales && localeData.localegroups) {
      return localeData;
    }
    return null;
  } catch (error) {
    console.error('Error during fetchLocaleDetailsFromOrigin:', error.message);
    return null;
  }
}

export async function fetchLocaleDetails() {
  try {
    loading.value = true;
    let localeData = await fetchLocales(origin);
    if (!localeData) {
      localeData = await fetchLocales('https://main--federal--adobecom.aem.page');
    }
    if (!localeData) {
      throw new Error('Server Error: could not fetch locales');
    }
    const
      {
        locales: processedLocales,
        localeRegion: processedLocaleRegion,
      } = processLocaleData(localeData);

    locales.value = processedLocales.filter((locItem) => locItem.livecopies !== '');
    localeRegion.value = processedLocaleRegion;
  } catch (error) {
    console.error('Error during fetchLocaleDetails:', error.message);
  }
  loading.value = false;
}

export async function createDraftProject() {
  const userToken = await getUserToken();
  if (!userToken) {
    return 'Unable to login to Sharepoint.';
  }
  let error = 'Something went wrong. Please try again!';
  loading.value = true;

  try {
    const url = await getMilocUrl();
    const response = await fetch(`${url}create-draft-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': userToken,
      },
      body: JSON.stringify(createPayload(project)),
    });
    const responseJson = await response.json();
    if (response.ok) {
      projectInfo.value = responseJson;
      projectCreated.value = true;
      error = '';
    }
    if (responseJson.error) {
      error = responseJson.error;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  loading.value = false;
  return error;
}

export async function updateDraftProject(publish = false) {
  const userToken = await getUserToken();
  if (!userToken) {
    return 'Unable to login to Sharepoint.';
  }

  let error = 'Something went wrong. Please try again!';
  loading.value = true;

  const body = {
    ...createPayload(project),
    projectKey: projectInfo.value.projectKey,
    publish,
  };
  try {
    const url = await getMilocUrl();
    const opts = {
      method: 'POST',
      headers: { 'User-Token': userToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const resp = await fetch(`${url}update-draft-project`, opts);
    const respJson = await resp.json();
    if (resp.ok) {
      projectInfo.value = respJson;
      error = '';
    }
    if (respJson.error) {
      error = respJson.error;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  loading.value = false;
  return error;
}

export async function fetchDraftProject(projectKey) {
  const searchParams = new URLSearchParams(window.location.search);
  const lang = searchParams.get('language');
  if (!projectKey) {
    return 'Project key has not been provided.';
  }

  const userToken = await getUserToken();
  if (!userToken) {
    return 'Unable to login to Sharepoint.';
  }

  let error = 'Failed to fetch project details. Please try again!';
  loading.value = true;

  try {
    const url = await getMilocUrl();
    const options = {
      method: 'POST',
      headers: { 'User-Token': userToken, 'Content-Type': 'application/json' },
    };
    const response = await fetch(
      `${url}fetch-draft-project?project=${projectKey}`,
      options,
    );
    const resJson = await response.json();
    if (response.ok) {
      const newProject = getProject(resJson, lang);
      setProject(newProject);
      projectInfo.value = {
        ...projectInfo.value,
        projectKey,
      };
      projectCreated.value = (userWorkflowType.value !== USER_WORKFLOW_TYPE.promote_rollout);
      error = '';
    }
    if (resJson.error) {
      error = resJson.error;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  loading.value = false;
  return error;
}
