const placeholders = {};
let fetched = false;

const fetchPlaceholders = (config) => new Promise(async (resolve) => {
  if (fetched) { resolve(placeholders); return; }
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const resp = await fetch(path);
  const json = resp.ok ? await resp.json() : { data: [] };
  json.data.forEach(item => {
    placeholders[item.key] = item.value;
  });
  fetched = true;
  resolve(placeholders);
});

function findPlaceholder(placeholders, key) {
  return placeholders[key] || key.replaceAll('-', ' ');
}

export async function replaceText(config, regex, text) {
  const placeholders = await fetchPlaceholders(config);
  return text.replaceAll(regex, (_, key) => {
    return findPlaceholder(placeholders, key);
  });
}

export async function replaceKey(key, config) {
  const placeholders = await fetchPlaceholders(config);
  return findPlaceholder(placeholders, key);
}
