import { html, LitElement, css, unsafeCSS, nothing } from 'lit';
import { DESKTOP_UP, TABLET_UP } from './media.js';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';
import { deeplink, pushState } from './deeplink.js';
import {
    EVENT_MAS_ERROR,
    EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED,
    EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED,
    EVENT_MERCH_SIDENAV_SELECT,
    EVENT_MERCH_CARD_COLLECTION_SORT,
    EVENT_MERCH_CARD_COLLECTION_SHOWMORE,
    EVENT_AEM_ERROR,
    EVENT_AEM_LOAD,
    SORT_ORDER
} from './constants.js';
import { getService, getSlotText } from './utils.js';
import { getFragmentMapping } from './variants/variants.js';
import { normalizeVariant } from './hydrate.js';
import './mas-commerce-service';

const MERCH_CARD_COLLECTION = 'merch-card-collection';
const MERCH_CARD_COLLECTION_LOAD_TIMEOUT = 20000;

const VARIANT_CLASSES = {
    catalog: ['four-merch-cards'],
    plans: ['four-merch-cards'],
    plansThreeColumns: ['three-merch-cards'],
}

const SIDENAV_AUTOCLOSE = {
    plans: true
}

const categoryFilter = (elements, { filter }) =>
    elements.filter((element) => element?.filters && element?.filters.hasOwnProperty(filter));

const typeFilter = (elements, { types }) => {
    if (!types) return elements;
    types = types.split(',');
    return elements.filter((element) =>
        types.some((type) => element.types.includes(type)),
    );
};

const alphabeticalSorter = (elements) =>
    elements.sort((a, b) =>
        (a.title ?? '').localeCompare(b.title ?? '', 'en', {
            sensitivity: 'base',
        }),
    );

const authoredSorter = (elements, { filter }) =>
    elements.sort((a, b) => {
        if (
            b.filters[filter]?.order == undefined ||
            isNaN(b.filters[filter]?.order)
        )
            return -1;
        if (
            a.filters[filter]?.order == undefined ||
            isNaN(a.filters[filter]?.order)
        )
            return 1;
        return a.filters[filter].order - b.filters[filter].order;
    });

const searcher = (elements, { search }) => {
    if (search?.length) {
        search = search.toLowerCase();
        return elements.filter((element) => {
            const haystack = (element.title ?? '').toLowerCase();
            return haystack.includes(search);
        });
    }
    return elements;
};

export class MerchCardCollection extends LitElement {
    static properties = {
        id: { type: String, attribute: 'id', reflect: true },
        displayResult: { type: Boolean, attribute: 'display-result' },
        filter: { type: String, attribute: 'filter', reflect: true },
        filtered: { type: String, attribute: 'filtered', reflect: true }, // freeze filter
        hasMore: { type: Boolean },
        limit: { type: Number, attribute: 'limit' },
        overrides : { type: String },
        page: { type: Number, attribute: 'page', reflect: true },
        resultCount: {
          type: Number,
        },
        search: { type: String, attribute: 'search', reflect: true },
        sidenav: { type: Object },
        singleApp: { type: String, attribute: 'single-app', reflect: true },
        sort: {
            type: String,
            attribute: 'sort',
            default: SORT_ORDER.authored,
            reflect: true,
        },
        types: { type: String, attribute: 'types', reflect: true },
    };

    #overrideMap = {};
    #service;
    #log;

    #merchCardElement;

    constructor() {
        super();
        // set defaults
        this.id = null;
        this.filter = 'all';
        this.hasMore = false;
        this.resultCount = undefined;
        this.displayResult = false;
        this.data = null;
        this.variant = null;
        this.hydrating = false;
        this.hydrationReady = null;
        this.literalsHandlerAttached = false;
        this.onUnmount = [];
    }

    render() {
        return html`
            <slot></slot>
            ${this.footer}`;
    }

