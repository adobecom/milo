import { getHostDetails, wait } from './services.js';

const DISABLE_MODE = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const FORM_MODES = ['full', 'half'];
const PROCESS_MAX = 1000;
const PREFS_KEY = 'bulk-pub-prefs';
const DEFAULT_PREFS = { height: 0, mode: FORM_MODES[DISABLE_MODE ? 1 : 0] };
const PROCESS_TYPES = [
  'Preview',
  'Delete',
  'Publish',
  'Unpublish',
  'Index',
  'Deindex',
];

const userPrefs = () => {
  const store = localStorage.getItem(PREFS_KEY);
  const prefs = store ? JSON.parse(store) : DEFAULT_PREFS;
  return {
    get: (key) => (prefs[key] ?? DEFAULT_PREFS[key]),
    set: (key, value) => {
      prefs[key] = value;
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
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

const tappedResize = (e) => {
  const { target, clientX, clientY } = e;
  const rect = target.getBoundingClientRect();
  const x = target.offsetWidth - (clientX - (rect.left - 13));
  const y = target.offsetHeight - (clientY - (rect.top - 10));
  return x < 10 && y < 10;
};

const panelSize = async (root) => {
  await wait(0);
  const block = document.querySelector('.bulk-publish');
  const header = root.getElementById('Header');
  const textarea = root.getElementById('Urls');
  const heightPref = userPrefs().get('height');
  if (heightPref) {
    block.style.setProperty('--panel-height', heightPref);
  }
  const resized = async (entries) => {
    for (const entry of entries) {
      if (entry.target.id === 'Urls') {
        const prefs = userPrefs();
        const sized = entry.target;
        const newSize = ((sized.offsetHeight + header.offsetHeight) / block.offsetHeight) * 100;
        const newHeight = `${newSize}vh`;
        if (block.style.getPropertyValue('--panel-height') !== newHeight) {
          block.style.setProperty('--panel-height', newHeight);
          prefs.set('height', newHeight);
        }
      }
    }
  };
  const observer = new ResizeObserver(resized);
  textarea?.addEventListener('mousedown', (e) => {
    if (tappedResize(e)) observer.observe(textarea);
  });
  block.addEventListener('mouseup', () => {
    if (textarea) observer.unobserve(textarea);
    else observer.disconnect();
  });
};

const getError = (code) => {
  const codes = [400, 401, 403, 404, 503];
  const errorText = [
    'Invalid URL',
    'Not authenticated',
    'Missing permissions',
    'Resource not found',
    'Request Timed Out',
  ];
  return errorText[codes.indexOf(code)];
};

const jobStatus = (status, state, count) => {
  let code = status;
  let text = 'Working';
  let color = text.toLowerCase();
  if (state === 'queued') {
    text = `${count}/3 Retry`;
    code = null;
  }
  if (state === 'stopped') {
    text = status === 200 ? 'Completed' : getError(code);
    color = status === 200 ? 'success' : 'error';
  }
  return { code, text, color };
};

export {
  editEntry,
  FORM_MODES,
  DISABLE_MODE,
  PROCESS_MAX,
  PROCESS_TYPES,
  panelSize,
  selectOverage,
  jobStatus,
  userPrefs,
  validUrl,
};
