const categories = ['C0001', 'C0002', 'C0003', 'C0004'];
const categoriesDefault = categories[0];

// Consent cookies
const CONSENT_COOKIE = 'OptanonConsent';
const INTERACTION_COOKIE = 'OptanonAlertBoxClosed';

// Category groupings
const CATEGORIES_ALL = [...categories];

// Optional: OneTrust domainId config
const OT_DOMAIN_ID = window?.fedsConfig?.privacy?.otDomainId || '';

// Fallback geo API
const GEO_LOCATION_URL = 'https://geo2.adobe.com/json/?callback=';

const EVENTS = {
  privacyConsent: 'adobePrivacy:PrivacyConsent',
  privacyConsentCustom: 'adobePrivacy:PrivacyCustom',
  privacyReject: 'adobePrivacy:PrivacyReject',
};

const IMS_TIMEOUT = 3000;

// Export what you use!
export default {
  categories,
  categoriesDefault,
  CATEGORIES_ALL,
  CONSENT_COOKIE,
  INTERACTION_COOKIE,
  OT_DOMAIN_ID,
  GEO_LOCATION_URL,
  EVENTS,
  IMS_TIMEOUT,
};
