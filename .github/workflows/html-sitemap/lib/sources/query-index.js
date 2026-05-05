import { fetchJson } from '../util/fetch.js';
import { getErrorMessage } from '../util/stages.js';

/**
 * @typedef {Object} QueryIndexJson
 * @property {number} [total]
 * @property {number} [offset]
 * @property {number} [limit]
 * @property {unknown[]} [data]
 */

/**
 * @param {string} geo
 * @param {string} resourcePath
 * @returns {string}
 */
function withGeoPrefix(geo, resourcePath) {
  const prefix = geo ? `/${geo}` : '';
  return `${prefix}${resourcePath}`;
}

/**
 * @param {string} baseUrl
 * @param {number} offset
 * @returns {string}
 */
function getPageUrl(baseUrl, offset) {
  const url = new URL(baseUrl);
  url.searchParams.set('offset', String(offset));
  return url.toString();
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isPagedQueryIndexJson(value) {
  return Boolean(value) && typeof value === 'object' && Array.isArray(/** @type {QueryIndexJson} */ (value).data);
}

/**
 * @param {string} url
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<{ ok: false, status: number, statusText: string, url: string } | { ok: true, url: string, json: unknown }>}
 */
async function fetchQueryIndexPage(
  url,
  fetchImpl,
) {
  const response = await fetchJson(url, {}, { fetchImpl });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
      url,
    };
  }

  try {
    return {
      ok: true,
      url,
      json: await response.json(),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: getErrorMessage(error),
      url,
    };
  }
}

/**
 * @param {{ site: string, geo: string, queryIndexPath: string, fetchImpl?: typeof fetch }} options
 * @returns {Promise<{ ok: false, status: number, statusText: string, url: string } | { ok: true, url: string, json: unknown, rowCount: number }>}
 */
export async function fetchQueryIndex(
  { site, geo, queryIndexPath, fetchImpl },
) {
  const origin = `https://main--${site}--adobecom.aem.live`;
  const url = `${origin}${withGeoPrefix(geo, queryIndexPath)}`;
  const firstPage = await fetchQueryIndexPage(url, fetchImpl);

  if (!firstPage.ok) {
    return firstPage;
  }

  const { json } = firstPage;
  if (!isPagedQueryIndexJson(json)) {
    return {
      ok: true,
      url,
      json,
      rowCount: 0,
    };
  }

  const typedJson = /** @type {QueryIndexJson & { data: unknown[] }} */ (json);
  const mergedData = [...typedJson.data];
  const merged = {
    ...typedJson,
    data: mergedData,
  };
  const total = typeof typedJson.total === 'number' ? typedJson.total : mergedData.length;
  const pageSize = typeof typedJson.limit === 'number' && typedJson.limit > 0 ? typedJson.limit : mergedData.length;
  let nextOffset = typeof typedJson.offset === 'number' ? typedJson.offset + mergedData.length : mergedData.length;

  while (pageSize > 0 && mergedData.length < total) {
    const page = await fetchQueryIndexPage(getPageUrl(url, nextOffset), fetchImpl);
    if (!page.ok) {
      return page;
    }

    if (!isPagedQueryIndexJson(page.json)) {
      break;
    }

    const typedPage = /** @type {QueryIndexJson & { data: unknown[] }} */ (page.json);
    mergedData.push(...typedPage.data);
    nextOffset += typedPage.data.length || pageSize;

    if (typedPage.data.length === 0) {
      break;
    }
  }

  return {
    ok: true,
    url,
    json: merged,
    rowCount: mergedData.length,
  };
}
