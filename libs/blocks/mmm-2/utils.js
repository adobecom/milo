import { decorateLinksAsync } from '../../utils/utils.js';
import { decorateBlockText, decorateButtons } from '../../utils/decorate.js';

export const DEBOUNCE_TIME = 800;

export function getButtonClasses(emphasis, size) {
  const container = document.createElement('p');
  const wrapper = document.createElement(emphasis);
  const link = document.createElement('a');
  wrapper.append(link);
  container.append(wrapper);
  decorateButtons(container, size ? `button-${size}` : undefined);
  return link.className;
}

export const LOCAL_STORAGE_KEYS = {
  search: 'mmm2_search_filter_settings',
  inactivity: 'mmm2_inactivity_filter_settings',
  metadataLookup: 'mmm2_metadata_filter_settings',
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
 * Menu names are normalized; option values preserve case for API enums and paths.
 * Works against both decorated and raw Franklin tables.
 */
export function parseData(el) {
  const data = {};
  const rows = [...el.children];
  let currentKey = '';
  rows.forEach((row) => {
    const cols = row.children;
    if (cols.length < 2) return;
    const val = (cols[1].innerText || cols[1].textContent).trim();
    const rawKey = (cols[0].innerText || cols[0].textContent).replace(/\s+/g, '');
    let key = rawKey.toLowerCase();
    if (key.startsWith('menu:')) {
      key = key.split(':')[1].trim();
      currentKey = key;
      data[key] = { label: val, options: {} };
      return;
    }
    const group = data[currentKey];
    if (!group) return;
    group.options[rawKey] = val;
    if (cols[0].querySelector('strong, b') || cols[1].querySelector('strong, b')) {
      if (Object.prototype.hasOwnProperty.call(group, 'defaultValue')) group.multipleDefaults = true;
      group.defaultValue = rawKey;
    }
  });
  return data;
}

async function consumeTabConfig(el, blockName, label, menuKeys) {
  const content = el.querySelector(`:scope > .${blockName}`)
    ?? el.parentElement?.querySelector(`:scope > .${blockName}:not(.mmm-2)`);
  if (!content) {
    const article = /^[aeiou]/i.test(label) ? 'an' : 'a';
    return { error: `Add ${article} ${label} table to this section to configure this tab.` };
  }

  await decorateLinksAsync(content);
  const config = parseData(content);
  const [title, body] = content.firstElementChild?.children ?? [];
  const missing = menuKeys
    .filter((key) => !Object.keys(config[key]?.options ?? {}).length);
  if (!title?.textContent.trim() || /^menu\s*:/i.test(title.textContent) || !body?.innerHTML.trim()) {
    missing.push('instructions');
  } else {
    decorateBlockText(body, ['m', 's', null, 's']);
    body.querySelectorAll('.supplemental-text.body-xl').forEach((note) => {
      note.classList.remove('body-s');
      note.classList.replace('body-xl', 'body-xs');
    });
    config.howTo = { title: title.textContent.trim(), html: body.innerHTML };
  }
  if (missing.length) {
    config.error = `${label} configuration is missing: ${missing.join(', ')}.`;
  } else {
    const ambiguous = menuKeys
      .filter((key) => config[key].multipleDefaults);
    if (ambiguous.length) {
      config.error = `Bold only one default option per menu: ${ambiguous.join(', ')}.`;
    }
  }
  if (blockName === 'metadata-lookup' && config.metadatarepo) {
    const unsupported = Object.keys(config.metadatarepo.options)
      .filter((key) => !Object.prototype.hasOwnProperty.call(TARGET_METADATA_OPTIONS, key));
    if (unsupported.length) config.error = `Unsupported metadata repositories: ${unsupported.join(', ')}.`;
  }
  content.remove();
  return config;
}

export async function consumeTabConfigs(el) {
  const [search, inactivity, metadata] = await Promise.all([
    consumeTabConfig(el, 'manifest-manager', 'Manifest Manager', ['pages', 'geos', 'lastseenmanifest', 'subdomain']),
    consumeTabConfig(el, 'inactivity-report', 'Inactivity Report', ['geos', 'lastseenmanifest']),
    consumeTabConfig(el, 'metadata-lookup', 'Metadata Lookup', ['metadatarepo']),
  ]);
  return { search, inactivity, metadata };
}

export const menuOptions = (group) => Object.entries(group.options)
  .map(([value, label]) => ({ value, label }));

export function normalizeAuthoredFilters(savedFilters, authoredConfig, menuKeys, defaults) {
  const filters = { ...defaults, ...savedFilters };
  const resetFilters = [];
  Object.entries(menuKeys).forEach(([key, menu]) => {
    const group = authoredConfig[menu];
    const options = group?.options ?? {};
    const defaultValue = group?.defaultValue ?? Object.keys(options)[0];
    if (!Object.prototype.hasOwnProperty.call(filters, key)) {
      filters[key] = defaultValue;
      return;
    }
    if (['lastseenmanifest', 'subdomain'].includes(menu) && filters[key] === 'all'
      && !Object.prototype.hasOwnProperty.call(options, 'all')
      && Object.prototype.hasOwnProperty.call(options, '')) filters[key] = '';
    if (!Object.prototype.hasOwnProperty.call(options, filters[key])) {
      filters[key] = defaultValue;
      if (Object.prototype.hasOwnProperty.call(filters, 'pageNum')) filters.pageNum = 1;
      resetFilters.push(group?.label ?? key);
    }
  });
  return { filters, resetFilters };
}
