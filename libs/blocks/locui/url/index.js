import { getStatus, preview, publish } from '../utils/franklin.js';
import { setStatus } from '../utils/status.js';

const TIME_FORMAT = { hour12: false, hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };

function getPrettyDate(string) {
  if (!string) return ['Not available'];
  const rawDate = new Date(string);
  const date = rawDate.toLocaleDateString();
  const time = rawDate.toLocaleTimeString([], TIME_FORMAT);
  return [date, time];
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

export async function handleAction(e, item, isLive = false) {
  e.target.classList.add('locui-action-loading');
  const action = item.value[isLive ? 'live' : 'preview'];
  const url = new URL(action.url);
  try {
    if (isLive) await publish(url.pathname);
    else await preview(url.pathname);
    const details = await getDetails(item.value.path);
    item.value = { ...item.value, ...details };
    e.target.classList.remove('locui-action-loading');
    window.open(url, '_blank');
  } catch (error) {
    e.target.classList.remove('locui-action-loading');
    setStatus(
      'details',
      'error',
      `${isLive ? 'Publishing' : 'Previewing'} document`,
      'Sync to Langstore to perform this action',
      9000,
    );
  }
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
