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

const LINE_COLOR = '#3b63fb';

function shortDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildOption(rows, category) {
  return {
    color: [LINE_COLOR],
    grid: { top: 16, left: 12, right: 16, bottom: 8, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: rows.map((row) => row.bucket),
      boundaryGap: false,
      axisLabel: { formatter: shortDate, color: '#6e6e6e' },
      axisLine: { lineStyle: { color: '#e1e1e1' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#6e6e6e' },
    },
    series: [{
      name: category.label,
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{ offset: 0, color: `${LINE_COLOR}33` }, { offset: 1, color: `${LINE_COLOR}05` }],
        },
      },
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
