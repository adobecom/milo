import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

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

  const heading = foreground?.querySelector(':is(h1, h2, h3, h4, h5, h6)');
  const body = heading?.nextElementSibling;
  if (heading && body && !body.querySelector('a:only-child')) {
    const textContent = createTag('div', { class: 'text-content' });
    heading.before(textContent);
    textContent.append(heading, body);
  }

  if (media) row.prepend(media);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
