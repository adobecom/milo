import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';
import { mockOstDeps, unmockOstDeps } from './mocks/ost-utils.js';
import { DEFAULT_CTA_TEXT, createLinkMarkup, addToggleSwitches } from '../../../libs/blocks/ost/ost.js';

const perpM2M = {
  offer_id: 'aeb0bf53517d46e89a1b039f859cf573',
  commitment: 'PERPETUAL',
  name: 'Stock',
  planType: 'M2M',
};
const defaults = {
  checkoutWorkflow: 'UCv3',
  checkoutWorkflowStep: 'email',
};
const osi = 'cea462e983f649bca2293325c9894bdd';
const promo = 'test-promo';
const texts = {
  buy: DEFAULT_CTA_TEXT,
  try: 'free-trial',
};
const types = {
  checkoutUrl: 'checkoutUrl',
  price: 'price',
  opticalPrice: 'opticalPrice',
};

function assertLink(link, offer, params, text = texts.buy) {
  const { searchParams } = new URL(link.href);
  Object.entries(params).forEach(([key, value]) => {
    expect(searchParams.get(key)).to.equal(String(value));
  });
  if (params.type === types.checkoutUrl) {
    expect(searchParams.get('text')).to.equal(text);
    expect(link.text).to.equal(`CTA {{${text}}}`);
  } else {
    expect(link.text).to.equal(`PRICE - ${offer.planType} - ${offer.name}`);
  }
}

function createLink(params = {}) {
  return createLinkMarkup(
    defaults,
    params.osi ?? osi,
    params.type,
    perpM2M,
    params,
    params.promo,
  );
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  unmockOstDeps();
});

describe('OST: loadOstEnv', async () => {
  it('fetches and returns page status and metadata', async () => {
    const {
      options: { country, language, workflow },
      params,
    } = mockOstDeps({ mockToken: true });

    const {
      AOS_API_KEY,
      CHECKOUT_CLIENT_ID,
      WCS_ENV,
      WCS_API_KEY,
      loadOstEnv,
    } = await import('../../../libs/blocks/ost/ost.js');

    expect(await loadOstEnv()).to.include({
      aosAccessToken: params.token,
      aosApiKey: AOS_API_KEY,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      workflow,
      country,
      environment: WCS_ENV,
      language,
      wcsApiKey: WCS_API_KEY,
      modalsAndEntitlements: true,
    });
  });

  it('redirects deprecated parameters', async () => {
    const originalSearch = window.location.search;
    window.history.replaceState({}, null, `${window.location.pathname}?wcsLandscape=DRAFT&commerce.env=stage&other=param`);
    const { loadOstEnv } = await import('../../../libs/blocks/ost/ost.js');
    await loadOstEnv();
    const params = new URLSearchParams(window.location.search);
    expect(params.get('commerce.landscape')).to.equal('DRAFT');
    expect(params.get('wcsLandscape')).to.be.null;
    expect(params.get('commerce.env')).to.be.null;
    expect(params.get('other')).to.equal('param');
    window.history.replaceState({}, null, `${window.location.pathname}${originalSearch}`);
  });

  it('tolerates page metadata request fail', async () => {
    const { options: { country, language } } = mockOstDeps({ failMetadata: true });

    const {
      AOS_API_KEY,
      CHECKOUT_CLIENT_ID,
      WCS_ENV,
      WCS_API_KEY,
      loadOstEnv,
    } = await import('../../../libs/blocks/ost/ost.js');

    expect(await loadOstEnv()).to.include({
      aosAccessToken: null,
      aosApiKey: AOS_API_KEY,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      country,
      environment: WCS_ENV,
      language,
      wcsApiKey: WCS_API_KEY,
    });
  });

  it('tolerates page status request fail', async () => {
    mockOstDeps({ failStatus: true });

    const {
      AOS_API_KEY,
      CHECKOUT_CLIENT_ID,
      WCS_ENV,
      WCS_API_KEY,
      loadOstEnv,
    } = await import('../../../libs/blocks/ost/ost.js');

    expect(await loadOstEnv()).to.include({
      aosAccessToken: null,
      aosApiKey: AOS_API_KEY,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      country: 'US',
      environment: WCS_ENV,
      language: 'en',
      wcsApiKey: WCS_API_KEY,
    });
  });
});

