import { LitElement } from 'lit';
import { sizeStyles, styles } from './merch-card.css.js';
import './merch-icon.js';
import './merch-gradient.js';
import './merch-addon.js';
import {
    getVariantLayout,
    registerVariant,
    getFragmentMapping,
} from './variants/variants.js';

import './global.css.js';
import './aem-fragment.js';
import './merch-badge.js';
import './merch-mnemonic-list.js';
import './merch-whats-included.js';
import {
    EVENT_AEM_LOAD,
    EVENT_MERCH_CARD_READY,
    EVENT_MERCH_OFFER_SELECT_READY,
    EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
    EVENT_MAS_READY,
    EVENT_AEM_ERROR,
    EVENT_MAS_ERROR,
    SELECTOR_MAS_CHECKOUT_LINK,
    SELECTOR_MAS_ELEMENT,
    SELECTOR_MAS_INLINE_PRICE,
    SELECTOR_MAS_SP_BUTTON,
    MARK_START_SUFFIX,
    EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
    EVENT_MERCH_CARD_QUANTITY_CHANGE,
} from './constants.js';
import { VariantLayout } from './variants/variant-layout.js';
import { hydrate, ANALYTICS_SECTION_ATTR } from './hydrate.js';
import { getService } from './utils.js';

const MERCH_CARD = 'merch-card';
const MARK_READY_SUFFIX = ':ready';
const MARK_ERROR_SUFFIX = ':error';

// if merch card does not initialise in 20 seconds, it will dispatch mas:error event
const MERCH_CARD_LOAD_TIMEOUT = 20000;

const MARK_MERCH_CARD_PREFIX = 'merch-card:';

function priceOptionsProvider(element, options) {
    const card = element.closest(MERCH_CARD);
    if (!card) return options;
    card.variantLayout?.priceOptionsProvider?.(element, options);
}

function registerPriceOptionsProvider(masCommerceService) {
    if (masCommerceService.providers.has(priceOptionsProvider)) return;
    masCommerceService.providers.price(priceOptionsProvider);
}

