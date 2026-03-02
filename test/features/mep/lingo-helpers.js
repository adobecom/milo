/**
 * Test helpers for MEP Lingo functionality.
 * These utilities are used for unit testing MEP Lingo logic without requiring full page setup.
 */

import { getConfig, getCountry } from '../../../libs/utils/utils.js';
import { getLocaleCodeFromPrefix } from '../../../libs/features/mep/lingo.js';

/**
 * Get MEP Lingo context including country, locale code, region key, and matching region.
 * This helper is primarily used for testing the complex country/locale/region mapping logic.
 * @param {Object} locale - Locale configuration object
 * @returns {Object} Context object with country, localeCode, regionKey, and matchingRegion
 */
export default function getMepLingoContext(locale) {
  if (!locale?.prefix) {
    return { country: null, localeCode: null, regionKey: null, matchingRegion: null };
  }

  const country = getCountry();
  if (!country) {
    return { country: null, localeCode: null, regionKey: null, matchingRegion: null };
  }

  const config = getConfig();
  const mapping = config.mepLingoCountryToRegion;

  // Map country to region if configured (e.g., ng -> africa)
  let regionalCountry = country;
  if (mapping) {
    const regionKey = Object.entries(mapping).find(
      ([, countries]) => Array.isArray(countries) && countries.includes(country),
    )?.[0];
    if (regionKey) regionalCountry = regionKey;
  }

  const localeCode = getLocaleCodeFromPrefix(locale.prefix, locale.region, locale.language);

  let regionKey = `${regionalCountry}_${localeCode}`;
  let matchingRegion = locale?.regions?.[regionKey];
  if (!matchingRegion && locale?.regions?.[regionalCountry]) {
    regionKey = regionalCountry;
    matchingRegion = locale.regions[regionalCountry];
  }

  return { country, localeCode, regionKey, matchingRegion };
}
