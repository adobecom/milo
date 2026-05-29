import { loadScript, getConfig } from '../../utils/utils.js';

let loading;

export function loadCharts() {
  if (window.echarts) return Promise.resolve(window.echarts);
  if (!loading) {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    loading = loadScript(`${base}/deps/echarts.common.min.js`).then(() => window.echarts);
  }
  return loading;
}

export function makeChart(el, option) {
  const chart = window.echarts.init(el, null, { renderer: 'svg' });
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
  return chart;
}
