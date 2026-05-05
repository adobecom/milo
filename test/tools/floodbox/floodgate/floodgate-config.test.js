import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import FloodgateConfig, {
  parseUserList,
  isPathUnderDrafts,
  evaluateFloodgateAccess,
  normalizeEmail,
} from '../../../../tools/floodbox/floodgate/floodgate-config.js';
import RequestHandler from '../../../../tools/floodbox/request-handler.js';

describe('parseUserList', () => {
  it('returns empty array for missing or non-string input', () => {
    expect(parseUserList()).to.deep.equal([]);
    expect(parseUserList(null)).to.deep.equal([]);
    expect(parseUserList(1)).to.deep.equal([]);
  });

  it('splits on comma, trims, lowercases, and drops empties', () => {
    expect(parseUserList(' A@B.COM , , c@d.org ')).to.deep.equal(['a@b.com', 'c@d.org']);
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  X@Y.Z  ')).to.equal('x@y.z');
  });
});

describe('isPathUnderDrafts', () => {
  const org = 'adobecom';
  const repo = 'milo';

  it('returns false when org or repo missing', () => {
    expect(isPathUnderDrafts('/adobecom/milo/drafts/x', '', 'milo')).to.be.false;
    expect(isPathUnderDrafts('/adobecom/milo/drafts/x', 'adobecom', '')).to.be.false;
  });

  it('accepts exact drafts root and nested paths', () => {
    expect(isPathUnderDrafts(`/${org}/${repo}/drafts`, org, repo)).to.be.true;
    expect(isPathUnderDrafts(`/${org}/${repo}/drafts/page`, org, repo)).to.be.true;
    expect(isPathUnderDrafts(`/${org}/${repo}/drafts/folder/page`, org, repo)).to.be.true;
  });

  it('rejects paths outside drafts', () => {
    expect(isPathUnderDrafts(`/${org}/${repo}/products/x`, org, repo)).to.be.false;
    expect(isPathUnderDrafts(`/${org}/${repo}/draft`, org, repo)).to.be.false;
  });

  it('handles wildcard paths by prefix before *', () => {
    expect(isPathUnderDrafts(`/${org}/${repo}/drafts/*`, org, repo)).to.be.true;
    expect(isPathUnderDrafts(`/${org}/${repo}/products/*`, org, repo)).to.be.false;
  });
});

