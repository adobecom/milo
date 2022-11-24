import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/z-pattern/z-pattern.js');

describe('z-patterns', () => {
  const zPatterns = document.querySelectorAll('.z-pattern');
  zPatterns.forEach((block) => {
    init(block);
    it('has a supporting image', () => {
      const hasImage = block.querySelector('.image');
      expect(hasImage).does.exist;
    });
  });
  it('has at least 2 media rows', () => {
    const mediaRows = zPatterns[1].querySelectorAll('.media');
    expect(mediaRows).length.greaterThanOrEqual(2);
  });
  it('Doesnt have a heading row or background', () => {
    const hasHeadline = zPatterns[3].classList.contains('has-headline');
    expect(hasHeadline).to.be.false;
  });
  it('Doesnt have a heading row or background', () => {
    const hasHeadline = zPatterns[5].classList.contains('has-headline');
    expect(hasHeadline).to.be.false;
  });
});
