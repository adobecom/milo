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
  const isInline = a.dataset.originalHref?.includes('#_inline');
  a.replaceWith(createTag('div', {
    'data-failed': 'true',
    'data-reason': `mep-lingo: ${isInline ? 'inline ' : ''}fragment not available`,
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

export async function tryMepLingoFallbackForStaleIndex(originalHref, locale, resourcePath) {
  window.lana?.log(`MEP Lingo: Query-index indicated regional content exists but fetch failed for ${resourcePath}. Falling back to authored locale.`);

  let fallbackPath = originalHref;
  try {
    const resourceUrl = new URL(resourcePath);
    const originalUrl = new URL(originalHref);
    if (locale?.prefix !== undefined && !originalUrl.pathname.startsWith(locale.prefix)) {
      fallbackPath = `${resourceUrl.origin}${locale.prefix}${originalUrl.pathname}`;
    } else {
      fallbackPath = `${resourceUrl.origin}${originalUrl.pathname}`;
    }
  } catch (e) {
    if (locale?.prefix && !fallbackPath.startsWith(locale.prefix)) {
      fallbackPath = `${locale.prefix}${fallbackPath}`;
    }
  }

  const resp = await customFetch({ resource: `${fallbackPath}.plain.html`, withCacheRules: true })
    .catch(() => ({}));

  return { resp, fallbackPath };
}
