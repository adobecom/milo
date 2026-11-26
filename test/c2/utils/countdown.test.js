import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import createCountdown, {
  getCountdownState,
  parseDate,
  parseRanges,
  splitDuration,
} from '../../../libs/c2/utils/countdown.js';
import createCountdownTimer from '../../../libs/c2/utils/countdown-timer.js';

const START = Date.parse('2026-11-01T00:00:00Z');
const END = Date.parse('2026-11-02T01:01:01Z');
const FAKE = ['Date', 'setTimeout', 'clearTimeout'];
const LABELS = { day: 'days', hour: 'hours', minute: 'mins', second: 'secs' };

describe('countdown helper', () => {
  let clock;

  afterEach(() => {
    clock?.restore();
    clock = null;
  });

  describe('parseDate', () => {
    it('parses dates like the C1 countdown timer', () => {
      expect(parseDate(' 2026-11-01T00:00:00Z ')).to.equal(START);
      expect(parseDate('2026-11-01T00:00:00')).to.equal(new Date(2026, 10, 1).getTime());
      expect(parseDate('2026-10-31 17:00:00 PDT')).to.equal(START);
      expect(parseDate('invalid')).to.be.NaN;
    });
  });

  describe('parseRanges', () => {
    it('treats a single date as the end date', () => {
      expect(parseRanges('2026-11-02T01:01:01Z')).to.deep.equal([{ start: -Infinity, end: END }]);
    });

    it('parses several ranges in order', () => {
      expect(parseRanges('2026-11-01T00:00:00Z, 2026-11-02T01:01:01Z, 2026-11-03, 2026-11-04'))
        .to.deep.equal([
          { start: START, end: END },
          { start: Date.parse('2026-11-03T00:00:00Z'), end: Date.parse('2026-11-04T00:00:00Z') },
        ]);
    });

    it('rejects invalid, reversed, overlapping or unpaired dates', () => {
      expect(parseRanges('soon')).to.be.null;
      expect(parseRanges('2026-11-02, 2026-11-01')).to.be.null;
      expect(parseRanges('2026-11-01, 2026-11-03, 2026-11-02, 2026-11-04')).to.be.null;
      expect(parseRanges('2026-11-01, 2026-11-02, 2026-11-03')).to.be.null;
    });
  });

  it('splits a duration into days, hours, minutes and seconds', () => {
    expect(splitDuration(END - START).map(({ value }) => value)).to.deep.equal([1, 1, 1, 1]);
    expect(splitDuration(-5000).every(({ value }) => value === 0)).to.be.true;
  });

  it('reports time to the next status change across ranges', () => {
    const ranges = [
      { start: START, end: START + 10000 },
      { start: START + 20000, end: START + 30000 },
    ];
    expect(getCountdownState(START - 2000, ranges)).to.include({ status: 'pending', remaining: 2000 });
    expect(getCountdownState(START + 4000, ranges)).to.include({ status: 'running', remaining: 6000 });
    expect(getCountdownState(START + 15000, ranges)).to.include({ status: 'pending', remaining: 5000 });
    expect(getCountdownState(START + 30000, ranges)).to.include({ status: 'ended', remaining: 0 });
  });

  it('ticks just after each displayed second changes and stops when ended', () => {
    clock = sinon.useFakeTimers({ now: START - 1500, toFake: FAKE });
    const listener = sinon.spy();
    const countdown = createCountdown([{ start: START, end: START + 2000 }]);
    countdown.subscribe(listener);
    countdown.start();
    const seconds = () => listener.lastCall.args[0].parts.at(-1).value;

    clock.tick(510);
    expect(listener.lastCall.args[0]).to.include({ status: 'pending', remaining: 990 });
    clock.tick(1000);
    expect(listener.lastCall.args[0].status).to.equal('running');
    expect(seconds()).to.equal(1);
    clock.tick(1000);
    expect(seconds()).to.equal(0);
    clock.tick(1000);
    expect(listener.lastCall.args[0].status).to.equal('ended');
    expect(listener.callCount).to.equal(5);
    expect(clock.countTimers()).to.equal(0);
  });

  it('pauses while the tab is hidden and catches up when shown', () => {
    clock = sinon.useFakeTimers({ now: START, toFake: FAKE });
    const hidden = sinon.stub(document, 'hidden').get(() => true);
    const listener = sinon.spy();
    const countdown = createCountdown([{ start: START, end: END }]);
    countdown.subscribe(listener);
    countdown.start();
    expect(clock.countTimers()).to.equal(0);

    clock.tick(5000);
    hidden.get(() => false);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(listener.lastCall.args[0].remaining).to.equal(END - START - 5000);
    expect(clock.countTimers()).to.equal(1);
    countdown.stop();
    hidden.restore();
    expect(clock.countTimers()).to.equal(0);
  });

  it('renders the default timer for every subscriber until destroyed', () => {
    clock = sinon.useFakeTimers({ now: START, toFake: FAKE });
    const countdown = createCountdown([{ start: START, end: END }]);
    const timers = [
      createCountdownTimer(countdown, LABELS),
      createCountdownTimer(countdown, LABELS, 'custom'),
    ];
    countdown.start();

    const [first, second] = timers.map(({ el }) => el);
    expect(first.className).to.equal('countdown');
    expect(first.getAttribute('role')).to.equal('timer');
    expect(first.querySelector('.countdown-digits').getAttribute('dir')).to.equal('ltr');
    expect(first.querySelector('.countdown-digits').textContent).to.equal('01:01:01:01');
    expect(first.querySelector('.sr-only').textContent).to.equal('1 days 1 hours 1 mins 1 secs');
    expect(second.className).to.equal('custom');

    timers[1].destroy();
    clock.tick(1000);
    expect(first.querySelector('.countdown-digits').textContent).to.equal('01:01:01:00');
    expect(second.querySelector('.countdown-digits').textContent).to.equal('01:01:01:01');
    countdown.stop();
  });
});
