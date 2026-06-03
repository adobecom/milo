import { createTag, loadStyle } from '../../utils/utils.js';
import infoTip from './info-tip.js';
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

// Await one panel's data and render it as soon as it arrives, so a slow or
// failing endpoint never blocks or blanks the other panels. Returns whether
// the data loaded (a sync render error still counts as loaded — that's a
// rendering bug, not a missing-data state).
async function fill(mount, label, dataPromise, renderFn) {
  try {
    const data = await dataPromise;
    clearLoading(mount);
    renderPanel(mount, label, () => renderFn(data));
    return true;
  } catch (e) {
    clearLoading(mount);
    mount.replaceChildren(createTag('div', { class: 'panel-error' }, `Couldn't load ${label}`));
    return false;
  }
}

export default async function init(block) {
  await new Promise((resolve) => { loadStyle(import.meta.url.replace('.js', '.css'), resolve); });

  const ctx = await resolveContext(block, { loadDaSdk });
  const client = createClient(ctx);
  await loadCharts();
  const charts = { makeChart };

  let currentInterval = DEFAULT_INTERVAL;

  function navigateTo(site) {
    window.location.hash = `#/project/${encodeURIComponent(site)}`;
  }

  function navigateHome() {
    window.location.hash = '#/';
  }

  function showDrilldown(site) {
    clearCharts();
    block.innerHTML = '';
    const tf = TIMEFRAMES.find((t) => t.interval === currentInterval) || TIMEFRAMES[1];
    renderProjectDrilldown(block, {
      site,
      client,
      charts,
      daContext: ctx.daContext,
      timeframe: { trendSince: tf.trendSince, interval: tf.interval },
      onBack: navigateHome,
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

    const rangeEl = createTag('span', { class: 'dashboard-range' });
    const updatedEl = createTag('span', { class: 'dashboard-updated' });
    const refreshBtn = createTag(
      'button',
      { type: 'button', class: 'refresh-btn', 'aria-label': 'Refresh' },
      'Refresh',
    );
    const ENV_LABELS = { da: 'DA', local: 'Local', standalone: 'Live' };
    const envBadge = createTag(
      'span',
      { class: `env-badge mode-${ctx.mode}`, title: ctx.base },
      ENV_LABELS[ctx.mode] || ctx.mode,
    );
    const meta = createTag('div', { class: 'dashboard-meta' }, [envBadge, rangeEl, updatedEl, refreshBtn]);

    const allTimeBody = createTag('div', { class: 'allstat-body' });
    const allTimeStat = createTag('div', { class: 'dashboard-allstat' }, [
      allTimeBody,
      infoTip('All-time count of live pages across consumers. Not affected by the Day / Week / Month toggle.'),
    ]);

    header.append(meta, allTimeStat, toggle);

    // Titled card: returns the outer panel plus the inner body the panel
    // renderer draws into (renderers call replaceChildren on the body, so the
    // title survives re-renders).
    const makePanel = (cls, title, info) => {
      const panel = createTag('div', { class: `panel ${cls}` });
      if (title) {
        const titleEl = createTag('h3', { class: 'panel-title' }, title);
        if (info) titleEl.append(infoTip(info));
        panel.append(titleEl);
      }
      const body = createTag('div', { class: 'panel-body' });
      panel.append(body);
      return { panel, body };
    };

    const grid = createTag('div', { class: 'dashboard-grid' });
    const kpiMount = createTag('div', { class: 'panel kpi' });
    const totals = makePanel('totals', 'Live pages by consumer');
    const gauge = makePanel('gauge-panel', 'Platform preflight health', 'Average preflight score (0–100) from the latest checks: performance, SEO, accessibility, assets.');
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

      // Fire every request up front, then let each panel render independently as
      // its own data arrives. Slow endpoints don't hold up fast ones, and a
      // single failure shows a per-panel error instead of blanking everything.
      const pOverview = client.get('/overview', { since: kpiSince });
      const pEds = client.get('/trends/eds', { since: trendSince, interval });
      const pPreflight = client.get('/trends/preflight', { since: trendSince, interval });
      const pProjects = client.get('/projects', { since: kpiSince });
      const pTotals = client.get('/totals');
      const pTestPages = client.getText('/test-pages', { since: trendSince, state: 'live', limit: 50 });

      rangeEl.textContent = formatRange(interval);

      // The gauge needs the category breakdown from the latest /trends/preflight
      // row, falling back to /overview's avg_health.
      const buildGaugeScores = (preflightRows, overview) => {
        const latest = (preflightRows && preflightRows[preflightRows.length - 1]) || {};
        return {
          avg_overall: latest.avg_overall ?? overview.current.avg_health,
          avg_performance: latest.avg_performance,
          avg_seo: latest.avg_seo,
          avg_accessibility: latest.avg_accessibility,
          avg_assets: latest.avg_assets,
        };
      };

      const results = await Promise.all([
        fill(kpiMount, 'metrics', pOverview, (overview) => renderKpiCards(kpiMount, overview, interval)),
        fill(totalsMount, 'totals', pTotals, (totalsData) => renderTotals(totalsMount, totalsData, allTimeBody)),
        fill(gaugeMount, 'health score', Promise.all([pPreflight, pOverview]), ([preflightRows, overview]) => renderHealthGauge(gaugeMount, buildGaugeScores(preflightRows, overview), charts)),
        fill(consumersMount, 'consumers', pProjects, (projectRows) => renderConsumerBars(consumersMount, projectRows || [], charts, navigateTo)),
        fill(alertsMount, 'alerts', Promise.all([pTestPages, pProjects]), ([testPagesCsv, projectRows]) => renderAlerts(alertsMount, { testPages: parseCsv(testPagesCsv), projects: projectRows || [] }, navigateTo)),
        fill(healthMount, 'health trend', pPreflight, (preflightRows) => renderHealthTrend(healthMount, preflightRows, charts)),
        fill(volumeMount, 'volume trend', pEds, (edsRows) => renderVolumeTrend(volumeMount, edsRows, charts)),
        fill(projectsMount, 'projects', pProjects, (projectRows) => renderProjectTable(projectsMount, projectRows || [], navigateTo)),
      ]);

      // Only fall back to a single top-level error if every panel failed
      // (e.g. an auth/sign-in problem affecting all requests).
      if (results.every((ok) => !ok)) {
        grid.replaceChildren(
          createTag(
            'div',
            { class: 'dashboard-error' },
            "Couldn't load dashboard data — check sign-in / access.",
          ),
        );
        return;
      }

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

  function route() {
    const match = window.location.hash.match(/^#\/project\/(.+)$/);
    if (match) return showDrilldown(decodeURIComponent(match[1]));
    return showOverview();
  }

  window.addEventListener('hashchange', route);
  await route();
}
