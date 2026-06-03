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
  // A chart initialized before its container has a non-zero box (CSS not yet
  // applied) renders blank and never recovers on its own. Observe the box and
  // resize when it changes so the chart paints once it has real dimensions.
  let ro;
  if (window.ResizeObserver) {
    ro = new window.ResizeObserver(() => chart.resize());
    ro.observe(el);
  }
  instances.push({ chart, onResize, ro });
  return chart;
}

export function clearCharts() {
  instances.forEach(({ chart, onResize, ro }) => {
    window.removeEventListener('resize', onResize);
    ro?.disconnect();
    chart.dispose?.();
  });
  instances.length = 0;
}
