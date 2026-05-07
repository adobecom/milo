import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import { getConfig } from '../../../libs/utils/utils.js';
import { init } from '../../../libs/features/personalization/personalization.js';
import mepSettings from './mepGeolocationSettings.js';

const setFetchResponse = async (manifestPath) => {
  const manifestJson = JSON.parse(await readFile({ path: manifestPath }));
  window.fetch = stub().returns(Promise.resolve({
    ok: true,
    json: () => manifestJson,
  }));
};

const setupEnvironment = async ({ sessionKey, sessionValue, cookieKey, cookieValue }) => {
  if (sessionKey && sessionValue) {
    sessionStorage.setItem(sessionKey, sessionValue);
  }
  if (cookieKey && cookieValue) {
    document.cookie = `${cookieKey}=${cookieValue}`;
  }
  document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
};

const setCookie = (key, value) => {
  document.cookie = `${key}=${value}`;
};

describe('mepGeolocation', () => {
  beforeEach(async () => {
    const config = getConfig();
    config.locale = { ietf: 'en-US', prefix: '' };
    document.head.innerHTML = await readFile({ path: './mocks/metadata-mepgeolocation.html' });
    document.body.innerHTML = await readFile({ path: './mocks/personalization.html' });
    setCookie('OptanonConsent', 'groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1');
    setCookie('kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent', 'general=in');
  });

  afterEach(() => {
    sessionStorage.clear();
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('matches userIP(de) when countryIP is set to de', async () => {
    await setupEnvironment({ sessionKey: 'akamai', sessionValue: 'de' });
    await setFetchResponse('./mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });

  it('does not match userIP(de) when countryIP is not set to de', async () => {
    await setFetchResponse('./mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.not.be.null;
  });

  it('matches userIP(jp, sg) when countryIP is set to sg or jp', async () => {
    await setupEnvironment({ sessionKey: 'akamai', sessionValue: 'sg' });
    await setFetchResponse('./mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.be.null;
  });

  it('country cookie overrides geo for countryIP', async () => {
    await setupEnvironment({ sessionKey: 'akamai', sessionValue: 'de' });
    document.cookie = 'country=us';
    await setFetchResponse('./mocks/manifestMEPCountryIP.json');
    expect(document.querySelector('.how-to')).to.not.be.null;
    await init(mepSettings);
    expect(document.querySelector('.how-to')).to.not.be.null;
  });
});
