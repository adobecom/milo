import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import getFilesToPromote from '../../../../tools/floodbox/graybox/promote-paths.js';
import RequestHandler from '../../../../tools/floodbox/request-handler.js';

describe('getFilesToPromote', () => {
  let requestHandlerStub;

  beforeEach(() => {
    requestHandlerStub = sinon.stub(RequestHandler.prototype, 'daFetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return files for paths ending with slash', async () => {
    requestHandlerStub.resolves({
      ok: true,
      json: async () => [
        { path: '/file1.html', ext: 'html' },
        { path: '/file2.json', ext: 'json' },
      ],
    });

    const result = await getFilesToPromote({
      accessToken: 'token',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
      paths: ['/path/'],
    });

    expect(result).to.eql([
      { path: '/file1.html', ext: 'html' },
      { path: '/file2.json', ext: 'json' },
    ]);
  });

  it('should return files for paths ending with .json', async () => {
    const result = await getFilesToPromote({
      accessToken: 'token',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
      paths: ['/path/file.json'],
    });

    expect(result).to.eql([
      { path: '/path/file.json', ext: 'json', name: 'file' },
    ]);
  });

  it('should return html files for paths not ending with slash or .json', async () => {
    const result = await getFilesToPromote({
      accessToken: 'token',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
      paths: ['/path/file'],
    });

    expect(result).to.eql([
      { path: '/path/file.html', ext: 'html', name: 'file' },
    ]);
  });

  it('should handle empty paths array', async () => {
    const result = await getFilesToPromote({
      accessToken: 'token',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
      paths: [],
    });

    expect(result).to.eql([]);
  });

  it('should handle invalid response from daFetch', async () => {
    requestHandlerStub.resolves({ ok: false });

    const result = await getFilesToPromote({
      accessToken: 'token',
      org: 'org',
      repo: 'repo',
      expName: 'expName',
      paths: ['/path/'],
    });

    expect(result).to.eql([]);
  });
});
