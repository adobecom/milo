// Consent cookie constants
const KNDCTR_CONSENT_COOKIE = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent';
const OPT_ON_AND_CONSENT_COOKIE = 'OptanonConsent';
const OPTON_ALERT_BOX_CLOSED_COOKIE = 'OptanonAlertBoxClosed';

// fake GDPR countries list for consent validation
const GDPR_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB',
];

// Measurement category for consent checking
const MEASUREMENT_CATEGORY = 'C0002';

/**
 * Parses all cookies from document.cookie and caches them for multiple lookups
 * @returns {Object} Object with cookie name-value pairs
 */
function parseConsentCookies() {
  if (!document.cookie) {
    return {};
  }

  const consentCookies = {};
  const cookieArray = document.cookie.split(';');

  for (const cookieString of cookieArray) {
    const [name, value] = decodeURIComponent(cookieString.trim()).split(/=(.*)/s);

    if (name && value !== undefined) {
      // Only parse the 3 specific consent cookies
      if (name === KNDCTR_CONSENT_COOKIE
          || name === OPT_ON_AND_CONSENT_COOKIE
          || name === OPTON_ALERT_BOX_CLOSED_COOKIE) {
        consentCookies[name] = value;
      }
    }
  }

  return consentCookies;
}

/**
 * Gets a specific cookie value from the parsed cookies
 * @param {string} cookieName - Name of the cookie to retrieve
 * @param {Object} parsedCookies - Parsed cookies object (optional, will parse if not provided)
 * @returns {string|null} Cookie value or null if not found
 */
function getConsentCookie(cookieName, parsedCookies = null) {
  const cookies = parsedCookies || parseConsentCookies();
  return cookies[cookieName] || null;
}

/**
 * Parses a consent string into a structured object
 * @param {string} consentString - Consent string in format "key1=value1;key2=value2"
 * @returns {Object|null} Parsed consent object or null if invalid
 */
function parseConsentString(consentString) {
  if (!consentString) {
    return null;
  }

  return consentString
    .split(';')
    .reduce((consentByPurpose, categoryPair) => {
      const [key, value] = categoryPair.split('=');
      if (key && value !== undefined) {
        consentByPurpose[key] = value;
      }
      return consentByPurpose;
    }, {});
}

/**
 * Checks if user has provided consent through Adobe Privacy
 * @returns {boolean} True if user has provided consent
 */
function hasAdobePrivacyConsent() {
  if (!window.adobePrivacy) {
    return false;
  }

  return window.adobePrivacy.hasUserProvidedConsent()
         || window.adobePrivacy.hasUserProvidedCustomConsent();
}

/**
 * Checks if user has measurement consent through Adobe Privacy
 * @param {string} measurementCategory - Measurement category to check (default: C0002)
 * @returns {boolean} True if user has measurement consent
 */
function hasMeasurementConsent(measurementCategory = MEASUREMENT_CATEGORY) {
  if (!window.adobePrivacy) {
    return false;
  }

  const activeGroups = window.adobePrivacy.activeCookieGroups();
  return activeGroups && activeGroups.includes(measurementCategory);
}

/**
 * Validates if a string is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(dateString) {
  if (!dateString) {
    return false;
  }
  const parsedDate = Date.parse(dateString);
  return typeof parsedDate === 'number' && !Number.isNaN(parsedDate);
}

/**
 * Checks if user has provided consent through Optanon cookies
 * @param {Object} parsedCookies - Pre-parsed cookies object for performance
 * @returns {boolean} True if user has valid Optanon consent
 */
function hasOptanonConsent(parsedCookies = null) {
  const alertBoxClosed = getConsentCookie(OPTON_ALERT_BOX_CLOSED_COOKIE, parsedCookies);
  const optOnAndConsentString = getConsentCookie(OPT_ON_AND_CONSENT_COOKIE, parsedCookies);
  const parsedConsent = parseConsentString(optOnAndConsentString);

  return (
    // User has closed the consent dialog
    alertBoxClosed
    && isValidDate(alertBoxClosed)
    // User has opted in to measurement cookies
    && parsedConsent
    && parsedConsent[MEASUREMENT_CATEGORY] === '1'
  );
}

/**
 * Determines if the current country is not a GDPR country
 * @returns {boolean} True if country is not GDPR-regulated
 */
function isNonGdprCountry() {
  const serverTiming = window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming?.reduce(
    (acc, { name, description }) => ({ ...acc, [name]: description }),
    {},
  );
  const country = serverTiming?.geo || 'unknown';

  return !GDPR_COUNTRIES.includes(country);
}

/**
 * Checks if user has KNDCTR consent
 * @param {Object} parsedCookies - Pre-parsed cookies object for performance
 * @returns {boolean} True if user has KNDCTR consent
 */
function hasKndctrConsent(parsedCookies = null) {
  const kndctrConsentString = getConsentCookie(KNDCTR_CONSENT_COOKIE, parsedCookies);
  const parsedKndctrConsent = parseConsentString(kndctrConsentString);

  return parsedKndctrConsent && parsedKndctrConsent.general === 'in';
}

/**
 * Main consent validation function that checks all consent methods
 * @returns {boolean} True if user has valid consent for tracking
 */
function validateUserConsent() {
  // Parse cookies once for performance
  const parsedCookies = parseConsentCookies();

  // Check KNDCTR consent first (most common)
  if (hasKndctrConsent(parsedCookies)) {
    return true;
  }

  // Check Adobe Privacy consent
  if (window.adobePrivacy && hasAdobePrivacyConsent() && hasMeasurementConsent()) {
    return true;
  }

  // Check Optanon consent
  if (hasOptanonConsent(parsedCookies)) {
    return true;
  }

  // For non-GDPR countries, allow tracking by default
  if (isNonGdprCountry()) {
    return true;
  }

  // No valid consent found
  return false;
}
