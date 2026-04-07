/**
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
 * @param {string} value
 * @returns {string}
 */
export function normalizeDaRoot(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('`--da-root` must not be empty.');
  return trimmed.replace(/\/+$/, '').replace(/^([^/])/, '/$1');
}

/**
 * @param {string} daRoot
 * @param {string} baseGeo
 * @returns {string}
 */
export function getRemoteHtmlFilePath(daRoot, baseGeo) {
  return joinRemotePath(daRoot, baseGeo, 'sitemap.html');
}

/**
 * @param {string} daRoot
 * @param {string} baseGeo
 * @returns {string}
 */
export function getRemoteDocumentPath(daRoot, baseGeo) {
  return joinRemotePath(daRoot, baseGeo, 'sitemap');
}
