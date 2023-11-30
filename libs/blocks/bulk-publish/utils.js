const MAX = 1000;
const TYPES = [
  'Preview',
  'Publish',
  'Preview & Publish',
  'Unpublish',
  'Delete',
  'Index',
];

const preferences = () => {
  const store = localStorage.getItem('bulk-pub-user-prefs');
  const prefs = store ? JSON.parse(store) : { height: 0 };
  return {
    get: (key) => (prefs[key]),
    set: (key, value) => {
      prefs[key] = value;
      localStorage.setItem('bulk-pub-user-prefs', JSON.stringify(prefs));
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

const runBulkJob = async (data) => {
  const testSuccess = {
    status: 202,
    name: `job-${new Date().getTime()}`,
    state: 'created',
    startTime: new Date().toLocaleDateString('en-US'),
    data: data.paths.map((path) => ({ path })),
  };
  return new Promise((resolve) => {
    setTimeout(() => resolve(testSuccess), 3000);
  });
};

const handleResize = (textarea) => {
  const wrapper = document.querySelector('.bulk-publish');
  const prefs = preferences();
  if (prefs.get('height')) {
    wrapper.style.setProperty('--panel-height', prefs.get('height'));
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

export {
  editEntry,
  validPath,
  MAX,
  TYPES,
  runBulkJob,
  selectOverage,
  handleResize,
};
