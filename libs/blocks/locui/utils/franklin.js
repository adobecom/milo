const ADMIN = 'https://admin.hlx.page';

const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || 'adobecom';
const repo = urlParams.get('repo') || 'milo';
export const origin = `https://main--${repo}--${owner}.hlx.page`;

export async function preview(path) {
  const url = `${ADMIN}/preview/${owner}/${repo}/main${path}`;
  const resp = await fetch(url, { method: 'POST' });
  const json = await resp.json();
  return json;
}

export async function publish(path) {
  const url = `${ADMIN}/preview/${owner}/${repo}/main${path}`;
  const resp = await fetch(url, { method: 'POST' });
  const json = await resp.json();
  return json;
}

export async function getStatus(path = '', editUrl = 'auto') {
  let url = `${ADMIN}/status/${owner}/${repo}/main${path}`;
  url = editUrl ? `${url}?editUrl=${editUrl}` : url;
  const resp = await fetch(url, { cache: 'reload' });
  const json = await resp.json();
  return json;
}
