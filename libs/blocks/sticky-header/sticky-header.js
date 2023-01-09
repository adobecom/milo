import { createTag, getConfig } from '../../utils/utils.js';

export default function decorate($block) {
  const $header = document.querySelector('header');
  const $div = $block.firstElementChild;
  const $a = $block.querySelector('a');
  const $close = createTag('a', { class: 'sticky-header-close' });

  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const $closeIcon = createTag('img', { class: 'sticky-header-close-icon', src: `${base}/blocks/sticky-header/close.svg` });

  $header.parentNode.insertBefore($block, $header.nextElementSibling);

  $a.classList.add('button');
  $a.target = '_blank';

  $close.addEventListener('click', () => {
    $block.remove();
  });

  $div.append($close);
  $close.append($closeIcon);
}
