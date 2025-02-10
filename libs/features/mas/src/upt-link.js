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
      const dataWcsOsi = this.getAttribute('data-wcs-osi');
      if (!dataWcsOsi) {
          console.error('"data-wcs-osi" attribute missing from upt-link.')
          return;
      }
      const wcsOsi = [dataWcsOsi];
      const promotionCode = this.getAttribute('data-promotion-code');
      const options = { country, language, wcsOsi, promotionCode }
      const promises = service.resolveOfferSelectors(options);
      Promise.all(promises).then(([[offer]]) => {
        let params = `locale=${language}_${country}&country=${country}&offer_id=${offer.offerId}`;
        if (promotionCode) params += `&promotion_code=${promotionCode}`;
        this.href = `${PROMO_TERMS_URL}?${params}`
      }).catch(error => {
          console.error(`Could not resolve offer selectors for wcsOsi: ${dataWcsOsi}.`, error.message);
      });
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