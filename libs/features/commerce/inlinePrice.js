import {
  price,
  pricePromo,
  priceOptical,
  priceStrikethrough,
} from '@dexter/tacocat-consonant-templates';
import { computePromoStatus } from '@dexter/tacocat-core';

import Log from './log.js';
import Placeholder from './placeholder.js';
import Service from './service.js';
import { getSingleOffer, toBoolean } from './utils.js';

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

  /** @type {Commerce.InlinePriceElement} */
  get placeholder() {
    // @ts-ignore
    return this;
  }

  render() {
    if (!this.isConnected) return;

    this.placeholder.togglePending();
    this.innerHTML = '';
    const { settings: { country } } = Service.instance;

    const { wcsOsi: osi, perpetual, promotionCode, taxExclusive } = this.dataset;
    const isPerpetual = toBoolean(perpetual);

    Service.instance.wcs
      .resolveOfferSelector({
        isPerpetual,
        osi,
        promotionCode: computePromoStatus(promotionCode, null).effectivePromoCode,
        taxExclusive: toBoolean(taxExclusive),
      })
      .then((offers) => getSingleOffer(offers, country, isPerpetual))
      .then((offer) => {
        const { instance, providers } = Service;
        const options = { literals: { ...instance.literals.price } };
        providers.price.forEach((provider) => provider(this, options));
        this.renderOffer(offer, options);
        this.placeholder.toggleResolved();
      })
      .catch((reason) => {
        this.innerHTML = '';
        this.placeholder.toggleFailed(reason);
      });
  }

  renderOffer(offer, options) {
    const { settings: { country, language } } = Service.instance;
    const {
      promotionCode,
      template,
      displayRecurrence,
      displayPerUnit,
      displayTax,
      displayOldPrice,
    } = this.dataset;

    let method = promotionCode ? pricePromo : price;
    if (template === 'strikethrough') {
      method = priceStrikethrough;
    } else if (template === 'optical') {
      method = priceOptical;
    }
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

export default Placeholder('span', 'inline-price', HTMLInlinePriceElement);
