import { decorateButtons } from '../../utils/decorate.js';

export default function init(el) {
  decorateButtons(el.children[0].children[0]);
  el.children[0].children[0].classList.add('overlay-section-text');
  el.children[0].children[1].classList.add('overlay-section-video');
  const section = el.closest('.section');
  const sectionBefore = section?.previousElementSibling;
  const sectionAfter = section?.nextElementSibling;
  sectionBefore.classList.add('bottom-radius');
  sectionAfter.classList.add('top-radius');
}
