import { SLD } from '../../../utils/utils.js';

const ADMIN = 'https://admin.hlx.page';
const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || 'adobecom';
const repo = urlParams.get('repo') || 'milo';
export const origin = `https://main--${repo}--${owner}.${SLD}.page`;

// Temporary fix until https://github.com/adobe/helix-admin/issues/2831 is fixed.
function fixPreviewDomain(json) {
  function switchPreviewDomain(from, to) {
    if (json?.preview?.url) {
      json.preview.url = json.preview.url.replace(from, to);
    }
    if (json?.live?.url) {
      json.live.url = json.live.url.replace(from, to);
    }
  }
  if (SLD === 'aem') {
    switchPreviewDomain('.hlx.', '.aem.');
  } else if (SLD === 'hlx') {
    switchPreviewDomain('.aem.', '.hlx.');
  }
}

export async function preview(path) {
  const url = `${ADMIN}/preview/${owner}/${repo}/main${path}`;
  const resp = await fetch(url, { method: 'POST' });
  const json = await resp.json();
  fixPreviewDomain(json);
  return json;
}

export async function getStatus(path = '', editUrl = 'auto') {
  let url = `${ADMIN}/status/${owner}/${repo}/main${path}`;
  url = editUrl ? `${url}?editUrl=${editUrl}` : url;
  const resp = await fetch(url, { cache: 'reload' });
  const json = await resp.json();
  fixPreviewDomain(json);
  return json;
}

export function validSLD(url) {
  return url.hostname.includes(`.${SLD}.`);
}

export function switchSLD(urlStr) {
  const url = new URL(urlStr);
  url.hostname = SLD === 'aem' ? url.hostname.replace('.aem.', '.hlx.') : url.hostname.replace('.hlx.', '.aem.');
  return url;
}
