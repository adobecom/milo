import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig, setConfig } from '../../../libs/utils/utils.js';
import { applyPers, matchGlob } from '../../../libs/features/personalization/personalization.js';

document.head.innerHTML = await readFile({ path: './mocks/metadata.html' });
document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('Functional Test', () => {
  before(() => {
    // Add custom keys so tests doesn't rely on real data
    const config = getConfig();
    config.env = { name: 'prod' };
    config.consumerEntitlements = {
      '11111111-aaaa-bbbb-6666-cccccccccccc': 'my-special-app',
      '22222222-xxxx-bbbb-7777-cccccccccccc': 'fireflies',
    };
  });

  it('Invalid selector should not fail page render and rest of items', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestInvalid.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

    expect(document.querySelector('.marquee')).to.not.be.null;
    expect(document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter2"]')).to.be.null;
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const fragment = document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter2"]');
    expect(fragment).to.not.be.null;
    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('scheduled manifest should apply changes if active (bts)', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestScheduledActive.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    expect(document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter3"]')).to.be.null;
    const event = { name: 'bts', start: new Date('2023-11-24T13:00:00+00:00'), end: new Date('2222-11-24T13:00:00+00:00') };
    await applyPers([{ manifestPath: '/promos/bts/manifest.json', disabled: false, event }]);

    const fragment = document.querySelector('a[href="/test/features/personalization/mocks/fragments/insertafter3"]');
    expect(fragment).to.not.be.null;

    expect(fragment.parentElement.previousElementSibling.className).to.equal('marquee');
  });

  it('scheduled manifest should not apply changes if not active (blackfriday)', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestScheduledInactive.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    expect(document.querySelector('a[href="/fragments/insertafter4"]')).to.be.null;
    const event = { name: 'blackfriday', start: new Date('2022-11-24T13:00:00+00:00'), end: new Date('2022-11-24T13:00:00+00:00') };
    await applyPers([{ manifestPath: '/promos/blackfriday/manifest.json', disabled: true, event }]);

    const fragment = document.querySelector('a[href="/fragments/insertafter4"]');
    expect(fragment).to.be.null;
  });

  it('test or promo manifest type', async () => {
    let config = getConfig();
    config.mep = {};
    let manifestJson = await readFile({ path: './mocks/manifestTestOrPromo.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    config = getConfig();
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(config.experiments[0].manifestType).to.equal('test or promo');
  });

  it('should choose chrome & logged out', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestWithAmpersand.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|chrome & logged|ampersand');
  });

  it('should choose not firefox', async () => {
    let manifestJson = await readFile({ path: './mocks/manifestWithNot.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    const config = getConfig();
    expect(config.mep?.martech).to.equal('|not firefox|not');
  });

  it('should read and use entitlement data', async () => {
    setConfig(getConfig());
    const config = getConfig();
    config.consumerEntitlements = { 'consumer-defined-entitlement': 'fireflies' };
    config.entitlements = () => Promise.resolve(['indesign-any', 'fireflies', 'after-effects-any']);

    let manifestJson = await readFile({ path: './mocks/manifestUseEntitlements.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);
    await applyPers([{ manifestPath: '/path/to/manifest.json' }]);
    expect(getConfig().mep?.martech).to.equal('|fireflies|manifest');
  });
});

describe('matchGlob function', () => {
  it('should match page', async () => {
    const result = matchGlob('/products/special-offers', '/products/special-offers');
    expect(result).to.be.true;
  });

  it('should match page with HTML extension', async () => {
    const result = matchGlob('/products/special-offers', '/products/special-offers.html');
    expect(result).to.be.false;
  });

  it('should not match child page', async () => {
    const result = matchGlob('/products/special-offers', '/products/special-offers/free-download');
    expect(result).to.be.false;
  });

  it('should match child page', async () => {
    const result = matchGlob('/products/special-offers**', '/products/special-offers/free-download');
    expect(result).to.be.true;
  });
});
