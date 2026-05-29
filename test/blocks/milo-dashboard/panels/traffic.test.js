import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderTraffic, nullTrafficAdapter } = await import('../../../../libs/blocks/milo-dashboard/panels/traffic.js');

const COMING_SOON = 'Coming soon — RUM / Adobe Analytics integration pending.';

describe('milo-dashboard traffic', () => {
  let container;
  let charts;
  beforeEach(() => {
    container = document.createElement('div');
    charts = { makeChart: sinon.spy() };
  });

  describe('nullTrafficAdapter', () => {
    it('resolves null', async () => {
      expect(await nullTrafficAdapter.getTraffic()).to.equal(null);
    });
  });

  describe('renderTraffic', () => {
    it('renders empty state with null adapter, no chart', async () => {
      await renderTraffic(container, nullTrafficAdapter, charts);
      const panel = container.querySelector('.traffic-panel');
      expect(panel).to.exist;
      const empty = container.querySelector('.traffic-empty');
      expect(empty).to.exist;
      expect(empty.textContent).to.include('Traffic');
      expect(empty.textContent).to.include(COMING_SOON);
      expect(container.querySelector('.traffic-trend')).to.equal(null);
      expect(charts.makeChart.called).to.equal(false);
    });

    it('renders a chart when adapter returns series data', async () => {
      const data = { buckets: ['2026-05-01'], series: [{ name: 'Pageviews', data: [1000] }] };
      const adapter = { getTraffic: async () => data };
      await renderTraffic(container, adapter, charts);
      const trend = container.querySelector('.traffic-trend');
      expect(trend).to.exist;
      expect(charts.makeChart.calledOnce).to.equal(true);
      const [el, option] = charts.makeChart.firstCall.args;
      expect(el).to.equal(trend);
      expect(option.xAxis.data).to.deep.equal(['2026-05-01']);
      expect(option.series[0].name).to.equal('Pageviews');
      expect(option.series[0].type).to.equal('line');
    });

    it('renders empty state when adapter rejects, does not throw', async () => {
      const adapter = { getTraffic: async () => { throw new Error('boom'); } };
      await renderTraffic(container, adapter, charts);
      expect(container.querySelector('.traffic-empty')).to.exist;
      expect(container.querySelector('.traffic-trend')).to.equal(null);
      expect(charts.makeChart.called).to.equal(false);
    });

    it('is re-render safe', async () => {
      await renderTraffic(container, nullTrafficAdapter, charts);
      await renderTraffic(container, nullTrafficAdapter, charts);
      expect(container.querySelectorAll('.traffic-panel').length).to.equal(1);
      expect(container.querySelectorAll('.traffic-empty').length).to.equal(1);
    });
  });
});
