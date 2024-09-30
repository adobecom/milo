import { customFetch, getConfig } from '../utils/utils.js';

const fetchedPlaceholders = {};
window.mph = {};

const getPlaceholdersPath = (config, sheet) => {
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const query = sheet !== 'default' && typeof sheet === 'string' && sheet.length ? `?sheet=${sheet}` : '';
  return `${path}${query}`;
};

const fetchPlaceholders = async ({ config, sheet, placeholderRequest, placeholderPath }) => {
  const path = placeholderPath || getPlaceholdersPath(config, sheet);
  // eslint-disable-next-line no-async-promise-executor
  fetchedPlaceholders[path] = fetchedPlaceholders[path] || new Promise(async (resolve) => {
    const resp = await placeholderRequest || await customFetch(
      { resource: path, withCacheRules: true },
    ).catch(() => ({}));
    const json = resp.ok ? await resp.json() : { data: [] };
    if (json.data.length === 0) { resolve({}); return; }
    const placeholders = {};
    json.data.forEach((item) => {
      window.mph[item.key] = item.value;
      placeholders[item.key] = item.value;
    });
    resolve(placeholders);
  });
  return fetchedPlaceholders[path];
};

function keyToStr(key) {
  console.log('keyyy', key);
  return key.replaceAll('-', ' ');
}

async function getPlaceholder(key, config, sheet) {
  let defaultFetched = false;
  const defaultLocale = 'en-US';

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

  const placeholders = await fetchPlaceholders({ config, sheet }).catch(async () => {
    const defaultPlaceholders = await getDefaultPlaceholders();
    return defaultPlaceholders;
  });

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
  regex = /{{(.*?)}}|%7B%7B(.*?)%7D%7D|%7b%7b(.*?)%7d%7d/g,
  sheet = 'default',
) {
  if (typeof text !== 'string' || !text.length) return '';

  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  const keys = Array.from(matches, (match) => match[1] || match[2] || match[3]);
  console.log('keyyy', keys, matches);
  const placeholders = await replaceKeyArray(keys, config, sheet);
  // The .shift method is very slow, thus using normal iterator
  let i = 0;
  // eslint-disable-next-line no-plusplus
  let finalText = text.replaceAll(regex, () => placeholders[i++]);
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
  console.log('---', nodes)
  await fetchPlaceholders({ placeholderPath, config, placeholderRequest });
  const replaceNodes = nodes.map(async (nodeEl) => {
    if (nodeEl.nodeType === Node.TEXT_NODE) {
      console.log('nodes', nodeEl.nodeValue);
      nodeEl.nodeValue = await replaceText(nodeEl.nodeValue, config);
    } else if (nodeEl.nodeType === Node.ELEMENT_NODE) {
      console.log('nodeshred', nodeEl.getAttribute('href'));
      const hrefVal = await replaceText(nodeEl.getAttribute('href'), config);
      nodeEl.setAttribute('href', hrefVal);
    }
  });
  await Promise.all(replaceNodes);
}
