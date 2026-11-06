import { expect } from '@esm-bundle/chai';
import { seededRandom } from '../../../libs/utils/globe/core.js';

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
