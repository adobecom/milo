import {
  price,
  pricePromo,
  priceOptical,
  priceStrikethrough,
} from '@dexter/tacocat-consonant-templates';

import Placeholder from './placeholder.js';
import { computePromoStatus } from './promotion.js';
import singleton from './singleton.js';
import { getSingleOffer, toBoolean } from './utils.js';
import Log from './log.js';

export default class InlinePrice extends HTMLSpanElement {
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
    this.initPlaceholder();
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  init() {
    if (!this.initiliazed) {
      this.render();
    }
  }

  render() {
    if (!this.isConnected) return;

    this.togglePending();
    this.innerHTML = '';
    const { settings: { country } } = singleton.instance;

    const { isPerpetual } = this;
    const { wcsOsi: osi, perpetual, promotionCode, taxExclusive } = this.dataset;

    singleton.instance.wcs
      .resolveOfferSelector({
        isPerpetual: toBoolean(perpetual),
        osi,
        promotionCode: computePromoStatus(promotionCode, null).effectivePromoCode,
        taxExclusive,
      })
      .then((offers) => getSingleOffer(offers, country, isPerpetual))
      .then((offer) => {
        const options = { literals: { ...(singleton.instance.literals) } };
        singleton.instance.price.optionProviders.forEach((provider) => provider(this, options));
        this.renderOffer(offer, options);
        this.toggleResolved();
      })
      .catch((reason) => {
        this.innerHTML = '';
        this.toggleFailed(reason);
      });
  }

  renderOffer(offer, options) {
    const { settings: { country, language } } = singleton.instance;
    const {
      promotionCode,
      template,
      displayRecurrence,
      displayPerUnit,
      displayTax,
      displayOldPrice,
    } = this.dataset;

    let priceFn = promotionCode ? pricePromo : price;
    if (template === 'strikethrough') {
      priceFn = priceStrikethrough;
    } else if (template === 'optical') {
      priceFn = priceOptical;
    }
    this.innerHTML = priceFn(
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

if (!customElements.get('inline-price')) {
  Object.assign(InlinePrice.prototype, Placeholder);
  customElements.define('inline-price', InlinePrice, { extends: 'span' });
}
