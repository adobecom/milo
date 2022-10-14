/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/single-action-card/single-action-card.js');

describe('single action card blocks', () => {
  const blocks = document.querySelectorAll('.single-action-card');
  blocks.forEach(block => {
    init(block);

    describe(`single action cards`, () => {
      const cardblocks = block.querySelectorAll('.card-block');
      if (cardblocks.length) {
        cardblocks.forEach(blk => {
          it('has a card image', () => {
            const image = blk.querySelector('.card-image');
            expect(image).to.exist;
          });

          it('has a heading', () => {
            const heading = blk.querySelector('.heading-XS');
            expect(heading).to.exist;
          });

          it('has body text', () => {
            const body = blk.querySelector('.body-XS');
            expect(body).to.exist;
          });
        });
      }
    })
  });
})
