const cachedPlaceholders = {};

// eslint-disable-next-line no-async-promise-executor
const fetchPlaceholders = (config, sheet) => new Promise(async (resolve) => {
  if (cachedPlaceholders?.[config.locale.ietf]?.[sheet]) {
    resolve(cachedPlaceholders[config.locale.ietf][sheet]);
    return;
  }

  const path = `${config.locale.contentRoot}/placeholders.json`;
  const query = sheet !== 'default' && typeof sheet === 'string' && sheet.length ? `?sheet=${sheet}` : '';
  const resp = await fetch(`${path}${query}`);
  const json = resp.ok ? await resp.json() : { data: [] };
  if (json.data.length === 0) { resolve({}); return; }
  cachedPlaceholders[config.locale.ietf] = cachedPlaceholders[config.locale.ietf] || {};
  cachedPlaceholders[config.locale.ietf][sheet] = {};
  json.data.forEach((item) => {
    cachedPlaceholders[config.locale.ietf][sheet][item.key] = item.value;
  });
  resolve(cachedPlaceholders[config.locale.ietf][sheet]);
});

function keyToStr(key) {
  return key.replaceAll('-', ' ');
}

async function getPlaceholder(key, config, sheet) {
  const defaultLocale = 'en-US';

  const getDefaultPlaceholders = async () => {
    // Maybe we should modify the getConfig() method to provide a default config?
    // Could contentRoot be different than the origin?
    const defaultConfig = {
      locale: {
        ietf: defaultLocale,
        contentRoot: window.location.origin,
      },
    };

    const defaultPlaceholders = await fetchPlaceholders(defaultConfig, sheet)
      .catch(() => keyToStr(key));
    if (defaultPlaceholders?.[key]) return defaultPlaceholders?.[key];
    return keyToStr(key);
  };

  const placeholders = await fetchPlaceholders(config, sheet).catch(async () => {
    const defaultPlaceholders = await getDefaultPlaceholders();
    return defaultPlaceholders;
  });

  if (placeholders?.[key]) return placeholders?.[key];

  if (config.locale.ietf !== defaultLocale) {
    const defaultPlaceholders = await getDefaultPlaceholders();
    return defaultPlaceholders;
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

export async function replaceText(text, config, regex = /{{(.*?)}}/g, sheet = 'default') {
  if (typeof text !== 'string' || !text.length) return '';

  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  const keys = Array.from(matches, (match) => match[1]);
  const placeholders = await replaceKeyArray(keys, config, sheet);
  // The .shift method is very slow, thus using normal iterator
  let i = 0;
  // eslint-disable-next-line no-plusplus
  const finalText = text.replaceAll(regex, () => placeholders[i++]);
  return finalText;
}
