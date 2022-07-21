import { makeRelative, loadScript } from '../../utils/utils.js';
import getTheme from './chartLightTheme.js';

const SMALL = 'small';
const MEDIUM = 'medium';
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

const barSeriesOptions = (seriesData, colors, size, unit) => {
  const isLarge = size === LARGE;

  return seriesData.map((value, index) => ({
    type: 'bar',
    label: {
      show: true,
      formatter: `{@[${index + 1}]}${unit}`,
      position: 'right',
      textBorderColor: '#000',
      distance: 8,
      fontSize: isLarge ? 16 : 14,
    },
    showBackground: true,
    backgroundStyle: {
      color: colors[index],
      borderRadius: 3,
      opacity: 0.35,
    },
    itemStyle: { borderRadius: 3 },
    barCategoryGap: 0,
    barGap: '33.3%',
  }));
};

const getContainerSize = (chartSize, chartType) => {
  const containerSizes = {
      area: {
          small: { height: 345, width: '100%' },
          medium: { height: 310, width: '100%' },
          large: { height: 512, width: '100%' },
      },
      default: {
          small: { height: 290, width: '100%' },
          medium: { height: 295, width: '100%' },
          large: { height: 350, width: '100%' },
      },
      donut: {
          small: { height: 345, width: '100%' },
          medium: { height: 450, width: '100%' },
          large: { height: 512, width: '100%' },
      },
      oversizedNumber: {
          small: { minHeight: 290, width: '100%' },
          medium: { minHeight: 295, width: '100%' },
          large: { minHeight: 350, width: '100%' },
      },
  };
  let containerSize = containerSizes?.default?.[chartSize] || {};

  if (chartType in containerSizes) {
    containerSize = containerSizes?.[chartType]?.[chartSize] || {};
  }

  return containerSize;
};

/**
 * Returns object of echart options
 * @param {string} chartType
 * @param {object} dataset
 * @param {array} colors
 * @param {string} size
 * @param {string} unit
 * @returns {}
 */
export const getChartOptions = (chartType, dataset, colors, size, unit = '') => {
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
    series: barSeriesOptions(seriesData, colors, size, unit),
  };
};

const init = async (el) => {
  const children = el?.querySelectorAll(':scope > div');
  children[0]?.classList.add('chart_title');
  children[1]?.classList.add('chart_subTitle');
  children[3]?.classList.add('chart_footnote');

  const container = document.createElement('section');
  container.className = 'chart_container';
  container.append(...children);
  el.appendChild(container);
  // Grab chart section metadata
  const chartStyles = el.parentElement.classList;
  const size = Array.from(chartStyles)?.find(style => style === SMALL || style === MEDIUM || style === LARGE);
  el.classList.add(`chart_${size}`);
  const chartType = chartTypes?.find((type) => el?.className?.indexOf(type));

  const chartRow = children[2];
  const containerSize = getContainerSize(size, chartType);

  if (chartRow) {
    chartRow.style.width = containerSize?.width;
    chartRow.style.height = `${containerSize?.height}px`;
  }

  const chart = chartRow?.querySelector(':scope > div');

  if (chart) {
    chart.style.width = containerSize?.width;
    chart.style.height = `${containerSize?.height}px`;
  }

  const dataLink = chart?.querySelector('a[href$="json"]');
  dataLink?.remove();

  if (!chartType || !chart || !dataLink) return;

  const data = await fetchData(dataLink);
  if (!data) return;

  const dataset = processDataset(data.data);
  const unit = data?.data[0]?.Unit;
  // ToDo: Replace colors MWPW-112994
  const colors = ['red', 'blue', 'green'];

  if (chartType !== 'oversizedNumber') {
    loadScript('/libs/deps/echarts.min.js')
      .then(() => {
        const themeName = getTheme(size);
        const barChart = window.echarts?.init(chart, themeName, { renderer: 'svg' });

        barChart?.setOption(getChartOptions(chartType, dataset, colors, size, unit));
      })
      .catch((error) => console.log('Error loading script:', error));
  }
};

export default init;
