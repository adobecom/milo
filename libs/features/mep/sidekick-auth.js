import { getConfig } from '../../utils/utils.js';

/*
 * Detects Sidekick login via the admin API: GET admin.hlx.page/status/… — the
 * extension injects the auth token, and a `profile` in the response means
 * authed. Auth stays orthogonal to the adobe.com session, so logged-out pages
 * can still be previewed.
 */

const ADMIN = 'https://admin.hlx.page';
const SIDEKICK_SELECTOR = 'aem-sidekick, helix-sidekick';
const AUTH_EVENTS = ['logged-in', 'logged-out', 'status-fetched'];
const WATCH_TIMEOUT_MS = 5 * 60 * 1000;
// Bounded backoff for extra checks while unauthed (never polls) — rides out the
// extension not having registered its request rules yet.
const RETRY_DELAYS_MS = [300, 900];

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

function getSidekick() {
  return document.querySelector(SIDEKICK_SELECTOR);
}

// On aem.page/live the project is in the host label: {ref}--{repo}--{owner}.
function projectFromHost() {
  const { hostname } = window.location;
  if (!/\.(aem|hlx)\.(page|live|reviews)$/.test(hostname)) return null;
  const [label] = hostname.split('.');
  const parts = label.split('--');
  if (parts.length !== 3) return null;
  const [ref, repo, owner] = parts;
  return { owner, repo, ref };
}

// Off aem hosts (adobe.com), the project comes from the Sidekick's public config.
function projectFromSidekick() {
  const sk = getSidekick();
  const cfg = sk?.config || sk?.appStore?.siteStore || sk?.appStore?.status?.config;
  if (cfg?.owner && cfg?.repo) return { owner: cfg.owner, repo: cfg.repo, ref: cfg.ref || 'main' };
  return null;
}

function getProject() {
  return projectFromHost() || projectFromSidekick();
}

export async function isSidekickAuthed() {
  const project = getProject();
  if (!project) return false;
  const { owner, repo, ref } = project;
  const path = window.location.pathname || '/';
  try {
    const res = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}${path}?editUrl=auto`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!data?.profile;
  } catch (e) {
    return false;
  }
}

// Re-check on any Sidekick auth-state change (login-after-load, logout). The
// event is only a nudge; isSidekickAuthed() re-derives the real state.
function watchSidekick(onChange) {
  const attach = (sk) => AUTH_EVENTS.forEach((evt) => sk.addEventListener(evt, onChange));

  const existing = getSidekick();
  if (existing) { attach(existing); return; }

  let timeoutId;
  const observer = new MutationObserver(() => {
    const sk = getSidekick();
    if (!sk) return;
    observer.disconnect();
    clearTimeout(timeoutId);
    attach(sk);
    onChange();
  });
  observer.observe(document.body, { childList: true });
  timeoutId = setTimeout(() => observer.disconnect(), WATCH_TIMEOUT_MS);
}

// Gate on real prod hosts (host-keyed via prodDomains, so ?env=stage can't turn
// it off on prod) or when the resolved env is prod (covers ?env=prod for testing
// on preview hosts). Off these, the drawer is ungated.
function shouldGate() {
  const { prodDomains, env } = getConfig();
  return !!prodDomains?.includes(window.location.hostname) || env?.name === 'prod';
}

/*
 * Off the gated hosts the callback fires true (ungated). Otherwise it fires with
 * the initial verdict and again on any Sidekick auth-state change.
 */
export function onSidekickAuth(callback) {
  if (!shouldGate()) {
    callback(true);
    return;
  }

  let authed;
  const set = (value) => {
    if (value === authed) return;
    authed = value;
    callback(value);
  };

  (async () => {
    if (await isSidekickAuthed()) { set(true); return; }
    // No project → nothing to wait for; watchSidekick still catches a late mount.
    if (!getProject()) { set(false); return; }
    for (let i = 0; i < RETRY_DELAYS_MS.length; i += 1) {
      if (authed === true) return; // an auth event already resolved us
      // eslint-disable-next-line no-await-in-loop
      await wait(RETRY_DELAYS_MS[i]);
      // eslint-disable-next-line no-await-in-loop
      if (await isSidekickAuthed()) { set(true); return; }
    }
    if (authed !== true) set(false);
  })();

  watchSidekick(async () => { set(await isSidekickAuthed()); });
}
