import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: init } = await import('../../../libs/blocks/milo-dashboard/milo-dashboard.js');

const OVERVIEW = {
  since: '30d',
  current: { publishes: 100, previews: 200, avg_health: '80.00', active_projects: 5, pages_below_70: 12 },
  prior: { publishes: 80, previews: 150, avg_health: '83.00', active_projects: 5, pages_below_70: 16 },
  delta: { publishes: 20, previews: 50, avg_health: -3, active_projects: 0, pages_below_70: -4 },
};
const EDS = [
  { bucket: '2026-05-01', route: 'live', amount: 10 },
  { bucket: '2026-05-01', route: 'preview', amount: 5 },
];
const PREFLIGHT = [
  {
    bucket: '2026-05-01', avg_overall: '80.00', avg_performance: 90, avg_seo: 70, avg_accessibility: 50, avg_assets: 60, checks: 30,
  },
];
const PROJECTS = [
  { site: 'milo', publishes: 50, previews: 20, avg_health: '80.00', checks: 30 },
  { site: 'bacom', publishes: 30, previews: 10, avg_health: '70.00', checks: 15 },
];
const PREFLIGHT_LOGS = {
  data: [{
    url: 'https://main--milo--adobecom.aem.live/products/x.html',
    performance_score: '42.00',
    project_key: 'milo',
    created_at: '2026-05-01',
  }],
};
const TOTALS = { total: 12840, perSite: [{ site: 'milo', pages: 5400 }] };
const TEST_PAGES_CSV = [
  'path,site,state,signal,last_indexed_at',
  '/drafts/x.html,milo,live,path,2026-05-20',
].join('\n');

function stubFetch(fake) {
  return sinon.stub(window, 'fetch').callsFake(fake);
}

function routeFetch(url) {
  const { pathname } = new URL(url);
  if (pathname.endsWith('/test-pages')) {
    return Promise.resolve({ ok: true, text: () => Promise.resolve(TEST_PAGES_CSV) });
  }
  let body;
  if (pathname.endsWith('/overview')) body = OVERVIEW;
  else if (pathname.endsWith('/trends/eds')) body = EDS;
  else if (pathname.endsWith('/trends/preflight')) body = PREFLIGHT;
  else if (pathname.endsWith('/projects')) body = PROJECTS;
  else if (pathname.endsWith('/totals')) body = TOTALS;
  else if (pathname.endsWith('/preflight-logs')) body = PREFLIGHT_LOGS;
  else body = {};
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}

