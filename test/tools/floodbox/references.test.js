import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import findFragmentsAndAssets from '../../../tools/floodbox/references.js';
import RequestHandler from '../../../tools/floodbox/request-handler.js';

describe('References', () => {
  const accessToken = 'test-token';
  const htmlPaths = ['/path1', '/path2'];
  const org = 'test-org';
  const repo = 'test-repo';
  let requestHandlerStub;

  beforeEach(() => {
    requestHandlerStub = sinon.stub(RequestHandler.prototype, 'daFetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('returns referenced fragments and assets for valid links', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/path1">Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/path2">Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/path1', '/test-org/test-repo/path2']));
  });

  it('returns an empty set when no valid links are found', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://example.com/invalid-link">Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://example.com/another-invalid-link">Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });

  it('handles fetch errors gracefully', async () => {
    requestHandlerStub
      .onFirstCall().resolves({ ok: false })
      .onSecondCall().resolves({ ok: false });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });
});
