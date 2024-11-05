import {
  closeAllDropdowns,
  getFedsPlaceholderConfig,
  isDesktop,
  logErrorFor,
  setCurtainState,
  toFragment,
  trigger
} from "./chunk-SEUC37NT.js";
import {
  debounce
} from "./chunk-B2JWVRT6.js";
import {
  replaceKeyArray
} from "./chunk-JSQDM4GY.js";
import "./chunk-JW7KOVAP.js";
import "./chunk-R5PLKX3Z.js";
import {
  getConfig
} from "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/global-navigation/features/search/gnav-search.js
var CONFIG = {
  suggestions: {
    scope: "adobecom",
    apiKey: "adobedotcom2"
  },
  selectors: {
    hasResults: "has-results",
    inputIsPopulated: "feds-search-input--isPopulated"
  }
};
var { locale } = getConfig();
var [, country = "US"] = locale.ietf.split("-");
var Search = class _Search {
  constructor(config) {
    this.icon = config.icon;
    this.trigger = config.trigger;
    this.parent = this.trigger.closest(".feds-nav-wrapper");
    const observer = new MutationObserver(() => {
      this.clearSearchForm();
    });
    observer.observe(this.trigger, { attributeFilter: ["aria-expanded"] });
    logErrorFor(this.init.bind(this), "Search init has failed", "errorType=error,module=gnav-search");
  }
  async init() {
    await this.getLabels();
    this.decorate();
    this.addEventListeners();
    this.toggleDropdown();
  }
  async getLabels() {
    this.labels = {};
    [this.labels.search, this.labels.clearResults, this.labels.tryAdvancedSearch] = await replaceKeyArray(["search", "clear-results", "try-advanced-search"], getFedsPlaceholderConfig());
  }
  decorate() {
    this.input = toFragment`<input placeholder="${this.labels.search}" aria-label="${this.labels.search}" class="feds-search-input" autocomplete="off" aria-autocomplete="list" aria-controls="feds-search-results" daa-ll="search-results:standard search" />`;
    this.resultsList = toFragment`<ul class="feds-search-results" id="feds-search-results" role="region" daa-ll="search-results:suggested-search:click"></ul>`;
    this.clearButton = toFragment`<button tabindex="0" class="feds-search-clear" aria-label="${this.labels.clearResults}"></button>`;
    this.searchBar = toFragment`
      <aside class="feds-search-dropdown">
        <div class="feds-search-bar">
          <div class="feds-search-field">
            ${this.input}
            <div class="feds-search-icons">
              ${this.icon}
              ${this.clearButton}
            </div>
          </div>
          ${this.resultsList}
        </div>
      </aside>`;
    this.trigger.after(this.searchBar);
  }
  clearSearchForm() {
    this.input.value = "";
    this.onSearchInput();
  }
  addEventListeners() {
    this.trigger.addEventListener("click", () => {
      this.toggleDropdown();
    });
    this.input.addEventListener("input", () => {
      this.onSearchInput();
    });
    this.input.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        if (this.input.value.length) {
          this.clearSearchForm();
        } else if (isDesktop.matches) {
          closeAllDropdowns();
          this.trigger.focus();
        }
      }
      if (e.code === "Enter") {
        if (!this.query) return;
        window.location.href = _Search.getHelpxLink(this.query);
      }
    });
    this.resultsList.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        this.input.focus();
      }
    });
    this.clearButton.addEventListener("click", () => {
      this.clearSearchForm();
      this.input.focus();
    });
    isDesktop.addEventListener("change", () => {
      closeAllDropdowns();
    });
  }
  getSuggestions(query = this.query) {
    const { env } = getConfig();
    const subdomain = env === "prod" ? "adobesearch" : "adobesearch-stage";
    const api = `https://${subdomain}.adobe.io/autocomplete/completions?q[locale]=${locale.ietf}&scope=${CONFIG.suggestions.scope}&q[text]=${encodeURIComponent(query)}`;
    return fetch(api, { headers: { "x-api-key": CONFIG.suggestions.apiKey } }).then((data) => data.json()).catch(() => {
    });
  }
  onSearchInput = debounce(() => {
    const query = this.getQuery();
    if (!query.length) {
      this.resultsList.replaceChildren();
      delete this.query;
      return;
    }
    if (query === this.query) {
      return;
    }
    this.query = query;
    this.getSuggestions().then((data) => {
      const suggestions = data?.suggested_completions;
      if (!Array.isArray(suggestions) || !suggestions.length) {
        this.resultsList.replaceChildren(this.getNoResultsTemplate());
        if (this.parent instanceof HTMLElement) {
          this.parent.classList.remove(CONFIG.selectors.hasResults);
        }
        return;
      }
      this.resultsList.replaceChildren(this.getResultsTemplate(suggestions));
      if (this.parent instanceof HTMLElement) {
        this.parent.classList.add(CONFIG.selectors.hasResults);
      }
    }).catch(() => {
      this.resultsList.replaceChildren(this.getNoResultsTemplate());
      if (this.parent instanceof HTMLElement) {
        this.parent.classList.remove(CONFIG.selectors.hasResults);
      }
    });
  }, 150);
  getQuery() {
    const query = this.input.value.trim();
    if (!query.length) {
      this.input.classList.remove(CONFIG.selectors.inputIsPopulated);
      this.resultsList.replaceChildren();
      if (this.parent instanceof HTMLElement) {
        this.parent.classList.remove(CONFIG.selectors.hasResults);
      }
      return "";
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
      const matchPrefixToSuggestion = () => {
        let i = 0;
        const prefixLength = this.query.length;
        while (i < prefixLength && this.query[i].toLowerCase() === resultLabel[i].toLowerCase()) {
          i += 1;
        }
        return this.query.substring(0, i).trim();
      };
      const matchedPrefix = matchPrefixToSuggestion();
      const prefixPattern = new RegExp(`(${matchedPrefix})`, "i");
      let suggestionPrefix;
      const suggestionWithoutPrefix = resultLabel.replace(prefixPattern, (match) => {
        suggestionPrefix = match;
        return "";
      });
      const resultTemplate = toFragment`<li>
          <a href="${_Search.getHelpxLink(resultLabel)}" class="feds-search-result" aria-label="${resultLabel}">
            <span>${suggestionPrefix}</span>${suggestionWithoutPrefix}
          </a>
        </li>`;
      resultsTemplate.appendChild(resultTemplate);
    });
    return resultsTemplate;
  }
  getNoResultsTemplate(query = this.query) {
    return toFragment`<li>
      <a href="${_Search.getHelpxLink(query)}" class="feds-search-result"><span>${this.labels.tryAdvancedSearch}</span></a>
    </li>`;
  }
  focusInput() {
    if (isDesktop.matches) {
      this.input.focus();
    }
  }
  toggleDropdown() {
    if (!isDesktop.matches) return;
    const hasBeenOpened = trigger({ element: this.trigger });
    if (hasBeenOpened) {
      setCurtainState(true);
      this.focusInput();
    } else {
      this.clearSearchForm();
    }
  }
  static getHelpxLink(query) {
    return `https://helpx.adobe.com${locale.prefix}/globalsearch.html?q=${encodeURIComponent((query || "").trim())}&start_index=0&country=${country}`;
  }
};
var gnav_search_default = Search;
export {
  gnav_search_default as default
};
//# sourceMappingURL=gnav-search-RC54QTIH.js.map
