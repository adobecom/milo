import { expect } from '@esm-bundle/chai';
import { readBlockAnimations, scanPage } from '../../../libs/c2/tools/page-animator/scanner.js';

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

  it('skips elements with empty-string paAnimId', () => {
    const el = document.createElement('div');
    el.dataset.paAnimId = '';
    el.dataset.paProps = JSON.stringify({ '--pa-opacity-from': 0 });
    document.body.appendChild(el);
    const result = readBlockAnimations();
    expect(result).to.deep.equal({});
  });

  it('skips elements with missing paProps attribute', () => {
    const el = document.createElement('div');
    el.dataset.paAnimId = 'section-0';
    // no paProps set at all
    document.body.appendChild(el);
    const result = readBlockAnimations();
    expect(result).to.deep.equal({});
  });
});

describe('scanPage', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function makeSection(...blockClasses) {
    const section = document.createElement('div');
    section.className = 'section';
    blockClasses.forEach((cls) => {
      const block = document.createElement('div');
      block.className = cls;
      section.appendChild(block);
    });
    document.body.appendChild(section);
    return section;
  }

  it('excludes animation blocks from the block list', () => {
    const section = makeSection('marquee', 'animation', 'text');
    const tree = scanPage();
    expect(tree).to.have.length(1);
    const blockClasses = tree[0].blocks.map((b) => b.label);
    expect(blockClasses).to.not.include('animation');
    expect(blockClasses).to.include('marquee');
    expect(blockClasses).to.include('text');
  });

  it('does not overwrite existing data-anim-id on sections', () => {
    const section = document.createElement('div');
    section.className = 'section';
    section.dataset.animId = 'my-custom-id';
    document.body.appendChild(section);
    scanPage();
    expect(section.dataset.animId).to.equal('my-custom-id');
  });

  it('does not overwrite existing data-anim-id on blocks', () => {
    const section = document.createElement('div');
    section.className = 'section';
    const block = document.createElement('div');
    block.className = 'marquee';
    block.dataset.animId = 'my-block-id';
    section.appendChild(block);
    document.body.appendChild(section);
    scanPage();
    expect(block.dataset.animId).to.equal('my-block-id');
  });
});
