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
  if (!paCode) return href;

  const imsCountry = await getImsCountry();
  const { locale } = getConfig();
  const country = imsCountry || getMiloLocaleSettings(locale).country || 'US';

  const m7link = new URL('https://commerce.adobe.com/store/segmentation?cli=creative&cs=t');
  m7link.searchParams.append('co', country);
  m7link.searchParams.append('pa', paCode);
  if (href.includes('/creativecloud/education-plans')) {
    m7link.searchParams.append('ms', 'EDU');
  }
  return m7link.toString();
}

export default async function init(el) {
  try {
    el.href = await generateM7Link(el.href);
  } catch (e) {
    window.lana.log(`Cannot generate M7 URL. ${e}`, { tags: 'm7', errorType: 'i' });
  }
}
