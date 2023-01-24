import { createTag, getConfig } from '../../utils/utils.js';

export default function decorate(block) {
  const main = document.querySelector('main');
  const section = block.closest('.section');
  section.classList.add('sticky-wrapper');

  if (block.classList.contains('bottom')) {
    section.classList.add('sticky-bottom');
  }

  const div = block.firstElementChild;
  const a = block.querySelector('div > :last-child > a');
  if (a) a.classList.add('button');

  const closeButton = createTag('a', { class: 'sticky-close' });

  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const closeIcon = createTag('img', { class: 'sticky-close-icon', src: `${base}/blocks/sticky/close.svg` });

  closeButton.addEventListener('click', () => {
    section.remove();
  });

  div.append(closeButton);
  closeButton.append(closeIcon);
  main.prepend(section);
}
