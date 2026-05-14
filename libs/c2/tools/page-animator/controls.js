export const CONTROLS = [
  {
    label: 'Opacity from',
    cssVar: '--pa-opacity-from',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 1,
    unit: '',
    tooltip: 'Starting opacity (0 = invisible, 1 = fully visible). Animates to 1.',
  },
  {
    label: 'Translate Y',
    cssVar: '--pa-translate-y',
    type: 'range',
    min: -200,
    max: 200,
    step: 1,
    default: 0,
    unit: 'px',
    tooltip: 'Vertical start offset. Positive = down, negative = up. Animates to 0.',
  },
  {
    label: 'Translate X',
    cssVar: '--pa-translate-x',
    type: 'range',
    min: -200,
    max: 200,
    step: 1,
    default: 0,
    unit: 'px',
    tooltip: 'Horizontal start offset. Positive = right, negative = left. Animates to 0.',
  },
  {
    label: 'Scale from',
    cssVar: '--pa-scale',
    type: 'range',
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
    unit: '',
    tooltip: 'Starting scale (1 = normal, 0.5 = half size, 2 = double). Animates to 1.',
  },
  {
    label: 'Blur',
    cssVar: '--pa-blur',
    type: 'range',
    min: 0,
    max: 20,
    step: 0.5,
    default: 0,
    unit: 'px',
    tooltip: 'Starting blur in pixels. Animates to 0 (sharp).',
  },
  {
    label: 'Easing',
    cssVar: '--pa-easing',
    type: 'select',
    options: ['ease', 'ease-in-out', 'cubic-bezier(0.42,0,0,1)', 'linear'],
    default: 'cubic-bezier(0.42,0,0,1)',
    unit: '',
    emitProp: false,
    tooltip: 'Acceleration curve of the animation.',
  },
  {
    label: 'Range start',
    cssVar: 'range-start',
    type: 'select',
    options: ['entry 0%', 'entry 25%', 'entry 50%'],
    default: 'entry 0%',
    unit: '',
    tooltip: 'When the animation begins as the element enters the viewport.',
  },
  {
    label: 'Range end',
    cssVar: 'range-end',
    type: 'select',
    options: ['entry 75%', 'entry 100%', 'cover 50%'],
    default: 'entry 100%',
    unit: '',
    tooltip: 'When the animation ends relative to the element\'s scroll position.',
  },
  {
    label: 'Opacity start %',
    cssVar: 'timing-opacity-start',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    default: 0,
    unit: '%',
    commitOnInput: true,
    tooltip: 'Point within the animation range where the opacity transition begins.',
  },
  {
    label: 'Opacity end %',
    cssVar: 'timing-opacity-end',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    default: 100,
    unit: '%',
    commitOnInput: true,
    tooltip: 'Point within the animation range where the opacity transition ends.',
  },
  {
    label: 'Transform start %',
    cssVar: 'timing-transform-start',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    default: 0,
    unit: '%',
    commitOnInput: true,
    tooltip: 'Point within the animation range where the translate/scale transition begins.',
  },
  {
    label: 'Transform end %',
    cssVar: 'timing-transform-end',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    default: 100,
    unit: '%',
    commitOnInput: true,
    tooltip: 'Point within the animation range where the translate/scale transition ends.',
  },
  {
    label: 'Blur start %',
    cssVar: 'timing-blur-start',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    default: 0,
    unit: '%',
    commitOnInput: true,
    tooltip: 'Point within the animation range where the blur transition begins.',
  },
  {
    label: 'Blur end %',
    cssVar: 'timing-blur-end',
    type: 'range',
    min: 0,
    max: 100,
    step: 1,
    default: 100,
    unit: '%',
    commitOnInput: true,
    tooltip: 'Point within the animation range where the blur transition ends.',
  },
];

