import { origin } from '../../locui/utils/franklin.js';
import { LOCALIZATION_TYPES } from './constant.js';

export function getTenantName() {
  try {
    const url = window.location.href;
    const regex = /--([^--]+)--/;
    const match = url.match(regex);
    if (match?.[1]) {
      // console.log('Tenant name extracted:', match[1]);
      return match[1];
    }
    // console.warn('No tenant name found in URL. Defaulting to "milo".');
    return 'milo';
  } catch (error) {
    // console.error('Error extracting tenant name:', error);
    return 'milo';
  }
}

export function processLocaleData(localeData) {
  const processedLocales = localeData.locales.data
    .map((locItem) => ({
      ...locItem,
      livecopies: locItem.livecopies
        .split(',')
        .map((loc) => loc.trim())
        .join(','),
    }));

  const processedLocaleRegion = localeData.localegroups.data.map((item) => ({
    ...item,
    value: item.value
      .split(',')
      .map((val) => val.trim())
      .join(','),
  }));

  return { locales: processedLocales, localeRegion: processedLocaleRegion };
}

export const createPayload = (project) => {
  let urls = [...project.value.urls];
  if (project.value.fragments.length > 0) {
    urls = [
      ...urls,
      ...project.value.fragments.map((frag) => `${origin}${frag}`),
    ];
  }

  return {
    tenantBaseUrl: origin,
    projectName: project.value.name,
    projectType: project.value.type === LOCALIZATION_TYPES.rollout ? 'rollout' : 'localization',
    referrer: 'studio',
    languages: project.value.languages,
    urls,
    settings: {
      env: 'stage',
      regionalEditBehaviour: project.value.editBehavior,
      useHtmlFlow: project.value.htmlFlow,
    },
  };
};
