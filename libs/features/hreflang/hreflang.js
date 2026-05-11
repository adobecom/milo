const CACHE_KEY_PREFIX = 'milo-hreflang-';
const FETCH_TIMEOUT_MS = 5000;

function buildHreflangMap(xmlDoc) {
  const map = {};
  xmlDoc.querySelectorAll('url').forEach((urlEl) => {
    const loc = urlEl.querySelector('loc')?.textContent;
    if (!loc) return;
    const links = [...urlEl.querySelectorAll('link[rel="alternate"]')]
      .map((el) => ({ hreflang: el.getAttribute('hreflang'), href: el.getAttribute('href') }))
      .filter((l) => l.hreflang && l.href);
    if (links.length) map[loc] = links;
  });
  return map;
}

function getCachedMap(cacheKey) {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY_PREFIX + cacheKey);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedMap(cacheKey, map) {
  try {
    sessionStorage.setItem(CACHE_KEY_PREFIX + cacheKey, JSON.stringify(map));
  } catch {
    window.lana?.log(`hreflang: sessionStorage quota exceeded for ${cacheKey}`, { tags: 'hreflang', severity: 'warning' });
  }
}

async function fetchSitemapMap(sitemapUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(sitemapUrl, { signal: controller.signal });
    if (!response.ok) {
      window.lana?.log(`hreflang: failed to fetch sitemap ${sitemapUrl} (${response.status})`, { tags: 'hreflang', severity: 'error' });
      return null;
    }
    const xmlText = await response.text();
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
    if (xmlDoc.querySelector('parsererror')) {
      window.lana?.log(`hreflang: failed to parse sitemap ${sitemapUrl}`, { tags: 'hreflang', severity: 'error' });
      return null;
    }
    return buildHreflangMap(xmlDoc);
  } catch (e) {
    const msg = e.name === 'AbortError'
      ? `hreflang: sitemap fetch timed out after ${FETCH_TIMEOUT_MS}ms: ${sitemapUrl}`
      : `hreflang: error fetching sitemap ${sitemapUrl} - ${e.message}`;
    window.lana?.log(msg, { tags: 'hreflang', severity: 'error' });
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getSitemapPath(localeMatch, sitemapTemplate) {
  if (!sitemapTemplate.includes('{locale}')) {
    window.lana?.log(`hreflang: sitemapTemplate missing {locale} placeholder: ${sitemapTemplate}`, { tags: 'hreflang', severity: 'error' });
    return sitemapTemplate;
  }
  return localeMatch
    ? sitemapTemplate.replace('{locale}', localeMatch)
    : sitemapTemplate.replace(/\/?{locale}/, '');
}

// sitemapOrigin is the prod origin used in sitemap <loc> values, which may differ
// from location.origin (e.g. localhost in dev). The fetch uses location.origin so
// it works locally; sitemapOrigin is only used to construct the lookup key.
function getCurrentPageUrl(sitemapOrigin, pathname, localeMatch) {
  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const correctedPath = normalizedPath.endsWith('.html') ? normalizedPath : `${normalizedPath}.html`;
  const isLocaleRoot = localeMatch && pathname === `/${localeMatch}/`;
  if (pathname === '/' || isLocaleRoot) {
    return isLocaleRoot ? `${sitemapOrigin}/${localeMatch}/` : `${sitemapOrigin}/`;
  }
  return `${sitemapOrigin}${correctedPath}`;
}

function injectLinks(hreflangLinks) {
  const titleEl = document.head.querySelector('title');
  if (!titleEl || !hreflangLinks?.length) return;
  const linkEls = hreflangLinks.map(({ hreflang, href }) => {
    const el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    el.setAttribute('href', href);
    return el;
  });
  titleEl.after(...linkEls);
}

/**
 * @param {object} config
 * @param {string[]} config.locales - list of locale prefixes (e.g. ['de', 'fr', 'de_de'])
 * @param {string} config.sitemapTemplate - path template with {locale} placeholder
 *   e.g. '/{locale}/cc-shared/assets/sitemap.xml' for CC
 *   e.g. '/{locale}/sitemap.xml' for bacom
 * @param {string} [config.sitemapOrigin] - prod origin used in sitemap <loc> values (default: 'https://www.adobe.com')
 * @param {object} [config.location] - override window.location (for testing)
 */
export async function appendHreflangLinks({
  locales,
  sitemapTemplate,
  sitemapOrigin = 'https://www.adobe.com',
  location = window.location,
} = {}) {
  const userAgentMeta = document.querySelector('meta[name="hreflinksuseragents"]');
  if (!userAgentMeta?.content) return;

  const allowedAgents = userAgentMeta.content.split(',');
  const { userAgent } = window.navigator;
  if (!allowedAgents.some((agent) => userAgent.includes(agent.trim()))) return;

  const { origin, pathname } = location;
  const localeMatch = locales.find((locale) => pathname.startsWith(`/${locale}/`));
  const sitemapPath = getSitemapPath(localeMatch, sitemapTemplate);
  const sitemapUrl = `${origin}${sitemapPath}`;
  const currentPageUrl = getCurrentPageUrl(sitemapOrigin, pathname, localeMatch);

  let map = getCachedMap(sitemapPath);
  if (!map) {
    map = await fetchSitemapMap(sitemapUrl);
    if (!map) return;
    setCachedMap(sitemapPath, map);
  }

  const hreflangLinks = map[currentPageUrl] ?? map[currentPageUrl.replace(/\/$/, '')];
  injectLinks(hreflangLinks);
}

export default appendHreflangLinks;
