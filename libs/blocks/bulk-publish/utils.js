// TODO Remove testing
import { testJob, testStatus } from './testing.js';

const BASE_URL = 'https://admin.hlx.page';
const DEFAULT_PREFS = { height: 0 };
const MAX = 1000;
const TYPES = [
  'Preview',
  'Publish',
  'Unpublish',
  'Delete',
  'Index',
];

const prefered = (storeKey) => {
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

const validPath = (str) => {
  let validUrl;
  try {
    validUrl = new URL(str);
  } catch (_) {
    return false;
  }
  return validUrl.protocol === 'https:';
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

const panelSize = (textarea, header) => {
  const wrapper = document.querySelector('.bulk-publish');
  const prefs = prefered('bulk-pub-prefs');
  const heightPref = prefs.get('height');
  if (heightPref) {
    wrapper.style.setProperty('--panel-height', heightPref);
  }
  const resized = () => {
    // get virtual height
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
  const [ref, repo, owner] = url.hostname.split('.')[0].split('--');
  return `${BASE_URL}/${type}/${owner}/${repo}/${ref}/*`;
};

const prepJobs = (process, urls) => {
  const urlList = urls.map((url) => (new URL(url)));
  return Object.values(urlList.reduce((jobs, url) => {
    // shape some job request payload
    const job = {
      endpoint: getJobEp(url, process.toLowerCase()),
      origin: url.origin,
      body: {
        forceUpdate: true,
        paths: [],
      },
    };
    if (!jobs[url.host]) jobs[url.host] = job;
    jobs[url.host].body.paths.push(url.pathname);
    return jobs;
  }, {}));
};

const createJobs = async (process, urls) => {
  const groups = prepJobs(process, urls);
  const jobs = groups.flatMap(async ({ endpoint, body, origin }) => {
    // const batch = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'User-Agent': 'Milo Bulk Publisher',
    //   },
    //   body: JSON.stringify(body),
    // });
    // const json = await batch.json();
    const result = await testJob(process, body.paths);
    return { origin, endpoint, result };
  });

  const results = await Promise.all(jobs);
  return results;
};

const wait = (delay = 5000) => new Promise((resolve) => { setTimeout(() => resolve(), delay); });
const getJobStatus = async (link, paths) => {
  await wait();
  // const status = await fetch(link, {
  //   headers: {
  //     Accept: 'application/json',
  //     'User-Agent': 'Milo Bulk Publisher',
  //   },
  // });
  // const result = await status.json();
  const result = await testStatus(paths, link);
  return result;
};

const pollJobStatus = async ({ result }) => {
  let status;
  let finished = false;
  while (!finished) {
    const details = await getJobStatus(`${result.links.self}/details`, result.job.data.paths);
    if (details.stopTime) {
      status = details;
      finished = true;
    }
  }
  return status;
};

export {
  editEntry,
  validPath,
  MAX,
  TYPES,
  createJobs,
  selectOverage,
  panelSize,
  pollJobStatus,
};
