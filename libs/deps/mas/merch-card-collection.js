// src/merch-card-collection.js
import { html, LitElement } from "../lit-all.min.js";

// ../node_modules/@spectrum-web-components/reactive-controllers/src/MatchMedia.js
var MatchMediaController = class {
  constructor(e, t) {
    this.key = Symbol("match-media-key");
    this.matches = false;
    this.host = e, this.host.addController(this), this.media = window.matchMedia(t), this.matches = this.media.matches, this.onChange = this.onChange.bind(this), e.addController(this);
  }
  hostConnected() {
    var e;
    (e = this.media) == null || e.addEventListener("change", this.onChange);
  }
  hostDisconnected() {
    var e;
    (e = this.media) == null || e.removeEventListener("change", this.onChange);
  }
  onChange(e) {
    this.matches !== e.matches && (this.matches = e.matches, this.host.requestUpdate(this.key, !this.matches));
  }
};

// src/deeplink.js
var EVENT_HASHCHANGE = "hashchange";
function parseState(hash = window.location.hash) {
  const result = [];
  const keyValuePairs = hash.replace(/^#/, "").split("&");
  for (const pair of keyValuePairs) {
    const [key, value = ""] = pair.split("=");
    if (key) {
      result.push([key, decodeURIComponent(value.replace(/\+/g, " "))]);
    }
  }
  return Object.fromEntries(result);
}
function pushState(state) {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  Object.entries(state).forEach(([key, value2]) => {
    if (value2) {
      hash.set(key, value2);
    } else {
      hash.delete(key);
    }
  });
  hash.sort();
  const value = hash.toString();
  if (value === window.location.hash)
    return;
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
  window.location.hash = value;
  window.scrollTo(0, lastScrollTop);
}
function deeplink(callback) {
  const handler = () => {
    if (window.location.hash && !window.location.hash.includes("="))
      return;
    const state = parseState(window.location.hash);
    callback(state);
  };
  handler();
  window.addEventListener(EVENT_HASHCHANGE, handler);
  return () => {
    window.removeEventListener(EVENT_HASHCHANGE, handler);
  };
}

// src/constants.js
var EVENT_MERCH_CARD_COLLECTION_SORT = "merch-card-collection:sort";
var EVENT_MERCH_CARD_COLLECTION_SHOWMORE = "merch-card-collection:showmore";

// src/literals.js
var updateLiterals = (el, values = {}) => {
  el.querySelectorAll("span[data-placeholder]").forEach((el2) => {
    const { placeholder } = el2.dataset;
    el2.innerText = values[placeholder] ?? "";
  });
};

// src/media.js
var TABLET_DOWN = "(max-width: 1199px)";
var TABLET_UP = "(min-width: 768px)";
var DESKTOP_UP = "(min-width: 1200px)";

// src/merch-card-collection.css.js
import { css, unsafeCSS } from "../lit-all.min.js";
var styles = css`
    #header,
    #resultText,
    #footer {
        grid-column: 1 / -1;
        justify-self: stretch;
        color: var(--merch-color-grey-80);
    }

    sp-theme {
        display: contents;
    }

    sp-action-menu {
      z-index: 1;
    }

    #header {
        order: -2;
        display: grid;
        justify-items: top;
        grid-template-columns: auto max-content;
        grid-template-rows: auto;
        row-gap: var(--consonant-merch-spacing-m);
        align-self: baseline;
    }

    #resultText {
        min-height: 32px;
    }

    merch-search {
        display: contents;
    }

    #searchBar {
        grid-column: 1 / -1;
        width: 100%;
        max-width: 302px;
    }

    #filtersButton {
        width: 92px;
        margin-inline-end: var(--consonant-merch-spacing-xxs);
    }

    #sortButton {
        justify-self: end;
    }

    sp-action-button {
        align-self: baseline;
    }

    sp-menu sp-action-button {
        min-width: 140px;
    }

    sp-menu {
        min-width: 180px;
    }

    #footer {
        order: 1000;
    }

    /* tablets */
    @media screen and ${unsafeCSS(TABLET_UP)} {
        #header {
            grid-template-columns: 1fr fit-content(100%) fit-content(100%);
        }

        #searchBar {
            grid-column: span 1;
        }

        #filtersButton {
            grid-column: span 1;
        }

        #sortButton {
            grid-column: span 1;
        }
    }

    /* Laptop */
    @media screen and ${unsafeCSS(DESKTOP_UP)} {
        #resultText {
            grid-column: span 2;
            order: -3;
        }

        #header {
            grid-column: 3 / -1;
            display: flex;
            justify-content: end;
        }
    }
`;

// src/utils.js
var getSlotText = (element, name) => element.querySelector(`[slot="${name}"]`).textContent.trim();

// src/merch-card-collection.js
var MERCH_CARD_COLLECTION = "merch-card-collection";
var SORT_ORDER = {
  alphabetical: "alphabetical",
  authored: "authored"
};
var RESULT_TEXT_SLOT_NAMES = {
  // no search
  filters: ["noResultText", "resultText", "resultsText"],
  // search on mobile
  mobile: [
    "noSearchResultsMobileText",
    "searchResultMobileText",
    "searchResultsMobileText"
  ],
  // search on desktop
  desktop: ["noSearchResultsText", "searchResultText", "searchResultsText"]
};
var categoryFilter = (elements, { filter }) => elements.filter((element) => element.filters.hasOwnProperty(filter));
var typeFilter = (elements, { types }) => {
  if (!types)
    return elements;
  types = types.split(",");
  return elements.filter(
    (element) => types.some((type) => element.types.includes(type))
  );
};
var alphabeticalSorter = (elements) => elements.sort(
  (a, b) => (a.title ?? "").localeCompare(b.title ?? "", "en", {
    sensitivity: "base"
  })
);
var authoredSorter = (elements, { filter }) => elements.sort((a, b) => {
  if (b.filters[filter]?.order == void 0 || isNaN(b.filters[filter]?.order))
    return -1;
  if (a.filters[filter]?.order == void 0 || isNaN(a.filters[filter]?.order))
    return 1;
  return a.filters[filter].order - b.filters[filter].order;
});
var searcher = (elements, { search }) => {
  if (search?.length) {
    search = search.toLowerCase();
    return elements.filter((element) => {
      const haystack = (element.title ?? "").toLowerCase();
      return haystack.includes(search);
    });
  }
  return elements;
};
var MerchCardCollection = class extends LitElement {
  static properties = {
    filter: { type: String, attribute: "filter", reflect: true },
    filtered: { type: String, attribute: "filtered" },
    // freeze filter
    search: { type: String, attribute: "search", reflect: true },
    sort: {
      type: String,
      attribute: "sort",
      default: SORT_ORDER.authored,
      reflect: true
    },
    types: { type: String, attribute: "types", reflect: true },
    limit: { type: Number, attribute: "limit" },
    page: { type: Number, attribute: "page", reflect: true },
    singleApp: { type: String, attribute: "single-app", reflect: true },
    hasMore: { type: Boolean },
    displayResult: { type: Boolean, attribute: "display-result" },
    resultCount: {
      type: Number
    },
    sidenav: { type: Object }
  };
  mobileAndTablet = new MatchMediaController(this, TABLET_DOWN);
  constructor() {
    super();
    this.filter = "all";
    this.hasMore = false;
    this.resultCount = void 0;
    this.displayResult = false;
  }
  render() {
    return html`${this.header}
            <slot></slot>
            ${this.footer}`;
  }
  updated(changedProperties) {
    if (!this.querySelector("merch-card"))
      return;
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    const children = [...this.children].filter(
      (child) => child.tagName === "MERCH-CARD"
    );
    if (children.length === 0)
      return;
    if (changedProperties.has("singleApp") && this.singleApp) {
      children.forEach((card) => {
        card.updateFilters(card.name === this.singleApp);
      });
    }
    const sorter = this.sort === SORT_ORDER.alphabetical ? alphabeticalSorter : authoredSorter;
    const reducers = [categoryFilter, typeFilter, searcher, sorter];
    let result = reducers.reduce((elements, reducer) => reducer(elements, this), children).map((element, index) => [element, index]);
    this.resultCount = result.length;
    if (this.page && this.limit) {
      const pageSize = this.page * this.limit;
      this.hasMore = result.length > pageSize;
      result = result.filter(([, index]) => index < pageSize);
    }
    let reduced = new Map(result);
    children.forEach((child) => {
      if (reduced.has(child)) {
        const index = reduced.get(child);
        child.style.order = index;
        child.setAttribute("tabindex", index + 1);
        child.size = child.filters[this.filter]?.size;
        child.style.removeProperty("display");
        child.requestUpdate();
      } else {
        child.style.display = "none";
        child.size = void 0;
        child.style.removeProperty("order");
      }
    });
    window.scrollTo(0, lastScrollTop);
    this.updateComplete.then(() => {
      const resultTextElement = this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];
      if (!resultTextElement)
        return;
      updateLiterals(resultTextElement, {
        resultCount: this.resultCount,
        searchTerm: this.search,
        filter: this.sidenav?.filters.selectedText
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.filtered) {
      this.filter = this.filtered;
      this.page = 1;
    } else {
      this.startDeeplink();
    }
    this.sidenav = document.querySelector("merch-sidenav");
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopDeeplink?.();
  }
  get header() {
    if (this.filtered)
      return;
    return html`<div id="header">
                <sp-theme theme="spectrum" color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText">
                ${this.displayResult ? html`<slot name="${this.resultTextSlotName}"></slot>` : ""}
            </div>`;
  }
  get footer() {
    if (this.filtered)
      return;
    return html`<div id="footer">
            <sp-theme theme="spectrum" color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`;
  }
  get resultTextSlotName() {
    const slotName = RESULT_TEXT_SLOT_NAMES[this.search ? this.mobileAndTablet.matches ? "mobile" : "desktop" : "filters"][Math.min(this.resultCount, 2)];
    return slotName;
  }
  get showMoreButton() {
    if (!this.hasMore)
      return;
    return html`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`;
  }
  get filtersButton() {
    return this.mobileAndTablet.matches ? html`<sp-action-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-action-button>` : "";
  }
  get searchBar() {
    const searchPlaceholder = getSlotText(this, "searchText");
    return this.mobileAndTablet.matches ? html`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${searchPlaceholder}"
                  ></sp-search>
              </merch-search>` : "";
  }
  get sortButton() {
    const sortText = getSlotText(this, "sortText");
    const popularityText = getSlotText(this, "popularityText");
    const alphabeticallyText = getSlotText(this, "alphabeticallyText");
    if (!(sortText && popularityText && alphabeticallyText))
      return;
    const alphabetical = this.sort === SORT_ORDER.alphabetical;
    return html`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
                selects="single"
                value="${alphabetical ? SORT_ORDER.alphabetical : SORT_ORDER.authored}"
            >
                <span slot="label-only"
                    >${sortText}:
                    ${alphabetical ? alphabeticallyText : popularityText}</span
                >
                <sp-menu-item value="${SORT_ORDER.authored}"
                    >${popularityText}</sp-menu-item
                >
                <sp-menu-item value="${SORT_ORDER.alphabetical}"
                    >${alphabeticallyText}</sp-menu-item
                >
            </sp-action-menu>
        `;
  }
  sortChanged(event) {
    if (event.target.value === SORT_ORDER.authored) {
      pushState({ sort: void 0 });
    } else {
      pushState({ sort: event.target.value });
    }
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_CARD_COLLECTION_SORT, {
        bubbles: true,
        composed: true,
        detail: {
          value: event.target.value
        }
      })
    );
  }
  async showMore() {
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_CARD_COLLECTION_SHOWMORE, {
        bubbles: true,
        composed: true
      })
    );
    const page = this.page + 1;
    pushState({ page });
    this.page = page;
    await this.updateComplete;
  }
  startDeeplink() {
    this.stopDeeplink = deeplink(
      ({ category, filter, types, sort, search, single_app, page }) => {
        filter = filter || category;
        if (!this.filtered && filter && filter !== this.filter) {
          setTimeout(() => {
            pushState({ page: void 0 });
            this.page = 1;
          }, 1);
        }
        if (!this.filtered) {
          this.filter = filter ?? this.filter;
        }
        this.types = types ?? "";
        this.search = search ?? "";
        this.singleApp = single_app;
        this.sort = sort;
        this.page = Number(page) || 1;
      }
    );
  }
  openFilters(e) {
    this.sidenav?.showModal(e);
  }
  static styles = [styles];
};
MerchCardCollection.SortOrder = SORT_ORDER;
customElements.define(MERCH_CARD_COLLECTION, MerchCardCollection);
export {
  MerchCardCollection
};
