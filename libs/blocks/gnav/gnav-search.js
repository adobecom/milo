import { createTag } from '../../utils/utils.js';

const SCOPE = 'adobecom';
const API_KEY = 'adobedotcom2';

const getHelpxLink = (searchStr, prefix = '', country = 'US') => `https://helpx.adobe.com${prefix}/globalsearch.html?q=${encodeURIComponent(searchStr)}&start_index=0&country=${country}`;
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

const getNoResultsEl = (value, prefix, country) => {
  const noResultsTxt = 'Try our advanced search';
  const a = createTag('a', {
    href: getHelpxLink(value, prefix, country),
    'aria-label': noResultsTxt,
  }, noResultsTxt);
  return createTag('li', {}, a);
};

const wrapValueInSpan = (value, suggestion, linkEl) => {
  const textArr = suggestion.split(value);
  return textArr.reduce((el, text, idx, arr) => {
    el.insertAdjacentText('beforeend', text);
    if (idx < arr.length - 1) {
      el.append(createTag('span', {}, value));
    }
    return el;
  }, linkEl);
};

const updateSearchResults = (value, suggestions, locale, resultsEl, searchInputEl) => {
  if (!value.length) {
    resultsEl.replaceChildren();
    searchInputEl.classList.remove('gnav-search-input--isPopulated');
    return;
  }

  resultsEl.classList.remove('no-results');
  searchInputEl.classList.add('gnav-search-input--isPopulated');

  if (!suggestions.length) {
    const noResults = getNoResultsEl(value, locale.prefix, locale.geo);
    resultsEl.replaceChildren(noResults);
    resultsEl.classList.add('no-results');
    return;
  }

  const df = document.createDocumentFragment();
  suggestions.forEach((suggestion) => {
    const a = createTag('a', {
      href: getHelpxLink(suggestion, locale.prefix, locale.geo),
      'aria-label': suggestion,
    });
    const linkEl = wrapValueInSpan(value, suggestion, a);
    const li = createTag('li', {}, linkEl);
    df.appendChild(li);
  });
  resultsEl.replaceChildren(df);
};

const getSuggestions = (json) => {
  if (!json?.suggested_completions) return [];
  return json.suggested_completions.map((suggestion) => suggestion?.name);
};

const onSearchInput = async ({ value, resultsEl, locale, searchInputEl }) => {
  const results = await fetchResults(value, locale?.ietf?.replace('-', '_'));
  const suggestions = getSuggestions(results);
  updateSearchResults(value, suggestions, locale, resultsEl, searchInputEl);
};

export {
  onSearchInput,
  getHelpxLink,
};
