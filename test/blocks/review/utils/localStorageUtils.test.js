import { expect } from '@esm-bundle/chai';
import {
  getLocalStorage,
  setLocalStorage,
} from '../../../../libs/blocks/review/utils/localStorageUtils.js';

describe('LocalStorageUtils', () => {
  // Set a valid JSON parsed value
  window.localStorage.setItem('FOUND_KEY', JSON.stringify('data'));

  it('could get an item from LocalStorage', () => {
    expect(getLocalStorage('FOUND_KEY')).to.be.equal('data');
  });

  it('could not get a corruput item in LocalStorage', () => {
    window.localStorage.setItem('CORRUPT_KEY', 'data');
    expect(getLocalStorage('CORRUPT_KEY')).to.be.equal(null);
  });

  it('could set an item in LocalStorage', () => {
    setLocalStorage('FOUND_KEY_2', 'data_2');
    expect(window.localStorage.getItem('FOUND_KEY_2')).to.be.equal('"data_2"');
  });
});
