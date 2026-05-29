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

function stubFetch(fake) {
  return sinon.stub(window, 'fetch').callsFake(fake);
}

function routeFetch(url) {
  const { pathname } = new URL(url);
  let body;
  if (pathname.endsWith('/overview')) body = OVERVIEW;
  else if (pathname.endsWith('/trends/eds')) body = EDS;
  else if (pathname.endsWith('/trends/preflight')) body = PREFLIGHT;
  else body = {};
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}

describe('milo-dashboard', () => {
  let fetchStub;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    window.echarts = {
      init: () => ({ setOption() {}, resize() {}, dispose() {} }),
      getInstanceByDom: () => undefined,
    };
  });

  afterEach(() => {
    sinon.restore();
    delete window.echarts;
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

  it('shows a top-level error when fetch fails', async () => {
    fetchStub = stubFetch(() => Promise.reject(new Error('network')));
    const block = document.querySelector('.milo-dashboard');
    await init(block);

    expect(block.querySelector('.dashboard-error')).to.exist;
  });
});
