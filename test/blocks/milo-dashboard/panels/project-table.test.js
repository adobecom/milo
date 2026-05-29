import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderProjectTable } = await import('../../../../libs/blocks/milo-dashboard/panels/project-table.js');

describe('milo-dashboard project-table', () => {
  let container;
  const rows = [
    { site: 'milo', publishes: 50, previews: 90, avg_health: '78.00', checks: 30 },
    { site: 'da-blog', publishes: '120', previews: 40, avg_health: 65, checks: 10 },
    { site: 'orphan', publishes: 5, previews: 8, avg_health: null, checks: 0 },
  ];

  const sites = () => [...container.querySelectorAll('.project-row')].map((r) => r.dataset.site);
  const header = (i) => container.querySelectorAll('.project-table th')[i];

  beforeEach(() => { container = document.createElement('div'); });

  it('renders a project-table with 3 rows', () => {
    renderProjectTable(container, rows);
    expect(container.querySelector('.project-table')).to.exist;
    expect(container.querySelectorAll('.project-row').length).to.equal(3);
  });

  it('defaults to publishes descending', () => {
    renderProjectTable(container, rows);
    expect(sites()).to.deep.equal(['da-blog', 'milo', 'orphan']);
  });

  it('formats health to one decimal or em dash', () => {
    renderProjectTable(container, rows);
    const cells = container.querySelectorAll('.project-row');
    const milo = [...cells].find((r) => r.dataset.site === 'milo');
    const orphan = [...cells].find((r) => r.dataset.site === 'orphan');
    expect(milo.children[3].textContent).to.equal('78.0');
    expect(orphan.children[3].textContent).to.equal('—');
  });

  it('sorts project column alphabetically toggling asc/desc', () => {
    renderProjectTable(container, rows);
    header(0).click();
    expect(sites()[0]).to.equal('da-blog');
    expect(header(0).classList.contains('sorted-asc')).to.equal(true);
    header(0).click();
    expect(sites()[0]).to.equal('orphan');
    expect(header(0).classList.contains('sorted-desc')).to.equal(true);
  });

  it('sorts by health with nulls last in both directions', () => {
    renderProjectTable(container, rows);
    header(3).click();
    expect(sites()[sites().length - 1]).to.equal('orphan');
    header(3).click();
    expect(sites()[sites().length - 1]).to.equal('orphan');
  });

  it('calls onSelect with the site on row click', () => {
    const spy = sinon.spy();
    renderProjectTable(container, rows, spy);
    const milo = [...container.querySelectorAll('.project-row')].find((r) => r.dataset.site === 'milo');
    milo.click();
    expect(spy.calledOnceWith('milo')).to.equal(true);
  });

  it('clears on re-render', () => {
    renderProjectTable(container, rows);
    renderProjectTable(container, rows);
    expect(container.querySelectorAll('.project-row').length).to.equal(3);
  });
});
