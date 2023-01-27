import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init, getMetadata } = await import('../../../libs/blocks/section-metadata/section-metadata.js');

describe('Section Metdata', () => {
  it('Gracefully dies', () => {
    const sec = document.querySelector('div');
    const sm = sec.querySelector('.section-metadata');
    init(sm);
    expect(sec.classList.length).to.equal(0);
  });

  it('Handles background image', () => {
    const sec = document.querySelector('.section.image');
    const sm = sec.querySelector('.section-metadata');
    init(sm);
    expect(sec.classList.contains('has-background')).to.be.true;
  });

  it('Handles background image', () => {
    const sec = document.querySelector('.section.color');
    const sm = sec.querySelector('.section-metadata');
    init(sm);
    expect(sec.style.backgroundColor).to.equal('rgb(239, 239, 239)');
  });

  it('Adds class based on layout input', () => {
    const sec = document.querySelector('.section.layout');
    const sm = sec.querySelector('.section-metadata');
    init(sm);
    expect(sec.classList.contains('grid-template-columns-1-2')).to.be.true;
  });

  it('gets section metadata', () => {
    const metadata = getMetadata(document.querySelector('.section.color .section-metadata'));
    expect(metadata.background.text).to.equal('rgb(239, 239, 239)');
  });
});
