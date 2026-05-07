import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { getFederatedUrl } from '../../../utils/utils.js';

function markStandaloneLinks(foreground) {
  foreground.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    const parentText = parent.textContent?.trim() ?? '';
    const linkText = a.textContent?.trim() ?? '';
    if (parentText === linkText) a.classList.add('standalone-link', 'label');
  });
}

const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');

function decorateCard(block, root) {
  const row = block.children[0];
  const foreground = row?.children[0];
  const media = row?.children[1];
  if (!foreground) return;

  foreground.classList.add('foreground');
  decorateBlockText(foreground, { heading: '4' });
  markStandaloneLinks(foreground);

  if (media) {
    media.classList.add('media');
    if (root.classList.contains('featured')) media.classList.add('parallax-featured-card-media');
    const pic = media.querySelector('picture');
    if (pic) pic.classList.add('parallax-scale-down');

    // Move icon from foreground to media overlay
    const firstCell = foreground.children[0];
    if (firstCell?.childElementCount === 1 && firstCell?.firstElementChild?.tagName === 'PICTURE') {
      const iconPicture = firstCell.firstElementChild;
      const iconImg = iconPicture.querySelector('img');
      if (iconImg?.hasAttribute('src') && isSvgUrl(iconImg?.src)) {
        iconImg.src = getFederatedUrl(iconImg.getAttribute('src'));
      }
      iconPicture.classList.add('icon');
      media.appendChild(iconPicture);
      firstCell.remove();
    }
  }
}

export default function init(el) {
  el.closest('.section').classList.add('base-card-section');
  decorateViewportContent(el, decorateCard);
}
