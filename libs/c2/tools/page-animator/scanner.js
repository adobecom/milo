import { generateAnimId } from './controls.js';

const SKIP_CLASSES = new Set(['section-metadata', 'visually-hidden', 'animation', 'section-background']);

export function scanPage() {
  return [...document.querySelectorAll('.section')].map((section, sIdx) => {
    const sId = generateAnimId(sIdx);
    if (!section.dataset.animId) section.dataset.animId = sId;

    const blocks = [...section.children].filter(
      (el) => el.classList.length > 0 && ![...el.classList].some((c) => SKIP_CLASSES.has(c)),
    );

    return {
      id: sId,
      label: `Section ${sIdx + 1}`,
      el: section,
      domIndex: sIdx,
      blocks: blocks.map((block, bIdx) => {
        const bId = generateAnimId(sIdx, bIdx);
        if (!block.dataset.animId) block.dataset.animId = bId;
        return { id: bId, label: block.classList[0], el: block };
      }),
    };
  });
}

export function readBlockAnimations() {
  const blockStateMap = {};
  document.querySelectorAll('[data-pa-anim-id]').forEach((el) => {
    try {
      const animId = el.dataset.paAnimId;
      const props = JSON.parse(el.dataset.paProps || '{}');
      if (animId && Object.keys(props).length) blockStateMap[animId] = props;
    } catch {
      // skip malformed block data
    }
  });
  return blockStateMap;
}
