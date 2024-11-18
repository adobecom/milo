import { expect } from '@esm-bundle/chai';
import { isEditableFile, getFileName, findFragmentsAndAssets } from '../../../tools/floodbox/utils.js';

describe('isEditableFile', () => {
  it('should return true for html extension', () => {
    expect(isEditableFile('html')).to.be.true;
  });

  it('should return true for json extension', () => {
    expect(isEditableFile('json')).to.be.true;
  });

  it('should return false for js extension', () => {
    expect(isEditableFile('js')).to.be.false;
  });

  it('should return false for empty string', () => {
    expect(isEditableFile('')).to.be.false;
  });

  it('should return false for null', () => {
    expect(isEditableFile(null)).to.be.false;
  });

  it('should return false for undefined', () => {
    expect(isEditableFile(undefined)).to.be.false;
  });
});

describe('getFileName', () => {
  it('should return file name without extension for a given path', () => {
    expect(getFileName('/path/to/file.html')).to.equal('file');
  });

  it('should return file name without extension for a path with multiple dots', () => {
    expect(getFileName('/path/to/file.name.with.dots.html')).to.equal('file.name.with.dots');
  });

  it('should return empty string for a path ending with a slash', () => {
    expect(getFileName('/path/to/')).to.equal('');
  });

  it('should return file name without extension for a path without extension', () => {
    expect(getFileName('/path/to/file')).to.equal('file');
  });

  it('should return file name without extension for a path with multiple slashes', () => {
    expect(getFileName('/path/to//file.html')).to.equal('file');
  });
});

describe('findFragmentsAndAssets', () => {
  it('should return an empty array', () => {
    expect(findFragmentsAndAssets()).to.eql([]);
  });
});
