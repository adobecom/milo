import {
  customFetch,
  getConfig
} from "./chunk-ZEVYWJU7.js";

// ../features/placeholders.js
var fetchedPlaceholders = {};
window.mph = {};
var getPlaceholdersPath = (config, sheet) => {
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const query = sheet !== "default" && typeof sheet === "string" && sheet.length ? `?sheet=${sheet}` : "";
  return `${path}${query}`;
};
var fetchPlaceholders = async ({ config, sheet, placeholderRequest, placeholderPath }) => {
  const path = placeholderPath || getPlaceholdersPath(config, sheet);
  fetchedPlaceholders[path] = fetchedPlaceholders[path] || new Promise(async (resolve) => {
    const resp = await placeholderRequest || await customFetch(
      { resource: path, withCacheRules: true }
    ).catch(() => ({}));
    const json = resp.ok ? await resp.json() : { data: [] };
    if (json.data.length === 0) {
      resolve({});
      return;
    }
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
  return key.replaceAll("-", " ");
}
async function getPlaceholder(key, config, sheet) {
  let defaultFetched = false;
  const defaultLocale = "en-US";
  const getDefaultContentRoot = () => {
    const defaultContentRoot = config.locale.contentRoot;
    const localePrefix = config.locale.prefix;
    if (!localePrefix.length) return defaultContentRoot;
    if (defaultContentRoot.endsWith(localePrefix)) {
      return defaultContentRoot.replace(localePrefix, "");
    }
    return defaultContentRoot.replace(`${localePrefix}/`, "/");
  };
  const getDefaultPlaceholders = async () => {
    const defaultConfig = {
      locale: {
        ietf: defaultLocale,
        contentRoot: getDefaultContentRoot()
      }
    };
    const defaultPlaceholders = await fetchPlaceholders({ config: defaultConfig, sheet }).catch(() => ({}));
    defaultFetched = true;
    return defaultPlaceholders;
  };
  if (config.placeholders?.[key]) return config.placeholders[key];
  const placeholders = await fetchPlaceholders({ config, sheet }).catch(async () => {
    const defaultPlaceholders = await getDefaultPlaceholders();
    return defaultPlaceholders;
  });
  if (typeof placeholders?.[key] === "string") return placeholders[key];
  if (!defaultFetched && config.locale.ietf !== defaultLocale) {
    const defaultPlaceholders = await getDefaultPlaceholders();
    if (defaultPlaceholders?.[key]) return defaultPlaceholders[key];
  }
  return keyToStr(key);
}
async function replaceKey(key, config, sheet = "default") {
  if (typeof key !== "string" || !key.length) return "";
  const label = await getPlaceholder(key, config, sheet);
  return label;
}
async function replaceKeyArray(keys, config, sheet = "default") {
  if (!Array.isArray(keys) || !keys.length) return [];
  const promiseArr = [];
  keys.forEach((key) => {
    promiseArr.push(getPlaceholder(key, config, sheet));
  });
  const placeholders = await Promise.all(promiseArr);
  return placeholders;
}
async function replaceText(text, config, regex = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g, sheet = "default") {
  if (typeof text !== "string" || !text.length) return "";
  const matches = [...text.matchAll(new RegExp(regex))];
  if (!matches.length) {
    return text;
  }
  const keys = Array.from(matches, (match) => match[1] || match[2]);
  const placeholders = await replaceKeyArray(keys, config, sheet);
  let i = 0;
  let finalText = text.replaceAll(regex, () => placeholders[i++]);
  finalText = finalText.replace(/&nbsp;/g, "\xA0");
  return finalText;
}
async function decoratePlaceholderArea({
  placeholderPath,
  placeholderRequest,
  nodes
}) {
  if (!nodes.length) return;
  const config = getConfig();
  await fetchPlaceholders({ placeholderPath, config, placeholderRequest });
  const replaceNodes = nodes.map(async (nodeEl) => {
    if (nodeEl.nodeType === Node.TEXT_NODE) {
      nodeEl.nodeValue = await replaceText(nodeEl.nodeValue, config);
    } else if (nodeEl.nodeType === Node.ELEMENT_NODE) {
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
}

export {
  replaceKey,
  replaceKeyArray,
  replaceText,
  decoratePlaceholderArea
};
//# sourceMappingURL=chunk-Z64B4EXQ.js.map
