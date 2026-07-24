/*
 * MEP IMS Probe — throwaway verification harness (delete after use).
 *
 * Purpose: prove whether the reused IMS client ('milo' by default) returns an
 * employee-distinguishing claim under the default scope, and whether the
 * out-of-band flow (own window.adobeid + imslib on this origin) resolves an
 * existing SSO session silently vs. needing an interactive redirect.
 *
 * Everything is overridable via URL params so we can probe scope/client/env
 * variations without editing:
 *   ?client_id=milo        which registered client to test (default: milo)
 *   ?env=stg1|prod         IMS environment (default: stg1)
 *   ?scope=AdobeID,openid,gnav   scope string (default: Milo's gnav default)
 *
 * Mirrors ost.js's tool-scoped IMS pattern (libs/blocks/ost/ost.js:386).
 */

const params = new URLSearchParams(window.location.search);
const CLIENT_ID = params.get('client_id') || 'milo';
const ENV = params.get('env') || 'stg1';
const SCOPE = params.get('scope') || 'AdobeID,openid,gnav';
const IMSLIB_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  $(id).textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    if (!payload) return '(not a JWT — opaque token)';
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch (e) {
    return `(could not decode: ${e.message})`;
  }
}

/*
 * Rank the candidate "is Adobe employee" signals in the profile, strongest
 * first, so we can see which fields the client actually returns.
 */
function evaluateSignals(profile) {
  const email = profile?.email || '';
  const signals = [
    ['email', email],
    ['email endsWith @adobe.com', email ? String(email.toLowerCase().endsWith('@adobe.com')) : '(no email)'],
    ['account_type', profile?.account_type ?? '(absent)'],
    ['authId', profile?.authId ?? '(absent)'],
    ['emailVerified', profile?.emailVerified ?? '(absent)'],
    ['ownerOrg', profile?.ownerOrg ?? '(absent)'],
    ['roles', profile?.roles ? JSON.stringify(profile.roles) : '(absent)'],
    ['tags', profile?.tags ? JSON.stringify(profile.tags) : '(absent)'],
  ];

  const isEmployee = !!email && email.toLowerCase().endsWith('@adobe.com');
  return { signals, isEmployee, hasEmail: !!email };
}

function renderVerdict(profile) {
  const verdict = $('verdict');
  const title = $('verdict-title');
  const signalsEl = $('signals');
  signalsEl.replaceChildren();

  if (!profile) {
    verdict.className = 'verdict unknown';
    title.textContent = 'Not signed in — no profile. Try “Sign in (interactive)”, or open on an allowlisted origin for silent SSO.';
    return;
  }

  const { signals, isEmployee, hasEmail } = evaluateSignals(profile);

  signals.forEach(([label, value]) => {
    const l = document.createElement('div');
    l.textContent = label;
    const v = document.createElement('code');
    v.textContent = String(value);
    signalsEl.append(l, v);
  });

  if (!hasEmail) {
    verdict.className = 'verdict fail';
    title.textContent = 'NO EMPLOYEE SIGNAL: profile has no email under this scope — a scope change (IMS ticket) is likely needed.';
    return;
  }
  verdict.className = `verdict ${isEmployee ? 'pass' : 'fail'}`;
  title.textContent = isEmployee
    ? 'EMPLOYEE SIGNAL PRESENT: @adobe.com email returned under default scope — reuse works with no IMS ticket.'
    : 'Signed in, but NOT an @adobe.com account — gate would (correctly) reject this user.';
}

async function render() {
  const ims = window.adobeIMS;
  const signedIn = !!ims?.isSignedInUser?.();
  setText('signedin', signedIn);

  if (!signedIn) {
    setText('profile', '(not signed in)');
    setText('token', '(not signed in)');
    renderVerdict(null);
    return;
  }

  let profile = null;
  try {
    profile = await ims.getProfile();
    setText('profile', profile);
  } catch (e) {
    setText('profile', `(getProfile threw: ${e.message})`);
  }

  const accessToken = ims.getAccessToken?.();
  setText('token', accessToken?.token ? decodeJwt(accessToken.token) : '(no access token)');

  renderVerdict(profile);
}

function init() {
  $('cfg-client').textContent = CLIENT_ID;
  $('cfg-env').textContent = ENV;
  $('cfg-scope').textContent = SCOPE;

  $('signin').addEventListener('click', () => window.adobeIMS?.signIn());
  $('signout').addEventListener('click', () => window.adobeIMS?.signOut({ redirect_uri: window.location.href }));
  $('reload').addEventListener('click', () => window.location.reload());

  window.adobeid = {
    client_id: CLIENT_ID,
    scope: SCOPE,
    environment: ENV,
    autoValidateToken: true,
    useLocalStorage: false,
    onReady: () => { render(); },
    onError: (type, err) => {
      $('verdict').className = 'verdict fail';
      $('verdict-title').textContent = `IMS error: ${type} — ${JSON.stringify(err)}`;
    },
  };

  const script = document.createElement('script');
  script.src = IMSLIB_URL;
  document.head.appendChild(script);
}

init();
