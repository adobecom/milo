import axios from 'axios';
import axiosRetry from 'axios-retry';
import ExcelJS from 'exceljs';

const RETRY_DELAY = Number(process.env.INDEXER_RETRY_DELAY || '5');
const RETRY_ATTEMPTS = Number(process.env.INDEXER_RETRY_ATTEMPTS || '4');

export async function getPreviewExcel(paths = []) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('shared-default');
    worksheet.columns = [
    { header: 'Path', key: 'path', width: 100 }
  ];
  paths.forEach((path) => {
    worksheet.addRow({ path });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export function createAxiosWithRetry() {
  const axiosWithRetry = axios.create();
  axiosRetry(axiosWithRetry, {
    retries: RETRY_ATTEMPTS,
    retryDelay: (retryCount, error) => {
      console.log(`Retry attempt ${retryCount}`);
      let retryAfter = RETRY_DELAY * 1000 * 2 ** (retryCount - 1);
      const respHeaders = error?.response?.headers;
      const retryAfterHeader = Number(respHeaders?.['retry-after']  || respHeaders?.['X-Rate-Limit-Retry-After-Seconds'] || '');
      if (retryAfterHeader && !Number.isNaN(retryAfterHeader)) {
        retryAfter = Number(retryAfterHeader) * 1000;
      }
      console.log(`Delay of ${retryAfter}ms`);
      return retryAfter;
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
    console.error('LINGO_CONFIG is not set');
    return {};
  }
  try {
    const lingoConfig = await axiosWithRetry.get(LINGO_CONFIG, { headers: { 'Content-Type': 'application/json' } });
    const lingoConfigMap = {};
    const siteLocalesData = lingoConfig?.data?.['site-locales']?.data;
    if (siteLocalesData && Array.isArray(siteLocalesData)) {
      siteLocalesData.forEach((entry) => {
        const { uniqueSiteId, regionalSites } = entry;
        if (!uniqueSiteId) return;

        if (!lingoConfigMap[uniqueSiteId]) {
          lingoConfigMap[uniqueSiteId] = [];
        }

        if (regionalSites && regionalSites.trim()) {
          const sites = regionalSites
            .split(',')
            .map((site) => `${site.trim()}/`.replace(/\/+$/, '/'))
            .filter(Boolean);
            lingoConfigMap[uniqueSiteId].push(...sites);
        }
      });
    }
    return lingoConfigMap;
  } catch (error) {
    console.error(`Failed to load lingo config: ${error.message} ${error.response?.status} - ${error.response?.statusText}`);
    return {};
  }
}

export const DA_ORIGIN = 'https://admin.da.live';
