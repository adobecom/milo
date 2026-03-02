import { decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag, getConfig } from '../../../utils/utils.js';

export function handleImageLoad(el, image) {
  if (image && !image.complete) {
    el.style.visibility = 'hidden';
    image.addEventListener('load', () => {
      el.style.visibility = 'visible';
    });
    image.addEventListener('error', () => {
      image.style.visibility = 'hidden';
      el.style.visibility = 'visible';
    });
  }
}

function createNavSectionOLD(el) {
  const navItems = el.querySelectorAll(':scope > div');

  navItems.forEach((navItem) => {
    if (navItem.children.length === 2) {
      // add nav item to latest section nav group
      const latestGroupListEl = el.querySelector('.section-nav-group:last-child ul');
      const linkText = navItem.children[0].textContent.trim();
      const linkHref = `#${navItem.children[1].textContent.trim().toLowerCase().replace(/\s+/g, '-')}`;
      const linkEl = createTag('div', { class: 'section-nav-list-item-link' }, `<a href="${linkHref}">${linkText}</a>`);
      // const liEl = createTag('li', { class: 'section-nav-list-item' }, linkEl);

      // handle images
      const hasImage = navItem.children[0].querySelector('picture');
      if (hasImage) {
        const imageEl = createTag('div', { class: 'section-nav-list-item-image' }, hasImage);
        linkEl.prepend(imageEl);
      }
      navItem.remove();
      const liEl = createTag('li', { class: 'section-nav-list-item' }, linkEl);
      latestGroupListEl.append(liEl);
    } else {
      // create new section nav group
      const groupTitle = navItem.textContent.trim();
      const groupContainer = createTag('div', { class: 'section-nav-group' });
      const groupTitleEl = createTag('div', { class: 'section-nav-group-title' }, `<p>${groupTitle}</p>`);
      const groupListEl = createTag('div', { class: 'section-nav-group-list' }, '<ul></ul>');
      groupContainer.append(groupTitleEl, groupListEl);
      navItem.remove();
      el.append(groupContainer);
    }
  });
  // create dividers between section nav groups
  const dividerEl = createTag('div', { class: 'section-nav-divider' }, '<hr>');
  const createdGroups = el.querySelectorAll('.section-nav-group');
  createdGroups.forEach((group, index) => {
    if (index < createdGroups.length - 1) group.after(dividerEl);
  });
}

function createNavSection(el) {
  const navItems = el.querySelectorAll(':scope > div');
  let latestGroupListEl;

  navItems.forEach((navItem) => {
    const linkItem = navItem.querySelector('a');
    if (linkItem) {
      const linkText = linkItem.textContent.trim();
      const linkHref = linkItem.href;
      const linkEl = createTag('div', { class: 'section-nav-list-item-link' }, `<a href="${linkHref}">${linkText}</a>`);
      const hasImage = navItem.querySelector('picture');
      if (hasImage) {
        const imageEl = createTag('div', { class: 'section-nav-list-item-image' }, hasImage);
        linkEl.prepend(imageEl);
        handleImageLoad(imageEl, imageEl.querySelector('img'));
      }
      navItem.remove();
      const liEl = createTag('li', { class: 'section-nav-list-item' }, linkEl);
      latestGroupListEl.append(liEl);
    } else {
      const groupTitle = navItem.textContent.trim();
      const groupContainer = createTag('div', { class: 'section-nav-group' });
      const groupTitleEl = createTag('div', { class: 'section-nav-group-title' }, `<p>${groupTitle}</p>`);
      const groupListEl = createTag('div', { class: 'section-nav-group-list' }, '<ul></ul>');
      groupContainer.append(groupTitleEl, groupListEl);
      navItem.remove();
      el.append(groupContainer);
      latestGroupListEl = el.querySelector('.section-nav-group:last-child ul');
    }
  });
  // create dividers between section nav groups
  const dividerEl = createTag('div', { class: 'section-nav-divider' }, '<hr>');
  const createdGroups = el.querySelectorAll('.section-nav-group');
  createdGroups.forEach((group, index) => {
    if (index < createdGroups.length - 1) group.after(dividerEl);
  });
}

export default function init(el) {
  const config = getConfig();
  console.log(config);
  el.classList.add('section-nav');
  createNavSection(el);
  decorateTextOverrides(el);
}
