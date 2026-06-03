import { expect } from '@esm-bundle/chai';

const { default: renderKpiCards } = await import('../../../../libs/blocks/milo-dashboard/panels/kpi-cards.js');

const fixture = {
  current: { publishes: 120, previews: 200, avg_health: '80.00', active_projects: 5, pages_below_70: 12 },
  prior: { publishes: 100, previews: 200, avg_health: 75, active_projects: 4, pages_below_70: 20 },
  delta: { publishes: 20, previews: 0, avg_health: 5, active_projects: 1, pages_below_70: -8 },
};

describe('milo-dashboard kpi-cards', () => {
  let container;
  beforeEach(() => { container = document.createElement('div'); });

  it('renders 5 cards with labels in order', () => {
    renderKpiCards(container, fixture, 'month');
    const labels = [...container.querySelectorAll('.kpi-card .kpi-label')].map((el) => {
      const clone = el.cloneNode(true);
      clone.querySelector('.info-tip')?.remove();
      return clone.textContent;
    });
    expect(container.querySelectorAll('.kpi-card').length).to.equal(5);
    expect(labels).to.deep.equal(['Publishes', 'Previews', 'Avg Health Score', 'Active Projects', 'Pages Below 70']);
  });

  it('formats integer values', () => {
    renderKpiCards(container, fixture, 'month');
    const value = container.querySelector('.kpi-card .kpi-value');
    expect(value.textContent).to.equal('120');
  });

  it('formats large integers with thousands separators', () => {
    const big = { ...fixture, current: { ...fixture.current, publishes: 1234 } };
    renderKpiCards(container, big, 'month');
    const value = container.querySelector('.kpi-card .kpi-value');
    expect(value.textContent).to.equal('1,234');
  });

  it('formats avg_health to one decimal from string input', () => {
    renderKpiCards(container, fixture, 'month');
    const value = container.querySelectorAll('.kpi-card .kpi-value')[2];
    expect(value.textContent).to.equal('80.0');
  });

  it('shows a positive change on a higher-is-better metric as good + rose', () => {
    renderKpiCards(container, fixture, 'month');
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[0]; // Publishes +20%
    expect(delta.textContent).to.equal('+20%');
    expect(delta.classList.contains('good')).to.equal(true);
    expect(delta.classList.contains('rose')).to.equal(true);
    expect(delta.classList.contains('bad')).to.equal(false);
    expect(delta.classList.contains('fell')).to.equal(false);
  });

  it('shows a zero percent change as flat', () => {
    renderKpiCards(container, fixture, 'month');
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[1];
    expect(delta.textContent).to.equal('0%');
    expect(delta.classList.contains('flat')).to.equal(true);
    expect(delta.classList.contains('good')).to.equal(false);
    expect(delta.classList.contains('bad')).to.equal(false);
  });

  it('rounds avg_health percent change and marks good + rose', () => {
    renderKpiCards(container, fixture, 'month');
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[2];
    expect(delta.textContent).to.equal('+7%');
    expect(delta.classList.contains('good')).to.equal(true);
    expect(delta.classList.contains('rose')).to.equal(true);
  });

  it('shows a drop in a lower-is-better metric as good but with a down arrow', () => {
    // pages_below_70 current 12 vs prior 20 => -40%, higherIsBetter:false => good
    renderKpiCards(container, fixture, 'month');
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[4]; // Pages Below 70
    expect(delta.textContent).to.equal('-40%');
    expect(delta.classList.contains('good')).to.equal(true);
    expect(delta.classList.contains('fell')).to.equal(true);
    expect(delta.classList.contains('up')).to.equal(false);
    expect(delta.classList.contains('rose')).to.equal(false);
  });

  it('shows an em dash and flat when prior is zero', () => {
    const zeroPrior = { ...fixture, prior: { ...fixture.prior, active_projects: 0 } };
    renderKpiCards(container, zeroPrior, 'month');
    const delta = container.querySelectorAll('.kpi-card .kpi-delta')[3];
    expect(delta.textContent).to.equal('—');
    expect(delta.classList.contains('flat')).to.equal(true);
    expect(delta.classList.contains('good')).to.equal(false);
    expect(delta.classList.contains('bad')).to.equal(false);
  });

  it('adds a period label to every card', () => {
    renderKpiCards(container, fixture, 'month');
    const periods = [...container.querySelectorAll('.kpi-card .kpi-period')];
    expect(periods.length).to.equal(5);
    periods.forEach((el) => expect(el.textContent).to.equal('vs last month'));
  });

  it('defaults the period to week when omitted', () => {
    renderKpiCards(container, fixture);
    const period = container.querySelector('.kpi-card .kpi-period');
    expect(period.textContent).to.equal('vs last week');
  });

  it('adds info tips to Avg Health and Pages Below 70 cards only', () => {
    renderKpiCards(container, fixture, 'month');
    const cards = container.querySelectorAll('.kpi-card');
    expect(cards[2].querySelector('.info-tip')).to.not.equal(null); // Avg Health
    expect(cards[4].querySelector('.info-tip')).to.not.equal(null); // Pages Below 70
    expect(cards[0].querySelector('.info-tip')).to.equal(null);     // Publishes
  });

  it('clears the container on re-render', () => {
    renderKpiCards(container, fixture, 'month');
    renderKpiCards(container, fixture, 'month');
    expect(container.querySelectorAll('.kpi-card').length).to.equal(5);
  });
});
