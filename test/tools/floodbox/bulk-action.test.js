import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import previewOrPublishPaths, { BulkAction } from '../../../tools/floodbox/bulk-action.js';
import RequestHandler from '../../../tools/floodbox/request-handler.js';

describe('BulkAction', () => {
  const org = 'testOrg';
  const repo = 'testRepo';
  const callback = sinon.spy();
  const paths = ['/testOrg/testRepo/content/test1.html', '/testOrg/testRepo/content/test2.html'];
  const action = 'publish';
  let daFetchStub;
  let delayStub;

  beforeEach(() => {
    daFetchStub = sinon.stub(RequestHandler.prototype, 'daFetch');
    delayStub = sinon.stub(BulkAction, 'delay').resolves();
    callback.resetHistory();
  });

  afterEach(() => {
    daFetchStub.restore();
    delayStub.restore();
  });

  it('should successfully process all paths in batches', async () => {
    daFetchStub.resolves({ ok: true, status: 200 });

    await previewOrPublishPaths({ org, repo, paths, action, callback });

    sinon.assert.callCount(daFetchStub, paths.length);
    sinon.assert.callCount(callback, paths.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 200 });
  });

  it('should handle failed requests and call callback with error', async () => {
    daFetchStub.onFirstCall().resolves({ ok: false, status: 500 });
    daFetchStub.onSecondCall().resolves({ ok: true, status: 200 });

    await previewOrPublishPaths({ org, repo, paths, action, callback });

    sinon.assert.callCount(daFetchStub, paths.length);
    sinon.assert.calledWithMatch(callback, { statusCode: 500, errorMsg: `Failed to ${action}` });
  });

  it('should clean up paths correctly', async () => {
    const cleanedPaths = paths.map((path) => BulkAction.cleanUpPath(path));
    expect(cleanedPaths).to.eql(['/content/test1', '/content/test2']);
  });

  it('should delay between batches', async () => {
    daFetchStub.resolves({ ok: true, status: 200 });

    const longPaths = Array(25).fill('/testOrg/testRepo/content/test1.html');
    await previewOrPublishPaths({ org, repo, paths: longPaths, action, callback });

    sinon.assert.calledOnce(delayStub);
  });

  it('should handle delete requests', async () => {
    daFetchStub.resolves({ ok: true, status: 200 });

    await previewOrPublishPaths({
      org, repo, paths, action: 'delete', callback, isDelete: true,
    });

    sinon.assert.callCount(daFetchStub, paths.length);

    const args = [
      'https://admin.hlx.page/delete/testOrg/testRepo/main/content/test1',
      { method: 'DELETE' },
    ];
    sinon.assert.calledWithMatch(daFetchStub.firstCall, args[0], args[1]);
  });
});
