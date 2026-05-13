import { decorateBlockText } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

function isLinkOnlyContent(linkContainer, aTag) {
  return aTag && aTag.textContent.trim() === linkContainer.textContent.trim();
}

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function formatHeader(row) {
  row.classList.add('news-headline');
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
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length === 1) return;
  const [head, ...tail] = rows;
  formatHeader(head);
  rows = tail;
  const upsMap = { 2: 'two-up', 3: 'three-up', 4: 'four-up' };
  // TODO: Infer parallax class from authoring
  el.appendChild(createTag('div', { class: `news-items parallax-stagger-ltr ${upsMap[rows.length || 3]}` }, rows));
  rows.forEach((row) => {
    row.classList.add('news-item');
    row.querySelector(':scope > div:not([class])').classList.add('foreground');
    decorateBlockText(row, { heading: '4' });
    const contents = row.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    contents.forEach((content, indx) => {
      const linkEl = content.querySelector('a');
      if (indx === 0) content.classList.add('news-item-headline');
      else if (isLinkOnlyContent(content, linkEl)) {
        content.classList.add('news-item-link');
        linkEl.classList.add('standalone-link', 'label', `${el.classList.contains('quiet') ? 'quiet' : ''}`);
      } else content.classList.add('news-item-body');
    });
  });
}
