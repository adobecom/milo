const BASE_URL = 'https://admin.hlx.page';
const PROCESS_MAX = 1000;
const DEFAULT_PREFS = { height: 0 };
const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'Milo Bulk Publisher',
};
const PROCESS_TYPES = [
  'Preview',
  'Publish',
  'Unpublish',
  'Delete',
  'Index',
];

const getPrefered = (storeKey) => {
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

const getHostDetails = (url) => url.hostname.split('.')[0].split('--');

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
  const prefs = getPrefered('bulk-pub-prefs');
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

const getJobEp = (url, type) => {
  const [ref, repo, owner] = getHostDetails(url);
  return `${BASE_URL}/${type}/${owner}/${repo}/${ref}/*`;
};

const prepareJobs = (jobs) => {
  const { urls, process } = jobs;
  const all = urls.map((url) => (new URL(url)));
  return Object.values(all.reduce((newJobs, url) => {
    const job = {
      origin: url.origin,
      endpoint: getJobEp(url, process.toLowerCase()),
      body: { forceUpdate: true, paths: [] },
    };
    if (!newJobs[url.host]) newJobs[url.host] = job;
    newJobs[url.host].body.paths.push(url.pathname);
    return newJobs;
  }, {}));
};

const createJobs = async (jobs) => {
  const newJobs = prepareJobs(jobs);
  const requests = newJobs.flatMap(async ({ endpoint, body, origin }) => {
    const job = await fetch(endpoint, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    const result = await job.json();
    return { origin, endpoint, result };
  });
  const results = await Promise.all(requests);
  return results;
};

const wait = (delay = 5000) => new Promise((resolve) => {
  setTimeout(() => resolve(), delay);
});

const getJobStatus = async (link) => {
  await wait();
  const status = await fetch(link, { headers: HEADERS });
  const result = await status.json();
  return result;
};

const pollJobStatus = async ({ result }) => {
  let jobStatus;
  let stopped = false;
  while (!stopped) {
    const status = await getJobStatus(`${result.link.self}/details`);
    if (status.stopTime) {
      jobStatus = status;
      stopped = true;
    }
  }
  return jobStatus;
};

export {
  createJobs,
  editEntry,
  PROCESS_MAX,
  PROCESS_TYPES,
  panelSize,
  pollJobStatus,
  selectOverage,
  validUrl,
};
