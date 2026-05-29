import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { loadCharts, makeChart, clearCharts } = await import('../../../libs/blocks/milo-dashboard/charts.js');

describe('milo-dashboard charts', () => {
  afterEach(() => {
    delete window.echarts;
    sinon.restore();
  });

  describe('loadCharts', () => {
    it('resolves to the existing window.echarts without loading', async () => {
      const preset = { init: () => {} };
      window.echarts = preset;
      const result = await loadCharts();
      expect(result).to.equal(preset);
    });
  });

  describe('makeChart', () => {
    it('inits with svg renderer, sets the option, and returns the chart', () => {
      const chart = { setOption: sinon.spy(), resize: sinon.spy() };
      window.echarts = { init: sinon.stub().returns(chart) };
      const el = document.createElement('div');
      const option = { series: [] };

      const result = makeChart(el, option);

      expect(window.echarts.init.calledOnceWith(el, null, { renderer: 'svg' })).to.be.true;
      expect(chart.setOption.calledOnceWith(option)).to.be.true;
      expect(result).to.equal(chart);
    });

    it('resizes the chart on window resize', () => {
      const chart = { setOption: sinon.spy(), resize: sinon.spy() };
      window.echarts = { init: sinon.stub().returns(chart) };

      makeChart(document.createElement('div'), {});
      window.dispatchEvent(new Event('resize'));

      expect(chart.resize.called).to.be.true;
    });
  });

  describe('clearCharts', () => {
    it('disposes charts and removes resize listeners', () => {
      const chart = { setOption: sinon.spy(), resize: sinon.spy(), dispose: sinon.spy() };
      window.echarts = { init: sinon.stub().returns(chart) };

      makeChart(document.createElement('div'), {});
      clearCharts();

      expect(chart.dispose.calledOnce).to.be.true;
      window.dispatchEvent(new Event('resize'));
      expect(chart.resize.called).to.be.false;
    });
  });
});
