import { getConfig, getMetadata, createTag } from '../../utils/utils.js';

const SCOPE = 'adobecom';
const API_KEY = 'adobedotcom2';



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

const getNoResultsEl = (value) => {
  const noResultsTxt = 'Try our advanced search';
  const a = createTag('a', {
    href: getHelpxLink(value),
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

const updateSearchResults = (value, suggestions, resultsEl, searchInputEl) => {
  // If no value is provided, search results dropdown should not be populated
  if (!value.length) {
    resultsEl.replaceChildren();
    searchInputEl.classList.remove('gnav-search-input--isPopulated');
    return;
  }

  // Add a modifier class if the input is populated
  searchInputEl.classList.add('gnav-search-input--isPopulated');

  // If there are no suggestions, the advanced search option should be shown
  if (!suggestions.length) {
    const noResults = getNoResultsEl(value);
    resultsEl.replaceChildren(noResults);
    return;
  }

  // Show suggestions in the dropdown if they exist
  const df = document.createDocumentFragment();
  suggestions.forEach((suggestion) => {
    const a = createTag('a', {
      href: getHelpxLink(suggestion),
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

const onSearchInput = async (value, resultsEl, locale, searchInputEl) => {
  const results = await fetchResults(value, locale);
  const suggestions = getSuggestions(results);
  updateSearchResults(value, suggestions, resultsEl, searchInputEl);
};

export {
  onSearchInput,
  getHelpxLink,
};
