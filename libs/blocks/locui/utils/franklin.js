const ADMIN = 'https://admin.hlx.page';

const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || 'adobecom';
const repo = urlParams.get('repo') || 'milo';
const ref = urlParams.get('ref') || 'main';
export const origin = `https://${ref}--${repo}--${owner}.hlx.page`;

export async function preview(path) {
  const url = `${ADMIN}/preview/${owner}/${repo}/${ref}${path}`;
  const resp = await fetch(url, { method: 'POST' });
  const json = await resp.json();
  return json;
}

export async function getStatus(path = '', editUrl = 'auto') {
  const resp = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}${path}?editUrl=${editUrl}`);
  const json = await resp.json();
  return json;
}
