import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/compare-chart-autoblock/compare-chart-autoblock.js');

const originalFetch = window.fetch;
const { adobeIMS } = window;

async function mockIms() {
  window.adobeIMS = {
    initialized: true,
    isSignedInUser: () => false,
    async getProfile() {
      return {};
    },
  };
}

function unmockIms() {
  window.adobeIMS = adobeIMS;
}

describe('compare-chart-autoblock', () => {
  before(async () => {
    await mockIms();
    sinon.stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('/mas/io/fragment')) {
        return originalFetch('/test/blocks/compare-chart-autoblock/mocks/chart-fragment.json');
      }
      if (url.includes('/web_commerce_artifact')) {
        return originalFetch('/test/blocks/merch-card-autoblock/mocks/artifact.json');
      }
      return originalFetch(url);
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  after(() => {
    window.fetch.restore();
    unmockIms();
  });

  it('generates comparison-table from fragment data', async () => {
    setConfig({ codeRoot: '/libs' });
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    p.appendChild(a);
    document.body.appendChild(p);

    await init(a);

    const table = document.querySelector('.comparison-table');
    expect(table).to.exist;
    expect(table.classList.contains('merch')).to.be.true;
  });

  it('renders column headers with card fields and - separators', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    const firstRow = table.children[0];
    expect(firstRow.children.length).to.equal(2);

    const col1 = firstRow.children[0];
    expect(col1.querySelector('h2').textContent).to.equal('Acrobat Standard');
    // Should have `-` separator paragraphs
    const separators = [...col1.querySelectorAll('p')].filter((p) => p.textContent === '-');
    expect(separators.length).to.equal(2);

    const col2 = firstRow.children[1];
    expect(col2.querySelector('h2').textContent).to.equal('Acrobat Pro');
  });

  it('renders first section title as toggle row with primary marker', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    // Row 0 = column headers, Row 1 = first section title row
    const sectionRow = table.children[1];
    expect(sectionRow.children[0].textContent).to.equal('Create PDFs');
    // col-1 has no badge → empty, col-2 has badge → "primary"
    expect(sectionRow.children[1].textContent).to.equal('');
    expect(sectionRow.children[2].textContent).to.equal('primary');
  });

  it('renders boolean checkmark values', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    // Row 0 = headers, Row 1 = section title, Row 2 = first feature (Combine files)
    const combineRow = table.children[2];
    expect(combineRow.children[0].textContent).to.equal('Combine files');
    expect(combineRow.children[1].querySelector('.icon-checkmark')).to.exist;
    expect(combineRow.children[2].querySelector('.icon-checkmark')).to.exist;
  });

  it('renders text values', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    // Row 4 = Storage (after headers, section title, Combine files, Export to Word)
    const storageRow = table.children[4];
    expect(storageRow.children[0].textContent).to.equal('Storage');
    expect(storageRow.children[1].textContent).to.equal('100GB');
    expect(storageRow.children[2].textContent).to.equal('500GB');
  });

  it('renders section separators and second section', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    // Row 5 = +++ separator (after header, section1 title, 3 feature rows)
    const separator = table.children[5];
    expect(separator.children[0].textContent).to.equal('+++');

    // Row 6 = second section title
    const sec2Title = table.children[6];
    expect(sec2Title.children[0].textContent).to.equal('Advanced Features');
  });

  it('renders false boolean as cross icon', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    // Row 7 = Redact content (after separator and section 2 title)
    const redactRow = table.children[7];
    expect(redactRow.children[0].textContent).to.equal('Redact content');
    expect(redactRow.children[1].querySelector('.icon-close')).to.exist;
    expect(redactRow.children[2].querySelector('.icon-checkmark')).to.exist;
  });

  it('renders number values', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    // Row 8 = Compare files
    const compareRow = table.children[8];
    expect(compareRow.children[0].textContent).to.equal('Compare files');
    expect(compareRow.children[1].textContent).to.equal('5');
    expect(compareRow.children[2].textContent).to.equal('50');
  });

  it('returns early when fragment is missing', async () => {
    setConfig({ codeRoot: '/libs' });
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart';
    a.textContent = 'No fragment';
    document.body.appendChild(a);

    await init(a);

    const table = document.querySelector('.comparison-table');
    expect(table).to.not.exist;
  });

  it('unwraps parent p element', async () => {
    setConfig({ codeRoot: '/libs' });
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=test-chart-id';
    a.textContent = 'Compare Chart';
    p.appendChild(a);
    document.body.appendChild(p);

    await init(a);

    expect(document.querySelector('p')).to.not.exist;
    expect(document.querySelector('.comparison-table')).to.exist;
  });
});
