import { expect } from '@esm-bundle/chai';
import {
  STATUS,
  STATUS_TO_ICON_MAP,
  SEVERITY,
  SEO_CHECK_IDS,
  ASO_TIMEOUT_MS,
  ASO_POLL_INTERVAL_MS,
  ASO_MAX_RETRIES,
} from '../../../../libs/blocks/preflight/checks/constants.js';

describe('preflight checks constants', () => {
  it('maps every status to an icon color', () => {
    expect(Object.keys(STATUS_TO_ICON_MAP).sort()).to.deep.equal(Object.values(STATUS).sort());
    expect(STATUS_TO_ICON_MAP[STATUS.PASS]).to.equal('green');
    expect(STATUS_TO_ICON_MAP[STATUS.FAIL]).to.equal('red');
    expect(STATUS_TO_ICON_MAP[STATUS.LIMBO]).to.equal('orange');
  });

  it('exposes the severity levels', () => {
    expect(SEVERITY).to.deep.equal({ CRITICAL: 'critical', WARNING: 'warning' });
  });

  it('maps native ASO checkIds for links to broken-links', () => {
    expect(SEO_CHECK_IDS.links).to.equal('broken-links');
    expect(SEO_CHECK_IDS.title).to.equal('title-size');
  });

  it('derives ASO_MAX_RETRIES from the timeout and poll interval', () => {
    expect(ASO_MAX_RETRIES).to.equal(Math.ceil(ASO_TIMEOUT_MS / ASO_POLL_INTERVAL_MS));
    expect(ASO_MAX_RETRIES).to.equal(30);
  });
});