describe('milo-dashboard', () => {
  let fetchStub;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    window.echarts = {
      init: () => ({ setOption() {}, resize() {}, dispose() {}, on() {} }),
      getInstanceByDom: () => undefined,
    };
  });

  afterEach(() => {
    sinon.restore();
    delete window.echarts;
    window.location.hash = '';
  });

  it('renders header with timeframe toggle, Week active by default', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelector('.dashboard-header')).to.exist;
    expect(block.querySelector('.dashboard-grid')).to.exist;
    const buttons = block.querySelectorAll('.timeframe-toggle button');
    expect(buttons.length).to.equal(3);
    const week = [...buttons].find((b) => b.textContent === 'Week');
    expect(week.getAttribute('aria-pressed')).to.equal('true');
  });

  it('renders all panels after init', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelectorAll('.kpi-card').length).to.equal(5);
    expect(block.querySelector('.gauge')).to.exist;
    expect(block.querySelector('.volume-trend')).to.exist;
    expect(block.querySelector('.health-trend')).to.exist;
  });

  it('renders the v2 panels (totals, consumer bars, alerts) after init', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelector('.totals-total')).to.exist;
    expect(block.querySelector('.consumer-bars')).to.exist;
    expect(block.querySelector('.alerts-list') || block.querySelector('.alerts-empty')).to.exist;
  });

  it('mounts the traffic panel empty state after init', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelector('.traffic-panel')).to.exist;
    expect(block.querySelector('.traffic-empty')).to.exist;
  });

  it('fetches all three endpoints with interval=week', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const urls = fetchStub.getCalls().map((c) => `${c.args[0]}`);
    expect(urls.some((u) => u.includes('/overview'))).to.be.true;
    expect(urls.some((u) => u.includes('/trends/eds') && u.includes('interval=week'))).to.be.true;
    expect(urls.some((u) => u.includes('/trends/preflight') && u.includes('interval=week'))).to.be.true;
  });

  it('re-fetches trends with interval=day when Day clicked', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const day = [...block.querySelectorAll('.timeframe-toggle button')].find((b) => b.textContent === 'Day');
    day.click();
    await Promise.resolve();
    await new Promise((r) => { setTimeout(r, 0); });

    const urls = fetchStub.getCalls().map((c) => `${c.args[0]}`);
    expect(urls.some((u) => u.includes('/trends/eds') && u.includes('interval=day'))).to.be.true;
    expect(day.getAttribute('aria-pressed')).to.equal('true');
  });

  it('renders the project table after init', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelector('.project-table')).to.exist;
    expect(block.querySelectorAll('.project-row').length).to.equal(2);
  });

  it('switches to drill-in on project row click and back restores overview', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const row = block.querySelector('.project-row');
    await new Promise((resolve) => {
      window.addEventListener('hashchange', resolve, { once: true });
      row.click();
    });
    await new Promise((r) => { setTimeout(r, 0); });

    expect(block.querySelector('.drilldown-back')).to.exist;
    expect(block.querySelector('.dashboard-grid')).to.equal(null);
    expect(window.location.hash).to.include('project/');

    await new Promise((resolve) => {
      window.addEventListener('hashchange', resolve, { once: true });
      block.querySelector('.drilldown-back').click();
    });
    await new Promise((r) => { setTimeout(r, 0); });

    expect(block.querySelector('.dashboard-grid')).to.exist;
    expect(block.querySelector('.drilldown-back')).to.equal(null);
  });

  it('deep-links to a project drill-in when the hash is set before init', async () => {
    fetchStub = stubFetch(routeFetch);
    window.location.hash = '#/project/milo';
    const block = document.querySelector('.milo-dashboard');
    await init(block);
    await new Promise((r) => { setTimeout(r, 0); });

    const title = block.querySelector('.drilldown-title');
    expect(title).to.exist;
    expect(title.textContent).to.include('milo');
    expect(block.querySelector('.dashboard-grid')).to.equal(null);
  });

  it('renders a date range with an en dash and month abbreviation', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const range = block.querySelector('.dashboard-range');
    expect(range).to.exist;
    expect(range.textContent).to.include('–');
    expect(range.textContent).to.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
  });

  it('renders a data-source env badge after init', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const badge = block.querySelector('.env-badge');
    expect(badge).to.exist;
    expect(['Local', 'Live', 'DA']).to.include(badge.textContent);
  });

  it('renders an updated timestamp', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const updated = block.querySelector('.dashboard-updated');
    expect(updated).to.exist;
    expect(updated.textContent.startsWith('Updated')).to.be.true;
  });

  it('refetches /overview when the refresh button is clicked', async () => {
    fetchStub = stubFetch(routeFetch);
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    const countOverview = () => fetchStub.getCalls()
      .filter((c) => `${c.args[0]}`.includes('/overview')).length;
    const before = countOverview();

    const refresh = block.querySelector('.refresh-btn');
    expect(refresh).to.exist;
    refresh.click();
    await Promise.resolve();
    await new Promise((r) => { setTimeout(r, 0); });

    expect(countOverview()).to.equal(before + 1);
  });

  it('shows a top-level error when fetch fails', async () => {
    fetchStub = stubFetch(() => Promise.reject(new Error('network')));
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelector('.dashboard-error')).to.exist;
  });
});
