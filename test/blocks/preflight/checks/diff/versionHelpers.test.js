import { expect } from '@esm-bundle/chai';
import { parseMain, isConfirmedUnpublished } from '../../../../../libs/blocks/preflight/checks/diff/versionHelpers.js';

describe('preflight versionHelpers', () => {
  it('parseMain returns the main element', () => {
    const main = parseMain('<main><p>x</p></main>');
    expect(main.tagName).to.equal('MAIN');
    expect(main.querySelector('p').textContent).to.equal('x');
  });

  it('isConfirmedUnpublished is true when status is set with no live.lastModified', () => {
    expect(isConfirmedUnpublished({ status: { live: {} } })).to.equal(true);
  });

  it('isConfirmedUnpublished is false when status is null', () => {
    expect(isConfirmedUnpublished({ status: null })).to.equal(false);
  });

  it('isConfirmedUnpublished is false when status.live.lastModified exists', () => {
    expect(isConfirmedUnpublished({ status: { live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' } } })).to.equal(false);
  });
});
