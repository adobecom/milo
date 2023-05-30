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
  });
});
