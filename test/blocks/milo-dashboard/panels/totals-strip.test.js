import { expect } from '@esm-bundle/chai';

const { default: renderTotals } = await import('../../../../libs/blocks/milo-dashboard/panels/totals-strip.js');

const fixture = {
  total: 12840,
  perSite: [
    { site: 'milo', pages: '5400' },
    { site: 'cc-shared', pages: 4100 },
    { site: 'da-blog', pages: 3340 },
  ],
};

describe('milo-dashboard totals-strip', () => {
  let container;
  beforeEach(() => { container = document.createElement('div'); });

  it('renders the grand total with thousands separators', () => {
    renderTotals(container, fixture);
    expect(container.querySelector('.totals-number').textContent).to.equal('12,840');
  });

  it('renders one item per consumer', () => {
    renderTotals(container, fixture);
    expect(container.querySelectorAll('.totals-item').length).to.equal(3);
  });

  it('shows site name and coerced, separated count on first item', () => {
    renderTotals(container, fixture);
    const first = container.querySelector('.totals-item');
    expect(first.querySelector('.totals-site').textContent).to.equal('milo');
    expect(first.querySelector('.totals-count').textContent).to.equal('5,400');
  });

  it('preserves the given order', () => {
    renderTotals(container, fixture);
    const sites = [...container.querySelectorAll('.totals-site')].map((el) => el.textContent);
    expect(sites).to.deep.equal(['milo', 'cc-shared', 'da-blog']);
  });

  it('renders an empty message when totals is null', () => {
    renderTotals(container, null);
    expect(container.querySelector('.totals-empty')).to.exist;
    expect(container.querySelectorAll('.totals-item').length).to.equal(0);
  });

  it('renders an empty message when perSite is missing', () => {
    renderTotals(container, { total: 5 });
    expect(container.querySelector('.totals-empty')).to.exist;
    expect(container.querySelectorAll('.totals-item').length).to.equal(0);
  });

  it('clears the container on re-render', () => {
    renderTotals(container, fixture);
    renderTotals(container, fixture);
    expect(container.querySelectorAll('.totals-item').length).to.equal(3);
  });
});
