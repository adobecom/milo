/*
 * DEMO (for Narcis) — Raphael's HEAD /profile suggestion from the aem-sidekick thread.
 * Detect AEM Sidekick auth by sending a HEAD to admin.hlx.page/profile:
 *   200 = logged in, 401 = logged out, 403 = logged in without the project role.
 * The extension injects the auth token only on hosts listed in the site's
 * trustedHosts config. *.aem.page is trusted by default, so this returns 200 there
 * today; on www.adobe.com it returns 401 until adobe.com is added to each project's
 * trustedHosts. This build always probes (bypasses the ungated-host shortcut) so the
 * call is visible on every host for the demo.
 */

const PROFILE_URL = 'https://admin.hlx.page/profile';
const SIDEKICK_SELECTOR = 'aem-sidekick, helix-sidekick';

const UNGATED_HOST = /(^|\.)(aem|hlx)\.(page|reviews)$|(^|\.)(stage|corp)\.adobe\.com$|(^|[.-])graybox\.adobe\.com$/;
export function isUngatedHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || UNGATED_HOST.test(hostname);
}

// HEAD /profile status: 200 authed, 401 logged out, 403 no role, 0 network error.
export async function fetchProfileStatus() {
  try {
    const res = await fetch(PROFILE_URL, { method: 'HEAD', credentials: 'include' });
    return res.status;
  } catch {
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
    console.log('[sidekick-auth demo] HEAD', PROFILE_URL, '->', status, `(${labelForStatus(status)})`);
    callback(status === 200);
  };
  resolve();
  const sk = document.querySelector(SIDEKICK_SELECTOR);
  if (sk) ['logged-in', 'logged-out', 'status-fetched'].forEach((evt) => sk.addEventListener(evt, resolve));
}
