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
   * Returns `this` object typed as `Commerce.InlinePriceElement`.
   * @type {Commerce.HTMLInlinePriceElement}
   */
  get placeholder() {
    // @ts-ignore
    return this;
  }

  render() {
    if (!this.isConnected) return;

    this.placeholder.togglePending();
    this.innerHTML = '';
    const { wcsOsi: osi, perpetual, promotionCode, taxExclusive } = this.dataset;
    const isPerpetual = toBoolean(perpetual);

    service.wcs
      .resolveOfferSelector({
        isPerpetual,
        osi,
        promotionCode: computePromoStatus(promotionCode, null).effectivePromoCode,
        singleOffer: true,
        taxExclusive: toBoolean(taxExclusive),
      })
      .then(([offer]) => {
        const options = { literals: { ...service.literals.price } };
        service.providers.price.forEach((provider) => provider(this.placeholder, options));
        this.renderOffer(offer, options);
        this.placeholder.toggleResolved();
      })
      .catch((reason) => {
        this.innerHTML = '';
        this.placeholder.toggleFailed(reason);
      });
  }

  renderOffer(offer, options) {
    const {
      promotionCode,
      template,
      displayRecurrence,
      displayPerUnit,
      displayTax,
      displayOldPrice,
    } = this.dataset;

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

    const { country, language } = service.settings;
    this.innerHTML = method(
      {
        country,
        language,
        displayRecurrence,
        displayPerUnit,
        displayTax,
        displayOldPrice,
        ...options,
      },
      { ...offer, ...offer.priceDetails },
    );
  }
}

/** @type {Commerce.HTMLInlinePriceElement} */
export default HTMLPlaceholderMixin('span', 'inline-price', HTMLInlinePriceElement);
