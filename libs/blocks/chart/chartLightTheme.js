// Custom Echarts Theme https://echarts.apache.org/en/theme-builder.html
export const LIGHT_SMALL = 'lightSmall';
export const LIGHT_LARGE = 'lightLarge';

export default (deviceSize) => {
  if (!window.echarts) return null;

  const SMALL = 'small';
  const MEDIUM = 'medium';
  const LARGE = 'large';
  let size = LARGE;
  let themeName = LIGHT_LARGE;

  if (deviceSize === SMALL || deviceSize === MEDIUM) {
    size = SMALL;
    themeName = LIGHT_SMALL;
  }

  // if themeName exists, we have already registered with options
  if (window.dataViz?.[themeName]) return themeName;

  const isLarge = size === LARGE;
  const axisColor = '#767676';
  const options = {
    textStyle: {
      fontFamily: 'Adobe Clean',
      fontSize: 16,
      fontWeight: 700,
    },
    legend: {
      icon: 'roundRect',
      itemHeight: isLarge ? 20 : 17,
      itemWidth: isLarge ? 20 : 17,
      itemGap: isLarge ? 24 : 14,
      top: 'bottom',
      left: 'left',
      padding: 0,
      textStyle: {
        padding: [0, 0, 0, isLarge ? 10 : 3],
        lineHeight: 1,
        height: isLarge ? 25 : 20,
      },
    },
    tooltip: {
      backgroundColor: '#000000',
      borderWidth: 0,
      padding: [10, 20],
      textStyle: {
        color: '#FFFFFF',
        fontWeight: 400,
      },
      borderRadius: 10,
      extraCssText: 'box-shadow: none;',
      position: (point, params, dom) => (
        // [x,y] x = 27px in from right of container y = 20px below container
        [point[0] - (dom.offsetWidth - 27), point[1] - (dom.offsetHeight + 20)]
      ),
    },
    grid: {
      top: 13,
      bottom: isLarge ? 60 : 90,
      left: 0,
      right: 20,
      containLabel: true,
    },
    categoryAxis: {
      axisLine: { show: false },
      axisLabel: {
        color: axisColor,
        fontSize: isLarge ? 16 : 14,
        fontWeight: 400,
        padding: 5,
      },
      axisTick: {
        alignWithLabel: true,
        length: 8,
        lineStyle: { color: axisColor },
      },
      boundaryGap: false,
    },
    valueAxis: {
      axisLine: { show: false },
      axisLabel: {
        color: axisColor,
        fontSize: isLarge ? 16 : 14,
        fontWeight: 400,
        padding: 5,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        length: 8,
        lineStyle: { color: axisColor },
      },
    },
  };

  window.echarts.registerTheme(themeName, options);
  if (window.dataViz) {
    window.dataViz[themeName] = true;
  } else {
    window.dataViz = { [themeName]: true };
  }

  return themeName;
};
