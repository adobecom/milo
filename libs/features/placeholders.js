import {
  customFetch,
  getConfig,
  geoIpSiteKey,
  getGeoIpWarmSheet,
  getMetadata,
  lingoActive,
  normCountryCode,
  resolveDetectedMarketCountry,
} from '../utils/utils.js';

const fetchedPlaceholders = {};
const fetchedGeoSheets = {};
window.mph = {};

const getPlaceholdersPath = (config, sheet) => {
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const query = sheet !== 'default' && typeof sheet === 'string' && sheet.length ? `?sheet=${sheet}` : '';
  return `${path}${query}`;
};

const parsePlaceholderJson = async (resp, placeholders) => {
  try {
    const json = resp.ok ? await resp.json() : { data: [] };
    json.data?.forEach((item) => {
      window.mph[item.key] = item.value;
      placeholders[item.key] = item.value;
    });
  } catch (e) {
    window.lana.log(`Error parsing placeholder json: ${e.message}`, { tags: 'placeholders', severity: 'error' });
  }
};

const fetchPlaceholder = (path, placeholderRequest) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve) => {
    const resp = await placeholderRequest || await customFetch(
      { resource: path, withCacheRules: true },
    ).catch(() => ({}));
    const placeholders = {};

    if (Array.isArray(resp)) {
      // Overlay placeholders
      for (const r of resp) await parsePlaceholderJson(r, placeholders);
    } else {
      await parsePlaceholderJson(resp, placeholders);
    }

    resolve(placeholders);
  },
);

export const fetchPlaceholders = async ({
  config,
  sheet,
  placeholderRequest,
  placeholderPath,
}) => {
  const path = placeholderPath || getPlaceholdersPath(config, sheet);

  fetchedPlaceholders[path] ||= fetchPlaceholder(path, placeholderRequest);

  return fetchedPlaceholders[path];
};

function keyToStr(key) {
  return key.replaceAll('-', ' ');
}

const isGeoIpKey = (key) => key.endsWith('-geo-ip');
const PLACEHOLDER_REGEX = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;

const COUNTRY_COL_ALIAS = { gb: 'UK' };
const countryToColumn = (c) => (c ? (COUNTRY_COL_ALIAS[c] ?? c).toUpperCase() : null);

const getGeoIpPlaceholderPath = (config, source) => {
  if (source) return source;
  return `${config.locale?.contentRoot}/placeholders-geo-ip.json`;
};

const NONE_SENTINEL = '--none--';
const cellVal = (v) => (typeof v === 'string' ? v.trim() : '');

const parseGeoIpColumnJson = (json, column, out) => {
  const cols = json.columns ?? [];
  const defaultColumn = cols.find((c) => c.toLowerCase() === 'default')
    ?? cols.find((c) => c !== 'key');
  json.data?.forEach((row) => {
    const val = cellVal(row[column]) || cellVal(row[defaultColumn]);
    if (val === NONE_SENTINEL) { out[row.key] = ''; return; }
    if (val) out[row.key] = val;
  });
};

const geoIpSheetPath = (config, source) => {
  const basePath = getGeoIpPlaceholderPath(config, source);
  const lang = geoIpSiteKey(config.locale);
  return `${basePath}${basePath.includes('?') ? '&' : '?'}sheet=${lang}`;
};

const fetchGeoIpSheet = (path) => {
  fetchedGeoSheets[path] ||= getGeoIpWarmSheet(path)
    || customFetch({ resource: path, withCacheRules: true })
      .then((r) => (r?.ok ? r.json() : null))
      .catch(() => null);
  return fetchedGeoSheets[path];
};

async function getGeoIpColumnPlaceholders(config, source) {
  const path = geoIpSheetPath(config, source);
  const jsonPromise = fetchGeoIpSheet(path); // start fetch before awaiting country
  // detected-market country, not pure geo, to match MEP targeting + MAS pricing
  const rawCountry = await resolveDetectedMarketCountry();
  const column = countryToColumn(normCountryCode(rawCountry));
  if (!column) return null;

  const cacheKey = `${path}#${column}`;
  fetchedPlaceholders[cacheKey] ||= (async () => {
    const out = {};
    try {
      const json = await jsonPromise;
      if (json) parseGeoIpColumnJson(json, column, out);
    } catch (e) {
      window.lana?.log(`Error parsing geo-ip placeholder json: ${e.message}`, { tags: 'placeholders', severity: 'error' });
    }
    return out;
  })();

  return fetchedPlaceholders[cacheKey];
}

async function getGeoPlaceholders(config, source) {
  if (!lingoActive()) return null;
  return getGeoIpColumnPlaceholders(config, source);
}

