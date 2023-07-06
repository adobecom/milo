import { buildCheckoutUrl } from '@pandora/commerce-checkout-url-builder';
import { computePromoStatus } from '@dexter/tacocat-core';

import Log from './log.js';
import Placeholder from './placeholder.js';
import Service from './service.js';
import { getSingleOffer, toBoolean } from './utils.js';

class CheckoutLinkElement extends HTMLAnchorElement {
  static get observedAttributes() {
    return [
      'data-wcs-osi',
      'data-template',
      'data-promotion-code',
      'data-quantity',
      'data-ims-country',
      'data-perpetual',
      'data-checkout-workflow',
      'data-checkout-workflow-step',
    ];
  }

  constructor() {
    super();
    this.log = Log.commerce.module('checkoutLink');
    this.placeholder.init();
  }

  /** @type {Commerce.CheckoutLinkElement} */
  get placeholder() {
    // @ts-ignore
    return this;
  }

  render() {
    if (!this.isConnected) return;

    this.placeholder.togglePending();
    this.setAttribute('href', '#');

    const { settings: { country } } = Service.instance;
    let { promotionCode } = this.dataset;
    promotionCode = computePromoStatus(promotionCode, null).effectivePromoCode;
    const { wcsOsi, quantity = '', perpetual } = this.dataset;
    const isPerpetual = toBoolean(perpetual);

    const osis = wcsOsi.split(',');
    if (osis.length > 1) {
      const quantities = quantity.split(',');
      Promise.all(
        osis.map((osi, index) => Service.instance.wcs
          .resolveOfferSelector({
            isPerpetual,
            osi,
            promotionCode,
          })
          .then((offers) => getSingleOffer(offers, country, isPerpetual))
          .then(({ offerId }) => ({
            id: offerId,
            quantity: quantities[index] ?? 1,
          }))),
      )
        .then((items) => this.renderHref(items))
        .catch((reason) => this.placeholder.toggleFailed(reason));
      return;
    }

    Service.instance.wcs
      .resolveOfferSelector({
        isPerpetual,
        osi: wcsOsi,
        promotionCode,
      })
      .then((offers) => getSingleOffer(offers, country, isPerpetual))
      .then(
        ({
          offerId,
          offerType,
          productArrangementCode,
          marketSegments: [marketSegment],
        }) => this.renderHref(
          [{ id: offerId }],
          offerType,
          productArrangementCode,
          marketSegment,
        ),
      )
      .catch((reason) => this.placeholder.toggleFailed(reason));
  }

  renderHref(items, offerType, productArrangementCode, marketSegment) {
    const {
      checkoutClientId: clientId,
      customParameters = '{}',
      imsCountry,
      promotionCode,
      checkoutWorkflow: workflow,
      checkoutWorkflowStep: workflowStep,
    } = this.dataset;

    const options = {
      workflow,
      workflowStep,
      clientId,
      items,
      marketSegment,
      offerType,
      productArrangementCode,
      checkoutPromoCode: promotionCode,
      ...JSON.parse(customParameters),
    };
    if (imsCountry) options.country = imsCountry;

    this.href = Service.instance.checkout.buildUrl(options);

    this.placeholder.toggleResolved();
  }
}

export default Placeholder('a', 'checkout-link', CheckoutLinkElement);
