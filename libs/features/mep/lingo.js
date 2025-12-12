/* MEP Lingo - Region-optimized content handling. See README.md for documentation. */
import {
  getConfig,
  customFetch,
  queryIndexes,
  getUserCountry,
} from '../../utils/utils.js';

export function getLocaleCodeFromPrefix(prefix, region = 'us', language = 'en') {
  const prefixParts = prefix.split('/').filter(Boolean);
  const [firstPart, secondPart] = prefixParts;
  const hasSpecialPrefix = firstPart === 'langstore' || firstPart === 'target-preview';

  let localeCode = firstPart;
  if (prefixParts.length === 0 || (hasSpecialPrefix && !secondPart)) {
    localeCode = region === 'us' ? 'en' : language || 'en';
  } else if (hasSpecialPrefix) {
    localeCode = secondPart;
  }

  return localeCode;
}

export function getMepLingoContext(locale) {
  if (!locale?.prefix) {
    return { country: null, localeCode: null, regionKey: null, matchingRegion: null };
  }

  const country = getUserCountry();
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

export const fetchFragment = (path) => {
  // Strip .html extension if present to avoid .html.plain.html
  const pathNoExt = path.replace(/\.html$/, '');
  return customFetch({ resource: `${pathNoExt}.plain.html`, withCacheRules: true })
    .catch(() => ({}));
};

export async function fetchMepLingo(mepLingoPath, fallbackPath) {
  const mepLingoPromise = fetchFragment(mepLingoPath);
  const fallbackPromise = fetchFragment(fallbackPath);
  const mepLingoResp = await mepLingoPromise;
  if (mepLingoResp?.ok) return { resp: mepLingoResp, usedMepLingo: true };
  const fallbackResp = await fallbackPromise;
  if (fallbackResp?.ok) return { resp: fallbackResp, usedFallback: true };
  return {};
}

export async function getQueryIndexPaths(prefix, checkImmediate = false, isFederal = false) {
  const unavailable = { resolved: false, paths: [], available: false };
  try {
    // Same siteId logic as loadQueryIndexes() - must match for index lookup to work
    const siteId = isFederal ? 'federal' : (getConfig().uniqueSiteId ?? '');
    const targetIndex = queryIndexes?.[siteId];

    if (!targetIndex) {
      return checkImmediate ? unavailable : { paths: [], available: false };
    }

    if (checkImmediate) {
      if (!targetIndex.requestResolved) {
        return unavailable;
      }
      const paths = await targetIndex.pathsRequest;
      const matchingPaths = paths?.filter((p) => p.startsWith(prefix)) || [];
      return { resolved: true, paths: matchingPaths, available: true };
    }

    const paths = await targetIndex.pathsRequest;
    const matchingPaths = paths?.filter((p) => p.startsWith(prefix)) || [];
    return { resolved: true, paths: matchingPaths, available: Array.isArray(paths) };
  } catch (e) {
    window.lana?.log(`Query index error for ${prefix}:`, e);
    return checkImmediate ? unavailable : { paths: [], available: false };
  }
}
