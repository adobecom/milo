import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';

const { customFetch } = await import('../../libs/utils/helpers.js');

describe('Cache control', async () => {
  it('fetches with cache param', async () => {
    const paramsGet = stub(URLSearchParams.prototype, 'get');
    const fetchStub = stub(window, 'fetch');
    const goodResponse = { ok: true, json: () => true };
    const mockUrl = './mocks/taxonomy.json';
    paramsGet.withArgs('cache').returns('off');
    fetchStub.withArgs(mockUrl, { cache: 'reload' }).resolves(goodResponse);
    const resp = await customFetch({ resource: mockUrl, withCacheRules: true });
    expect(resp.json()).to.be.true;
    paramsGet.restore();
    fetchStub.restore();
  });
});
