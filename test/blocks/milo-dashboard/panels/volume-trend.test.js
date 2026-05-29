import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderVolumeTrend, pivotVolume } = await import('../../../../libs/blocks/milo-dashboard/panels/volume-trend.js');

describe('milo-dashboard volume-trend', () => {
  describe('pivotVolume', () => {
    it('pivots rows into aligned live/preview series with coercion and 0 fill', () => {
      const rows = [
        { bucket: '2026-05-01', route: 'live', amount: '10' },
        { bucket: '2026-05-01', route: 'preview', amount: 5 },
        { bucket: '2026-05-02', route: 'live', amount: 7 },
      ];
      expect(pivotVolume(rows)).to.deep.equal({
        buckets: ['2026-05-01', '2026-05-02'],
        live: [10, 7],
        preview: [5, 0],
      });
    });

    it('returns ascending buckets even when input is unsorted', () => {
      const rows = [
        { bucket: '2026-05-03', route: 'live', amount: 3 },
        { bucket: '2026-05-01', route: 'live', amount: 1 },
        { bucket: '2026-05-02', route: 'live', amount: 2 },
      ];
      const result = pivotVolume(rows);
      expect(result.buckets).to.deep.equal(['2026-05-01', '2026-05-02', '2026-05-03']);
      expect(result.live).to.deep.equal([1, 2, 3]);
    });

    it('returns empty arrays for empty input', () => {
      expect(pivotVolume([])).to.deep.equal({ buckets: [], live: [], preview: [] });
    });
  });

  describe('renderVolumeTrend', () => {
    let container;
    let charts;
    const rows = [
      { bucket: '2026-05-01', route: 'live', amount: 10 },
      { bucket: '2026-05-01', route: 'preview', amount: 5 },
      { bucket: '2026-05-02', route: 'live', amount: 7 },
    ];
    beforeEach(() => {
      container = document.createElement('div');
      charts = { makeChart: sinon.spy() };
    });

    it('calls makeChart once with a .volume-trend element and a valid option', () => {
      renderVolumeTrend(container, rows, charts);
      expect(charts.makeChart.calledOnce).to.equal(true);
      const [el, option] = charts.makeChart.firstCall.args;
      expect(el.classList.contains('volume-trend')).to.equal(true);
      expect(container.contains(el)).to.equal(true);
      expect(option.xAxis.data).to.deep.equal(['2026-05-01', '2026-05-02']);
      expect(option.series.map((s) => s.name)).to.deep.equal(['Publishes', 'Previews']);
      expect(option.series[0].data).to.deep.equal([10, 7]);
      expect(option.series[1].data).to.deep.equal([5, 0]);
      expect(option.series[0].type).to.equal('line');
      expect(option.series[0].areaStyle).to.exist;
    });

    it('clears the container on re-render', () => {
      renderVolumeTrend(container, rows, charts);
      renderVolumeTrend(container, rows, charts);
      expect(container.querySelectorAll('.volume-trend').length).to.equal(1);
      expect(charts.makeChart.calledTwice).to.equal(true);
    });

    it('handles empty input without throwing', () => {
      renderVolumeTrend(container, [], charts);
      const [, option] = charts.makeChart.firstCall.args;
      expect(option.xAxis.data).to.deep.equal([]);
      expect(option.series[0].data).to.deep.equal([]);
      expect(option.series[1].data).to.deep.equal([]);
    });
  });
});
