import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { getConfig } from '../../../../libs/utils/utils.js';
import init from '../../../../libs/features/mep/addons/lob.js';

const AMCV_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
const API_RESPONSE = { modelLineOfBusiness: 'SMB', modelScore: 0.528565269468545 };

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

const setCookie = (key, value) => {
  document.cookie = `${key}=${value}; path=/`;
};

const clearCookie = (key) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

// Mirrors the get/set fallback lob.js defines internally, so stubbed
// "pre-existing" alloy_all.get/set behave like a real implementation.
const traverseGet = (obj, path) => path.split('.').reduce(
  (current, segment) => (current !== undefined && current !== null ? current[segment] : undefined),
  obj,
);
const traverseSet = (obj, path, val) => {
  path.split('.').reduce((current, segment, index, segments) => {
    if (index === segments.length - 1) current[segment] = val;
    else current[segment] = current[segment] || {};
    return current[segment];
  }, obj);
  return obj;
};

describe('lob', () => {
  const originalFetch = window.fetch;

  afterEach(() => {
    clearCookie(AMCV_COOKIE);
    delete window.alloy_all;
    window.fetch = originalFetch;
  });

  it('should return blah when sending blah into init', async () => {
    const lob = await init('blah');
    expect(lob).to.equal('blah');
  });
  it('should return smb when sending true into init', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const lob = await init(true);
    expect(lob).to.equal('smb');
  });
  it('should return false when no AMCV cookie is set', async () => {
    const lob = await init(true);
    expect(lob).to.be.false;
  });
  it('should return false when api response has no modelLineOfBusiness', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse({ modelScore: 0.528565269468545 });
    const lob = await init(true);
    expect(lob).to.be.false;
  });
  it('should preserve an existing alloy_all get/set and push tracking values', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const customArray = [];
    const existingGet = stub().callsFake(traverseGet);
    const existingSet = stub().callsFake(traverseSet);
    window.alloy_all = {
      get: existingGet,
      set: existingSet,
      data: { _adobe_corpnew: { event: { custom: customArray } } },
    };
    const lob = await init(true);
    expect(lob).to.equal('smb');
    expect(window.alloy_all.get).to.equal(existingGet);
    expect(window.alloy_all.set).to.equal(existingSet);
    expect(customArray).to.deep.equal([
      { propertyName: 'spectraLob', propertyValue: 'smb' },
      { propertyName: 'spectraScore', propertyValue: 0.528565269468545 },
    ]);
  });
  it('should create alloy_all and push tracking values when alloy_all does not exist yet', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const lob = await init(true);
    expect(lob).to.equal('smb');
    expect(window.alloy_all.get).to.be.a('function');
    expect(window.alloy_all.set).to.be.a('function');
    // eslint-disable-next-line no-underscore-dangle
    expect(window.alloy_all.data._adobe_corpnew.event.custom).to.deep.equal([
      { propertyName: 'spectraLob', propertyValue: 'smb' },
      { propertyName: 'spectraScore', propertyValue: 0.528565269468545 },
    ]);
  });
  it('should call the prod domain (no stage prefix) when config.env is prod', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const config = getConfig();
    const originalEnv = config.env;
    config.env = { name: 'prod' };
    try {
      await init(true);
      const [url] = window.fetch.firstCall.args;
      expect(url).to.match(/^https:\/\/www\.adobe\.com\//);
    } finally {
      config.env = originalEnv;
    }
  });
  it('should append lastVisitedPage from document.referrer when present', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const referrer = 'https://www.adobe.com/prev-page';
    const originalReferrer = Object.getOwnPropertyDescriptor(Document.prototype, 'referrer');
    Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
    try {
      await init(true);
      const [url] = window.fetch.firstCall.args;
      expect(url).to.include(`lastVisitedPage=${encodeURIComponent(referrer)}`);
    } finally {
      Object.defineProperty(Document.prototype, 'referrer', originalReferrer);
    }
  });
  it('should ignore unrecognized keys in the API response', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse({ ...API_RESPONSE, unrelatedKey: 'noise' });
    const lob = await init(true);
    expect(lob).to.equal('smb');
    // eslint-disable-next-line no-underscore-dangle
    expect(window.alloy_all.data._adobe_corpnew.event.custom).to.deep.equal([
      { propertyName: 'spectraLob', propertyValue: 'smb' },
      { propertyName: 'spectraScore', propertyValue: 0.528565269468545 },
    ]);
  });
});
