import { STATUS } from './constants.js';
import { getConfig, getLocale } from '../../../utils/utils.js';

async function getStatus(url) {
  const tryHead = await fetch(url, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
  if (tryHead?.ok || tryHead?.status === 404) return tryHead.status;
  const res = await fetch(url, { method: 'GET', cache: 'no-store' }).catch(() => null);
  return res?.status || 0;
}

function isAllowedHost(hostname) {
  return ['adobe.com', 'aem.page', 'aem.live'].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function removeLocale(pathname, locales) {
  const { prefix } = getLocale(locales, pathname);
  if (!prefix) return pathname;
  if (pathname === prefix || pathname === `${prefix}/`) return '/';
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}

function addLocale(basePath, prefix) {
  const cleanBase = basePath.startsWith('/') ? basePath : `/${basePath}`;
  if (!prefix) return cleanBase;
  const cleanPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
  return `${cleanPrefix}${cleanBase === '/' ? '' : cleanBase}`;
}

function normalizePath(path) {
  if (!path) return '/';
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
}

export async function runChecks({ area = document } = {}) {
  const { locales } = getConfig();
  const locale = getLocale(locales, window.location.pathname);
  const links = Array.from(area.querySelectorAll('a[href]'));
  const seen = new Set();
  const violations = (await Promise.all(links.map(async (linkEl) => {
    const href = linkEl.getAttribute('href');
    if (!href || href.startsWith('#')) return null;
    const url = new URL(href, window.location.origin);
    if (!isAllowedHost(url.hostname)) return null;
    const basePath = removeLocale(url.pathname, locales);
    if (url.hash && normalizePath(basePath) === '/') return null;
    const key = `${url.origin}${normalizePath(url.pathname)}`;
    if (seen.has(key)) return null;
    seen.add(key);

    const currentLocalePath = addLocale(basePath, locale.prefix);
    const isCurrentLocaleLink = normalizePath(url.pathname)
      === normalizePath(currentLocalePath);

    const [localizedStatus, usStatus] = await Promise.all([
      getStatus(`${url.origin}${currentLocalePath}`),
      getStatus(`${url.origin}${basePath}`),
    ]);

    const shouldFlag = (!isCurrentLocaleLink && [200, 404].includes(localizedStatus))
      || (isCurrentLocaleLink && localizedStatus === 404);

    if (shouldFlag) {
      return {
        url: url.href,
        isLocalized: isCurrentLocaleLink,
        usStatus,
        localizedStatus,
      };
    }

    return null;
  }))).filter(Boolean);

  const violationsCount = violations.length;
  return [{
    id: 'link-localization',
    title: 'Links',
    status: violationsCount === 0 ? STATUS.PASS : STATUS.FAIL,
    description: violationsCount === 0
      ? 'All links are localized or valid.'
      : `${violationsCount} link${violationsCount > 1 ? 's' : ''} potentially not localized or invalid.`,
    details: { violations },
  }];
}

export default { runChecks };
