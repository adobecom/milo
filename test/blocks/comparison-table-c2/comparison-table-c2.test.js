import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import { waitFor } from '../../helpers/waitfor.js';

import init from '../../../libs/c2/blocks/comparison-table-c2/comparison-table-c2.js';

setConfig({
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
  contentRoot: '/test/blocks/comparison-table-c2/mocks',
  base: '/libs',
  codeRoot: '/libs',
});

describe('Comparison Table C2', () => {
  it('marks the block con-block and builds the header content and cards', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    expect(el.classList.contains('con-block')).to.be.true;
    expect(el.querySelector('.header-content')).to.exist;
    expect(el.querySelector('.ct-header-item-header')).to.exist;

    const cards = el.querySelectorAll('.header-cards-container .ct-header-item-card[data-column-index]');
    expect(cards.length).to.equal(2);
    expect(el.style.getPropertyValue('--ct-card-count')).to.equal('2');
  });

  it('marks the primary column card and its cells', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const primaryCard = el.querySelector('.ct-header-item-card.primary');
    expect(primaryCard).to.exist;
    expect(primaryCard.getAttribute('data-column-index')).to.equal('2');
    // each data row has one primary cell (column 2)
    expect(el.querySelectorAll('.table-cell.primary-cell').length).to.equal(2);
  });

  it('builds a table with role, toggle button and an accessibility header row', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const container = el.querySelector('.table-container');
    expect(container).to.exist;
    const body = container.querySelector('.table-body');
    expect(body.getAttribute('role')).to.equal('table');

    const toggle = container.querySelector('.table-column-header button[aria-expanded]');
    expect(toggle).to.exist;
    // first table is expanded by default
    expect(toggle.getAttribute('aria-expanded')).to.equal('true');
    expect(body.classList.contains('hide')).to.be.false;

    expect(body.querySelector('.accessibility-header-row[role="row"]')).to.exist;
  });

  it('decorates data rows with row headers and column cells', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const rows = el.querySelectorAll('.table-body .table-row:not(.accessibility-header-row)');
    expect(rows.length).to.equal(2);

    const firstRow = rows[0];
    expect(firstRow.getAttribute('role')).to.equal('row');
    const rowHeader = firstRow.querySelector('.table-row-header[role="rowheader"]');
    expect(rowHeader).to.exist;
    expect(rowHeader.classList.contains('eyebrow')).to.be.true;

    const cells = firstRow.querySelectorAll('.table-cell[data-column-index][role="cell"]');
    expect(cells.length).to.equal(2);
    expect(cells[0].querySelector('.cell-content')).to.exist;
  });

  it('marks empty ("-") cells as hidden from assistive tech', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const emptyCells = el.querySelectorAll('.cell-content.empty-cell');
    expect(emptyCells.length).to.equal(1);
    expect(emptyCells[0].getAttribute('aria-hidden')).to.equal('true');
  });

  it('toggles the table open/closed when the header button is clicked', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const body = el.querySelector('.table-body');
    const toggle = el.querySelector('.table-column-header button[aria-expanded]');
    expect(body.classList.contains('hide')).to.be.false;

    toggle.click();
    expect(body.classList.contains('hide')).to.be.true;
    expect(toggle.getAttribute('aria-expanded')).to.equal('false');

    toggle.click();
    expect(body.classList.contains('hide')).to.be.false;
    expect(toggle.getAttribute('aria-expanded')).to.equal('true');
  });

  it('turns underline syntax into tooltip triggers and plain dotted underlines', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    // "label|position|text" -> tooltip trigger + tooltip content
    const trigger = el.querySelector('a.milo-tooltip.dotted-underline');
    expect(trigger).to.exist;
    expect(trigger.getAttribute('data-tooltip')).to.equal('How much storage you get');
    expect(trigger.getAttribute('data-tooltip-position')).to.equal('right');
    expect(trigger.textContent.trim()).to.equal('info');
    expect(el.querySelector('.ct-tooltip-content')).to.exist;

    // plain "<u>note</u>" (no pipes) -> non-link dotted underline
    const plain = el.querySelector('span.dotted-underline');
    expect(plain).to.exist;
    expect(plain.textContent.trim()).to.equal('note');
  });

  it('splits table groups on the "+++" separator', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/multi-table.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    expect(el.querySelectorAll('.table-container').length).to.equal(2);
    // the separator row is consumed, not rendered
    expect(el.textContent).to.not.contain('+++');
  });

  it('adds "not a feature" screen-reader text to empty (dash) cells', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    // setAccessibilityLabels resolves placeholders asynchronously
    await waitFor(() => el.querySelector('.cell-content.empty-cell .sr-only'), 2000);
    const srOnly = el.querySelector('.cell-content.empty-cell .sr-only');
    expect(srOnly).to.exist;
    expect(srOnly.textContent).to.equal('not a feature');
  });

  it('close icon has an accessible name distinguishing it from an empty cell', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/icons.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const closeIcon = el.querySelector('.icon-close');
    await waitFor(() => closeIcon.closest('.cell-content').querySelector('.sr-only'), 2000);

    expect(closeIcon.getAttribute('aria-hidden')).to.equal('true');
    expect(closeIcon.closest('.cell-content').classList.contains('empty-cell')).to.be.false;
    const srOnly = closeIcon.closest('.cell-content').querySelector('.sr-only');
    expect(srOnly).to.exist;
    expect(srOnly.textContent).to.equal('not a feature');
  });

  it('checkmark icon has an sr-only accessible name and no native title', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/icons.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const checkmarkIcon = el.querySelector('.icon-checkmark');
    await waitFor(() => checkmarkIcon.closest('.cell-content').querySelector('.sr-only'), 2000);

    expect(checkmarkIcon.getAttribute('aria-hidden')).to.equal('true');
    expect(checkmarkIcon.querySelector('title')).to.not.exist;
    const srOnly = checkmarkIcon.closest('.cell-content').querySelector('.sr-only');
    expect(srOnly).to.exist;
    expect(srOnly.textContent).to.equal('primary feature');
  });

  it('builds a labelled mobile filter select per column when there are 3+ columns', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/three-columns.html' });
    const el = document.querySelector('.comparison-table-c2');
    init(el);

    const selects = el.querySelectorAll('.mobile-filter-select');
    expect(selects.length).to.equal(3);

    // aria-labels are applied asynchronously from placeholders
    await waitFor(() => el.querySelector('.mobile-filter-select[aria-label]'), 2000);
    expect(selects[0].getAttribute('aria-label')).to.equal('Choose table column 1');
    expect(selects[1].getAttribute('aria-label')).to.equal('Choose table column 2');
  });
});
