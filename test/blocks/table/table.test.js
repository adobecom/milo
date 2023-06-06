import { readFile, sendMouse, selectOption } from '@web/test-runner-commands';
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

    it('click expand icon', () => {
      const expandIcon = table.querySelector('.icon.expand');
      expandIcon.click();
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
      const filter1 = document.querySelector('.filters select');
      await selectOption({ selector: '.filters select', value: 2 });
      expect(filter1.value).to.equal('2');
    });
  });
});
