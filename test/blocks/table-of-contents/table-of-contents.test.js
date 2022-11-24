import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ env: { name: 'stage' } });

const innerHTML = await readFile({ path: './mocks/body.html' });
const { default: marqueeInit } = await import('../../../libs/blocks/marquee/marquee.js');
const { default: tocInit } = await import('../../../libs/blocks/table-of-contents/table-of-contents.js');

describe('table of contents', () => {
  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    const marquees = document.querySelectorAll('.marquee');

    marquees.forEach(marqueeInit);
  });

  describe('table of contents', () => {
    it('has container', () => {
      const tableOfContents = document.querySelectorAll('.table-of-contents');
      tableOfContents.forEach((tocInit));

      expect(document.querySelector('.table-of-contents .toc-container')).to.exist;
    });

    it('Link by text content', () => {
      const tableOfContents = document.querySelectorAll('.table-of-contents');
      tableOfContents.forEach(tocInit);

      const toc = document.querySelector('.table-of-contents .toc-container');
      const sections = toc.querySelectorAll(' .toc-item');
      const href = sections[0].querySelector('a')?.href;

      expect(href).to.be.a('string');
      expect(href).to.contain('#what-we-offer');
    });

    it('changes focus', () => {
      const tableOfContents = document.querySelectorAll('.table-of-contents');
      tableOfContents.forEach(tocInit);
      const toc = document.querySelector('.table-of-contents');
      const sections = toc.querySelectorAll('.toc-item');

      sections[0].click();
      const heading = document.getElementById('what-we-offer');

      expect(heading === document.activeElement).to.be.true;
    });

    it('display message standalone use not defined', () => {
      const tableOfContents = document.querySelectorAll('.table-of-contents');
      tableOfContents.forEach(tocInit);

      expect(document.querySelector('.toc .table-of-contents .toc-container')).to.exist;
      expect(document.querySelector('.table-of-contents h2')).to.exist;
    });

    it('hidden for standalone use on prod', () => {
      const tableOfContents = document.querySelectorAll('.table-of-contents');
      setConfig({ env: { name: 'prod' } });

      tableOfContents.forEach(tocInit);

      const toc = tableOfContents[1];

      expect(toc.style.display).to.equal('none');
    });
  });
});
