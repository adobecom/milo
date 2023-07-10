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
    }
  }

  // TODO: can be extended to accept array of offers and compute subtotal price
  /**
   * Renders price offer info into this component.
   * @param {Commerce.Wcs.Offer} offer
   * @param {Record<string, any>} overrides
   */
  renderOffer(offer, overrides = {}, version = undefined) {
    // If called from `render` method that
    // gets version of this component before making async Wcs call,
    // ensures that no another pending operaion was initiated since
    // and that version has not changed.
    // eslint-disable-next-line no-param-reassign
    version ??= this.placeholder.togglePending();
    if (!this.placeholder.toggleResolved(version)) return;
    this.innerHTML = '';
    // Collect settings/dataset and construct price options object.
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
    // Call price option providers to extend base options object.
    service.providers.price.forEach((provider) => provider(this.placeholder, options));
    // Select price rendering method.
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
    // Use selected method to build HTML for this component.
    this.innerHTML = method(options, { ...offer, ...offer.priceDetails });
  }
}

/** @type {Commerce.HTMLInlinePriceElement} */
export default HTMLPlaceholderMixin('span', 'inline-price', HTMLInlinePriceElement);
