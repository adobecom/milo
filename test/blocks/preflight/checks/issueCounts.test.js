import { expect } from '@esm-bundle/chai';
import { countIssues } from '../../../../libs/blocks/preflight/checks/issueCounts.js';

const zero = { errors: 0, warnings: 0 };

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
      .map((tab) => [tab, zero]));
    expect(countIssues({})).to.deep.equal(empty);
    expect(countIssues({
      accessibility: [{ status: 'pass', details: { issuesCount: 4 } }],
      merch: [{ status: 'fail' }],
      assets: [{}],
    })).to.deep.equal(empty);
  });
});
