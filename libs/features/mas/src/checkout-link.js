import { ignore } from './external.js';
import {
    createMasElement,
    updateMasElement,
    MasElement,
} from './mas-element.js';
import { selectOffers, useService } from './utilities.js';

export const CLASS_NAME_DOWNLOAD = 'download';
export const CLASS_NAME_UPGRADE = 'upgrade';

export class CheckoutLink extends HTMLAnchorElement {
    static is = 'checkout-link';
    static tag = 'a';

    /* c8 ignore next 1 */
    #checkoutActionHandler;

    masElement = new MasElement(this);

    attributeChangedCallback(name, _, value) {
        this.masElement.attributeChangedCallback(name, _, value);
    }

    connectedCallback() {
        this.masElement.connectedCallback();
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.masElement.disconnectedCallback();
        this.removeEventListener('click', this.handleClick);
    }

    onceSettled() {
        return this.masElement.onceSettled();
    }

    get value() {
        return this.masElement.value;
    }

    get options() {
        return this.masElement.options;
    }

    requestUpdate(force = false) {
        return this.masElement.requestUpdate(force);
    }

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
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

        const element = createMasElement(CheckoutLink, {
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

    get isCheckoutLink() {
        return true;
    }

    /**
     * Click handler for checkout link.
     * Triggers checkout action handler, if provided.
     * @param {*} event
     */
    handleClick(event) {
        if (event.target !== this) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                }),
            );
            return;
        }
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
        overrides.imsCountry = null;
        const options = service.collectCheckoutOptions(overrides, this);
        if (!options.wcsOsi.length) return false;
        let extraOptions;
        try {
            extraOptions = JSON.parse(options.extraOptions ?? '{}');
            /* c8 ignore next 3 */
        } catch (e) {
            this.masElement.log?.error('cannot parse exta checkout options', e);
        }
        const version = this.masElement.togglePending(options);
        this.href = '';
        const promises = service.resolveOfferSelectors(options);
        let offers = await Promise.all(promises);
        // offer is expected to contain one or two offers at max (en, mult)
        offers = offers.map((offer) => selectOffers(offer, options));
        options.country = this.dataset.imsCountry || options.country;
        const checkoutAction = await service.buildCheckoutAction?.(
            offers.flat(),
            { ...extraOptions, ...options },
            this,
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
        const extraOptions = JSON.parse(this.dataset.extraOptions ?? 'null');
        options = { ...extraOptions, ...options, ...overrides };
        version ??= this.masElement.togglePending(options);
        if (this.#checkoutActionHandler) {
            /* c8 ignore next 2 */
            this.#checkoutActionHandler = undefined;
        }
        if (checkoutAction) {
            this.classList.remove(CLASS_NAME_DOWNLOAD, CLASS_NAME_UPGRADE);
            this.masElement.toggleResolved(version, offers, options);
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
            if (this.masElement.toggleResolved(version, offers, options)) {
                const url = service.buildCheckoutURL(offers, options);
                this.setAttribute('href', url);
                return true;
            }
        } else {
            const error = new Error(`Not provided: ${options?.wcsOsi ?? '-'}`);
            if (this.masElement.toggleFailed(version, error, options)) {
                this.setAttribute('href', '#');
                return true;
            }
        }
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
        updateMasElement(this, {
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

// Define custom DOM element
if (!window.customElements.get(CheckoutLink.is)) {
    window.customElements.define(CheckoutLink.is, CheckoutLink, {
        extends: CheckoutLink.tag,
    });
}