export const STAGGER_CONTROLS = [
  {
    label: 'Drift per item',
    cssVar: '--pa-stagger-drift',
    type: 'range',
    min: 0,
    max: 200,
    step: 4,
    default: 0,
    unit: 'px',
    tooltip: 'Y offset per item step. Set above 0 to enable stagger.',
  },
  {
    label: 'Opacity per item',
    cssVar: '--pa-stagger-opacity',
    type: 'range',
    min: 0,
    max: 0.5,
    step: 0.05,
    default: 0,
    unit: '',
    tooltip: 'Opacity reduction per step. 0 disables opacity staggering.',
  },
  {
    label: 'Direction',
    cssVar: '--pa-stagger-direction',
    type: 'select',
    options: ['down', 'up', 'left', 'right'],
    default: 'down',
    unit: '',
    tooltip: 'Direction items slide in from.',
  },
  {
    label: 'Range start',
    cssVar: 'pa-stagger-range-start',
    type: 'select',
    options: ['entry 0%', 'entry 25%', 'entry 50%'],
    default: 'entry 0%',
    unit: '',
    tooltip: 'When the stagger animation begins as the section enters the viewport.',
  },
  {
    label: 'Range end',
    cssVar: 'pa-stagger-range-end',
    type: 'select',
    options: ['entry 75%', 'entry 100%', 'cover 50%'],
    default: 'entry 100%',
    unit: '',
    tooltip: 'When the stagger animation ends.',
  },
];

export function getDefaultStaggerState() {
  return Object.fromEntries(STAGGER_CONTROLS.map((c) => [c.cssVar, c.default]));
}

export function buildStaggerCssRules(sectionId, blockIds, state) {
  const drift = state['--pa-stagger-drift'] ?? 0;
  const opacityStep = state['--pa-stagger-opacity'] ?? 0;
  if (!drift && !opacityStep) return '';

  const direction = state['--pa-stagger-direction'] ?? 'down';
  const rangeStart = state['pa-stagger-range-start'] ?? 'entry 0%';
  const rangeEnd = state['pa-stagger-range-end'] ?? 'entry 100%';
  const tlName = `--pa-stagger-tl-${sectionId}`;
  const animName = `pa-stagger-${sectionId}`;
  const isX = direction === 'left' || direction === 'right';
  const sign = (direction === 'up' || direction === 'left') ? -1 : 1;

  const keyframes = `@keyframes ${animName} {
  from {
    transform: translate3d(var(--pa-stagger-x-from, 0px), var(--pa-stagger-y-from, 0px), 0);
    opacity: var(--pa-stagger-opacity-from, 1);
  }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}`;

  const sectionRule = `[data-anim-id="${sectionId}"] {
  view-timeline: ${tlName} block;
  view-timeline-inset: 40% 10%;
}`;

  const easing = 'cubic-bezier(0.42, 0, 0, 1)';
  const blockRules = blockIds.map((blockId, i) => {
    const offset = `${sign * i * drift}px`;
    const xFrom = isX ? offset : '0px';
    const yFrom = !isX ? offset : '0px';
    const opacityFrom = Math.max(0, 1 - i * opacityStep).toFixed(2);
    return `[data-anim-id="${sectionId}"] [data-anim-id="${blockId}"] {
  --pa-stagger-x-from: ${xFrom};
  --pa-stagger-y-from: ${yFrom};
  --pa-stagger-opacity-from: ${opacityFrom};
  animation-name: ${animName};
  animation-timing-function: ${easing};
  animation-fill-mode: both;
  animation-timeline: ${tlName};
  animation-range: ${rangeStart} ${rangeEnd};
}`;
  }).join('\n');

  return `${keyframes}\n${sectionRule}\n${blockRules}`;
}

// Animated property groups: each maps timing controls to a CSS property's from/to values.
const ANIM_PROPS = [
  {
    cssProperty: 'opacity',
    timingStart: 'timing-opacity-start',
    timingEnd: 'timing-opacity-end',
    fromValue: () => 'var(--pa-opacity-from, 1)',
    toValue: () => '1',
  },
  {
    cssProperty: 'transform',
    timingStart: 'timing-transform-start',
    timingEnd: 'timing-transform-end',
    fromValue: () => 'translate3d(var(--pa-translate-x, 0px), var(--pa-translate-y, 0px), 0) scale(var(--pa-scale, 1))',
    toValue: () => 'translate3d(0, 0, 0) scale(1)',
  },
  {
    cssProperty: 'filter',
    timingStart: 'timing-blur-start',
    timingEnd: 'timing-blur-end',
    fromValue: () => 'blur(var(--pa-blur, 0px))',
    toValue: () => 'blur(0)',
  },
];

