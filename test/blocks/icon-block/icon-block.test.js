import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/icon-block/icon-block.js');

describe('icon blocks', () => {
  const blocks = document.querySelectorAll('.icon-block');
  blocks.forEach((block) => {
    init(block);
    const isColumn = block.classList.contains('vertical') || block.classList.contains('centered');
    describe(`icon block ${isColumn ? 'column' : 'full-width'}`, () => {
      const children = block.querySelectorAll('.text');
      if (children.length) {
        children.forEach((blk) => {
          it('has an icon', () => {
            const icon = blk.querySelector('.icon-area');
            expect(icon).to.exist;
          });
        });
      }
    });
  });
});
