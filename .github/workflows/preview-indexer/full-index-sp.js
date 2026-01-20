import { initIndexer } from './internal/indexer.js';
import { getLingoConfigMap } from './internal/utils.js';
import SPClient from './internal/sp-client.js';

const { env } = process;
const {
  PREVIEW_INDEXER_ORG,
  PREVIEW_INDEXER_SP_REPOS,
  SITE,
  SITE_REGION_PATHS,
} = env;

const ORG = PREVIEW_INDEXER_ORG || 'adobecom';

const siteToProcess = PREVIEW_INDEXER_SP_REPOS?.split(',').map((path) => path.trim()).find((p) => p === SITE);
const lingoConfigMap = await getLingoConfigMap();

if (siteToProcess) {
  const spClient = new SPClient(ORG, siteToProcess);
  await spClient.init();
  const indexer = await initIndexer(
    ORG,
    siteToProcess,
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
  await indexer.full(siteRegionPaths);
  console.log(`Full index completed for ${ORG}/${siteToProcess}`);
} else {
  console.error('Mandatory fields are missing: site and siteRegionPaths');
  throw new Error('Mandatory fields are missing: site and siteRegionPaths');
}
