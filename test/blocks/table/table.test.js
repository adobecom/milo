import { readFile } from '@web/test-runner-commands';
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
    it('row-heading', () => {
      const table = document.querySelector('.table');
      expect(table.querySelector('.row-heading')).to.exist;
    });
  });
});
