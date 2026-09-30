export const DEBOUNCE_TIME = 800;

export const LOCAL_STORAGE_KEYS = {
  search: 'mmm2_search_filter_settings',
  inactivity: 'mmm2_inactivity_filter_settings',
  metadataLookup: 'mmm2_metadata_filter_settings',
};

export const LAST_SEEN_OPTIONS = {
  day: { value: 'Day', key: 'day' },
  week: { value: 'Week', key: 'week' },
  month: { value: 'Month', key: 'month' },
  threeMonths: { value: '3 Months', key: 'threeMonths' },
  sixMonths: { value: '6 Months', key: 'sixMonths' },
  year: { value: 'Year', key: 'year' },
  all: { value: 'All', key: 'all' },
};

export const SUBDOMAIN_OPTIONS = {
  www: { value: 'www', key: 'www' },
  business: { value: 'business', key: 'business' },
  all: { value: 'all', key: 'all' },
};

export const TARGETSETTING_OPTIONS = {
  on: { label: 'On', value: 'on' },
  off: { label: 'Off', value: 'off' },
  postLCP: { label: 'Post LCP', value: 'postLCP' },
};

export const MANIFESTSRC_OPTIONS = {
  personalization: { label: 'PZN', value: 'pzn' },
  promo: { label: 'Promo', value: 'promo' },
  target: { label: 'Target', value: 'target' },
};

export const TARGET_METADATA_OPTIONS = {
  cc: {
    name: 'CC',
    metadata: 'https://main--cc--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B818b8ad2-72db-4726-85a6-5238d6715069%7D&action=edit&activeCell=%27helix-default%27!A16&wdinitialsession=11b36a4d-a08b-0def-1294-1fcf497cfc1a&wdrldsc=4&wdrldc=1&wdrldr=AccessTokenExpiredWarningUnauthenticated%2CRefreshin',
  },
  dc: {
    name: 'DC',
    metadata: 'https://main--dc--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B8F5A8CD0-7979-41CE-894A-CC465B293C1A%7D&file=metadata-optimization.xlsx&action=default&mobileredirect=true&wdsle=0',
  },
  express: {
    name: 'Express',
    metadata: 'https://main--express-milo--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7BEC96D2B9-9F25-48AF-B88A-A6926A340D3A%7D&file=metadata-optimization.xlsx&action=default&mobileredirect=true',
  },
  bacom: {
    name: 'BACOM',
    metadata: 'https://main--bacom--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7BEE70634D-C16E-45E7-B16E-718C5022413E%7D&file=metadata-optimization.xlsx&action=default&mobileredirect=true&wdsle=0',
  },
};

export const METADATA_URLS_CATEGORIES = {
  notFound: { display: 'Not in spreadsheet', key: 'notFound' },
  off: { display: 'Off', key: 'off' },
  on: { display: 'On', key: 'on' },
  postLCP: { display: 'PostLCP', key: 'postLCP' },
};

// Reference pages whose authored config tables (e.g. the geos list) this SPA reads via
// a cross-page fetch, instead of duplicating that content on the /mmm-2 page itself.
export const REFERENCE_PAGES = {
  inactivity: '/docs/authoring/features/mmm/mep-target-inactivity',
  // The original (pre-mmm-2) report page - source of the Search tab's geos/pages config.
  // Must be `/mmm/index`, not bare `/mmm` - the bare path's `.plain.html` is a "this page
  // has been moved" redirect stub, not the real block content (verified directly).
  search: '/docs/authoring/features/mmm/index',
};

export function debounce(func, delay = DEBOUNCE_TIME) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

/**
 * Converts the raw newline-separated text a user types into the search textarea into
 * the comma-separated list the API's `filter`/`urls` params expect. Literal commas
 * typed by the user are stripped first since entries are meant to be one-per-line.
 */
export function toFilterParam(rawText) {
  if (!rawText) return '';
  return rawText.replace(/,/g, '').replace(/\n/g, ',\n');
}

export function getDate(inputDate) {
  const date = inputDate || new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', dateOptions);
}

export function getAbsUrl(manifestUrl, pageUrl) {
  return manifestUrl?.startsWith('http')
    ? manifestUrl
    : `${pageUrl.split('.com')[0]}.com${manifestUrl}`;
}

/**
 * Extracts a bare pathname (e.g. `/products/photoshop`) from user-entered input that
 * may be a full URL (with or without protocol) or already a bare path - the metadata
 * spreadsheet backing the Metadata Lookup tab only ever stores bare paths, so this is
 * how entered URLs get normalized to match against it. Previously this used
 * `url.split(/\.com|\.html/g)[1]`, which returned `undefined` (rendering as a blank
 * line) for any entry that wasn't a full `.com`/`.html` URL - most commonly a bare
 * path pasted directly, which is the spreadsheet's own format.
 */
export function getUrlPath(rawUrl) {
  const url = (rawUrl ?? '').trim();
  if (!url) return '';
  if (url.startsWith('/')) return url;
  try {
    return new URL(url).pathname;
  } catch {
    try {
      return new URL(`https://${url}`).pathname;
    } catch {
      return url;
    }
  }
}

/**
 * Parses a block's authored table content (row 1 = "Menu: <key>" / <group label>,
 * subsequent rows = <option value> / <option label>) into a lookup keyed by group.
 * Ported as-is from the original mmm.js - works against both a live decorated block
 * element and a raw (pre-decoration) Franklin div structure, since the shape (nested
 * divs, two per row) is identical either way.
 */
export function parseData(el) {
  const data = {};
  const rows = el.querySelectorAll('div');
  let currentKey = '';
  rows.forEach((row) => {
    const cols = row.querySelectorAll('div');
    if (cols.length < 2) return;
    const val = cols[1].innerText.trim();
    let key = cols[0].innerText.toLowerCase().replace(/\s+/g, '');
    if (key.startsWith('menu')) {
      key = key.split(':')[1].trim();
      currentKey = key;
      data[key] = { label: val, options: {} };
      return;
    }
    if (data[currentKey]) data[currentKey].options[key] = val;
  });
  return data;
}

/**
 * Fetches another authored page's raw (un-decorated) markup via Franklin's
 * `.plain.html` convention (same pattern as libs/blocks/fragment/fragment.js) and
 * returns the parsed Document. Used to read config tables authored on the
 * inactivity-report/metadata-lookup pages without duplicating that content here.
 */
export async function fetchPlainHtml(path) {
  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) throw new Error(`Failed to fetch ${path}.plain.html: ${resp.status}`);
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Fetches a reference page and parses its mmm block's config table via parseData().
 * `blockSelector` matches the raw Franklin class(es) the table's first cell produces,
 * e.g. '.mmm.target-cleanup'.
 */
export async function fetchReferenceConfig(path, blockSelector) {
  const doc = await fetchPlainHtml(path);
  const blockEl = doc.querySelector(blockSelector);
  return blockEl ? parseData(blockEl) : {};
}
