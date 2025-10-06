import { LitElement } from 'lit';
import { sizeStyles, styles } from './merch-card.css.js';
import './merch-icon.js';
import './merch-gradient.js';
import './merch-addon.js';
import {
    getVariantLayout,
    registerVariant,
    getFragmentMapping,
    getCollectionOptions,
} from './variants/variants.js';

import './global.css.js';
import './aem-fragment.js';
import './merch-badge.js';
import './merch-mnemonic-list.js';
import './merch-whats-included.js';
import {
    EVENT_AEM_LOAD,
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
    MARK_DURATION_SUFFIX,
    EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
    EVENT_MERCH_CARD_QUANTITY_CHANGE,
} from './constants.js';
import { VariantLayout } from './variants/variant-layout.js';
import { hydrate, ANALYTICS_SECTION_ATTR } from './hydrate.js';
import { getService, printMeasure } from './utils.js';

const MERCH_CARD = 'merch-card';

// if merch card does not initialise in 20 seconds, it will dispatch mas:error event
const MERCH_CARD_LOAD_TIMEOUT = 20000;

const MARK_MERCH_CARD_PREFIX = 'merch-card:';

const VARIANTS_WITH_HEIGHT_SYNC = ['full-pricing-express', 'simplified-pricing-express'];

function priceOptionsProvider(element, options) {
    const card = element.closest(MERCH_CARD);
    if (!card) return options;
    if (card.priceLiterals) {
      options.literals ??= {};
      Object.assign(options.literals, card.priceLiterals);
    }
    card.variantLayout?.priceOptionsProvider?.(element, options);
}

function registerPriceOptionsProvider(masCommerceService) {
    if (masCommerceService.providers.has(priceOptionsProvider)) return;
    masCommerceService.providers.price(priceOptionsProvider);
}

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target.clientHeight === 0) return;
    intersectionObserver.unobserve(entry.target);
    entry.target.requestUpdate();
  });
});

let idCounter = 0;

export class MerchCard extends LitElement {
    static properties = {
        id: { type: String, attribute: 'id', reflect: true },
        name: { type: String, attribute: 'name', reflect: true },
        variant: { type: String, reflect: true },
        size: { type: String, attribute: 'size', reflect: true },
        badgeColor: { type: String, attribute: 'badge-color', reflect: true },
        borderColor: { type: String, attribute: 'border-color', reflect: true },
        backgroundColor: { type: String, attribute: 'background-color', reflect: true },
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
        priceLiterals: { type: Object },
    };

    static styles = [styles, ...sizeStyles()];

    static registerVariant = registerVariant;

    static getCollectionOptions = getCollectionOptions;

