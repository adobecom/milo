import getServiceConfig from '../../../utils/service-config.js';
import { origin } from '../../locui/utils/franklin.js';
import { env } from '../store.js';

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
    projectType: project.value.type,
    referrer: 'studio',
    languages: project.value.languages,
    urls,
    settings: {
      env: env.value,
      regionalEditBehaviour: project.value.editBehavior,
      useHtmlFlow: project.value.htmlFlow,
    },
  };
};

export async function getMilocUrl() {
  const { miloc } = await getServiceConfig(origin, env.value);
  return miloc.url;
}

export function getEnvQueryParam() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get('env') ?? 'local';
}
