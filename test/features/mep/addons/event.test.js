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
    localStorage.clear();
    setMetadata('signedIn', 'on');
    setCookie('OptanonConsent', 'C0002:1');
    window.adobeIMS = { getAccessToken: () => ({ token: '1234567890' }) };
  });
  afterEach(() => {
    setCookie('feds_adobe-max-2025_registeredByRedirect', '; Max-Age=0');
  });
  it('should return true when sending true into init', async () => {
    const event = await init(true);
    expect(event.isRegistered).to.equal(true);
  });
  it('should return false when the user is signed out', async () => {
    document.head.innerHTML = '';
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(false);
  });
  it('should read enablements from lowercase DA metadata', async () => {
    document.head.innerHTML = '';
    setMetadata('signedin', 'on');
    setMetadata('userid', '1234567890');
    setFetchResponse({ ok: true, isRegistered: true });
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(true);
  });
  it('should return false when getAccessToken returns an empty object', async () => {
    setMetadata('userId', '1234567890');
    window.adobeIMS.getAccessToken = () => Promise.resolve({});
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(false);
  });
  it('should return false when api returns false', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({
      ok: true,
      isRegistered: false,
    });
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(false);
  });
  it('should return true when api returns true', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({
      ok: true,
      isRegistered: true,
    });
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(true);
  });
  it('should serve a cached result without re-calling the API', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({ ok: true, isRegistered: true });
    const first = await init('adobe-max-2025');
    expect(first.isRegistered).to.equal(true);
    // A cache hit must ignore a now-changed API response.
    setFetchResponse({ ok: true, isRegistered: false });
    const second = await init('adobe-max-2025');
    expect(second.isRegistered).to.equal(true);
  });
  it('should normalize an empty API response to isRegistered false', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({});
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(false);
  });
  it('should register from the redirect cookie, overriding a stale cache without calling the API', async () => {
    setMetadata('userId', '1234567890');
    setFetchResponse({ ok: true, isRegistered: false });
    const stale = await init('adobe-max-2025');
    expect(stale.isRegistered).to.equal(false);
    setCookie('feds_adobe-max-2025_registeredByRedirect', 'true');
    window.fetch = stub();
    const event = await init('adobe-max-2025');
    expect(event.isRegistered).to.equal(true);
    expect(window.fetch.called).to.equal(false);
  });
});
