import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderHealthGauge } = await import('../../../../libs/blocks/milo-dashboard/panels/health-gauge.js');

const scores = {
  avg_overall: '82.50',
  avg_performance: 90,
  avg_seo: 70,
  avg_accessibility: '45.00',
  avg_assets: null,
};

describe('milo-dashboard health-gauge', () => {
  let container;
  let charts;
  beforeEach(() => {
    container = document.createElement('div');
    charts = { makeChart: sinon.spy() };
  });

  it('calls makeChart once with the gauge element and a ring option', () => {
    renderHealthGauge(container, scores, charts);
    expect(charts.makeChart.calledOnce).to.equal(true);
    const [el, option] = charts.makeChart.firstCall.args;
    expect(el.classList.contains('gauge')).to.equal(true);
    expect(container.contains(el)).to.equal(true);
    // bundled echarts.common has no gauge chart, so the score is a pie/doughnut ring
    expect(option.series[0].type).to.equal('pie');
    expect(option.series[0].data[0].value).to.be.closeTo(82.5, 0.01);
    expect(option.series[0].data[1].value).to.be.closeTo(17.5, 0.01);
    expect(option.title.text).to.equal('82.5');
  });

  it('renders 4 category bars in order', () => {
    renderHealthGauge(container, scores, charts);
    const labels = [...container.querySelectorAll('.category-bar .category-label')]
      .map((el) => el.textContent);
    expect(container.querySelectorAll('.category-bar').length).to.equal(4);
    expect(labels).to.deep.equal(['Performance', 'Accessibility', 'SEO', 'Assets']);
  });

  it('sets fill widths from numeric, string, and null scores', () => {
    renderHealthGauge(container, scores, charts);
    const fills = container.querySelectorAll('.category-bar .category-fill');
    expect(fills[0].style.width).to.equal('90%');
    expect(fills[1].style.width).to.equal('45%');
    expect(fills[3].style.width).to.equal('0%');
  });

  it('shows category score with one decimal', () => {
    renderHealthGauge(container, scores, charts);
    const scoreEl = container.querySelector('.category-bar .category-score');
    expect(scoreEl.textContent).to.equal('90.0');
  });

  it('clears the container on re-render', () => {
    renderHealthGauge(container, scores, charts);
    renderHealthGauge(container, scores, charts);
    expect(container.querySelectorAll('.gauge').length).to.equal(1);
    expect(container.querySelectorAll('.category-bar').length).to.equal(4);
    expect(charts.makeChart.calledTwice).to.equal(true);
  });
});
