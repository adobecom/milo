import { createTag, getConfig } from '../../utils/utils.js';

export default function decorate(block) {
  const header = document.querySelector('header');
  const div = block.firstElementChild;
  const a = block.querySelector('div > :last-child > a');
  if (a) a.classList.add('button');

  const closeButton = createTag('a', { class: 'sticky-header-close' });

  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const closeIcon = createTag('img', { class: 'sticky-header-close-icon', src: `${base}/blocks/sticky-header/close.svg` });

  header.parentNode.insertBefore(block, header.nextElementSibling);

  closeButton.addEventListener('click', () => {
    block.remove();
  });

  div.append(closeButton);
  closeButton.append(closeIcon);
}
