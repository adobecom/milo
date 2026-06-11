import { expect } from '@esm-bundle/chai';

const { parseUrls } = await import('../../../libs/blocks/project-tracking/project-tracking.js');

describe('project-tracking parseUrls', () => {
  it('splits on newlines, trims, drops empties', () => {
    expect(parseUrls('  a \n\n b \n')).to.deep.equal(['a', 'b']);
  });
  it('also splits on commas', () => {
    expect(parseUrls('a, b ,c')).to.deep.equal(['a', 'b', 'c']);
  });
  it('returns [] for empty input', () => {
    expect(parseUrls('')).to.deep.equal([]);
  });
  it('returns [] for whitespace/newline-only input', () => {
    expect(parseUrls('   \n ')).to.deep.equal([]);
  });
  it('returns [] for undefined', () => {
    expect(parseUrls(undefined)).to.deep.equal([]);
  });
});
