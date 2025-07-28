import { html, LitElement } from 'lit';
import { deeplink, pushState } from './deeplink.js';
import { EVENT_MAS_ERROR, EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED, EVENT_MERCH_SIDENAV_SELECT, SORT_ORDER } from './constants.js';

import {
    EVENT_MERCH_CARD_COLLECTION_SORT,
    EVENT_MERCH_CARD_COLLECTION_SHOWMORE,
    EVENT_AEM_ERROR,
    EVENT_AEM_LOAD,
} from './constants.js';
import { styles } from './merch-card-collection.css.js';
import { getService } from './utils.js';
import './mas-commerce-service';
import MerchCardCollectionHeader from './merch-card-collection-header.js';

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
    elements.filter((element) => element.filters.hasOwnProperty(filter));

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

    constructor() {
        super();
        // set defaults
        this.filter = 'all';
        this.hasMore = false;
        this.resultCount = undefined;
        this.displayResult = false;
        this.data = null;
        this.variant = null;
        this.hydrating = false;
        this.hydrationReady = null;
        this.literalsHandlerAttached = false;
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
        this.#log = this.#service.Log.module(MERCH_CARD_COLLECTION);
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
        this.initializeHeader();
        this.initializePlaceholders();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopDeeplink?.();
    }

    initializeHeader() {
        const header = document.createElement('merch-card-collection-header');
        header.collection = this;
        header.classList.add(this.variant);
        this.parentElement.insertBefore(header, this);
        this.header = header;
    }

    initializePlaceholders() {
        const existingPlaceholders = this.querySelectorAll('[placeholder]');
        if (existingPlaceholders.length > 0) {
            existingPlaceholders.forEach(placeholder => {
                const key = placeholder.getAttribute('slot');
                if (MerchCardCollectionHeader.placeholderKeys.includes(key)) {
                    this.header?.append(placeholder);
                }
            });
        }
        else {
            const placeholders = this.data?.placeholders || {};
            for (const key of Object.keys(placeholders)) {
                const value = placeholders[key];
                const tag = value.includes('<p>') ? 'div' : 'p';
                const placeholder = document.createElement(tag);
                placeholder.setAttribute('slot', key);
                placeholder.setAttribute('placeholder', '');
                placeholder.innerHTML = value;
                if (MerchCardCollectionHeader.placeholderKeys.includes(key)) this.header?.append(placeholder);
                else this.append(placeholder);
            }
        }
    }

    attachSidenav(sidenav, append = true) {
        if (!sidenav) return;
        if (append) this.parentElement.prepend(sidenav);
        this.sidenav = sidenav;
        if (SIDENAV_AUTOCLOSE[this.variant]) 
            this.sidenav.setAttribute('autoclose', '');
        this.dispatchEvent(new CustomEvent(EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED));
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
                        label: fields.label,
                        icon: fields.icon,
                        iconLight: fields.iconLight,
                        navigationLabel: fields.navigationLabel,
                        cards: fields.cards.map(cardId => overrideMap[cardId] || cardId),
                        collections: []
                    };
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
            for (const fragment of cards) {
                const merchCard = document.createElement('merch-card');
                const fragmentId = this.#overrideMap[fragment.id] || fragment.id;
                merchCard.setAttribute('consonant', '');
                merchCard.setAttribute('style', '');

                function populateFilters(level) {
                    for (const node of level) {
                        const index = node.cards.indexOf(fragmentId);
                        if (index === -1) continue;
                        const name = node.label.toLowerCase();
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
                this.append(merchCard);
            }

            let nmbOfColumns = '';
            let variant = cards[0]?.fields.variant;
            if (variant.startsWith('plans')) variant = 'plans';
            this.variant = variant;
            if (variant === 'plans' && cards.length === 3 && !cards.some((card) => card.fields.size?.includes('wide'))) nmbOfColumns = 'ThreeColumns';
            this.classList.add('merch-card-collection', variant, ...(VARIANT_CLASSES[`${variant}${nmbOfColumns}`] || []));
            this.displayResult = true;
            this.hydrating = false;
            aemFragment.remove();
            resolveHydration();
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

    static styles = [styles];
}

MerchCardCollection.SortOrder = SORT_ORDER;

customElements.define(MERCH_CARD_COLLECTION, MerchCardCollection);
