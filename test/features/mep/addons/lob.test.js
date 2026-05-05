import { expect } from '@esm-bundle/chai';
import { stub, useFakeTimers } from 'sinon';
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

describe('lob', () => {
  let clock;
  const originalFetch = window.fetch;

  afterEach(() => {
    clearCookie(AMCV_COOKIE);
    delete window.alloy_all;
    window.fetch = originalFetch;
    clock?.restore();
    clock = undefined;
  });

  it('should return blah when sending blah into init', async () => {
    const lob = await init('blah');
    expect(lob).to.equal('blah');
  });
  it('should return smb when sending true into init', async () => {
    clock = useFakeTimers();
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const lob = await init(true);
    clock.tick(5000);
    await Promise.resolve();
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
  it('should complete without errors when alloy_all is present', async () => {
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const customArray = [];
    window.alloy_all = {
      get: stub(),
      set: stub(),
      data: { _adobe_corpnew: { event: { custom: customArray } } },
    };
    const lob = await init(true);
    await Promise.resolve();
    expect(lob).to.equal('smb');
    expect(window.alloy_all.get.calledOnce).to.be.true;
    expect(window.alloy_all.set.calledOnce).to.be.true;
    expect(customArray).to.deep.equal([
      { propertyName: 'spectraLob', propertyValue: 'smb' },
      { propertyName: 'spectraScore', propertyValue: 0.528565269468545 },
    ]);
  });
  it('should push tracking values when alloy_all loads before timeout', async () => {
    clock = useFakeTimers();
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const customArray = [];
    const alloyMock = {
      get: stub(),
      set: stub(),
      data: { _adobe_corpnew: { event: { custom: customArray } } },
    };
    const lob = await init(true);
    window.alloy_all = alloyMock;
    clock.tick(100);
    await Promise.resolve();
    expect(lob).to.equal('smb');
    expect(alloyMock.get.calledOnce).to.be.true;
    expect(alloyMock.set.calledOnce).to.be.true;
    expect(customArray).to.deep.equal([
      { propertyName: 'spectraLob', propertyValue: 'smb' },
      { propertyName: 'spectraScore', propertyValue: 0.528565269468545 },
    ]);
  });
  it('should complete without errors when alloy_all is absent', async () => {
    clock = useFakeTimers();
    setCookie(AMCV_COOKIE, 'MCMID|1234567890');
    setFetchResponse(API_RESPONSE);
    const alloyMock = { get: stub(), set: stub() };
    const lob = await init(true);
    clock.tick(5000);
    await Promise.resolve();
    expect(lob).to.equal('smb');
    expect(alloyMock.get.called).to.be.false;
    expect(alloyMock.set.called).to.be.false;
  });
});
