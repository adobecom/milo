import { getStatus } from '../utils/franklin.js';
import { urls, setStatus } from '../utils/state.js';

async function getDetails(path) {
  setStatus('url', 'info', 'Getting URL details.');
  const json = await getStatus(path);
  setStatus('url');
  return {
    preview: { url: json.preview.url, status: json.preview.status },
    edit: { url: json.edit.url, status: json.edit.status },
    live: { url: json.live.url, status: json.live.status },
  };
}

export default async function setActions(idx) {
  if (!urls.value[idx].actions) {
    urls.value[idx].actions = await getDetails(urls.value[idx].pathname);
    urls.value[idx].langstore.actions = await getDetails(urls.value[idx].langstore.pathname);
    urls.value = [...urls.value];
  }
}
