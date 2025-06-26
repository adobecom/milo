import { html, css, unsafeCSS, LitElement, nothing } from 'lit';
import { DESKTOP_UP, TABLET_UP } from './media.js';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';
import { getCollectionOptions } from './variants/variants.js';
import { EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED, SORT_ORDER } from './constants.js';
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
  result: true,
  custom: false,
}

export default class MerchCardCollectionHeader extends LitElement {
    constructor() {
        super();
        this.collection ??= null;
        this.updateLiterals = this.updateLiterals.bind(this);
        this.handleSidenavAttached = this.handleSidenavAttached.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.collection?.addEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, this.updateLiterals);
        this.collection?.addEventListener(EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED, this.handleSidenavAttached);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.collection?.removeEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, this.updateLiterals);
        this.collection?.removeEventListener(EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED, this.handleSidenavAttached);
    }

    get sidenav() {
        return this.collection?.sidenav;
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
        const visibility = getCollectionOptions(this.collection?.variant)?.headerVisibility;
        const typeVisibility = this.parseVisibilityOptions(visibility, type);
        if (typeVisibility !== null) return typeVisibility;
        return this.parseVisibilityOptions(defaultVisibility, type);
    }

    get searchAction() {
        if (!this.getVisibility('search')) return nothing;
        const searchPlaceholder = getSlotText(this, 'searchText');
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
        const slotType = `${this.collection?.search ? 'search' : 'filters'}${this.isMobile || this.isTablet ? 'Mobile' : ''}`;
        return RESULT_TEXT_SLOT_NAMES[slotType][Math.min(this.collection?.resultCount, 2)];
    }

    get resultLabel() {
        if (!this.getVisibility('result')) return nothing;
        if (!this.sidenav) return nothing;
        return html`
          <div id="result" aria-live="polite">
              <slot name="${this.resultSlotName}"></slot>
          </div>`
    }

    get customArea() {
        if (!this.getVisibility('custom')) return nothing;
        const customHeaderAreaGetter = getCollectionOptions(this.collection?.variant)?.customHeaderArea;
        if (!customHeaderAreaGetter) return nothing;
        const customHeaderArea = customHeaderAreaGetter(this.collection);
        if (!customHeaderArea || customHeaderArea === nothing) return nothing;
        return html`<div id="custom">${customHeaderArea}</div>`;
    }

    // #region Handlers

    openFilters(event) {
        this.sidenav.showModal(event);
    }

    updateLiterals(event) {
        Object.keys(event.detail).forEach(key => {
            updatePlaceholders(this, key, event.detail[key]);
        })
    }

    handleSidenavAttached() {
        this.requestUpdate();
    }

    // #endregion

    render() {
        return html`
          <sp-theme color="light" scale="medium">
            <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
          </sp-theme>
        `
    }

    static styles = css`
        :host {
            --merch-card-collection-header-margin-bottom: 32px;
            --merch-card-collection-header-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-row-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-columns: auto max-content;
            --merch-card-collection-header-areas: "search search" 
                                                  "filter sort"
                                                  "result result";
            --merch-card-collection-header-result-font-size: inherit;
        }

        sp-theme {
            font-size: inherit;
        }

        #header {
            display: grid;
            gap: var(--merch-card-collection-header-gap);
            row-gap: var(--merch-card-collection-header-row-gap);
            align-items: center;
            grid-template-columns: var(--merch-card-collection-header-columns);
            grid-template-areas: var(--merch-card-collection-header-areas);
            margin-bottom: var(--merch-card-collection-header-margin-bottom);
        }

        #header:empty {
            margin-bottom: 0;
        }
        
        #search {
            grid-area: search;
        }

        #search sp-search {
            max-width: 302px;
            width: 100%;
        }

        #filter {
            grid-area: filter;
            width: 92px;
        }

        #sort {
            grid-area: sort;
            justify-self: end;
        }

        #result {
            grid-area: result;
            font-size: var(--merch-card-collection-header-result-font-size);
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
                --merch-card-collection-header-areas: "result sort";
            }
        }
    `;

    static placeholderKeys = [
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
    ]
}

customElements.define('merch-card-collection-header', MerchCardCollectionHeader);
