/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/z-pattern/z-pattern.js');

describe('z-patterns', () => {
  const zPatterns = document.querySelectorAll('.z-pattern');
  zPatterns.forEach((block) => {
    init(block);
    describe('z-pattern', () => {
      it('has a supporting image', () => {
        const hasImage = block.querySelector('.image');
        expect(hasImage).does.exist;
      });
    });
  });
  describe('default z-pattern 1', () => {
    it('has at least 2 media rows', () => {
      const mediaRows = zPatterns[1].querySelectorAll('.media');
      expect(mediaRows).length.greaterThanOrEqual(2);
    });
  });
  describe('z-pattern 3 plain', () => {
    it('Doesnt have a heading row or background', () => {
      const hasHeadline = zPatterns[3].classList.contains('has-headline');
      expect(hasHeadline).to.be.false;
    });
  });
  describe('z-pattern last plain', () => {
    it('Doesnt have a heading row or background', () => {
      const hasHeadline = zPatterns[5].classList.contains('has-headline');
      expect(hasHeadline).to.be.false;
    });
  });
});
