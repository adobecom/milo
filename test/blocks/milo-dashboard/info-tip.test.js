import { expect } from '@esm-bundle/chai';

const { default: infoTip } = await import('../../../libs/blocks/milo-dashboard/info-tip.js');

describe('milo-dashboard info-tip', () => {
  it('returns a button carrying the explanation as accessible name', () => {
    const el = infoTip('All-time count of live pages.');
    expect(el.tagName).to.equal('BUTTON');
    expect(el.getAttribute('type')).to.equal('button');
    expect(el.getAttribute('aria-label')).to.equal('All-time count of live pages.');
    expect(el.classList.contains('info-tip')).to.equal(true);
  });

  it('exposes the text to sighted users via a tooltip element', () => {
    const el = infoTip('Tier-1 consumers only.');
    expect(el.querySelector('.info-tip-bubble').textContent).to.equal('Tier-1 consumers only.');
  });
});
