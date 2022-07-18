/**
 * Custom Echarts Theme - consonantLightLarge and consonantLightSmall
 *
 * Theme for light background 10/6/2021
 * Add to echarts:
 * const chart = echarts.init(element, name)
 *
 * https://echarts.apache.org/en/theme-builder.html
 */

import { isEmptyObject } from '../../utils/utils.js';

export default (deviceSize) => {
  if (isEmptyObject(window.echarts)) return null;

  const LARGE = 'large';
  const MEDIUM = 'medium';
  const SMALL = 'small';
  const axisColor = '#767676';
  let size = LARGE;
  let name = 'consonantLightLarge';

  if (deviceSize && (deviceSize === SMALL || deviceSize === MEDIUM)) {
    size = SMALL;
    name = 'consonantLightSmall';
  }

  const isLarge = size === LARGE;
  const options = {
    textStyle: {
      fontFamily: 'adobe-clean',
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
      top: 10,
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
    bar: {
      label: {
        show: true,
        position: 'right',
        textBorderColor: '#000',
        distance: 8,
        fontSize: isLarge ? 16 : 14,
      },
      itemStyle: { borderRadius: 3 },
      showBackground: true,
      backgroundStyle: {
        borderRadius: 3,
        opacity: 0.35,
      },
      barCategoryGap: 0,
      barGap: '33.3%',
    },
    line: {
      symbol: 'none',
      markLine: {
        label: {
          show: false,
          formatter: '{b}',
          position: 'insideStartBottom',
        },
        emphasis: { label: { show: true } },
      },
      markArea: {
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            position: 'top',
          },
        },
      },
    },
    aria: { enabled: true },
  };

  window.echarts.registerTheme(name, options);

  return name;
};
