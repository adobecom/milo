import { computePromoStatus } from './deps.js';
import Log from './log.js';
import HTMLPlaceholderMixin from './placeholder.js';
import service from './service.js';
import { toBoolean } from './utils.js';

class HTMLCheckoutLinkElement extends HTMLAnchorElement {
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

  /** @type {Commerce.HTMLCheckoutLinkElement} */
  get placeholder() {
    // @ts-ignore
    return this;
  }

  render() {
    if (!this.isConnected) return;

    this.placeholder.togglePending();
    this.setAttribute('href', '#');

    let { promotionCode } = this.dataset;
    promotionCode = computePromoStatus(promotionCode, null).effectivePromoCode;
    const { wcsOsi, quantity = '', perpetual } = this.dataset;
    const isPerpetual = toBoolean(perpetual);

    const osis = wcsOsi.split(',');
    if (osis.length > 1) {
      const quantities = quantity.split(',', osis.length);
      Promise.all(osis.map((osi, index) => service.wcs
        .resolveOfferSelector({
          isPerpetual,
          osi,
          promotionCode,
        })
        .then(([{ offerId }]) => ({
          id: offerId,
          quantity: quantities[index] ?? 1,
        }))),
      )
        .then((items) => this.renderHref(items))
        .catch((reason) => this.placeholder.toggleFailed(reason));
      return;
    }

    service.wcs
      .resolveOfferSelector({
        isPerpetual,
        osi: wcsOsi,
        promotionCode,
      })
      .then(([{
        offerId,
        offerType,
        productArrangementCode,
        marketSegments: [marketSegment],
      }]) => this.renderHref(
        [{ id: offerId }],
        offerType,
        productArrangementCode,
        marketSegment,
      ))
      .catch((reason) => this.placeholder.toggleFailed(reason));
  }

  renderHref(items, offerType, productArrangementCode, marketSegment) {
    const {
      checkoutClientId,
      checkoutWorkflow,
      checkoutWorkflowStep,
    } = service.settings;

    const {
      checkoutClientId: clientId = checkoutClientId,
      checkoutWorkflow: workflow = checkoutWorkflow,
      checkoutWorkflowStep: workflowStep = checkoutWorkflowStep,
      customParameters = '{}',
      imsCountry,
      promotionCode,
    } = this.dataset;

    const options = {
      checkoutPromoCode: promotionCode,
      clientId,
      items,
      marketSegment,
      offerType,
      productArrangementCode,
      workflow,
      workflowStep,
      ...JSON.parse(customParameters),
    };
    if (imsCountry) options.country = imsCountry;

    this.href = service.checkout.buildUrl(options);

    this.placeholder.toggleResolved();
  }
}

/** @type {Commerce.HTMLCheckoutLinkElement} */
export default HTMLPlaceholderMixin('a', 'checkout-link', HTMLCheckoutLinkElement);
