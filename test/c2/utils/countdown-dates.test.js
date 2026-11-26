import { expect } from '@esm-bundle/chai';
import getCountdownDates from '../../../libs/c2/utils/countdown-dates.js';

const schedule = (start, end) => `
  <meta name="manifestnames" content="sale">
  <meta name="schedule" content="sale | ${start} | ${end} | /sale.json |  | 2026-01-01T00:00:00Z | 2026-02-01T00:00:00Z">
  <meta name="countdown-timer" content="2026-03-01T00:00:00Z,2026-04-01T00:00:00Z">`;

describe('getCountdownDates', () => {
  afterEach(() => { document.head.innerHTML = ''; });

  it('prefers passed dates', () => {
    document.head.innerHTML = schedule('2000-01-01T00:00:00', '2300-01-01T00:00:00');
    expect(getCountdownDates('a,b')).to.equal('a,b');
  });

  it('uses the active MEP promo dates before page metadata', () => {
    document.head.innerHTML = schedule('2000-01-01T00:00:00', '2300-01-01T00:00:00');
    expect(getCountdownDates()).to.equal('2026-01-01T00:00:00Z,2026-02-01T00:00:00Z');
  });

  it('falls back to page metadata when the promo is inactive', () => {
    document.head.innerHTML = schedule('2000-01-01T00:00:00', '2000-02-01T00:00:00');
    expect(getCountdownDates()).to.equal('2026-03-01T00:00:00Z,2026-04-01T00:00:00Z');
  });

  it('returns null without any dates', () => {
    expect(getCountdownDates()).to.be.null;
  });
});
