import { decorateBlockText } from '../../../utils/decorate.js';

export default function init(el) {
  el.closest('.section').classList.add('new-cards-section');
  const [media, foreground] = [...el.children];
  media.classList.add('media');
  foreground.classList.add('foreground');
  decorateBlockText(el, ['xxs', 's', 'm']);
  const foregroundFirstChild = foreground.children[0].children[0];
  if (foregroundFirstChild?.childElementCount === 1
    && foregroundFirstChild?.firstElementChild.tagName === 'PICTURE') {
    foregroundFirstChild.classList.add('icon');
    media.appendChild(foregroundFirstChild);
  }
}
