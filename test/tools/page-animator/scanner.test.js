import { expect } from '@esm-bundle/chai';
import { readBlockAnimations } from '../../../libs/c2/tools/page-animator/scanner.js';

function makeBlockEl(animId, props) {
  const el = document.createElement('div');
  el.dataset.paAnimId = animId;
  el.dataset.paProps = JSON.stringify(props);
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('readBlockAnimations', () => {
  it('returns empty object when no animation blocks exist', () => {
    const result = readBlockAnimations();
    expect(result).to.deep.equal({});
  });

  it('reads animId and props from block elements', () => {
    const props = { '--pa-opacity-from': 0, 'range-start': 'entry 0%' };
    makeBlockEl('section-0-block-1', props);
    const result = readBlockAnimations();
    expect(result['section-0-block-1']).to.deep.equal(props);
  });

  it('reads multiple block elements', () => {
    makeBlockEl('section-0', { '--pa-opacity-from': 0 });
    makeBlockEl('section-1-block-0', { '--pa-translate-y': 60 });
    const result = readBlockAnimations();
    expect(Object.keys(result)).to.have.length(2);
  });

  it('skips elements with malformed paProps JSON', () => {
    const el = document.createElement('div');
    el.dataset.paAnimId = 'section-0';
    el.dataset.paProps = 'not-json';
    document.body.appendChild(el);
    const result = readBlockAnimations();
    expect(result).to.deep.equal({});
  });
});
