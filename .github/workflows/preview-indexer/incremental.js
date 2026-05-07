import PQueue from 'p-queue';
import { getLingoConfigMap } from './internal/utils.js';
import { initIndexer } from './internal/indexer.js';
import { saveJsonToDa, getJsonFromDa } from './internal/da-client.js';

const ORG = 'adobecom';

const { env } = process;
const {
  PREVIEW_INDEXER_REPOS,
  SITE_REGION_PATHS,
  SITE,
} = env;

const reposToProcess = PREVIEW_INDEXER_REPOS.split(',').map((path) => path.trim()).filter(Boolean);
const lingoConfigMap = await getLingoConfigMap();

const queue = new PQueue({ concurrency: Number(process.env.PREVIEW_INDEXER_CONCURRENCY || '1') });
const filteredRepos = reposToProcess.filter((repo) => !SITE || repo === SITE);
const errors = [];

for (const repo of filteredRepos) {
  await queue.add(async () => {
    console.log(`Initiating incremental index for ${ORG}/${repo}`);
    try {
      const indexer = await initIndexer(
        ORG,
        repo,
        lingoConfigMap,
        {
          savePreviewIndexJson: saveJsonToDa,
          getPreviewIndexJson: getJsonFromDa,
        }
      );
      const siteRegionPaths = indexer.normalizeRegionPaths(SITE_REGION_PATHS);
      return indexer.incremental(siteRegionPaths);
    } catch (error) {
      console.error(`Error initiating incremental index for ${ORG}/${repo}: ${error}`);
      errors.push(`${ORG}/${repo}: ${error}`);
    }
    return {};
  });
}

await queue.onIdle();

console.log('All repos processed');

if (errors.length > 0) {
  throw new Error(`Errors occurred during incremental indexing:\n${errors.join('\n')}`);
}
