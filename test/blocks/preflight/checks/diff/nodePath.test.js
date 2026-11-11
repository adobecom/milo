import { expect } from '@esm-bundle/chai';
import { normalizeText, getXPath } from '../../../../../libs/blocks/preflight/checks/diff/nodePath.js';

describe('preflight diff nodePath', () => {
  it('normalizeText collapses whitespace and trims', () => {
    expect(normalizeText('  a\n  b   c ')).to.equal('a b c');
    expect(normalizeText(undefined)).to.equal('');
  });

  it('getXPath builds a tag[index] path relative to root', () => {
    const root = document.createElement('main');
    root.innerHTML = '<div><p>one</p><p>two</p></div><div><h2>h</h2></div>';
    const secondP = root.querySelectorAll('p')[1];
    const h2 = root.querySelector('h2');
    expect(getXPath(secondP, root)).to.equal('/div[1]/p[2]');
    expect(getXPath(h2, root)).to.equal('/div[2]/h2[1]');
  });

  it('getXPath counts only same-tag siblings, ignoring mixed-tag preceding siblings', () => {
    const root = document.createElement('main');
    root.innerHTML = '<div><h2>a</h2><p>one</p><p>two</p></div>';
    const secondP = root.querySelectorAll('p')[1];
    expect(getXPath(secondP, root)).to.equal('/div[1]/p[2]');
  });
});
