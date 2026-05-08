const CACHE_KEY_PREFIX = 'milo-hreflang-';
const FETCH_TIMEOUT_MS = 5000;

function buildHreflangMap(xmlDoc) {
  const map = {};
  for (const urlEl of xmlDoc.querySelectorAll('url')) {
    const loc = urlEl.querySelector('loc')?.textContent;
    if (!loc) continue;
    const links = [...urlEl.querySelectorAll('link[rel="alternate"]')]
      .map((el) => ({ hreflang: el.getAttribute('hreflang'), href: el.getAttribute('href') }))
      .filter((l) => l.hreflang && l.href);
    if (links.length) map[loc] = links;
  }
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
    window.lana?.log(`hreflang: error fetching sitemap ${sitemapUrl} - ${e.message}`, { tags: 'hreflang', severity: 'error' });
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getSitemapPath(pathname, locales, sitemapTemplate) {
  const localeMatch = locales.find((locale) => pathname.startsWith(`/${locale}/`));
  return localeMatch ? sitemapTemplate.replace('{locale}', localeMatch) : sitemapTemplate.replace('/{locale}', '');
}

// sitemapOrigin is the prod origin used in sitemap <loc> values, which may differ
// from location.origin (e.g. localhost in dev). The fetch uses location.origin so
// it works locally; sitemapOrigin is only used to construct the lookup key.
function getCurrentPageUrl(sitemapOrigin, pathname, locales) {
  const localeMatch = locales.find((locale) => pathname.startsWith(`/${locale}/`));
  const correctedPath = pathname.endsWith('.html') ? pathname : `${pathname}.html`;
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
  const sitemapPath = getSitemapPath(pathname, locales, sitemapTemplate);
  const sitemapUrl = `${origin}${sitemapPath}`;
  const currentPageUrl = getCurrentPageUrl(sitemapOrigin, pathname, locales);

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
