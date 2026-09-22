import { getConfig } from '../../utils/utils.js';

/*
 * Detects likely page-view authorization from AEM Sidekick and the Adobe firewall.
 * <aem-sidekick> is defined in the extension's isolated world, so page JS sees no
 * config/status and its status event fires before we attach. The page-world signal:
 * login-button#user in plugin-action-bar's shadow. Its own shadow root is
 * authoritative — a login action (sk-action-button.login) while signed out, a user
 * menu (sk-action-menu) while signed in; the host's `not-authorized` class is only a
 * fast signed-out fallback. The firewall signal is a reachability check against a
 * corporate host. These functions do not confirm a user's specific page permissions;
 * they only indicate that the user is likely authorized to view pages.
 * Auth is orthogonal to the adobe.com session (logged-out pages preview).
 */

const SIDEKICK_SELECTOR = 'aem-sidekick, helix-sidekick';
const USER_BUTTON_SELECTOR = 'login-button#user';
const LOGIN_ACTION_SELECTOR = 'sk-action-button.login';
const USER_MENU_SELECTOR = 'sk-action-menu';
const NOT_AUTHED_CLASS = 'not-authorized';
// Catch class flips (not-authorized) and node re-renders in the shadow.
const AUTH_MO = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };
// Stop waiting for the sidekick to mount after this long; never tears down the live
// auth watcher (it runs for the page's life so logout is always caught).
const WATCH_TIMEOUT_MS = 5 * 60 * 1000;
// Head start for the shadow/status to resolve before defaulting to unauthed, so a
// signed-in author doesn't see a sign-in flash.
const RESOLVE_DELAY_MS = 1200;

function getSidekick() {
  return document.querySelector(SIDEKICK_SELECTOR);
}

function getPluginActionBarShadow() {
  return getSidekick()?.shadowRoot?.querySelector('plugin-action-bar')?.shadowRoot;
}

// The login button's shadow content is authoritative: the login action is signed
// out, the user menu is signed in. 'unknown' = no button/shadow yet or a transient
// empty re-render — hold the current verdict rather than flip. The host's
// not-authorized class is a fast definitive signed-out marker.
const AUTH_STATE = { authed: 'authed', unauthed: 'unauthed', unknown: 'unknown' };
function readAuthState(pluginBarShadow) {
  const user = pluginBarShadow?.querySelector(USER_BUTTON_SELECTOR);
  if (!user) return AUTH_STATE.unknown;
  if (user.classList.contains(NOT_AUTHED_CLASS)) return AUTH_STATE.unauthed;
  const userShadow = user.shadowRoot;
  if (userShadow?.querySelector(USER_MENU_SELECTOR)
    && !userShadow.querySelector(LOGIN_ACTION_SELECTOR)) return AUTH_STATE.authed;
  if (userShadow?.querySelector(LOGIN_ACTION_SELECTOR)) return AUTH_STATE.unauthed;
  return AUTH_STATE.unknown;
}

function isAuthedIn(pluginBarShadow) {
  return readAuthState(pluginBarShadow) === AUTH_STATE.authed;
}

export function isSidekickAuthed() {
  return isAuthedIn(getPluginActionBarShadow());
}

// Ungated (no auth) = preview/dev/stage/internal hosts only; prod, prodDomains, the
// public *.aem.live edge, and unknown hosts stay GATED. graybox's [.-] covers both
// graybox.adobe.com and the hyphenated business-graybox.adobe.com. Keyed on hostname,
// not config.env.name (spoofable via ?env=stage on any host).
const UNGATED_HOST = /(^|\.)(aem|hlx)\.(page|reviews)$|(^|\.)(stage|corp)\.adobe\.com$|(^|[.-])graybox\.adobe\.com$/;
export function isUngatedHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || UNGATED_HOST.test(hostname);
}

function shouldGate() {
  const { prodDomains, env } = getConfig();
  const { hostname } = window.location;
  if (prodDomains?.includes(hostname)) return true;
  if (env?.name === 'prod') return true;
  return !isUngatedHost(hostname);
}

