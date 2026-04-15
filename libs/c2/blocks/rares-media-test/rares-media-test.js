import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function markStandaloneLinks(el) {
  el.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    if (parent.textContent?.trim() === a.textContent?.trim()) {
      a.classList.add('standalone-link', 'label');
    }
  });
}

function decorate(block) {
  const row = block.children[0];
  const foreground = row?.children[0];
  const media = row?.children[1];
  if (!foreground) return;

  foreground.classList.add('foreground');

  if (media) {
    media.classList.add('media');
    const firstEl = foreground.children[0];
    if (firstEl?.childElementCount === 1) {
      const pic = firstEl.querySelector('picture');
      const img = pic?.querySelector('img');
      if (img && isSvgUrl(img.getAttribute('src'))) {
        pic.classList.add('icon');
        media.appendChild(pic);
        firstEl.remove();
      }
    }
  }

  decorateBlockText(foreground, { heading: '4' });
  markStandaloneLinks(foreground);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
