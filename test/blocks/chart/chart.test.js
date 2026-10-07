import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { waitForElement } from '../../helpers/waitfor.js';
import { loadStyle, setConfig } from '../../../libs/utils/utils.js';

const {
  SMALL,
  MEDIUM,
  LARGE,
  DESKTOP_BREAKPOINT,
  TABLET_BREAKPOINT,
  colorPalette,
  getResponsiveSize,
  tooltipFormatter,
  getColors,
  parseColorPalette,
  showPaletteWarning,
  getOverrideColors,
  chartData,
  processDataset,
  processMarkData,
  processUnits,
  areaSeriesOptions,
  donutTooltipFormatter,
  donutTitleOptions,
  donutSeriesOptions,
  setDonutTitle,
  handleDonutSelect,
  getChartOptions,
  fetchData,
  barTooltipFormatter,
  barSeriesOptions,
  lineSeriesOptions,
  default: init,
  pieTooltipFormatter,
  pieSeriesOptions,
  getOversizedNumberSize,
  getLabelDegree,
} = await import('../../../libs/blocks/chart/chart.js');

const config = { codeRoot: '/libs' };
setConfig(config);

describe('chart', () => {
  let fetch;
  let paramsGetStub;
  const units = {
    xAxis: { date: false },
    yAxes: [{
      prefix: '',
      suffix: 'k',
    }],
  };

  before(() => {
    fetch = sinon.stub(window, 'fetch');
    paramsGetStub = sinon.stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    sinon.restore();
  });

  it('getResponsiveSize returns same sizes on desktop', () => {
    window.innerWidth = DESKTOP_BREAKPOINT;
    expect(getResponsiveSize(LARGE)).to.equal(LARGE);
    expect(getResponsiveSize(MEDIUM)).to.equal(MEDIUM);
    expect(getResponsiveSize(SMALL)).to.equal(SMALL);
  });

  it('getResponsiveSize returns correct sizes on tablet', () => {
    window.innerWidth = TABLET_BREAKPOINT;
    expect(getResponsiveSize(LARGE)).to.equal(MEDIUM);
    expect(getResponsiveSize(MEDIUM)).to.equal(MEDIUM);
    expect(getResponsiveSize(SMALL)).to.equal(SMALL);
  });

  it('getResponsiveSize always returns small on phone', () => {
    window.innerWidth = TABLET_BREAKPOINT - 1;
    expect(getResponsiveSize(LARGE)).to.equal(SMALL);
    expect(getResponsiveSize(MEDIUM)).to.equal(SMALL);
    expect(getResponsiveSize(SMALL)).to.equal(SMALL);
  });

  it('tooltipFormatter outputs tooltip in correct format', () => {
    const params = [
      {
        seriesName: 'Chrome with a Really Really Long Name',
        name: 'Sunday',
        value: ['Sunday', '140', '180'],
        encode: {
          x: [0],
          y: [1],
        },
        marker: '<span>x</span>',
      },
      {
        seriesName: 'Firefox Lorem Ipsum Dolor Sit Amet',
        name: 'Sunday',
        value: ['Sunday', '140', '180'],
        encode: {
          x: [0],
          y: [2],
        },
        marker: '<span>x</span>',
      },
    ];
    const tooltip = 'Sunday<br /><span>x</span> 140k Chrome with a Really Really Long Name<br /><span>x</span> 180k Firefox Lorem Ipsum Dolor Sit Amet<i class="tooltip-icon"></i>';

    expect(tooltipFormatter(params, units)).to.equal(tooltip);
  });

  it('getColors returns default color list if no color provided', () => {
    const authoredColor = undefined;

    expect(getColors(authoredColor)).to.eql(Object.values(colorPalette));
  });

  it('getColors returns rotated color list if color provided ', () => {
    const authoredColor = 'indigo';
    const colors = ['#4046CA', '#F68511', '#DE3D82', '#7E84FA', '#72E06A', '#147AF3', '#7326D3', '#E8C600', '#CB5D00', '#008F5D', '#BCE931', '#0FB5AE'];

    expect(getColors(authoredColor)).to.eql(colors);
  });

  it('parses comma-separated hex colors with whitespace and mixed case', () => {
    expect(parseColorPalette(' #abc, #112233 , #AABBCC ')).to.eql(['#abc', '#112233', '#AABBCC']);
  });

  it('rejects the whole palette when any entry is malformed', () => {
    ['', ' ', '#112233, invalid', '#112233,', ',#112233', '#12', '#12345',
      '#12345678', '112233', 'red', '#ggg', '#112233; background: red'].forEach((value) => {
      expect(parseColorPalette(value)).to.equal(undefined);
    });
  });

  it('shows palette warnings only on preview and local hosts', () => {
    ['main--milo--adobecom.aem.page', 'main--milo--adobecom.hlx.page',
      'localhost', '127.0.0.1', '[::1]'].forEach((hostname) => {
      const el = document.createElement('div');
      showPaletteWarning(el, hostname);
      expect(el.hasAttribute('title')).to.equal(false);
      expect(el.classList.contains('palette-warning')).to.equal(true);
    });
    ['main--milo--adobecom.aem.live', 'main--milo--adobecom.hlx.live',
      'www.adobe.com', 'www.stage.adobe.com', 'main--milo--adobecom.aem.page.example.com']
      .forEach((hostname) => {
        const el = document.createElement('div');
        showPaletteWarning(el, hostname);
        expect(el.hasAttribute('title')).to.equal(false);
        expect(el.classList.contains('palette-warning')).to.equal(false);
      });
  });

  it('shows a thick outline and a visible warning without changing chart width', async () => {
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/chart/chart.css' });
    document.head.append(style);
    const el = document.createElement('div');
    el.className = 'chart border';
    document.body.append(el);
    try {
      const before = el.getBoundingClientRect();
      showPaletteWarning(el);
      const computed = window.getComputedStyle(el);
      expect(computed.outlineWidth).to.equal('8px');
      expect(computed.outlineStyle).to.equal('solid');
      expect(computed.outlineColor).to.equal('rgb(211, 21, 16)');
      expect(computed.outlineOffset).to.equal('4px');
      const banner = window.getComputedStyle(el, '::before');
      expect(banner.content).to.equal('"Invalid color palette"');
      expect(banner.display).to.equal('block');
      expect(banner.backgroundColor).to.equal('rgb(211, 21, 16)');
      expect(banner.color).to.equal('rgb(255, 255, 255)');
      expect(banner.fontSize).to.equal('28px');
      expect(banner.fontWeight).to.equal('700');
      const after = el.getBoundingClientRect();
      expect(after.width).to.equal(before.width);
      expect(after.height).to.be.greaterThan(before.height);
    } finally {
      el.remove();
      style.remove();
    }
  });

  it('custom colors completely replace the original palette without mutating either palette', () => {
    const customPalette = ['#112233', '#445566'];
    const defaults = Object.values(colorPalette);
    expect(getColors('indigo', customPalette)).to.eql(customPalette);
    expect(getColors('indigo', customPalette)).not.to.equal(customPalette);
    expect(customPalette).to.eql(['#112233', '#445566']);
    expect(Object.values(colorPalette)).to.eql(defaults);
  });

  it('accepts custom palettes as long as or longer than the default palette', () => {
    const colors = Array(12).fill('#123456');
    expect(getColors(undefined, colors)).to.eql(colors);
    expect(getColors(undefined, [...colors, '#abcdef'])).to.eql([...colors, '#abcdef']);
  });

  it('getOverrideColors returns authored color with overrides', () => {
    const fetchedData = {
      data: [
        { Day: 'Mon', Visitors: '150', Group: '', Unit: 'k', Color: '' },
        { Day: 'Tues', Visitors: '230', Group: '', Unit: '', Color: '' },
        { Day: 'Weds', Visitors: '224', Group: '', Unit: '', Color: '' },
        { Day: 'Thurs', Visitors: '218', Group: '', Unit: '', Color: 'magenta' },
        { Day: 'Fri', Visitors: '135', Group: '', Unit: '', Color: 'magenta' },
        { Day: 'Sat', Visitors: '147', Group: '', Unit: '', Color: 'magenta' },
        { Day: 'Sun', Visitors: '260', Group: '', Unit: '', Color: '' },
      ],
    };
    const authoredColor = 'indigo';
    const colors = ['#4046CA', '#4046CA', '#4046CA', '#DE3D82', '#DE3D82', '#DE3D82', '#4046CA'];

    expect(getOverrideColors(authoredColor, fetchedData.data)).to.eql(colors);
  });

  it('preserves legacy spreadsheet colors, including the fallback for invalid names', () => {
    const data = [{ Color: '' }, { Color: 'magenta' }, { color: 'invalid' }];
    expect(getOverrideColors('indigo', data)).to.eql([
      colorPalette.indigo, colorPalette.magenta, colorPalette.seafoam,
    ]);
  });

  it('bar background colors repeat the resolved palette for additional series', () => {
    const colors = getColors(undefined, ['#112233']);
    const dimensions = Array.from({ length: 14 }, (_, index) => `Series ${index}`);
    const options = barSeriesOptions('bar', false, dimensions, colors, SMALL, units);
    expect(options.map(({ backgroundStyle }) => backgroundStyle.color))
      .to.eql(Array(14).fill('#112233'));
  });

  it('chart dataset', () => {
    const fetchedData = {
      data: [
        {
          Day: 'Mon', Chrome: '100', Firefox: '245', Edge: '335', Group: '', Unit: 'k',
        },
        {
          Day: 'Tues', Chrome: '565', Firefox: '345', Edge: '945', Group: '', Unit: '',
        },
        {
          Day: 'Weds', Chrome: '344', Firefox: '234', Edge: '723', Group: '', Unit: '',
        },
        {
          Day: 'Thurs', Chrome: '156', Firefox: '283', Edge: '305', Group: '', Unit: '',
        },
        {
          Day: 'Fri', Chrome: '84', Firefox: '273', Edge: '126', Group: '', Unit: '',
        },
        {
          Day: 'Sat', Chrome: '189', Firefox: '273', Edge: '103', Group: '', Unit: '',
        },
        {
          Day: 'Sun', Chrome: '103', Firefox: '111', Edge: '157', Group: '', Unit: '',
        },
      ],
    };

    const dataset = {
      source: [
        ['Day', 'Chrome', 'Firefox', 'Edge'],
        ['Mon', 100, 245, 335],
        ['Tues', 565, 345, 945],
        ['Weds', 344, 234, 723],
        ['Thurs', 156, 283, 305],
        ['Fri', 84, 273, 126],
        ['Sat', 189, 273, 103],
        ['Sun', 103, 111, 157],
      ],
    };

    expect(processDataset(fetchedData.data, '').dataset).to.eql(dataset);
  });

  it('chart dataset with date', () => {
    const fetchedData = {
      data: [
        {
          Day: '44775', Chrome: '100', Firefox: '245', Edge: '335', Group: '', Unit: 'date-k',
        },
        {
          Day: '44776', Chrome: '565', Firefox: '345', Edge: '945', Group: '', Unit: '',
        },
        {
          Day: '44777', Chrome: '344', Firefox: '234', Edge: '723', Group: '', Unit: '',
        },
        {
          Day: '44778', Chrome: '156', Firefox: '283', Edge: '305', Group: '', Unit: '',
        },
        {
          Day: '44779', Chrome: '84', Firefox: '273', Edge: '126', Group: '', Unit: '',
        },
        {
          Day: '44780', Chrome: '189', Firefox: '273', Edge: '103', Group: '', Unit: '',
        },
        {
          Day: '44781', Chrome: '103', Firefox: '111', Edge: '157', Group: '', Unit: '',
        },
      ],
    };

    const dataset = {
      source: [
        ['Day', 'Chrome', 'Firefox', 'Edge'],
        ['8/2/22', 100, 245, 335],
        ['8/3/22', 565, 345, 945],
        ['8/4/22', 344, 234, 723],
        ['8/5/22', 156, 283, 305],
        ['8/6/22', 84, 273, 126],
        ['8/7/22', 189, 273, 103],
        ['8/8/22', 103, 111, 157],
      ],
    };

    expect(processDataset(fetchedData.data, 'date').dataset).to.eql(dataset);
  });

  it.skip('chart mark series data', () => {
    const fetchedData = {
      series: [
        {
          Type: 'markArea',
          Name: 'Weekend Sale',
          Axis: 'xAxis',
          Value: '8/5/2022-8/6/2022',
        },
        {
          Type: 'markLine',
          Name: 'Promotion',
          Axis: 'xAxis',
          Value: '44775',
        },
        {
          Type: 'markLine',
          Name: 'Campaign Launch',
          Axis: 'xAxis',
          Value: '8/7/2022',
        },
        {
          Type: 'markLine',
          Name: 'Goal',
          Axis: 'yAxis',
          Value: '200',
        },
      ],
    };

    const markAreaData = [
      [{
        name: 'Weekend Sale',
        xAxis: '8/5/22',
      }, { xAxis: '8/6/22' }],
    ];
    const markLineData = [
      {
        name: 'Promotion',
        xAxis: '8/2/22',
      },
      {
        name: 'Campaign Launch',
        xAxis: '8/7/22',
      },
      {
        name: 'Goal',
        yAxis: 200,
      },
    ];
    const markData = processMarkData(fetchedData.series, 'date');

    expect(markData.markArea.data).to.eql(markAreaData);
    expect(markData.markLine.data).to.eql(markLineData);
  });

  it('fetch data sheet', () => {
    const fetchedData = {
      total: 1,
      offset: 0,
      limit: 1,
      data: [
        {
          Browsers: 'Avg Visitors',
          Chrome: '100',
          Firefox: '156',
          Edge: '105',
          Group: '',
          Unit: 'k',
        },
      ],
      ':type': 'sheet',
    };

    const processedData = {
      data: [
        {
          Browsers: 'Avg Visitors',
          Chrome: '100',
          Firefox: '156',
          Edge: '105',
          Group: '',
          Unit: 'k',
        },
      ],
      series: [],
    };
    expect(chartData(fetchedData)).to.eql(processedData);
  });

  it('fetch data multi', () => {
    const fetchedData = {
      extra: {
        total: 4,
        offset: 0,
        limit: 4,
        data: [
          { Type: 'markArea', Name: 'Weekend Sale', Axis: 'xAxis', Value: 'Fri-Sun' },
          { Type: 'markLine', Name: 'Promotion', Axis: 'xAxis', Value: 'Mon' },
          { Type: 'markLine', Name: 'Campaign Launch', Axis: 'xAxis', Value: 'Thurs' },
          { Type: 'markLine', Name: 'Goal', Axis: 'yAxis', Value: '200' },
        ],
      },
      data: {
        total: 7,
        offset: 0,
        limit: 7,
        data: [
          { Day: 'Mon', Visitors: '150', Group: '', Unit: 'k' },
          { Day: 'Tues', Visitors: '230', Group: '', Unit: '' },
          { Day: 'Weds', Visitors: '224', Group: '', Unit: '' },
          { Day: 'Thurs', Visitors: '218', Group: '', Unit: '' },
          { Day: 'Fri', Visitors: '135', Group: '', Unit: '' },
          { Day: 'Sat', Visitors: '147', Group: '', Unit: '' },
          { Day: 'Sun', Visitors: '260', Group: '', Unit: '' },
        ],
      },
      ':version': 3,
      ':names': [
        'extra',
        'data',
      ],
      ':type': 'multi-sheet',
    };

    const processedData = {
      data: [
        { Day: 'Mon', Visitors: '150', Group: '', Unit: 'k' },
        { Day: 'Tues', Visitors: '230', Group: '', Unit: '' },
        { Day: 'Weds', Visitors: '224', Group: '', Unit: '' },
        { Day: 'Thurs', Visitors: '218', Group: '', Unit: '' },
        { Day: 'Fri', Visitors: '135', Group: '', Unit: '' },
        { Day: 'Sat', Visitors: '147', Group: '', Unit: '' },
        { Day: 'Sun', Visitors: '260', Group: '', Unit: '' },
      ],
      series: [
        { Type: 'markArea', Name: 'Weekend Sale', Axis: 'xAxis', Value: 'Fri-Sun' },
        { Type: 'markLine', Name: 'Promotion', Axis: 'xAxis', Value: 'Mon' },
        { Type: 'markLine', Name: 'Campaign Launch', Axis: 'xAxis', Value: 'Thurs' },
        { Type: 'markLine', Name: 'Goal', Axis: 'yAxis', Value: '200' },
      ],
    };

    expect(chartData(fetchedData)).to.eql(processedData);
  });

  it('areaSeriesOptions returns array', () => {
    const firstDataset = [1, 2];
    expect(Array.isArray(areaSeriesOptions(firstDataset))).to.be.true;
    const expected = [
      {
        name: 1,
        areaStyle: { opacity: 1 },
        stack: 'area',
        symbol: 'none',
        type: 'line',
      },
      {
        name: 2,
        areaStyle: { opacity: 1 },
        stack: 'area',
        symbol: 'none',
        type: 'line',
      },
    ];
    expect(areaSeriesOptions(firstDataset)).to.eql(expected);
  });

  it('donutSeriesOptions returns array', () => {
    expect(Array.isArray(donutSeriesOptions(null, null, null, null, { on: () => { } }))).to.be.true;
  });

  it('setDonutTitle sets expects options', () => {
    const chart = { setOption: sinon.spy() };
    const expected = [[{ title: { text: [`{a|${'100'.toLocaleString()}k}`, '{b|title}'].join('\n') } }]];
    setDonutTitle(chart, 100, units, 'title');
    expect(chart.setOption.args).to.eql(expected);
  });

  it('handleDonutSelect returns new sum', () => {
    const source = [[100, 'Monday'], [276, 'Tuesday'], [200, 'Wednesday']];
    const selected = { Monday: false, Tuesday: true, Wednesday: true };
    expect(handleDonutSelect(source, selected, { setOption: () => {} }, units, null)).to.equal(476);
  });

  it('donutTitleOptions sums values', () => {
    const source = [[100, 'Monday'], [276, 'Tuesday'], [200, 'Wednesday']];
    const options = donutTitleOptions(source, ['test'], units, 'small');
    const expected = {
      show: true,
      left: 'center',
      bottom: '48%',
      text: '{a|576k}\n{b|}',
      textStyle: {
        rich: {
          a: {
            fontSize: 44,
            lineHeight: 55,
            fontWeight: 'bolder',
          },
          b: {
            fontSize: 20,
            lineHeight: 30,
            fontWeight: 'normal',
          },
        },
        color: '#000',
      },
    };
    expect(options).to.eql(expected);
  });

  it('donutTooltipFormatter returns expected string', () => {
    const data = [43, 'Mobile'];
    const encode = { value: [0] };
    const expected = '* Mobile<br />43k 43%<i class="tooltip-icon"></i>';
    expect(donutTooltipFormatter({ marker: '*', data, encode, name: 'Mobile', percent: 43 }, units.yAxes[0])).to.equal(expected);
  });

  it('getChartOptions', () => {
    expect(typeof getChartOptions({})).to.equal('object');
  });

  it('getChartOptions tooltipFormatter', () => {
    const options = getChartOptions({});
    expect(typeof options.tooltip.formatter([{ seriesName: '', name: '', value: [''], encode: { y: [1] }, marker: '' }])).to.equal('string');
  });

  it('getChartOptions barTooltipFormatter', () => {
    const options = getChartOptions({ chartType: 'bar' });
    expect(typeof options.tooltip.formatter({ seriesName: '', marker: '', value: [''], encode: {}, name: '' })).to.equal('string');
  });

  it('getChartOptions donutTooltipFormatter', () => {
    const options = getChartOptions({ chartType: 'donut' });
    expect(typeof options.tooltip.formatter({ marker: '*', data: [''], encode: { value: [0] }, name: 'Mobile', percent: 0 }, '')).to.equal('string');
  });

  it('getChartOptions pieTooltipFormatter', () => {
    const options = getChartOptions({ chartType: 'pie' });
    expect(typeof options.tooltip.formatter({ marker: '*', data: [''], encode: { value: [0] }, name: 'Chrome' }, '')).to.equal('string');
  });

  it('getChartOptions axisLabel formatter', () => {
    expect(typeof getChartOptions({ chartType: 'bar' })).to.equal('object');
  });

  it('getChartOptions axisLabel formatter', () => {
    const options = getChartOptions({ processedData: { units } });
    expect(typeof options.yAxis[0].axisLabel.formatter()).to.equal('string');
  });

  it('fetchData functions as expected with cache control enabled', async () => {
    const link = document.createElement('a');
    const linkRel = '/drafts/data-viz/line.json';
    link.href = `${linkRel}`;
    const goodResponse = { ok: true, json: () => true };
    fetch.withArgs(link.href, { cache: 'reload' }).resolves(goodResponse);
    const response = await fetchData(link);
    expect(response).to.be.true;
  });

  it('fetchData returns json given an anchor tag', async () => {
    const link = document.createElement('a');
    const linkRel = '/drafts/data-viz/line.json';
    link.href = `${linkRel}`;
    const goodResponse = { ok: true, json: () => true };
    fetch.withArgs(link.href).resolves(goodResponse);
    const response = await fetchData(link);
    expect(response).to.be.true;
  });

  it('barTooltipFormatter returns expected string', () => {
    const value = ['Avg Visitors', 100, 156, 105];
    const encode = { x: [1] };
    const expected = 'Chrome<br />* 100k Avg Visitors<i class="tooltip-icon"></i>';
    expect(barTooltipFormatter({ seriesName: 'Chrome', marker: '*', value, encode, name: 'Avg Visitors' }, units.yAxes[0])).to.equal(expected);
  });

  it('barSeriesOptions', () => {
    const firstDataset = [100, 156];
    const colors = ['#EA3829', '#F48411', '#F5D704', '#A9D814', '#26BB36', '#008F5D', '#12B5AE', '#34C5E8', '#3991F3', '#686DF4', '#8A3CE7', '#E054E2', '#DE3C82'];
    const expected = [
      {
        type: 'bar',
        label: {
          show: true,
          formatter: '{@[1]}k',
          position: 'right',
          textBorderColor: '#000',
          distance: 8,
          fontSize: 14,
        },
        colorBy: 'series',
        name: 100,
        showBackground: true,
        backgroundStyle: {
          color: '#EA3829',
          borderRadius: 3,
          opacity: 0.35,
        },
        itemStyle: { borderRadius: 3 },
        barCategoryGap: 0,
        barGap: '33.3%',
        yAxisIndex: 0,
      },
      {
        type: 'bar',
        label: {
          show: true,
          formatter: '{@[2]}k',
          position: 'right',
          textBorderColor: '#000',
          distance: 8,
          fontSize: 14,
        },
        colorBy: 'series',
        name: 156,
        showBackground: true,
        backgroundStyle: {
          color: '#F48411',
          borderRadius: 3,
          opacity: 0.35,
        },
        itemStyle: { borderRadius: 3 },
        barCategoryGap: 0,
        barGap: '33.3%',
        yAxisIndex: 0,
      },
    ];
    expect(barSeriesOptions('bar', false, firstDataset, colors, 'medium', units)).to.eql(expected);
  });

  it('lineSeriesOptions returns correct options with marks', () => {
    const series = [{ Type: 'markArea', Name: 'Weekend', Axis: 'xAxis', Value: 'Saturday-Sunday' }, { Type: 'markLine', Name: 'Standout', Axis: 'xAxis', Value: 'Tuesday' }, { Type: 'markLine', Name: 'Average', Axis: 'yAxis', Value: '200' }];
    const firstDataset = [100, 156, 160];
    const expected = [
      {
        type: 'line',
        name: 100,
        symbol: 'none',
        lineStyle: { width: 3 },
        yAxisIndex: 0,
        markArea: {
          data: [
            [
              {
                name: 'Weekend',
                xAxis: 'Saturday',
              },
              { xAxis: 'Sunday' },
            ],
          ],
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              position: 'top',
              distance: 0,
            },
          },
        },
        markLine: {
          data: [
            {
              name: 'Standout',
              xAxis: 'Tuesday',
            },
            {
              name: 'Average',
              yAxis: 200,
            },
          ],
          label: {
            show: false,
            formatter: '{b}',
            position: 'insideStartBottom',
          },
          emphasis: { label: { show: true } },
        },
      },
      {
        type: 'line',
        name: 156,
        symbol: 'none',
        lineStyle: { width: 3 },
        yAxisIndex: 0,
      },
      {
        type: 'line',
        name: 160,
        symbol: 'none',
        lineStyle: { width: 3 },
        yAxisIndex: 0,
      },
    ];

    expect(lineSeriesOptions(series, firstDataset, units)).to.eql(expected);
  });

  it('init donut chart', async () => {
    document.body.innerHTML = '<div class="chart"><div>Title</div><div>Subtitle</div><div><div><a href="/drafts/data-viz/chart.json"></a></div></div><div>Footnote</div></div>';
    const el = document.querySelector('.chart');
    const data = await readFile({ path: './mocks/donutChart.json' });
    fetch.withArgs(el.getElementsByTagName('a')[0].href).resolves({ ok: true, json: () => JSON.parse(data) });
    el.classList.add('donut');
    init(el);
    const svg = await waitForElement('svg');
    expect(svg).to.exist;

    const sum = 1404;
    const title = Array.from(svg.querySelectorAll('text')).find((text) => text.textContent.includes(sum.toLocaleString()));
    expect(title).to.exist;
  });

  it('init generates list chart', async () => {
    const linkRel = '/drafts/data-viz/list.json';
    document.body.innerHTML = `<div class="chart list"><div>Title</div><div>Subtitle</div><div><div><a href="${linkRel}"></a></div></div><div>Footnote</div></div>`;
    const data = await readFile({ path: './mocks/listChartSingleTable.json' });
    const parsedData = JSON.parse(data);
    const el = document.querySelector('.chart');
    fetch.withArgs(el.getElementsByTagName('a')[0].href).resolves({ ok: true, json: () => parsedData });
    init(el);
    const listWrapper = await waitForElement('.list-wrapper');
    expect(listWrapper).to.exist;
  });

  it('init chart with intersection observer', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/chart.html' });
    const el = document.querySelector('.chart');
    const data = await readFile({ path: './mocks/areaChart.json' });
    fetch.withArgs(el.getElementsByTagName('a')[0].href).resolves({ ok: true, json: () => JSON.parse(data) });
    el.classList.add('area');
    init(el);
    const svg = await waitForElement('svg');
    expect(svg).to.exist;
  });

  it('init chart with echarts without intersection observer', async () => {
    window.IntersectionObserver = undefined;
    const linkRel = '/drafts/data-viz/column.json';
    document.body.innerHTML = `<div class="chart column"><div>Title</div><div>Subtitle</div><div><div><a href="${linkRel}"></a></div></div><div>Footnote</div></div>`;
    const data = await readFile({ path: './mocks/columnChart.json' });
    const parsedData = JSON.parse(data);
    const el = document.querySelector('.chart');
    fetch.withArgs(el.getElementsByTagName('a')[0].href).resolves({ ok: true, json: () => parsedData });
    init(el);
    const svg = await waitForElement('svg');
    expect(svg).to.exist;
  });

  it('pieTooltipFormatter returns expected string', () => {
    const data = [100, 'Chrome'];
    const encode = { value: [0] };
    const expected = 'Chrome<br />* 100k<i class="tooltip-icon"></i>';
    expect(pieTooltipFormatter({ marker: '*', data, encode, name: 'Chrome' }, units.yAxes[0])).to.equal(expected);
  });

  it('pieSeriesOptions returns correct options', () => {
    const expected = [{
      type: 'pie',
      radius: '90%',
      height: '90%',
      silent: false,
      label: {
        show: false,
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#2c2c2c',
        bleedMargin: 0,
      },
      labelLine: {
        length: 10,
        length2: 10,
      },
      center: ['50%', '46%'],
    }];

    expect(pieSeriesOptions(SMALL)).to.eql(expected);
  });

  it('init generates oversized number chart', async () => {
    const linkRel = '/drafts/data-viz/oversized-number.json';
    document.body.innerHTML = `<div class="chart oversized-number"><div>Title</div><div>Subtitle</div><div><div><a href="${linkRel}"></a></div></div><div>Footnote</div></div>`;
    const data = await readFile({ path: './mocks/oversized-number.json' });
    const parsedData = JSON.parse(data);
    const el = document.querySelector('.chart');
    fetch.withArgs(el.getElementsByTagName('a')[0].href).resolves({ ok: true, json: () => parsedData });
    init(el);
    const svg = await waitForElement('svg');
    expect(svg).to.exist;
    const chartWrapper = await waitForElement('.chart-wrapper');
    expect(chartWrapper.getAttribute('role')).to.equal('img');
    expect(chartWrapper.getAttribute('aria-label')).to.exist;
  });

  describe('oversized number text modes', () => {
    let stylesheet;

    before(async () => {
      await new Promise((resolve, reject) => {
        stylesheet = loadStyle('/libs/blocks/chart/chart.css', (status) => {
          if (status === 'error') reject(new Error('Failed to load chart styles'));
          else resolve();
        });
      });
    });

    after(() => stylesheet.remove());
    afterEach(() => { document.body.innerHTML = ''; });

    const renderNumber = async (mode, sectionMode = '') => {
      const link = '/drafts/data-viz/oversized-number-mode.json';
      document.body.innerHTML = `<div class="section ${sectionMode}">
        <div class="chart oversized-number blue border ${mode}">
          <div><div><h3>Title</h3></div></div>
          <div><div><p>Outer subtitle</p></div></div>
          <div><div><a href="${link}"></a></div></div>
          <div><div><p>Footnote</p></div></div>
        </div>
      </div>`;
      fetch.withArgs(new URL(link, window.location.href).href).resolves({
        ok: true,
        json: () => ({ data: [{ number: '25', subtitle: 'Out of 60 days' }] }),
      });
      const el = document.querySelector('.chart');
      init(el);
      await waitForElement('.chart-wrapper svg');
      return el;
    };

    [
      ['', 'rgb(255, 255, 255)'],
      ['light', 'rgb(0, 0, 0)'],
      ['dark', 'rgb(255, 255, 255)'],
    ].forEach(([mode, expectedFill]) => {
      it(`renders ${mode || 'legacy'} text without changing other chart colors`, async () => {
        const el = await renderNumber(mode);
        el.querySelectorAll('svg text').forEach((text) => {
          expect(window.getComputedStyle(text).fill).to.equal(expectedFill);
        });
        expect(window.getComputedStyle(el.querySelector('circle')).fill)
          .to.equal('rgb(20, 122, 243)');
        expect(window.getComputedStyle(el.querySelector('.title h3')).color)
          .to.equal('rgb(44, 44, 44)');
        expect(window.getComputedStyle(el.querySelector(':scope > .subtitle p')).color)
          .to.equal('rgb(44, 44, 44)');
        expect(window.getComputedStyle(el).backgroundColor).to.equal('rgb(255, 255, 255)');
        const wrapper = el.querySelector('.chart-wrapper');
        expect(wrapper.getAttribute('role')).to.equal('img');
        expect(wrapper.getAttribute('aria-label')).to.equal('25 Out of 60 days');
      });
    });

    it('keeps explicit light text mode in a dark section', async () => {
      const el = await renderNumber('light', 'dark');
      el.querySelectorAll('svg text').forEach((text) => {
        expect(window.getComputedStyle(text).fill).to.equal('rgb(0, 0, 0)');
      });
    });

    it('keeps legacy white text in a light section without a mode option', async () => {
      const el = await renderNumber('', 'light');
      el.querySelectorAll('svg text').forEach((text) => {
        expect(window.getComputedStyle(text).fill).to.equal('rgb(255, 255, 255)');
      });
    });
  });

  it('getOversizedNumberSize returns maximum size for 1 character', () => {
    expect(getOversizedNumberSize(1)).to.eql([240, 60, 70]);
  });

  it('getOversizedNumberSize returns reduced size for 4 characters', () => {
    expect(getOversizedNumberSize(4)).to.eql([150, 60, 70]);
  });

  it('getOversizedNumberSize returns miniumum size for more than 6 characters', () => {
    expect(getOversizedNumberSize(100)).to.eql([90, 55, 65]);
  });

  it('Horizontal is the default label orientation', () => {
    document.body.innerHTML = '<div class="chart line"></div>';
    const styles = document.querySelector('.chart').classList;
    expect(getLabelDegree(styles, true)).to.equal(0);
  });

  it('Sets degree for diagonal labels', () => {
    document.body.innerHTML = '<div class="chart line mobile-diagonal-labels"></div>';
    const styles = document.querySelector('.chart').classList;
    expect(getLabelDegree(styles, false)).to.be.above(0);
  });

  it('sets default grid bottom', () => {
    const options = getChartOptions({});
    expect(options.grid.bottom).to.equal(90);
  });

  it('sets grid bottom for large chart with default labels', () => {
    const options = getChartOptions({ size: 'large' });
    expect(options.grid.bottom).to.equal(60);
  });

  it('sets grid bottom for large chart with diagonal labels', () => {
    const options = getChartOptions({ size: 'large', labelDeg: 60 });
    expect(options.grid.bottom).to.equal(30);
  });

  it('sets grid bottom for non-large chart with diagonal labels', () => {
    const options = getChartOptions({ size: 'small', labelDeg: 60 });
    expect(options.grid.bottom).to.equal(40);
  });

  it('adds subheading from data file', async () => {
    document.body.innerHTML = '<div class="chart"><div>Title</div><div>Subtitle</div><div><div><a href="/drafts/data-viz/chart.json"></a></div></div><div>Footnote</div></div>';
    const el = document.querySelector('.chart');
    const data = await readFile({ path: './mocks/lineChartSubheading.json' });
    fetch.withArgs(el.getElementsByTagName('a')[0].href).resolves({ ok: true, json: () => JSON.parse(data) });
    el.classList.add('line');
    init(el);
    const subheading = await waitForElement('.subheading');
    expect(subheading).to.exist;
    const chartWrapper = await waitForElement('.chart-wrapper');
    expect(chartWrapper).to.exist;
    expect(chartWrapper.getAttribute('role')).to.equal('img');
    expect(chartWrapper.getAttribute('aria-label')).to.contain('This is a chart');
  });

  describe('authored color-palette', () => {
    let observer;
    let width;
    let chart;
    const paletteRow = '<div><div><p> Color-Palette </p></div><div><p> #112233, #445566 </p></div></div>';
    const json = { data: [{ Day: 'Monday', First: '100', Second: '200', Third: '300' }] };

    beforeEach(() => {
      observer = window.IntersectionObserver;
      width = window.innerWidth;
      window.IntersectionObserver = undefined;
    });

    afterEach(() => {
      chart?.dispose();
      chart = undefined;
      window.IntersectionObserver = observer;
      window.innerWidth = width;
      document.body.innerHTML = '';
    });

    const renderChart = async (type, rows, data = json, namedColor = '') => {
      const link = `/drafts/data-viz/palette-${type}.json`;
      document.body.innerHTML = `<div class="chart ${type} ${namedColor}">
        <div><div>Title</div></div>
        <div><div>Subtitle</div></div>
        <div><div><a href="${link}"></a></div></div>
        ${rows}
      </div>`;
      const el = document.querySelector('.chart');
      fetch.withArgs(new URL(link, window.location.href).href)
        .resolves({ ok: true, json: () => data });
      init(el);
      await waitForElement(type === 'list' ? '.list-wrapper' : '.chart-wrapper svg');
      if (type !== 'list') chart = window.echarts.getInstanceByDom(el.querySelector('.chart-wrapper'));
      return el;
    };

    ['column', 'line', 'bar'].forEach((type) => {
      it(`applies only the custom palette to ${type} charts and preserves the footnote`, async () => {
        const el = await renderChart(type, `${paletteRow}<div><div>Footnote</div></div>`, json, 'indigo');
        expect(chart.getOption().color).to.eql(['#112233', '#445566']);
        expect(el.querySelector('.title').textContent).to.equal('Title');
        expect(el.querySelector('.subtitle').textContent).to.equal('Subtitle');
        expect(el.querySelector('.footnote').textContent).to.equal('Footnote');
        expect(el.textContent).not.to.contain('Color-Palette');
        expect(el.querySelector(`[${type === 'line' ? 'stroke' : 'fill'}="#112233"]`)).to.exist;
        if (type === 'bar') {
          expect(chart.getOption().series[2].backgroundStyle.color).to.equal('#112233');
        }
      });
    });

    ['column', 'bar'].forEach((type) => {
      it(`cycles colors across individual ${type} bars without a Color column`, async () => {
        const data = {
          data: [
            { Day: 'Monday', Visitors: '100' },
            { Day: 'Tuesday', Visitors: '200' },
            { Day: 'Wednesday', Visitors: '300' },
            { Day: 'Thursday', Visitors: '400' },
            { Day: 'Friday', Visitors: '500' },
          ],
        };
        const el = await renderChart(type, paletteRow, data, 'indigo');
        expect(chart.getOption().color).to.eql(['#112233', '#445566']);
        expect(chart.getOption().series[0].colorBy).to.equal('data');
        expect(el.querySelectorAll('.chart-wrapper svg path[fill="#112233"]').length)
          .to.be.at.least(3);
        expect(el.querySelectorAll('.chart-wrapper svg path[fill="#445566"]').length)
          .to.be.at.least(2);
      });

      [false, true].forEach((hasColorColumn) => {
        const suffix = hasColorColumn ? ' despite a Color column' : '';
        it(`keeps grouped ${type} colors aligned with their series${suffix}`, async () => {
          const data = {
            data: ['Wednesday', 'Thanksgiving', 'Black Friday'].map((day, index) => ({
              0: day,
              2024: `${100 + index * 10}`,
              2025: `${200 + index * 10}`,
              ...(hasColorColumn ? { Color: 'purple' } : {}),
            })),
          };
          const el = await renderChart(type, paletteRow, data, 'indigo');
          const options = chart.getOption();
          expect(options.series.map(({ name, colorBy }) => ({ name, colorBy }))).to.eql([
            { name: '2024', colorBy: 'series' },
            { name: '2025', colorBy: 'series' },
          ]);
          const seriesModels = chart.getModel().getSeries();
          seriesModels.forEach((seriesModel, seriesIndex) => {
            const seriesData = seriesModel.getData();
            const expectedColor = ['#112233', '#445566'][seriesIndex];
            expect(seriesData.getVisual('style').fill).to.equal(expectedColor);
            for (let index = 0; index < seriesData.count(); index += 1) {
              expect(seriesData.getItemVisual(index, 'style').fill).to.equal(expectedColor);
            }
          });
          expect(el.querySelectorAll('.chart-wrapper svg path[fill="#112233"]').length)
            .to.be.at.least(3);
          expect(el.querySelectorAll('.chart-wrapper svg path[fill="#445566"]').length)
            .to.be.at.least(3);
          expect(el.querySelector(`.chart-wrapper svg path[fill="${colorPalette.purple}"]`))
            .not.to.exist;
        });
      });
    });

    it('uses every applicable custom color instead of the final spreadsheet color', async () => {
      const colors = ['#003F5C', '#2F4B7C', '#665191', '#A05195', '#D45087', '#F95D6A', '#FF7C43'];
      const data = {
        data: colors.map((color, index) => ({
          date: `${2019 + index}`,
          'Spend ($B)': `${100 + index * 10}`,
          Color: index === 6 ? 'purple' : '',
          unit: index === 0 ? 'B' : '',
        })),
      };
      const row = `<div><div>color-palette</div><div>${colors.join(', ')}</div></div>`;
      const el = await renderChart('column', row, data, 'blue');
      expect(chart.getOption().color).to.eql(colors);
      colors.forEach((color) => {
        expect(el.querySelector(`.chart-wrapper svg path[fill="${color}"]`)).to.exist;
      });
      expect(el.querySelector(`.chart-wrapper svg path[fill="${colorPalette.purple}"]`)).not.to.exist;
    });

    it('does not treat a palette row as a footnote when no footnote is authored', async () => {
      const el = await renderChart('column', paletteRow);
      expect(el.querySelector('.footnote')).not.to.exist;
      expect(chart.getOption().color[0]).to.equal('#112233');
    });

    it('retains positional content when the configuration precedes the title', async () => {
      const link = '/drafts/data-viz/palette-before-title.json';
      document.body.innerHTML = `<div class="chart line">${paletteRow}
        <div><div>Title</div></div><div><div>Subtitle</div></div>
        <div><div><a href="${link}"></a></div></div><div><div>Footnote</div></div>
      </div>`;
      fetch.withArgs(new URL(link, window.location.href).href)
        .resolves({ ok: true, json: () => json });
      const el = document.querySelector('.chart');
      init(el);
      await waitForElement('.chart-wrapper svg');
      chart = window.echarts.getInstanceByDom(el.querySelector('.chart-wrapper'));
      expect(el.querySelector('.title').textContent).to.equal('Title');
      expect(el.querySelector('.footnote').textContent).to.equal('Footnote');
      expect(chart.getOption().color[0]).to.equal('#112233');
    });

    it('preserves legacy named colors when no palette row is present', async () => {
      const el = await renderChart('column', '<div><div>Footnote</div></div>', json, 'indigo');
      expect(chart.getOption().color).to.eql(getColors('indigo'));
      expect(el.hasAttribute('title')).to.equal(false);
    });

    it('falls back to the full legacy palette when one custom color is invalid', async () => {
      const row = '<div><div>color-palette</div><div>#112233, invalid</div></div>';
      const el = await renderChart('column', row, json, 'indigo');
      expect(chart.getOption().color).to.eql(getColors('indigo'));
      expect(el.classList.contains('palette-warning')).to.equal(true);
      expect(el.hasAttribute('title')).to.equal(false);
    });

    it('keeps the custom palette ahead of spreadsheet colors', async () => {
      const data = {
        data: [
          { Day: 'Monday', Visitors: '100', Color: '' },
          { Day: 'Tuesday', Visitors: '200', Color: 'magenta' },
        ],
      };
      await renderChart('column', paletteRow, data, 'indigo');
      expect(chart.getOption().color).to.eql(['#112233', '#445566']);
      expect(chart.getOption().series[0].colorBy).to.equal('data');
    });

    it('ignores spreadsheet colors for line charts with a valid custom palette', async () => {
      const data = { data: [{ ...json.data[0], Color: 'purple' }] };
      await renderChart('line', paletteRow, data, 'indigo');
      expect(chart.getOption().color).to.eql(getColors('indigo', ['#112233', '#445566']));
    });

    ['bar', 'column', 'line'].forEach((type) => {
      it(`preserves spreadsheet colors for ${type} charts with a malformed custom palette`, async () => {
        const data = {
          data: [
            { Day: 'Monday', Visitors: '100', Color: '' },
            { Day: 'Tuesday', Visitors: '200', Color: 'purple' },
          ],
        };
        const row = '<div><div>color-palette</div><div>#112233, invalid</div></div>';
        const el = await renderChart(type, row, data, 'indigo');
        expect(chart.getOption().color).to.eql([colorPalette.indigo, colorPalette.purple]);
        expect(el.classList.contains('palette-warning')).to.equal(true);
        expect(el.hasAttribute('title')).to.equal(false);
      });
    });

    [false, true].forEach((singleSeries) => {
      it(`retains ${singleSeries ? 'per-bar' : 'per-series'} custom colors after resizing`, async () => {
        const listener = sinon.spy(window, 'addEventListener');
        let clock;
        try {
          const data = singleSeries
            ? { data: [{ Day: 'Monday', Visitors: '100', Color: 'purple' }] }
            : { data: [{ ...json.data[0], Color: 'purple' }] };
          const el = await renderChart('bar', paletteRow, data);
          const resize = listener.getCalls().find(({ args }) => args[0] === 'resize').args[1];
          clock = sinon.useFakeTimers();
          window.innerWidth = DESKTOP_BREAKPOINT;
          resize();
          clock.tick(1000);
          chart = window.echarts.getInstanceByDom(el.querySelector('.chart-wrapper'));
          expect(el.getAttribute('data-device')).to.equal('desktop');
          expect(chart.getOption().color).to.eql(['#112233', '#445566']);
          expect(chart.getOption().series[0].colorBy).to.equal(singleSeries ? 'data' : 'series');
          expect(chart.getOption().series[0].backgroundStyle.color).to.equal('#112233');

          window.innerWidth = TABLET_BREAKPOINT - 1;
          resize();
          clock.tick(1000);
          chart = window.echarts.getInstanceByDom(el.querySelector('.chart-wrapper'));
          expect(el.getAttribute('data-device')).to.equal('mobile');
          expect(chart.getOption().color).to.eql(['#112233', '#445566']);
          expect(chart.getOption().series[0].colorBy).to.equal(singleSeries ? 'data' : 'series');
        } finally {
          clock?.restore();
          listener.restore();
        }
      });
    });

    it('uses only the first custom color for list headers', async () => {
      const data = JSON.parse(await readFile({ path: './mocks/listChartSingleTable.json' }));
      data.table.data.push({ Title: 'Second list', Sheet: 'Black Friday' });
      const el = await renderChart('list', paletteRow, data, 'indigo');
      const headers = el.querySelectorAll('.list-wrapper .title');
      expect(headers.length).to.equal(2);
      headers.forEach((header) => {
        expect(header.style.backgroundColor).to.equal('rgb(17, 34, 51)');
      });
      expect(el.hasAttribute('title')).to.equal(false);
    });

    ['#112233, invalid', 'invalid, #112233, #445566', '#112233,', ' #112233 ']
      .forEach((value) => {
        it(`uses the first valid list header color from "${value}"`, async () => {
          const data = JSON.parse(await readFile({ path: './mocks/listChartSingleTable.json' }));
          const row = `<div><div>color-palette</div><div>${value}</div></div>`;
          const el = await renderChart('list', row, data, 'indigo');
          expect(el.querySelector('.list-wrapper .title').style.backgroundColor)
            .to.equal('rgb(17, 34, 51)');
          expect(el.textContent).not.to.contain('color-palette');
          expect(el.hasAttribute('title')).to.equal(false);
        });
      });

    it('preserves the legacy list color when no custom hex code is valid', async () => {
      const data = JSON.parse(await readFile({ path: './mocks/listChartSingleTable.json' }));
      const row = '<div><div>color-palette</div><div>invalid, #12,</div></div>';
      const el = await renderChart('list', row, data, 'indigo');
      expect(el.querySelector('.list-wrapper .title').style.backgroundColor).to.equal('rgb(64, 70, 202)');
      expect(el.classList.contains('palette-warning')).to.equal(true);
      expect(el.hasAttribute('title')).to.equal(false);
    });

    it('preserves the named list color without a configuration row', async () => {
      const data = JSON.parse(await readFile({ path: './mocks/listChartSingleTable.json' }));
      const el = await renderChart('list', '', data, 'indigo');
      expect(el.querySelector('.list-wrapper .title').style.backgroundColor).to.equal('rgb(64, 70, 202)');
      expect(el.hasAttribute('title')).to.equal(false);
    });

    it('does not change area chart colors', async () => {
      await renderChart('area', paletteRow, json, 'indigo');
      expect(chart.getOption().color).to.eql(getColors('indigo'));
    });
  });

  describe('processUnits', () => {
    it('returns default units when no unit headers provided', () => {
      const headers = { Day: 'Monday', Visitors: '100' };
      const expected = {
        xAxis: { date: false },
        yAxes: [{
          prefix: '',
          suffix: '',
        }],
      };
      expect(processUnits(headers)).to.eql(expected);
    });

    it('handles legacy unit format with suffix only', () => {
      const headers = { Day: 'Monday', Visitors: '100', Unit: 'k' };
      const expected = {
        xAxis: { date: false },
        yAxes: [{
          prefix: '',
          suffix: 'k',
        }],
      };
      expect(processUnits(headers)).to.eql(expected);
    });

    it('handles legacy unit format with date and two y-axis units', () => {
      const headers = { Day: 'Monday', Visitors: '100', Unit: 'date-k-m' };
      const expected = {
        xAxis: { date: true },
        yAxes: [
          {
            prefix: '',
            suffix: 'k',
          },
          {
            prefix: '',
            suffix: 'm',
          },
        ],
      };
      expect(processUnits(headers)).to.eql(expected);
    });

    it('handles new format with y axis unit suffix only', () => {
      const headers = { Day: 'Monday', Visitors: '100', 'Y Axis Unit': 'k' };
      const expected = {
        xAxis: { date: false },
        yAxes: [{
          prefix: '',
          suffix: 'k',
        }],
      };
      expect(processUnits(headers)).to.eql(expected);
    });

    it('handles new format with y axis unit prefix and suffix', () => {
      const headers = { Day: 'Monday', Visitors: '100', 'Y Axis Unit': '$, k' };
      const expected = {
        xAxis: { date: false },
        yAxes: [{
          prefix: '$',
          suffix: 'k',
        }],
      };
      expect(processUnits(headers)).to.eql(expected);
    });

    it('handles new format with date and two y-axis units', () => {
      const headers = { Day: 'Monday', Visitors: '100', 'X Axis Unit': 'date', 'Y Axis Unit': '£, K', 'Secondary Y Axis Unit': '$,M' };
      const expected = {
        xAxis: { date: true },
        yAxes: [
          {
            prefix: '£',
            suffix: 'K',
          },
          {
            prefix: '$',
            suffix: 'M',
          },
        ],
      };
      expect(processUnits(headers)).to.eql(expected);
    });
  });
});
