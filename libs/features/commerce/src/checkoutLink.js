import { CheckoutWorkflow, CheckoutWorkflowStep, computePromoStatus } from './deps.js';
import Log from './log.js';
import HTMLPlaceholderMixin from './placeholder.js';
import service from './service.js';
import { toBoolean, toEnum } from './utils.js';

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

  async render(overrides = {}) {
    if (!this.isConnected) return;

    const version = this.placeholder.togglePending();
    this.href = '#';

    const { wcsOsi, perpetual } = this.dataset;
    let { promotionCode = overrides.promotionCode } = this.dataset;
    promotionCode = computePromoStatus(promotionCode, null).effectivePromoCode;
    const offerSelectorIds = wcsOsi.split(',');

    try {
      const offers = await Promise
        .all(service.wcs.resolveOfferSelectors({
          perpetual: toBoolean(perpetual),
          offerSelectorIds,
          promotionCode: this.dataset.promotionCode,
        }))
        .then((offers) => offers.flat());
      this.renderOffers(offers, { ...overrides, promotionCode }, version);
    } catch (error) {
      this.placeholder.toggleFailed(version, error);
    }
  }

  /**
   * @param {Commerce.Wcs.Offer[]} offers
   * @param {Record<string, any>} overrides
   */
  renderOffers(offers, overrides = {}, version) {
    version ??= this.placeholder.togglePending();
    if (!this.placeholder.toggleResolved(version)) return;

    if (!offers.length) {
      this.href = '#';
      this.placeholder.toggleFailed(version);
      return;
    }

    const { checkoutClientId, checkoutWorkflow, checkoutWorkflowStep, country, env } = service.settings;
    const {
      checkoutClientId: clientId = checkoutClientId,
      checkoutWorkflow: workflow,
      checkoutWorkflowStep: workflowStep,
      imsCountry,
      quantity = '',
    } = this.dataset;
    const quantities = quantity.split(',', offers.length);
    /** @type {Commerce.Checkout.Options} */
    let options = {
      clientId,
      country: imsCountry ? imsCountry : country,
      env,
      workflow: toEnum(workflow, CheckoutWorkflow, checkoutWorkflow),
      workflowStep: toEnum(workflowStep, CheckoutWorkflowStep, checkoutWorkflowStep),
      ...overrides,
      checkoutPromoCode: overrides.promotionCode,
    };

    if (offers.length === 1) {
      const { offerId, offerType, productArrangementCode } = offers[0];
      // TODO: fix type definition in @pandora, Wcs responds with marketSegments (array)
      // @ts-ignore
      const { marketSegments: [marketSegment] } = offers[0];
      // TODO: add marketSegment property definition in @pandora
      options = Object.assign({ marketSegment, offerType, productArrangementCode }, options);
      options.items = [{ id: offerId }];
      const [quantity] = quantities[0] || '1';
      if ('1' !== quantity) options.items[0].quantity = quantity;
    } else {
      // TODO: verify the need of extra params in this case:
      // marketSegment, offerType, productArrangementCode
      options.items = offers.map(({ offerId }) => ({
        id: offerId,
        quantity: quantities[0] ?? '1',
      }));
    }

    this.href = service.checkout.buildUrl(options);
  }
}

/** @type {Commerce.HTMLCheckoutLinkElement} */
export default HTMLPlaceholderMixin('a', 'checkout-link', HTMLCheckoutLinkElement);
