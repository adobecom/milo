import { createTag, loadStyle } from '../../utils/utils.js';
import { readConfig, resolveContext, createClient, loadDaSdk } from './api.js';
import { loadCharts, makeChart, clearCharts } from './charts.js';
import renderKpiCards from './panels/kpi-cards.js';
import renderHealthGauge from './panels/health-gauge.js';
import renderVolumeTrend from './panels/volume-trend.js';
import renderHealthTrend from './panels/health-trend.js';
import renderProjectTable from './panels/project-table.js';
import renderProjectDrilldown from './panels/project-drilldown.js';
import renderTraffic, { nullTrafficAdapter } from './panels/traffic.js';

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
    const gauge = makePanel('gauge-panel', 'Overall health');
    const volume = makePanel('volume', 'Publish vs preview activity');
    const health = makePanel('health', 'Preflight health trend');
    const projects = makePanel('projects', 'Projects');
    const traffic = makePanel('traffic');
    grid.append(kpiMount, gauge.panel, volume.panel, health.panel, projects.panel, traffic.panel);

    block.append(header, grid);

    const gaugeMount = gauge.body;
    const volumeMount = volume.body;
    const healthMount = health.body;
    const projectsMount = projects.body;
    const trafficMount = traffic.body;

    // Traffic is adapter-driven (stubbed null adapter for now) and needs no
    // backend data, so render it outside loadData — but keep error isolation.
    renderPanel(trafficMount, 'traffic', () => renderTraffic(trafficMount, nullTrafficAdapter, charts));

    async function loadData(interval) {
      currentInterval = interval;
      // Dispose prior chart instances before re-rendering (avoids resize-listener leak).
      clearCharts();
      let overview;
      let edsRows;
      let preflightRows;
      let projectRows;
      try {
        [overview, edsRows, preflightRows, projectRows] = await Promise.all([
          client.get('/overview', { since }),
          client.get('/trends/eds', { since, interval }),
          client.get('/trends/preflight', { since, interval }),
          client.get('/projects', { since }),
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

      renderPanel(kpiMount, 'metrics', () => renderKpiCards(kpiMount, overview, interval));
      renderPanel(gaugeMount, 'health score', () => renderHealthGauge(gaugeMount, gaugeScores, charts));
      renderPanel(volumeMount, 'volume trend', () => renderVolumeTrend(volumeMount, edsRows, charts));
      renderPanel(healthMount, 'health trend', () => renderHealthTrend(healthMount, preflightRows, charts));
      renderPanel(projectsMount, 'projects', () => renderProjectTable(projectsMount, projectRows || [], showDrilldown));
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

    return loadData(currentInterval);
  }

  await showOverview();
}
