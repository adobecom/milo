import { createTag } from '../../utils/utils.js';

function normalizePathname(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

function getPathPrefix(pathname) {
  const normalized = normalizePathname(pathname);
  const match = normalized.match(/^\/[a-z]{2}(?:_[a-z]{2})?(?=\/|$)/i);
  return match ? match[0].toLowerCase() : '';
}

function isCurrentSitemapLink(anchor) {
  try {
    const linkPath = normalizePathname(new URL(anchor.href, window.location.href).pathname);
    const currentPath = normalizePathname(window.location.pathname);
    if (linkPath === currentPath) return true;

    const linkPrefix = getPathPrefix(linkPath);
    const currentPrefix = getPathPrefix(currentPath);
    return !!linkPrefix && linkPrefix === currentPrefix;
  } catch (e) {
    return false;
  }
}

export default async function init(el) {
  const items = [...el.querySelectorAll('a[href]')]
    .filter((anchor) => !isCurrentSitemapLink(anchor))
    .map((anchor) => createTag('p', { class: 'sitemap-list-item' }, anchor.cloneNode(true)));

  const content = createTag('div', { class: 'sitemap-list-items' }, items);

  el.textContent = '';
  el.append(content);
}
