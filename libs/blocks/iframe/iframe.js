import { createTag } from '../../utils/utils.js';

export default function init(el) {
  const url = el.href ?? el.querySelector('a')?.href;

  if (!url) return;

  const iframe = createTag('iframe', { src: url, allowfullscreen: true })
  const embed = createTag('div', { class: 'milo-iframe' }, iframe);

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
