import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, loadStyle } from '../../../libs/utils/utils.js';
import { getTacocatEnv, initTacocat } from '../../../libs/blocks/merch/merch.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const config = { codeRoot: '/libs' };
setConfig(config);

let merch;

describe('Merch Block', () => {
  before(async () => {
    const mod = await import('../../../libs/blocks/merch/merch.js');
    merch = mod.default;
    // good for previewing merch content during local development in the browser.
    loadStyle('../../../libs/blocks/merch/merch.css');
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
      expect(dataset.template).to.equal('price');
      expect(dataset.displayRecurrence).to.equal('false');
    });

    it('merch link to price with term', async () => {
      const el = document.querySelector('.merch.price.term');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.displayRecurrence).to.equal();
    });

    it('merch link to price with term and seat', async () => {
      const el = document.querySelector('.merch.price.seat');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.displayPerUnit).to.equal('true');
    });

    it('merch link to price with term and tax', async () => {
      const el = document.querySelector('.merch.price.tax');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.displayTax).to.equal('true');
    });

    it('merch link to price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.seat.tax');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.displayTax).to.equal('true');
    });

    it('merch link to strikethrough price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.strikethrough');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('priceStrikethrough');
    });

    it('merch link to optical price with term, seat and tax', async () => {
      const el = document.querySelector('.merch.price.optical');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('priceOptical');
    });
  });

  describe('Promo Prices', () => {
    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.merch.price.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price without discount', async () => {
      const el = document.querySelector('.merch.strikethrough.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('priceStrikethrough');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to full promo price', async () => {
      const el = document.querySelector('.merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('Promo Prices in a fragment', () => {
    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.fragment .merch.price.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price without discount', async () => {
      const el = document.querySelector('.fragment .merch.strikethrough.oldprice');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('priceStrikethrough');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo price with discount', async () => {
      const el = document.querySelector('.fragment .merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to full promo price', async () => {
      const el = document.querySelector('.fragment .merch.price.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('SPAN');
      expect(dataset.template).to.equal('price');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('CTAs', () => {
    it('merch link to CTA', async () => {
      const el = document.querySelector('.merch.cta');
      const { nodeName, textContent, dataset } = await merch(el);
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(dataset.template).to.equal('checkoutUrl');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal('UCv2');
      expect(dataset.checkoutWorkflowStep).to.equal('segmentation');
    });

    it('merch link to cta with empty promo', async () => {
      const el = document.querySelector('.merch.cta.nopromo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('A');
      expect(dataset.template).to.equal('checkoutUrl');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to cta with empty promo in a fragment', async () => {
      const el = document.querySelector('.fragment .merch.cta.nopromo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('A');
      expect(dataset.template).to.equal('checkoutUrl');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('merch link to promo cta with discount', async () => {
      const el = document.querySelector('.merch.cta.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('A');
      expect(dataset.template).to.equal('checkoutUrl');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('merch link to promo cta with discount in a fragment', async () => {
      const el = document.querySelector('.fragment .merch.cta.promo');
      const { nodeName, dataset } = await merch(el);
      expect(nodeName).to.equal('A');
      expect(dataset.template).to.equal('checkoutUrl');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });
  });

  describe('Tacocat config', () => {
    it('falls back to en for unsupported languages', async () => {
      const { scriptUrl, literalScriptUrl, language } = getTacocatEnv('stage', { ietf: 'xx-US' });
      expect(scriptUrl).to.equal('https://www.stage.adobe.com/special/tacocat/lib/1.12.0/tacocat.js');
      expect(literalScriptUrl).to.equal('https://www.stage.adobe.com/special/tacocat/literals/en.js');
      expect(language).to.equal('en');
    });

    it('returns production values', async () => {
      const { scriptUrl, literalScriptUrl, country, language } = getTacocatEnv('prod', { ietf: 'fr-CA' });
      expect(scriptUrl).to.equal('https://www.adobe.com/special/tacocat/lib/1.12.0/tacocat.js');
      expect(literalScriptUrl).to.equal('https://www.adobe.com/special/tacocat/literals/fr.js');
      expect(country).to.equal('CA');
      expect(language).to.equal('fr');
    });

    it('returns geo mapping', async () => {
      let { country, language } = getTacocatEnv('prod', { prefix: 'africa' });
      expect(country).to.equal('ZA');
      expect(language).to.equal('en');

      ({ country, language } = getTacocatEnv('prod', { prefix: 'no' }));
      expect(country).to.equal('NO');
      expect(language).to.equal('nb');
    });

    it('initializes tacocat', async () => {
      window.tacocat = { literals: { fr: { test: 'test' } }, tacocat: stub() };
      initTacocat('prod', 'CA', 'fr');
      expect(Object.keys(window.tacocat.tacocat.getCall(0).args[0]))
        .to.include.members(['defaults', 'environment', 'wcs', 'literals']);
    });

    it('initializes tacocat with incorrect language', async () => {
      window.tacocat = { literals: { fr: { test: 'test' } }, tacocat: stub() };
      initTacocat('prod', 'US', 'xx');
      expect(window.tacocat.tacocat.getCall(0).args[0].literals).to.eql({});
    });
  });
});
