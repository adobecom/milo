import { expect } from '@esm-bundle/chai';
import { buildDiffCounts } from '../../../../libs/blocks/preflight/checks/captureMetrics.js';

describe('captureMetrics diff counts', () => {
  it('sums content and metadata change counts from the diff result', () => {
    const diffResult = [{
      details: {
        content: { added: [1, 2], modified: [1], removed: [] },
        metadata: { added: [1], modified: [], removed: [1] },
      },
    }];
    expect(buildDiffCounts(diffResult)).to.deep.equal({
      diff_content_added_count: 2,
      diff_content_modified_count: 1,
      diff_content_removed_count: 0,
      diff_metadata_changed_count: 2,
    });
  });

  it('returns zeros when there is no diff detail', () => {
    expect(buildDiffCounts([{ details: { skipped: true } }])).to.deep.equal({
      diff_content_added_count: 0,
      diff_content_modified_count: 0,
      diff_content_removed_count: 0,
      diff_metadata_changed_count: 0,
    });
  });

  it('returns zeros when the diff results are empty or detail-less', () => {
    const allZeros = {
      diff_content_added_count: 0,
      diff_content_modified_count: 0,
      diff_content_removed_count: 0,
      diff_metadata_changed_count: 0,
    };
    expect(buildDiffCounts([])).to.deep.equal(allZeros);
    expect(buildDiffCounts([{ details: {} }])).to.deep.equal(allZeros);
  });
});
