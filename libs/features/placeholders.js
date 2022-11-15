const placeholders = {};
let fetched = false;

// eslint-disable-next-line no-async-promise-executor
const fetchPlaceholders = (config) => new Promise(async (resolve) => {
  if (fetched) { resolve(placeholders); return; }
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const resp = await fetch(path);
  const json = resp.ok ? await resp.json() : { data: [] };
  if (json.data.length === 0) { resolve(placeholders); return; }
  json.data.forEach((item) => {
    placeholders[item.key] = item.value;
  });
  fetched = true;
  resolve(placeholders);
});

function findPlaceholder(suppliedPlaceholders, key) {
  return suppliedPlaceholders[key] || key.replaceAll('-', ' ');
}

export async function replaceText(config, regex, text) {
  const fetchedPlaceholders = await fetchPlaceholders(config);
  return text.replaceAll(regex, (_, key) => findPlaceholder(fetchedPlaceholders, key));
}

export async function replaceKey(key, config) {
  const fetchedPlaceholders = await fetchPlaceholders(config);
  return findPlaceholder(fetchedPlaceholders, key);
}
