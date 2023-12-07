import { getHostDetails } from './services.js';

const PROCESS_MAX = 1000;
const DEFAULT_PREFS = { height: 0 };
const PROCESS_TYPES = [
  'Preview',
  'Publish',
  'Unpublish',
  'Delete',
  'Index',
];

const userPrefs = (storeKey) => {
  const store = localStorage.getItem(storeKey);
  const prefs = store ? JSON.parse(store) : DEFAULT_PREFS;
  return {
    get: (key) => (prefs[key]),
    set: (key, value) => {
      prefs[key] = value;
      localStorage.setItem(storeKey, JSON.stringify(prefs));
    },
  };
};

const validUrl = (str) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  const [ref, repo, owner] = getHostDetails(url);
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

const selectOverage = (elem, paths) => {
  if (elem?.value) {
    const { value } = elem;
    const overage = paths.length - PROCESS_MAX;
    const selectable = paths.slice(-[overage]);
    const start = value.indexOf(selectable[0]);
    const end = value.indexOf(selectable[selectable.length]);
    elem.setSelectionRange(start, end);
    elem.focus();
  }
};

const panelSize = (textarea, header) => {
  const wrapper = document.querySelector('.bulk-publish');
  const prefs = userPrefs('bulk-pub-prefs');
  const heightPref = prefs.get('height');
  if (heightPref) {
    wrapper.style.setProperty('--panel-height', heightPref);
  }
  const resized = () => {
    const calc = 100 * ((textarea.offsetHeight + header.offsetHeight) / window.innerHeight);
    const newHeight = `${calc}vh`;
    if (wrapper.style.getPropertyValue('--panel-height') !== newHeight) {
      wrapper.style.setProperty('--panel-height', newHeight);
      prefs.set('height', newHeight);
    }
  };
  new MutationObserver(resized).observe(textarea, {
    attributes: true,
    attributeFilter: ['style'],
  });
};

const getError = (code) => {
  const codes = [400, 401, 403, 404];
  const errorText = [
    'Invalid URL',
    'Not authenticated',
    'Missing permissions',
    'Resource not found',
  ];
  return `- ${errorText[codes.indexOf(code)]}`;
};

const jobStatus = (status, state) => {
  const code = status;
  let text = 'Working';
  let color = text.toLowerCase();
  if (state === 'stopped') {
    text = status === 200 ? '- Completed' : getError(code);
    color = status === 200 ? 'success' : 'error';
  }
  return { code, text, color };
};

export {
  editEntry,
  PROCESS_MAX,
  PROCESS_TYPES,
  panelSize,
  selectOverage,
  jobStatus,
  validUrl,
};
