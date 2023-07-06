import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import { mockIms, unmockIms } from './mocks/ims.js';
import { mockWcs, unmockWcs } from './mocks/wcs.js';
import { createTag, setConfig } from '../../../libs/utils/utils.js';

const config = { codeRoot: '/libs', env: { name: 'local' } };

describe('Merch Block', () => {
  let Commerce;
  let Merch;

  async function initCommerce(commerce = {}) {
    Commerce.reset();
    await Commerce.init(() => setConfig({ commerce, ...config }));
  }

  after(() => {
    unmockWcs();
    unmockIms();
    Commerce.Log.reset();
  });

  before(async () => {
    await mockIms();
    await mockWcs();
    setConfig(config);
    Commerce = await import('../../../libs/deps/commerce/index.js');
    Commerce.Log.use(Commerce.Log.quietFilter);
    Merch = (await import('../../../libs/blocks/merch/merch.js')).default;
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
  });

  it('Doesnt decorate merch with bad content', async () => {
    let el = document.querySelector('.bad-content');
    let undef = await Merch(el);
    expect(undef).to.be.undefined;
    el = document.querySelector('.merch.bad-content');
    undef = await Merch(el);
    expect(undef).to.be.undefined;
  });

  describe('Prices', () => {
    it('merch link to price without term', async () => {
      const el = document.querySelector('.merch.price.hide-term');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayRecurrence).to.equal('false');
    });

    it('merch link to price with term', async () => {
      const el = document.querySelector('.merch.price.term');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayRecurrence).to.equal();
    });

    it('merch link to price with term and seat', async () => {
      const el = document.querySelector('.merch.price.seat');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayPerUnit).to.equal('true');
    });

    it('merch link to price with term and tax', async () => {
      const el = document.querySelector('.merch.price.tax');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayTax).to.equal('true');
    });

    it('merch link to price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.seat.tax');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayTax).to.equal('true');
    });

    it('merch link to strikethrough price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.strikethrough');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('strikethrough');
    });

    it('merch link to optical price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.optical');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('optical');
    });
  });

  describe('Promo Prices', () => {
    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.merch.price.oldprice');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price without discount', async () => {
      const el = document.querySelector('.merch.strikethrough.oldprice');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('strikethrough');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.merch.price.promo');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to full promo price', async () => {
      const el = document.querySelector('.merch.price.promo');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('Promo Prices in a fragment', () => {
    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.fragment .merch.price.oldprice');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price without discount', async () => {
      const el = document.querySelector(
        '.fragment .merch.strikethrough.oldprice',
      );
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('strikethrough');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.fragment .merch.price.promo');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to full promo price', async () => {
      const el = document.querySelector('.fragment .merch.price.promo');
      const { nodeName, dataset } = await Merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('CTAs', () => {
    it('merch link to CTA, default values', async () => {
      let el = document.querySelector('.merch.cta');
      el = await Merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(Commerce.defaults.checkoutWorkflow);
      expect(dataset.checkoutWorkflowStep).to.equal(Commerce.defaults.checkoutWorkflowStep);
      expect(dataset.checkoutClientId).to.equal(Commerce.defaults.checkoutClientId);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
    });

    it('merch link to CTA, config values', async () => {
      await initCommerce({ checkoutClientId: 'dc' });
      let el = document.querySelector('.merch.cta.config');
      el = await Merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(Commerce.defaults.checkoutWorkflow);
      expect(dataset.checkoutWorkflowStep).to.equal(Commerce.defaults.checkoutWorkflowStep);
      expect(dataset.checkoutClientId).to.equal('dc');
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
    });

    it('merch link to CTA, metadata values', async () => {
      const metadata = createTag('meta', { name: 'checkout-workflow', content: 'UCv2' });
      document.head.appendChild(metadata);
      await initCommerce();
      let el = document.querySelector('.merch.cta.metadata');
      el = await Merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(Commerce.CheckoutWorkflow.V2);
      expect(dataset.checkoutWorkflowStep).to.equal(Commerce.CheckoutWorkflowStep.CHECKOUT);
      expect(dataset.checkoutClientId).to.equal(Commerce.defaults.checkoutClientId);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      document.head.removeChild(metadata);
    });

    it('merch link to cta with empty promo', async () => {
      let el = document.querySelector('.merch.cta.nopromo');
      el = await Merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to cta with empty promo in a fragment', async () => {
      let el = document.querySelector('.fragment .merch.cta.nopromo');
      el = await Merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo cta with discount', async () => {
      let el = document.querySelector('.merch.cta.promo');
      el = await Merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to promo cta with discount in a fragment', async () => {
      let el = document.querySelector('.fragment .merch.cta.promo');
      el = await Merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to UCv2 cta with link-level overrides.', async () => {
      let el = document.querySelector('.merch.cta.link-overrides');
      el = await Merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.checkoutWorkflow).to.equal('UCv2');
      expect(dataset.checkoutWorkflowStep).to.equal('checkout/email');
      expect(dataset.checkoutMarketSegment).to.equal('EDU');
    });

    it('should add ims country to checkout link', async () => {
      let el = document.querySelector('.merch.cta.ims');
      el = await Merch(el);
      expect(el.dataset.imsCountry).to.equal('CH');
    });

    it('should render blue CTAs', async () => {
      const els = document.querySelectorAll('.merch.cta.strong');
      expect(els.length).to.equal(2);
      const cta1 = await Merch(els[0]);
      expect(cta1.classList.contains('blue')).to.be.true;
      const cta2 = await Merch(els[1]);
      expect(cta2.classList.contains('blue')).to.be.true;
    });

    it('should render large CTA inside a marquee', async () => {
      const el = document.querySelector('.merch.cta.inside-marquee');
      const cta = await Merch(el);
      expect(cta.classList.contains('button-l')).to.be.true;
    });
  });
});
