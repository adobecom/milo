import { html, LitElement } from 'lit';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';
import { deeplink, pushState } from './deeplink.js';
import { EVENT_MERCH_SIDENAV_SELECT } from './constants.js';

import {
    EVENT_MERCH_CARD_COLLECTION_SORT,
    EVENT_MERCH_CARD_COLLECTION_SHOWMORE,
    EVENT_AEM_ERROR,
    EVENT_AEM_LOAD,
} from './constants.js';
import { TABLET_DOWN } from './media.js';
import { styles } from './merch-card-collection.css.js';
import { getSlotText } from './utils.js';
import './mas-commerce-service';
import { hydrate } from './hydrate.js';

const MERCH_CARD_COLLECTION = 'merch-card-collection';
const MERCH_CARD_COLLECTION_LOAD_TIMEOUT = 10000;

const SORT_ORDER = {
    alphabetical: 'alphabetical',
    authored: 'authored',
};

const VARIANT_CLASSES = {
    catalog: ['four-merch-cards'],
    plans: ['four-merch-cards'],
}

const RESULT_TEXT_SLOT_NAMES = {
    // no search
    filters: ['noResultText', 'resultText', 'resultsText'],
    // search on mobile
    mobile: [
        'noSearchResultsMobileText',
        'searchResultMobileText',
        'searchResultsMobileText',
    ],
    // search on desktop
    desktop: ['noSearchResultsText', 'searchResultText', 'searchResultsText'],
};

