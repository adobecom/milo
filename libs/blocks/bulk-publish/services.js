import { getErrorText, processJobResult, wait } from './utils.js';

const BASE_URL = 'https://admin.hlx.page';
const headers = { 'Content-Type': 'application/json' };

const getMiloUrl = (url) => url.hostname.split('.')[0].split('--');
const getProcess = (type) => {
  if (type === 'index') return type;
  if (['publish', 'unpublish'].includes(type)) return 'live';
  return 'preview';
};

const getRequestEp = (url, type) => {
  const [ref, repo, owner] = getMiloUrl(url);
  const process = getProcess(type);
  const path = process === 'index' ? url.pathname : '*';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}/${path}`;
};

const prepareBulkJob = (jobs) => {
  const { urls, process } = jobs;
  const all = urls.map((url) => (new URL(url)));
  return Object.values(all.reduce((newJobs, url) => {
    const isDelete = ['unpublish', 'delete'].includes(process);
    let job = url.host;
    while (newJobs[job] && newJobs[job].options.body.paths.length >= 100) {
      job = `${job}+`;
    }
    if (!newJobs[job]) {
      newJobs[job] = {
        href: [url.href],
        origin: url.origin,
        endpoint: getRequestEp(url, process),
        options: {
          headers,
          method: isDelete ? 'DELETE' : 'POST',
          body: { paths: [] },
        },
      };
    }
    if (!isDelete) {
      newJobs[job].options.body.forceUpdate = true;
    }
    newJobs[job].options.body.paths.push(url.pathname.toLowerCase());
    newJobs[job].href.push(url.href);
    return newJobs;
  }, {}));
};

const prepareJob = (jobs) => {
  const all = jobs.urls.map((url) => (new URL(url)));
  return all.map((url) => ({
    href: url.href,
    origin: url.origin,
    path: url.pathname,
    endpoint: getRequestEp(url, jobs.process),
    options: {
      headers,
      method: ['unpublish', 'delete'].includes(jobs.process) ? 'DELETE' : 'POST',
    },
  }));
};

const createResults = (jobs, topic) => {
  const { complete, error } = processJobResult(jobs);
  const { origin, useBulk } = jobs[0];
  const paths = complete.map(({ result }) => (result?.job?.path));
  return [{
    origin,
    useBulk,
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

const runJob = async (jobs) => {
  const useBulk = jobs.process !== 'index';
  const newJobs = useBulk ? prepareBulkJob(jobs) : prepareJob(jobs);
  const requests = newJobs.flatMap(async ({ endpoint, options, origin, href }) => {
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
    try {
      const job = await fetch(endpoint, options);
      if (!job.ok && (useBulk || job.status === 403)) {
        throw new Error(getErrorText(job.status), { cause: job.status }, origin);
      }
      const result = useBulk
        ? await job.json()
        : { job: { origin, status: job.status, href } };

      return { origin, result, useBulk, href };
    } catch (error) {
      return {
        href,
        origin,
        error: error.cause ?? 400,
        message: error.message,
      };
    }
  });
  const results = await Promise.all(requests);
  return useBulk ? results : createResults(results, jobs.process);
};

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

const attemptRetry = async ({ queue, urls, process }) => {
  const prepped = prepareJob({ urls, process });
  const processes = prepped.flatMap(async ({ endpoint, options, origin }) => {
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
  attemptRetry,
  runJob,
  getMiloUrl,
  pollJobStatus,
};
