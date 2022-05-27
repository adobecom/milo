import { loadStyle } from './utils.js';

function loadStyles(size, color, component) {
  loadStyle(`/libs/deps/@spectrum-css/vars/dist/spectrum-${color}.css`);
  loadStyle(`/libs/deps/@spectrum-css/${component}/dist/index-vars.css`);
}

function addEvents(el) {
  el.addEventListener('focus', () => { el.classList.add('focus-ring'); });
  el.addEventListener('focusout', () => { el.classList.remove('focus-ring'); });
}

export function getLink(a, color, size) {
  // loadStyles(size, color, 'link');
  a.className = `spectrum-Link spectrum-Link--size${size.toUpperCase()}`;
  addEvents(a);
  return a;
}

export function getButton(a, color, size) {
  // loadStyles(size, color, 'button');
  const parent = a.parentElement;
  const variant = parent.nodeName === 'STRONG' ? 'accent' : 'primary';
  let style = 'fill';
  if (variant === 'primary' && !a.querySelector('strong')) {
    style = 'outline';
  }

  a.innerHTML = `<span class="spectrum-Button-label">${a.textContent}</span>`;

  const classes = [
    'spectrum-Button',
    `spectrum-Button--${style}`,
    `spectrum-Button--${variant}`,
    `spectrum-Button--size${size}`,
  ];

  a.classList.add(...classes);
  addEvents(a);

  parent.parentElement.replaceChild(a, parent);

  return a;
}

export function getAction(a, color, size) {
  const baseColor = color.split('--').pop();
  const parentName = a.parentElement.nodeName;
  const action = parentName === 'STRONG' || parentName === 'EM' ? 'button' : 'link';
  if (action === 'button') {
    return getButton(a, baseColor, size);
  }
  return getLink(a, baseColor, size);
}

export function decorateButtons(el, color, size = 'M') {
  loadStyle('/libs/deps/@spectrum-css/vars/dist/spectrum-global.css');
  loadStyle('/libs/deps/@spectrum-css/vars/dist/spectrum-medium.css');
  loadStyle('/libs/deps/@spectrum-css/page/dist/index-vars.css');

  const anchors = el.querySelectorAll('a');
  if (anchors.length === 0) return [];
  return [...anchors].map((a) => getAction(a, color, size));
}