    #durationMarkName;
    #internalId; // internal unique card identifier
    #log;
    #service;
    #startMarkName;
    #resolveHydration;
    #hydrationPromise = new Promise((resolve) => {
      this.#resolveHydration = resolve;
    });

    customerSegment;
    marketSegment;
    /**
     * @type {VariantLayout}
     */
    variantLayout;

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
        this.handleMerchOfferSelectReady = this.handleMerchOfferSelectReady.bind(this);
    }

    static getFragmentMapping = getFragmentMapping;

    firstUpdated() {
        this.variantLayout = getVariantLayout(this);
        this.variantLayout?.connectedCallbackHook();
    }

    willUpdate(changedProperties) {
        if (changedProperties.has('variant') || !this.variantLayout) {
            this.variantLayout = getVariantLayout(this);
            this.variantLayout?.connectedCallbackHook();
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
        if (changedProperties.has('backgroundColor')) {
            this.style.setProperty(
                '--merch-card-custom-background-color',
                this.backgroundColor ? `var(--${this.backgroundColor})` : '',
            );
        }
        try {
            this.variantLayoutPromise = this.variantLayout?.postCardUpdateHook(changedProperties);
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
            !['ccd-slice', 'ccd-suggested', 'ah-promoted-plans', 'simplified-pricing-express', 'full-pricing-express'].includes(
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

    get descriptionSlot() {
        return this.shadowRoot
            .querySelector('slot[name="body-xs"')
            ?.assignedElements()[0];
    }

    get descriptionSlotCompare() {
        return this.shadowRoot
            .querySelector('slot[name="body-m"')
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

    get checkoutLinksDescription() {
        return [
            ...(this.descriptionSlot?.querySelectorAll(SELECTOR_MAS_CHECKOUT_LINK) ??
            []),
        ]
    }

    get checkoutLinkDescriptionCompare() {
        return [
            ...(this.descriptionSlotCompare?.querySelectorAll(SELECTOR_MAS_CHECKOUT_LINK) ??
            []),
        ]
    }

    get activeDescriptionLinks() {
        if (this.variant === 'mini-compare-chart') {
            return this.checkoutLinkDescriptionCompare;
        }
        return this.checkoutLinksDescription;
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
        this.variantLayout?.toggleAddon?.(merchAddon);
        const allLinks = [
            ...this.checkoutLinks,
            ...(this.activeDescriptionLinks ?? []),
        ];
        if (allLinks.length === 0) return;

        const updateOsi = (link) => {
            const { offerType, planType } = link.value?.[0] ?? {};
            if (!offerType || !planType) return;
            const addonOsi = merchAddon.getOsi(planType, offerType);
            const osis = (link.dataset.wcsOsi || '')
                .split(',')
                .filter((osi) => osi && osi !== addonOsi);

            if (merchAddon.checked) {
                osis.push(addonOsi);
            }
            link.dataset.wcsOsi = osis.join(',');
        };
        allLinks.forEach(updateOsi);
    }

    handleQuantitySelection(event) {
        const allLinks = [
            ...this.checkoutLinks,
            ...(this.activeDescriptionLinks ?? []),
        ];
        if (allLinks.length === 0) return;

        for (const link of allLinks) {
            link.dataset.quantity = event.detail.option;
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
        if (!this.#internalId) {
            this.#internalId = idCounter++;
        }
        if (!this.aemFragment) {
          this.#resolveHydration?.();
          this.#resolveHydration = undefined;
        }
        this.id ??=
            this.getAttribute('id') ??
            this.aemFragment?.getAttribute('fragment');

        const logId = this.id ?? this.#internalId;
        this.#startMarkName = `${MARK_MERCH_CARD_PREFIX}${logId}${MARK_START_SUFFIX}`;
        this.#durationMarkName = `${MARK_MERCH_CARD_PREFIX}${logId}${MARK_DURATION_SUFFIX}`;
        performance.mark(this.#startMarkName);
        this.#service = getService();
        registerPriceOptionsProvider(this.#service);
        this.#log = this.#service.Log.module(MERCH_CARD);
        this.addEventListener(
            EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
            this.handleQuantitySelection,
        );
        this.addEventListener(
            EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
            this.handleAddonAndQuantityUpdate,
        );
        this.addEventListener(EVENT_MERCH_OFFER_SELECT_READY, this.handleMerchOfferSelectReady);

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
        this.removeEventListener(
            EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
            this.handleAddonAndQuantityUpdate,
        );
    }

    // custom methods
    async handleAemFragmentEvents(e) {
        if (!this.isConnected) return;
        if (e.type === EVENT_AEM_ERROR) {
            this.#fail(`AEM fragment cannot be loaded`);
        }
        if (e.type === EVENT_AEM_LOAD) {
            this.failed = false;
            if (e.target.nodeName === 'AEM-FRAGMENT') {
                const fragment = e.detail;
                try {
                    if (!this.#resolveHydration) {
                      this.#hydrationPromise = new Promise((resolve) => {
                        this.#resolveHydration = resolve;
                      });
                    }
                    hydrate(fragment, this);
                } catch (e) {
                    this.#fail(`hydration has failed: ${e.message}`);
                } finally {
                    this.#resolveHydration?.();
                    this.#resolveHydration = undefined;
                }
                this.checkReady();
            }
        }
    }

    #fail(error, details = {}, dispatch = true) {
        if (!this.isConnected) return;
        const aemFragment = this.aemFragment;
        let fragmentId = aemFragment?.getAttribute('fragment');
        fragmentId = `[${fragmentId}]`;
        const detail = {
            ...this.aemFragment.fetchInfo,
            ...this.#service.duration,
            ...details,
            message: error,
        };
        this.#log.error(`merch-card${fragmentId}: ${error}`, detail);
        this.failed = true;
        if (!dispatch) return;
        this.dispatchEvent(
            new CustomEvent(EVENT_MAS_ERROR, {
                bubbles: true,
                composed: true,
                detail,
            }),
        );
    }

    async checkReady() {
      if (!this.isConnected) return;
        if (this.#hydrationPromise) {
          await this.#hydrationPromise;
          if (VARIANTS_WITH_HEIGHT_SYNC.includes(this.variantLayout)) {
            intersectionObserver.observe(this);
          }
          this.#hydrationPromise = undefined;
        }
        if (this.variantLayoutPromise) {
          await this.variantLayoutPromise;
          this.variantLayoutPromise = undefined;
        }
        const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve('timeout'), MERCH_CARD_LOAD_TIMEOUT),
        );
        if (this.aemFragment) {
            const result = await Promise.race([
                this.aemFragment.updateComplete,
                timeoutPromise,
            ]);
            if (result === false || result === 'timeout') {
                const errorMessage =
                    result === 'timeout'
                        ? `AEM fragment was not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout`
                        : 'AEM fragment cannot be loaded';
                this.#fail(errorMessage, {}, false);
                return;
            }
        }
        const masElements = [...this.querySelectorAll(SELECTOR_MAS_ELEMENT)];
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
            this.measure = performance.measure(
                this.#durationMarkName,
                this.#startMarkName,
            );
            const detail = {
                ...this.aemFragment?.fetchInfo,
                ...this.#service.duration,
                measure: printMeasure(this.measure),
            };
            this.dispatchEvent(
                new CustomEvent(EVENT_MAS_READY, {
                    bubbles: true,
                    composed: true,
                    detail,
                }),
            );
            return this;
        } else {
            this.measure = performance.measure(
                this.#durationMarkName,
                this.#startMarkName,
            );
            const details = {
                measure: printMeasure(this.measure),
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

    handleMerchOfferSelectReady() {
        if (this.offerSelect && !this.offerSelect.planType) return;
        this.displayFooterElementsInColumn();
    }

    /* c8 ignore next 3 */
    get dynamicPrice() {
        return this.querySelector('[slot="price"]');
    }

    handleAddonAndQuantityUpdate({ detail: { id, items } }) {
        if (!id || !items?.length) return;
        const parentTab = this.closest('[role="tabpanel"][hidden="true"]');
        if (parentTab) return;
        
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
      if (this.addonCheckbox && this.addonCheckbox.checked !== isAddonIncluded) {
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

    get prices() {
        return Array.from(
            this.querySelectorAll(SELECTOR_MAS_INLINE_PRICE),
        );
    }

    get promoPrice() {
        if (!this.querySelector(`span.price-strikethrough`)) return;
        let price = this.querySelector(`.price.price-alternative`);
        if (!price) {
          price = this.querySelector(`${SELECTOR_MAS_INLINE_PRICE}[data-template="price"] > span`);
        }
        if (!price) return;
        price = price.innerText;
        return price;
    }

    get #regularPrice() { 
        return this.querySelector(`span.price-strikethrough`) ?? this.querySelector(`${SELECTOR_MAS_INLINE_PRICE}[data-template="price"] > span`);
    }

    get #legal() {
        return this.querySelector(`${SELECTOR_MAS_INLINE_PRICE}[data-template="legal"]`);
    }

    get regularPrice() {
        return this.#regularPrice?.innerText;
    }

    get promotionCode() {
        const promotionCodes = [...this.querySelectorAll(`${SELECTOR_MAS_INLINE_PRICE}[data-promotion-code],${SELECTOR_MAS_CHECKOUT_LINK}[data-promotion-code]`)].map(el => el.dataset.promotionCode);
        // Check if all promotion codes are the same
        const uniqueCodes = [...new Set(promotionCodes)];
        if (uniqueCodes.length > 1) {
            this.#log?.warn(`Multiple different promotion codes found: ${uniqueCodes.join(', ')}`);
        }
        return promotionCodes[0];
    }

    get annualPrice() {
        const price = this.querySelector(`${SELECTOR_MAS_INLINE_PRICE}[data-template="price"] > .price.price-annual`);
        return price?.innerText;
    }

    get promoText() {
        return undefined;
    }

    get taxText() {
        return (this.#legal ?? this.#regularPrice)?.querySelector('span.price-tax-inclusivity')?.textContent?.trim() || undefined;
    }

    get recurrenceText() {
        return this.#regularPrice?.querySelector('span.price-recurrence')?.textContent?.trim();
    }

    get planTypeText() {
        return this.querySelector('[is="inline-price"][data-template="legal"] span.price-plan-type')?.textContent?.trim();
    }

    get seeTermsInfo() {
        const seeTerms = this.querySelector('a[is="upt-link"]');
        if (!seeTerms) return undefined;
        return this.#getCta(seeTerms);
    }

    get renewalText() {
      return this.querySelector('span.renewal-text')?.textContent?.trim();
    }

    get promoDurationText() {
      return this.querySelector('span.promo-duration-text')?.textContent?.trim();
    }

    get ctas() {
        const ctas = this.querySelector('[slot="ctas"], [slot="footer"]')?.querySelectorAll(
            `${SELECTOR_MAS_CHECKOUT_LINK}, a`,
        );
        return Array.from(ctas ?? []);
    }

    #getCta(element) {
      if (!element) return undefined;
      return {
        text: element.innerText.trim(),
        analyticsId: element.dataset.analyticsId,
        href: element.getAttribute('href') ?? element.dataset.href,
      };
    }


    get primaryCta() {
      return this.#getCta(this.ctas.find(cta => cta.variant === 'accent' || cta.matches('.spectrum-Button--accent,.con-button.blue')));
    }

    get secondaryCta() {
      return this.#getCta(this.ctas.find(cta => cta.variant !== 'accent' && !cta.matches('.spectrum-Button--accent,.con-button.blue')));
    }
}

customElements.define(MERCH_CARD, MerchCard);
