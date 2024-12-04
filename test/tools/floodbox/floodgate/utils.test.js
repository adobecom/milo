import { expect } from '@esm-bundle/chai';
import validatePaths from '../../../../tools/floodbox/floodgate/utils.js';

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

  it('returns valid false for repo containing "-pink"', () => {
    const paths = ['/org1/repo1-pink/path1', '/org1/repo1-pink/path2'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '' });
  });
});
