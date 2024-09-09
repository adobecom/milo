import { createTag } from './utils.js';

export function inlineBlock(block) {
  if (!block.classList.contains('inline')) return;

  const section = block.closest('.section');
  const blocks = Array.from(section.children);
  const blockIndex = blocks.findIndex((el) => el === block);

  const inlineSiblings = [block];
  let nextSibling = blocks[blockIndex + 1];

  while (nextSibling && nextSibling.classList.contains('inline')) {
    inlineSiblings.push(nextSibling);
    nextSibling = blocks[blockIndex + inlineSiblings.length];
  }

  if (inlineSiblings.length > 1) {
    const wrapper = createTag('div', { class: 'inline-wrapper content' });
    section.insertBefore(wrapper, inlineSiblings[0]);

    inlineSiblings.forEach((el) => {
      wrapper.appendChild(el);
    });
  } else {
    block.classList.add('content');
  }
}
