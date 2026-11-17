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

const MS_BETWEEN_ADMIN_CALLS = 125;
const DEFAULT_RETRY_AFTER_SECONDS = 1;
const MAX_RETRY_AFTER_SECONDS = 5;
const statusCache = new Map();
let nextCallAt = 0;

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

function waitForTurn() {
  const now = Date.now();
  const startAt = Math.max(now, nextCallAt);
  nextCallAt = startAt + MS_BETWEEN_ADMIN_CALLS;
  return wait(startAt - now);
}

function retryAfterMs(resp) {
  const seconds = parseFloat(resp.headers?.get('retry-after'));
  const waitSeconds = seconds >= 0 ? seconds : DEFAULT_RETRY_AFTER_SECONDS;
  return Math.min(waitSeconds, MAX_RETRY_AFTER_SECONDS) * 1000;
}

export function clearPageStatusCache() {
  statusCache.clear();
}

async function fetchPageStatus(adminUrl, { retryIfRateLimited = true } = {}) {
  await waitForTurn();
  const resp = await fetch(adminUrl, { cache: 'no-store', credentials: 'include' });
  if (resp.status === 429 && retryIfRateLimited) {
    await wait(retryAfterMs(resp));
    return fetchPageStatus(adminUrl, { retryIfRateLimited: false });
  }
  if (!resp.ok) return null;
  const json = await resp.json();
  const pick = (o) => ({
    lastModified: o?.lastModified || null,
    lastModifiedBy: o?.lastModifiedBy || null,
  });
  return { preview: pick(json.preview), live: pick(json.live) };
}

function cacheSuccessfulStatus(adminUrl, request) {
  const forget = () => {
    if (statusCache.get(adminUrl) === request) statusCache.delete(adminUrl);
  };
  request.then((status) => status || forget(), forget);
  statusCache.set(adminUrl, request);
}

export function getPageStatus(url) {
  const adminUrl = getAdminUrl(url, 'status');
  if (!adminUrl) return Promise.resolve(null);
  if (!statusCache.has(adminUrl)) cacheSuccessfulStatus(adminUrl, fetchPageStatus(adminUrl));
  return statusCache.get(adminUrl);
}
