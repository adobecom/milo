import { getStatus } from '../../locui/utils/franklin.js';
import { fgColor } from '../utils/state.js';

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

async function getDetails(path, suffix) {
  const json = await (suffix === 'source' ? getStatus(path) : getStatus(path, 'auto', true, fgColor));
  return {
    preview: {
      url: json.preview.url,
      status: json.preview.status,
      modified: getPrettyDate(json.preview.lastModified),
    },
    edit: {
      url: json.edit.url,
      status: json.edit.status,
      modified: getPrettyDate(json.edit.lastModified),
    },
    live: {
      url: json.live.url,
      status: json.live.status,
      modified: getPrettyDate(json.live.lastModified),
    },
  };
}

export async function openWord(e, parent, suffix) {
  e.target.classList.add('fgui-action-loading');
  const details = await (suffix === 'source' ? getStatus(parent.value.path) : getStatus(parent.value.path, 'auto', true, fgColor));
  e.target.classList.remove('fgui-action-loading');
  if (details.edit.url) window.open(details.edit.url, '_blank');
}

export async function setActions(item, suffix, idx) {
  const details = await getDetails(item.value.path, suffix);
  item.value = { ...item.value, ...details, idx };
}
