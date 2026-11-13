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

const MAX_CONCURRENT_ADMIN_CALLS = 3;
const statusCache = new Map();
const waiting = [];
let active = 0;

function acquire() {
  if (active < MAX_CONCURRENT_ADMIN_CALLS) {
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

export function clearPageStatusCache() {
  statusCache.clear();
}

async function fetchPageStatus(adminUrl) {
  await acquire();
  try {
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

function cacheSuccessfulStatus(adminUrl, request) {
  const forget = () => statusCache.delete(adminUrl);
  request.then((status) => status || forget(), forget);
  statusCache.set(adminUrl, request);
}

export function getPageStatus(url) {
  const adminUrl = getAdminUrl(url, 'status');
  if (!adminUrl) return Promise.resolve(null);
  if (!statusCache.has(adminUrl)) cacheSuccessfulStatus(adminUrl, fetchPageStatus(adminUrl));
  return statusCache.get(adminUrl);
}
