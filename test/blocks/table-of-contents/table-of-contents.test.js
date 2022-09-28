/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: marqueeInit } = await import('../../../libs/blocks/marquee/marquee.js');
const { default: tocInit } = await import('../../../libs/blocks/table-of-contents/table-of-contents.js');

describe('table of contents', () => {
  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach((marquee) => {
    marqueeInit(marquee);
  });

  const tableOfContents = document.querySelectorAll('.table-of-contents');
  tableOfContents.forEach((tableOfContent) => {
    tocInit(tableOfContent);
  });

  describe('table of contents', () => {
    it('has container', () => {
      const toc = document.querySelector('.table-of-contents');
      expect(toc.querySelector('.toc-container')).to.exist;
    });

    it('changes focus', () => {
      const toc = document.querySelector('.table-of-contents');
      const section = toc.querySelectorAll('.toc-item');

      section[0].click();
      const heading = document.getElementById('what-we-offer');

      expect(heading === document.activeElement).to.be.true;
    });
  });
});
