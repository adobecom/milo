async function mockIms(countryCode) {
  window.adobeIMS = {
    isSignedInUser: () => !!countryCode,
    getProfile: () => Promise.resolve({ countryCode }),
  };
}

function unmockIms() {
  delete window.adobeIMS;
}

export { mockIms, unmockIms };
