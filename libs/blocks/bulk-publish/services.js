const BASE_URL = 'https://admin.hlx.page';
const USES_BULK = ['preview', 'publish', 'unpublish', 'delete'];

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const isLive = (type) => (['publish', 'unpublish'].includes(type) ? 'live' : null);
const isIndex = (type) => (['index', 'deindex'].includes(type) ? 'index' : null);
const getHostDetails = (url) => url.hostname.split('.')[0].split('--');

const getProcessEp = (url, type) => {
  const [ref, repo, owner] = getHostDetails(url);
  const process = isLive(type) ?? isIndex(type) ?? 'preview';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}${url.pathname}`;
};

const getBulkJobEp = (url, type) => {
  const [ref, repo, owner] = getHostDetails(url);
  const process = isLive(type) ?? 'preview';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}/*`;
};

const prepareProcesses = (jobs) => {
  const all = jobs.urls.map((url) => (new URL(url)));
  return all.map((url) => ({
    origin: url.origin,
    endpoint: getProcessEp(url, jobs.process),
    options: {
      headers,
      method: ['unpublish', 'delete', 'deindex'].includes(jobs.process) ? 'DELETE' : 'POST',
    },
  }));
};

const prepareBulkJobs = (jobs) => {
  const { urls, process } = jobs;
  const all = urls.map((url) => (new URL(url)));
  return Object.values(all.reduce((newJobs, url) => {
    const isDelete = process === 'delete' || process === 'unpublish';
    const job = {
      origin: url.origin,
      endpoint: getBulkJobEp(url, process),
      options: {
        headers,
        method: isDelete ? 'DELETE' : 'POST',
        body: { paths: [] },
      },
    };
    if (!newJobs[url.host]) {
      newJobs[url.host] = job;
    }
    if (!isDelete) {
      newJobs[url.host].options.body.forceUpdate = true;
    }
    newJobs[url.host].options.body.paths.push(url.pathname);
    return newJobs;
  }, {}));
};

const createJobs = async (jobs) => {
  const useBulk = USES_BULK.includes(jobs.process);
  const newJobs = useBulk ? prepareBulkJobs(jobs) : prepareProcesses(jobs);
  const requests = newJobs.flatMap(async ({ endpoint, options, origin }) => {
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
    try {
      const job = await fetch(endpoint, options);
      if (!job.ok) throw new Error('Job Failed', { cause: job.status }, origin);
      const result = await job.json();
      return { origin, result };
    } catch (error) {
      return { origin, error: error.cause, message: error.message };
    }
  });
  const results = await Promise.all(requests);
  return results;
};

const wait = (delay = 5000) => new Promise((resolve) => {
  setTimeout(() => resolve(), delay);
});

const getStatus = async (link) => {
  await wait();
  try {
    const status = await fetch(link, { headers });
    const result = await status.json();
    return result;
  } catch (error) {
    return error;
  }
};

const pollJobStatus = async ({ result }) => {
  let jobStatus;
  let stopped = false;
  while (!stopped) {
    const status = await getStatus(`${result.link.self}/details`);
    if (status.stopTime) {
      jobStatus = status;
      stopped = true;
    }
  }
  return jobStatus;
};

const processRetryQueue = async ({ queue, urls, process }) => {
  const prepped = prepareProcesses({ urls, process });
  const processes = prepped.flatMap(async ({ endpoint, options, origin }) => {
    try {
      const job = await fetch(endpoint, options);
      if (!job.ok) {
        throw new Error('Process Failed', { cause: job.status }, origin);
      }
      const result = await job.json();
      return { origin, result };
    } catch (error) {
      return { origin, result: { status: error.cause } };
    }
  });
  const statuses = await Promise.all(processes);
  const updateQueue = queue.map((item, index) => {
    const newStatus = statuses.find((status) => status.origin === urls[index]);
    const count = item.count + 1;
    return { ...item, status: newStatus?.result ?? item.status, count };
  });
  return updateQueue;
};

export {
  getHostDetails,
  createJobs,
  pollJobStatus,
  processRetryQueue,
  wait,
};
