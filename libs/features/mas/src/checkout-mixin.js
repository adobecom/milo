import {
    createMasElement,
    updateMasElement,
    MasElement,
} from './mas-element.js';
import { selectOffers, getService } from './utilities.js';
import { MODAL_TYPE_3_IN_1 } from '../src/constants.js';

export const CLASS_NAME_DOWNLOAD = 'download';
export const CLASS_NAME_UPGRADE = 'upgrade';
const CHECKOUT_PARAM_VALUE_MAPPING = {
  e: 'EDU',
  t: 'TEAM',
};

export function createCheckoutElement(Class, options = {}, innerHTML = '') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const service = getService();
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
        analyticsId,
    } = service.collectCheckoutOptions(options);

    const element = createMasElement(Class, {
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
        analyticsId,
    });
    if (innerHTML)
        element.innerHTML = `<span style="pointer-events: none;">${innerHTML}</span>`;
    return element;
}

export function CheckoutMixin(Base) {
    return class CheckoutBase extends Base {
        /* c8 ignore next 1 */
        checkoutActionHandler;

        masElement = new MasElement(this);

        attributeChangedCallback(name, oldValue, value) {
            this.masElement.attributeChangedCallback(name, oldValue, value);
        }

        connectedCallback() {
            this.masElement.connectedCallback();
            this.addEventListener('click', this.clickHandler);
        }

        disconnectedCallback() {
            this.masElement.disconnectedCallback();
            this.removeEventListener('click', this.clickHandler);
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

        get marketSegment() {
          const value = this.options?.ms ?? this.value?.[0].marketSegments?.[0];
          return CHECKOUT_PARAM_VALUE_MAPPING[value] ?? value;
        }

        get customerSegment() {
          const value = this.options?.cs ?? this.value?.[0]?.customerSegment;
          return CHECKOUT_PARAM_VALUE_MAPPING[value] ?? value;
        }

        get is3in1Modal() {
          return Object.values(MODAL_TYPE_3_IN_1).includes(this.getAttribute('data-modal'));
        }
        
        get isOpen3in1Modal() {
          const masFF3in1 = document.querySelector('meta[name=mas-ff-3in1]');
          return this.is3in1Modal && (!masFF3in1 || masFF3in1.content !== 'off');
        }

        requestUpdate(force = false) {
            return this.masElement.requestUpdate(force);
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

        async render(overrides = {}) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const service = getService();
            if (!service) return false;
            if (!this.dataset.imsCountry) {
                service.imsCountryPromise.then((countryCode) => {
                    if (countryCode) this.dataset.imsCountry = countryCode;
                });
            }
            overrides.imsCountry = null;
            const options = service.collectCheckoutOptions(overrides, this);
            if (!options.wcsOsi.length) return false;
            let extraOptions;
            try {
                extraOptions = JSON.parse(options.extraOptions ?? '{}');
                /* c8 ignore next 3 */
            } catch (e) {
                this.masElement.log?.error(
                    'cannot parse exta checkout options',
                    e,
                );
            }
            const version = this.masElement.togglePending(options);
            this.setCheckoutUrl('');
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
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const service = getService();
            if (!service) return false;
            const extraOptions = JSON.parse(
                this.dataset.extraOptions ?? 'null',
            );
            options = { ...extraOptions, ...options, ...overrides };
            version ??= this.masElement.togglePending(options);
            if (this.checkoutActionHandler) {
                /* c8 ignore next 2 */
                this.checkoutActionHandler = undefined;
            }
            if (checkoutAction) {
                this.classList.remove(CLASS_NAME_DOWNLOAD, CLASS_NAME_UPGRADE);
                this.masElement.toggleResolved(version, offers, options);
                const { url, text, className, handler } = checkoutAction;
                if (url) {
                  this.setCheckoutUrl(url);
                }
                if (text) this.firstElementChild.innerHTML = text;
                if (className) this.classList.add(...className.split(' '));
                if (handler) {
                    this.setCheckoutUrl('#');
                    this.checkoutActionHandler = handler.bind(this);
                }
            }
            if (offers.length) {
                if (this.masElement.toggleResolved(version, offers, options)) {
                    if (!this.classList.contains(CLASS_NAME_DOWNLOAD) && !this.classList.contains(CLASS_NAME_UPGRADE)) {
                      const url = service.buildCheckoutURL(offers, options);
                      this.setCheckoutUrl(options.modal === 'true' ? '#' : url);
                    }
                    return true;
                }
            } else {
                const error = new Error(
                    `Not provided: ${options?.wcsOsi ?? '-'}`,
                );
                if (this.masElement.toggleFailed(version, error, options)) {
                    this.setCheckoutUrl('#');
                    return true;
                }
            }
        }

        setCheckoutUrl() {
            // to be implemented in the subclass
        }

        clickHandler(e) {
            // to be implemented in the subclass
        }

        updateOptions(options = {}) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const service = getService();
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
    };
}
