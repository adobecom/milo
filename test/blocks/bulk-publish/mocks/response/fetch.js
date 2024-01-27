import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const getMocks = async () => {
  const tests = {
    error: 'https://admin.hlx.page/preview/adobecom/milo/error/*',
    preview: 'https://admin.hlx.page/preview/adobecom/milo/main/*',
    prevstatus: 'https://admin.hlx.page/job/adobecom/milo/main/preview/job-2024-01-22t21-59-57-639z/details',
    publish: 'https://admin.hlx.page/live/adobecom/milo/main/*',
    pubstatus: 'https://admin.hlx.page/job/adobecom/milo/main/publish/job-2024-01-22t21-59-57-639z/details',
    delete: 'https://admin.hlx.page/preview/adobecom/milo/main/*?paths[]=/drafts/sarchibeque/bulk-publish-test',
    delstatus: 'https://admin.hlx.page/job/adobecom/milo/main/preview-remove/job-2024-01-24t23-16-20-377z/details',
    retry: 'https://admin.hlx.page/live/adobecom/milo/main/drafts/sarchibeque/bulk-publish-test',
    index: 'https://admin.hlx.page/index/adobecom/milo/main/drafts/sarchibeque/bulk-publish-test',
  };
  const mocks = [];
  Object.keys(tests).forEach(async (test) => {
    const data = await readFile({ path: `./mocks/response/${test}.json` });
    const method = test === 'delete' ? 'DELETE' : 'POST';
    mocks.push({ url: tests[test], method, data, status: test === 'error' ? 401 : 200 });
  });
  return mocks;
};

export async function mockFetch() {
  const mocks = await getMocks();
  sinon.stub(window, 'fetch').callsFake((...args) => {
    const [resource] = args;
    const response = mocks.find((mock) => mock.url === resource);
    const { status, data } = response;
    return Promise.resolve({
      status,
      ok: status === 200,
      json: () => JSON.parse(data),
    });
  });
}

export function unmockFetch() {
  window.fetch.restore?.();
}
