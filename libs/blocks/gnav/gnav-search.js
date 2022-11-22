const SCOPE = 'adobecom';
const API_KEY = 'adobedotcom2';
const SEARCH_DEBOUNCE_MS = 300;


const getHelpxLink = (searchStr, country = 'US') => `https://helpx.adobe.com/globalsearch.html?q=${encodeURIComponent(searchStr)}&start_index=0&country=${country}`;
const getSearchLink = (searchStr, locale = 'en_US') => `https://adobesearch.adobe.io/autocomplete/completions?q[locale]=${locale}&scope=${SCOPE}&q[text]=${encodeURIComponent(searchStr)}`;

const fetchResults = async (searchStr, locale = 'en_US') => {
  const res = await fetch(getSearchLink(searchStr, locale), {
    method: 'GET',
    headers: { 'x-api-key': API_KEY },
  });
  if (res.ok) {
    const results = await res.json();
    return results;
  }
  return null;
};

const getSuggestions = (json) => {
  if (!json?.suggested_completions) return [];
  return json.suggested_completions.map((suggestion) => suggestion?.name);
};

const debounce = (f, interval = SEARCH_DEBOUNCE_MS) => {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(
        () => resolve(f(...args)),
        interval,
      );
    });
  };
}

const searchInput = async (value, resultsEl, locale) => {
  const results = await fetchResults(value, locale);
  const suggestions = getSuggestions(results);
  return suggestions
};

const onSearchInput = debounce(searchInput)

export {
  onSearchInput,
  getHelpxLink,
};
