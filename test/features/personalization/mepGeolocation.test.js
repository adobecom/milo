import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { init } from '../../../libs/features/personalization/personalization.js';
import mepSettings from './mepGeolocationSettings.js';

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

describe('mepGeolocation', () => {
  beforeEach(async () => {
    const config = getConfig();
    config.locale = { ietf: 'en-US', prefix: '' };
    document.head.innerHTML = await readFile({ path: './mocks/metadata-mepgeolocation.html' });
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
  });

  it('matches userIP(de) when countryIP is set to de', async () => {
    sessionStorage.setItem('akamai', 'de');
    const manifestJson = JSON.parse(await readFile({ path: './mocks/manifestMEPCountryIP.json' }));
    setFetchResponse(manifestJson);
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
    sessionStorage.removeItem('akamai');
  });

  it('does not match userIP(de) when countryIP is not set to de', async () => {
    const manifestJson = JSON.parse(await readFile({ path: './mocks/manifestMEPCountryIP.json' }));
    setFetchResponse(manifestJson);
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.not.be.null;
  });

  it('matches userIP(jp, sg) when countryIP is set to sg or jp', async () => {
    sessionStorage.setItem('akamai', 'sg');
    const manifestJson = JSON.parse(await readFile({ path: './mocks/manifestMEPCountryIP.json' }));
    setFetchResponse(manifestJson);
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
    sessionStorage.removeItem('akamai');
  });

  it('matches userChoice(de) when countryChoice is set to de', async () => {
    document.cookie = 'international=DE';
    const manifestJson = JSON.parse(await readFile({ path: './mocks/manifestMEPCountryChoice.json' }));
    setFetchResponse(manifestJson);
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });

  it('does not match userChoice(de) when countryChoice is not set to de', async () => {
    document.cookie = 'international=FR';
    const manifestJson = JSON.parse(await readFile({ path: './mocks/manifestMEPCountryChoice.json' }));
    setFetchResponse(manifestJson);
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.not.be.null;
  });

  it('matches userChoice(jp, sg) when countryChoice is set to sg or jp', async () => {
    document.cookie = 'international=JP';
    const manifestJson = JSON.parse(await readFile({ path: './mocks/manifestMEPCountryChoice.json' }));
    setFetchResponse(manifestJson);
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });
});