describe('OST: init', () => {
  it('opens OST without waiting for IMS if query string includes token', async () => {
    const {
      options: { country, language, workflow },
      params: { token },
    } = mockOstDeps({ mockToken: true });

    const {
      AOS_API_KEY,
      CHECKOUT_CLIENT_ID,
      WCS_ENV,
      WCS_API_KEY,
      default: init,
    } = await import('../../../libs/blocks/ost/ost.js');
    await init(document.body.firstChild);

    expect(window.ost.openOfferSelectorTool.called).to.be.true;
    expect(window.ost.openOfferSelectorTool.getCall(0).args[0]).to.include({
      aosAccessToken: token,
      aosApiKey: AOS_API_KEY,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      country,
      environment: WCS_ENV,
      language,
      wcsApiKey: WCS_API_KEY,
      workflow,
    });
  });

  it('waits for IMS callback to open OST if query string does not include token', async () => {
    const { options: { country, language, workflow } } = mockOstDeps({ mockToken: false });

    const token = 'test-token';
    const {
      AOS_API_KEY,
      CHECKOUT_CLIENT_ID,
      WCS_ENV,
      WCS_API_KEY,
      default: init,
    } = await import('../../../libs/blocks/ost/ost.js');
    await init(document.body.firstChild);

    expect(window.ost.openOfferSelectorTool.called).to.be.false;
    window.adobeid.onAccessToken({ token });

    expect(window.ost.openOfferSelectorTool.called).to.be.true;
    expect(window.ost.openOfferSelectorTool.getCall(0).args[0]).to.include({
      aosAccessToken: token,
      aosApiKey: AOS_API_KEY,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      workflow,
      country,
      environment: WCS_ENV,
      language,
      wcsApiKey: WCS_API_KEY,
    });
  });

  it('forces IMS sign-in for anonymous user when IMS is ready', async () => {
    mockOstDeps({ failStatus: true });

    const { default: init } = await import('../../../libs/blocks/ost/ost.js');
    await init(document.body.firstChild);
    window.adobeid.onReady();
    expect(window.adobeIMS.signIn.called).to.be.true;
  });

  it('opens OST with overwritten WCS "landscape" and "env" values', async () => {
    const {
      options: { country, language, workflow },
      params: { token },
    } = mockOstDeps({ mockToken: true, overrideParams: { 'commerce.landscape': 'DRAFT', env: 'stage' } });

    const {
      AOS_API_KEY,
      CHECKOUT_CLIENT_ID,
      WCS_API_KEY,
      default: init,
    } = await import('../../../libs/blocks/ost/ost.js');
    await init(document.body.firstChild);

    expect(window.ost.openOfferSelectorTool.called).to.be.true;
    expect(window.ost.openOfferSelectorTool.getCall(0).args[0]).to.include({
      aosAccessToken: token,
      aosApiKey: AOS_API_KEY,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      country,
      environment: 'stage',
      landscape: 'DRAFT',
      language,
      wcsApiKey: WCS_API_KEY,
      workflow,
    });
  });
});

