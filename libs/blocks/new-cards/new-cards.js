import { decorateBlockText } from '../../utils/decorate.js';

export default function init(el) {
  const [media, foreground] = [...el.children];
  media.classList.add('media');
  foreground.classList.add('foreground');
  decorateBlockText(el, ['xxs', 's', 'm']);
  const foregroundFirstChild = foreground.children[0].children[0];
  if (foregroundFirstChild
    && foregroundFirstChild.childElementCount === 1
    && foregroundFirstChild.firstElementChild.tagName === 'PICTURE') {
    foregroundFirstChild.classList.add('icon');
    media.appendChild(foregroundFirstChild);
  }

  el.querySelectorAll('.action-area > a').forEach((button) => {
    button.classList.remove('con-button');
    button.classList.remove('blue');
    button.classList.remove('outline');
  });
}
