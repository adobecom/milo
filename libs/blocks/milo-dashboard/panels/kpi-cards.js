import { createTag } from '../../../utils/utils.js';

const METRICS = [
  { key: 'publishes', label: 'Publishes', decimals: 0, higherIsBetter: true },
  { key: 'previews', label: 'Previews', decimals: 0, higherIsBetter: true },
  { key: 'avg_health', label: 'Avg Health Score', decimals: 1, higherIsBetter: true },
  { key: 'active_projects', label: 'Active Projects', decimals: 0, higherIsBetter: true },
  { key: 'pages_below_70', label: 'Pages Below 70', decimals: 0, higherIsBetter: false },
];

function formatValue(value, decimals) {
  if (decimals > 0) return value.toFixed(decimals);
  return value.toLocaleString();
}

function percentChange(current, prior) {
  if (prior === 0) return null;
  return ((current - prior) / Math.abs(prior)) * 100;
}

function formatPercent(pct) {
  const rounded = Math.round(pct);
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}%`;
}

export default function renderKpiCards(container, overview, period = 'week') {
  container.replaceChildren();
  const { current, prior } = overview;
  METRICS.forEach(({ key, label, decimals, higherIsBetter }) => {
    const value = Number(current[key]);
    const pct = percentChange(Number(current[key]), Number(prior[key]));
    const deltaEl = createTag('div', { class: 'kpi-delta' }, pct === null ? '—' : formatPercent(pct));
    if (pct === null || Math.round(pct) === 0) {
      deltaEl.classList.add('flat');
    } else {
      const good = higherIsBetter ? pct > 0 : pct < 0;
      deltaEl.classList.add(good ? 'good' : 'bad'); // color = goodness
      deltaEl.classList.add(pct > 0 ? 'rose' : 'fell'); // arrow = numeric direction
    }
    const card = createTag('div', { class: 'kpi-card' }, [
      createTag('div', { class: 'kpi-label' }, label),
      createTag('div', { class: 'kpi-value' }, formatValue(value, decimals)),
      deltaEl,
      createTag('div', { class: 'kpi-period' }, `vs last ${period}`),
    ]);
    container.append(card);
  });
}
