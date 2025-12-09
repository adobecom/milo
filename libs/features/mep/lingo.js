/* MEP Lingo - Region-optimized content handling. See README.md for documentation. */
import { getConfig, customFetch, queryIndexes, createTag, getUserCountry } from '../../utils/utils.js';

/** Get mep-lingo context: country, localeCode, regionKey, matchingRegion */
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

  // Derive locale code from prefix
  const prefixParts = locale.prefix.split('/').filter(Boolean);
  const [firstPart, secondPart] = prefixParts;
  const hasSpecialPrefix = firstPart === 'langstore' || firstPart === 'target-preview';

  let localeCode;
  if (prefixParts.length === 0 || (hasSpecialPrefix && !secondPart)) {
    localeCode = locale.region === 'us' ? 'en' : locale.language || 'en';
  } else if (hasSpecialPrefix) {
    localeCode = secondPart;
  } else {
    localeCode = firstPart;
  }

  // Find matching region
  let regionKey = `${regionalCountry}_${localeCode}`;
  let matchingRegion = locale?.regions?.[regionKey];
  if (!matchingRegion && locale?.regions?.[regionalCountry]) {
    regionKey = regionalCountry;
    matchingRegion = locale.regions[regionalCountry];
  }

  return { country, localeCode, regionKey, matchingRegion };
}

const fetchFragment = (path) => customFetch({ resource: `${path}.plain.html`, withCacheRules: true })
  .catch(() => ({}));

/** Fetch ROC content, falling back to base if unavailable */
export async function fetchMepLingoThenFallback(mepLingoPath, fallbackPath) {
  const mepLingoResp = await fetchFragment(mepLingoPath);
  if (mepLingoResp?.ok) return { resp: mepLingoResp, usedMepLingo: true };
  const fallbackResp = await fetchFragment(fallbackPath);
  if (fallbackResp?.ok) return { resp: fallbackResp, usedFallback: true };
  return {};
}

/** Fetch ROC and fallback in parallel, prefer ROC if available */
export async function fetchMepLingoParallel(mepLingoPath, fallbackPath) {
  const [mepLingoResp, fallbackResp] = await Promise.all([
    fetchFragment(mepLingoPath),
    fetchFragment(fallbackPath),
  ]);
  if (mepLingoResp?.ok) return { resp: mepLingoResp, usedMepLingo: true };
  if (fallbackResp?.ok) return { resp: fallbackResp, usedFallback: true };
  return {};
}

/**
 * Check query-index for regional paths. checkImmediate=true for LCP (non-blocking).
 * Uses same siteId logic as loadQueryIndexes() in utils.js for consistency.
 * Note: config.uniqueSiteId must be set in consumer's config for this to work on production.
 */
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
      if (!targetIndex.requestResolved) return unavailable;
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

/** Process single anchor: set data-mep-lingo and remove hash */
export function processAnchorForMepLingo(a) {
  if (a.href.includes('#_mep-lingo')) {
    a.dataset.mepLingo = 'true';
    a.href = a.href.replace('#_mep-lingo', '');
  }
}

/** Process anchors for block swaps and mep-lingo blocks */
export function processMepLingoAnchors(anchors) {
  [...anchors].forEach((a) => {
    let isMLBlockSwap = false;
    let linkCell = a.parentElement;
    const parentTag = linkCell?.tagName?.toLowerCase();
    if (parentTag === 'strong' || parentTag === 'em') {
      linkCell = linkCell.parentElement;
    }
    const previousCell = linkCell?.previousElementSibling;
    const cellText = previousCell?.textContent?.toLowerCase().trim();
    const isMLRow = cellText === 'mep-lingo';

    if (isMLRow) {
      const swapBlock = a.closest('[class]');
      if (swapBlock) {
        const blockName = swapBlock.classList[0];

        if (blockName === 'mep-lingo') {
          const p = createTag('p', null, a);
          a.dataset.mepLingo = 'true';
          swapBlock.insertAdjacentElement('afterend', p);
          swapBlock.remove();
        } else {
          isMLBlockSwap = true;
          const row = linkCell.parentElement;
          row.remove();
          const p = createTag('p', null, a);
          if (blockName === 'section-metadata') {
            a.dataset.mepLingoSectionMetadata = 'true';
          }
          a.dataset.removeOriginalBlock = 'true';
          a.dataset.originalBlockId = `block-${Math.random().toString(36).substring(2, 11)}`;
          swapBlock.dataset.mepLingoOriginalBlock = a.dataset.originalBlockId;
          swapBlock.insertAdjacentElement('afterend', p);
          if (a.href.includes('#_mep-lingo')) a.href = a.href.replace('#_mep-lingo', '');
          a.dataset.mepLingoBlockFragment = a.href;
          a.dataset.mepLingo = 'true';
        }
      }
    }

    if (a.href.includes('#_mep-lingo') && !isMLBlockSwap) {
      a.dataset.mepLingo = 'true';
      a.href = a.href.replace('#_mep-lingo', '');
    }
  });
}
