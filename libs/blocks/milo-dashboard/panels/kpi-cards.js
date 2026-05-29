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

function formatDelta(value, decimals) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatValue(Math.abs(value), decimals)}`;
}

export default function renderKpiCards(container, overview) {
  container.replaceChildren();
  const { current, delta } = overview;
  METRICS.forEach(({ key, label, decimals, higherIsBetter }) => {
    const value = Number(current[key]);
    const change = Number(delta[key]);
    const deltaEl = createTag('div', { class: 'kpi-delta' }, formatDelta(change, decimals));
    if (change === 0) {
      deltaEl.classList.add('flat');
    } else {
      const good = higherIsBetter ? change > 0 : change < 0;
      deltaEl.classList.add(good ? 'up' : 'down');
    }
    const card = createTag('div', { class: 'kpi-card' }, [
      createTag('div', { class: 'kpi-label' }, label),
      createTag('div', { class: 'kpi-value' }, formatValue(value, decimals)),
      deltaEl,
    ]);
    container.append(card);
  });
}
