export async function mockIms() {
  window.adobeIMS = {
    isSignedInUser: () => true,
    getProfile: () => Promise.resolve({ countryCode: 'CH' }),
  };
}

export function unmockIms() {
  delete window.adobeIMS;
}
