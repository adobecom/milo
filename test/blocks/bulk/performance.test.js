import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

import {
  ADMIN_BASE_URL,
  BULK_CONFIG_FILE_PATH,
  executeActions,
} from '../../../libs/blocks/bulk/utils.js';

const TEST_TIMEOUT_MS = 3 * 60 * 1000;
const ORIGIN = 'https://main--milo--adobecom.hlx.page';
const PAGE_PATH = '/test/features/test-page-for-bulk-publishing-tool';
const PAGE_URL = `${ORIGIN}${PAGE_PATH}`;

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
  const { hostname, pathname } = new URL(PAGE_URL);
  const [branch, repo, owner] = hostname.split('.')[0].split('--');
  const adminUrl = `${ADMIN_BASE_URL}/preview/${owner}/${repo}/${branch}${pathname}`;
  const options = { method: 'POST', signal: controller.signal };
  window.fetch.withArgs(adminUrl, options).returns(
    ogFetch(adminUrl, options),
  );
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
   * Set 'urlsAmount' to 1000 and run the test to measure the time it took.
   * Performance history:
   * - on 06/apr/2023: Previewing 1000 pages took: 106 s
   */
  it('Performance test: previewing 1000 URLs', async () => {
    localStorage.clear();
    const actions = ['preview'];
    const urlsAmount = 10;
    const urls = [];
    for (let i = 0; i < urlsAmount; i += 1) {
      urls[i] = PAGE_URL;
    }
    const start = Date.now();
    const results = await executeActions(actions, urls, () => {});
    const end = Date.now();
    const duration = Math.round((end - start) / 1000);
    console.log(`Previewing ${urlsAmount} pages took: ${duration} s`);
    results.forEach((result) => {
      expect(result.status.preview).equals(200);
      expect(result.url).equals(PAGE_URL);
    });
  }).timeout(TEST_TIMEOUT_MS);
});
