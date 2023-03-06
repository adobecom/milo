/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/card-horizontal/card-horizontal.js');

describe('single action card blocks', () => {
  const blocks = document.querySelectorAll('.card-horizontal');
  blocks.forEach((block) => {
    init(block);

    describe('card horizontal', () => {
      const cardblocks = block.querySelectorAll('.card-block');
      if (cardblocks.length) {
        cardblocks.forEach((blk) => {
          it('has a card image', () => {
            const image = blk.querySelector('.card-image');
            expect(image).to.exist;
          });

          it('has a heading', () => {
            const heading = blk.querySelector('.heading-xs');
            expect(heading).to.exist;
          });

          it('has body text', () => {
            const body = blk.querySelector('.body-xs');
            expect(body).to.exist;
          });

          const a = blk.querySelector('a');

          if (a) {
            it('toggles class on focus', () => {
              expect(blk.classList.contains('card-block-focus')).to.be.false;
              a.dispatchEvent(new Event('focus'));
              expect(blk.classList.contains('card-block-focus')).to.be.true;
              a.dispatchEvent(new Event('blur'));
              expect(blk.classList.contains('card-block-focus')).to.be.false;
            });
          }
        });
      }
    });
  });
});
