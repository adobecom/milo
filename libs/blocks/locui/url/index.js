import { getStatus } from '../utils/franklin.js';

function getPrettyDate(string) {
  if (!string) return ['Not available'];
  const rawDate = new Date(string);
  rawDate.setSeconds(0, 0);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString([], { hour12: false });
  return [date, `${time} GMT`];
}

export function handleAction(url) {
  window.open(url, '_blank');
}

async function getDetails(path) {
  const json = await getStatus(path, false);
  return {
    preview: {
      url: json.preview.url,
      status: json.preview.status,
      modified: getPrettyDate(json.preview.lastModified),
    },
    edit: {
      url: json.edit.url,
      status: json.edit.status,
      modified: getPrettyDate(json.preview.sourceLastModified),
    },
    live: {
      url: json.live.url,
      status: json.live.status,
      modified: getPrettyDate(json.live.lastModified),
    },
  };
}

export async function openWord(e, parent) {
  e.target.classList.add('locui-action-loading');
  const details = await getStatus(parent.pathname);
  e.target.classList.remove('locui-action-loading');
  if (details.edit.url) window.open(details.edit.url, '_blank');
}

export async function setActions(item) {
  item.value = await getDetails(item.value.path);
}
