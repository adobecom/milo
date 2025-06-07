// libs/features/privacy/privacy-state.js

import getCookieValue from './utilities/cookie/getCookieValue.js';
import setCookieValue from './utilities/cookie/setCookieValue.js';
import extractRootDomain from './utilities/helpers/extractRootDomain.js';

const CONSENT_COOKIE = 'OptanonConsent';
const INTERACTION_COOKIE = 'OptanonAlertBoxClosed';
const CATEGORIES_DEFAULT = 'C0001';
const CATEGORIES_ALL = ['C0001', 'C0002', 'C0003', 'C0004'];

function parseConsentCookie(cookie) {
  // Example: "groups=C0001:1,C0002:1,C0003:0&..."
  const active = [];
  const available = [];
  if (!cookie) return [active, available];
  let consent = cookie.split('groups=')[1] || '';
  [consent] = consent.split('&');
  consent.split(',').forEach((group) => {
    if (group.endsWith(':1')) {
      const cat = group.replace(':1', '');
      active.push(cat);
      available.push(cat);
    } else if (group.endsWith(':0')) {
      available.push(group.replace(':0', ''));
    }
  });
  return [active, available];
}

function buildConsentCookie(groups) {
  // groups: array of category strings, e.g. ['C0001', 'C0002']
  // default all others to :0
  const all = CATEGORIES_ALL.map(cat => `${cat}:${groups.includes(cat) ? 1 : 0}`);
  return `groups=${all.join(',')}`;
}

function fireEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`adobePrivacy:${name}`, { detail }));
}

function setConsent(groups) {
  const domain = `.${extractRootDomain(window.location.hostname)}`;
  const cookieValue = buildConsentCookie(groups);
  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  setCookieValue(CONSENT_COOKIE, cookieValue, { path: '/', domain, expiration });
  setCookieValue(INTERACTION_COOKIE, expiration.toISOString(), { path: '/', domain, expiration });
  fireConsentEvent();
}

function getConsent() {
  return parseConsentCookie(getCookieValue(CONSENT_COOKIE));
}

function hasExistingConsent() {
  const cookie = getCookieValue(INTERACTION_COOKIE);
  if (!cookie) return false;
  const date = Date.parse(cookie);
  if (!date || isNaN(date)) return false;
  const [active] = getConsent();
  return active.length > 0;
}

function hasFullConsent() {
  const [active, available] = getConsent();
  return hasExistingConsent() && active.length && active.length === available.length;
}

function hasCustomConsent() {
  const [active, available] = getConsent();
  const isReject = (active.length === 1 && active[0] === CATEGORIES_DEFAULT);
  return hasExistingConsent() && active.length && active.length !== available.length && !isReject;
}

function fireConsentEvent() {
  if (!hasExistingConsent()) return;
  const [active, available] = getConsent();
  if (hasFullConsent()) {
    fireEvent('PrivacyConsent', { active, available });
  } else if (hasCustomConsent()) {
    fireEvent('PrivacyCustom', { active, available });
  } else {
    fireEvent('PrivacyReject', { active, available });
  }
}

// For implicit consent (ROW)
function setImplicitConsent() {
  setConsent(CATEGORIES_ALL);
}

// Listen/subscribe API
function on(event, cb) {
  window.addEventListener(`adobePrivacy:${event}`, cb);
}

// Export the API
const privacyState = {
  // eslint-disable-next-line max-len
  getConsent, setConsent, hasExistingConsent, hasFullConsent, hasCustomConsent, setImplicitConsent, on,
};

// Attach to window.adobePrivacy (or export as needed)
window.adobePrivacy = privacyState;

export default privacyState;
