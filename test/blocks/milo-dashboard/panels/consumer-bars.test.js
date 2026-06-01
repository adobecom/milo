import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderConsumerBars } = await import('../../../../libs/blocks/milo-dashboard/panels/consumer-bars.js');

describe('milo-dashboard consumer-bars', () => {
  let container;
  let charts;
  const rows = [
    { site: 'cc-shared', publishes: 410, previews: 980, avg_health: '78.00' },
    { site: 'milo', publishes: 540, previews: 1120, avg_health: 86 },
    { site: 'da-blog', publishes: 320, previews: 610, avg_health: 91 },
    { site: 'random-internal', publishes: 5, previews: 8, avg_health: null },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    charts = { makeChart: sinon.stub().callsFake(() => ({ on: sinon.spy() })) };
  });

  it('renders 3 metric buttons + a T1 toggle with correct defaults', () => {
    renderConsumerBars(container, rows, charts);
    const buttons = [...container.querySelectorAll('.consumer-bars-controls button:not(.t1-toggle)')];
    expect(buttons.map((b) => b.textContent)).to.deep.equal(['Publishes', 'Previews', 'Health']);
    expect(buttons[0].classList.contains('active')).to.equal(true);
    expect(buttons.slice(1).some((b) => b.classList.contains('active'))).to.equal(false);
    const t1 = container.querySelector('.t1-toggle');
    expect(t1).to.not.equal(null);
    expect(t1.textContent).to.equal('T1 only');
    expect(t1.getAttribute('aria-pressed')).to.equal('true');
  });

  it('renders initial bar chart, T1-filtered, sorted by publishes desc', () => {
    renderConsumerBars(container, rows, charts);
    expect(charts.makeChart.calledOnce).to.equal(true);
    const option = charts.makeChart.lastCall.args[1];
    expect(option.xAxis.type).to.equal('category');
    expect(option.series[0].type).to.equal('bar');
    expect(option.xAxis.data).to.deep.equal(['cc-shared', 'da-blog']);
    expect(option.xAxis.data).to.not.include('milo');
    expect(option.xAxis.data).to.not.include('random-internal');
    expect(option.series[0].data[0].value).to.equal(410);
    expect(option.series[0].data[1].value).to.equal(320);
    expect(option.tooltip).to.deep.equal({ trigger: 'axis' });
    expect(option.grid.containLabel).to.equal(true);
  });

  it('switches to Health with band coloring and coerced values', () => {
    renderConsumerBars(container, rows, charts);
    const health = [...container.querySelectorAll('.consumer-bars-controls button')]
      .find((b) => b.textContent === 'Health');
    health.click();
    expect(health.classList.contains('active')).to.equal(true);
    const option = charts.makeChart.lastCall.args[1];
    const cc = option.series[0].data[[...option.xAxis.data].indexOf('cc-shared')];
    expect(cc.value).to.equal(78);
    option.series[0].data.forEach((d) => {
      expect(d.itemStyle).to.have.property('color');
    });
  });

  it('shows all consumers when T1 toggled off', () => {
    renderConsumerBars(container, rows, charts);
    const t1 = container.querySelector('.t1-toggle');
    t1.click();
    expect(t1.getAttribute('aria-pressed')).to.equal('false');
    const option = charts.makeChart.lastCall.args[1];
    expect(option.xAxis.data).to.include('milo');
    expect(option.xAxis.data).to.include('random-internal');
    expect(option.xAxis.data.length).to.equal(4);
  });

  it('is re-render safe', () => {
    renderConsumerBars(container, rows, charts);
    renderConsumerBars(container, rows, charts);
    expect(container.querySelectorAll('.consumer-bars').length).to.equal(1);
    expect(charts.makeChart.calledTwice).to.equal(true);
  });

  it('registers a click handler that calls onSelect with the site name', () => {
    const onSelect = sinon.spy();
    renderConsumerBars(container, rows, charts, onSelect);
    const chart = charts.makeChart.lastCall.returnValue;
    expect(chart.on.calledWith('click')).to.equal(true);
    const [evt, handler] = chart.on.lastCall.args;
    expect(evt).to.equal('click');
    expect(handler).to.be.a('function');
    handler({ name: 'cc-shared' });
    expect(onSelect.calledOnceWith('cc-shared')).to.equal(true);
  });

  it('does not register a click handler when onSelect is omitted', () => {
    renderConsumerBars(container, rows, charts);
    const chart = charts.makeChart.lastCall.returnValue;
    expect(chart.on.called).to.equal(false);
  });

  it('re-binds the click handler on every render', () => {
    const onSelect = sinon.spy();
    renderConsumerBars(container, rows, charts, onSelect);
    const t1 = container.querySelector('.t1-toggle');
    t1.click();
    const chart = charts.makeChart.lastCall.returnValue;
    expect(chart.on.calledWith('click')).to.equal(true);
  });
});
