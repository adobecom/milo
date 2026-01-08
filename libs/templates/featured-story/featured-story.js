/*
Templates - featured story
*/

import { createTag } from '../../utils/utils.js';

export default function init() {
  const i = 1;
  const sections = document.querySelectorAll('body > main > div.section');
  if (!sections.length > i + 1) return;
  const section = sections[i];
  const sectionMetadata = section.querySelector('.section-metadata');
  const nextSection = section.nextElementSibling;
  if (!nextSection) return;
  section.classList.add('section-1');
  nextSection.classList.add('section-2');
  const featuredSection = createTag('div', {
    class: `section featured-story-wrapper${sectionMetadata ? ' has-section-metadata' : ''}`,
    template: 'featured-story',
  });
  section.insertAdjacentElement('afterend', featuredSection);
  featuredSection.insertAdjacentElement('afterbegin', section);
  featuredSection.insertAdjacentElement('beforeend', nextSection);
  if (sectionMetadata) featuredSection.append(sectionMetadata);
}

init();
