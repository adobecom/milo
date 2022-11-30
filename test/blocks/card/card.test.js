import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/card/card.js');

describe('Card', () => {
  it('Shows half card, 3up by default', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    init(document.querySelector('.card'));
    expect(document.querySelector('.consonant-OneHalfCard')).to.exist;
    expect(document.querySelector('.consonant-CardsGrid--3up')).to.exist;
  });

  describe('Wrapper', async () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/half.html' });
      const cards = document.querySelectorAll('.card');
      init(cards[0]);
      init(cards[1]);
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

  it('Supports Half card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/half.html' });
    init(document.querySelector('.card'));
    expect(document.querySelector('.consonant-OneHalfCard')).to.exist;
  });

  describe('Double Width Card', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/double-width.html' });
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

  it('Supports Product card', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/product.html' });
    init(document.querySelector('.card'));
    expect(document.querySelector('.consonant-ProductCard')).to.exist;
  });

  describe('Half Height Card', () => {
    before(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/half-height.html' });
    });

    it('is supported', () => {
      init(document.querySelector('.card'));
      expect(document.querySelector('.consonant-HalfHeightCard')).to.exist;
    });

    it('does not display undefined if no content', async () => {
      const el = document.querySelector('.card.empty');
      init(el);
      expect(el.outerHTML.includes('undefined')).to.be.false;
    });
  });
});
