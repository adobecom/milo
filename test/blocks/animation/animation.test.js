import { expect } from '@esm-bundle/chai';
import { parseVariant, parseProps } from '../../../libs/c2/blocks/animation/animation.js';

describe('parseVariant', () => {
  it('returns null targetClass when only animation class present', () => {
    const el = document.createElement('div');
    el.className = 'animation block';
    const { targetClass, targetIndex } = parseVariant(el.classList);
    expect(targetClass).to.equal(null);
    expect(targetIndex).to.equal(1);
  });

  it('returns targetClass and default index 1 for single variant token', () => {
    const el = document.createElement('div');
    el.className = 'animation marquee block';
    const { targetClass, targetIndex } = parseVariant(el.classList);
    expect(targetClass).to.equal('marquee');
    expect(targetIndex).to.equal(1);
  });

  it('returns targetClass and parsed index for two variant tokens', () => {
    const el = document.createElement('div');
    el.className = 'animation text 2 block';
    const { targetClass, targetIndex } = parseVariant(el.classList);
    expect(targetClass).to.equal('text');
    expect(targetIndex).to.equal(2);
  });
});

describe('parseProps', () => {
  function makeBlock(rows) {
    const block = document.createElement('div');
    rows.forEach(([key, val]) => {
      const row = document.createElement('div');
      const k = document.createElement('div');
      const v = document.createElement('div');
      k.textContent = key;
      v.textContent = val;
      row.appendChild(k);
      row.appendChild(v);
      block.appendChild(row);
    });
    return block;
  }

  it('parses numeric values as numbers', () => {
    const block = makeBlock([['--pa-opacity-from', '0'], ['--pa-translate-y', '60']]);
    const props = parseProps(block);
    expect(props['--pa-opacity-from']).to.equal(0);
    expect(props['--pa-translate-y']).to.equal(60);
  });

  it('parses string values as strings', () => {
    const block = makeBlock([['range-start', 'entry 0%'], ['--pa-easing', 'linear']]);
    const props = parseProps(block);
    expect(props['range-start']).to.equal('entry 0%');
    expect(props['--pa-easing']).to.equal('linear');
  });

  it('ignores rows with only one cell', () => {
    const block = makeBlock([['--pa-opacity-from', '0']]);
    const extra = document.createElement('div');
    extra.appendChild(document.createElement('div')).textContent = 'orphan';
    block.appendChild(extra);
    const props = parseProps(block);
    expect(Object.keys(props)).to.deep.equal(['--pa-opacity-from']);
  });
});
