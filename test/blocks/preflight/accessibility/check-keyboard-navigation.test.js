import { expect } from '@esm-bundle/chai';
import checkKeyboardNavigation from '../../../../libs/blocks/preflight/accessibility/check-keyboard-navigation.js';

const CONFIG = { checks: ['keyboard'] };

describe('preflight accessibility check-keyboard-navigation', () => {
  const created = [];
  const add = (html) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    document.body.append(el);
    created.push(el);
    return el;
  };

  afterEach(() => { while (created.length) created.pop().remove(); });

  it('returns [] when keyboard check is not enabled', () => {
    const el = add('<a href="#x">link</a>');
    expect(checkKeyboardNavigation([el], { checks: [] })).to.deep.equal([]);
  });

  it('reports a critical violation when there are no focusable elements', () => {
    const el = add('<div>not focusable</div>');
    const res = checkKeyboardNavigation([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].impact).to.equal('critical');
    expect(res[0].nodes).to.deep.equal([]);
  });

  it('passes visible focusable elements', () => {
    const el = add('<a href="#x">visible link</a>');
    expect(checkKeyboardNavigation([el], CONFIG)).to.deep.equal([]);
  });

  it('flags a focusable element that is hidden by its own style', () => {
    const el = add('<a href="#x" style="display:none">hidden link</a>');
    const res = checkKeyboardNavigation([el], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].id).to.equal('focus-visible');
    expect(res[0].description).to.contain('not visibly rendered');
  });

  it('ignores focusable elements hidden only via an ancestor', () => {
    const wrapper = add('<div style="display:none"><a href="#x">child link</a></div>');
    const link = wrapper.querySelector('a');
    expect(checkKeyboardNavigation([link], CONFIG)).to.deep.equal([]);
  });
});
