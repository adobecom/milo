import fs from 'fs';
import LOCAL_DEBUG_ENTRIES from './LOCAL_DEBUG_ENTRIES.js';

const {
  AEM_LIVE_ADMIN_TOKEN = '',
  USE_LOCAL_DEBUG_ENTRIES = '',
  LOCAL_RUN = '',
} = process.env;

if (!LOCAL_RUN) {
  console.log({
    AEM_LIVE_ADMIN_TOKEN: !!AEM_LIVE_ADMIN_TOKEN,
    USE_LOCAL_DEBUG_ENTRIES: !!USE_LOCAL_DEBUG_ENTRIES,
  });
}

/**
 * Fetches logs for a specific site and saves them to a file.
 * @param {string} siteName - The name of the site (e.g., 'da-bacom', 'bacom'). Used for the filename.
 * @param {string} baseUrl - The base URL for the log endpoint (e.g., 'https://admin.hlx.page/log/adobecom/da-bacom/main').
 */
async function fetchLogsForSite(siteName, baseUrl, fromParam, toParam) {
  if (LOCAL_DEBUG_ENTRIES.length && USE_LOCAL_DEBUG_ENTRIES) {
    console.log('Using local entries from LOCAL_DEBUG_ENTRIES.js');
    return LOCAL_DEBUG_ENTRIES;
  }

  console.log(`Fetching logs for site: ${siteName} from ${baseUrl}...`);
  const initialUrl = `${baseUrl}?from=${fromParam}&to=${toParam}`;
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
          Authorization: `token ${AEM_LIVE_ADMIN_TOKEN}`,
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


async function triggerPreview(owner, repo, path) {
  console.log(`previewing path: ${owner}/${repo}/main${path}`);
  try {
    const url = `https://admin.hlx.page/preview/${owner}/${repo}/main${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `token ${AEM_LIVE_ADMIN_TOKEN}`,
      },
    });
    if (!response.ok) {
      console.error(`Failed to preview path: ${owner}/${repo}/main${path}`);
      throw new Error(`Failed to preview path: ${owner}/${repo}/main${path}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error previewing path: ${owner}/${repo}/main${path}`, error);
  }
  return null;
}


export { fetchLogsForSite, triggerPreview };