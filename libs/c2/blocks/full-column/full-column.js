import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

function decorate(block) {
  const row = block.children[0];
  const foreground = row?.children[0];
  const media = row?.children[1];

  if (foreground) {
    foreground.classList.add('foreground');

    const firstChild = foreground.children[0];
    if (firstChild?.childElementCount === 1 && firstChild.firstElementChild?.tagName === 'PICTURE') {
      const pic = firstChild.firstElementChild;
      const img = pic.querySelector('img');
      if (img?.src?.endsWith('.svg') || /\.svg(\?|$)/i.test(img?.getAttribute('src') || '')) {
        pic.classList.add('icon');
        media?.prepend(pic);
        firstChild.remove();
      }
    }

    decorateBlockText(foreground);
  }

  if (media) {
    media.classList.add('media');
  }
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
