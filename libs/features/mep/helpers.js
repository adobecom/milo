import { getMepEnablement } from '../../utils/utils.js';

export const KNDCTR_CONSENT_COOKIE = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_consent';
export const OPT_ON_AND_CONSENT_COOKIE = 'OptanonConsent';

export function getAllCookies() {
  return document.cookie.split(';').reduce((cookies, cookieStr) => {
    const [key, ...valParts] = cookieStr.trim().split('=');
    cookies[key] = decodeURIComponent(valParts.join('='));
    return cookies;
  }, {});
}
export function getCookie(name) {
  return getAllCookies()[name];
}

export function parseOptanonConsent(optOnConsentCookie) {
  let consent = {};

  if (optOnConsentCookie) {
    if (optOnConsentCookie.includes('groups=')) {
      const groupsMatch = optOnConsentCookie.match(/groups=([^&]*)/);
      if (groupsMatch) {
        const groupsString = groupsMatch[1];
        consent = Object.fromEntries(
          groupsString.split(',').map((group) => group.split(':')),
        );
      }
    } else {
      consent = Object.fromEntries(
        optOnConsentCookie.split(';').map((cat) => cat.split(':')),
      );
    }
  }

  return {
    configuration: {
      performance: consent.C0002 === '1',
      functional: consent.C0003 === '1',
      advertising: consent.C0004 === '1',
    },
  };
}

export const getConsentState = ({ optOnConsentCookie, kndctrConsentCookie }) => {
  const serverTimingCountry = getMepEnablement('akamaiLocale') || sessionStorage.getItem('akamai');
  const explicitConsentCountries = [
    'ca', 'de', 'no', 'fi', 'be', 'pt', 'bg', 'dk', 'lt', 'lu',
    'lv', 'hr', 'fr', 'hu', 'se', 'si', 'mc', 'sk', 'mf', 'sm',
    'gb', 'yt', 'ie', 'gf', 'ee', 'mq', 'mt', 'gp', 'is', 'gr',
    'it', 'es', 'at', 're', 'cy', 'cz', 'ax', 'pl', 'ro', 'li', 'nl',
  ];
  const isExplicitConsentCountry = serverTimingCountry
  && explicitConsentCountries.includes(serverTimingCountry.toLowerCase());

  if (kndctrConsentCookie || (serverTimingCountry && !isExplicitConsentCountry)) {
    return 'post';
  }

  if (optOnConsentCookie || isExplicitConsentCountry) {
    return 'pre';
  }

  return 'unknown';
};
