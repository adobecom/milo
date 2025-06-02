// node --env-file=.env .github/workflows/import/poll-logs.js (node >= 21)
import PQueue from 'p-queue';
import fs from 'fs';
import importUrl from './index.js';
import LOCAL_DEBUG_ENTRIES from './LOCAL_DEBUG_ENTRIES.js';
import { getImsToken } from './daFetch.js';

const { env, exit } = process;
const {
  AEM_LIVE_ADMIN_TOKEN,
  ROLLING_IMPORT_REPO,
  LOCAL_RUN,
  ROLLING_IMPORT_SLACK,
  GITHUB_SERVER_URL,
  GITHUB_RUN_ID,
  LAST_RUN_ISO,
  ROLLING_IMPORT_CLIENT_SECRET,
  ROLLING_IMPORT_CLIENT_ID,
  ROLLING_IMPORT_CODE,
  ROLLING_IMPORT_GRANT_TYPE,
  ROLLING_IMPORT_IMS_URL,
  ROLLING_IMPORT_IMPORT_FROM,
  ROLLING_IMPORT_LIVE_DOMAIN,
  ROLLING_IMPORT_ENABLE_DEBUG_LOGS,
  ROLLING_IMPORT_POLL_LOGS_FROM_REPO,
  USE_LOCAL_DEBUG_ENTRIES
} = env;

const toOrg = "adobecom";
const toRepo = process.env.ROLLING_IMPORT_REPO;

if (!LOCAL_RUN)
  console.log({
    AEM_LIVE_ADMIN_TOKEN: !!AEM_LIVE_ADMIN_TOKEN,
    ROLLING_IMPORT_REPO: !!ROLLING_IMPORT_REPO,
    LOCAL_RUN: !!LOCAL_RUN,
    ROLLING_IMPORT_SLACK: !!ROLLING_IMPORT_SLACK,
    GITHUB_SERVER_URL: !!GITHUB_SERVER_URL,
    GITHUB_RUN_ID: !!GITHUB_RUN_ID,
    LAST_RUN_ISO: !!LAST_RUN_ISO,
    ROLLING_IMPORT_CLIENT_SECRET: !!ROLLING_IMPORT_CLIENT_SECRET,
    ROLLING_IMPORT_CLIENT_ID: !!ROLLING_IMPORT_CLIENT_ID,
    ROLLING_IMPORT_CODE: !!ROLLING_IMPORT_CODE,
    ROLLING_IMPORT_GRANT_TYPE: !!ROLLING_IMPORT_GRANT_TYPE,
    ROLLING_IMPORT_IMS_URL: !!ROLLING_IMPORT_IMS_URL,
    ROLLING_IMPORT_IMPORT_FROM: !!ROLLING_IMPORT_IMPORT_FROM,
    ROLLING_IMPORT_LIVE_DOMAIN: !!ROLLING_IMPORT_LIVE_DOMAIN,
    ROLLING_IMPORT_ENABLE_DEBUG_LOGS: !!ROLLING_IMPORT_ENABLE_DEBUG_LOGS,
    ROLLING_IMPORT_POLL_LOGS_FROM_REPO: !!ROLLING_IMPORT_POLL_LOGS_FROM_REPO,
    USE_LOCAL_DEBUG_ENTRIES: !!USE_LOCAL_DEBUG_ENTRIES,
  });

const queue = new PQueue({ concurrency: 10 });
const FROM_PARAM = LOCAL_RUN
  ? (LAST_RUN_ISO || getISOSinceXDaysAgo(1))
  : encodeURIComponent(LAST_RUN_ISO || getISOSinceXDaysAgo(1));

function getISOSinceXDaysAgo(days) {
  const now = new Date();
  now.setDate(now.getDate() - days);
  //now.setHours(now.getHours() - 4);
  return now.toISOString();
}

function getWorkflowRunUrl() {
  if (GITHUB_SERVER_URL && toRepo && GITHUB_RUN_ID) {
    return `${GITHUB_SERVER_URL}/adobecom/milo/actions/runs/${GITHUB_RUN_ID}`;
  }
  return null;
}

const slackNotification = (text) => {
  console.log(text);
  const workflowUrl = getWorkflowRunUrl();
  let message = `${text}\n• Importer fetched logs from: \`adobecom/${ROLLING_IMPORT_POLL_LOGS_FROM_REPO}\`\n• Importing into: \`adobecom/${ROLLING_IMPORT_REPO}\``;
  if (workflowUrl) {
    message += `\n• <${workflowUrl}|Workflow Run>`;
  }
  return fetch(ROLLING_IMPORT_SLACK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  });
};

/**
 * Fetches logs for a specific site and saves them to a file.
 * @param {string} siteName - The name of the site (e.g., 'da-bacom', 'bacom'). Used for the filename.
 * @param {string} baseUrl - The base URL for the log endpoint (e.g., 'https://admin.hlx.page/log/adobecom/da-bacom/main').
 */
