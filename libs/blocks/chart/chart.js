import { makeRelative, loadScript, throttle } from '../../utils/utils.js';
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
  const headers = Object.keys(data[0]).filter((header) => header.toLowerCase() !== 'unit' && header.toLowerCase() !== 'group');
  dataset.source = [headers];

  // Use headers to set source
  data.forEach((element) => {
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
  if (!resp.ok) return data;
  const json = await resp.json();

  // Check the type of data
  if (json[':type'] === 'multi-sheet') {
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

/**
 * Returns object of echart options
 * @param {string} chartType
 * @param {object} data
 * @param {array} colors
 * @param {string} size
 * @returns {object}
 */
export const getChartOptions = (chartType, data, colors, size) => {
  const dataset = processDataset(data.data);
  const unit = data?.data[0]?.Unit || '';
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

const handleIntersect = (chart, chartOptions) => (entries, observer) => {
  if (!Array.isArray(entries)) return;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      chart?.setOption(chartOptions);
      observer.unobserve(entry.target);
    }
  });
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

const updateContainerSize = (chartWrapper, chartSize, chartType) => {
  const containerSize = getContainerSize(chartSize, chartType);
  const chartRow = chartWrapper?.parentElement;

  if (chartRow) {
    chartRow.style.width = containerSize?.width;
    chartRow.style.height = `${containerSize?.height}px`;
  }

  if (chartWrapper) {
    chartWrapper.style.width = containerSize?.width;
    chartWrapper.style.height = `${containerSize?.height}px`;
  }
};

const getResponsiveSize = (authoredSize) => {
  const desktopBreakpoint = 1200;
  const tabletBreakpoint = 600;
  const width = window.innerWidth;
  let size = authoredSize;

  if (width < tabletBreakpoint) {
    size = SMALL;
  } else if (width < desktopBreakpoint) {
    size = MEDIUM;
  }

  return size;
};

const handleResize = (el, authoredSize, chartType, data, colors) => {
  const currentSize = getResponsiveSize(authoredSize);
  const previousSize = el?.getAttribute('data-responsive-size');
  const previousIsLarge = previousSize === LARGE;
  const currentIsLarge = currentSize === LARGE;
  const chartWrapper = el?.querySelector('.chart_wrapper');
  const chartInstance = window.echarts?.getInstanceByDom(chartWrapper);

  if (currentSize !== previousSize) {
    updateContainerSize(chartWrapper, currentSize, chartType);
    el.setAttribute('data-responsive-size', currentSize);
  }

  if (previousIsLarge !== currentIsLarge) {
    chartInstance?.dispose();

    const themeName = getTheme(currentSize);
    const chart = window.echarts?.init(chartWrapper, themeName, { renderer: 'svg' });
    const chartOptions = getChartOptions(chartType, data, colors, currentSize);

    chart.setOption(chartOptions);
  } else {
    chartInstance?.resize();
  }
};

const init = async (el) => {
  const children = el?.querySelectorAll(':scope > div');
  const chartWrapper = children[2]?.querySelector(':scope > div');
  children[0]?.classList.add('chart_title');
  children[1]?.classList.add('chart_subTitle');
  children[3]?.classList.add('chart_footnote');
  chartWrapper?.classList.add('chart_wrapper');

  const container = document.createElement('section');
  container.className = 'chart_container';
  container.append(...children);
  el.appendChild(container);

  const chartStyles = el.parentElement.classList;
  const authoredSize = Array.from(chartStyles)?.find((style) => (
    style === SMALL || style === MEDIUM || style === LARGE
  ));
  const size = getResponsiveSize(authoredSize);
  el.classList.add(`chart_${authoredSize}`);
  el.setAttribute('data-responsive-size', size);

  const chartType = chartTypes?.find((type) => el?.className?.indexOf(type));
  const dataLink = chartWrapper?.querySelector('a[href$="json"]');

  dataLink?.remove();

  if (!chartType || !chartWrapper || !dataLink) return;

  const data = await fetchData(dataLink);
  if (!data) return;

  // ToDo: Replace colors MWPW-112994
  const colors = ['red', 'blue', 'green'];

  updateContainerSize(chartWrapper, size, chartType);

  if (chartType !== 'oversizedNumber') {
    loadScript('/libs/deps/echarts.min.js')
      .then(() => {
        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        };
        const themeName = getTheme(size);
        const chart = window.echarts?.init(chartWrapper, themeName, { renderer: 'svg' });
        const chartOptions = getChartOptions(chartType, data, colors, size);

        if (!(window.IntersectionObserver)) {
          chart.setOption(chartOptions);
        } else {
          const observer = new IntersectionObserver(handleIntersect(chart, chartOptions), observerOptions);
          observer.observe(el);
        }

        window.addEventListener('resize', throttle(
          1000,
          () => handleResize(el, authoredSize, chartType, data, colors),
        ));
      })
      .catch((error) => console.log('Error loading script:', error));
  }
};

export default init;
