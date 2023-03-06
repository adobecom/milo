import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

function getTextLength(node) {
  let textLength = 0;
  for (const childNode of node.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      if (childNode.textContent.match(/\S+/g)) {
        const wordCount = childNode.textContent.match(/\S+/g).length;
        textLength += wordCount;
      }
    } else {
      textLength += getTextLength(childNode);
    }
  }
  return textLength;
}

export default async function init(block) {
  block.innerHTML = '';
  if (!block.classList.contains('inline')) {
    block.classList.add('content');
  }
  const span = createTag('span');
  const readingSpeed = 200; // Assume that the average reader reads 200 words per minute
  const textLength = getTextLength(document.body);
  const readingTime = Math.ceil(textLength / readingSpeed);
  const config = getConfig();
  const placeholderKey = (readingTime > 1) ? '5-min-read' : '1-min-read';
  const format = await replaceKey(placeholderKey, config);
  const readingTimeText = format.replace(/[1,5]/g, readingTime);
  span.innerHTML = readingTimeText;
  block.append(span);
  if (block.classList.contains('inline')) {
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
}