    checkReady() {
        const aemFragment = this.querySelector('aem-fragment');
        if (!aemFragment) return Promise.resolve(true);
        const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve(false), MERCH_CARD_COLLECTION_LOAD_TIMEOUT),
        );
        return Promise.race([this.hydrationReady, timeoutPromise])
    }

    updated(changedProperties) {
        // cards are not added yet.
        if (!this.querySelector('merch-card')) return;
        let lastScrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const children = [...this.children].filter(
            (child) => child.tagName === 'MERCH-CARD',
        );

        if (children.length === 0) return;

        if (changedProperties.has('singleApp') && this.singleApp) {
            children.forEach((card) => {
                card.updateFilters(card.name === this.singleApp);
            });
        }

        const sorter =
            this.sort === SORT_ORDER.alphabetical
                ? alphabeticalSorter
                : authoredSorter;
        const reducers = [categoryFilter, typeFilter, searcher, sorter];

        let result = reducers
            .reduce((elements, reducer) => reducer(elements, this), children)
            .map((element, index) => [element, index]);

        this.resultCount = result.length;
        if (this.page && this.limit) {
            const pageSize = this.page * this.limit;
            this.hasMore = result.length > pageSize;
            result = result.filter(([, index]) => index < pageSize);
        }
        let reduced = new Map(result.reverse());
        for (const card of reduced.keys()) {
          this.prepend(card);
        }
        
        children.forEach((child) => {
            if (reduced.has(child)) {
                child.size = child.filters[this.filter]?.size;
                child.style.removeProperty('display');
                child.requestUpdate();
            } else {
                child.style.display = 'none';
                child.size = undefined;
            }
        });
        window.scrollTo(0, lastScrollTop);

        this.updateComplete.then(() => {
            this.dispatchLiteralsChanged();
            if (this.sidenav && !this.literalsHandlerAttached) {
                this.sidenav.addEventListener(EVENT_MERCH_SIDENAV_SELECT, () => {
                    this.dispatchLiteralsChanged();
                });
                this.literalsHandlerAttached = true;
            }
        });
    }

    dispatchLiteralsChanged() {
        this.dispatchEvent(new CustomEvent(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, 
        { 
            detail: {
                resultCount: this.resultCount,
                searchTerm: this.search,
                filter: this.sidenav?.filters?.selectedText
            }
        }));
    }

    buildOverrideMap() {
      this.#overrideMap = {};
      this.overrides?.split(',').forEach((token) => {
        const [ key, value ] = token?.split(':');
        if (key && value) {
          this.#overrideMap[key] = value;
        }
      });
    }

    connectedCallback() {
        super.connectedCallback();
        this.#service = getService();
        if (this.#service) {
            this.#log = this.#service.Log.module(MERCH_CARD_COLLECTION);
        }
        this.#merchCardElement = customElements.get('merch-card');
        this.buildOverrideMap();
        this.init();
    }

    async init() {
        await this.hydrate();
        this.sidenav = this.parentElement.querySelector('merch-sidenav');
        if (this.filtered) {
            this.filter = this.filtered;
                this.page = 1;
            } else {
            this.startDeeplink();
        }
        this.initializePlaceholders();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopDeeplink?.();
        for (const callback of this.onUnmount) callback();
    }

    initializeHeader() {
        const header = document.createElement('merch-card-collection-header');
        header.collection = this;
        header.classList.add(this.variant);
        this.parentElement.insertBefore(header, this);
        this.header = header;
        // Transfer header-related placeholders
        const existingPlaceholders = this.querySelectorAll('[placeholder]');
        existingPlaceholders.forEach(placeholder => {
            const key = placeholder.getAttribute('slot');
            if (this.header.placeholderKeys.includes(key)) {
                this.header.append(placeholder);
            }
        });
    }

    initializePlaceholders() {
        const placeholders = this.data?.placeholders || {};
        for (const key of Object.keys(placeholders)) {
            const value = placeholders[key];
            const tag = value.includes('<p>') ? 'div' : 'p';
            const placeholder = document.createElement(tag);
            placeholder.setAttribute('slot', key);
            placeholder.setAttribute('placeholder', '');
            placeholder.innerHTML = value;
            this.append(placeholder);
        }
    }

    attachSidenav(sidenav, append = true) {
        if (!sidenav) return;
        if (append) this.parentElement.prepend(sidenav);
        this.sidenav = sidenav;
        this.sidenav.variant = this.variant;
        this.sidenav.classList.add(this.variant);
        if (SIDENAV_AUTOCLOSE[this.variant]) 
            this.sidenav.setAttribute('autoclose', '');
        this.initializeHeader();
        this.dispatchEvent(new CustomEvent(EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED));

        const onSidenavAttached = this.#merchCardElement?.getCollectionOptions(this.variant)?.onSidenavAttached;
        onSidenavAttached && onSidenavAttached(this);
    }

    #fail(error, details = {}, dispatch = true) {
      this.#log.error(`merch-card-collection: ${error}`, details);
      this.failed = true;
      if (!dispatch) return;
      this.dispatchEvent(
          new CustomEvent(EVENT_MAS_ERROR, {
              detail: { ...details, message: error },
              bubbles: true,
              composed: true,
          }),
      );
  }

    async hydrate() {
        if (this.hydrating) return false;

        const aemFragment = this.querySelector('aem-fragment');
        if (!aemFragment) return;
        this.id = aemFragment.getAttribute('fragment');

        this.hydrating = true;
        let resolveHydration;
        this.hydrationReady = new Promise((resolve) => {
            resolveHydration = resolve;
        });
        const self = this;
        function normalizePayload(fragment, overrideMap) {
            const payload = { cards: [], hierarchy: [], placeholders: fragment.placeholders };

            function traverseReferencesTree(root, references) {
                for (const reference of references) {
                    if (reference.fieldName === 'cards') {
                        if (payload.cards.findIndex(card => card.id === reference.identifier) !== -1) continue;
                        payload.cards.push(fragment.references[reference.identifier].value);
                        continue;
                    }
                    const { fields } = fragment.references[reference.identifier].value;
                    const collection = {
                        label: fields.label || '',
                        icon: fields.icon,
                        iconLight: fields.iconLight,
                        queryLabel: fields.queryLabel,
                        cards: fields.cards ? fields.cards.map(cardId => overrideMap[cardId] || cardId) : [],
                        collections: []
                    };
                    if (fields.defaultchild) {
                        collection.defaultchild = overrideMap[fields.defaultchild] || fields.defaultchild;
                    }
                    root.push(collection);
                    traverseReferencesTree(collection.collections, reference.referencesTree);
                }
            }
            traverseReferencesTree(
                payload.hierarchy,
                fragment.referencesTree,
            );
            if (payload.hierarchy.length === 0) {
              self.filtered = 'all';
          }
            return payload;
        }
        
        aemFragment.addEventListener(EVENT_AEM_ERROR, (event) => {
            this.#fail('Error loading AEM fragment', event.detail);
            this.hydrating = false;
            aemFragment.remove();
        });
        aemFragment.addEventListener(EVENT_AEM_LOAD, async (event) => {
            this.data = normalizePayload(event.detail, this.#overrideMap);
            const { cards, hierarchy } = this.data;
            
            const rootDefaultChild = hierarchy.length === 0 && event.detail.fields?.defaultchild 
                ? (this.#overrideMap[event.detail.fields.defaultchild] || event.detail.fields.defaultchild)
                : null;
            
            aemFragment.cache.add(...cards);
            const checkDefaultChild = (collections, fragmentId) => {
                for (const collection of collections) {
                    if (collection.defaultchild === fragmentId) return true;
                    if (collection.collections && checkDefaultChild(collection.collections, fragmentId)) return true;
                }
                return false;
            };

            for (const fragment of cards) {
                const merchCard = document.createElement('merch-card');
                const fragmentId = this.#overrideMap[fragment.id] || fragment.id;
                merchCard.setAttribute('consonant', '');
                merchCard.setAttribute('style', '');

                // Check if this variant supports default child through mapping
                const variantMapping = getFragmentMapping(fragment.fields.variant);
                if (variantMapping?.supportsDefaultChild) {
                    const isDefault = rootDefaultChild 
                        ? fragmentId === rootDefaultChild
                        : checkDefaultChild(hierarchy, fragmentId);
                    
                    if (isDefault) {
                        merchCard.setAttribute('data-default-card', 'true');
                    }
                }

                function populateFilters(level) {
                    for (const node of level) {
                        const index = node.cards.indexOf(fragmentId);
                        if (index === -1) continue;
                        const name = node.queryLabel ?? node?.label?.toLowerCase() ?? '';
                        merchCard.filters[name] = { order: index + 1, size: fragment.fields.size };
                        populateFilters(node.collections);
                    }
                }
                populateFilters(hierarchy);

                const mcAemFragment = document.createElement('aem-fragment');
                mcAemFragment.setAttribute('fragment', fragmentId);
                merchCard.append(mcAemFragment);
                // if no filters are set, set the default filter
                if (Object.keys(merchCard.filters).length === 0) {
                    merchCard.filters = {
                        all: {
                            order: cards.indexOf(fragment) + 1,
                            size: fragment.fields.size,
                        },
                    };
                }
                // Append card after all attributes are set (including data-default-card)
                this.append(merchCard);
            }

            let nmbOfColumns = '';
            let variant = normalizeVariant(cards[0]?.fields?.variant);
            this.variant = variant;
            if (variant === 'plans' && cards.length === 3 && !cards.some((card) => card.fields?.size?.includes('wide'))) nmbOfColumns = 'ThreeColumns';
            if (variant) {
                this.classList.add('merch-card-collection', variant, ...(VARIANT_CLASSES[`${variant}${nmbOfColumns}`] || []));
            }
            this.displayResult = true;
            this.hydrating = false;
            aemFragment.remove();
            resolveHydration(true);
        });
        await this.hydrationReady;
    }

    get footer() {
        if (this.filtered) return;
        return html`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`;
    }

    get showMoreButton() {
        if (!this.hasMore) return;
        return html`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`;
    }

    sortChanged(event) {
        if (event.target.value === SORT_ORDER.authored) {
            pushState({ sort: undefined });
        } else {
            pushState({ sort: event.target.value });
        }

        this.dispatchEvent(
            new CustomEvent(EVENT_MERCH_CARD_COLLECTION_SORT, {
                bubbles: true,
                composed: true,
                detail: {
                    value: event.target.value,
                },
            }),
        );
    }

    async showMore() {
        this.dispatchEvent(
            new CustomEvent(EVENT_MERCH_CARD_COLLECTION_SHOWMORE, {
                bubbles: true,
                composed: true,
            }),
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
                    // a filter has changed, reset page to 1.
                    setTimeout(() => {
                        pushState({ page: undefined });
                        this.page = 1;
                    }, 1);
                }
                if (!this.filtered) {
                    this.filter = filter ?? this.filter;
                }
                this.types = types ?? '';
                this.search = search ?? '';
                this.singleApp = single_app;
                this.sort = sort;
                this.page = Number(page) || 1;
            },
        );
    }

    openFilters(e) {
        this.sidenav?.showModal(e);
    }

    static styles = css`
        #footer {
            grid-column: 1 / -1;
            justify-self: stretch;
            color: var(--merch-color-grey-80);
            order: 1000;
        }

        sp-theme {
            display: contents;
        }
    `;
}

