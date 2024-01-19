import { expect } from '@esm-bundle/chai';

import { mockOstDeps, unmockOstDeps } from './mocks/ost-utils.js';

afterEach(() => {
  unmockOstDeps();
});

describe('loadOstEnv', async () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
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
    });
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

describe('init', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });
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
    } = mockOstDeps({ mockToken: true, overrideParams: { wcsLandscape: 'DRAFT', env: 'stage' } });

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
