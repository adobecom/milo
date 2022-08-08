/*
Template: Sidebar
*/

import { createTag } from "../../utils/utils.js";

function templateSidebar() {
  const i = 1;
  const sections = document.querySelectorAll('body > main > div.section');
  if (!sections.length > i + 1) return;
  const section = sections[i];
  const nextSection = section.nextElementSibling;
  if (!nextSection) return;
  section.classList.add('section-1');
  nextSection.classList.add('section-2');
  const sidebarWrapper = createTag( 'div', { class: 'sidebar-wrapper container' });
  const sidebarSection = createTag( 'div', { class: 'section-sidebar' }, sidebarWrapper);
  section.insertAdjacentElement('afterend', sidebarSection);
  const col1 = createTag( 'div', { class: 'sidebar-col-1' }, section);
  const col2 = createTag( 'div', { class: 'sidebar-col-2' }, nextSection);
  sidebarWrapper.insertAdjacentElement('afterbegin', col1);
  sidebarWrapper.insertAdjacentElement('beforeend', col2);
  if (nextSection.style) sidebarSection.style.backgroundColor = nextSection.style.backgroundColor;
}

export default templateSidebar;

templateSidebar();