async function fetchLogsForSite(siteName, baseUrl, fromParam) {
  if (LOCAL_DEBUG_ENTRIES.length && USE_LOCAL_DEBUG_ENTRIES) {
    console.log('Using local entries from LOCAL_DEBUG_ENTRIES.js');
    return LOCAL_DEBUG_ENTRIES;
  }

  console.log(`Fetching logs for site: ${siteName} from ${baseUrl}...`);
  const initialUrl = `${baseUrl}?from=${fromParam}`;
  const entries = [];
  let totalFetched = 0;

  try {
    let nextUrl = initialUrl;
    let requestCount = 0;
    const maxRequests = 1000; // Safety break

    while (nextUrl && requestCount < maxRequests) {
      requestCount++;
      console.log(`Fetching page ${requestCount} for ${siteName}: ${nextUrl}`);
      const request = await fetch(nextUrl, {
        method: 'GET',
        headers: {
          Authorization: `token ${env.AEM_LIVE_ADMIN_TOKEN}`,
        },
      });

      if (!request.ok) {
        console.error(
          `Error fetching logs for ${siteName}: ${request.status} ${request.statusText}`
        );
        const errorBody = await request.text();
        console.error(`Response body: ${errorBody}`);
        throw new Error(`Failed to fetch logs: ${request.status}`);
      }

      const json = await request.json();

      if (json.entries && json.entries.length > 0) {
        entries.push(...json.entries);
        totalFetched += json.entries.length;
        console.log(
          `Fetched ${json.entries.length} entries for ${siteName}. Total: ${totalFetched}`
        );
      } else {
        console.log(
          `No new entries found on page ${requestCount} for ${siteName}.`
        );
      }

      nextUrl = json.links?.next;
      if (!nextUrl) {
        console.log(`No more pages found for ${siteName}.`);
        break;
      }
    }

    if (requestCount >= maxRequests) {
      console.warn(
        `Warning: Reached maximum request limit (${maxRequests}) for ${siteName}. Log data might be incomplete.`
      );
    }

    if (LOCAL_RUN) {
      // Save entries for local debugging as a JS file with a default export
      fs.writeFileSync(
        '.github/workflows/import/LOCAL_DEBUG_ENTRIES.js',
        `export default ${JSON.stringify(
          entries.map((entry) => ({
            path: entry.path,
            route: entry.route,
            paths: entry.paths,
          })),
          null,
          2
        )};\n`
      );
    }

    return entries;
  } catch (err) {
    console.error(`Error fetching or writing logs for site ${siteName}:`, err);
    throw err; // Re-throw error
  }
}

async function getLivePaths(entries, logLink) {
  const livePaths = Array.from(
    new Set(
      entries
        .filter((entry) => entry.route === 'live')
        .flatMap((log) => [
          log.path,
          ...(Array.isArray(log.paths) ? log.paths : []),
        ])
        .filter(Boolean)
    )
  );
  if(LOCAL_RUN) {
    console.log("Live paths found: ", livePaths.length);
  } else {
    await slackNotification(
      `Importing ${livePaths.length} published documents from ${entries.length} log entries. ${logLink}`,
    );
  }
  if (livePaths.length < 10 && !LOCAL_RUN)
    console.log(
      'First 10 paths to import:\n' + livePaths.slice(0, 10).join('\n')
    );
  return livePaths;
}

const saveLivePaths = (livePaths) => {
  fs.writeFileSync(".github/workflows/import/importingPaths.js", livePaths.join('\n'));
}

async function main() {
  await getImsToken();
  const entries = await fetchLogsForSite(
    ROLLING_IMPORT_POLL_LOGS_FROM_REPO,
    `https://admin.hlx.page/log/adobecom/${ROLLING_IMPORT_POLL_LOGS_FROM_REPO}`,
    FROM_PARAM
  );
  const logLink = `Log Link: https://admin.hlx.page/log/adobecom/${ROLLING_IMPORT_POLL_LOGS_FROM_REPO}?from=${FROM_PARAM}`
  if(!entries?.length) {
    console.log(`No entries found in the logs, exiting. ${logLink}`);
    await slackNotification(`No entries found, exiting ${logLink}`);
    return;
  }
  const livePaths = await getLivePaths(entries, logLink);
  const importedMedia = new Set();
  let result = {
    success: 0,
    error: 0,
    errorPaths: [],
    successPaths: [],
  };
  if(LOCAL_RUN) saveLivePaths(livePaths)
  for (const path of livePaths) {
    queue.add(() =>
      importUrl(path, importedMedia)
        .then(() => {
          result.success++;
          result.successPaths.push(path);
          if (result.success % 20 === 0)
            console.log(
              `Progress: Success: ${result.success} | Error: ${result.error}`
            );
            
        })
        .catch(() => {
          result.error++;
          result.errorPaths.push(path);
          if (result.error % 10 === 0)
            console.log(
              `Progress: Success: ${result.success} | Error: ${result.error}`
            );
          
        })
    );
  }
  await queue.onIdle();
  if (!LOCAL_RUN) {
    await slackNotification(
      `Succcessful: ${result.success} paths | Failed: ${result.error} paths.`
    );
  }
  result.successPaths.slice(0, 500).forEach((path) => {
    console.log(`Successful import, live-link: https://main--${toRepo}--${toOrg}.aem.live${path}`);
  });
  result.errorPaths.slice(0, 500).forEach((path) => {
    console.log(`Erroring path: ${path}`);
  });
}

main().catch(async (e) => {
  console.error(e);
  await slackNotification(
    `Fatal error during importer run. Error message: ${e.message}`
  );
  exit(1);
});
