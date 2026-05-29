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

function buildGaugeOption(value) {
  return {
    series: [{
      type: 'gauge',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: 12,
          color: [[0.5, '#d7373f'], [0.8, '#e68619'], [1, '#268e6c']],
        },
      },
      data: [{ value }],
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
    const fill = createTag('div', { class: 'category-fill', style: `width: ${clamp(score)}%;` });
    const row = createTag('div', { class: 'category-bar' }, [
      createTag('div', { class: 'category-label' }, label),
      createTag('div', { class: 'category-track' }, fill),
      createTag('div', { class: 'category-score' }, score.toFixed(1)),
    ]);
    bars.append(row);
  });
  container.append(bars);
}
