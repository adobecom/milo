import { createTag, loadStyle } from '../../utils/utils.js';
import { readConfig, resolveContext, createClient, loadDaSdk } from './api.js';
import { loadCharts, makeChart, clearCharts } from './charts.js';
import renderKpiCards from './panels/kpi-cards.js';
import renderHealthGauge from './panels/health-gauge.js';
import renderVolumeTrend from './panels/volume-trend.js';
import renderHealthTrend from './panels/health-trend.js';

const TIMEFRAMES = [
  { label: 'Day', interval: 'day' },
  { label: 'Week', interval: 'week' },
  { label: 'Month', interval: 'month' },
];
const DEFAULT_INTERVAL = 'week';

function renderPanel(mount, label, fn) {
  try {
    fn();
  } catch (e) {
    mount.replaceChildren(
      createTag('div', { class: 'panel-error' }, `Couldn't load ${label}`),
    );
  }
}

export default async function init(block) {
  loadStyle(import.meta.url);

  const cfg = readConfig(block);
  const since = cfg.since || '30d';
  const ctx = await resolveContext(block, { loadDaSdk });
  const client = createClient(ctx);
  await loadCharts();
  const charts = { makeChart };

  block.innerHTML = '';

  const header = createTag('div', { class: 'dashboard-header' }, [
    createTag('h2', { class: 'dashboard-title' }, 'Milo World'),
  ]);
  const toggle = createTag('div', { class: 'timeframe-toggle' });
  const buttons = TIMEFRAMES.map(({ label, interval }) => {
    const active = interval === DEFAULT_INTERVAL;
    const btn = createTag(
      'button',
      { type: 'button', 'aria-pressed': active ? 'true' : 'false' },
      label,
    );
    if (active) btn.classList.add('active');
    btn.dataset.interval = interval;
    return btn;
  });
  toggle.append(...buttons);
  header.append(toggle);

  const grid = createTag('div', { class: 'dashboard-grid' });
  const kpiMount = createTag('div', { class: 'panel kpi' });
  const gaugeMount = createTag('div', { class: 'panel gauge-panel' });
  const volumeMount = createTag('div', { class: 'panel volume' });
  const healthMount = createTag('div', { class: 'panel health' });
  grid.append(kpiMount, gaugeMount, volumeMount, healthMount);

  block.append(header, grid);

  async function loadData(interval) {
    // Dispose prior chart instances before re-rendering (avoids resize-listener leak).
    clearCharts();
    let overview;
    let edsRows;
    let preflightRows;
    try {
      [overview, edsRows, preflightRows] = await Promise.all([
        client.get('/overview', { since }),
        client.get('/trends/eds', { since, interval }),
        client.get('/trends/preflight', { since, interval }),
      ]);
    } catch (e) {
      grid.replaceChildren(
        createTag(
          'div',
          { class: 'dashboard-error' },
          "Couldn't load dashboard data — check sign-in / access.",
        ),
      );
      return;
    }

    // /overview current has avg_health but NOT the category breakdown the gauge needs.
    // Source gauge scores from the latest /trends/preflight row; fall back to avg_health.
    const latest = (preflightRows && preflightRows[preflightRows.length - 1]) || {};
    const gaugeScores = {
      avg_overall: latest.avg_overall ?? overview.current.avg_health,
      avg_performance: latest.avg_performance,
      avg_seo: latest.avg_seo,
      avg_accessibility: latest.avg_accessibility,
      avg_assets: latest.avg_assets,
    };

    renderPanel(kpiMount, 'metrics', () => renderKpiCards(kpiMount, overview));
    renderPanel(gaugeMount, 'health score', () => renderHealthGauge(gaugeMount, gaugeScores, charts));
    renderPanel(volumeMount, 'volume trend', () => renderVolumeTrend(volumeMount, edsRows, charts));
    renderPanel(healthMount, 'health trend', () => renderHealthTrend(healthMount, preflightRows, charts));
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      loadData(btn.dataset.interval);
    });
  });

  await loadData(DEFAULT_INTERVAL);
}
