import { expect } from '@esm-bundle/chai';

const { default: renderTotals } = await import('../../../../libs/blocks/milo-dashboard/panels/totals-strip.js');

const totals = { total: 168294, perSite: [{ site: 'da-dc', pages: 69014 }, { site: 'milo', pages: 123 }] };

describe('milo-dashboard totals-strip', () => {
  let panel;
  beforeEach(() => { panel = document.createElement('div'); });

  it('renders the per-site list with formatted counts', () => {
    renderTotals(panel, totals);
    const items = panel.querySelectorAll('.totals-item');
    expect(items.length).to.equal(2);
    expect(items[0].querySelector('.totals-site').textContent).to.equal('da-dc');
    expect(items[0].querySelector('.totals-count').textContent).to.equal('69,014');
  });

  it('does not render an all-time grand total', () => {
    renderTotals(panel, totals);
    expect(panel.querySelector('.totals-total')).to.equal(null);
    expect(panel.querySelector('.allstat-number')).to.equal(null);
  });

  it('shows an empty state when totals are missing', () => {
    renderTotals(panel, null);
    expect(panel.querySelector('.totals-empty')).to.not.equal(null);
  });
});