describe('OST: merch link creation', () => {
  describe('checkout-link', () => {
    const type = types.checkoutUrl;

    it('with default params', async () => {
      const link = createLink({ type });
      assertLink(link, perpM2M, { osi, type });
      expect({ ...link.dataset }).to.eql({});
    });

    it('with promo and custom text', async () => {
      const ctaText = texts.try;
      const link = createLink({ ctaText, promo, type });
      assertLink(link, perpM2M, { osi, promo, type }, ctaText);
    });

    it('with custom options', async () => {
      const ctaText = texts.try;
      const modal = 'd2p';
      const entitlement = 'true';
      const upgrade = 'false';
      const link = createLink({ ctaText, modal, entitlement, upgrade, type });
      assertLink(link, perpM2M, { osi, modal, entitlement, upgrade, type }, ctaText);
    });
  });

  describe('inline-price', () => {
    const type = types.price;

    it('with default params', async () => {
      const link = createLink({ type });
      assertLink(link, perpM2M, { osi, type });
    });

    it('with default params from OST', async () => {
      const link = createLink({
        type,
        displayRecurrence: true,
        displayPerUnit: true,
        displayTax: false,
        displayOldPrice: false,
        forceTaxExclusive: false,
      });
      expect(link.href).to.eql('https://milo.adobe.com/tools/ost?osi=cea462e983f649bca2293325c9894bdd&type=price&perp=true');
    });

    it('with custom options', async () => {
      const displayRecurrence = true;
      const displayPerUnit = true;
      const displayTax = true;
      const forceTaxExclusive = true;
      const link = createLink({
        displayRecurrence,
        displayPerUnit,
        displayTax,
        forceTaxExclusive,
        type,
      });
      assertLink(link, perpM2M, {
        tax: displayTax,
        exclusive: forceTaxExclusive,
        osi,
        type,
      });
    });
  });
});
describe('OST: toggle switches', () => {
  it('change toggle switch landscape from PUBLISHED to DRAFT', async () => {
    const el = document.createElement('div');
    const ostEnv = { landscape: 'PUBLISHED' };
    const windowObj = { location: {} };
    const cbs = addToggleSwitches(el, ostEnv, true, windowObj);
    const cbLandscape = cbs[0];
    const cbLDefaults = cbs[1];

    expect(cbLandscape.checked).to.be.false;
    expect(cbLDefaults.checked).to.be.true;

    cbLandscape.checked = true;
    cbLandscape.dispatchEvent(new Event('change'));
    await delay(100);

    const url = new URL(windowObj.location.href);
    expect(url.searchParams.get('commerce.landscape')).to.equal('DRAFT');
    expect(url.searchParams.get('commerce.defaults')).to.be.null;
  });
  it('change toggle switch defaults on to off', async () => {
    const el = document.createElement('div');
    const ostEnv = { landscape: 'PUBLISHED' };
    const windowObj = { location: {} };
    const cbs = addToggleSwitches(el, ostEnv, true, windowObj);
    const cbLandscape = cbs[0];
    const cbLDefaults = cbs[1];

    expect(cbLandscape.checked).to.be.false;
    expect(cbLDefaults.checked).to.be.true;

    cbLDefaults.checked = false;
    cbLDefaults.dispatchEvent(new Event('change'));
    await delay(100);

    const url = new URL(windowObj.location.href);
    expect(url.searchParams.get('commerce.landscape')).to.be.null;
    expect(url.searchParams.get('commerce.defaults')).to.equal('off');
  });
  it('change toggle switch landscape from DRAFT to PUBLISHED', async () => {
    const originalSearch = window.location.search;
    window.history.replaceState({}, null, `${window.location.pathname}?commerce.landscape=DRAFT&commerce.defaults=off`);
    const el = document.createElement('div');
    const ostEnv = { landscape: 'DRAFT' };
    const windowObj = { location: {} };
    const cbs = addToggleSwitches(el, ostEnv, false, windowObj);
    const cbLandscape = cbs[0];
    const cbLDefaults = cbs[1];

    expect(cbLandscape.checked).to.be.true;
    expect(cbLDefaults.checked).to.be.false;

    cbLandscape.checked = false;
    cbLandscape.dispatchEvent(new Event('change'));
    await delay(100);

    const url = new URL(windowObj.location.href);
    expect(url.searchParams.get('commerce.landscape')).to.be.null;
    expect(url.searchParams.get('commerce.defaults')).to.equal('off');

    window.history.replaceState({}, null, `${window.location.pathname}${originalSearch}`);
  });
  it('change toggle switch defaults off to on', async () => {
    const originalSearch = window.location.search;
    window.history.replaceState({}, null, `${window.location.pathname}?commerce.landscape=DRAFT&commerce.defaults=off`);
    const el = document.createElement('div');
    const ostEnv = { landscape: 'DRAFT' };
    const windowObj = { location: {} };
    const cbs = addToggleSwitches(el, ostEnv, false, windowObj);
    const cbLandscape = cbs[0];
    const cbLDefaults = cbs[1];

    expect(cbLandscape.checked).to.be.true;
    expect(cbLDefaults.checked).to.be.false;

    cbLDefaults.checked = true;
    cbLDefaults.dispatchEvent(new Event('change'));
    await delay(100);

    const url = new URL(windowObj.location.href);
    expect(url.searchParams.get('commerce.landscape')).to.equal('DRAFT');
    expect(url.searchParams.get('commerce.defaults')).to.be.null;

    window.history.replaceState({}, null, `${window.location.pathname}${originalSearch}`);
  });
});