// Map of `-geo-ip` overrides (or null) for surfaces outside milo's decorateArea pipeline (e.g.
// C2 gnav); `source` is an optional absolute sheet URL, else derived from config.locale.
export async function getGeoIpPlaceholders(config = getConfig(), source = undefined) {
  const geo = await getGeoPlaceholders(config, source);
  if (!geo) return null;
  const overrides = new Map();
  Object.entries(geo).forEach(([key, value]) => {
    if (isGeoIpKey(key) && typeof value === 'string') overrides.set(key, value);
  });
  return overrides.size ? overrides : null;
}

async function getPlaceholder(key, config, sheet) {
  let defaultFetched = false;
  const defaultLocale = 'en-US';
  const geoLocDisabled = getMetadata('disable-geo-placeholders') || 'off';

  const getDefaultContentRoot = () => {
    const defaultContentRoot = config.locale.contentRoot;
    const localePrefix = config.locale.prefix;

    if (!localePrefix.length) return defaultContentRoot;

    // Certain locale prefixes are common beginnings of words, such as /es
    // This could also be part of a page path, such as '/esign'
    if (defaultContentRoot.endsWith(localePrefix)) {
      return defaultContentRoot.replace(localePrefix, '');
    }

    return defaultContentRoot.replace(`${localePrefix}/`, '/');
  };

  const getDefaultPlaceholders = async () => {
    const defaultConfig = {
      locale: {
        ietf: defaultLocale,
        contentRoot: getDefaultContentRoot(),
      },
    };

    const defaultPlaceholders = await fetchPlaceholders({ config: defaultConfig, sheet })
      .catch(() => ({}));
    defaultFetched = true;
    return defaultPlaceholders;
  };

  if (config.placeholders?.[key]) return config.placeholders[key];

  let placeholders;

  if (geoLocDisabled === 'on') {
    placeholders = await getDefaultPlaceholders();
  } else {
    placeholders = await fetchPlaceholders({ config, sheet });
  }

  if (typeof placeholders?.[key] === 'string') return placeholders[key];

  if (!defaultFetched && config.locale.ietf !== defaultLocale) {
    const defaultPlaceholders = await getDefaultPlaceholders();
    if (defaultPlaceholders?.[key]) return defaultPlaceholders[key];
  }

  return keyToStr(key);
}

export async function replaceKey(key, config, sheet = 'default') {
  if (typeof key !== 'string' || !key.length) return '';

  const label = await getPlaceholder(key, config, sheet);
  return label;
}

export async function replaceKeyArray(keys, config, sheet = 'default') {
  if (!Array.isArray(keys) || !keys.length) return [];

  const promiseArr = [];
  keys.forEach((key) => {
    promiseArr.push(getPlaceholder(key, config, sheet));
  });

  const placeholders = await Promise.all(promiseArr);
  return placeholders;
}

export async function replaceText(
  text,
  config,
  regex = PLACEHOLDER_REGEX,
  sheet = 'default',
) {
  if (typeof text !== 'string' || !text.length) return '';

  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  const keys = Array.from(matches, (match) => match[1] || match[2]);
  const geoIpKeys = keys.filter(isGeoIpKey);
  let geoPlaceholders = null;
  if (geoIpKeys.length) {
    geoPlaceholders = await getGeoPlaceholders(config);
  }

  const resolved = await Promise.all(keys.map(async (key) => {
    if (config.placeholders?.[key]) return config.placeholders[key];
    if (geoPlaceholders && isGeoIpKey(key)
      && typeof geoPlaceholders[key] === 'string') {
      return geoPlaceholders[key];
    }
    return getPlaceholder(key, config, sheet);
  }));

  let i = 0;
  // eslint-disable-next-line no-plusplus
  let finalText = text.replaceAll(regex, () => resolved[i++]);
  finalText = finalText.replace(/&nbsp;/g, '\u00A0');
  return finalText;
}

export async function decoratePlaceholderArea({
  placeholderPath,
  placeholderRequest,
  nodes,
}) {
  if (!nodes.length) return;
  const config = getConfig();
  await fetchPlaceholders({ placeholderPath, config, placeholderRequest });

  const replaceNodes = nodes.map(async (nodeEl) => {
    if (nodeEl.nodeType === Node.TEXT_NODE) {
      nodeEl.nodeValue = await replaceText(nodeEl.nodeValue, config);
    } else if (nodeEl.nodeType === Node.ELEMENT_NODE) {
      const attrPromises = [...nodeEl.attributes].map(async (attr) => {
        const val = await replaceText(attr.value, config);
        return { name: attr.name, value: val };
      });
      (await Promise.all(attrPromises)).forEach(({ name, value }) => {
        nodeEl.setAttribute(name, value);
      });
    }
  });
  await Promise.all(replaceNodes);
}
