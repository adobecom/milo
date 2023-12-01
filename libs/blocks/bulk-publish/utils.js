const MAX = 1000;
const TYPES = [
  'Preview',
  'Publish',
  'Preview & Publish',
  'Unpublish',
  'Delete',
  'Index',
];

const defaultPrefs = { height: 0 };

const preferences = (storeKey, prefsDefault) => {
  const store = localStorage.getItem(storeKey);
  const prefs = store ? JSON.parse(store) : prefsDefault;
  return {
    get: (key) => (prefs[key]),
    set: (key, value) => {
      prefs[key] = value;
      localStorage.setItem(storeKey, JSON.stringify(prefs));
    },
  };
};

const validPath = (str) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === 'https:';
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
    const overage = paths.length - MAX;
    const selectable = paths.slice(-[overage]);
    const start = value.indexOf(selectable[0]);
    const end = value.indexOf(selectable[selectable.length]);
    elem.setSelectionRange(start, end);
    elem.focus();
  }
};

const handlePanelSize = (textarea) => {
  const wrapper = document.querySelector('.bulk-publish');
  const prefs = preferences(defaultPrefs);
  const heightPref = prefs.get('height');
  if (heightPref) {
    wrapper.style.setProperty('--panel-height', heightPref);
  }
  const resized = () => {
    const calc = 100 * ((textarea.offsetHeight + 170) / window.innerHeight);
    const newHeight = `${Math.floor(calc)}vh`;
    if (wrapper.style.getPropertyValue('--panel-height') !== newHeight) {
      wrapper.style.setProperty('--panel-height', newHeight);
      prefs.set('height', newHeight);
    }
  };
  new MutationObserver(resized).observe(textarea, { attributes: true, attributeFilter: ['style'] });
};

const runBulkJob = async (data) => {
  const testSuccess = {
    status: 202,
    topic: data.type,
    name: `job-${new Date().getTime()}`,
    state: 'created',
    startTime: new Date().toLocaleDateString('en-US'),
    data: data.paths.map((path) => ({ path })),
  };
  return new Promise((resolve) => {
    setTimeout(() => resolve(testSuccess), 3000);
  });
};

export {
  editEntry,
  validPath,
  MAX,
  TYPES,
  runBulkJob,
  selectOverage,
  handlePanelSize,
};
