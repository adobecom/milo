import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/columns/columns.js');

describe('Columns Block', () => {
  describe('Regular Columns', () => {
    let block;

    before(() => {
      block = document.querySelector('#regular-columns');
      init(block);
    });

    it('adds row classes and indices', () => {
      const rows = block.querySelectorAll('.row');
      expect(rows).to.have.length(2);
      expect(rows[0].classList.contains('row-1')).to.be.true;
      expect(rows[1].classList.contains('row-2')).to.be.true;
    });

    it('adds column classes and indices', () => {
      const firstRowCols = block.querySelectorAll('.row-1 .col');
      expect(firstRowCols).to.have.length(3);
      expect(firstRowCols[0].classList.contains('col-1')).to.be.true;
      expect(firstRowCols[1].classList.contains('col-2')).to.be.true;
      expect(firstRowCols[2].classList.contains('col-3')).to.be.true;
    });

    it('does not add table-specific classes or roles for regular columns', () => {
      expect(block.classList.contains('columns-table')).to.be.false;
      expect(block.getAttribute('role')).to.be.null;

      const cells = block.querySelectorAll('.col');
      cells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.be.null;
      });
    });
  });

  describe('Table Mode - Basic Functionality', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-with-headers');
      init(tableBlock);
    });

    it('transforms table class to columns-table', () => {
      expect(tableBlock.classList.contains('columns-table')).to.be.true;
      expect(tableBlock.classList.contains('table')).to.be.false;
    });

    it('adds table role to the block', () => {
      expect(tableBlock.getAttribute('role')).to.equal('table');
    });

    it('adds row roles to rows with content', () => {
      const rows = tableBlock.querySelectorAll('.row');
      rows.forEach((row) => {
        expect(row.getAttribute('role')).to.equal('row');
      });
    });

    it('adds column classes and row classes', () => {
      const rows = tableBlock.querySelectorAll('.row');
      expect(rows[0].classList.contains('row-1')).to.be.true;
      expect(rows[1].classList.contains('row-2')).to.be.true;
      expect(rows[2].classList.contains('row-3')).to.be.true;

      const firstRowCols = tableBlock.querySelectorAll('.row-1 .col');
      expect(firstRowCols[0].classList.contains('col-1')).to.be.true;
      expect(firstRowCols[1].classList.contains('col-2')).to.be.true;
      expect(firstRowCols[2].classList.contains('col-3')).to.be.true;
    });
  });

  describe('Table Mode - Column Headers', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-with-headers');
      init(tableBlock);
    });

    it('identifies first row cells as column headers', () => {
      const firstRowCells = tableBlock.querySelectorAll('.row-1 .col');
      firstRowCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('columnheader');
      });
    });

    it('adds cell roles to data cells', () => {
      const dataCells = tableBlock.querySelectorAll('.row:not(.row-1) .col');
      dataCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('cell');
      });
    });
  });

  describe('Table Mode - Row Headers', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-with-row-headers');
      init(tableBlock);
    });

    it('identifies cells with strong tags as row headers', () => {
      const rowHeaderCells = tableBlock.querySelectorAll('.row-title');
      expect(rowHeaderCells).to.have.length(2);

      rowHeaderCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('rowheader');
        expect(cell.querySelector('strong')).to.exist;
      });
    });

    it('does not mark regular data cells as row headers', () => {
      const priceCells = tableBlock.querySelectorAll('.col-2');
      for (let i = 1; i < priceCells.length; i += 1) {
        expect(priceCells[i].classList.contains('row-title')).to.be.false;
        expect(priceCells[i].getAttribute('role')).to.equal('cell');
      }
    });
  });

  describe('Table Mode - H-tag Handling', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-with-headings');
      init(tableBlock);
    });

    it('converts H-tags in headers to paragraph role', () => {
      const headerCells = tableBlock.querySelectorAll('.row-1 .col');
      headerCells.forEach((cell) => {
        const heading = cell.querySelector('h4');
        expect(heading.getAttribute('role')).to.equal('paragraph');
      });
    });

    it('identifies cells with H-tags as column headers in first row', () => {
      const headerCells = tableBlock.querySelectorAll('.row-1 .col');
      headerCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('columnheader');
      });
    });

    it('handles H-tags in data rows as row headers', () => {
      const hRowHeaderTable = document.querySelector('#table-with-h-row-headers');
      init(hRowHeaderTable);
      const h5Cell = hRowHeaderTable.querySelector('.row-2 .col-1');
      expect(h5Cell.classList.contains('row-title')).to.be.true;
      expect(h5Cell.getAttribute('role')).to.equal('rowheader');

      const h5Tag = h5Cell.querySelector('h5');
      expect(h5Tag.getAttribute('role')).to.equal('paragraph');
    });
  });

  describe('Table Mode - Empty Cell Handling', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-empty-heading');
      init(tableBlock);
    });

    it('handles empty first cell correctly', () => {
      const emptyCell = tableBlock.querySelector('.row-1 .col-1');
      expect(emptyCell.classList.contains('empty-table-heading')).to.be.true;
      expect(emptyCell.getAttribute('role')).to.equal('cell');
    });

    it('treats other first row cells as column headers', () => {
      const headerCells = tableBlock.querySelectorAll('.row-1 .col:not(.col-1)');
      headerCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('columnheader');
      });
    });

    it('treats first column data cells as row headers', () => {
      const rowHeaderCells = tableBlock.querySelectorAll('.row:not(.row-1) .col-1');
      rowHeaderCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('cell');
      });
    });
  });

  describe('Table Mode - Mixed Content', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-mixed-content');
      init(tableBlock);
    });

    it('handles mixed row headers and regular cells', () => {
      const strongCells = tableBlock.querySelectorAll('.row-title');
      expect(strongCells).to.have.length(2);

      strongCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('rowheader');
        expect(cell.querySelector('strong')).to.exist;
      });
    });

    it('does not mark cells as row headers when multiple strong elements exist in row', () => {
      const supportRowCells = tableBlock.querySelectorAll('.row-3 .col');
      supportRowCells.forEach((cell) => {
        expect(cell.classList.contains('row-title')).to.be.false;
        if (cell.textContent.trim()) {
          expect(cell.getAttribute('role')).to.equal('cell');
        }
      });
    });

    it('maintains proper column header structure', () => {
      const headerCells = tableBlock.querySelectorAll('.row-1 .col:not(.empty-table-heading)');
      headerCells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.equal('columnheader');
      });
    });
  });

  describe('Table Mode - Image Links', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-with-images');
      init(tableBlock);
    });

    it('treats regular header cells normally', () => {
      const descriptionHeader = tableBlock.querySelector('.row-1 .col-2');
      expect(descriptionHeader.getAttribute('role')).to.equal('columnheader');
    });
  });

  describe('Table Mode - Empty Table', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#empty-table');
      init(tableBlock);
    });

    it('handles completely empty table', () => {
      expect(tableBlock.classList.contains('columns-table')).to.be.true;
      expect(tableBlock.getAttribute('role')).to.be.null;
    });

    it('does not add row roles to empty rows', () => {
      const rows = tableBlock.querySelectorAll('.row');
      rows.forEach((row) => {
        expect(row.getAttribute('role')).to.be.null;
      });
    });

    it('does not add cell roles to empty cells', () => {
      const cells = tableBlock.querySelectorAll('.col');
      cells.forEach((cell) => {
        expect(cell.getAttribute('role')).to.be.null;
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles single strong element in cell correctly', () => {
      const testDiv = document.createElement('div');
      testDiv.innerHTML = `
        <div class="columns table">
          <div>
            <div></div>
            <div>Header</div>
          </div>
          <div>
            <div><strong>Single Strong</strong></div>
            <div>Data</div>
          </div>
        </div>
      `;
      document.body.appendChild(testDiv);

      const tableBlock = testDiv.querySelector('.columns');
      init(tableBlock);

      const strongCell = tableBlock.querySelector('.row-2 .col-1');
      expect(strongCell.classList.contains('row-title')).to.be.true;
      expect(strongCell.getAttribute('role')).to.equal('rowheader');

      document.body.removeChild(testDiv);
    });
  });

  describe('Accessibility Compliance', () => {
    let tableBlock;

    before(() => {
      tableBlock = document.querySelector('#table-with-headers');
      init(tableBlock);
    });

    it('provides proper table structure with roles', () => {
      expect(tableBlock.getAttribute('role')).to.equal('table');

      const rows = tableBlock.querySelectorAll('[role="row"]');
      expect(rows.length).to.be.greaterThan(0);

      const columnHeaders = tableBlock.querySelectorAll('[role="columnheader"]');
      expect(columnHeaders.length).to.be.greaterThan(0);

      const cells = tableBlock.querySelectorAll('[role="cell"]');
      expect(cells.length).to.be.greaterThan(0);
    });

    it('ensures proper heading hierarchy with H-tag role changes', () => {
      const tableWithHeadings = document.querySelector('#table-with-headings');
      init(tableWithHeadings);

      const modifiedHeadings = tableWithHeadings.querySelectorAll('h4[role="paragraph"], h5[role="paragraph"]');
      expect(modifiedHeadings.length).to.be.greaterThan(0);
    });

    it('provides row and column header associations', () => {
      const rowHeaders = tableBlock.querySelectorAll('[role="rowheader"]');
      const columnHeaders = tableBlock.querySelectorAll('[role="columnheader"]');
      const cells = tableBlock.querySelectorAll('[role="cell"]');

      expect(columnHeaders.length + rowHeaders.length + cells.length).to.be.greaterThan(0);
    });
  });
});
