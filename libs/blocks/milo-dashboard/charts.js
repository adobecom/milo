import { loadScript, getConfig } from '../../utils/utils.js';

let loading;
const instances = [];

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
  const onResize = () => chart.resize();
  window.addEventListener('resize', onResize);
  instances.push({ chart, onResize });
  return chart;
}

export function clearCharts() {
  instances.forEach(({ chart, onResize }) => {
    window.removeEventListener('resize', onResize);
    chart.dispose?.();
  });
  instances.length = 0;
}
