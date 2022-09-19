/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/text/text.js');

describe('text block', () => {
  const textBlocks = document.querySelectorAll('.text');
  textBlocks.forEach((textBlock) => {
    init(textBlock);
  });
  describe('full-width text block medium heading', () => {
    it('has a medium heading', () => {
      const heading = textBlocks[0].querySelector('.heading-M');
      expect(heading).to.exist;
    });

    it('has body copy', () => {
      const body = textBlocks[0].querySelector('.body-S');
      expect(body).to.exist;
    });
  });

  describe('full-width text block large heading', () => {
    it('has a large heading', () => {
      const heading = textBlocks[1].querySelector('.heading-XL');
      expect(heading).to.exist;
    });

    it('has body copy', () => {
      const body = textBlocks[1].querySelector('.body-M');
      expect(body).to.exist;
    });
  });

  describe('two-up vertical text block', () => {
    it('has at least a heading and body copy in each block', () => {
      const blocks = textBlocks[2].querySelectorAll('.foreground > div');
      blocks.forEach((block) => {
        const heading = block.querySelector('.heading-M');
        const body = block.querySelector('.body-S');
        expect(heading).to.exist;
        expect(body).to.exist;
      });
    });
  });

  describe('three-up vertical text block', () => {
    it('has at least a heading and body copy in each block', () => {
      const blocks = textBlocks[3].querySelectorAll('.foreground > div');
      blocks.forEach((block) => {
        const heading = block.querySelector('.heading-M');
        const body = block.querySelector('.body-S');
        expect(heading).to.exist;
        expect(body).to.exist;
      });
    });
  });
});
