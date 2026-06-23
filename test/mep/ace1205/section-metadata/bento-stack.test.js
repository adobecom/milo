import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: initBentoStack, getCards, maxCardHeight } = await import('../../../../libs/mep/ace1205/section-metadata/bento-stack.js');

describe('bento-stack: index/count', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bento-stack.html' });
  });

  it('sets --slides to the explore-card count', () => {
    const section = document.querySelector('.section.bento.stack-mobile');
    initBentoStack(section);
    expect(section.style.getPropertyValue('--slides')).to.equal('3');
  });

  it('sets --card-idx 0..N-1 on each card, ignoring non-card siblings', () => {
    const section = document.querySelector('.section.bento.stack-mobile');
    initBentoStack(section);
    const idx = [...section.querySelectorAll(':scope > .explore-card')]
      .map((c) => c.style.getPropertyValue('--card-idx'));
    expect(idx).to.deep.equal(['0', '1', '2']);
  });
});

describe('bento-stack: height measurement', () => {
  it('maxCardHeight returns the tallest card content height', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/bento-stack.html' });
    const section = document.querySelector('.section.bento.stack-mobile');
    const contents = section.querySelectorAll('.explore-card-content');
    contents[0].style.height = '100px';
    contents[1].style.height = '240px';
    contents[2].style.height = '180px';
    expect(maxCardHeight(getCards(section))).to.equal(240);
  });
});
