/* MEP Lingo - Region-optimized content handling. See README.md for documentation. */
import {
  getConfig,
  createTag,
  customFetch,
  getCountry,
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

export async function getMepLingoContext(locale) {
  if (!locale?.prefix) {
    return { country: null, localeCode: null, regionKey: null, matchingRegion: null };
  }

  const country = await getCountry();
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

export function handleInvalidMepLingo(a, { env, relHref }) {
  const { mepLingoSectionSwap, mepLingoBlockSwap } = a.dataset;
  const isProd = env?.name === 'prod';

  if (mepLingoSectionSwap) {
    const section = a.closest('.section');
    if (isProd) { section?.remove(); return; }
    section.dataset.failed = 'true';
    section.dataset.reason = 'mep-lingo: not available (section swap)';
    a.parentElement?.remove();
    return;
  }

  if (mepLingoBlockSwap) {
    const block = a.closest(`.${mepLingoBlockSwap}`);
    if (isProd) { block?.remove(); return; }
    const swapType = mepLingoBlockSwap === 'mep-lingo' ? 'block' : 'block swap';
    block.dataset.failed = 'true';
    block.dataset.reason = `mep-lingo: not available (${swapType})`;
    if (mepLingoBlockSwap !== 'mep-lingo') a.parentElement?.remove();
    return;
  }

  // Standalone fragment link
  if (isProd) {
    const parent = a.parentElement;
    a.remove();
    if (!parent?.children.length && !parent?.textContent?.trim()) parent?.remove();
    return;
  }
  const isInline = a.href?.includes('#_inline') || relHref?.includes('#_inline');
  a.replaceWith(createTag('div', {
    'data-failed': 'true',
    'data-reason': `mep-lingo: ${isInline ? 'inline ' : ''}fragment not available`,
    style: 'min-height: 40px; margin: 8px 0;',
  }));
}

export function addMepLingoPreviewAttrs(fragment, { usedFallback, relHref }) {
  if (usedFallback) {
    fragment.dataset.mepLingoFallback = relHref;
  } else {
    fragment.dataset.mepLingoRoc = relHref;
  }
}
