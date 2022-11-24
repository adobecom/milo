import { html, useState } from '../../deps/htm-preact.js';
import css from './gnav-search.css' assert {type: 'css'}
document.adoptedStyleSheets = [css]

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


const getLocale = () =>
  document.documentElement.getAttribute('lang') || 'en-US';
const getCountry = () => getLocale()?.split('-').pop() || 'US';

const searchInput = async (value, resultsEl, locale) => {
  const results = await fetchResults(value, locale);
  const suggestions = getSuggestions(results);
  return suggestions
};

const onSearchInput = debounce(searchInput)

const SearchUI = ({SearchIcon, label}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const locale = getLocale();

  const handleInput = async (e) => {
    const res = await onSearchInput(e.target.value, 'searchResultsUl', locale);
    setSearchInput(e.target.value);
    setSearchResults(res);
  };

  const handleEnter = (e) => {
    window.open(getHelpxLink(e.target.value, getCountry()));
  };

  // TODO change: advanced search vanishes if nothing was typed
  // same as the live gnav
  const noResults =
    searchInput &&
    !searchResults.length &&
    html`
      <li>
        <a
          href=${getHelpxLink(searchInput)}
          aria-label="Try our advanced search"
        >
          Try our advanced search
        </a>
      </li>
    `;

  return html`
    <aside id="gnav-search-bar" class="gnav-search-bar">
      <div class="gnav-search-field">
        <${SearchIcon} />
        <input
          value=${searchInput}
          onInput=${handleInput}
          onKeyDown=${(e) => e.code === 'Enter' && handleEnter(e)}
          class="gnav-search-input"
          placeholder=${label}
          daa-ll="search-results:standard search"
        />
      </div>
      <div class="gnav-search-results">
        <ul>
          ${searchResults.map(
            (item) => html`
              <li>
                <a href=${getHelpxLink(item)}>${item}</a>
              </li>
            `
          )}
          ${noResults}
        </ul>
      </div>
    </aside>
  `
}
export {
  SearchUI
};
