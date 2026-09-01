/*
 * DEMO for Raphael (@rofe) — repro for the aem-sidekick thread.
 *
 * To reproduce the 401 I hit: override this file (DevTools > Sources > Overrides)
 * for libs/features/mep/sidekick-auth.js on https://milo.adobe.com/ while signed in
 * to Sidekick, then reload. No plugin click needed — the profile request fires
 * automatically on page load. Watch the console for the "[sidekick-auth demo]" lines.
 *
 * It sends a page-context GET to admin.hlx.page/profile (HEAD is rejected 405):
 *   200 = logged in, 401 = logged out, 403 = logged in without the project role.
 * milo.adobe.com and main--milo--adobecom.aem.page are already in trustedHosts, yet
 * the GET returns 401 (X-Error: [admin] not authenticated) with no auth cookie/header
 * on the request — which is the behavior I'm asking about. This build always probes
 * (bypasses the ungated-host shortcut) so the call is visible on every host.
 */

const PROFILE_URL = 'https://admin.hlx.page/profile';
const SIDEKICK_SELECTOR = 'aem-sidekick, helix-sidekick';

// eslint-disable-next-line no-console
console.log('[sidekick-auth demo] override active on', window.location.hostname, '— profile GET fires automatically on load');

const UNGATED_HOST = /(^|\.)(aem|hlx)\.(page|reviews)$|(^|\.)(stage|corp)\.adobe\.com$|(^|[.-])graybox\.adobe\.com$/;
export function isUngatedHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || UNGATED_HOST.test(hostname);
}

// GET /profile status: 200 authed, 401 logged out, 403 no role, 0 network error.
export async function fetchProfileStatus() {
  try {
    // eslint-disable-next-line no-console
    console.log('[sidekick-auth demo] GET ->', PROFILE_URL, '(credentials: include)');
    const res = await fetch(PROFILE_URL, { method: 'GET', credentials: 'include' });
    // eslint-disable-next-line no-console
    console.log('[sidekick-auth demo] response status', res.status, 'ok', res.ok, 'type', res.type);
    return res.status;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('[sidekick-auth demo] fetch threw', e?.name, e?.message);
    return 0;
  }
}

export async function isSidekickAuthed() {
  return (await fetchProfileStatus()) === 200;
}

function labelForStatus(status) {
  if (status === 200) return 'authed';
  if (status === 401) return 'logged out';
  if (status === 403) return 'logged in, no role for this project';
  if (status === 0) return 'network error / blocked';
  return `unexpected (${status})`;
}

// Fires the initial verdict, then re-probes on the sidekick's auth events. 403
// (logged in without the project role) is treated as not-authed for the gate but
// logged distinctly so the demo shows it apart from a plain logged-out 401.
export function onSidekickAuth(callback) {
  const resolve = async () => {
    const status = await fetchProfileStatus();
    // eslint-disable-next-line no-console
    console.log('[sidekick-auth demo] GET', PROFILE_URL, '->', status, `(${labelForStatus(status)})`);
    callback(status === 200);
  };
  resolve();
  const sk = document.querySelector(SIDEKICK_SELECTOR);
  // eslint-disable-next-line no-console
  console.log('[sidekick-auth demo] sidekick element', sk ? sk.tagName.toLowerCase() : 'NOT FOUND', '- rebinding on auth events:', !!sk);
  if (sk) ['logged-in', 'logged-out', 'status-fetched'].forEach((evt) => sk.addEventListener(evt, resolve));
}
