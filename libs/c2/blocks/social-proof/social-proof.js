import { decorateBlockText, decorateViewportContent, hangOpeningQuote } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function createContent(foreground) {
  const heading = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;

  const content = createTag('div', { class: 'content' });
  [...foreground.children].forEach((child) => {
    if (child !== heading) content.appendChild(child);
  });
  foreground.appendChild(content);
}

function decorateSocialProof(block) {
  const firstRow = block.children[0];
  const secondRow = block.children[1];
  if (!firstRow) return;

  const foreground = firstRow.children[0];
  const bgCell = firstRow.children[1];
  const mediaCell = secondRow?.children[0];

  if (bgCell) {
    const bgColor = bgCell.textContent.trim();
    if (bgColor) firstRow.style.backgroundColor = bgColor;
    bgCell.remove();
  }

  if (mediaCell) {
    mediaCell.classList.add('media');
    firstRow.appendChild(mediaCell);
  }
  if (secondRow) secondRow.remove();

  if (foreground) {
    foreground.classList.add('foreground');
    decorateBlockText(foreground, { heading: '3', body: 'lg' });
    hangOpeningQuote(foreground.querySelector('h1, h2, h3, h4, h5, h6'));
    createContent(foreground);
  }
}

export default function init(el) {
  decorateViewportContent(el, decorateSocialProof);
}
