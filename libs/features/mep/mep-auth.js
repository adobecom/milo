import { getConfig } from '../../utils/utils.js';

/*
 * ============================================================================
 * PoC STATUS — read before extending. (branch: mep-next-v1-ims-auth-poc)
 * ============================================================================
 *
 * WHAT WORKS (validated):
 * - Reusing Milo's existing `milo` IMS client returns an @adobe.com employee
 *   signal under the DEFAULT scope in BOTH stg1 and prod — no IMS ticket, no
 *   backend, no author-group provisioning needed.
 * - Full interactive gate works end-to-end on localhost: "Sign in to MEP" →
 *   popup → Okta → popup self-closes → drawer rebuilds in place. Unauthed gate
 *   confirmed on a real aem.page origin. Sign-out (MEP-scoped opt-out) works.
 *
 * THE BLOCKING ISSUE (why this approach may not ship):
 * - MEP must be usable while previewing LOGGED-OUT pages. This gate can't give
 *   true logged-out preview: authenticating the tool via IMS establishes the
 *   browser-wide adobe.com session, and `isSignedOut()` (utils.js) reads the
 *   edge `sis` header from that session's cookie — so the page renders
 *   SIGNED-IN on the next load. Tool-auth and page-audience-auth are the same
 *   session; you can't be MEP-authed AND view the page as a real logged-out
 *   visitor. `?xlg=loggedout` only spoofs the MEP/personalization variant
 *   layer, not gnav chrome / entitlements / pricing.
 * - The AEM Sidekick avoids this because it's an EXTENSION: it authenticates
 *   against admin.hlx.page and injects its token via declarativeNetRequest,
 *   never touching the adobe.com session. That orthogonality is an
 *   extension-only capability a web page cannot reproduce. See the
 *   sidekick-status PoC for the alternative that keeps that orthogonality.
 * ============================================================================
 *
 * MEP employee-auth gate. Replaces the AEM-Sidekick shadow-DOM probe
 * (sidekick-auth.js) with a MEP-owned IMS login that is independent of the
 * page's own login state — MEP preview must work on logged-in AND logged-out
 * pages.
 *
 * Resolution is three-tier, cheapest first:
 *   1. Reuse an existing page IMS session if one is already signed in
 *      (read-only via window.adobeIMS — NEVER triggers a page login). Gives
 *      zero-click auth for employees already signed into the page.
 *   2. Silent SSO in a hidden iframe pointed at /tools/mep-auth/ — its own
 *      window context, so the page's IMS singleton (owned by gnav) is never
 *      clobbered and no page login is forced.
 *   3. Interactive sign-in via a popup (signInToMep), from a user gesture.
 *
 * Authorization bar is "is an Adobe employee" (@adobe.com). This is a
 * client-side/advisory gate, not a hard boundary — acceptable because the
 * drawer only exposes authoring UI over already-rendered content.
 */

const AUTH_MESSAGE_TYPE = 'mep-auth';
const SILENT_TIMEOUT_MS = 8000;
const SESSION_KEY = 'mepAuthEmployee';
const OPT_OUT_KEY = 'mepAuthOptOut';

const MILO_ORIGINS = {
  prod: 'https://milo.adobe.com',
  stage: 'https://milo.stage.adobe.com',
};

function isEmployeeEmail(email) {
  return !!email && email.toLowerCase().endsWith('@adobe.com');
}

function isSameSiteOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost'
      || /\.(aem|hlx)\.(page|live)$/.test(hostname)
      || /(^|\.)milo(\.stage)?\.adobe\.com$/.test(hostname);
  } catch (e) {
    return false;
  }
}

// The route lives on a Milo origin allowlisted for the IMS client. Same-origin
// when the page is already on a Milo/aem host (dev, previews); otherwise the
// canonical Milo origin for the env (adobe.com content pages → cross-origin,
// origin-validated on both ends).
function getRouteOrigin() {
  const current = window.location.origin;
  if (isSameSiteOrigin(current)) return current;
  return MILO_ORIGINS[getConfig().env?.name === 'prod' ? 'prod' : 'stage'];
}

function getRouteUrl(mode) {
  const origin = getRouteOrigin();
  const url = new URL('/tools/mep-auth/mep-auth.html', origin);
  url.searchParams.set('mode', mode);
  url.searchParams.set('origin', window.location.origin);
  url.searchParams.set('env', getConfig().env?.ims || 'prod');
  return { href: url.href, origin };
}

