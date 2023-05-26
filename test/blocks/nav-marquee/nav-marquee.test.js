import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ env: { name: 'stage' } });

const innerHTML = await readFile({ path: './mocks/body.html' });
const { default: navMarqueeInit } = await import('../../../libs/blocks/nav-marquee/nav-marquee.js');

describe('nav-marquee', () => {
  beforeEach(() => {
    document.body.innerHTML = innerHTML;
    const marquees = document.querySelectorAll('.marquee');

    marquees.forEach(navMarqueeInit);
  });

  describe('nav-marquee', () => {
    it('has container', () => {
      const tableOfContents = document.querySelectorAll('.nav-marquee');
      tableOfContents.forEach((navMarqueeInit));

      expect(document.querySelector('.content-table .toc-container')).to.exist;
    });

    it('Link by text content', () => {
      const tableOfContents = document.querySelectorAll('.nav-marquee');
      tableOfContents.forEach(navMarqueeInit);

      const toc = document.querySelector('.content-table .toc-container');
      const sections = toc.querySelectorAll(' .toc-item');
      const href = sections[0].querySelector('a')?.href;

      expect(href).to.be.a('string');
      expect(href).to.contain('#what-we-offer');
    });

    it('changes focus', () => {
      const tableOfContents = document.querySelectorAll('.content-table');
      tableOfContents.forEach(navMarqueeInit);
      const toc = document.querySelector('.content-table');
      const sections = toc.querySelectorAll('.toc-item');

      sections[0].click();
      const heading = document.getElementById('what-we-offer');

      expect(heading === document.activeElement).to.be.true;
    });

    it('display message standalone use not defined', () => {
      const tableOfContents = document.querySelectorAll('.content-table');
      tableOfContents.forEach(navMarqueeInit);

      expect(document.querySelector('.nav-marquee .content-table .toc-container')).to.exist;
      expect(document.querySelector('.content-table .toc-title')).to.exist;
      expect(document.querySelector('.content-table .toc-footer')).to.exist;
    });
  });
});
