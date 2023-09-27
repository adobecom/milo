import { getStatus } from '../utils/franklin.js';
import { urls } from '../utils/state.js';
import { setStatus } from '../utils/status.js';

function getFileName(editUrl) {
  const url = new URL(editUrl);
  return url.searchParams.get('file');
}

async function getDetails(path) {
  const json = await getStatus(path, false);
  const filename = json.edit.url ? getFileName(json.edit.url) : undefined;
  return {
    preview: { url: json.preview.url, status: json.preview.status },
    edit: { url: json.edit.url, status: json.edit.status, filename },
    live: { url: json.live.url, status: json.live.status },
  };
}

export async function openWord(e, parent) {
  e.target.classList.add('locui-action-loading');
  const details = await getStatus(parent.pathname);
  e.target.classList.remove('locui-action-loading');
  if (details.edit.url) window.open(details.edit.url, '_blank');
}

export async function setActions(idx) {
  if (!urls.value[idx].actions) {
    urls.value[idx].actions = await getDetails(urls.value[idx].pathname);
    if (urls.value[idx].langstore) {
      urls.value[idx].langstore.actions = {};
      urls.value[idx].langstore.actions = await getDetails(urls.value[idx].langstore.pathname);
    }
    urls.value = [...urls.value];
  }
}
