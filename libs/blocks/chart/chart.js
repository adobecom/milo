import { makeRelative, loadScript, throttle, isNullish } from '../../utils/utils.js';
import getTheme from './chartLightTheme.js';

export const SMALL = 'small';
export const MEDIUM = 'medium';
export const LARGE = 'large';
export const DESKTOP_BREAKPOINT = 1200;
export const TABLET_BREAKPOINT = 600;
const SECTION_CLASSNAME = 'chart-section';
const colorPalette = {
  red: '#EA3829',
  orange: '#F48411',
  yellow: '#F5D704',
  chartreuse: '#A9D814',
  celery: '#26BB36',
  green: '#008F5D',
  seafoam: '#12B5AE',
  cyan: '#34C5E8',
  blue: '#3991F3',
  indigo: '#686DF4',
  purple: '#8A3CE7',
  fuchsia: '#E054E2',
  magenta: '#DE3C82',
};
const chartTypes = [
  'bar',
  'column',
  'line',
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
  `${seriesName}<br />${marker} ${value[x[0]]}${unit} ${name}<i class="tooltip-icon"></i>`
);

export const tooltipFormatter = (params, unit) => {
  let tooltip = params[0].name;
  params.forEach(({
    marker,
    value,
    encode: { y = [] },
    seriesName,
  } = {}) => {
    tooltip += `<br />${marker} ${value[y[0]]}${unit} ${seriesName}`;
  });
  tooltip += '<i class="tooltip-icon"></i>';
  return tooltip;
};

const barSeriesOptions = (chartType, firstDataset, colors, size, unit) => {
  const isLarge = size === LARGE;
  const isBar = chartType === 'bar';

  return firstDataset.map((value, index) => ({
    type: 'bar',
    label: {
      show: isBar,
      formatter: `{@[${index + 1}]}${unit}`,
      position: 'right',
      textBorderColor: '#000',
      distance: 8,
      fontSize: isLarge ? 16 : 14,
    },
    showBackground: isBar,
    backgroundStyle: {
      color: colors[index],
      borderRadius: 3,
      opacity: 0.35,
    },
    itemStyle: { borderRadius: 3 },
    barCategoryGap: isBar ? 0 : '33.3%',
    barGap: '33.3%',
  }));
};

const lineSeriesOptions = (firstDataset) => (
  firstDataset.map(() => {
    const options = {
      type: 'line',
      symbol: 'none',
      lineStyle: { width: 8 },
    };

    // ToDo: Add marks

    return options;
  })
);

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
  const firstDataset = (source && source[1]) ? source[1].slice() : [];

  firstDataset.shift();

  return {
    dataset,
    color: colors,
    legend: {
      show: true,
      type: 'scroll',
    },
    tooltip: {
      show: true,
      formatter: chartType === 'bar'
        ? (params) => barTooltipFormatter(params, unit)
        : (params) => tooltipFormatter(params, unit),
      trigger: (chartType === 'column' || chartType === 'line') ? 'axis' : 'item',
      axisPointer: { type: chartType === 'column' ? 'none' : 'line' },
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
      boundaryGap: chartType === 'column',
    },
    yAxis: {
      type: chartType === 'bar' ? 'category' : 'value',
      axisLabel: {
        show: chartType !== 'bar',
        formatter: (params) => `${params}${unit}`,
        padding: 0,
      },
      axisTick: { show: chartType !== 'bar' },
    },
    series: (chartType === 'bar' || chartType === 'column')
      ? barSeriesOptions(chartType, firstDataset, colors, size, unit)
      : lineSeriesOptions(firstDataset),
  };
};

const initChart = (chartWrapper, chartType, data, colors, size) => {
  const themeName = getTheme(size);
  const chart = window.echarts?.init(chartWrapper, themeName, { renderer: 'svg' });
  const chartOptions = getChartOptions(chartType, data, colors, size);
  chart.setOption(chartOptions);

  return chart;
};

const handleIntersect = (chartWrapper, chartType, data, colors, size) => (entries, observer) => {
  if (!Array.isArray(entries)) return;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      initChart(chartWrapper, chartType, data, colors, size);
      observer.unobserve(entry.target);
    }
  });
};

const getColors = (authoredColor) => {
  const colorList = Object.values(colorPalette);

  if (isNullish(authoredColor) || !colorPalette.hasOwnProperty(authoredColor)) return colorList;

  const colorIndex = colorList.indexOf(colorPalette[authoredColor]);

  return colorList.concat(colorList.splice(0, colorIndex));
};

export const getContainerSize = (chartSize, chartType) => {
  const chartHeights = {
    area: {
      small: { height: 345 },
      medium: { height: 310 },
      large: { height: 512 },
    },
    default: {
      small: { height: 290 },
      medium: { height: 295 },
      large: { height: 350 },
    },
    donut: {
      small: { height: 345 },
      medium: { height: 450 },
      large: { height: 512 },
    },
    oversizedNumber: {
      small: { minHeight: 290 },
      medium: { minHeight: 295 },
      large: { minHeight: 350 },
    },
  };
  const containerSize = chartType in chartHeights
    ? chartHeights?.[chartType]?.[chartSize] || {}
    : chartHeights?.default?.[chartSize] || {};
  containerSize.width = '100%';
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

export const getResponsiveSize = (authoredSize) => {
  const width = window.innerWidth;
  let size = LARGE;

  if (width < TABLET_BREAKPOINT || authoredSize === SMALL) {
    size = SMALL;
  } else if (width < DESKTOP_BREAKPOINT || authoredSize === MEDIUM) {
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
  children[0]?.classList.add('title');
  children[1]?.classList.add('subtitle');
  children[3]?.classList.add('footnote');
  chartWrapper?.classList.add('chart_wrapper');

  const chartStyles = el?.classList;
  const section = el?.parentElement?.matches('.section') ? el.parentElement : null;
  const sectionChildren = section?.querySelectorAll(':scope > div:not(.section-metadata)');
  const upNumber = sectionChildren?.length;
  section?.classList.add(`up-${upNumber}`);
  section?.classList.add(SECTION_CLASSNAME);

  let authoredSize = SMALL;
  if (upNumber === 1) authoredSize = LARGE;
  if (upNumber === 2) authoredSize = MEDIUM;

  const size = getResponsiveSize(authoredSize);
  el.classList.add(authoredSize);
  el.setAttribute('data-responsive-size', size);

  const chartType = chartTypes?.find((type) => el?.className?.indexOf(type) !== -1);
  const dataLink = chartWrapper?.querySelector('a[href$="json"]');

  dataLink?.remove();

  if (!chartType || !chartWrapper || !dataLink) return;

  const data = await fetchData(dataLink);

  if (!data) return;

  const authoredColor = Array.from(chartStyles)?.find((style) => style in colorPalette);
  const colors = getColors(authoredColor);

  updateContainerSize(chartWrapper, size, chartType);

  if (chartType !== 'oversizedNumber') {
    loadScript('/libs/deps/echarts.min.js')
      .then(() => {
        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        };

        if (!(window.IntersectionObserver)) {
          initChart(chartWrapper, chartType, data, colors, size);
        } else {
          const observer = new IntersectionObserver(
            handleIntersect(chartWrapper, chartType, data, colors, size),
            observerOptions,
          );
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
