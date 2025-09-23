import { isSignedOut, getConfig, getMepEnablement, loadIms } from '../../../utils/utils.js';
import { getCookie } from '../../../martech/helpers.js';

export function imsReady({ interval = 200, maxAttempts = 25 } = {}) {
  return new Promise((resolve) => {
    let count = 0;
    function checkIms() {
      if (window.adobeIMS?.initialized || count > maxAttempts) resolve();
      setTimeout(checkIms, interval);
      count += 1;
    }
    checkIms();
  });
}
async function getUserId() {
  if (isSignedOut() && getMepEnablement('signedin') !== true) return false;
  await loadIms();
  // const isImsReady = await imsReady({ interval: 100, maxAttempts: 25 });
  // if (!isImsReady) return false;
  const { userId } = await window.adobeIMS.getProfile();
  return userId;
}
async function fetchFromRainfocus(eventId) {
  const userId = await getUserId();
  if (!userId) return {};

  const accessToken = window.adobeIMS.getAccessToken()?.token;
  if (!accessToken) return {};

  const domainSuffix = getConfig()?.env?.name === 'prod' ? '' : '.stage';
  const url = `https://www${domainSuffix}.adobe.com/events/api/rf-auth-seq-generic/${eventId}?user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'same-origin',
  });
  if (!response.ok) return {};
  return response.json();
}
export default async function init(eventId) {
  if (eventId === true) return eventId;

  const consentCookieValue = getCookie('OptanonConsent');
  if (consentCookieValue?.includes('C0002:0')) return false;

  const eventDetails = await fetchFromRainfocus(eventId);
  return eventDetails?.isRegistered === true;
}
