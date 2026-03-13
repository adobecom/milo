import { createTag } from '../../../utils/utils.js';

const BLOCK_CLASS_ADDITIONS = ['con-block', 'container']; // add these classes to block
const SECTION_CLASS_TRIGGERS = [
  'stagger-ltr',
  'stagger-rtl',
  'three-up',
  'four-up',
  'parallax-move-up',

  /* Parallax classes that are not used for news */
  // 'parallax-scale-up',
  // 'parallax-scale-down',
  // 'parallax-blur',
  // 'parallax-opacity',
];

function isLinkOnlyContent(linkContainer, aTag) {
  return aTag && aTag.textContent.trim() === linkContainer.textContent.trim();
}

function formatHeader(row) {
  row.classList.add('news-headline');
  const headlineText = row.textContent.trim();
  const icon = row.querySelector('picture');
  const headlineEl = createTag('div', { class: 'headline-text' }, `<p>${headlineText}</p>`);
  const headline = createTag('div', { class: 'headline' }, headlineEl);
  if (icon) {
    const iconEl = createTag('div', { class: 'icon' }, icon);
    headline.prepend(iconEl);
  }
  row.appendChild(headline);
  row.firstElementChild.remove();
}

export default async function init(el) {
  el.classList.add(...BLOCK_CLASS_ADDITIONS);
  const sectionClasses = el.closest('.section').classList;
  const sectionMatches = SECTION_CLASS_TRIGGERS.filter((cls) => sectionClasses.contains(cls));
  sectionClasses.remove(...sectionMatches);
  const helperClasses = [];
  helperClasses.push(...sectionMatches);
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length === 1) return;
  const [head, ...tail] = rows;
  formatHeader(head);
  rows = tail;
  rows.forEach((row) => {
    row.classList.add('news-item');
    const pTags = row.querySelectorAll('p');
    pTags.forEach((p, indx) => {
      const linkEl = p.querySelector('a');
      if (indx === 0) p.classList.add('news-item-headline');
      else if (isLinkOnlyContent(p, linkEl)) {
        p.classList.add('news-item-link');
        linkEl.classList.add('standalone-link');
        if (el.classList.contains('quiet')) linkEl.classList.add('quiet');
      } else p.classList.add('news-item-body');
    });
  });

  // Transfer section classes to block or news-item containters
  if (helperClasses.length) {
    const upClass = helperClasses.find((val) => val.endsWith('-up')) || 'three-up';
    el.classList.add(upClass);
    const staggerClass = helperClasses.find((val) => val.startsWith('stagger-'));
    if (staggerClass) {
      el.classList.remove(`parallax-${staggerClass}`);
      const blockItems = el.querySelectorAll('.news-item');
      blockItems.forEach((item) => item.classList.add(`parallax-${staggerClass}`));
    }
    const parallaxClasses = helperClasses.filter((val) => val.startsWith('parallax-'));
    if (parallaxClasses.length) parallaxClasses.forEach((cls) => el.classList.add(cls));
  }
}
