import { getStatus } from '../utils/franklin.js';
import { urls, setStatus } from '../utils/state.js';

function getFileName(editUrl) {
  const url = new URL(editUrl);
  return url.searchParams.get('file');
}

async function getDetails(path) {
  setStatus('url', 'info', 'Getting URL details.');
  const json = await getStatus(path);
  setStatus('url');
  const filename = json.edit.url ? getFileName(json.edit.url) : undefined;
  return {
    preview: { url: json.preview.url, status: json.preview.status },
    edit: { url: json.edit.url, status: json.edit.status, filename },
    live: { url: json.live.url, status: json.live.status },
  };
}

export default async function setActions(idx) {
  if (!urls.value[idx].actions) {
    urls.value[idx].actions = await getDetails(urls.value[idx].pathname);
    urls.value[idx].langstore.actions = {};
    // urls.value[idx].langstore.actions = await getDetails(urls.value[idx].langstore.pathname);
    urls.value = [...urls.value];
  }
}
