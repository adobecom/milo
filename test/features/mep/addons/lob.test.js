import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import init from '../../../../libs/features/mep/addons/lob.js';

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

describe('lob', () => {
  it('should return blah when sending blah into init', async () => {
    const lob = await init('blah');
    expect(lob).to.equal('blah');
  });
  it('should return cc when consent cookie is set to C0002:0', async () => {
    setCookie('OptanonConsent', 'C0002:0');
    const lob = await init(true);
    expect(lob).to.equal('cc');
  });
  it('should return smb when sending true into init', async () => {
    setCookie('OptanonConsent', 'C0002:1');
    setCookie('AMCV_9E1005A551ED61CA0A490D45@AdobeOrg', '1234567890');
    setFetchResponse({ modelLineOfBusiness: 'SMB' });
    const lob = await init(true);
    expect(lob).to.equal('smb');
  });
});
