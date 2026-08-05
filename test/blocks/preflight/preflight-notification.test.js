import { expect } from '@esm-bundle/chai';
import { getDiffChangeCount, diffNudgeMessage } from '../../../libs/utils/preflight-notification.js';

describe('preflight diff nudge', () => {
  it('counts all content + metadata changes from results', () => {
    const results = {
      runChecks: {
        diff: [{
          details: {
            content: { added: [1], modified: [1, 2], removed: [] },
            metadata: { added: [], modified: [1], removed: [] },
          },
        }],
      },
    };
    expect(getDiffChangeCount(results)).to.equal(4);
  });

  it('returns 0 when the diff details are absent', () => {
    expect(getDiffChangeCount({})).to.equal(0);
    expect(getDiffChangeCount({ runChecks: {} })).to.equal(0);
  });

  it('formats the nudge message with pluralization', () => {
    expect(diffNudgeMessage(1)).to.equal('1 change vs live — compare before publishing.');
    expect(diffNudgeMessage(3)).to.equal('3 changes vs live — compare before publishing.');
  });
});
