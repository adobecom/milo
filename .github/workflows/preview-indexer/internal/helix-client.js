const {
  AEM_LIVE_ADMIN_TOKEN = '',
  LOCAL_RUN = '',
} = process.env;
const JOB_STATUS_POLL_INTERVAL = Number(process.env.JOB_STATUS_POLL_INTERVAL || '10');
const JOB_STATUS_TIMEOUT = Number(process.env.JOB_STATUS_TIMEOUT || '180');
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
        lastFetchedISO = json.to;
        json.entries?.forEach((entry) => {
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
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `token ${adminToken}` },
  });
  if (!response.ok) {
    console.error(`Failed to preview path: ${owner}/${repo}/main${path}`);
    const errorMsg = `Failed to preview path: ${owner}/${repo}/main${path}`;
    throw new Error(`${errorMsg}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function awaitBulkJobStatus(jobStatusUrl, options, startedAt = Date.now()) {
  console.log(`Awaiting bulk job status: ${jobStatusUrl}`);
  const { adminToken } = options;
  const response = await fetch(jobStatusUrl, {
    method: 'GET',
    headers: { Authorization: `token ${adminToken}` },
  });
  if (!response.ok) {
    console.error(`Failed to fetch job status: ${jobStatusUrl}`);
    return null;
  }
  const json = await response.json();
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
  const response = await fetch(initialUrl, {
    method: 'POST',
    headers: {
      Authorization: `token ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error(`Failed to fetch preview paths for ${siteOrg}/${siteRepo}: ${regionPath}`);
    const errorMsg = `Failed to fetch preview paths for ${siteOrg}/${siteRepo}: ${regionPath}`;
    throw new Error(`${errorMsg}: ${response.status} ${response.statusText}`);
  }
  const job = await response.json();
  const detailsUrl = await awaitBulkJobStatus(job.links.self, { adminToken });
  if (detailsUrl) {
    console.debug(`Fetching job details: ${detailsUrl}`);
    const detailsResponse = await fetch(detailsUrl, {
      method: 'GET',
      headers: { Authorization: `token ${adminToken}` },
    });
    if (!detailsResponse.ok) {
      console.error(`Failed to fetch job details: ${detailsUrl}`);
      const errorMsg = `Failed to fetch job details: ${detailsUrl}`;
      throw new Error(`${errorMsg}: ${detailsResponse.status} ${detailsResponse.statusText}`);
    }
    const detailsJson = await detailsResponse.json();
    const isCompleted = detailsJson?.data?.phase === 'completed';
    return isCompleted ? detailsJson?.data?.resources?.preview || [] : [];
  }
  console.error(`Job not stopped: ${job.links.self}`);
  throw new Error(`Job not stopped: ${job.links.self}`);
}

export { getSiteEnvKey, fetchLogsForSite, triggerPreview, getPreviewPathsForRegion };
