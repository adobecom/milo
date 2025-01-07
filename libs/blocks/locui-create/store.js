import { signal } from '../../deps/htm-preact.js';
import login from '../../tools/sharepoint/login.js';
import { accessToken } from '../../tools/sharepoint/state.js';
import { LOCALES, LOCALE_GROUPS, TRANSCREATION_WORKFLOW } from './utils/constant.js';
import {
  processLocaleData,
  getTenantName,
  createPayload,
  getMilocUrl,
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
export const env = signal('dev');

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

export async function fetchLocaleDetails() {
  try {
    loading.value = true;
    const tenantName = getTenantName();
    if (!tenantName) {
      // console.warn('Tenant name is missing, skipping fetchLocaleDetails.');
      return;
    }
    const response = await fetch(
      `https://main--${tenantName}--adobecom.hlx.page/.milo/config.json?sheet=${LOCALES}&sheet=${LOCALE_GROUPS}`,
    );

    if (!response.ok) {
      // const errorText = await response.text();
      // console.error(`Failed to fetch locale details: ${errorText}`);
      throw new Error(`Server Error: ${response.status}`);
    }

    const localeData = await response.json();
    const
      {
        locales: processedLocales,
        localeRegion: processedLocaleRegion,
      } = processLocaleData(localeData);

    locales.value = processedLocales.filter((locItem) => locItem.workflow !== TRANSCREATION_WORKFLOW && locItem.livecopies !== '');
    localeRegion.value = processedLocaleRegion;
  } catch (error) {
    console.error('Error during fetchLocaleDetails:', error.message);
    throw error;
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
      setProject({
        type: resJson.projectType === 'rollout' ? 'rollout' : 'localization',
        name: resJson.projectName,
        htmlFlow: resJson.settings?.useHtmlFlow,
        editBehavior: resJson.settings?.regionalEditBehaviour,
        urls: resJson.urls,
        fragments: [],
        languages: resJson?.languages ?? [],
      });
      projectInfo.value = {
        ...projectInfo.value,
        projectKey,
      };
      projectCreated.value = true;
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
