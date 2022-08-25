/* eslint-disable no-unused-expressions */
/* global describe it before after */

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { waitForElement } from '../../helpers/selectors.js';

const {
  SMALL,
  MEDIUM,
  LARGE,
  DESKTOP_BREAKPOINT,
  TABLET_BREAKPOINT,
  colorPalette,
  getContainerSize,
  getResponsiveSize,
  tooltipFormatter,
  getColors,
  getOverrideColors,
  chartData,
  processDataset,
  processMarkData,
  donutSeriesOptions,
  setDonutLabel,
  handleDonutSelect,
  getChartOptions,
  fetchData,
  barTooltipFormatter,
  barSeriesOptions,
  lineSeriesOptions,
  default: init,
  pieTooltipFormatter,
  pieSeriesOptions,
} = await import('../../../libs/blocks/chart/chart.js');

describe('chart', () => {
  let fetch;

  before(() => {
    fetch = sinon.stub(window, 'fetch');
  });

  after(() => {
    sinon.restore();
  });

  it('getContainerSize provides default height and width', () => {
    expect(getContainerSize(LARGE, 'bar')).to.be.an('object')
      .that.has.all.keys('height', 'width');
  });

  it('getContainerSize provides custom area height and width', () => {
    expect(getContainerSize(LARGE, 'bar')).to.be.an('object')
      .that.has.all.keys('height', 'width');
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

    expect(tooltipFormatter(params, 'k')).to.equal(tooltip);
  });

  it('getColors returns default color list if no color provided', () => {
    const authoredColor = undefined;

    expect(getColors(authoredColor)).to.eql(Object.values(colorPalette));
  });

  it('getColors returns rotated color list if color provided ', () => {
    const authoredColor = 'indigo';
    const colors = ['#4046CA', '#7326D3', '#147AF3', '#72E06A', '#7E84FA', '#DE3D82', '#008F5D', '#CB5D00', '#E8C600', '#BCE931', '#0FB5AE', '#F68511'];

    expect(getColors(authoredColor)).to.eql(colors);
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

    expect(processDataset(fetchedData.data)).to.eql(dataset);
  });

  it('chart mark series data', () => {
    const fetchedData = {
      series: [
        {
          Type: 'markArea',
          Name: 'Weekend Sale',
          Axis: 'xAxis',
          Value: 'Fri-Sun',
        },
        {
          Type: 'markLine',
          Name: 'Promotion',
          Axis: 'xAxis',
          Value: 'Mon',
        },
        {
          Type: 'markLine',
          Name: 'Campaign Launch',
          Axis: 'xAxis',
          Value: 'Thurs',
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
        xAxis: 'Fri',
      }, { xAxis: 'Sun' }],
    ];
    const markLineData = [
      {
        name: 'Promotion',
        xAxis: 'Mon',
      },
      {
        name: 'Campaign Launch',
        xAxis: 'Thurs',
      },
      {
        name: 'Goal',
        yAxis: 200,
      },
    ];
    const markData = processMarkData(fetchedData.series);

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

  it('donutSeriesOptions returns array', () => {
    expect(Array.isArray(donutSeriesOptions(null, null, null, null, { on: () => {} }))).to.be.true;
  });

  it('setDonutLabel sets expects options', () => {
    const chart = { setOption: sinon.spy() };
    const expected = { series: [{ label: { formatter: [`{a|${'100'.toLocaleString()}k}`, '{b|title}'].join('\n') } }] };
    setDonutLabel(chart, 100, 'k', 'title');
    expect(chart.setOption.calledWith(expected)).to.be.true;
  });

  it('handleDonutSelect returns new sum', () => {
    const source = [[100, 'Monday'], [276, 'Tuesday'], [200, 'Wednesday']];
    const selected = { Monday: false, Tuesday: true, Wednesday: true };
    expect(handleDonutSelect(source, selected, { setOption: () => {} }, null, null)).to.equal(476);
  });

  it('getChartOptions', () => {
    expect(typeof getChartOptions()).to.equal('object');
  });

  it('fetchData returns json given an anchor tag', async () => {
    const link = document.createElement('a');
    const linkRel = '/drafts/data-viz/line.json';
    link.href = `https://data-viz--milo--adobecom.hlx.page${linkRel}`;
    const goodResponse = { ok: true, json: () => true };
    fetch.withArgs(linkRel).returns(goodResponse);
    const response = await fetchData(link);
    expect(response).to.be.true;
  });

  it('barTooltipFormatter returns expected string', () => {
    const value = ['Avg Visitors', 100, 156, 105];
    const encode = { x: [1] };
    const expected = 'Chrome<br />* 100k Avg Visitors<i class="tooltip-icon"></i>';
    expect(barTooltipFormatter({ seriesName: 'Chrome', marker: '*', value, encode, name: 'Avg Visitors' }, 'k')).to.equal(expected);
  });

  it('barSeriesOptions', () => {
    const firstDataset = [100, 156];
    const colors = ['#EA3829', '#F48411', '#F5D704', '#A9D814', '#26BB36', '#008F5D', '#12B5AE', '#34C5E8', '#3991F3', '#686DF4', '#8A3CE7', '#E054E2', '#DE3C82'];
    const expected = [
      {
        type: 'bar',
        label: {
          show: true,
          formatter: '{@[1]}K',
          position: 'right',
          textBorderColor: '#000',
          distance: 8,
          fontSize: 14,
        },
        colorBy: 'series',
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
          formatter: '{@[2]}K',
          position: 'right',
          textBorderColor: '#000',
          distance: 8,
          fontSize: 14,
        },
        colorBy: 'series',
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
    expect(barSeriesOptions('bar', false, firstDataset, colors, 'medium', ['K'])).to.eql(expected);
  });

  it('lineSeriesOptions returns correct options with marks', () => {
    const series = [{ Type: 'markArea', Name: 'Weekend', Axis: 'xAxis', Value: 'Saturday-Sunday' }, { Type: 'markLine', Name: 'Standout', Axis: 'xAxis', Value: 'Tuesday' }, { Type: 'markLine', Name: 'Average', Axis: 'yAxis', Value: '200' }];
    const firstDataset = [100, 156, 160];
    const units = ['K'];
    const expected = [
      {
        type: 'line',
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
        symbol: 'none',
        lineStyle: { width: 3 },
        yAxisIndex: 0,
      },
      {
        type: 'line',
        symbol: 'none',
        lineStyle: { width: 3 },
        yAxisIndex: 0,
      },
    ];

    expect(lineSeriesOptions(series, firstDataset, units)).to.eql(expected);
  });

  it('init generates list chart', async () => {
    const linkRel = '/drafts/data-viz/list.json';
    document.body.innerHTML = `<div class="chart list"><div>Title</div><div>Subtitle</div><div><div><a href="https://data-viz--milo--adobecom.hlx.page${linkRel}"></a></div></div><div>Footnote</div></div>`;
    const data = await readFile({ path: './mocks/listChartSingleTable.json' });
    const parsedData = JSON.parse(data);
    fetch.withArgs(linkRel).returns({ ok: true, json: () => parsedData });
    const el = document.querySelector('.chart');
    init(el);
    const listWrapper = await waitForElement('.list-wrapper');
    expect(listWrapper).to.exist;
  });

  it('init chart with echarts without intersection observer', async () => {
    window.IntersectionObserver = undefined;
    const linkRel = '/drafts/data-viz/bar.json';
    document.body.innerHTML = `<div class="chart bar"><div>Title</div><div>Subtitle</div><div><div><a href="https://data-viz--milo--adobecom.hlx.page${linkRel}"></a></div></div><div>Footnote</div></div>`;
    const data = await readFile({ path: './mocks/barChart.json' });
    const parsedData = JSON.parse(data);
    fetch.withArgs(linkRel).returns({ ok: true, json: () => parsedData });
    const el = document.querySelector('.chart');
    init(el);
    const svg = await waitForElement('svg');
    expect(svg).to.exist;
  });

  it('pieTooltipFormatter returns expected string', () => {
    const data = [100, 'Chrome'];
    const encode = { value: [0] };
    const expected = 'Chrome<br />* 100k<i class="tooltip-icon"></i>';
    expect(pieTooltipFormatter({ marker: '*', data, encode, name: 'Chrome' }, 'k')).to.equal(expected);
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
});
