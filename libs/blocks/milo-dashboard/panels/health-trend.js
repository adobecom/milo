import { createTag } from '../../../utils/utils.js';

const CATEGORIES = [
  { key: 'avg_overall', label: 'Overall' },
  { key: 'avg_performance', label: 'Performance' },
  { key: 'avg_accessibility', label: 'Accessibility' },
  { key: 'avg_seo', label: 'SEO' },
  { key: 'avg_assets', label: 'Assets' },
];

function coerce(value) {
  if (value === null || value === undefined) return null;
  return Number(value);
}

function buildOption(rows, category) {
  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: rows.map((row) => row.bucket) },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      name: category.label,
      type: 'line',
      data: rows.map((row) => coerce(row[category.key])),
    }],
  };
}

export default function renderHealthTrend(container, preflightRows, charts) {
  container.replaceChildren();
  const rows = preflightRows || [];
  const toggle = createTag('div', { class: 'health-trend-toggle' });
  const chartEl = createTag('div', { class: 'health-trend' });
  const buttons = [];

  const select = (category, button) => {
    buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
    charts.makeChart(chartEl, buildOption(rows, category));
  };

  CATEGORIES.forEach((category) => {
    const button = createTag('button', { type: 'button' }, category.label);
    button.addEventListener('click', () => select(category, button));
    toggle.append(button);
    buttons.push(button);
  });

  container.append(toggle, chartEl);
  select(CATEGORIES[0], buttons[0]);
}
