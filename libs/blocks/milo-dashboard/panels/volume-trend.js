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

function buildOption({ buckets, live, preview }) {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Publishes', 'Previews'] },
    xAxis: { type: 'category', data: buckets },
    yAxis: { type: 'value' },
    series: [
      { name: 'Publishes', type: 'line', areaStyle: {}, data: live },
      { name: 'Previews', type: 'line', areaStyle: {}, data: preview },
    ],
  };
}

export default function renderVolumeTrend(container, edsRows, charts) {
  container.replaceChildren();
  const chartEl = createTag('div', { class: 'volume-trend' });
  container.append(chartEl);
  charts.makeChart(chartEl, buildOption(pivotVolume(edsRows)));
}
