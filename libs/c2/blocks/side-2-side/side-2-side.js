import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const VARIANTS = ['card-overlay', 'card-stacked'];

function decorateCardText(foreground) {
  decorateBlockText(foreground, { heading: '6', body: 'md' });
  const firstP = foreground.querySelector('p');
  if (!firstP) return;
  firstP.classList.remove('body-md');
  firstP.classList.add('title-6');
}

function decorate(block) {
  const [mediaRow, textRow] = block.children;
  if (!mediaRow || !textRow) return;

  const medias = [...mediaRow.children];
  const texts = [...textRow.children];
  const cardCount = Math.min(medias.length, texts.length);
  if (!cardCount) return;

  const cards = [];
  for (let i = 0; i < cardCount; i += 1) {
    const media = medias[i];
    const foreground = texts[i];
    media.classList.add('media');
    foreground.classList.add('foreground');
    decorateCardText(foreground);

    const variant = VARIANTS[i] || VARIANTS[VARIANTS.length - 1];
    const card = createTag('div', { class: `card ${variant}` });
    card.append(media, foreground);
    cards.push(card);
  }

  block.replaceChildren(...cards);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
