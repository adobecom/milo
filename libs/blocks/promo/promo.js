import { createTag, getConfig } from '../../utils/utils.js';

export default function decorate(block) {
  const div = block.firstElementChild;
  const a = block.querySelector('div > :last-child > a');
  if (a) a.classList.add('button');

  const closeButton = createTag('a', { class: 'promo-close' });

  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const closeIcon = createTag('img', { class: 'promo-close-icon', src: `${base}/blocks/promo/close.svg` });

  closeButton.addEventListener('click', () => {
    block.remove();
  });

  div.append(closeButton);
  closeButton.append(closeIcon);
}
