/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import init from '../../../blocks/text/text.js';
import { cleanVariations } from '../../../scripts/scripts.js';

const mock = await readFile({ path: './text.mock.html' });
document.body.innerHTML = mock;
cleanVariations(document.body);

describe('text block', () => {
  const textBlocks = document.querySelectorAll('.text');
  textBlocks.forEach((textBlock) => {
    init(textBlock);
  });
  describe('full-width text block', () => {
    it('has a heading', () => {
      const heading = textBlocks[0].querySelector('.heading-XL, .heading-L');
      expect(heading).to.exist;
    });

    it('has body copy', () => {
      const body = textBlocks[0].querySelector('.body-M');
      expect(body).to.exist;
    });
  });

  describe('two-up vertical text block', () => {
    it('has at least a heading and body copy in each block', () => {
      const blocks = textBlocks[1].querySelectorAll('.foreground > div');
      blocks.forEach((block) => {
        const heading = block.querySelector('.heading-M');
        const body = block.querySelector('.body-M');
        expect(heading).to.exist;
        expect(body).to.exist;
      });
    });
  });

  describe('three-up vertical text block', () => {
    it('has at least a heading and body copy in each block', () => {
      const blocks = textBlocks[2].querySelectorAll('.foreground > div');
      blocks.forEach((block) => {
        const heading = block.querySelector('.heading-M');
        const body = block.querySelector('.body-M');
        expect(heading).to.exist;
        expect(body).to.exist;
      });
    });
  });
});
