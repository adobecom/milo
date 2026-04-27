import { generateAnimId } from './controls.js';

const SKIP_CLASSES = new Set(['section-metadata', 'visually-hidden']);

export function scanPage() {
  return [...document.querySelectorAll('.section')].map((section, sIdx) => {
    const sId = generateAnimId(sIdx);
    section.dataset.animId = sId;

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
        block.dataset.animId = bId;
        return { id: bId, label: block.classList[0], el: block };
      }),
    };
  });
}
