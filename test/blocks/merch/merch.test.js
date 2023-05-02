import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { createTag, setConfig } from '../../../libs/utils/utils.js';
import merch, { VERSION, getTacocatEnv, imsCountryPromise } from '../../../libs/blocks/merch/merch.js';

const config = { codeRoot: '/libs', env: { name: 'local' } };
setConfig(config);

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Merch Block', () => {
  before(async () => {
    Object.assign(window.tacocat, {
      loadPromise: Promise.resolve(),
      price: { optionProviders: [] },
      defaults: {
        apiKey: 'wcms-commerce-ims-ro-user-milo',
        baseUrl: 'https://wcs.stage.adobe.com',
        landscape: null,
        env: 'STAGE',
        environment: 'STAGE',
        country: 'US',
        clientId: 'adobe_com',
        language: 'en',
        locale: 'en_US',
        checkoutWorkflow: 'UCv3',
        checkoutWorkflowStep: 'email',
      },
    });
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
      expect(dataset.checkoutWorkflow).to.equal(undefined);
      expect(dataset.checkoutWorkflowStep).to.equal(undefined);
      expect(dataset.checkoutClientId).to.equal(undefined);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
    });

    it('merch link to CTA, config values', async () => {
      setConfig({ commerce: { checkoutClientId: 'dc' } });
      let el = document.querySelector('.merch.cta.config');
      el = await merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(undefined);
      expect(dataset.checkoutWorkflowStep).to.equal(undefined);
      expect(dataset.checkoutClientId).to.equal('dc');
      expect(dataset.checkoutMarketSegment).to.equal(undefined);

      setConfig(config);
    });

    it('merch link to CTA, metadata values', async () => {
      const metadata = createTag('meta', { name: 'checkout-type', content: 'UCv2' });
      document.head.appendChild(metadata);
      let el = document.querySelector('.merch.cta.metadata');
      el = await merch(el);
      const { nodeName, textContent, dataset } = el;
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal('UCv2');
      expect(dataset.checkoutWorkflowStep).to.equal(undefined);
      expect(dataset.checkoutClientId).to.equal(undefined);
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
      window.tacocat.imsCountryPromise = Promise.resolve('CH');
      let el = document.querySelector('.merch.cta.ims');
      el = await merch(el);
      const { dataset: { imsCountry } } = el;
      expect(imsCountry).to.equal('CH');
    });

    it('should esolve IMS country', async () => {
      window.adobeIMS = { isSignedInUser: () => true, getProfile: () => Promise.resolve({ countryCode: 'CH' }) };
      const imsCountry = await imsCountryPromise();
      expect(imsCountry).to.equal('CH');
    });

    it('should resolve ims country', async () => {
      window.adobeIMS = { isSignedInUser: () => false };
      const imsCountry = await imsCountryPromise();
      expect(imsCountry).to.undefined;
    });
  });

  describe('Tacocat config', () => {
    it('falls back to en for unsupported languages', async () => {
      const { literalScriptUrl, language } = getTacocatEnv('local', { ietf: 'xx-US' });
      expect(literalScriptUrl).to.equal(
        'https://www.stage.adobe.com/special/tacocat/literals/en.js',
      );
      expect(language).to.equal('en');
    });

    it('returns production values', async () => {
      const { scriptUrl, literalScriptUrl, country, language } = getTacocatEnv(
        'prod',
        { ietf: 'fr-CA' },
      );
      expect(scriptUrl).to.equal(
        `https://www.adobe.com/special/tacocat/lib/${VERSION}/tacocat.js`,
      );
      expect(literalScriptUrl).to.equal(
        'https://www.adobe.com/special/tacocat/literals/fr.js',
      );
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

      ({ country, language } = getTacocatEnv('prod', { prefix: 'no' }));
      expect(country).to.equal('NO');
      expect(language).to.equal('nb');
    });

    it('returns geo mapping', async () => {
      let { country, language } = getTacocatEnv('prod', { prefix: 'africa' });
      expect(country).to.equal('ZA');
      expect(language).to.equal('en');

      ({ country, language } = getTacocatEnv('prod', { ietf: 'en' }));
      expect(country).to.equal('US');
      expect(language).to.equal('en');
    });

    it('does not initialize the block when tacocat fails to load', async () => {
      window.tacocat.loadPromise = Promise.reject(new Error('404'));
      let el = document.querySelector('.merch.cta.notacocat');
      el = await merch(el);
      expect(el).to.be.undefined;
    });
  });
});
