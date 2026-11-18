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

  describe('bulk API', () => {
    const response = (body, status = 200) => ({
      ok: status < 400,
      status,
      json: async () => body,
    });
    const resources = [
      { path: '/content/test1', status: 200 },
      { path: '/content/test2', status: 200 },
    ];
    const stubJob = (results = resources, topic = 'preview') => {
      daFetchStub.onCall(0).resolves(response({ job: { topic, name: 'job-123', state: 'created' } }, 202));
      daFetchStub.onCall(1).resolves(response({ state: 'running', data: { resources: [] } }, 202));
      daFetchStub.onCall(2).resolves(response({ state: 'stopped', data: { resources: results } }));
    };
    const runBulk = (opts = {}) => previewOrPublishPaths({
      org, repo, paths, action: 'preview', callback, useBulk: true, ...opts,
    });

    ['preview', 'live'].forEach((bulkAction) => {
      it(`submits one bulk ${bulkAction} job and waits for per-path results`, async () => {
        const topic = bulkAction === 'live' ? 'publish' : 'preview';
        stubJob(resources, topic);
        delayStub.callsFake(async () => sinon.assert.notCalled(callback));

        await runBulk({ action: bulkAction });

        sinon.assert.callCount(daFetchStub, 3);
        const [url, opts] = daFetchStub.firstCall.args;
        expect(url).to.equal(`https://admin.hlx.page/${bulkAction}/${org}/${repo}/main/*`);
        expect(opts.method).to.equal('POST');
        expect(opts.headers['Content-Type']).to.equal('application/json');
        expect(JSON.parse(opts.body)).to.deep.equal({
          paths: ['/content/test1', '/content/test2'],
          forceUpdate: true,
          forceAsync: true,
        });
        const detailsUrl = `https://admin.hlx.page/job/${org}/${repo}/main/${topic}/job-123/details`;
        expect(daFetchStub.secondCall.args[0]).to.equal(detailsUrl);
        expect(daFetchStub.thirdCall.args[0]).to.equal(detailsUrl);
        sinon.assert.callCount(callback, 2);
        paths.forEach((path, i) => {
          expect(callback.getCall(i).args[0]).to.deep.equal({
            statusCode: 200,
            path,
            aemUrl: `https://admin.hlx.page/${bulkAction}/${org}/${repo}/main/content/test${i + 1}`,
          });
        });
      });
    });

    it('sends more than 25 files in one job and preserves asset extensions', async () => {
      const manyPaths = Array.from({ length: 60 }, (_, i) => `/${org}/${repo}/file${i}.pdf`);
      stubJob(manyPaths.map((path) => ({ path: BulkAction.cleanUpPath(path), status: 200 })));

      await runBulk({ paths: manyPaths });

      const payload = JSON.parse(daFetchStub.firstCall.args[1].body);
      expect(payload.paths).to.have.length(60);
      expect(payload.paths[0]).to.equal('/file0.pdf');
      sinon.assert.callCount(daFetchStub, 3);
      sinon.assert.callCount(callback, 60);
    });

    it('reports finished resources while the job is still running', async () => {
      stubJob();
      const running = { state: 'running', data: { resources: [resources[0], { path: '/content/test2' }] } };
      daFetchStub.onCall(1).resolves(response(running));

      await runBulk();

      sinon.assert.callCount(callback, 2);
      expect(callback.firstCall.args[0]).to.include({ path: paths[0], statusCode: 200 });
      expect(callback.firstCall.calledBefore(daFetchStub.thirdCall)).to.equal(true);
      expect(callback.secondCall.args[0]).to.include({ path: paths[1], statusCode: 200 });
    });

    it('fails and stops a job that makes no progress for 15 minutes', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['Date'] });
      try {
        daFetchStub.callsFake(async (url, opts) => (opts?.method === 'DELETE'
          ? response(null, 204)
          : response({ state: 'running', progress: { total: 2, processed: 0 } })));
        daFetchStub.onCall(0).resolves(response({ job: { topic: 'preview', name: 'job-123', state: 'created' } }, 202));
        delayStub.callsFake(async () => clock.tick(5 * 60 * 1000));

        await runBulk();

        // Submit, four polls (the first sets the baseline), then stop the job.
        sinon.assert.callCount(daFetchStub, 6);
        expect(daFetchStub.lastCall.args[1]).to.deep.equal({ method: 'DELETE' });
        sinon.assert.callCount(callback, paths.length);
        callback.args.forEach(([result]) => {
          expect(result.statusCode).to.equal(500);
          expect(result.errorMsg).to.include('no progress for 15 minutes');
        });
      } finally {
        clock.restore();
      }
    });

    it('allows a queued job up to 60 minutes to start', async () => {
      const clock = sinon.useFakeTimers({ toFake: ['Date'] });
      try {
        daFetchStub.callsFake(async (url, opts) => (opts?.method === 'DELETE'
          ? response(null, 204)
          : response({ state: 'created', progress: { total: 2, processed: 0 } })));
        daFetchStub.onCall(0).resolves(response({ job: { topic: 'preview', name: 'job-123', state: 'created' } }, 202));
        delayStub.callsFake(async () => clock.tick(20 * 60 * 1000));

        await runBulk();

        // Polls at 20, 40, 60 and 80 minutes; only the last exceeds 60 minutes without change.
        sinon.assert.callCount(daFetchStub, 6);
        expect(daFetchStub.lastCall.args[1]).to.deep.equal({ method: 'DELETE' });
        callback.args.forEach(([result]) => {
          expect(result.errorMsg).to.include('did not start within 60 minutes');
        });
      } finally {
        clock.restore();
      }
    });

    it('follows admin job links from the API and ignores links to other origins', async () => {
      const selfUrl = `https://admin.hlx.page/job/${org}/${repo}/main/preview/job-v2`;
      const detailsUrl = `${selfUrl}/resources`;
      daFetchStub.onCall(0).resolves(response({
        job: { state: 'created' },
        links: { self: selfUrl },
      }, 202));
      daFetchStub.onCall(1).resolves(response({
        state: 'created',
        links: { details: 'https://example.com/steal' },
      }));
      daFetchStub.onCall(2).resolves(response({ state: 'stopped', data: { resources } }));
      daFetchStub.onCall(3).resolves(response({
        job: { topic: 'preview', name: 'job-123', state: 'stopped' },
        links: { self: 'https://example.com/job' },
      }, 202));
      daFetchStub.onCall(4).resolves(response({ state: 'stopped', data: { resources } }));
      daFetchStub.onCall(5).resolves(response({ job: { state: 'created' }, links: { self: selfUrl } }, 202));
      daFetchStub.onCall(6).resolves(response({ state: 'created', links: { details: detailsUrl } }));
      daFetchStub.onCall(7).resolves(response({ state: 'stopped', data: { resources } }));

      await runBulk();
      await runBulk();
      await runBulk();

      const urls = daFetchStub.args.map(([url]) => url);
      // Off-origin details link: fall back to the self link's details URL.
      expect(urls.slice(1, 3)).to.deep.equal([selfUrl, `${selfUrl}/details`]);
      // Off-origin self link: fall back to the URL built from the job topic and name.
      expect(urls[4]).to.equal(`https://admin.hlx.page/job/${org}/${repo}/main/preview/job-123/details`);
      // Valid links are followed as returned.
      expect(urls.slice(6)).to.deep.equal([selfUrl, detailsUrl]);
      expect(urls.some((url) => url.startsWith('https://example.com'))).to.equal(false);
      sinon.assert.callCount(callback, paths.length * 3);
      callback.args.forEach(([result]) => expect(result.statusCode).to.equal(200));
    });

    it('matches results by webPath or resourcePath regardless of case', async () => {
      const mixedCase = `/${org}/${repo}/Content/Test1.html`;
      const indexPath = `/${org}/${repo}/blog/index.html`;
      stubJob([
        { resourcePath: '/content/test1.md', status: 200 },
        { webPath: '/blog/', resourcePath: '/blog/index.md', status: 200 },
      ]);

      await runBulk({ paths: [mixedCase, indexPath] });

      sinon.assert.callCount(callback, 2);
      sinon.assert.calledWithMatch(callback, { path: mixedCase, statusCode: 200 });
      sinon.assert.calledWithMatch(callback, { path: indexPath, statusCode: 200 });
    });

    it('maps unchanged, canonical index and failed results back to original paths', async () => {
      stubJob([
        { path: '/content/', status: 304 },
        { path: '/content/test2', status: 404, error: 'Source not found' },
      ]);
      const indexPath = `/${org}/${repo}/content/index.html`;

      await runBulk({ paths: [indexPath, paths[1]] });

      sinon.assert.calledWithMatch(callback, { path: indexPath, statusCode: 200 });
      sinon.assert.calledWithMatch(callback, { path: paths[1], statusCode: 404, errorMsg: 'Source not found' });
    });

    it('reports paths omitted from the job results as failures', async () => {
      stubJob([resources[0]]);

      await runBulk();

      sinon.assert.calledWithMatch(callback, { path: paths[0], statusCode: 200 });
      sinon.assert.calledWithMatch(callback, { path: paths[1], statusCode: 500 });
      expect(callback.secondCall.args[0].errorMsg).to.include('no result');
    });

    [0, 1, 2].forEach((requestIndex) => {
      it(`reports non-retryable HTTP errors from bulk request ${requestIndex} for every path`, async () => {
        stubJob();
        daFetchStub.onCall(requestIndex).resolves(response({}, 403));

        await runBulk();

        // A failed poll also stops the untracked server job.
        sinon.assert.callCount(daFetchStub, requestIndex === 0 ? 1 : requestIndex + 2);
        sinon.assert.callCount(callback, paths.length);
        callback.args.forEach(([result]) => {
          expect(result.statusCode).to.equal(403);
          expect(result.errorMsg).to.include('403');
        });
      });
    });

    it('retries a throttled poll using Retry-After and still reports job results', async () => {
      stubJob();
      daFetchStub.onCall(1).resolves({ ...response({}, 429), headers: { get: () => '3' } });

      await runBulk();

      sinon.assert.callCount(daFetchStub, 3);
      expect(delayStub.secondCall.args[1]).to.equal(3000);
      sinon.assert.callCount(callback, paths.length);
      callback.args.forEach(([result]) => expect(result.statusCode).to.equal(200));
    });

    it('retries server and network errors on job reads but only throttling on submission', async () => {
      daFetchStub.onCall(0).resolves(response({}, 429));
      daFetchStub.onCall(1).resolves(response({ job: { topic: 'preview', name: 'job-123', state: 'stopped' } }, 202));
      daFetchStub.onCall(2).rejects(new TypeError('Network failure'));
      daFetchStub.onCall(3).resolves(response({}, 503));
      daFetchStub.onCall(4).resolves(response({ state: 'stopped', data: { resources } }));

      await runBulk();

      sinon.assert.callCount(daFetchStub, 5);
      expect(daFetchStub.getCall(1).args[1].method).to.equal('POST');
      expect(delayStub.args.map(([, ms]) => ms)).to.deep.equal([2000, 2000, 4000]);
      callback.args.forEach(([result]) => expect(result.statusCode).to.equal(200));
    });

    it('fails and stops the server job after polling retries are exhausted', async () => {
      const jobUrl = `https://admin.hlx.page/job/${org}/${repo}/main/preview/job-123`;
      daFetchStub.callsFake(async (url, opts) => (
        opts?.method === 'DELETE' ? response(null, 204) : response({}, 429)));
      daFetchStub.onCall(0).resolves(response({ job: { topic: 'preview', name: 'job-123', state: 'created' } }, 202));

      await runBulk();

      sinon.assert.callCount(daFetchStub, 8);
      expect(delayStub.args.slice(1).map(([, ms]) => ms))
        .to.deep.equal([2000, 4000, 8000, 16000, 32000]);
      expect(daFetchStub.lastCall.args).to.deep.equal([jobUrl, { method: 'DELETE' }]);
      sinon.assert.callCount(callback, paths.length);
      callback.args.forEach(([result]) => expect(result.statusCode).to.equal(429));
    });

    it('caps retry delays and supports HTTP-date Retry-After values', () => {
      const withRetryAfter = (value) => ({ headers: { get: () => value } });
      expect(BulkAction.getRetryDelay(withRetryAfter('120'), 0)).to.equal(60000);
      expect(BulkAction.getRetryDelay(withRetryAfter(new Date(0).toUTCString()), 0)).to.equal(0);
      expect(BulkAction.getRetryDelay(undefined, 10)).to.equal(60000);
    });

    it('reports network errors rather than treating the job as complete', async () => {
      daFetchStub.rejects(new TypeError('Network failure'));

      await runBulk();

      sinon.assert.calledOnce(daFetchStub);
      sinon.assert.callCount(callback, paths.length);
      sinon.assert.calledWithMatch(callback, { statusCode: 500, errorMsg: 'Network failure' });
    });

    it('rejects a response without a job instead of reporting submission as success', async () => {
      daFetchStub.resolves(response({}));

      await runBulk();

      sinon.assert.calledOnce(daFetchStub);
      sinon.assert.callCount(callback, paths.length);
      sinon.assert.calledWithMatch(callback, { statusCode: 500, errorMsg: 'Missing bulk preview job' });
    });

    it('reports missing job details as failures', async () => {
      stubJob();
      daFetchStub.onCall(2).resolves(response({ state: 'stopped', data: {} }));

      await runBulk();

      sinon.assert.callCount(callback, paths.length);
      sinon.assert.calledWithMatch(callback, { statusCode: 500, errorMsg: 'Missing bulk preview results' });
    });

    it('does not send requests for an empty list or an already aborted operation', async () => {
      const controller = new AbortController();
      controller.abort();

      await runBulk({ paths: [] });
      await runBulk({ signal: controller.signal });

      sinon.assert.notCalled(daFetchStub);
      sinon.assert.notCalled(callback);
    });

    it('stops the server job and callbacks when cancelled during the polling delay', async () => {
      const controller = new AbortController();
      stubJob();
      delayStub.callsFake(async () => controller.abort());

      await runBulk({ signal: controller.signal });

      sinon.assert.calledTwice(daFetchStub);
      expect(daFetchStub.secondCall.args).to.deep.equal([
        `https://admin.hlx.page/job/${org}/${repo}/main/preview/job-123`,
        { method: 'DELETE' },
      ]);
      expect(daFetchStub.secondCall.thisValue.signal).to.equal(undefined);
      sinon.assert.notCalled(callback);
    });

    it('stops the server job when an in-flight poll is aborted', async () => {
      const controller = new AbortController();
      stubJob();
      daFetchStub.onCall(1).callsFake(async () => {
        controller.abort();
        throw new DOMException('Aborted', 'AbortError');
      });

      await runBulk({ signal: controller.signal });

      sinon.assert.callCount(daFetchStub, 3);
      expect(daFetchStub.thirdCall.args[1]).to.deep.equal({ method: 'DELETE' });
      sinon.assert.notCalled(callback);
    });

    it('does not report aborted requests as failures', async () => {
      daFetchStub.rejects(new DOMException('Aborted', 'AbortError'));

      await runBulk();

      sinon.assert.notCalled(callback);
    });
  });
});

describe('BulkAction polling delay', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => sinon.restore());

  it('removes its abort listener when the polling delay expires', async () => {
    const controller = new AbortController();
    const removeListener = sinon.spy(controller.signal, 'removeEventListener');
    const wait = BulkAction.delay(controller.signal);

    await clock.tickAsync(2000);
    await wait;

    sinon.assert.calledWith(removeListener, 'abort', sinon.match.func);
    expect(clock.countTimers()).to.equal(0);
  });

  it('resolves immediately on cancellation and clears the polling timer', async () => {
    const controller = new AbortController();
    const wait = BulkAction.delay(controller.signal);

    controller.abort();
    await wait;
    await BulkAction.delay(controller.signal);

    expect(clock.countTimers()).to.equal(0);
  });
});
