import { signal } from '../../deps/htm-preact.js';
import { LOCALES, LOCALE_GROUPS } from './utils/constant.js';
import { processLocaleData, getTenantName } from './utils/utils.js';

export const currentStep = signal(1);
export const project = signal(null);
export const locales = signal([]);
export const locSelected = signal(null);
export const projectType = signal('rollout');

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

export async function fetchLocaleDetails() {
  try {
    const tenantName = getTenantName();
    if (!tenantName) {
      return;
    }
    const response = await fetch(
      `https://main--${tenantName}--adobecom.hlx.page/.milo/config.json?sheet=${LOCALES}&sheet=${LOCALE_GROUPS}`,
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const localeData = await response.json();
    const
      { locales: processedLocales } = processLocaleData(localeData);

    locales.value = processedLocales;
  } catch (error) {
    console.error('Error during fetchLocaleDetails:', error.message);
    throw error;
  }
}
