import { createTag } from '../../utils/utils.js';

export function inlineBlock(block) {
  if (!block.classList.contains('inline')) return;

  const section = block.closest('.section');
  const inlineSiblinggs = section.querySelectorAll('.inline');
  if (inlineSiblinggs.length > 1) {
    let inlineContainer = section.querySelector('.inline-wrapper');
    if (!inlineContainer) {
      inlineContainer = createTag('div', { class: 'inline-wrapper content' });
      block.after(inlineContainer);
    }
    inlineSiblinggs.forEach((el) => inlineContainer.append(el));
  } else {
    block.classList.add('content');
  }
}
