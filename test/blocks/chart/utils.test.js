import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

const { throttle, parseValue } = await import('../../../libs/blocks/chart/utils.js');

describe('chart utils', () => {
  describe('throttle', () => {
    let clock;

    before(() => {
      clock = sinon.useFakeTimers();
    });

    after(() => {
      clock.restore();
    });

    it('callback called twice, once right away and once after delay', () => {
      const callback = sinon.spy();
      const throttled = throttle(200, callback);
      throttled();
      expect(callback.callCount).to.equal(1);
      clock.tick(200);
      expect(callback.callCount).to.equal(2);
    });

    it('callback only called twice even with multiple throttle calls', () => {
      const callback = sinon.spy();
      const throttled = throttle(200, callback);
      throttled();
      throttled();
      throttled();
      clock.tick(200);
      expect(callback.calledTwice).to.be.true;
    });
  });

  describe('parseValue', () => {
    it('parses a number', () => {
      expect(parseValue('1')).to.equal(1);
    });
    it('parses a number with a decimal', () => {
      expect(parseValue('1.1')).to.equal(1.1);
    });
    it('parses a non-number', () => {
      expect(parseValue('foo')).to.equal('foo');
    });
  });
});
