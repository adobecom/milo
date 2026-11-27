import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile, sendKeys, sendMouse, resetMouse } from '@web/test-runner-commands';
import { waitForElement } from '../../helpers/waitfor.js';
import { loadStyle, setConfig } from '../../../libs/utils/utils.js';
import init, { processBarLineData, SMALL } from '../../../libs/blocks/chart/chart.js';
import { getBarLineConfig } from '../../../libs/blocks/chart/bar-line.js';

setConfig({ codeRoot: '/libs' });

describe('combined bar and line chart', () => {
  let html;
  let minimalHtml;
  let json;
  let fetch;
  let chart;
  let observer;
  let width;
  let stylesheet;

  before(async () => {
    [html, json] = await Promise.all([
      readFile({ path: './mocks/bar-line.html' }),
      readFile({ path: './mocks/bar-line.json' }).then(JSON.parse),
    ]);
    minimalHtml = html;
    const content = document.createElement('div');
    content.innerHTML = html;
    content.querySelector('.chart').insertAdjacentHTML('beforeend', `
      <div><div>x-axis-label</div><div>Time of day</div></div>
      <div><div>y-axis-label</div><div>Orders</div></div>
      <div><div>secondary-y-axis-label</div><div>Price (USD)</div></div>
      <div><div>data-points</div><div>3</div></div>
    `);
    html = content.innerHTML;
    await new Promise((resolve) => {
      stylesheet = loadStyle('/libs/blocks/chart/chart.css', resolve);
    });
  });

  beforeEach(() => {
    observer = window.IntersectionObserver;
    width = window.innerWidth;
    window.IntersectionObserver = undefined;
    fetch = sinon.stub(window, 'fetch');
    sinon.stub(URLSearchParams.prototype, 'get').withArgs('cache').returns('off');
  });

  afterEach(async () => {
    await resetMouse();
    chart?.dispose();
    chart = undefined;
    sinon.restore();
    window.IntersectionObserver = observer;
    window.innerWidth = width;
    document.body.innerHTML = '';
  });

  after(() => stylesheet.remove());

  const render = async (data = json, markup = html, selector = '.chart-controls') => {
    document.body.innerHTML = markup;
    fetch.resolves({ ok: true, json: () => structuredClone(data) });
    const el = document.querySelector('.chart');
    init(el);
    await waitForElement(selector);
    chart = window.echarts.getInstanceByDom(el.querySelector('.chart-wrapper'));
    return el;
  };

  [1440, 390].forEach((viewport) => {
    it(`supports existing four-row authoring and diagonal labels at ${viewport}px`, async () => {
      window.innerWidth = viewport;
      const markup = minimalHtml.replace(
        'bar-line border',
        'bar-line blue border desktop-diagonal-labels mobile-diagonal-labels',
      )
        .replace('#112233, #445566', '#F95D6A, #FF7C43');
      const data = {
        data: [
          { 0: 'Wednesday', 2024: '4.1', 2025: '4.3', Unit: 'B' },
          { 0: 'Thanksgiving', 2024: '6.1', 2025: '6.4', Unit: '' },
        ],
      };
      const el = await render(data, markup);
      const options = chart.getOption();
      expect(options.series.map(({ type, name }) => [type, name]))
        .to.eql([['bar', '2024'], ['line', '2025']]);
      expect(options.yAxis.map(({ name }) => name)).to.eql(['2024', '2025']);
      expect(options.yAxis.map(({ axisLabel }) => axisLabel.formatter(1))).to.eql(['1B', '1B']);
      expect(options.xAxis[0].axisLabel.rotate).to.equal(60);
      expect(options.xAxis[0].name).to.equal('');
      expect(options.color).to.eql(['#F95D6A', '#FF7C43']);
      expect(options.dataset[0].source).to.have.length(3);
      expect(el.querySelector('.footnote').textContent).to.equal('Source: authored data');
      expect(el.querySelectorAll('tbody tr')).to.have.length(2);
      expect(el.querySelector('tbody tr').textContent).to.contain('4.1B').and.to.contain('4.3B');
    });
  });

  it('renders both series, shared time categories, separate axes and authored configuration', async () => {
    const el = await render();
    const options = chart.getOption();
    expect(options.series.map(({ type, yAxisIndex }) => [type, yAxisIndex]))
      .to.eql([['bar', 0], ['line', 1]]);
    expect(options.series.map(({ name }) => name)).to.eql(['Orders', 'Price']);
    expect(options.xAxis).to.have.length(1);
    expect(options.xAxis[0].name).to.equal('Time of day');
    expect(options.yAxis.map(({ name }) => name)).to.eql(['Orders', 'Price (USD)']);
    expect(options.yAxis[1].axisLabel.formatter(20)).to.equal('$20 USD');
    expect(options.color).to.eql(['#112233', '#445566']);
    expect(options.dataset[0].source).to.eql([
      ['Time', 'Orders', 'Price'],
      ['09:00', 0, 18.5],
      ['09:15', 25, 19.25],
      ['09:30', 18, 17.75],
    ]);
    expect(el.querySelector('.title').textContent).to.equal('Orders and price');
    expect(el.querySelector('.footnote').textContent).to.equal('Source: authored data');
    expect(el.querySelector('.chart-wrapper svg')).to.exist;
    expect(el.querySelector('path[fill="#112233"]')).to.exist;
    expect(el.querySelector('path[stroke="#445566"]')).to.exist;
    expect(el.querySelector('.chart-container').getBoundingClientRect().height)
      .to.be.greaterThan(el.querySelector('.chart-wrapper').getBoundingClientRect().height);
  });

  it('supports existing multi-sheet data and renders all rows without an authored point limit', async () => {
    const markup = html.replace('<div><div>data-points</div><div>3</div></div>', '');
    await render({ ':type': 'multi-sheet', ':names': ['data', 'marks'], data: json, marks: { data: [] } }, markup);
    expect(chart.getOption().dataset[0].source).to.have.length(5);
  });

  it('keeps an optional x-axis name clear of diagonal category labels', async () => {
    const markup = html.replace(
      'bar-line border',
      'bar-line border desktop-diagonal-labels mobile-diagonal-labels',
    );
    const el = await render(json, markup);
    const labels = Array.from(el.querySelectorAll('svg text'));
    const name = labels.find((label) => label.textContent === 'Time of day');
    const categories = labels.filter((label) => /^09:/.test(label.textContent));
    const bottom = Math.max(...categories.map((label) => label.getBoundingClientRect().bottom));
    expect(name.getBoundingClientRect().top).to.be.greaterThan(bottom);
    expect(name.getBoundingClientRect().bottom)
      .to.be.at.most(el.querySelector('svg').getBoundingClientRect().bottom);
  });

  it('exposes an accessible data table containing the displayed values and units', async () => {
    const el = await render();
    expect(el.querySelector('.chart-wrapper').getAttribute('role')).to.equal('img');
    expect(el.querySelector('.chart-wrapper').getAttribute('aria-label'))
      .to.be.a('string').and.not.to.equal('');
    expect(el.querySelector('.chart-data caption').textContent).to.equal('Orders and price');
    expect(Array.from(el.querySelectorAll('thead th')).map((th) => th.textContent))
      .to.eql(['Time', 'Orders', 'Price']);
    expect(el.querySelectorAll('tbody tr')).to.have.length(3);
    expect(el.querySelector('tbody th[scope="row"]').textContent).to.equal('09:00');
    expect(Array.from(el.querySelectorAll('tbody tr:first-child td')).map((td) => td.textContent))
      .to.eql(['0', '$18.5 USD']);
    expect(el.querySelector('summary').textContent).to.equal('View chart data');
  });

  it('supports keyboard tooltips, endpoints and dismissal with a spoken value summary', async () => {
    const el = await render();
    const wrapper = el.querySelector('.chart-wrapper');
    const status = el.querySelector('[role="status"]');
    const dispatch = sinon.spy(chart, 'dispatchAction');
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(wrapper);
    expect(status.textContent).to.contain('09:00').and.to.contain('Price: $18.5 USD');
    const press = (key) => sendKeys({ press: key });
    await press('ArrowRight');
    expect(dispatch.lastCall.args[0]).to.include({ type: 'showTip', dataIndex: 1 });
    expect(status.textContent).to.contain('09:15');
    await press('End');
    expect(dispatch.lastCall.args[0]).to.include({ dataIndex: 2 });
    await press('Home');
    await press('ArrowLeft');
    expect(dispatch.lastCall.args[0]).to.include({ dataIndex: 0 });
    await press('Escape');
    expect(dispatch.lastCall.args[0]).to.eql({ type: 'hideTip' });
    expect(status.textContent).to.equal('');
  });

  it('does not replace a pointer tooltip with the last keyboard-selected point', async () => {
    const el = await render();
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'End' });
    const summary = el.querySelector('summary');
    summary.scrollIntoView();
    const summaryBox = summary.getBoundingClientRect();
    await sendMouse({
      type: 'click',
      position: [Math.round(summaryBox.x + 5), Math.round(summaryBox.y + 5)],
    });
    const wrapper = el.querySelector('.chart-wrapper');
    const box = wrapper.getBoundingClientRect();
    const [x, y] = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, ['09:15', 25]);
    await sendMouse({
      type: 'click',
      position: [Math.round(box.x + x), Math.round(box.y + y + 3)],
    });
    expect(el.querySelector('[role="status"]').textContent).to.equal('');
    expect(wrapper.textContent).to.contain('Orders: 25').and.to.contain('Price: $19.25 USD');
  });

  it('keeps native legend buttons synchronized with series visibility', async () => {
    const el = await render();
    const [bar, line] = el.querySelectorAll('.chart-legend button');
    expect(bar.textContent).to.equal('Orders');
    expect(line.textContent).to.equal('Price');
    bar.focus();
    await sendKeys({ press: 'Enter' });
    expect(bar.getAttribute('aria-pressed')).to.equal('false');
    expect(chart.getOption().legend[0].selected.Orders).to.equal(false);
    const dispatch = sinon.spy(chart, 'dispatchAction');
    await sendKeys({ press: 'Shift+Tab' });
    expect(dispatch.lastCall.args[0]).to.include({ type: 'showTip', seriesIndex: 1 });
    bar.click();
    expect(bar.getAttribute('aria-pressed')).to.equal('true');
  });

  it('formats hover/tap tooltips as text rather than interpreting authored HTML', async () => {
    const el = await render();
    const tooltip = chart.getOption().tooltip[0];
    expect(tooltip.triggerOn).to.equal('mousemove|click');
    const content = tooltip.formatter([{
      name: '<img src=x onerror=alert(1)>',
      seriesName: '<b>Price</b>',
      seriesIndex: 1,
      value: ['09:00', 0, 18.5],
      encode: { y: [2] },
    }]);
    expect(content.querySelector('img, b')).to.equal(null);
    expect(content.textContent).to.contain('<b>Price</b>: $18.5 USD');
    expect(el.querySelector('.chart-controls')).to.exist;
  });

  it('resizes with its container and preserves focus and legend state across viewport changes', async () => {
    const el = await render();
    const previousWidth = chart.getWidth();
    el.parentElement.style.width = '380px';
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    expect(chart.getWidth()).to.equal(el.querySelector('.chart-wrapper').clientWidth);
    expect(chart.getWidth()).to.be.lessThan(previousWidth);
    const button = el.querySelector('.chart-legend button');
    button.click();
    button.focus();
    window.innerWidth = 390;
    window.dispatchEvent(new Event('resize'));
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
    expect(el.getAttribute('data-responsive-size')).to.equal(SMALL);
    expect(window.echarts.getInstanceByDom(el.querySelector('.chart-wrapper'))).to.equal(chart);
    expect(document.activeElement).to.equal(button);
    expect(chart.getOption().legend[0].selected.Orders).to.equal(false);
  });

  it('does not fetch repeatedly or change authored rows as time passes', async () => {
    await render();
    const source = structuredClone(chart.getOption().dataset[0].source);
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'Date'] });
    await clock.tickAsync(60000);
    expect(fetch.callCount).to.equal(1);
    expect(chart.getOption().dataset[0].source).to.eql(source);
  });

  it('removes controls and resize/keyboard listeners when disposed', async () => {
    const el = await render();
    const wrapper = el.querySelector('.chart-wrapper');
    const dispatch = sinon.spy(chart, 'dispatchAction');
    const resize = sinon.spy(chart, 'resize');
    chart.dispose();
    chart = undefined;
    dispatch.resetHistory();
    resize.resetHistory();
    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    window.dispatchEvent(new Event('resize'));
    expect(dispatch.called).to.equal(false);
    expect(resize.called).to.equal(false);
    expect(el.querySelector('.chart-controls')).to.equal(null);
    expect(wrapper.hasAttribute('aria-describedby')).to.equal(false);
  });

  it('shows a readable fallback for missing or invalid authored data', async () => {
    await render({}, html, '.chart-wrapper [role="status"]');
    expect(chart).to.equal(undefined);
    expect(document.querySelector('.chart-wrapper').textContent)
      .to.contain('category and two numeric series');
  });

  it('rejects invalid datasets instead of partially parsing series values', () => {
    [undefined, [], [null], [{ Time: '09:00', Orders: 1 }],
      [{ Time: '09:00', Orders: '12x', Price: 3 }],
      [{ Time: '09:00', Orders: '', Price: 3 }],
      [{ Time: '09:00', Orders: 1, Price: null }],
    ].forEach((data) => expect(processBarLineData(data)).to.equal(null));
  });

  it('ignores invalid point limits and removes option rows without disturbing positional content', () => {
    ['0', '-1', '1.5', 'many'].forEach((value) => {
      const el = document.createElement('div');
      el.innerHTML = `<div><div>Title</div></div><div><div>data-points</div><div>${value}</div></div>`;
      expect(getBarLineConfig(el)).to.eql({});
      expect(el.children).to.have.length(1);
      expect(el.textContent).to.equal('Title');
    });
  });
});
