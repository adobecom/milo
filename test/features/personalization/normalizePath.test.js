import { expect } from '@esm-bundle/chai';
import { getConfig } from '../../../libs/utils/utils.js';
import { normalizePath } from '../../../libs/features/personalization/personalization.js';

describe('normalizePath function', () => {
  const config = getConfig();
  config.locale = {
    ietf: 'en-US',
    prefix: '',
  };
  it('add forward slash when needed', async () => {
    const path = await normalizePath('path/fragment.plain.html');
    expect(path).to.equal('/path/fragment.plain.html');
  });

  it('does not localize for US page', async () => {
    const path = await normalizePath('https://main--milo--adobecom.aem.page/path/to/fragment.plain.html');
    expect(path).to.equal('/path/to/fragment.plain.html');
  });

  it('does not localize for #_dnt', async () => {
    const path = await normalizePath('https://main--milo--adobecom.aem.page/path/to/fragment.plain.html#_dnt');
    expect(path).to.equal('/path/to/fragment.plain.html');
  });

  it('does not localize if fragment is already localized', async () => {
    const path = await normalizePath('https://main--milo--adobecom.aem.page/de/path/to/fragment.plain.html#_dnt');
    expect(path).to.equal('/de/path/to/fragment.plain.html');
  });

  it('does not localize json', async () => {
    const path = await normalizePath('https://main--milo--adobecom.aem.page/path/to/manifest.json');
    expect(path).to.equal('/path/to/manifest.json');
  });

  it('retains a hash if one is passed in', async () => {
    const path = await normalizePath('https://main--milo--adobecom.aem.page/path/to/fragment.plain.html#noActiveItem');
    expect(path).to.equal('/path/to/fragment.plain.html#noActiveItem');
  });

  it('should retain params and hash when normalizing path', async () => {
    const paramPath = 'https://main--cc--adobecom.aem.page/products/photoshop-lightroom?mep&sheet=%27testsheet%27#testhash';
    expect(normalizePath(paramPath)).to.equal('/products/photoshop-lightroom?mep&sheet=%27testsheet%27#testhash');
  });

  it('does localize otherwise', async () => {
    config.locales = {
      de: {
        ietf: 'de-DE',
        prefix: '/de',
      },
    };
    config.locale = config.locales.de;
    const path = await normalizePath('https://main--milo--adobecom.aem.page/path/to/fragment.plain.html');
    expect(path).to.equal('/de/path/to/fragment.plain.html');
  });

  it('localizes federal URLs with locale prefix and preserves federal origin', async () => {
    config.locales = {
      de: {
        ietf: 'de-DE',
        prefix: '/de',
      },
    };
    config.locale = config.locales.de;
    const federalUrl = 'https://main--federal--adobecom.aem.page/federal/globalnav/acom/fragments/promos/test-promo';
    const path = await normalizePath(federalUrl);
    expect(path).to.include('/de/federal/globalnav/acom/fragments/promos/test-promo');
    expect(path).to.include('federal--adobecom.aem.page');
    expect(path).not.to.include('/de/https://');
  });

  it('does not localize federal URLs for en-US locale', async () => {
    config.locale = { ietf: 'en-US', prefix: '' };
    const federalUrl = 'https://main--federal--adobecom.aem.page/federal/globalnav/acom/fragments/promos/test-promo';
    const path = await normalizePath(federalUrl);
    expect(path).to.include('federal--adobecom.aem.page');
    expect(path).to.include('/federal/globalnav/acom/fragments/promos/test-promo');
    expect(path).not.to.include('/de/');
  });

  it('does not duplicate query params for external URLs', () => {
    config.locale = { ietf: 'en-US', prefix: '' };
    const apiUrl = 'https://example.lambda-url.us-west-2.on.aws/get-page?id=123&lastSeen=week&manifestSrc=pzn,%20promo';
    const result = normalizePath(apiUrl);
    expect(result).to.equal(apiUrl);
    expect(result.match(/id=123/g)).to.have.lengthOf(1);
  });

  it('strips #_dnt from external URLs without duplicating params', () => {
    config.locale = { ietf: 'en-US', prefix: '' };
    const apiUrl = 'https://example.lambda-url.us-west-2.on.aws/get-page?id=123#_dnt';
    const result = normalizePath(apiUrl);
    expect(result).to.equal('https://example.lambda-url.us-west-2.on.aws/get-page?id=123');
    expect(result).to.not.include('#_dnt');
  });
});
