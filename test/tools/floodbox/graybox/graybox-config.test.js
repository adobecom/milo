import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import GrayboxConfig from '../../../../tools/floodbox/graybox/graybox-config.js';
import RequestHandler from '../../../../tools/floodbox/request-handler.js';
import { DA_ORIGIN } from '../../../../tools/floodbox/constants.js';

describe('GrayboxConfig', () => {
  let grayboxConfig;
  const org = 'testOrg';
  const repo = 'testRepo';
  const accessToken = 'testToken';
  let daFetchStub;

  beforeEach(() => {
    sinon.restore();
    daFetchStub = sinon.stub(RequestHandler.prototype, 'daFetch');
    grayboxConfig = new GrayboxConfig(org, repo, accessToken);
  });

  it('should initialize properties correctly', () => {
    expect(grayboxConfig.org).to.equal(org);
    expect(grayboxConfig.repo).to.equal(repo);
    expect(grayboxConfig.accessToken).to.equal(accessToken);
    expect(grayboxConfig.requestHandler).to.be.instanceof(RequestHandler);
    expect(grayboxConfig.isGlobalPromoteEnabled).to.be.null;
    expect(grayboxConfig.isGlobalDeleteEnabled).to.be.null;
    expect(grayboxConfig.isGlobalPromoteDraftsOnly).to.be.null;
    expect(grayboxConfig.globalPromoteIgnorePaths).to.deep.equal([]);
    expect(grayboxConfig.experiencePromoteConfig).to.deep.equal([]);
    expect(grayboxConfig.experienceDeleteConfig).to.deep.equal([]);
    expect(grayboxConfig.experienceDraftsOnlyConfig).to.deep.equal([]);
  });

  it('should fetch and process config correctly', async () => {
    const mockResponse = {
      ok: true,
      json: sinon.stub().resolves({
        'experience-config': {
          data: [
            { key: 'enablePromote', experienceNames: 'summit25, max25' },
            { key: 'enableDelete', experienceNames: '' },
            { key: 'promoteDraftsOnly', experienceNames: '' },
          ],
        },
        'global-promote-ignore-paths': {
          data: [
            { globalPromoteIgnorePaths: '/placeholders.json' },
            { globalPromoteIgnorePaths: '/metadata.json' },
            { globalPromoteIgnorePaths: '/my-folder/my-file' },
            { globalPromoteIgnorePaths: '/summit25/' },
          ],
        },
        'global-config': {
          data: [
            { key: 'enablePromote', value: 'true' },
            { key: 'enableDelete', value: 'false' },
            { key: 'promoteDraftsOnly', value: 'false' },
          ],
        },
      }),
    };

    daFetchStub.resolves(mockResponse);

    await grayboxConfig.getConfig();

    expect(daFetchStub.calledWith(`${DA_ORIGIN}/source/${org}/${repo}/.milo/graybox/config.json`)).to.be.true;
    expect(mockResponse.json.called).to.be.true;

    // Add assertions to verify that the properties are set correctly based on the mock response
    expect(grayboxConfig.isGlobalPromoteEnabled).to.be.true;
    expect(grayboxConfig.isGlobalDeleteEnabled).to.be.false;
    expect(grayboxConfig.isGlobalPromoteDraftsOnly).to.be.false;
    expect(grayboxConfig.globalPromoteIgnorePaths).to.deep.equal([
      '/placeholders.json',
      '/metadata.json',
      '/my-folder/my-file',
      '/summit25/',
    ]);
    expect(grayboxConfig.experiencePromoteConfig).to.deep.equal([
      'summit25', 'max25',
    ]);
    expect(grayboxConfig.experienceDeleteConfig).to.deep.equal(['']);
    expect(grayboxConfig.experienceDraftsOnlyConfig).to.deep.equal(['']);
  });

  // add test for failed fetch
  it('should log error if fetch fails', async () => {
    const mockResponse = { ok: false };
    daFetchStub.resolves(mockResponse);
    const consoleErrorStub = sinon.stub(console, 'error');

    await grayboxConfig.getConfig();

    expect(daFetchStub.calledWith(`${DA_ORIGIN}/source/${org}/${repo}/.milo/graybox/config.json`)).to.be.true;
    expect(consoleErrorStub.calledWith(`Failed to fetch graybox config for ${org}/${repo}`)).to.be.true;
  });

  it('should return the correct value for isPromoteEnabled', () => {
    grayboxConfig.isGlobalPromoteEnabled = true;
    expect(grayboxConfig.isPromoteEnabled()).to.be.true;

    grayboxConfig.isGlobalPromoteEnabled = false;
    expect(grayboxConfig.isPromoteEnabled()).to.be.false;

    grayboxConfig.isGlobalPromoteEnabled = null;
    grayboxConfig.experiencePromoteConfig = ['test'];
    expect(grayboxConfig.isPromoteEnabled('test')).to.be.true;
  });

  it('should return the correct value for isDeleteEnabled', () => {
    grayboxConfig.isGlobalDeleteEnabled = true;
    expect(grayboxConfig.isDeleteEnabled()).to.be.true;

    grayboxConfig.isGlobalDeleteEnabled = false;
    expect(grayboxConfig.isDeleteEnabled()).to.be.false;

    grayboxConfig.isGlobalDeleteEnabled = null;
    grayboxConfig.experienceDeleteConfig = ['test'];
    expect(grayboxConfig.isDeleteEnabled('test')).to.be.true;
  });

  it('should return the correct value for isDraftsOnly', () => {
    grayboxConfig.isGlobalPromoteDraftsOnly = true;
    expect(grayboxConfig.isDraftsOnly()).to.be.true;

    grayboxConfig.isGlobalPromoteDraftsOnly = false;
    expect(grayboxConfig.isDraftsOnly()).to.be.false;

    grayboxConfig.isGlobalPromoteDraftsOnly = null;
    grayboxConfig.experienceDraftsOnlyConfig = ['test'];
    expect(grayboxConfig.isDraftsOnly('test')).to.be.true;
  });

  it('should return the correct value for getGlobalPromoteIgnorePaths', () => {
    grayboxConfig.globalPromoteIgnorePaths = ['/test1', '/test2'];
    expect(grayboxConfig.getGlobalPromoteIgnorePaths()).to.deep.equal(['/test1', '/test2']);
  });
});
