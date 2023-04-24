import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

import {
  ADMIN_BASE_URL,
  BULK_CONFIG_FILE_PATH,
  executeActions, storeOperation, storeUrls,
} from '../../../tools/bulk-publish/js/utils.js';

const TEST_TIMEOUT_MS = 30 * 60 * 1000;
const ORIGIN = 'https://main--milo--adobecom.hlx.page';
const BASE_PAGE_PATH = '/drafts/jck/bulk-publish/test/test';
const BASE_PAGE_URL = `${ORIGIN}${BASE_PAGE_PATH}`;
const URLS_AMOUNT = 10;

const ogFetch = window.fetch;
window.fetch = stub();

const mockBulkConfigJson = {
  sites: {
    data: [
      { origin: ORIGIN },
    ],
  },
};

const stubFetchForBulkConfig = () => {
  window.fetch.withArgs(BULK_CONFIG_FILE_PATH).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockBulkConfigJson,
      });
    }),
  );
};

const unstubFetchForAdminAPI = () => {
  const controller = new AbortController();
  const options = { method: 'POST', signal: controller.signal };
  for (let i = 0; i < URLS_AMOUNT; i += 1) {
    const { hostname, pathname } = new URL(`${BASE_PAGE_URL}-${i}`);
    const [branch, repo, owner] = hostname.split('.')[0].split('--');
    const adminUrl = `${ADMIN_BASE_URL}/preview/${owner}/${repo}/${branch}${pathname}`;
    window.fetch.withArgs(adminUrl, options).returns(
      ogFetch(adminUrl, options),
    );
  }
};

const restoreFetch = () => {
  window.fetch = ogFetch;
};

describe('Bulk preview and publish', () => {
  before(() => {
    stubFetchForBulkConfig();
    unstubFetchForAdminAPI();
  });
  after(() => {
    restoreFetch();
  });

  /**
   * This test measures the performance of the bulk preview/publish tool.
   * Set 'URLS_AMOUNT' to 1000 and run the test to measure the time it took.
   * Performance history:
   * - on 21/apr/2023: Previewing 1000 pages took: 115 s
   */
  it.skip('Performance test: previewing 1000 URLs', async () => {
    localStorage.clear();
    const operation = 'preview';
    const urls = [];
    for (let i = 0; i < URLS_AMOUNT; i += 1) {
      urls[i] = `${BASE_PAGE_URL}-${i}`;
    }
    storeUrls(urls);
    storeOperation(operation);
    const start = Date.now();
    const results = await executeActions(false, () => {});
    const end = Date.now();
    const duration = Math.round((end - start) / 1000);
    console.log(`Previewing ${URLS_AMOUNT} pages took: ${duration} s`);
    results.forEach((result, i) => {
      expect(result.status.preview).equals(200, 'status.preview is not 404');
      expect(result.url).equals(`${BASE_PAGE_URL}-${i}`, 'result.url is not PAGE_URL');
    });
  }).timeout(TEST_TIMEOUT_MS);
});