MerchCardCollection.SortOrder = SORT_ORDER;

customElements.define(MERCH_CARD_COLLECTION, MerchCardCollection);

// #region Header

const RESULT_TEXT_SLOT_NAMES = {
    // no search
    filters: ['noResultText', 'resultText', 'resultsText'],
    filtersMobile: ['noResultText', 'resultMobileText', 'resultsMobileText'],
    // search on desktop
    search: ['noSearchResultsText', 'searchResultText', 'searchResultsText'],
    // search on mobile
    searchMobile: [
        'noSearchResultsMobileText',
        'searchResultMobileText',
        'searchResultsMobileText',
    ],
  };
  
  const updatePlaceholders = (el, key, value) => {
    const placeholders = el.querySelectorAll(`[data-placeholder="${key}"]`);
    placeholders.forEach(placeholder => {
        placeholder.innerText = value || '';
    });
  };
  
  const defaultVisibility = {
    search: ['mobile', 'tablet'],
    filter: ['mobile', 'tablet'],
    sort: true,
    result: true,
    custom: false,
  }
  
  const SEARCH_SIZE = {
      catalog: 'l'
  };
  
  export default class MerchCardCollectionHeader extends LitElement {
      constructor() {
          super();
          this.collection = null;
          this.#visibility = {
              search: false,
              filter: false,
              sort: false,
              result: false,
              custom: false
          }
          this.updateLiterals = this.updateLiterals.bind(this);
          this.handleSidenavAttached = this.handleSidenavAttached.bind(this);
      }
  
      #visibility;
      #merchCardElement;
  
      connectedCallback() {
          super.connectedCallback();
          this.collection?.addEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, this.updateLiterals);
          this.collection?.addEventListener(EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED, this.handleSidenavAttached);
          this.#merchCardElement = customElements.get('merch-card');
      }
  
      disconnectedCallback() {
          super.disconnectedCallback();
          this.collection?.removeEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, this.updateLiterals);
          this.collection?.removeEventListener(EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED, this.handleSidenavAttached);
      }
  
      willUpdate() {
          this.#visibility.search = this.getVisibility('search');
          this.#visibility.filter = this.getVisibility('filter');
          this.#visibility.sort = this.getVisibility('sort');
          this.#visibility.result = this.getVisibility('result');
          this.#visibility.custom = this.getVisibility('custom');
      }
  
      parseVisibilityOptions(visibility, type) {
          if (!visibility) return null;
          if (!Object.hasOwn(visibility, type)) return null;
          const typeVisibility = visibility[type];
          if (typeVisibility === false) return false;
          if (typeVisibility === true) return true;
          return typeVisibility.includes(this.currentMedia);
      }
  
      getVisibility(type) {
          const visibility = this.#merchCardElement?.getCollectionOptions(this.collection?.variant)?.headerVisibility;
          const typeVisibility = this.parseVisibilityOptions(visibility, type);
          if (typeVisibility !== null) return typeVisibility;
          return this.parseVisibilityOptions(defaultVisibility, type);
      }
  
      get sidenav() {
          return this.collection?.sidenav;
      }
  
      get search() {
          return this.collection?.search;
      }
  
      get resultCount() {
          return this.collection?.resultCount;
      }
  
      get variant() {
          return this.collection?.variant;
      }
  
      tablet = new MatchMediaController(this, TABLET_UP);
      desktop = new MatchMediaController(this, DESKTOP_UP);
  
      get isMobile() {
          return !this.isTablet && !this.isDesktop;
      }
  
      get isTablet() {
          return this.tablet.matches && !this.desktop.matches;
      }
  
      get isDesktop() {
          return this.desktop.matches;
      }
  
      get currentMedia() {
          if (this.isDesktop) return 'desktop';
          if (this.isTablet) return 'tablet';
          return 'mobile';
      }
  
      get searchAction() {
          if (!this.#visibility.search) return nothing;
          const searchPlaceholder = getSlotText(this, 'searchText');
          if (!searchPlaceholder) return nothing;
          return html`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${searchPlaceholder}"
                      .size=${SEARCH_SIZE[this.variant]}
                  ></sp-search>
              </merch-search>
          `;
      }
  
      get filterAction() {
          if (!this.#visibility.filter) return nothing;
          if (!this.sidenav) return nothing;
          return html`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `;
      }
  
      get sortAction() {
          if (!this.#visibility.sort) return nothing;
          const sortText = getSlotText(this, 'sortText');
          if (!sortText) return;
          const popularityText = getSlotText(this, 'popularityText');
          const alphabeticallyText = getSlotText(this, 'alphabeticallyText');
  
          if (!(popularityText && alphabeticallyText)) return;
          const alphabetical = this.collection?.sort === SORT_ORDER.alphabetical;
  
          return html`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${alphabetical
                      ? SORT_ORDER.alphabetical
                      : SORT_ORDER.authored}"
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
  
      get resultSlotName() {
          const slotType = `${this.search ? 'search' : 'filters'}${this.isMobile || this.isTablet ? 'Mobile' : ''}`;
          return RESULT_TEXT_SLOT_NAMES[slotType][Math.min(this.resultCount, 2)];
      }
  
      get resultLabel() {
          if (!this.#visibility.result) return nothing;
          if (!this.sidenav) return nothing;
          const type = this.search ? 'search' : 'filter';
          const quantity = !this.resultCount ? 'none' : this.resultCount === 1 ? 'single' : 'multiple';
          return html`
            <div id="result" aria-live="polite" type=${type} quantity=${quantity}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`
      }
  
      get customArea() {
          if (!this.#visibility.custom) return nothing;
          const customHeaderAreaGetter = this.#merchCardElement?.getCollectionOptions(this.collection?.variant)?.customHeaderArea;
          if (!customHeaderAreaGetter) return nothing;
          const customHeaderArea = customHeaderAreaGetter(this.collection);
          if (!customHeaderArea || customHeaderArea === nothing) return nothing;
          return html`<div id="custom" role="heading" aria-level="2">${customHeaderArea}</div>`;
      }
  
      // #region Handlers
  
      openFilters(event) {
          this.sidenav.showModal(event);
      }
  
      updateLiterals(event) {
          Object.keys(event.detail).forEach(key => {
              updatePlaceholders(this, key, event.detail[key]);
          });
          this.requestUpdate();
      }
  
      handleSidenavAttached() {
          this.requestUpdate();
      }
  
      render() {
          return html`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `
      }
  
      static styles = css`
          :host {
              --merch-card-collection-header-max-width: var(--merch-card-collection-card-width);
              --merch-card-collection-header-margin-bottom: 32px;
              --merch-card-collection-header-column-gap: 8px;
              --merch-card-collection-header-row-gap: 16px;
              --merch-card-collection-header-columns: auto auto;
              --merch-card-collection-header-areas: "search search" 
                                                    "filter sort"
                                                    "result result";
              --merch-card-collection-header-search-max-width: unset;
              --merch-card-collection-header-filter-height: 40px;
              --merch-card-collection-header-filter-font-size: 16px;
              --merch-card-collection-header-filter-padding: 15px;
              --merch-card-collection-header-sort-height: var(--merch-card-collection-header-filter-height);
              --merch-card-collection-header-sort-font-size: var(--merch-card-collection-header-filter-font-size);
              --merch-card-collection-header-sort-padding: var(--merch-card-collection-header-filter-padding);
              --merch-card-collection-header-result-font-size: 14px;
          }
  
          sp-theme {
              font-size: inherit;
          }
  
          #header {
              display: grid;
              column-gap: var(--merch-card-collection-header-column-gap);
              row-gap: var(--merch-card-collection-header-row-gap);
              align-items: center;
              grid-template-columns: var(--merch-card-collection-header-columns);
              grid-template-areas: var(--merch-card-collection-header-areas);
              margin-bottom: var(--merch-card-collection-header-margin-bottom);
              max-width: var(--merch-card-collection-header-max-width);
          }
  
          #header:empty {
              margin-bottom: 0;
          }
          
          #search {
              grid-area: search;
          }
  
          #search sp-search {
              max-width: var(--merch-card-collection-header-search-max-width);
              width: 100%;
          }
  
          #filter {
              grid-area: filter;
              --mod-actionbutton-edge-to-text: var(--merch-card-collection-header-filter-padding);
              --mod-actionbutton-height: var(--merch-card-collection-header-filter-height);
          }
  
          #filter slot[name="filtersText"] {
              font-size: var(--merch-card-collection-header-filter-font-size);
          }
  
          #sort {
              grid-area: sort;
              --mod-actionbutton-edge-to-text: var(--merch-card-collection-header-sort-padding);
              --mod-actionbutton-height: var(--merch-card-collection-header-sort-height);
          }
  
          #sort [slot="label-only"] {
              font-size: var(--merch-card-collection-header-sort-font-size);
          }
  
          #result {
              grid-area: result;
              font-size: var(--merch-card-collection-header-result-font-size);
          }
  
          #result[type="search"][quantity="none"] {
              font-size: inherit;
          }
  
          #custom {
              grid-area: custom;
          }
  
          /* tablets */
          @media screen and ${unsafeCSS(TABLET_UP)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort" 
                                                        "result result result";
              }
          }
  
          /* Laptop */
          @media screen and ${unsafeCSS(DESKTOP_UP)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `;
  
      get placeholderKeys() {
          return [
              'searchText',
              'filtersText',
              'sortText',
              'popularityText',
              'alphabeticallyText',
              'noResultText',
              'resultText',
              'resultsText',
              'resultMobileText',
              'resultsMobileText',
              'noSearchResultsText',
              'searchResultText',
              'searchResultsText',
              'noSearchResultsMobileText',
              'searchResultMobileText',
              'searchResultsMobileText',
          ];
      }
  }
  
  customElements.define('merch-card-collection-header', MerchCardCollectionHeader);  

// #endregion
