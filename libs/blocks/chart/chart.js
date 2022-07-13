import { loadScript } from '../../utils/utils.js';
import getTheme from './chartLightTheme.js';

// const SMALL = 'small';
// const MEDIUM = 'medium';
const LARGE = 'large';
const chartTypes = [
  'bar',
];

const barTooltipFormatter = ({
  seriesName,
  marker,
  value,
  encode: { x = [] },
  name,
} = {}, unit = '') => (
  `${seriesName}<br />${marker} ${value[x[0]]}${unit} ${name}<i class="tooltip_icon"></i>`
);

const barSeriesOptions = (seriesData, colors, unit) => (
  seriesData.map((value, index) => ({
    type: 'bar',
    label: {
      show: true,
      formatter: `{@[${index + 1}]}${unit}`,
    },
    showBackground: true,
    backgroundStyle: { color: colors[index] },
  }))
);

export const getChartOptions = (chartType, chartData, colors) => {
  let unit = '';

  if (chartData && chartData.unit) {
    unit = chartData.unit;
    delete chartData.unit;
  }

  const source = chartData?.dataset?.source;
  const seriesData = (source && source[1]) ? source[1].slice() : [];

  seriesData.shift();

  return {
    ...chartData,
    color: colors,
    legend: {
      show: true,
      type: 'scroll',
    },
    tooltip: {
      show: true,
      formatter: (params) => barTooltipFormatter(params, unit),
    },
    xAxis: {
      type: chartType === 'bar' ? 'value' : 'category',
      axisLabel: { show: chartType !== 'bar' },
      axisTick: { show: chartType !== 'bar' },
      max: (value) => {
        if (chartType !== 'bar') return null;
        // This adds extra space on xAxis so labels will fit
        const extraSpace = 1;
        return Math.ceil((value.max + (value.max * extraSpace)) / 10) * 10;
      },
    },
    yAxis: {
      type: chartType === 'bar' ? 'category' : 'value',
      axisLabel: { show: chartType !== 'bar' },
      axisTick: { show: chartType !== 'bar' },
    },
    series: barSeriesOptions(seriesData, colors, unit),
  };
};

const init = (el) => {
  const children = el?.querySelectorAll(':scope > div');
  children[0]?.classList.add('chart_title');
  children[1]?.classList.add('chart_subTitle');
  children[3]?.classList.add('chart_footnote');

  // ToDo: Replace hardcoded size MWPW-112994
  const size = LARGE;
  const chartRow = children[2];

  if (chartRow) {
    chartRow.style.width = '600px';
    chartRow.style.height = '600px';
  }

  const chart = chartRow?.querySelector(':scope > div');

  if (chart) {
    chart.style.width = '600px';
    chart.style.height = '600px';
  }

  const chartType = chartTypes?.find((type) => el?.className?.indexOf(type));

  if (!chartType || !chart) return;

  const dataLink = chart?.querySelector('a');
  dataLink?.remove();

  // ToDo: Replace dummy data MWPW-112433
  const chartData = {
    dataset: {
      source: [
        ['Browsers', 'Chrome', 'Firefox', 'Edge'],
        ['Avg Visitors', 100, 156, 105],
      ],
    },
    unit: 'k',
  };

  const colors = ['red', 'blue', 'green'];

  if (chartType !== 'oversizedNumber') {
    console.log(chartType);
    loadScript('/libs/deps/echarts.min.js')
      .then(() => {
        console.log('then');
        const themeName = getTheme(size);
        const barChart = window.echarts?.init(chart, themeName, { renderer: 'svg' });

        barChart?.setOption(getChartOptions(chartType, chartData, colors));
      })
      .catch((error) => console.log('Error loading script:', error));
  }
};

export default init;
