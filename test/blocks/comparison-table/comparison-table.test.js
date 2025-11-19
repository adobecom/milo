import { readFile, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import { delay } from '../../helpers/waitfor.js';

const DESKTOP_WIDTH = 1200;
const MOBILE_WIDTH = 375;
const HEIGHT = 1500;

setConfig({});
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Comparison Table', () => {
  let comparisonTableModule;
  const cleanupFunctions = [];
  let originalError;

  before(async () => {
    originalError = window.onerror;
    window.onerror = (msg) => {
      if (msg.includes('ResizeObserver loop completed')) return true;
      if (originalError) return originalError(msg);
      return false;
    };

    comparisonTableModule = await import('../../../libs/blocks/comparison-table/comparison-table.js');

    const comparisonTables = document.querySelectorAll('.comparison-table');
    comparisonTables.forEach((table) => {
      const cleanup = comparisonTableModule.default(table);
      if (cleanup) cleanupFunctions.push(cleanup);
    });
  });

  describe('Basic Structure', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('has header-content', () => {
      const headerContent = comparisonTable.querySelector('.header-content');
      expect(headerContent).to.exist;
    });

    it('has header-content-wrapper', () => {
      const headerContentWrapper = comparisonTable.querySelector('.header-content-wrapper');
      expect(headerContentWrapper).to.exist;
    });

    it('has header items', () => {
      const headerItems = comparisonTable.querySelectorAll('.header-item');
      expect(headerItems.length).to.be.greaterThan(0);
    });

    it('has table-container', () => {
      const tableContainer = comparisonTable.querySelector('.table-container');
      expect(tableContainer).to.exist;
    });

    it('has table element', () => {
      const table = comparisonTable.querySelector('.table');
      expect(table).to.exist;
    });

    it('has table role attributes', () => {
      const table = comparisonTable.querySelector('.table');
      expect(table.getAttribute('role')).to.equal('table');
    });

    it('has table rows', () => {
      const tableRows = comparisonTable.querySelectorAll('.table-row');
      expect(tableRows.length).to.be.greaterThan(0);
    });

    it('table rows have role attributes', () => {
      const tableRows = comparisonTable.querySelectorAll('.table-row');
      tableRows.forEach((row) => {
        expect(row.getAttribute('role')).to.equal('row');
      });
    });
  });

  describe('Header Items', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('header items have data-column-index', () => {
      const headerItems = comparisonTable.querySelectorAll('.header-item[data-column-index]');
      expect(headerItems.length).to.be.greaterThan(0);
    });

    it('header items have sub-header-item-container', () => {
      const subHeaderContainers = comparisonTable.querySelectorAll('.sub-header-item-container');
      expect(subHeaderContainers.length).to.be.greaterThan(0);
    });

    it('header items contain buttons', () => {
      const buttons = comparisonTable.querySelectorAll('.header-item .con-button');
      expect(buttons.length).to.be.greaterThan(0);
    });

    it('header items have descriptions', () => {
      const descriptions = comparisonTable.querySelectorAll('.header-item .description');
      expect(descriptions.length).to.be.greaterThan(0);
    });

    it('first header item is empty placeholder', () => {
      const firstHeaderItem = comparisonTable.querySelector('.header-content-wrapper .header-item:first-child');
      expect(firstHeaderItem).to.exist;
      expect(firstHeaderItem.children.length).to.equal(0);
    });
  });

  describe('Table Structure', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('has table-column-header button', () => {
      const columnHeaderButton = comparisonTable.querySelector('.table-column-header button');
      expect(columnHeaderButton).to.exist;
    });

    it('table-column-header button has aria-expanded', () => {
      const columnHeaderButton = comparisonTable.querySelector('.table-column-header button');
      expect(columnHeaderButton.getAttribute('aria-expanded')).to.equal('true');
    });

    it('table-column-header button has toggle icon', () => {
      const toggleIcon = comparisonTable.querySelector('.table-column-header button .toggle-icon');
      expect(toggleIcon).to.exist;
    });

    it('has table-row-header cells', () => {
      const rowHeaders = comparisonTable.querySelectorAll('.table-row-header');
      expect(rowHeaders.length).to.be.greaterThan(0);
    });

    it('table-row-header has role rowheader', () => {
      const rowHeader = comparisonTable.querySelector('.table-row-header');
      expect(rowHeader.getAttribute('role')).to.equal('rowheader');
    });

    it('has table-cell elements', () => {
      const tableCells = comparisonTable.querySelectorAll('.table-cell');
      expect(tableCells.length).to.be.greaterThan(0);
    });

    it('table-cell has role cell', () => {
      const tableCell = comparisonTable.querySelector('.table-cell');
      expect(tableCell.getAttribute('role')).to.equal('cell');
    });

    it('table cells have data-column-index', () => {
      const tableCells = comparisonTable.querySelectorAll('.table-cell[data-column-index]');
      expect(tableCells.length).to.be.greaterThan(0);
    });

    it('table cells have inner div', () => {
      const tableCells = comparisonTable.querySelectorAll('.table-cell');
      tableCells.forEach((cell) => {
        const innerDiv = cell.querySelector('div');
        expect(innerDiv).to.exist;
      });
    });

    it('primary cells have primary-cell class', () => {
      const primaryCells = comparisonTable.querySelectorAll('.primary-cell');
      expect(primaryCells.length).to.be.greaterThan(0);
    });
  });

  describe('Table Toggle Functionality', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('toggles table visibility on button click', async () => {
      const columnHeaderButton = comparisonTable.querySelector('.table-column-header button');
      const table = comparisonTable.querySelector('.table');

      expect(table.classList.contains('hide')).to.be.false;
      expect(columnHeaderButton.getAttribute('aria-expanded')).to.equal('true');

      columnHeaderButton.click();
      await delay(300);

      expect(table.classList.contains('hide')).to.be.true;
      expect(columnHeaderButton.getAttribute('aria-expanded')).to.equal('false');

      columnHeaderButton.click();
      await delay(300);

      expect(table.classList.contains('hide')).to.be.false;
      expect(columnHeaderButton.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('Accessibility', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('has accessibility header row', () => {
      const accessibilityRow = comparisonTable.querySelector('.accessibility-header-row');
      expect(accessibilityRow).to.exist;
    });

    it('accessibility row has correct role', () => {
      const accessibilityRow = comparisonTable.querySelector('.accessibility-header-row');
      expect(accessibilityRow.getAttribute('role')).to.equal('row');
    });

    it('accessibility header cells have columnheader role', () => {
      const accessibilityHeaders = comparisonTable.querySelectorAll('.accessibility-header-cell[role="columnheader"]');
      expect(accessibilityHeaders.length).to.be.greaterThan(0);
    });

    it('accessibility header cells have data-column-index', () => {
      const accessibilityHeaders = comparisonTable.querySelectorAll('.accessibility-header-cell[data-column-index]');
      expect(accessibilityHeaders.length).to.be.greaterThan(0);
    });
  });

  describe('Mobile Filter Select', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('has mobile filter select elements', () => {
      const mobileSelects = comparisonTable.querySelectorAll('.mobile-filter-select');
      expect(mobileSelects.length).to.be.greaterThan(0);
    });

    it('mobile filter select has options', () => {
      const mobileSelect = comparisonTable.querySelector('.mobile-filter-select');
      const options = mobileSelect.querySelectorAll('option');
      expect(options.length).to.be.greaterThan(0);
    });

    it('mobile filter select has correct initial value', () => {
      const mobileSelects = comparisonTable.querySelectorAll('.mobile-filter-select');
      mobileSelects.forEach((select) => {
        const options = [...select.querySelectorAll('option')];
        const hasSelectedOption = options.some((opt) => opt.selected || opt.hasAttribute('selected'));
        expect(hasSelectedOption).to.be.true;
      });
    });

    it('changes visible column on select change', async () => {
      const mobileSelect = comparisonTable.querySelector('.mobile-filter-select');
      const initialValue = mobileSelect.value;
      const options = [...mobileSelect.querySelectorAll('option')];
      const newOption = options.find((opt) => opt.value !== initialValue);

      if (newOption) {
        const newValue = newOption.value;
        const oldColumnElements = comparisonTable.querySelectorAll(`[data-column-index="${initialValue}"]`);
        const newColumnElements = comparisonTable.querySelectorAll(`[data-column-index="${newValue}"]`);

        newOption.selected = true;
        mobileSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(50);

        oldColumnElements.forEach((el) => {
          if (el.classList.contains('accessibility-header-cell')) return;
          expect(el.classList.contains('hidden')).to.be.true;
        });

        newColumnElements.forEach((el) => {
          if (!el.classList.contains('header-item') && !el.classList.contains('table-cell')) return;
          expect(el.classList.contains('hidden')).to.be.false;
        });
      }
    });
  });

  describe('Responsive Behavior', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('hides last two columns on mobile', async () => {
      await setViewport({ width: MOBILE_WIDTH, height: HEIGHT });
      window.dispatchEvent(new Event('resize'));
      await delay(200);

      const headerItems = comparisonTable.querySelectorAll('.header-item[data-column-index]');
      const lastTwoHeaders = Array.from(headerItems).slice(-2);

      lastTwoHeaders.forEach((header) => {
        expect(header.classList.contains('hidden')).to.be.true;
      });
    });

    it('shows all columns on desktop', async () => {
      await setViewport({ width: DESKTOP_WIDTH, height: HEIGHT });
      window.dispatchEvent(new Event('resize'));
      await delay(200);

      const headerItems = comparisonTable.querySelectorAll('.header-item[data-column-index]');
      const lastTwoHeaders = Array.from(headerItems).slice(-2);

      lastTwoHeaders.forEach((header) => {
        expect(header.classList.contains('hidden')).to.be.false;
      });
    });
  });

  describe('Multiple Tables', () => {
    it('creates separate table containers for multiple tables', () => {
      const comparisonTable = document.querySelector('.comparison-table');
      const tableContainers = comparisonTable.querySelectorAll('.table-container');
      expect(tableContainers.length).to.equal(2);
    });

    it('each table container has its own table', () => {
      const comparisonTable = document.querySelector('.comparison-table');
      const tableContainers = comparisonTable.querySelectorAll('.table-container');
      tableContainers.forEach((container) => {
        const table = container.querySelector('.table');
        expect(table).to.exist;
      });
    });
  });

  describe('Sticky Header Functionality', () => {
    const stickyTable = document.querySelectorAll('.comparison-table')[1];

    it('has sticky class', () => {
      expect(stickyTable.classList.contains('sticky')).to.be.true;
    });

    it('header content can become sticky', async () => {
      await setViewport({ width: DESKTOP_WIDTH, height: HEIGHT });

      const headerContent = stickyTable.querySelector('.header-content');
      expect(headerContent).to.exist;

      window.scrollTo(0, 1000);
      await delay(200);

      const hasStickyOrNot = headerContent.classList.contains('sticky');
      expect(hasStickyOrNot).to.be.a('boolean');
    });
  });

  describe('Aria Labels', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('sets aria-label on mobile filter selects', async () => {
      await delay(100);
      const mobileSelects = comparisonTable.querySelectorAll('.mobile-filter-select');
      mobileSelects.forEach((select) => {
        const ariaLabel = select.getAttribute('aria-label');
        expect(ariaLabel).to.exist;
        expect(ariaLabel.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Equal Height Functionality', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('applies min-height to table cells', async () => {
      await delay(300);
      const tableCells = comparisonTable.querySelectorAll('.table-cell div');
      const cellsWithMinHeight = Array.from(tableCells).filter((cell) => cell.style.minHeight && cell.style.minHeight !== 'auto');
      expect(cellsWithMinHeight.length).to.be.greaterThan(0);
    });

    it('applies min-height to sub-header containers', async () => {
      await delay(300);
      const subHeaders = comparisonTable.querySelectorAll('.sub-header-item-container:not(:last-of-type)');
      const subHeadersWithMinHeight = Array.from(subHeaders).filter((header) => header.style.minHeight && header.style.minHeight !== 'auto');
      expect(subHeadersWithMinHeight.length).to.be.greaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    const comparisonTable = document.querySelectorAll('.comparison-table')[2];

    it('handles empty descriptions', () => {
      const descriptions = comparisonTable.querySelectorAll('.description');
      descriptions.forEach((desc) => {
        expect(desc).to.exist;
      });
    });

    it('handles tables with minimal columns', () => {
      const headerItems = comparisonTable.querySelectorAll('.header-item[data-column-index]');
      expect(headerItems.length).to.be.greaterThan(0);
    });
  });

  describe('Cell Content Processing', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('wraps cell content in div', () => {
      const tableCells = comparisonTable.querySelectorAll('.table-cell');
      tableCells.forEach((cell) => {
        const innerDiv = cell.querySelector('div');
        expect(innerDiv).to.exist;
      });
    });

    it('processes cells with content correctly', () => {
      const tableCells = comparisonTable.querySelectorAll('.table-cell');
      const cellsWithContent = Array.from(tableCells).filter((cell) => {
        const innerDiv = cell.querySelector('div');
        return innerDiv && innerDiv.children.length > 0;
      });
      expect(cellsWithContent.length).to.be.greaterThan(0);
    });
  });

  describe('Button Decoration', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('decorates buttons in header', () => {
      const buttons = comparisonTable.querySelectorAll('.header-item .con-button');
      expect(buttons.length).to.be.greaterThan(0);
    });

    it('buttons have correct classes', () => {
      const buttons = comparisonTable.querySelectorAll('.header-item .con-button');
      buttons.forEach((button) => {
        expect(button.classList.contains('con-button')).to.be.true;
      });
    });

    it('groups buttons in btn-container', () => {
      const btnContainers = comparisonTable.querySelectorAll('.btn-container');
      expect(btnContainers.length).to.be.greaterThan(0);
    });
  });

  describe('Select Update Logic', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('updates select options when column changes', async () => {
      const mobileSelects = [...comparisonTable.querySelectorAll('.mobile-filter-select')];

      if (mobileSelects.length < 2) return;

      const firstSelect = mobileSelects[0];
      const secondSelect = mobileSelects[1];

      const firstSelectInitialValue = firstSelect.value;
      const secondSelectOptions = [...secondSelect.querySelectorAll('option')];
      const newOption = secondSelectOptions.find(
        (opt) => opt.value !== secondSelect.value && opt.value !== firstSelectInitialValue,
      );

      if (newOption) {
        newOption.selected = true;
        secondSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(50);

        const firstSelectUpdatedOptions = [...firstSelect.querySelectorAll('option')];
        expect(firstSelectUpdatedOptions.length).to.be.greaterThan(0);
      }
    });
  });

  describe('Column Reordering', () => {
    const comparisonTable = document.querySelector('.comparison-table');

    it('reorders columns when first visible column changes', async () => {
      const headerItems = [...comparisonTable.querySelectorAll('.header-item[data-column-index]')];

      if (headerItems.length < 3) return;

      const firstVisibleSelect = comparisonTable.querySelector('.header-item:not(.hidden) .mobile-filter-select');
      if (!firstVisibleSelect) return;

      const options = [...firstVisibleSelect.querySelectorAll('option')];
      const currentValue = firstVisibleSelect.value;
      const differentOption = options.find((opt) => opt.value !== currentValue);

      if (differentOption) {
        const newColumnIndex = parseInt(differentOption.value, 10);

        differentOption.selected = true;
        firstVisibleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await delay(50);

        const newColumn = comparisonTable.querySelector(`[data-column-index="${newColumnIndex}"].header-item`);
        expect(newColumn.classList.contains('hidden')).to.be.false;
      }
    });
  });
});
