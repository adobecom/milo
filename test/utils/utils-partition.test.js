import { expect } from '@esm-bundle/chai';
import { partition } from '../../libs/utils/utils.js';

describe('Utils Partition', () => {
  it('partition array', async () => {
    const arr = [
      { name: 'John', age: 23 },
      { name: 'James', age: 40 },
      { name: 'Mary', age: 31 },
    ];
    const result = partition(arr, (x) => x.age > 30);
    expect(result[0]).to.have.deep.members(
      [
        { name: 'Mary', age: 31 },
        { name: 'James', age: 40 },
      ],
    );
    expect(result[1]).to.have.deep.members(
      [{ name: 'John', age: 23 }],
    );
  });
  it('empty array', async () => {
    const arr = [];
    const result = partition(arr, (x) => x.age > 30);
    expect(result).to.eql([[], []]);
  });
});
