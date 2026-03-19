import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { initService } from '../../../libs/blocks/merch/merch.js';

// Pre-resolve initService so tests don't depend on MAS commerce stack
const mockService = document.createElement('div');
mockService.settings = {
  masIOUrl: 'https://www.adobe.com/mas/io',
  wcsApiKey: 'test-api-key',
  locale: 'en_US',
  country: 'US',
};
initService.promise = Promise.resolve(mockService);

const { default: init } = await import('../../../libs/blocks/compare-chart-autoblock/compare-chart-autoblock.js');

const originalFetch = window.fetch;

async function initFragment(fragmentId) {
  setConfig({ codeRoot: '/libs' });
  const section = document.createElement('div');
  section.className = 'section';
  const a = document.createElement('a');
  a.href = `https://mas.adobe.com/studio.html#content-type=compare-chart&fragment=${fragmentId}`;
  a.textContent = 'Chart';
  section.appendChild(a);
  document.body.appendChild(section);
  await init(a);
}

describe('compare-chart-autoblock', () => {
  before(() => {
    sinon.stub(window, 'fetch').callsFake(async (url) => {
      if (url.includes('/io/fragment')) {
        if (url.includes('id=test-table-id')) {
          return originalFetch('/test/blocks/compare-chart-autoblock/mocks/table-fragment.json');
        }
        if (url.includes('id=test-merch-id')) {
          return originalFetch('/test/blocks/compare-chart-autoblock/mocks/merch-fragment.json');
        }
        if (url.includes('id=test-empty-section-id')) {
          return originalFetch('/test/blocks/compare-chart-autoblock/mocks/empty-section-title-fragment.json');
        }
        return originalFetch('/test/blocks/compare-chart-autoblock/mocks/chart-fragment.json');
      }
      if (url.startsWith('/') || url.startsWith('http://localhost')) {
        return originalFetch(url);
      }
      return new Response('', { status: 404 });
    });
  });

  afterEach(() => { document.body.innerHTML = ''; });
  after(() => { window.fetch.restore(); });

  describe('Comparison Table variant', () => {
    it('generates comparison-table with correct class', async () => {
      await initFragment('test-chart-id');
      const table = document.querySelector('.comparison-table');
      expect(table).to.exist;
    });

    it('renders column header titles', async () => {
      await initFragment('test-chart-id');
      const table = document.querySelector('.comparison-table');
      expect(table.querySelector('h2').textContent).to.equal('Acrobat Standard');
      const headings = table.querySelectorAll('h2');
      expect(headings.length).to.be.at.least(2);
      expect(headings[1].textContent).to.equal('Acrobat Pro');
    });

    it('renders section title text', async () => {
      await initFragment('test-chart-id');
      const table = document.querySelector('.comparison-table');
      expect(table.textContent).to.include('Create PDFs');
      expect(table.textContent).to.include('Advanced Features');
    });

    it('renders boolean checkmark and cross icons', async () => {
      await initFragment('test-chart-id');
      const table = document.querySelector('.comparison-table');
      expect(table.querySelector('.icon-checkmark')).to.exist;
      expect(table.querySelector('.icon-close')).to.exist;
    });

    it('renders text and number values', async () => {
      await initFragment('test-chart-id');
      const table = document.querySelector('.comparison-table');
      expect(table.textContent).to.include('100GB');
      expect(table.textContent).to.include('500GB');
      expect(table.textContent).to.include('5');
      expect(table.textContent).to.include('50');
    });
  });

  describe('Table variant', () => {
    it('auto-adds has-addon when pricing-bottom is set', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      expect(table).to.exist;
      expect(table.classList.contains('pricing-bottom')).to.be.true;
      expect(table.classList.contains('has-addon')).to.be.true;
    });

    it('auto-adds m-heading-icon when columns have mnemonicIcon', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      expect(table.classList.contains('m-heading-icon')).to.be.true;
    });

    it('applies highlight variant class', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      expect(table.classList.contains('highlight')).to.be.true;
    });

    it('renders highlight ribbon with badge text', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      expect(table.textContent).to.include('Best Value');
    });

    it('renders column header titles', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      expect(table.textContent).to.include('Plan A');
      expect(table.textContent).to.include('Plan B');
    });

    it('renders mnemonic icon images', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      const icon = table.querySelector('img[src*="ps-icon.svg"]');
      expect(icon).to.exist;
    });

    it('renders CTA links from card data', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      const links = [...table.querySelectorAll('a')];
      const buyLinks = links.filter((a) => a.textContent === 'Buy now');
      const trialLinks = links.filter((a) => a.textContent === 'Free trial');
      expect(buyLinks.length).to.be.at.least(1);
      expect(trialLinks.length).to.be.at.least(1);
    });

    it('renders section title and feature content', async () => {
      await initFragment('test-table-id');
      const table = document.querySelector('.table');
      expect(table.textContent).to.include('Features');
      expect(table.textContent).to.include('Cloud storage');
      expect(table.textContent).to.include('100GB');
      expect(table.textContent).to.include('1TB');
    });
  });

  describe('Merch variant', () => {
    it('applies merch class', async () => {
      await initFragment('test-merch-id');
      const table = document.querySelector('.table.merch');
      expect(table).to.exist;
    });

    it('does not auto-add has-addon without pricing-bottom', async () => {
      await initFragment('test-merch-id');
      const table = document.querySelector('.table');
      expect(table.classList.contains('has-addon')).to.be.false;
    });

    it('renders column headers and section content', async () => {
      await initFragment('test-merch-id');
      const table = document.querySelector('.table');
      expect(table.textContent).to.include('Individual');
      expect(table.textContent).to.include('Business');
      expect(table.textContent).to.include('Plans');
      expect(table.textContent).to.include('100GB');
      expect(table.textContent).to.include('2TB');
    });
  });

  describe('Edge cases', () => {
    it('returns early when fragment is missing', async () => {
      setConfig({ codeRoot: '/libs' });
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=compare-chart';
      a.textContent = 'No fragment';
      document.body.appendChild(a);

      await init(a);

      expect(document.querySelector('.comparison-table')).to.not.exist;
      expect(document.querySelector('.table')).to.not.exist;
    });

    it('renders comparison-table when sectionTitle is empty (no crash)', async () => {
      await initFragment('test-empty-section-id');
      const table = document.querySelector('.comparison-table');
      expect(table).to.exist;
      expect(table.textContent).to.include('Feature');
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

      expect(document.querySelector('p > a[href*="compare-chart"]')).to.not.exist;
      expect(document.querySelector('.comparison-table')).to.exist;
    });
  });
});
