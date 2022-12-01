import { createTag } from '../../utils/utils.js'

export default function init(blockElement) {
  const block = blockElement.querySelector('div');
  blockElement.innerHTML = '';

  const titleText = block.querySelector('h1').textContent;
  const titleEl = createTag('h1', { class: 'author-header-title' }, titleText);

  let pictureElement;
  let bioElement;
  const paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((el) => {
    if (el.querySelector('picture')) {
      pictureElement = el;
    } else {
      bioElement = el;
    }
  });

  const pictureWrapper = createTag('div', { class: 'author-header-img' }, pictureElement);
  const bioWrapper = createTag('div', { class: 'author-header-bio' }, bioElement);

  const social = block.querySelector('h2');
  const socialWrapper = createTag('div', { class: 'author-header-socials' }, social);

  const socialLinksList = block.querySelector('ul');
  socialWrapper.append(socialLinksList);

  blockElement.append(titleEl, pictureWrapper, bioWrapper, socialWrapper);

  const blockWrapper = blockElement.parentElement;
  blockWrapper?.classList.add('author-header-wrapper');
}
