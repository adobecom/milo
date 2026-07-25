/*
 * Sidekick /status probe — throwaway verification harness (delete after use).
 *
 * Confirms the ONE unknown that gates the /status auth-detection refactor:
 * does a PAGE-initiated GET to admin.hlx.page/status/{owner}/{repo}/{ref}{path}
 * receive the token the Sidekick extension injects via declarativeNetRequest,
 * and return a CORS-readable `profile`? If yes, a single re-queryable GET
 * replaces both the fragile shadow-DOM probe and the flaky one-shot event
 * subscription in sidekick-auth.js.
 *
 * Run on a milo aem.page/live origin with the AEM Sidekick installed + logged
 * in. owner/repo/ref default from the host label ({ref}--{repo}--{owner}); all
 * overridable:
 *   ?owner= ?repo= ?ref= ?path=/some/page ?creds=include
 */

const ADMIN = 'https://admin.hlx.page';
const params = new URLSearchParams(window.location.search);

function parseHost() {
  // e.g. main--milo--adobecom.aem.page  OR  branch--milo--adobecom.aem.page
  const [label] = window.location.hostname.split('.');
  const parts = label.split('--');
  if (parts.length === 3) {
    const [ref, repo, owner] = parts;
    return { ref, repo, owner };
  }
  return { ref: '', repo: '', owner: '' };
}

const host = parseHost();
const OWNER = params.get('owner') || host.owner;
const REPO = params.get('repo') || host.repo;
const REF = params.get('ref') || host.ref || 'main';
const PATH = params.get('path') || '/';
const CREDS = params.get('creds') === 'include' ? 'include' : 'same-origin';

const $ = (id) => document.getElementById(id);

function setText(id, value) {
  $(id).textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function statusUrl() {
  const path = PATH.startsWith('/') ? PATH : `/${PATH}`;
  return `${ADMIN}/status/${OWNER}/${REPO}/${REF}${path}?editUrl=auto`;
}

function renderSidekick() {
  const sk = document.querySelector('aem-sidekick, helix-sidekick');
  setText('sk', sk ? `present: <${sk.tagName.toLowerCase()}>` : 'NOT present — extension not detected on this page');
}

function renderVerdict({ httpStatus, body, threw }) {
  const verdict = $('verdict');
  const title = $('verdict-title');
  const signalsEl = $('signals');
  signalsEl.replaceChildren();

  if (threw) {
    verdict.className = 'verdict fail';
    title.textContent = `Fetch threw (likely CORS) — a page GET can't read the response: ${threw}`;
    return;
  }

  const profile = body && typeof body === 'object' ? body.profile : null;
  const rows = [
    ['HTTP status', String(httpStatus)],
    ['profile present', profile ? 'yes' : 'no'],
    ['profile.email', profile?.email ?? '(none)'],
    ['preview.permissions', body?.preview?.permissions ? JSON.stringify(body.preview.permissions) : '(none)'],
    ['live.permissions', body?.live?.permissions ? JSON.stringify(body.live.permissions) : '(none)'],
  ];
  rows.forEach(([label, value]) => {
    const l = document.createElement('div');
    l.textContent = label;
    const v = document.createElement('code');
    v.textContent = value;
    signalsEl.append(l, v);
  });

  if (profile?.email) {
    verdict.className = 'verdict pass';
    title.textContent = 'AUTHED: page-initiated GET received the injected token and a readable profile → single-GET refactor is viable.';
  } else if (httpStatus === 401 || httpStatus === 403) {
    verdict.className = 'verdict fail';
    title.textContent = `${httpStatus} — no profile. Sidekick not logged in, not ready for this project, or the token wasn't injected on a page fetch.`;
  } else {
    verdict.className = 'verdict unknown';
    title.textContent = `HTTP ${httpStatus} but no profile in the body — inspect the response below.`;
  }
}

async function runProbe() {
  renderSidekick(); // re-check now — the element mounts async after page load
  const url = statusUrl();
  setText('request', `GET ${url}\ncredentials: ${CREDS}`);
  setText('response', '(loading…)');

  if (!OWNER || !REPO) {
    setText('response', 'Cannot derive owner/repo from host — pass ?owner=&repo=&ref=.');
    renderVerdict({ httpStatus: 0, body: null });
    return;
  }

  try {
    const res = await fetch(url, { credentials: CREDS });
    let body;
    const text = await res.text();
    try { body = JSON.parse(text); } catch (e) { body = text; }
    setText('response', body);
    renderVerdict({ httpStatus: res.status, body });
  } catch (e) {
    setText('response', `threw: ${e.message}`);
    renderVerdict({ threw: e.message });
  }
}

function init() {
  $('cfg-owner').textContent = OWNER || '(unknown)';
  $('cfg-repo').textContent = REPO || '(unknown)';
  $('cfg-ref').textContent = REF;
  $('cfg-creds').textContent = CREDS;
  $('probe').addEventListener('click', runProbe);
  $('reload').addEventListener('click', () => window.location.reload());
  renderSidekick();
}

init();
