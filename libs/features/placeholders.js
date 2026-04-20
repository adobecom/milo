import { customFetch, getConfig, getMetadata } from '../utils/utils.js';

const fetchedPlaceholders = {};
window.mph = {};

const getPlaceholdersPath = (config, sheet) => {
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const query = sheet !== 'default' && typeof sheet === 'string' && sheet.length ? `?sheet=${sheet}` : '';
  return `${path}${query}`;
};

const parsePlaceholderJson = async (resp, placeholders, { updateMph = true } = {}) => {
  try {
    const json = resp.ok ? await resp.json() : { data: [] };
    json.data?.forEach((item) => {
      if (updateMph) window.mph[item.key] = item.value;
      placeholders[item.key] = item.value;
    });
  } catch (e) {
    window.lana.log(`Error parsing placeholder json: ${e.message}`, { tags: 'placeholders', severity: 'error' });
  }
};

const fetchPlaceholder = (path, placeholderRequest, { updateMph = true } = {}) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve) => {
    const resp = await placeholderRequest || await customFetch(
      { resource: path, withCacheRules: true },
    ).catch(() => ({}));
    const placeholders = {};

    if (Array.isArray(resp)) {
      // Overlay placeholders
      for (const r of resp) await parsePlaceholderJson(r, placeholders, { updateMph });
    } else {
      await parsePlaceholderJson(resp, placeholders, { updateMph });
    }

    resolve(placeholders);
  },
);

export const fetchPlaceholders = async ({
  config,
  sheet,
  placeholderRequest,
  placeholderPath,
  updateMph = true,
}) => {
  const path = placeholderPath || getPlaceholdersPath(config, sheet);

  fetchedPlaceholders[path] ||= fetchPlaceholder(path, placeholderRequest, { updateMph });

  return fetchedPlaceholders[path];
};

function keyToStr(key) {
  return key.replaceAll('-', ' ');
}

const isGeoKey = (key) => key.endsWith('-geo');
const stripGeo = (key) => key.slice(0, -4);

const geoPlaceholderCache = new Map();
export function resetGeoPlaceholderCache() { geoPlaceholderCache.clear(); }

async function getGeoPlaceholders(config, sheet) {
  // Dynamic to avoid circular dep with utils.js that hangs WTR test runner
  const { lingoActive, getGeoLocalePrefix } = await import('../utils/utils.js');
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
  const geoConfig = { locale: { contentRoot: geoContentRoot } };

  const root = `${geoContentRoot}/placeholders`;
  const paths = [`${root}.json`];
  if (siteConfig.env?.name !== 'prod'
    && getMetadata('placeholders-stage') === 'on') paths.push(`${root}-stage.json`);

  const placeholderRequest = Promise.all(
    paths.map((path) => customFetch({ resource: path, withCacheRules: true }).catch(() => ({}))),
  );

  return fetchPlaceholders({
    config: geoConfig,
    sheet,
    placeholderRequest,
    placeholderPath: paths[0],
    updateMph: false,
  }).catch(() => ({}));
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

  if (isGeoKey(key)) return getPlaceholder(stripGeo(key), config, sheet);

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

async function resolveGeoKey(key, config, sheet) {
  const baseKey = stripGeo(key);
  const cacheKey = config.locale?.contentRoot ?? '';
  if (!geoPlaceholderCache.has(cacheKey)) {
    geoPlaceholderCache.set(cacheKey, getGeoPlaceholders(config, sheet));
  }
  const geoPlaceholders = await geoPlaceholderCache.get(cacheKey);
  if (typeof geoPlaceholders?.[baseKey] === 'string') return geoPlaceholders[baseKey];
  return getPlaceholder(baseKey, config, sheet);
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

function isTelContext(text, matchIndex) {
  const preceding = text.slice(Math.max(0, matchIndex - 10), matchIndex);
  return /(?:^|["'=\s])tel:/i.test(preceding);
}

export async function replaceText(
  text,
  config,
  regex = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g,
  sheet = 'default',
) {
  if (typeof text !== 'string' || !text.length) return '';

  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  const keys = Array.from(matches, (match) => match[1] || match[2]);
  const resolved = await Promise.all(keys.map(async (key, idx) => {
    if (isGeoKey(key) && isTelContext(text, matches[idx].index)) {
      return resolveGeoKey(key, config, sheet);
    }
    return getPlaceholder(key, config, sheet);
  }));

  let i = 0;
  // eslint-disable-next-line no-plusplus
  let finalText = text.replaceAll(regex, () => resolved[i++]);
  finalText = finalText.replace(/&nbsp;/g, '\u00A0');
  return finalText;
}

function findGeoKeyInTelHref(el) {
  if (el.tagName !== 'A') return null;
  const href = el.getAttribute('href') || '';
  if (!/^tel:/i.test(href)) return null;
  const geoMatch = href.match(/{{(.*?-geo)}}|%7B%7B(.*?-geo)%7D%7D/);
  return geoMatch ? (geoMatch[1] || geoMatch[2]) : null;
}

export async function decoratePlaceholderArea({
  placeholderPath,
  placeholderRequest,
  nodes,
}) {
  if (!nodes.length) return;
  const config = getConfig();
  await fetchPlaceholders({ placeholderPath, config, placeholderRequest });
  const geoLinks = [];
  const replaceNodes = nodes.map(async (nodeEl) => {
    if (nodeEl.nodeType === Node.TEXT_NODE) {
      nodeEl.nodeValue = await replaceText(nodeEl.nodeValue, config);
    } else if (nodeEl.nodeType === Node.ELEMENT_NODE) {
      const geoKey = findGeoKeyInTelHref(nodeEl);
      if (geoKey) geoLinks.push({ el: nodeEl, geoKey });
      const attrPromises = [...nodeEl.attributes].map(async (attr) => {
        const attrVal = await replaceText(attr.value, config);
        return { name: attr.name, value: attrVal };
      });
      const results = await Promise.all(attrPromises);
      results.forEach(({ name, value }) => {
        nodeEl.setAttribute(name, value);
      });
    }
  });
  await Promise.all(replaceNodes);
  if (geoLinks.length) {
    await Promise.all(geoLinks.map(async ({ el, geoKey }) => {
      const geoValue = await resolveGeoKey(geoKey, config);
      if (geoValue && geoValue !== keyToStr(stripGeo(geoKey))) {
        el.textContent = geoValue;
      }
    }));
  }
}
