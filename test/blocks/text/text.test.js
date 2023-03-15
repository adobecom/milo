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
      const heading = textBlocks[0].querySelector('.heading-l');
      expect(heading).to.exist;
    });

    it('has body copy', () => {
      const body = textBlocks[0].querySelector('.body-m');
      expect(body).to.exist;
    });
  });
  describe('full-width text block large heading', () => {
    it('has a large heading', () => {
      const heading = textBlocks[1].querySelector('.heading-xl');
      expect(heading).to.exist;
    });

    it('has body copy', () => {
      const body = textBlocks[1].querySelector('.body-m');
      expect(body).to.exist;
    });
  });
});
