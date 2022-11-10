const PLACEHOLDERS = (function get() {
  const placeholdersMap = {};
  let isFetching = false;

  async function fetchPlaceholders(config) {
    isFetching = true;
    const path = `${config.locale.contentRoot}/placeholders.json`;
    return fetch(path).then(async (response) => {
      isFetching = false;
      const json = response.ok ? await response.json() : { data: [] };
      json.data.forEach((item) => {
        placeholdersMap[item.key] = item.value;
      });
      Promise.resolve(placeholdersMap);
    });
  }

  async function getPlaceholders(config) {
    if (Object.keys(placeholdersMap).length === 0 && !isFetching) {
      await fetchPlaceholders(config);
    }

    return Promise.resolve(placeholdersMap);
  }

  function findPlaceholder(placeholders, key) {
    return placeholders[key] || key.replaceAll('-', ' ');
  }

  async function regExReplace(config, regex, html) {
    const placeholders = await getPlaceholders(config);
    return html.replaceAll(regex, (_, key) => findPlaceholder(placeholders, key));
  }

  async function keyReplace(key, config) {
    const placeholders = await getPlaceholders(config);
    return findPlaceholder(placeholders, key);
  }

  return { findPlaceholder, regExReplace, keyReplace };
}());

export default PLACEHOLDERS;
