import { makeRelative, loadScript, throttle, isNullish } from '../../utils/utils.js';
import getTheme from './chartLightTheme.js';

export const SMALL = 'small';
export const MEDIUM = 'medium';
export const LARGE = 'large';
export const DESKTOP_BREAKPOINT = 1200;
export const TABLET_BREAKPOINT = 600;
export const colorPalette = {
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
const SECTION_CLASSNAME = 'chart-section';
const chartTypes = [
  'bar',
  'column',
  'line',
  'area',
];

const parseValue = (value) => (Number.isInteger(Number(value)) ? parseInt(value, 10) : value);

export function processDataset(data) {
  const dataset = {};

  // Remove group and unit from headers
  const headers = Object.keys(data[0]).filter((header) => !['unit', 'group', 'color'].includes(header.toLowerCase()));
  dataset.source = [headers];

  // Use headers to set source
  data.forEach((element) => {
    const values = headers.map((column) => parseValue(element[column]));
    dataset.source.push(values);
  });

  return dataset;
}

export function processMarkData(series) {
  const seriesOptions = series.reduce((options, mark) => {
    options[mark.Type] ??= { data: [] };

    const markData = options[mark.Type].data;
    const split = mark.Value?.split('-');
    const value = parseValue(split[0]);
    const markObject = {
      ...(mark.Name ? { name: mark.Name } : {}),
      ...(mark.Axis ? { [mark.Axis]: value } : {}),
    };

    if (mark.Type === 'markArea') {
      markData[0] ??= [];
      markData[0].push(markObject);

      if (split.length > 1) {
        markData[0].push((mark.Axis ? { [mark.Axis]: parseValue(split[1]) } : {}));
      }
    } else {
      markData.push(markObject);
    }

    return options;
  }, {});

  if (seriesOptions.markLine) {
    seriesOptions.markLine.label = {
      show: false,
      formatter: '{b}',
      position: 'insideStartBottom',
    };
    seriesOptions.markLine.emphasis = { label: { show: true } };
  }

  if (seriesOptions.markArea) {
    seriesOptions.markArea.label = { show: false };
    seriesOptions.markArea.emphasis = {
      label: {
        show: true,
        position: 'top',
        distance: 0,
      },
    };
  }

  return seriesOptions;
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
    const dataSheet = json[':names'].includes('data') ? 'data' : json[':names'].shift();
    const seriesSheet = json[':names'].filter((name) => name !== 'data').shift();
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

const barSeriesOptions = (chartType, hasOverride, firstDataset, colors, size, unit) => {
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
    colorBy: hasOverride ? 'data' : 'series',
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

const lineSeriesOptions = (series, firstDataset) => {
  const marks = processMarkData(series);

  return firstDataset.map((value, index) => {
    let options = {
      type: 'line',
      symbol: 'none',
      lineStyle: { width: 3 },
    };

    if (index === 0 && marks) {
      options = { ...options, ...marks };
    }

    return options;
  });
};

const areaSeriesOptions = (firstDataset) => (
  firstDataset.map(() => ({
    type: 'line',
    symbol: 'none',
    areaStyle: { opacity: 1 },
    stack: 'area',
  }))
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
  const hasOverride = Object.keys(data.data[0]).some((header) => header.toLowerCase() === 'color');
  const dataset = processDataset(data.data);
  const unit = data?.data[0]?.Unit || '';
  const source = dataset?.source;
  const firstDataset = (source && source[1]) ? source[1].slice() : [];
  const isBar = chartType === 'bar';
  const isColumn = chartType === 'column';

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
      formatter: isBar
        ? (params) => barTooltipFormatter(params, unit)
        : (params) => tooltipFormatter(params, unit),
      trigger: isBar ? 'item' : 'axis',
      axisPointer: { type: isColumn ? 'none' : 'line' },
    },
    xAxis: {
      type: isBar ? 'value' : 'category',
      axisLabel: { show: !isBar },
      axisTick: { show: !isBar },
      max: (value) => {
        if (!isBar) return null;
        // This adds extra space on xAxis so labels will fit
        const extraSpace = 1;
        return Math.ceil((value.max + (value.max * extraSpace)) / 10) * 10;
      },
      boundaryGap: isColumn,
    },
    yAxis: {
      type: isBar ? 'category' : 'value',
      axisLabel: {
        show: !isBar,
        formatter: (params) => `${params}${unit}`,
        padding: 0,
      },
      axisTick: { show: !isBar },
    },
    series: (() => {
      if (isBar || isColumn) return barSeriesOptions(chartType, hasOverride, firstDataset, colors, size, unit);
      if (chartType === 'line') return lineSeriesOptions(data.series, firstDataset);
      if (chartType === 'area') return areaSeriesOptions(firstDataset);
      return [];
    })(),
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

export const getColors = (authoredColor) => {
  const colorList = Object.values(colorPalette);

  if (
    isNullish(authoredColor)
    || !Object.hasOwn(colorPalette, authoredColor)
  ) return colorList;

  const colorIndex = colorList.indexOf(colorPalette[authoredColor]);

  return colorList.concat(colorList.splice(0, colorIndex));
};

export const getOverrideColors = (authoredColor, data) => data.map((row) => {
  const overrideColumn = Object.keys(row).find((key) => key.toLowerCase() === 'color');
  const overrideColor = row[overrideColumn];

  return colorPalette[overrideColor || authoredColor] || Object.values(colorPalette)[0];
});

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
    initChart(chartWrapper, chartType, data, colors, currentSize);
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
  const hasOverride = Object.keys(data?.data[0])?.some((header) => header.toLowerCase() === 'color');
  const colors = hasOverride ? getOverrideColors(authoredColor, data.data) : getColors(authoredColor);

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
