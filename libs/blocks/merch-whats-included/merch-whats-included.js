import { createTag } from '../../utils/utils.js';
import { loadMasComponent, MAS_MERCH_WHATS_INCLUDED } from '../merch/merch.js';

const init = async (el) => {
  // Load merch-whats-included component dynamically
  await loadMasComponent(MAS_MERCH_WHATS_INCLUDED);
  const styles = Array.from(el.classList);
  const mobileRows = styles.find((style) => /\d/.test(style));
  const heading = el.querySelector('h3, h4');
  const content = el.querySelector('.section');

  const contentSlot = createTag(
    'div',
    { slot: 'content' },
    content.innerHTML,
  );
  const whatsIncluded = createTag(
    'merch-whats-included',
    { mobileRows: mobileRows || 1 },
  );
  if (heading) {
    heading.setAttribute('slot', 'heading');
    whatsIncluded.appendChild(heading);
  }

  whatsIncluded.appendChild(contentSlot);
  const divsWithoutClass = contentSlot.querySelectorAll('div:not([class])');
  divsWithoutClass.forEach((div) => div.remove());
  el.replaceWith(whatsIncluded);
};

export default init;
