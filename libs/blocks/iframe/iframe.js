import { createTag } from '../../utils/utils.js';

export default function init(el) {
  const url = el.href ?? el.querySelector('a')?.href;
  el.classList.remove('iframe');
  const classes = [...el.classList].join(' ');

  if (!url) return;

  const iframe = createTag('iframe', { src: url, allowfullscreen: true });
  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
