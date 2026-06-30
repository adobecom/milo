// Dev-mode mock of the DA SDK.
// In production, the real SDK is loaded from https://da.live/nx/utils/sdk.js.
// Vite aliases this module to the stub when mode === 'development'.

const devSdk = Promise.resolve({
  context: {
    org: 'adobecom',
    repo: 'da-playground',
    ref: 'main',
    path: '/tools/page-forge.html',
  },
  token: 'dev-token-placeholder',
  actions: {},
});

export default devSdk;
