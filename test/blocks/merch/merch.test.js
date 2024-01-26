import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import { CheckoutWorkflow, CheckoutWorkflowStep, Defaults, Log } from '../../../libs/deps/commerce.js';

import merch, {
  PRICE_TEMPLATE_DISCOUNT,
  PRICE_TEMPLATE_OPTICAL,
  PRICE_TEMPLATE_STRIKETHROUGH,
  buildCta,
  getCheckoutContext,
  initService,
  priceLiteralsURL,
} from '../../../libs/blocks/merch/merch.js';

import { mockFetch, unmockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { createTag, setConfig } from '../../../libs/utils/utils.js';
import getUserEntitlements from '../../../libs/blocks/global-navigation/utilities/getUserEntitlements.js';

const ENTITLEMENTS_METADATA = {
  data: [{
    'Product Arrangement Code': 'phsp_direct_individual',
    CTA: 'Download',
    Target: 'https://helpx.adobe.com/download-install.html',
    'fr-FR': 'https://helpx.adobe.com/fr/custom-page.html',
  }],
};

const config = {
  codeRoot: '/libs',
  commerce: { priceLiteralsURL },
  env: { name: 'prod' },
  imsClientId: 'test_client_id',
};

/**
 * utility function that tests Price spans against mock HTML
 *
 * @param {util} selector price span selector
 * @param {*} expectedAttributes { <attribute key in element dataset>:
 * <expected attribute value, UNDEF if should be undefined>}
 */
const validatePriceSpan = async (selector, expectedAttributes) => {
  const el = await merch(document.querySelector(
    selector,
  ));
  const { nodeName, dataset } = await el.onceSettled();
  expect(nodeName).to.equal('SPAN');
  Object.keys(expectedAttributes).forEach((key) => {
    const value = expectedAttributes[key];
    expect(dataset[key], ` ${key} should equal ${value}`).to.equal(value);
  });
  return el;
};

const SUBSCRIPTION_DATA_PHSP = [
  {
    offer: { product_arrangement_code: 'phsp_direct_individual' },
    product_arrangement: {
      code: 'phsp_direct_individual',
      family: 'PHOTOSHOP',
    },
  },
];

const PROD_DOMAINS = [
  'www.adobe.com',
  'www.stage.adobe.com',
  'helpx.adobe.com',
];

describe('Merch Block', () => {
  let setEntitlementsMetadata;
  let setSubscriptionsData;

  after(async () => {
    delete window.lana;
    unmockFetch();
    unmockIms();
  });

  before(async () => {
    window.lana = { log: () => { } };
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    setConfig(config);
    ({ setEntitlementsMetadata, setSubscriptionsData } = await mockFetch());
    await mockIms('CH');
  });

  beforeEach(async () => {
    await initService(true);
    Log.reset();
    Log.use(Log.Plugins.quietFilter);
  });

  afterEach(() => {
    setEntitlementsMetadata();
    setSubscriptionsData();
  });

  it('does not decorate merch with bad content', async () => {
    let el = document.querySelector('.bad-content');
    expect(await merch(el)).to.be.undefined;
    el = document.querySelector('.merch.bad-content');
    expect(await merch(el)).to.be.null;
  });

  describe('prices', () => {
    it('renders merch link to price without term (new)', async () => {
      await validatePriceSpan('.merch.price.hide-term', { displayRecurrence: 'false' });
    });

    it('renders merch link to price with term', async () => {
      await validatePriceSpan('.merch.price.term', { displayRecurrence: undefined });
    });

    it('renders merch link to price with term and seat', async () => {
      await validatePriceSpan('.merch.price.seat', { displayPerUnit: 'true' });
    });

    it('renders merch link to price with term and tax', async () => {
      await validatePriceSpan('.merch.price.tax', { displayTax: 'true' });
    });

    it('renders merch link to price with term, seat and tax', async () => {
      await validatePriceSpan('.merch.price.seat.tax', { displayTax: 'true' });
    });

    it('renders merch link to strikethrough price with term, seat and tax', async () => {
      await validatePriceSpan('.merch.price.strikethrough', { template: PRICE_TEMPLATE_STRIKETHROUGH });
    });

    it('renders merch link to optical price with term, seat and tax', async () => {
      await validatePriceSpan('.merch.price.optical', { template: PRICE_TEMPLATE_OPTICAL });
    });

    it('renders merch link to discount price', async () => {
      await validatePriceSpan('.merch.price.discount', { template: PRICE_TEMPLATE_DISCOUNT });
    });

    it('renders merch link to tax exclusive price with tax exclusive attribute', async () => {
      await validatePriceSpan('.merch.price.tax-exclusive', { forceTaxExclusive: 'true' });
    });

    it('renders merch link to GB price', async () => {
      const el = await validatePriceSpan('.merch.price.gb', {});
      expect(/£/.test(el.textContent)).to.be.true;
    });
  });

  describe('promo prices', () => {
    it('renders merch link to promo price with discount', async () => {
      await validatePriceSpan('.merch.price.oldprice', { promotionCode: undefined });
    });

    it('renders merch link to promo price without discount', async () => {
      await validatePriceSpan('.merch.strikethrough.oldprice', {
        template: PRICE_TEMPLATE_STRIKETHROUGH,
        promotionCode: undefined,
      });
    });

    it('renders merch link to promo price with discount', async () => {
      await validatePriceSpan('.merch.price.promo', { promotionCode: 'nicopromo' });
    });

    it('renders merch link to full promo price', async () => {
      await validatePriceSpan('.merch.price.promo', { promotionCode: 'nicopromo' });
    });
  });

  describe('promo prices in a fragment', () => {
    it('renders merch link to promo price with discount', async () => {
      await validatePriceSpan('.fragment .merch.price.oldprice', { promotionCode: undefined });
    });

    it('renders merch link to promo price without discount', async () => {
      await validatePriceSpan('.fragment .merch.strikethrough.oldprice', {
        template: PRICE_TEMPLATE_STRIKETHROUGH,
        promotionCode: undefined,
      });
    });

    it('renders merch link to promo price with discount', async () => {
      await validatePriceSpan('.fragment .merch.price.promo', { promotionCode: 'nicopromo' });
    });

    it('renders merch link to full promo price', async () => {
      await validatePriceSpan('.fragment .merch.price.promo', { promotionCode: 'nicopromo' });
    });
  });

  describe('CTAs', () => {
    it('renders merch link to CTA, default values', async () => {
      await initService(true);
      const el = await merch(document.querySelector(
        '.merch.cta',
      ));
      const { dataset, href, nodeName, textContent } = await el.onceSettled();
      const url = new URL(href);
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(Defaults.checkoutWorkflow);
      expect(dataset.checkoutWorkflowStep).to.equal(Defaults.checkoutWorkflowStep);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      expect(url.searchParams.get('cli')).to.equal(Defaults.checkoutClientId);
    });

    it('renders merch link to CTA, config values', async () => {
      setConfig({
        ...config,
        commerce: { ...config.commerce, checkoutClientId: 'dc' },
      });
      mockIms();
      await initService(true);
      const el = await merch(document.querySelector(
        '.merch.cta.config',
      ));
      const { dataset, href, nodeName, textContent } = await el.onceSettled();
      const url = new URL(href);
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(Defaults.checkoutWorkflow);
      expect(dataset.checkoutWorkflowStep).to.equal(Defaults.checkoutWorkflowStep);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      expect(url.searchParams.get('cli')).to.equal('dc');
    });

    it('renders merch link to CTA, metadata values', async () => {
      setConfig({ ...config });
      const metadata = createTag('meta', { name: 'checkout-workflow', content: CheckoutWorkflow.V2 });
      document.head.appendChild(metadata);
      await initService(true);
      const el = await merch(document.querySelector(
        '.merch.cta.metadata',
      ));
      const { dataset, href, nodeName, textContent } = await el.onceSettled();
      const url = new URL(href);
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflow).to.equal(CheckoutWorkflow.V2);
      expect(dataset.checkoutWorkflowStep).to.equal(CheckoutWorkflowStep.CHECKOUT);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      expect(url.searchParams.get('cli')).to.equal(Defaults.checkoutClientId);
      document.head.removeChild(metadata);
    });

    it('renders merch link to cta for GB locale', async () => {
      await mockIms();
      await initService(true);
      const el = await merch(document.querySelector(
        '.merch.cta.gb',
      ));
      const { nodeName, href } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(/0ADF92A6C8514F2800BE9E87DB641D2A/.test(href)).to.be.true;
    });

    it('renders merch link to cta with empty promo', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.nopromo',
      ));
      const { nodeName, dataset } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('renders merch link to cta with empty promo in a fragment', async () => {
      const el = await merch(document.querySelector(
        '.fragment .merch.cta.nopromo',
      ));
      const { nodeName, dataset } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
    });

    it('renders merch link to promo cta with discount', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.promo',
      ));
      const { nodeName, dataset } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('renders merch link to promo cta with discount in a fragment', async () => {
      const el = await merch(document.querySelector(
        '.fragment .merch.cta.promo',
      ));
      const { nodeName, dataset } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal('nicopromo');
    });

    it('renders merch link to UCv2 cta with link-level overrides', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.link-overrides',
      ));
      const { nodeName, dataset } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      // https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=BPS&title=UCv2+Link+Creation+Guide
      expect(dataset.checkoutWorkflow).to.equal('UCv2');
      expect(dataset.checkoutWorkflowStep).to.equal('checkout');
      expect(dataset.checkoutMarketSegment).to.equal('EDU');
    });

    it('adds ims country to checkout link', async () => {
      await mockIms('CH');
      await initService(true);
      const el = await merch(document.querySelector(
        '.merch.cta.ims',
      ));
      const { dataset } = await el.onceSettled();
      expect(dataset.imsCountry).to.equal('CH');
    });

    it('renders blue CTAs', async () => {
      const els = await Promise.all([...document.querySelectorAll(
        '.merch.cta.strong',
      )].map(merch));
      expect(els.length).to.equal(2);
      els.forEach((el) => {
        expect(el.classList.contains('blue')).to.be.true;
      });
    });

    it('renders large CTA inside a marquee', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.inside-marquee',
      ));
      const { classList } = await el.onceSettled();
      expect(classList.contains('button-l')).to.be.true;
    });
  });

  describe('function "getCheckoutContext"', () => {
    it('returns null if context params do not have osi', async () => {
      const el = document.createElement('a');
      const params = new URLSearchParams();
      expect(await getCheckoutContext(el, params)).to.be.null;
    });
  });

  describe('function "buildCta"', () => {
    it('returns null if context params do not have osi', async () => {
      const el = document.createElement('a');
      const params = new URLSearchParams();
      expect(await buildCta(el, params)).to.be.null;
    });
  });

  describe.skip('Entitlements', () => {
    it('updates CTA text to Download', async () => {
      mockIms();
      getUserEntitlements();
      mockIms('US');
      setEntitlementsMetadata(ENTITLEMENTS_METADATA);
      setSubscriptionsData(SUBSCRIPTION_DATA_PHSP);
      await initService(true);
      const cta1 = await merch(document.querySelector('.merch.cta.download'));
      await cta1.onceSettled();
      const [{ CTA, Target }] = ENTITLEMENTS_METADATA.data;
      expect(cta1.textContent).to.equal(CTA);
      expect(cta1.href).to.equal(Target);

      const cta2 = await merch(document.querySelector('.merch.cta.no-entitlement-check'));
      await cta2.onceSettled();
      expect(cta2.textContent).to.equal('Buy Now');
      expect(cta2.href).to.not.equal(Target);
    });

    it('sets Download CTA href from the locale column', async () => {
      setConfig({
        ...config,
        pathname: '/fr/test.html',
        locales: { fr: { ietf: 'fr-FR' } },
        prodDomains: PROD_DOMAINS,
      });
      mockIms();
      getUserEntitlements();
      mockIms('FR');
      setEntitlementsMetadata(ENTITLEMENTS_METADATA);
      setSubscriptionsData(SUBSCRIPTION_DATA_PHSP);
      await initService(true);
      const cta = await merch(document.querySelector('.merch.cta.download.fr'));
      await cta.onceSettled();
      const [{ CTA, 'fr-FR': target }] = ENTITLEMENTS_METADATA.data;
      expect(cta.textContent).to.equal(CTA);
      expect(cta.href).to.equal(target);
    });

    it('sets Download CTA href from localized target url', async () => {
      setConfig({
        ...config,
        pathname: '/de/test.html',
        locales: { de: { ietf: 'DE' } },
        prodDomains: PROD_DOMAINS,
      });
      mockIms();
      getUserEntitlements();
      mockIms('DE');
      setEntitlementsMetadata(ENTITLEMENTS_METADATA);
      setSubscriptionsData(SUBSCRIPTION_DATA_PHSP);
      await initService(true);
      const cta = await merch(document.querySelector('.merch.cta.download.de'));
      await cta.onceSettled();
      const [{ CTA }] = ENTITLEMENTS_METADATA.data;
      expect(cta.textContent).to.equal(CTA);
      expect(cta.href).to.equal('https://helpx.adobe.com/de/download-install.html');
    });
  });
});
