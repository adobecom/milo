import { createTag } from '../../utils/utils.js';

export default function init(blockElement) {
  const block = blockElement.querySelector('div');
  blockElement.innerHTML = '';

  const titleEl = block.querySelector('h1');
  titleEl.classList.add('author-header-title');

  let pictureElement;
  let bioElement;
  const paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((el) => {
    const picture = el.querySelector('picture');
    if (picture) {
      pictureElement = picture;
    } else {
      bioElement = el;
    }
  });

  const pictureWrapper = createTag('div', { class: 'author-header-img' }, pictureElement);
  const bioWrapper = createTag('div', { class: 'author-header-bio' }, bioElement);

  blockElement.append(titleEl, pictureWrapper, bioWrapper);

  const social = block.querySelector('h2');
  if (social) {
    const socialWrapper = createTag('div', { class: 'author-header-socials' }, social);

    const socialLinksList = block.querySelector('ul');
    socialWrapper.append(socialLinksList);
    blockElement.append(socialWrapper);
  }

  const blockWrapper = blockElement.parentElement;
  blockWrapper?.classList.add('author-header-wrapper');
}
