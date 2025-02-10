import { useService } from "./utilities.js";

const PROMO_TERMS_URL = 'https://www.adobe.com/offers/promo-terms.html';

/**
 * Universal Promo Terms Link
 */
export class UptLink extends HTMLAnchorElement {
  static is = 'upt-link';
  static tag = 'a';

  constructor() {
      super();
      const service = useService();
      const { country, language } = service.settings;
      const wcsOsi = [this.getAttribute('data-wcs-osi')];
      const promotionCode = this.getAttribute('data-promotion-code');
      const options = { country, language, wcsOsi, promotionCode }
      const promises = service.resolveOfferSelectors(options);
      console.log('Before promise');
      Promise.all(promises).then(([offer]) => {
        console.log('After promise: ', offer, language, country, promotionCode);
        this.href = `${PROMO_TERMS_URL}?locale=${language}_${country}&promotion_code=${promotionCode}&country=${country}&offer_id=${offer.offerId}`
      })
  }

  get isUptLink() {
      return true;
  }
}

// Define custom DOM element
if (!window.customElements.get(UptLink.is)) {
  window.customElements.define(UptLink.is, UptLink, {
      extends: UptLink.tag,
  });
}