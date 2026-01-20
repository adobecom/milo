import PQueue from 'p-queue';
import { getLingoConfigMap } from './internal/utils.js';
import { initIndexer } from './internal/indexer.js';
import SPClient from './internal/sp-client.js';

const { env } = process;
const {
  PREVIEW_INDEXER_ORG,
  PREVIEW_INDEXER_SP_REPOS,
  SITE_REGION_PATHS,
  SITE,
} = env;

const ORG = PREVIEW_INDEXER_ORG || 'adobecom';
const reposToProcess = PREVIEW_INDEXER_SP_REPOS.split(',').map((path) => path.trim()).filter(Boolean);
const lingoConfigMap = await getLingoConfigMap();

const queue = new PQueue({ concurrency: Number(process.env.PREVIEW_INDEXER_CONCURRENCY_SP || '1') });
const filteredRepos = reposToProcess.filter((repo) => !SITE || repo === SITE);

for (const repo of filteredRepos) {
  await queue.add(async () => {
    console.log(`Initiating incremental index for ${ORG}/${repo}`);
    const spClient = new SPClient(ORG, repo);
    await spClient.init();
    const indexer = await initIndexer(
      ORG,
      repo,
      lingoConfigMap,
      {
        savePreviewIndexJson: async (_, __, pathname, data) => {
          return spClient.uploadPreviewIndex(pathname, data)
        },
        getPreviewIndexJson: async (_, __, pathname) => {
          return spClient.getPreviewIndexJson(pathname);
        }
      }  
    );
    const siteRegionPaths = indexer.normalizeRegionPaths(SITE_REGION_PATHS);
    return indexer.incremental(siteRegionPaths);
  });
}

await queue.onIdle();

console.log('All repos processed');
