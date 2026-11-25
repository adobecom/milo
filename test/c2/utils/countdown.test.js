import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import createCountdown, { parseRange, splitDuration } from '../../../libs/c2/utils/countdown.js';

const START = Date.parse('2026-11-01T00:00:00Z');
const END = Date.parse('2026-11-02T01:01:01Z');
const FAKE = ['Date', 'setInterval', 'clearInterval'];

describe('countdown helper', () => {
  let clock;

  afterEach(() => {
    clock?.restore();
    clock = null;
  });

  describe('parseRange', () => {
    it('parses a start and end date', () => {
      expect(parseRange('2026-11-01T00:00:00Z, 2026-11-02T01:01:01Z')).to.deep.equal({ start: START, end: END });
    });

    it('treats a single date as the end date', () => {
      expect(parseRange('2026-11-02T01:01:01Z')).to.deep.equal({ start: -Infinity, end: END });
    });

    it('rejects invalid, reversed or extra dates', () => {
      expect(parseRange('soon')).to.be.null;
      expect(parseRange('2026-11-02T00:00:00Z, 2026-11-01T00:00:00Z')).to.be.null;
      expect(parseRange('2026-11-01, 2026-11-02, 2026-11-03')).to.be.null;
    });
  });

  it('splits a duration into days, hours, minutes and seconds', () => {
    expect(splitDuration(END - START).map(({ value }) => value)).to.deep.equal([1, 1, 1, 1]);
    expect(splitDuration(-5000).every(({ value }) => value === 0)).to.be.true;
  });

  it('keeps every timer in sync and uses the default class', () => {
    clock = sinon.useFakeTimers({ now: START, toFake: FAKE });
    const countdown = createCountdown({ start: START, end: END });
    const timers = [countdown.createTimer(), countdown.createTimer()];
    countdown.start();

    timers.forEach((timer) => {
      expect(timer.className).to.equal('countdown');
      expect(timer.querySelector('.countdown-digits').getAttribute('dir')).to.equal('ltr');
      expect(timer.textContent).to.include('01:01:01:01');
    });
    countdown.stop();
  });

  it('reports each status change once and stops when ended', () => {
    clock = sinon.useFakeTimers({ now: START - 1000, toFake: FAKE });
    const onStatusChange = sinon.spy();
    createCountdown({ start: START, end: START + 2000 }).start(onStatusChange);

    clock.tick(5000);
    expect(onStatusChange.args.flat()).to.deep.equal(['pending', 'running', 'ended']);
    expect(clock.countTimers()).to.equal(0);
  });

  it('stops ticking on demand', () => {
    clock = sinon.useFakeTimers({ now: START, toFake: FAKE });
    const countdown = createCountdown({ start: START, end: END });
    countdown.start();
    countdown.stop();
    expect(clock.countTimers()).to.equal(0);
  });
});
