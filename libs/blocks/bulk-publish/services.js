import { getErrorText, processJobResult, wait } from './utils.js';

const BASE_URL = 'https://admin.hlx.page';
const headers = { 'Content-Type': 'application/json' };

const getMiloUrl = (url) => url.hostname.split('.')[0].split('--');
const isLive = (type) => ['publish', 'unpublish'].includes(type);
const isDelete = (type) => ['delete', 'unpublish'].includes(type);
const getProcess = (type) => {
  if (type === 'index') return type;
  if (isLive(type)) return 'live';
  return 'preview';
};

const getRequestEp = (url, type, usePath = false) => {
  const [ref, repo, owner] = getMiloUrl(url);
  const process = getProcess(type);
  const path = usePath ? url.pathname : '*';
  return `${BASE_URL}/${process}/${owner}/${repo}/${ref}/${path}`;
};

const connectSidekick = (bulkPub) => {
  const setPerms = (event) => {
    const processes = event?.detail?.data;
    if (processes) {
      const profile = processes.profile ?? null;
      const permissions = {};
      Object.keys({
        preview: false,
        publish: false,
        unpublish: false,
        delete: false,
      }).forEach((key) => {
        const process = isLive(key) ? 'live' : 'preview';
        // 'list' permission is required to do more than 100 at a time for live/preview:post
        // 'list' permission is required to use bulk live:delete and preview:delete
        permissions[key] = !!processes[process].permissions?.includes('list');
      });
      bulkPub.user = { profile, permissions };
    }
  };
  document.addEventListener('sidekick-ready', () => {
    document.querySelector('helix-sidekick').addEventListener('statusfetched', setPerms);
  }, { once: true });
};

const prepareBulkJob = (jobs) => {
  const { urls, process } = jobs;
  const all = urls.map((url) => (new URL(url)));
  return Object.values(all.reduce((newJobs, url) => {
    let job = url.host;
    // chunking to 100 per request for users without 'list' permission
    while (!jobs.useBulk && newJobs[job]?.options.body.paths.length >= 100) {
      job = `${job}+`;
    }
    if (!newJobs[job]) {
      newJobs[job] = {
        href: [url.href],
        origin: url.origin,
        endpoint: getRequestEp(url, process),
        options: {
          headers,
          method: isDelete(process) ? 'DELETE' : 'POST',
          body: { paths: [] },
        },
      };
    }
    if (!isDelete(process)) {
      // future potential to make this part of jobs object
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
    endpoint: getRequestEp(url, jobs.process, true),
    options: {
      headers,
      method: isDelete(jobs.process) ? 'DELETE' : 'POST',
    },
  }));
};

const setResult = (jobs, topic) => {
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
  const notBulk = jobs.process === 'index' || (isDelete(jobs.process) && !jobs.useBulk);
  const newJobs = notBulk ? prepareJob(jobs) : prepareBulkJob(jobs);
  const requests = newJobs.flatMap(async ({ endpoint, options, origin, href, path }) => {
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
    try {
      const job = await fetch(endpoint, options);
      if (!job.ok && (!notBulk || job.status === 403)) {
        throw new Error(getErrorText(job.status), { cause: job.status }, origin);
      }
      const result = notBulk
        ? { job: { origin, href, path, status: job.status } }
        : await job.json();

      return { href, origin, result, useBulk: !notBulk };
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
  return notBulk ? setResult(results, jobs.process) : results;
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

const pollJobStatus = async (job, setProgress) => {
  const { result } = job;
  let jobStatus;
  let stopped = false;
  while (!stopped) {
    const status = await getStatus(`${result.link.self}/details`);
    setProgress(status);
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
  connectSidekick,
  pollJobStatus,
};
