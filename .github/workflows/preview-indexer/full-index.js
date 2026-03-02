import { initIndexer } from './internal/indexer.js';
import { getLingoConfigMap } from './internal/utils.js';
import { saveJsonToDa, getJsonFromDa } from './internal/da-client.js';

const { env } = process;
const {
  PREVIEW_INDEXER_ORG,
  PREVIEW_INDEXER_REPOS,
  SITE,
  SITE_REGION_PATHS,
} = env;

const ORG = PREVIEW_INDEXER_ORG || 'adobecom';

const siteToProcess = PREVIEW_INDEXER_REPOS?.split(',').map((path) => path.trim()).find((p) => p === SITE);
const lingoConfigMap = await getLingoConfigMap();

if (siteToProcess) {
  const indexer = await initIndexer(
    ORG,
    siteToProcess,
    lingoConfigMap,
    {
      savePreviewIndexJson: saveJsonToDa,
      getPreviewIndexJson: getJsonFromDa
    }
  );
  const siteRegionPaths = indexer.normalizeRegionPaths(SITE_REGION_PATHS);
  await indexer.full(siteRegionPaths);
} else {
  console.error('Mandatory fields are missing: site and siteRegionPaths');
  throw new Error('Mandatory fields are missing: site and siteRegionPaths');
}

console.log('Full index completed');
