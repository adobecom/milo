import { expect } from '@esm-bundle/chai';
import Tree from '../../libs/utils/tree.js';

describe('Tree Data Struct', () => {
  it('should create a tree with root node', () => {
    const t = new Tree('root');
    expect(t).not.to.be.undefined;
    expect(t.root).not.to.be.undefined;
  });

  it('should be able to add and remove nodes', () => {
    const t = new Tree('root');
    t.insert('root', 'first');
    t.insert('root', 'second');

    expect(t.find('root')).to.be.equal(t.root);
    expect(t.find('first')).to.be.equal(t.root.children[0]);
    expect(t.find('first').parent).to.be.equal(t.root);
    expect(t.find('second')).to.be.equal(t.root.children[1]);

    t.remove('first');
    expect(t.find('first')).to.be.undefined;
    expect(t.find('second')).to.be.equal(t.root.children[0]);

    expect(t.find('second').isLeaf).to.be.true;
    expect(t.root.isLeaf).to.be.false;
  });
});
