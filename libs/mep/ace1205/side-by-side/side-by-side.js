import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const CARD_TYPE = ['card-overlay', 'card-stacked'];
const DEFAULT_TEXT_CONFIG = { heading: '6', body: 'md' };

function decorateCardText(foreground) {
  decorateBlockText(foreground, DEFAULT_TEXT_CONFIG);
  const headingP = foreground.querySelector('p:has(strong)');
  if (!headingP) return;
  headingP.classList.replace(`body-${DEFAULT_TEXT_CONFIG.body}`, `title-${DEFAULT_TEXT_CONFIG.heading}`);
}

function decorate(block) {
  const [mediaRow, textRow] = block.children;
  if (!mediaRow || !textRow) return;

  const medias = [...mediaRow.children];
  const texts = [...textRow.children];

  const cards = [];
  for (let i = 0; i < 2; i += 1) {
    const media = medias[i];
    const foreground = texts[i];
    media.classList.add('media');
    foreground.classList.add('foreground');
    decorateCardText(foreground);

    const variant = CARD_TYPE[i];
    const card = createTag('div', { class: `card ${variant}` });
    card.append(media, foreground);
    cards.push(card);
  }

  block.replaceChildren(...cards);
  if (!block.classList.contains('dark')) {
    block.querySelector('.card-overlay')?.classList.add('dark');
  }
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
