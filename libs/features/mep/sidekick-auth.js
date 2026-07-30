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
const AUTH_FETCH_TIMEOUT_MS = 5000;
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
  // owner/repo/ref can come from the DOM (Sidekick config) — encode every
  // segment; the path keeps its slashes but each segment is encoded.
  const enc = encodeURIComponent;
  const encPath = path.split('/').map(enc).join('/');
  const url = `${ADMIN}/status/${enc(owner)}/${enc(repo)}/${enc(ref)}${encPath}?editUrl=auto`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return false;
    const data = await res.json();
    // NOTE: a truthy `profile` means the response carried an authenticated
    // Sidekick session; it does not by itself prove *edit* permission on the
    // resolved owner/repo. Tightening to a per-repo role check is a tracked
    // follow-up (review #9), pending confirmation of what /status exposes.
    return !!data?.profile;
  } catch (e) {
    return false;
  } finally {
    clearTimeout(timer);
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

// Only genuine non-prod preview/dev surfaces run ungated: *.aem.page /
// *.hlx.page (preview), *.aem.reviews, and localhost. Everything else —
// adobe.com, listed prodDomains, unknown hosts, and the public *.aem.live /
// *.hlx.live edge — defaults to GATED. The env signal is query-spoofable
// (?env=stage), so it may only tighten the gate (force prod), never re-open it.
const UNGATED_HOST = /(^|\.)(aem|hlx)\.(page|reviews)$/;
export function isUngatedHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || UNGATED_HOST.test(hostname);
}

function shouldGate() {
  const { prodDomains, env } = getConfig();
  if (prodDomains?.includes(window.location.hostname)) return true;
  if (env?.name === 'prod') return true;
  return !isUngatedHost(window.location.hostname);
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
