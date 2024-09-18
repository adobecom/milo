import { getMetadata } from './utils.js';

/**
 * Prefixes the link with the language root defined in the metadata
 * @param link
 * @returns {string|*}
 */
// eslint-disable-next-line import/prefer-default-export
export function updateLinkWithLangRoot(link) {
  const langRoot = getMetadata('lang-root');
  if (!langRoot) return link;
  try {
    const url = new URL(link);
    url.pathname = `${langRoot}${url.pathname}`;
    return url.href;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Could not update link with lang root', e);
    return link;
  }
}

/**
 * Replaces the origin of the provided link with location.origin.
 *
 * @param link
 * @returns {string|*}
 */
export function overrideUrlOrigin(link) {
  try {
    const url = new URL(link);
    if (url.hostname !== window.location.hostname) {
      return link.replace(url.origin, window.location.origin);
    }
  } catch (e) {
    // ignore
  }
  return link;
}
