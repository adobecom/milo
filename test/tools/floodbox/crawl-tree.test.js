import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import crawl from '../../../tools/floodbox/crawl-tree.js';
import RequestHandler from '../../../tools/floodbox/request-handler.js';

describe('crawl', () => {
  let callback;
  let requestHandlerStub;

  const grayboxTree = [
    { path: '/org/repo-graybox/exp/drafts/file1.html', ext: 'html' },
    { path: '/org/repo-graybox/exp/file2.json', ext: 'json' },
  ];
  const floodgateTree = [
    { path: '/org/repo-pink/drafts/file1.html', ext: 'html' },
    { path: '/org/repo-pink/file2.json', ext: 'json' },
  ];

  beforeEach(() => {
    callback = sinon.spy();
    requestHandlerStub = sinon.stub(RequestHandler.prototype, 'daFetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return graybox files under exp folder', async () => {
    requestHandlerStub.resolves({
      ok: true,
      json: async () => grayboxTree,
    });
    const { results } = crawl({
      path: '/org/repo-graybox/exp',
      crawlType: 'graybox',
    });
    const crawledFiles = await results;
    expect(crawledFiles).to.eql(grayboxTree);
  });

  it('should return graybox files under drafts folder only', async () => {
    requestHandlerStub.resolves({
      ok: true,
      json: async () => grayboxTree,
    });
    const { results, getDuration } = crawl({
      path: '/org/repo-graybox/exp',
      callback,
      crawlType: 'graybox',
      isDraftsOnly: true,
    });
    const crawledFiles = await results;
    expect(crawledFiles).to.eql([
      { path: '/org/repo-graybox/exp/drafts/file1.html', ext: 'html' },
    ]);
    expect(getDuration()).to.be.a('string');
  });

  it('should return floodgate files under exp folder', async () => {
    requestHandlerStub.resolves({
      ok: true,
      json: async () => floodgateTree,
    });
    const { results } = crawl({
      path: '/org/repo-pink',
      crawlType: 'floodgate',
    });
    const crawledFiles = await results;
    expect(crawledFiles).to.eql(floodgateTree);
  });

  it('should return floodgate files under drafts folder only', async () => {
    requestHandlerStub.resolves({
      ok: true,
      json: async () => floodgateTree,
    });
    const { results, getDuration, cancelCrawl } = crawl({
      path: '/org/repo-pink/exp',
      callback,
      crawlType: 'floodgate',
      isDraftsOnly: true,
    });
    const crawledFiles = await results;
    expect(crawledFiles).to.eql([
      { path: '/org/repo-pink/drafts/file1.html', ext: 'html' },
    ]);
    expect(getDuration()).to.be.a('string');
    cancelCrawl();
    expect(cancelCrawl).to.not.throw();
  });
});