export class MerchCard extends LitElement {
    static properties = {
        id: { type: String, attribute: 'id', reflect: true },
        name: { type: String, attribute: 'name', reflect: true },
        variant: { type: String, reflect: true },
        size: { type: String, attribute: 'size', reflect: true },
        badgeColor: { type: String, attribute: 'badge-color', reflect: true },
        borderColor: { type: String, attribute: 'border-color', reflect: true },
        badgeBackgroundColor: {
            type: String,
            attribute: 'badge-background-color',
            reflect: true,
        },
        backgroundImage: {
            type: String,
            attribute: 'background-image',
            reflect: true,
        },
        badgeText: { type: String, attribute: 'badge-text' },
        actionMenu: { type: Boolean, attribute: 'action-menu' },
        actionMenuLabel: { type: String, attribute: 'action-menu-label' },
        customHr: { type: Boolean, attribute: 'custom-hr' },
        consonant: { type: Boolean, attribute: 'consonant' },
        failed: { type: Boolean, attribute: 'failed', reflect: true },
        spectrum: { type: String, attribute: 'spectrum' } /* css|swc */,
        detailBg: { type: String, attribute: 'detail-bg' },
        secureLabel: { type: String, attribute: 'secure-label' },
        checkboxLabel: { type: String, attribute: 'checkbox-label' },
        addonTitle: { type: String, attribute: 'addon-title' },
        addonOffers: { type: Object, attribute: 'addon-offers' },
        selected: { type: Boolean, attribute: 'aria-selected', reflect: true },
        storageOption: { type: String, attribute: 'storage', reflect: true },
        planType: { type: String, attribute: 'plan-type', reflect: true },
        settings: {
            type: Object,
            attribute: false,
        },
        stockOfferOsis: {
            type: Object,
            attribute: 'stock-offer-osis',
            converter: {
                fromAttribute: (value) => {
                    if (!value) return;
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
        analyticsId: {
            type: String,
            attribute: ANALYTICS_SECTION_ATTR,
            reflect: true,
        },
        loading: { type: String },
    };

    static styles = [styles, ...sizeStyles()];

    static registerVariant = registerVariant;

    customerSegment;
    marketSegment;
    /**
     * @type {VariantLayout}
     */
    variantLayout;
    #log;
    #service;

    readyEventDispatched = false;
    constructor() {
        super();
        this.id = null;
        this.failed = false;
        this.filters = {};
        this.types = '';
        this.selected = false;
        this.spectrum = 'css';
        this.loading = 'lazy';
        this.handleAemFragmentEvents = this.handleAemFragmentEvents.bind(this);
    }

    static getFragmentMapping = getFragmentMapping;

    firstUpdated() {
        this.variantLayout = getVariantLayout(this, false);
        this.variantLayout?.connectedCallbackHook();
        this.aemFragment?.updateComplete.catch((e) => {
            this.#fail(e, {}, false);
            this.style.display = 'none';
        });
    }

    willUpdate(changedProperties) {
        if (changedProperties.has('variant') || !this.variantLayout) {
            this.variantLayout = getVariantLayout(this);
            this.variantLayout.connectedCallbackHook();
        }
    }

    updated(changedProperties) {
        if (
            changedProperties.has('badgeBackgroundColor') ||
            changedProperties.has('borderColor')
        ) {
            this.style.setProperty(
                '--consonant-merch-card-border',
                this.computedBorderStyle,
            );
        }
        try {
            this.variantLayout?.postCardUpdateHook(changedProperties);
        } catch (e) {
            this.#fail(`Error in postCardUpdateHook: ${e.message}`, {}, false);
        }
    }

    get theme() {
        return this.closest('sp-theme');
    }

    get dir() {
        return this.closest('[dir]')?.getAttribute('dir') ?? 'ltr';
    }

    get prices() {
        return Array.from(
            this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'),
        );
    }

    render() {
        if (
            !this.isConnected ||
            !this.variantLayout ||
            this.style.display === 'none'
        )
            return;
        return this.variantLayout.renderLayout();
    }

    get computedBorderStyle() {
        if (
            !['ccd-slice', 'ccd-suggested', 'ah-promoted-plans'].includes(
                this.variant,
            )
        ) {
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

    get price() {
        return this.headingmMSlot?.querySelector(SELECTOR_MAS_INLINE_PRICE);
    }

    get checkoutLinks() {
        return [
            ...(this.footerSlot?.querySelectorAll(SELECTOR_MAS_CHECKOUT_LINK) ??
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

    changeHandler(event) {
        if (event.target.tagName === 'MERCH-ADDON') {
            this.toggleAddon(event.target);
        }
    }

    toggleAddon(merchAddon) {
        const elements = this.checkoutLinks;
        // content toggle should be handled in the variant layout
        this.variantLayout?.toggleAddon?.(merchAddon);
        if (elements.length === 0) return;
        for (const element of elements) {
            const { offerType, planType } = element.value?.[0];
            if (!offerType || !planType) return;
            const addonOsi = merchAddon.getOsi(planType, offerType);
            const osis = element.dataset.wcsOsi
                .split(',')
                .filter((osi) => osi !== addonOsi);

            if (merchAddon.checked) {
                osis.push(addonOsi);
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
        return this.querySelector(
            this.variantLayout?.headingSelector || '.card-heading',
        );
    }

    get title() {
        return this.titleElement?.textContent?.trim();
    }

    /* c8 ignore next 3 */
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

    /* c8 ignore next 3 */
    includes(text) {
        return this.textContent.match(new RegExp(text, 'i')) !== null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.#service = getService();
        registerPriceOptionsProvider(this.#service);
        this.#log = this.#service.Log.module(MERCH_CARD);
        this.id ??=
            this.querySelector('aem-fragment')?.getAttribute('fragment');
        performance.mark(
            `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_START_SUFFIX}`,
        );
        this.addEventListener(
            EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
            this.handleQuantitySelection,
        );
        this.addEventListener(
            EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
            this.handleAddonAndQuantityUpdate,
        );
        this.addEventListener(
            EVENT_MERCH_OFFER_SELECT_READY,
            this.merchCardReady,
            { once: true },
        );
        this.updateComplete.then(() => {
            this.merchCardReady();
        });

        // aem-fragment logic
        this.addEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
        this.addEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
        this.addEventListener('change', this.changeHandler);

        if (!this.aemFragment) {
            setTimeout(() => this.checkReady(), 0);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.variantLayout?.disconnectedCallbackHook();

        this.removeEventListener(
            EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
            this.handleQuantitySelection,
        );
        this.removeEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
        this.removeEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
        this.removeEventListener('change', this.changeHandler);
        this.removeEventListener(EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE, this.handleAddonAndQuantityUpdate);
    }

    // custom methods
    async handleAemFragmentEvents(e) {
        if (!this.isConnected) return;
        if (e.type === EVENT_AEM_ERROR) {
            this.#fail(
                `AEM fragment cannot be loaded: ${e.detail.message}`,
                e.detail,
            );
        }
        if (e.type === EVENT_AEM_LOAD) {
            if (e.target.nodeName === 'AEM-FRAGMENT') {
                const fragment = e.detail;
                hydrate(fragment, this)
                    .then(() => this.checkReady())
                    .catch((e) => this.#log.error(e));
            }
        }
    }

    #fail(error, details = {}, dispatch = true) {
        this.#log.error(`merch-card: ${error}`, details);
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

    async checkReady() {
        if (!this.isConnected) return;
        const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve('timeout'), MERCH_CARD_LOAD_TIMEOUT),
        );
        if (this.aemFragment) {
            const result = await Promise.race([
                this.aemFragment.updateComplete,
                timeoutPromise,
            ]);
            if (result === false) {
                const errorMessage =
                    result === 'timeout'
                        ? `AEM fragment was not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout`
                        : 'AEM fragment cannot be loaded';
                this.#fail(errorMessage, {}, false);
                return;
            }
        }
        const masElements = [...this.querySelectorAll(SELECTOR_MAS_ELEMENT)];
        masElements.push(
            ...[...this.querySelectorAll(SELECTOR_MAS_SP_BUTTON)].map(
                (element) => element.source,
            ),
        );
        const successPromise = Promise.all(
            masElements.map((element) =>
                element.onceSettled().catch(() => element),
            ),
        ).then((elements) =>
            elements.every((el) =>
                el.classList.contains('placeholder-resolved'),
            ),
        );
        const result = await Promise.race([successPromise, timeoutPromise]);

        if (result === true) {
            performance.mark(
                `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_READY_SUFFIX}`,
            );
            if (!this.readyEventDispatched) {
                this.readyEventDispatched = true;
                this.dispatchEvent(
                    new CustomEvent(EVENT_MAS_READY, {
                        bubbles: true,
                        composed: true,
                    }),
                );
            }
            return this;
        } else {
            const { duration, startTime } = performance.measure(
                `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_ERROR_SUFFIX}`,
                `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_START_SUFFIX}`,
            );
            const details = {
                duration,
                startTime,
                ...this.#service.duration,
            };
            if (result === 'timeout') {
                this.#fail(
                    `Contains offers that were not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout`,
                    details,
                );
            } else {
                this.#fail(`Contains unresolved offers`, details);
            }
        }
    }

    get aemFragment() {
        return this.querySelector('aem-fragment');
    }

    get addon() {
        return this.querySelector('merch-addon');
    }

    /* c8 ignore next 3 */
    get quantitySelect() {
        return this.querySelector('merch-quantity-select');
    }

    get addonCheckbox() {
      return this.querySelector('merch-addon');
      return this.querySelector('merch-addon');
  }

    displayFooterElementsInColumn() {
        if (!this.classList.contains('product')) return;

        const secureTransactionLabel = this.shadowRoot.querySelector(
            '.secure-transaction-label',
        );
        const checkoutLinkCtas = this.footerSlot?.querySelectorAll(
            SELECTOR_MAS_CHECKOUT_LINK,
        );
        if (checkoutLinkCtas.length === 2 && secureTransactionLabel) {
            secureTransactionLabel.parentElement.classList.add('footer-column');
        }
    }

    merchCardReady() {
        if (this.offerSelect && !this.offerSelect.planType) return;
        // add checks for other properties if needed
        this.dispatchEvent(
            new CustomEvent(EVENT_MERCH_CARD_READY, { bubbles: true }),
        );
        this.displayFooterElementsInColumn();
    }

    /* c8 ignore next 3 */
    get dynamicPrice() {
        return this.querySelector('[slot="price"]');
    }

    handleAddonAndQuantityUpdate({ detail: { id, items } }) {
      if (!id || !items?.length) return;
      const cta = this.checkoutLinks.find(link => link.getAttribute('data-modal-id') === id);
      if (!cta) return;
      const url = new URL(cta.getAttribute('href'));
      const pa = url.searchParams.get('pa');
      const mainProductQuantity = items.find(item => item.productArrangementCode === pa)?.quantity;
      const isAddonIncluded = !!items.find(item => item.productArrangementCode !== pa);
      if (mainProductQuantity) {
        this.quantitySelect?.dispatchEvent(new CustomEvent(EVENT_MERCH_CARD_QUANTITY_CHANGE, {
          detail: { quantity: mainProductQuantity },
          bubbles: true,
          composed: true
        }));
      }
      if (this.addonCheckbox?.checked !== isAddonIncluded) {
        this.toggleStockOffer({ target: this.addonCheckbox });
        const checkboxEvent = new Event('change', {
          bubbles: true,
          cancelable: true
        });

        Object.defineProperty(checkboxEvent, 'target', {
          writable: false,
          value: { checked: isAddonIncluded }
        });
        this.addonCheckbox.handleChange(checkboxEvent);
      }
    }
}

customElements.define(MERCH_CARD, MerchCard);
