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

export default async function init(el) {
  el.innerHTML = '';
  el.classList.add('content');
  const span = createTag('span');
  const readingSpeed = 200; // Assume that the average reader reads 200 words per minute
  const textLength = getTextLength(document.body);
  const readingTime = Math.ceil(textLength / readingSpeed);
  const config = getConfig();
  const format = await replaceKey('5-min-read', config);
  const readingTimeText = format.replace('5', readingTime);
  span.innerHTML = readingTimeText;
  el.append(span);
}
