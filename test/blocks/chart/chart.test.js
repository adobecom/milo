/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';

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
  listChartData,
  processDataset,
  processMarkData,
} = await import('../../../libs/blocks/chart/chart.js');

describe('chart utils', () => {
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
    const authoredColor = 'cyan';
    const colors = [
      '#34C5E8',
      '#3991F3',
      '#686DF4',
      '#8A3CE7',
      '#E054E2',
      '#DE3C82',
      '#EA3829',
      '#F48411',
      '#F5D704',
      '#A9D814',
      '#26BB36',
      '#008F5D',
      '#12B5AE',
    ];

    expect(getColors(authoredColor)).to.eql(colors);
  });

  it('getOverrideColors returns authored color with overrides', () => {
    const fetchedData = {
      data: [
        { Day: 'Mon', Visitors: '150', Group: '', Unit: 'k', Color: '' },
        { Day: 'Tues', Visitors: '230', Group: '', Unit: '', Color: '' },
        { Day: 'Weds', Visitors: '224', Group: '', Unit: '', Color: '' },
        { Day: 'Thurs', Visitors: '218', Group: '', Unit: '', Color: 'red' },
        { Day: 'Fri', Visitors: '135', Group: '', Unit: '', Color: 'red' },
        { Day: 'Sat', Visitors: '147', Group: '', Unit: '', Color: 'red' },
        { Day: 'Sun', Visitors: '260', Group: '', Unit: '', Color: '' },
      ],
    };
    const authoredColor = 'cyan';
    const colors = [
      '#34C5E8',
      '#34C5E8',
      '#34C5E8',
      '#EA3829',
      '#EA3829',
      '#EA3829',
      '#34C5E8',
    ];

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

  it('fetch list data', () => {
    const fetchedData = {
      total: 5,
      offset: 0,
      limit: 5,
      data: [
        { 'Black Friday': 'XBOX One S', Price: '1.54' },
        { 'Black Friday': 'Swiffer Xtreme', Price: '1.27' },
        { 'Black Friday': 'Teddy Ruxpin', Price: '1.15' },
        { 'Black Friday': 'Airpods', Price: '1.03' },
        { 'Black Friday': 'Tickle me Elmo', Price: '1.01' }],
      ':type': 'sheet',
    };

    const processedData = {
      'Black Friday': [
        { 'Black Friday': 'XBOX One S', Price: '1.54' },
        { 'Black Friday': 'Swiffer Xtreme', Price: '1.27' },
        { 'Black Friday': 'Teddy Ruxpin', Price: '1.15' },
        { 'Black Friday': 'Airpods', Price: '1.03' },
        { 'Black Friday': 'Tickle me Elmo', Price: '1.01' },
      ],
    };

    expect(listChartData(fetchedData)).to.eql(processedData);
  });

  it('fetch list data multi', () => {
    const fetchedData = {
      'Black Friday': {
        total: 5,
        offset: 0,
        limit: 5,
        data: [
          { 'Black Friday': 'XBOX One S', Price: '1.54' },
          { 'Black Friday': 'Swiffer Xtreme', Price: '1.27' },
          { 'Black Friday': 'Teddy Ruxpin', Price: '1.15' },
          { 'Black Friday': 'Airpods', Price: '1.03' },
          { 'Black Friday': 'Tickle me Elmo', Price: '1.01' }],
      },
      'Cyber Monday': {
        total: 5,
        offset: 0,
        limit: 5,
        data: [
          { 'Cyber Monday': 'XBOX One S' },
          { 'Cyber Monday': 'Swiffer Xtreme' },
          { 'Cyber Monday': 'Teddy Ruxpin' },
          { 'Cyber Monday': 'Airpods' },
          { 'Cyber Monday': 'Tickle me Elmo' }],
      },
      ':version': 3,
      ':names': ['Cyber Monday', 'Black Friday'],
      ':type': 'multi-sheet',
    };

    const processedData = {
      'Black Friday': [
        { 'Black Friday': 'XBOX One S', Price: '1.54' },
        { 'Black Friday': 'Swiffer Xtreme', Price: '1.27' },
        { 'Black Friday': 'Teddy Ruxpin', Price: '1.15' },
        { 'Black Friday': 'Airpods', Price: '1.03' },
        { 'Black Friday': 'Tickle me Elmo', Price: '1.01' },
      ],
      'Cyber Monday': [
        { 'Cyber Monday': 'XBOX One S' },
        { 'Cyber Monday': 'Swiffer Xtreme' },
        { 'Cyber Monday': 'Teddy Ruxpin' },
        { 'Cyber Monday': 'Airpods' },
        { 'Cyber Monday': 'Tickle me Elmo' },
      ],
    };

    expect(listChartData(fetchedData)).to.eql(processedData);
  });

  it('fetch list data multi with metadata', () => {
    const fetchedData = {
      table: {
        total: 2,
        offset: 0,
        limit: 2,
        data: [
          { Title: 'Black Friday Numbers Ordered', Sheet: 'Black Friday', Type: 'numbered' },
        ],
      },
      'Black Friday': {
        total: 5,
        offset: 0,
        limit: 5,
        data: [
          { Name: 'XBOX One S', Price: '1.54' },
          { Name: 'Swiffer Xtreme', Price: '1.27' },
          { Name: 'Teddy Ruxpin', Price: '1.15' },
          { Name: 'Airpods', Price: '1.03' },
          { Name: 'Tickle me Elmo', Price: '1.01' }],
      },
      ':version': 3,
      ':names': ['table', 'Black Friday'],
      ':type': 'multi-sheet',
    };

    const processedData = {
      table: [
        {
          Title: 'Black Friday Numbers Ordered',
          Sheet: 'Black Friday',
          Type: 'numbered',
        },
      ],
      'Black Friday Numbers Ordered': [
        { Name: 'XBOX One S', Price: '1.54' },
        { Name: 'Swiffer Xtreme', Price: '1.27' },
        { Name: 'Teddy Ruxpin', Price: '1.15' },
        { Name: 'Airpods', Price: '1.03' },
        { Name: 'Tickle me Elmo', Price: '1.01' },
      ],
    };

    expect(listChartData(fetchedData)).to.eql(processedData);
  });
});
