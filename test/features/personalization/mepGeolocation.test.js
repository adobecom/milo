import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { init } from '../../../libs/features/personalization/personalization.js';
import mepSettings from './mepGeolocationSettings.js';

const config = getConfig();
config.env = { name: 'prod' };
config.mep = { geoLocation: true };

const getFetchPromise = (data, type = 'json') => Promise.resolve({
  ok: true,
  [type]: () => data,
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

const setupTest = async (countryKey, countryValue, manifestPath) => {
  config.mep[countryKey] = countryValue;
  document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
  const manifestJson = JSON.parse(await readFile({ path: manifestPath }));
  setFetchResponse(manifestJson);
};

describe('mepGeolocation', () => {
  beforeEach(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/metadata.html' });
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
  });

  it('matches userIP(de) when countryIP is set to de', async () => {
    await setupTest('countryIP', 'de', './mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });

  it('does not match userIP(de) when countryIP is not set to de', async () => {
    await setupTest('countryIP', 'fr', './mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.not.be.null;
  });

  it('matches userIP(jp, sg) when countryIP is set to sg or jp', async () => {
    await setupTest('countryIP', 'sg', './mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });

  it('matches userChoice(de) when countryChoice is set to de', async () => {
    await setupTest('countryChoice', 'de', './mocks/manifestMEPCountryChoice.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });

  it('does not match userChoice(de) when countryChoice is not set to de', async () => {
    await setupTest('countryChoice', 'fr', './mocks/manifestMEPCountryChoice.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.not.be.null;
  });

  it('matches userChoice(jp, sg) when countryChoice is set to sg or jp', async () => {
    await setupTest('countryChoice', 'sg', './mocks/manifestMEPCountryChoice.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });
});
