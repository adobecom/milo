import { createTag } from '../../../utils/utils.js';
import { decorateBlockKit } from '../../../utils/decorate.js';

const boxKits = {
  'foo-kit': ['col-12', 'constrained', 'spacing-md', 'parallax-move-up'],
  'bar-kit': ['col-2', 'spacing-md', 'parallax-stagger-ltr'],
  'baz-kit': ['col-2', 'spacing-md', 'parallax-stagger-rtl'],
};

async function decorate(el) {
  decorateBlockKit(el, boxKits);
  const colClass = [...el.classList].find((cls) => cls.startsWith('col-'));
  const numChildren = colClass ? parseInt(colClass.split('-')[1], 10) : 12;
  if (numChildren > 1) el.classList.add('container');
  const { innerText } = el;
  el.innerText = '';

  for (let i = 0; i < numChildren; i += 1) {
    const child = createTag('div', { class: 'box-inner' }, innerText);
    el.appendChild(child);
  }

  /* NOTE: Could this be a shared method to which you'd pass the elements to stagger? */
  if (el.classList.contains('parallax-stagger-rtl') || el.classList.contains('parallax-stagger-ltr')) {
    const staggerElements = el.querySelectorAll('.box-inner');
    let staggerClass = '';
    staggerElements.forEach((elem) => {
      staggerClass = el.classList.contains('parallax-stagger-ltr') ? 'parallax-stagger-ltr' : 'parallax-stagger-rtl';
      elem.classList.add(staggerClass);
    });
    el.classList.remove(staggerClass);
  }
}

export default function init(el) {
  decorate(el);
}
