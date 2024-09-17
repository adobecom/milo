import { LitElement } from 'lit';
import { sizeStyles, styles } from './merch-card.css.js';
import { getVariantLayout, getVariantStyles } from './variants/variants.js';


import './global.css.js';
import {
    EVENT_MERCH_CARD_READY,
    EVENT_MERCH_OFFER_SELECT_READY,
    EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
    EVENT_MERCH_STORAGE_CHANGE,
} from './constants.js';

export const MERCH_CARD_NODE_NAME = 'MERCH-CARD';
export const MERCH_CARD = 'merch-card';

export class MerchCard extends LitElement {
    static properties = {
        name: { type: String, attribute: 'name', reflect: true },
        variant: { type: String, reflect: true },
        size: { type: String, attribute: 'size', reflect: true },
        badgeColor: { type: String, attribute: 'badge-color' },
        borderColor: { type: String, attribute: 'border-color' },
        badgeBackgroundColor: {
            type: String,
            attribute: 'badge-background-color',
        },
        stripSize: { type: String, attribute: 'strip-size' },
        stripBackground: { type: String, attribute: 'strip-background' },
        badgeText: { type: String, attribute: 'badge-text' },
        actionMenu: { type: Boolean, attribute: 'action-menu' },
        actionMenuContent: { type: String, attribute: 'action-menu-content' },
        customHr: { type: Boolean, attribute: 'custom-hr' },
        detailBg: { type: String, attribute: 'detail-bg' },
        secureLabel: { type: String, attribute: 'secure-label' },
        checkboxLabel: { type: String, attribute: 'checkbox-label' },
        selected: { type: Boolean, attribute: 'aria-selected', reflect: true },
        storageOption: { type: String, attribute: 'storage', reflect: true },
        stockOfferOsis: {
            type: Object,
            attribute: 'stock-offer-osis',
            converter: {
                fromAttribute: (value) => {
                    const [PUF, ABM, M2M] = value.split(',');
                    return { PUF, ABM, M2M };
                },
            },
        },
        filters: {
            type: String,
            reflect: true,
            converter: {
                fromAttribute: (value) => {
                    return Object.fromEntries(
                        value.split(',').map((filter) => {
                            const [key, order, size] = filter.split(':');
                            const value = Number(order);
                            return [
                                key,
                                {
                                    order: isNaN(value) ? undefined : value,
                                    size,
                                },
                            ];
                        }),
                    );
                },
                toAttribute: (value) => {
                    return Object.entries(value)
                        .map(([key, { order, size }]) =>
                            [key, order, size]
                                .filter((v) => v != undefined)
                                .join(':'),
                        )
                        .join(',');
                },
            },
        },
        types: {
            type: String,
            attribute: 'types',
            reflect: true,
        },
        merchOffer: { type: Object },
    };

    static styles = [styles, getVariantStyles(), ...sizeStyles()];

    customerSegment;
    marketSegment;
    variantLayout; 

    constructor() {
        super();
        this.filters = {};
        this.types = '';
        this.selected = false;
    }

    updated(changedProperties) {
        if (
            changedProperties.has('badgeBackgroundColor') ||
            changedProperties.has('borderColor')
        ) {
            this.style.border = this.computedBorderStyle;
        }
        this.updateComplete.then(async () => {
            const allPrices = Array.from(
              this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'),
            );
            // Filter out prices within the callout-content slot
            const prices = allPrices.filter(
                (price) => !price.closest('[slot="callout-content"]'),
            );
            await Promise.all(prices.map((price) => price.onceSettled()));
            this.variantLayout.postCardUpdateHook(this);
        });
    }

    render() {
      if (!this.isConnected || this.style.display === 'none') return;
      return this.variantLayout.renderLayout();
    }

    get computedBorderStyle() {
        if (this.variant !== 'twp') {
            return `1px solid ${
                this.borderColor ? this.borderColor : this.badgeBackgroundColor
            }`;
        }
        return '';
    }

    get badgeElement() {
        return this.shadowRoot.getElementById('badge');
    }

    get headingmMSlot() {
        return this.shadowRoot
            .querySelector('slot[name="heading-m"]')
            .assignedElements()[0];
    }

    get footerSlot() {
        return this.shadowRoot
            .querySelector('slot[name="footer"]')
            ?.assignedElements()[0];
    }

    get strip() {
      if (this.stripBackground) {
        switch (this.stripSize) {
            case 'wide':
                return '44px';
            case 'small':
                return '4px';
            default:
                return '0';
        }
      }
      return '';
    }

    get price() {
        return this.headingmMSlot?.querySelector('span[is="inline-price"]');
    }

    get checkoutLinks() {
        return [
            ...(this.footerSlot?.querySelectorAll('a[is="checkout-link"]') ??
                []),
        ];
    }

