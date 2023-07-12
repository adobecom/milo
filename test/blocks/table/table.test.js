import { readFile, sendMouse, sendKeys } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/table/table.js');

describe('table and tablemetadata', () => {
  beforeEach(() => {
    const tables = document.querySelectorAll('.table');
    tables.forEach((t) => init(t));
    window.dispatchEvent(new Event('milo:icons:loaded'));
  });

  describe('standard table', () => {
    const table = document.querySelector('.table');

    it('row-heading', () => {
      expect(table.querySelector('.row-heading')).to.exist;
    });

    it('click expand icon', async () => {
      const expandIcon = table.querySelector('.icon.expand');
      expandIcon.dispatchEvent(new Event('click'));
      delay(500);
      expect(expandIcon.ariaExpanded).to.be.equal('false');
      expandIcon.click();
      expect(expandIcon.ariaExpanded).to.be.equal('true');
      expandIcon.focus();
      await sendKeys({ type: 'Enter' });
      expect(expandIcon.ariaExpanded).to.be.equal('true');
      await sendKeys({ type: ' ' });
      expect(expandIcon.ariaExpanded).to.be.equal('false');
    });

    it('hovering-test', async () => {
      const headingCol = document.querySelector('.row-heading .col:not(.hidden)');
      await sendMouse({
        type: 'move',
        position: [10, (headingCol?.offsetTop ?? 0) + 1],
      });
      expect(headingCol.classList.contains('hover')).to.be.true;
    });

    it('mobile test', async () => {
      window.innerWidth = 760;
      window.dispatchEvent(new Event('resize'));
      await delay(700);
      expect(document.querySelector('.filters')).to.be.exist;
    });

    it('filter test', async () => {
      const filters = document.querySelectorAll('.filters select');
      const options = document.querySelectorAll('.filters select option');

      // for case of both filter poiting same options.
      options[1].selected = true;
      filters[0].dispatchEvent(new Event('change', { bubbles: true }));
      await delay(500);
      expect(filters[0].value).to.equal('2');

      // for case of order change
      options[3].selected = true;
      filters[0].dispatchEvent(new Event('change', { bubbles: true }));
      await delay(500);
      expect(filters[0].value).to.equal('4');

      // for merch filter test
      options[10].selected = true;
      filters[2].dispatchEvent(new Event('change', { bubbles: true }));
      await delay(500);
      expect(filters[2].value).to.equal('2');
    });

    it('back to desktop test', async () => {
      window.innerWidth = 1200;
      window.dispatchEvent(new Event('resize'));
      await delay(700);
      expect(document.querySelector('.filters')).to.be.exist;
    });
  });
});
