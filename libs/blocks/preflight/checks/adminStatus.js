const CROSS_REPO_PREFIXES = [
  { prefix: '/federal/', owner: 'adobecom', repo: 'federal', branch: 'main' },
];

export function isCrossRepo(pathname) {
  return CROSS_REPO_PREFIXES.some(({ prefix }) => pathname.startsWith(prefix));
}

export function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function getAdminUrl(url, type) {
  const crossRepo = CROSS_REPO_PREFIXES.find(({ prefix }) => url.pathname.startsWith(prefix));
  let owner; let repo; let branch;
  if (crossRepo) {
    ({ owner, repo, branch } = crossRepo);
  } else if (isLocalHost(url.hostname)) {
    [branch, repo, owner] = ['main', 'milo', 'adobecom'];
  } else {
    if (!(/adobecom\.(hlx|aem)\./.test(url.hostname))) return false;
    [branch, repo, owner] = url.hostname.split('.')[0].split('--');
  }
  const base = `https://admin.hlx.page/${type}/${owner}/${repo}/${branch}${url.pathname}`;
  return type === 'status' ? `${base}?editUrl=auto` : base;
}

// The Admin API allows 10 requests/second per project, shared with Sidekick: each URL is
// fetched once per page load and at most MAX_ACTIVE calls run at a time.
const MAX_ACTIVE = 3;
const statusCache = new Map();
const waiting = [];
let active = 0;

function acquire() {
  if (active < MAX_ACTIVE) {
    active += 1;
    return Promise.resolve();
  }
  return new Promise((resolve) => { waiting.push(resolve); });
}

function release() {
  const next = waiting.shift();
  if (next) next();
  else active -= 1;
}

// Call after the author previews or publishes, so the next check sees the new state.
export function clearPageStatusCache() {
  statusCache.clear();
}

async function fetchPageStatus(adminUrl) {
  await acquire();
  try {
    // include: protected sites return 401 unless the author's Sidekick login cookie is sent.
    const resp = await fetch(adminUrl, { cache: 'no-store', credentials: 'include' });
    if (!resp.ok) return null;
    const json = await resp.json();
    const pick = (o) => ({
      lastModified: o?.lastModified || null,
      lastModifiedBy: o?.lastModifiedBy || null,
    });
    return { preview: pick(json.preview), live: pick(json.live) };
  } finally {
    release();
  }
}

export function getPageStatus(url) {
  const adminUrl = getAdminUrl(url, 'status');
  if (!adminUrl) return Promise.resolve(null);
  if (!statusCache.has(adminUrl)) {
    // Only successes are kept: a 401/429 or network error is retried on the next call.
    const forget = () => statusCache.delete(adminUrl);
    statusCache.set(adminUrl, fetchPageStatus(adminUrl).then(
      (status) => { if (!status) forget(); return status; },
      (e) => { forget(); throw e; },
    ));
  }
  return statusCache.get(adminUrl);
}
