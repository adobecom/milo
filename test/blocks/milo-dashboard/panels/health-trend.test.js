import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderHealthTrend } = await import('../../../../libs/blocks/milo-dashboard/panels/health-trend.js');

describe('milo-dashboard health-trend', () => {
  let container;
  let charts;
  const rows = [
    {
      bucket: '2026-05-01', avg_overall: '80.00', avg_performance: 90, avg_seo: 70, avg_accessibility: null, avg_assets: 60,
    },
    {
      bucket: '2026-05-02', avg_overall: 82, avg_performance: 88, avg_seo: 72, avg_accessibility: 50, avg_assets: 65,
    },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    charts = { makeChart: sinon.spy() };
  });

  it('renders 5 toggle buttons in order with Overall active by default', () => {
    renderHealthTrend(container, rows, charts);
    const buttons = [...container.querySelectorAll('.health-trend-toggle button')];
    expect(buttons.map((b) => b.textContent)).to.deep.equal([
      'Overall', 'Performance', 'Accessibility', 'SEO', 'Assets',
    ]);
    expect(buttons[0].classList.contains('active')).to.equal(true);
    expect(buttons.slice(1).some((b) => b.classList.contains('active'))).to.equal(false);
  });

  it('renders initial chart for Overall', () => {
    renderHealthTrend(container, rows, charts);
    expect(charts.makeChart.calledOnce).to.equal(true);
    const option = charts.makeChart.lastCall.args[1];
    expect(option.xAxis.data).to.deep.equal(['2026-05-01', '2026-05-02']);
    expect(option.series[0].name).to.equal('Overall');
    expect(option.series[0].type).to.equal('line');
    expect(option.series[0].data).to.deep.equal([80, 82]);
    expect(option.yAxis.min).to.equal(0);
    expect(option.yAxis.max).to.equal(100);
    expect(option.tooltip).to.deep.equal({ trigger: 'axis' });
  });

  it('switches active and re-renders on Performance click', () => {
    renderHealthTrend(container, rows, charts);
    const buttons = [...container.querySelectorAll('.health-trend-toggle button')];
    const perf = buttons.find((b) => b.textContent === 'Performance');
    perf.click();
    expect(perf.classList.contains('active')).to.equal(true);
    expect(buttons[0].classList.contains('active')).to.equal(false);
    expect(charts.makeChart.calledTwice).to.equal(true);
    const option = charts.makeChart.lastCall.args[1];
    expect(option.series[0].name).to.equal('Performance');
    expect(option.series[0].data).to.deep.equal([90, 88]);
  });

  it('preserves null as a gap for Accessibility (not 0)', () => {
    renderHealthTrend(container, rows, charts);
    const buttons = [...container.querySelectorAll('.health-trend-toggle button')];
    buttons.find((b) => b.textContent === 'Accessibility').click();
    const option = charts.makeChart.lastCall.args[1];
    expect(option.series[0].name).to.equal('Accessibility');
    expect(option.series[0].data).to.deep.equal([null, 50]);
  });

  it('clears container on re-render', () => {
    renderHealthTrend(container, rows, charts);
    renderHealthTrend(container, rows, charts);
    expect(container.querySelectorAll('.health-trend-toggle').length).to.equal(1);
    expect(container.querySelectorAll('.health-trend-toggle button').length).to.equal(5);
    expect(container.querySelectorAll('.health-trend').length).to.equal(1);
  });
});
