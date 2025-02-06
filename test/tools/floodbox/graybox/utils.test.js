import { expect } from '@esm-bundle/chai';
import { validatePaths, getValidGraybox } from '../../../../tools/floodbox/graybox/utils.js';

describe('validatePaths', () => {
  it('should return valid for correct paths with locale ', () => {
    const paths = ['/org/repo-graybox/ca_fr/expName/myfile', '/org/repo-graybox/ca_fr/expName/myfile'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: true, org: 'org', repo: 'repo-graybox', expName: 'expName' });
  });

  it('should return valid for correct paths without locale', () => {
    const paths = ['/org/repo-graybox/expName/myfile', '/org/repo-graybox/expName/myfile'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: true, org: 'org', repo: 'repo-graybox', expName: 'expName' });
  });

  it('should return invalid for paths with inconsistent org', () => {
    const paths = ['/org1/repo-graybox/expName/myfile', '/org2/repo-graybox/expName/myfile'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for paths with inconsistent repo', () => {
    const paths = ['/org/repo1-graybox/expName/myfile', '/org/repo2-graybox/expName/myfile'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for paths with inconsistent expName', () => {
    const paths = ['/org/repo-graybox/expName/myfile1', '/org/repo-graybox/expName2/myfile1'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for paths with invalid locale', () => {
    const paths = ['/org/repo-graybox/invalidLocale/expName/myfile', '/org/repo-graybox/fr/expName/myfile'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for paths with less than 4 parts', () => {
    const paths = ['/org/repo-graybox'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for non-array input', () => {
    const result = validatePaths('not an array');
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for empty array input', () => {
    const result = validatePaths([]);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid for paths not starting with a slash', () => {
    const paths = ['org/repo-graybox/expName'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });

  it('should return invalid when path has invalid locale', () => {
    const paths = ['/org/repo-graybox/expName/myfile', '/org/repo-graybox/invalidLocale/expName/myfile'];
    const result = validatePaths(paths);
    expect(result).to.eql({ valid: false, org: '', repo: '', expName: '' });
  });
});

describe('getValidGraybox', () => {
  it('should return a milo-graybox element with correct properties', async () => {
    // fake DA_SDK response with context and token
    const fakeDaSdk = Promise.resolve({
      context: { repo: 'fake-repo' },
      token: 'fake-token',
    });
    const cmp = await getValidGraybox(fakeDaSdk);

    expect(cmp).to.be.instanceOf(HTMLElement);
    expect(cmp.tagName.toLowerCase()).to.equal('milo-graybox');
    expect(cmp.repo).to.equal('fake-repo');
    expect(cmp.token).to.equal('fake-token');
  });
});
