import { expect } from '@esm-bundle/chai';
import {
  getValidFloodgate,
  validatePaths,
  normalizePaths,
  parsePathInput,
  getValidPathsForInput,
} from '../../../../tools/floodbox/floodgate/utils.js';

describe('validatePaths', () => {
  it('returns valid true with correct org and repo for valid paths', () => {
    const paths = ['/org1/repo1/path1', '/org1/repo1/path2'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: true, org: 'org1', repo: 'repo1' });
  });

  it('returns valid false for empty array', () => {
    const paths = [];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });

  it('returns valid false for non-array input', () => {
    const paths = 'not-an-array';
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });

  it('returns valid false for paths not starting with slash', () => {
    const paths = ['org1/repo1/path1', '/org1/repo1/path2'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });

  it('returns valid false for paths with less than 3 parts', () => {
    const paths = ['/org1/repo1'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });

  it('returns valid false for inconsistent org or repo', () => {
    const paths = ['/org1/repo1/path1', '/org2/repo1/path2'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });

  it('returns valid false for repo containing "-fg-" (floodgate repo)', () => {
    const paths = ['/org1/repo1-fg-pink/path1', '/org1/repo1-fg-pink/path2'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });
});

describe('getValidFloodgate', () => {
  it('should return a milo-floodgate element with correct properties', async () => {
    // fake DA_SDK response with context and token
    const fakeDaSdk = Promise.resolve({
      context: { repo: 'fake-repo' },
      token: 'fake-token',
    });
    const cmp = await getValidFloodgate(fakeDaSdk);

    expect(cmp).to.be.instanceOf(HTMLElement);
    expect(cmp.tagName.toLowerCase()).to.equal('milo-floodgate');
    expect(cmp.repo).to.equal('fake-repo');
    expect(cmp.token).to.equal('fake-token');
  });

  it('sets org on the element when context includes org', async () => {
    const fakeDaSdk = Promise.resolve({
      context: { org: 'fake-org', repo: 'fake-repo' },
      token: 'fake-token',
    });
    const cmp = await getValidFloodgate(fakeDaSdk);
    expect(cmp.org).to.equal('fake-org');
  });

  it('does not throw when the SDK resolves without a context', async () => {
    const fakeDaSdk = Promise.resolve({});
    const cmp = await getValidFloodgate(fakeDaSdk);
    expect(cmp).to.be.instanceOf(HTMLElement);
    expect(cmp.tagName.toLowerCase()).to.equal('milo-floodgate');
  });

  it('does not throw when the SDK resolves to undefined', async () => {
    const fakeDaSdk = Promise.resolve(undefined);
    const cmp = await getValidFloodgate(fakeDaSdk);
    expect(cmp).to.be.instanceOf(HTMLElement);
  });
});

describe('normalizePaths', () => {
  it('strips the -fg-{color} marker from each path', () => {
    const result = normalizePaths(
      ['/org/repo-fg-pink/a', '/org/repo-fg-pink/b'],
      'pink',
    );
    expect(result).to.eql(['/org/repo/a', '/org/repo/b']);
  });

  it('leaves paths without the color marker untouched', () => {
    const result = normalizePaths(['/org/repo/a', '/org/repo/b'], 'pink');
    expect(result).to.eql(['/org/repo/a', '/org/repo/b']);
  });

  it('returns an empty array when given an empty array', () => {
    expect(normalizePaths([], 'pink')).to.eql([]);
  });
});

describe('parsePathInput', () => {
  it('returns empty results for blank input', () => {
    const result = parsePathInput('', true, 'pink');
    expect(result.invalidLines).to.eql(new Set());
    expect(result.validPaths).to.eql([]);
  });

  it('skips blank/whitespace-only lines and tracks invalid line indices in the original input', () => {
    const input = [
      '',
      '/org1/repo1/good1',
      '   ',
      'not-a-path',
      '/org1/repo1/good2',
    ].join('\n');
    const result = parsePathInput(input, true, 'pink');
    expect(result.validPaths).to.eql(['/org1/repo1/good1', '/org1/repo1/good2']);
    expect(result.invalidLines).to.eql(new Set([3]));
  });

  it('marks lines whose org/repo disagree with the first valid line', () => {
    const input = '/org1/repo1/a\n/org2/repo1/b\n/org1/repo1/c';
    const result = parsePathInput(input, true, 'pink');
    expect(result.validPaths).to.eql(['/org1/repo1/a', '/org1/repo1/c']);
    expect(result.invalidLines).to.eql(new Set([1]));
  });

  it('handles CRLF line endings', () => {
    const result = parsePathInput('/org/repo/a\r\n/org/repo/b', true, 'pink');
    expect(result.validPaths).to.eql(['/org/repo/a', '/org/repo/b']);
    expect(result.invalidLines).to.eql(new Set());
  });

  it('strips -fg-{color} when fgCopy is false', () => {
    const result = parsePathInput('/org/repo-fg-pink/a', false, 'pink');
    expect(result.validPaths).to.eql(['/org/repo/a']);
    expect(result.invalidLines).to.eql(new Set());
  });

  it('keeps -fg-{color} segments when fgCopy is true (and marks them invalid)', () => {
    const result = parsePathInput('/org/repo-fg-pink/a', true, 'pink');
    expect(result.validPaths).to.eql([]);
    expect(result.invalidLines).to.eql(new Set([0]));
  });

  it('converts AEM page URLs to repo paths', () => {
    const input = 'https://main--da-events--adobecom.aem.page/drafts/ccc/test1';
    const result = parsePathInput(input, true, 'pink');
    expect(result.validPaths).to.eql(['/adobecom/da-events/drafts/ccc/test1']);
    expect(result.invalidLines).to.eql(new Set());
  });

  it('converts AEM page URLs with trailing slash and bare host', () => {
    const input = [
      'https://main--da-events--adobecom.aem.page/drafts/ccc/test1/',
      'https://main--da-events--adobecom.aem.page',
    ].join('\n');
    const result = parsePathInput(input, true, 'pink');
    expect(result.validPaths[0]).to.equal('/adobecom/da-events/drafts/ccc/test1');
    // Bare host (no path) should not validate as a 3-part repo path
    expect(result.invalidLines.has(1)).to.be.true;
  });

  it('does not convert non-aem.page URLs', () => {
    const result = parsePathInput('https://example.com/foo', true, 'pink');
    expect(result.validPaths).to.eql([]);
    expect(result.invalidLines).to.eql(new Set([0]));
  });
});

describe('getValidPathsForInput', () => {
  it('returns just the valid paths array from parsePathInput', () => {
    const input = '/org/repo/a\nbroken\n/org/repo/b';
    expect(getValidPathsForInput(input, true, 'pink')).to.eql([
      '/org/repo/a',
      '/org/repo/b',
    ]);
  });
});
