import { initIndexer } from './internal/indexer.js';
import { getLingoConfigMap } from './internal/utils.js';

const { env } = process;
const {
  PREVIEW_INDEXER_ORG,
  PREVIEW_INDEXER_REPOS,
  SITE,
  SITE_REGION_PATHS,
} = env;

const ORG = PREVIEW_INDEXER_ORG || 'adobecom';

const siteToProcess = PREVIEW_INDEXER_REPOS?.split(',').map((path) => path.trim()).find((p) => p === SITE);
const siteRegionPaths = SITE_REGION_PATHS?.split(',').map((path) => path.trim()).filter(Boolean);
const lingoConfigMap = await getLingoConfigMap();

if (siteToProcess) {
  const indexer = await initIndexer(ORG, siteToProcess, lingoConfigMap);
  await indexer.full(siteRegionPaths);
} else {
  console.error('Mandatory fields are missing: site and siteRegionPaths');
  throw new Error('Mandatory fields are missing: site and siteRegionPaths');
}

console.log('Full index completed');
