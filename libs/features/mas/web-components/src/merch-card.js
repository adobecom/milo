import { html, LitElement, nothing } from 'lit';
import { sizeStyles, styles } from './merch-card.css.js';

import {
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    ARROW_UP,
    ENTER,
} from './focus.js';
import './global.css.js';
import {
    EVENT_MERCH_CARD_READY,
    EVENT_MERCH_OFFER_SELECT_READY,
    EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
    EVENT_MERCH_STORAGE_CHANGE,
} from './constants.js';
import { getTextNodes } from './utils.js';

export const MERCH_CARD_NODE_NAME = 'MERCH-CARD';
export const MERCH_CARD = 'merch-card';

const FOOTER_ROW_MIN_HEIGHT = 32; // as per the XD.

const MINI_COMPARE_CHART = 'mini-compare-chart';

const getRowMinHeightPropertyName = (index) =>
    `--consonant-merch-card-footer-row-${index}-min-height`;

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

    static styles = [styles, ...sizeStyles()];

    customerSegment;
    marketSegment;

    constructor() {
        super();
        this.filters = {};
        this.types = '';
        this.selected = false;
    }

    #container;

    updated(changedProperties) {
        if (changedProperties.has('badgeBackgroundColor') || changedProperties.has('borderColor')) {
            this.style.border = this.computedBorderStyle;
        }
        this.updateComplete.then(async () => {
            const prices = Array.from(
                this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'),
            );
            await Promise.all(prices.map((price) => price.onceSettled()));
            this.adjustTitleWidth();
            this.adjustMiniCompareBodySlots();
            this.adjustMiniCompareFooterRows();
        });
    }

    get computedBorderStyle() {
        if (this.variant !== 'twp') {
            return `1px solid ${
                this.borderColor ? this.borderColor : this.badgeBackgroundColor
            }`;
        }
        return '';
    }

    get evergreen() {
        return this.classList.contains('intro-pricing');
    }

    get stockCheckbox() {
        return this.checkboxLabel
            ? html`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`
            : '';
    }

    get cardImage() {
        return html` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`;
    }

    get secureLabelFooter() {
        const secureLabel = this.secureLabel
            ? html`<span class="secure-transaction-label"
                  >${this.secureLabel}</span
              >`
            : '';
        return html`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
    }

    get miniCompareFooter() {
        const secureLabel = this.secureLabel
            ? html`<slot name="secure-transaction-label">
                  <span class="secure-transaction-label"
                      >${this.secureLabel}</span
                  ></slot
              >`
            : html`<slot name="secure-transaction-label"></slot>`;
        return html`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
    }

    get badge() {
        let additionalStyles;
        if (!this.badgeBackgroundColor || !this.badgeColor || !this.badgeText) {
            return;
        }
        if (this.evergreen) {
            additionalStyles = `border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`;
        }
        return html`
            <div
                id="badge"
                class="${this.variant}-badge"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${additionalStyles}"
            >
                ${this.badgeText}
            </div>
        `;
    }

    get badgeElement() {
        return this.shadowRoot.getElementById('badge');
    }

    getContainer() {
        return this.closest('[class*="-merch-cards"]') ?? this.parentElement;
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

    get price() {
        return this.headingmMSlot?.querySelector('span[is="inline-price"]');
    }

    get checkoutLinks() {
        return [
            ...(this.footerSlot?.querySelectorAll('a[is="checkout-link"]') ??
                []),
        ];
    }

    get isMobileOrTablet() {
        return window.matchMedia('(max-width: 1024px)').matches;
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

    toggleActionMenu(e) {
        const retract = e?.type === 'mouseleave' ? true : undefined;
        const actionMenuContentSlot = this.shadowRoot.querySelector(
            'slot[name="action-menu-content"]',
        );
        if (!actionMenuContentSlot) return;
        actionMenuContentSlot.classList.toggle('hidden', retract);
    }

    handleQuantitySelection(event) {
        const elements = this.checkoutLinks;
        for (const element of elements) {
            element.dataset.quantity = event.detail.option;
        }
    }

    get titleElement() {
        const heading =
            this.variant === 'special-offers'
                ? this.querySelector('[slot="detail-m"]')
                : this.querySelector('[slot="heading-xs"]');
        return heading;
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

    render() {
        if (!this.isConnected || this.style.display === 'none') return;
        switch (this.variant) {
            case 'special-offers':
                return this.renderSpecialOffer();
            case 'segment':
                return this.renderSegment();
            case 'plans':
                return this.renderPlans();
            case 'catalog':
                return this.renderCatalog();
            case 'image':
                return this.renderImage();
            case 'product':
                return this.renderProduct();
            case 'inline-heading':
                return this.renderInlineHeading();
            case MINI_COMPARE_CHART:
                return this.renderMiniCompareChart();
            case 'ccd-action':
                return this.renderCcdAction();
            case 'twp':
                return this.renderTwp();
            default:
                // this line should never hit, to check.
                return this.renderProduct();
        }
    }

    renderSpecialOffer() {
        return html`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen
                ? html`
                      <div
                          class="detail-bg-container"
                          style="background: ${this['detailBg']}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `
                : html`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`;
    }

    renderSegment() {
        return html` ${this.badge}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="callout-text"></slot>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            ${this.secureLabelFooter}`;
    }

    renderPlans() {
        return html` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="callout-text"></slot>            
                <slot name="body-xs"></slot>    
                ${this.stockCheckbox}
            </div>
            <slot name="quantity-select"></slot>
            ${this.secureLabelFooter}`;
    }


    get promoBottom() {
        return this.classList.contains('promo-bottom');
    }

    renderCatalog() {
        return html` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                        ${this.isMobileOrTablet && this.actionMenu
                            ? 'always-visible'
                            : ''}
                        ${!this.actionMenu ? 'hidden' : 'invisible'}"
                        @click="${this.toggleActionMenu}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
                    ${!this.actionMenuContent ? 'hidden' : ''}"
                    >${this.actionMenuContent}</slot
                >
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${!this.promoBottom ? html`<slot name="promo-text"></slot><slot name="callout-text"></slot>`: ''}
                <slot name="body-xs"></slot>
                ${this.promoBottom ? html`<slot name="promo-text"></slot><slot name="callout-text"></slot>`: ''}
            </div>
            ${this.secureLabelFooter}`;
    }

    renderImage() {
        return html`${this.cardImage}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen
                ? html`
                      <div
                          class="detail-bg-container"
                          style="background: ${this['detailBg']}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `
                : html`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`;
    }

    renderInlineHeading() {
        return html` ${this.badge}
            <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot>
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            ${!this.customHr ? html`<hr />` : ''} ${this.secureLabelFooter}`;
    }

    renderProduct() {
        return html` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="callout-text"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.secureLabelFooter}`;
    }

    renderMiniCompareChart() {
        // Define the HTML structure for the 'mini-compare-chart' variant here
        const { badge } = this;
        return html` <div class="top-section${badge ? ' badge' : ''}">
                <slot name="icons"></slot> ${badge}
            </div>
            <slot name="heading-m"></slot>
            <slot name="body-m"></slot>
            <slot name="heading-m-price"></slot>
            <slot name="body-xxs"></slot>
            <slot name="price-commitment"></slot>
            <slot name="offers"></slot>
            <slot name="promo-text"></slot>
            <slot name="callout-text"></slot>
            ${this.miniCompareFooter}
            <slot name="footer-rows"><slot name="body-s"></slot></slot>`;
    }

    renderTwp() {
        return html`${this.badge}
            <div class="top-section">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs-top"></slot>
            </div>
            <div class="body">
                <slot name="body-xs"></slot>
            </div>
            <footer><slot name="footer"></slot></footer>`;
    }

    get defaultSlot() {
        const defaultSlotElement = this.querySelector(
            ':scope > a:not([slot]),:scope > p:not([slot]),:scope > div:not([slot]),:scope > span:not([slot])',
        );
        if (!defaultSlotElement) return nothing;
        return html`<slot></slot>`;
    }

    renderCcdAction() {
        return html` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <footer><slot name="footer"></slot></footer>
            ${this.defaultSlot}
        </div>`;
    }

    connectedCallback() {
        super.connectedCallback();
        this.#container = this.getContainer();
        this.setAttribute('tabindex', this.getAttribute('tabindex') ?? '0');
        this.addEventListener('keydown', this.keydownHandler);
        this.addEventListener('mouseleave', this.toggleActionMenu);
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
        // this.appendInvisibleSpacesToFooterLinks();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('keydown', this.keydownHandler);
        this.removeEventListener(
            EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
            this.handleQuantitySelection,
        );
        this.storageOptions?.removeEventListener(
            EVENT_MERCH_STORAGE_CHANGE,
            this.handleStorageChange,
        );
    }

    appendInvisibleSpacesToFooterLinks() {
        // append invisible spaces every 7 chars so that text wraps correctly on mobile.
        [...this.querySelectorAll('[slot="footer"] a')].forEach((link) => {
            const textNodes = getTextNodes(link);
            // find words and add invisible space
            textNodes.forEach((node) => {
                const text = node.textContent;
                const words = text.split(' ');
                const newText = words
                    .map((word) => word.match(/.{1,7}/g)?.join('\u200B'))
                    .join(' ');
                node.textContent = newText;
            });
        });
    }

    // custom methods
    keydownHandler(e) {
        const currentCard =
            document.activeElement?.closest(MERCH_CARD_NODE_NAME);
        if (!currentCard) return;
        function selectNextCard(x, y) {
            const el = document
                .elementFromPoint(x, y)
                ?.closest(MERCH_CARD_NODE_NAME);
            if (el) {
                currentCard.selected = false;
                e.preventDefault();
                e.stopImmediatePropagation();
                el.focus();
                el.selected = true;
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        const { x, y, width, height } = currentCard.getBoundingClientRect();
        const offset = 64;

        const { code } = e;
        if (code === 'Tab') {
            const focusableElements = Array.from(
                this.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
                ),
            );
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement =
                focusableElements[focusableElements.length - 1];

            if (
                !e.shiftKey &&
                document.activeElement === lastFocusableElement
            ) {
                e.preventDefault();
                e.stopImmediatePropagation();
            } else if (
                e.shiftKey &&
                document.activeElement === firstFocusableElement
            ) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        } else {
            switch (code) {
                case ARROW_LEFT:
                    selectNextCard(x - offset, y);
                    break;
                case ARROW_RIGHT:
                    selectNextCard(x + width + offset, y);
                    break;
                case ARROW_UP:
                    selectNextCard(x, y - offset);
                    break;
                case ARROW_DOWN:
                    selectNextCard(x, y + height + offset);
                    break;
                case ENTER:
                    if (this.variant === 'twp') return;
                    this.footerSlot?.querySelector('a')?.click();
                    break;
            }
        }
    }

    updateMiniCompareElementMinHeight(el, name) {
        const elMinHeightPropertyName = `--consonant-merch-card-mini-compare-${name}-height`;
        const height = Math.max(
            0,
            parseInt(window.getComputedStyle(el).height) || 0,
        );
        const maxMinHeight =
            parseInt(
                this.#container.style.getPropertyValue(elMinHeightPropertyName),
            ) || 0;
        if (height > maxMinHeight) {
            this.#container.style.setProperty(
                elMinHeightPropertyName,
                `${height}px`,
            );
        }
    }

    async adjustTitleWidth() {
        if (!['segment', 'plans'].includes(this.variant)) return;
        const cardWidth = this.getBoundingClientRect().width;
        const badgeWidth =
            this.badgeElement?.getBoundingClientRect().width || 0;
        if (cardWidth === 0 || badgeWidth === 0) return;
        this.style.setProperty(
            '--consonant-merch-card-heading-xs-max-width',
            `${Math.round(cardWidth - badgeWidth - 16)}px`, // consonant-merch-spacing-xs
        );
    }

    async adjustMiniCompareBodySlots() {
        if (this.variant !== MINI_COMPARE_CHART) return;
        if (this.getBoundingClientRect().width === 0) return;

        this.updateMiniCompareElementMinHeight(
            this.shadowRoot.querySelector('.top-section'),
            'top-section',
        );

        const slots = [
            'heading-m',
            'body-m',
            'heading-m-price',
            'price-commitment',
            'offers',
            'promo-text',
            'secure-transaction-label',
        ];

        slots.forEach((slot) =>
            this.updateMiniCompareElementMinHeight(
                this.shadowRoot.querySelector(`slot[name="${slot}"]`),
                slot,
            ),
        );
        this.updateMiniCompareElementMinHeight(
            this.shadowRoot.querySelector('footer'),
            'footer',
        );

        const badge = this.shadowRoot.querySelector(
            '.mini-compare-chart-badge',
        );
        if (badge && badge.textContent !== '') {
            this.#container.style.setProperty(
                '--consonant-merch-card-mini-compare-top-section-mobile-height',
                '32px',
            );
        }
    }

    adjustMiniCompareFooterRows() {
        if (this.variant !== MINI_COMPARE_CHART) return;
        if (this.getBoundingClientRect().width === 0) return;
        const footerRows = this.querySelector('[slot="footer-rows"]');
        [...footerRows.children].forEach((el, index) => {
            const height = Math.max(
                FOOTER_ROW_MIN_HEIGHT,
                parseInt(window.getComputedStyle(el).height) || 0,
            );
            const maxMinHeight =
                parseInt(
                    this.#container.style.getPropertyValue(
                        getRowMinHeightPropertyName(index + 1),
                    ),
                ) || 0;
            if (height > maxMinHeight) {
                this.#container.style.setProperty(
                    getRowMinHeightPropertyName(index + 1),
                    `${height}px`,
                );
            }
        });
    }

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
