import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

function decorate(block) {
  const row = block.children[0];
  if (!row) return;
  const foreground = row.children[0];
  const media = row.children[1];
  foreground?.classList.add('foreground');
  media?.classList.add('media');
  decorateBlockText(foreground, { heading: '4' });

  const icon = foreground?.querySelector(':scope > p:first-child picture');
  if (icon) {
    const iconWrapper = icon.closest('p');
    iconWrapper?.classList.add('icon');
    media?.prepend(iconWrapper);
  }

  if (media) row.prepend(media);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
