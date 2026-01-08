/*
Templates - featured story
*/

import { createTag, loadBlock } from '../../utils/utils.js';

async function loadSectionMetadata(sectionMetadata, featuredSection) {
  sectionMetadata.hidden = true;
  featuredSection.append(sectionMetadata);
  if (sectionMetadata.getAttribute('data-block-status') !== 'loaded') {
    await loadBlock(sectionMetadata);
  }
  sectionMetadata.hidden = false;
}

export default async function init() {
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
  const col1 = createTag('div', { class: 'col-1' }, section);
  const col2 = createTag('div', { class: 'col-2' }, nextSection);
  featuredSection.insertAdjacentElement('afterbegin', col1);
  featuredSection.insertAdjacentElement('beforeend', col2);
  if (!sectionMetadata) return;
  await loadSectionMetadata(sectionMetadata, featuredSection);
}

init();