export const updateLiterals = (el, values = {}) => {
    el.querySelectorAll('span[data-placeholder]').forEach((el) => {
        const { placeholder } = el.dataset;
        el.innerText = values[placeholder] ?? '';
    });
};

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
        filter: { type: String, attribute: 'filter', reflect: true },
        filtered: { type: String, attribute: 'filtered' }, // freeze filter
        search: { type: String, attribute: 'search', reflect: true },
        sort: {
            type: String,
            attribute: 'sort',
            default: SORT_ORDER.authored,
            reflect: true,
        },
        types: { type: String, attribute: 'types', reflect: true },
        limit: { type: Number, attribute: 'limit' },
        page: { type: Number, attribute: 'page', reflect: true },
        singleApp: { type: String, attribute: 'single-app', reflect: true },
        hasMore: { type: Boolean },
        displayResult: { type: Boolean, attribute: 'display-result' },
        resultCount: {
            type: Number,
        },
        sidenav: { type: Object },
    };

    mobileAndTablet = new MatchMediaController(this, TABLET_DOWN);

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
    }

    render() {
        return html`${this.header}
            <slot></slot>
            ${this.footer}`;
    }

    checkReady() {
        const aemFragment = this.querySelector('aem-fragment');
        if (!aemFragment) return Promise.resolve(true);
        const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve(false), MERCH_CARD_COLLECTION_LOAD_TIMEOUT),
        );
        const hydration = async () => {
            await aemFragment.updateComplete;
            await this.hydrationReady;
        }
        return Promise.race([hydration(), timeoutPromise])
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
            // first child element of #resultText > slot
            const resultTextElement = this.shadowRoot
                .getElementById('resultText')
                ?.firstElementChild?.assignedElements?.()?.[0];
            if (!resultTextElement) return;

            this.sidenav?.filters?.addEventListener(EVENT_MERCH_SIDENAV_SELECT, () => {
              updateLiterals(resultTextElement, {
                resultCount: this.resultCount,
                searchTerm: this.search,
                filter: this.sidenav?.filters.selectedText,
              });
            });

            updateLiterals(resultTextElement, {
                resultCount: this.resultCount,
                searchTerm: this.search,
                filter: this.sidenav?.filters.selectedText,
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
        this.sidenav = document.querySelector('merch-sidenav');
        this.hydrateFromFragment();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopDeeplink?.();
    }

    async hydrateFromFragment() {
        if (this.hydrating) return false;

        const aemFragment = this.querySelector('aem-fragment');
        if (!aemFragment) return;

        this.hydrating = true;
        let resolveHydration;
        this.hydrationReady = new Promise((resolve) => {
            resolveHydration = resolve;
        });
        
        aemFragment.addEventListener(EVENT_AEM_ERROR, (event) => {
            console.error(event.detail);
            this.hydrating = false;
            aemFragment.remove();
        });
        aemFragment.addEventListener(EVENT_AEM_LOAD, async (event) => {
            this.data = {
                "fields": {
                    "cards": {
                        "1736f2c9-0931-401b-b3c0-fe87ff72ad38": {
                            "description": "some description",
                            "fields": {
                                "badge": {
                                    "mimeType": "text/html"
                                },
                                "callout": {
                                    "mimeType": "text/html"
                                },
                                "cardTitle": "Photography  (1TB)",
                                "ctas": {
                                    "mimeType": "text/html",
                                    "value": "<a is=\"checkout-link\" data-promotion-code=\"FY25PLES256MROW\" data-wcs-osi=\"MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4\" data-template=\"checkoutUrl\" data-analytics-id=\"buy-now\">Buy now</a>"
                                },
                                "description": {
                                    "mimeType": "text/html",
                                    "value": "<p>Edit and organize photos. Save&nbsp;25% for the first 6 months.&nbsp;Ends Feb 26.&nbsp;<a href=\"https://www.adobe.com/offer-terms/ccpp-1tb-terms.html\" target=\"_blank\">See terms.</a><br><a href=\"https://www.adobe.com/creativecloud/photography/compare-plans.html\">Compare photography plans</a><br><a class=\"modal-Link\" href=\"https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/photography1tb/master.html\" target=\"_blank\">See all plans &amp; pricing details</a></p>"
                                },
                                "locReady": true,
                                "mnemonicAlt": [
                                    "Lightroom",
                                    "Illustrator"
                                ],
                                "mnemonicIcon": [
                                    "https://www.adobe.com/content/dam/shared/images/product-icons/svg/lightroom.svg",
                                    "https://www.adobe.com/content/dam/shared/images/product-icons/svg/photoshop.svg"
                                ],
                                "mnemonicLink": [
                                    "https://www.adobe.com/products/catalog.html",
                                    "https://www.adobe.com"
                                ],
                                "prices": {
                                    "mimeType": "text/html",
                                    "value": "<span is=\"inline-price\" data-promotion-code=\"FY25PLES256MROW\" data-template=\"price\" data-wcs-osi=\"MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4\"></span>"
                                },
                                "shortDescription": {
                                    "mimeType": "text/html"
                                },
                                "showStockCheckbox": true,
                                "tags": [],
                                "variant": "plans"
                            },
                            "id": "1736f2c9-0931-401b-b3c0-fe87ff72ad38",
                            "model": {
                                "id": "L2NvbmYvbWFzL3NldHRpbmdzL2RhbS9jZm0vbW9kZWxzL2NhcmQ"
                            },
                            "name": "",
                            "path": "/content/dam/mas/nala/en_US/acom/create11111",
                            "title": "Plans Nala Card 1"
                        },
                        "616273eb-3aad-462a-a6d7-6f6857973b77": {
                            "description": "some description",
                            "fields": {
                                "badge": {
                                    "mimeType": "text/html"
                                },
                                "callout": {
                                    "mimeType": "text/html"
                                },
                                "cardTitle": "Illustrator",
                                "ctas": {
                                    "mimeType": "text/html",
                                    "value": "<a is=\"checkout-link\" data-promotion-code=\"FY25PLES256MROW\" data-wcs-osi=\"MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4\" data-template=\"checkoutUrl\" data-analytics-id=\"buy-now\">Buy now</a>"
                                },
                                "description": {
                                    "mimeType": "text/html",
                                    "value": "<p>Edit and organize photos. Save&nbsp;25% for the first 6 months.&nbsp;Ends Feb 26.&nbsp;<a href=\"https://www.adobe.com/offer-terms/ccpp-1tb-terms.html\" target=\"_blank\">See terms.</a><br><a href=\"https://www.adobe.com/creativecloud/photography/compare-plans.html\">Compare photography plans</a><br><a class=\"modal-Link\" href=\"https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/photography1tb/master.html\" target=\"_blank\">See all plans &amp; pricing details</a></p>"
                                },
                                "locReady": true,
                                "mnemonicAlt": [
                                    "Lightroom"
                                ],
                                "mnemonicIcon": [
                                    "https://www.adobe.com/content/dam/shared/images/product-icons/svg/illustrator.svg"
                                ],
                                "mnemonicLink": [
                                    "https://www.adobe.com/products/catalog.html"
                                ],
                                "prices": {
                                    "mimeType": "text/html",
                                    "value": "<span is=\"inline-price\" data-promotion-code=\"FY25PLES256MROW\" data-template=\"price\" data-wcs-osi=\"1KfaN_o5h4Gvmvh_QwfK7KB7xGPpNpsTXsdhqpJUT5Y\"></span>"
                                },
                                "promoText": "Save over 30% with an annual plan.",
                                "shortDescription": {
                                    "mimeType": "text/html"
                                },
                                "showStockCheckbox": true,
                                "tags": [],
                                "variant": "plans"
                            },
                            "id": "616273eb-3aad-462a-a6d7-6f6857973b77",
                            "model": {
                                "id": "L2NvbmYvbWFzL3NldHRpbmdzL2RhbS9jZm0vbW9kZWxzL2NhcmQ"
                            },
                            "name": "",
                            "path": "/content/dam/mas/nala/en_US/acom/create111112",
                            "title": "Plans Nala Card 1"
                        },
                        "8373b5c2-69e6-4e9c-befc-b424dd33469b": {
                            "description": "some description",
                            "fields": {
                                "badge": {
                                    "mimeType": "text/html",
                                    "value": "Badge text"
                                },
                                "callout": {
                                    "mimeType": "text/html",
                                    "value": "<p>Callout text <span class=\"icon-button\" title=\"Info tooltip\"></span></p>"
                                },
                                "cardTitle": "Illustrator",
                                "ctas": {
                                    "mimeType": "text/html",
                                    "value": "<a is=\"checkout-link\" data-promotion-code=\"FY25PLES256MROW\" data-wcs-osi=\"MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4\" data-template=\"checkoutUrl\" data-analytics-id=\"buy-now\">Buy now</a>"
                                },
                                "description": {
                                    "mimeType": "text/html",
                                    "value": "<p>Edit and organize photos. Save&nbsp;25% for the first 6 months.&nbsp;Ends Feb 26.&nbsp;<a href=\"https://www.adobe.com/offer-terms/ccpp-1tb-terms.html\" target=\"_blank\">See terms.</a><br><a href=\"https://www.adobe.com/creativecloud/photography/compare-plans.html\">Compare photography plans</a><br><a class=\"modal-Link\" href=\"https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/photography1tb/master.html\" target=\"_blank\">See all plans &amp; pricing details</a></p>"
                                },
                                "locReady": true,
                                "mnemonicAlt": [
                                    "Lightroom"
                                ],
                                "mnemonicIcon": [
                                    "https://www.adobe.com/content/dam/shared/images/product-icons/svg/illustrator.svg"
                                ],
                                "mnemonicLink": [
                                    "https://www.adobe.com/products/catalog.html"
                                ],
                                "prices": {
                                    "mimeType": "text/html",
                                    "value": "<span is=\"inline-price\" data-promotion-code=\"FY25PLES256MROW\" data-template=\"price\" data-wcs-osi=\"1KfaN_o5h4Gvmvh_QwfK7KB7xGPpNpsTXsdhqpJUT5Y\"></span>"
                                },
                                "promoText": "Save over 30% with an annual plan.",
                                "quantitySelect": "<merch-quantity-select title=\"Select quantity\" min=\"3\" max=\"10\" step=\"1\"></merch-quantity-select>",
                                "shortDescription": {
                                    "mimeType": "text/html"
                                },
                                "showStockCheckbox": true,
                                "tags": [],
                                "variant": "plans"
                            },
                            "id": "8373b5c2-69e6-4e9c-befc-b424dd33469b",
                            "model": {
                                "id": "L2NvbmYvbWFzL3NldHRpbmdzL2RhbS9jZm0vbW9kZWxzL2NhcmQ"
                            },
                            "name": "",
                            "path": "/content/dam/mas/nala/en_US/acom/create1111121",
                            "title": "Plans Nala Card 1"
                        },
                        "a15b77f7-fb32-4608-8b5c-a1b98675ad85": {
                            "description": "some description",
                            "fields": {
                                "badge": {
                                    "mimeType": "text/html"
                                },
                                "callout": {
                                    "mimeType": "text/html"
                                },
                                "cardTitle": "Acrobat Pro",
                                "ctas": {
                                    "mimeType": "text/html",
                                    "value": "<a is=\"checkout-link\" data-promotion-code=\"FY25PLES256MROW\" data-wcs-osi=\"MzCpF9nUi8rEzyW-9slEUwtRenS69PRW5fp84a93uK4\" data-template=\"checkoutUrl\" data-analytics-id=\"buy-now\">Buy now</a>"
                                },
                                "description": {
                                    "mimeType": "text/html",
                                    "value": "<p>Create, edit, sign, and manage your PDFs — quickly, easily, anywhere.<br><a class=\"modal-Link\" href=\"https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/photography1tb/master.html\" target=\"_blank\">See all plans &amp; pricing details</a></p>"
                                },
                                "locReady": true,
                                "mnemonicAlt": [
                                    "Acrobat Pro"
                                ],
                                "mnemonicIcon": [
                                    "https://www.adobe.com/content/dam/shared/images/product-icons/svg/acrobat.svg"
                                ],
                                "mnemonicLink": [
                                    "https://www.adobe.com/products/catalog.html"
                                ],
                                "prices": {
                                    "mimeType": "text/html",
                                    "value": "<p><span is=\"inline-price\" data-template=\"price\" data-wcs-osi=\"VbDsK1jsr3uGWMCxyps3lJH_voQxJHKsRR5tz9lZoDo\"></span></p>"
                                },
                                "promoText": "Save over 30% with an annual plan.",
                                "shortDescription": {
                                    "mimeType": "text/html"
                                },
                                "showStockCheckbox": true,
                                "tags": [],
                                "variant": "plans"
                            },
                            "id": "a15b77f7-fb32-4608-8b5c-a1b98675ad85",
                            "model": {
                                "id": "L2NvbmYvbWFzL3NldHRpbmdzL2RhbS9jZm0vbW9kZWxzL2NhcmQ"
                            },
                            "name": "",
                            "path": "/content/dam/mas/nala/en_US/acom/create111111",
                            "title": "Plans Nala Card 1"
                        }
                    },
                    "categories": [
                        {
                            "cards": [
                                "8373b5c2-69e6-4e9c-befc-b424dd33469b",
                                "1736f2c9-0931-401b-b3c0-fe87ff72ad38",
                                "616273eb-3aad-462a-a6d7-6f6857973b77",
                                "a15b77f7-fb32-4608-8b5c-a1b98675ad85"
                            ],
                            "label": "All"
                        },
                        {
                            "cards": [
                                "1736f2c9-0931-401b-b3c0-fe87ff72ad38"
                            ],
                            "label": "Photo"
                        },
                        {
                            "cards": [
                                "616273eb-3aad-462a-a6d7-6f6857973b77",
                                "8373b5c2-69e6-4e9c-befc-b424dd33469b"
                            ],
                            "label": "Illustration"
                        }
                    ],
                    "locReady": false
                },
                "id": "09634c2e-1a8f-49c1-936e-8540cac715b7",
                "stale": false
            };
            const { cards, categories } = this.data.fields;
            const fragments = Object.keys(cards).map(key => cards[key]);
            for (const fragment of fragments) {
                const merchCard = document.createElement('merch-card');
                merchCard.setAttribute('consonant', '');
                merchCard.setAttribute('style', '');
                merchCard.filters = {};
                for (const category of categories) {
                    const index = category.cards.indexOf(fragment.id);
                    if (index === -1) continue;
                    const name = category.label.toLowerCase();
                    merchCard.filters[name] = { order: index + 1, size: fragment.fields.size };
                }
                this.append(merchCard);
                const fragmentForHydration = { ...fragment, fields: Object.keys(fragment.fields).reduce((fields, key) => {
                        const fieldValue = fragment.fields[key];
                        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
                            fields[key] = fieldValue.value;
                        }
                        else {
                            fields[key] = fieldValue;
                        }
                        return fields;
                    }, {}) 
                };
                await hydrate(fragmentForHydration, merchCard);
            }

            const variant = fragments[0]?.fields.variant;
            this.variant = variant;
            this.classList.add('merch-card-collection', variant, ...(VARIANT_CLASSES[variant] || []));

            this.displayResult = true;
            this.hydrating = false;
            aemFragment.remove();
            resolveHydration();
        });
    }

    get header() {
        if (this.filtered) return;
        return html`<div id="header">
                <sp-theme  color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText" aria-live="polite">
                ${this.displayResult
                    ? html`<slot name="${this.resultTextSlotName}"></slot>`
                    : ''}
            </div>`;
    }

    get footer() {
        if (this.filtered) return;
        return html`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`;
    }

    get resultTextSlotName() {
        const slotName =
            RESULT_TEXT_SLOT_NAMES[
                this.search
                    ? this.mobileAndTablet.matches
                        ? 'mobile'
                        : 'desktop'
                    : 'filters'
            ][Math.min(this.resultCount, 2)];

        return slotName;
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

    get filtersButton() {
        return this.mobileAndTablet.matches
            ? html`<sp-action-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-action-button>`
            : '';
    }

    get searchBar() {
        const searchPlaceholder = getSlotText(this, 'searchText');

        return this.mobileAndTablet.matches
            ? html`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${searchPlaceholder}"
                  ></sp-search>
              </merch-search>`
            : '';
    }

    get sortButton() {
        const sortText = getSlotText(this, 'sortText');
        const popularityText = getSlotText(this, 'popularityText');
        const alphabeticallyText = getSlotText(this, 'alphabeticallyText');

        if (!(sortText && popularityText && alphabeticallyText)) return;
        const alphabetical = this.sort === SORT_ORDER.alphabetical;

        return html`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
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
