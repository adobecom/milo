import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/icon-block/icon-block.js');

describe('icon blocks', () => {
  const blocks = document.querySelectorAll('.icon-block');
  blocks.forEach((block) => {
    init(block);
    const isColumn = block.classList.contains('vertical') || block.classList.contains('center');
    describe(`icon block ${isColumn ? 'column' : 'full-width'}`, () => {
      const children = block.querySelectorAll('.text-content');
      if (children.length) {
        children.forEach((blk) => {
          it('has an icon', () => {
            const icon = blk.querySelector('.icon-area');
            expect(icon).to.exist;
          });
        });
      }
    });
    if (block.classList.contains('inline')) {
      describe('icon block inline has 2 columns', () => {
        it('has 2 columns', () => {
          const firstColumn = block.querySelector('.text-content .icon-area');
          const secondColumn = block.querySelector('.text-content .second-column');
          expect(firstColumn).to.exist;
          expect(secondColumn).to.exist;
        });
      });
    }
  });
  describe('icon block inline heading', () => {
    it('has xs heading', () => {
      const block = document.querySelector('#xx-up');
      const heading = block.querySelector('.heading-xs');
      expect(heading).to.exist;
    });
    it('no xs heading', () => {
      const block = document.querySelector('#not-xx-up');
      const heading = block.querySelector('.heading-xs');
      expect(heading).to.not.exist;
    });
  });
  describe('cta container', () => {
    it('is added around the only action area', () => {
      expect(document.querySelector('.cta-container #one-cta')).to.exist;
    });
    it('is added around adjacent action areas', () => {
      const parent = document.querySelector('#adjacent-cta-1').parentElement;
      expect(parent.className.includes('cta-container')).to.be.true;
      expect(parent.querySelector('#adjacent-cta-2')).to.exist;
    });
  });
});
