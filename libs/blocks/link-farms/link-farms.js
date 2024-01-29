import { createTag, loadStyle } from '../../utils/utils.js';

export default function decorateLinkFarms(el) {
  loadStyle('/libs/blocks/link-farms/link-farms.css');
  const foregroundDiv = el.querySelectorAll('.foreground')[1];
  const count = foregroundDiv.querySelectorAll('h3').length;
  foregroundDiv.querySelectorAll('div').forEach((divElem, index) => {
    const h3 = divElem.querySelector('h3');
    if (count) {
      if (h3) {
        const sibling = index % 2 === 0
          ? divElem.nextElementSibling
          : divElem.previousElementSibling;
        sibling?.classList.add('hspace');
        if (index > 0) divElem.classList.add('has-heading');
        if (index > 1) foregroundDiv.classList.add('gap-xl');
      } else {
        const headingElem = createTag('h3', { class: 'no-heading' });
        divElem.insertBefore(headingElem, divElem.firstChild);
      }
    }
  });
}
