import { createTag, loadStyle } from '../../utils/utils.js';
import { resolveContext, createClient, loadDaSdk } from './api.js';
import { loadCharts, makeChart, clearCharts } from './charts.js';
import renderKpiCards from './panels/kpi-cards.js';
import renderHealthGauge from './panels/health-gauge.js';
import renderVolumeTrend from './panels/volume-trend.js';
import renderHealthTrend from './panels/health-trend.js';
import renderProjectTable from './panels/project-table.js';
import renderProjectDrilldown from './panels/project-drilldown.js';
import renderTraffic, { nullTrafficAdapter } from './panels/traffic.js';
import renderConsumerBars from './panels/consumer-bars.js';
import renderTotals from './panels/totals-strip.js';
import renderAlerts from './panels/alerts.js';

function parseCsv(text) {
  const lines = (text || '').trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    return headers.reduce((row, h, i) => { row[h] = (cells[i] || '').trim(); return row; }, {});
  });
}

// Each timeframe drives BOTH the KPI comparison window (kpiSince → current vs
// prior period in /overview) and the trend chart window/bucketing (trendSince
// split by `interval`). So toggling actually changes every number, and the KPI
// "vs last {interval}" label matches the math.
const TIMEFRAMES = [
  { label: 'Day', interval: 'day', kpiSince: '1d', trendSince: '30d' },
  { label: 'Week', interval: 'week', kpiSince: '7d', trendSince: '84d' },
  { label: 'Month', interval: 'month', kpiSince: '30d', trendSince: '365d' },
];
const DEFAULT_INTERVAL = 'week';

function showLoading(mount) {
  mount.setAttribute('aria-busy', 'true');
  mount.replaceChildren(createTag('div', { class: 'panel-skeleton' }));
}

function clearLoading(mount) {
  mount.removeAttribute('aria-busy');
}

const DAYS_BY_INTERVAL = { day: 1, week: 7, month: 30 };
const PERIOD_LABEL = { day: 'Today', week: 'Last 7 days', month: 'Last 30 days' };

