import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

import {
  BULK_CONFIG_FILE_PATH,
  BULK_STORED_URL_IDX,
  userIsAuthorized,
  getAuthorizedUsers,
  executeActions,
  getCompletion,
  getStoredOperation,
  getReport,
  sendReport,
  storeUrls,
  storeOperation,
} from '../../../libs/blocks/bulk/utils.js';
import { setLocalStorage } from '../../../libs/blocks/review/utils/localStorageUtils.js';

const EXISTING_PAGE_URL = 'https://main--milo--adobecom.hlx.page/existing';
const NON_EXISTING_PAGE_URL = 'https://main--milo--adobecom.hlx.page/nonexisting';
const NON_EXISTING_REPO_URL = 'https://main--nonexisting--adobecom.hlx.page/';
const URLS = [EXISTING_PAGE_URL, NON_EXISTING_PAGE_URL, NON_EXISTING_REPO_URL];

const ogFetch = window.fetch;
window.fetch = stub();

const mockBulkConfigJson = {
  users: {
    data: [
      { user: 'user1@adobe.com' },
      { user: 'user2@adobe.com' },
      { user: 'anonymous' },
    ],
  },
  sites: {
    data: [
      { origin: 'https://main--milo--adobecom.hlx.page' },
    ],
  },
};

const stubBulkConfig = () => {
  window.fetch.withArgs(BULK_CONFIG_FILE_PATH).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => mockBulkConfigJson,
      });
    }),
  );
};

const stubPreviewExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/preview/adobecom/milo/main/existing';
  window.fetch.withArgs(adminUrl, { method: 'POST', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 200,
      });
    }),
  );
};

const stubPreviewNonExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/preview/adobecom/milo/main/nonexisting';
  window.fetch.withArgs(adminUrl, { method: 'POST', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 404,
      });
    }),
  );
};

const stubPublishExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/live/adobecom/milo/main/existing';
  window.fetch.withArgs(adminUrl, { method: 'POST', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 200,
      });
    }),
  );
};

const stubPublishNonExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/live/adobecom/milo/main/nonexisting';
  window.fetch.withArgs(adminUrl, { method: 'POST', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 404,
      });
    }),
  );
};

const restoreFetch = () => {
  window.fetch = ogFetch;
};

const getArrayWithDeletedProperty = (array, prop) => array.map((item) => {
  delete item[prop];
  return item;
});

describe('Bulk preview and publish', () => {
  before(() => {
    stubBulkConfig();
    stubPreviewExistingPage();
    stubPreviewNonExistingPage();
    stubPublishExistingPage();
    stubPublishNonExistingPage();
  });
  after(() => {
    restoreFetch();
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it('Bulk preview URLs', async () => {
    localStorage.clear();
    const operation = 'preview';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => {});
    const storedOperation = getStoredOperation();
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    await sendReport(results, operation);
    const expectedStoredOperation = {
      completed: true,
      name: 'preview',
      urlIdx: 2,
      urls: [
        'https://main--milo--adobecom.hlx.page/existing',
        'https://main--milo--adobecom.hlx.page/nonexisting',
        'https://main--nonexisting--adobecom.hlx.page/',
      ]
      ,
    };
    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: { preview: 200 },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: { preview: 404 },
      },
      {
        url: NON_EXISTING_REPO_URL,
        status: { preview: 'unsupported domain' },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 3,
        success: 1,
      },
      publish: {
        total: 0,
        success: 0,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Preview',
        domain: 'https://main--milo--adobecom.hlx.page',
        urls: 2,
        success: 1,
      },
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Preview',
        domain: 'https://main--nonexisting--adobecom.hlx.page',
        urls: 1,
        success: 0,
      },
    ];
    expect(results).to.deep.equals(expectedResults, 'results');
    expect(storedOperation).to.deep.equals(expectedStoredOperation, 'stored operation');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk publish URLs', async () => {
    const operation = 'publish';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => {});
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: { publish: 200 },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: { publish: 404 },
      },
      {
        url: NON_EXISTING_REPO_URL,
        status: { publish: 'unsupported domain' },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 0,
        success: 0,
      },
      publish: {
        total: 3,
        success: 1,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Publish',
        domain: 'https://main--milo--adobecom.hlx.page',
        urls: 2,
        success: 1,
      },
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Publish',
        domain: 'https://main--nonexisting--adobecom.hlx.page',
        urls: 1,
        success: 0,
      },
    ];
    expect(results).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk preview and publish URLs', async () => {
    const operation = 'preview&publish';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => {});
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: {
          preview: 200,
          publish: 200,
        },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: {
          preview: 404,
          publish: 404,
        },
      },
      {
        url: NON_EXISTING_REPO_URL,
        status: {
          preview: 'unsupported domain',
          publish: 'unsupported domain',
        },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 3,
        success: 1,
      },
      publish: {
        total: 3,
        success: 1,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Preview & publish',
        domain: 'https://main--milo--adobecom.hlx.page',
        urls: 4,
        success: 2,
      },
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Preview & publish',
        domain: 'https://main--nonexisting--adobecom.hlx.page',
        urls: 2,
        success: 0,
      },
    ];
    expect(results).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk preview and publish URLs: resume at last index', async () => {
    const operation = 'preview&publish';
    storeUrls(URLS);
    storeOperation(operation);
    setLocalStorage(BULK_STORED_URL_IDX, 1);
    const results = await executeActions(true, () => {});
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    const expectedResults = [
      {
        url: NON_EXISTING_REPO_URL,
        status: {
          preview: 'unsupported domain',
          publish: 'unsupported domain',
        },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 1,
        success: 0,
      },
      publish: {
        total: 1,
        success: 0,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Preview & publish',
        domain: 'https://main--nonexisting--adobecom.hlx.page',
        urls: 2,
        success: 0,
      },
    ];
    expect(results).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Verify authorized users', async () => {
    const expectedAuthorizedUsers = ['user1@adobe.com', 'user2@adobe.com', 'anonymous'];
    const authorizedUsers = await getAuthorizedUsers();
    expect(authorizedUsers).to.deep.equals(expectedAuthorizedUsers, 'authorized users');
  });

  it('Verify anonymous user', async () => {
    const authorized = await userIsAuthorized();
    expect(authorized).to.true;
  });
});
