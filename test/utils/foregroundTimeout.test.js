import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setForegroundTimeout, clearForegroundTimeout, raceForegroundTimeout } from '../../libs/utils/utils.js';

describe('foreground timeout', () => {
  let clock;
  let visibility;
  let originalDescriptor;

  const setVisibility = (state) => {
    visibility = state;
    document.dispatchEvent(new Event('visibilitychange'));
  };

  beforeEach(() => {
    visibility = 'visible';
    originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibility,
    });
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  });

  afterEach(() => {
    clock.restore();
    delete document.visibilityState;
    if (originalDescriptor) {
      Object.defineProperty(Document.prototype, 'visibilityState', originalDescriptor);
    }
  });

  describe('setForegroundTimeout', () => {
    it('fires after the budget elapses while the page stays visible', () => {
      const spy = sinon.spy();
      setForegroundTimeout(spy, 5000);
      clock.tick(4999);
      expect(spy.called).to.be.false;
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });

    it('does not spend budget while the page is hidden', () => {
      const spy = sinon.spy();
      setForegroundTimeout(spy, 5000);
      clock.tick(2000);
      setVisibility('hidden');
      // A frozen webview: wall-clock time passes, foreground budget must not.
      clock.tick(60000);
      expect(spy.called).to.be.false;
      setVisibility('visible');
      clock.tick(2999);
      expect(spy.called).to.be.false;
      clock.tick(1);
      expect(spy.calledOnce).to.be.true;
    });

    it('survives repeated hide/show cycles without losing budget', () => {
      const spy = sinon.spy();
      setForegroundTimeout(spy, 3000);
      for (let i = 0; i < 3; i += 1) {
        clock.tick(500);
        setVisibility('hidden');
        clock.tick(10000);
        setVisibility('visible');
      }
      expect(spy.called).to.be.false;
      clock.tick(1500);
      expect(spy.calledOnce).to.be.true;
    });

    it('does not start the timer when armed while already hidden', () => {
      visibility = 'hidden';
      const spy = sinon.spy();
      setForegroundTimeout(spy, 1000);
      clock.tick(10000);
      expect(spy.called).to.be.false;
      setVisibility('visible');
      clock.tick(1000);
      expect(spy.calledOnce).to.be.true;
    });

    it('releases its visibilitychange listener once it fires', () => {
      const removeSpy = sinon.spy(document, 'removeEventListener');
      setForegroundTimeout(() => {}, 1000);
      clock.tick(1000);
      expect(removeSpy.calledWith('visibilitychange')).to.be.true;
      removeSpy.restore();
    });

    it('returns distinct ids for concurrent timers', () => {
      const first = sinon.spy();
      const second = sinon.spy();
      const idA = setForegroundTimeout(first, 1000);
      const idB = setForegroundTimeout(second, 2000);
      expect(idA).to.not.equal(idB);
      clearForegroundTimeout(idA);
      clock.tick(2000);
      expect(first.called).to.be.false;
      expect(second.calledOnce).to.be.true;
    });
  });

  describe('clearForegroundTimeout', () => {
    it('prevents the callback and removes the listener', () => {
      const spy = sinon.spy();
      const removeSpy = sinon.spy(document, 'removeEventListener');
      const id = setForegroundTimeout(spy, 1000);
      clearForegroundTimeout(id);
      clock.tick(10000);
      expect(spy.called).to.be.false;
      expect(removeSpy.calledWith('visibilitychange')).to.be.true;
      removeSpy.restore();
    });

    it('cancels a timer that is currently paused', () => {
      const spy = sinon.spy();
      const id = setForegroundTimeout(spy, 1000);
      setVisibility('hidden');
      clearForegroundTimeout(id);
      setVisibility('visible');
      clock.tick(10000);
      expect(spy.called).to.be.false;
    });

    it('is a no-op for unknown or already cleared ids', () => {
      const id = setForegroundTimeout(() => {}, 1000);
      clearForegroundTimeout(id);
      expect(() => clearForegroundTimeout(id)).to.not.throw();
      expect(() => clearForegroundTimeout(-1)).to.not.throw();
    });
  });

  describe('raceForegroundTimeout', () => {
    it('resolves the promise value when it settles first', async () => {
      const race = raceForegroundTimeout(Promise.resolve(true), 5000);
      await clock.tickAsync(0);
      expect(await race).to.be.true;
    });

    it('resolves the timeout value once the foreground budget elapses', async () => {
      const race = raceForegroundTimeout(new Promise(() => {}), 5000);
      await clock.tickAsync(5000);
      expect(await race).to.equal('timeout');
    });

    it('accepts a custom timeout value', async () => {
      const race = raceForegroundTimeout(new Promise(() => {}), 1000, false);
      await clock.tickAsync(1000);
      expect(await race).to.be.false;
    });

    it('does not time out while the page is hidden', async () => {
      let resolveReady;
      const ready = new Promise((resolve) => { resolveReady = resolve; });
      const race = raceForegroundTimeout(ready, 5000);
      setVisibility('hidden');
      await clock.tickAsync(60000);
      resolveReady(true);
      setVisibility('visible');
      await clock.tickAsync(0);
      expect(await race).to.be.true;
    });

    it('releases the timer and listener as soon as the race settles', async () => {
      const removeSpy = sinon.spy(document, 'removeEventListener');
      const race = raceForegroundTimeout(Promise.resolve('ready'), 5000);
      await race;
      await clock.tickAsync(0);
      expect(removeSpy.calledWith('visibilitychange')).to.be.true;
      removeSpy.restore();
    });

    it('propagates a rejection from the raced promise', async () => {
      const settled = raceForegroundTimeout(Promise.reject(new Error('nope')), 5000)
        .then(() => null, (e) => e);
      await clock.tickAsync(0);
      expect((await settled)?.message).to.equal('nope');
    });
  });
});
