import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';

const requests = {
  error: 'https://admin.hlx.page/preview/adobecom/milo/error/*',
  preview: 'https://admin.hlx.page/preview/adobecom/milo/main/*',
  prevstatus: 'https://admin.hlx.page/job/adobecom/milo/main/preview/job-2024-01-22t21-59-57-639z/details',
  publish: 'https://admin.hlx.page/live/adobecom/milo/main/*',
  pubstatus: 'https://admin.hlx.page/job/adobecom/milo/main/publish/job-2024-01-22t21-59-57-639z/details',
  delete: 'https://admin.hlx.page/preview/adobecom/milo/main/*',
  delstatus: 'https://admin.hlx.page/job/adobecom/milo/main/preview-remove/job-2024-01-24t23-16-20-377z/details',
  retry: 'https://admin.hlx.page/preview/adobecom/milo/main/tools/bulk-publish-v2-test',
  index: 'https://admin.hlx.page/index/adobecom/milo/main/tools/bulk-publish-v2-test',
};

const getMocks = async () => {
  const mocks = [];
  Object.keys(requests).forEach(async (request) => {
    const data = await readFile({ path: `./mocks/response/${request}.json` });
    mocks.push({ request, url: requests[request], method: 'POST', data, status: request === 'error' ? 401 : 200 });
  });
  return mocks;
};

export async function mockFetch() {
  const mocks = await getMocks();
  stub(window, 'fetch').callsFake((...args) => {
    const headers = args[1].body ?? null;
    const body = headers ? JSON.parse(headers) : false;
    const [resource] = args;
    const response = mocks.find((mock) => (body.delete ? mock.request === 'delete' : mock.url === resource));
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
