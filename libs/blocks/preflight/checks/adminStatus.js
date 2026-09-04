const CROSS_REPO_PREFIXES = [
  { prefix: '/federal/', owner: 'adobecom', repo: 'federal', branch: 'main' },
];

export function isCrossRepo(pathname) {
  return CROSS_REPO_PREFIXES.some(({ prefix }) => pathname.startsWith(prefix));
}

export function getAdminUrl(url, type) {
  const crossRepo = CROSS_REPO_PREFIXES.find(({ prefix }) => url.pathname.startsWith(prefix));
  let owner; let repo; let branch;
  if (crossRepo) {
    ({ owner, repo, branch } = crossRepo);
  } else if (url.hostname === 'localhost') {
    [branch, repo, owner] = ['main', 'milo', 'adobecom'];
  } else {
    if (!(/adobecom\.(hlx|aem)\./.test(url.hostname))) return false;
    [branch, repo, owner] = url.hostname.split('.')[0].split('--');
  }
  const base = `https://admin.hlx.page/${type}/${owner}/${repo}/${branch}${url.pathname}`;
  return type === 'status' ? `${base}?editUrl=auto` : base;
}

export async function getPageStatus(url) {
  const adminUrl = getAdminUrl(url, 'status');
  if (!adminUrl) return null;
  // no-store: the skip / new-page decision depends on current publish state, not a cached one.
  const resp = await fetch(adminUrl, { cache: 'no-store' });
  if (!resp.ok) return null;
  const json = await resp.json();
  const pick = (o) => ({
    lastModified: o?.lastModified || null,
    lastModifiedBy: o?.lastModifiedBy || null,
  });
  return { preview: pick(json.preview), live: pick(json.live) };
}
