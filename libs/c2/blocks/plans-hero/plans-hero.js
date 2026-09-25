import { decorateBlockText, decorateViewportContent, handleFocalpoint } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [textCell, mediaCell] = row.children;

  const media = createTag('div', { class: 'plans-hero-media' });
  const picture = mediaCell?.querySelector('picture');
<<<<<<< HEAD
  if (picture) media.append(picture);
=======
  if (picture) {
    picture.querySelector('img')?.setAttribute('loading', 'eager');
    handleFocalpoint(picture, mediaCell, true);
    media.append(picture);
  }
>>>>>>> 6857fcf37 (ACE1209/Creator Rollout -  Batch #1)

  if (textCell) {
    decorateBlockText(textCell, { heading: '2', body: 'md' });
    textCell.classList.add('plans-hero-content');
  }

  block.replaceChildren(media, textCell ?? createTag('div', { class: 'plans-hero-content' }));
}

export default function init(el) {
  el.classList.add('container');
  decorateViewportContent(el, decorate);
}
