import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

import {
  BULK_CONFIG_FILE_PATH,
  BULK_STORED_URL_IDX,
  executeActions,
  getAuthorizedUsers,
  getCompletion,
  getReport,
  getStoredOperation,
  sendReport,
  storeOperation,
  storeUrls,
  userIsAuthorized,
  getStoredUrlInput,
} from '../../../libs/blocks/bulk-publish/bulk-publish-utils.js';
import { setLocalStorage } from '../../../libs/blocks/utils/utils.js';

const EXISTING_PAGE_URL = 'https://main--milo--adobecom.hlx.page/existing';
const NON_EXISTING_PAGE_URL = 'https://main--milo--adobecom.hlx.page/nonexisting';
const EXISTING_RESOURCE_PAGE_URL = 'https://main--milo--adobecom.hlx.page/existingresource';
const NON_EXISTING_REPO_URL = 'https://main--nonexisting--adobecom.hlx.page/';
const URLS = [EXISTING_PAGE_URL, NON_EXISTING_PAGE_URL, NON_EXISTING_REPO_URL];
const DURLS = [EXISTING_PAGE_URL, NON_EXISTING_PAGE_URL, EXISTING_RESOURCE_PAGE_URL];

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

const stubUnpublishExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/live/adobecom/milo/main/existing';
  window.fetch.withArgs(adminUrl, { method: 'DELETE', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 204,
      });
    }),
  );
};

const stubIndexExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/index/adobecom/milo/main/existing';
  window.fetch.withArgs(adminUrl, { method: 'POST', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 200,
      });
    }),
  );
};

const stubIndexNonExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/index/adobecom/milo/main/nonexisting';
  window.fetch.withArgs(adminUrl, { method: 'POST', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 404,
      });
    }),
  );
};

const stubDeleteExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/preview/adobecom/milo/main/existing';
  window.fetch.withArgs(adminUrl, { method: 'DELETE', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 204,
      });
    }),
  );
};

const stubDeletePageWithExistingResource = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/preview/adobecom/milo/main/existingresource';
  window.fetch.withArgs(adminUrl, { method: 'DELETE', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 403,
      });
    }),
  );
};

const stubUnpublishPageWithExistingResource = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/live/adobecom/milo/main/existingresource';
  window.fetch.withArgs(adminUrl, { method: 'DELETE', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 403,
      });
    }),
  );
};

const stubUnpublishNonExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/live/adobecom/milo/main/nonexisting';
  window.fetch.withArgs(adminUrl, { method: 'DELETE', signal: controller.signal }).returns(
    new Promise((resolve) => {
      resolve({
        ok: true,
        status: 404,
      });
    }),
  );
};

