import {
  customFetch,
  getConfig,
  getGeoIpSheetHoist,
  geoIpSiteKey,
  getMetadata,
  lingoActive,
  normCountryCode,
  resolveDetectedMarketCountry,
} from '../utils/utils.js';

const fetchedPlaceholders = {};
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

// Geo-IP column sheet: one row per key, one uppercase-ISO country column per market, one tab per
// lingo site (`?sheet=<siteKey>`); flattened to `{ key: value }` for the visitor's market country.
// Authoring contract: home-market column first (it's the fallback default); every `-geo-ip` key
// also needs a base row in placeholders.json; add a site's tab before enabling langfirst. A missing
// tab 404s → geo-ip inert, tokens keep their base (intended; an `en` fallback would leak English).

// geo-ip file uses non-ISO `UK`; normCountryCode uses `gb`.
const COUNTRY_COL_ALIAS = { gb: 'UK' };
const countryToColumn = (c) => (c ? (COUNTRY_COL_ALIAS[c] ?? c).toUpperCase() : null);

// source: caller-supplied sheet (e.g. C2 gnav's federal one); else the page content root.
const getGeoIpPlaceholderPath = (config, source) => {
  if (source) return source;
  return `${config.locale?.contentRoot}/placeholders-geo-ip.json`;
};

const parseGeoIpColumnJson = (json, column, out) => {
  const defaultColumn = json.columns?.find((c) => c !== 'key');
  json.data?.forEach((row) => {
    const val = row[column] || row[defaultColumn]; // visitor's market, else the default column
    if (typeof val === 'string' && val.length) out[row.key] = val;
  });
};

async function getGeoIpColumnPlaceholders(config, source) {
  // detected-market country, not pure geo, to match MEP targeting + MAS pricing
  const rawCountry = await resolveDetectedMarketCountry();
  const column = countryToColumn(normCountryCode(rawCountry));
  if (!column) return null;

  const basePath = getGeoIpPlaceholderPath(config, source);
  // tab = lingo site key (not ietf, which merges distinct sites): child's `base`, else own prefix
  const lang = geoIpSiteKey(config.locale);
  const path = `${basePath}${basePath.includes('?') ? '&' : '?'}sheet=${lang}`;
  const cacheKey = `${path}#${column}`;

  fetchedPlaceholders[cacheKey] ||= (async () => {
    const out = {};
    try {
      // reuse the page-load hoist for this sheet if present, else fetch now
      const hoist = getGeoIpSheetHoist();
      const req = hoist?.url === path
        ? hoist.resp
        : customFetch({ resource: path, withCacheRules: true });
      const resp = await req.catch(() => null);
      const json = resp?.ok ? await resp.json() : null;
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

// Map of `-geo-ip` overrides (or null), for surfaces that replace tokens outside milo's
// decorateArea pipeline. `source` is an optional absolute URL to a placeholders-geo-ip.json
// file (e.g. `${federalDomain}/globalnav/placeholders-geo-ip.json`); when omitted the URL
// is derived from config.locale.contentRoot. Returns null when lingo is inactive.
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
