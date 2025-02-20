import { useService as getService } from "./utilities.js";

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
    static observedAttributes = ['data-wcs-osi', 'data-promotion-code'];

    #initialized = false;

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
        this.#initialized = true;
        this.composePromoTermsUrl();
    }

    attributeChangedCallback(_name, _oldValue, _newValue) {
        if (!this.#initialized) return;
        this.composePromoTermsUrl();
    }

    composePromoTermsUrl() {
        const osi = this.getAttribute('data-wcs-osi');
        if (!osi) {
            const fragmentId = this.closest('merch-card').querySelector('aem-fragment').getAttribute('fragment');
            console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${fragmentId}`);
            return;
        }

        const service = getService();

        const wcsOsi = [osi];
        const promotionCode = this.getAttribute('data-promotion-code');
        const { country, language, env } = service.settings;
        const options = { country, language, wcsOsi, promotionCode };

        const promises = service.resolveOfferSelectors(options);
        Promise.all(promises).then(([[offer]]) => {
          let params = `locale=${language}_${country}&country=${country}&offer_id=${offer.offerId}`;
          if (promotionCode) params += `&promotion_code=${encodeURIComponent(promotionCode)}`;
          this.href = `${getPromoTermsUrl(env)}?${params}`
        }).catch(error => {
            console.error(`Could not resolve offer selectors for id: ${osi}.`, error.message);
        });
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
