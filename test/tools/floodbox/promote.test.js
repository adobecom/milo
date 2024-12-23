import sinon from 'sinon';
import promoteFiles from '../../../tools/floodbox/promote.js';
import RequestHandler from '../../../tools/floodbox/request-handler.js';

describe('Promote', () => {
  const accessToken = 'testToken';
  const org = 'testOrg';
  const repo = 'testRepo-pink';
  const expName = 'testExp';
  const files = [
    { path: '/testOrg/testRepo-pink/content/test1.html', ext: 'html' },
    { path: '/testOrg/testRepo-pink/content/test2.json', ext: 'json' },
  ];
  const callback = sinon.spy();
  let promoteType = 'floodgate';
  let daFetchStub;
  let uploadContentStub;

  beforeEach(() => {
    daFetchStub = sinon.stub(RequestHandler.prototype, 'daFetch');
    uploadContentStub = sinon.stub(RequestHandler.prototype, 'uploadContent');
    callback.resetHistory();
  });

  afterEach(() => {
    daFetchStub.restore();
    uploadContentStub.restore();
  });

  it('should promote files successfully', async () => {
    daFetchStub.resolves({ ok: true, text: () => 'file content' });
    uploadContentStub.resolves({ statusCode: 200 });

    await promoteFiles({
      accessToken, org, repo, promoteType, files, callback,
    });

    sinon.assert.callCount(daFetchStub, files.length);
    sinon.assert.callCount(uploadContentStub, files.length);
    sinon.assert.callCount(callback, files.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 200 });
  });

  it('should handle fetch errors', async () => {
    daFetchStub.resolves({ ok: false, status: 404 });

    await promoteFiles({
      accessToken, org, repo, promoteType, files, callback,
    });

    sinon.assert.callCount(daFetchStub, files.length);
    sinon.assert.callCount(callback, files.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 404, errorMsg: 'Failed to fetch' });
  });

  it('should handle upload errors', async () => {
    daFetchStub.resolves({ ok: true, text: () => 'file content' });
    uploadContentStub.resolves({ statusCode: 500, errorMsg: 'Failed to upload file' });

    await promoteFiles({
      accessToken, org, repo, promoteType, files, callback,
    });

    sinon.assert.callCount(daFetchStub, files.length);
    sinon.assert.callCount(uploadContentStub, files.length);
    sinon.assert.callCount(callback, files.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 500, errorMsg: 'Failed to upload file' });
  });

  it('should handle blob content', async () => {
    const blob = new Blob(['file content'], { type: 'application/octet-stream' });
    daFetchStub.resolves({ ok: true, blob: () => blob });
    uploadContentStub.resolves({ statusCode: 200 });

    const fileArr = [
      { path: '/testOrg/testRepo-pink/content/image.png', ext: 'png' },
    ];
    await promoteFiles({
      accessToken, org, repo, promoteType, files: fileArr, callback,
    });

    sinon.assert.callCount(daFetchStub, fileArr.length);
    sinon.assert.callCount(uploadContentStub, fileArr.length);
    sinon.assert.callCount(callback, fileArr.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 200 });
  });

  it('should handle promoteType graybox', async () => {
    daFetchStub.resolves({ ok: true, text: () => 'file content' });
    uploadContentStub.resolves({ statusCode: 200 });

    promoteType = 'graybox';
    const gbFiles = [
      { path: '/testOrg/testRepo-graybox/testExp/content/test1.html', ext: 'html' },
      { path: '/testOrg/testRepo-graybox/testExp/content/test2.json', ext: 'json' },
    ];
    await promoteFiles({
      accessToken, org, repo: 'testRepo-graybox', expName, promoteType, files: gbFiles, callback,
    });

    sinon.assert.callCount(daFetchStub, gbFiles.length);
    sinon.assert.callCount(uploadContentStub, gbFiles.length);
    sinon.assert.callCount(callback, gbFiles.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 200 });

    sinon.assert.calledWithMatch(uploadContentStub, '/testOrg/testRepo/content/test1.html');
  });
});
