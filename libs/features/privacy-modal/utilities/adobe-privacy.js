import privacyState from '../privacy-state.js';

const adobePrivacy = {
  getConsent: (...args) => privacyState.getConsent?.(...args),
  setConsent: (...args) => privacyState.setConsent?.(...args),
  hasExistingConsent: (...args) => privacyState.hasExistingConsent?.(...args),
  hasFullConsent: (...args) => privacyState.hasFullConsent?.(...args),
  hasCustomConsent: (...args) => privacyState.hasCustomConsent?.(...args),
  setImplicitConsent: (...args) => privacyState.setImplicitConsent?.(...args),
  on: (...args) => privacyState.on?.(...args),

  // Privacy methods as functions (TODO: if required)
  activeCookieGroups: (...args) => privacyState.activeCookieGroups?.(...args), // this is added
  hasUserProvidedConsent: (...args) => privacyState.hasUserProvidedConsent?.(...args),
  hasUserProvidedCustomConsent: (...args) => privacyState.hasUserProvidedCustomConsent?.(...args),
  disable: (...args) => privacyState.disable?.(...args),
  enable: (...args) => privacyState.enable?.(...args),
  showBanner: (...args) => privacyState.showBanner?.(...args),
  showPreferenceCenter: (...args) => privacyState.showPreferenceCenter?.(...args),
  showConsentPopup: (...args) => privacyState.showConsentPopup?.(...args),
  reloadOT: (...args) => privacyState.reloadOT?.(...args),
  loadOneTrust: (...args) => privacyState.loadOneTrust?.(...args),
  LoadResource: (...args) => privacyState.LoadResource?.(...args),
  LoadOT: (...args) => privacyState.LoadOT?.(...args),

  // Event names
  events: {
    privacyConsent: 'adobePrivacy:PrivacyConsent',
    privacyConsentCustom: 'adobePrivacy:PrivacyCustom',
    privacyReject: 'adobePrivacy:PrivacyReject',
    oneTrustReady: 'feds.events.oneTrustReady',
  },
};

// Attach to window
window.adobePrivacy = adobePrivacy;

export default adobePrivacy;