function cacheEmployee(isEmployee) {
  try {
    if (isEmployee) window.sessionStorage.setItem(SESSION_KEY, 'true');
  } catch (e) { /* sessionStorage unavailable — non-fatal */ }
}

function isCachedEmployee() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

// MEP-scoped sign-out sentinel. Because the gate derives from the ambient Adobe
// session, clearing the employee cache alone would re-unlock on the next silent
// check. This sentinel suppresses the silent tiers until an explicit sign-in,
// giving a sign-out that sticks for the session without touching IMS.
function isOptedOut() {
  try {
    return window.sessionStorage.getItem(OPT_OUT_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function setOptedOut(value) {
  try {
    if (value) window.sessionStorage.setItem(OPT_OUT_KEY, 'true');
    else window.sessionStorage.removeItem(OPT_OUT_KEY);
  } catch (e) { /* sessionStorage unavailable — non-fatal */ }
}

function clearEmployeeCache() {
  try { window.sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* non-fatal */ }
}

// Resolves once with the route's authed verdict. Only accepts a message from
// the exact route origin we opened, of the expected type.
function awaitAuthMessage(routeOrigin, { timeoutMs } = {}) {
  return new Promise((resolve) => {
    let settled = false;
    let timeoutId;
    const controller = new AbortController();

    const finish = (value) => {
      if (settled) return;
      settled = true;
      controller.abort();
      if (timeoutId) clearTimeout(timeoutId);
      resolve(value);
    };

    window.addEventListener('message', (event) => {
      if (event.origin !== routeOrigin) return;
      if (event.data?.type !== AUTH_MESSAGE_TYPE) return;
      finish(!!event.data.authed);
    }, { signal: controller.signal });

    if (timeoutMs) timeoutId = setTimeout(() => finish(false), timeoutMs);
  });
}

// Tier 1: read an already-present page session. Returns null (not false) when
// there's nothing to read, so the caller falls through to the iframe.
async function pageSessionEmployee() {
  const ims = window.adobeIMS;
  if (!ims?.isSignedInUser?.()) return null;
  try {
    const profile = await ims.getProfile();
    return isEmployeeEmail(profile?.email);
  } catch (e) {
    return null;
  }
}

// Tier 2: silent SSO in a hidden iframe (own window context).
async function iframeSilentCheck() {
  const { href, origin } = getRouteUrl('silent');
  const iframe = document.createElement('iframe');
  iframe.hidden = true;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.src = href;
  document.body.append(iframe);
  const authed = await awaitAuthMessage(origin, { timeoutMs: SILENT_TIMEOUT_MS });
  iframe.remove();
  return authed;
}

async function resolveSilent() {
  const fromPage = await pageSessionEmployee();
  if (fromPage !== null) return fromPage;
  return iframeSilentCheck();
}

const subscribers = [];

/*
 * Near-drop-in for sidekick-auth's onSidekickAuth. Non-prod envs bypass the
 * gate (dev convenience, and silent SSO can't resolve on localhost anyway).
 * The callback may fire twice: once with the silent verdict, and again with
 * true after a successful interactive sign-in.
 */
export function onMepAuth(callback, { envs = ['prod'] } = {}) {
  const envName = getConfig().env?.name;
  if (!envs.includes(envName)) {
    callback(true);
    return;
  }
  subscribers.push(callback);
  if (isOptedOut()) {
    callback(false);
    return;
  }
  if (isCachedEmployee()) {
    callback(true);
    return;
  }
  resolveSilent().then((authed) => {
    cacheEmployee(authed);
    callback(authed);
  });
}

/*
 * Interactive sign-in — must be called from a user gesture (popup). Resolves
 * true once the popup reports an authed employee, then re-notifies all
 * subscribers so the drawer rebuilds in place.
 */
export async function signInToMep() {
  const { href, origin } = getRouteUrl('interactive');
  const popup = window.open(href, 'mep-auth', 'width=500,height=720');
  if (!popup) return false;
  const authed = await awaitAuthMessage(origin);
  if (authed) {
    setOptedOut(false);
    cacheEmployee(true);
    subscribers.forEach((cb) => cb(true));
  }
  return authed;
}

/*
 * MEP-scoped sign-out. Re-locks the drawer in place and stays locked for the
 * session (survives reload) via the opt-out sentinel. Deliberately does NOT
 * call window.adobeIMS.signOut() — that would end the browser-wide Adobe
 * session. An explicit signInToMep() clears the opt-out.
 */
export function signOutOfMep() {
  clearEmployeeCache();
  setOptedOut(true);
  subscribers.forEach((cb) => cb(false));
}
