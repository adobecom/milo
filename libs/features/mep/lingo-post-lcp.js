// MEP Lingo Post-LCP Optimizations
import {
  fetchFragment,
  fetchMepLingo,
  getQueryIndexPaths,
} from './lingo.js';

export async function fetchMepLingoOptimized({
  resourcePath,
  originalHref,
  locale,
  isFederal,
  regionalPrefix,
}) {
  const buildFallbackPath = (href) => {
    const fallbackPath = href;
    try {
      const url = new URL(href);
      if (locale?.prefix && !url.pathname.startsWith(locale.prefix)) {
        return `${url.origin}${locale.prefix}${url.pathname}`;
      }
      return href;
    } catch (e) {
      if (locale?.prefix && !fallbackPath.startsWith(locale.prefix)) {
        return `${locale.prefix}${fallbackPath}`;
      }
      return fallbackPath;
    }
  };

  const fallbackPath = buildFallbackPath(originalHref);

  // Check query-index for path existence
  const { paths, available } = await getQueryIndexPaths(regionalPrefix, false, isFederal);

  let pathToCheck = resourcePath;
  try {
    pathToCheck = new URL(resourcePath).pathname;
  } catch (e) {
    // resourcePath is already a path
  }

  const pathInIndex = available && paths.some((p) => pathToCheck.includes(p.replace(/\.html$/, '')));

  let resp;
  let usedFallback = false;

  if (!available || pathInIndex) {
    const result = await fetchMepLingo(resourcePath, fallbackPath);
    resp = result.resp;
    usedFallback = !!result.usedFallback;
  } else {
    resp = await fetchFragment(fallbackPath);
    if (resp?.ok) usedFallback = true;
  }

  return {
    resp,
    relHref: usedFallback ? fallbackPath : null,
    usedFallback,
  };
}

export function addMepLingoPreviewAttrs(fragment, { usedFallback, relHref }) {
  if (usedFallback) {
    fragment.dataset.mepLingoFallback = relHref;
  } else {
    fragment.dataset.mepLingoRoc = relHref;
  }
}