    async toggleStockOffer({ target }) {
        if (!this.stockOfferOsis) return;
        const elements = this.checkoutLinks;
        if (elements.length === 0) return;
        for (const element of elements) {
            await element.onceSettled();
            const planType = element.value?.[0]?.planType;
            if (!planType) return;
            const stockOfferOsi = this.stockOfferOsis[planType];
            if (!stockOfferOsi) return;
            const osis = element.dataset.wcsOsi
                .split(',')
                .filter((osi) => osi !== stockOfferOsi);

            if (target.checked) {
                osis.push(stockOfferOsi);
            }
            element.dataset.wcsOsi = osis.join(',');
        }
    }

    handleQuantitySelection(event) {
        const elements = this.checkoutLinks;
        for (const element of elements) {
            element.dataset.quantity = event.detail.option;
        }
    }

    get titleElement() {        
        return this.querySelector(this.variantLayout?.headingSelector || '.card-heading');
    }

    get title() {
        return this.titleElement?.textContent?.trim();
    }

    get description() {
        return this.querySelector('[slot="body-xs"]')?.textContent?.trim();
    }

    /**
     * If the card is the single app, set the order for all filters to 2.
     * If not, increment the order for all filters after the second card by 1.
     * @param {*} singleApp
     */
    updateFilters(singleApp) {
        const newFilters = { ...this.filters };
        Object.keys(newFilters).forEach((key) => {
            // if single app set the order for all filters to 2.
            if (singleApp) {
                newFilters[key].order = Math.min(newFilters[key].order || 2, 2);
                return;
            }
            const value = newFilters[key].order;
            // skip first card and cards without explicit order
            if (value === 1 || isNaN(value)) return;
            newFilters[key].order = Number(value) + 1;
        });
        this.filters = newFilters;
    }

    includes(text) {
        return this.textContent.match(new RegExp(text, 'i')) !== null;
    }

    get startingAt() {
      return this.classList.contains('starting-at');
    }

    connectedCallback() {
        super.connectedCallback();
        this.variantLayout = getVariantLayout(this);
        this.variantLayout.connectedCallbackHook();
        this.setAttribute('tabindex', this.getAttribute('tabindex') ?? '0');
        this.addEventListener(
            EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
            this.handleQuantitySelection,
        );
        this.addEventListener(
            EVENT_MERCH_OFFER_SELECT_READY,
            this.merchCardReady,
            { once: true },
        );
        this.updateComplete.then(() => {
            this.merchCardReady();
        });
        this.storageOptions?.addEventListener(
            'change',
            this.handleStorageChange,
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.variantLayout.disconnectedCallbackHook();

        this.removeEventListener(
            EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
            this.handleQuantitySelection,
        );
        this.storageOptions?.removeEventListener(
            EVENT_MERCH_STORAGE_CHANGE,
            this.handleStorageChange,
        );
    }
    // custom methods

    get storageOptions() {
        return this.querySelector('sp-radio-group#storage');
    }

    get storageSpecificOfferSelect() {
        const storageOption = this.storageOptions?.selected;
        if (storageOption) {
            const merchOfferSelect = this.querySelector(
                `merch-offer-select[storage="${storageOption}"]`,
            );
            if (merchOfferSelect) return merchOfferSelect;
        }
        return this.querySelector('merch-offer-select');
    }

    get offerSelect() {
        return this.storageOptions
            ? this.storageSpecificOfferSelect
            : this.querySelector('merch-offer-select');
    }

    get quantitySelect() {
        return this.querySelector('merch-quantity-select');
    }

    merchCardReady() {
        if (this.offerSelect && !this.offerSelect.planType) return;
        // add checks for other properties if needed
        this.dispatchEvent(
            new CustomEvent(EVENT_MERCH_CARD_READY, { bubbles: true }),
        );
    }

    // TODO enable with TWP //
    /* c8 ignore next 11 */
    handleStorageChange() {
        const offerSelect =
            this.closest('merch-card')?.offerSelect.cloneNode(true);
        if (!offerSelect) return;
        this.dispatchEvent(
            new CustomEvent(EVENT_MERCH_STORAGE_CHANGE, {
                detail: { offerSelect },
                bubbles: true,
            }),
        );
    }

    get dynamicPrice() {
        return this.querySelector('[slot="price"]');
    }

    // TODO enable with TWP //
    /* c8 ignore next 16 */
    selectMerchOffer(offer) {
        if (offer === this.merchOffer) return;
        this.merchOffer = offer;
        const previousPrice = this.dynamicPrice;
        if (offer.price && previousPrice) {
            const newPrice = offer.price.cloneNode(true);
            if (previousPrice.onceSettled) {
                // do not remove before placeholder is settled, otherwise other listeners may be left hanging.
                previousPrice.onceSettled().then(() => {
                    previousPrice.replaceWith(newPrice);
                });
            } else {
                previousPrice.replaceWith(newPrice);
            }
        }
    }
}

customElements.define(MERCH_CARD, MerchCard);
