import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import FloodgateConfig from '../../../../tools/floodbox/floodgate/floodgate-config.js';
import RequestHandler from '../../../../tools/floodbox/request-handler.js';

describe('FloodgateConfig', () => {
  let floodgateConfig;
  const org = 'testOrg';
  const repo = 'testRepo';
  const accessToken = 'testToken';
  let daFetchStub;

  beforeEach(() => {
    sinon.restore();
    daFetchStub = sinon.stub(RequestHandler.prototype, 'daFetch');
    floodgateConfig = new FloodgateConfig(org, repo, accessToken);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should initialize properties correctly', () => {
    expect(floodgateConfig.org).to.equal('testOrg');
    expect(floodgateConfig.repo).to.equal('testRepo');
    expect(floodgateConfig.accessToken).to.equal('testToken');
    expect(floodgateConfig.requestHandler).to.be.instanceof(RequestHandler);
    expect(floodgateConfig.isPromoteEnabled).to.be.false;
    expect(floodgateConfig.isDeleteEnabled).to.be.false;
    expect(floodgateConfig.isPromoteDraftsOnly).to.be.false;
    expect(floodgateConfig.promoteIgnorePaths).to.deep.equal([]);
  });

  it('should fetch and process config correctly', async () => {
    const mockResponse = {
      ok: true,
      json: sinon.stub().resolves({
        config: {
          data: [
            { key: 'enablePromote', value: 'true' },
            { key: 'enableDelete', value: 'false' },
            { key: 'promoteDraftsOnly', value: 'false' },
          ],
        },
        'promote-ignore-paths': {
          data: [
            { promoteIgnorePaths: '/placeholders.json' },
            { promoteIgnorePaths: '/metadata.json' },
            { promoteIgnorePaths: '/my-folder/my-file' },
            { promoteIgnorePaths: '/summit25/' },
          ],
        },
      }),
    };

    daFetchStub.resolves(mockResponse);

    await floodgateConfig.getConfig();

    expect(floodgateConfig.isPromoteEnabled).to.be.true;
    expect(floodgateConfig.isDeleteEnabled).to.be.false;
    expect(floodgateConfig.isPromoteDraftsOnly).to.be.false;
    expect(floodgateConfig.getPromoteIgnorePaths()).to.deep.equal([
      '/placeholders.json',
      '/metadata.json',
      '/my-folder/my-file',
      '/summit25/',
    ]);
  });

  it('should handle failed fetch', async () => {
    const mockResponse = { ok: false };
    daFetchStub.resolves(mockResponse);
    await floodgateConfig.getConfig();

    expect(floodgateConfig.isPromoteEnabled).to.be.false;
    expect(floodgateConfig.isDeleteEnabled).to.be.false;
    expect(floodgateConfig.isPromoteDraftsOnly).to.be.false;
    expect(floodgateConfig.getPromoteIgnorePaths()).to.deep.equal([]);
  });

  it('should handle missing config', async () => {
    const mockResponse = {
      ok: true,
      json: sinon.stub().resolves({}),
    };

    daFetchStub.resolves(mockResponse);
    await floodgateConfig.getConfig();

    expect(floodgateConfig.isPromoteEnabled).to.be.false;
    expect(floodgateConfig.isDeleteEnabled).to.be.false;
    expect(floodgateConfig.isPromoteDraftsOnly).to.be.false;
    expect(floodgateConfig.getPromoteIgnorePaths()).to.deep.equal([]);
  });
});
