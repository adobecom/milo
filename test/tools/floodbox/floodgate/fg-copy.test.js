import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import copyFiles from '../../../../tools/floodbox/floodgate/fg-copy.js';
import RequestHandler from '../../../../tools/floodbox/request-handler.js';

describe('FloodgateCopy', () => {
  const accessToken = 'test-token';
  const org = 'test-org';
  const repo = 'test-repo';
  const fgColor = 'pink';
  const paths = ['/test-org/test-repo/path1', '/test-org/test-repo/path2'];
  let requestHandlerStub;
  let callbackStub;

  beforeEach(() => {
    requestHandlerStub = sinon.stub(RequestHandler.prototype, 'daFetch');
    sinon.stub(RequestHandler.prototype, 'uploadContent');
    callbackStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('copies files successfully', async () => {
    requestHandlerStub.resolves({
      ok: true,
      text: async () => '<html></html>',
      blob: async () => new Blob(),
    });
    RequestHandler.prototype.uploadContent.resolves({ statusCode: 200 });

    await copyFiles({
      accessToken, org, repo, paths, callback: callbackStub, fgColor,
    });

    expect(callbackStub.callCount).to.equal(2);
    expect(callbackStub.firstCall.args[0]).to.eql({ statusCode: 200 });
  });

  it('handles fetch errors gracefully', async () => {
    requestHandlerStub.resolves({ ok: false, status: 404 });

    await copyFiles({
      accessToken, org, repo, paths, callback: callbackStub, fgColor,
    });

    expect(callbackStub.callCount).to.equal(2);
    expect(callbackStub.firstCall.args[0]).to.eql({ statusCode: 404, filePath: '/test-org/test-repo/path1.html', errorMsg: 'Failed to fetch' });
  });

  it('adjusts URL domains in HTML files', async () => {
    requestHandlerStub.resolves({
      ok: true,
      text: async () => '<a href="https://main--test-repo--test-org.aem.page/path1">Link</a>',
    });
    RequestHandler.prototype.uploadContent.resolves({ statusCode: 200 });

    await copyFiles({
      accessToken, org, repo, paths, callback: callbackStub, fgColor,
    });

    expect(RequestHandler.prototype.uploadContent.firstCall.args[1]).to.include('--test-repo-fg-pink--test-org.');
  });

  it('processes non-editable files correctly', async () => {
    requestHandlerStub.resolves({
      ok: true,
      blob: async () => new Blob(),
    });
    RequestHandler.prototype.uploadContent.resolves({ statusCode: 200 });

    await copyFiles({
      accessToken, org, repo, paths: ['/test-org/test-repo/image.png'], callback: callbackStub, fgColor,
    });

    expect(callbackStub.callCount).to.equal(1);
    expect(callbackStub.firstCall.args[0]).to.eql({ statusCode: 200 });
  });

  it('handles empty paths array', async () => {
    await copyFiles({
      accessToken, org, repo, paths: [], callback: callbackStub, fgColor,
    });

    expect(callbackStub.callCount).to.equal(0);
  });

  it('ignores path with empty string', async () => {
    await copyFiles({
      accessToken, org, repo, paths: [''], callback: callbackStub, fgColor,
    });

    expect(callbackStub.callCount).to.equal(0);
  });

  it('rewrites both .aem.page and .aem.live host variants to the floodgate repo', async () => {
    const html = `
      <a href="https://main--test-repo--test-org.aem.page/path1">page</a>
      <a href="https://main--test-repo--test-org.aem.live/path1">live</a>`;
    requestHandlerStub.resolves({ ok: true, text: async () => html });
    RequestHandler.prototype.uploadContent.resolves({ statusCode: 200 });

    await copyFiles({
      accessToken,
      org,
      repo,
      paths: ['/test-org/test-repo/path1'],
      callback: callbackStub,
      fgColor,
    });

    const uploaded = RequestHandler.prototype.uploadContent.firstCall.args[1];
    expect(uploaded).to.include('--test-repo-fg-pink--test-org.aem.page');
    expect(uploaded).to.include('--test-repo-fg-pink--test-org.aem.live');
    expect(uploaded).to.not.include('--test-repo--test-org.');
  });

  it('rewrites every occurrence of the source host in a single file', async () => {
    const html = [
      '<a href="https://main--test-repo--test-org.aem.page/a">A</a>',
      '<a href="https://main--test-repo--test-org.aem.page/b">B</a>',
      '<a href="https://main--test-repo--test-org.aem.page/c">C</a>',
    ].join('');
    requestHandlerStub.resolves({ ok: true, text: async () => html });
    RequestHandler.prototype.uploadContent.resolves({ statusCode: 200 });

    await copyFiles({
      accessToken,
      org,
      repo,
      paths: ['/test-org/test-repo/path1'],
      callback: callbackStub,
      fgColor,
    });

    const uploaded = RequestHandler.prototype.uploadContent.firstCall.args[1];
    expect(uploaded.match(/--test-repo-fg-pink--test-org\./g) || []).to.have.length(3);
    expect(uploaded).to.not.include('--test-repo--test-org.');
  });

  it('skips fetching when the abort signal is already aborted', async () => {
    const ctrl = new AbortController();
    ctrl.abort();

    await copyFiles({
      accessToken,
      org,
      repo,
      paths,
      callback: callbackStub,
      fgColor,
      signal: ctrl.signal,
    });

    expect(requestHandlerStub.called).to.be.false;
    expect(callbackStub.called).to.be.false;
  });
});