// Corp-only hostname: resolvable only on the internal network/VPN, so the fetch
// itself (not its response, which is opaque under no-cors) is the signal — it
// rejects on DNS/connection failure off-network and resolves on-network.
const FIREWALL_CHECK_URL = 'https://mep-auth-check.awesome-sites.corp.adobe.com';
const FIREWALL_CHECK_TIMEOUT_MS = 1500;
export async function isWithinFirewall() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FIREWALL_CHECK_TIMEOUT_MS);
  try {
    await fetch(FIREWALL_CHECK_URL, { mode: 'no-cors', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/*
 * Ungated hosts fire true immediately. Gated hosts fire the initial verdict, then
 * again whenever auth flips (author signs in/out mid-session).
 */
export async function onSidekickAuth(callback) {
  if (!shouldGate()) {
    callback(true);
    return;
  }

  let authed;
  let mountTimer;
  let firewallAuthorized = false;
  let authObserver;
  let userShadowObserver;
  let authEventTarget;
  let authEventHandlers;
  // Transient search observers; the steady-state auth watcher is NOT tracked here.
  const observers = [];
  const track = (observer) => { observers.push(observer); };
  const stop = (observer) => {
    observer.disconnect();
    const i = observers.indexOf(observer);
    if (i !== -1) observers.splice(i, 1);
  };

  const set = (value) => {
    const access = firewallAuthorized || value;
    if (access === authed) return;
    authed = access;
    callback(access);
  };

  const stopAuthChecks = () => {
    clearTimeout(mountTimer);
    observers.slice().forEach(stop);
    authObserver?.disconnect();
    userShadowObserver?.disconnect();
    if (authEventTarget && authEventHandlers) {
      Object.entries(authEventHandlers).forEach(([event, handler]) => {
        authEventTarget.removeEventListener(event, handler);
      });
    }
  };

  // Do not delay Sidekick listeners on a network reachability probe. Firewall
  // access is an affirmative override if it resolves while auth is initializing.
  isWithinFirewall().then((withinFirewall) => {
    if (!withinFirewall) return;
    firewallAuthorized = true;
    stopAuthChecks();
    set(true);
  });

  // Resolve true eagerly; defer the negative verdict to the bounded default so a
  // late render doesn't flash a prompt. Observer re-resolves on class toggle / re-render.
  const watchAuthState = (pluginBarShadow) => {
    let userShadow;
    const evaluate = () => {
      const state = readAuthState(pluginBarShadow);
      if (state === AUTH_STATE.authed) set(true);
      // Only a definitive signed-out reading flips to false; a transient 'unknown'
      // (mid re-render) holds the current verdict so signed-in users don't flash logout.
      else if (authed === true && state === AUTH_STATE.unauthed) set(false);
    };
    // The authoritative signal (login action vs user menu) lives inside login-button's
    // own shadow root; a MutationObserver can't see across that boundary, so watch it
    // directly and re-point when the button (re-)mounts or attaches its shadow.
    const syncUserShadowObserver = () => {
      const nextShadow = pluginBarShadow.querySelector(USER_BUTTON_SELECTOR)?.shadowRoot;
      if (nextShadow === userShadow) return;
      userShadowObserver?.disconnect();
      userShadow = nextShadow;
      if (!userShadow) return;
      userShadowObserver = new MutationObserver(evaluate);
      userShadowObserver.observe(userShadow, { childList: true, subtree: true });
    };
    syncUserShadowObserver();
    evaluate();
    authObserver = new MutationObserver(() => {
      syncUserShadowObserver();
      evaluate();
    });
    authObserver.observe(pluginBarShadow, AUTH_MO);
    // Steady state: left running for the page's life (never torn down) so logout is
    // always caught. Transient observers have self-disconnected — stop the mount timer.
    clearTimeout(mountTimer);
  };

  // plugin-action-bar's shadowRoot renders async — wait for it.
  const watchPluginActionBar = (sidekickShadow) => {
    const bar = sidekickShadow.querySelector('plugin-action-bar');
    if (bar?.shadowRoot) { watchAuthState(bar.shadowRoot); return; }
    const observer = new MutationObserver(() => {
      const nextBar = sidekickShadow.querySelector('plugin-action-bar');
      if (!nextBar?.shadowRoot) return;
      stop(observer);
      watchAuthState(nextBar.shadowRoot);
    });
    observer.observe(sidekickShadow, { childList: true, subtree: true });
    track(observer);
  };

  // Live backup to the DOM signal for mid-session changes; status-fetched has the profile.
  const attachAuthEvents = (sk) => {
    authEventTarget = sk;
    authEventHandlers = {
      'status-fetched': (e) => { if (e?.detail?.profile) set(true); },
      'logged-in': () => set(true),
      'logged-out': () => set(false),
    };
    Object.entries(authEventHandlers).forEach(([event, handler]) => {
      sk.addEventListener(event, handler);
    });
  };

  // login-button present and unmarked, yet its shadow exposes neither the login action
  // nor the user menu — closed shadow or the extension's internals changed. We can't
  // read auth (fail safe to gated); surface it once so the drift is diagnosable.
  const logIfUnreadable = () => {
    const user = getPluginActionBarShadow()?.querySelector(USER_BUTTON_SELECTOR);
    if (!user || user.classList.contains(NOT_AUTHED_CLASS)) return;
    const userShadow = user.shadowRoot;
    if (userShadow?.querySelector(USER_MENU_SELECTOR)
      || userShadow?.querySelector(LOGIN_ACTION_SELECTOR)) return;
    window.lana?.log('sidekick-auth: login-button exposes no readable auth state', { tags: 'mep', errorType: 'i' });
  };

  // The sidekick element may mount after we run — wait for it.
  const sk = getSidekick();
  if (sk?.shadowRoot) {
    attachAuthEvents(sk);
    watchPluginActionBar(sk.shadowRoot);
    // Sidekick present: brief head start before defaulting to unauthed, so a late
    // status resolution doesn't flash a sign-in prompt.
    setTimeout(() => {
      if (authed === undefined) set(false);
      logIfUnreadable();
    }, RESOLVE_DELAY_MS);
  } else {
    // No sidekick → unauthed now (delay 0): no flash to avoid, and nothing lingering
    // to fire after a consumer tears down. Still watch for a late mount.
    setTimeout(() => { if (authed === undefined) set(false); }, 0);
    const observer = new MutationObserver(() => {
      const el = getSidekick();
      if (!el?.shadowRoot) return;
      stop(observer);
      attachAuthEvents(el);
      watchPluginActionBar(el.shadowRoot);
    });
    observer.observe(document.body, { childList: true });
    track(observer);
  }
  // Tear down only the transient search observers, and only if none resolved.
  mountTimer = setTimeout(() => { observers.slice().forEach(stop); }, WATCH_TIMEOUT_MS);
}
