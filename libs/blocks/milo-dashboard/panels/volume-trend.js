import { createTag } from '../../../utils/utils.js';

export function pivotVolume(edsRows) {
  const rows = edsRows || [];
  const buckets = [...new Set(rows.map((row) => row.bucket))].sort();
  const index = new Map(buckets.map((bucket, i) => [bucket, i]));
  const live = buckets.map(() => 0);
  const preview = buckets.map(() => 0);
  rows.forEach(({ bucket, route, amount }) => {
    const i = index.get(bucket);
    if (i === undefined) return;
    const value = Number(amount) || 0;
    if (route === 'live') live[i] += value;
    else if (route === 'preview') preview[i] += value;
  });
  return { buckets, live, preview };
}

const PUBLISH_COLOR = '#3b63fb';
const PREVIEW_COLOR = '#12805c';

function shortDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function area(color) {
  return {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{ offset: 0, color: `${color}40` }, { offset: 1, color: `${color}05` }],
    },
  };
}

function buildOption({ buckets, live, preview }) {
  return {
    color: [PUBLISH_COLOR, PREVIEW_COLOR],
    grid: { top: 48, left: 12, right: 16, bottom: 8, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Publishes', 'Previews'], top: 8, icon: 'roundRect', itemWidth: 12, itemHeight: 12 },
    xAxis: {
      type: 'category',
      data: buckets,
      boundaryGap: false,
      axisLabel: { formatter: shortDate, color: '#6e6e6e' },
      axisLine: { lineStyle: { color: '#e1e1e1' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#6e6e6e' },
    },
    series: [
      {
        name: 'Publishes', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2 }, areaStyle: area(PUBLISH_COLOR), data: live,
      },
      {
        name: 'Previews', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2 }, areaStyle: area(PREVIEW_COLOR), data: preview,
      },
    ],
  };
}

export default function renderVolumeTrend(container, edsRows, charts) {
  container.replaceChildren();
  const chartEl = createTag('div', { class: 'volume-trend' });
  container.append(chartEl);
  charts.makeChart(chartEl, buildOption(pivotVolume(edsRows)));
}
