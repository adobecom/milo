import { decorateBlockText, decorateViewportContent, hangOpeningQuote } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const HEADING = '3';
const BODY = 'lg';

function createContent(foreground) {
  const heading = foreground?.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;
  const content = createTag('div', { class: 'content' });
  [...foreground.children].forEach((child) => {
    if (child !== heading) content.appendChild(child);
  });
  foreground.appendChild(content);
}

function decorateBlockQuote(blockQuote) {
  const figure = createTag('figure');
  figure.append(blockQuote);
  const [quote, ...captions] = [...blockQuote.children];
  hangOpeningQuote(quote);
  quote.classList.add(`heading-${HEADING}`);
  const caption = createTag('figcaption', { class: `body-${BODY}` }, [
    ...captions.map((cap) => {
      const text = cap.textContent;
      cap.remove();
      return createTag('span', {}, text);
    }),
  ]);
  figure.appendChild(caption);
  return figure;
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
  const blockQuote = foreground.querySelector('blockquote');
  if (blockQuote) {
    const qoute = decorateBlockQuote(blockQuote);
    foreground.append(qoute);
    return;
  }
  decorateBlockText(foreground, { heading: HEADING, body: BODY });
  hangOpeningQuote(foreground?.querySelector('h1, h2, h3, h4, h5, h6'));
  createContent(foreground);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
