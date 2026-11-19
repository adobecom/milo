import { decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const MEDIA_TAGS = ['PICTURE', 'VIDEO', 'A'];

const isStandaloneMedia = (node) => MEDIA_TAGS.includes(node.nodeName)
  || node.matches('span.modal-img-link');

function buildCaption(em) {
  return createTag('figcaption', { class: 'caption' }, [...em.childNodes]);
}

function moveContent(child, figure) {
  const modalLink = child.querySelector('.modal-img-link');
  if (modalLink) figure.prepend(modalLink);

  const picture = child.querySelector('picture');
  if (picture) figure.prepend(picture);

  if (child.querySelector('video')) {
    figure.prepend(child.querySelector('.video-container, .pause-play-wrapper, video'));
  }

  const caption = child.querySelector('em');
  if (caption) figure.append(buildCaption(caption));

  const link = child.querySelector('a');
  if (!link) return;
  const media = figure.querySelector('picture') ?? figure.querySelector('video');
  if (media && !link.classList.contains('pause-play-wrapper')) link.replaceChildren(media);
  // Embed links (e.g. YouTube) need their own parent, otherwise isInTextNode() skips the embed
  figure.prepend(media ? link : createTag('div', { class: 'figure-c2-embed' }, link));
}

function buildFigure(cell) {
  const figure = createTag('figure');
  [...cell.children].forEach((child) => {
    if (isStandaloneMedia(child)) figure.prepend(child);
    else moveContent(child, figure);
  });
  return figure;
}

function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => cell.children.length || cell.textContent.trim());
  block.replaceChildren(...cells.map(buildFigure));
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
