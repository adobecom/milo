function getCookie(key) {
  const cookie = document.cookie.split(';')
    .map((x) => decodeURIComponent(x.trim()).split(/=(.*)/s))
    .find(([k]) => k === key);
  return cookie ? cookie[1] : null;
}

const getConsentStatus = (level) => {
  const cookieGrp = window.adobePrivacy?.activeCookieGroups();
  return cookieGrp?.includes(`C000${level}`);
};

function waitForConsent(level = 2) {
  return new Promise((resolve) => {
    const fallbackTimeout = setTimeout(() => resolve(false), 30000);
    if (window.adobePrivacy) {
      clearTimeout(fallbackTimeout);
      resolve(getConsentStatus(level));
    }
    window.addEventListener('adobePrivacy:PrivacyConsent', () => {
      clearTimeout(fallbackTimeout);
      resolve(true);
    });
    window.addEventListener('adobePrivacy:PrivacyReject', () => {
      clearTimeout(fallbackTimeout);
      resolve(false);
    });
    window.addEventListener('adobePrivacy:PrivacyCustom', () => {
      clearTimeout(fallbackTimeout);
      resolve(getConsentStatus(level));
    });
  });
}

export async function getSpectraLOB(lastVisitedPage) {
  const getECID = getCookie('AMCV_9E1005A551ED61CA0A490D45@AdobeOrg');
  if (!getECID) return false;
  const [, ECID] = getECID.split('|');
  let url = `https://cchome-stage.adobe.io/int/v1/aep/events/webpage?ecid=${ECID}`;
  if (lastVisitedPage) url = `${url}&lastVisitedPage=${lastVisitedPage}`;

  try {
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'MarketingTech',
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const content = await rawResponse.json();
    console.log('Spectra LOB:', content);
    return content.modelLineOfBusiness?.toLowerCase();
  } catch (e) {
    if (e.name === 'TimeoutError') window.lana?.log('Spectra Timeout'); // Abort signal
    else window.lana?.log(e.reason || e.error || e.message, { errorType: 'i' });
    return false;
  }
}

export default async function init(addon, enablement) {
  if (enablement !== true) return enablement;
  // const cookieGrp = window.adobePrivacy?.activeCookieGroups();
  // console.log(cookieGrp);
  // const performanceCookieConsent = cookieGrp.includes('C0002');
  const hasConsent = await waitForConsent(5);
  // if (!hasConsent) return 'test';
  const lobValue = await getSpectraLOB(document.referrer);
  return lobValue;
}
