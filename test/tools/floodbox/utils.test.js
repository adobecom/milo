import { expect } from '@esm-bundle/chai';
import { isEditableFile } from '../../../tools/floodbox/utils.js';

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
