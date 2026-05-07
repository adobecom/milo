/**
 * Path helpers for the remote DA tree where `sitemap.html` lives. Centralizes
 * the `<da-root>/<baseGeo>/sitemap.html` shape and the bare-name `sitemap`
 * variant used by AEM admin endpoints.
 */

/**
 * Join trimmed, non-empty segments with `/` and strip a leading slash.
 * @param {...string} segments
 * @returns {string}
 */
function joinRemotePath(...segments) {
  const joined = segments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
  return joined.replace(/^\/+/, '');
}

/**
 * Coerce the CLI `--da-root` into a `/path/with/no/trailing/slash` shape.
 * Throws on empty input.
 * @param {string} value
 * @returns {string}
 */
export function normalizeDaRoot(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('`--da-root` must not be empty.');
  return trimmed.replace(/\/+$/, '').replace(/^([^/])/, '/$1');
}

/**
 * Path to the `sitemap.html` file inside DA (with `.html`).
 * @param {string} daRoot
 * @param {string} baseGeo
 * @returns {string}
 */
export function getRemoteHtmlFilePath(daRoot, baseGeo) {
  return joinRemotePath(daRoot, baseGeo, 'sitemap.html');
}

/**
 * Path to the document (without the `.html` suffix) used by AEM admin
 * preview/publish endpoints.
 * @param {string} daRoot
 * @param {string} baseGeo
 * @returns {string}
 */
export function getRemoteDocumentPath(daRoot, baseGeo) {
  return joinRemotePath(daRoot, baseGeo, 'sitemap');
}
