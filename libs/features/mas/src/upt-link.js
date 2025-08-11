import { getService } from './utils.js';
import { MasElement } from './mas-element.js';

function getPromoTermsUrl(env) {
    const host = env === 'PRODUCTION' ? 'www.adobe.com' : 'www.stage.adobe.com';
    return `https://${host}/offers/promo-terms.html`;
}

/**
 * Universal Promo Terms Link
 */
export class UptLink extends HTMLAnchorElement {
    static is = 'upt-link';
    static tag = 'a';
    static observedAttributes = ['data-wcs-osi', 'data-promotion-code', 'data-ims-country'];
    masElement = new MasElement(this);

    #service;

    get isUptLink() {
        return true;
    }

    constructor() {
        super();
        this.setAttribute('is', UptLink.is);
    }

    /**
     * @param {string} osi 
     * @param {string} promotionCode 
     */
    initializeWcsData(osi, promotionCode) {
        this.setAttribute('data-wcs-osi', osi);
        if (promotionCode)
            this.setAttribute('data-promotion-code', promotionCode);
    }
    
    attributeChangedCallback(name, oldValue, value) {
        this.masElement.attributeChangedCallback(name, oldValue, value);
    }

    connectedCallback() {
        this.masElement.connectedCallback();
        this.#service = getService();
        if (this.#service) {
          this.log = this.#service.log.module('upt-link');
        }
    }

    disconnectedCallback() {
        this.masElement.disconnectedCallback();
        this.#service = undefined;
    }

    requestUpdate(force = false) {
        this.masElement.requestUpdate(force);
    }

    onceSettled() {
        return this.masElement.onceSettled();
    }

    async render() {
        const service = getService();
        if (!service) return false;

        if (!this.dataset.imsCountry) {
            service.imsCountryPromise.then((countryCode) => {
                if (countryCode) this.dataset.imsCountry = countryCode;
            });
        }

        const options = service.collectCheckoutOptions({}, this);
        if (!options.wcsOsi) {
            this.log.error(`Missing 'data-wcs-osi' attribute on upt-link.`);
            return false;
        }

        const version = this.masElement.togglePending(options);
        const promises = service.resolveOfferSelectors(options);

        try {
            const [[offer]] = await Promise.all(promises);
            const { country, language, env } = options;
            let params = `locale=${language}_${country}&country=${country}&offer_id=${offer.offerId}`;
            const promotionCode = this.getAttribute('data-promotion-code');
            if (promotionCode) params += `&promotion_code=${encodeURIComponent(promotionCode)}`;
            this.href = `${getPromoTermsUrl(env)}?${params}`;
            this.masElement.toggleResolved(version, offer, options);
        } catch (error) {
            const masError = new Error(`Could not resolve offer selectors for id: ${options.wcsOsi}.`, error.message);
            this.masElement.toggleFailed(version, masError, options);
            return false;
        }
    }


    /**
     * @param {HTMLElement} element 
     */
    static createFrom(element) {
        const uptLink = new UptLink();
        for (const attribute of element.attributes) {
            if (attribute.name === 'is') continue;
            if (attribute.name === 'class' && attribute.value.includes('upt-link'))
                uptLink.setAttribute('class', attribute.value.replace('upt-link', '').trim());
            else
                uptLink.setAttribute(attribute.name, attribute.value);
        }
        uptLink.innerHTML = element.innerHTML;
        uptLink.setAttribute('tabindex', 0);
        return uptLink;
    }
}

// Define custom DOM element
if (!window.customElements.get(UptLink.is)) {
  window.customElements.define(UptLink.is, UptLink, {
      extends: UptLink.tag,
  });
}
