import { createAxiosWithRetry } from './utils.js';

const axiosWithRetry = createAxiosWithRetry();

const axiosWithRetryError = async (request) => {
  try {
    return await axiosWithRetry(request);
  } catch (error) {
    const message = `Request failed: ${error.message} (${error.response?.status || 'unknown'})`;
    const enhancedError = new Error(message);
    enhancedError.status = error.status;
    enhancedError.response = error.response;
    throw enhancedError;
  }
};

const {
  AEM_LIVE_ADMIN_TOKEN = '',
  LOCAL_RUN = '',
} = process.env;
const JOB_STATUS_POLL_INTERVAL = Number(process.env.JOB_STATUS_POLL_INTERVAL || '15');
const JOB_STATUS_TIMEOUT = Number(process.env.JOB_STATUS_TIMEOUT || '2700');
const LOG_FETCH_MAX_REQUESTS = Number(process.env.LOG_FETCH_MAX_REQUESTS || '10');

if (!LOCAL_RUN) {
  console.log({ AEM_LIVE_ADMIN_TOKEN: !!AEM_LIVE_ADMIN_TOKEN });
}

const getSiteEnvKey = (owner, repo, prefix = '') => `${prefix || ''}${owner}_${repo}`.replaceAll('-', '_').toUpperCase();

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchLogsForSite(siteOrg, siteRepo, fromParam, toParam) {
  const adminTokenKey = getSiteEnvKey(siteOrg, siteRepo, 'AEM_ADMIN_TOKEN_');
  const adminToken = process.env[adminTokenKey];
  console.log(`Fetching logs for site: ${siteOrg}/${siteRepo}...`);
  const initialUrl = `https://admin.hlx.page/log/${siteOrg}/${siteRepo}/main?from=${fromParam}&to=${toParam}`;
  const entriesSet = new Set();
  let totalFetched = 0;

  try {
    let lastFetchedISO = toParam;
    let nextUrl = initialUrl;
    let requestCount = 0;

    while (nextUrl && requestCount < LOG_FETCH_MAX_REQUESTS) {
      requestCount += 1;
      console.debug(`Fetching page ${requestCount} for ${siteRepo}: ${nextUrl}`);
      const request = await fetch(nextUrl, {
        method: 'GET',
        headers: { Authorization: `token ${adminToken}` },
      });

      if (!request.ok) {
        console.error(
          `Error fetching logs for ${siteRepo}: ${request.status} ${request.statusText}`,
        );
        const errorBody = await request.text();
        console.error(`Response body: ${errorBody}`);
        throw new Error(`Failed to fetch logs: ${request.status}`);
      }

      const json = await request.json();

      if (json.entries && json.entries.length > 0) {
        const maxTimestamp = Math.max(...json.entries.map((e) => e.timestamp));
        lastFetchedISO = maxTimestamp ? new Date(maxTimestamp).toISOString() : lastFetchedISO;
        json.entries.forEach((entry) => {
          entriesSet.add(JSON.stringify(entry));
        });
        totalFetched += json.entries.length;
        console.log(
          `Fetched ${json.entries.length} entries for ${siteRepo}. Total: ${totalFetched}`,
        );
      } else {
        console.log(
          `No new entries found on page ${requestCount} for ${siteRepo}.`,
        );
      }

      nextUrl = json.links?.next;
      if (!nextUrl) {
        console.log(`No more pages found for ${siteRepo}.`);
        break;
      }
    }

    if (requestCount >= LOG_FETCH_MAX_REQUESTS) {
      console.warn(
        `Warning: Reached maximum request limit (${LOG_FETCH_MAX_REQUESTS}) for ${siteRepo}. Log data might be incomplete.`,
      );
    }

    // Convert set of stringified entries back to array of entry objects
    const entries = Array.from(entriesSet).map((e) => JSON.parse(e));
    return { entries, lastFetchedISO };
  } catch (err) {
    console.error(`Error fetching or writing logs for site ${siteRepo}:`, err);
    throw err; // Re-throw error
  }
}

async function triggerPreview(owner, repo, path) {
  const adminTokenKey = getSiteEnvKey(owner, repo, 'AEM_ADMIN_TOKEN_');
  const adminToken = process.env[adminTokenKey];
  const url = `https://admin.hlx.page/preview/${owner}/${repo}/main${path}`;
  console.log(`previewing path: ${url}`);
  const response = await axiosWithRetryError({
    method: 'POST',
    url,
    headers: { Authorization: `token ${adminToken}` },
  });
  return response.data;
}

async function awaitBulkJobStatus(jobStatusUrl, options, startedAt = Date.now()) {
  console.log(`Awaiting bulk job status: ${jobStatusUrl}`);
  const { adminToken } = options;
  let response;
  try {
    response = await axiosWithRetryError({
      method: 'GET',
      url: jobStatusUrl,
      headers: { Authorization: `token ${adminToken}` }
    });
  } catch (error) {
    console.error(`Error fetching job status: ${jobStatusUrl}`);
    return null;
  }

  const json = response.data || {};
  if (json.state === 'stopped') {
    console.log(`Job completed for : ${jobStatusUrl}`);
    return json.links?.details;
  }
  await delay(JOB_STATUS_POLL_INTERVAL * 1000);
  if (Date.now() - startedAt > JOB_STATUS_TIMEOUT * 1000) {
    console.error(`Job status timeout: ${jobStatusUrl}`);
    return null;
  }
  return awaitBulkJobStatus(json.links.self, { adminToken }, startedAt);
}

async function getPreviewPathsForRegion(siteOrg, siteRepo, regionPath) {
  const path = regionPath.endsWith('/') ? regionPath : `${regionPath}/`;
  const adminTokenKey = getSiteEnvKey(siteOrg, siteRepo, 'AEM_ADMIN_TOKEN_');
  const adminToken = process.env[adminTokenKey];
  const body = {
    select: ['preview'],
    paths: [`${path}*`],
    pathsOnly: true,
    forceAsync: true,
  };
  const initialUrl = `https://admin.hlx.page/status/${siteOrg}/${siteRepo}/main/*`;
  const bodyJson = JSON.stringify(body);
  console.debug(`Fetching preview for site: ${siteOrg}/${siteRepo} with jobs url ${bodyJson}`);
  const response = await axiosWithRetryError({
    method: 'POST',
    url: initialUrl,
    headers: {
      Authorization: `token ${adminToken}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(body)
  });
  const job = response.data;
  const detailsUrl = await awaitBulkJobStatus(job.links.self, { adminToken });
  if (detailsUrl) {
    console.debug(`Fetching job details: ${detailsUrl}`);
    const detailsResponse = await axiosWithRetryError({
      method: 'GET',
      url: detailsUrl,
      headers: { Authorization: `token ${adminToken}` }
    });
    const detailsJson = detailsResponse.data;
    const isCompleted = detailsJson?.data?.phase === 'completed';
    return isCompleted ? detailsJson?.data?.resources?.preview || [] : [];
  }
  console.error(`Job not stopped: ${job.links.self}`);
  throw new Error(`Job not stopped: ${job.links.self}`);
}

export { getSiteEnvKey, fetchLogsForSite, triggerPreview, getPreviewPathsForRegion };
