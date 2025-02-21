import { getConfig } from '../../utils/utils.js';

async function getImsCountry() {
  if (window.adobeIMS?.isSignedInUser()) {
    const profile = await window.adobeIMS.getProfile();
    return profile.countryCode;
  }

  return null;
}

export async function generateM7Link() {
  const { locale } = getConfig();
  const { getMiloLocaleSettings } = await import('../merch/merch.js');
  const pageCountry = getMiloLocaleSettings(locale).country;
  const imsCountry = await getImsCountry();
  const country = imsCountry || pageCountry;

  const m7link = new URL('https://commerce.adobe.com/store/segmentation');
  m7link.searchParams.append('cli', 'adobe_com');
  m7link.searchParams.append('co', country);
  m7link.searchParams.append('pa', 'ccsn_direct_individual');
  m7link.searchParams.append('cs', 't');
  m7link.searchParams.append('af', 'uc_segmentation_hide_tabs');
  return m7link.toString();
}

export default async function init(el) {
  el.href = await generateM7Link();
}
