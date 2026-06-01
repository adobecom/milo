import { createTag } from '../../../utils/utils.js';

const METRICS = [
  { key: 'publishes', label: 'Publishes' },
  { key: 'previews', label: 'Previews' },
  { key: 'avg_health', label: 'Health' },
];

const T1 = ['cc', 'dc', 'express', 'bacom', 'blog'];
const ACCENT_COLOR = '#3b63fb';

function isT1(site) {
  const name = String(site || '').toLowerCase();
  return T1.some((token) => name.includes(token));
}

function healthColor(value) {
  if (value < 50) return '#d31510';
  if (value < 80) return '#bb6f00';
  return '#12805c';
}

function metricValue(row, metric) {
  if (metric.key === 'avg_health') {
    const raw = row.avg_health === null || row.avg_health === undefined
      ? 0 : Number(row.avg_health);
    return Math.min(100, Math.max(0, raw));
  }
  return Number(row[metric.key]) || 0;
}

function filterRows(rows, t1Only) {
  if (!t1Only) return rows;
  const filtered = rows.filter((row) => isT1(row.site));
  return filtered.length ? filtered : rows;
}

function buildOption(rows, metric) {
  const sorted = [...rows].sort(
    (a, b) => metricValue(b, metric) - metricValue(a, metric),
  );
  const isHealth = metric.key === 'avg_health';
  return {
    grid: { top: 16, left: 12, right: 16, bottom: 8, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: sorted.map((row) => row.site),
      axisLabel: { color: '#6e6e6e', rotate: sorted.length > 8 ? 45 : 0 },
      axisLine: { lineStyle: { color: '#e1e1e1' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#6e6e6e' },
    },
    series: [{
      name: metric.label,
      type: 'bar',
      data: sorted.map((row) => {
        const value = metricValue(row, metric);
        const color = isHealth ? healthColor(value) : ACCENT_COLOR;
        return { value, itemStyle: { color } };
      }),
    }],
  };
}

export default function renderConsumerBars(container, projectRows, charts, onSelect) {
  container.replaceChildren();
  const rows = projectRows || [];
  const controls = createTag('div', { class: 'consumer-bars-controls' });
  const chartEl = createTag('div', { class: 'consumer-bars' });
  const buttons = [];
  let selected = METRICS[0];
  let t1Only = true;

  const render = () => {
    const chart = charts.makeChart(chartEl, buildOption(filterRows(rows, t1Only), selected));
    if (onSelect && chart) {
      chart.on('click', (params) => { if (params && params.name) onSelect(params.name); });
    }
  };

  const select = (metric, button) => {
    selected = metric;
    buttons.forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    render();
  };

  METRICS.forEach((metric) => {
    const button = createTag('button', { type: 'button', 'aria-pressed': 'false' }, metric.label);
    button.addEventListener('click', () => select(metric, button));
    controls.append(button);
    buttons.push(button);
  });

  const t1Toggle = createTag(
    'button',
    { type: 'button', class: 't1-toggle', 'aria-pressed': 'true' },
    'T1 only',
  );
  t1Toggle.addEventListener('click', () => {
    t1Only = !t1Only;
    t1Toggle.setAttribute('aria-pressed', String(t1Only));
    render();
  });
  controls.append(t1Toggle);

  container.append(controls, chartEl);
  buttons[0].classList.add('active');
  buttons[0].setAttribute('aria-pressed', 'true');
  render();
}