const stubDeleteNonExistingPage = () => {
  const controller = new AbortController();
  const adminUrl = 'https://admin.hlx.page/preview/adobecom/milo/main/nonexisting';
  window.fetch.withArgs(adminUrl, { method: 'DELETE', signal: controller.signal }).returns(
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
    window.fetch = stub();
    stubBulkConfig();
    stubPreviewExistingPage();
    stubPreviewNonExistingPage();
    stubPublishExistingPage();
    stubPublishNonExistingPage();
    stubDeleteExistingPage();
    stubUnpublishExistingPage();
    stubDeleteNonExistingPage();
    stubUnpublishNonExistingPage();
    stubDeletePageWithExistingResource();
    stubUnpublishPageWithExistingResource();
  });
  after(() => {
    restoreFetch();
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it('Bulk preview URLs', async () => {
    const operation = 'preview';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => { });
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
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 0,
        success: 0,
      },
      index: {
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
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(storedOperation).to.deep.equals(expectedStoredOperation, 'stored operation');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk publish URLs', async () => {
    const operation = 'publish';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => { });
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
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 0,
        success: 0,
      },
      index: {
        total: 0,
        success: 0,
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
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk preview and publish URLs', async () => {
    const operation = 'preview&publish';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => { });
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
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 0,
        success: 0,
      },
      index: {
        total: 0,
        success: 0,
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
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk Unpublishes', async () => {
    const operation = 'unpublish';
    storeUrls(DURLS);
    storeOperation(operation);
    const results = await executeActions(false, () => {});
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: { unpublish: 204 },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: { unpublish: 404 },
      },
      {
        url: EXISTING_RESOURCE_PAGE_URL,
        status: { unpublish: 403 },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 0,
        success: 0,
      },
      publish: {
        total: 0,
        success: 0,
      },
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 3,
        success: 1,
      },
      index: {
        total: 0,
        success: 0,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Unpublish',
        domain: 'https://main--milo--adobecom.hlx.page',
        urls: 3,
        success: 1,
      },
    ];
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk Deletes (which also unpublishes)', async () => {
    const operation = 'unpublish&delete';
    storeUrls(DURLS);
    storeOperation(operation);
    const results = await executeActions(false, () => {});
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: {
          unpublish: 204,
          delete: 204,
        },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: {
          unpublish: 404,
          delete: 404,
        },
      },
      {
        url: EXISTING_RESOURCE_PAGE_URL,
        status: {
          unpublish: 403,
          delete: 403,
        },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 0,
        success: 0,
      },
      publish: {
        total: 0,
        success: 0,
      },
      delete: {
        total: 3,
        success: 1,
      },
      unpublish: {
        total: 3,
        success: 1,
      },
      index: {
        total: 0,
        success: 0,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Delete',
        domain: 'https://main--milo--adobecom.hlx.page',
        urls: 6,
        success: 2,
      },
    ];
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk preview and publish URLs: resume at last index', async () => {
    const operation = 'preview&publish';
    storeUrls(URLS);
    storeOperation(operation);
    setLocalStorage(BULK_STORED_URL_IDX, 1);
    const results = await executeActions(true, () => { });
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
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 0,
        success: 0,
      },
      index: {
        total: 0,
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
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
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

describe('Bulk index', () => {
  before(() => {
    window.fetch = stub();
    stubBulkConfig();
    stubIndexExistingPage();
    stubIndexNonExistingPage();
  });
  after(() => {
    restoreFetch();
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it('Bulk index URLs', async () => {
    const operation = 'index';
    storeUrls(URLS);
    storeOperation(operation);
    const results = await executeActions(false, () => { });
    const storedOperation = getStoredOperation();
    const completion = getCompletion(results);
    const report = await getReport(results, operation);
    await sendReport(results, operation);

    const expectedStoredOperation = {
      completed: true,
      name: 'index',
      urlIdx: 2,
      urls: [
        'https://main--milo--adobecom.hlx.page/existing',
        'https://main--milo--adobecom.hlx.page/nonexisting',
        'https://main--nonexisting--adobecom.hlx.page/',
      ],
    };
    const expectedCompletion = {
      preview: {
        total: 0,
        success: 0,
      },
      publish: {
        total: 0,
        success: 0,
      },
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 0,
        success: 0,
      },
      index: {
        total: 3,
        success: 1,
      },
    };
    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: { index: 200 },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: { index: 404 },
      },
      {
        url: NON_EXISTING_REPO_URL,
        status: { index: 'unsupported domain' },
      },
    ];
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Index',
        domain: 'https://main--milo--adobecom.hlx.page',
        urls: 2,
        success: 1,
      },
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Index',
        domain: 'https://main--nonexisting--adobecom.hlx.page',
        urls: 1,
        success: 0,
      },
    ];

    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(storedOperation).to.deep.equals(expectedStoredOperation, 'stored operation');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk index: resume at last index', async () => {
    const operation = 'index';
    storeUrls(URLS);
    storeOperation(operation);
    setLocalStorage(BULK_STORED_URL_IDX, 1);
    const urls = getStoredUrlInput();
    const results = await executeActions(true, () => { });
    const completion = getCompletion(results);
    const report = await getReport(results, operation);

    const expectedResults = [
      {
        url: NON_EXISTING_REPO_URL,
        status: { index: 'unsupported domain' },
      },
    ];
    const expectedCompletion = {
      preview: {
        total: 0,
        success: 0,
      },
      publish: {
        total: 0,
        success: 0,
      },
      delete: {
        total: 0,
        success: 0,
      },
      unpublish: {
        total: 0,
        success: 0,
      },
      index: {
        total: 1,
        success: 0,
      },
    };
    const expectedReport = [
      {
        timestamp: '2023-04-03T14:56:00.734Z',
        email: 'anonymous',
        action: 'Index',
        domain: 'https://main--nonexisting--adobecom.hlx.page',
        urls: 1,
        success: 0,
      },
    ];

    expect(urls).to.equals(URLS.join('\n'), 'urls');
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
    expect(completion).to.deep.equals(expectedCompletion, 'completion');
    expect(getArrayWithDeletedProperty(report, 'timestamp')).to.deep.equals(getArrayWithDeletedProperty(expectedReport, 'timestamp'), 'report');
  });

  it('Bulk index: resume finished', async () => {
    const operation = 'index';
    storeUrls(URLS);
    storeOperation(operation);
    setLocalStorage(BULK_STORED_URL_IDX, 3);
    const results = await executeActions(true, () => { });

    expect(results).to.be.null;
  });

  it('Bulk index: previous results', async () => {
    const operation = 'index';
    storeUrls(URLS.slice(0, 1));
    storeOperation(operation);
    const results1 = await executeActions(false, () => { });

    storeUrls(URLS);
    const results2 = await executeActions(true, () => { });

    const expectedResults1 = [
      {
        url: EXISTING_PAGE_URL,
        status: { index: 200 },
      },
    ];
    const expectedResults2 = [
      {
        url: EXISTING_PAGE_URL,
        status: { index: 200 },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: { index: 404 },
      },
      {
        url: NON_EXISTING_REPO_URL,
        status: { index: 'unsupported domain' },
      },
    ];
    expect(getArrayWithDeletedProperty(results1, 'timestamp')).to.deep.equals(expectedResults1, 'results');
    expect(getArrayWithDeletedProperty(results2, 'timestamp')).to.deep.equals(expectedResults2, 'results');
  });

  it('Bulk index: Duplicate URL', async () => {
    const operation = 'index';
    storeUrls(URLS.concat(URLS[0]));
    storeOperation(operation);
    const results = await executeActions(false, () => { });

    const expectedResults = [
      {
        url: EXISTING_PAGE_URL,
        status: { index: 200 },
      },
      {
        url: NON_EXISTING_PAGE_URL,
        status: { index: 404 },
      },
      {
        url: NON_EXISTING_REPO_URL,
        status: { index: 'unsupported domain' },
      },
      {
        url: EXISTING_PAGE_URL,
        status: { index: 'duplicate' },
      },
    ];
    expect(getArrayWithDeletedProperty(results, 'timestamp')).to.deep.equals(expectedResults, 'results');
  });
});
