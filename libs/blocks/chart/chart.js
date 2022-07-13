import { makeRelative, loadScript } from '../../utils/utils.js';
import getTheme from './chartLightTheme.js';

// const SMALL = 'small';
// const MEDIUM = 'medium';
const LARGE = 'large';
const chartTypes = [
  'bar',
];

function processDataset(data) {
  const dataset = {};

  // Remove group and unit from headers
  const headers = Object.keys(data[0]).filter(header =>
    header.toLowerCase() !== 'unit' && header.toLowerCase() !== 'group'
  );
  dataset.source = [headers];

  // Use headers to set source
  data.forEach(element => {
    const values = headers.map((column) => element[column]);
    dataset.source.push(values);
  });

  return dataset;
}

function processSeries(data) {
  const series = [];
  // TODO: Series data
  return series;
}

/**
 * Return data as object with two entries
 */
async function fetchData(link) {
  const path = makeRelative(link.href);
  const data = {};
  const resp = await fetch(path.toLowerCase());
  if (!resp.ok) return;
  const json = await resp.json();

  // Check the type of data
  if (json[':type'] == 'multi-sheet') {
    const dataSheet = json[':names'][0];
    const seriesSheet = json[':names'][1];
    data.data = json[dataSheet]?.data;
    data.series = json[seriesSheet]?.data;
  } else {
    data.data = json.data;
    data.series = [];
  }

  return data;
}

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

export const getChartOptions = (chartType, dataset, colors, unit = '') => {
  const source = dataset?.source;
  const seriesData = (source && source[1]) ? source[1].slice() : [];

  seriesData.shift();

  return {
    dataset,
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

const init = async (el) => {
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
  const dataLink = chart?.querySelector('a[href$="json"]');
  dataLink?.remove();

  if (!chartType || !chart || !dataLink) return;

  const data = await fetchData(dataLink);
  if (!data) return;

  const dataset = processDataset(data.data);
  const unit = data?.data[0]?.Unit;
  const colors = ['red', 'blue', 'green'];

  if (chartType !== 'oversizedNumber') {
    loadScript('/libs/deps/echarts.min.js')
      .then(() => {
        const themeName = getTheme(size);
        const barChart = window.echarts?.init(chart, themeName, { renderer: 'svg' });

        barChart?.setOption(getChartOptions(chartType, dataset, colors, unit));
      })
      .catch((error) => console.log('Error loading script:', error));
  }
};

export default init;
