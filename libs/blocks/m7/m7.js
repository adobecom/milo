import { getConfig, getMetadata } from '../../utils/utils.js';
import { getMiloLocaleSettings } from '../merch/merch.js';

async function getImsCountry() {
  if (window.adobeIMS?.isSignedInUser()) {
    const profile = await window.adobeIMS.getProfile();
    return profile.countryCode;
  }

  return null;
}

export async function generateM7Link(href) {
  const paCode = getMetadata('m7-pa-code');
  if (!paCode || (!href.includes('/creativecloud/business-plans') && !href.includes('/creativecloud/education-plans'))) return href;

  const imsCountry = await getImsCountry();
  const { locale } = getConfig();
  const localeSettings = getMiloLocaleSettings(locale);
  const country = imsCountry || localeSettings.country || 'US';
  const { language } = localeSettings;

  const m7link = new URL('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t');
  m7link.searchParams.append('co', country);
  m7link.searchParams.append('pa', paCode);
  if (href.includes('/creativecloud/education-plans')) {
    m7link.searchParams.append('ms', 'EDU');
  }
  if (locale?.prefix?.includes('_') && language) m7link.searchParams.set('lang', language);
  return m7link.toString();
}

export default async function init(el) {
  try {
    if (window.adobeIMS?.initialized) {
      el.href = await generateM7Link(el.href);
    } else {
      window.addEventListener('onImsLibInstance', async () => {
        el.href = await generateM7Link(el.href);
      });
    }
  } catch (e) {
    window.lana.log(`Cannot generate M7 URL. ${e}`, { tags: 'm7', errorType: 'i' });
  }
}
