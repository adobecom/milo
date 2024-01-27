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

const delay = (timeout = 2000) => new Promise((resolve) => {
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

const getMiloUrl = (url) => url.hostname.split('.')[0].split('--');
const validMiloURL = (str) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  const [ref, repo, owner] = getMiloUrl(url);
  return url.protocol === 'https:' && ref && repo && owner;
};

const editEntry = (elem, str) => {
  if (elem?.value) {
    const { offsetTop, value, scrollHeight, clientHeight } = elem;
    const start = value.indexOf(str);
    const end = start + str.length;
    const position = offsetTop + (scrollHeight - clientHeight) * (start / value.length);
    elem.setSelectionRange(start, end);
    elem.focus();
    elem.scrollTop = position;
  }
};

const getJobErrorText = (errors, process) => {
  const [message] = errors.messages;
  let text = message;
  if (['unpublish', 'delete'].includes(process) && message === 'Forbidden') {
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

const displayDate = (newDate) => {
  const date = new Date(newDate);
  const today = new Date();
  const isToday = date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear();
  return isToday ? date.toLocaleTimeString() : date.toLocaleString().replace(',', '');
};

const processJobResult = (jobs) => jobs.reduce((result, job) => {
  result[!job.error ? 'complete' : 'error'].push(job);
  return result;
}, { complete: [], error: [] });

export {
  displayDate,
  editEntry,
  FORM_MODES,
  getErrorText,
  getJobErrorText,
  getMiloUrl,
  PROCESS_TYPES,
  processJobResult,
  getStatusText,
  sticky,
  validMiloURL,
  delay,
};
