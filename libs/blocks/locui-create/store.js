import { signal } from '../../deps/htm-preact.js';
import login from '../../tools/sharepoint/login.js';
import { accessToken } from '../../tools/sharepoint/state.js';
import { API_BASE_URL, LOCALES, LOCALE_GROUPS } from './utils/constant.js';
import {
  processLocaleData,
  getTenantName,
  createPayload,
} from './utils/utils.js';

export const telemetry = { application: { appName: 'Adobe Localization' } };

export const currentStep = signal(1);
export const loading = signal(false);
export const project = signal(null);
export const projectInfo = signal(null);
export const projectCreated = signal(false);
export const locales = signal([]);
export const localeRegion = signal([]);
export const locSelected = signal(null);

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
  } catch {
    console.error('Sharepoint login failed. Unable to get User-Token!');
  }
  loading.value = false;
  return userToken;
}

export async function fetchLocaleDetails() {
  try {
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

    locales.value = processedLocales;
    localeRegion.value = processedLocaleRegion;
  } catch (error) {
    console.error('Error during fetchLocaleDetails:', error.message);
    throw error;
  }
}

export async function createDraftProject() {
  const userToken = await getUserToken();
  if (!userToken) {
    return 'Unable to login to Sharepoint.';
  }
  let error = 'Something went wrong. Please try again!';
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL.dev}/create-draft-project`, {
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
    console.error(err);
  }
  loading.value = false;
  return error;
}

export async function updateDraftProject() {
  const userToken = await getUserToken();
  if (!userToken) {
    return 'Unable to login to Sharepoint.';
  }
  let error = 'Something went wrong. Please try again!';
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL.dev}/update-draft-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': userToken,
      },
      body: JSON.stringify({
        ...createPayload(project),
        projectKey: projectInfo.value.projectKey,
      }),
    });
    const responseJson = await response.json();
    if (response.ok) {
      projectInfo.value = responseJson;
      error = '';
    }
    if (responseJson.error) {
      error = responseJson.error;
    }
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
  return error;
}
