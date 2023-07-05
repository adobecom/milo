import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import sinon from 'sinon';

import { createTag, setConfig } from '../../../libs/utils/utils.js';

window.adobeIMS = {
  isSignedInUser: () => true,
  getProfile: () => Promise.resolve({ countryCode: 'CH' }),
};

const {
  CheckoutWorkflow,
  CheckoutWorkflowStep,
  defaults,
  init,
  Log,
  reset,
} = await import('../../../libs/deps/commerce/index.js');

const offers = JSON.parse(await readFile({ path: './mocks/offers.json' }));
document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const config = setConfig({ codeRoot: '/libs', env: { name: 'local' } });
Log.use(Log.quietFilter);

async function initCommerce(commerce = {}) {
  reset();
  await init(() => setConfig({ commerce, ...config }));
}

const { default: merch } = await import('../../../libs/blocks/merch/merch.js');

describe('Merch Block', () => {
  const ogFetch = window.fetch;

  after(() => {
    delete window.adobeIMS;
    window.fetch = ogFetch;
  });

  beforeEach(() => {
    let request = 0;
    window.fetch = sinon.stub()
      .onFirstCall()
      .callsFake(() => Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        json: () => Promise.resolve({}),
      }))
      .callsFake(() => Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        // eslint-disable-next-line no-plusplus
        json: () => Promise.resolve({ resolvedOffers: [offers[request++ % offers.length]] }),
      }));
  });

  it('Doesnt decorate merch with bad content', async () => {
    let el = document.querySelector('.bad-content');
    let undef = await merch(el);
    expect(undef).to.be.undefined;
    el = document.querySelector('.merch.bad-content');
    undef = await merch(el);
    expect(undef).to.be.undefined;
  });

  describe('Prices', () => {
    it('merch link to price without term', async () => {
      const el = document.querySelector('.merch.price.hide-term');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayRecurrence).to.equal('false');
    });

    it('merch link to price with term', async () => {
      const el = document.querySelector('.merch.price.term');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayRecurrence).to.equal();
    });

    it('merch link to price with term and seat', async () => {
      const el = document.querySelector('.merch.price.seat');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayPerUnit).to.equal('true');
    });

    it('merch link to price with term and tax', async () => {
      const el = document.querySelector('.merch.price.tax');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayTax).to.equal('true');
    });

    it('merch link to price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.seat.tax');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.displayTax).to.equal('true');
    });

    it('merch link to strikethrough price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.strikethrough');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('strikethrough');
    });

    it('merch link to optical price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.optical');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('optical');
    });
  });

  describe('Promo Prices', () => {
    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.merch.price.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price without discount', async () => {
      const el = document.querySelector('.merch.strikethrough.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('strikethrough');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to full promo price', async () => {
      const el = document.querySelector('.merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('Promo Prices in a fragment', () => {
    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.fragment .merch.price.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price without discount', async () => {
      const el = document.querySelector(
        '.fragment .merch.strikethrough.oldprice',
      );
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('strikethrough');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.fragment .merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to full promo price', async () => {
      const el = document.querySelector('.fragment .merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.be.undefined;
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('CTAs', () => {
    it('merch link to CTA, default values', async () => {
      let el = document.querySelector('.merch.cta');
      el = await merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(defaults.checkoutWorkflow);
      expect(dataset.checkoutWorkflowStep).to.equal(defaults.checkoutWorkflowStep);
      expect(dataset.checkoutClientId).to.equal(defaults.checkoutClientId);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
    });

    it('merch link to CTA, config values', async () => {
      await initCommerce({ checkoutClientId: 'dc' });
      let el = document.querySelector('.merch.cta.config');
      el = await merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(defaults.checkoutWorkflow);
      expect(dataset.checkoutWorkflowStep).to.equal(defaults.checkoutWorkflowStep);
      expect(dataset.checkoutClientId).to.equal('dc');
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
    });

    it('merch link to CTA, metadata values', async () => {
      const metadata = createTag('meta', { name: 'checkout-workflow', content: 'UCv2' });
      document.head.appendChild(metadata);
      await initCommerce();
      let el = document.querySelector('.merch.cta.metadata');
      el = await merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(CheckoutWorkflow.V2);
      expect(dataset.checkoutWorkflowStep).to.equal(CheckoutWorkflowStep.CHECKOUT);
      expect(dataset.checkoutClientId).to.equal(defaults.checkoutClientId);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      document.head.removeChild(metadata);
    });

    it('merch link to cta with empty promo', async () => {
      let el = document.querySelector('.merch.cta.nopromo');
      el = await merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to cta with empty promo in a fragment', async () => {
      let el = document.querySelector('.fragment .merch.cta.nopromo');
      el = await merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo cta with discount', async () => {
      let el = document.querySelector('.merch.cta.promo');
      el = await merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to promo cta with discount in a fragment', async () => {
      let el = document.querySelector('.fragment .merch.cta.promo');
      el = await merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to UCv2 cta with link-level overrides.', async () => {
      let el = document.querySelector('.merch.cta.link-overrides');
      el = await merch(el);
      const { nodeName, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.checkoutWorkflow).to.equal('UCv2');
      expect(dataset.checkoutWorkflowStep).to.equal('checkout/email');
      expect(dataset.checkoutMarketSegment).to.equal('EDU');
    });

    it('should add ims country to checkout link', async () => {
      let el = document.querySelector('.merch.cta.ims');
      el = await merch(el);
      expect(el.dataset.imsCountry).to.equal('CH');
    });

    it('should render blue CTAs', async () => {
      const els = document.querySelectorAll('.merch.cta.strong');
      expect(els.length).to.equal(2);
      const cta1 = await merch(els[0]);
      expect(cta1.classList.contains('blue')).to.be.true;
      const cta2 = await merch(els[1]);
      expect(cta2.classList.contains('blue')).to.be.true;
    });

    it('should render large CTA inside a marquee', async () => {
      const el = document.querySelector('.merch.cta.inside-marquee');
      const cta = await merch(el);
      expect(cta.classList.contains('button-l')).to.be.true;
    });
  });
});
