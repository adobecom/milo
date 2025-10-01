import { expect } from '@esm-bundle/chai';
// import { stub } from 'sinon';
import init from '../../../../libs/features/mep/addons/event.js';

// const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
//   resolve({
//     ok: true,
//     [type]: () => data,
//   });
// });

// const setFetchResponse = (data, type = 'json') => {
//   window.fetch = stub().returns(getFetchPromise(data, type));
// };

// const setCookie = (key, value) => {
//   document.cookie = `${key}=${value}; path=/`;
// };

describe('event', () => {
  it('should return true when sending true into init', async () => {
    const event = await init(true);
    expect(event).to.equal(true);
  });
  // it('should return false when consent cookie is set to C0002:0', async () => {
  //   setCookie('OptanonConsent', 'C0002:0');
  //   const event = await init('adobe-max-2025');
  //   expect(event).to.equal(false);
  // });
  // it('should return false when logged out', async () => {
  //   setCookie('OptanonConsent', 'C0002:1');
  //   const event = await init('adobe-max-2025');
  //   expect(event).to.equal(true);
  // });
  // it('should return true when logged in', async () => {
  //   setCookie('OptanonConsent', 'C0002:1');
  //   const metadata = document.createElement('meta');
  //   metadata.name = 'signedin';
  //   metadata.content = 'true';
  //   document.head.appendChild(metadata);
  //   window.adobeIMS = {
  //     getProfile: () => Promise.resolve({ userId: '1234567890' }),
  //     getAccessToken: () => Promise.resolve({ token: '1234567890' }),
  //   };
  //   setTimeout(() => {
  //     window.adobeIMS.initialized = true;
  //   }, 100);

  //   setFetchResponse({ isRegistered: true });
  //   const event = await init('adobe-max-2025');
  //   expect(event).to.equal(true);
  // });
});
