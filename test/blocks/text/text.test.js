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

  describe('Link Farm', () => {
    it('should check if the "link-farm" class is present', () => {
      const element = document.querySelector('.link-farm');
      expect(element).to.exist;
    });
  
    it('should check if the "h3" elements are added when necessary', () => {
      const element = document.querySelector('.link-farm');
      const foregroundDiv = element.querySelectorAll('.foreground')[1];
      const headingElem = foregroundDiv.querySelectorAll('h3');
      expect(headingElem.length).to.equal(4);
    });
    it('should add no-heading id to the h3 element', () => {
      const element = document.querySelector('.link-farm');
      const foregroundDiv = element.querySelectorAll('.foreground')[1];
      const headingElem = foregroundDiv.querySelector('#no-heading');
      expect(headingElem).to.exist;
    });
    it('should add h3 as the first element in the div', () => {
      const element = document.querySelector('.link-farm');
      const foregroundDiv = element.querySelectorAll('.foreground')[1];
      const divElements = foregroundDiv.querySelectorAll('div');
      divElements.forEach(div => {
        const firstChild = div.children[0];
        expect(firstChild.tagName).to.equal('H3');
      });
    })
  });
});
