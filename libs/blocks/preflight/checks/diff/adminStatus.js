const CROSS_REPO_PREFIXES = [
  { prefix: '/federal/', owner: 'adobecom', repo: 'federal', branch: 'main' },
];

export function getAdminUrl(url, type) {
  const crossRepo = CROSS_REPO_PREFIXES.find(({ prefix }) => url.pathname.startsWith(prefix));
  let owner; let repo; let branch;
  if (crossRepo) {
    ({ owner, repo, branch } = crossRepo);
  } else {
    if (!(/adobecom\.(hlx|aem)./.test(url.hostname))) return false;
    const project = url.hostname === 'localhost' ? 'main--milo--adobecom' : url.hostname.split('.')[0];
    [branch, repo, owner] = project.split('--');
  }
  const base = `https://admin.hlx.page/${type}/${owner}/${repo}/${branch}${url.pathname}`;
  return type === 'status' ? `${base}?editUrl=auto` : base;
}

export async function getPageStatus(url) {
  const adminUrl = getAdminUrl(url, 'status');
  if (!adminUrl) return null;
  const resp = await fetch(adminUrl);
  if (!resp.ok) return null;
  const json = await resp.json();
  const pick = (o) => ({
    lastModified: o?.lastModified || null,
    lastModifiedBy: o?.lastModifiedBy || null,
  });
  return { preview: pick(json.preview), live: pick(json.live) };
}
