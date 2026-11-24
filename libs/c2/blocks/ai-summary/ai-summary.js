import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

function decorate(container) {
  [...container.children].forEach((row, index) => {
    const isImage = index === 0 && row.querySelector('picture, img');
    row.classList.add(isImage ? 'ai-summary-image' : 'ai-summary-content');
    if (!isImage) decorateBlockText(row, { heading: '5', body: 'lg' });
  });
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
