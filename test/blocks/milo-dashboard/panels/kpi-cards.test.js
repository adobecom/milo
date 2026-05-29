import { expect } from '@esm-bundle/chai';

const { default: renderKpiCards } = await import('../../../../libs/blocks/milo-dashboard/panels/kpi-cards.js');

const fixture = {
  current: { publishes: 100, previews: 200, avg_health: '80.00', active_projects: 5, pages_below_70: 12 },
  delta: { publishes: 20, previews: 50, avg_health: -3, active_projects: 0, pages_below_70: -4 },
};

describe('milo-dashboard kpi-cards', () => {
  let container;
  beforeEach(() => { container = document.createElement('div'); });

  it('renders 5 cards with labels in order', () => {
    renderKpiCards(container, fixture);
    const labels = [...container.querySelectorAll('.kpi-card .kpi-label')].map((el) => el.textContent);
    expect(container.querySelectorAll('.kpi-card').length).to.equal(5);
    expect(labels).to.deep.equal(['Publishes', 'Previews', 'Avg Health Score', 'Active Projects', 'Pages Below 70']);
  });

  it('formats integer values', () => {
    renderKpiCards(container, fixture);
    const value = container.querySelector('.kpi-card .kpi-value');
    expect(value.textContent).to.equal('100');
  });

  it('formats large integers with thousands separators', () => {
    const big = { current: { ...fixture.current, publishes: 1234 }, delta: fixture.delta };
    renderKpiCards(container, big);
    const value = container.querySelector('.kpi-card .kpi-value');
    expect(value.textContent).to.equal('1,234');
  });

  it('formats avg_health to one decimal from string input', () => {
    renderKpiCards(container, fixture);
    const value = container.querySelectorAll('.kpi-card .kpi-value')[2];
    expect(value.textContent).to.equal('80.0');
  });

  it('marks a positive delta on a higher-is-better metric as up', () => {
    renderKpiCards(container, fixture);
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[0];
    expect(delta.textContent).to.equal('+20');
    expect(delta.classList.contains('up')).to.equal(true);
    expect(delta.classList.contains('down')).to.equal(false);
  });

  it('marks a negative avg_health delta as down with one decimal', () => {
    renderKpiCards(container, fixture);
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[2];
    expect(delta.textContent).to.equal('-3.0');
    expect(delta.classList.contains('down')).to.equal(true);
    expect(delta.classList.contains('up')).to.equal(false);
  });

  it('inverts semantic for pages_below_70 (lower is better)', () => {
    renderKpiCards(container, fixture);
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[4];
    expect(delta.textContent).to.equal('-4');
    expect(delta.classList.contains('up')).to.equal(true);
    expect(delta.classList.contains('down')).to.equal(false);
  });

  it('treats a zero delta as neutral', () => {
    renderKpiCards(container, fixture);
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[3];
    expect(delta.textContent).to.equal('+0');
    expect(delta.classList.contains('up')).to.equal(false);
    expect(delta.classList.contains('down')).to.equal(false);
    expect(delta.classList.contains('flat')).to.equal(true);
  });

  it('clears the container on re-render', () => {
    renderKpiCards(container, fixture);
    renderKpiCards(container, fixture);
    expect(container.querySelectorAll('.kpi-card').length).to.equal(5);
  });
});
