import { AEM_ORIGIN } from './constants.js';
import RequestHandler from './request-handler.js';

const BATCH_SIZE = 25;
const BATCH_DELAY = 2000;
const JOB_MAX_RETRIES = 5;
const JOB_MAX_RETRY_DELAY = 60000;
const JOB_STALL_TIMEOUT = 15 * 60 * 1000;
const JOB_QUEUE_TIMEOUT = 60 * 60 * 1000;
const JOB_STATES = ['created', 'running', 'stopped'];

export class BulkAction {
  constructor({ org, repo, accessToken, callback, signal }) {
    this.org = org;
    this.repo = repo;
    this.callback = callback;
    this.accessToken = accessToken;
    this.signal = signal;
    this.requestHandler = new RequestHandler(accessToken, { signal });
    this.batchCount = 0;
  }

  static cleanUpPath(path) {
    let cleanedPath = path.replace(/\.html$/, '');
    cleanedPath = cleanedPath.replace(/^\/[^/]+\/[^/]+/, '');
    return cleanedPath;
  }

  static delay = (signal, ms = BATCH_DELAY) => new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    let id;
    const onAbort = () => {
      clearTimeout(id);
      resolve();
    };
    id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });

  // Only follow links on the admin origin so the access token is never sent elsewhere.
  static getAdminUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.origin === AEM_ORIGIN ? parsed.href : undefined;
    } catch {
      return undefined;
    }
  }

  static getRetryDelay(resp, attempt) {
    const retryAfter = resp?.headers?.get?.('Retry-After');
    if (retryAfter) {
      const seconds = Number(retryAfter);
      const ms = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retryAfter) - Date.now();
      if (Number.isFinite(ms)) return Math.min(Math.max(ms, 0), JOB_MAX_RETRY_DELAY);
    }
    return Math.min(BATCH_DELAY * (2 ** attempt), JOB_MAX_RETRY_DELAY);
  }

  async previewOrPublishBulkPaths({ paths, action }) {
    if (!paths.length || this.signal?.aborted) return;
    const baseUrl = `${AEM_ORIGIN}/${action}/${this.org}/${this.repo}/main`;
    const pending = new Set(paths);
    let jobUrl;
    let jobStopped = false;
    let failed = false;
    // Throttled (429) requests were not processed, so they are always safe to retry.
    // Read-only job requests are also retried on server and network errors.
    const readJob = async (url, opts = {}) => {
      const isRead = !opts.method || opts.method === 'GET';
      for (let attempt = 0; ; attempt += 1) {
        let resp;
        let error;
        try {
          // eslint-disable-next-line no-await-in-loop
          resp = await this.requestHandler.daFetch(url, { ...opts });
          if (resp.ok) return resp.json();
          error = new Error(`Bulk ${action} request failed: ${resp.status} :: ${url}`);
          error.status = resp.status;
        } catch (err) {
          if (err.name === 'AbortError' || !isRead) throw err;
          error = err;
        }
        const retryable = resp?.status === 429 || (isRead && (!resp || resp.status >= 500));
        if (!retryable || attempt >= JOB_MAX_RETRIES || this.signal?.aborted) throw error;
        const wait = BulkAction.getRetryDelay(resp, attempt);
        // eslint-disable-next-line no-console
        console.warn(`${error.message}; retrying in ${wait / 1000}s (${attempt + 1}/${JOB_MAX_RETRIES})`);
        // eslint-disable-next-line no-await-in-loop
        await BulkAction.delay(this.signal, wait);
        if (this.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      }
    };
    const report = (path, statusCode, errorMsg) => {
      if (this.signal?.aborted) return;
      pending.delete(path);
      this.callback({
        path,
        aemUrl: `${baseUrl}${BulkAction.cleanUpPath(path)}`,
        // An unchanged resource is also a successful bulk operation.
        statusCode: statusCode === 304 ? 200 : statusCode,
        ...(errorMsg ? { errorMsg } : {}),
      });
    };
    // Results may use path, webPath or resourcePath (e.g. /a/index.md for web path /a/),
    // and AEM web paths are lowercase.
    const pathsByResult = new Map();
    paths.forEach((path) => {
      const cleanedPath = BulkAction.cleanUpPath(path).toLowerCase();
      new Set([cleanedPath, cleanedPath.replace(/\/index$/, '/')]).forEach((key) => {
        pathsByResult.set(key, [...(pathsByResult.get(key) || []), path]);
      });
    });
    const reportResources = (resources) => resources.forEach((resource) => {
      // Unprocessed resources can be listed with a non-HTTP placeholder status (e.g. 0).
      if (!Number.isInteger(resource?.status) || resource.status < 100) return;
      const { path: resultPath, webPath, resourcePath } = resource;
      const keys = [resultPath, webPath, resourcePath, resourcePath?.replace?.(/\.md$/, '')]
        .filter((key) => typeof key === 'string');
      const label = keys[0];
      new Set(keys.flatMap((key) => pathsByResult.get(key.toLowerCase()) || [])).forEach((path) => {
        if (!pending.has(path)) return;
        const errorMsg = resource.error
          || (resource.status >= 400 ? `Bulk ${action} failed for ${label}` : undefined);
        if (errorMsg) {
          // eslint-disable-next-line no-console
          console.error(errorMsg);
        }
        report(path, resource.status, errorMsg);
      });
    });

    try {
      // Force async even for small lists so all requests use the same job contract.
      const started = await readJob(`${baseUrl}/*`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: paths.map((path) => BulkAction.cleanUpPath(path)),
          forceUpdate: true,
          forceAsync: true,
        }),
      });
      let { job } = started;
      const selfUrl = BulkAction.getAdminUrl(started.links?.self);
      if (!job || (!selfUrl && (!job.topic || !job.name))) {
        throw new Error(`Missing bulk ${action} job`);
      }
      // Prefer API-provided links because job URLs differ between admin API versions.
      jobUrl = selfUrl || `${AEM_ORIGIN}/job/${this.org}/${this.repo}/main/${encodeURIComponent(job.topic)}/${encodeURIComponent(job.name)}`;
      let detailsUrl = BulkAction.getAdminUrl(started.links?.details);
      if (!detailsUrl && selfUrl) {
        // The creation response has no details link; the job status response does.
        const status = await readJob(jobUrl);
        detailsUrl = BulkAction.getAdminUrl(status.links?.details);
      }
      detailsUrl ||= `${jobUrl}/details`;
      let polled = false;
      let lastProgress;
      let lastProgressAt = Date.now();
      // Poll the details endpoint so finished resources are reported while the job runs.
      while (!polled || job.state !== 'stopped') {
        if (!JOB_STATES.includes(job.state)) {
          throw new Error(`Unexpected bulk ${action} job state: ${job.state}`);
        }
        if (job.state !== 'stopped') {
          await BulkAction.delay(this.signal);
          if (this.signal?.aborted) return;
        }
        job = await readJob(detailsUrl);
        polled = true;
        jobStopped = job.state === 'stopped';
        const resources = job.data?.resources;
        if (Array.isArray(resources)) reportResources(resources);
        else if (jobStopped) throw new Error(`Missing bulk ${action} results`);

        const progress = JSON.stringify([job.state, job.progress, pending.size]);
        // A created job may be queued behind other jobs, so allow it longer to start.
        const queued = job.state === 'created';
        const timeout = queued ? JOB_QUEUE_TIMEOUT : JOB_STALL_TIMEOUT;
        if (progress !== lastProgress) {
          lastProgress = progress;
          lastProgressAt = Date.now();
        } else if (!jobStopped && Date.now() - lastProgressAt >= timeout) {
          const minutes = timeout / 60000;
          throw new Error(queued
            ? `Bulk ${action} job did not start within ${minutes} minutes`
            : `Bulk ${action} job made no progress for ${minutes} minutes`);
        }
      }

      pending.forEach((path) => {
        const errorMsg = `Bulk ${action} returned no result for ${BulkAction.cleanUpPath(path)}`;
        // eslint-disable-next-line no-console
        console.error(errorMsg);
        report(path, 500, errorMsg);
      });
    } catch (err) {
      if (err.name === 'AbortError' || this.signal?.aborted) return;
      failed = true;
      // eslint-disable-next-line no-console
      console.error(`Bulk ${action} failed`, err);
      pending.forEach((path) => report(path, err.status || 500, err.message));
    } finally {
      if ((this.signal?.aborted || failed) && jobUrl && !jobStopped) {
        // Stop a cancelled or untracked job so a retry cannot run alongside it.
        // The workflow signal may be aborted, so this needs a separate request handler.
        try {
          const resp = await new RequestHandler(this.accessToken).daFetch(jobUrl, { method: 'DELETE' });
          if (!resp.ok) {
            // eslint-disable-next-line no-console
            console.error(`Could not stop bulk ${action} job; it may still be running: ${resp.status} :: ${jobUrl}`);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`Could not stop bulk ${action} job; it may still be running`, err);
        }
      }
    }
  }

  async previewOrPublishPath({ path, action, isDelete = false }) {
    if (this.signal?.aborted) return;
    try {
      const cleanedPath = BulkAction.cleanUpPath(path);
      const method = isDelete ? 'DELETE' : 'POST';
      const opts = { method };
      const aemUrl = `${AEM_ORIGIN}/${action}/${this.org}/${this.repo}/main${cleanedPath}`;
      const resp = await this.requestHandler.daFetch(aemUrl, opts);
      if (!resp.ok) {
        // eslint-disable-next-line no-console
        console.error(`Failed to ${action} : ${resp.status} :: ${aemUrl}`);
        this.callback({ statusCode: resp.status, aemUrl, path, errorMsg: `Failed to ${action}` });
      } else {
        this.callback({ statusCode: resp.status, aemUrl, path });
      }
    } catch (err) {
      if (err.name !== 'AbortError') throw err;
    }
  }

  async previewOrPublishPaths({ paths, action, isDelete = false }) {
    for (let i = 0; i < paths.length; i += BATCH_SIZE) {
      if (this.signal?.aborted) break;
      const batch = paths.slice(i, i + BATCH_SIZE);
      // eslint-disable-next-line no-console,no-plusplus
      console.log(`Batch number : ${++this.batchCount}`);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((path) => this.previewOrPublishPath({ path, action, isDelete })));
      if (this.signal?.aborted) break;
      // eslint-disable-next-line no-console
      console.log(`Waiting for ${BATCH_DELAY / 1000} seconds before processing the next batch...`);
      // eslint-disable-next-line no-await-in-loop
      await BulkAction.delay(this.signal);
    }
  }
}

async function previewOrPublishPaths({
  org, repo, paths, action, accessToken, callback, isDelete = false, signal, useBulk = false,
}) {
  const bulkAction = new BulkAction({ org, repo, accessToken, callback, signal });
  // eslint-disable-next-line no-console
  console.log(`Action: ${action} :: isDelete: ${isDelete}`);
  if (useBulk && !isDelete) {
    await bulkAction.previewOrPublishBulkPaths({ paths, action });
  } else {
    await bulkAction.previewOrPublishPaths({ paths, action, isDelete });
  }
}

export default previewOrPublishPaths;
