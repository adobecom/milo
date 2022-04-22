/* eslint-disable no-unused-expressions */
/* global describe it before */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

if (window.location.hash === '') {
  window.location.hash = '#milo';
}
const modals = await import('../../../scripts/modals.js');

describe('Modals', () => {
  it('Doesnt load modals on page load with no hash', () => {
    const backdrop = document.querySelector('.modal-dialog');
    expect(backdrop).to.be.null;
  });

  it('Loads a modal on load with hash', () => {
    setTimeout(() => {
      const backdrop = document.querySelector('.modal-dialog');
      expect(backdrop).to.exist;
    }, 5);
  });

  it('Loads a modal on hash change', () => {
    setTimeout(() => {
      window.location.hash = '#otis';
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-dialog');
        expect(backdrop).to.exist;
      }, 5);
    }, 300);
  });
});
