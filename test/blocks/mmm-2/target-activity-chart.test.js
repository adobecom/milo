import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile, setViewport } from '@web/test-runner-commands';
import { html, render } from '../../../libs/deps/htm-preact.js';
import { setConfig } from '../../../libs/utils/utils.js';
import TargetActivityChart from '../../../libs/blocks/mmm-2/components/TargetActivityChart.js';
import { waitFor } from '../../helpers/waitfor.js';

describe('Target Activity Historical Data', () => {
  let container;
  let script;
  let chart;
  let fetchStub;
  let originalEcharts;

  beforeEach(() => {
    setConfig({ miloLibs: '/libs', codeRoot: '/libs', env: { name: 'stage' } });
    container = document.createElement('div');
    document.body.append(container);
    script = document.createElement('script');
    script.src = '/libs/deps/echarts.common.min.js';
    script.type = 'javascript/blocked';
    script.dataset.loaded = 'true';
    document.head.append(script);
    originalEcharts = window.echarts;
    chart = { setOption: sinon.spy(), resize: sinon.spy(), dispose: sinon.spy() };
    window.echarts = { init: sinon.stub().returns(chart) };
  });

  afterEach(() => {
    render(null, container);
    container.remove();
    script.remove();
    fetchStub.restore();
    window.echarts = originalEcharts;
  });

  const bulkResponse = (rows, geoRows = {}) => ({
    breakdown: true,
    result: [
      ...rows.map((row) => ({ ...row, geo: 'ALL' })),
      ...Object.entries(geoRows).flatMap(([geo, snapshots]) => (
        snapshots.map((row) => ({ ...row, geo: geo === 'us' ? '' : geo }))
      )),
    ].sort((a, b) => a.date.localeCompare(b.date)),
  });

  async function mount(rows, props = {}, geoRows = {}) {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => bulkResponse(rows, geoRows),
    });
    render(html`<${TargetActivityChart} ...${props} />`, container);
    container.querySelector('.mmm2-history-chart-summary-toggle').click();
    await waitFor(() => (
      (chart.setOption.called && !container.querySelector('[role="status"]'))
      || container.querySelector('.mmm2-history-chart-empty')
    ));
  }

  const options = () => chart.setOption.lastCall.args[0];
  const snapshot = (date, targetOnCount) => ({ date, targetOnCount });

  it('starts collapsed and makes no history request or chart initialization until opened', async () => {
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => bulkResponse(
        [snapshot('2024-04-10', 100)],
        { us: [snapshot('2024-04-10', 60)] },
      ),
    });
    render(html`<${TargetActivityChart} />`, container);
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    const toggle = container.querySelector('.mmm2-history-chart-summary-toggle');
    expect(toggle.getAttribute('aria-expanded')).to.equal('false');
    expect(container.querySelector('.mmm2-history-chart-body').style.display).to.equal('none');
    expect(container.querySelector('[role="status"]')).to.not.exist;
    expect(fetchStub.called).to.be.false;
    expect(window.echarts.init.called).to.be.false;
    render(html`<${TargetActivityChart} selectedGeos="us" />`, container);
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    expect(fetchStub.called).to.be.false;
    toggle.click();
    await waitFor(() => chart.setOption.called && !container.querySelector('[role="status"]'));
    expect(fetchStub.calledOnce).to.be.true;
    expect(options().series[0].data).to.deep.equal([60]);
  });

  it('defers collapsed geo changes and reuses cached history when reopened', async () => {
    await mount([snapshot('2024-04-10', 100)], {}, { us: [snapshot('2024-04-10', 60)] });
    const toggle = container.querySelector('.mmm2-history-chart-summary-toggle');
    toggle.click();
    await waitFor(() => toggle.getAttribute('aria-expanded') === 'false');
    const renderCount = chart.setOption.callCount;
    render(html`<${TargetActivityChart} selectedGeos="us" />`, container);
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    expect(chart.setOption.callCount).to.equal(renderCount);
    toggle.click();
    await waitFor(() => options().series[0].name === 'us'
      && !container.querySelector('[role="status"]'));
    expect(options().series[0].data).to.deep.equal([60]);
    expect(fetchStub.calledOnce).to.be.true;
    toggle.click();
    await waitFor(() => toggle.getAttribute('aria-expanded') === 'false');
    toggle.click();
    await waitFor(() => toggle.getAttribute('aria-expanded') === 'true');
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('identifies the selected authored geo and restores the view dropdown for Show All', async () => {
    const geoGroups = [
      { value: 'us', label: 'US: United States' },
      { value: 'us,ca', label: 'North America' },
    ];
    await mount([snapshot('2024-04-10', 100)], { selectedGeos: 'us', geoGroups }, {
      us: [snapshot('2024-04-10', 60)],
      ca: [snapshot('2024-04-10', 40)],
    });
    expect(container.querySelector('.mmm2-history-chart-geo-label').textContent)
      .to.equal('Geo: US: United States');
    expect(container.querySelector('#mmm2-history-chart-breakdown')).to.not.exist;
    render(html`<${TargetActivityChart} selectedGeos="us,ca" geoGroups=${geoGroups} />`, container);
    await waitFor(() => options().series[0].name === 'North America'
      && !container.querySelector('[role="status"]'));
    expect(container.querySelector('.mmm2-history-chart-geo-label').textContent)
      .to.equal('Geo: North America');
    expect(options().series[0].data).to.deep.equal([100]);
    render(html`<${TargetActivityChart} selectedGeos="" geoGroups=${geoGroups} />`, container);
    await waitFor(() => container.querySelector('#mmm2-history-chart-breakdown'));
    expect(container.querySelector('.mmm2-history-chart-geo-label')).to.not.exist;
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('identifies a geo by its code when no authored label is available', async () => {
    await mount([snapshot('2024-04-10', 100)], { selectedGeos: 'us' }, { us: [snapshot('2024-04-10', 60)] });
    expect(container.querySelector('.mmm2-history-chart-geo-label').textContent).to.equal('Geo: us');
    expect(options().series[0].name).to.equal('us');
  });

  it('shows individual daily values and full dates in tooltips for short history', async () => {
    await mount([
      snapshot('2024-02-27', 100),
      snapshot('2024-02-28', 120),
      snapshot('2024-02-29', 140),
    ]);
    expect(options().xAxis.data).to.deep.equal(['Feb 27', 'Feb 28', 'Feb 29']);
    expect(options().series[0].data).to.deep.equal([100, 120, 140]);
    const tooltip = options().tooltip.formatter([{ axisValueLabel: 'Feb 29', marker: '', seriesName: 'All pages', value: 140 }]);
    expect(tooltip).to.include('February 29, 2024');
    expect(tooltip).to.include('140');
  });

  it('leaves missing days as null instead of inventing counts', async () => {
    await mount([snapshot('2024-04-10', 0), snapshot('2024-04-12', 25)]);
    expect(options().xAxis.data).to.deep.equal(['Apr 10', 'Apr 11', 'Apr 12']);
    expect(options().series[0].data).to.deep.equal([0, null, 25]);
    expect(options().tooltip.formatter([{ axisValueLabel: 'Apr 11', marker: '', seriesName: 'All pages', value: null }])).to.include('No data');
    expect(options().tooltip.formatter([{ axisValueLabel: 'Apr 10', marker: '', seriesName: 'All pages', value: 0 }])).to.include('<strong>0</strong>');
  });

  it('supports a single daily snapshot', async () => {
    await mount([snapshot('2024-04-10', 0)]);
    expect(options().xAxis.data).to.deep.equal(['Apr 10']);
    expect(options().series[0].data).to.deep.equal([0]);
  });

  it('themes chart axes and tooltips for the explicit dark block', async () => {
    container.className = 'mmm-2 dark';
    container.style.setProperty('--color-accent', '#82b4ff');
    await mount([snapshot('2024-04-10', 100)]);
    expect(options().textStyle.color).to.equal('#f5f5f5');
    expect(options().xAxis.axisLabel.color).to.equal('#f5f5f5');
    expect(options().yAxis.axisLabel.color).to.equal('#f5f5f5');
    expect(options().yAxis.splitLine.lineStyle.color).to.equal('#444');
    expect(options().tooltip.backgroundColor).to.equal('#202020');
    expect(options().tooltip.textStyle.color).to.equal('#f5f5f5');
    expect(options().series[0].lineStyle.color).to.equal('#82b4ff');
  });

  it('keeps the light chart presentation when no dark modifier is authored', async () => {
    container.className = 'mmm-2';
    await mount([snapshot('2024-04-10', 100)]);
    expect(options().textStyle).to.equal(undefined);
    expect(options().tooltip.backgroundColor).to.equal(undefined);
    expect(options().series[0].lineStyle.color).to.equal('#4046CA');
  });

  it('uses distinct bright series colors for dark geo breakdowns', async () => {
    container.className = 'mmm-2 dark';
    await mount([snapshot('2024-04-10', 100)], { geoGroups: [{ value: 'us', label: 'US' }, { value: 'ca', label: 'CA' }] }, {
      us: [snapshot('2024-04-10', 60)],
      ca: [snapshot('2024-04-10', 40)],
    });
    const select = container.querySelector('#mmm2-history-chart-breakdown');
    select.value = 'geo';
    select.dispatchEvent(new Event('change'));
    await waitFor(() => options().series.length === 2);
    expect(options().series.map(({ lineStyle }) => lineStyle.color))
      .to.deep.equal(['#82b4ff', '#ffab70']);
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('uses daily points across a month boundary when fewer than 31 days are covered', async () => {
    await mount([snapshot('2024-01-30', 100), snapshot('2024-02-02', 120)]);
    expect(options().xAxis.data).to.deep.equal(['Jan 30', 'Jan 31', 'Feb 1', 'Feb 2']);
    expect(options().series[0].data).to.deep.equal([100, null, null, 120]);
    expect(options().tooltip.formatter([{ axisValueLabel: 'Feb 1', marker: '', seriesName: 'All pages', value: null }])).to.include('February 1, 2024');
  });

  it('uses daily points for 30 covered days', async () => {
    await mount([snapshot('2024-01-01', 100), snapshot('2024-01-30', 120)]);
    expect(options().xAxis.data).to.have.length(30);
    expect(options().xAxis.data[0]).to.equal('Jan 1');
    expect(options().xAxis.data[29]).to.equal('Jan 30');
    expect(options().series[0].data[29]).to.equal(120);
  });

  it('switches to monthly points at exactly 31 covered days', async () => {
    await mount([snapshot('2024-01-01', 100), snapshot('2024-01-31', 120)]);
    expect(options().xAxis.data[0]).to.equal('Jan');
    expect(options().series[0].data[0]).to.equal(120);
  });

  it('retains the latest monthly values when more than one month is available', async () => {
    await mount([
      snapshot('2024-01-01', 100),
      snapshot('2024-01-31', 150),
      snapshot('2024-02-29', 200),
    ]);
    expect(options().xAxis.data).to.deep.equal([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]);
    expect(options().series[0].data).to.deep.equal([
      150, 200, null, null, null, null, null, null, null, null, null, null,
    ]);
    expect(options().tooltip.formatter([{ axisValueLabel: 'Jan', marker: '', seriesName: 'All pages', value: 150 }])).to.include('January, 2024');
  });

  it('switches granularity when a different year is selected', async () => {
    await mount([
      snapshot('2024-01-01', 100),
      snapshot('2024-02-29', 150),
      snapshot('2025-03-01', 200),
      snapshot('2025-03-02', 225),
    ]);
    expect(options().xAxis.data).to.deep.equal(['Mar 1', 'Mar 2']);
    const yearSelect = container.querySelector('#mmm2-history-chart-year');
    yearSelect.value = '2024';
    yearSelect.dispatchEvent(new Event('change'));
    await waitFor(() => options().xAxis.data[0] === 'Jan');
    expect(options().series[0].data.slice(0, 2)).to.deep.equal([100, 150]);
    yearSelect.value = '2025';
    yearSelect.dispatchEvent(new Event('change'));
    await waitFor(() => options().xAxis.data[0] === 'Mar 1');
    expect(options().series[0].data).to.deep.equal([200, 225]);
  });

  it('aligns geo breakdowns on the same daily axis', async () => {
    await mount([snapshot('2024-02-01', 180)], { geoGroups: [{ value: 'us', label: 'US' }, { value: 'ca', label: 'CA' }] }, {
      us: [snapshot('2024-02-01', 100), snapshot('2024-02-03', 102)],
      ca: [snapshot('2024-02-02', 80), snapshot('2024-02-03', 81)],
    });
    const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
    viewSelect.value = 'geo';
    viewSelect.dispatchEvent(new Event('change'));
    await waitFor(() => options().series.length === 2);
    expect(options().xAxis.data).to.deep.equal(['Feb 1', 'Feb 2', 'Feb 3']);
    expect(options().series.map(({ name, data }) => ({ name, data }))).to.deep.equal([
      { name: 'US', data: [100, null, 102] },
      { name: 'CA', data: [null, 80, 81] },
    ]);
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.get('breakdown')).to.equal('true');
    expect(url.searchParams.has('geos')).to.be.false;
    expect(fetchStub.calledOnce).to.be.true;
    viewSelect.value = 'all';
    viewSelect.dispatchEvent(new Event('change'));
    await waitFor(() => options().series[0].name === 'All pages');
    expect(options().series[0].data).to.deep.equal([180]);
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('sums distinct exact geo codes, maps US, and preserves zero and missing days', async () => {
    const props = {
      selectedGeos: 'us, ca,us',
      geoGroups: [{ value: 'us, ca,us', label: 'North America' }],
    };
    await mount([
      snapshot('2024-04-01', 1000),
      snapshot('2024-04-10', 2000),
      snapshot('2024-04-12', 3000),
    ], props, {
      us: [snapshot('2024-04-10', 0), snapshot('2024-04-12', 20)],
      ca: [snapshot('2024-04-10', 0), snapshot('2024-04-12', 30)],
      'ca-en': [snapshot('2024-04-12', 100)],
    });
    expect(options().series[0].name).to.equal('North America');
    expect(options().xAxis.data).to.deep.equal(['Apr 10', 'Apr 11', 'Apr 12']);
    expect(options().series[0].data).to.deep.equal([0, null, 50]);
    render(html`<${TargetActivityChart} ...${props} selectedGeos="us" />`, container);
    await waitFor(() => options().series[0].name === 'us');
    expect(options().series[0].data).to.deep.equal([0, null, 20]);
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('builds many overlapping geo groups from one response', async () => {
    const props = {
      geoGroups: Array.from({ length: 20 }, (_, i) => ({
        value: i % 2 ? 'us,ca' : 'us',
        label: `Group ${i}`,
      })),
    };
    await mount([snapshot('2024-04-10', 180)], props, {
      us: [snapshot('2024-04-10', 100)],
      ca: [snapshot('2024-04-10', 80)],
    });
    const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
    viewSelect.value = 'geo';
    viewSelect.dispatchEvent(new Event('change'));
    await waitFor(() => options().series.length === 20);
    expect(options().series.map((line) => line.data[0]))
      .to.deep.equal(Array.from({ length: 20 }, (_, i) => (i % 2 ? 180 : 100)));
    expect(fetchStub.calledOnce).to.be.true;
  });

  it('does not turn ALL-only historical snapshots into geo counts', async () => {
    await mount([snapshot('2024-04-10', 180)], { selectedGeos: 'us' });
    expect(container.querySelector('.mmm2-history-chart-empty')).to.exist;
    expect(chart.setOption.called).to.be.false;
  });

  it('keeps mock history available without making API requests', async () => {
    const originalUrl = window.location.href;
    const mockUrl = new URL(originalUrl);
    mockUrl.searchParams.set('mmm2MockHistory', '1');
    window.history.replaceState(null, '', mockUrl);
    try {
      await mount([], { geoGroups: [{ value: 'us', label: 'US' }] });
      expect(options().series[0].name).to.equal('All pages');
      const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
      viewSelect.value = 'geo';
      viewSelect.dispatchEvent(new Event('change'));
      await waitFor(() => options().series[0].name === 'US');
      expect(fetchStub.called).to.be.false;
    } finally {
      window.history.replaceState(null, '', originalUrl);
    }
  });

  it('does not reuse cached history from a different API source', async () => {
    await mount([snapshot('2024-04-10', 180)], {}, { us: [snapshot('2024-04-10', 100)] });
    setConfig({ miloLibs: '/libs', codeRoot: '/libs', env: { name: 'local' } });
    render(html`<${TargetActivityChart} selectedGeos="us" />`, container);
    await waitFor(() => options().series[0].name === 'us');
    expect(options().series[0].data).to.deep.equal([100]);
    expect(fetchStub.callCount).to.equal(2);
    expect(fetchStub.firstCall.args[0]).to.not.equal(fetchStub.lastCall.args[0]);
  });

  it('reports an unsupported backend instead of falling back to per-geo requests', async () => {
    const errorStub = sinon.stub(console, 'error');
    try {
      fetchStub = sinon.stub(window, 'fetch').resolves({
        ok: true,
        json: async () => ({ result: [snapshot('2024-04-10', 180)] }),
      });
      render(html`<${TargetActivityChart} selectedGeos="us" />`, container);
      container.querySelector('.mmm2-history-chart-summary-toggle').click();
      await waitFor(() => container.querySelector('[role="alert"]'));
      expect(container.querySelector('[role="alert"]').textContent)
        .to.include('Deploy the updated backend');
      expect(fetchStub.calledOnce).to.be.true;
      expect(chart.setOption.called).to.be.false;
    } finally {
      errorStub.restore();
    }
  });

  it('uses the combined date range to choose granularity for geo breakdowns', async () => {
    await mount([snapshot('2024-01-01', 180)], { geoGroups: [{ value: 'us', label: 'US' }, { value: 'ca', label: 'CA' }] }, {
      us: [snapshot('2024-01-01', 100)],
      ca: [snapshot('2024-02-29', 80)],
    });
    const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
    viewSelect.value = 'geo';
    viewSelect.dispatchEvent(new Event('change'));
    await waitFor(() => options().series.length === 2);
    expect(options().xAxis.data.slice(0, 2)).to.deep.equal(['Jan', 'Feb']);
    expect(options().series.map((line) => line.data.slice(0, 2)))
      .to.deep.equal([[100, null], [null, 80]]);
  });

  it('keeps the empty-history message without initializing a chart', async () => {
    await mount([]);
    expect(container.querySelector('.mmm2-history-chart-empty')).to.exist;
    expect(chart.setOption.called).to.be.false;
  });

  it('keeps the loading status until the chart library is ready', async () => {
    delete script.dataset.loaded;
    const listenerSpy = sinon.spy(script, 'addEventListener');
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: async () => bulkResponse([snapshot('2024-04-10', 100)]),
    });
    render(html`<${TargetActivityChart} />`, container);
    container.querySelector('.mmm2-history-chart-summary-toggle').click();
    await waitFor(() => fetchStub.called && container.querySelector('[role="status"]'));
    expect(container.querySelector('.mmm2-history-chart-body').getAttribute('aria-busy'))
      .to.equal('true');
    expect(chart.setOption.called).to.be.false;
    await waitFor(() => listenerSpy.calledWith('load'));
    listenerSpy.restore();
    script.dispatchEvent(new Event('load'));
    await waitFor(() => chart.setOption.called && !container.querySelector('[role="status"]'));
    expect(container.querySelector('.mmm2-history-chart-body').getAttribute('aria-busy'))
      .to.equal('false');
  });

  it('dims the previous chart while rendering cached geo data without more requests', async () => {
    await mount([snapshot('2024-04-10', 180)], { geoGroups: [{ value: 'us', label: 'US' }, { value: 'ca', label: 'CA' }] }, {
      us: [snapshot('2024-04-10', 100)],
      ca: [snapshot('2024-04-10', 80)],
    });
    delete script.dataset.loaded;
    const listenerSpy = sinon.spy(script, 'addEventListener');
    const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
    viewSelect.value = 'geo';
    viewSelect.dispatchEvent(new Event('change'));
    await waitFor(() => listenerSpy.calledWith('load'));
    listenerSpy.restore();
    expect(container.querySelector('[role="status"]').textContent).to.equal('Loading history...');
    expect(container.querySelector('.mmm2-history-chart-body [role="status"]')).to.exist;
    expect(container.querySelector('.mmm2-history-chart-controls [role="status"]')).to.not.exist;
    expect(container.querySelector('.mmm2-history-chart-canvas').classList.contains('is-loading'))
      .to.be.true;
    expect(options().series[0].name).to.equal('All pages');

    expect(fetchStub.calledOnce).to.be.true;
    script.dispatchEvent(new Event('load'));
    await waitFor(() => options().series.length === 2 && !container.querySelector('[role="status"]'));
    expect(container.querySelector('.mmm2-history-chart-canvas').classList.contains('is-loading'))
      .to.be.false;
  });

  it('centers loading over the chart without shifting the dropdown or header', async () => {
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/mmm-2/mmm-2.css' });
    document.head.append(style);
    container.classList.add('mmm-2');
    try {
      await setViewport({ width: 375, height: 1000 });
      await mount(
        [snapshot('2024-04-10', 180)],
        { geoGroups: [{ value: 'us', label: 'US' }] },
        { us: [snapshot('2024-04-10', 100)] },
      );
      const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
      const summary = container.querySelector('.mmm2-history-chart-summary');
      const body = container.querySelector('.mmm2-history-chart-body');
      const originalSelect = viewSelect.getBoundingClientRect();
      const originalHeader = summary.getBoundingClientRect();
      const originalBody = body.getBoundingClientRect();
      delete script.dataset.loaded;
      const listenerSpy = sinon.spy(script, 'addEventListener');
      viewSelect.value = 'geo';
      viewSelect.dispatchEvent(new Event('change'));
      await waitFor(() => listenerSpy.calledWith('load'));
      listenerSpy.restore();

      const selectRect = viewSelect.getBoundingClientRect();
      expect(selectRect.top).to.equal(originalSelect.top);
      expect(selectRect.left).to.equal(originalSelect.left);
      expect(summary.getBoundingClientRect().height).to.equal(originalHeader.height);
      expect(body.getBoundingClientRect().height).to.equal(originalBody.height);
      const statusRect = container.querySelector('[role="status"] span').getBoundingClientRect();
      expect(statusRect.left + statusRect.width / 2)
        .to.be.closeTo(originalBody.left + originalBody.width / 2, 1);
      expect(statusRect.top + statusRect.height / 2)
        .to.be.closeTo(originalBody.top + originalBody.height / 2, 1);

      script.dispatchEvent(new Event('load'));
      await waitFor(() => !container.querySelector('[role="status"]'));
      expect(viewSelect.getBoundingClientRect().top).to.equal(originalSelect.top);
      expect(viewSelect.getBoundingClientRect().left).to.equal(originalSelect.left);
    } finally {
      style.remove();
      await setViewport({ width: 800, height: 600 });
    }
  });

  it('shares an in-flight bulk request across rapid view switches', async () => {
    const rows = [snapshot('2024-04-10', 180)];
    let resolveHistory;
    fetchStub = sinon.stub(window, 'fetch').returns(new Promise((resolve) => {
      resolveHistory = resolve;
    }));
    const props = { geoGroups: [{ value: 'us', label: 'US' }] };
    render(html`<${TargetActivityChart} ...${props} />`, container);
    container.querySelector('.mmm2-history-chart-summary-toggle').click();
    await waitFor(() => fetchStub.called);
    const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
    viewSelect.value = 'geo';
    viewSelect.dispatchEvent(new Event('change'));
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    viewSelect.value = 'all';
    viewSelect.dispatchEvent(new Event('change'));
    await new Promise((resolve) => { setTimeout(resolve, 150); });
    resolveHistory({
      ok: true,
      json: async () => bulkResponse(rows, { us: [snapshot('2024-04-10', 100)] }),
    });
    await waitFor(() => chart.setOption.called && !container.querySelector('[role="status"]'));
    expect(fetchStub.calledOnce).to.be.true;
    expect(options().series[0].name).to.equal('All pages');
    expect(options().series[0].data).to.deep.equal([180]);
  });

  it('replaces loading with a visible error and can recover on another view', async () => {
    const rows = [snapshot('2024-04-10', 180)];
    const errorStub = sinon.stub(console, 'error');
    try {
      fetchStub = sinon.stub(window, 'fetch').resolves({ ok: false, status: 503 });
      const props = { geoGroups: [{ value: 'us', label: 'US' }] };
      render(html`<${TargetActivityChart} ...${props} />`, container);
      container.querySelector('.mmm2-history-chart-summary-toggle').click();
      await waitFor(() => container.querySelector('[role="alert"]'));
      expect(container.querySelector('[role="alert"]').textContent).to.include('Unable to load history');
      expect(container.querySelector('[role="status"]')).to.not.exist;
      expect(container.querySelector('.mmm2-history-chart-body').getAttribute('aria-busy'))
        .to.equal('false');
      expect(errorStub.calledOnce).to.be.true;

      fetchStub.resolves({
        ok: true,
        json: async () => bulkResponse(rows, { us: [snapshot('2024-04-10', 100)] }),
      });
      const viewSelect = container.querySelector('#mmm2-history-chart-breakdown');
      viewSelect.value = 'geo';
      viewSelect.dispatchEvent(new Event('change'));
      await waitFor(() => (
        !container.querySelector('[role="alert"]')
        && !container.querySelector('[role="status"]')
        && container.querySelector('.mmm2-history-chart-canvas')
      ));
      expect(options().series[0].name).to.equal('US');
      expect(fetchStub.callCount).to.equal(2);
    } finally {
      errorStub.restore();
    }
  });
});
