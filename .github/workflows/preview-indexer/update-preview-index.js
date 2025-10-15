// node --env-file=.env .github/workflows/import/poll-logs.js (node >= 21)
import fs from 'fs';
import { getImsToken, saveJsonToDa } from '../import/daFetch.js';
import { fetchLogsForSite, triggerPreview } from '../import/helix-client.js';
const previewJsonTemplate = {
	total: 0,
	limit: 0,
	offset: 0,
	data: [
	],
	":colWidths": [
		200
	],
	':sheetname': 'data',
	':type': 'sheet'
}

const { env, exit } = process;
const {
  AEM_LIVE_ADMIN_TOKEN,
  PREVIEW_INDEXER_REPO,
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
  USE_LOCAL_DEBUG_ENTRIES,
} = env;

const siteOrg = "adobecom";
const siteRepo = process.env.PREVIEW_INDEXER_REPO;
const EXCLUDE_PREVIEW_PATHS_KEY = `EXCLUDE_PREVIEW_PATHS_${siteOrg}_${siteRepo}`.toUpperCase();
const excludePathsStr = process.env[EXCLUDE_PREVIEW_PATHS_KEY] || '';
const excludePaths = excludePathsStr.split(',').map(path => path.trim()).filter(Boolean);
excludePaths.push('/target-preview/');

const PREVIEW_ROOTS_KEY = `PREVIEW_ROOTS_${siteOrg}_${siteRepo}`.toUpperCase();
const previewRootsKey = process.env[PREVIEW_ROOTS_KEY] || '';
const previewRoots = previewRootsKey.split(',').filter(path => /^\/.*\/$/.test(path.trim())).map(path => path.trim()).filter(Boolean);

// Create an OR regex from the excludePaths array
const excludePathsRegex = excludePaths.length
  ? new RegExp(excludePaths.map(path => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'))
  : null;

if (!LOCAL_RUN)
  console.log({
    AEM_LIVE_ADMIN_TOKEN: !!AEM_LIVE_ADMIN_TOKEN,
    PREVIEW_INDEXER_REPO: !!PREVIEW_INDEXER_REPO,
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
    ROLLING_IMPORT_ENABLE_DEBUG_LOGS: !!ROLLING_IMPORT_ENABLE_DEBUG_LOGS,
    USE_LOCAL_DEBUG_ENTRIES: !!USE_LOCAL_DEBUG_ENTRIES,
    EXCLUDE_PREVIEW_PATHS: !!excludePathsStr,
  });

function getISOSinceXDaysAgo(days) {
  const now = new Date();
  now.setDate(now.getDate() - days);
  //now.setHours(now.getHours() - 4);
  return now.toISOString();
}

  
const FROM_PARAM = LOCAL_RUN ? 
  (LAST_RUN_ISO || getISOSinceXDaysAgo(1))
  : encodeURIComponent(LAST_RUN_ISO || getISOSinceXDaysAgo(1));

function getWorkflowRunUrl() {
  if (GITHUB_SERVER_URL && GITHUB_RUN_ID) {
    return `${GITHUB_SERVER_URL}/${siteOrg}/milo/actions/runs/${GITHUB_RUN_ID}`;
  }
  return null;
}

// TODO: Add Slack Notifications
const slackNotification = (text) => {
  console.log(text);
  const workflowUrl = getWorkflowRunUrl();
  let message = `${text}\n• Importer fetched logs from: \`${siteOrg}/${siteRepo}\`\n• Importing into: \`${siteOrg}/${PREVIEW_INDEXER_REPO}\``;
  if (workflowUrl) {
    message += `\n• <${workflowUrl}|Workflow Run>`;
  }
  return {};
};

async function getPreviewPaths(entries, logLink) {
  const previewPaths = Array.from(
    new Set(
      entries
        .filter((entry) => entry.method === 'POST' && entry.route === 'preview')
        .flatMap((log) => [
          log.path,
          ...(Array.isArray(log.paths) ? log.paths : []),
        ])
        .filter(Boolean)
    )
  );
  if(LOCAL_RUN) {
    console.log("Live paths found: ", previewPaths.length);
  } else {
    await slackNotification(
      `Importing ${previewPaths.length} published documents from ${entries.length} log entries. ${logLink}`,
    );
  }
  if (previewPaths.length < 10 && !LOCAL_RUN)
    console.log(
      'First 10 paths to import:\n' + previewPaths.slice(0, 10).join('\n')
    );
  return previewPaths;
}

const savePreviewPaths = (previewPaths) => {
  fs.writeFileSync(".github/workflows/preview-indexer/preview-paths-for-index.js", previewPaths.join('\n'));
}

async function main() {
  if (!previewRoots.length) {
    await slackNotification(`No preview roots are not setup for ${siteOrg}/${siteRepo}`);
    return;
  }
  await getImsToken();
  const TO_PARAM = process.env.LAST_RUN_ISO_TO || new Date().toISOString();
  const entries = await fetchLogsForSite(
    siteRepo,
    `https://admin.hlx.page/log/${siteOrg}/${siteRepo}`,
    FROM_PARAM,
    TO_PARAM
  );
  const logLink = `Log Link: https://admin.hlx.page/log/${siteOrg}/${siteRepo}?from=${FROM_PARAM}&to=${TO_PARAM}`;
  if(!entries?.length) {
    console.log(`No entries found in the logs, exiting. ${logLink}`);
    await slackNotification(`No entries found, exiting ${logLink}`);
    return;
  }
  const previewPaths = await getPreviewPaths(entries, logLink);

  // Filter paths
  const filteredPreviewPaths = previewPaths.filter((path) => !excludePathsRegex?.test(path));
  // Accumulate paths per region
  const previewPathsPerRoot = previewRoots.reduce((acc, root) => {
    const paths = filteredPreviewPaths.filter((path) => path.startsWith(root))
    if (paths) {
      const suffix = root.replace(/^\/|\/$/g, '').replaceAll('/', '-').replaceAll('_', '-');
      acc.push({
        indexPath: `/drafts/raga/index-files/preview-index-${suffix}`,
        indexPreviewPath: `/drafts/raga/index-files/preview-index-${suffix}.json`,
        paths: filteredPreviewPaths.filter((path) => path.startsWith(root))
      });
    }
    return acc;
  }, []);
  // Save paths per region 
  await savePreviewPaths(JSON.stringify(previewPathsPerRoot));

  previewPathsPerRoot.reduce(async (acc, root) => {
    await acc;
    const previewIndex = { ...previewJsonTemplate, total: root.paths.length, limit: root.paths.length, data: root.paths.map((path) => ({ Path: path })) };
    const result = await saveJsonToDa(siteOrg, siteRepo, root.indexPath, previewIndex);
    console.log(`Preview index saved to DA at ${result.daHref} with ${JSON.stringify(result)}`);
    const previewResult = await triggerPreview(siteOrg, siteRepo, root.indexPreviewPath);
    console.log(`Preview result: ${JSON.stringify(previewResult)}`);
    return acc;
  }, []);

  if (!LOCAL_RUN) {
    await slackNotification(
      `Succcessful: ${result.success} paths | Failed: ${result.error} paths.`
    );
  }
}

main().catch(async (e) => {
  console.error(e);
  await slackNotification(
    `Fatal error during importer run. Error message: ${e.message}`
  );
  exit(1);
});
