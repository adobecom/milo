import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import { countIssues, getIssueCounts } from '../../../../libs/blocks/preflight/checks/issueCounts.js';

describe('Preflight issue counts', () => {
  it('counts each tab the way its panel lists issues', () => {
    expect(countIssues({
      structure: [{ status: 'fail', severity: 'critical' }, { status: 'limbo' }],
      seo: [{ status: 'fail', severity: 'warning' }, { status: 'pass' }],
      merch: [{ status: 'fail', details: { unpublished: [1, 2] } }],
      accessibility: [{ status: 'fail', details: { issuesCount: 4 } }],
      performance: [{ status: 'fail' }, { status: 'limbo' }],
      assets: [{ details: { criticalAssetFailures: [1], warningAssetFailures: [1, 2] } }],
    }, 3)).to.deep.equal({
      General: { errors: 4, warnings: 1 },
      SEO: { errors: 0, warnings: 1 },
      'M@S': { errors: 2, warnings: 0 },
      Accessibility: { errors: 4, warnings: 0 },
      Performance: { errors: 1, warnings: 1 },
      Assets: { errors: 1, warnings: 2 },
    });
  });

  it('counts nothing for missing, passing, or detail-less categories', () => {
    const empty = Object.fromEntries(['General', 'SEO', 'M@S', 'Accessibility', 'Performance', 'Assets']
      .map((tab) => [tab, { errors: 0, warnings: 0 }]));
    expect(countIssues({})).to.deep.equal(empty);
    expect(countIssues({
      accessibility: [{ status: 'pass', details: { issuesCount: 4 } }],
      merch: [{ status: 'fail' }],
      assets: [{}],
    })).to.deep.equal(empty);
  });
});

describe('getIssueCounts', () => {
  const draft = '<div><h1>Draft</h1><p>Real copy</p></div>';
  const linkServiceDown = { ok: false, status: 404 };
  let linkServiceConfig;
  let main;

  const seoErrors = async (html) => {
    main.innerHTML = html;
    const counts = await getIssueCounts({ useCache: false, merchDelayMs: 0 });
    return counts.SEO.errors;
  };

  beforeEach(() => {
    setConfig({ codeRoot: '/libs', georouting: { enabled: 'off' }, footerReady: true });
    linkServiceConfig = linkServiceDown;
    sinon.stub(window, 'fetch').callsFake(async (url) => (String(url).includes('/.milo/config.json')
      ? linkServiceConfig
      : { ok: true, status: 200, json: async () => ({ data: [] }), text: async () => '' }));
    main = document.createElement('main');
    document.body.append(main);
  });

  afterEach(() => {
    sinon.restore();
    main.remove();
  });

  it('counts SEO checks that finish after the run, like placeholder text', async () => {
    const clean = await seoErrors(draft);
    const placeholder = await seoErrors('<div><h1>Draft</h1><p>Lorem ipsum dolor</p></div>');
    expect(placeholder - clean).to.equal(1);
  });

  it('counts an SEO check that throws as an issue, like the SEO panel shows it', async () => {
    const linksChecked = await seoErrors(draft);
    linkServiceConfig = { ok: true, status: 200, json: async () => ({}) };
    const linksThrew = await seoErrors(draft);
    expect(linksThrew - linksChecked).to.equal(1);
  });

  it('stops waiting for a hung link service and counts its check as a warning', async () => {
    window.fetch.callsFake(async (url) => {
      if (String(url).includes('spidy')) return new Promise(() => {});
      return String(url).includes('/.milo/config.json')
        ? linkServiceDown
        : { ok: true, status: 200, json: async () => ({ data: [] }), text: async () => '' };
    });
    main.innerHTML = draft;
    const counts = await getIssueCounts({
      useCache: false,
      merchDelayMs: 0,
      slowCheckTimeoutMs: 200,
    });
    expect(counts.SEO.warnings).to.equal(1);
  });
});
