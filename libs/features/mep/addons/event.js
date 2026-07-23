import { isSignedOut, getConfig, getMepEnablement, loadIms, getCookie } from '../../../utils/utils.js';

const defaultReturn = { isRegistered: false };

// Persist only what personalization reads; never the RF authToken/userKey.
const store = window.localStorage;
const TTL_REGISTERED = 24 * 60 * 60 * 1000;
const TTL_UNREGISTERED = 3 * 60 * 1000;
const cacheKey = (eventCode, userId) => `mep-event:${eventCode}:${userId}`;

const justRegistered = (eventCode) => getCookie(`feds_${eventCode}_registeredByRedirect`) === 'true';
const clearRegisteredFlag = (eventCode) => {
  // VEAL sets this cookie Domain=.adobe.com; a host-only delete won't clear it.
  document.cookie = `feds_${eventCode}_registeredByRedirect=; Max-Age=0; path=/; domain=.adobe.com`;
};

function readCache(eventCode, userId) {
  try {
    const raw = store.getItem(cacheKey(eventCode, userId));
    if (!raw) return null;
    const { isRegistered, inPersonAttendee, exp } = JSON.parse(raw);
    if (!exp || Date.now() > exp) return null;
    return { isRegistered, inPersonAttendee };
  } catch {
    return null;
  }
}

function writeCache(eventCode, userId, data) {
  try {
    const ttl = data.isRegistered ? TTL_REGISTERED : TTL_UNREGISTERED;
    store.setItem(cacheKey(eventCode, userId), JSON.stringify({
      isRegistered: !!data.isRegistered,
      inPersonAttendee: !!data.inPersonAttendee,
      exp: Date.now() + ttl,
    }));
  } catch {
    // storage unavailable — non-fatal
  }
}

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

async function fetchFromRainfocus(eventCode) {
  const userId = await getUserId();
  if (!userId) return defaultReturn;

  // The redirect flag means the user just registered — trust it for the pre-LCP
  // paint instead of blocking on RF, then clear the one-shot signal.
  if (justRegistered(eventCode)) {
    clearRegisteredFlag(eventCode);
    const data = { isRegistered: true };
    writeCache(eventCode, userId, data);
    return data;
  }
  const cached = readCache(eventCode, userId);
  if (cached) return cached;

  const accessToken = window.adobeIMS.getAccessToken()?.token;
  if (!accessToken) return defaultReturn;

  const domainSuffix = getConfig()?.env?.name === 'prod' ? '' : '.stage';
  const url = `https://www${domainSuffix}.adobe.com/events/api/rf-auth-seq-generic/${eventCode}?user_id=${encodeURIComponent(userId)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'same-origin',
    });
    if (response.ok) {
      // RF returns {} (not { isRegistered: false }) when not registered.
      const data = { isRegistered: false, ...(await response.json()) };
      writeCache(eventCode, userId, data);
      return data;
    }
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

export default async function init(eventCode) {
  if (eventCode === true) return { isRegistered: eventCode };
  return fetchFromRainfocus(eventCode);
}
