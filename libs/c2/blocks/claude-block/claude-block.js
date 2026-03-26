import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function markStandaloneLinks(el) {
  el.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    if (parent.textContent?.trim() === a.textContent?.trim()) {
      a.classList.add('standalone-link', 'label');
    }
  });
}

function decorate(block, root) {
  const row = block.children[0];
  const foreground = row?.children[0];
  const mediaSrc = row?.children[1];

  if (!foreground) return;

  // Extract app icon picture from the first <p> in foreground
  const firstP = foreground.querySelector('p:first-child');
  const iconPic = firstP?.querySelector('picture');
  if (iconPic && firstP) {
    iconPic.classList.add('icon');
    firstP.remove();
  }

  // Build media card: background image + icon overlay
  if (mediaSrc) {
    mediaSrc.classList.add('media');
    const bgPic = mediaSrc.querySelector('picture');
    if (bgPic) bgPic.classList.add('background-image');
    if (iconPic) mediaSrc.appendChild(iconPic);
  }

  // Decorate text content
  foreground.classList.add('foreground');
  decorateBlockText(foreground, { heading: '4' });
  markStandaloneLinks(foreground);

  // Wrap heading + body in a text group for the tablet+ row layout
  const ctaEl = foreground.querySelector('p:has(> a.standalone-link)');
  const textEls = [...foreground.children].filter((el) => el !== ctaEl);
  if (textEls.length) {
    const textGroup = createTag('div', { class: 'text-group' });
    textGroup.append(...textEls);
    foreground.prepend(textGroup);
  }
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
