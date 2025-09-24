import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';

import { CheckoutWorkflowStep, Defaults, Log } from '../../../libs/deps/mas/commerce.js';

import merch, {
  PRICE_TEMPLATE_DISCOUNT,
  PRICE_TEMPLATE_OPTICAL,
  PRICE_TEMPLATE_STRIKETHROUGH,
  PRICE_TEMPLATE_ANNUAL,
  buildCta,
  getCheckoutContext,
  initService,
  fetchCheckoutLinkConfigs,
  getCheckoutLinkConfig,
  getDownloadAction,
  fetchEntitlements,
  getModalAction,
  getCheckoutAction,
  PRICE_TEMPLATE_REGULAR,
  getMasBase,
  getOptions,
  appendDexterParameters,
  getLocaleSettings,
  getMiloLocaleSettings,
  setCtaHash,
  openModal,
  PRICE_TEMPLATE_LEGAL,
  modalState,
  updateModalState,
  isFallbackStepUsed,
  getWorkflowStep,
} from '../../../libs/blocks/merch/merch.js';
import { decorateCardCtasWithA11y, localizePreviewLinks } from '../../../libs/blocks/merch/autoblock.js';

import { mockFetch, unmockFetch, readMockText } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { createTag, setConfig } from '../../../libs/utils/utils.js';
import getUserEntitlements from '../../../libs/blocks/global-navigation/utilities/getUserEntitlements.js';

const CHECKOUT_LINK_CONFIGS = {
  data: [{
    PRODUCT_FAMILY: 'PHOTOSHOP',
    DOWNLOAD_TEXT: '',
    DOWNLOAD_URL: 'https://creativecloud.adobe.com/apps/download/photoshop',
    FREE_TRIAL_PATH: '/cc-shared/fragments/trial-modals/photoshop',
    BUY_NOW_PATH: '/cc-shared/fragments/buy-modals/photoshop',
    LOCALE: '',
  },
  {
    PRODUCT_FAMILY: 'ILLUSTRATOR',
    DOWNLOAD_TEXT: 'Download',
    DOWNLOAD_URL: 'https://creativecloud.adobe.com/apps/download/illustrator',
    FREE_TRIAL_PATH: 'https://www.adobe.com/mini-plans/illustrator.html?mid=ft&web=1',
    BUY_NOW_PATH: 'https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/illustrator/master.modal.html',
    LOCALE: '',
  },
  {
    PRODUCT_FAMILY: 'PHOTOSHOP',
    DOWNLOAD_TEXT: '',
    DOWNLOAD_URL: 'https://creativecloud.adobe.com/fr/apps/download/photoshop?q=123',
    FREE_TRIAL_PATH: '❌',
    BUY_NOW_PATH: 'X',
    LOCALE: 'fr',
  },
  { PRODUCT_FAMILY: 'CC_ALL_APPS', DOWNLOAD_URL: 'https://creativecloud.adobe.com/apps/download', LOCALE: '' },
  {
    PRODUCT_FAMILY: 'PREMIERE',
    DOWNLOAD_TEXT: 'Download',
    DOWNLOAD_URL: 'https://creativecloud.adobe.com/apps/download/premiere',
    FREE_TRIAL_PATH: '/test/blocks/merch/mocks/fragments/twp',
    BUY_NOW_PATH: '',
    LOCALE: '',
  },
  {
    PRODUCT_FAMILY: 'testPaCode',
    DOWNLOAD_TEXT: 'paCode',
  },
  {
    PRODUCT_FAMILY: 'testProductCode',
    DOWNLOAD_TEXT: 'productCode',
  },
  {
    PRODUCT_FAMILY: 'AUDITION',
    DOWNLOAD_TEXT: 'Download',
    DOWNLOAD_URL: 'https://creativecloud.adobe.com/apps/download/audition',
    FREE_TRIAL_PATH: 'https://www.adobe.com/mini-plans/audition.html?mid=ft&web=1',
    BUY_NOW_PATH: 'www.adobe.com/will/not/be/localized.html',
    LOCALE: '',
  },
  {
    PRODUCT_FAMILY: 'ILLUSTRATOR+abc',
    DOWNLOAD_TEXT: 'Download',
    DOWNLOAD_URL: 'https://creativecloud.adobe.com/apps/download/illustrator',
    FREE_TRIAL_PATH: 'https://www.adobe.com/mini-plans/illustrator_abc.html?mid=ft&web=1',
    BUY_NOW_PATH: 'https://www.adobe.com/buy/mini-plans/illustrator_abc.html?mid=ft&web=1',
    LOCALE: '',
  },
  ],
};

const config = {
  codeRoot: '/libs',
  env: { name: 'prod' },
  imsClientId: 'test_client_id',
  placeholders: { 'upgrade-now': 'Upgrade Now', download: 'Download' },
};

const updateSearch = ({ maslibs } = {}) => {
  const url = new URL(window.location);
  if (!maslibs) {
    url.searchParams.delete('maslibs');
  } else {
    url.searchParams.set('maslibs', maslibs);
  }
  window.history.pushState({}, '', url);
};

/**
 * utility function that tests Price spans against mock HTML
 *
 * @param {util} selector price span selector
 * @param {*} expectedAttributes { <attribute key in element dataset>:
 * <expected attribute value, UNDEF if should be undefined>}
 */
