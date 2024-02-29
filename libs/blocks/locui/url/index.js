import { getStatus } from '../utils/franklin.js';

const TIME_FORMAT = { hour12: false, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };

function getPrettyDate(string) {
  if (!string) return ['Not available'];
  const rawDate = new Date(string);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString([], TIME_FORMAT);
  return [date, time];
}

export async function handleAction(url, sync = false) {
  if (sync) {
    console.log('sync to franklin', url);
  }
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

export async function openWord(e, item) {
  e.target.classList.add('locui-action-loading');
  const details = await getStatus(item.value.path);
  e.target.classList.remove('locui-action-loading');
  if (details.edit.url) window.open(details.edit.url, '_blank');
}

export async function setActions(item) {
  const details = await getDetails(item.value.path);
  item.value = { ...item.value, ...details };
}
