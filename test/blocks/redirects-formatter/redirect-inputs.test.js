import { expect } from '@esm-bundle/chai';
import { createRedirectsArea } from '../../../libs/blocks/redirects-formatter/utils/redirect-inputs.js';

describe('Redirects Formatter Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('creates main redirects UI structure', () => {
    const redirectsArea = createRedirectsArea();
    container.appendChild(redirectsArea);

    // Check main wrapper
    expect(redirectsArea.classList.contains('main-redirects-ui-wrapper')).to.be.true;

    // Check tabs
    const tabs = redirectsArea.querySelector('.redirect-tabs');
    expect(tabs).to.exist;
    expect(tabs.querySelectorAll('button').length).to.equal(3);

    // Check UI areas
    const uiArea = redirectsArea.querySelector('.redirects-ui-area');
    expect(uiArea).to.exist;
    expect(uiArea.querySelectorAll('section').length).to.equal(2);
  });

  it('switches between single and bulk views when tabs are clicked', () => {
    const redirectsArea = createRedirectsArea();
    container.appendChild(redirectsArea);

    const bulkTab = redirectsArea.querySelector('.bulk-tab');
    const singleTab = redirectsArea.querySelector('.single-tab');

    // Initially single view should be selected
    expect(redirectsArea.querySelector('.single-redirects-container').classList.contains('selected')).to.be.true;
    expect(redirectsArea.querySelector('.bulk-redirects-container').classList.contains('selected')).to.be.false;

    // Click bulk tab
    bulkTab.click();
    expect(redirectsArea.querySelector('.single-redirects-container').classList.contains('selected')).to.be.false;
    expect(redirectsArea.querySelector('.bulk-redirects-container').classList.contains('selected')).to.be.true;

    // Click single tab
    singleTab.click();
    expect(redirectsArea.querySelector('.single-redirects-container').classList.contains('selected')).to.be.true;
    expect(redirectsArea.querySelector('.bulk-redirects-container').classList.contains('selected')).to.be.false;
  });

  it('sets correct UI area as selected when single/bulk tabs are clicked', () => {
    const redirectsArea = createRedirectsArea();
    container.appendChild(redirectsArea);

    const bulkTab = redirectsArea.querySelector('.bulk-tab');
    const singleTab = redirectsArea.querySelector('.single-tab');
    const uiArea = redirectsArea.querySelector('.redirects-ui-area');

    // Initially single tab and single UI area should be selected
    expect(singleTab.classList.contains('selected')).to.be.true;
    expect(bulkTab.classList.contains('selected')).to.be.false;
    expect(uiArea.querySelector('.single-redirects-container').classList.contains('selected')).to.be.true;
    expect(uiArea.querySelector('.bulk-redirects-container').classList.contains('selected')).to.be.false;

    // Click bulk tab
    bulkTab.click();
    expect(singleTab.classList.contains('selected')).to.be.false;
    expect(bulkTab.classList.contains('selected')).to.be.true;
    expect(uiArea.querySelector('.single-redirects-container').classList.contains('selected')).to.be.false;
    expect(uiArea.querySelector('.bulk-redirects-container').classList.contains('selected')).to.be.true;

    // Click single tab
    singleTab.click();
    expect(singleTab.classList.contains('selected')).to.be.true;
    expect(bulkTab.classList.contains('selected')).to.be.false;
    expect(uiArea.querySelector('.single-redirects-container').classList.contains('selected')).to.be.true;
    expect(uiArea.querySelector('.bulk-redirects-container').classList.contains('selected')).to.be.false;
  });

  it('adds new input row when + button is clicked', () => {
    const redirectsArea = createRedirectsArea();
    container.appendChild(redirectsArea);

    const addButton = redirectsArea.querySelector('.add-input');

    // Initially there should be one input row
    expect(redirectsArea.querySelectorAll('.redirect-input-row').length).to.equal(1);

    // Click add button
    addButton.click();
    expect(redirectsArea.querySelectorAll('.redirect-input-row').length).to.equal(2);

    // Check if the new row has correct ID
    const rows = redirectsArea.querySelectorAll('.redirect-input-row');
    expect(rows[0].getAttribute('data-row-id')).to.equal('0');
    expect(rows[1].getAttribute('data-row-id')).to.equal('1');
  });

  it('removes input row when - button is clicked', () => {
    const redirectsArea = createRedirectsArea();
    container.appendChild(redirectsArea);

    // Add a new row first
    const addButton = redirectsArea.querySelector('.add-input');
    addButton.click();

    expect(redirectsArea.querySelectorAll('.redirect-input-row').length).to.equal(2);

    // Click remove button on second row
    const removeButton = redirectsArea.querySelectorAll('.remove-input')[1];
    removeButton.click();

    expect(redirectsArea.querySelectorAll('.redirect-input-row').length).to.equal(1);
    expect(redirectsArea.querySelector('.redirect-input-row').getAttribute('data-row-id')).to.equal('0');
  });

  it('maintains correct row IDs when all rows are deleted and new ones are added', () => {
    const redirectsArea = createRedirectsArea();
    container.appendChild(redirectsArea);

    // Add two additional rows (total 3 rows)
    const addButton = redirectsArea.querySelector('.add-input');
    addButton.click();
    addButton.click();
    expect(redirectsArea.querySelectorAll('.redirect-input-row').length).to.equal(3);

    // Remove all rows
    const removeButtons = redirectsArea.querySelectorAll('.remove-input');
    removeButtons[2].click();
    removeButtons[1].click();
    removeButtons[0].click();
    expect(redirectsArea.querySelectorAll('.redirect-input-row').length).to.equal(0);

    // Add a new row
    addButton.click();
    const newRow = redirectsArea.querySelector('.redirect-input-row');
    expect(newRow).to.exist;
    expect(newRow.getAttribute('data-row-id')).to.equal('3');

    // Add another row and verify it gets the next sequential ID
    addButton.click();
    const rows = redirectsArea.querySelectorAll('.redirect-input-row');
    expect(rows[1].getAttribute('data-row-id')).to.equal('4');
  });
});
