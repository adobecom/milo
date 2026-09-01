import { createAxiosWithRetry } from './utils.js';
import { getImsToken } from './ims-client.js';

const MAX_REDIRECT_ENTRIES = 999999;

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

const { LOCAL_RUN = '' } = process.env;
const JOB_STATUS_POLL_INTERVAL = Number(process.env.JOB_STATUS_POLL_INTERVAL || '15');
const JOB_STATUS_TIMEOUT = Number(process.env.JOB_STATUS_TIMEOUT || '2700');
const LOG_FETCH_MAX_REQUESTS = Number(process.env.LOG_FETCH_MAX_REQUESTS || '10');

const getSiteEnvKey = (owner, repo, prefix = '') => `${prefix || ''}${owner}_${repo}`.replaceAll('-', '_').toUpperCase();

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchLogsForSite(siteOrg, siteRepo, fromParam, toParam) {
  const adminToken = await getImsToken();
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
        headers: { Authorization: `Bearer ${adminToken}` },
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
  const adminToken = await getImsToken();
  const url = `https://admin.hlx.page/preview/${owner}/${repo}/main${path}`;
  console.log(`previewing path: ${url}`);
  const response = await axiosWithRetryError({
    method: 'POST',
    url,
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
}

async function awaitBulkJobStatus(jobStatusUrl, startedAt = Date.now()) {
  console.log(`Awaiting bulk job status: ${jobStatusUrl}`);
  let response;
  try {
    response = await axiosWithRetryError({
      method: 'GET',
      url: jobStatusUrl,
      headers: { Authorization: `Bearer ${await getImsToken()}` }
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
  return awaitBulkJobStatus(json.links.self, startedAt);
}

async function getPreviewPathsForRegion(siteOrg, siteRepo, regionPath) {
  const path = regionPath.endsWith('/') ? regionPath : `${regionPath}/`;
  const adminToken = await getImsToken();
  const body = {
    select: ['preview'],
    paths: [`${path}*`],
    forceAsync: true,
  };
  const initialUrl = `https://admin.hlx.page/status/${siteOrg}/${siteRepo}/main/*`;
  const bodyJson = JSON.stringify(body);
  console.debug(`Fetching preview for site: ${siteOrg}/${siteRepo} with jobs url ${bodyJson}`);
  const response = await axiosWithRetryError({
    method: 'POST',
    url: initialUrl,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(body)
  });
  const job = response.data;
  const detailsUrl = await awaitBulkJobStatus(job.links.self);
  if (detailsUrl) {
    console.debug(`Fetching job details: ${detailsUrl}`);
    const detailsResponse = await axiosWithRetryError({
      method: 'GET',
      url: detailsUrl,
      headers: { Authorization: `Bearer ${await getImsToken()}` }
    });
    const detailsJson = detailsResponse.data;
    const isCompleted = detailsJson?.data?.phase === 'completed';
    if (isCompleted && detailsJson?.data?.resources?.length) {
      return detailsJson?.data?.resources
        .filter((data) => !data.previewConfigRedirectLocation)
        .map((data) => data.path) || [];
    }
    return [];
  }
  console.error(`Job not stopped: ${job.links.self}`);
  throw new Error(`Job not stopped: ${job.links.self}`);
}

async function getRedirects(siteOrg, siteRepo) {
  const adminToken = process.env.AEM_ORG_AUTH_TOKEN;
  const url = `https://main--${siteRepo}--${siteOrg}.aem.page/redirects.json?limit=${MAX_REDIRECT_ENTRIES}`;
  try {
    const response = await axiosWithRetryError({
      method: 'GET',
      url,
      headers: { Authorization: `token ${adminToken}` }
    });
    return response.data?.data?.map(item => item.Source) || [];
  } catch (error) {
    const status = error.status || error.response?.status;
    if (status === 404 || status === 401) {
      console.warn(`Redirects not found or unauthorized for ${siteOrg}/${siteRepo} (status ${status}). Returning empty list.`);
      return [];
    }
    throw error;
  }
}

export { getSiteEnvKey, fetchLogsForSite, triggerPreview, getPreviewPathsForRegion, getRedirects };
