import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

// const BLOCK_CLASS_ADDITIONS = ['con-block', 'container']; // add these classes to block
// const SECTION_CLASS_TRIGGERS = [
//   'stagger-ltr',
//   'stagger-rtl',
//   'three-up',
//   'four-up',
//   'parallax-move-up',

//   /* Parallax classes that are not used for news */
//   // 'parallax-scale-up',
//   // 'parallax-scale-down',
//   // 'parallax-blur',
//   // 'parallax-opacity',
// ];

function isLinkOnlyContent(linkContainer, aTag) {
  return aTag && aTag.textContent.trim() === linkContainer.textContent.trim();
}

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function formatHeader(row) {
  row.classList.add('news-headline');
  const headlineText = row.querySelector('h1, h2, h3, h4, h5, h6, p:not(:has(picture))');
  const headlinePicture = row.querySelector('picture');
  const headlineEl = createTag('div', { class: 'headline-text' }, headlineText);
  const headline = createTag('div', { class: 'headline' }, headlineEl);
  decorateBlockText(row);
  row.appendChild(headline);

  if (headlinePicture) {
    const iconImg = headlinePicture.querySelector('img');
    if (iconImg?.hasAttribute('src') && isSvgUrl(iconImg?.src)) iconImg.src = getFederatedUrl(iconImg.getAttribute('src'));
    iconImg.classList.add('icon');
    headline.prepend(iconImg);
  }
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
    decorateBlockText(row);
    const newsContents = row.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    newsContents.forEach((content, indx) => {
      const linkEl = content.querySelector('a');
      if (indx === 0) content.classList.add('news-item-headline');
      else if (isLinkOnlyContent(content, linkEl)) {
        content.classList.add('news-item-link');
        linkEl.classList.add('standalone-link');
        if (el.classList.contains('quiet')) linkEl.classList.add('quiet');
      } else content.classList.add('news-item-body');
    });
  });

  el.classList.add(`${el.querySelectorAll('.news-item').length % 2 === 0 ? 'four-up' : 'three-up'}`);

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
