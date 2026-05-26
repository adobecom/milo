import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function hangOpeningQuote(header) {
  if (!header) return;
  const openingQuotes = /^(\p{Pi})/u;
  const match = header.textContent.match(openingQuotes);
  if (!match) return;
  const quote = match[1];
  header.textContent = header.textContent.slice(1);
  const span = createTag('span', { class: 'opening-quote' }, quote);
  header.prepend(span);
}

function decorateText(el) {
  decorateBlockText(el);
  const firstText = el?.querySelector('h1, h2, h3, h4, h5, h6, p');
  hangOpeningQuote(firstText);
}

function promoteParagraphHeading(content, headingSize = '2') {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const firstP = content.querySelector('p');
  if (!firstP) return;
  const bodyClass = [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, `heading-${headingSize}`);
}

function decorate(block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  promoteParagraphHeading(content);
}

function decorateVideoVariant(container) {
  const row = container.children[0];
  if (!row) return;

  const [ctaCell, mediaCell] = [...row.children];

  if (mediaCell) {
    mediaCell.classList.add('media');
    container.append(mediaCell);
  }

  if (ctaCell) {
    decorateBlockText(ctaCell);
    ctaCell.classList.add('cta-area');
    container.append(ctaCell);
  }

  row.remove();
  container.querySelector('.action-area')?.classList.add('dark');
  container.querySelector('.con-button.blue')?.classList.replace('blue', 'fill');
}

export default function init(el) {
  decorateViewportContent(el, el.classList.contains('video') ? decorateVideoVariant : decorate);
}
