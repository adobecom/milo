import { createTag } from '../../../utils/utils.js';

const CATEGORIES = [
  { key: 'avg_performance', label: 'Performance' },
  { key: 'avg_accessibility', label: 'Accessibility' },
  { key: 'avg_seo', label: 'SEO' },
  { key: 'avg_assets', label: 'Assets' },
];

function toScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return num;
}

function clamp(value) {
  return Math.min(100, Math.max(0, value));
}

function bandColor(score) {
  if (score < 50) return '#d7373f';
  if (score < 80) return '#e68619';
  return '#268e6c';
}

// Rendered as a doughnut "progress ring" via the pie series: the bundled
// echarts.common build does NOT include the gauge chart, but pie is supported.
// The first slice is the score (band-coloured), the second the remainder.
function buildGaugeOption(value) {
  const v = clamp(value);
  return {
    title: {
      text: v.toFixed(1),
      subtext: 'Overall',
      left: 'center',
      top: '42%',
      textStyle: { fontSize: 30, fontWeight: 700, color: '#2c2c2c' },
      subtextStyle: { fontSize: 12, color: '#6e6e6e' },
    },
    series: [{
      type: 'pie',
      radius: ['64%', '88%'],
      center: ['50%', '54%'],
      startAngle: 90,
      silent: true,
      label: { show: false },
      labelLine: { show: false },
      data: [
        { value: v, itemStyle: { color: bandColor(v) } },
        { value: 100 - v, itemStyle: { color: '#ebebeb' } },
      ],
    }],
  };
}

export default function renderHealthGauge(container, scores, charts) {
  container.replaceChildren();

  const overall = Math.round(toScore(scores.avg_overall) * 10) / 10;
  const gaugeEl = createTag('div', { class: 'gauge' });
  container.append(gaugeEl);
  charts.makeChart(gaugeEl, buildGaugeOption(overall));

  const bars = createTag('div', { class: 'category-bars' });
  CATEGORIES.forEach(({ key, label }) => {
    const score = toScore(scores[key]);
    const fill = createTag('div', { class: 'category-fill', style: `width: ${clamp(score)}%; background: ${bandColor(score)};` });
    const row = createTag('div', { class: 'category-bar' }, [
      createTag('div', { class: 'category-label' }, label),
      createTag('div', { class: 'category-track' }, fill),
      createTag('div', { class: 'category-score' }, score.toFixed(1)),
    ]);
    bars.append(row);
  });
  container.append(bars);
}
