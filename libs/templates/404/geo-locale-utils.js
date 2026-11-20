import { getConfig, lingoActive, getCountry, getCookie, normCountryCode } from '../../utils/utils.js';

function hasLingoRegions(locale) {
  return !!Object.keys(locale?.regions ?? {}).length;
}

function matchRegionByCountry(regions, country, localeKey, countryToRegion) {
  let regionKey = Object.entries(regions).find(
    ([key]) => key === country || key === `${country}_${localeKey}`,
  )?.[0];

  if (!regionKey && countryToRegion) {
    regionKey = Object.entries(countryToRegion).find(
      ([key, countries]) => Array.isArray(countries) && countries.includes(country) && regions[key],
    )?.[0];
  }

  return regionKey ? regions[regionKey] : null;
}

// eslint-disable-next-line import/prefer-default-export
export async function resolveGeoRegion() {
  if (!lingoActive()) return null;

  const { locale, mepLingoCountryToRegion } = getConfig() || {};
  const { regions } = locale || {};

  if (!hasLingoRegions(locale)) return null;

  const storedInter = getCookie('international');
  if (storedInter) {
    if (storedInter === 'us') return null;
    if (regions[storedInter]) {
      const { prefix, base } = regions[storedInter];
      return { prefix, base };
    }
  }

  const country = normCountryCode(await getCountry());
  if (!country) return null;

  const localeKey = locale.prefix === '' ? 'en' : locale.prefix.replace('/', '');
  const region = matchRegionByCountry(regions, country, localeKey, mepLingoCountryToRegion);

  return region ? { prefix: region.prefix, base: region.base } : null;
}
