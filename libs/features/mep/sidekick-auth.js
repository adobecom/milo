import { getConfig } from '../../utils/utils.js';

/*
 * Detects whether the AEM Sidekick is present and logged in — WITHOUT scraping
 * the extension's internal shadow DOM (the old approach probed nested
 * `plugin-action-bar` → `env-switcher` shadow roots, which silently broke on
 * every Sidekick UI refactor).
 *
 * Instead we ask the AEM admin API directly:
 *   GET admin.hlx.page/status/{owner}/{repo}/{ref}{path}
 * The Sidekick extension injects its auth token onto that request via
 * declarativeNetRequest; the response carries a `profile` when authed. This is
 * a documented endpoint, and the call is re-queryable (unlike the one-shot
 * `status-fetched` event, which you miss if you subscribe too late).
 *
 * Verified page-initiated GETs receive the injected token + a readable profile
 * (tools/sk-status-probe). Auth stays orthogonal to the adobe.com session — the
 * token lives in the extension, never touching the page's IMS/gnav state, so
 * logged-out preview still works.
 *
 * Sidekick auth events are used only as a re-check TRIGGER (we re-derive truth
 * from the GET), so login-after-load and logout are handled without depending
 * on catching a one-shot event payload.
 */

const ADMIN = 'https://admin.hlx.page';
const SIDEKICK_SELECTOR = 'aem-sidekick, helix-sidekick';
const AUTH_EVENTS = ['logged-in', 'logged-out', 'status-fetched'];
const WATCH_TIMEOUT_MS = 5 * 60 * 1000;

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

// Off aem hosts (e.g. adobe.com) read the project from the Sidekick's public
// config — NOT its internal shadow DOM.
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

/*
 * Drop-in replacement for the old shadow-DOM watcher. Non-prod envs bypass the
 * gate (dev convenience). The callback fires with the initial verdict and again
 * whenever the Sidekick auth state changes.
 */
export function onSidekickAuth(callback, { envs = ['prod'] } = {}) {
  const envName = getConfig().env?.name;
  if (!envs.includes(envName)) {
    callback(true);
    return;
  }

  let last;
  const emit = (authed) => {
    if (authed === last) return;
    last = authed;
    callback(authed);
  };

  const check = async () => { emit(await isSidekickAuthed()); };

  check();
  watchSidekick(check);
}
