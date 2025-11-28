import { getConfig, getLocale } from '../../../utils/utils.js';
import { getUniqueSelector } from './helper.js';

async function getStatus(url) {
  const tryHead = await fetch(url, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
  if (tryHead?.ok || tryHead?.status === 404) return tryHead.status;

  // fallback for when helix token is needed (tryHead.status === 401)
  const res = await fetch(url, { method: 'GET', cache: 'no-store' }).catch(() => null);
  return res.status || 0;
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

export default async function checkLinkLocalization(elements = [], config = {}) {
  const { checks = [] } = config;
  const { locales } = getConfig();
  if (!checks.includes('link-localization')) return [];
  const violations = [];

  const locale = getLocale(locales, window.location.pathname);
  const { origin: pageOrigin } = window.location;
  const links = elements.filter((el) => el.tagName === 'A' && el.href);

  async function evaluateLink(linkEl) {
    const href = linkEl.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    const url = new URL(href, pageOrigin);
    const basePath = removeLocale(url.pathname, locales);
    const currentLocalePath = addLocale(basePath, locale.prefix);
    const isCurrentLocaleLink = normalizePath(url.pathname) === normalizePath(currentLocalePath);
    const localizedStatus = await getStatus(`${url.origin}${currentLocalePath}`);

    if (!isCurrentLocaleLink && localizedStatus === 200) {
      violations.push({
        description: 'Link not localized, localized version exists (200).',
        impact: 'serious',
        id: 'link-localization',
        help: 'Update link to point to the localized version.',
        nodes: [{ target: [getUniqueSelector(linkEl)], html: linkEl.outerHTML }],
      });
      return;
    }

    const usStatus = await getStatus(`${url.origin}${basePath}`);

    if (!isCurrentLocaleLink && localizedStatus === 404) {
      const description = usStatus === 200
        ? 'Link not localized, localized version is 404, US version exists (200).'
        : 'Link not localized, localized version is 404, US version is also a 404.';
      violations.push({
        description,
        impact: 'serious',
        id: 'link-localization',
        help: 'Avoid linking to US content from localized pages; provide localized content or remove.',
        nodes: [{ target: [getUniqueSelector(linkEl)], html: linkEl.outerHTML }],
      });
      return;
    }

    const currentStatus = await getStatus(url.href);
    if (currentStatus !== 404) return;
    const description = usStatus === 200
      ? 'Link is localized, localized version is 404, US version exists (200).'
      : 'Link is localized, localized version is a 404, US version is also a 404.';
    violations.push({
      description,
      impact: 'serious',
      id: 'link-localization',
      help: 'Ensure localized pages exist or update links to valid content.',
      nodes: [{ target: [getUniqueSelector(linkEl)], html: linkEl.outerHTML }],
    });
  }

  for (const link of links) {
    await evaluateLink(link);
  }

  return violations;
}
