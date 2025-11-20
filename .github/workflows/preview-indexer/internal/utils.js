import axios from 'axios';
import axiosRetry from 'axios-retry';

const RETRY_DELAY = Number(process.env.INDEXER_RETRY_DELAY || '5');
const RETRY_ATTEMPTS = Number(process.env.INDEXER_RETRY_ATTEMPTS || '4');

export function createAxiosWithRetry() {
  const axiosWithRetry = axios.create();
  axiosRetry(axiosWithRetry, {
    retries: RETRY_ATTEMPTS,
    retryDelay: (retryCount) => {
      console.log(`Retry attempt ${retryCount} - waiting ${RETRY_DELAY * 2 ** (retryCount - 1)}ms`);
      return RETRY_DELAY * 2 ** (retryCount - 1);
    },
    retryCondition: (error) => {
      const status = error.response?.status;
      const shouldRetry = [429, 500, 502, 503, 504].includes(status);
      if (shouldRetry) {
        console.log(`Request failed with status ${status}, will retry`);
      }
      return shouldRetry;
    },
  });
  return axiosWithRetry;
}

const axiosWithRetry = createAxiosWithRetry();

export async function getLingoConfigMap() {
  const { LINGO_CONFIG } = process.env;
  if (!LINGO_CONFIG) {
    return {};
  }
  try {
    const lingoConfig = await axiosWithRetry.get(LINGO_CONFIG, { headers: { 'Content-Type': 'application/json' } });
    const lingoConfigMap = Object.fromEntries(
      ['bacom-site-map'].map((key) => {
        const configData = lingoConfig?.data?.[key]?.data;
        if (!configData || !Array.isArray(configData)) {
          console.warn(`No data found for key: ${key} in lingo config`);
          return [key, []];
        }

        const regionalPaths = configData
          .flatMap((d) => {
            const regionalSites = d?.['regional-sites'];
            if (!regionalSites) {
              return [];
            }
            return regionalSites
              .split(',')
              .map((p) => `${p.trim()}/`)
              .filter(Boolean);
          });

        return [key, regionalPaths];
      }),
    );
    return lingoConfigMap;
  } catch (error) {
    console.error(`Failed to load lingo config: ${error.message} ${error.response?.status} - ${error.response?.statusText}`);
    return {};
  }
}

export const DA_ORIGIN = 'https://admin.da.live';
