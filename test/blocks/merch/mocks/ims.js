export async function mockIms(countryCode) {
  window.adobeIMS = {
    isSignedInUser: () => !!countryCode,
    getProfile: () => Promise.resolve({ countryCode }),
  };
}

export function unmockIms() {
  delete window.adobeIMS;
}
