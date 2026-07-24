/*
 * MEP auth route. Runs imslib out-of-band from the host page (its own window
 * context) and reports back an "is Adobe employee" verdict via postMessage.
 *
 * Two modes (query param `mode`):
 *   silent      — loaded in a hidden iframe. Report the current session verdict
 *                 and never trigger an interactive login.
 *   interactive — loaded in a popup. If no session, run signIn() (redirects
 *                 within the popup); on return, report the verdict and close.
 *
 * The gate module (libs/features/mep/mep-auth.js) is the consumer. See it for
 * the security posture (client-side/advisory gate).
 */

const AUTH_MESSAGE_TYPE = 'mep-auth';
const IMSLIB_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';

const params = new URLSearchParams(window.location.search);
const MODE = params.get('mode') === 'interactive' ? 'interactive' : 'silent';
const TARGET_ORIGIN = params.get('origin') || '';
const CLIENT_ID = params.get('client_id') || 'milo';
const ENV = params.get('env') || 'prod';
const SCOPE = params.get('scope') || 'AdobeID,openid,gnav';

// Only ever postMessage back to a trusted Adobe/AEM/localhost origin — never '*'.
function isAllowedOrigin(origin) {
  if (!origin) return false;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    return hostname === 'localhost'
      || /\.(aem|hlx)\.(page|live)$/.test(hostname)
      || /(^|\.)adobe\.com$/.test(hostname);
  } catch (e) {
    return false;
  }
}

function report(authed) {
  if (!isAllowedOrigin(TARGET_ORIGIN)) return;
  const target = MODE === 'interactive' ? window.opener : window.parent;
  target?.postMessage({ type: AUTH_MESSAGE_TYPE, authed: !!authed }, TARGET_ORIGIN);
}

function setStatus(title, detail) {
  document.getElementById('status').textContent = title;
  document.getElementById('detail').textContent = detail;
}

async function isEmployee() {
  if (!window.adobeIMS?.isSignedInUser()) return false;
  try {
    const profile = await window.adobeIMS.getProfile();
    return !!profile?.email && profile.email.toLowerCase().endsWith('@adobe.com');
  } catch (e) {
    return false;
  }
}

async function onReady() {
  const signedIn = !!window.adobeIMS?.isSignedInUser();

  if (!signedIn && MODE === 'interactive') {
    window.adobeIMS.signIn();
    return;
  }

  const employee = await isEmployee();
  report(employee);

  if (MODE === 'interactive') {
    setStatus(employee ? 'You’re signed in.' : 'Not authorized.', 'You can close this window.');
    window.close();
  }
}

window.adobeid = {
  client_id: CLIENT_ID,
  scope: SCOPE,
  environment: ENV,
  autoValidateToken: true,
  useLocalStorage: false,
  onReady,
  onError: () => report(false),
};

const script = document.createElement('script');
script.src = IMSLIB_URL;
document.head.appendChild(script);
