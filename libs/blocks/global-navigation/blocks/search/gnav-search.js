import {
  toFragment,
  debounceCallback,
  getLocale,
  getCountry,
} from '../../utilities.js';

const CONFIG = {
  suggestions: {
    scope: 'adobecom',
    apiKey: 'adobedotcom2',
  },
  selectors: {
    hasResults: 'has-results',
    inputIsPopulated: 'feds-search-input--isPopulated',
  },
};

class Search {
  constructor(config) {
    this.label = config.label;
    this.icon = config.icon;
    this.trigger = config.trigger;
    // TODO: could this elem be passed through config?
    this.parent = this.trigger.closest('.mainnav-wrapper');

    this.init();
  }

  init() {
    this.decorate();
    this.addEventListeners();
  }

  decorate() {
    this.input = toFragment`<input placeholder="${this.label}" aria-label="${this.label}" class="feds-search-input" autocomplete="off" aria-autocomplete="list" aria-controls="feds-search-results" daa-ll="search-results:standard search" />`;
    this.resultsList = toFragment`<ul class="feds-search-results" id="feds-search-results" role="region" daa-ll="search-results:suggested-search:click"></ul>`;
    this.clearButton = toFragment`<button tabindex="0" class="feds-search-clear" aria-label="Clear results"></button>`;
    this.searchBar = toFragment`
      <aside class="feds-search-bar">
        <div class="feds-search-field">
          ${this.input}
          <div class="feds-search-icons">
            ${this.icon}
            ${this.clearButton}
          </div>
        </div>
        ${this.resultsList}
      </aside>`;

    this.trigger.after(this.searchBar);
    // TODO: better logic for focusing input on first open
    this.input.focus();
  }

  addEventListeners() {
    this.input.addEventListener('input', (e) => {
      this.onSearchInput();
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        // Pressing ESC when input has value resets the results
        if (this.input.value.length) {
          this.input.value = '';
          this.onSearchInput();
        } else {
          // TODO: hide search form and focus search trigger;
          // need the general Menu class to achieve this
        }
      }
    });

    // If a search result is focused, return focus to input when ESC is pressed
    this.resultsList.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        this.input.focus();
      }
    });

    // Clicking the clear button resets the results
    this.clearButton.addEventListener('click', () => {
      this.input.value = '';
      this.input.focus();
      this.onSearchInput();
    });

    // TODO: close results on device orientation change?
    // TODO: search menu should close on scroll, but this should happen from the general Menu logic
  }

  getSuggestions(query = this.query) {
    // TODO: do we need a lower environment URL too?
    // i.e.: adobesearch-stage.adobe.io
    const api = `https://adobesearch.adobe.io/autocomplete/completions?q[locale]=${getLocale()}&scope=${CONFIG.suggestions.scope}&q[text]=${encodeURIComponent(query)}`;

    return window.fetch(api, {
        headers: {
            'x-api-key': CONFIG.suggestions.apiKey,
        },
    })
      .then(data => data.json())
      .catch(() => {
          // do nothing
      });
  }

  onSearchInput = debounceCallback(() => {
    const query = this.getQuery();

    if (!query.length) {
      this.resultsList.replaceChildren();
      delete this.query;
      return;
    }

    // Avoid successive calls for the same input value
    if (query === this.query) {
      return;
    }

    this.query = query;

    this.getSuggestions()
      .then((data) => {
        const suggestions = data?.suggested_completions;

        if (!Array.isArray(suggestions)
          || !suggestions.length) {
          this.resultsList.replaceChildren(this.getNoResultsTemplate());
          this.parent instanceof HTMLElement && this.parent.classList.remove(CONFIG.selectors.hasResults);
          return;
        }

        this.resultsList.replaceChildren(this.getResultsTemplate(suggestions));
        this.parent instanceof HTMLElement && this.parent.classList.add(CONFIG.selectors.hasResults);
      })
      .catch(() => {
        this.resultsList.replaceChildren(this.getNoResultsTemplate());
        this.parent instanceof HTMLElement && this.parent.classList.remove(CONFIG.selectors.hasResults);
      });
  });

  getQuery() {
    const query = this.input.value.trim();

    if (!query.length) {
      this.input.classList.remove(CONFIG.selectors.inputIsPopulated);
      this.resultsList.replaceChildren();
      this.parent instanceof HTMLElement && this.parent.classList.remove(CONFIG.selectors.hasResults);
      return '';
    }

    this.input.classList.add(CONFIG.selectors.inputIsPopulated);

    return query;
  }

  getResultsTemplate(results) {
    const resultsTemplate = document.createDocumentFragment();
  
    results.map((result) => {
      const resultLabel = result.name;
  
      if (!resultLabel.length) {
        return;
      }
  
      // A longest common substring match between the original prefix and suggestion must be made
      // for cases when special characters are used. Say the user searches for 'pho-',
      // then the prefix will be 'pho-', while the suggestion will be 'photoshop'.
      // The generated suggestion markup should look like `<b>pho</b>toshop`,
      // so we need to extract the part of the prefix that matches the current suggestion
      const matchPrefixToSuggestion = () => {
        let i = 0;
        const prefixLength = this.query.length;
  
        while (i < prefixLength && this.query[i].toLowerCase() === resultLabel[i].toLowerCase()) {
          i += 1;
        }
  
        return this.query.substring(0, i).trim();
      };
  
      // The matched prefix can't be cached to be used for all of the suggestions in the set
      // because there are edge cases when there are significant differences between suggestions.
      // For example, the query 'max 20' will yield the suggestions 'max 2016' and 'maximize',
      // thus the common part between the query and the suggestion differs:
      // * 'max 20' for the first suggestion
      // * 'max' for the second suggestion
      const matchedPrefix = matchPrefixToSuggestion();
  
      // Say the user searched for 'PhOtOsHoP' and the suggested result is 'Photoshop Trial';
      // We don't want the suggestion to be rendered as '<b>PhOtOsHoP</b> Trial',
      // rather '<b>Photoshop</b> Trial', like the original suggestion formatting.
      // First, define a capturing group Regexp;
      // in the example above this will be '/(PhOtOsHoP)/i'
      const prefixPattern = new RegExp(`(${matchedPrefix})`, 'i');
      let suggestionPrefix;
      // Remove the query from the suggestion and
      // save the matched prefix in its original formatting from the API
      const suggestionWithoutPrefix = resultLabel.replace(prefixPattern, (match) => {
        // Save the matched string (with the formatting suggested by the API) into a variable
        suggestionPrefix = match;
        // Remove the matched string
        return '';
      });
  
      const resultTemplate = toFragment`<li>
          <a href="${this.getHelpxLink(resultLabel)}" class="feds-search-result" aria-label="${resultLabel}">
            <span>${suggestionPrefix}</span>${suggestionWithoutPrefix}
          </a>
        </li>`;
  
      resultsTemplate.appendChild(resultTemplate);
    });
  
    return resultsTemplate;
  }

  getNoResultsTemplate(query = this.query) {
    // TODO: replace static label with authored one;
    // we need to work on a centralized labels POC
    const label = 'Try our advanced search';

    // TODO: should we style this element different than regular results?
    return toFragment`<li>
      <a href="${this.getHelpxLink(query)}" class="feds-search-result"><span>${label}</span></a>
    </li>`;
  }

  getHelpxLink(query) {
    return `https://helpx.adobe.com/globalsearch.html?q=${encodeURIComponent(query.trim())}&start_index=0&country=${getCountry()}`;
  }
}

export default { Search };
