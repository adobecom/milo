import { PROCESS_TYPES, getErrorText, getMiloUrl, processJobResult, wait } from './utils.js';

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
  const path = usePath ? url.pathname : '*';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}/${path}`;
};

const createAEMRequest = (url, process, isBulk = true) => {
  const del = isDelete(process);
  const href = isBulk ? [url.href] : url.href;
  const options = { headers, method: del ? 'DELETE' : 'POST' };
  if (isBulk) options.body = { paths: [] };
  const request = {
    href,
    options,
    path: url.pathname,
    origin: url.origin,
    endpoint: writeEP(url, process, !isBulk),
  };
  return request;
};

const connectSidekick = (bulkPub) => {
  const config = (event) => {
    const processes = event?.detail?.data;
    if (processes) {
      const profile = processes.profile ?? null;
      const permissions = {};
      PROCESS_TYPES.forEach((key) => {
        // index.permissions does not exist in processes returned from sidekick event
        if (key !== 'index') {
          const process = isLive(key) ? 'live' : 'preview';
          permissions[key] = !!processes[process].permissions?.includes('list');
        }
      });
      bulkPub.user = { profile, permissions };
    }
  };
  document.addEventListener('sidekick-ready', () => {
    document.querySelector('helix-sidekick').addEventListener('statusfetched', config);
  }, { once: true });
};

const writeJobList = ({ urls, process }) => {
  const all = urls.map((url) => (new URL(url)));
  return all.map((url) => (createAEMRequest(url, process, false)));
};

const createJobs = (details, useBulk) => {
  if (!useBulk) return writeJobList(details);
  const { urls, process } = details;
  const paths = urls.map((url) => (new URL(url)));
  return Object.values(paths.reduce((jobs, url) => {
    // reduce urls list into jobs by host
    let base = url.host;
    // groups of 100 for users without 'list' permission
    while (!details.hasPermission && jobs[base]?.options.body.paths.length >= 100) {
      base = `${base}+`;
    }
    if (!jobs[base]) jobs[base] = createAEMRequest(url, process);
    const job = jobs[base];
    if (!isDelete(process)) {
      job.options.body.forceUpdate = true;
    }
    job.options.body.paths.push(url.pathname.toLowerCase());
    job.href.push(url.href);
    return jobs;
  }, {}));
};

const formatJobResult = (jobs, topic, formatted) => {
  if (formatted) return jobs;
  const { complete, error } = processJobResult(jobs);
  const { origin, hasPermission } = jobs[0];
  const paths = complete.map(({ result }) => (result?.job?.path));
  return [{
    origin,
    useBulk: hasPermission,
    result: {
      job: {
        topic,
        state: 'stopped',
        stopTime: new Date(),
        progress: { failed: complete.filter(({ status }) => ![200, 204].includes(status)).length },
        data: { paths, resources: complete.map((item) => (item.result.job)) },
      },
    },
  }, ...error];
};

const runJob = async (details) => {
  const { process } = details;
  const useBulk = process !== 'index';
  const jobs = createJobs(details, useBulk);
  const requests = jobs.flatMap(async (job) => {
    const { options, origin } = job;
    let { endpoint } = job;
    if (options.body) {
      if (isDelete(process)) {
        endpoint = `${endpoint}?paths[]=${options.body.paths.join('&paths[]=')}`;
        delete options.body;
      } else {
        options.body = JSON.stringify(options.body);
      }
    }
    try {
      const request = await fetch(endpoint, options);
      if (!request.ok && useBulk) {
        throw new Error(getErrorText(request.status), request, origin);
      }
      const result = useBulk ? await request.json() : { job: { ...job, ...request } };
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
  return formatJobResult(results, process, useBulk);
};

const fetchStatus = async (link) => {
  await wait(3000);
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
    const status = await fetchStatus(`${result.link.self}/details`);
    setProgress(status);
    if (status.stopTime) {
      jobStatus = status;
      stopped = true;
    }
  }
  return jobStatus;
};

const runRetry = async ({ queue, urls, process }) => {
  const jobs = writeJobList({ urls, process });
  const processes = jobs.flatMap(async ({ endpoint, options, origin }) => {
    try {
      await wait(4000);
      const job = await fetch(endpoint, options);
      if (!job.ok) {
        throw new Error(getErrorText(job.status), { cause: job.status }, origin);
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
  runRetry,
  runJob,
  connectSidekick,
  pollJobStatus,
};
