import { expect } from '@esm-bundle/chai';

const { default: renderTotals } = await import('../../../../libs/blocks/milo-dashboard/panels/totals-strip.js');

const totals = { total: 168294, perSite: [{ site: 'da-dc', pages: 69014 }, { site: 'milo', pages: 123 }] };

describe('milo-dashboard totals-strip', () => {
  let panel; let headerStat;
  beforeEach(() => { panel = document.createElement('div'); headerStat = document.createElement('div'); });

  it('writes the grand total into the header stat element', () => {
    renderTotals(panel, totals, headerStat);
    expect(headerStat.querySelector('.allstat-number').textContent).to.equal('168,294');
    expect(headerStat.querySelector('.allstat-caption').textContent).to.contain('all-time');
  });

  it('renders only the per-site list (no grand total) in the panel', () => {
    renderTotals(panel, totals, headerStat);
    expect(panel.querySelector('.totals-total')).to.equal(null);
    expect(panel.querySelectorAll('.totals-item').length).to.equal(2);
  });

  it('shows a dash in the header when totals are missing', () => {
    renderTotals(panel, null, headerStat);
    expect(headerStat.querySelector('.allstat-number').textContent).to.equal('—');
  });
});
