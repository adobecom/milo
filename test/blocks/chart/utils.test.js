import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

const {
  throttle,
  parseValue,
  formatExcelDate,
} = await import('../../../libs/blocks/chart/utils.js');

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

  describe('formatExcelDate', () => {
    const dates = [
      { excel: 45200, expected: '10/1/23' },
      { excel: 45231, expected: '11/1/23' },
      { excel: 45261, expected: '12/1/23' },
      { excel: 45292, expected: '1/1/24' },
      { excel: 45323, expected: '2/1/24' },
      { excel: 45352, expected: '3/1/24' },
      { excel: 45383, expected: '4/1/24' },
      { excel: 45413, expected: '5/1/24' },
    ];

    dates.forEach((date) => {
      it(`formats excel date ${date.excel} to ${date.expected}`, () => {
        expect(formatExcelDate(date.excel)).to.equal(date.expected);
      });
    });
  });
});
