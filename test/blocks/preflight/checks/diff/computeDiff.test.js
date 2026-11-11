import { expect } from '@esm-bundle/chai';
import computeDiff, { DIFF_STATE } from '../../../../../libs/blocks/preflight/checks/diff/computeDiff.js';

const PREVIEW = '<main><div><p>hello</p><p>new line</p></div></main>';
const LIVE = '<main><div><p>hello</p></div></main>';

describe('preflight computeDiff', () => {
  it('returns SKIPPED without diffing when versions are skipped', () => {
    const diff = computeDiff({ skipped: true });
    expect(diff.state).to.equal(DIFF_STATE.SKIPPED);
    expect(diff.content).to.be.undefined;
  });

  it('returns NO_PREVIEW when the preview failed to load', () => {
    const diff = computeDiff({ preview: null, liveStatus: 'ok' });
    expect(diff.state).to.equal(DIFF_STATE.NO_PREVIEW);
  });

  it('returns READY with the content diff when both sides load', () => {
    const diff = computeDiff({
      preview: { html: PREVIEW },
      live: { html: LIVE },
      liveStatus: 'ok',
      status: {},
    });
    expect(diff.state).to.equal(DIFF_STATE.READY);
    expect(diff.content.added).to.have.length(1);
  });

  it('returns NEW_PAGE (all content new) for a confirmed-unpublished page when live is missing', () => {
    const diff = computeDiff({
      preview: { html: PREVIEW },
      live: null,
      liveStatus: 'missing',
      status: { live: { lastModified: null } },
    });
    expect(diff.state).to.equal(DIFF_STATE.NEW_PAGE);
    expect(diff.content.added).to.have.length(2);
  });

  it('returns LIVE_UNAVAILABLE — never a fabricated diff — when live fails and status is unknown', () => {
    const diff = computeDiff({
      preview: { html: PREVIEW },
      live: null,
      liveStatus: 'error',
      status: null,
    });
    expect(diff.state).to.equal(DIFF_STATE.LIVE_UNAVAILABLE);
    expect(diff.content).to.be.undefined;
  });

  it('returns LIVE_UNAVAILABLE for a published page whose live fetch failed', () => {
    const diff = computeDiff({
      preview: { html: PREVIEW },
      live: null,
      liveStatus: 'error',
      status: { live: { lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' } },
    });
    expect(diff.state).to.equal(DIFF_STATE.LIVE_UNAVAILABLE);
  });
});
