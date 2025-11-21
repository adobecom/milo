import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import init from '../../../../libs/features/mep/addons/event.js';

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

const setMetadata = (name, content) => {
  const metadata = document.createElement('meta');
  metadata.name = name;
  metadata.content = content;
  document.head.appendChild(metadata);
};

describe('event', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    setMetadata('signedIn', 'on');
    setCookie('OptanonConsent', 'C0002:1');
    window.adobeIMS = { getAccessToken: () => ({ token: '1234567890' }) };
  });
  it('should return true when sending true into init', async () => {
    const event = await init(true);
    expect(event).to.equal(true);
  });
  it('should return false when consent cookie is set to C0002:0', async () => {
    setCookie('OptanonConsent', 'C0002:0');
    const event = await init('adobe-max-2025');
    expect(event).to.equal(false);
  });
  it('should return false when the user is signed out', async () => {
    document.head.innerHTML = '';
    const event = await init('adobe-max-2025');
    expect(event).to.equal(false);
  });
  it('should return false when userId is set to off', async () => {
    setMetadata('userId', 'off');
    const event = await init('adobe-max-2025');
    expect(event).to.equal(false);
  });
  it('should return false when getAccessToken returns an empty object', async () => {
    setMetadata('userId', '1234567890');
    window.adobeIMS.getAccessToken = () => Promise.resolve({});
    const event = await init('adobe-max-2025');
    expect(event).to.equal(false);
  });
  it('should return false when api returns false', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({
      ok: true,
      isRegistered: false,
    });
    const event = await init('adobe-max-2025');
    expect(event).to.equal(false);
  });
  it('should return true when api returns true', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({
      ok: true,
      isRegistered: true,
    });
    const event = await init('adobe-max-2025');
    expect(event).to.equal(true);
  });
});
