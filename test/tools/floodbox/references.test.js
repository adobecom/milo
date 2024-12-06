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

  it('returns referenced fragments and assets for valid links with different domains', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path1">Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path2">Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/fragments/path1', '/test-org/test-repo/fragments/path2']));
  });

  it('returns referenced fragments and assets for valid links with different file types', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/path1.pdf">Link1</a><a href="https://main--test-repo--test-org.aem.page/path2.txt">Link2</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/path3.svg">Link3</a><a href="https://main--test-repo--test-org.aem.page/path4.json">Link4</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/path1.pdf', '/test-org/test-repo/path3.svg', '/test-org/test-repo/path4.json']));
  });

  it('returns an empty set when no links are present in the HTML', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<html><body>No links here</body></html>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<html><body>Still no links</body></html>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });

  it('returns an empty set when links do not match the reference pattern', async () => {
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

  it('handles mixed valid and invalid links', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path1">Valid Link</a><a href="https://example.com/invalid-link">Invalid Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path2">Valid Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/fragments/path1', '/test-org/test-repo/fragments/path2']));
  });

  it('handles fetch errors gracefully', async () => {
    requestHandlerStub
      .onFirstCall().resolves({ ok: false })
      .onSecondCall().resolves({ ok: false });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });
});
