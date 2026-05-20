import {
  customFetch,
  getConfig,
  getMetadata,
  getGeoLocalePrefix,
  getPlaceholderPaths,
  lingoActive,
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

async function getGeoPlaceholders(config, sheet) {
  if (!lingoActive()) return null;
  const geoPrefix = await getGeoLocalePrefix();
  if (!geoPrefix) return null;
  const siteConfig = getConfig();
  let geoOrigin = window.location.origin;
  let pathSuffix = siteConfig.contentRoot ?? '';
  const callerContentRoot = config.locale?.contentRoot ?? '';
  const siteContentRoot = siteConfig.locale?.contentRoot ?? '';
  if (callerContentRoot && callerContentRoot !== siteContentRoot) {
    let path = callerContentRoot;
    try {
      const url = new URL(path);
      geoOrigin = url.origin;
      path = url.pathname;
    } catch { /* relative path */ }
    const prefix = config.locale?.prefix ?? '';
    if (prefix && path.startsWith(prefix)) path = path.slice(prefix.length);
    pathSuffix = path;
  }

  const geoContentRoot = `${geoOrigin}${geoPrefix}${pathSuffix}`;
  const geoConfig = { locale: { contentRoot: geoContentRoot }, env: siteConfig.env || {} };
  const paths = getPlaceholderPaths(geoConfig);

  const placeholderRequest = Promise.all(
    paths.map((path) => customFetch({ resource: path, withCacheRules: true }).catch(() => ({}))),
  );

  return fetchPlaceholders({
    config: geoConfig,
    sheet,
    placeholderRequest,
    placeholderPath: paths[0],
  }).catch((e) => {
    window.lana?.log(`Error fetching geo placeholders: ${e?.message}`, { tags: 'placeholders', severity: 'warn' });
    return {};
  });
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
  { defer = false } = {},
) {
  if (typeof text !== 'string' || !text.length) return '';

  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  const keys = Array.from(matches, (match) => match[1] || match[2]);
  let geoPlaceholders = null;
  if (keys.some(isGeoIpKey) && !defer) {
    geoPlaceholders = await getGeoPlaceholders(config, sheet);
  }

  const resolved = await Promise.all(keys.map(async (key) => {
    if (config.placeholders?.[key]) return config.placeholders[key];
    if (geoPlaceholders && isGeoIpKey(key)
      && typeof geoPlaceholders[key] === 'string') return geoPlaceholders[key];
    return getPlaceholder(key, config, sheet);
  }));

  let i = 0;
  // eslint-disable-next-line no-plusplus
  let finalText = text.replaceAll(regex, () => resolved[i++]);
  finalText = finalText.replace(/&nbsp;/g, '\u00A0');
  return finalText;
}

const geoIpPattern = /{{(.*?-geo-ip)}}|%7B%7B(.*?-geo-ip)%7D%7D/g;
const findGeoIpKeys = (t) => (t ? [...t.matchAll(geoIpPattern)].map((m) => m[1] || m[2]) : []);

async function deferGeoIpUpdate(deferredItems, config, sheet) {
  const geo = await getGeoPlaceholders(config, sheet);
  if (!geo) return;
  await Promise.all(deferredItems.map(async ({ node, type, attrName, key }) => {
    if (config.placeholders?.[key] || typeof geo[key] !== 'string') return;
    const base = await getPlaceholder(key, config, sheet);
    if (geo[key] === base) return;
    if (type === 'text') {
      node.nodeValue = node.nodeValue.replace(base, geo[key]);
    } else {
      const cur = node.getAttribute(attrName);
      if (cur) node.setAttribute(attrName, cur.replace(base, geo[key]));
    }
  }));
}

export async function decoratePlaceholderArea({
  placeholderPath,
  placeholderRequest,
  nodes,
}) {
  if (!nodes.length) return;
  const config = getConfig();
  await fetchPlaceholders({ placeholderPath, config, placeholderRequest });
  const deferred = [];
  const deferOpt = { defer: true };
  const track = (keys, item) => keys.forEach((key) => deferred.push({ ...item, key }));

  const replaceNodes = nodes.map(async (nodeEl) => {
    if (nodeEl.nodeType === Node.TEXT_NODE) {
      track(findGeoIpKeys(nodeEl.nodeValue), { node: nodeEl, type: 'text' });
      nodeEl.nodeValue = await replaceText(nodeEl.nodeValue, config, PLACEHOLDER_REGEX, 'default', deferOpt);
    } else if (nodeEl.nodeType === Node.ELEMENT_NODE) {
      const attrPromises = [...nodeEl.attributes].map(async (attr) => {
        track(findGeoIpKeys(attr.value), { node: nodeEl, type: 'attr', attrName: attr.name });
        const val = await replaceText(attr.value, config, PLACEHOLDER_REGEX, 'default', deferOpt);
        return { name: attr.name, value: val };
      });
      (await Promise.all(attrPromises)).forEach(({ name, value }) => {
        nodeEl.setAttribute(name, value);
      });
    }
  });
  await Promise.all(replaceNodes);

  if (deferred.length) {
    decoratePlaceholderArea.deferredGeo = deferGeoIpUpdate(deferred, config);
  }
}
