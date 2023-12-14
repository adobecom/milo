import { getErrorText, wait } from './utils.js';

const BASE_URL = 'https://admin.hlx.page';
const headers = { 'Content-Type': 'application/json' };

const USES_BULK = ['preview', 'publish'];
const isLive = (type) => (['publish', 'unpublish'].includes(type) ? 'live' : null);
const isIndex = (type) => (['index', 'deindex'].includes(type) ? 'index' : null);
const getMiloUrl = (url) => url.hostname.split('.')[0].split('--');

const getProcessEp = (url, type) => {
  const [ref, repo, owner] = getMiloUrl(url);
  const process = isLive(type) ?? isIndex(type) ?? 'preview';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}${url.pathname}`;
};

const getBulkJobEp = (url, type) => {
  const [ref, repo, owner] = getMiloUrl(url);
  const process = isLive(type) ?? 'preview';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}/*`;
};

const prepareBulkJobs = (jobs) => {
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
        href: url.href,
        origin: url.origin,
        endpoint: getBulkJobEp(url, process),
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
    return newJobs;
  }, {}));
};

const prepareItrJobs = (jobs) => {
  const all = jobs.urls.map((url) => (new URL(url)));
  return all.map((url) => ({
    href: url.href,
    origin: url.origin,
    path: url.pathname,
    endpoint: getProcessEp(url, jobs.process),
    options: {
      headers,
      method: ['unpublish', 'delete'].includes(jobs.process) ? 'DELETE' : 'POST',
    },
  }));
};

const getItrJob = (jobs, topic) => {
  const { complete, error } = jobs.reduce((list, job) => {
    list[!job.error ? 'complete' : 'error'].push(job);
    return list;
  }, { complete: [], error: [] });

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

const createJobs = async (jobs) => {
  const useBulk = USES_BULK.includes(jobs.process);
  const newJobs = useBulk ? prepareBulkJobs(jobs) : prepareItrJobs(jobs);
  const requests = newJobs.flatMap(async ({ endpoint, options, origin, path, href }) => {
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
        : { job: { origin, path, status: job.status, href } };

      return { origin, result, useBulk, href };
    } catch (error) {
      return {
        href,
        path,
        origin,
        error: error.cause ?? 400,
        message: error.message,
      };
    }
  });
  const results = await Promise.all(requests);
  return useBulk ? results : getItrJob(results, jobs.process);
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
  const prepped = prepareItrJobs({ urls, process });
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
  createJobs,
  getMiloUrl,
  pollJobStatus,
};
