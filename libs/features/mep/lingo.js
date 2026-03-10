/* MEP Lingo - Region-optimized content handling. See README.md for documentation. */
import {
  createTag,
  customFetch,
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

export function handleInvalidMepLingo(a, { env }) {
  const { mepLingoSectionSwap, mepLingoBlockSwap } = a.dataset;
  const isProd = env?.name === 'prod';

  if (mepLingoSectionSwap) {
    const section = a.closest('.section');
    if (isProd) { section?.remove(); return; }
    section.dataset.failed = 'true';
    section.dataset.reason = 'Failed loading mep-lingo row';
    a.parentElement?.remove();
    return;
  }

  if (mepLingoBlockSwap) {
    const block = a.closest(`.${mepLingoBlockSwap}`);
    if (isProd) { block?.remove(); return; }
    if (mepLingoBlockSwap !== 'mep-lingo') {
      block.dataset.failed = 'true';
      block.dataset.reason = 'Failed loading mep-lingo row';
      a.parentElement?.remove();
    }
    return;
  }

  // Standalone fragment link
  if (isProd) {
    const parent = a.parentElement;
    a.remove();
    if (!parent?.children.length && !parent?.textContent?.trim()) parent?.remove();
    return;
  }
  a.replaceWith(createTag('div', {
    'data-failed': 'true',
    'data-reason': 'Failed loading mep-lingo fragment.',
    style: 'min-height: 40px; margin: 8px 0;',
  }));
}

export function addMepLingoPreviewAttrs(fragment, {
  usedFallback,
  relHref,
  isInsert = false,
  isRemove = false,
}) {
  fragment.dataset[usedFallback ? 'mepLingoFallback' : 'mepLingoRoc'] = relHref;
  if (isInsert) fragment.dataset.mepLingoInsert = 'true';
  if (isRemove) fragment.dataset.mepLingoRemove = 'true';
}

export function removeMepLingoElement(a, isMepLingoBlock, originalBlock) {
  if (isMepLingoBlock && originalBlock) {
    originalBlock.remove();
    a.parentElement?.remove();
  } else {
    const parent = a.parentElement;
    a.remove();
    if (!parent?.children.length && !parent?.textContent?.trim()) parent?.remove();
  }
}

export function getMepLingoFallbackPath(originalHref, locale, resourcePath) {
  let fallbackPath = originalHref;
  try {
    const resourceUrl = new URL(resourcePath);
    const originalUrl = new URL(originalHref);
    if (locale?.prefix !== undefined
      && !originalUrl.pathname.startsWith(locale.prefix)) {
      fallbackPath = `${resourceUrl.origin}${locale.prefix}${originalUrl.pathname}`;
    } else {
      fallbackPath = `${resourceUrl.origin}${originalUrl.pathname}`;
    }
  } catch (e) {
    if (locale?.prefix && !fallbackPath.startsWith(locale.prefix)) {
      fallbackPath = `${locale.prefix}${fallbackPath}`;
    }
  }
  return fallbackPath;
}

export async function dualFetchMepLingo(resourcePath, originalHref, locale) {
  const fallbackPath = getMepLingoFallbackPath(originalHref, locale, resourcePath);
  const result = await fetchMepLingo(resourcePath, fallbackPath);
  if (result.usedFallback) {
    window.lana?.log(
      'MEP Lingo: Regional content not found for '
        + `${resourcePath}. Falling back to base fragment.`,
      { tags: 'mep-lingo', severity: 'warn', sampleRate: 0.1 },
    );
  }
  return { ...result, fallbackPath };
}

export function logMepLingoFallback(resourcePath, skipQI) {
  const msg = skipQI
    ? 'MEP Lingo: Regional content not found for '
      + `${resourcePath}. Keeping authored content.`
    : 'MEP Lingo: Regional fetch failed for '
      + `${resourcePath}. Keeping authored content.`;
  const logOpts = skipQI
    ? { tags: 'mep-lingo', severity: 'warn', sampleRate: 0.1 }
    : { tags: 'mep-lingo', severity: 'error' };
  window.lana?.log(msg, logOpts);
}

export async function tryMepLingoFallbackForStaleIndex(originalHref, locale, resourcePath, skipQI) {
  const msg = skipQI
    ? 'MEP Lingo: Regional content not found for '
      + `${resourcePath}. Falling back to base fragment.`
    : 'MEP Lingo: Query-index indicated regional content exists'
      + ` but fetch failed for ${resourcePath}. Falling back to base fragment.`;
  const logOpts = skipQI
    ? { tags: 'mep-lingo', severity: 'warn', sampleRate: 0.1 }
    : { tags: 'mep-lingo', severity: 'error' };
  window.lana?.log(msg, logOpts);

  const fallbackPath = getMepLingoFallbackPath(originalHref, locale, resourcePath);
  const resp = await customFetch({ resource: `${fallbackPath}.plain.html`, withCacheRules: true })
    .catch(() => ({}));

  return { resp, fallbackPath };
}
