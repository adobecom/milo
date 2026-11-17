import { decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

// Autoblock links that become embeds later (YouTube, Vimeo), so they must never wrap media
const EMBED_LINK = 'a.link-block:not(.modal)';
const MEDIA = `.modal-img-link, a:has(picture), picture, .video-holder, video, .milo-video, ${EMBED_LINK}`;

const findMedia = (node) => [node, ...node.querySelectorAll(MEDIA)]
  .filter((el) => el.matches(MEDIA) && !el.parentElement.closest(MEDIA));

// Embed links need their own parent, otherwise isInTextNode() skips the embed
const toMediaItem = (el) => (el.matches(EMBED_LINK) ? createTag('div', { class: 'figure-c2-embed' }, el) : el);

function getWrappingLink(node) {
  const link = node.querySelector(':scope > a:only-child:not(.video-transcript-source)');
  return link && node.textContent.trim() === link.textContent.trim() ? link : null;
}

function buildCaption(paragraphs) {
  const caption = createTag('figcaption', { class: 'caption' }, paragraphs);
  caption.querySelectorAll('em').forEach((em) => em.replaceWith(...em.childNodes));
  return caption;
}

function buildFigure(cell) {
  const figure = createTag('figure');
  const captions = [];
  [...cell.children].forEach((child) => {
    const media = findMedia(child);
    figure.append(...media.map(toMediaItem));
    if (media.includes(child)) return;

    if (child.matches('em, :has(em)')) {
      captions.push(child);
      return;
    }

    const link = getWrappingLink(child);
    const previous = figure.lastElementChild;
    if (link && previous?.matches('picture')) {
      link.replaceChildren(previous);
      figure.append(link);
    } else if (child.matches('a, :has(a)')) {
      figure.append(child);
    }
  });
  if (captions.length) figure.append(buildCaption(captions));
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
