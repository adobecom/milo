import { expect } from '@esm-bundle/chai'
const { default: init } = await import('../../../libs/blocks/images/images.js')

describe('init', () => {
  it('should add the correct classes to the block element when multiple pictures are present', () => {
    const blockEl = document.createElement('div');
    const pictures = [document.createElement('picture'), document.createElement('picture'),];
    blockEl.appendChild(pictures[0]);
    blockEl.appendChild(pictures[1]);

    init(blockEl);

    expect(blockEl.classList.contains('images-list')).to.be.true;
    expect(blockEl.classList.contains('images-list-2')).to.be.true;
  });

  it('should add the correct classes to the block element when only one picture is present', () => {
    const blockEl = document.createElement('div');
    const picture = document.createElement('picture');
    blockEl.appendChild(picture);

    init(blockEl);

    expect(blockEl.classList.contains('images-list')).to.be.false;
    expect(blockEl.classList.contains('images-list-1')).to.be.false;
  });

  it('should not add any classes to the block element when no pictures are present', () => {
    const blockEl = document.createElement('div');

    init(blockEl);

    expect(blockEl.classList.length).to.equal(0);
  });
});
