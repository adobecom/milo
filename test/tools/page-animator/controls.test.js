import { expect } from '@esm-bundle/chai';
import {
  CONTROLS,
  generateAnimId,
  getDefaultState,
  buildCssRule,
  serializeState,
  deserializeState,
} from '../../../libs/c2/tools/page-animator/controls.js';

describe('CONTROLS config', () => {
  it('each control has required fields', () => {
    CONTROLS.forEach(c => {
      expect(c).to.have.property('label');
      expect(c).to.have.property('cssVar');
      expect(c).to.have.property('type');
      expect(c).to.have.property('default');
      if (c.type === 'range') {
        expect(c).to.have.property('min');
        expect(c).to.have.property('max');
        expect(c).to.have.property('step');
        expect(c).to.have.property('unit');
      }
      if (c.type === 'select') {
        expect(c.options).to.be.an('array').with.length.greaterThan(0);
      }
    });
  });

  it('timing controls have commitOnInput flag', () => {
    const timingControls = CONTROLS.filter((c) => c.cssVar.startsWith('timing-'));
    expect(timingControls.length).to.equal(6);
    timingControls.forEach((c) => {
      expect(c.commitOnInput).to.equal(true);
    });
  });
});

describe('generateAnimId', () => {
  it('generates section id', () => {
    expect(generateAnimId(0)).to.equal('section-0');
    expect(generateAnimId(3)).to.equal('section-3');
  });

  it('generates block id', () => {
    expect(generateAnimId(0, 0)).to.equal('section-0-block-0');
    expect(generateAnimId(2, 5)).to.equal('section-2-block-5');
  });
});

describe('getDefaultState', () => {
  it('returns an object keyed by cssVar with default values', () => {
    const state = getDefaultState();
    CONTROLS.forEach(c => {
      expect(state).to.have.property(c.cssVar);
      expect(state[c.cssVar]).to.equal(c.default);
    });
  });
});

describe('buildCssRule', () => {
  it('produces per-element @keyframes and a scoped CSS rule', () => {
    const state = getDefaultState();
    const rule = buildCssRule('section-0', state);
    expect(rule).to.include('@keyframes pa-anim-section-0');
    expect(rule).to.include('[data-anim-id="section-0"]');
    expect(rule).to.include('animation: pa-anim-section-0');
    expect(rule).to.include('animation-timeline: view()');
    expect(rule).to.include('animation-range:');
    expect(rule).to.include('entry 0%');
  });

  it('uses range-start and range-end from state', () => {
    const state = { ...getDefaultState(), 'range-start': 'entry 25%', 'range-end': 'cover 50%' };
    const rule = buildCssRule('section-1', state);
    expect(rule).to.include('entry 25%');
    expect(rule).to.include('cover 50%');
  });

  it('uses easing from state', () => {
    const state = { ...getDefaultState(), '--pa-easing': 'linear' };
    const rule = buildCssRule('section-0', state);
    expect(rule).to.include('linear');
  });

  it('generates intermediate keyframe stops for non-default timing', () => {
    const state = {
      ...getDefaultState(),
      'timing-opacity-start': 20,
      'timing-opacity-end': 60,
    };
    const rule = buildCssRule('section-0', state);
    expect(rule).to.include('20%');
    expect(rule).to.include('60%');
  });

  it('keyframes include from and to values for each animated property', () => {
    const state = getDefaultState();
    const rule = buildCssRule('section-0', state);
    expect(rule).to.include('opacity:');
    expect(rule).to.include('transform:');
    expect(rule).to.include('filter:');
  });
});

describe('serializeState / deserializeState', () => {
  it('round-trips state through JSON', () => {
    const tree = [
      {
        id: 'section-0',
        domIndex: 0,
        el: { classList: { contains: () => true } },
        blocks: [{ id: 'section-0-block-0', el: { classList: ['marquee'] } }],
      },
    ];
    const stateMap = { 'section-0': getDefaultState() };
    const json = serializeState(tree, stateMap);

    expect(json.version).to.equal(1);
    expect(json.animations).to.have.length(1);
    expect(json.animations[0].id).to.equal('section-0');
    expect(json.animations[0].properties).to.deep.equal(getDefaultState());

    const restored = deserializeState(json);
    expect(restored['section-0']).to.deep.equal(getDefaultState());
  });

  it('serializes block state', () => {
    const tree = [
      {
        id: 'section-0',
        domIndex: 0,
        el: { classList: { contains: () => false } },
        blocks: [{ id: 'section-0-block-0', el: { classList: ['marquee'] } }],
      },
    ];
    const stateMap = { 'section-0-block-0': getDefaultState() };
    const json = serializeState(tree, stateMap);

    expect(json.animations).to.have.length(1);
    expect(json.animations[0].id).to.equal('section-0-block-0');
    expect(json.animations[0].selector).to.include('marquee');
  });
});
