import { decorateBlockText } from '../../../utils/decorate.js';

export default function init(el) {
  el.closest('.section').classList.add('new-cards-section');
  const wrapper = el.children[0];
  const [foreground, media] = [...wrapper.children];
  media.classList.add('media');
  foreground.classList.add('foreground');
  decorateBlockText(el, ['xxs', 's', 'm']);
  const firstCell = foreground.children[0];
  if (firstCell?.childElementCount === 1
    && firstCell?.firstElementChild?.tagName === 'PICTURE') {
    const iconPicture = firstCell.firstElementChild;
    iconPicture.classList.add('icon');
    media.appendChild(iconPicture);
  }
}
