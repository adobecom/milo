import { html, css, unsafeCSS, LitElement, nothing } from 'lit';
import { DESKTOP_UP, TABLET_UP } from './media.js';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';
import { getCollectionOptions } from './variants/variants.js';
import { EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, SORT_ORDER } from './constants.js';
import { getSlotText } from './utils.js';

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
  result: ['mobile', 'tablet'],
  custom: false,
}

export default class MerchCardCollectionHeader extends LitElement {
    constructor() {
        super();
        this.collection ??= null;
        this.updateLiterals = this.updateLiterals.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.collection.addEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, this.updateLiterals);
    }

    tablet = new MatchMediaController(this, TABLET_UP);
    desktop = new MatchMediaController(this, DESKTOP_UP);

    get isMobile() {
        return !this.isTablet && !this.isDesktop;
    }

    get isTablet() {
        return this.tablet.matches;
    }

    get isDesktop() {
        return this.desktop.matches;
    }

    get currentMedia() {
        if (this.isDesktop) return 'desktop';
        if (this.isTablet) return 'tablet';
        return 'mobile';
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
        const visibility = getCollectionOptions(this.collection.variant)?.headerVisibility;
        const typeVisibility = this.parseVisibilityOptions(visibility, type);
        if (typeVisibility !== null) return typeVisibility;
        return this.parseVisibilityOptions(defaultVisibility, type);
    }

    get searchAction() {
        if (!this.getVisibility('search')) return nothing;
        const searchPlaceholder = getSlotText(this.collection, 'searchText');
        if (!searchPlaceholder) return nothing;
        return html`
            <merch-search deeplink="search" id="search">
                <sp-search
                    id="search-bar"
                    placeholder="${searchPlaceholder}"
                ></sp-search>
            </merch-search>
        `;
    }

    get filterAction() {
        if (!this.getVisibility('filter')) return nothing;
        if (!this.collection.sidenav) return nothing;
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
        if (!this.getVisibility('sort')) return nothing;
        const sortText = getSlotText(this, 'sortText');
        if (!sortText) return;
        const popularityText = getSlotText(this, 'popularityText');
        const alphabeticallyText = getSlotText(this, 'alphabeticallyText');

        if (!(popularityText && alphabeticallyText)) return;
        const alphabetical = this.sort === SORT_ORDER.alphabetical;

        return html`
            <sp-action-menu
                id="sort"
                size="m"
                @change="${this.collection.sortChanged}"
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
        const slotType = `${this.collection.search ? 'search' : 'filters'}${this.isMobile || this.isTablet ? 'Mobile' : ''}`;
        return RESULT_TEXT_SLOT_NAMES[slotType][Math.min(this.collection.resultCount, 2)];
    }

    get resultLabel() {
        if (!this.getVisibility('result')) return nothing;
        return html`
          <div id="result" aria-live="polite">
              <slot name="${this.resultSlotName}"></slot>
          </div>`
    }

    get customArea() {
        if (!this.getVisibility('custom')) return nothing;
        const customHeaderArea = getCollectionOptions(this.collection.variant)?.customHeaderArea;
        if (!customHeaderArea) return nothing;
        return html`<div id="custom">${customHeaderArea()}</div>`;
    }

    // #region Handlers

    openFilters(event) {
        this.collection.sidenav.showModal(event);
    }

    updateLiterals(event) {
        Object.keys(event.detail).forEach(key => {
            updatePlaceholders(this, key, event.detail[key]);
        })
    }

    // #endregion

    render() {
        return html`
          <sp-theme color="light" scale="medium">
            <div id="header">
              ${this.searchAction}
              ${this.filterAction}
              ${this.sortAction}
              ${this.resultLabel}
              ${this.customArea}
            </div>
          </sp-theme>
        `
    }

    static styles = css`
        :host {
            --merch-card-collection-header-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-columns: auto max-content;
            --merch-card-collection-header-areas: "search search" 
                                                  "filter sort"
                                                  "result result";
        }

        sp-theme {
            font-size: inherit;
        }

        #header {
            display: grid;
            gap: var(--merch-card-collection-header-gap);
            align-items: center;
            grid-template-columns: var(--merch-card-collection-header-columns);
            grid-template-areas: var(--merch-card-collection-header-areas);
        }
        
        #search {
            grid-area: search;
            margin: 12px;
        }

        #filter {
            grid-area: filter;
            width: 92px;
        }

        #sort {
            grid-area: sort;
        }

        #result {
            grid-area: result;
        }

        #custom {
            grid-area: custom;
        }

        /* tablets */
        @media screen and ${unsafeCSS(TABLET_UP)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                --merch-card-collection-header-areas: "search filter sort" 
                                                      "result result result";
            }
        }

        /* Laptop */
        @media screen and ${unsafeCSS(DESKTOP_UP)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%);
                --merch-card-collection-header-areas: ". sort";
            }
        }
    `;

    static placeholderKeys = [
      'searchText',
      'filtersText',
      'sortText',
      'popularityText',
      'alphabeticallyText',
      'noResultsText',
      'resultText',
      'resultsText',
      'resultMobileText',
      'resultsMobileText',
      'noSearchResultsText',
      'searchResultText',
      'searchResultsText',
      'searchResultMobileText',
      'searchResultsMobileText',
    ]
}

customElements.define('merch-card-collection-header', MerchCardCollectionHeader);
