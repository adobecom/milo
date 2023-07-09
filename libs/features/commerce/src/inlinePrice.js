import {
  computePromoStatus,
  price,
  pricePromo,
  priceOptical,
  priceStrikethrough,
} from './deps.js';
import Log from './log.js';
import HTMLPlaceholderMixin from './placeholder.js';
import service from './service.js';
import { toBoolean } from './utils.js';

class HTMLInlinePriceElement extends HTMLSpanElement {
  static get observedAttributes() {
    return [
      'data-wcs-osi',
      'data-template',
      'data-display-recurrence',
      'data-display-per-unit',
      'data-display-tax',
      'data-promotion-code',
      'data-display-price',
      'data-perpetual',
      'data-tax-exclusive',
    ];
  }

  constructor() {
    super();
    this.log = Log.commerce.module('inlinePrice');
    this.placeholder.init();
  }

  /**
   * Returns strongly typed `this`.
   * @type {Commerce.HTMLInlinePriceElement}
   */
  get placeholder() {
    // @ts-ignore
    return this;
  }

  /**
   * Resolves associated osi via Wcs and renders price offer.
   * @param {Record<string, any>} overrides
   */
  async render(overrides = {}) {
    if (!this.isConnected) return;

    const { wcsOsi: osi, perpetual, promotionCode, taxExclusive } = this.dataset;
    const version = this.placeholder.togglePending();
    this.innerHTML = '';

    try {
      const [promise] = service.wcs.resolveOfferSelectors({
        perpetual: toBoolean(perpetual),
        offerSelectorIds: [osi],
        promotionCode: computePromoStatus(promotionCode, null).effectivePromoCode,
        taxExclusive: toBoolean(taxExclusive),
      });
      const [offer] = await promise;
      this.renderOffer(offer, overrides, version);
    } catch (error) {
      this.innerHTML = '';
      this.placeholder.toggleFailed(version, error);
    };
  }

  /**
   * Render price offer info into this element.
   * @param {Commerce.Wcs.Offer} offer 
   * @param {Record<string, any>} overrides
   */
  renderOffer(offer, overrides = {}, version) {
    version ??= this.placeholder.togglePending();
    if (!this.placeholder.toggleResolved(version)) return;

    this.innerHTML = '';

    const { country, language } = service.settings;
    const {
      promotionCode,
      template,
      displayRecurrence,
      displayPerUnit,
      displayTax,
      displayOldPrice,
    } = this.dataset;
    const options = {
      country,
      language,
      displayRecurrence,
      displayPerUnit,
      displayTax,
      displayOldPrice,
      literals: { ...service.literals.price },
      ...overrides,
    };

    service.providers.price.forEach((provider) => provider(this.placeholder, options));

    let method;
    if (promotionCode) {
      method = pricePromo;
    } else if (template === 'strikethrough') {
      method = priceStrikethrough;
    } else if (template === 'optical') {
      method = priceOptical;
    } else {
      method = price;
    }

    this.innerHTML = method(options, { ...offer, ...offer.priceDetails });
  }
}

/** @type {Commerce.HTMLInlinePriceElement} */
export default HTMLPlaceholderMixin('span', 'inline-price', HTMLInlinePriceElement);
