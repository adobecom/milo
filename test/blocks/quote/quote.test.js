import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/quote/quote.js');
const quotes = document.querySelectorAll('.quote');

describe('Quote', () => {
  quotes.forEach((quote) => {
    const authorType = quote.classList[1].replaceAll('-', ' ');
    describe(`authored as ${authorType}`, () => {
      before(() => {
        init(quote);
      });

      if (authorType.includes('image')) {
        it('has image', () => {
          const image = quote.querySelector('img').src;
          expect(image).to.exist;
        });
      }

      it('has blockquote text', () => {
        const blockquote = quote.querySelector('blockquote').textContent;
        expect(blockquote).to.exist;
        expect(blockquote).to.not.be.empty;
      });

      if (authorType.includes('caption')) {
        it('has figcaption', () => {
          const figcaption = quote.querySelector('.figcaption').textContent;
          expect(figcaption).to.exist;
          expect(figcaption).to.not.be.empty;
        });

        it('has cite', () => {
          const cite = quote.querySelector('cite').textContent;
          expect(cite).to.exist;
          expect(cite).to.not.be.empty;
        });
      }
    });
  });
});