describe('evaluateFloodgateAccess', () => {
  const base = {
    org: 'o',
    repo: 'r',
    userEmail: 'user@test.com',
    paths: [],
  };

  it('blocks all when email is empty', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      userEmail: '  ',
      allAccessUsers: [],
      copyOnlyUsers: [],
      draftsAllowed: true,
      operation: 'copy',
    });
    expect(r.mode).to.equal('blocked');
    expect(r.blockScope).to.equal('all');
    expect(r.errorMessage).to.match(/Adobe ID/i);
  });

  it('grants full access when user is in allAccessUsers', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: ['other@test.com', 'USER@test.com'],
      copyOnlyUsers: [],
      draftsAllowed: false,
      operation: 'delete',
      paths: ['/o/r/products/p'],
    });
    expect(r).to.eql({ mode: 'full', blockScope: 'none' });
  });

  it('grants copyOnly access for copy operation when user is in copyOnlyUsers', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: ['USER@test.com'],
      draftsAllowed: false,
      operation: 'copy',
    });
    expect(r.mode).to.equal('copyOnly');
    expect(r.blockScope).to.equal('none');
    expect(r.infoMessage).to.match(/copy/i);
  });

  it('blocks promote for copyOnly users', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: ['USER@test.com'],
      draftsAllowed: false,
      operation: 'promote',
    });
    expect(r.mode).to.equal('blocked');
    expect(r.blockScope).to.equal('operation');
    expect(r.errorMessage).to.match(/Promote and Delete/i);
  });

  it('blocks delete for copyOnly users', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: ['USER@test.com'],
      draftsAllowed: false,
      operation: 'delete',
    });
    expect(r.mode).to.equal('blocked');
    expect(r.blockScope).to.equal('operation');
    expect(r.errorMessage).to.match(/Promote and Delete/i);
  });

  it('blocks all when not in any list and draftsAllowed is false', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: ['a@b.c'],
      copyOnlyUsers: [],
      draftsAllowed: false,
      operation: 'copy',
    });
    expect(r.mode).to.equal('blocked');
    expect(r.blockScope).to.equal('all');
    expect(r.errorMessage).to.match(/not authorized/i);
  });

  it('draftsOnly with no paths returns info only', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: [],
      draftsAllowed: true,
      operation: 'copy',
      paths: [],
    });
    expect(r.mode).to.equal('draftsOnly');
    expect(r.blockScope).to.equal('none');
    expect(r.infoMessage).to.match(/drafts folder/i);
  });

  it('draftsOnly allows delete operation in drafts', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: [],
      draftsAllowed: true,
      operation: 'delete',
      paths: ['/o/r/drafts/page'],
    });
    expect(r.mode).to.equal('draftsOnly');
    expect(r.blockScope).to.equal('none');
    expect(r.infoMessage).to.match(/drafts folder/i);
  });

  it('draftsOnly with path outside drafts blocks with paths scope', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: [],
      draftsAllowed: true,
      operation: 'promote',
      paths: ['/o/r/drafts/a', '/o/r/root'],
    });
    expect(r.mode).to.equal('blocked');
    expect(r.blockScope).to.equal('paths');
    expect(r.infoMessage).to.match(/drafts folder/i);
    expect(r.errorMessage).to.match(/drafts folder/i);
  });

  it('draftsOnly with all paths under drafts succeeds', () => {
    const r = evaluateFloodgateAccess({
      ...base,
      allAccessUsers: [],
      copyOnlyUsers: [],
      draftsAllowed: true,
      operation: 'copy',
      paths: ['/o/r/drafts', '/o/r/drafts/sub/x'],
    });
    expect(r.mode).to.equal('draftsOnly');
    expect(r.blockScope).to.equal('none');
    expect(r.infoMessage).to.match(/drafts folder/i);
  });
});

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
    expect(floodgateConfig.draftsAllowed).to.be.false;
    expect(floodgateConfig.allAccessUsers).to.deep.equal([]);
    expect(floodgateConfig.copyOnlyUsers).to.deep.equal([]);
    expect(floodgateConfig.promoteIgnorePaths).to.deep.equal([]);
    expect(floodgateConfig.chronoBoxFragmentsEnabled).to.be.false;
  });

  it('should fetch and process config correctly', async () => {
    const mockResponse = {
      ok: true,
      json: sinon.stub().resolves({
        data: [
          { key: 'draftsAllowed', value: 'true' },
          { key: 'allAccessUsers', value: 'a@b.com, c@d.org' },
          { key: 'copyOnlyUsers', value: 'x@y.com' },
          { key: 'colors', value: 'pink, blue' },
          { key: 'chronoBoxFragmentsEnabled', value: 'true' },
        ],
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

    expect(floodgateConfig.draftsAllowed).to.be.true;
    expect(floodgateConfig.allAccessUsers).to.deep.equal(['a@b.com', 'c@d.org']);
    expect(floodgateConfig.copyOnlyUsers).to.deep.equal(['x@y.com']);
    expect(floodgateConfig.colors).to.deep.equal(['pink', 'blue']);
    expect(floodgateConfig.chronoBoxFragmentsEnabled).to.be.true;
    expect(floodgateConfig.getPromoteIgnorePaths()).to.deep.equal([
      '/placeholders.json',
      '/metadata.json',
      '/my-folder/my-file',
      '/summit25/',
    ]);
  });

  it('treats non-"true" chronoBoxFragmentsEnabled values as disabled', async () => {
    const mockResponse = {
      ok: true,
      json: sinon.stub().resolves({
        data: [
          { key: 'chronoBoxFragmentsEnabled', value: 'yes' },
        ],
      }),
    };

    daFetchStub.resolves(mockResponse);
    await floodgateConfig.getConfig();

    expect(floodgateConfig.chronoBoxFragmentsEnabled).to.be.false;
  });

  it('should handle failed fetch', async () => {
    const mockResponse = { ok: false };
    daFetchStub.resolves(mockResponse);
    await floodgateConfig.getConfig();

    expect(floodgateConfig.draftsAllowed).to.be.false;
    expect(floodgateConfig.allAccessUsers).to.deep.equal([]);
    expect(floodgateConfig.copyOnlyUsers).to.deep.equal([]);
    expect(floodgateConfig.chronoBoxFragmentsEnabled).to.be.false;
    expect(floodgateConfig.getPromoteIgnorePaths()).to.deep.equal([]);
  });

  it('should handle missing config', async () => {
    const mockResponse = {
      ok: true,
      json: sinon.stub().resolves({}),
    };

    daFetchStub.resolves(mockResponse);
    await floodgateConfig.getConfig();

    expect(floodgateConfig.draftsAllowed).to.be.false;
    expect(floodgateConfig.allAccessUsers).to.deep.equal([]);
    expect(floodgateConfig.copyOnlyUsers).to.deep.equal([]);
    expect(floodgateConfig.chronoBoxFragmentsEnabled).to.be.false;
    expect(floodgateConfig.getPromoteIgnorePaths()).to.deep.equal([]);
  });

  it('forwards an AbortSignal into the underlying RequestHandler', () => {
    const ctrl = new AbortController();
    const fc = new FloodgateConfig(org, repo, accessToken, ctrl.signal);
    expect(fc.signal).to.equal(ctrl.signal);
    expect(fc.requestHandler.signal).to.equal(ctrl.signal);
  });

  it('propagates AbortError from a signaled fetch', async () => {
    const ctrl = new AbortController();
    const fc = new FloodgateConfig(org, repo, accessToken, ctrl.signal);
    const abortErr = new Error('aborted');
    abortErr.name = 'AbortError';
    daFetchStub.rejects(abortErr);
    let caught;
    try {
      await fc.getConfig();
    } catch (err) {
      caught = err;
    }
    expect(caught?.name).to.equal('AbortError');
  });
});
