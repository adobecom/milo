/*
Templates - featured story
*/

import { createTag } from '../../utils/utils.js';

function init() {
  const i = 1;
  const sections = document.querySelectorAll('body > main > div.section');
  if (!sections.length > i + 1) return;
  const section = sections[i];
  const nextSection = section.nextElementSibling;
  if (!nextSection) return;
  section.classList.add('section-1');
  nextSection.classList.add('section-2');
  const sectionWrapper = createTag('div', { class: 'featured-story-wrapper container' });
  const featuredSection = createTag('div', { class: 'section', template: 'featured-story' }, sectionWrapper);
  section.insertAdjacentElement('afterend', featuredSection);
  const col1 = createTag('div', { class: 'col-1' }, section);
  const col2 = createTag('div', { class: 'col-2' }, nextSection);
  sectionWrapper.insertAdjacentElement('afterbegin', col1);
  sectionWrapper.insertAdjacentElement('beforeend', col2);
}

init();