export function generateAnimId(sectionIdx, blockIdx = null) {
  return blockIdx === null
    ? `section-${sectionIdx}`
    : `section-${sectionIdx}-block-${blockIdx}`;
}

export function getDefaultState() {
  return Object.fromEntries(CONTROLS.map((c) => [c.cssVar, c.default]));
}

export function buildCssRule(animId, state) {
  const rangeStart = state['range-start'] ?? 'entry 0%';
  const rangeEnd = state['range-end'] ?? 'entry 100%';
  const easing = state['--pa-easing'] ?? 'cubic-bezier(0.42,0,0,1)';

  const customProps = CONTROLS
    .filter((c) => c.cssVar.startsWith('--') && c.emitProp !== false)
    .map((c) => `  ${c.cssVar}: ${state[c.cssVar] ?? c.default}${c.unit};`)
    .join('\n');

  // Collect all keyframe stop percentages: 0%, 100%, plus each property's start/end.
  // Properties hold their from-value from 0% to timingStart, animate to timingEnd, hold to-value.
  const stopSet = new Set([0, 100]);
  ANIM_PROPS.forEach(({ timingStart, timingEnd }) => {
    stopSet.add(state[timingStart] ?? 0);
    stopSet.add(state[timingEnd] ?? 100);
  });
  const stops = [...stopSet].sort((a, b) => a - b);

  const keyframeBlocks = stops.map((pct) => {
    const declarations = [];
    ANIM_PROPS.forEach(({ cssProperty, timingStart, timingEnd, fromValue, toValue }) => {
      const s = state[timingStart] ?? 0;
      const e = state[timingEnd] ?? 100;
      if (pct === 0 || pct === s) {
        declarations.push(`    ${cssProperty}: ${fromValue()};`);
      } else if (pct === e || pct === 100) {
        declarations.push(`    ${cssProperty}: ${toValue()};`);
      }
    });
    if (!declarations.length) return null;
    return `  ${pct}% {\n${declarations.join('\n')}\n  }`;
  }).filter(Boolean);

  const keyframes = `@keyframes pa-anim-${animId} {\n${keyframeBlocks.join('\n')}\n}`;
  const rule = `[data-anim-id="${animId}"] {\n  animation: pa-anim-${animId} ${easing} both;\n  animation-timeline: view();\n  animation-range: ${rangeStart} ${rangeEnd};\n${customProps}\n}`;

  return `${keyframes}\n${rule}`;
}

// tree node shape: { id, el, domIndex, label, blocks: [{ id, el, domIndex?, label }] }
export function serializeState(tree, stateMap, staggerMap = {}) {
  const animations = [];
  tree.forEach((section) => {
    if (stateMap[section.id]) {
      const sel = `.section:nth-child(${section.domIndex + 1})`;
      animations.push({ id: section.id, selector: sel, properties: { ...stateMap[section.id] } });
    }
    section.blocks.forEach((block) => {
      if (stateMap[block.id]) {
        const sel = `.section:nth-child(${section.domIndex + 1}) .${block.el.classList[0]}`;
        animations.push({ id: block.id, selector: sel, properties: { ...stateMap[block.id] } });
      }
    });
  });
  const stagger = Object.keys(staggerMap).length ? { ...staggerMap } : undefined;
  return { version: 1, animations, ...(stagger ? { stagger } : {}) };
}

export function deserializeState(json) {
  const stateMap = Object.fromEntries(json.animations.map((a) => [a.id, a.properties]));
  const staggerMap = json.stagger ? { ...json.stagger } : {};
  return { stateMap, staggerMap };
}
