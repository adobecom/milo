import { isSignedOut, getConfig, getMepEnablement, loadIms } from '../../../utils/utils.js';

const defaultReturn = { isRegistered: false };
async function getUserId() {
  const signedInEnable = getMepEnablement('signedIn') || getMepEnablement('signedin');
  if (isSignedOut() && !signedInEnable) return false;
  const userIdEnable = getMepEnablement('userId') || getMepEnablement('userid');
  if (userIdEnable && userIdEnable !== 'undefined') return userIdEnable;
  /* c8 ignore start */
  try {
    await loadIms();
    const { userId } = await window.adobeIMS.getProfile();
    return userId;
  } catch {
    return false;
  }
  /* c8 ignore stop */
}
async function fetchFromRainfocus(eventId) {
  const userId = await getUserId();
  if (!userId) return defaultReturn;

  const accessToken = window.adobeIMS.getAccessToken()?.token;
  if (!accessToken) return defaultReturn;

  const domainSuffix = getConfig()?.env?.name === 'prod' ? '' : '.stage';
  const url = `https://www${domainSuffix}.adobe.com/events/api/rf-auth-seq-generic/${eventId}?user_id=${encodeURIComponent(userId)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'same-origin',
    });
    if (response.ok) return response.json();
    window.lana?.log(`Unable to fetch from Rainfocus: ${response.statusText}`, {
      tags: 'mep-event',
      severity: 'error',
    });
    return defaultReturn;
  } catch (e) {
    window.lana?.log(`Unable to fetch from Rainfocus: ${e.toString()}`, {
      tags: 'mep-event',
      severity: 'error',
    });
    return defaultReturn;
  }
}
export default async function init(eventId) {
  if (eventId === true) return { isRegistered: eventId };
  return fetchFromRainfocus(eventId);
}
