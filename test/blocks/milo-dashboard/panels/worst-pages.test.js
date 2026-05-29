import { expect } from '@esm-bundle/chai';

const { default: renderWorstPages } = await import('../../../../libs/blocks/milo-dashboard/panels/worst-pages.js');

describe('milo-dashboard worst-pages', () => {
  let container;
  const pages = [{
    url: 'https://main--milo--adobecom.aem.live/products/x.html',
    performance_score: '42.00',
    project_key: 'milo',
    created_at: '2026-05-01',
  }];

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders one row with score, page link, and fix-in-DA link', () => {
    renderWorstPages(container, pages, { daContext: { org: 'adobecom', repo: 'milo' } });
    const rows = container.querySelectorAll('table.worst-pages tbody tr');
    expect(rows.length).to.equal(1);
    expect(container.textContent.includes('42.0')).to.equal(true);
    const pageLink = rows[0].querySelector('a:not(.fix-in-da)');
    expect(pageLink.getAttribute('href')).to.equal(pages[0].url);
    const fix = rows[0].querySelector('a.fix-in-da');
    expect(fix.getAttribute('href')).to.equal('https://da.live/edit#/adobecom/milo/products/x');
  });

  it('omits fix-in-DA link without daContext', () => {
    renderWorstPages(container, pages);
    expect(container.querySelector('a.fix-in-da')).to.equal(null);
    expect(container.querySelector('table.worst-pages')).to.exist;
  });

  it('renders empty message for empty array', () => {
    renderWorstPages(container, []);
    expect(container.querySelector('.worst-pages-empty')).to.exist;
    expect(container.querySelector('table')).to.equal(null);
  });

  it('is re-render safe', () => {
    renderWorstPages(container, pages, { daContext: { org: 'adobecom', repo: 'milo' } });
    renderWorstPages(container, pages, { daContext: { org: 'adobecom', repo: 'milo' } });
    expect(container.querySelectorAll('table.worst-pages').length).to.equal(1);
  });
});
