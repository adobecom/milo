/**
 * Geo-based base-to-regional link transformation (post-LCP).
 *
 * When the user is in a region that has a regional site for the current base locale
 * (e.g. geo-ip LU on French base /fr/ -> lu_fr, on German base /de/ -> lu_de),
 * this feature fetches the regional query-index and rewrites page links that point
 * to base-locale URLs to the regional URLs when the path exists in the index.
 *
 * Example: User in Luxembourg visits www.adobe.com/fr/products/photoshop.html.
 * Links to /fr/... are rewritten to /lu_fr/... when the path exists in
 * /lu_fr/federal/assets/lingo/query-index.json.
 */
import {
  getConfig,
  getCountry,
  getFederatedContentRoot,
  getMepLingoPrefix,
  lingoActive,
} from '../../utils/utils.js';

const ALLOWED_EXTENSIONS = ['', 'html', 'json'];

function getExtension(path) {
  const lastSlash = path.lastIndexOf('/');
  const lastDot = path.lastIndexOf('.');
  if (lastDot <= lastSlash || lastDot === -1) return '';
  return path.slice(lastDot + 1).toLowerCase();
}

/**
 * Fetches the regional federal query-index and returns a Set of paths (no .html).
 * @param {string} regionalPrefix - e.g. '/lu_fr'
 * @param {string} queryIndexSuffix - '' for prod, '-preview' for stage
 * @returns {Promise<Set<string>>}
 */
async function fetchRegionalQueryIndexPaths(regionalPrefix, queryIndexSuffix) {
  const root = 'https://main--da-bacom--adobecom.aem.page';
  const prefixSegment = regionalPrefix.replace(/^\//, '');
  const url = `${root}/${prefixSegment}/assets/lingo/query-index${queryIndexSuffix}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return new Set();
    const json = await response.json();
    const paths = (json.data ?? []).map((d) => (d.path ?? d.Path)?.replace(/\.html$/, '')).filter(Boolean);
    return new Set(paths);
  } catch (e) {
    console.log(`Geo base-to-regional: failed to load query-index ${url}`, e);
    return new Set();
  }
}

/**
 * Transforms same-origin base-locale links to regional URLs when the path exists in the index.
 * Runs post-LCP so it does not block LCP.
 */
export async function transformBaseToRegionalLinksPostLCP() {
  if (!lingoActive()) return;

  const config = getConfig();
  const { locale } = config || {};
  if (!locale?.regions || !Object.keys(locale.regions).length) return;

  const country = getCountry();
  if (!country) return;

  const regionalPrefix = 'sg';
  const basePrefix = '';

  const origin = config.origin || window.location.origin;
  const hostname = window.location.hostname;
  const queryIndexSuffix = config.env?.name === 'prod' ? '' : '-preview';

  const pathSet = await fetchRegionalQueryIndexPaths(regionalPrefix, queryIndexSuffix);
  if (!pathSet.size) return;

  const links = document.querySelectorAll('main a[href]');
  for (const a of links) {
    try {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

      const url = new URL(href, origin);
      // if (url.hostname !== hostname) continue;

      const path = url.pathname;
      if (!path.startsWith(basePrefix)) continue;
      if (path.startsWith(regionalPrefix)) continue;

      const ext = getExtension(path);
      if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

      const pathWithoutBase = path.slice(basePrefix.length) || '/';
      const regionalPath = `/${regionalPrefix}${pathWithoutBase}`.replace(/\.html$/, '');
      if (!pathSet.has(regionalPath)) continue;

      const newPath = `${regionalPath}${path.endsWith('.html') ? '.html' : ''}${url.search}${url.hash}`;
      const newHref = path.startsWith('/') ? `${origin}${newPath}` : newPath;
      a.setAttribute('href', newHref);
    } catch (e) {
      // skip invalid links
    }
  }
}

export default transformBaseToRegionalLinksPostLCP;
