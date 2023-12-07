const BASE_URL = 'https://admin.hlx.page';
const USES_BULK = ['preview', 'publish', 'delete'];
const USES_LIVE = ['publish', 'unpublish', 'delete'];
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'Milo Bulk Publisher',
};

const getHostDetails = (url) => url.hostname.split('.')[0].split('--');
const getJobEp = (url, type) => {
  const useBulk = USES_BULK.includes(type);
  const [ref, repo, owner] = getHostDetails(url);
  const process = USES_LIVE.includes(type) ? 'live' : type;
  const path = useBulk ? '/*' : url.pathname;
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}${path}`;
};

const prepareJobs = (jobs) => {
  const all = jobs.urls.map((url) => (new URL(url)));
  return all.map((url) => ({
    origin: url.origin,
    endpoint: getJobEp(url, jobs.process),
    options: {
      method: jobs.process === 'unpublish' ? 'DELETE' : 'POST',
      headers,
    },
  }));
};

const prepareBulkJobs = (jobs) => {
  const { urls, process } = jobs;
  const all = urls.map((url) => (new URL(url)));
  return Object.values(all.reduce((newJobs, url) => {
    const isDelete = process === 'delete';
    const job = {
      origin: url.origin,
      endpoint: getJobEp(url, process),
      options: {
        method: isDelete ? 'DELETE' : 'POST',
        headers,
        body: { paths: [] },
      },
    };
    if (!newJobs[url.host]) newJobs[url.host] = job;
    if (!isDelete) newJobs[url.host].options.body.forceUpdate = true;
    newJobs[url.host].options.body.paths.push(url.pathname);
    return newJobs;
  }, {}));
};

const createJobs = async (jobs) => {
  const useBulk = USES_BULK.includes(jobs.process);
  const newJobs = useBulk ? prepareBulkJobs(jobs) : prepareJobs(jobs);
  const requests = newJobs.flatMap(async ({ endpoint, options, origin }) => {
    if (options.body) options.body = JSON.stringify(options.body);
    const job = await fetch(endpoint, options);
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
  const status = await fetch(link, { headers });
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
  getHostDetails,
  createJobs,
  pollJobStatus,
};
