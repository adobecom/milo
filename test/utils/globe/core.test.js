import { expect } from '@esm-bundle/chai';
import { createDisposer, seededRandom } from '../../../libs/utils/globe/core.js';

describe('createDisposer', () => {
  it('runs cleanups in reverse order of registration', () => {
    const disposer = createDisposer();
    const order = [];
    disposer.add(() => order.push('first'));
    disposer.add(() => order.push('second'));
    disposer.dispose();
    expect(order).to.deep.equal(['second', 'first']);
  });

  it('removes a listener it added, with the same options', () => {
    const disposer = createDisposer();
    const target = new EventTarget();
    let calls = 0;
    disposer.listen(target, 'ping', () => { calls += 1; }, { capture: true });
    target.dispatchEvent(new Event('ping'));
    disposer.dispose();
    target.dispatchEvent(new Event('ping'));
    expect(calls).to.equal(1);
  });

  it('runs each cleanup once', () => {
    const disposer = createDisposer();
    let calls = 0;
    disposer.add(() => { calls += 1; });
    disposer.dispose();
    disposer.dispose();
    expect(calls).to.equal(1);
  });
});

describe('seededRandom', () => {
  const draw = (random, n) => Array.from({ length: n }, () => random());

  it('repeats the same sequence for the same seed', () => {
    expect(draw(seededRandom('a seed'), 50)).to.deep.equal(draw(seededRandom('a seed'), 50));
  });

  it('gives different seeds different sequences', () => {
    expect(draw(seededRandom('a seed'), 50)).to.not.deep.equal(draw(seededRandom('another'), 50));
  });

  it('keeps generators independent of each other', () => {
    const expected = draw(seededRandom('a seed'), 10);
    const random = seededRandom('a seed');
    const other = seededRandom('a seed');
    const values = expected.map(() => { other(); other(); return random(); });
    expect(values).to.deep.equal(expected);
  });

  it('draws varied values in [0, 1)', () => {
    const values = draw(seededRandom('a seed'), 200);
    values.forEach((v) => expect(v).to.be.within(0, 1 - Number.EPSILON));
    expect(new Set(values).size).to.equal(200);
    expect(Math.min(...values)).to.be.below(0.1);
    expect(Math.max(...values)).to.be.above(0.9);
  });
});
