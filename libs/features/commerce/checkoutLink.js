import { buildCheckoutUrl } from '@pandora/commerce-checkout-url-builder';

import Log from './log.js';
import Placeholder from './placeholder.js';
import { computePromoStatus } from './promotion.js';
import singleton from './singleton.js';
import { getSingleOffer, toBoolean } from './utils.js';

export default class CheckoutLink extends HTMLAnchorElement {
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
    this.initPlaceholder();
  }

  attributeChangedCallback() {
    this.updateHref();
  }

  connectedCallback() {
    this.updateHref();
  }

  init() {
    if (!this.initiliazed) {
      this.updateHref();
    }
  }

  updateHref() {
    if (!this.isConnected) return;

    this.togglePending();
    this.setAttribute('href', '#');

    const { settings: { country } } = singleton.instance;
    let { promotionCode } = this.dataset;
    promotionCode = computePromoStatus(promotionCode, null).effectivePromoCode;
    const { wcsOsi, quantity = '', perpetual } = this.dataset;
    const isPerpetual = toBoolean(perpetual);

    const osis = wcsOsi.split(',');
    if (osis.length > 1) {
      const quantities = quantity.split(',');
      Promise.all(
        osis.map((osi, index) => singleton.instance.wcs
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
        .then((items) => this.buildCheckoutUrl(items))
        .catch((reason) => this.toggleFailed(reason));
      return;
    }

    singleton.instance.wcs
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
        }) => this.buildCheckoutUrl(
          [{ id: offerId }],
          offerType,
          productArrangementCode,
          marketSegment,
        ),
      )
      .catch((reason) => this.toggleFailed(reason));
  }

  buildCheckoutUrl(items, offerType, productArrangementCode, marketSegment) {
    const {
      settings: {
        checkoutClientId,
        checkoutWorkflow: defaultCheckoutWorkflow,
        checkoutWorkflowStep: defaultCheckoutWorkflowStep,
        country,
        env,
        language,
      },
    } = singleton.instance;
    const {
      customParameters = '{}',
      promotionCode,
      checkoutWorkflow = defaultCheckoutWorkflow,
      checkoutWorkflowStep = defaultCheckoutWorkflowStep,
    } = this.dataset;

    const checkoutParams = {
      clientId: checkoutClientId,
      country: this.dataset.imsCountry || country,
      env,
      items,
      language,
      workflowStep: checkoutWorkflowStep,
      marketSegment,
      offerType,
      productArrangementCode,
      checkoutPromoCode: promotionCode,
      ...JSON.parse(customParameters),
    };
    if (window.frameElement) checkoutParams.context = 'if';
    this.href = buildCheckoutUrl(checkoutWorkflow, checkoutParams);
    this.toggleResolved();
  }
}
if (!customElements.get('checkout-link')) {
  Object.assign(CheckoutLink.prototype, Placeholder);
  customElements.define('checkout-link', CheckoutLink, { extends: 'a' });
}
