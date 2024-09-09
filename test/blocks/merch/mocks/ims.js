export async function mockIms(countryCode, userId = 1) {
  window.adobeIMS = {
    initialized: true,
    isSignedInUser: () => !!countryCode,
    getProfile: () => Promise.resolve({ countryCode, userId }),
    getAccessToken: () => ({ token: 'test_client_token' }),
    adobeIdData: { client_id: 'test_client_id' },
  };
}

export function unmockIms() {
  delete window.adobeIMS;
}
