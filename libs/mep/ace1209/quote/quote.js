import { decorateBlockText, decorateViewportContent, hangOpeningQuote } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorateQuote(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;
  decorateBlockText(cell, { heading: '1' });
  const [quote, name, role] = [...cell.querySelectorAll(':scope > :is(h1, h2, h3, h4, h5, h6, p)')];
  if (!quote) return;

  hangOpeningQuote(quote);
  const figure = createTag('figure', { class: 'foreground' }, createTag('blockquote', { class: 'quote-copy' }, quote));

  if (name) {
    name.classList.add('quote-name');
    const figcaption = createTag('figcaption', { class: 'quote-attribution' }, name);
    if (role) {
      role.classList.add('quote-role');
      figcaption.append(role);
    }
    figure.append(figcaption);
  }

  figure.append(createTag('div', { class: 'quote-frame', 'aria-hidden': 'true' }));
  block.replaceChildren(figure);
}

export default function init(el) {
  decorateViewportContent(el, decorateQuote);
}
