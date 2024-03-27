import { createTag } from '../../utils/utils.js';

const PREFS = 'bulk-pub-prefs';
const FORM_MODES = ['full', 'half'];
const DEFAULT_PREFS = { mode: FORM_MODES[0], resume: [] };
const PROCESS_TYPES = [
  'preview',
  'publish',
  'unpublish',
  'delete',
  'index',
];

const isDelete = (type) => ['delete', 'unpublish'].includes(type);

const delay = (timeout = 3000) => new Promise((resolve) => {
  setTimeout(() => resolve(), timeout);
});

const sticky = () => {
  const store = localStorage.getItem(PREFS);
  const prefs = store ? JSON.parse(store) : DEFAULT_PREFS;
  return {
    get: (key) => (prefs[key] ?? DEFAULT_PREFS[key]),
    set: (key, value) => {
      prefs[key] = value;
      localStorage.setItem(PREFS, JSON.stringify(prefs));
    },
  };
};

const getAemUrl = (url) => url.hostname.split('.')[0].split('--');
const isValidUrl = (str) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  const [ref, repo, owner] = getAemUrl(url);
  return url.protocol === 'https:' && ref && repo && owner;
};

const editEntry = (el, str) => {
  if (el?.value) {
    const { offsetTop, value, scrollHeight, clientHeight } = el;
    const start = value.indexOf(str);
    const end = start + str.length;
    const position = offsetTop + (scrollHeight - clientHeight) * (start / value.length);
    el.setSelectionRange(start, end);
    el.focus();
    el.scrollTop = position;
  }
};

const frisk = (permissions, action) => !!permissions?.includes(action);

const getJobErrorText = (errors, process) => {
  const [message] = errors.messages;
  let text = message;
  if (['unpublish', 'delete'].includes(process) && message === 'Forbidden') {
    /* c8 ignore next 2 */
    text = `Failed to ${process} - has the SharePoint document been deleted?`;
  }
  return text;
};

const getErrorText = (code) => {
  const codes = [400, 401, 403, 404, 503, 414];
  const errorText = [
    'Invalid URL',
    'Unauthorized',
    'Forbidden',
    'Not Found',
    'Timed Out',
    'Request-URI Too Long',
  ];
  return errorText[codes.indexOf(code)];
};

const getStatusText = (status, state, count) => {
  let code = status;
  let text = 'Working';
  let color = text.toLowerCase();
  if (state === 'queued') {
    text = `${count}/3 Retry`;
    code = null;
  }
  if (code && code !== 0) {
    const success = status === 200 || status === 204;
    if (success) {
      text = 'Completed';
      color = 'success';
    } else {
      text = getErrorText(code);
      color = 'error';
    }
  }
  return { code, text, color };
};

/* c8 ignore next 16 */
const updateItemProgress = (detail, tool) => {
  const resources = detail.data?.resources?.filter((res) => res.status !== 0);
  if (resources) {
    resources.forEach(({ path, status }) => {
      const item = tool.renderRoot.querySelector(`[job-item='${path}']`);
      if (item && !item?.hasAttribute('updated')) {
        const { text, color } = getStatusText(status, null);
        const newStatus = createTag('span', { class: `status ${color}` }, text);
        const display = item.querySelector('.status');
        display.insertAdjacentElement('afterend', newStatus);
        display.setAttribute('has-update', '');
        item.setAttribute('updated', '');
      }
    });
  }
};

const displayDate = (newDate) => {
  const date = new Date(newDate);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday ? date.toLocaleTimeString() : date.toLocaleString().replace(',', '');
};

const processJobResult = (jobs) => jobs.reduce((result, job) => {
  result[!job.error ? 'complete' : 'error'].push(job);
  return result;
}, { complete: [], error: [] });

const getProcessedCount = (jobs) => jobs.reduce((count, { progress }) => {
  const processed = progress?.processed ?? 0;
  return count + processed;
}, 0);

export {
  frisk,
  displayDate,
  editEntry,
  FORM_MODES,
  getErrorText,
  getJobErrorText,
  getAemUrl,
  getProcessedCount,
  isDelete,
  PROCESS_TYPES,
  processJobResult,
  getStatusText,
  updateItemProgress,
  sticky,
  isValidUrl,
  delay,
};
