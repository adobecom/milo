import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const conf = {
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}`,
};
setConfig(conf);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/quick-facts/quick-facts.js');

describe('quick-facts', () => {
  const quickFactsBlocks = document.querySelectorAll('.quick-facts');

  [...quickFactsBlocks].forEach((block, index) => {
    before(() => init(block));

    describe(`${index === 0 ? 'with logo' : 'without logo'}`, () => {
      if (index === 0) {
        it('has a logo', () => {
          const logo = block.querySelector('.logo');
          expect(logo).to.exist;
        });
      } else {
        it('does not have a logo ', () => {
          const logo = block.querySelector('.logo');
          expect(logo).to.not.exist;
        });
      }

      it('has a fact list', () => {
        const factList = block.querySelector('.fact-list');
        expect(factList).to.exist;
      });

      it('has a product list', () => {
        const productList = block.querySelector('.product-list');
        expect(productList).to.exist;
      });

      it('decorates fact list headings', () => {
        const headings = block.querySelector('.fact-list').querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
          expect(heading.className.includes('heading-')).to.be.true;
        });
      });

      it('decorates product list subheading', () => {
        const heading = block.querySelector('.product-list').querySelector('h1, h2, h3, h4, h5, h6');
        expect(heading.className.includes('subheading-')).to.be.true;
      });

      it('decorates body text', () => {
        const bodyText = block.querySelector('[class*="body-"]');
        expect(bodyText).to.exist;
      });
    });
  });
});