const validatePriceSpan = async (selector, expectedAttributes) => {
  const el = await merch(document.querySelector(selector));
  const { nodeName, dataset } = await el.onceSettled();
  expect(nodeName).to.equal('SPAN');
  Object.keys(expectedAttributes).forEach((key) => {
    const value = expectedAttributes[key];
    expect(dataset[key], ` ${key} should equal ${value}`).to.equal(value);
  });
  return el;
};

const SUBSCRIPTION_DATA_ALL_APPS_RAW_ELIGIBLE = [
  {
    change_plan_available: true,
    offer: { product_arrangement_v2: { family: 'CC_ALL_APPS' } },
  },
];

const SUBSCRIPTION_DATA_PHSP_RAW_ELIGIBLE = [
  {
    change_plan_available: true,
    offer: {
      offer_id: '5F2E4A8FD58D70C8860F51A4DE042E0C',
      product_arrangement_v2: { family: 'PHOTOSHOP' },
    },
  },
];

const PROD_DOMAINS = [
  'www.adobe.com',
  'www.stage.adobe.com',
  'helpx.adobe.com',
];

const createCtaInMerchCard = () => {
  const merchCard = document.createElement('merch-card');
  merchCard.setAttribute('name', 'photoshop');
  const el = document.createElement('a');
  merchCard.appendChild(el);
  return el;
};

const disable3in1 = () => {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'mas-ff-3in1');
  meta.setAttribute('content', 'off');
  document.querySelector('head').appendChild(meta);
};

