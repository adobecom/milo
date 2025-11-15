// node --env-file=.env .github/workflows/preview-indexer/incremental.js (node >= 21)
import { getImsToken, saveJsonToDa, getJsonFromDa } from './da-client.js';
import { fetchLogsForSite, getSiteEnvKey, triggerPreview, getPreviewPathsForRegion } from './helix-client.js';
import { getLastRunInfo, saveLastRuns } from './indexer-state.js';
import SiteConfig from './site-config.js';

const previewJsonTemplate = {
  total: 0,
  limit: 0,
  offset: 0,
  data: [
  ],
  ':colWidths': [
    200,
  ],
  ':sheetname': 'data',
  ':type': 'sheet',
};

const { env } = process;
const {
  LOCAL_RUN,
  ROLLING_IMPORT_SLACK,
  GITHUB_SERVER_URL,
  GITHUB_RUN_ID,
  LAST_RUN_ISO_FROM,
  LAST_RUN_ISO_TO,
  SITE_REGION_PATHS,
} = env;

const initIndexer = async (siteOrg, siteRepo, lingoConfigMap) => {
  const self = {};

  // Initialize site configuration
  const config = SiteConfig(siteOrg, siteRepo, lingoConfigMap);
  const orgWithRepo = getSiteEnvKey(siteOrg, siteRepo);

  function getISOSinceXDaysAgo(days) {
    const now = new Date();
    now.setDate(now.getDate() - days);
    return now.toISOString();
  }

  function getWorkflowRunUrl() {
    if (GITHUB_SERVER_URL && GITHUB_RUN_ID) {
      return `${GITHUB_SERVER_URL}/${siteOrg}/milo/actions/runs/${GITHUB_RUN_ID}`;
    }
    return null;
  }

  // TODO: Add Slack Notifications
  const slackNotification = async (text) => {
    console.log(text);
    if (!LOCAL_RUN) {
      console.log(`Slack info: ${ROLLING_IMPORT_SLACK}`);
      const workflowUrl = getWorkflowRunUrl();
      if (workflowUrl) {
        // Future: Send slack notification with workflowUrl
      }
    }
    return {};
  };

  async function getPreviewPaths(entries) {
    const previewPaths = Array.from(
      new Set(
        entries
          .filter((entry) => entry.method === 'POST' && entry.route === 'preview')
          .flatMap((log) => [
            log.path,
            ...(Array.isArray(log.paths) ? log.paths : []),
          ]),
      ),
    );
    return previewPaths;
  }

  self.incremental = async () => {
    // Filter preview roots by requested regions
    const siteRegionPaths = SITE_REGION_PATHS?.split(',')
      .map((path) => path.trim()).filter(Boolean);
    const previewRoots = config.filterPreviewRoots(siteRegionPaths);

    // Validate configuration
    const validationError = config.getValidationError();
    if (validationError || !previewRoots.length) {
      await slackNotification(validationError || `No preview roots to process for ${siteOrg}/${siteRepo}`);
      return;
    }
    await getImsToken();
    const lastRunInfo = await getLastRunInfo(orgWithRepo);
    const fromParam = LAST_RUN_ISO_FROM || lastRunInfo?.lastRunISO || getISOSinceXDaysAgo(1);
    console.log(`Last run used: ${fromParam}. Last run from cache: ${lastRunInfo?.lastRunISO}`);
    const toParam = LAST_RUN_ISO_TO || new Date().toISOString();
    const logsResult = await fetchLogsForSite(
      siteOrg,
      siteRepo,
      fromParam,
      toParam,
    );
    const entries = logsResult?.entries || [];
    if (!entries?.length) {
      console.log(`No entries found, exiting for ${siteOrg}/${siteRepo} at ${toParam}.`);
      return;
    }
    const previewPaths = await getPreviewPaths(entries);

    const hasNoExtension = (path) => !/\.[^/]+$/.test(path);
    const notExcluded = (path) => !config.excludePathsRegex?.test(path);
    const filteredPreviewPaths = previewPaths.filter(
      (path) => hasNoExtension(path) && notExcluded(path),
    );

    const pathExtn = config.getPreviewPathExtension();
    const previewPathsPerRoot = previewRoots.reduce((acc, root) => {
      const paths = filteredPreviewPaths.filter((path) => path.startsWith(root));
      if (paths.length) {
        const indexPath = config.getIndexPath(root);
        acc.push({
          indexPath,
          indexPreviewPath: `${indexPath}.json`,
          paths: paths.map((path) => `${path}${pathExtn}`),
        });
      }
      return acc;
    }, []);

    for (const root of previewPathsPerRoot) {
      const currentData = await getJsonFromDa(siteOrg, siteRepo, root.indexPath);
      let previewIndex = { ...previewJsonTemplate };
      if (currentData?.data?.length) {
        const mergedSet = new Set(currentData.data.map((item) => item.Path));
        root.paths.forEach((path) => {
          mergedSet.add(path);
        });
        const mergedData = [...mergedSet].map((path) => ({ Path: path }));
        const { length } = mergedData;
        previewIndex = { ...previewIndex, total: length, limit: length, data: mergedData };
      } else {
        const pathData = root.paths.map((path) => ({ Path: path }));
        const { length } = root.paths;
        previewIndex = { ...previewIndex, total: length, limit: length, data: pathData };
      }
      const result = await saveJsonToDa(siteOrg, siteRepo, root.indexPath, previewIndex);
      console.log(`Preview index saved to DA at ${result.daHref}`);
      const previewResult = await triggerPreview(siteOrg, siteRepo, root.indexPreviewPath);
      console.log(`Preview result: ${previewResult?.preview?.url}`);
    }

    // Save the checkpoint for the next run only if its not a manual trigger.
    if (!LAST_RUN_ISO_TO) {
      await saveLastRuns(orgWithRepo, { lastRunISO: toParam });
    }

    await slackNotification(
      `Successful: Incremental index for ${siteOrg}/${siteRepo}.`,
    );
  };

  self.full = async (regionPaths) => {
    const previewRoots = config.filterPreviewRoots(regionPaths);
    const validationError = config.getValidationError();
    if (validationError || !previewRoots.length) {
      await slackNotification(validationError || `No preview roots to process for ${siteOrg}/${siteRepo}`);
      return;
    }

    await getImsToken();

    for (const [regionIndex, root] of previewRoots.entries()) {
      const msg = `Processing region ${regionIndex + 1} of ${previewRoots.length}`;
      console.log(`${msg} for ${siteOrg}/${siteRepo} with root ${root}`);

      const indexPath = config.getIndexPath(root);
      const indexPreviewPath = `${indexPath}.json`;
      const previewPaths = await getPreviewPathsForRegion(siteOrg, siteRepo, root);

      const hasNoExtension = (path) => !/\.[^/]+$/.test(path);
      const notExcluded = (path) => !config.excludePathsRegex?.test(path);
      const pathExtn = config.getPreviewPathExtension();
      const filteredPreviewPaths = (previewPaths?.filter(
        (path) => hasNoExtension(path) && notExcluded(path),
      ) || []).map((path) => `${path}${pathExtn}`);

      const defaultPreviewsPathsJson = await getJsonFromDa(siteOrg, siteRepo, `${indexPath}-default`);
      const defaultPreviewPaths = defaultPreviewsPathsJson?.data?.map?.((item) => item.Path) || [];
      const mergedPreviewPaths = [...defaultPreviewPaths, ...filteredPreviewPaths];
      if (mergedPreviewPaths?.length) {
        let previewIndex = { ...previewJsonTemplate };
        const pathData = mergedPreviewPaths.map((path) => ({ Path: path }));
        const total = mergedPreviewPaths.length;
        previewIndex = { ...previewIndex, total, limit: total, data: pathData };
        const result = await saveJsonToDa(siteOrg, siteRepo, indexPath, previewIndex);
        console.log(`Preview index saved to DA at ${result.daHref} with ${JSON.stringify(result)}`);
        await triggerPreview(siteOrg, siteRepo, indexPreviewPath);
      }
    }
  };

  return self;
};

export default initIndexer;
export { initIndexer };
