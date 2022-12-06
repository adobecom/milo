import { createTag } from '../../utils/utils.js';

export default function init(blockEl) {
  const pictures = blockEl.querySelectorAll('picture');
  blockEl.innerHTML = '';

  if (!pictures.length) return;

  pictures.forEach((pic) => {
    const figureEL = createTag('div', { class: 'figure' }, pic);
    blockEl.append(figureEL);
  });

  if (pictures.length > 1) {
    blockEl.classList.add('images-list', `images-list-${pictures.length}`);
  }
}
