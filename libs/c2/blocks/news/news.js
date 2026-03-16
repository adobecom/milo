import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

const BLOCK_CLASS_ADDITIONS = ['parallax-stagger-ltr'];
const BLOCK_SIZING_C2 = ['md', 'md', 'md'];

function isLinkOnlyContent(linkContainer, aTag) {
  return aTag && aTag.textContent.trim() === linkContainer.textContent.trim();
}

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function formatHeader(row) {
  row.classList.add('news-headline');
  decorateBlockText(row, BLOCK_SIZING_C2);
  const headlineText = row.querySelector('h1, h2, h3, h4, h5, h6, p:not(:has(picture))');
  const headlinePicture = row.querySelector('picture');
  headlineText.classList.add('eyebrow');
  const headlineEl = createTag('div', { class: 'headline-text' }, headlineText);
  const headline = createTag('div', { class: 'headline' }, headlineEl);
  row.appendChild(headline);

  if (headlinePicture) {
    const iconImg = headlinePicture.querySelector('img');
    if (iconImg?.hasAttribute('src') && isSvgUrl(iconImg?.src)) iconImg.src = getFederatedUrl(iconImg.getAttribute('src'));
    iconImg.classList.add('icon');
    headline.prepend(headlinePicture);
  }
  row.firstElementChild.remove();
}

export default async function init(el) {
  el.classList.add(...BLOCK_CLASS_ADDITIONS);
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length === 1) return;
  const [head, ...tail] = rows;
  formatHeader(head);
  rows = tail;
  rows.forEach((row) => {
    row.classList.add('news-item');
    row.querySelector(':scope > div:not([class])').classList.add('foreground');
    decorateBlockText(row, BLOCK_SIZING_C2);
    const contents = row.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    contents.forEach((content, indx) => {
      const linkEl = content.querySelector('a');
      if (indx === 0) content.classList.add('news-item-headline');
      else if (isLinkOnlyContent(content, linkEl)) {
        content.classList.add('news-item-link', 'label');
        linkEl.classList.add('standalone-link', `${el.classList.contains('quiet') ? 'quiet' : ''}`);
      } else content.classList.add('news-item-body');
    });
  });
  el.classList.add(`${el.querySelectorAll('.news-item').length % 2 === 0 ? 'four-up' : 'three-up'}`);
}
