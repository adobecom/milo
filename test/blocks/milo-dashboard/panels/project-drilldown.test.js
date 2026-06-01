import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: renderProjectDrilldown } = await import('../../../../libs/blocks/milo-dashboard/panels/project-drilldown.js');

const PREFLIGHT_TRENDS = [
  {
    bucket: '2026-05-01', avg_overall: '80.00', avg_performance: 90, avg_seo: 70, avg_accessibility: 50, avg_assets: 60,
  },
];
const PREFLIGHT_LOGS = {
  data: [{
    url: 'https://main--milo--adobecom.aem.live/products/x.html',
    performance_score: '42.00',
    project_key: 'milo',
    created_at: '2026-05-01',
  }],
};

describe('milo-dashboard project-drilldown', () => {
  let container;
  let charts;

  beforeEach(() => {
    container = document.createElement('div');
    charts = { makeChart: sinon.spy() };
  });

  function makeClient() {
    return {
      get: sinon.stub().callsFake((path) => {
        if (path === '/trends/preflight') return Promise.resolve(PREFLIGHT_TRENDS);
        if (path === '/preflight-logs') return Promise.resolve(PREFLIGHT_LOGS);
        return Promise.resolve({});
      }),
    };
  }

  it('renders back button that calls onBack on click', async () => {
    const onBack = sinon.spy();
    await renderProjectDrilldown(container, { site: 'milo', client: makeClient(), charts, onBack });
    const back = container.querySelector('.drilldown-back');
    expect(back).to.exist;
    back.click();
    expect(onBack.calledOnce).to.equal(true);
  });

  it('fetches trends with project=site and logs with projectKey=site', async () => {
    const client = makeClient();
    await renderProjectDrilldown(container, { site: 'milo', client, charts, onBack: () => {} });
    const trendsCall = client.get.getCalls().find((c) => c.args[0] === '/trends/preflight');
    expect(trendsCall.args[1].project).to.equal('milo');
    const logsCall = client.get.getCalls().find((c) => c.args[0] === '/preflight-logs');
    expect(logsCall.args[1].projectKey).to.equal('milo');
  });

  it('uses the passed timeframe for the trends fetch', async () => {
    const client = makeClient();
    const timeframe = { trendSince: '365d', interval: 'month' };
    const onBack = () => {};
    await renderProjectDrilldown(container, { site: 'milo', client, charts, onBack, timeframe });
    const trendsCall = client.get.getCalls().find((c) => c.args[0] === '/trends/preflight');
    expect(trendsCall.args[1].interval).to.equal('month');
    expect(trendsCall.args[1].since).to.equal('365d');
    expect(trendsCall.args[1].project).to.equal('milo');
  });

  it('defaults the trends timeframe to week/84d when omitted', async () => {
    const client = makeClient();
    await renderProjectDrilldown(container, { site: 'milo', client, charts, onBack: () => {} });
    const trendsCall = client.get.getCalls().find((c) => c.args[0] === '/trends/preflight');
    expect(trendsCall.args[1].interval).to.equal('week');
    expect(trendsCall.args[1].since).to.equal('84d');
  });

  it('populates health and worst mounts', async () => {
    await renderProjectDrilldown(container, { site: 'milo', client: makeClient(), charts, onBack: () => {} });
    expect(container.querySelector('.drilldown-health .health-trend-toggle')).to.exist;
    expect(container.querySelector('.drilldown-worst table.worst-pages')).to.exist;
  });

  it('shows dashboard-error on fetch failure', async () => {
    const client = { get: sinon.stub().rejects(new Error('network')) };
    await renderProjectDrilldown(container, { site: 'milo', client, charts, onBack: () => {} });
    expect(container.querySelector('.dashboard-error')).to.exist;
  });
});
