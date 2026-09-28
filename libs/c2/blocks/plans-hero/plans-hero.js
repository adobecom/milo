import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const [textCell, mediaCell] = row.children;

  const media = createTag('div', { class: 'plans-hero-media' });
  const picture = mediaCell?.querySelector('picture');
  if (picture) media.append(picture);

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
