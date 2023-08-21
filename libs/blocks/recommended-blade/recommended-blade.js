import { createTag } from '../../utils/utils.js';

export default async function init(el) {
  const { textContent } = el;
  el.innerHTML = '';
  const textArr = textContent.trim().split(',');
  const name = textArr[1] || 'World';
  const hello = textArr[0] || 'Hello';
  const helloEl = createTag('h2', { class: 'hello-title'}, `${hello},`);
  const nameEl = createTag('p', { class: 'hello-name' }, name);
  el.append(helloEl, nameEl);
}
