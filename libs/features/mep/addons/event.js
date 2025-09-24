import { isSignedOut, getConfig, getMepEnablement, loadIms } from '../../../utils/utils.js';
import { getCookie } from '../../../martech/helpers.js';

async function getUserId() {
  if (isSignedOut() && !getMepEnablement('signedIn')) return false;
  if (getMepEnablement('userId') !== 'undefined') return getMepEnablement('userId');
  /* c8 ignore next 3 */
  await loadIms();
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
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'same-origin',
    });
    if (response.ok) return response.json();
    window.lana?.log(`Unable to fetch from Rainfocus: ${response.statusText}`);
    return {};
  } catch (e) {
    window.lana?.log(`Unable to fetch from Rainfocus: ${e.toString()}`);
    return {};
  }
}
export default async function init(eventId) {
  if (eventId === true) return eventId;

  const consentCookieValue = getCookie('OptanonConsent');
  if (consentCookieValue?.includes('C0002:0')) return false;

  const eventDetails = await fetchFromRainfocus(eventId);
  return eventDetails?.isRegistered === true;
}
