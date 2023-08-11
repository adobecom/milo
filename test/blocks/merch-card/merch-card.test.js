import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/merch-card/merch-card.js');

describe('Merch Card', () => {
  it('Shows segment card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
    init(document.querySelector('.merch-card'));
    expect(document.querySelector('.consonant-SegmentBlade')).to.exist;
  });

  describe('Wrapper', async () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/segment-card.html' });
       const merchCards = document.querySelectorAll('.segment');
      init(merchCards[0]);
      init(merchCards[1]);
    });

    it('Has one per section', () => {
      expect(document.querySelectorAll('.consonant-Wrapper').length).to.equal(1);
    });

    it('Is in correct position', async () => {
      const wrapper = document.querySelector('.consonant-Wrapper');
      expect(wrapper.previousElementSibling).to.equal(document.querySelector('.before'));
      expect(wrapper.nextElementSibling).to.equal(document.querySelector('.after'));
    });
  });

  it('Supports Special Offers card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/special-offers.html' });
    init(document.querySelector('.special-offers'));
    expect(document.querySelector('.consonant-OneHalfCard')).to.exist;
  });

  describe('Plans Card', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/plans-card.html' });
    });

    it('is supported', () => {
      init(document.querySelector('.card'));
      expect(document.querySelector('.consonant-DoubleWideCard')).to.exist;
    });

    it('does not display undefined if no content', async () => {
      const el = document.querySelector('.card.empty');
      init(el);
      expect(el.outerHTML.includes('undefined')).to.be.false;
    });
  });
});
