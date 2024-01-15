import { loadIms } from '../../../../libs/utils/utils.js';

export async function mockIms(countryCode, userId = 1) {
  loadIms();
  window.adobeIMS = {
    isSignedInUser: () => !!countryCode,
    getProfile: () => Promise.resolve({ countryCode, userId }),
    getAccessToken: () => ({ token: 'test_client_token' }),
    adobeIdData: { client_id: 'test_client_id' },
  };
  window.adobeid.onReady();
}

export function unmockIms() {
  delete window.adobeIMS;
}