describe('Merch Block', () => {
  let setCheckoutLinkConfigs;
  let setSubscriptionsData;

  after(async () => {
    delete window.lana;
    setCheckoutLinkConfigs();
    unmockFetch();
    unmockIms();
  });

  before(async () => {
    window.lana = { log: () => { } };
    document.head.innerHTML = await readMockText('/test/blocks/merch/mocks/head.html');
    document.body.innerHTML = await readMockText('/test/blocks/merch/mocks/body.html');
    ({ setCheckoutLinkConfigs, setSubscriptionsData } = await mockFetch());
    setCheckoutLinkConfigs(CHECKOUT_LINK_CONFIGS);
  });

  beforeEach(async () => {
    setConfig(config);
    await mockIms('CH');
    await initService(true);
    Log.reset();
    Log.use(Log.Plugins.quietFilter);
    fetchCheckoutLinkConfigs.promise = undefined;
    await fetchCheckoutLinkConfigs('http://localhost:3000/libs');
  });

  afterEach(() => {
    setSubscriptionsData();
    updateSearch();
  });

  it('does not decorate merch with bad content', async () => {
    let el = document.querySelector('.bad-content');
    expect(await merch(el)).to.be.undefined;
    el = document.querySelector('.merch.bad-content');
    expect(await merch(el)).to.be.null;
  });

  describe('locale settings', () => {
    it('should map correct commerce locale depending on locale config', async () => {
      [
        { prefix: '/ar', expectedLocale: 'es_AR' },
        { prefix: '/africa', expectedLocale: 'en_MU' },
        { prefix: '', expectedLocale: 'en_US' },
        { prefix: '/ae_ar', expectedLocale: 'ar_AE' },
        { prefix: '/langstore/en', expectedLocale: 'en_US' },
        { prefix: '/langstore/es', expectedLocale: 'es_ES' },
        { prefix: '/langstore/de', expectedLocale: 'de_DE' },
        { prefix: '/langstore/id', expectedLocale: 'id_ID' },
        { prefix: '/langstore/hi', expectedLocale: 'hi_IN' },
        { prefix: '/langstore/ar', expectedLocale: 'ar_DZ' },
        { prefix: '/langstore/nb', expectedLocale: 'nb_NO' },
        { prefix: '/langstore/zh-hant', expectedLocale: 'zh-hant_TW' },
        { prefix: '/langstore/el', expectedLocale: 'el_GR' },
        { prefix: '/langstore/uk', expectedLocale: 'uk_UA' },
        { prefix: '/langstore/es-419', expectedLocale: 'es-419_ES' },
      ].forEach(({ prefix, expectedLocale }) => {
        const computedLocale = getMiloLocaleSettings({ prefix })?.locale;
        expect(computedLocale).to.equal(expectedLocale);
      });
    });

    it('should use geo locale for lang-first sites', async () => {
      sessionStorage.setItem('akamai', 'ES');
      const geoDetectionMeta = document.createElement('meta');
      geoDetectionMeta.setAttribute('name', 'mas-geo-detection');
      geoDetectionMeta.setAttribute('content', 'on');
      document.head.append(geoDetectionMeta);
      const data = [
        { prefix: '/ar', expectedLocale: 'es_AR', expectedCountry: 'ES' },
        { prefix: '/africa', expectedLocale: 'en_MU', expectedCountry: 'ES' },
        { prefix: '', expectedLocale: 'en_US', expectedCountry: 'ES' },
        { prefix: '/ae_ar', expectedLocale: 'ar_AE', expectedCountry: 'ES' },
        { prefix: '/langstore/en', expectedLocale: 'en_US', expectedCountry: 'ES' },
        { prefix: '/langstore/es', expectedLocale: 'es_ES', expectedCountry: 'ES' },
        { prefix: '/langstore/de', expectedLocale: 'de_DE', expectedCountry: 'ES' },
        { prefix: '/langstore/id', expectedLocale: 'id_ID', expectedCountry: 'ES' },
        { prefix: '/langstore/hi', expectedLocale: 'hi_IN', expectedCountry: 'ES' },
        { prefix: '/langstore/ar', expectedLocale: 'ar_DZ', expectedCountry: 'ES' },
        { prefix: '/langstore/nb', expectedLocale: 'nb_NO', expectedCountry: 'ES' },
        { prefix: '/langstore/zh-hant', expectedLocale: 'zh-hant_TW', expectedCountry: 'ES' },
        { prefix: '/langstore/el', expectedLocale: 'el_GR', expectedCountry: 'ES' },
        { prefix: '/langstore/uk', expectedLocale: 'uk_UA', expectedCountry: 'ES' },
        { prefix: '/langstore/es-419', expectedLocale: 'es-419_ES', expectedCountry: 'ES' },
      ];
      for (const { prefix, expectedLocale, expectedCountry } of data) {
        const settings = await getLocaleSettings({ prefix });
        expect(settings?.locale).to.equal(expectedLocale);
        expect(settings?.country).to.equal(expectedCountry);
      }
      sessionStorage.removeItem('akamai');
      geoDetectionMeta.remove();
    });
  });

  describe('Prices', () => {
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

    it('renders merch link to annual price', async () => {
      await validatePriceSpan('.merch.price.annual', { template: PRICE_TEMPLATE_ANNUAL });
    });

    it('renders merch link to the regular price if template is invalid', async () => {
      await validatePriceSpan('.merch.price.invalid', { template: PRICE_TEMPLATE_REGULAR });
    });

    it('renders merch link to tax exclusive price with tax exclusive attribute', async () => {
      await validatePriceSpan('.merch.price.tax-exclusive', { forceTaxExclusive: 'true' });
    });

    it('renders merch link to GB price', async () => {
      const el = await validatePriceSpan('.merch.price.gb', {});
      expect(/£/.test(el.textContent)).to.be.true;
    });
  });

  describe('Promo Prices', () => {
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

  describe('Promo Prices in a fragment', () => {
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

  describe('Prices: legal template', () => {
    it('renders merch link with legal template', async () => {
      const el = await validatePriceSpan('.merch.price.legal', { template: PRICE_TEMPLATE_LEGAL });
      expect(el.textContent).to.equal('per licenseAnnual, billed monthly');
    });
  });

  describe('CTAs A11Y', () => {
    it('decorate card ctas with aria label', async () => {
      const cards = document.querySelectorAll('.cards merch-card');
      cards.forEach(async (card) => {
        const el = await merch(card.querySelector('.merch.cta'));
        await el?.onceSettled();
        card.checkReady = () => Promise.resolve(true);
        decorateCardCtasWithA11y(card, true);
      });
      await delay(100);
      expect(cards[0].querySelector('a').getAttribute('aria-label')).to.equal('CTA1 Buy Now - PHSP - INDIVIDUAL');
      expect(cards[1].querySelector('a').getAttribute('aria-label')).to.equal('CTA2 Buy Now - PHSP - INDIVIDUAL');
      expect(cards[2].querySelector('a').getAttribute('aria-label')).to.equal('CTA3 Buy Now - Product three');
      expect(cards[3].querySelector('a').getAttribute('aria-label')).to.equal('CTA4 Buy Now');
    });
  });

  describe('CTAs', () => {
    it('renders merch link to CTA, default values', async () => {
      const el = await merch(document.querySelector('.merch.cta'));
      const { dataset, href, nodeName, textContent } = await el.onceSettled();
      const url = new URL(href);
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
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
      const el = await merch(document.querySelector('.merch.cta.config'));
      const { dataset, href, nodeName, textContent } = await el.onceSettled();
      const url = new URL(href);
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(dataset.promotionCode).to.equal(undefined);
      expect(dataset.checkoutWorkflowStep).to.equal(Defaults.checkoutWorkflowStep);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      expect(url.searchParams.get('cli')).to.equal('dc');
    });

    it('renders merch link to CTA, metadata values', async () => {
      const metadata = createTag('meta', { name: 'checkout-workflow-step', content: CheckoutWorkflowStep.SEGMENTATION });
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
      expect(dataset.checkoutWorkflowStep).to.equal(CheckoutWorkflowStep.SEGMENTATION);
      expect(dataset.checkoutMarketSegment).to.equal(undefined);
      expect(url.searchParams.get('cli')).to.equal(Defaults.checkoutClientId);
      document.head.removeChild(metadata);
    });

    it('renders merch link to cta for GB locale', async () => {
      await mockIms();
      await initService();
      const el = await merch(document.querySelector(
        '.merch.cta.gb',
      ));
      const { nodeName, href } = await el.onceSettled();
      expect(nodeName).to.equal('A');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(/49133266E474B3E6EE5D1CB98B95B824/.test(href)).to.be.true;
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

    it('adds ims country to checkout link', async () => {
      await mockIms('CH');
      await initService();
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

    it('should not add button classes to cta if href includes "#_tcl"', async () => {
      const el = await merch(document.querySelector(
        '.merch.text.link',
      ));
      const { href, textContent } = await el.onceSettled();
      expect(href.includes('#_tcl')).to.be.false;
      expect(textContent).to.equal('40% off');
      expect(el.getAttribute('is')).to.equal('checkout-link');
      expect(el.classList.contains('con-button')).to.be.false;
      expect(el.classList.contains('button-l')).to.be.false;
      expect(el.classList.contains('blue')).to.be.false;
    });

    it('renders large CTA inside a marquee', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.inside-marquee',
      ));
      const { classList } = await el.onceSettled();
      expect(classList.contains('button-l')).to.be.true;
    });

    it('extracts and applies a custom button fill class from URL hash', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.fill',
      ));
      const { classList } = await el.onceSettled();
      expect(classList.contains('fill')).to.be.true;
      expect(classList.contains('con-button')).to.be.true;
    });

    it('handles hyphenated custom button classes correctly', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.custom-hyphenated',
      ));
      const { classList } = await el.onceSettled();
      expect(classList.contains('my-custom-style')).to.be.true;
      expect(classList.contains('con-button')).to.be.true;
    });

    it('ignores invalid custom button class format', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.custom-invalid',
      ));
      const { classList } = await el.onceSettled();
      expect(classList.contains('123invalid')).to.be.false;
      expect(classList.contains('con-button')).to.be.true;
    });

    it('does not apply unexpected custom classes when no custom hash parameter exist', async () => {
      const el = await merch(document.querySelector(
        '.merch.cta.primary',
      ));
      const { classList } = await el.onceSettled();
      expect(classList.contains('fill')).to.be.false;

      expect(classList.contains('con-button')).to.be.true;
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

    it('returns cta node with the correct custom class name', async () => {
      const el = document.createElement('a');
      el.setAttribute('href', '/tools/ost?osi=29&type=checkoutUrl#_button-fill');
      const params = new URLSearchParams({ osi: '123' });
      const result = await buildCta(el, params);
      expect(result).to.not.be.null;
      expect(result.classList.contains('fill')).to.be.true;
    });

    it('returns cta node ignoring invalid hash format', async () => {
      const el = document.createElement('a');
      el.setAttribute('href', '/tools/ost?osi=29&type=checkoutUrl#_button-123fill');
      const params = new URLSearchParams({ osi: '123' });
      const result = await buildCta(el, params);
      expect(result).to.not.be.null;
      expect(result.classList.contains('123fill')).not.to.be.true;
    });

    it('returns cta node without unexpected custom class', async () => {
      const el = document.createElement('a');
      el.setAttribute('href', '/tools/ost?osi=29&type=checkoutUrl');
      const params = new URLSearchParams({ osi: '123' });
      const result = await buildCta(el, params);
      expect(result).to.not.be.null;
      expect(result.classList.contains('fill')).not.to.be.true;
      expect(result.classList.contains('con-button')).to.be.true;
    });
  });

  describe('Download flow', () => {
    it('supports download use case', async () => {
      mockIms();
      getUserEntitlements();
      mockIms('US');
      setSubscriptionsData(SUBSCRIPTION_DATA_PHSP_RAW_ELIGIBLE);
      await initService(true);
      const cta1 = await merch(document.querySelector('.merch.cta.download'));
      await cta1.onceSettled();
      const { DOWNLOAD_URL } = CHECKOUT_LINK_CONFIGS.data[1];
      expect(cta1.textContent).to.equal('Download');
      expect(cta1.href).to.equal(DOWNLOAD_URL);

      const cta2 = await merch(document.querySelector('.merch.cta.no-entitlement-check'));
      await cta2.onceSettled();
      expect(cta2.textContent).to.equal('Buy Now');
      expect(cta2.href).to.not.equal(DOWNLOAD_URL);
    });

    it('supports download use case with locale specific values', async () => {
      const newConfig = setConfig({
        ...config,
        pathname: '/fr/test.html',
        locales: { fr: { ietf: 'fr-FR' } },
        prodDomains: PROD_DOMAINS,
        placeholders: { download: 'Télécharger' },
      });
      mockIms();
      getUserEntitlements();
      mockIms('FR');
      setSubscriptionsData(SUBSCRIPTION_DATA_PHSP_RAW_ELIGIBLE);
      await initService(true);
      const cta = await merch(document.querySelector('.merch.cta.download.fr'));
      await cta.onceSettled();
      const { DOWNLOAD_URL } = CHECKOUT_LINK_CONFIGS.data[3];
      expect(cta.textContent).to.equal(newConfig.placeholders.download);
      expect(cta.href).to.equal(DOWNLOAD_URL);
    });

    it('fetchCheckoutLinkConfigs: returns null if mapping cannot be fetched', async () => {
      fetchCheckoutLinkConfigs.promise = undefined;
      setCheckoutLinkConfigs(null);
      const mappings = await fetchCheckoutLinkConfigs('http://localhost:2000/libs');
      expect(mappings.data).to.empty;
      fetchCheckoutLinkConfigs.promise = undefined;
    });

    it('getCheckoutLinkConfig: returns undefined if productFamily is not found', async () => {
      const checkoutLinkConfig = await getCheckoutLinkConfig('XYZ');
      expect(checkoutLinkConfig).to.be.undefined;
    });

    it('getDownloadAction: returns undefined if not entitled', async () => {
      const checkoutLinkConfig = await getDownloadAction({ entitlement: true }, Promise.resolve(true), [{ productArrangement: { productFamily: 'ILLUSTRATOR' } }]);
      expect(checkoutLinkConfig).to.be.undefined;
    });

    it('getDownloadAction: returns undefined if download URL is empty', async () => {
      const [photoshopConfig] = CHECKOUT_LINK_CONFIGS.data;
      photoshopConfig.DOWNLOAD_URL = '';
      setCheckoutLinkConfigs(CHECKOUT_LINK_CONFIGS);
      const checkoutLinkConfig = await getDownloadAction({ entitlement: true }, Promise.resolve(true), [{ productArrangement: { productFamily: 'PHOTOSHOP' } }]);
      expect(checkoutLinkConfig).to.be.undefined;
    });

    it('getDownloadAction: returns download action for CC_ALL_APPS', async () => {
      fetchEntitlements.promise = undefined;
      mockIms();
      getUserEntitlements();
      mockIms('US');
      setSubscriptionsData(SUBSCRIPTION_DATA_ALL_APPS_RAW_ELIGIBLE);
      const { url } = await getDownloadAction({ entitlement: true }, Promise.resolve(true), [{ productArrangement: { productFamily: 'CC_ALL_APPS' } }]);
      expect(url).to.equal('https://creativecloud.adobe.com/apps/download');
    });

    it('getCheckoutAction: handles errors gracefully', async () => {
      const imsSignedInPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('error'));
        }, 1);
      });
      const action = await getCheckoutAction([{ productArrangement: {} }], {}, imsSignedInPromise);
      expect(action).to.be.empty;
    });
  });

  describe('Upgrade Flow', () => {
    beforeEach(() => {
      getMasBase.baseUrl = undefined;
      updateSearch({});
    });

    it('updates CTA text to Upgrade Now', async () => {
      mockIms();
      getUserEntitlements();
      mockIms('US');
      setSubscriptionsData(SUBSCRIPTION_DATA_PHSP_RAW_ELIGIBLE);
      const target = await merch(document.querySelector('.merch.cta.upgrade-target'));
      await target.onceSettled();
      const sourceCta = await merch(document.querySelector('.merch.cta.upgrade-source'));
      await sourceCta.onceSettled();
      expect(sourceCta.textContent).to.equal('Upgrade Now');
    });
  });

  describe('openModal', () => {
    it('sets the new hash when it is passed as argument', async () => {
      modalState.isOpen = false;
      const prevHash = window.location.hash;
      await openModal(new CustomEvent('test'), 'https://www.adobe.com/mini-plans/creativecloud.html?mid=ft&web=1', 'TRIAL', 'mini-plans-web-cta-creative-cloud-card');
      expect(window.location.hash).to.equal('#mini-plans-web-cta-creative-cloud-card');
      window.location.hash = prevHash;
      modalState.isOpen = false;
    });

    it('opens the 3-in-1 modal', async () => {
      const prevHash = window.location.hash;
      modalState.isOpen = false;
      const checkoutLink = document.createElement('a');
      checkoutLink.setAttribute('is', 'checkout-link');
      checkoutLink.setAttribute('data-checkout-workflow-step', 'segmentation');
      checkoutLink.setAttribute('data-modal', 'crm');
      checkoutLink.setAttribute('data-quantity', '1');
      checkoutLink.setAttribute('data-wcs-osi', 'JzW8dgW8U1SrgbHDmTE-ABsOKPgtl5jugiW8bA5PtKg');
      checkoutLink.setAttribute('data-extra-options', '{"rf":"uc_segmentation_hide_tabs_cr"}');
      checkoutLink.setAttribute('class', 'con-button placeholder-resolved');
      checkoutLink.setAttribute('href', 'https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&rf=uc_segmentation_hide_tabs_cr&lang=en&ms=COM&ot=TRIAL&cs=INDIVIDUAL&pa=ccsn_direct_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close');
      checkoutLink.setAttribute('daa-ll', 'Free trial-5--creative-cloud');
      checkoutLink.setAttribute('data-modal-id', 'mini-plans-web-cta-creative-cloud-card');
      Object.defineProperty(checkoutLink, 'isOpen3in1Modal', { get: () => true });

      await openModal(new CustomEvent('test'), 'https://www.adobe.com/mini-plans/creativecloud.html?mid=ft&web=1', 'TRIAL', 'mini-plans-web-cta-creative-cloud-card', { rf: 'uc_segmentation_hide_tabs_cr' }, checkoutLink);

      const threeInOneModal = document.querySelector('.dialog-modal.three-in-one');
      expect(threeInOneModal).to.exist;
      const iFrame = document.querySelector('.dialog-modal.three-in-one iframe');
      expect(iFrame.src).to.equal('https://commerce.adobe.com/store/segmentation?cli=creative&ctx=if&co=US&rf=uc_segmentation_hide_tabs_cr&lang=en&ms=COM&ot=TRIAL&cs=INDIVIDUAL&pa=ccsn_direct_individual&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close');
      threeInOneModal.remove();
      window.location.hash = prevHash;
      modalState.isOpen = false;
    });
  });

  describe('Modal flow', () => {
    it('renders TWP modal', async () => {
      mockIms();
      const el = document.querySelector('.merch.cta.twp');
      const cta = await merch(el);
      const { nodeName, textContent } = await cta.onceSettled();
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Free Trial');
      expect(cta.getAttribute('href')).to.equal('#');
      cta.click();
      await delay(100);
      expect(document.querySelector('iframe').src).to.equal('https://www.adobe.com/mini-plans/illustrator.html?mid=ft&web=1');
      const modal = document.getElementById('checkout-link-modal');
      expect(modal).to.exist;
      document.querySelector('.modal-curtain').click();
    });

    it('renders D2P modal', async () => {
      mockIms();
      const el = document.querySelector('.merch.cta.d2p');
      const cta = await merch(el);
      const { nodeName, textContent } = await cta.onceSettled();
      expect(nodeName).to.equal('A');
      expect(textContent).to.equal('Buy Now');
      expect(cta.getAttribute('href')).to.equal('#');
      cta.click();
      await delay(100);
      expect(document.querySelector('iframe').src).to.equal('https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/illustrator/master.modal.html');
      const modal = document.getElementById('checkout-link-modal');
      expect(modal).to.exist;
      document.querySelector('.modal-curtain').click();
    });

    it('renders TWP modal with preselected plan that overrides extra options', async () => {
      mockIms();
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'preselect-plan');
      meta.setAttribute('content', 'edu');
      document.getElementsByTagName('head')[0].appendChild(meta);
      const el = document.querySelector('.merch.cta.twp.preselected-plan');
      const cta = await merch(el);
      const { nodeName } = await cta.onceSettled();
      expect(nodeName).to.equal('A');
      cta.click();
      await delay(100);
      expect(document.querySelector('iframe').src).to.equal('https://www.adobe.com/mini-plans/illustrator.html?mid=ft&web=1&plan=edu');
      document.querySelector('meta[name="preselect-plan"]').remove();
    });

    it('getCheckoutLinkConfig: finds using paCode', async () => {
      let checkoutLinkConfig = await getCheckoutLinkConfig(undefined, undefined, 'testPaCode');
      expect(checkoutLinkConfig.DOWNLOAD_TEXT).to.equal('paCode');
      checkoutLinkConfig = await getCheckoutLinkConfig('', '', 'testPaCode');
      expect(checkoutLinkConfig.DOWNLOAD_TEXT).to.equal('paCode');
    });

    it('getCheckoutLinkConfig: finds using paCode and svar', async () => {
      const options = { extraOptions: '{"svar": "abc", "other": "xyz"}' };
      const checkoutLinkConfig = await getCheckoutLinkConfig(undefined, undefined, 'ILLUSTRATOR', options);
      expect(checkoutLinkConfig.FREE_TRIAL_PATH).to.equal('https://www.adobe.com/mini-plans/illustrator_abc.html?mid=ft&web=1');
      expect(checkoutLinkConfig.BUY_NOW_PATH).to.equal('https://www.adobe.com/buy/mini-plans/illustrator_abc.html?mid=ft&web=1');
    });

    it('getCheckoutLinkConfig: finds using paCode and no svar', async () => {
      const options = { extraOptions: '{"other": "xyz"}' };
      const checkoutLinkConfig = await getCheckoutLinkConfig(undefined, undefined, 'ILLUSTRATOR', options);
      expect(checkoutLinkConfig.FREE_TRIAL_PATH).to.equal('https://www.adobe.com/mini-plans/illustrator.html?mid=ft&web=1');
      expect(checkoutLinkConfig.BUY_NOW_PATH).to.equal('https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/illustrator/master.modal.html');
    });

    it('getCheckoutLinkConfig: finds using productCode', async () => {
      let checkoutLinkConfig = await getCheckoutLinkConfig(undefined, 'testProductCode', undefined);
      expect(checkoutLinkConfig.DOWNLOAD_TEXT).to.equal('productCode');
      checkoutLinkConfig = await getCheckoutLinkConfig('', 'testProductCode', '');
      expect(checkoutLinkConfig.DOWNLOAD_TEXT).to.equal('productCode');
    });

    it('getModalAction: returns undefined if modal path is cancelled', async () => {
      setConfig({
        ...config,
        pathname: '/fr/test.html',
        locales: { fr: { ietf: 'fr-FR' } },
        prodDomains: PROD_DOMAINS,
        placeholders: { download: 'Télécharger' },
      });
      fetchCheckoutLinkConfigs.promise = undefined;
      setCheckoutLinkConfigs(CHECKOUT_LINK_CONFIGS);
      const action = await getModalAction([{ productArrangement: { productFamily: 'PHOTOSHOP' } }], { modal: true });
      expect(action).to.be.undefined;
    });

    it('getModalAction: localize buy now path if it comes from us/en production', async () => {
      setConfig({
        ...config,
        pathname: '/fr/test.html',
        locales: { fr: { ietf: 'fr-FR' } },
        prodDomains: PROD_DOMAINS,
        placeholders: { download: 'Télécharger' },
      });
      fetchCheckoutLinkConfigs.promise = undefined;
      setCheckoutLinkConfigs(CHECKOUT_LINK_CONFIGS);
      const action = await getModalAction([{ productArrangement: { productFamily: 'ILLUSTRATOR' } }], { modal: true });
      expect(action.url).to.equal('https://www.adobe.com/fr/plans-fragments/modals/individual/modals-content-rich/illustrator/master.modal.html');
    });

    it('getModalAction: skip modal url localization if url is invalid', async () => {
      setConfig({
        ...config,
        pathname: '/fr/test.html',
        locales: { fr: { ietf: 'fr-FR' } },
        prodDomains: PROD_DOMAINS,
        placeholders: { download: 'Télécharger' },
      });
      fetchCheckoutLinkConfigs.promise = undefined;
      setCheckoutLinkConfigs(CHECKOUT_LINK_CONFIGS);
      const action = await getModalAction([{ productArrangement: { productFamily: 'AUDITION' } }], { modal: true });
      expect(action.url).to.equal('www.adobe.com/will/not/be/localized.html');
    });

    it('getModalAction: returns undefined if checkout-link config is not found', async () => {
      fetchCheckoutLinkConfigs.promise = undefined;
      setCheckoutLinkConfigs(CHECKOUT_LINK_CONFIGS);
      const action = await getModalAction([{ productArrangement: { productFamily: 'XZY' } }], { modal: true });
      expect(action).to.be.undefined;
    });

    it('setCtaHash: sets authored hash', async () => {
      const el = createCtaInMerchCard();
      const hash = setCtaHash(el, { FREE_TRIAL_HASH: 'try-photoshop-authored' }, 'TRIAL');
      expect(hash).to.equal('try-photoshop-authored');
    });

    it('setCtaHash: does nothing with invalid params', async () => {
      expect(setCtaHash()).to.be.undefined;
    });

    const MODAL_URLS = [
      {
        url: 'https://www.adobe.com/mini-plans/illustrator1.html?mid=ft&web=1',
        plan: 'edu',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator1.html?mid=ft&web=1&plan=edu',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator2.html?mid=ft&web=1&plan=abc',
        plan: 'edu',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator2.html?mid=ft&web=1&plan=edu',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator3.html?mid=ft&web=1#thisishash',
        plan: 'edu',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator3.html?mid=ft&web=1&plan=edu#thisishash',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator4.html',
        plan: 'edu',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator4.html?plan=edu',
      },
      {
        url: '/mini-plans/illustrator4.html',
        plan: 'edu',
        urlWithPlan: '/mini-plans/illustrator4.html?plan=edu',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator5.html#thisishash',
        plan: 'edu',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator5.html?plan=edu#thisishash',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator6.html?mid=ft&web=1',
        plan: 'team',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator6.html?mid=ft&web=1&plan=team',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator7.html?mid=ft&web=1',
        plan: '',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator7.html?mid=ft&web=1',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator8.selector.html/resource?mid=ft&web=1#thisishash',
        plan: 'team',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator8.selector.html/resource?mid=ft&web=1&plan=team#thisishash',
      },
      {
        url: '/mini-plans/illustrator8.selector.html/resource?mid=ft&web=1#thisishash',
        plan: 'team',
        urlWithPlan: '/mini-plans/illustrator8.selector.html/resource?mid=ft&web=1&plan=team#thisishash',
      },
      {
        url: 'https://www.adobe.com/mini-plans/illustrator9.sel1.sel2.html/resource#thisishash',
        plan: 'team',
        urlWithPlan: 'https://www.adobe.com/mini-plans/illustrator9.sel1.sel2.html/resource?plan=team#thisishash',
      },
      {
        url: 'www.adobe.com/mini-plans/illustrator10.html?mid=ft&web=1', // invalid URL, protocol is missing
        plan: 'edu',
        urlWithPlan: 'www.adobe.com/mini-plans/illustrator10.html?mid=ft&web=1',
      },
    ];
    MODAL_URLS.forEach((modalUrl) => {
      it(`appends preselected plan ${modalUrl.plan} to modal URL ${modalUrl.url}`, async () => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'preselect-plan');
        meta.setAttribute('content', modalUrl.plan);
        document.getElementsByTagName('head')[0].appendChild(meta);

        const resultUrl = appendDexterParameters(modalUrl.url);
        expect(resultUrl).to.equal(modalUrl.urlWithPlan);
        document.querySelector('meta[name="preselect-plan"]').remove();
      });
    });

    [{ param: 'promoid', value: 'test', result: 'promoid=test' },
      { param: 'ms', value: 'e', result: 'plan=edu' },
      { param: 'cs', value: 't', result: 'plan=team' },
    ].forEach(({ param, value, result }) => {
      it(`appends extra options with param ${param}=${value} to legacy modal URL`, () => {
        const url = 'https://www.adobe.com/plans-fragments/modals/individual/modals-content-rich/all-apps/master.modal.html';
        const resultUrl = appendDexterParameters(url, JSON.stringify({ [param]: value }));
        expect(resultUrl).to.equal(`${url}?${result}`);
      });
    });

    it('does not append extra options to URL if invalid URL or params not provided', () => {
      const invalidUrl = 'invalid-url';
      const resultUrl = appendDexterParameters(invalidUrl, JSON.stringify({ promoid: 'test' }));
      expect(resultUrl).to.equal(invalidUrl);
      const resultUrl2 = appendDexterParameters(invalidUrl);
      expect(resultUrl2).to.equal(invalidUrl);
    });

    it('appends extra options if the provided url is relative', () => {
      const relativeUrl = '/plans-fragments/modals/individual/modals-content-rich/all-apps/master.modal.html';
      const resultUrl = appendDexterParameters(relativeUrl, JSON.stringify({ promoid: 'test' }));
      expect(resultUrl).to.include('?promoid=test');
    });
  });

  describe('updateModalState', () => {
    const prevHash = window.location.hash;

    afterEach(() => {
      modalState.isOpen = false;
      document.querySelector('.dialog-modal')?.remove();
      window.location.hash = prevHash;
    });

    it('closes the modal on back navigation on catalog page when filters were selected', async () => {
      modalState.isOpen = false;
      const modal = document.createElement('div');
      modal.classList.add('dialog-modal');
      modal.id = 'mini-plans-web-cta-creative-cloud-card';
      document.body.appendChild(modal);
      window.location.hash = '#category=photo&types=desktop';
      modalState.isOpen = true;
      const isModalOpen = await updateModalState();
      expect(isModalOpen).to.be.false;
    });

    it('reflects the state when the modal gets closed by user click', async () => {
      const modal = document.createElement('div');
      modal.classList.add('dialog-modal');
      modal.id = 'mini-plans-web-cta-creative-cloud-card';
      document.body.appendChild(modal);
      const isModalOpen = await updateModalState({ closedByUser: true });
      expect(isModalOpen).to.be.false;
    });

    it('closes the modal when the hash was removed from the URL', async () => {
      window.location.hash = '';
      const modal = document.createElement('div');
      modal.id = 'mini-plans-web-cta-creative-cloud-card';
      modal.classList.add('dialog-modal');
      document.body.appendChild(modal);
      const isModalOpen = await updateModalState();
      expect(isModalOpen).to.be.false;
    });
  });

  describe('locale settings', () => {
    it('should map correct commerce locale', async () => {
      [
        { prefix: '/ar', expectedLocale: 'es_AR' },
        { prefix: '/africa', expectedLocale: 'en_MU' },
        { prefix: '', expectedLocale: 'en_US' },
        { prefix: '/ae_ar', expectedLocale: 'ar_AE' },
      ].forEach(({ prefix, expectedLocale }) => {
        const wcsLocale = getMiloLocaleSettings({ prefix }).locale;
        expect(wcsLocale).to.be.equal(expectedLocale);
      });
    });
  });

  describe('getOptions method', () => {
    it('gets fragment id', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&fragment=07b8be51-492a-4814-9953-a657fd3d9f67');
      expect(getOptions(a).fragment).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
    });

    it('gets fragment id from query', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=07b8be51-492a-4814-9953-a657fd3d9f67');
      expect(getOptions(a).fragment).to.equal('07b8be51-492a-4814-9953-a657fd3d9f67');
    });

    it('handles missing fragment id', () => {
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom');
      expect(getOptions(a).fragment).to.be.undefined;
    });
  });
  describe('Localize preview links', () => {
    it('check if only preview URL is relative', () => {
      const div = document.createElement('div');

      const a1 = document.createElement('a');
      a1.classList.add('link1');
      a1.setAttribute('href', 'https://main--milo--adobecom.aem.page/test/milo/path');
      div.append(a1);

      const a2 = document.createElement('a');
      a2.classList.add('link2');
      a2.setAttribute('href', 'https://main--cc--adobecom.hlx.live/test/cc/path');
      div.append(a2);

      const a3 = document.createElement('a');
      a3.classList.add('link3');
      a3.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom');
      div.append(a3);

      const aNoHref = document.createElement('a');
      div.append(aNoHref);

      localizePreviewLinks(div);

      expect(div.querySelector('.link1').getAttribute('href')).to.equal('/test/milo/path');
      expect(div.querySelector('.link2').getAttribute('href')).to.equal('/test/cc/path');
      expect(div.querySelector('.link3').getAttribute('href')).to.equal('https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom');
    });
  });

  describe('isFallbackStepUsed', () => {
    it('returns true if modal is 3-in-1, fallbackStep is provided and 3-in-1 is disabled', () => {
      disable3in1();
      expect(isFallbackStepUsed({
        modal: 'twp',
        fallbackStep: 'commitment',
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        checkoutClientId: 'doc_cloud',
      })).to.be.true;
      expect(isFallbackStepUsed({
        modal: 'd2p',
        fallbackStep: 'commitment',
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        checkoutClientId: 'doc_cloud',
      })).to.be.true;
      expect(isFallbackStepUsed({
        modal: 'crm',
        fallbackStep: 'commitment',
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        checkoutClientId: 'doc_cloud',
      })).to.be.true;
      document.querySelector('meta[name="mas-ff-3in1"]').remove();
    });

    it('returns false if 3-in-1 is enabled', () => {
      expect(isFallbackStepUsed({
        modal: 'crm',
        fallbackStep: 'commitment',
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        checkoutClientId: 'adobe_com',
      })).to.be.false;
    });

    it('returns false if modal is not 3-in-1', () => {
      expect(isFallbackStepUsed({
        modal: undefined,
        fallbackStep: 'commitment',
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        checkoutClientId: 'doc_cloud',
      })).to.be.false;
      expect(isFallbackStepUsed({
        modal: 'typo',
        fallbackStep: 'commitment',
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        checkoutClientId: 'doc_cloud',
      })).to.be.false;
    });
  });

  describe('getWorkflowStep', () => {
    it('returns checkoutWorkflowStep if 3-in-1 is enabled', () => {
      const workflowStep = getWorkflowStep({
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        modal: 'twp',
        fallbackStep: 'commitment',
        checkoutWorkflowStep: 'segmentation',
        checkoutClientId: 'doc_cloud',
      });
      expect(workflowStep).to.equal('segmentation');
    });

    it('returns checkoutWorkflowStep if fallbackStep is not provided', () => {
      disable3in1();
      const workflowStep = getWorkflowStep({
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        modal: 'twp',
        fallbackStep: undefined,
        checkoutWorkflowStep: 'segmentation',
        checkoutClientId: 'adobe_com',
      });
      expect(workflowStep).to.equal('segmentation');
      document.querySelector('meta[name="mas-ff-3in1"]').remove();
    });

    it('returns fallbackStep if fallbackStep is provided, and 3-in-1 is disabled', () => {
      disable3in1();
      const workflowStep = getWorkflowStep({
        wcsOsi: 'vQmS1H18A6_kPd0tYBgKnp-TQIF0GbT6p8SH8rWcLMs',
        modal: 'twp',
        fallbackStep: 'commitment',
        checkoutWorkflowStep: 'segmentation',
        checkoutClientId: 'doc_cloud',
      });
      expect(workflowStep).to.equal('commitment');
      document.querySelector('meta[name="mas-ff-3in1"]').remove();
    });
  });
});