function formatRange(interval) {
  const days = DAYS_BY_INTERVAL[interval] || 7;
  const end = new Date();
  const start = new Date(end - days * 86400000);
  const opts = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', opts);
  return `${PERIOD_LABEL[interval] || 'Last 7 days'} · ${startStr} – ${endStr}`;
}

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

  const ctx = await resolveContext(block, { loadDaSdk });
  const client = createClient(ctx);
  await loadCharts();
  const charts = { makeChart };

  let currentInterval = DEFAULT_INTERVAL;

  function showDrilldown(site) {
    clearCharts();
    block.innerHTML = '';
    renderProjectDrilldown(block, {
      site,
      client,
      charts,
      daContext: ctx.daContext,
      // eslint-disable-next-line no-use-before-define
      onBack: () => showOverview(),
    });
  }

  function showOverview() {
    clearCharts();
    block.innerHTML = '';

    const header = createTag('div', { class: 'dashboard-header' }, [
      createTag('h2', { class: 'dashboard-title' }, 'Milo World'),
    ]);
    const toggle = createTag('div', { class: 'timeframe-toggle' });
    const buttons = TIMEFRAMES.map(({ label, interval }) => {
      const active = interval === currentInterval;
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

    const rangeEl = createTag('span', { class: 'dashboard-range' });
    const updatedEl = createTag('span', { class: 'dashboard-updated' });
    const refreshBtn = createTag(
      'button',
      { type: 'button', class: 'refresh-btn', 'aria-label': 'Refresh' },
      'Refresh',
    );
    const meta = createTag('div', { class: 'dashboard-meta' }, [rangeEl, updatedEl, refreshBtn]);
    header.append(meta);

    // Titled card: returns the outer panel plus the inner body the panel
    // renderer draws into (renderers call replaceChildren on the body, so the
    // title survives re-renders).
    const makePanel = (cls, title) => {
      const panel = createTag('div', { class: `panel ${cls}` });
      if (title) panel.append(createTag('h3', { class: 'panel-title' }, title));
      const body = createTag('div', { class: 'panel-body' });
      panel.append(body);
      return { panel, body };
    };

    const grid = createTag('div', { class: 'dashboard-grid' });
    const kpiMount = createTag('div', { class: 'panel kpi' });
    const totals = makePanel('totals', 'Pages stored');
    const gauge = makePanel('gauge-panel', 'Platform preflight health');
    const consumers = makePanel('consumers', 'By consumer');
    const alerts = makePanel('alerts', 'Needs attention');
    const health = makePanel('health', 'Preflight health trend');
    const volume = makePanel('volume', 'Publish vs preview activity');
    const projects = makePanel('projects', 'Projects');
    const traffic = makePanel('traffic');
    grid.append(
      kpiMount,
      totals.panel,
      gauge.panel,
      consumers.panel,
      alerts.panel,
      health.panel,
      volume.panel,
      projects.panel,
      traffic.panel,
    );

    block.append(header, grid);

    const totalsMount = totals.body;
    const gaugeMount = gauge.body;
    const consumersMount = consumers.body;
    const alertsMount = alerts.body;
    const healthMount = health.body;
    const volumeMount = volume.body;
    const projectsMount = projects.body;
    const trafficMount = traffic.body;

    // Traffic is adapter-driven (stubbed null adapter for now) and needs no
    // backend data, so render it outside loadData — but keep error isolation.
    renderPanel(trafficMount, 'traffic', () => renderTraffic(trafficMount, nullTrafficAdapter, charts));

    async function loadData(interval) {
      currentInterval = interval;
      const tf = TIMEFRAMES.find((t) => t.interval === interval) || TIMEFRAMES[1];
      // KPI/overview/consumers compare a single period vs its prior (kpiSince);
      // trend charts span a longer window (trendSince) bucketed by `interval`.
      const { kpiSince, trendSince } = tf;
      // Dispose prior chart instances before re-rendering (avoids resize-listener leak).
      clearCharts();
      [
        kpiMount, totalsMount, gaugeMount, consumersMount,
        alertsMount, healthMount, volumeMount, projectsMount,
      ].forEach(showLoading);
      let overview;
      let edsRows;
      let preflightRows;
      let projectRows;
      let totalsData;
      let testPagesCsv;
      try {
        [
          overview, edsRows, preflightRows, projectRows, totalsData, testPagesCsv,
        ] = await Promise.all([
          client.get('/overview', { since: kpiSince }),
          client.get('/trends/eds', { since: trendSince, interval }),
          client.get('/trends/preflight', { since: trendSince, interval }),
          client.get('/projects', { since: kpiSince }),
          client.get('/totals'),
          client.getText('/test-pages', { since: trendSince, state: 'live', limit: 50 }),
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

      const testPages = parseCsv(testPagesCsv);

      renderPanel(kpiMount, 'metrics', () => renderKpiCards(kpiMount, overview, interval));
      renderPanel(totalsMount, 'totals', () => renderTotals(totalsMount, totalsData));
      renderPanel(gaugeMount, 'health score', () => renderHealthGauge(gaugeMount, gaugeScores, charts));
      renderPanel(consumersMount, 'consumers', () => renderConsumerBars(consumersMount, projectRows || [], charts, showDrilldown));
      renderPanel(alertsMount, 'alerts', () => renderAlerts(alertsMount, { testPages, projects: projectRows || [] }, showDrilldown));
      renderPanel(healthMount, 'health trend', () => renderHealthTrend(healthMount, preflightRows, charts));
      renderPanel(volumeMount, 'volume trend', () => renderVolumeTrend(volumeMount, edsRows, charts));
      renderPanel(projectsMount, 'projects', () => renderProjectTable(projectsMount, projectRows || [], showDrilldown));

      [
        kpiMount, totalsMount, gaugeMount, consumersMount,
        alertsMount, healthMount, volumeMount, projectsMount,
      ].forEach(clearLoading);

      rangeEl.textContent = formatRange(interval);
      updatedEl.textContent = `Updated ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }

    refreshBtn.addEventListener('click', () => { loadData(currentInterval); });

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

    return loadData(currentInterval);
  }

  await showOverview();
}
