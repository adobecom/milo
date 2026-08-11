import { getConfig } from '../../utils/utils.js';

/*
 * Detects AEM Sidekick login from the page world. <aem-sidekick> is defined in the
 * extension's isolated world, so page JS sees no config/status and its status event
 * fires before we attach. The page-world signal: login-button#user in
 * plugin-action-bar's shadow is always present and carries `not-authorized` while
 * signed out. Auth is orthogonal to the adobe.com session (logged-out pages preview).
 */

const SIDEKICK_SELECTOR = 'aem-sidekick, helix-sidekick';
const USER_BUTTON_SELECTOR = 'login-button#user';
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

// Authed iff the always-present user button lacks the not-authorized marker.
function isAuthedIn(pluginBarShadow) {
  const user = pluginBarShadow?.querySelector(USER_BUTTON_SELECTOR);
  return !!user && !user.classList.contains(NOT_AUTHED_CLASS);
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

/*
 * Ungated hosts fire true immediately. Gated hosts fire the initial verdict, then
 * again whenever auth flips (author signs in/out mid-session).
 */
export function onSidekickAuth(callback) {
  if (!shouldGate()) {
    callback(true);
    return;
  }

  let authed;
  let mountTimer;
  // Transient search observers; the steady-state auth watcher is NOT tracked here.
  const observers = [];
  const track = (observer) => { observers.push(observer); };
  const stop = (observer) => {
    observer.disconnect();
    const i = observers.indexOf(observer);
    if (i !== -1) observers.splice(i, 1);
  };

  const set = (value) => {
    if (value === authed) return;
    authed = value;
    callback(value);
  };

  // Resolve true eagerly; defer the negative verdict to the bounded default so a
  // late render doesn't flash a prompt. Observer re-resolves on class toggle / re-render.
  const watchAuthState = (pluginBarShadow) => {
    if (isAuthedIn(pluginBarShadow)) set(true);
    const observer = new MutationObserver(() => {
      if (isAuthedIn(pluginBarShadow)) set(true);
      else if (authed === true) set(false);
    });
    observer.observe(pluginBarShadow, AUTH_MO);
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
    sk.addEventListener('status-fetched', (e) => { if (e?.detail?.profile) set(true); });
    sk.addEventListener('logged-in', () => set(true));
    sk.addEventListener('logged-out', () => set(false));
  };

  // The sidekick element may mount after we run — wait for it.
  const sk = getSidekick();
  if (sk?.shadowRoot) {
    attachAuthEvents(sk);
    watchPluginActionBar(sk.shadowRoot);
    // Sidekick present: brief head start before defaulting to unauthed, so a late
    // status resolution doesn't flash a sign-in prompt.
    setTimeout(() => { if (authed === undefined) set(false); }, RESOLVE_DELAY_MS);
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
