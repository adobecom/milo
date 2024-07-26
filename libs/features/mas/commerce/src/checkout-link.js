import { ignore } from './external.js';
import {
    createPlaceholder,
    definePlaceholder,
    selectPlaceholders,
    updatePlaceholder,
} from './placeholder.js';
import { selectOffers, useService } from './utilities.js';

export const CLASS_NAME_DOWNLOAD = 'download';
export const CLASS_NAME_UPGRADE = 'upgrade';

export class HTMLCheckoutAnchorElement extends HTMLAnchorElement {
    static is = 'checkout-link';
    static tag = 'a';

    #checkoutActionHandler;

    constructor() {
        super();
        this.addEventListener('click', this.clickHandler);
    }

    static get observedAttributes() {
        return [
            'data-checkout-workflow',
            'data-checkout-workflow-step',
            'data-extra-options',
            'data-ims-country',
            'data-perpetual',
            'data-promotion-code',
            'data-quantity',
            'data-template',
            'data-wcs-osi',
            'data-entitlement',
            'data-upgrade',
            'data-modal',
        ];
    }

    /** @type {Commerce.Checkout.PlaceholderConstructor["createCheckoutLink"]} */
    static createCheckoutLink(options = {}, innerHTML = '') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = useService();
        if (!service) return null;
        const {
            checkoutMarketSegment,
            checkoutWorkflow,
            checkoutWorkflowStep,
            entitlement,
            upgrade,
            modal,
            perpetual,
            promotionCode,
            quantity,
            wcsOsi,
            extraOptions,
        } = service.collectCheckoutOptions(options);
        /** @type {Commerce.Checkout.Placeholder} */
        // @ts-ignore
        const element = createPlaceholder(HTMLCheckoutAnchorElement, {
            checkoutMarketSegment,
            checkoutWorkflow,
            checkoutWorkflowStep,
            entitlement,
            upgrade,
            modal,
            perpetual,
            promotionCode,
            quantity,
            wcsOsi,
            extraOptions,
        });
        if (innerHTML) element.innerHTML = `<span>${innerHTML}</span>`;
        return element;
    }

    // TODO: consider moving this function to the `web-components` package
    /** @type {Commerce.Checkout.PlaceholderConstructor["getCheckoutLinks"]} */
    static getCheckoutLinks(container) {
        /** @type {Commerce.Checkout.Placeholder[]} */
        // @ts-ignore
        const elements = selectPlaceholders(
            HTMLCheckoutAnchorElement,
            container,
        );
        return elements;
    }

    get isCheckoutLink() {
        return true;
    }

    /**
     * Returns `this`, typed as Placeholder mixin.
     * @type {Commerce.Checkout.Placeholder}
     */
    get placeholder() {
        // @ts-ignore
        return this;
    }

    /**
     * Click handler for checkout link.
     * Triggers checkout action handler, if provided.
     * @param {*} event
     */
    clickHandler(event) {
        this.#checkoutActionHandler?.(event);
    }

    async render(overrides = {}) {
        if (!this.isConnected) return false;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = useService();
        if (!service) return false;
        if (!this.dataset.imsCountry) {
            service.imsCountryPromise.then((countryCode) => {
                if (countryCode) this.dataset.imsCountry = countryCode;
            }, ignore);
        }
        const options = service.collectCheckoutOptions(
            overrides,
            this.placeholder,
        );
        if (!options.wcsOsi.length) return false;
        let extraOptions;
        try {
            // @ts-ignore
            extraOptions = JSON.parse(options.extraOptions ?? '{}');
        } catch (e) {
            this.placeholder.log.error('cannot parse exta checkout options', e);
        }
        const version = this.placeholder.togglePending(options);
        this.href = '';
        const promises = service.resolveOfferSelectors(options);
        let offers = await Promise.all(promises);
        // offer is expected to contain one or two offers at max (en, mult)
        offers = offers.map((offer) => selectOffers(offer, options));
        const checkoutAction = await service.buildCheckoutAction(
            offers.flat(),
            { ...extraOptions, ...options },
        );
        return this.renderOffers(
            offers.flat(),
            options,
            {},
            checkoutAction,
            version,
        );
    }

    /**
     * Renders checkout link href for provided offers into this component.
     * @param {Commerce.Wcs.Offer[]} offers
     * @param {Commerce.Checkout.Options} options
     * @param {Commerce.Checkout.AnyOptions} overrides
     * @param {Commerce.Checkout.CheckoutAction} checkoutAction
     * @param {number} version
     */
    renderOffers(
        offers,
        options,
        overrides = {},
        checkoutAction = undefined,
        version = undefined,
    ) {
        if (!this.isConnected) return false;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = useService();
        if (!service) return false;
        const extraOptions = JSON.parse(
            this.placeholder.dataset.extraOptions ?? 'null',
        );
        options = { ...extraOptions, ...options, ...overrides };
        version ??= this.placeholder.togglePending(options);
        if (this.#checkoutActionHandler) {
            this.#checkoutActionHandler = undefined;
        }
        if (checkoutAction) {
            this.classList.remove(CLASS_NAME_DOWNLOAD, CLASS_NAME_UPGRADE);
            this.placeholder.toggleResolved(version, offers, options);
            const { url, text, className, handler } = checkoutAction;
            if (url) this.href = url;
            if (text) this.firstElementChild.innerHTML = text;
            if (className) this.classList.add(...className.split(' '));
            if (handler) {
                this.setAttribute('href', '#');
                this.#checkoutActionHandler = handler.bind(this);
            }
            return true;
        } else if (offers.length) {
            if (this.placeholder.toggleResolved(version, offers, options)) {
                const url = service.buildCheckoutURL(offers, options);
                this.setAttribute('href', url);
                return true;
            }
        } else {
            const error = new Error(`Not provided: ${options?.wcsOsi ?? '-'}`);
            if (this.placeholder.toggleFailed(version, error, options)) {
                this.setAttribute('href', '#');
                return true;
            }
        }
        return false;
    }

    updateOptions(options = {}) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const service = useService();
        if (!service) return false;
        const {
            checkoutMarketSegment,
            checkoutWorkflow,
            checkoutWorkflowStep,
            entitlement,
            upgrade,
            modal,
            perpetual,
            promotionCode,
            quantity,
            wcsOsi,
        } = service.collectCheckoutOptions(options);
        updatePlaceholder(this, {
            checkoutMarketSegment,
            checkoutWorkflow,
            checkoutWorkflowStep,
            entitlement,
            upgrade,
            modal,
            perpetual,
            promotionCode,
            quantity,
            wcsOsi,
        });
        return true;
    }
}

export const CheckoutLink = definePlaceholder(HTMLCheckoutAnchorElement);
