import { PROCESS_TYPES, getErrorText, getMiloUrl, delay } from './utils.js';

const BASE_URL = 'https://admin.hlx.page';
const headers = { 'Content-Type': 'application/json' };

const isLive = (type) => ['publish', 'unpublish'].includes(type);
const isDelete = (type) => ['delete', 'unpublish'].includes(type);
const getProcess = (type) => {
  if (type === 'index') return type;
  if (isLive(type)) return 'live';
  return 'preview';
};

const writeEP = (url, type, usePath = false) => {
  const [ref, repo, owner] = getMiloUrl(url);
  const process = getProcess(type);
  const path = usePath ? url.pathname : '/*';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}${path}`;
};

const createAEMRequest = (url, process, isBulk = true) => {
  const useDelete = isDelete(process);
  const href = isBulk ? [url.href] : url.href;
  const endpoint = writeEP(url, process, !isBulk);
  const options = { headers, method: useDelete ? 'DELETE' : 'POST', body: {} };
  if (isBulk) options.body = { paths: [] };
  return {
    href,
    options,
    path: url.pathname,
    origin: url.origin,
    endpoint,
  };
};

const connectSidekick = (bulkPub) => {
  const setStatus = (event) => {
    const processes = event?.detail?.data;
    if (processes) {
      const profile = processes.profile ?? null;
      const permissions = {};
      PROCESS_TYPES.forEach((key) => {
        // index.permissions does not exist in processes returned from sidekick event even though
        // I can see the permissions in the documentation
        if (key !== 'index') {
          const process = isLive(key) ? 'live' : 'preview';
          permissions[key] = !!processes[process].permissions?.includes('list');
        }
      });
      bulkPub.user = { profile, permissions };
    }
  };
  document.addEventListener('sidekick-ready', () => {
    const sidekick = document.querySelector('helix-sidekick');
    sidekick.addEventListener('statusfetched', setStatus);
  }, { once: true });
};

const mapJobList = ({ urls, process }) => {
  const all = urls.map((url) => (new URL(url)));
  return all.map((url) => (createAEMRequest(url, process, false)));
};

const createJobs = (details, useBulk) => {
  if (!useBulk) return mapJobList(details);
  const { urls, process } = details;
  const paths = urls.map((url) => (new URL(url)));
  return Object.values(paths.reduce((jobs, url) => {
    let base = url.host;
    // groups of 100 for users without 'list' permission
    while (!details.hasPermission && jobs[base]?.options.body.paths.length >= 100) {
      base = `${base}+`;
    }
    if (!jobs[base]) jobs[base] = createAEMRequest(url, process);
    const job = jobs[base];
    if (isDelete(process)) {
      const param = job.endpoint.includes('?') ? '&' : '?';
      job.endpoint = `${job.endpoint}${param}paths[]=${url.pathname}`;
    } else {
      job.options.body.paths.push(url.pathname.toLowerCase());
    }
    job.href.push(url.href);
    return jobs;
  }, {}));
};

const formatResult = ({ status }, job) => {
  const paths = job.urls.map((url) => (new URL(url).pathname));
  return {
    job: {
      topic: job.process,
      state: 'stopped',
      stopTime: new Date(),
      data: { paths, resources: paths.map((path) => ({ path, status })) },
      progress: { failed: [200, 204].includes(status) ? 0 : 1 },
    },
  };
};

const startJobProcess = async (details) => {
  const { process } = details;
  const useBulk = process !== 'index';
  const jobs = createJobs(details, useBulk);
  const requests = jobs.flatMap(async (job) => {
    const { options, origin, endpoint } = job;
    if (!isDelete(process)) options.body.forceUpdate = true;
    options.body = JSON.stringify(options.body ?? {});
    try {
      const request = await fetch(endpoint, options);
      if (!request.ok && useBulk) {
        throw new Error(getErrorText(request.status), request, origin);
      }
      const result = useBulk ? await request.json() : formatResult(request, details);
      return { ...job, result, useBulk };
    } catch (error) {
      return {
        ...job,
        error: error.status ?? 400,
        message: error.message,
      };
    }
  });
  const results = await Promise.all(requests);
  return results;
};

const fetchStatus = async (link) => {
  await delay();
  try {
    const status = await fetch(link, { headers });
    const result = await status.json();
    return result;
  } catch (error) {
    return error;
  }
};

const pollJobStatus = async (job, setProgress) => {
  const { result } = job;
  let jobStatus;
  let stopped = false;
  while (!stopped) {
    const status = await fetchStatus(`${result.links.self}/details`);
    setProgress(status);
    if (status.stopTime) {
      jobStatus = status;
      stopped = true;
    }
  }
  return jobStatus;
};

const updateRetryQueue = async ({ queue, urls, process }) => {
  const jobs = mapJobList({ urls, process });
  const processes = jobs.flatMap(async ({ endpoint, options, origin, href }) => {
    try {
      await delay();
      options.body = JSON.stringify({});
      const job = await fetch(endpoint, options);
      if (!job.ok) {
        throw new Error(getErrorText(job.status), { cause: job.status }, origin);
      }
      const result = await job.json();
      return { href, origin, result };
    } catch (error) {
      return { href, origin, result: { status: error.cause } };
    }
  });
  const statuses = await Promise.all(processes);
  const newQueue = queue.map((entry, index) => {
    const { result } = statuses.find((stat) => stat.href === urls[index]);
    const status = (result?.[getProcess(process)]?.status || result?.status) ?? entry.status;
    return { ...entry, status, count: entry.count + 1 };
  });
  return newQueue;
};

export {
  updateRetryQueue,
  startJobProcess,
  connectSidekick,
  pollJobStatus,
};
