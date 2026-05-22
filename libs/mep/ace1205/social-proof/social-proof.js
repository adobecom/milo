import { decorateBlockText, decorateViewportContent, hangOpeningQuote } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function createContent(foreground) {
  const heading = foreground?.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;

  const content = createTag('div', { class: 'content' });
  [...foreground.children].forEach((child) => {
    if (child !== heading) content.appendChild(child);
  });
  foreground.appendChild(content);
}

function decorate(block) {
  const firstRow = block.children[0];
  const secondRow = block.children[1];
  if (!firstRow) return;

  const [foreground, bgCell] = firstRow.children;

  const bgColor = bgCell?.textContent.trim();
  if (bgColor) firstRow.style.backgroundColor = bgColor;
  bgCell?.remove();

  const mediaCell = secondRow?.children[0];
  mediaCell.classList.add('media');
  firstRow.appendChild(mediaCell);
  secondRow?.remove();

  foreground?.classList.add('foreground');
  decorateBlockText(foreground, { heading: '3', body: 'lg' });
  hangOpeningQuote(foreground?.querySelector('h1, h2, h3, h4, h5, h6'));
  createContent(foreground);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
